# API Contract Documentation

This package documents the currently implemented Fastify API under `apps/api`.

Scope rules for this package:

- Document implemented endpoints only.
- Treat the backend as the authority for request validation, SQL safety, execution, and response shaping.
- Treat SQL Server as the authority for database-backed metadata and query results.
- Reflect the current local-first runtime only.
- Do not describe authentication, authorization, cloud deployment, case progression, notebook persistence, or runtime AI behavior as implemented API features.

## Implemented Endpoints

| Area | Method | Route | Document |
|---|---|---|---|
| Health | `GET` | `/api/health/database` | `health-endpoints.md` |
| Health | `GET` | `/api/health/full` | `health-endpoints.md` |
| Schema | `GET` | `/api/schema/tables` | `schema-endpoints.md` |
| Query execution | `POST` | `/api/query/execute` | `query-execution-endpoints.md` |
| Query history | `GET` | `/api/query/history` | `history-endpoints.md` |
| Case verification | `POST` | `/api/case/verify-suspect` | `case-verification-endpoints.md` |

## Cross-Cutting Contract Notes

- The frontend is presentation-only and must render backend responses without becoming the authority for validation or execution.
- SQL execution is backend-owned and read-only.
- Query safety decisions are backend-owned and deterministic.
- Schema metadata is database-backed through the backend.
- Query history is currently backend memory only and is not persisted to the database or filesystem.
- Suspect verification is backend-owned and database-backed through the `Solution` table trigger.
- No implemented endpoint performs authentication or authorization checks.

## Related Documents

- `health-endpoints.md`
- `schema-endpoints.md`
- `query-execution-endpoints.md`
- `history-endpoints.md`
- `case-verification-endpoints.md`
- `error-response-model.md`
- `deterministic-response-guarantees.md`
