import type { SqlSafetyValidationResult } from "./sqlSafety";
import type { Case001GatedMilestoneEvaluationResult } from "../services/case001GatedMilestoneEvaluationService.ts";

export interface QueryExecutionRequest {
  sql: string;
  caseMilestoneEvaluation?: QueryExecutionCaseMilestoneEvaluationRequest;
}

export interface QueryExecutionCaseMilestoneEvaluationRequest {
  caseId: string;
  milestoneId: string;
  isSkeletonGateEnabled: boolean;
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
  isTruncated?: boolean;
  columns: QueryColumn[];
  rows: QueryRow[];
  rowCount: number;
}

export interface QueryExecutionSuccessResponse {
  feedback?: QueryAttemptFeedback;
  success: true;
  data: QueryExecutionSuccessData;
  caseMilestoneEvaluation?: Case001GatedMilestoneEvaluationResult;
  safety: SqlSafetyValidationResult;
  executionTimeMs: number;
  message: string;
}

export interface QueryExecutionFailureResponse {
  feedback?: QueryAttemptFeedback;
  success: false;
  safety: SqlSafetyValidationResult;
  executionTimeMs: number;
  message: string;
}

export type QueryExecutionResponse =
  | QueryExecutionSuccessResponse
  | QueryExecutionFailureResponse;

export interface QueryAttemptFeedback {
  category: "blocked" | "invalid-column" | "invalid-table" | "syntax" | "ambiguous-column" | "conversion" | "timeout" | "unavailable" | "execution-error" | "no-matches" | "results" | "narrow-results" | "unrelated-results" | "evidence-ready" | "partial-collection" | "task-proved" | "review-complete" | "investigation-complete" | "progress-not-saved" | "replayed";
  execution: "blocked" | "failed" | "succeeded" | "not-repeated";
  evidence: "unchanged" | "ready-to-log" | "partial" | "proved" | "complete" | "not-saved";
  severity: "info" | "success" | "warning" | "error";
  title: string;
  explanation: string;
  nextAction: string;
  rowCount?: number;
  countIsLimited?: boolean;
}