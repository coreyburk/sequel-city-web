# Testing Philosophy

## Purpose

Testing for Sequel City Web Detective verifies that the implemented runtime stays deterministic, local-first, backend-owned, and safe for repeatable SQL investigation.

## Core Principles

- backend behavior is authoritative for validation, execution, and response shaping
- SQL Server is authoritative for database contents, schema metadata, and evidence rows
- frontend tests verify rendering and transport behavior, not correctness authority
- read-only SQL guarantees must be validated before database execution
- deterministic response shapes matter as much as successful results
- local runtime checks must reflect the currently supported localhost setup

## Authority Boundaries

| Concern | Testing authority |
|---|---|
| SQL safety verdicts | Backend service and route tests |
| Query execution outcome | Backend service tests and local runtime checks |
| Schema truth | SQL Server metadata through backend-owned schema loading |
| Result presentation | Frontend rendering tests |
| User-facing messages | Backend response contracts rendered by frontend components |
| Runtime readiness | Manual local validation against documented startup requirements |

The frontend may display backend messages and normalized data, but it must not become the tested authority for SQL safety, schema truth, evidence truth, or case correctness.

## Deterministic Validation

Deterministic validation means the same input should move through the same backend rules and produce the same response structure, apart from expected runtime values such as execution duration or generated timestamps.

Tests should prefer stable assertions against:

- allowed or blocked safety outcomes
- violation codes and messages
- response body shape
- normalized columns, rows, and row counts
- frontend rendering of returned backend data
- documented local runtime readiness states

## Current Scope

The current testing strategy covers the implemented Fastify backend, React frontend, local SQL Server dependency, and deterministic API contracts.

It does not cover production operations, internet-facing security, cloud deployment, runtime AI behavior, multi-user behavior, or future case progression features that are not implemented in the active runtime.
