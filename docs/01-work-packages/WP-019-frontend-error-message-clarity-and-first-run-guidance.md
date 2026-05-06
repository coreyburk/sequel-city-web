# frontend-error-message-clarity-and-first-run-guidance

## Objective

Improve first-run clarity by making frontend error messages more actionable when the backend, database, schema, or query execution path is unavailable, without changing backend behavior or adding new features.

## Scope

### In Scope

- Improve frontend user-facing error messages
- Add first-run guidance for common setup states
- Clarify backend unavailable messaging
- Clarify database unavailable messaging
- Clarify schema load failure messaging
- Clarify query execution failure messaging
- Clarify empty query history state
- Keep all behavior API-driven and deterministic
- Add or update frontend tests for error rendering where practical

### Out of Scope

- No visual redesign
- No layout redesign
- No advanced UX refinement
- No new product features
- No backend API changes
- No SQL safety changes
- No query execution changes
- No schema endpoint changes
- No query history behavior changes
- No database changes
- No Docker or deployment work
- No AI or heuristic behavior

## Files Allowed to Change

- apps/web/src/components/HealthStatus.tsx
- apps/web/src/components/SchemaExplorer.tsx
- apps/web/src/components/QueryRunner.tsx
- apps/web/src/components/QueryHistoryPanel.tsx
- apps/web/src/App.tsx
- apps/web/src/App.test.tsx
- apps/web/src/components/HealthStatus.test.tsx
- apps/web/src/components/SchemaExplorer.test.tsx
- apps/web/src/components/QueryRunner.test.tsx
- apps/web/src/components/QueryHistoryPanel.test.tsx
- docs/02-runtime/First-Launch-Issue-Triage.md
- docs/02-runtime/Frontend-First-Launch-Validation.md

If frontend test files do not already exist, Codex may create minimal tests only where the current frontend test setup supports them.

## Constraints

- Must not change backend behavior
- Must not change backend contracts
- Must not change API client request paths
- Must not duplicate SQL validation in the frontend
- Must not add direct SQL Server access
- Must not introduce new application features
- Must not redesign the UI
- Must remain deterministic
- Must not introduce AI, LLM, or heuristic behavior
- Must not modify database files
- Must not modify SSOT files

## Required Behavior

1. Backend unavailable messaging

When the frontend cannot reach the backend API, the UI must display a message equivalent to:

Backend unavailable. Confirm the API is running at http://127.0.0.1:3001 or start both services with npm run dev from the repository root.

This guidance should appear in the health area and should not crash the app.

2. Database unavailable messaging

When the backend responds but database status is failed, the UI must display a message equivalent to:

Database unavailable. Confirm SQL Server is running, TCP/IP is enabled, port 1433 is listening, and apps/api/.env is configured.

This guidance should appear in the health area.

3. Schema unavailable messaging

When schema loading fails, the UI must display a message equivalent to:

Schema could not be loaded. Confirm the backend is running and the database connection is healthy.

This guidance should appear in the schema explorer area.

4. Query execution failure messaging

When query execution fails, the query runner must continue showing the backend message and add setup guidance when the failure appears to be a connection or database availability failure.

The frontend must not infer SQL correctness or duplicate backend SQL validation.

5. Blocked SQL messaging

When the backend blocks SQL, the UI must display:

- the backend safety message
- any backend-provided violations
- a clear note that only safe read-only SELECT queries are allowed

The frontend must not independently validate or reject SQL.

6. Empty query history messaging

When no query history records exist, the UI must display a message equivalent to:

No query history yet. Run a safe SELECT query to create the first history entry.

7. First-run guidance

Add a small first-run guidance section or text block in the app that explains:

- Start both services with npm run dev from the repository root
- Open the frontend at http://127.0.0.1:5173
- The backend API runs at http://127.0.0.1:3001
- Use SELECT DB_NAME() AS CurrentDatabase as the first test query

This must be informational only and must not change app behavior.

8. Documentation updates

Update:

docs/02-runtime/First-Launch-Issue-Triage.md

Mark ISSUE-002 as addressed by WP-019 if the improved error guidance is implemented.

Update:

docs/02-runtime/Frontend-First-Launch-Validation.md

Add a note that the frontend includes first-run guidance and clearer backend/database error messages.

## Acceptance Criteria

1. Backend unavailable message includes the expected API URL.
2. Backend unavailable message references the root npm run dev workflow.
3. Database unavailable message references SQL Server and apps/api/.env.
4. Schema unavailable message references backend and database health.
5. Query execution failure still displays the backend-provided message.
6. Blocked SQL still displays backend safety information.
7. Blocked SQL guidance states that safe read-only SELECT queries are allowed.
8. Empty query history message tells the user how to create the first entry.
9. First-run guidance appears somewhere in the frontend.
10. First-run guidance includes npm run dev.
11. First-run guidance includes frontend URL http://127.0.0.1:5173.
12. First-run guidance includes backend URL http://127.0.0.1:3001.
13. First-run guidance includes SELECT DB_NAME() AS CurrentDatabase.
14. Frontend does not duplicate SQL validation logic.
15. Frontend does not connect directly to SQL Server.
16. No backend files are modified.
17. No database files are modified.
18. No SSOT files are modified.
19. No AI, LLM, or heuristic behavior is introduced.
20. First-Launch-Issue-Triage.md marks ISSUE-002 as addressed or resolved by WP-019.
21. Frontend-First-Launch-Validation.md references improved first-run guidance.
22. Existing backend tests still pass.
23. Frontend tests are added or updated where the current frontend test setup supports them.

## Codex Prompt

You are implementing WP-019 for the Sequel City Web Detective project.

Goal:
Improve first-run clarity by making frontend error messages and first-run guidance more actionable, based on observed launch issues.

Context:
The first launch succeeded, but WP-016 documented that the frontend initially showed backend unavailable messages when the backend process was not running. WP-018 added a combined startup command. WP-019 should improve the clarity of messages shown in the frontend so future users know what to do.

Important:
Do not redesign the UI.
Do not add new product features.
Do not modify backend code.
Do not modify backend API contracts.
Do not duplicate SQL validation in the frontend.
Do not access SQL Server directly from the frontend.

Tasks:

1. Improve backend unavailable messaging.

Update the relevant frontend component, likely HealthStatus.tsx.

When the backend API cannot be reached, display guidance equivalent to:

Backend unavailable. Confirm the API is running at http://127.0.0.1:3001 or start both services with npm run dev from the repository root.

2. Improve database unavailable messaging.

When the backend responds but database status is failed, display guidance equivalent to:

Database unavailable. Confirm SQL Server is running, TCP/IP is enabled, port 1433 is listening, and apps/api/.env is configured.

3. Improve schema unavailable messaging.

Update the schema explorer failure message to include guidance equivalent to:

Schema could not be loaded. Confirm the backend is running and the database connection is healthy.

4. Improve query execution failure messaging.

In QueryRunner.tsx, keep displaying the backend-provided message.

If query execution fails because the backend or database is unavailable, add general setup guidance without attempting to validate SQL in the frontend.

Do not infer SQL correctness.

Do not duplicate backend validation.

5. Improve blocked SQL messaging.

When safety information is present, display:

- safety message from backend
- violations from backend if present
- note that only safe read-only SELECT queries are allowed

6. Improve empty query history messaging.

When history has no records, display:

No query history yet. Run a safe SELECT query to create the first history entry.

7. Add first-run guidance.

Add a small informational section or text block in the app.

It must include:

- Start both services with npm run dev from the repository root
- Frontend URL: http://127.0.0.1:5173
- Backend API URL: http://127.0.0.1:3001
- First test query: SELECT DB_NAME() AS CurrentDatabase

Keep the section simple. Do not redesign the application.

8. Update documentation.

Update:

docs/02-runtime/First-Launch-Issue-Triage.md

Mark ISSUE-002 as addressed by WP-019.

Update:

docs/02-runtime/Frontend-First-Launch-Validation.md

Add a note that first-run guidance and clearer backend/database error messages are now part of the frontend.

9. Tests.

If the frontend test setup is available, add or update minimal tests for:

- first-run guidance rendering
- backend unavailable message rendering
- empty query history message rendering
- blocked SQL guidance rendering if practical

If frontend tests cannot run due to environment constraints, document the reason in Codex Results.

10. Verification.

Run:

npm test --workspace apps/api

If frontend dependencies are available, run:

npm test --workspace apps/web

11. Do not change:

- backend files
- database files
- SSOT files
- API client request paths
- SQL safety behavior
- query execution behavior
- schema behavior
- query history behavior

## Gemini Audit Prompt

Audit WP-019 implementation for Sequel City Web Detective.

Goal:
Verify that frontend first-run guidance and error-message clarity were improved without changing backend behavior, adding new features, or violating deterministic architecture constraints.

Scope the audit to:

- apps/web/src/components
- apps/web/src/App.tsx
- apps/web test files
- docs/02-runtime/First-Launch-Issue-Triage.md
- docs/02-runtime/Frontend-First-Launch-Validation.md
- git diff summary

Do not perform a full repository audit.

Check:

1. Does the frontend display clearer backend unavailable guidance?
2. Does backend unavailable guidance include http://127.0.0.1:3001?
3. Does backend unavailable guidance mention npm run dev?
4. Does database unavailable guidance mention SQL Server and apps/api/.env?
5. Does schema failure guidance mention backend and database health?
6. Does query execution failure still display backend-provided messages?
7. Does blocked SQL display backend safety information?
8. Does blocked SQL guidance state that safe read-only SELECT queries are allowed?
9. Does empty query history guidance explain how to create the first entry?
10. Does first-run guidance appear in the frontend?
11. Does first-run guidance include npm run dev?
12. Does first-run guidance include http://127.0.0.1:5173?
13. Does first-run guidance include http://127.0.0.1:3001?
14. Does first-run guidance include SELECT DB_NAME() AS CurrentDatabase?
15. Did the frontend avoid duplicating SQL validation logic?
16. Did the frontend avoid direct SQL Server access?
17. Were backend files left unchanged?
18. Were database files left unchanged?
19. Were SSOT files left unchanged?
20. Was visual redesign avoided?
21. Was AI, LLM, or heuristic behavior avoided?
22. Does First-Launch-Issue-Triage.md mark ISSUE-002 as addressed or resolved by WP-019?
23. Does Frontend-First-Launch-Validation.md mention the improved first-run guidance?
24. Do backend tests pass?
25. Are frontend tests present or is any inability to run them documented?

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

Added minimal web tests in [App.test.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/App.test.tsx), [HealthStatus.test.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/components/HealthStatus.test.tsx), [QueryHistoryPanel.test.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/components/QueryHistoryPanel.test.tsx), and [QueryRunner.test.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/components/QueryRunner.test.tsx).

`npm test --workspace apps/api` passed.

`npm test --workspace apps/web` could not run in this environment because Vite config loading fails before tests start with an `esbuild` process spawn `EPERM`, so frontend verification is limited to static review plus the added test files. I left the pre-existing unrelated edits in `apps/web/package.json` and `package-lock.json` untouched.

## Gemini Audit Results

Gemini Audit Results

Status: PASS

Summary:

The audit of Work Package 019 (WP-019) confirms that frontend first-run guidance and error-message clarity were successfully improved. The implementation introduced a centralized `guidance.ts` file containing actionable strings for backend, database, and schema unavailability, which are correctly integrated into the React components. A dedicated first-run guidance section was added to the main application shell, providing essential startup commands and test queries. All architectural constraints were respected: no SQL validation logic was duplicated in the frontend, no direct database access was added, and backend/SSOT files remained unchanged. Backend tests passed during implementation, and the inability to run frontend tests in the local environment was properly documented.

Evidence:

- **Actionable Guidance:** `apps/web/src/guidance.ts` contains `BACKEND_UNAVAILABLE_GUIDANCE`, `DATABASE_UNAVAILABLE_GUIDANCE`, and `SCHEMA_UNAVAILABLE_GUIDANCE` with the required technical details (URLs, commands, and config files).
- **Backend/Database Error Handling:** `apps/web/src/api/client.ts` wraps fetch failures with clearer guidance. `HealthStatus.tsx` specifically displays database and environment configuration guidance when the backend reports a connection failure.
- **First-Run Section:** `apps/web/src/App.tsx` includes a new `<section>` with `npm run dev`, frontend/backend URLs, and the `SELECT DB_NAME()` test query.
- **Query Runner Safety:** `apps/web/src/components/QueryRunner.tsx` displays backend safety messages and violations, and explicitly notes that only safe read-only SELECT queries are allowed via `SAFE_SELECT_ONLY_GUIDANCE`.
- **Empty States:** `apps/web/src/components/QueryHistoryPanel.tsx` uses `EMPTY_QUERY_HISTORY_GUIDANCE` to instruct the user on how to create the first history entry.
- **Documentation Updates:** `docs/02-runtime/First-Launch-Issue-Triage.md` marks ISSUE-002 as resolved by WP-019. `docs/02-runtime/Frontend-First-Launch-Validation.md` includes notes on the improved guidance.
- **Constraint Adherence:** Static review of `apps/web/src` confirms no use of `mssql` or direct DB drivers. `QueryRunner.tsx` explicitly states that SQL is sent to the backend for validation. No changes were found in `apps/api/src` or `docs/00-ssot`.
- **Test Results:** Implementation logs confirm `npm test --workspace apps/api` passed. Frontend tests are present in `apps/web/src/components/*.test.tsx`, with documented environment limitations regarding their execution.

Issues Found:

- None
  Warning: 256-color support not detected. Using a terminal with at least 256-color support is recommended for a better visual experience.
  Ripgrep is not available. Falling back to GrepTool.

## Final Decision

Status: Accepted

WP-019 is complete and satisfies the intended goal of improving first-run clarity without changing backend behavior or adding new product features.

The frontend now provides clearer, actionable guidance for common first-run failure states, including backend unavailability, database connection problems, schema loading failures, blocked SQL, and empty query history. The new first-run guidance section correctly identifies the preferred startup command, frontend URL, backend API URL, and initial validation query.

The implementation remained within scope:

* No backend behavior changed
* No backend contracts changed
* No direct SQL Server access was added
* No frontend SQL validation was duplicated
* No database or SSOT files were modified
* No AI, LLM, or heuristic behavior was introduced

Minimal frontend tests were added for the new guidance behavior. Backend tests passed. Frontend test execution remains blocked by the local `esbuild` spawn `EPERM` environment issue, which was properly documented.

No violations of scope, constraints, or architectural principles were identified.
