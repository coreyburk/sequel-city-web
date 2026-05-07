# Query Feedback Loop

## Purpose

This document describes the deterministic loop between learner SQL input and backend-owned feedback.

## Loop Summary

Learner input moves through a fixed path:

1. learner writes SQL
2. frontend submits raw SQL text
3. backend validates safety
4. backend either blocks or executes
5. backend returns a deterministic response
6. frontend renders the response
7. learner decides the next query

## Query States

| State | What happens | Authority |
|---|---|---|
| Submitted | SQL text is sent to `POST /api/query/execute` | Frontend transport only |
| Validated | Statement type and safety rules are checked | Backend |
| Blocked | No database call occurs | Backend |
| Executed | Approved SQL runs against SQL Server | Backend plus database |
| Normalized | Raw rows are shaped into stable API output | Backend |
| Presented | Messages and results are rendered | Frontend |
| Interpreted | Learner decides what the result means | Learner |

## Blocked Query Behavior

When the SQL is empty, multi-statement, non-read-only, or otherwise disallowed:

- the backend returns `success: false`
- the backend includes a deterministic safety result
- the backend does not execute the SQL against the database
- the frontend renders the backend message and any violations
- the learner must revise the query

## Execution Failure Behavior

When the SQL is allowed but execution fails:

- the backend returns `success: false`
- the safety verdict still reports that the SQL was allowed
- the frontend renders the deterministic failure message
- the learner must correct the query or environment issue

## Successful Execution Behavior

When the SQL is allowed and executes:

- the backend returns normalized columns, rows, and row count
- the frontend renders the data without reinterpretation
- the learner uses the returned evidence to decide the next step

## Educational Value

This loop is intentionally stable:

- the same query is judged by the same backend rules
- blocked behavior is consistent
- result shaping is consistent
- the learner can refine hypotheses through repeatable feedback

## Current Runtime Notes

The current runtime also records each blocked, failed, or successful query in backend in-memory history. That history helps the learner review prior attempts, but it is not persistent evidence storage or correctness tracking.
