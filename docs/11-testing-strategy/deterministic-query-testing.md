# Deterministic Query Testing

## Purpose

Deterministic query testing verifies the complete learner SQL feedback loop: submit SQL, validate safety, block or execute, normalize results, record history, and render the backend response.

## Safety Validation Cases

Backend tests should include representative cases for:

- empty input
- whitespace-only input
- simple `SELECT`
- `SELECT` with joins, filters, grouping, or ordering
- `WITH` resolving to `SELECT`
- `WITH` resolving to a blocked statement
- multiple executable statements
- blocked mutation statements
- blocked administrative statements
- unknown statement types

Each case should assert deterministic safety fields rather than broad string matching alone.

## Read-Only Execution Verification

Tests should verify that blocked SQL never reaches the execution layer. This is the central read-only guarantee for learner-submitted SQL.

Allowed SQL may reach SQL Server only after backend safety approval. Execution tests can use injected executors to prove this path without depending on a live local database.

## Result Normalization Verification

Result normalization tests should verify stable shaping for:

- column names
- column ordinals
- data type hints
- raw normalized values
- display values
- row counts
- null and unsupported value behavior

Normalization should preserve database-backed content while making the response predictable for frontend rendering.

## Repeatability Expectations

For the same SQL text and same database state:

- safety verdicts should be the same
- response shape should be the same
- normalized result structure should be stable
- blocked-query behavior should be the same

Execution duration, timestamps, and generated history ids may vary and should be tested only through controlled factories or shape-oriented assertions.

## Runtime Query Checks

Manual local runtime checks should include:

- a known safe smoke-test query such as `SELECT DB_NAME() AS CurrentDatabase`
- a query that returns visible rows from a known table
- a blocked mutation query such as `DELETE FROM SomeTable`
- malformed SQL that passes safety but fails database execution
- query history review after success, blocked, and failed attempts

Manual checks must use the local backend and restored `SequelCityCrimesDB`. They should not assume cloud databases or external services.
