# WP-253 - Case 001 Gated Query Feedback Slice

## Objective

Add a gated Case 001 UI/API-client vertical slice that lets the existing Case 001 playable skeleton submit the first SQL query through `/api/query/execute` with explicit milestone-evaluation metadata opt-in and displays only non-spoiler milestone feedback.

## Scope

### In Scope

- Add frontend API request/response typing for the existing `caseMilestoneEvaluation` query-execution metadata contract from WP-252.
- Extend the web API client query execution helper so existing callers can still call `executeQuery(sql)` unchanged, while Case 001 can opt in with explicit metadata.
- Add a Case 001 skeleton-local first SQL query feedback panel inside `StudentPlayableCaseSkeletonView`.
- Use the existing Case 001 constants for `caseId` and `case-001-clocktower-report-located`.
- Submit the query through `/api/query/execute` only from the gated Case 001 skeleton path and include explicit metadata opt-in.
- Display only non-spoiler milestone feedback derived from the metadata response and ordinary execution/safety errors.
- Add focused frontend tests for the API-client request shape and the gated Case 001 skeleton feedback interaction.
- Refresh relevant SSOT/API documentation to describe the gated UI/API-client slice and its non-progression boundary.
- Refresh Understand graph artifacts after implementation.

### Out of Scope

- No release unlock for Case 001.
- No addition of Case 001 to the normal ungated playable case list.
- No backend API implementation changes; WP-252 already owns the server transport contract.
- No database rows, fixture changes, seed changes, migrations, or schema changes.
- No Query Lab rendering, reusable query-workbench integration, or result-table rendering for this slice.
- No display of query result rows, raw evidence rows, answer keys, suspect verification, or solution data.
- No persistence, progress advancement, clue-log writes, evidence-board writes, investigation-thread updates, or broader case progression.
- No runtime AI behavior.
- No Case 004 behavior changes.
- No broad UI redesign, refactors, dependency changes, or unrelated cleanup.

## Impact Analysis

### Understand Status

- Graph available: Yes, `.understand-anything/` exists.
- Baseline commit: `0870e8a6cdb85198235f6fcbbadee7841bd04f94`.
- Current HEAD during planning: `0acb61a` (`Add Case 001 query execution metadata transport`).
- Freshness assessment: Structurally stale by one accepted API transport commit for this frontend/API-client planning surface. The graph is usable for orientation only because source verification was performed against current files.
- Analysis performed: Verified current frontend API client, frontend query types, Case 001 skeleton component, Case 001 constants/module boundary, relevant app tests, package test scripts, CSS surface, and WP-252 API transport scope.

### Affected Architecture

- Layers: web API client/types, gated Case 001 student skeleton UI, frontend tests, SSOT/API documentation, Understand graph artifacts.
- Primary files/components:
  - `apps/web/src/api/types.ts`
  - `apps/web/src/api/client.ts`
  - `apps/web/src/api/client.test.ts`
  - `apps/web/src/components/student/StudentPlayableCaseSkeletonView.tsx`
  - `apps/web/src/components/student/StudentPlayableCaseSkeletonView.test.tsx`
  - `apps/web/src/studentCase001.ts`
  - `apps/web/src/styles.css`
- Upstream consumers: `apps/web/src/App.tsx` renders the skeleton only through the existing gated playable-case module boundary.
- Downstream dependencies: `/api/query/execute` and the WP-252 response metadata contract.

### Regression Surface

- Related tests: `apps/web/src/api/client.test.ts`, new `StudentPlayableCaseSkeletonView.test.tsx`, `apps/web/src/studentCaseModule.test.ts`, and web build.
- User workflows: Case 004 playable workflow must remain unchanged; Case 001 must remain archive locked unless `VITE_ENABLE_CASE_001_PLAYABLE_SKELETON=true`.
- Security/data boundaries: SQL still flows through the existing backend query-safety and execution endpoint. The UI must not expose answer keys, hidden evidence rows, raw query results, or milestone progression state.

### Graph Update Decision

- Regeneration required: Yes.
- Rationale: This WP changes frontend API-client contracts and a student-facing component boundary after the current graph baseline. Refreshing the graph keeps the architecture map aligned with the new UI/API vertical slice.

## Files Allowed to Change

Allowed:

- `apps/web/src/api/types.ts`
- `apps/web/src/api/client.ts`
- `apps/web/src/api/client.test.ts`
- `apps/web/src/components/student/StudentPlayableCaseSkeletonView.tsx`
- `apps/web/src/components/student/StudentPlayableCaseSkeletonView.test.tsx`
- `apps/web/src/studentCase001.ts`
- `apps/web/src/studentCaseModule.test.ts`
- `apps/web/src/styles.css`
- `docs/00-ssot/SSOT-Case-Authoring.md`
- `docs/00-ssot/SSOT-Case-Progression.md`
- `docs/00-ssot/SSOT-Investigation-State-Architecture.md`
- `docs/00-ssot/SSOT-UI-UX-Experience.md`
- `docs/07-api-contracts/query-execution-endpoints.md`
- `docs/01-work-packages/WP-253-case-001-gated-query-feedback-slice.md`
- `.understand-anything/**`
- `docs/00-ssot/END-OF-DAY-HANDOFF.md`

Closeout-only allowance:

- `docs/00-ssot/END-OF-DAY-HANDOFF.md` may be modified only during accepted-WP closeout.

Do Not Modify:

- `apps/api/**`
- `database/**`
- `database/migrations/**`
- `apps/web/src/App.tsx`
- `apps/web/src/components/QueryRunner.tsx`
- `apps/web/src/components/QueryResultsTable.tsx`
- `apps/web/src/components/student/StudentWorkbenchView.tsx`
- `apps/web/src/studentCaseModule.ts`
- `apps/web/src/studentCasePersistence.ts`
- `apps/web/src/hooks/useStudentCaseState.ts`
- `package.json`
- `package-lock.json`
- `apps/web/package.json`
- `apps/api/package.json`
- `apps/api/package-lock.json`
- `scripts/**`
- `.codex/**`

## Constraints

- Preserve existing behavior unless explicitly changing it.
- Keep the change skeleton-local and Case 001-specific.
- No renaming outside scope.
- No speculative improvements.
- No "while we're here" changes.
- No new dependencies.
- Do not weaken query-safety, locked-case, or release-gate behavior.
- Do not expose spoiler data, answer keys, hidden evidence rows, suspect verification, or progression state.
- Do not add persistence or localStorage writes.
- Do not make backend changes.

## Required Behavior

- `executeQuery(sql)` continues to post exactly `{ "sql": "<query>" }` for all existing callers.
- `executeQuery(sql, options)` supports an optional Case 001 milestone-evaluation opt-in payload without changing the existing default behavior.
- The opt-in request body includes the SQL plus explicit `caseMilestoneEvaluation` metadata for:
  - `caseId: "case-001"`
  - `milestoneId: "case-001-clocktower-report-located"`
  - gated skeleton enabled state from the existing Case 001 skeleton path
- `StudentPlayableCaseSkeletonView` adds one first-query interaction using component-local state only.
- The interaction submits to `/api/query/execute` through the API client, not a direct `fetch`.
- The UI displays loading, success, no-match, and error states in non-spoiler language.
- The UI may identify that a public clocktower incident report record was located, but must not display raw rows, columns, answer keys, suspect names, solution text, or hidden validation details.
- The UI must make clear that the slice does not unlock the archive, persist progress, or advance the case.
- Existing Case 001 timeline, record-comparison, clue-narrowing, and checkpoint-summary interactions remain intact.
- Case 004 and the normal Query Lab remain behaviorally unchanged.

## Acceptance Criteria

- [ ] Frontend API types include the optional milestone-evaluation request metadata and optional non-spoiler response metadata from WP-252.
- [ ] `executeQuery(sql)` preserves the existing request path and body when no metadata options are provided.
- [ ] `executeQuery(sql, options)` sends the expected opt-in body for Case 001 milestone evaluation.
- [ ] The gated Case 001 skeleton includes a first SQL query feedback panel that calls the API client with the explicit Case 001 metadata opt-in.
- [ ] The Case 001 skeleton feedback panel displays non-spoiler metadata feedback only and never renders query result rows or answer-key data.
- [ ] The slice uses component-local state only and does not write persistence/progression state.
- [ ] Case 001 remains release locked unless the existing skeleton gate is explicitly enabled.
- [ ] Case 004 and the normal Query Lab behavior remain unchanged.
- [ ] SSOT/API documentation reflects the gated UI/API-client slice and its non-progression boundary.
- [ ] Understand graph artifacts are refreshed after implementation.
- [ ] Run `npm run test --workspace apps/web -- --run src/api/client.test.ts src/components/student/StudentPlayableCaseSkeletonView.test.tsx src/studentCaseModule.test.ts`.
- [ ] Run `npm run build --workspace apps/web`.
- [ ] Run the relevant work-package status and validation-plan helper scripts.
- [ ] No unrelated files changed.

## Code Prompt

Implement WP-253 exactly as specified.

Start by reading:

- `docs/01-work-packages/WP-253-case-001-gated-query-feedback-slice.md`
- `docs/00-ssot/SSOT-Development-Workflow.md`
- `docs/00-ssot/SSOT-Case-Authoring.md`
- `docs/00-ssot/SSOT-Case-Progression.md`
- `docs/00-ssot/SSOT-Investigation-State-Architecture.md`
- `docs/00-ssot/SSOT-UI-UX-Experience.md`
- `docs/07-api-contracts/query-execution-endpoints.md`
- `apps/web/src/api/types.ts`
- `apps/web/src/api/client.ts`
- `apps/web/src/api/client.test.ts`
- `apps/web/src/components/student/StudentPlayableCaseSkeletonView.tsx`
- `apps/web/src/studentCase001.ts`
- `apps/web/src/studentCaseModule.test.ts`

Then:

1. Add optional frontend query-execution milestone-evaluation request/response types matching the existing WP-252 backend transport contract.
2. Extend the web API client's query execution helper with optional metadata opt-in while preserving the exact no-options request body.
3. Add one Case 001 skeleton-local first SQL query feedback interaction that uses the API client and explicit Case 001 metadata.
4. Keep feedback non-spoiler and do not render result rows, result columns, answer keys, or progression state.
5. Add focused tests for API-client compatibility/opt-in and the gated skeleton interaction.
6. Update the relevant SSOT/API docs for the gated non-progressing UI/API-client slice.
7. Run:
   - `npm run test --workspace apps/web -- --run src/api/client.test.ts src/components/student/StudentPlayableCaseSkeletonView.test.tsx src/studentCaseModule.test.ts`
   - `npm run build --workspace apps/web`
   - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1`
   - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refresh-understand-graph.ps1`
   - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1`
   - `git diff --check`
8. Record Code Results with changed files, validation evidence, graph-refresh evidence, and scope check.

Scope:

- Only modify files listed under "Files Allowed to Change".
- Keep the implementation centered on the Case 001 skeleton and web API client.

Constraints:

- Preserve `executeQuery(sql)` compatibility for existing callers.
- Add optional metadata opt-in support without changing normal Query Lab behavior.
- Use the existing `/api/query/execute` endpoint through the API client.
- Use Case 001 constants for the case id and first milestone id.
- Keep all Case 001 query UI state component-local and non-persistent.
- Do not render query result rows, result columns, answer keys, suspect verification, or solution data.
- Do not unlock Case 001 for release.
- Do not change backend API, database, migrations, Case 004, `QueryRunner`, `QueryResultsTable`, or `StudentWorkbenchView`.
- No new dependencies.

Return:

- Exact code changes.
- Tests run and results.
- Any deviations from the allowed file list or acceptance criteria.

## Audit Prompt

Audit this change against the work package.

Verify:

- All acceptance criteria are satisfied.
- No files outside allowed list were modified.
- No functional regression.
- Behavior remains consistent outside scope.
- Impact analysis matches the actual changed files.
- Dependencies and related tests were not omitted.
- Graph regeneration decision was followed.
- Understand output did not override SSOT or source evidence.

Output:

- Audit verdict label.
- Violations.
- Regressions.
- Drift risks.

## Code Results

Implemented.

Changed files:

- `apps/web/src/api/types.ts`
- `apps/web/src/api/client.ts`
- `apps/web/src/api/client.test.ts`
- `apps/web/src/components/student/StudentPlayableCaseSkeletonView.tsx`
- `apps/web/src/components/student/StudentPlayableCaseSkeletonView.test.tsx`
- `apps/web/src/studentCase001.ts`
- `apps/web/src/styles.css`
- `docs/00-ssot/SSOT-Case-Authoring.md`
- `docs/00-ssot/SSOT-Case-Progression.md`
- `docs/00-ssot/SSOT-Investigation-State-Architecture.md`
- `docs/00-ssot/SSOT-UI-UX-Experience.md`
- `docs/07-api-contracts/query-execution-endpoints.md`
- `.understand-anything/fingerprints.json`
- `.understand-anything/intermediate/scan-result.json`
- `.understand-anything/knowledge-graph.json`
- `.understand-anything/meta.json`
- `docs/01-work-packages/WP-253-case-001-gated-query-feedback-slice.md`

Implementation notes:

- Added frontend `caseMilestoneEvaluation` request typing and optional non-spoiler Case 001 response metadata typing.
- Extended `executeQuery(sql, options)` with optional metadata opt-in while preserving `executeQuery(sql)` as `{ "sql": "<query>" }`.
- Added a Case 001 skeleton-local first SQL query feedback panel that submits through the API client with `case-001`, `case-001-clocktower-report-located`, and the current skeleton gate state.
- The feedback panel displays loading, matched, no-match, missing-metadata, local empty-query, and backend/error states without rendering rows, columns, answer keys, suspect data, or progression state.
- Added component-local state only; no persistence or localStorage writes were added.
- Updated SSOT/API docs to describe the gated non-progressing UI/API-client slice.
- Refreshed Understand graph artifacts.

Validation evidence:

- PASS: `npm run test --workspace apps/web -- --run src/api/client.test.ts src/components/student/StudentPlayableCaseSkeletonView.test.tsx src/studentCaseModule.test.ts` (`3 passed`, `20 passed`).
- PASS: `npm run build --workspace apps/web`.
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1` before graph refresh (`READY`).
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refresh-understand-graph.ps1` (`filesScanned=627`, graph assembly `nodes=1001`, `edges=374`, `files=627`).
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1` after graph refresh (`READY`).
- PASS: `git diff --check` exited `0`; output included only expected Windows line-ending warnings.

Scope check:

- No backend, database, migration, QueryRunner, QueryResultsTable, StudentWorkbenchView, persistence, package, script, or `.codex` files were modified.

## Audit Results

I am waiting for the web test suite run to finish.
### Audit Verdict
Verdict: PASS

---

### Verification Summary

| Check | Status | Evidence / Notes |
|---|---|---|
| **Acceptance Criteria** | Satisfied | All 14 acceptance criteria in [`WP-253`](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-253-case-001-gated-query-feedback-slice.md) verified. Frontend types added, [`executeQuery`](file:///D:/GitHub-Repos/SequelCityWeb/apps/web/src/api/client.ts#L96-L110) backwards-compatible with optional opt-in, non-spoiler component-local feedback implemented in [`StudentPlayableCaseSkeletonView`](file:///D:/GitHub-Repos/SequelCityWeb/apps/web/src/components/student/StudentPlayableCaseSkeletonView.tsx), and SSOT/API docs updated. |
| **Allowed File Scope** | Satisfied | Only permitted files modified ([`types.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/web/src/api/types.ts), [`client.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/web/src/api/client.ts), [`client.test.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/web/src/api/client.test.ts), [`StudentPlayableCaseSkeletonView.tsx`](file:///D:/GitHub-Repos/SequelCityWeb/apps/web/src/components/student/StudentPlayableCaseSkeletonView.tsx), [`StudentPlayableCaseSkeletonView.test.tsx`](file:///D:/GitHub-Repos/SequelCityWeb/apps/web/src/components/student/StudentPlayableCaseSkeletonView.test.tsx), [`studentCase001.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/web/src/studentCase001.ts), [`styles.css`](file:///D:/GitHub-Repos/SequelCityWeb/apps/web/src/styles.css), SSOT/API docs, and `.understand-anything/**`). No backend, database, migration, or forbidden files touched. |
| **Functional Regression** | None | 215 web tests and all API test suites passed cleanly (`npm run test --workspace apps/web`, `npm run test --workspace apps/api`). Production build passed (`tsc -b && vite build`). |
| **Consistency Outside Scope** | Satisfied | `executeQuery(sql)` default payload shape `{ sql }` is preserved for ungated Query Lab callers. Case 004 gameplay, evidence notebook, and suspect verification remain unaffected. |
| **Impact Analysis Alignment** | Satisfied | Changed files and components exactly match the affected architecture listed in [`WP-253`](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-253-case-001-gated-query-feedback-slice.md). |
| **Dependencies & Tests** | Satisfied | No new npm dependencies added. Focused tests in [`client.test.ts`](file:///D:/GitHub-Repos/SequelCityWeb/apps/web/src/api/client.test.ts) and [`StudentPlayableCaseSkeletonView.test.tsx`](file:///D:/GitHub-Repos/SequelCityWeb/apps/web/src/components/student/StudentPlayableCaseSkeletonView.test.tsx) cover request serialization, gate integration, non-spoiler display, empty query handling, and lack of persistence. |
| **Graph Regeneration** | Satisfied | Knowledge graph artifacts refreshed; [`check-understand-refresh-readiness.ps1`](file:///D:/GitHub-Repos/SequelCityWeb/scripts/check-understand-refresh-readiness.ps1) confirms `READY`. |
| **SSOT & Source Authority** | Satisfied | SSOT documentation ([`SSOT-Case-Authoring.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/00-ssot/SSOT-Case-Authoring.md), [`SSOT-Case-Progression.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/00-ssot/SSOT-Case-Progression.md), [`SSOT-Investigation-State-Architecture.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/00-ssot/SSOT-Investigation-State-Architecture.md), [`SSOT-UI-UX-Experience.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/00-ssot/SSOT-UI-UX-Experience.md), [`query-execution-endpoints.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/07-api-contracts/query-execution-endpoints.md)) remains authoritative. |

---

### Violations
**None.** All changes strictly follow the scope constraints and rules defined in [`WP-253`](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-253-case-001-gated-query-feedback-slice.md).

---

### Regressions
**None.** Existing API callers, Query Lab, Case 004 playable workflows, and release gate boundaries are verified intact.

---

### Drift Risks
**Low.**
- *Boundary Isolation:* The feedback interaction in [`StudentPlayableCaseSkeletonView`](file:///D:/GitHub-Repos/SequelCityWeb/apps/web/src/components/student/StudentPlayableCaseSkeletonView.tsx) is component-local (`useState`) and explicitly isolated from global case progression and localStorage persistence, preventing unintended state leakage.
- *API Client Backwards Compatibility:* [`executeQuery`](file:///D:/GitHub-Repos/SequelCityWeb/apps/web/src/api/client.ts#L96-L110) defaults to `{ sql }` unless options are explicitly passed, preventing request payload drift across existing Query Lab calls.

## Final Decision

Accepted.

Human acceptance recorded after audit completion. WP-253 is approved for closeout because the implementation delivered the gated Case 001 UI/API-client query feedback slice, preserved release/persistence/progression boundaries, passed recorded validation, refreshed Understand graph artifacts, and the audit reported no violations or regressions.

