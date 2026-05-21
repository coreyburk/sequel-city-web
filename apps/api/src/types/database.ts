export interface DatabaseHealthResponse {
  isConnected: boolean;
  databaseName: string | null;
  serverName: string | null;
  message: string;
  checkedAtUtc: string;
}

export interface BackendDiagnosticDatabaseStatus {
  status: "ok" | "failed";
  isConnected: boolean;
  databaseName: string | null;
  serverName: string | null;
  message: string;
}

export interface BackendDiagnosticSchemaStatus {
  status: "ok" | "failed";
  tableCount: number;
  relationshipCount: number;
  message: string;
}

export interface BackendDiagnosticBootstrapStatus {
  mode: "verify" | "apply" | "enforce";
  status: "ready" | "degraded";
  migrated: boolean;
  usedBootstrapCredentials: boolean;
  message: string;
  hasSchemaVersionTable: boolean;
  expectedMigrationKey: string | null;
  currentMigrationKey: string | null;
  pendingMigrationKeys: string[];
}

export interface BackendDiagnosticResponse {
  success: true;
  data: {
    api: "ok";
    database: BackendDiagnosticDatabaseStatus;
    schema: BackendDiagnosticSchemaStatus;
    bootstrap: BackendDiagnosticBootstrapStatus;
  };
}

export interface ColumnSummaryResponse {
  columnName: string;
  dataType: string;
  isNullable: boolean;
}

export interface TableSummaryResponse {
  tableName: string;
  columns: ColumnSummaryResponse[];
}
