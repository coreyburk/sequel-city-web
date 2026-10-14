# WP-296: student query attempt feedback

## Objective

Give students clear, accurate feedback about each query attempt: what happened, why it matters to the current task, and one useful next action. Use one shared feedback system for all released cases, populated from SQL execution diagnostics, public schema, returned results and database-authored current-task requirements.

## Scope

Implementation authorized 2026-10-14 after accepted WP-289, baseline 1b1121fbabb6093cd9552f112f15b93de46eda42. Branch: codex/wp-296-student-query-feedback. Preserve WP-289 acceptance/audit records. Pending WP-284/WP-285/WP-290 historical planning cleanup is preserved separately in .git/wp296-unrelated-planning-cleanup.patch and must be restored after this package audit/closeout. No commit/push or human acceptance is implied by implementation authorization.

Current feedback reports generic execution failure or success. WP-289 adds a narrow browser-side briefing-column mismatch explanation. Replace that heuristic with a coherent typed feedback contract and shared presentation. Cover safe execution failures and successful queries that return no matches, broad results, unrelated evidence, partial collections or loggable evidence. Preserve the established detective presentation and warm, concise mentor voice. No runtime AI, external service or dependency is needed.

References: SSOT-Development-Workflow.md; SSOT-Case-Progression.md; SSOT-Investigation-State-Architecture.md; docs/15-case-plans/CASE-RUNTIME-CONTRACTS.md.

## Impact Analysis

### Understand Status

- Analysis tier: Required; cross-module API, proof interpretation and shared student presentation.
- Graph available: knowledge-graph.json, fingerprints.json, meta.json and scan-result.json exist.
- Implementation baseline: accepted 1b1121fbabb6093cd9552f112f15b93de46eda42. WP-289 graph artifacts were checked against current source; WP-296 refresh now records the current implementation and 714 analyzed files.
- Freshness rechecked for implementation at 1b1121f: the graph baseline describes the accepted WP-289 implementation, with closeout documentation drift. Source and SSOT are authoritative; WP-296 owns its structural refresh.
- Targeted graph/source inspection: queryExecutionService, caseAttemptService, StudentQueryLab, schemaService and query/runtime contracts. Execution failure detail is currently reduced to a generic message; caseAttemptService already owns current-task context and proof outcomes. StudentQueryLab renders both successful results and failures through the same feedback section.

### Affected Architecture

- Layers: safe SQL execution, case progression interpretation, API contracts and shared Query Lab.
- Upstream: learner query requests and authored current task, hint, starter, bindings and collection requirements.
- Downstream: returned feedback, results, Log Clue eligibility and saved progress. Feedback cannot establish evidence itself.
- Primary boundaries: executeSafeQuery classifies technical errors; caseAttemptService interprets outcome against current-task requirements; shared renderer presents structured feedback. Keep orchestration out of React and avoid duplicated case-specific rules.

### Regression Surface

- Case 001 and Case 004: fresh/resumed attempts, broad inspection tasks, isolation/log tasks, partial collections, saved drafts and verification boundaries.
- Tests: execution-service tests, case-attempt tests, shared Query Lab tests, student-mode browser coverage, actual SQL bootstrap integration.
- Security: learner-safe schema only, no hidden validators/answers/future steps or raw database/server diagnostics; owned attempt/revision/provenance checks remain authoritative.

### Graph Update Decision

- Regeneration required after implementation: Yes; typed cross-layer feedback and a new service change dependencies.
- Include all four existing tracked graph artifacts in this WP. Do not refresh them during planning.

## Files Allowed to Change

Allowed:
- apps/api/src/types/query.ts
- apps/api/src/types/caseRuntime.ts
- apps/api/src/services/queryExecutionService.ts
- apps/api/src/services/queryExecutionService.test.ts
- apps/api/src/services/caseAttemptService.ts
- apps/api/src/services/caseAttemptService.test.ts
- apps/api/src/services/queryAttemptFeedbackService.ts
- apps/api/src/services/queryAttemptFeedbackService.test.ts
- apps/api/src/services/schemaService.ts
- apps/api/package.json
- apps/web/src/api/types.ts
- apps/web/src/components/student/StudentQueryLab.tsx
- apps/web/src/components/student/StudentQueryLab.test.tsx
- apps/web/src/components/student/CurrentCaseTask.test.tsx
- apps/web/tests/browser/student-mode.spec.ts
- apps/web/tests/browser/studentModeApi.ts
- apps/web/tests/browser/case-001-live-smoke.spec.ts
- scripts/tests/test-case-runtime-bootstrap.ps1
- docs/15-case-plans/CASE-RUNTIME-CONTRACTS.md
- docs/00-ssot/SSOT-Case-Progression.md
- docs/01-work-packages/WP-296-student-query-attempt-feedback.md
- .understand-anything/knowledge-graph.json
- .understand-anything/fingerprints.json
- .understand-anything/meta.json
- .understand-anything/intermediate/scan-result.json
- docs/00-ssot/END-OF-DAY-HANDOFF.md

Do Not Modify:
- WP-289 implementation/audit/acceptance record during its audit.
- SQL creation/seed/FK scripts, migrations, released content, existing attempts or public evidence. Existing authoring and validator requirements are sufficient for this scope; amend the plan before any necessary schema change, including bootstrap/seed/upgrade coverage.
- Independent audit tooling, credentials, ownership/CSRF/safety policy, answer-key visibility and suspect verifier authority.
- Application layout, images, routing, legacy Admin tools and unrelated packages.

Handoff remains accepted-closeout only. Package JSON is test registration only; no dependencies. Schema service may only be reused for its public metadata projection.

## Constraints

Feedback is deterministic and advisory. Reuse existing schema/content/validator outputs; do not recreate case progression rules inside the feedback service. No arbitrary rule engine, full SQL parser or SQL string matching as the sole authority. No automatic query rewriting, execution, logging or proof advancement. Do not make plausible explanations sound certain when evidence is insufficient. Preserve the submitted draft and results.

Simplicity check: reuse the existing safe executor and authored runtime context; add one small typed interpreter service and one shared presentation. Every category must serve a current observed outcome. Prefer existing bounded validator outcome metadata to a separate authoring schema.

## Required Behavior

1. Define a typed feedback payload with stable category, severity, concise explanation and next action. Separate execution outcome from evidence/progress outcome. Preserve existing response compatibility where needed. Feedback applies to the submitted SQL/action and cannot become stale against another attempt or newer run.
2. Classify SQL Server errors using structured driver error codes, including invalid column, invalid object/table, syntax, ambiguous column, conversion, timeout and connection/unavailable. Provide safe explanations and public-schema references. Unknown errors use an honest fallback. Never expose raw exception text, server/database identities, SQL credentials, private table existence or stack traces. Safety/restricted-table denials retain their existing authority.
3. A valid query with zero returned matches says it ran but found no matches. Suggest checking observed values and relaxing conditions to inspect the table. Do not claim a particular literal is wrong or disclose the correct value without previously proved evidence.
4. Successful nonempty queries report the actual count. Broad results only require narrowing when the current authored task requires isolation. Broad inspection is valid for an inspection task; partial evidence collections explain accepted versus required counts. A row cap means at least that many results, not an exhaustive count; do not use an arbitrary row threshold for all tasks.
5. Distinguish unrelated results, selectable/loggable evidence, evidence already logged, partial collection, task proved, released review complete and progress-save failure. Use the existing canonical validator/provenance result, not row count alone. Query execution success never implies proof or culprit resolution.
6. Table/column guidance must work across cases, aliases, joins and schema-qualified names where structured diagnostics/public metadata support the conclusion. Otherwise provide a bounded schema-check action without guessing. The reported CrimeType query using ReportCity/ReportDate receives a clear mismatch explanation and a pointer to the current authored starter. No hardcoded Case 001 column names or answer values.
7. Present one feedback area near the query/results, with a readable status, explanation and one next action. Refer to Case File table references and current starter where useful. Preserve green successful clue logging; avoid extra popups, duplicate mentor messages, or accusatory wording. Keyboard and screen-reader users receive the result once.
8. Keep briefing facts distinct from earned evidence. Known City/Date tokens remain available before any query. Explain the table context of a token when needed without withholding public briefing information.

## Acceptance Criteria

- [x] One typed feedback contract and shared renderer serve both released cases; no case-specific React feedback branches.
- [x] Structured execution-error coverage includes invalid column/table, syntax, ambiguity, conversion, timeout/unavailable and unknown fallback; safety denials are not softened.
- [x] Valid zero-result and broad-result queries produce useful, truthful guidance, including the user's CrimeID 2080 and city-only report examples without leaking correct answers.
- [x] Broad inspection, isolation, partial collections, eligible/duplicate evidence, completed tasks and persistence failures produce distinct outcomes using existing runtime authority.
- [x] Aliases/joins/schema-qualified queries receive supported explanations or an honest fallback; raw errors/private schema are never returned.
- [x] Query draft, owner/revision checks, evidence authority, task order and current visual identity remain intact.
- [x] Unit, actual SQL integration, selected browser tests, builds and graph refresh pass; negative/leakage tests pass.
- [x] Independent audit recorded and human final acceptance remains separate.

## Code Prompt

Implement WP-296 only after WP-289 acceptance. Verify the baseline and allowed paths. First define the typed feedback taxonomy and map the existing executor/validator outcomes; update the runtime contract. Classify technical failures at the executor, interpret learning outcomes in queryAttemptFeedbackService with current authored context, and render the payload in StudentQueryLab. Remove the WP-289 browser-specific heuristic. Keep proof mutations in their existing services. Add tests before broadening supported explanations. Run API/web builds and relevant suites, actual SQL fixtures and selected browser scenarios; refresh the four graph artifacts. Record limitations accurately. Stop for independent audit; do not accept or push your own work.

## Audit Prompt

Independently audit WP-296 against its scope and runtime/security contracts. Verify the response handles varied malformed SQL and valid but unhelpful results using structured diagnostics, public schema and existing authored task requirements. Check the user's examples, both cases, broad inspection versus isolation, partial evidence, duplicate clues, row caps, persistence failures, aliases/joins and unknown fallbacks. Confirm no answer/future-step/private-schema leakage and no automatic rewriting or proof promotion. Confirm accessibility, preserved drafts, shared UI, meaningful unit/browser/actual SQL validation and the simplicity check. Record Verdict: PASS, FAIL or BLOCKED with evidence; leave human acceptance pending.

## Code Results

Implemented on codex/wp-296-student-query-feedback from accepted WP-289 baseline 1b1121f. Independent audit and human acceptance remain pending.

- Added typed execution/evidence feedback with stable categories, severity, explanation, next action and returned-count semantics; legacy message responses remain compatible.
- Executor classifies structured SQL Server/driver errors. Public-schema-backed wrong-table detail is limited to supported simple shapes; aliases/joins/CTEs receive safe generic guidance where a precise conclusion is unsupported. Raw errors/private metadata are not returned. Unknown-table safety blocks remain earlier than SQL execution.
- CaseAttemptService interprets canonical validator/pure collection outcomes and authored current-step context. Empty, unrelated, narrow-required, log-ready, partial, proved/completed, replay and unsaved-progress outcomes are distinct. No new proof engine or changes to validators, verification authority, SQL schema or released content.
- Shared Query Lab removes the browser SQL heuristic, presents one status area and keeps green clue logging/duplicate advice. Draft edits are distinguished from the last executed SQL; late query or clue responses cannot replace newer feedback. No automatic rewriting, starter insertion or clue logging.
- Pending historical WP-284/285/WP-290/handoff cleanup is checksum-preserved in .git/wp296-unrelated-planning-cleanup.patch, outside this audit scope. Restore after accepted closeout. No unrelated work was discarded.

Validation:

- API regression suite: PASS, including new feedback diagnostic/privacy/outcome tests and existing execution, security, routes and progression suites. Log: .git/wp296-api-tests.log.
- Full frontend suite: 229 tests passed in 23 files. Includes both cases, one status area, draft preservation, duplicate/success feedback and out-of-order query/clue responses. Log: .git/wp296-web-tests.log.
- API build and final API no-emit typecheck: PASS. Frontend build: PASS. Logs: .git/wp296-build.log and .git/wp296-web-build.log. Generated tracked API dist outputs are restored before audit.
- Actual SQL/browser run: test-case-runtime-bootstrap.ps1 -DatabaseName SequelCityRuntimeTest_WP296_FeedbackRelease_20261014 -RunBrowsers exited 0; all 12 browser tests passed, actual SQL diagnostics/security/repository checks and complete Case 004 sixteen-step path passed. Live Case 001 covers wrong-table columns and the zero-result CrimeID 2080 example without losing drafts or proving evidence. Log: .git/wp296-sql-browser-release.log.
- Additional actual SQL run: SequelCityRuntimeTest_WP296_CollectionFeedback_20261014 exited 0; inspection acceptance, city-only narrowing, canonical eligible rows, partial/duplicate collections, simulated repository write failure and both released case paths passed. Log: .git/wp296-collection-feedback.log.
- Earlier failures were test expectations: unknown tables are blocked by safety before SQL execution, and a browser mock incorrectly fetched the real backend instead of supplying its owned fixture snapshot. Both corrected; final runs passed. Safety was not weakened.

- Graph refresh/readiness and exact scope check: PASS; 714 analyzed files, 20 changed paths, zero out-of-scope paths. Independent audit has not run. API preview launched through the existing verified runtime at http://127.0.0.1:5173; readiness is ready. No live attempt was created or changed. Process record: .git/wp296-preview-process.json.

Refinement after student testing: empty result tables and their row-count/logging advice are omitted; zero-match feedback now states execution success once and offers one concise refinement action. Targeted 27 shared UI tests, feedback service tests and frontend typecheck pass.

Pinned Facts follow-up: inactive facts now render plain text instead of both a hidden button and text; regression checks each fact appears exactly once and only usable facts are clickable. Targeted 28 UI tests pass. Separate canonical-city correction planned in WP-297 and preserved in .git/wp-planning-hold/ for audit isolation; no live database writes performed.

Limits: SQL Server/driver error classification has an honest unknown fallback. Precise table-column explanations are intentionally conservative for complex SQL. Current executor returns full recordsets; the optional truncation flag is tested but no new row cap is introduced. User TOP counts are described as returned rows, never total database matches. No packaged-launcher rebuild or destructive/live database write was performed for this package.

## Audit Results

I have launched the comprehensive actual SQL and browser bootstrap validation suite (`scripts/tests/test-case-runtime-bootstrap.ps1`) against a fresh disposable SQL Server database to independently verify the end-to-end integration, security boundaries, and browser tests. I am waiting for this run to finish.
I will pause tool calls now and let the test run finish.
Awaiting test completion.
Awaiting completion of the test suite.
Waiting for test execution to complete.
### Independent Audit Report: WP-296 Student Query Attempt Feedback

**Work Package**: [WP-296-student-query-attempt-feedback.md](docs/01-work-packages/WP-296-student-query-attempt-feedback.md)
**Baseline**: `1b1121fbabb6093cd9552f112f15b93de46eda42` (accepted WP-289)
**Branch**: `codex/wp-296-student-query-feedback`
**Verdict**: **PASS** (Human Final Acceptance: **PENDING**)

---

### 1. Scope & Allowed Files Verification
- All modified and untracked files are strictly within the permitted paths defined in [WP-296](docs/01-work-packages/WP-296-student-query-attempt-feedback.md#L45-L71). Zero out-of-scope paths were modified.
- No database DDL, seed data, foreign keys, or released case content were altered.
- [`apps/api/package.json`](apps/api/package.json) contains only test command registration for [`queryAttemptFeedbackService.test.ts`](apps/api/src/services/queryAttemptFeedbackService.test.ts); no new dependencies were added.
- Tracked build output directories (`apps/api/dist`) were verified clean and unmodified.

---

### 2. Runtime & Security Contracts
- **Typed Feedback Contract**: Defined in [`apps/api/src/types/query.ts`](apps/api/src/types/query.ts#L75-L85) and [`apps/web/src/api/types.ts`](apps/web/src/api/types.ts#L262-L272) ([`QueryAttemptFeedback`](apps/api/src/types/query.ts#L75-L85)). Categorization separates execution status (`blocked`, `failed`, `succeeded`, `not-repeated`) from evidence status (`unchanged`, `ready-to-log`, `partial`, `proved`, `complete`, `not-saved`).
- **Structured Technical Diagnostics**: Driver errors are mapped via driver error numbers / codes in [`executionFailureFeedback`](apps/api/src/services/queryAttemptFeedbackService.ts#L10-L39):
  - Column not found (`207`): `invalid-column`
  - Object/table not found (`208`): `invalid-table`
  - Ambiguous column (`209`): `ambiguous-column`
  - Syntax errors (`102`, `105`, `156`, `170`, `4145`): `syntax`
  - Type conversions (`245`, `241`, `242`, `248`, `8114`, `8115`): `conversion`
  - Timeouts (`-2`, `ETIMEOUT`): `timeout`
  - Connection/login failure (`18456`, `4060`, `ESOCKET`, `ECONNREFUSED`, etc.): `unavailable`
  - Unmapped errors: honest `execution-error` fallback.
- **Safety Blocks**: Restricted table references and SQL safety violations remain non-executable with `category: "blocked"`, `execution: "blocked"`, `evidence: "unchanged"`.
- **Zero Diagnostics Leakage**: Raw SQL Server exceptions, connection strings, server hostnames, credentials, and internal table existence are strictly excluded from client feedback payloads.

---

### 3. Public Schema Diagnostics & Complex SQL Fallbacks
- For error 207 (`invalid-column`), [`queryAttemptFeedbackService.ts`](apps/api/src/services/queryAttemptFeedbackService.ts#L24-L37) inspects columns exclusively across public student evidence tables (`dbo` schema and `isStudentEvidenceTable`). Internal schemas (`app.*`, `CaseAnswerKey`, `Solution`) are filtered out.
- **Aliases, Joins, CTEs, Comments**: Queries containing `JOIN`, `WITH`, `UNION`, `INTERSECT`, `EXCEPT`, `--`, `/*`, or multiple `FROM` tokens deliberately do not guess table names and fall back to the safe generic query-context diagnostic: `"A column used in this query is not available in that query context. It may belong to another table or be spelled differently."`

---

### 4. Valid but Unhelpful Results & User Scenarios
- **Wrong-Table Column Mismatch (`ReportCity`/`ReportDate` on `CrimeType`)**: Evaluated via public schema as `ReportCity and ReportDate are not columns in CrimeType`, pointing to the current task starter without hardcoded case-specific column logic.
- **Zero-Match Query (`CrimeID = 2080`)**: Returns `no-matches` advising the student to check observed values or relax conditions without revealing the correct literal (`1080`) or answering whether 2080 exists in other contexts.
- **Broad Inspection vs. Isolation**:
  - Broad inspection tasks (e.g. Case 004 `report-inspection`): returns broad results, accepted by canonical validator, producing `task-proved`.
  - Isolation tasks (e.g. Case 001 `clocktower-report` or Case 004 `CrimeSceneReport` with city-only filter): returns broad results, producing `narrow-results` advising refinement.
- **Partial Evidence Collections**: When a multi-observation step is partially completed (e.g. 1 of 2 witness interviews logged), re-running the query returns `partial-collection` with the exact count (`Saved collection: 1 of 2 distinct observations`).
- **Duplicate Clues**: Logging an already-logged clue returns an advisory notification (`This clue is already logged.`) without mutating the durable attempt revision or adding duplicate notebook entries.
- **Row Caps & Truncation**: When `isTruncated` is present, row counts state `at least X rows (limited display)` (`countIsLimited: true`), avoiding arbitrary row count inferences.
- **Persistence Failures**: If writing proof fails (e.g. repository write error), query results and editor drafts are kept intact, and feedback reports `progress-not-saved` without exposing database internals.

---

### 5. Integrity, Accessibility & Draft Preservation
- **Non-Leakage**: No spoiler values, answers, future-step requirements, or private schema details leak into feedback messages or actions.
- **No Automatic Rewriting or Proof Promotion**: Feedback never modifies `w.draftSql`, never auto-inserts starters, and never automatically logs clues or advances proof.
- **Shared UI & Accessibility**:
  - Both Case 001 and Case 004 utilize the single shared [`StudentQueryLab`](apps/web/src/components/student/StudentQueryLab.tsx#L120-L127) status area with `role="status"` and `aria-live="polite"`.
  - The redundant secondary status div was removed, eliminating duplicate announcements.
- **Preserved Drafts & Stale Response Guarding**:
  - When the editor draft differs from the last executed SQL, a muted notice states: `"This feedback is for the last executed query. Run your edited draft to check it."`
  - Asynchronous sequence counters (`runSequence`) and attempt IDs prevent out-of-order query or clue logging responses from overwriting newer feedback.

---

### 6. Validation Evidence

| Suite | Target | Result | Evidence |
| :--- | :--- | :---: | :--- |
| **API Unit Tests** | `apps/api` (`npm test`) | **PASS** | 24 test suites passed, including [`queryAttemptFeedbackService.test.ts`](apps/api/src/services/queryAttemptFeedbackService.test.ts). |
| **Web Unit Tests** | `apps/web` (`npm test -- --run`) | **PASS** | 229 tests passed across 23 test files, including [`StudentQueryLab.test.tsx`](apps/web/src/components/student/StudentQueryLab.test.tsx). |
| **Production Builds** | `apps/api` (`tsc`), `apps/web` (`vite build`) | **PASS** | Clean compilation and bundling with zero errors. |
| **Actual SQL Bootstrap Integration** | `test-case-runtime-bootstrap.ps1 -DatabaseName SequelCityRuntimeTest_WP296_Audit_20261014 -RunBrowsers` | **PASS** | Live disposable database created on SQL Server, 12/12 Playwright browser tests passed, full 16-step Case 004 progression passed, Case 001 smoke passed, and learner/repository security checks verified. |

---

### 7. Simplicity Check
The implementation adds a single focused interpreter service ([`queryAttemptFeedbackService.ts`](apps/api/src/services/queryAttemptFeedbackService.ts), 78 LOC) and one shared UI presentation component. It relies strictly on existing database-authored validators and standard SQL Server driver error codes, requiring no runtime AI, AST parsers, or complex external rule engines.

---

### Conclusion
**Verdict**: **PASS**
All scope, runtime/security contracts, user scenarios, and accessibility requirements are met. [WP-296-student-query-attempt-feedback.md](docs/01-work-packages/WP-296-student-query-attempt-feedback.md) has been updated with the audit evidence and `Verdict: PASS`. Final human acceptance remains pending.

## Final Decision

Accepted by the human developer on 2026-10-14 following independent AntiGravity audit PASS. Closeout, commit and push explicitly authorized on 2026-10-14.
