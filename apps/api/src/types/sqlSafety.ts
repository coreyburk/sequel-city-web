export type SqlSafetyViolationCode =
  | "EMPTY_SQL"
  | "MULTIPLE_STATEMENTS"
  | "DISALLOWED_STATEMENT"
  | "NON_SELECT_STATEMENT"
  | "INVALID_CTE";

export type SqlStatementType =
  | "SELECT"
  | "WITH"
  | "INSERT"
  | "UPDATE"
  | "DELETE"
  | "DROP"
  | "ALTER"
  | "CREATE"
  | "TRUNCATE"
  | "MERGE"
  | "EXEC"
  | "EXECUTE"
  | "GRANT"
  | "REVOKE"
  | "DENY"
  | "BACKUP"
  | "RESTORE"
  | "USE"
  | "UNKNOWN";

export interface SqlSafetyViolation {
  code: SqlSafetyViolationCode;
  message: string;
  token?: string;
}

export interface SqlSafetyValidationResult {
  isAllowed: boolean;
  normalizedStatementType: SqlStatementType;
  violations: SqlSafetyViolation[];
  message: string;
}
