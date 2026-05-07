# Frontend Interaction Flow

## Purpose

This document defines the frontend role during investigation and clarifies the boundaries it must not cross.

## Frontend Responsibilities

The current frontend is responsible for:

- showing startup and setup guidance
- showing backend and database health feedback
- requesting schema metadata from the backend
- collecting learner SQL input
- submitting SQL text to the backend
- rendering safety messages, execution messages, and normalized query results
- rendering backend query history
- collecting suspect names for verification
- submitting suspect names to backend case verification
- rendering backend verification messages and verdict text

## Frontend Non-Responsibilities

The current frontend must not:

- connect directly to SQL Server
- decide whether SQL is safe
- execute SQL locally
- invent schema details
- infer evidence that is not in backend responses
- determine whether a learner is correct
- expose hidden suspects or answer keys
- simulate runtime AI guidance

## Current Component Flow

1. `HealthStatus` requests backend health diagnostics.
2. `SchemaExplorer` requests backend schema metadata and renders returned tables.
3. `QueryRunner` collects SQL text and submits it to `POST /api/query/execute`.
4. `QueryResultsTable` renders only successful normalized results.
5. `QueryHistoryPanel` requests backend history and renders returned records.

## Presentation-Only Rule

The frontend may explain how to use the workspace and may display backend messages, but it remains presentation-only. It does not become the authority for SQL safety, schema truth, evidence truth, or final correctness.

## Interaction Boundaries

| Frontend action | Allowed | Why |
|---|---|---|
| Render backend schema data | Yes | Presentation of backend-owned metadata |
| Submit learner SQL | Yes | Input collection and transport |
| Submit suspect names for verification | Yes | Input collection and transport to backend verification endpoint |
| Show blocked-query feedback | Yes | Backend response presentation |
| Prevent destructive SQL by local authority | No | Backend owns safety decisions |
| Invent missing table meaning | No | Schema truth is backend and database-backed |
| Mark a suspect as correct from UI-only state | No | Correctness must be deterministic and backend-backed |
| Render backend suspect verification verdicts | Yes | Presentation of backend-owned verification output |

## Current Runtime Notes

The present frontend does not yet include notebook persistence or deterministic case-state UI. Suspect verification UI is now implemented and remains presentation-only, with backend and database logic as the authority for verdicts.
