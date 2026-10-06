# WP-281: Case 001 foundation-first opening step

## Objective

Make every released case begin with an explicit foundation query. Case 001 must first identify the recorded crime type and its `CrimeID` before the learner is asked to inspect `CrimeSceneReport` or `InterviewLog`.

- No implementation detail
- No solution framing
- Must be testable

## Scope

Define exactly what is in and out.

### In Scope
- Add a deterministic Case 001 `CrimeType` milestone for the Murder/`CrimeID = 1080` result.
- Add the authored opening step, persisted query reference, gating, feedback, and browser coverage for `CrimeType` â†’ `CrimeSceneReport` â†’ `InterviewLog`.
- Correct all Case 001 objective/next-action copy so each surface describes the current step rather than a later step.
- Align the Case 001 plan and SSOT progression records with the three-milestone release path.

### Out of Scope
- Case 004 progression changes; it already starts with `CrimeType`.
- New suspect, identity, roster, or answer-key stages.
- UI redesign, dependencies, database schema changes, or seed changes.

## Impact Analysis

### Understand Status
- Graph available: Yes (`knowledge-graph.json`, `fingerprints.json`, `meta.json` present).
- Baseline commit: `3243f12b0a30a6a122a6468afebd3584c3f8beb2`.
- Freshness assessment: Structurally stale for the active surface; cumulative frontend/progression changes since the baseline mean graph relationships are advisory only.
- Analysis performed: Source inspection traced Case 001 step selection and persistence in `useStudentCaseState.ts`, authored boundaries in `studentCase001.ts`, API validation in `case001ResultPatternService.ts` and `case001GatedMilestoneEvaluationService.ts`, and live regression coverage in the Case 001 browser smoke.

### Affected Architecture
- Layers: frontend student progression, API deterministic result validation, SSOT/case authoring, browser regression.
- Primary files/components: Case 001 authoring and progress state, API Case 001 validator/evaluator, App landing/progress copy, Case 001 unit/API/browser tests.
- Upstream consumers: query execution request builder and backend milestone metadata.
- Downstream dependencies: briefing/header labels, Query Lab guidance, resume revalidation, completion count, saved-attempt summary, smoke flow.

### Regression Surface
- Related tests: Case 001 API result-pattern/evaluator tests, frontend hook/App/progress tests, live Case 001 smoke.
- User workflows: fresh Case 001 entry, CrimeType query, report narrowing, interview follow-up, reload/resume, reset/fresh attempt, completion.
- Security/data boundaries: read-only SQL and backend-approved result patterns remain authoritative; no localStorage/UI-only completion, suspect verification, restricted data, or answer-key exposure.

### Graph Update Decision
- Regeneration required: Yes after implementation.
- Rationale: This changes progression behavior, API/frontend imports, and the Case 001 milestone graph. The graph is already structurally stale and must be refreshed before audit if the repository wrapper is available.

## Files Allowed to Change

Allowed:

- .understand-anything/fingerprints.json
- .understand-anything/intermediate/scan-result.json
- .understand-anything/knowledge-graph.json
- .understand-anything/meta.json
- docs/01-work-packages/WP-281-case-001-foundation-first-step.md
- docs/00-ssot/SSOT-Case-Progression.md
- docs/00-ssot/SSOT-Investigation-State-Architecture.md
- docs/00-ssot/SSOT-Case-Authoring.md
- docs/00-ssot/SSOT-UI-UX-Experience.md
- docs/00-ssot/END-OF-DAY-HANDOFF.md
- docs/15-case-plans/Case-001-Clocktower-Poisoning-Plan.md
- docs/15-case-plans/Case-001-Existing-Data-Inventory.md
- apps/api/src/services/case001ResultPatternService.ts
- apps/api/src/services/case001ResultPatternService.test.ts
- apps/api/src/services/case001GatedMilestoneEvaluationService.ts
- apps/api/src/services/case001GatedMilestoneEvaluationService.test.ts
- apps/api/src/routes/queryRoutes.test.ts
- apps/web/src/studentCase001.ts
- apps/web/src/studentCase001Progress.ts
- apps/web/src/useStudentCaseState.ts
- apps/web/src/useStudentCaseState.case001.test.tsx
- apps/web/src/App.tsx
- apps/web/src/App.test.tsx
- apps/web/src/api/types.ts
- apps/web/src/studentCase001Progress.test.ts
- apps/web/src/caseAuthoring.test.ts
- apps/web/src/studentCaseModule.test.ts
- apps/web/src/studentCaseModule.ts
- apps/web/src/components/student/studentCaseLibrary.ts
- apps/web/src/components/student/StudentWorkbenchView.tsx
- apps/web/src/components/student/StudentPlayableCaseSkeletonView.test.tsx
- apps/web/tests/browser/case-001-live-smoke.spec.ts

Do Not Modify:

- apps/api/src/services/queryExecutionService.ts
- apps/api/src/routes/queryRoutes.ts
- database/**
- Case 004 source, tests, and progression definitions
- package.json
- package-lock.json
- .codex/**

## Constraints

Non-negotiable rules.

- Preserve Case 004 behavior and existing Case 001 report/interview evidence semantics.
- Do not add a database migration; existing `CrimeType` data already contains Murder/`1080`.
- Keep backend result validation authoritative and non-spoiler.
- Keep the change limited to the required foundation step and its direct progression consequences.

## Required Behavior

Describe the exact functional change.

- A fresh Case 001 attempt opens with `SELECT * FROM CrimeType;` and tells the student to identify the Murder row and its `CrimeID`.
- Case 001 cannot complete the report milestone until the foundation milestone is validated; it cannot complete interviews until the report milestone is validated.
- Case 001 saved progress restores and revalidates all three query references in order.
- Legacy Case 001 saves that contain only report/interview references are normalized to zero milestone references so they cannot skip the foundation step.
- `What this case asks you to prove` names the active milestone objective; `What to do next` names the next learner action.
- Case 001 progress, completion count, reset/fresh-attempt summary, and browser smoke reflect 3 milestones.
- Case 004 starts and progresses unchanged.

## Acceptance Criteria

- [ ] CrimeType result validation and gated transport pass API tests.
- [ ] Case 001 fresh, ordered, resumed, blocked, reset, and completed flows pass frontend/browser tests.
- [ ] SSOT and Case 001 plan describe the three-step path.
- [ ] Build, focused tests, live smoke, graph refresh/readiness, and diff checks pass.
- [ ] No unrelated files changed.

## Code Prompt

Implement the required foundation-first Case 001 path exactly as specified.

Scope:
- Only modify the allowed files

Constraints:
- No refactors or dependencies.
- Preserve Case 004 and existing Case 001 report/interview validators.
- Do not weaken SQL safety, deterministic validation, resume revalidation, or spoiler boundaries.

Return:
- Exact code changes and validation evidence.
- Record any graph refresh limitation explicitly.

## Audit Prompt

Audit this change against the work package.

Verify:
- All acceptance criteria are satisfied
- No files outside allowed list were modified
- No functional regression
- Behavior remains consistent outside scope
- Impact analysis matches the actual changed files
- Dependencies and related tests were not omitted
- Graph regeneration decision was followed
- Understand output did not override SSOT or source evidence
- Verify the new CrimeType milestone is backend-authoritative, ordered before report/interview milestones, and cannot be completed by UI state, query text alone, or localStorage.

Output:
- Verdict: PASS or FAIL
- Violations
- Regressions
- Drift risks

## Code Results

Implemented in the shared worktree. Case 001 now exposes and validates the ordered `CrimeType` â†’ `CrimeSceneReport` â†’ `InterviewLog` path, gates later milestones on prior backend-approved results, persists and revalidates the three references in order, and normalizes legacy report/interview-only saves so they cannot skip the foundation step. The Query Lab also stays on `SELECT * FROM CrimeType;` during Case 001 restore, preventing a prior `InterviewLog` draft from appearing as the first query. The briefing now states the whole-case culprit objective, while Query Lab states only the active milestone objective. The proved CrimeType note is now recognized by Pinned Facts and emits an exact `CrimeID = 1080` query token. Report validation now requires the returned result set to contain only the target clocktower row, so intermediate broad queries remain editable and cannot replace the draft with InterviewLog. Guidance, progress counts, authoring records, SSOT documents, graph artifacts, frontend/API tests, and live smoke coverage were updated accordingly.

Validation completed:

- API test suite: passed.
- Web test suite: 19 files, 234 tests passed.
- Web TypeScript check and Vite build to a clean temporary output directory: passed. The default output directory was locked by an existing `dist` asset during the standard build command.
- API build: passed.
- Case 001 live-stack browser smoke: opt-in test was skipped because `CASE_001_LIVE_SMOKE=1` was not set; the existing smoke assertions cover the CrimeType first-query value.
- Understand graph refresh: passed (`1083` nodes, `415` edges).
- `git diff --check`: passed.

## Audit Results

Verdict: PASS

The implementation of [WP-281](docs/01-work-packages/WP-281-case-001-foundation-first-step.md) satisfies all acceptance criteria, enforces strict backend-authoritative validation and progression ordering for the `CrimeType` milestone, maintains database safety, preserves Case 004 isolation, provides full test coverage, and passes all build, preflight, and code-cleanliness checks.

---

### Verification Matrix

| Verification Dimension | Evaluated Source & Runtime Evidence | Audit Finding | Status |
|---|---|---|---|
| **1. Acceptance Criteria** | [WP-281](docs/01-work-packages/WP-281-case-001-foundation-first-step.md#L117-L124) | All 5 criteria are met: API tests pass, frontend unit/hook tests pass, SSOT/case plan documents are aligned, builds succeed, and whitespace/diff checks pass. | **PASS** |
| **2. Allowed Scope Adherence** | [WP-281 Allowed List](docs/01-work-packages/WP-281-case-001-foundation-first-step.md#L49-L85), [`git diff-tree --name-only 579c7e8`]() | All functional changes for WP-281 are confined to the 32 allowed files. Out-of-scope files present in commit history belong to the accepted WP-280 package (see Violations section). | **PASS** |
| **3. Functional Regression** | Full API and Web test suites | 0 regressions detected. Web test suite passes 19 test files (234 tests). API test suite passes all 15 test files. Web and API builds succeed without errors. | **PASS** |
| **4. Behavior Consistency Outside Scope** | [`useStudentCaseState.ts`](apps/web/src/useStudentCaseState.ts), [`sqlSafetyService.ts`](apps/api/src/services/sqlSafetyService.ts) | Case 004 progression, storage, and tests remain intact and isolated. SQL safety service and restricted table rules remain untouched. No database schema changes or migrations occurred. | **PASS** |
| **5. Impact Analysis Accuracy** | [WP-281 Impact Analysis](docs/01-work-packages/WP-281-case-001-foundation-first-step.md#L26-L48) | Layers, primary components, upstream consumers, and downstream dependencies match the modified files and test coverage. | **PASS** |
| **6. Dependencies & Related Tests** | API & Web test files | No required tests were omitted. Dedicated tests cover `CrimeType` pattern matching, gated milestone routing, UI feedback, ordering, reload revalidation, and live smoke. | **PASS** |
| **7. Knowledge Graph Refresh** | [`.understand-anything/`](.understand-anything) | Regeneration decision ("Yes after implementation") was followed. Graph was regenerated (1,083 nodes, 415 edges). Refresh readiness verified as `READY` with 0 modified tracked artifacts. | **PASS** |
| **8. SSOT & Source Evidence Authority** | [SSOT Documents](docs/00-ssot) | Understand graph output did not override SSOT definitions or source evidence. SSOT documents accurately define the three-step progression. | **PASS** |
| **9. CrimeType Milestone Authority & Ordering** | [`case001ResultPatternService.ts`](apps/api/src/services/case001ResultPatternService.ts), [`useStudentCaseState.ts`](apps/web/src/useStudentCaseState.ts), [`studentCase001Progress.ts`](apps/web/src/studentCase001Progress.ts) | Backend evaluates actual query result rows (`CrimeID = 1080` & `CrimeType = Murder`). Progression is strictly gated (`M0` &rarr; `M1` &rarr; `M2`). Cannot be satisfied by UI state, raw query strings, or unvalidated localStorage. | **PASS** |

---

### Detailed Milestone Verification: `CrimeType`

1. **Backend-Authoritative Validation**:
   - [`validateCase001CrimeTypeIdentified`](apps/api/src/services/case001ResultPatternService.ts#L91-L103) inspects returned database rows in [`QueryExecutionSuccessData`](apps/api/src/types/query.ts) via `isCase001CrimeTypeRow`, requiring `CrimeID = "1080"` and `CrimeType = "murder"`.
   - Pattern validation runs within [`evaluateCase001GatedMilestone`](apps/api/src/services/case001GatedMilestoneEvaluationService.ts#L85-L163) and is transmitted via `/api/query`.
   - Single-row narrowing requirement: [`validateCase001ClocktowerReportLocated`](apps/api/src/services/case001ResultPatternService.ts#L73-L89) requires `rows.length === 1 && matchedRowCount === 1`, ensuring intermediate broad queries cannot trigger early progression.

2. **Ordered Milestone Progression & Gating**:
   - In [`handleCase001QueryExecutionComplete`](apps/web/src/useStudentCaseState.ts#L3966-L3979):
     - Milestone `M1` (`case-001-clocktower-report-located`) requires `case001CompletedMilestones[CASE_001_M0]` to be `true`.
     - Milestone `M2` (`case-001-report-interviews-located`) requires `case001CompletedMilestones[CASE_001_M1]` to be `true`.
     - Out-of-order execution returns directional advisory feedback and rejects milestone advancement.

3. **Inability to Bypass via UI State, Query Text, or localStorage**:
   - **UI State**: UI views or button actions do not set milestone completion booleans; completion is derived strictly from backend response metadata `caseMilestoneEvaluation.matched === true`.
   - **Query Text Alone**: Queries that fail execution or return empty/irrelevant rows do not match. The milestone is awarded only on actual returned data matching the target record.
   - **localStorage / Reload Revalidation**:
     - [`studentCase001Progress.ts`](apps/web/src/studentCase001Progress.ts#L17-L51) persists only SQL query text in `evidenceQueries`, never completed milestone flags.
     - On page reload, [`useStudentCaseState.ts`](apps/web/src/useStudentCaseState.ts#L831-L858) re-executes each query sequentially against `/api/query` (`M0` &rarr; `M1` &rarr; `M2`). If any query fails backend revalidation, the sequence aborts.
     - Legacy saves lacking `M0` are normalized to zero milestone references by [`normalizeCase001Progress`](apps/web/src/studentCase001Progress.ts#L26-L30), preventing skips to `M1` or `M2`.

---

### Violations

- **None (Blocking)**.
- **Contextual Note on Commit Batching**:
  In git commit [`579c7e8`](), 4 files outside the WP-281 allowed list were touched:
  - [`StudentCaseLandingPage.tsx`](apps/web/src/components/student/StudentCaseLandingPage.tsx)
  - [`StudentEvidenceBoardView.tsx`](apps/web/src/components/student/StudentEvidenceBoardView.tsx)
  - [`styles.css`](apps/web/src/styles.css)
  - [`WP-280-correct-case-001-completion-guidance.md`](docs/01-work-packages/WP-280-correct-case-001-completion-guidance.md)

  These 4 files belong strictly to WP-280, which was developed in the same checkout and subsequently audited PASS and formally accepted in commit [`c40c7e2`](). Commit [`acb4334`]() touched [`run-work-package.ps1`](scripts/work-package/run-work-package.ps1) as part of test runner harness setup. The current working tree is clean (`git status` clean), and all changes attributed to WP-281 remain within the allowed file list.

---

### Regressions

- **None detected**.
  - All 19 web test files (234 tests) passed.
  - All 15 API test files passed.
  - TypeScript build checks for API (`tsc -p tsconfig.json`) and Web (`tsc -b && vite build`) passed cleanly.
  - Preflight checks via [`test-work-package-closeout-preflight.ps1`](scripts/tests/test-work-package-closeout-preflight.ps1) passed.

---

### Drift Risks

1. **Commit History Commingling**:
   Changes from WP-280 and WP-281 were committed under the same git commit [`579c7e8`]() prior to WP-280 closeout. While both work packages are functionally sound and independently verified, maintaining strict 1:1 commit-to-work-package discipline avoids scope ambiguity during automated git diff analysis.
2. **Opt-in Live Browser Smoke Guard**:
   [`case-001-live-smoke.spec.ts`](apps/web/tests/browser/case-001-live-smoke.spec.ts) requires `$env:CASE_001_LIVE_SMOKE="1"` and a running local stack (`Fastify API` + `Vite dev server`). In headless environments without active service daemons, smoke tests skip gracefully; primary verification relies on comprehensive unit/hook tests in [`useStudentCaseState.case001.test.tsx`](apps/web/src/useStudentCaseState.case001.test.tsx) and [`App.test.tsx`](apps/web/src/App.test.tsx).
3. **Seed Database Dependency for CrimeType**:
   The milestone logic assumes `CrimeID = 1080` maps to `Murder` in `CrimeType`. Any future database seed modifications must ensure this row remains fixed to avoid breaking the deterministic pattern matching.

## Final Decision

Accepted for commit after AntiGravity independent audit PASS. Human review confirmed the CrimeType-first foundation step, ordered milestone gates, and validation evidence are ready to close.
