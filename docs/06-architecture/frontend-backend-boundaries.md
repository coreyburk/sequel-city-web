# Frontend And Backend Boundaries

## Purpose

This document defines the responsibility split in the currently implemented runtime. The goal is to keep presentation concerns in the frontend and authority concerns in the backend.

## Boundary Rule

The frontend is presentation-oriented. The backend owns validation, execution, and access to authoritative runtime data.

## Frontend Responsibilities

The current React frontend is responsible for:

- rendering the application shell
- showing startup and setup guidance
- requesting health data
- requesting schema metadata
- collecting SQL text input from the user
- sending SQL text to the backend
- rendering query execution responses
- rendering query history responses
- displaying backend-provided safety messages and failure messages

The frontend currently does not:

- connect directly to SQL Server
- decide whether SQL is safe
- execute SQL locally
- infer schema outside backend responses
- persist authoritative case state
- verify suspects
- determine learner correctness

## Backend Responsibilities

The current Fastify backend is responsible for:

- exposing the HTTP API used by the frontend
- applying request-shape checks
- validating SQL safety
- blocking non-read-only SQL
- executing approved SQL against SQL Server
- normalizing raw query results
- loading schema metadata from SQL Server catalogs
- reporting database and schema diagnostics
- recording query history in backend memory

The backend currently does not:

- use runtime AI
- expose mutation-oriented SQL execution
- expose authentication or user session logic
- expose deployment or cloud orchestration logic

## Authority Table

| Concern | Current Authority |
|---|---|
| Browser UI state | Frontend |
| API contract | Backend |
| SQL safety decision | Backend |
| SQL execution | Backend |
| Query result shape | Backend |
| Schema metadata truth | Database via backend |
| Database connectivity truth | Database via backend |
| Query history records | Backend in-memory service |

## Current Component Boundary Examples

### Query Runner

`QueryRunner.tsx` sends SQL text to `POST /api/query/execute` and renders the response. It does not parse or validate SQL locally.

### Schema Explorer

`SchemaExplorer.tsx` renders table and column data returned by `GET /api/schema/tables`. It does not invent table structures.

### Health Status

`HealthStatus.tsx` renders the combined diagnostics returned by `GET /api/health/full`. It does not check SQL Server directly.

### Query History

`QueryHistoryPanel.tsx` renders the records returned by `GET /api/query/history`. It does not keep its own authoritative execution log.

## Why This Boundary Matters

This split preserves the SSOT architecture direction:

- the browser stays simple
- safety logic stays centralized
- execution stays deterministic
- schema truth stays database-backed
- no runtime AI path is introduced
