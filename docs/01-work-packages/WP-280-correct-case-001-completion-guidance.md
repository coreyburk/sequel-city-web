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

- M2 Samuel guidance now acknowledges the learner’s discovery, explains ReportID as the bridge from the report to interviews, and gives one warm next action without exposing an answer.
- The fresh Case 001 opening now uses the authored first-step guidance and explicitly directs the first broad `CrimeSceneReport` query.
- The Case 001 briefing header now keeps the case objective separate from the first action: `What this case asks you to prove` names the report evidence goal, while `What to do first` gives the broad query and narrowing sequence.
- Query Lab now uses the active milestone objective for `What to prove` and reserves `What to do next` for Samuel's actionable guidance, including the M2 report-to-interview handoff.
- Resumed M1 presentation now avoids claiming a new discovery and directs the student to review the restored report row before continuing to InterviewLog.
- Query Lab’s Clocktower Evidence Path now uses the active Case 001 step’s guidance and observation prompt, so the warm mentoring voice is consistent across the header and query panel.
- Resuming after the M1 report query now restores its validated result rows before presenting M2 guidance, so the ReportID reference remains visible after reopening the case.
- Case landing now identifies `New attempt` versus `Saved attempt found`, labels the primary action as `Open Case File` or `Resume Case File`, and offers a confirmed `Start Fresh` action that clears only the selected case's saved state.
- Saved Case 001 and Case 004 attempts now show a truthful clue-progress summary on the landing page and in the fresh-start confirmation.
- Completion guidance remains explicit about the released evidence-review boundary and does not claim the full case is solved.
- Smoke test opens Menu before Reset Progress, covers wrong-filter and invalid-column recovery, checks keyboard focus behavior, verifies the report result survives an M1 reload before M2, waits for restored content after completion reload, and verifies the updated guidance.

Validation:

- PASS: `npm run test --workspace apps/web -- --run src/App.test.tsx src/studentCase001Progress.test.ts src/useStudentCaseState.case001.test.tsx` — 73 tests passed.
- PASS: `npm run build --workspace apps/web`.
- PASS: `CASE_001_LIVE_SMOKE=1` live Playwright smoke against `http://127.0.0.1:3001` — 1 test passed.
- PASS: `git diff --check`.

## Audit Results

Pending independent audit.

## Final Decision

Pending human acceptance.
