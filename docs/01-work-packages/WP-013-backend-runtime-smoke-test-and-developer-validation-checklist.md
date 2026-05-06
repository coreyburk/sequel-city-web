# backend-runtime-smoke-test-and-developer-validation-checklist

## Objective

Establish a deterministic, repeatable backend runtime validation process and developer checklist to ensure the Sequel City Web Detective backend can be reliably started, configured, and verified across environments.

## Scope

### In Scope

- Define a step-by-step backend startup and validation checklist
- Document required environment configuration
- Document SQL Server configuration requirements
- Validate core API endpoints through manual smoke testing
- Add an optional consolidated diagnostic endpoint
- Ensure all validation steps are deterministic and reproducible

### Out of Scope

- No changes to query execution logic
- No changes to SQL safety validation
- No changes to normalization logic
- No frontend work
- No database schema changes
- No Docker or containerization work
- No authentication model changes

## Files Allowed to Change

- apps/api/src/routes/healthRoutes.ts
- apps/api/src/services/databaseMetadataService.ts
- apps/api/src/services/schemaService.ts
- apps/api/src/types/database.ts
- apps/api/src/routes/healthRoutes.test.ts
- apps/api/src/services/databaseMetadataService.test.ts
- docs/02-runtime/Backend-Setup-and-Validation.md

## Constraints

- Must not introduce AI or heuristic logic
- Must not modify existing endpoint behavior
- Must not introduce breaking API changes
- Must keep routes thin and logic in services
- Must remain fully deterministic
- Must not modify database schema or seed data
- Must not require elevated system permissions at runtime
- Must not introduce Docker or containerization in this work package

## Required Behavior

1. Developer setup documentation

Create:

docs/02-runtime/Backend-Setup-and-Validation.md

The document must include:

- Required environment file location: apps/api/.env
- Required environment variables:
  - SQLSERVER_HOST
  - SQLSERVER_PORT
  - SQLSERVER_DATABASE
  - SQLSERVER_USER
  - SQLSERVER_PASSWORD
  - SQLSERVER_TRUST_SERVER_CERTIFICATE
- SQL Server requirements:
  - SQL Server service must be running
  - TCP/IP must be enabled
  - Port 1433 must be listening
  - SQL Server and Windows Authentication mode must be enabled when using SQL logins
  - SQL login must exist
  - SQL login must map to a database user
  - Database user must have db_datareader access
- Startup instructions:
  - npm install
  - npm run dev --workspace apps/api
- Manual smoke test commands for:
  - GET /api/health/database
  - GET /api/schema/tables
  - POST /api/query/execute
  - GET /api/query/history
- Expected results for each smoke test
- Common failure messages and likely causes:
  - Failed to connect to 127.0.0.1:1433
  - Login failed for user
  - Route GET:/ not found
  - Route GET:/api/query/execute not found

2. Consolidated diagnostic endpoint

Add:

GET /api/health/full

Successful response shape:

success: true
data:
  api: ok
  database:
    status: ok or failed
    isConnected: boolean
    databaseName: string or null
    serverName: string or null
    message: string
  schema:
    status: ok or failed
    tableCount: number
    relationshipCount: number
    message: string

Rules:

- api must be ok when the route is reachable
- database.status must be ok only when the existing database health check succeeds
- database.status must be failed when the database health check fails
- schema.status must be ok only when schema metadata is successfully retrieved
- schema.tableCount must equal the number of discovered tables
- schema.relationshipCount must equal the number of discovered relationships
- schema.status must be failed if schema discovery fails
- The endpoint must not throw raw database errors to the client
- The endpoint must not expose raw SQL Server driver objects

3. Existing endpoint behavior

Existing endpoints must remain unchanged:

- GET /api/health/database
- GET /api/schema/tables
- POST /api/query/execute
- GET /api/query/history

4. Tests

Add or update tests for:

- GET /api/health/full success response shape
- database failure reflected in diagnostic response
- schema failure reflected in diagnostic response
- route delegates to service
- existing health/database behavior remains unchanged

## Acceptance Criteria

1. Backend setup documentation exists at docs/02-runtime/Backend-Setup-and-Validation.md.
2. Documentation includes the required apps/api/.env location.
3. Documentation lists all required SQLSERVER environment variables.
4. Documentation includes SQL Server TCP/IP and port 1433 requirements.
5. Documentation includes SQL authentication and db_datareader requirements.
6. Documentation includes backend startup commands.
7. Documentation includes manual smoke test commands for all core endpoints.
8. Documentation explains expected smoke test responses.
9. Documentation explains common local setup failures.
10. GET /api/health/full endpoint exists.
11. GET /api/health/full returns success true when diagnostic execution completes.
12. Diagnostic response includes data.api.
13. Diagnostic response includes data.database.
14. Diagnostic response includes data.schema.
15. data.api is ok when the route is reachable.
16. data.database.status is ok when database health succeeds.
17. data.database.status is failed when database health fails.
18. data.schema.status is ok when schema discovery succeeds.
19. data.schema.status is failed when schema discovery fails.
20. data.schema.tableCount is deterministic.
21. data.schema.relationshipCount is deterministic.
22. Existing endpoint behavior remains unchanged.
23. Routes remain thin.
24. Diagnostic logic exists in the service layer.
25. Tests cover successful diagnostic response.
26. Tests cover database failure response.
27. Tests cover schema failure response.
28. All existing API tests pass.
29. No frontend files are modified.
30. No database files are modified.
31. No SSOT files are modified.
32. No AI, LLM, or heuristic behavior is introduced.

## Codex Prompt

You are implementing WP-013 for the Sequel City Web Detective backend.

Goal:
Create a deterministic backend runtime smoke-test checklist and add a consolidated backend diagnostic endpoint.

Context:
The backend now has working endpoints for database health, schema metadata, query execution, and query history. The project needs a repeatable runtime validation process before frontend work begins.

Important:
Do not change existing endpoint behavior. Do not change query execution, SQL safety validation, query normalization, schema discovery semantics, or query history behavior.

Tasks:

1. Create runtime documentation.

Create this file:

docs/02-runtime/Backend-Setup-and-Validation.md

Include:

- Purpose of the document
- Required environment file location: apps/api/.env
- Required variables:
  - SQLSERVER_HOST
  - SQLSERVER_PORT
  - SQLSERVER_DATABASE
  - SQLSERVER_USER
  - SQLSERVER_PASSWORD
  - SQLSERVER_TRUST_SERVER_CERTIFICATE
- Example environment configuration using placeholder credentials
- SQL Server requirements:
  - SQL Server service running
  - TCP/IP enabled
  - Port 1433 listening
  - SQL Server and Windows Authentication mode enabled for SQL logins
  - SQL login exists
  - Login maps to a database user in SequelCityCrimesDB
  - Database user has db_datareader access
- Commands to verify port 1433:
  - Test-NetConnection 127.0.0.1 -Port 1433
  - netstat -ano | findstr :1433
- Backend startup commands:
  - npm install
  - npm run dev --workspace apps/api
- Smoke test commands:
  - GET /api/health/database
  - GET /api/schema/tables
  - POST /api/query/execute with SELECT DB_NAME() AS CurrentDatabase
  - GET /api/query/history
- Expected result for each smoke test
- Common troubleshooting notes:
  - Root URL returning Route GET:/ not found is expected
  - GET /api/query/execute returning 404 is expected because the endpoint is POST-only
  - Failed to connect to 127.0.0.1:1433 means SQL Server TCP/IP or port configuration is wrong
  - Login failed for user means credential, auth mode, or database user mapping issue

2. Add consolidated diagnostic response types.

Use an existing database or health type file if appropriate.

The diagnostic response must include:

success: true
data:
  api: ok
  database:
    status: ok or failed
    isConnected: boolean
    databaseName: string or null
    serverName: string or null
    message: string
  schema:
    status: ok or failed
    tableCount: number
    relationshipCount: number
    message: string

3. Add service-layer diagnostic logic.

Use an existing service file if appropriate, preferably the database metadata or health-related service.

Implement a function that:

- calls the existing database health check
- calls the existing schema metadata function
- returns the consolidated diagnostic response
- marks database.status as ok only when database health reports connected
- marks database.status as failed otherwise
- marks schema.status as ok only when schema metadata succeeds
- marks schema.status as failed when schema metadata throws or returns a failure response
- returns tableCount and relationshipCount from schema metadata
- does not expose raw database errors or SQL Server driver objects

4. Add route.

Update the existing health route registration.

Add:

GET /api/health/full

The route must remain thin and delegate to the diagnostic service function.

5. Add tests.

Add or update tests for:

- successful /api/health/full response shape
- database failure represented in diagnostic response
- schema failure represented in diagnostic response
- health route delegates to the service if existing route test patterns support this
- existing /api/health/database behavior remains unchanged

Use mocks where existing tests use mocks. Do not require a live database for unit tests.

6. Do not change:

- query execution endpoint behavior
- SQL safety validation
- query result normalization
- query history behavior
- schema endpoint response contract
- database scripts
- frontend files
- SSOT documents
- runtime architecture

7. Run:

npm test --workspace apps/api

## Gemini Audit Prompt

Audit WP-013 implementation for Sequel City Web Detective.

Goal:
Verify that backend runtime smoke-test documentation and the consolidated health diagnostic endpoint were added without changing existing backend behavior.

Scope the audit to:

- changed files
- directly imported health, database metadata, and schema service files
- related tests
- the new runtime documentation file

Do not perform a full repository audit.

Check:

1. Does docs/02-runtime/Backend-Setup-and-Validation.md exist?
2. Does the documentation identify apps/api/.env as the required environment file?
3. Does the documentation list SQLSERVER_HOST, SQLSERVER_PORT, SQLSERVER_DATABASE, SQLSERVER_USER, SQLSERVER_PASSWORD, and SQLSERVER_TRUST_SERVER_CERTIFICATE?
4. Does the documentation explain SQL Server TCP/IP and port 1433 requirements?
5. Does the documentation explain SQL Server authentication and db_datareader requirements?
6. Does the documentation include backend startup commands?
7. Does the documentation include smoke tests for health, schema, query execution, and query history?
8. Does the documentation explain expected smoke test responses?
9. Does the documentation include troubleshooting notes for common setup failures?
10. Does GET /api/health/full exist?
11. Does GET /api/health/full return success true when diagnostics complete?
12. Does the response include data.api?
13. Does the response include data.database?
14. Does the response include data.schema?
15. Is database.status ok only when database health succeeds?
16. Is database.status failed when database health fails?
17. Is schema.status ok only when schema metadata succeeds?
18. Is schema.status failed when schema metadata fails?
19. Are schema tableCount and relationshipCount deterministic counts?
20. Does the route remain thin?
21. Is diagnostic logic implemented in the service layer?
22. Are raw database driver objects not returned?
23. Are existing endpoints left unchanged?
24. Are tests present for successful diagnostic response?
25. Are tests present for database failure response?
26. Are tests present for schema failure response?
27. Do all API tests pass?
28. Were any frontend files changed?
29. Were any database files changed?
30. Were any SSOT files changed?
31. Was any AI, LLM, or heuristic behavior introduced?

Report findings using this format:

Gemini Audit Results

Status: PASS or FAIL

Summary:

- ...

Evidence:

- ...

Issues Found:

- None

If issues exist, include:

Required Fixes:

1. ...
2. ...

## Codex Results

Added unit coverage in [databaseMetadataService.test.ts](/D:/GitHub-Repos/SequelCityWeb/apps/api/src/services/databaseMetadataService.test.ts:1) and [healthRoutes.test.ts](/D:/GitHub-Repos/SequelCityWeb/apps/api/src/routes/healthRoutes.test.ts:1), and wired them into [apps/api/package.json](/D:/GitHub-Repos/SequelCityWeb/apps/api/package.json:1).

Verification: `npm test --workspace apps/api` passed. The suite still emits existing `MODULE_TYPELESS_PACKAGE_JSON` warnings, but they are non-failing and were not changed here.

## Gemini Audit Results

Gemini Audit Results

Status: PASS

Summary:

- Verified that `docs/02-runtime/Backend-Setup-and-Validation.md` exists and contains comprehensive setup instructions, environment variable requirements, and smoke tests.
- Confirmed the implementation of `GET /api/health/full` which provides a consolidated diagnostic view of the API, Database, and Schema status.
- Validated that the diagnostic logic is correctly encapsulated in `databaseMetadataService.ts` and that routes remain thin.
- Ensured that the diagnostic response contract matches the requested shape and uses deterministic counts for schema metadata.
- Confirmed that existing endpoints and behavior remain unchanged and that no raw database driver objects are exposed.
- Verified test coverage for both success and failure scenarios in `healthRoutes.test.ts` and `databaseMetadataService.test.ts`.
- Confirmed that no frontend, database, or SSOT files were changed, and no AI/LLM logic was introduced.

Evidence:

- **Documentation:** `docs/02-runtime/Backend-Setup-and-Validation.md` identifies `apps/api/.env`, lists all required `SQLSERVER_*` variables, and explains TCP/IP/1433 and `db_datareader` requirements.
- **Route Implementation:** `apps/api/src/routes/healthRoutes.ts` implements `/api/health/full` and preserves the 503 status code behavior for database connectivity failures.
- **Service Logic:** `apps/api/src/services/databaseMetadataService.ts` implements `getBackendDiagnostics`, aggregating health and schema metadata without exposing internal driver details.
- **Tests:** `apps/api/src/services/databaseMetadataService.test.ts` includes explicit tests for database failure, schema failure, and schema loader exceptions.
- **Isolation:** `apps/web` does not exist (no frontend changes); `database/` and `docs/00-ssot/` directories remain unchanged. `grep` search confirms no AI/LLM heuristics in backend services.

Issues Found:

- None
  Warning: 256-color support not detected. Using a terminal with at least 256-color support is recommended for a better visual experience.
  Ripgrep is not available. Falling back to GrepTool.

## Final Decision

Status: Accepted

The implementation satisfies all WP-013 requirements and represents a successful transition from backend feature development to runtime stabilization.

The backend runtime validation checklist is complete and clearly documents environment configuration, SQL Server setup requirements, startup instructions, and a deterministic smoke test workflow. The documentation correctly identifies the `.env` location, required variables, and common failure scenarios encountered during local setup.

The consolidated diagnostic endpoint `GET /api/health/full` is implemented correctly and provides a deterministic, structured view of API, database, and schema status. The response contract matches the required format, and status values are derived strictly from existing deterministic service behavior.

Diagnostic logic is properly encapsulated in the service layer, and routes remain thin. No raw database driver objects or internal errors are exposed.

Test coverage includes both success and failure scenarios for database and schema diagnostics, and all existing tests pass without regression. No changes were made to frontend files, database scripts, or SSOT documents.

No violations of scope, constraints, or architectural principles were identified.
