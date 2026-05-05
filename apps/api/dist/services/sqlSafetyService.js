"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSqlSafety = validateSqlSafety;
const BLOCKED_STATEMENT_TYPES = new Set([
    "INSERT",
    "UPDATE",
    "DELETE",
    "DROP",
    "ALTER",
    "CREATE",
    "TRUNCATE",
    "MERGE",
    "EXEC",
    "EXECUTE",
    "GRANT",
    "REVOKE",
    "DENY",
    "BACKUP",
    "RESTORE",
    "USE"
]);
const STATEMENT_TYPE_BY_TOKEN = {
    SELECT: "SELECT",
    WITH: "WITH",
    INSERT: "INSERT",
    UPDATE: "UPDATE",
    DELETE: "DELETE",
    DROP: "DROP",
    ALTER: "ALTER",
    CREATE: "CREATE",
    TRUNCATE: "TRUNCATE",
    MERGE: "MERGE",
    EXEC: "EXEC",
    EXECUTE: "EXECUTE",
    GRANT: "GRANT",
    REVOKE: "REVOKE",
    DENY: "DENY",
    BACKUP: "BACKUP",
    RESTORE: "RESTORE",
    USE: "USE"
};
function validateSqlSafety(sqlText) {
    const trimmedSql = sqlText.trim();
    if (trimmedSql.length === 0) {
        return createBlockedResult("UNKNOWN", [
            {
                code: "EMPTY_SQL",
                message: "SQL must not be empty."
            }
        ]);
    }
    const normalized = normalizeSqlForAnalysis(sqlText);
    const executableStatements = splitExecutableStatements(normalized.upper);
    if (executableStatements.length === 0) {
        return createBlockedResult("UNKNOWN", [
            {
                code: "EMPTY_SQL",
                message: "SQL must not be empty."
            }
        ]);
    }
    if (executableStatements.length > 1) {
        return createBlockedResult("UNKNOWN", [
            {
                code: "MULTIPLE_STATEMENTS",
                message: "Only a single SELECT statement is allowed."
            }
        ]);
    }
    const statementText = executableStatements[0];
    const statementType = detectStatementType(statementText);
    if (statementType === "SELECT") {
        return createAllowedResult("SELECT");
    }
    if (statementType === "WITH") {
        const cteResultType = resolveWithStatementType(statementText);
        if (cteResultType === "SELECT") {
            return createAllowedResult("SELECT");
        }
        if (BLOCKED_STATEMENT_TYPES.has(cteResultType)) {
            return createBlockedResult(cteResultType, [
                {
                    code: "DISALLOWED_STATEMENT",
                    message: `WITH queries must resolve to SELECT, not ${cteResultType}.`,
                    token: cteResultType
                }
            ]);
        }
        return createBlockedResult("WITH", [
            {
                code: "INVALID_CTE",
                message: "WITH queries must resolve to a top-level SELECT statement.",
                token: "WITH"
            }
        ]);
    }
    if (BLOCKED_STATEMENT_TYPES.has(statementType)) {
        return createBlockedResult(statementType, [
            {
                code: "DISALLOWED_STATEMENT",
                message: `${statementType} statements are not allowed.`,
                token: statementType
            }
        ]);
    }
    return createBlockedResult(statementType, [
        {
            code: "NON_SELECT_STATEMENT",
            message: "Only SELECT statements are allowed.",
            token: getFirstToken(statementText) ?? undefined
        }
    ]);
}
function createAllowedResult(normalizedStatementType) {
    return {
        isAllowed: true,
        normalizedStatementType,
        violations: [],
        message: "SQL statement is allowed."
    };
}
function createBlockedResult(normalizedStatementType, violations) {
    return {
        isAllowed: false,
        normalizedStatementType,
        violations,
        message: violations[0]?.message ?? "SQL statement is not allowed."
    };
}
function normalizeSqlForAnalysis(sqlText) {
    const output = [];
    let index = 0;
    let mode = "normal";
    while (index < sqlText.length) {
        const char = sqlText[index];
        const nextChar = sqlText[index + 1];
        if (mode === "normal") {
            if (char === "-" && nextChar === "-") {
                output.push(" ", " ");
                index += 2;
                while (index < sqlText.length && sqlText[index] !== "\n") {
                    output.push(sqlText[index] === "\r" ? "\r" : " ");
                    index += 1;
                }
                continue;
            }
            if (char === "/" && nextChar === "*") {
                output.push(" ", " ");
                index += 2;
                while (index < sqlText.length) {
                    const blockChar = sqlText[index];
                    const blockNextChar = sqlText[index + 1];
                    if (blockChar === "*" && blockNextChar === "/") {
                        output.push(" ", " ");
                        index += 2;
                        break;
                    }
                    output.push(blockChar === "\n" || blockChar === "\r" ? blockChar : " ");
                    index += 1;
                }
                continue;
            }
            if (char === "'") {
                output.push(char);
                mode = "singleQuote";
                index += 1;
                continue;
            }
            if (char === "\"") {
                output.push(char);
                mode = "doubleQuote";
                index += 1;
                continue;
            }
            if (char === "[") {
                output.push(char);
                mode = "bracketIdentifier";
                index += 1;
                continue;
            }
            output.push(char);
            index += 1;
            continue;
        }
        if (mode === "singleQuote") {
            if (char === "'" && nextChar === "'") {
                output.push(" ", " ");
                index += 2;
                continue;
            }
            if (char === "'") {
                output.push(char);
                mode = "normal";
                index += 1;
                continue;
            }
            output.push(char === "\n" || char === "\r" ? char : " ");
            index += 1;
            continue;
        }
        if (mode === "doubleQuote") {
            if (char === "\"") {
                output.push(char);
                mode = "normal";
                index += 1;
                continue;
            }
            output.push(char === "\n" || char === "\r" ? char : " ");
            index += 1;
            continue;
        }
        if (char === "]") {
            output.push(char);
            mode = "normal";
            index += 1;
            continue;
        }
        output.push(char === "\n" || char === "\r" ? char : " ");
        index += 1;
    }
    const sanitized = output.join("");
    return {
        sanitized,
        upper: sanitized.toUpperCase()
    };
}
function splitExecutableStatements(sanitizedSql) {
    const statements = [];
    let startIndex = 0;
    for (let index = 0; index < sanitizedSql.length; index += 1) {
        if (sanitizedSql[index] !== ";") {
            continue;
        }
        const segment = sanitizedSql.slice(startIndex, index).trim();
        if (segment.length > 0) {
            statements.push(segment);
        }
        startIndex = index + 1;
    }
    const trailingSegment = sanitizedSql.slice(startIndex).trim();
    if (trailingSegment.length > 0) {
        statements.push(trailingSegment);
    }
    return statements;
}
function detectStatementType(statementText) {
    const firstToken = getFirstToken(statementText);
    if (firstToken === null) {
        return "UNKNOWN";
    }
    return STATEMENT_TYPE_BY_TOKEN[firstToken] ?? "UNKNOWN";
}
function getFirstToken(statementText) {
    const match = statementText.match(/\b[A-Z]+\b/);
    return match?.[0] ?? null;
}
function resolveWithStatementType(statementText) {
    let parenthesisDepth = 0;
    for (let index = 0; index < statementText.length; index += 1) {
        const char = statementText[index];
        if (char === "(") {
            parenthesisDepth += 1;
            continue;
        }
        if (char === ")") {
            parenthesisDepth = Math.max(parenthesisDepth - 1, 0);
            continue;
        }
        if (parenthesisDepth !== 0 || !isWordStart(statementText, index)) {
            continue;
        }
        const token = readWord(statementText, index);
        if (token === null) {
            continue;
        }
        if (token.value === "WITH") {
            index = token.endIndex - 1;
            continue;
        }
        if (token.value === "SELECT") {
            return "SELECT";
        }
        if (token.value in STATEMENT_TYPE_BY_TOKEN) {
            return STATEMENT_TYPE_BY_TOKEN[token.value];
        }
        index = token.endIndex - 1;
    }
    return "UNKNOWN";
}
function isWordStart(text, index) {
    const currentChar = text[index];
    const previousChar = index > 0 ? text[index - 1] : " ";
    return /[A-Z]/.test(currentChar) && !/[A-Z0-9_]/.test(previousChar);
}
function readWord(text, startIndex) {
    if (!/[A-Z]/.test(text[startIndex] ?? "")) {
        return null;
    }
    let endIndex = startIndex + 1;
    while (/[A-Z0-9_]/.test(text[endIndex] ?? "")) {
        endIndex += 1;
    }
    return {
        value: text.slice(startIndex, endIndex),
        endIndex
    };
}
