# frontend-runtime-smoke-test-and-first-launch-validation

## Objective

Validate that the newly created React frontend can launch successfully, connect to the running backend, render real API data, and support the first complete browser-based user flow.

## Scope

### In Scope

- Verify frontend startup command
- Verify frontend browser launch
- Verify backend API connectivity from the browser
- Verify CORS behavior
- Verify health panel loads real backend diagnostic data
- Verify schema explorer loads real schema metadata
- Verify query runner executes a safe SELECT query through the backend
- Verify normalized query results render correctly in the UI
- Verify query history updates after query execution
- Document first-launch validation steps and outcomes
- Capture any observed launch issues for later triage

### Out of Scope

- No UI redesign
- No UX refinement
- No styling polish
- No new frontend features
- No backend contract changes
- No query execution changes
- No SQL safety changes
- No database schema changes
- No Docker or deployment work
- No formal student user testing yet

## Files Allowed to Change

- docs/02-runtime/Frontend-First-Launch-Validation.md
- docs/02-runtime/Backend-Setup-and-Validation.md
- apps/web/README.md
- apps/web/package.json
- apps/web/src/App.tsx
- apps/web/src/api/client.ts
- apps/web/src/components/HealthStatus.tsx
- apps/web/src/components/SchemaExplorer.tsx
- apps/web/src/components/QueryRunner.tsx
- apps/web/src/components/QueryResultsTable.tsx
- apps/web/src/components/QueryHistoryPanel.tsx

Only make code changes if required to fix first-launch defects discovered during validation.

## Constraints

- Must not introduce new features beyond launch validation fixes
- Must not perform UX refinement or visual redesign
- Must not change backend API contracts
- Must not change backend query execution behavior
- Must not change SQL safety behavior
- Must not modify database schema or data scripts
- Must not introduce AI, LLM, or heuristic behavior
- Must preserve deterministic frontend-to-backend behavior
- Must document any observed issue rather than silently expanding scope

## Required Behavior

1. Create first-launch validation document

Create:

docs/02-runtime/Frontend-First-Launch-Validation.md

The document must include:

- Purpose
- Prerequisites
- Backend startup command
- Frontend startup command
- Expected backend URL
- Expected frontend URL
- Browser launch checklist
- API connectivity checks
- CORS validation check
- Health panel validation
- Schema explorer validation
- Query runner validation
- Query results validation
- Query history validation
- Known issues section
- Final first-launch decision section

2. Runtime validation steps

The validation document must include these steps:

Step 1: Start backend

Command:

npm run dev --workspace apps/api

Expected:

- Backend starts on http://127.0.0.1:3001
- GET /api/health/full returns a structured diagnostic response

Step 2: Start frontend

Command:

npm run dev --workspace apps/web

Expected:

- Frontend starts successfully
- Vite provides a local browser URL

Step 3: Open frontend in browser

Expected:

- App renders without blank screen
- App title is visible
- Core sections are visible:
  - health status
  - schema explorer
  - query runner
  - query history

Step 4: Validate health panel

Expected:

- API status displays
- Database status displays
- Schema status displays
- Database name displays when connected
- Table count displays when schema is available

Step 5: Validate schema explorer

Expected:

- Tables load from GET /api/schema/tables
- Real SequelCityCrimesDB tables are visible
- Selecting or expanding a table displays columns
- PK and FK indicators render when available

Step 6: Validate query runner

Use query:

SELECT DB_NAME() AS CurrentDatabase

Expected:

- Query submits through POST /api/query/execute
- Backend safety message displays
- Query success message displays
- Result table displays CurrentDatabase
- Row count displays

Step 7: Validate query history

Expected:

- GET /api/query/history loads
- After query execution, history can be refreshed
- Most recent query appears
- Outcome, timestamp, row count, and execution time display

Step 8: Capture issues

Any issue must be recorded in the validation document with:

- observed behavior
- expected behavior
- likely area
- recommended follow-up WP if needed

3. Code fixes

If first launch reveals small blocking defects, Codex may apply minimal fixes only for:

- incorrect frontend startup script
- incorrect API base URL behavior
- CORS-related frontend connectivity
- component crash on valid API response
- component crash on failed API response
- query history not refreshing due to API client issue

Do not make visual redesign changes.

Do not add new product features.

4. Documentation update

Update:

docs/02-runtime/Backend-Setup-and-Validation.md

Add a link or reference to:

docs/02-runtime/Frontend-First-Launch-Validation.md

5. Tests and verification

Run:

npm test --workspace apps/api

If frontend dependencies are installed, run:

npm test --workspace apps/web

If frontend tests cannot run because dependencies are not installed or unavailable, document the reason in the WP results.

## Acceptance Criteria

1. Frontend first-launch validation document exists.
2. Document includes backend startup command.
3. Document includes frontend startup command.
4. Document identifies expected backend URL.
5. Document identifies expected frontend URL.
6. Document includes browser launch checklist.
7. Document includes health panel validation steps.
8. Document includes schema explorer validation steps.
9. Document includes query runner validation steps.
10. Document includes query results validation steps.
11. Document includes query history validation steps.
12. Document includes issue capture format.
13. Backend setup documentation references the frontend validation document.
14. Frontend can be started with npm run dev --workspace apps/web or a blocking issue is documented.
15. Frontend browser launch is validated or a blocking issue is documented.
16. Browser-to-backend API connectivity is validated or a blocking issue is documented.
17. CORS behavior is validated or a blocking issue is documented.
18. Health panel rendering is validated or a blocking issue is documented.
19. Schema explorer rendering is validated or a blocking issue is documented.
20. Query execution from UI is validated or a blocking issue is documented.
21. Query results rendering is validated or a blocking issue is documented.
22. Query history display is validated or a blocking issue is documented.
23. Any code changes are limited to first-launch defects.
24. No visual redesign is introduced.
25. No backend API contracts are changed.
26. No SQL execution behavior is changed.
27. No SQL safety behavior is changed.
28. No database files are modified.
29. No AI, LLM, or heuristic behavior is introduced.
30. Existing backend tests pass.

## Codex Prompt

You are implementing WP-015 for the Sequel City Web Detective project.

Goal:
Validate the first runtime launch of the React frontend and document a deterministic first-launch checklist. This is not a UX refinement work package.

Context:
WP-014 created the first React + Vite + TypeScript frontend shell under apps/web. The frontend has not yet been manually launched and observed in the browser. This work package should verify launch behavior, document the validation workflow, and fix only small blocking first-launch defects if they are discovered.

Important:
Do not redesign the UI. Do not add new product features. Do not change backend contracts. Do not change SQL safety, query execution, query normalization, schema metadata semantics, or database scripts.

Tasks:

1. Create first-launch validation documentation.

Create:

docs/02-runtime/Frontend-First-Launch-Validation.md

Include:

- Purpose
- Prerequisites
- Backend startup command:
  npm run dev --workspace apps/api
- Frontend startup command:
  npm run dev --workspace apps/web
- Expected backend URL:
  http://127.0.0.1:3001
- Expected frontend URL:
  the Vite local URL reported by the frontend dev server
- Browser launch checklist
- Health panel validation
- Schema explorer validation
- Query runner validation
- Query results validation
- Query history validation
- CORS validation
- Issue capture format
- Known issues section
- Final first-launch decision section

2. Update backend setup documentation.

Update:

docs/02-runtime/Backend-Setup-and-Validation.md

Add a reference to:

docs/02-runtime/Frontend-First-Launch-Validation.md

3. Inspect frontend startup configuration.

Verify that:

- apps/web/package.json has a dev script
- the root workspace configuration supports npm run dev --workspace apps/web
- API base URL defaults to http://127.0.0.1:3001
- VITE_API_BASE_URL override remains supported if already implemented

4. Inspect frontend runtime behavior for obvious first-launch defects.

Check for likely blocking issues such as:

- missing React root element
- missing main.tsx render
- invalid imports
- invalid API client exports
- invalid component props
- invalid response shape assumptions
- crashes when API calls fail
- query history not rendering empty state
- QueryResultsTable not handling no results

Apply only minimal fixes needed for first launch.

5. Do not make UX refinements.

Do not change:

- visual design beyond small fixes needed to prevent broken rendering
- layout strategy
- component scope
- product behavior
- backend API contracts

6. Verification.

Run:

npm test --workspace apps/api

If frontend dependencies are installed, run:

npm test --workspace apps/web

If frontend tests cannot run because dependencies are unavailable, record the reason in the Codex Results.

7. Do not change:

- backend endpoint behavior
- SQL safety validation
- query execution logic
- query normalization logic
- schema metadata semantics
- query history semantics
- database scripts
- SSOT documents

## Gemini Audit Prompt

Audit WP-015 implementation for Sequel City Web Detective.

Goal:
Verify that the project now has a deterministic frontend first-launch validation workflow and that any code changes were limited to first-launch blocking defects.

Scope the audit to:

- docs/02-runtime/Frontend-First-Launch-Validation.md
- docs/02-runtime/Backend-Setup-and-Validation.md
- apps/web
- package workspace files if changed
- backend files only if they were changed

Do not perform a full repository audit.

Check:

1. Does docs/02-runtime/Frontend-First-Launch-Validation.md exist?
2. Does it include backend startup command?
3. Does it include frontend startup command?
4. Does it identify expected backend URL?
5. Does it identify expected frontend URL?
6. Does it include browser launch checklist?
7. Does it include CORS validation?
8. Does it include health panel validation?
9. Does it include schema explorer validation?
10. Does it include query runner validation?
11. Does it include query results validation?
12. Does it include query history validation?
13. Does it include issue capture guidance?
14. Does it include known issues and final first-launch decision sections?
15. Does Backend-Setup-and-Validation.md reference the frontend first-launch validation document?
16. Does apps/web/package.json support npm run dev --workspace apps/web?
17. Does the frontend retain centralized API client behavior?
18. Does the frontend retain default backend URL http://127.0.0.1:3001?
19. Does the frontend retain VITE_API_BASE_URL override if previously implemented?
20. Were any code changes limited to first-launch blocking fixes?
21. Was visual redesign avoided?
22. Were backend API contracts left unchanged?
23. Was SQL safety behavior left unchanged?
24. Was query execution behavior left unchanged?
25. Were database files left unchanged?
26. Were SSOT files left unchanged?
27. Was AI, LLM, or heuristic behavior avoided?
28. Do backend tests pass?
29. If frontend tests were not run, is the reason documented?

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

Created [Frontend-First-Launch-Validation.md](/D:/GitHub-Repos/SequelCityWeb/docs/02-runtime/Frontend-First-Launch-Validation.md) and updated [Backend-Setup-and-Validation.md](/D:/GitHub-Repos/SequelCityWeb/docs/02-runtime/Backend-Setup-and-Validation.md) to point to it. The new runtime doc includes the required first-launch checklist, validation sections, issue capture format, known issues, and a final decision.

I did not change frontend or backend behavior. Static inspection shows the React entry point and API wiring are in place: `apps/web/package.json` has a `dev` script, the root workspace includes `apps/web`, `apps/web/src/main.tsx` renders into `#root`, and [client.ts](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/api/client.ts) still defaults to `http://127.0.0.1:3001` while honoring `VITE_API_BASE_URL`. Empty states already exist for query history and zero-row results.

Verification:

- `npm test --workspace apps/api` passed.
- `npm test --workspace apps/web` could not run because `vitest` is not installed in the local workspace.
- `npm run dev --workspace apps/web` is currently blocked with `'vite' is not recognized as an internal or external command`.
- `npm run build --workspace apps/web` is also blocked because `vite`, `@vitejs/plugin-react`, and `vitest/globals` are not resolvable.

Current first-launch decision is `blocked` until frontend dependencies are installed locally with `npm install` from the repo root, then the browser checklist in the new doc can be completed.

## Gemini Audit Results

Gemini Audit Results

Status: PASS

Summary:

- The audit of WP-015 implementation for Sequel City Web Detective confirms that a deterministic frontend first-launch validation workflow has been established.
- `docs/02-runtime/Frontend-First-Launch-Validation.md` is present and comprehensively covers the required validation steps, including startup commands, URLs, component-specific checks, CORS validation, and issue capture guidance.
- Backend setup documentation correctly references the new frontend validation document.
- Code changes were strictly limited to enabling the first-launch workflow (e.g., CORS support in the backend) and providing a functional frontend shell.
- Architectural integrity was maintained: centralized API client behavior, SQL safety rules, and backend API contracts remain unchanged.
- Visual redesign was avoided, adhering to the "utilitarian functional shell" requirement.
- Deterministic reasons for any blocked validation steps (missing local dependencies) are properly documented.

Evidence:

- **Validation Documentation:** `docs/02-runtime/Frontend-First-Launch-Validation.md` exists and contains all 14 required sections, including specific validation for Health, Schema, Query, and History panels.
- **Cross-Referencing:** `docs/02-runtime/Backend-Setup-and-Validation.md` contains two explicit references to the frontend validation document.
- **Workspace Configuration:** Root `package.json` defines `apps/web` as a workspace, and `apps/web/package.json` contains the `dev` script, supporting `npm run dev --workspace apps/web`.
- **API Client:** `apps/web/src/api/client.ts` implements centralized logic with a default backend URL of `http://127.0.0.1:3001` and supports `VITE_API_BASE_URL` overrides.
- **Backend Integrity:** `apps/api/src/app.ts` was updated with standard CORS headers to support frontend connectivity. `sqlSafetyService.ts` and `queryExecutionService.ts` remain focused on their core responsibilities without AI/LLM heuristics.
- **Visuals:** `apps/web/src/styles.css` uses basic layout primitives (CSS Grid) and a standard font stack (Arial), avoiding any specialized design or branding.
- **Test Status:** Backend tests are configured in `apps/api/package.json`. While environment constraints prevented live execution during this audit turn, they were verified as passing in the documented implementation phase.
- **Documentation of Omissions:** The "Known Issues" and "Final First-Launch Decision" sections in the validation document explicitly state that runtime validation is currently blocked by missing local node_modules, satisfying the requirement to document why tests were not run.

Issues Found:

- None

Required Fixes:

- None
  Warning: 256-color support not detected. Using a terminal with at least 256-color support is recommended for a better visual experience.
  Ripgrep is not available. Falling back to GrepTool.

## Final Decision

Status: Accepted

The implementation satisfies all WP-015 requirements and correctly establishes a deterministic frontend first-launch validation workflow.

The frontend runtime validation document exists and is complete, covering backend startup, frontend startup, browser launch, API connectivity, CORS validation, and all core UI components including health, schema, query execution, results, and history. The document also includes issue capture guidance, known issues, and a final decision section, meeting all required structure and intent .

The backend setup documentation correctly references the frontend validation workflow, ensuring a cohesive developer onboarding path.

Critically, the work package maintained strict scope discipline:

* No UX refinement was introduced
* No new features were added
* No backend contracts were modified
* No SQL execution or safety behavior was changed
* No database or SSOT artifacts were altered

All code changes were either documentation-focused or limited to enabling runtime validation conditions.

The current first-launch state is accurately identified as  **blocked** , with the root cause clearly documented:

* Frontend dependencies are not installed
* `vite` is not available in the workspace
* Frontend test runner (`vitest`) is not installed

This is a correct and expected outcome for this phase. The purpose of WP-015 was not to guarantee a successful launch, but to deterministically  **prove whether launch is possible and why it may fail** .

Backend tests pass, and no regressions were introduced.

No violations of scope, constraints, or architectural principles were identified.
