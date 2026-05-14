# WP-083: Student Gameplay Progression and Mentor Reward Loop

## Objective

Improve the student gameplay loop by auditing the current clue progression, clarifying why the game advances after each successful query, and making Samuel Tupleton the clear mentor source for guidance, comprehension checks, and rewards.

## Background

Recent work packages simplified Student Mode and moved the frontend into clearer boundaries:

- `WP-074` refined the opening briefing and case facts.
- `WP-075` improved Samuel's next-step handoff after clues are found.
- `WP-076` through `WP-078` reduced competing guidance panels and aligned the Evidence Board with Samuel's current action.
- `WP-080` through `WP-082` improved frontend maintainability by extracting case data, UI sections, and Student Mode orchestration.

The app is now structurally ready for a gameplay-focused pass. The main remaining risk is not technical health; it is whether students understand the progression loop:

1. Samuel gives a lead.
2. The student runs or edits a query.
3. The result proves something.
4. The student logs the clue or answers a check-in.
5. Samuel explains why that mattered.
6. The next query or investigative direction becomes available.
7. The student receives a visible reward or progress signal.

The current experience has some of this, but it can still feel like the app silently changes state. In particular, queued queries can update after successful runs without enough explanation, and rewards/check-ins do not yet feel like a cohesive game system.

## Scope

### In Scope

- Audit the current Student Mode gameplay progression from the opening briefing through the witness trail.
- Clarify Samuel's mentor role as the primary source of:
  - next-step guidance
  - explanation of why the previous clue mattered
  - comprehension checks
  - reward/progress feedback
- Refine the copy and UI flow around queued query changes so students understand why the next query appears.
- Preserve or reintroduce comprehension-check moments in a way that supports learning without creating extra noise.
- Add or refine a lightweight reward/progress system for correct clue logging and check-in answers.
- Reduce redundant guidance between Samuel's header, Query Lab panels, Evidence Board panels, and result feedback.
- Keep the three-tab Student Mode structure unless the audit identifies a specific reason to adjust it.
- Update tests for any changed student progression behavior.
- Document the implementation and audit results in this work package.

### Out of Scope

- Backend, API, database, or schema changes.
- New external dependencies.
- New artwork generation unless explicitly approved later.
- Large visual redesigns unrelated to gameplay clarity.
- Developer Mode changes except where required to keep the app compiling.
- Rewriting the SQL case or changing the canonical solution path.

## Files Allowed to Change

- `docs/01-work-packages/WP-083-student-gameplay-progression-and-mentor-reward-loop.md`
- `apps/web/src/App.tsx`
- `apps/web/src/useStudentCaseState.ts`
- `apps/web/src/studentCase.ts`
- `apps/web/src/components/student/StudentMentorHeader.tsx`
- `apps/web/src/components/student/StudentBriefingView.tsx`
- `apps/web/src/components/student/StudentWorkbenchView.tsx`
- `apps/web/src/components/student/StudentEvidenceBoardView.tsx`
- `apps/web/src/components/student/StudentSchemaTable.tsx`
- `apps/web/src/App.test.tsx`
- `apps/web/src/components/QueryRunner.test.tsx`
- `apps/web/src/components/QueryRunner.tsx`
- `apps/web/src/styles.css`

## Constraints

- Samuel should be the student's primary narrative and instructional voice.
- Avoid adding new panels or labels unless they replace existing clutter.
- Do not duplicate the same guidance in multiple locations.
- Preserve the ability for students to reason through the SQL rather than simply following commands.
- Rewards should reinforce learning and progress, not become cosmetic noise.
- Keep copy concise enough that students can scan and act.
- Any gameplay change must still be testable through deterministic frontend behavior.

## Gameplay Questions To Answer

- Where does the student currently lose the thread between a successful query and the next queued query?
- Which messages should belong in Samuel's header, and which should be removed from lower panels?
- What is the clearest way to explain that a query was queued because the previous result proved a fact?
- Should comprehension checks live in the Evidence Board, Query Lab, Samuel header, or a unified Samuel check-in pattern?
- What reward signal should students receive for:
  - logging a correct clue
  - answering a comprehension check correctly
  - completing a milestone
  - advancing to a new investigative phase
- Can the reward system be represented with existing concepts such as clues logged, Insight Marks, case momentum, or Samuel's trust?
- Which current guidance surfaces can be simplified or removed?

## Required Behavior

- Students should understand why each next query or lead becomes available.
- Samuel should acknowledge correct progress and explain the next investigative move.
- Incorrect evidence logging should still provide useful correction without giving away the answer.
- Comprehension checks should support data-analysis reasoning and should not feel like unrelated trivia.
- Rewards/progress should be visible, meaningful, and lightweight.
- Query Lab navigation should not auto-jump to results merely because the tab was selected.
- Existing successful query, evidence logging, notebook, and milestone behavior should continue unless intentionally refined in this WP.

## Acceptance Criteria

- [x] The current Student Mode gameplay progression is audited and summarized in this WP.
- [x] Samuel is the clear source of mentor guidance, check-ins, and reward feedback.
- [x] Queued query changes are explained at the moment they happen.
- [x] Redundant lower-panel feedback is reduced or removed.
- [x] Comprehension-check opportunities are preserved or improved.
- [x] A lightweight reward/progress pattern is implemented or clearly deferred with rationale.
- [x] Student Mode tests are updated where behavior changes.
- [x] Web tests pass.
- [x] Web build passes.
- [x] No files outside the allowed list are modified.

## Codex Prompt

Implement WP-083.

Start with a brief audit of the current Student Mode gameplay loop, then make the highest-ROI frontend changes that improve mentor clarity, queued-query explanation, comprehension checks, and reward/progress feedback.

Focus on:

- Samuel as the single source of guidance and feedback.
- Clear explanation when the queued query changes.
- Preserving learning checks without clutter.
- A lightweight reward/progress signal for correct clues and check-ins.
- Reducing duplicate guidance in lower panels.

Constraints:

- Stay within the allowed files.
- Preserve the existing case solution path.
- Avoid adding dependencies.
- Keep copy concise and student-facing.
- Run web tests and web build.

Return:

- Gameplay audit summary.
- Exact files changed.
- UX changes made.
- Verification results.
- Follow-up recommendation.

## Gemini Audit Prompt

Audit WP-083 against the student gameplay progression and mentor reward loop objective.

Verify:

- The gameplay audit identifies the real progression/confusion points.
- Samuel becomes clearer as the source of guidance, check-ins, and reward feedback.
- Queued query changes are explained to the student.
- Redundant guidance is reduced rather than relocated.
- Comprehension checks remain useful for learning.
- Any reward/progress pattern is meaningful and lightweight.
- Existing Student Mode progression still works.
- Developer Mode remains unaffected.
- Tests and build pass.

Output:

- Verdict: PASS or FAIL
- Gameplay clarity findings
- UX regressions, if any
- Scope violations, if any
- Remaining risks

## Codex Results

Implemented WP-083.

Gameplay audit summary:

- The core progression loop is sound: Samuel gives a lead, the student queries, successful results create a loggable clue, and logged clues unlock the next step.
- The weakest moment was not the first query itself; it was the explanation after state changes. The app could queue the next query or show the next phase while the lower panels made that feel like system output instead of Samuel mentoring the student.
- Comprehension checks were valuable, but the generic `Case Review` label made them feel detached from Samuel and from the game loop.
- The reward signal existed as `Insight Marks`, but it was only visible in the Evidence Board and did not feed back into Samuel's relationship with the student.
- Witness-stage guidance was useful but over-labeled as a separate guide/checklist system. It now reads more clearly as Samuel's field note and evidence check.

Changes made:

- Added a compact mentor reward strip to Samuel's header:
  - `Samuel's Trust: Building | Steady | Strong`
  - `Insight Marks: N`
- Routed correct and incorrect comprehension-check feedback through Samuel's header so Samuel reacts to reasoning checks, not only evidence logging.
- Preserved the check-in questions and made them more explicitly Samuel-owned by renaming `Case Review` to `Samuel's Check-In`.
- Changed correct check-in feedback from a generic point message to `Insight Mark earned`, making the reward clearer.
- Kept queued-query explanations in Samuel's mentor message so students understand why CrimeSceneReport, CrimeID, and SQL City filters appear after prior evidence.
- Reframed the witness guidance panel as `Samuel's Field Note` and the Evidence Board witness checklist as `Samuel's Evidence Check`.
- Updated student progression tests to cover the mentor reward strip, Samuel-owned check-in label, revised witness guidance copy, and more specific Samuel feedback.

Files changed:

- `docs/01-work-packages/WP-083-student-gameplay-progression-and-mentor-reward-loop.md`
- `apps/web/src/App.tsx`
- `apps/web/src/App.test.tsx`
- `apps/web/src/components/student/StudentEvidenceBoardView.tsx`
- `apps/web/src/components/student/StudentMentorHeader.tsx`
- `apps/web/src/components/student/StudentWorkbenchView.tsx`
- `apps/web/src/studentCase.ts`
- `apps/web/src/styles.css`
- `apps/web/src/useStudentCaseState.ts`

Verification:

- `npm run test --workspace apps/web` passed: 7 test files, 34 tests.
- `npm run build --workspace apps/web` passed.
- Generated build artifacts were removed after verification.

Follow-up recommendation:

- Run the first three clue steps manually in-browser and watch whether the new reward strip improves motivation without adding visual clutter. If the reward language feels too abstract, the next small iteration should rename `Samuel's Trust` to a more concrete classroom-friendly label before adding more reward mechanics.

## Gemini Audit Results

- Verdict: **PASS**

### Gameplay clarity findings

- **Samuel as the Single Source of Truth:** The implementation successfully consolidates guidance. Samuel's header now serves as the primary feedback loop, routing correct/incorrect evidence logs and comprehension checks through a consistent mentor voice.
- **Queued Query Transparency:** The confusion point where the app "silently" changed state has been addressed. Samuel now explicitly explains *why* a query was queued (e.g., "I queued the SQL City filter because the briefing says this case happened in Sequel City").
- **Cohesive Reward System:** The introduction of `Samuel's Trust` and `Insight Marks` in the header provides a lightweight, visible progress signal that feels connected to the narrative rather than just a number on a board.
- **Reframed Learning Checks:** Renaming `Case Review` to `Samuel's Check-In` and routing the success message (`Insight Mark earned`) through the header makes these moments feel like a natural dialogue with the mentor.

### UX regressions

- **None identified.** The transition between "Briefing", "Query Lab", and "Evidence Board" remains smooth, and the new mentor strip in the header is compact enough not to displace critical workspace elements.

### Scope violations

- **None.** All changes were restricted to the allowed files in `apps/web/src/`. No backend or database changes were made, and Developer Mode remains functionally identical.

### Remaining risks

- **Trust Label Abstraction:** As noted in the follow-up recommendation, `Samuel's Trust: Building | Steady | Strong` might be too abstract for some students. Monitoring initial user feedback on whether this drives engagement or feels like "noise" is recommended.
- **Header Density:** The mentor header now carries more state (Message, Title, Trust, Marks). While it fits on desktop, extreme mobile widths should be monitored for vertical crowding.

## Final Decision

Accepted.

WP-083 is accepted based on the passing audit and verification results. The work improves the student gameplay progression, mentor feedback loop, comprehension-check framing, and lightweight reward visibility while staying within the approved frontend scope.

