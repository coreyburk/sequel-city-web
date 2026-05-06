# Frontend First-Launch Validation

## Purpose

This document defines the deterministic first-launch validation workflow for the React frontend in `apps/web`. Use it to verify that the frontend can start, reach the backend, render the expected diagnostic panels, and complete the first browser-based query flow without changing product scope.

## Prerequisites

- Repository dependencies installed from the repository root with `npm install`
- Backend environment configured at `apps/api/.env`
- SQL Server running and reachable for the backend runtime checks
- Two terminals available so backend and frontend can run at the same time
- A browser available for the frontend launch check

## Runtime Targets

- Backend startup command: `npm run dev --workspace apps/api`
- Frontend startup command: `npm run dev --workspace apps/web`
- Expected backend URL: `http://127.0.0.1:3001`
- Expected frontend URL: the Vite local URL reported by the frontend dev server

## Browser Launch Checklist

1. Start the backend with `npm run dev --workspace apps/api`.
2. Confirm the backend is listening at `http://127.0.0.1:3001`.
3. Start the frontend with `npm run dev --workspace apps/web`.
4. Capture the Vite local URL printed by the frontend dev server.
5. Open that Vite local URL in a browser.
6. Confirm the page is not blank.
7. Confirm the `Sequel City Web Detective` title is visible.
8. Confirm these sections render:
   - Health Status
   - Schema Explorer
   - Query Runner
   - Query History

## Health Panel Validation

- Expected API request: `GET /api/health/full`
- Confirm the panel renders API status.
- Confirm the panel renders database status and message.
- Confirm the panel renders schema status and message.
- Confirm database name and server name display when the backend is connected.
- Confirm table count and relationship count display when schema metadata is available.
- If the backend is unavailable, confirm the panel renders an error message instead of crashing.

## Schema Explorer Validation

- Expected API request: `GET /api/schema/tables`
- Confirm the table and relationship counts render.
- Confirm tables load into the selectable list.
- Confirm selecting a table updates the details panel.
- Confirm column rows render with data type, nullable, PK, and FK values.
- If schema loading fails, confirm the panel renders an error message instead of crashing.

## Query Runner Validation

- Use this deterministic smoke-test query:

```sql
SELECT DB_NAME() AS CurrentDatabase
```

- Confirm submission goes to `POST /api/query/execute`.
- Confirm the returned safety message renders.
- Confirm the returned backend message renders.
- Confirm execution time renders.
- If the backend reports safety violations or execution failure, confirm the UI shows the failure message instead of crashing.

## Query Results Validation

- Confirm the query results section renders after a successful query.
- Confirm the `CurrentDatabase` column header is visible for the smoke-test query.
- Confirm the returned row displays `SequelCityCrimesDB` when the backend is connected to the expected database.
- Confirm the displayed row count matches the response row count.
- Confirm zero-row responses render `No rows returned.` instead of an empty or broken table.

## Query History Validation

- Expected API request: `GET /api/query/history`
- Confirm the history panel loads without crashing.
- Confirm `No query history yet.` renders when the history response is empty.
- After running the smoke-test query, use `Refresh History`.
- Confirm the newest record appears with timestamp, outcome, query text, row count, execution time, and error values.

## CORS Validation

- With both servers running, confirm browser requests from the Vite origin to `http://127.0.0.1:3001` complete without CORS rejection.
- Use browser developer tools to inspect failed requests if any request does not complete.
- If a CORS failure occurs, record the request path, browser error text, and response headers in the issue capture section.

## Issue Capture Format

Record each issue with this structure:

- Observed behavior:
- Expected behavior:
- Reproduction steps:
- Likely area:
- Blocking status: blocking or non-blocking
- Recommended follow-up:

## Known Issues

- Current repository state on 2026-05-05: frontend runtime validation is blocked before browser launch because the `apps/web` workspace toolchain is not installed locally.
- Observed command failures:
  - `npm run dev --workspace apps/web` fails with `'vite' is not recognized as an internal or external command`
  - `npm test --workspace apps/web` fails with `'vitest' is not recognized as an internal or external command`
  - `npm run build --workspace apps/web` fails because `vite`, `@vitejs/plugin-react`, and `vitest/globals` are not resolvable
- Code inspection completed despite the blocked runtime:
  - `apps/web/package.json` defines a `dev` script
  - the root workspace configuration includes `apps/web`
  - `apps/web/src/main.tsx` renders React into `#root`
  - `apps/web/src/api/client.ts` defaults the API base URL to `http://127.0.0.1:3001`
  - `VITE_API_BASE_URL` override support remains implemented
  - empty-state handling exists for query history and zero-row query results

## Final First-Launch Decision

- Decision: blocked
- Reason: the frontend source appears wired correctly for first launch, but deterministic browser validation could not be completed because the local workspace is missing installed frontend runtime and test dependencies.
- Exit criteria to resume validation:
  1. Run `npm install` successfully from the repository root so `vite` and `vitest` are available for `apps/web`.
  2. Re-run `npm run dev --workspace apps/web`.
  3. Complete the browser checklist and record pass or fail for each validation section above.
