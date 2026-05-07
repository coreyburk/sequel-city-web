# Deterministic Response Guarantees

This document captures the current API behaviors that keep the runtime deterministic, backend-owned, and local-first.

## Authority Guarantees

- The backend is the authority for request validation.
- The backend is the authority for SQL safety decisions.
- The backend is the authority for whether SQL reaches the database.
- SQL Server is the authority for database-backed schema metadata and query results.
- The frontend is presentation-only and must not invent schema, bypass validation, or reinterpret execution authority.

## Read-Only Execution Guarantees

- `POST /api/query/execute` validates every submitted SQL string before database access.
- Only a single allowed `SELECT` statement may execute.
- `WITH` is allowed only when it resolves to a top-level `SELECT`.
- Mutating and administrative statements are blocked in the backend.
- Blocked SQL is recorded in query history without being executed against SQL Server.

## Stable Response Shape Guarantees

- `GET /api/health/database` always returns the same five top-level fields.
- `GET /api/health/full` always returns `success` and `data`, with fixed `api`, `database`, and `schema` sections.
- `GET /api/schema/tables` returns `tables` and `relationships` on success, and `success: false` with `message` on failure.
- `POST /api/query/execute` returns either a success shape with `data` or a failure shape without `data`.
- `GET /api/query/history` returns `records` on success, and `success: false` with `message` on failure.
- `POST /api/case/verify-suspect` returns a success shape with database-generated verdict data or a failure shape without `data`.

## Ordering Guarantees

- Schema tables are sorted by schema name, then table name.
- Schema columns are sorted by ordinal within each table.
- Schema relationships are sorted by constraint name, then source table, then source column.
- Query result columns preserve the column order derived from the recordset metadata or first row keys.
- Query history records are returned in reverse chronological insertion order.
- Suspect verification verdicts come from the latest non-null `Solution` verdict row for the submitted suspect.

## Normalization Guarantees

- Query result rows are normalized into `values` and `displayValues`.
- Date values are serialized as ISO 8601 strings.
- `null` and `undefined` become `null` in `values` and empty strings in `displayValues`.
- Unknown runtime value types become `null` in `values`.
- Unknown runtime value types become stringified display output when possible.

## Local-First Guarantees

- The implemented API assumes a local Fastify runtime and a local SQL Server database.
- No implemented endpoint requires internet access.
- No implemented endpoint depends on cloud services.
- No implemented endpoint depends on runtime AI behavior.
- Query history remains local process memory and is not shared across machines or persisted across restarts.
- Suspect verification depends on the local `SequelCityCrimesDB` `Solution` table and trigger.

## Non-Implemented Guarantees

These API contracts do not currently include:

- case progression endpoints
- notebook persistence endpoints
- authentication or authorization behavior
- cloud deployment concerns
- runtime AI request or response paths
