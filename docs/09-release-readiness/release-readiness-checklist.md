# Release Readiness Checklist

## Purpose

This checklist confirms whether the current local runtime is operationally ready for use in its supported environment.

## Local Environment Readiness

- [ ] Repository is available locally on a Windows machine
- [ ] `npm install` completed successfully from the repository root
- [ ] `apps/api/.env` exists
- [ ] `SQLSERVER_HOST=localhost` is set for documented SQL host guidance
- [ ] `SQLSERVER_PORT=1433` is configured
- [ ] `SQLSERVER_DATABASE=SequelCityCrimesDB` is configured
- [ ] SQL login credentials in `apps/api/.env` are present

## SQL Server Readiness

- [ ] Local SQL Server service is running
- [ ] TCP/IP is enabled
- [ ] Port `1433` is listening
- [ ] `SequelCityCrimesDB` is restored on the local SQL Server instance
- [ ] The configured SQL login can read `SequelCityCrimesDB`

## Process Startup Readiness

- [ ] `npm run dev` starts both the backend and frontend
- [ ] Backend is reachable at `http://127.0.0.1:3001` or the locally configured equivalent
- [ ] Frontend is reachable at `http://127.0.0.1:5173` or the locally configured equivalent
- [ ] The frontend can reach the backend without local connectivity failure

## Backend API Validation

- [ ] `GET /api/health/database` reports a successful database connection
- [ ] `GET /api/health/full` reports API, database, and schema readiness
- [ ] `GET /api/schema/tables` returns table and relationship metadata

## Read-Only Query Validation

- [ ] `POST /api/query/execute` accepts a safe `SELECT`
- [ ] The returned query result is normalized and rendered by the frontend
- [ ] A mutating query such as `DELETE` is blocked by backend safety validation
- [ ] Query execution does not require frontend-side SQL authority

## Query History Validation

- [ ] `GET /api/query/history` returns records successfully
- [ ] A successful safe query appears in query history
- [ ] A blocked query attempt appears in query history when executed

## Final Ready / Not Ready Rule

The runtime is ready only when:

- the backend is running
- the frontend is running
- the backend is connected to a restored local `SequelCityCrimesDB`
- schema metadata loads
- safe read-only query execution works

If any of those conditions are false, the current release target should be treated as not ready in its documented supported environment.
