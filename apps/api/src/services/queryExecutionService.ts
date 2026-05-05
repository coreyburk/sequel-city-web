import type {
  QueryExecutionResponse,
  RawQueryRow
} from "../types/query";
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
    return {
      success: false,
      safety,
      executionTimeMs: Date.now() - startedAt,
      message: `Query blocked: ${safety.message}`
    };
  }

  try {
    const rawRows = await executeQuery(sql);
    const normalizedResult = normalizeQueryResult(rawRows);

    return {
      success: true,
      data: {
        columns: normalizedResult.columns,
        rows: normalizedResult.rows,
        rowCount: normalizedResult.rowCount
      },
      safety,
      executionTimeMs: Date.now() - startedAt,
      message: "Query executed successfully."
    };
  } catch {
    return {
      success: false,
      safety,
      executionTimeMs: Date.now() - startedAt,
      message: "Query execution failed. Verify the SQL and database connection."
    };
  }
}

async function runQuery(sql: string): Promise<RawQueryRow[]> {
  const { getSqlServerPool } = await import("../db/sqlServerPool.ts");
  const pool = await getSqlServerPool();
  const result = await pool.request().query<RawQueryRow>(sql);
  return result.recordset;
}
