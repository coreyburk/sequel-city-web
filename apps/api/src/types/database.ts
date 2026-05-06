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

export interface BackendDiagnosticResponse {
  success: true;
  data: {
    api: "ok";
    database: BackendDiagnosticDatabaseStatus;
    schema: BackendDiagnosticSchemaStatus;
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
