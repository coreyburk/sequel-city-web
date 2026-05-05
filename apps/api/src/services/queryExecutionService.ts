import type {
  QueryExecutionResponse,
  RawQueryRow
} from "../types/query";
import { addQueryHistoryRecord } from "./queryHistoryService.ts";
import { normalizeQueryResult } from "./queryResultNormalizer.ts";
import { validateSqlSafety } from "./sqlSafetyService.ts";

type QueryExecutor = (sql: string) => Promise<RawQueryRow[]>;

export async function executeSafeQuery(
  sql: string,
  executeQuery: QueryExecutor = runQuery
): Promise<QueryExecutionResponse> {
  const startedAt = Date.now();
  const safety = validateSqlSafety(sql);

  if (!safety.isAllowed) {
    const executionTimeMs = Date.now() - startedAt;
    const response: QueryExecutionResponse = {
      success: false,
      safety,
      executionTimeMs,
      message: `Query blocked: ${safety.message}`
    };

    addQueryHistoryRecord({
      queryText: sql,
      outcome: "blocked",
      rowCount: null,
      executionTimeMs,
      errorMessage: safety.message
    });

    return response;
  }

  try {
    const rawRows = await executeQuery(sql);
    const normalizedResult = normalizeQueryResult(rawRows);
    const executionTimeMs = Date.now() - startedAt;

    const response: QueryExecutionResponse = {
      success: true,
      data: {
        columns: normalizedResult.columns,
        rows: normalizedResult.rows,
        rowCount: normalizedResult.rowCount
      },
      safety,
      executionTimeMs,
      message: "Query executed successfully."
    };

    addQueryHistoryRecord({
      queryText: sql,
      outcome: "success",
      rowCount: normalizedResult.rowCount,
      executionTimeMs,
      errorMessage: null
    });

    return response;
  } catch (error) {
    const executionTimeMs = Date.now() - startedAt;
    const response: QueryExecutionResponse = {
      success: false,
      safety,
      executionTimeMs,
      message: "Query execution failed. Verify the SQL and database connection."
    };

    addQueryHistoryRecord({
      queryText: sql,
      outcome: "failed",
      rowCount: null,
      executionTimeMs,
      errorMessage:
        error instanceof Error ? error.message : response.message
    });

    return response;
  }
}

async function runQuery(sql: string): Promise<RawQueryRow[]> {
  const { getSqlServerPool } = await import("../db/sqlServerPool.ts");
  const pool = await getSqlServerPool();
  const result = await pool.request().query<RawQueryRow>(sql);
  return result.recordset;
}
