# Local Runtime Requirements

## Purpose

This document defines the minimum local runtime requirements for using the currently implemented Sequel City Web Detective application.

## Required Software

The local machine must have:

- Git
- Node.js
- npm
- Microsoft SQL Server
- a local browser

SQL Server Management Studio is not required to run the application, but it is practical for local SQL validation and troubleshooting.

## Required Repository State

The repository must be available locally and dependencies must be installed from the repository root:

```powershell
npm install
```

The current root workspace startup command is:

```powershell
npm run dev
```

## Required Backend Environment File

The backend requires:

`apps/api/.env`

Required variables:

- `SQLSERVER_HOST`
- `SQLSERVER_PORT`
- `SQLSERVER_DATABASE`
- `SQLSERVER_USER`
- `SQLSERVER_PASSWORD`
- `SQLSERVER_TRUST_SERVER_CERTIFICATE`

Implementation-aligned example:

```dotenv
SQLSERVER_HOST=localhost
SQLSERVER_PORT=1433
SQLSERVER_DATABASE=SequelCityCrimesDB
SQLSERVER_USER=sequel_web_user
SQLSERVER_PASSWORD=ReplaceWithActualPassword
SQLSERVER_TRUST_SERVER_CERTIFICATE=true
```

Operational requirement:

- use `localhost` instead of `127.0.0.1` for SQL Server host configuration when following the documented local setup

## Required Database State

The current runtime requires:

- SQL Server service running
- TCP/IP enabled
- port `1433` listening
- SQL authentication available for the configured login
- a restored local `SequelCityCrimesDB`
- a database user with read access for the configured login

Without a restored `SequelCityCrimesDB`, the health, schema, and query flows are not operationally ready.

## Required Process Dependencies

The current application requires both local processes:

- backend process running
- frontend process running

The backend must be running for frontend functionality. The frontend depends on backend APIs for:

- health diagnostics
- schema metadata
- query execution
- query history

The frontend does not function as a standalone database client.

## Required Runtime Expectations

The local runtime expects:

- backend available at `http://127.0.0.1:3001` by default
- frontend available at `http://127.0.0.1:5173` by default
- backend able to connect to the local SQL Server instance
- backend safety validation to approve only read-only SQL

## Minimum Operational Validation

A usable local runtime requires all of the following:

1. `npm install` completed successfully
2. `apps/api/.env` is present and correct
3. SQL Server is reachable on the configured host and port
4. `SequelCityCrimesDB` is restored and readable
5. `npm run dev` starts both services
6. `GET /api/health/full` reports database connectivity
7. `GET /api/schema/tables` returns schema metadata
8. `POST /api/query/execute` runs a safe `SELECT`

If any of those conditions fail, the runtime is not ready for use.
