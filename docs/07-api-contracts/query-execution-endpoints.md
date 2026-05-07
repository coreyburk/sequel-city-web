# Query Execution Endpoints

The query execution contract is backend-owned, deterministic, and read-only.

## `POST /api/query/execute`

Submits SQL text for backend safety validation and, if allowed, database execution.

### Request Body

| Field | Type | Required | Notes |
|---|---|---|---|
| `sql` | `string` | Yes | Raw SQL text submitted by the frontend |

### Example Request

```json
{
  "sql": "SELECT TOP 5 PersonID, FullName FROM PersonsOfInterest ORDER BY PersonID"
}
```

### Response Codes

| Status | When returned |
|---|---|
| `200` | SQL was allowed and executed successfully |
| `200` | SQL was blocked by backend safety validation |
| `200` | SQL was allowed but database execution failed |
| `400` | Request body does not include a string `sql` field |

### Success Shape

| Field | Type | Notes |
|---|---|---|
| `success` | `true` | Indicates execution succeeded |
| `data.columns` | `QueryColumn[]` | Ordered normalized columns |
| `data.rows` | `QueryRow[]` | Normalized row values and display values |
| `data.rowCount` | `number` | Number of returned rows |
| `safety` | `SqlSafetyValidationResult` | Backend safety verdict for the submitted SQL |
| `executionTimeMs` | `number` | Backend-measured execution duration |
| `message` | `string` | Current success message is `Query executed successfully.` |

### Failure Shape

| Field | Type | Notes |
|---|---|---|
| `success` | `false` | Indicates the request did not produce query result data |
| `safety` | `SqlSafetyValidationResult` | Backend safety verdict for the submitted SQL |
| `executionTimeMs` | `number` | Backend-measured duration |
| `message` | `string` | Deterministic failure or blocked message |

The failure shape does not include a `data` object.

### `SqlSafetyValidationResult`

| Field | Type |
|---|---|
| `isAllowed` | `boolean` |
| `normalizedStatementType` | `"SELECT" \| "WITH" \| "INSERT" \| "UPDATE" \| "DELETE" \| "DROP" \| "ALTER" \| "CREATE" \| "TRUNCATE" \| "MERGE" \| "EXEC" \| "EXECUTE" \| "GRANT" \| "REVOKE" \| "DENY" \| "BACKUP" \| "RESTORE" \| "USE" \| "UNKNOWN"` |
| `violations` | `SqlSafetyViolation[]` |
| `message` | `string` |

### `SqlSafetyViolation`

| Field | Type |
|---|---|
| `code` | `"EMPTY_SQL" \| "MULTIPLE_STATEMENTS" \| "DISALLOWED_STATEMENT" \| "NON_SELECT_STATEMENT" \| "INVALID_CTE"` |
| `message` | `string` |
| `token` | `string` optional |

### `QueryColumn`

| Field | Type |
|---|---|
| `name` | `string` |
| `ordinal` | `number` |
| `dataType` | `"string" \| "number" \| "boolean" \| "date" \| "null" \| "unknown"` |

### `QueryRow`

| Field | Type | Notes |
|---|---|---|
| `values` | object | Raw normalized values for application use |
| `displayValues` | object | String display values for presentation |

Normalized values currently follow these rules:

- strings stay strings
- numbers stay numbers
- booleans stay booleans
- `Date` values become ISO 8601 strings
- `null` and `undefined` become `null`
- unrecognized value types become `null` in `values`
- unrecognized value types become `String(value)` when possible in `displayValues`

### Example `200` Success

```json
{
  "success": true,
  "data": {
    "columns": [
      {
        "name": "PersonID",
        "ordinal": 0,
        "dataType": "number"
      },
      {
        "name": "FullName",
        "ordinal": 1,
        "dataType": "string"
      }
    ],
    "rows": [
      {
        "values": {
          "PersonID": 101,
          "FullName": "Ada Lovelace"
        },
        "displayValues": {
          "PersonID": "101",
          "FullName": "Ada Lovelace"
        }
      }
    ],
    "rowCount": 1
  },
  "safety": {
    "isAllowed": true,
    "normalizedStatementType": "SELECT",
    "violations": [],
    "message": "SQL statement is allowed."
  },
  "executionTimeMs": 12,
  "message": "Query executed successfully."
}
```

### Example `200` Blocked

```json
{
  "success": false,
  "safety": {
    "isAllowed": false,
    "normalizedStatementType": "DELETE",
    "violations": [
      {
        "code": "DISALLOWED_STATEMENT",
        "message": "DELETE statements are not allowed.",
        "token": "DELETE"
      }
    ],
    "message": "DELETE statements are not allowed."
  },
  "executionTimeMs": 1,
  "message": "Query blocked: DELETE statements are not allowed."
}
```

### Example `400` Malformed Request

```json
{
  "success": false,
  "safety": {
    "isAllowed": false,
    "normalizedStatementType": "UNKNOWN",
    "violations": [
      {
        "code": "EMPTY_SQL",
        "message": "SQL must not be empty."
      }
    ],
    "message": "SQL must not be empty."
  },
  "executionTimeMs": 0,
  "message": "Request body must include a string `sql` field."
}
```

### Example `200` Execution Failure

```json
{
  "success": false,
  "safety": {
    "isAllowed": true,
    "normalizedStatementType": "SELECT",
    "violations": [],
    "message": "SQL statement is allowed."
  },
  "executionTimeMs": 7,
  "message": "Query execution failed. Verify the SQL and database connection."
}
```

## Safety Contract Notes

- The backend validates every submitted query before any database call.
- Only a single allowed `SELECT` statement may execute.
- `WITH` is allowed only when it resolves to a top-level `SELECT`.
- The frontend must not pre-authorize SQL or override backend safety results.
