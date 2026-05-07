# System Overview

## Purpose

Sequel City Web Detective currently runs as a local-first browser application with a presentation-oriented frontend, a deterministic backend, and a local SQL Server database. The architecture is intentionally simple and keeps authority in the backend and database.

## Current Stack

| Layer | Implemented Technology |
|---|---|
| Frontend | React 18 + Vite + TypeScript |
| Backend | Node.js + Fastify + TypeScript |
| Database | Local SQL Server with `SequelCityCrimesDB` |
| Browser Runtime | Local browser on `http://127.0.0.1:5173` by default |
| API Runtime | Local Fastify server on `http://127.0.0.1:3001` by default |

## Local-First Model

The implemented runtime is designed for local use:

- the frontend runs locally
- the backend runs locally
- the database connection points to a local SQL Server instance by default
- no internet access is required for normal runtime behavior
- no cloud service is required
- no runtime AI dependency exists

## Current Runtime Components

### Frontend

The frontend in `apps/web` is a browser client that:

- renders the application shell
- loads backend health diagnostics
- loads schema metadata
- submits SQL text to the backend
- renders normalized query results
- loads and displays query history
- shows setup and safety guidance text

The frontend currently includes these main UI areas:

- first-run guidance
- health status
- schema explorer
- query runner
- query results table
- query history panel

### Backend

The backend in `apps/api` is the runtime authority for:

- CORS handling for the local frontend
- database connectivity checks
- schema metadata retrieval
- SQL safety validation
- read-only query execution
- query result normalization
- query history recording
- database-backed suspect verification

The backend currently exposes these implemented routes:

| Route | Method | Purpose |
|---|---|---|
| `/api/health/database` | `GET` | Database connectivity status |
| `/api/health/full` | `GET` | API, database, and schema diagnostics |
| `/api/schema/tables` | `GET` | Table, column, primary key, and relationship metadata |
| `/api/query/execute` | `POST` | Backend-validated query execution |
| `/api/query/history` | `GET` | In-memory query history |
| `/api/case/verify-suspect` | `POST` | Database-backed suspect verification |

### Database

The local SQL Server database is the authoritative source for:

- schema metadata returned by the schema route
- query execution results returned by the query route
- suspect verification verdicts generated through the `Solution` trigger
- connectivity state reported by the health routes

## Current Layering

### Presentation Layer

Owned by `apps/web`. Responsible for rendering and user interaction only.

### API Layer

Owned by `apps/api/src/routes`. Responsible for thin HTTP route handling and delegation.

### Application and Service Layer

Owned by `apps/api/src/services`. Responsible for deterministic safety checks, execution, normalization, schema shaping, diagnostics, and query history behavior.

### Infrastructure Layer

Owned by `apps/api/src/config` and `apps/api/src/db`. Responsible for environment-based SQL Server configuration and pooled database access.

## Implemented Non-Goals

The current runtime does not implement:

- runtime AI calls
- AI orchestration
- notebook persistence
- authentication
- cloud deployment architecture
- background jobs
- message queues
- distributed services

## Notes On SSOT Alignment

The SSOT describes broader product scope such as evidence notebook behavior and deterministic case progression. Those concerns remain part of project direction, but they are not yet implemented runtime components in the current codebase and are therefore not described here as active architecture.
