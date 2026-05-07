# Architecture Documentation

This folder contains the first formal architecture package for the currently implemented Sequel City Web Detective runtime.

Scope rules for this package:

- Document implemented behavior only.
- Reflect the current local-first runtime under `apps/web` and `apps/api`.
- Treat the SQL Server database as the authoritative data source.
- Treat the backend as the authority for validation and execution.
- Do not describe runtime AI behavior.
- Do not present SSOT future scope as current implementation.

## Package Contents

| Document | Purpose |
|---|---|
| `system-overview.md` | Current system shape, runtime parts, and implemented responsibilities |
| `runtime-request-flow.md` | Actual request flows for health, schema, query execution, and query history |
| `frontend-backend-boundaries.md` | Current responsibility split between the React frontend and Fastify backend |
| `deterministic-execution-model.md` | Current deterministic execution and read-only safety model |
| `diagrams/system-context.md` | Lightweight Mermaid system context diagram |
| `diagrams/query-execution-sequence.md` | Lightweight Mermaid query execution sequence diagram |

## Source Alignment

This package is aligned to:

- `docs/00-ssot/SSOT-Architecture.md`
- `docs/00-ssot/SSOT-SQL-Safety-Rules.md`
- `docs/00-ssot/SSOT-Database-Schema.md`
- `docs/00-ssot/SSOT-Case-Progression.md`
- `docs/00-ssot/SSOT-AI-Agent-Boundaries.md`
- `docs/00-ssot/SSOT-UI-UX-Experience.md`

## Current Runtime Boundary

The current implementation includes:

- React + Vite + TypeScript frontend
- Fastify + TypeScript backend
- Local SQL Server access through `mssql`
- Health diagnostics
- Schema metadata loading
- Read-only query execution
- In-memory query history

The current implementation does not include:

- Runtime AI behavior
- Authentication
- Cloud infrastructure
- Notebook persistence
- Suspect verification endpoints
- Deterministic case progression services
