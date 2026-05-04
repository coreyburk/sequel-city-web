export interface DatabaseHealthResponse {
  isConnected: boolean;
  databaseName: string | null;
  serverName: string | null;
  message: string;
  checkedAtUtc: string;
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
