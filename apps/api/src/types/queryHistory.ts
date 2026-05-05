export type QueryHistoryOutcome = "success" | "blocked" | "failed";

export interface QueryHistoryRecord {
  id: number;
  timestamp: string;
  queryText: string;
  outcome: QueryHistoryOutcome;
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
