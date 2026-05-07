# Manual Testing Boundaries

## Purpose

Manual testing validates the local runtime as a user would operate it: installed dependencies, configured backend, restored local database, running processes, and browser-based frontend interaction.

## Current Manual Scope

Manual validation should cover:

- repository dependency installation
- backend `.env` configuration
- SQL Server service availability
- restored `SequelCityCrimesDB`
- backend startup
- frontend startup
- health diagnostics
- schema retrieval
- safe query execution
- blocked query behavior
- query history rendering
- backend unavailable guidance

These checks confirm local readiness. They are not production certification.

## Startup Validation

A practical startup validation is:

1. Install dependencies from the repository root with `npm install`.
2. Configure `apps/api/.env`.
3. Confirm SQL Server is running and `SequelCityCrimesDB` is readable.
4. Start both local processes with `npm run dev`.
5. Open the frontend at `http://127.0.0.1:5173`.
6. Confirm the backend is reachable at `http://127.0.0.1:3001`.

The backend must be available for the frontend to perform useful application behavior.

## Functional Validation

Manual functional checks should verify:

- `GET /api/health/full` reports useful backend and database diagnostics
- the schema explorer displays backend-returned schema metadata
- `SELECT DB_NAME() AS CurrentDatabase` executes successfully
- result rows render in the frontend result table
- blocked SQL displays backend safety feedback
- query history shows recent success, blocked, and failed attempts

## Boundary Rules

Manual testing should not require:

- internet-facing hosting
- cloud database access
- Docker or container orchestration
- production deployment
- authentication setup
- runtime AI services
- multi-user concurrency validation

Those areas are outside the current implemented runtime.
