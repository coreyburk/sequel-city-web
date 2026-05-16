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
- collecting suspect names and sending them to backend verification
- rendering query execution responses
- rendering query history responses
- rendering suspect verification responses
- displaying backend-provided safety messages and failure messages

The frontend currently does not:

- connect directly to SQL Server
- decide whether SQL is safe
- execute SQL locally
- infer schema outside backend responses
- persist authoritative case state
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
- verifying submitted suspects through the database-backed `Solution` trigger

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
| Suspect verification verdicts | Database via backend |

## Current Component Boundary Examples

### Query Runner

`QueryRunner.tsx` sends SQL text to `POST /api/query/execute` and renders the response. It does not parse or validate SQL locally.

In student audience mode, the frontend also derives a deterministic
reinforcement signal from the submitted SQL, the backend-returned row
count, the deterministic milestone map, and the learner's notebook. The
signal is presentation-only feedback rendered below the result table by
the same `QueryRunner.tsx` component. The reinforcement layer never
overrides backend authority: it does not validate SQL, does not advance
milestones, does not verify suspects, and does not generate the next
query. See `docs/10-user-journey/query-reinforcement-feedback.md`.

A second deterministic presentation layer — the Samuel reactive mentor
note — sits below the reinforcement panel. It is computed by
`apps/web/src/features/samuelReactions` from the same deterministic
inputs plus a per-session moderation memory (last reaction, queries
since last reaction, per-category cooldowns). The reactive layer is
authored, spoiler-safe, and silent most of the time; it never validates
SQL, advances milestones, verifies suspects, or generates the next
query. See `docs/10-user-journey/samuel-reactive-guidance.md`.

### Schema Explorer

`SchemaExplorer.tsx` renders table and column data returned by `GET /api/schema/tables`. It does not invent table structures.

### Health Status

`HealthStatus.tsx` renders the combined diagnostics returned by `GET /api/health/full`. It does not check SQL Server directly.

### Query History

`QueryHistoryPanel.tsx` renders the records returned by `GET /api/query/history`. It does not keep its own authoritative execution log.

### Suspect Verification

`SuspectVerificationPanel.tsx` sends suspect names to `POST /api/case/verify-suspect` and renders backend verification responses. The frontend does not decide correctness locally.

## Why This Boundary Matters

This split preserves the SSOT architecture direction:

- the browser stays simple
- safety logic stays centralized
- execution stays deterministic
- schema truth stays database-backed
- no runtime AI path is introduced
