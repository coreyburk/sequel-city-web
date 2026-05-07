# Runtime Request Flow

## Purpose

This document describes the currently implemented runtime request paths between the browser frontend, the Fastify backend, and the local SQL Server database.

## High-Level Flow

1. The browser loads the React application from the Vite development server.
2. Frontend components call the backend through `apps/web/src/api/client.ts`.
3. Fastify routes validate or delegate requests to backend services.
4. Backend services either return deterministic local state or use the SQL Server pool.
5. Responses are returned to the frontend for presentation.

## Current API Flow Summary

| Flow | Frontend Trigger | Backend Route | Database Access |
|---|---|---|---|
| Health diagnostics | `HealthStatus` mount | `GET /api/health/full` | Yes |
| Database health only | External or manual call | `GET /api/health/database` | Yes |
| Schema explorer | `SchemaExplorer` mount | `GET /api/schema/tables` | Yes |
| Query execution | `QueryRunner` submit | `POST /api/query/execute` | Yes, after backend safety approval |
| Query history | `QueryHistoryPanel` mount or refresh | `GET /api/query/history` | No |

## Health Flow

`HealthStatus` calls `GET /api/health/full`.

The route delegates to backend diagnostics logic that:

- checks database connectivity
- attempts to load schema metadata
- returns a combined API, database, and schema status payload

This route returns:

- `200` when the database is connected
- `503` when the database is unavailable

## Schema Flow

`SchemaExplorer` calls `GET /api/schema/tables`.

The route delegates to the schema service, which:

- reads table metadata from SQL Server system catalogs
- reads primary key metadata
- reads foreign key metadata
- shapes the result into deterministic `tables` and `relationships` arrays
- marks primary key and foreign key columns
- preserves stable ordering

The frontend only renders what the backend returns.

## Query Execution Flow

`QueryRunner` submits `POST /api/query/execute` with a JSON body containing `sql`.

The route:

- checks that `body.sql` is a string
- returns `400` with a blocked-style response when the request body is malformed
- delegates execution to the query execution service for valid request bodies

The query execution service then:

1. validates SQL safety
2. blocks disallowed SQL before any database call
3. executes approved SQL against SQL Server
4. normalizes the returned recordset into a UI-oriented result shape
5. records the outcome in query history
6. returns a deterministic response object

## Query History Flow

`QueryHistoryPanel` calls `GET /api/query/history`.

The route delegates to the query history service, which returns:

- the current in-memory record list
- records in reverse chronological order

The current implementation does not persist query history to the database or filesystem.

## Error Handling Shape

Current request handling follows a simple pattern:

- frontend network failures become user-facing setup guidance
- backend validation failures return structured deterministic responses
- backend service failures return failure messages without frontend authority changes
- database access errors stay backend-owned

## Current Request Boundaries

The implemented request model does not include:

- frontend-to-database direct calls
- frontend SQL safety decisions
- frontend schema inference
- runtime AI request paths
- suspect verification request paths
- notebook persistence request paths
