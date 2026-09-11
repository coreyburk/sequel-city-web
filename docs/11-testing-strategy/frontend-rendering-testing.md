# Frontend Rendering Testing

## Purpose

Frontend rendering testing verifies that the React application presents backend-owned health, schema, query, and history responses clearly without becoming the authority for validation or evidence truth.

## Current Frontend Test Areas

The current frontend test structure includes tests for:

- API client behavior
- app shell rendering
- health status rendering
- query runner interaction
- query results table rendering
- query history panel rendering

These tests should stay focused on rendering, user interaction, and request handling.

## Rendering Expectations

Frontend tests should verify that the UI can render:

- backend availability guidance
- database health status
- schema tables and columns returned by the backend
- successful query result columns and rows
- backend safety and execution messages
- blocked query feedback
- query history records returned by the backend
- suspect verification success and failure messages returned by the backend

The frontend should render backend-provided facts as presentation data. It should not synthesize schema, infer hidden evidence, or claim correctness from UI-only state.

## Interaction Expectations

Frontend interaction tests should verify that:

- learner SQL input is collected as text
- submitted SQL is sent to the backend API client
- successful responses update result presentation
- blocked or failed responses show backend messages
- loading and error states remain understandable
- history refresh behavior uses backend history responses
- suspect verification submissions call the backend case verification endpoint and render returned verdict text

Frontend tests may mock API client responses. Mocked responses should match the documented API contracts and should not introduce unsupported runtime behavior.

## Case 001 Released Live Smoke

`apps/web/tests/browser/case-001-live-smoke.spec.ts` is the narrow exception to the mocked Student Mode browser model. It is opt-in with `CASE_001_LIVE_SMOKE=1`, starts from normal released Case 001 entry, and submits M1 and M2 SQL evidence checks through `/api/query/execute`.

The smoke asserts non-spoiler milestone feedback, Query Lab and result rendering, M1/M2 completion, reload with API revalidation, and Case 001-only reset. It must not assert suspect verification, answer-key fields, or client storage as independent completion authority.

## Presentation-Only Boundary

Frontend tests must not assert that the frontend is the final authority for:

- SQL safety
- query execution
- schema truth
- database evidence
- suspect correctness
- case progression

Those concerns belong to the backend, SQL Server, or future deterministic backend services when implemented by scoped work packages.
