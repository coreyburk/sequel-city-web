# Error Response Model

The current API does not use one global error envelope. Error responses are route-specific but still follow a deterministic backend-owned model.

## Response Shape By Endpoint Area

| Route | Statuses | Current failure body shape |
|---|---|---|
| `GET /api/health/database` | `503` | Same shape as success body, with `isConnected: false` |
| `GET /api/health/full` | `503` | Same top-level shape as success body, with database and schema failure details |
| `GET /api/schema/tables` | `500` | `{ "success": false, "message": string }` |
| `POST /api/query/execute` | `400` | `{ "success": false, "safety": ..., "executionTimeMs": number, "message": string }` |
| `POST /api/query/execute` | `200` | Same failure shape for blocked SQL and execution failures |
| `GET /api/query/history` | `500` | `{ "success": false, "message": string }` |
| `POST /api/case/verify-suspect` | `400`, `500` | `{ "success": false, "message": string }` |

## Implemented Error Patterns

### Health Diagnostics

- Health routes do not return `success: false`.
- Health routes communicate failure through HTTP status and diagnostic fields.
- `GET /api/health/full` still returns `success: true` even when the HTTP status is `503`.

### Schema And History Failures

- Schema, history, and case verification failures currently use a minimal failure envelope.
- The failure body contains `success: false` and `message`.
- No structured error code field is currently included.

Example:

```json
{
  "success": false,
  "message": "Unable to load schema metadata."
}
```

### Query Execution Failures

- Query execution failures always include a `safety` object.
- Malformed request bodies return `400`.
- Backend-blocked SQL returns `200` with `success: false`.
- Database execution failures after safety approval also return `200` with `success: false`.
- Query execution failure bodies do not include a `data` object.

Example blocked response:

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

### Case Verification Failures

- Malformed suspect verification request bodies return `400`.
- Backend verification failures return `500`.
- Failure bodies contain `success: false` and a deterministic `message`.
- Failure bodies do not include a `data` object.

## Contract Implications

- Clients must not rely on HTTP status alone to interpret every API response.
- Clients must inspect the response body shape and fields for each endpoint family.
- The frontend should treat the backend response body as authoritative for user-facing safety and failure messaging.
