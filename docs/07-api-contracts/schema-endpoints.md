# Schema Endpoints

The schema contract is database-backed and read-only. The frontend must render only what the backend returns.

## `GET /api/schema/tables`

Returns table, column, primary key, and relationship metadata for the current database.

### Response Codes

| Status | When returned |
|---|---|
| `200` | Schema metadata loaded successfully |
| `500` | Schema metadata load failed |

### Success Shape

| Field | Type | Notes |
|---|---|---|
| `success` | `true` | Always `true` on success |
| `data.tables` | `SchemaTable[]` | Stable table list sorted by schema and table name |
| `data.relationships` | `SchemaRelationship[]` | Stable relationship list sorted by constraint and source fields |

### `SchemaTable`

| Field | Type | Notes |
|---|---|---|
| `schemaName` | `string` | SQL schema name |
| `tableName` | `string` | Table name |
| `fullName` | `string` | `${schemaName}.${tableName}` |
| `columns` | `SchemaColumn[]` | Ordered by `ordinal` |
| `primaryKey` | `SchemaPrimaryKey \| null` | `null` when no primary key metadata exists |

### `SchemaColumn`

| Field | Type |
|---|---|
| `columnName` | `string` |
| `ordinal` | `number` |
| `dataType` | `string` |
| `isNullable` | `boolean` |
| `maxLength` | `number \| null` |
| `numericPrecision` | `number \| null` |
| `numericScale` | `number \| null` |
| `isPrimaryKey` | `boolean` |
| `isForeignKey` | `boolean` |

### `SchemaPrimaryKey`

| Field | Type |
|---|---|
| `name` | `string` |
| `columns` | `string[]` |

### `SchemaRelationship`

| Field | Type |
|---|---|
| `constraintName` | `string` |
| `sourceSchema` | `string` |
| `sourceTable` | `string` |
| `sourceColumn` | `string` |
| `targetSchema` | `string` |
| `targetTable` | `string` |
| `targetColumn` | `string` |

### Example `200`

```json
{
  "success": true,
  "data": {
    "tables": [
      {
        "schemaName": "dbo",
        "tableName": "CrimeSceneReport",
        "fullName": "dbo.CrimeSceneReport",
        "columns": [
          {
            "columnName": "ReportID",
            "ordinal": 1,
            "dataType": "int",
            "isNullable": false,
            "maxLength": null,
            "numericPrecision": 10,
            "numericScale": null,
            "isPrimaryKey": true,
            "isForeignKey": false
          }
        ],
        "primaryKey": {
          "name": "PK_CrimeSceneReport",
          "columns": [
            "ReportID"
          ]
        }
      }
    ],
    "relationships": [
      {
        "constraintName": "FK_CrimeSceneReport_CrimeType",
        "sourceSchema": "dbo",
        "sourceTable": "CrimeSceneReport",
        "sourceColumn": "CrimeID",
        "targetSchema": "dbo",
        "targetTable": "CrimeType",
        "targetColumn": "CrimeID"
      }
    ]
  }
}
```

### Example `500`

```json
{
  "success": false,
  "message": "Unable to load schema metadata."
}
```

## Contract Notes

- The endpoint exposes actual database metadata only.
- The endpoint does not invent tables, columns, relationships, or inferred business semantics.
- The endpoint currently has no filtering, pagination, or query parameters.
