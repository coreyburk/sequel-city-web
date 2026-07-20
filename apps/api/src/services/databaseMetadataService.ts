import type { IRecordSet } from "mssql";
import type {
  BackendDiagnosticResponse,
  ColumnSummaryResponse,
  DatabaseHealthResponse,
  TableSummaryResponse
} from "../types/database";
import {
  ensureDatabaseBootstrap,
  type DatabaseBootstrapResult
} from "./databaseBootstrapService.ts";
import { getSchemaMetadata } from "./schemaService.ts";
import type { SchemaFailureResponse, SchemaResponse } from "../types/schema.ts";

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

type DatabaseHealthChecker = () => Promise<DatabaseHealthResponse>;
type SchemaMetadataChecker = () => Promise<SchemaResponse | SchemaFailureResponse>;
type DatabaseBootstrapChecker = () => Promise<DatabaseBootstrapResult>;

export async function checkDatabaseHealth(): Promise<DatabaseHealthResponse> {
  const checkedAtUtc = new Date().toISOString();

  try {
    const { getSqlServerPool } = await import("../db/sqlServerPool.ts");
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

export async function getBackendDiagnostics(
  checkHealth: DatabaseHealthChecker = checkDatabaseHealth,
  loadSchemaMetadata: SchemaMetadataChecker = getSchemaMetadata,
  checkBootstrap: DatabaseBootstrapChecker = ensureDatabaseBootstrap
): Promise<BackendDiagnosticResponse> {
  const databaseHealth = await checkHealth();
  const bootstrapResult = await checkBootstrap();

  const databaseStatus = {
    status: databaseHealth.isConnected ? "ok" : "failed",
    isConnected: databaseHealth.isConnected,
    databaseName: databaseHealth.databaseName,
    serverName: databaseHealth.serverName,
    message: databaseHealth.isConnected
      ? databaseHealth.message
      : "Database connection failed."
  } as const;

  try {
    const schemaResponse = await loadSchemaMetadata();

    if (!schemaResponse.success) {
      return {
        success: true,
        data: {
          api: "ok",
          database: databaseStatus,
          bootstrap: mapBootstrapStatus(bootstrapResult),
          schema: {
            status: "failed",
            tableCount: 0,
            relationshipCount: 0,
            message: "Schema metadata unavailable."
          }
        }
      };
    }

    return {
      success: true,
      data: {
        api: "ok",
        database: databaseStatus,
        bootstrap: mapBootstrapStatus(bootstrapResult),
        schema: {
          status: "ok",
          tableCount: schemaResponse.data.tables.length,
          relationshipCount: schemaResponse.data.relationships.length,
          message: "Schema metadata loaded successfully."
        }
      }
    };
  } catch {
    return {
      success: true,
      data: {
        api: "ok",
        database: databaseStatus,
        bootstrap: mapBootstrapStatus(bootstrapResult),
        schema: {
          status: "failed",
          tableCount: 0,
          relationshipCount: 0,
          message: "Schema metadata unavailable."
        }
      }
    };
  }
}

export async function getSchemaTables(): Promise<TableSummaryResponse[]> {
  const { getSqlServerPool } = await import("../db/sqlServerPool.ts");
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

function mapBootstrapStatus(bootstrapResult: DatabaseBootstrapResult) {
  return {
    mode: bootstrapResult.mode,
    status: bootstrapResult.isReady ? "ready" : "degraded",
    identity: {
      status: bootstrapResult.identity.status,
      message: bootstrapResult.identity.message,
      missingFacts: bootstrapResult.identity.missingFacts
    },
    migrated: bootstrapResult.migrated,
    usedBootstrapCredentials: bootstrapResult.usedBootstrapCredentials,
    canApplyInApp: bootstrapResult.canApplyInApp,
    applyActionMessage: bootstrapResult.applyActionMessage,
    message: bootstrapResult.message,
    hasSchemaVersionTable: bootstrapResult.hasSchemaVersionTable,
    expectedMigrationKey: bootstrapResult.expectedMigrationKey,
    currentMigrationKey: bootstrapResult.currentMigrationKey,
    pendingMigrationKeys: bootstrapResult.pendingMigrationKeys
  } as const;
}
