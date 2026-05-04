import type { IRecordSet } from "mssql";
import { getSqlServerPool } from "../db/sqlServerPool";
import type {
  ColumnSummaryResponse,
  DatabaseHealthResponse,
  TableSummaryResponse
} from "../types/database";

interface DatabaseHealthRow {
  databaseName: string;
  serverName: string;
}

interface SchemaColumnRow {
  tableName: string;
  columnName: string;
  dataType: string;
  isNullable: "YES" | "NO";
}

export async function checkDatabaseHealth(): Promise<DatabaseHealthResponse> {
  const checkedAtUtc = new Date().toISOString();

  try {
    const pool = await getSqlServerPool();
    const result = await pool.request().query<DatabaseHealthRow>(`
      SELECT
        DB_NAME() AS databaseName,
        @@SERVERNAME AS serverName
    `);

    const record = result.recordset[0];

    return {
      isConnected: true,
      databaseName: record?.databaseName ?? null,
      serverName: record?.serverName ?? null,
      message: "Database connection successful.",
      checkedAtUtc
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Database connection failed.";

    return {
      isConnected: false,
      databaseName: null,
      serverName: null,
      message,
      checkedAtUtc
    };
  }
}

export async function getSchemaTables(): Promise<TableSummaryResponse[]> {
  const pool = await getSqlServerPool();
  const result = await pool.request().query<SchemaColumnRow>(`
    SELECT
      TABLE_NAME AS tableName,
      COLUMN_NAME AS columnName,
      DATA_TYPE AS dataType,
      IS_NULLABLE AS isNullable
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_CATALOG = DB_NAME()
      AND TABLE_SCHEMA = 'dbo'
    ORDER BY TABLE_NAME, ORDINAL_POSITION
  `);

  return mapSchemaRowsToTables(result.recordset);
}

function mapSchemaRowsToTables(
  rows: IRecordSet<SchemaColumnRow>
): TableSummaryResponse[] {
  const tableMap = new Map<string, ColumnSummaryResponse[]>();

  for (const row of rows) {
    const existingColumns = tableMap.get(row.tableName) ?? [];
    existingColumns.push({
      columnName: row.columnName,
      dataType: row.dataType,
      isNullable: row.isNullable === "YES"
    });
    tableMap.set(row.tableName, existingColumns);
  }

  return Array.from(tableMap.entries()).map(([tableName, columns]) => ({
    tableName,
    columns
  }));
}
