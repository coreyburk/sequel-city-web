export interface SchemaPrimaryKey {
  name: string;
  columns: string[];
}

export interface SchemaColumn {
  columnName: string;
  ordinal: number;
  dataType: string;
  isNullable: boolean;
  maxLength: number | null;
  numericPrecision: number | null;
  numericScale: number | null;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
}

export interface SchemaTable {
  schemaName: string;
  tableName: string;
  fullName: string;
  columns: SchemaColumn[];
  primaryKey: SchemaPrimaryKey | null;
}

export interface SchemaRelationship {
  constraintName: string;
  sourceSchema: string;
  sourceTable: string;
  sourceColumn: string;
  targetSchema: string;
  targetTable: string;
  targetColumn: string;
}

export interface SchemaData {
  tables: SchemaTable[];
  relationships: SchemaRelationship[];
}

export interface SchemaResponse {
  success: true;
  data: SchemaData;
}

export interface SchemaFailureResponse {
  success: false;
  message: string;
}
