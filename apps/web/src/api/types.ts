export interface HealthFullResponse {
  success: true;
  data: {
    api: "ok";
    database: {
      status: "ok" | "failed";
      isConnected: boolean;
      databaseName: string | null;
      serverName: string | null;
      message: string;
    };
    schema: {
      status: "ok" | "failed";
      tableCount: number;
      relationshipCount: number;
      message: string;
    };
  };
}

export interface ApiFailureResponse {
  success: false;
  message: string;
}

export interface SchemaColumn {
  columnName: string;
  ordinal: number;
  dataType: string;
  isNullable: boolean;
  maxLength: number | null;
  numericPrecision: number | null;
  numericScale: number | null;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
}

export interface SchemaTable {
  schemaName: string;
  tableName: string;
  fullName: string;
  columns: SchemaColumn[];
  primaryKey: {
    name: string;
    columns: string[];
  } | null;
}

export interface SchemaRelationship {
  constraintName: string;
  sourceSchema: string;
  sourceTable: string;
  sourceColumn: string;
  targetSchema: string;
  targetTable: string;
  targetColumn: string;
}

export interface SchemaResponse {
  success: true;
  data: {
    tables: SchemaTable[];
    relationships: SchemaRelationship[];
  };
}

export type SchemaApiResponse = SchemaResponse | ApiFailureResponse;

export type NormalizedColumnDataType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "null"
  | "unknown";

export interface QueryColumn {
  name: string;
  ordinal: number;
  dataType: NormalizedColumnDataType;
}

export interface QueryRow {
  values: Record<string, string | number | boolean | null>;
  displayValues: Record<string, string>;
}

export interface SqlSafetyViolation {
  code: string;
  message: string;
  token?: string;
}

export interface SqlSafetyValidationResult {
  isAllowed: boolean;
  normalizedStatementType: string;
  violations: SqlSafetyViolation[];
  message: string;
}

export interface QueryExecutionSuccessResponse {
  success: true;
  data: {
    columns: QueryColumn[];
    rows: QueryRow[];
    rowCount: number;
  };
  safety: SqlSafetyValidationResult;
  executionTimeMs: number;
  message: string;
}

export interface QueryExecutionFailureResponse {
  success: false;
  safety: SqlSafetyValidationResult;
  executionTimeMs: number;
  message: string;
}

export type QueryExecutionResponse =
  | QueryExecutionSuccessResponse
  | QueryExecutionFailureResponse;

export interface QueryHistoryRecord {
  id: number;
  timestamp: string;
  queryText: string;
  outcome: "success" | "blocked" | "failed";
  rowCount: number | null;
  executionTimeMs: number | null;
  errorMessage: string | null;
}

export interface QueryHistoryResponse {
  success: true;
  data: {
    records: QueryHistoryRecord[];
  };
}

export type QueryHistoryApiResponse = QueryHistoryResponse | ApiFailureResponse;

export interface CaseVerificationSuccessResponse {
  success: true;
  data: {
    suspect: string;
    verdict: string;
  };
  message: string;
}

export type CaseVerificationApiResponse =
  | CaseVerificationSuccessResponse
  | ApiFailureResponse;
