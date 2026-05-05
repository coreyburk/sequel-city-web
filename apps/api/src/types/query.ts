import type { SqlSafetyValidationResult } from "./sqlSafety";

export interface QueryExecutionRequest {
  sql: string;
}

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

export interface RawQueryRow {
  [columnName: string]: unknown;
}

export interface NormalizedQueryRowValues {
  [columnName: string]: string | number | boolean | null;
}

export interface NormalizedQueryRowDisplayValues {
  [columnName: string]: string;
}

export interface QueryRow {
  values: NormalizedQueryRowValues;
  displayValues: NormalizedQueryRowDisplayValues;
}

export interface QueryExecutionSuccessData {
  columns: QueryColumn[];
  rows: QueryRow[];
  rowCount: number;
}

export interface QueryExecutionSuccessResponse {
  success: true;
  data: QueryExecutionSuccessData;
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
