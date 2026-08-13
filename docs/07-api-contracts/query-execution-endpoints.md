# Query Execution Endpoints

The query execution contract is backend-owned, deterministic, and read-only.

## `POST /api/query/execute`

Submits SQL text for backend safety validation and, if allowed, database execution.

The web client may call this endpoint through `executeQuery(sql)` for normal Query Lab behavior or `executeQuery(sql, options)` for the gated Case 001 skeleton metadata opt-in. No-options calls must continue to submit only the SQL body.

### Request Body

| Field | Type | Required | Notes |
|---|---|---|---|
| `sql` | `string` | Yes | Raw SQL text submitted by the frontend |
| `caseMilestoneEvaluation` | object | No | Explicit opt-in request for gated Case 001 milestone metadata. Current supported target is `caseId: "case-001"`, `milestoneId: "case-001-clocktower-report-located"`, and `isSkeletonGateEnabled: true`. |

### Example Request

```json
{
  "sql": "SELECT TOP 5 PersonID, FullName FROM PersonsOfInterest ORDER BY PersonID"
}
```

### Example Case 001 Metadata Opt-In Request

```json
{
  "sql": "SELECT CrimeID, ReportDate, ReportCity, ReportDescription FROM CrimeSceneReport WHERE CrimeID = 1080",
  "caseMilestoneEvaluation": {
    "caseId": "case-001",
    "milestoneId": "case-001-clocktower-report-located",
    "isSkeletonGateEnabled": true
  }
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
| `caseMilestoneEvaluation` | object optional | Non-spoiler Case 001 milestone metadata. Present only for explicit enabled Case 001 opt-in requests after successful safety validation, restricted-table screening, execution, and normalization. |
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

The failure shape does not include `caseMilestoneEvaluation`.

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

### Example `200` Success With Case 001 Metadata

```json
{
  "success": true,
  "data": {
    "columns": [],
    "rows": [],
    "rowCount": 1
  },
  "caseMilestoneEvaluation": {
    "caseId": "case-001",
    "milestoneId": "case-001-clocktower-report-located",
    "evidenceTableFamily": "CrimeSceneReport",
    "gate": {
      "name": "VITE_ENABLE_CASE_001_PLAYABLE_SKELETON",
      "enabledValue": "true",
      "isEnabled": true
    },
    "evaluated": true,
    "matched": true,
    "matchedRowCount": 1,
    "runtimeStatus": "evaluated-no-progression",
    "milestoneAdvanced": false
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
- The gated Case 001 skeleton may display non-spoiler feedback derived from `caseMilestoneEvaluation`, but it must not render returned result rows, result columns, hidden validation details, or answer keys in that slice.
- Case 001 milestone metadata is transport-only. It does not release Case 001, render Query Lab, persist progress, write query history metadata, advance runtime milestones, verify suspects, expose answer keys, or authorize frontend/local state as progression authority.
- Case 001 milestone metadata is absent for no-opt-in requests, disabled gate input, wrong case id, wrong milestone id, blocked SQL, restricted-table SQL, malformed requests, and execution failures.
