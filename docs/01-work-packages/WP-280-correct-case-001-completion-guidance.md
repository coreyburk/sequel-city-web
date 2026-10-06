# WP-280: Correct Case 001 completion guidance

## Objective

Show a truthful completion state after the released Case 001 evidence review and restore reliable live browser regression coverage.

## Scope

Correct defects found during the 2026-10-05 live Edge walkthrough: stale M2 instructions at 2/2, cold procedural M2 mentoring copy, an opening message that did not follow the first Case 001 path step, hidden Reset Progress menu assumptions, a reload timing race in the smoke test, and an invisible fresh-versus-resumed attempt state on the case landing page. Origins: WP-277-case-001-clue-guidance.md (guidance), WP-276-student-hamburger-navigation.md (menu), WP-274-case-001-tier-1-release-readiness-and-entry-bundle.md (smoke). This repairs existing behavior, not additional case content. The user explicitly requested implementation as well as correction.

## Impact Analysis

### Understand Status
- Graph available: Yes; baseline 3243f12b0a30a6a122a6468afebd3584c3f8beb2.
- Freshness: Application graph has drift; do not rely on it for these source relationships.
- Analysis: Required cross-component impact analysis performed directly against current source. studentCase001 supplies steps; useStudentCaseState selects the presentation; App supplies the existing active step to Briefing/Query Lab and will supply an optional completion summary to Evidence Board. Existing tests and live walkthrough verify these consumers.

### Affected Architecture
- Layers: Frontend presentation and browser regression test.
- Primary components: Case 001 copy, student hook, App, Evidence Board.
- Upstream: Existing backend-validated milestone flags.
- Downstream: case landing actions/status, Mentor header, briefing, Query Lab guidance, Evidence Board summary.

### Regression Surface
- Tests: Case 001 hook and App tests, production web build, live Case 001 smoke.
- User workflow: M1 -> M2 -> completion -> reload -> reset.
- Boundaries: Preserve two milestones, backend authority, learner query, Case 004, notebook persistence, no suspect verdict or new stages. Make saved Case 001/004 attempts visible and offer resume versus fresh reset without changing milestone authority.

### Graph Update Decision
- Regeneration required: No for this local presentation correction and test repair.
- Rationale: Existing component flow retained, optional presentation prop only; no module organization, imports between new modules, persistence model, database, security, or Case 004 progression changes. Stale graph is not used as evidence.

## Files Allowed to Change

Allowed:
- docs/01-work-packages/WP-280-correct-case-001-completion-guidance.md
- apps/web/src/studentCase001.ts
- apps/web/src/useStudentCaseState.ts
- apps/web/src/App.tsx
- apps/web/src/components/student/StudentEvidenceBoardView.tsx
- apps/web/src/components/student/StudentCaseLandingPage.tsx
- apps/web/src/studentCase001Progress.ts
- apps/web/src/styles.css
- apps/web/src/useStudentCaseState.case001.test.tsx
- apps/web/src/App.test.tsx
- apps/web/tests/browser/case-001-live-smoke.spec.ts
- docs/00-ssot/END-OF-DAY-HANDOFF.md

Handoff is closeout-only; not part of implementation.

Do Not Modify:
- apps/api/**
- database/**
- package.json
- package-lock.json
- .codex/**
- .understand-anything/**

## Constraints

No dependencies, database mutations, Case 004 milestone/progression changes, speculative abstractions, new milestones, acceptance, commit, or push. Existing learner SQL remains intact. Runtime audit and human acceptance remain separate.

## Required Behavior

- Both validated milestones select completion copy across all three views; incomplete and reset states retain their instructions.
- The active M2 guidance sounds like Samuel, an SQL detective mentor: warm, specific, clue-based, and directional while preserving the same report-to-InterviewLog sequence.
- The fresh Case 001 opening uses the first authored path step: it acknowledges finding the case file and directs the student to run the first broad `CrimeSceneReport` query before any narrowing.
- A resumed M1 state uses separate copy that identifies saved progress and asks the student to review the restored report row; it does not claim the student just found a row during the current visit.
- The case landing page visibly identifies a playable case as a `New attempt` or `Saved attempt found`.
- A saved attempt offers `Resume Case File` and `Start Fresh`; a fresh case offers `Open Case File`. Starting fresh confirms the action and clears only that case's saved learner state.
- Saved attempts show the number of completed clues when that evidence is available; otherwise they identify that saved work exists without inventing a completion count. The fresh-start confirmation repeats that summary before clearing the attempt.
- Evidence Board identifies the released evidence review as complete, not the whole case solved.
- Smoke opens Menu before reset, explicitly starts from reset, verifies completion and logged evidence after reload, and waits for restored UI instead of racing a disabled navigation button.
- Smoke covers wrong-filter/error recovery and menu keyboard focus, and retains case-specific reset isolation.

## Acceptance Criteria

- [x] Completion and incomplete/reset behavior covered by focused tests.
- [x] Released live smoke passes against real API/database.
- [x] No completion instruction directs students to repeat the finished SQL steps or enter unavailable stages.
- [x] M2 guidance provides a warm hint and one clear next action without revealing an answer or changing milestone authority.
- [x] Build and relevant App regression tests pass; Case 004 remains unchanged.
- [x] Landing-state indicator, resume action, and per-case fresh reset are covered by App regression tests.

## Code Prompt

Implement the narrow presentation correction and test repair. Reuse existing milestone flags and active-step interface. Verify focused hook/App tests, web build, and live smoke. Record actual results.

## Audit Prompt

Verify completion only after both validated milestones, restoration/reset behavior, no changed progression authority or learner SQL, and Case 004 isolation. Inspect smoke assertions for real browser waiting, Menu interactions, evidence persistence, and no masked skips. Confirm allowed scope and actual validation evidence.

## Code Results

Implemented the corrective presentation and browser-test changes.

- M2 Samuel guidance now acknowledges the learnerâ€™s discovery, explains ReportID as the bridge from the report to interviews, and gives one warm next action without exposing an answer.
- The fresh Case 001 opening now uses the authored first-step guidance and explicitly directs the first broad `CrimeSceneReport` query.
- The Case 001 briefing header now keeps the case objective separate from the first action: `What this case asks you to prove` names the report evidence goal, while `What to do first` gives the broad query and narrowing sequence.
- Query Lab now uses the active milestone objective for `What to prove` and reserves `What to do next` for Samuel's actionable guidance, including the M2 report-to-interview handoff.
- Resumed M1 presentation now avoids claiming a new discovery and directs the student to review the restored report row before continuing to InterviewLog.
- Query Labâ€™s Clocktower Evidence Path now uses the active Case 001 stepâ€™s guidance and observation prompt, so the warm mentoring voice is consistent across the header and query panel.
- Resuming after the M1 report query now restores its validated result rows before presenting M2 guidance, so the ReportID reference remains visible after reopening the case.
- Case landing now identifies `New attempt` versus `Saved attempt found`, labels the primary action as `Open Case File` or `Resume Case File`, and offers a confirmed `Start Fresh` action that clears only the selected case's saved state.
- Saved Case 001 and Case 004 attempts now show a truthful clue-progress summary on the landing page and in the fresh-start confirmation.
- Completion guidance remains explicit about the released evidence-review boundary and does not claim the full case is solved.
- Smoke test opens Menu before Reset Progress, covers wrong-filter and invalid-column recovery, checks keyboard focus behavior, verifies the report result survives an M1 reload before M2, waits for restored content after completion reload, and verifies the updated guidance.

Validation:

- PASS: `npm run test --workspace apps/web -- --run src/App.test.tsx src/studentCase001Progress.test.ts src/useStudentCaseState.case001.test.tsx` â€” 73 tests passed.
- PASS: `npm run build --workspace apps/web`.
- PASS: `CASE_001_LIVE_SMOKE=1` live Playwright smoke against `http://127.0.0.1:3001` â€” 1 test passed.
- PASS: `git diff --check`.

## Audit Results

Verdict: PASS

### Independent Audit Report: WP-280 Correct Case 001 Completion Guidance

- **Work Package**: [WP-280-correct-case-001-completion-guidance.md](docs/01-work-packages/WP-280-correct-case-001-completion-guidance.md)
- **Auditor**: AntiGravity Independent Auditor
- **Repository Workspace**: `SequelCityWeb-WP280-audit`
- **Work Acceptance**: **NOT ACCEPTED** (Recorded as `Pending human acceptance`; final decision reserved for human reviewer)
- **Verdict**: **PASS**

---

### Verification Summary

| Dimension | Evaluated Source & Runtime Evidence | Audit Finding | Status |
|---|---|---|---|
| **1. Completion Only After Validated Milestones** | [`studentCase001.ts`](apps/web/src/studentCase001.ts#L363-L373), [`useStudentCaseState.ts`](apps/web/src/useStudentCaseState.ts#L4535-L4599), [`StudentEvidenceBoardView.tsx`](apps/web/src/components/student/StudentEvidenceBoardView.tsx#L316-L321), and [`App.tsx`](apps/web/src/App.tsx#L829). | `case001Complete` requires `case001CompletedCount === CASE_001_MILESTONES.length`. `CASE_001_COMPLETION_STEP` clarifies that only the released evidence review is complete and explicitly states that it does not identify a culprit or solve the full case. Incomplete and reset states strictly retain their step-by-step instructions. | **PASS** |
| **2. Restoration & Reset Behavior** | [`studentCase001Progress.ts`](apps/web/src/studentCase001Progress.ts#L8-L77), [`useStudentCaseState.ts`](apps/web/src/useStudentCaseState.ts#L803-L859), [`StudentCaseLandingPage.tsx`](apps/web/src/components/student/StudentCaseLandingPage.tsx#L76-L111), and [`App.tsx`](apps/web/src/App.tsx#L494-L553). | Reopening re-executes stored SQL queries against the backend API to re-evaluate milestone matches rather than trusting cached completion booleans. Resumed M1 presentation restores the query result rows and provides separate copy acknowledging saved progress without claiming a new discovery. The landing page truthfully displays `New attempt` vs. `Saved attempt found` and exposes confirmed `Start Fresh` reset behavior. | **PASS** |
| **3. Progression Authority & Learner SQL** | [`studentCase001.ts`](apps/web/src/studentCase001.ts#L194-L252), [`useStudentCaseState.ts`](apps/web/src/useStudentCaseState.ts#L3975-L3995), and [`case001ResultPatternService.ts`](apps/api/src/services/case001ResultPatternService.ts). | Progression authority remains solely on deterministic backend pattern matching (`validationOwner: "deterministic-backend-result-pattern"`). Starter drafts remain generic table sweeps (`SELECT * FROM CrimeType;`, `SELECT * FROM CrimeSceneReport;`, `SELECT * FROM InterviewLog;`). Zero prefilled answers or filter leaks exist. Active M2 guidance sounds like Samuel: encouraging, directional, and clue-based without revealing values. | **PASS** |
| **4. Case 004 Isolation** | [`studentCase001Progress.ts`](apps/web/src/studentCase001Progress.ts#L4), [`App.tsx`](apps/web/src/App.tsx#L494-L505), [`useStudentCaseState.case001.test.tsx`](apps/web/src/useStudentCaseState.case001.test.tsx#L2159-L2165), and [`case-001-live-smoke.spec.ts`](apps/web/tests/browser/case-001-live-smoke.spec.ts#L358-L384). | Case 001 storage (`sequel-city.case-001.student-state.v1`) is strictly separated from Case 004 storage (`sequel-city.case-004.student-state.v1`). Case 001 reset operations clear only Case 001 keys. Sentinel tests and live smoke tests confirm Case 004 and unrelated keys remain intact after Case 001 resets. Protected Case 004 ReportID (`10975`) remains guarded. | **PASS** |
| **5. Smoke Test Assertions & Mechanics** | [`case-001-live-smoke.spec.ts`](apps/web/tests/browser/case-001-live-smoke.spec.ts). | Uses web-first Playwright locators (`toBeVisible()`, `toContainText()`, `toHaveValue()`), explicit `waitForResponse` promises on query execution, and `expect.poll` for localStorage synchronization with no arbitrary sleeps. Validates Menu open, keyboard navigation (Enter/Escape focus handling), and dialog confirmation before Reset Progress. Verifies evidence persistence across page reloads at both M1 and completion. Preflight blockers throw explicit exceptions with zero masked skips. | **PASS** |
| **6. Scope & Validation Evidence** | [`git diff --check`](), [WP-280](docs/01-work-packages/WP-280-correct-case-001-completion-guidance.md#L33-L58), and automated test suites. | All modified files adhere to the allowed files specification. Working tree diff is clean. 77 focused web unit/integration tests passed, web production build succeeded with Vite, API tests passed, and opt-in live Playwright smoke test passed in 5.7s against the live stack. | **PASS** |

---

### Executed Validation Evidence

1. **Focused Web Test Suite**:
   ```powershell
   npm run test --workspace apps/web -- --run src/App.test.tsx src/studentCase001Progress.test.ts src/useStudentCaseState.case001.test.tsx
   ```
   - **Result**: PASS (3 test files, 77 passed, 0 failed; duration: 12.11s)

2. **Web Production Build**:
   ```powershell
   npm run build --workspace apps/web
   ```
   - **Result**: PASS (`tsc -b && vite build` built successfully in 142ms)

3. **API Test Suite**:
   ```powershell
   npm run test --workspace apps/api
   ```
   - **Result**: PASS (All API unit and integration test suites passed, including Case 001 result patterns and milestone routes)

4. **Live Browser Smoke Test**:
   ```powershell
   $env:CASE_001_LIVE_SMOKE="1"; npm run test:browser --workspace apps/web -- case-001-live-smoke.spec.ts
   ```
   - **Result**: PASS (1 passed in 5.7s against live API `http://127.0.0.1:3001` and Vite dev server)

5. **Diff & Whitespace Cleanliness**:
   ```powershell
   git diff --check
   ```
   - **Result**: PASS (0 formatting or whitespace errors detected)

## Final Decision

Accepted for commit after AntiGravity independent audit PASS. Human review confirmed the scoped Case 001 guidance, reset/resume behavior, and validation evidence are ready to close.
