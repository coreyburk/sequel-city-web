# Local Runtime Test Scenarios

## Purpose

This document lists practical local scenarios for validating the implemented deterministic runtime.

## Backend Unavailable

Setup:

- frontend is running
- backend is stopped or unreachable

Expected result:

- frontend API requests fail gracefully
- backend-unavailable guidance is shown
- frontend does not attempt direct database access
- no schema, query execution, or history behavior is treated as authoritative without backend responses

## Database Unavailable

Setup:

- backend is running
- SQL Server is stopped, unreachable, or misconfigured

Expected result:

- health diagnostics report database failure
- schema retrieval cannot produce authoritative schema metadata
- safe query execution fails with deterministic backend messaging
- frontend renders backend failure information

## Schema Retrieval Success

Setup:

- backend is running
- SQL Server is reachable
- `SequelCityCrimesDB` is restored and readable

Expected result:

- `GET /api/schema/tables` returns `success: true`
- tables, columns, primary keys, and relationships come from SQL Server metadata
- frontend renders returned schema data without inventing schema

## Safe Query Success

Setup:

- backend and database are available
- learner submits `SELECT DB_NAME() AS CurrentDatabase`

Expected result:

- backend safety allows the query
- SQL Server executes the query
- backend returns normalized columns, rows, and row count
- frontend renders the successful response
- query history records a success outcome

## Blocked SQL

Setup:

- learner submits a mutating or administrative statement through the query runner

Expected result:

- backend safety blocks the statement
- no database execution occurs
- response includes `success: false` and a safety violation
- frontend renders the backend blocked message
- query history records a blocked outcome

## Malformed SQL

Setup:

- learner submits SQL that passes safety validation but is invalid for SQL Server

Expected result:

- backend safety may allow the statement
- SQL Server execution fails
- backend returns deterministic execution failure messaging
- frontend renders the backend failure message
- query history records a failed outcome

## Query History Retrieval Success

Setup:

- backend process has handled one or more query attempts

Expected result:

- `GET /api/query/history` returns in-memory records
- newest records are returned first
- records include query text, outcome, row count, execution time, error message, id, and timestamp
- history is lost when the backend process restarts

## Case 001 Gated First SQL Smoke

Setup:

- backend is running
- SQL Server is reachable
- `SequelCityCrimesDB` is restored and readable
- Case 001 public `CrimeSceneReport` fixture row is present
- frontend browser smoke is run with `CASE_001_LIVE_SMOKE=1`
- frontend Vite server is run with `VITE_ENABLE_CASE_001_PLAYABLE_SKELETON=true`

Expected result:

- smoke preflight confirms `/api/health/full` readiness
- smoke preflight confirms `/api/query/execute` returns matched metadata for `case-001-clocktower-report-located`
- gated Case 001 skeleton opens from the library only under the explicit skeleton gate
- first SQL feedback renders non-spoiler success text
- no Query Lab, evidence board, suspect verification, raw result table, answer-key detail, or Case 001 progress persistence appears

Setup blockers:

- stopped API is reported as `WP-254 live smoke blocker: API unavailable`
- unavailable database/bootstrap is reported as a health-check blocker
- missing public report fixture or missing milestone metadata is reported as a fixture/contract blocker
- successful query execution with missing `caseMilestoneEvaluation` should be treated first as a stale-API/runtime or transport blocker; restart the API from current source before diagnosing fixture data
