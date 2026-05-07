# Testing Strategy Documentation

This package documents the current testing strategy and deterministic validation model for Sequel City Web Detective.

Scope rules for this package:

- document current testing assumptions only
- reflect the implemented local-first runtime under `apps/web` and `apps/api`
- treat backend validation and execution as authoritative
- treat SQL Server query results and schema metadata as authoritative
- treat the frontend as presentation-only
- do not introduce speculative CI/CD, cloud, production, or runtime AI testing scope

## Package Contents

| Document | Purpose |
|---|---|
| `testing-philosophy.md` | Core testing principles and authority boundaries |
| `backend-validation-testing.md` | Backend service and route validation expectations |
| `frontend-rendering-testing.md` | Frontend rendering expectations and presentation-only limits |
| `api-contract-verification.md` | API contract verification guidance for implemented endpoints |
| `deterministic-query-testing.md` | Query safety, execution, normalization, and repeatability testing |
| `manual-testing-boundaries.md` | Manual validation expectations for the local runtime |
| `local-runtime-test-scenarios.md` | Practical local scenarios for deterministic runtime checks |
| `non-goals-and-excluded-test-scope.md` | Testing scope that is intentionally excluded from the current project |
| `diagrams/testing-flow.md` | Lightweight deterministic testing flow diagram |

## Source Alignment

This package is aligned to:

- `docs/00-ssot/SSOT-Architecture.md`
- `docs/00-ssot/SSOT-SQL-Safety-Rules.md`
- `docs/00-ssot/SSOT-Database-Schema.md`
- `docs/00-ssot/SSOT-AI-Agent-Boundaries.md`
- `docs/06-architecture/deterministic-execution-model.md`
- `docs/07-api-contracts/README.md`
- `docs/08-database/README.md`
- `docs/09-release-readiness/local-runtime-requirements.md`
- `docs/10-user-journey/query-feedback-loop.md`

## Current Testing Boundary

The current repository includes backend tests for SQL safety, query execution, result normalization, schema metadata, query history, database metadata, and selected route behavior. It also includes frontend tests for API client behavior, the app shell, health status, query running, results rendering, and query history rendering.

This package documents how those current test areas support deterministic validation. It does not add new automated tests, new infrastructure, or new runtime behavior.
