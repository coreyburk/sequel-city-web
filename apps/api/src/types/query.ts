import type { SqlSafetyValidationResult } from "./sqlSafety";

export interface QueryExecutionRequest {
  sql: string;
}

export interface QueryColumn {
  name: string;
  dataType?: string;
}

export interface QueryRow {
  [columnName: string]: unknown;
}

export interface QueryExecutionResponse {
  isExecuted: boolean;
  safety: SqlSafetyValidationResult;
  columns: QueryColumn[];
  rows: QueryRow[];
  rowCount: number;
  executionTimeMs: number;
  message: string;
}
