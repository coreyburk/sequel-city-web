interface RestrictedTableReference {
  tableName: string;
}

const STUDENT_RESTRICTED_TABLE_NAMES = new Set(["caseanswerkey", "solution", "appschemaversion", "casedefinition", "casestep", "casestepprerequisite", "locallearner", "learnerattempt", "attemptworkspace", "attemptaction", "attemptstepevidence"]);
export const STUDENT_EVIDENCE_TABLES = ["CrimeType", "CrimeSceneReport", "DriversLicense", "PersonsOfInterest", "EventSchedule", "EventRegistration", "FitNFlabClub", "FitNFlabClubCheckIn", "Employment", "InterviewLog"] as const;
export function isStudentEvidenceTable(table: string, schema = "dbo"): boolean {
  return schema.toLowerCase() === "dbo" && STUDENT_EVIDENCE_TABLES.some(name => name.toLowerCase() === table.toLowerCase());
}

export function containsInternalSqlAccess(sqlText: string): boolean {
  const tokens = tokenizeSqlForTableReferences(sqlText);
  const forbiddenFunctions = new Set(["OBJECT_ID", "OBJECT_NAME", "OBJECT_DEFINITION", "COL_NAME", "COL_LENGTH", "SCHEMA_ID", "SCHEMA_NAME", "SUSER_ID", "SUSER_NAME", "SUSER_SNAME", "USER_NAME", "DB_NAME", "DB_ID", "SERVERPROPERTY", "DATABASEPROPERTYEX", "HAS_PERMS_BY_NAME", "PERMISSIONS", "OPENROWSET", "OPENQUERY", "OPENDATASOURCE", "IDENT_CURRENT"]);
  return tokens.some((token, index) => token.type === "identifier" &&
    ((["APP", "SYS", "INFORMATION_SCHEMA", "MASTER", "MSDB", "TEMPDB"].includes(token.upper) && tokens[index + 1]?.value === ".") ||
      (forbiddenFunctions.has(token.upper) && tokens[index + 1]?.value === "(")));
}
const TABLE_REFERENCE_PRECEDING_KEYWORDS = new Set([
  "FROM",
  "JOIN",
  "APPLY",
  "UPDATE",
  "INTO",
  "MERGE"
]);

const TABLE_REFERENCE_BOUNDARY_KEYWORDS = new Set([
  "WHERE",
  "GROUP",
  "ORDER",
  "HAVING",
  "UNION",
  "EXCEPT",
  "INTERSECT",
  "ON",
  "LEFT",
  "RIGHT",
  "FULL",
  "INNER",
  "OUTER",
  "CROSS",
  "JOIN",
  "APPLY",
  "VALUES",
  "SET",
  "RETURNING"
]);

type SqlToken =
  | { type: "identifier"; value: string; upper: string }
  | { type: "punctuation"; value: "." | "," | "(" | ")" };

export function getStudentRestrictedTableNames(): string[] {
  return Array.from(STUDENT_RESTRICTED_TABLE_NAMES).sort();
}

export function isStudentRestrictedTable(tableName: string): boolean {
  return STUDENT_RESTRICTED_TABLE_NAMES.has(normalizeIdentifier(tableName));
}

export function findStudentRestrictedTableReferences(
  sqlText: string
): RestrictedTableReference[] {
  const tokens = tokenizeSqlForTableReferences(sqlText);
  const references = new Map<string, RestrictedTableReference>();
  const cteNames = new Set<string>();
  if (tokens[0]?.value.toUpperCase() === "WITH") {
    let cursor = 1;
    while (tokens[cursor]?.type === "identifier") {
      const name = tokens[cursor].value.toUpperCase();
      cursor++;
      const skipParentheses = () => {
        let depth = 0;
        do {
          if (tokens[cursor]?.value === "(") depth++;
          if (tokens[cursor]?.value === ")") depth--;
          cursor++;
        } while (cursor < tokens.length && depth > 0);
      };
      if (tokens[cursor]?.value === "(") skipParentheses();
      if (tokens[cursor]?.value.toUpperCase() !== "AS" || tokens[cursor + 1]?.value !== "(") break;
      cteNames.add(name);
      cursor++;
      skipParentheses();
      if (tokens[cursor]?.value !== ",") break;
      cursor++;
    }
  }
  let depth = 0;
  const fromAtDepth = new Map<number, boolean>();

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (token.value === "(") { depth++; continue; }
    if (token.value === ")") { fromAtDepth.delete(depth); depth--; continue; }
    if (token.type === "identifier" && ["WHERE", "GROUP", "ORDER", "HAVING", "UNION", "EXCEPT", "INTERSECT"].includes(token.upper)) fromAtDepth.set(depth, false);
    if (token.type === "identifier" && token.upper === "FROM") fromAtDepth.set(depth, true);

    if (
      !(token.type === "identifier" && TABLE_REFERENCE_PRECEDING_KEYWORDS.has(token.upper)) &&
      !(token.value === "," && fromAtDepth.get(depth))
    ) {
      continue;
    }

    const tableReference = readNextTableReference(tokens, index + 1);

    if (tableReference === null) {
      continue;
    }

    const tableName = tableReference.at(-1) ?? "";

    const isCte = tableReference.length === 1 && cteNames.has(tableName.toUpperCase());
    if (!isCte && (tableReference.length > 2 || !isStudentEvidenceTable(tableName, tableReference.length === 2 ? tableReference[0] : "dbo"))) {
      references.set(normalizeIdentifier(tableName), {
        tableName
      });
    }
  }

  return Array.from(references.values()).sort((left, right) =>
    left.tableName.localeCompare(right.tableName)
  );
}

export function createRestrictedTableMessage(
  references: RestrictedTableReference[]
): string {
  const names = references.map((reference) => reference.tableName).join(", ");
  return `This table is not available in Student Mode: ${names}. Use the investigation evidence tables instead.`;
}

function readNextTableReference(
  tokens: SqlToken[],
  startIndex: number
): string[] | null {
  const parts: string[] = [];
  let index = startIndex;
  let sawIdentifier = false;

  while (index < tokens.length) {
    const token = tokens[index];

    if (token.type === "punctuation" && token.value === "(") {
      return null;
    }

    if (token.type === "punctuation" && token.value === ".") {
      index += 1;
      continue;
    }

    if (token.type === "punctuation") {
      return sawIdentifier ? parts : null;
    }

    if (TABLE_REFERENCE_BOUNDARY_KEYWORDS.has(token.upper)) {
      return sawIdentifier ? parts : null;
    }

    parts.push(token.value);
    sawIdentifier = true;

    const nextToken = tokens[index + 1];
    if (nextToken?.type === "punctuation" && nextToken.value === ".") {
      index += 2;
      continue;
    }

    return parts;
  }

  return sawIdentifier ? parts : null;
}

function tokenizeSqlForTableReferences(sqlText: string): SqlToken[] {
  const tokens: SqlToken[] = [];
  let index = 0;
  let mode: "normal" | "singleQuote" | "lineComment" | "blockComment" =
    "normal";

  while (index < sqlText.length) {
    const char = sqlText[index];
    const nextChar = sqlText[index + 1];

    if (mode === "lineComment") {
      if (char === "\n" || char === "\r") {
        mode = "normal";
      }
      index += 1;
      continue;
    }

    if (mode === "blockComment") {
      if (char === "*" && nextChar === "/") {
        mode = "normal";
        index += 2;
        continue;
      }
      index += 1;
      continue;
    }

    if (mode === "singleQuote") {
      if (char === "'" && nextChar === "'") {
        index += 2;
        continue;
      }

      if (char === "'") {
        mode = "normal";
      }

      index += 1;
      continue;
    }

    if (char === "-" && nextChar === "-") {
      mode = "lineComment";
      index += 2;
      continue;
    }

    if (char === "/" && nextChar === "*") {
      mode = "blockComment";
      index += 2;
      continue;
    }

    if (char === "'") {
      mode = "singleQuote";
      index += 1;
      continue;
    }

    if (char === "\"") {
      let value = "";
      index += 1;
      while (index < sqlText.length) {
        if (sqlText[index] === '"' && sqlText[index + 1] === '"') { value += '"'; index += 2; continue; }
        if (sqlText[index] === '"') { index += 1; break; }
        value += sqlText[index++];
      }
      tokens.push(createIdentifierToken(value));
      continue;
    }

    if (char === "[") {
      const bracketIdentifier = readBracketIdentifier(sqlText, index);
      if (bracketIdentifier !== null) {
        tokens.push(createIdentifierToken(bracketIdentifier.value));
        index = bracketIdentifier.endIndex;
        continue;
      }
    }

    if (/[A-Za-z_#]/.test(char)) {
      const word = readBareIdentifier(sqlText, index);
      tokens.push(createIdentifierToken(word.value));
      index = word.endIndex;
      continue;
    }

    if (char === "." || char === "," || char === "(" || char === ")") {
      tokens.push({ type: "punctuation", value: char });
    }

    index += 1;
  }

  return tokens;
}

function readBracketIdentifier(
  sqlText: string,
  startIndex: number
): { value: string; endIndex: number } | null {
  let value = "";
  let index = startIndex + 1;

  while (index < sqlText.length) {
    const char = sqlText[index];
    const nextChar = sqlText[index + 1];

    if (char === "]" && nextChar === "]") {
      value += "]";
      index += 2;
      continue;
    }

    if (char === "]") {
      return {
        value,
        endIndex: index + 1
      };
    }

    value += char;
    index += 1;
  }

  return null;
}

function readBareIdentifier(
  sqlText: string,
  startIndex: number
): { value: string; endIndex: number } {
  let endIndex = startIndex + 1;

  while (/[A-Za-z0-9_#$]/.test(sqlText[endIndex] ?? "")) {
    endIndex += 1;
  }

  return {
    value: sqlText.slice(startIndex, endIndex),
    endIndex
  };
}

function createIdentifierToken(value: string): SqlToken {
  return {
    type: "identifier",
    value,
    upper: value.toUpperCase()
  };
}

function normalizeIdentifier(value: string): string {
  return value.trim().toLowerCase();
}
