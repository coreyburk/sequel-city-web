import type {
  QueryColumn,
  QueryExecutionResponse,
  QueryRow
} from "../types/query";
import { validateSqlSafety } from "./sqlSafetyService.ts";

interface QueryColumnMetadata {
  name?: string;
  type?: {
    name?: string;
  };
}

type QueryRecordset = QueryRow[] & {
  columns?: Record<string, QueryColumnMetadata>;
};

export async function executeSafeQuery(
  sql: string
): Promise<QueryExecutionResponse> {
  const startedAt = Date.now();
  const safety = validateSqlSafety(sql);

  if (!safety.isAllowed) {
    return {
      isExecuted: false,
      safety,
      columns: [],
      rows: [],
      rowCount: 0,
      executionTimeMs: Date.now() - startedAt,
      message: `Query blocked: ${safety.message}`
    };
  }

  try {
    const { getSqlServerPool } = await import("../db/sqlServerPool.ts");
    const pool = await getSqlServerPool();
    const result = await pool.request().query<QueryRow>(sql);
    const recordset = result.recordset as QueryRecordset;
    const rows = recordset.map((row) => ({ ...row }));
    const columns = mapColumns(recordset, rows);

    return {
      isExecuted: true,
      safety,
      columns,
      rows,
      rowCount: rows.length,
      executionTimeMs: Date.now() - startedAt,
      message: "Query executed successfully."
    };
  } catch {
    return {
      isExecuted: false,
      safety,
      columns: [],
      rows: [],
      rowCount: 0,
      executionTimeMs: Date.now() - startedAt,
      message: "Query execution failed. Verify the SQL and database connection."
    };
  }
}

function mapColumns(recordset: QueryRecordset, rows: QueryRow[]): QueryColumn[] {
  const recordsetColumns = recordset.columns;

  if (recordsetColumns) {
    return Object.entries(recordsetColumns).map(([columnName, column]) => ({
      name: column.name ?? columnName,
      dataType: column.type?.name
    }));
  }

  const firstRow = rows[0];

  if (!firstRow) {
    return [];
  }

  return Object.keys(firstRow).map((columnName) => ({
    name: columnName
  }));
}
