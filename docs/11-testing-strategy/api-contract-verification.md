# API Contract Verification

## Purpose

API contract verification confirms that implemented Fastify endpoints continue to return the documented request and response shapes used by the frontend.

## Implemented Contract Areas

Contract checks should remain aligned with `docs/07-api-contracts/` and the currently implemented endpoints:

| Area | Method | Route |
|---|---|---|
| Health | `GET` | `/api/health/database` |
| Health | `GET` | `/api/health/full` |
| Schema | `GET` | `/api/schema/tables` |
| Query execution | `POST` | `/api/query/execute` |
| Query history | `GET` | `/api/query/history` |
| Case verification | `POST` | `/api/case/verify-suspect` |

No tests should imply that authentication, notebook persistence, production deployment, or runtime AI endpoints are currently implemented.

## Verification Expectations

API contract verification should cover:

- required request fields
- success response shapes
- failure response shapes
- status code expectations
- deterministic payload fields
- documented message behavior where stable
- absence of `data` on query execution failures
- presence of `safety` on query execution failures

## Error Response Verification

The current API does not use one global error envelope. Tests should verify route-specific behavior:

- health failures use diagnostic response bodies and failure HTTP statuses
- schema and history failures use minimal `success: false` message bodies
- query execution blocked and execution-failed states return `200` with `success: false`
- malformed query execution requests return `400`
- malformed case verification requests return `400`
- case verification service failures return `500`

Clients and tests should not rely on HTTP status alone for query execution interpretation.

## Frontend Contract Usage

Frontend API client tests should verify that:

- expected endpoints are called
- backend-unavailable errors become documented user guidance
- accepted health failure statuses can still return useful diagnostic bodies
- schema and history failure bodies surface messages
- query execution responses are returned without frontend-side authority changes

The frontend may adapt responses for display, but it must not rewrite backend safety verdicts.
