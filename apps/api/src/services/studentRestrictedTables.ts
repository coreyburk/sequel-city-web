interface RestrictedTableReference {
  tableName: string;
}

const STUDENT_RESTRICTED_TABLE_NAMES = new Set(["caseanswerkey", "solution"]);
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

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];

    if (
      token.type !== "identifier" ||
      !TABLE_REFERENCE_PRECEDING_KEYWORDS.has(token.upper)
    ) {
      continue;
    }

    const tableReference = readNextTableReference(tokens, index + 1);

    if (tableReference === null) {
      continue;
    }

    const tableName = tableReference.at(-1) ?? "";

    if (isStudentRestrictedTable(tableName)) {
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
  let mode: "normal" | "singleQuote" | "doubleQuote" | "lineComment" | "blockComment" =
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

    if (mode === "doubleQuote") {
      if (char === "\"") {
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
      mode = "doubleQuote";
      index += 1;
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
