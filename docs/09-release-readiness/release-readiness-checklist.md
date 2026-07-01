# Release Readiness Checklist

## Purpose

This checklist confirms whether the current local runtime is operationally ready for use in its supported environment.

## Validation Snapshot (2026-06-30)

Observed on a live local run with `npm run dev`:

- backend reachable at `http://127.0.0.1:3001`
- frontend reachable at `http://127.0.0.1:5173`
- database health passed for `SequelCityCrimesDB`
- full health passed with schema readiness
- schema metadata loaded successfully
- safe `SELECT TOP 1 * FROM CrimeSceneReport` executed successfully in the API and the frontend
- `DELETE FROM CrimeSceneReport` was blocked by backend SQL safety validation
- query history recorded both the successful `SELECT` and blocked `DELETE`
- suspect verification passed for `Jeremy Bowers`

## Local Environment Readiness

- [x] Repository is available locally on a Windows machine
- [x] `npm install` completed successfully from the repository root
- [x] `apps/api/.env` exists
- [x] `SQLSERVER_HOST=localhost` is set for documented SQL host guidance
- [x] `SQLSERVER_PORT=1433` is configured
- [x] `SQLSERVER_DATABASE=SequelCityCrimesDB` is configured
- [x] SQL login credentials in `apps/api/.env` are present

Note: the observed `.env` value is `SQLSERVER_HOST=127.0.0.1`, which is functioning as the local loopback equivalent of the documented localhost guidance.

## SQL Server Readiness

- [x] Local SQL Server service is running
- [x] TCP/IP is enabled
- [x] Port `1433` is listening
- [x] `SequelCityCrimesDB` is restored on the local SQL Server instance
- [x] The configured SQL login can read `SequelCityCrimesDB`

## Process Startup Readiness

- [x] `npm run dev` starts both the backend and frontend
- [x] Backend is reachable at `http://127.0.0.1:3001` or the locally configured equivalent
- [x] Frontend is reachable at `http://127.0.0.1:5173` or the locally configured equivalent
- [x] The frontend can reach the backend without local connectivity failure

## Backend API Validation

- [x] `GET /api/health/database` reports a successful database connection
- [x] `GET /api/health/full` reports API, database, and schema readiness
- [x] `GET /api/schema/tables` returns table and relationship metadata

## Read-Only Query Validation

- [x] `POST /api/query/execute` accepts a safe `SELECT`
- [x] The returned query result is normalized and rendered by the frontend
- [x] A mutating query such as `DELETE` is blocked by backend safety validation
- [x] Query execution does not require frontend-side SQL authority

## Query History Validation

- [x] `GET /api/query/history` returns records successfully
- [x] A successful safe query appears in query history
- [x] A blocked query attempt appears in query history when executed

## Final Ready / Not Ready Rule

The runtime is ready only when:

- the backend is running
- the frontend is running
- the backend is connected to a restored local `SequelCityCrimesDB`
- schema metadata loads
- safe read-only query execution works

If any of those conditions are false, the current release target should be treated as not ready in its documented supported environment.
