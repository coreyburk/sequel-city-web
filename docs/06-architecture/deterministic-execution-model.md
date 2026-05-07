# Deterministic Execution Model

## Purpose

This document describes how the currently implemented backend keeps query execution deterministic, backend-owned, and read-only.

## Deterministic Principles

The current execution model is based on these rules:

- the frontend submits SQL text but does not decide whether it can run
- the backend validates every submitted query
- only approved read-oriented queries can reach SQL Server
- database results are normalized, not reinterpreted
- execution outcomes are recorded consistently in backend query history
- no runtime AI participates in validation or execution

## Current Safety Model

The SQL safety service is the first authority check before database execution.

Current behavior:

- empty SQL is blocked
- multiple statements are blocked
- `SELECT` is allowed
- `WITH` is allowed only when it resolves to a top-level `SELECT`
- mutating or administrative statements are blocked before execution

Current blocked statement families include:

- `INSERT`
- `UPDATE`
- `DELETE`
- `DROP`
- `ALTER`
- `CREATE`
- `TRUNCATE`
- `MERGE`
- `EXEC`
- `EXECUTE`
- `GRANT`
- `REVOKE`
- `DENY`
- `BACKUP`
- `RESTORE`
- `USE`

## Execution Path

When a query is submitted:

1. `queryRoutes.ts` validates that the request body contains a string `sql` field.
2. `queryExecutionService.ts` calls `validateSqlSafety`.
3. If blocked, the backend returns a failure response and records a blocked history entry.
4. If allowed, the backend executes the SQL through the SQL Server pool.
5. `queryResultNormalizer.ts` converts the raw recordset into deterministic `columns`, `rows`, and `rowCount`.
6. The backend records a success or failed execution outcome in query history.
7. The frontend renders the returned response as-is.

## Normalization Model

Successful query results are normalized into:

- ordered columns
- per-column data type hints
- row values
- display values
- row count

This keeps the response contract stable for the frontend while preserving database-backed result content.

## Query History Model

The current query history service records:

- query text
- outcome
- row count
- execution time
- error message
- generated record id
- generated timestamp

This service is deterministic in behavior but currently process-local and in-memory only.

## Read-Only Boundary

The read-only boundary is enforced in the backend before SQL Server execution. The frontend cannot bypass this by UI logic because the database is only reachable through the backend.

## Current Non-Implemented Deterministic Features

The current codebase does not yet implement:

- deterministic suspect verification flow
- deterministic case progression service
- notebook-backed evidence recording
- persistent execution history

Those ideas exist in SSOT direction, but they are not part of the active runtime execution model yet.
