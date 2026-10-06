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
- Add the authored opening step, persisted query reference, gating, feedback, and browser coverage for `CrimeType` → `CrimeSceneReport` → `InterviewLog`.
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

Implemented in the shared worktree. Case 001 now exposes and validates the ordered `CrimeType` → `CrimeSceneReport` → `InterviewLog` path, gates later milestones on prior backend-approved results, persists and revalidates the three references in order, and normalizes legacy report/interview-only saves so they cannot skip the foundation step. The Query Lab also stays on `SELECT * FROM CrimeType;` during Case 001 restore, preventing a prior `InterviewLog` draft from appearing as the first query. The briefing now states the whole-case culprit objective, while Query Lab states only the active milestone objective. The proved CrimeType note is now recognized by Pinned Facts and emits an exact `CrimeID = 1080` query token. Report validation now requires the returned result set to contain only the target clocktower row, so intermediate broad queries remain editable and cannot replace the draft with InterviewLog. Guidance, progress counts, authoring records, SSOT documents, graph artifacts, frontend/API tests, and live smoke coverage were updated accordingly.

Validation completed:

- API test suite: passed.
- Web test suite: 19 files, 234 tests passed.
- Web TypeScript check and Vite build to a clean temporary output directory: passed. The default output directory was locked by an existing `dist` asset during the standard build command.
- API build: passed.
- Case 001 live-stack browser smoke: opt-in test was skipped because `CASE_001_LIVE_SMOKE=1` was not set; the existing smoke assertions cover the CrimeType first-query value.
- Understand graph refresh: passed (`1083` nodes, `415` edges).
- `git diff --check`: passed.

## Audit Results

Pending independent audit.

## Final Decision

Pending human acceptance.
