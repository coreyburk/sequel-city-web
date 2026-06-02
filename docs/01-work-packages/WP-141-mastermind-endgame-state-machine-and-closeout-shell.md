# WP-141: Mastermind Endgame State Machine And Closeout Shell

**Status:** Accepted  
**Owner:** Codex  
**Created:** 2026-06-01

## Objective

Repair the late Student Mode mastermind experience so the app presents one coherent endgame phase at a time, explains why the student is querying event data, and transitions into a true solved-case closeout state once the mastermind is confirmed.

## Why This WP Exists

The headed Playwright walkthrough on 2026-06-01 showed that the mastermind branch was technically completable but still confusing in the live UI:

- the shell continued to render first-suspect / witness-trail guidance after the student had already entered the mastermind branch
- the `EventSchedule` and `EventRegistration` steps did not consistently explain why those tables mattered now or what exact clue chain led there
- the final solved state still coexisted with stale header, progress, and checklist content that belonged to earlier phases
- the student could reach `Mastermind Confirmed` while other surfaces still claimed the current step was `First Suspect Theory`

The issue was no longer just copy polish. The underlying late-stage UI phase model was too implicit and too distributed, so multiple surfaces drifted out of sync.

## Evidence From Live Browser Review

Headed walkthrough command:

- `$env:VITE_TESTING='true'; npm run test:browser:headed --workspace apps/web -- tests/browser/student-mode.spec.ts -g "walks the shortlist into identity and event-trail guidance in a real browser"`

Relevant captured evidence:

- [01-after-identities.png](/D:/GitHub-Repos/SequelCityWeb/apps/web/test-results/manual-mastermind-review/01-after-identities.png)
- [02-event-schedule-results.png](/D:/GitHub-Repos/SequelCityWeb/apps/web/test-results/manual-mastermind-review/02-event-schedule-results.png)
- [03-event-registration-results.png](/D:/GitHub-Repos/SequelCityWeb/apps/web/test-results/manual-mastermind-review/03-event-registration-results.png)
- [04-final-confirmation.png](/D:/GitHub-Repos/SequelCityWeb/apps/web/test-results/manual-mastermind-review/04-final-confirmation.png)

## Scope

### In Scope

- define explicit late mastermind UI phases in state instead of inferring them loosely from the last query result
- align Samuel header title, `What to Prove`, `What to Do Next`, Query Lab guidance, result feedback, and progress shell to the same active mastermind phase
- make the event-table rationale explicit from earned clues:
  - three meetings last December
  - next to Symphony Hall
  - dressed up like date night
- ensure the student sees one immediate next action at a time during:
  - identity lookup
  - event schedule lookup
  - event registration cross-check
  - mastermind confirmation
- replace stale first-suspect / witness-trail labels and footer hints once the mastermind branch begins
- convert the final confirmation screen into a coherent closeout shell instead of a mixed in-progress view
- add or update focused unit and Playwright coverage for the corrected mastermind endgame states
- document implementation, verification, and audit outcome in this WP

### Out of Scope

- backend or database-schema changes
- redesigning earlier witness, gym, or trigger-man chapters
- new case content outside the mastermind endgame
- broad visual redesign unrelated to late-stage clarity and solved-state coherence

## Files Allowed to Change

Allowed:

- `apps/web/src/App.tsx`
- `apps/web/src/useStudentCaseState.ts`
- `apps/web/src/studentCase.ts`
- `apps/web/src/components/student/StudentEvidenceBoardView.tsx`
- `apps/web/src/components/student/StudentWorkbenchView.tsx`
- `apps/web/src/components/QueryRunner.tsx`
- `apps/web/src/App.test.tsx`
- `apps/web/tests/browser/student-mode.spec.ts`
- `apps/web/tests/browser/studentModeHarness.ts`
- `docs/01-work-packages/WP-141-mastermind-endgame-state-machine-and-closeout-shell.md`

Do Not Modify:

- `apps/api/**`
- `database/**`
- unrelated docs, scripts, or generated browser artifacts

## Constraints

- keep the implementation within frontend, browser-test, and WP-doc scope
- preserve deterministic browser behavior under `VITE_TESTING`
- do not hard-code suspect or mastermind names into new guidance logic
- avoid multi-step guidance bundles; each active phase should present one immediate next move
- the solved mastermind state must not coexist with stale earlier-phase labels or prompts

## Required Behavior

- the mastermind branch must expose explicit late-stage phases at minimum for:
  - `identity-lookup`
  - `event-schedule-lookup`
  - `event-registration-cross-check`
  - `confirmed`
- each phase must own exactly one coherent set of:
  - branch title
  - `What to Prove`
  - `What to Do Next`
  - Query Lab instruction
  - result feedback / reinforcement
  - Samuel visual tone
  - progress-shell label
- the event-table move must be explained from the earned clue trail before the student is asked to query those tables
- after mastermind confirmation, the shell must switch into a real closeout state:
  - no stale `First Suspect Theory` step label
  - no stale witness-trail or trigger-check feedback
  - no earlier-phase guidance still occupying the hero area
- the final solved view must emphasize the verdict and closure rather than leaving the student in a visually mixed in-progress state

## Acceptance Criteria

- [x] The mastermind branch uses explicit late-stage phases instead of loosely inferred mixed states
- [x] Samuel's header, Query Lab guidance, feedback panel, and progress shell stay synchronized throughout the mastermind endgame
- [x] The student is given a clear clue-based reason to query `EventSchedule` before `EventRegistration`
- [x] Each mastermind phase presents one immediate next action instead of bundled multi-step instructions
- [x] The final `Mastermind Confirmed` state no longer coexists with stale first-suspect or witness-trail shell content
- [x] Focused frontend and browser verification exists for the corrected mastermind endgame

## Code Results

- Added an explicit `MastermindEndgamePhase` model and centralized late-branch title, objective, and guidance helpers in [D:\GitHub-Repos\SequelCityWeb\apps\web\src\studentCase.ts](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/studentCase.ts) so the mastermind endgame no longer depends on loosely inferred mixed shell states.
- Reworked [D:\GitHub-Repos\SequelCityWeb\apps\web\src\useStudentCaseState.ts](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/useStudentCaseState.ts) so Student Mode derives explicit late phases for `profile`, `candidate-narrowing`, `identity-lookup`, `event-schedule-lookup`, `event-registration-cross-check`, and `confirmed`, then feeds those phases into the header, Query Lab instruction, failure guidance, evidence prompt, current-step shell, and scene selection from one source of truth.
- Updated [D:\GitHub-Repos\SequelCityWeb\apps\web\src\App.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/App.tsx) to pass the new mastermind phase and current-step state into the workbench and evidence-board surfaces instead of letting those components infer late progression separately.
- Rebuilt the mastermind brief flow in [D:\GitHub-Repos\SequelCityWeb\apps\web\src\components\student\StudentWorkbenchView.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/components/student/StudentWorkbenchView.tsx) so each late phase exposes only one immediate next action, only the phase-relevant query tokens, and a clue-based rationale that points students to `EventSchedule` first because the killer's earned clue trail says the meetings happened near Symphony Hall, in December, dressed like date night.
- Updated [D:\GitHub-Repos\SequelCityWeb\apps\web\src\components\student\StudentEvidenceBoardView.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/components/student/StudentEvidenceBoardView.tsx) so the mastermind endgame owns the `Current Step` shell and the solved mastermind state becomes a real closeout view instead of coexisting with stale `First Suspect Theory` / witness-trail progress content.
- Tightened the regression coverage in [D:\GitHub-Repos\SequelCityWeb\apps\web\src\App.test.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/App.test.tsx) and [D:\GitHub-Repos\SequelCityWeb\apps\web\tests\browser\student-mode.spec.ts](/D:/GitHub-Repos/SequelCityWeb/apps/web/tests/browser/student-mode.spec.ts) so the corrected mastermind shell, guidance handoffs, and browser walkthrough remain locked to the intended endgame order.

## Verification

- `npm run test --workspace apps/web -- --run src/App.test.tsx`
- Result: `55 passed`
- `npm run test:browser --workspace apps/web`
- Result: `3 passed`

## Audit Prompt

Audit WP-141 mastermind endgame implementation for state-model clarity, shell consistency, UX coherence, scope compliance, and regression risk.

Verify:

1. The implementation stays inside the approved frontend/browser-test/doc scope.
2. The mastermind branch now uses explicit late-stage phases instead of mixed inferred shell states.
3. Samuel header content, Query Lab guidance, progress shell, and feedback panels stay synchronized during the mastermind endgame.
4. The app explains why `EventSchedule` is queried before asking the student to use event tables.
5. Each mastermind phase presents one immediate next action instead of multi-step bundles.
6. The final `Mastermind Confirmed` state no longer coexists with stale first-suspect / witness-trail shell content.
7. Focused browser evidence and supporting frontend tests cover the corrected endgame progression.

## Audit Results

Based on a comprehensive audit of the **WP-141: Mastermind Endgame Implementation**, I have verified that the implementation successfully addresses the state-model clarity, shell consistency, and UX coherence issues identified in previous walkthroughs.

### Audit Summary

1.  **Scope Compliance:** All modifications are strictly confined to the approved `apps/web/src` and `docs/01-work-packages` scope. No backend or database changes were introduced.
2.  **State Model Clarity:** The implementation replaces loosely inferred shell states with an explicit `MastermindEndgamePhase` model. Phases such as `profile`, `candidate-narrowing`, `identity-lookup`, `event-schedule-lookup`, `event-registration-cross-check`, and `confirmed` are now centrally derived in `useStudentCaseState.ts`.
3.  **Shell Consistency:**
    *   The **Samuel Header** (`mentorTitle`, `mentorMessage`), **Query Lab Guidance** (`StudentWorkbenchView`), and **Case Progress Shell** (`StudentEvidenceBoardView`) are now fully synchronized using the centralized phase state.
    *   Stale labels from the "First Suspect" or "Witness Trail" chapters no longer leak into the mastermind endgame.
4.  **UX Coherence:**
    *   **Event Trail Rationale:** The application now explicitly explains *why* `EventSchedule` is the next logical step (using the "December meetings near Symphony Hall" clue) before students move to the `EventRegistration` join table.
    *   **Immediate Next Actions:** Each mastermind phase is designed around one clear action, reducing cognitive load and preventing "multi-step bundle" confusion.
5.  **State Cleanliness:** Upon confirming the mastermind, the UI successfully transitions into a dedicated **Closeout Shell**. The `Mastermind Confirmed` state hides irrelevant in-progress milestones and check-ins, providing a satisfying sense of case resolution.
6.  **Regression Risk & Validation:**
    *   **Unit Tests:** `App.test.tsx` has been updated with 55 passing tests covering the new endgame phases and guidance handoffs.
    *   **Browser Tests:** Playwright tests (`student-mode.spec.ts`) verify the end-to-end flow in a real browser, confirming that the guidance correctly follows the intended endgame order.

### Recommendation
The implementation is **Approved**. It meets all acceptance criteria and provides a robust, coherent, and well-tested final chapter for the student investigation experience.
Warning: 256-color support not detected. Using a terminal with at least 256-color support is recommended for a better visual experience.
Ripgrep is not available. Falling back to GrepTool.
(node:81148) [DEP0190] DeprecationWarning: Passing args to a child process with shell option true can lead to security vulnerabilities, as the arguments are not escaped, only concatenated.
(Use `node --trace-deprecation ...` to show where the warning was created)

## Final Decision

Accepted.

Reason: The audit approved the implementation, focused App coverage passed with 55 tests, and the Student Mode browser suite passed with 3 real-browser walkthrough tests. WP-141 satisfies the accepted mastermind endgame scope and keeps the changes within the approved frontend, browser-test, and work-package documentation boundary.

