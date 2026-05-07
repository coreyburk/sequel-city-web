# Backend Validation Testing

## Purpose

Backend validation testing verifies that the Fastify API and backend services remain the authority for SQL safety, query execution, schema retrieval, response shaping, and query history behavior.

## Current Backend Test Areas

The current backend test structure includes service and route tests for:

- SQL safety validation
- query execution behavior
- query result normalization
- query history behavior
- schema metadata mapping
- database metadata behavior
- case verification behavior
- schema routes
- query history routes
- health routes
- case verification routes

These tests should continue to focus on backend-owned behavior and avoid shifting authority into frontend logic.

## SQL Safety Testing

SQL safety tests should verify deterministic outcomes for:

- empty SQL
- allowed single `SELECT` statements
- allowed `WITH` statements that resolve to a top-level `SELECT`
- blocked mutating statements
- blocked administrative statements
- blocked multiple statements
- invalid or unknown top-level statements

Expected assertions include:

- `isAllowed`
- `normalizedStatementType`
- violation codes
- violation messages
- blocked token reporting when applicable

## Query Execution Testing

Query execution tests should verify that:

- safety validation runs before any database execution
- blocked SQL does not call the query executor
- allowed SQL calls the query executor
- successful raw rows are normalized into stable response data
- execution failures return deterministic failure messages
- blocked, failed, and successful outcomes are recorded in query history

Tests may use injected executors or loaders where the implementation already supports dependency injection. They should not require a live database unless the test is explicitly a local runtime validation scenario.

## Schema Testing

Schema tests should verify that database metadata rows are mapped into the documented schema response shape:

- tables are sorted deterministically
- columns preserve ordinal order
- primary keys are associated with the correct tables and columns
- foreign key columns are marked correctly
- relationships are returned in a stable order

The backend may shape metadata for frontend use, but it must not invent schema facts.

## Route Testing

Route tests should verify implemented endpoint behavior only:

- health diagnostics return documented readiness information
- schema routes return success or deterministic failure shapes
- query execution rejects malformed request bodies
- history routes return backend-owned in-memory records
- case verification routes reject malformed suspect submissions and delegate valid submissions to backend services

Route tests should keep handlers thin and confirm that service-owned behavior remains service-owned.

## Case Verification Testing

Case verification tests should verify that:

- suspect names are trimmed before verification
- empty suspect names are rejected before database access
- database verdict text is returned without application-level answer interpretation
- database failures produce deterministic failure messages
- route failures do not expose raw database errors

Tests should not hard-code hidden suspect identities in application code.
