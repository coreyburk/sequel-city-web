# Supported Environments

## Purpose

This document defines the supported and documented operating environment for the current Sequel City Web Detective runtime.

## Supported Operating Context

The currently supported operating context is a local-first developer machine running:

- Windows 10 or Windows 11
- local Node.js and npm
- local SQL Server
- local browser access to the frontend
- local backend access on the same machine

This is the environment that existing setup and runtime documentation were written for and validated against.

## Supported Application Topology

The currently supported topology is:

1. the frontend runs locally from `apps/web`
2. the backend runs locally from `apps/api`
3. the backend connects to a local SQL Server instance
4. the backend reads from a restored local `SequelCityCrimesDB`
5. the browser communicates with the backend over local HTTP

The supported runtime is local-only. It is not documented as a shared, hosted, or internet-facing system.

## Supported Local URLs

Current repository defaults are:

| Component | Default URL |
|---|---|
| Frontend dev server | `http://127.0.0.1:5173` |
| Backend API | `http://127.0.0.1:3001` |

These defaults describe the current application startup behavior.

## SQL Server Host Guidance

For SQL Server configuration in `apps/api/.env`, prefer:

`SQLSERVER_HOST=localhost`

Why this is the supported guidance:

- the setup documentation validated `localhost` as the more reliable SQL host value
- `localhost` is preferred over `127.0.0.1` for SQL TLS hostname consistency
- `127.0.0.1` may produce certificate or hostname mismatch behavior depending on local SQL Server configuration

This guidance applies to the backend-to-database connection, not to the browser URLs above.

## Supported Runtime Authority Model

The supported environment assumes:

- the frontend is presentation-only
- the backend is the authority for validation and execution
- SQL Server is the authority for schema metadata and query results
- learner SQL is read-only and must pass backend safety validation
- no runtime AI is present

## Unsupported Environment Claims

This project does not currently claim support for:

- Linux or macOS validation
- containerized runtime validation
- cloud deployment
- production hosting
- remote multi-machine deployment
- remote SQL Server hosting as a documented supported mode

Those scenarios are outside the current supported environment definition unless separately validated and documented by a future work package.
