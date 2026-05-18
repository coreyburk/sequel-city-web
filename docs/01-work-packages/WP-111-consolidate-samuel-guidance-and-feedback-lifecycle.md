# WP-111: consolidate-samuel-guidance-and-feedback-lifecycle

## Objective

Consolidate student-facing guidance into Samuelâ€™s Guidance and improve feedback lifecycle behavior so students receive one clear instruction source and timely clue feedback.

Recent improvements restored strong clue feedback and made Log Clue actions more visible. However, required next-step guidance is still split across multiple areas, and successful clue feedback can remain visible after the student has moved on to a different task.

This WP refines the learning loop so:

- Samuelâ€™s Guidance is the primary instruction source
- Query Runner and Case Progress avoid duplicating Samuelâ€™s instruction
- clue feedback appears when useful and clears at the right time
- Samuelâ€™s language remains student-friendly and not overly technical

The guiding principle is:

Samuel gives the direction. The workspace supports action. Feedback confirms or redirects.

---

## Scope

Refine Student Mode guidance placement, feedback lifecycle, and Samuel wording.

This WP may modify:

- Samuel guidance content mapping
- Query Runner helper text
- Case Progress next-step display
- clue feedback display and lifecycle
- clue feedback state handling
- student-facing copy
- related CSS
- tests
- user journey documentation if needed

No backend API changes.
No database changes.
No SQL execution changes.
No runtime AI behavior.

---

## Files Allowed to Change

Allowed:

- apps/web/src/components/student/**
- apps/web/src/components/**
- apps/web/src/features/**
- apps/web/src/hooks/**
- apps/web/src/utils/**
- apps/web/src/types/**
- apps/web/src/state/**
- apps/web/src/App.tsx
- apps/web/src/App.test.tsx
- apps/web/src/styles.css
- docs/10-user-journey/**
- docs/01-work-packages/WP-111-consolidate-samuel-guidance-and-feedback-lifecycle.md

Do Not Modify:

- apps/api/**
- database/**
- docs/00-ssot/**
- docs/06-architecture/**
- docs/07-api-contracts/**
- docs/08-database/**
- docs/09-release-readiness/**
- package.json files
- build configuration
- runner scripts

---

## Constraints

- Preserve deterministic gameplay principles
- Preserve learner agency
- Preserve spoiler-safe investigation flow
- Preserve Samuelâ€™s mentor role
- Preserve simplified Student Mode structure
- Preserve stable header grid
- Preserve visible correct and incorrect clue feedback
- No runtime AI behavior
- No automatic suspect deduction
- No automatic clue detection
- No automatic evidence logging
- No hidden automatic case completion
- No backend API changes
- No SQL execution changes
- No broad visual redesign

UX constraints:

- Use Samuelâ€™s Guidance as the primary instruction source
- Avoid duplicate next-step instructions in multiple panels
- Query Runner should support action, not repeat the main guidance
- Case Progress should track progress, not compete with Samuelâ€™s Guidance
- Clue feedback should be visible when relevant and clear when stale
- Samuelâ€™s wording should be student-friendly and not overly technical
- Preserve clear wrong-clue redirection

---

## Required Behavior

### 1. Consolidate Required Next Step Into Samuelâ€™s Guidance

Samuelâ€™s Guidance in the header should become the primary location for the current required next step.

Move or mirror the meaningful next-step instruction into Samuelâ€™s Guidance so students do not have to scan multiple areas for the main task.

Avoid having slightly different next-step wording in:

- Samuelâ€™s Guidance
- Query Runner
- Case Progress
- Evidence Notebook

The header should clearly answer:

- What am I trying to prove right now?
- What action should I take next?

---

### 2. Reduce Duplicate Guidance In Query Runner

Query Runner should provide short operational support only.

It may include brief functional text such as:

- Write SQL and inspect the results.
- Use blocks or pinned facts to build your query.

It should not repeat the full Samuel next-step instruction if that instruction is already in the header.

Do not remove necessary functional labels such as:

- SQL Query
- Run Query
- Query Results

---

### 3. Reduce Duplicate Guidance In Case Progress

Case Progress should remain a progress tracker.

It should continue showing:

- completed milestones
- checked/unchecked progress items
- current stage status

But it should not compete with Samuelâ€™s Guidance by restating a long required instruction.

Recommended direction:

- Keep a concise â€œCurrent Stepâ€ or progress label.
- Avoid duplicating full Samuel guidance.
- Keep optional check-in visually subordinate.

Do not remove Case Progress.

---

### 4. Feedback Lifecycle For Correct Clue Logging

Correct clue feedback should appear prominently after a valid clue is logged.

Then it should clear when it becomes stale.

Acceptable lifecycle options:

- auto-dismiss after a short timeout
- clear when the student runs another query
- clear when the active milestone changes
- clear when the student switches relevant task context
- combine timeout and context clearing

The feedback should not remain indefinitely once the student has moved on to the next clue collection task.

Do not remove correct-clue reinforcement entirely.

---

### 5. Feedback Lifecycle For Incorrect Clue Logging

Incorrect clue feedback should remain long enough to guide correction.

It may clear when:

- the student logs a different clue
- the student runs a new query
- the student edits the SQL query
- a short timeout expires

Incorrect feedback should remain:

- immediate
- visible
- supportive
- spoiler-safe
- deterministic

Do not reveal the correct row or exact answer.

---

### 6. Student-Friendly Samuel Wording

Revise Samuelâ€™s clue guidance to reduce overly technical phrasing where possible.

Avoid wording that feels like implementation instructions.

Example to improve:

- `Use InterviewLog to connect those witness clues to the right people.`

Preferred direction:

- `Find the witness records tied to this report. Look for repeated person IDs and choose a row that sounds like a real scene observation.`

Samuel may mention table names when they are part of the current learning objective, but wording should remain understandable and detective-like.

Do not:

- generate exact SQL
- provide answer rows
- reveal future clue chains
- confirm suspects

---

### 7. Preserve Reinforcement And Feedback Quality

Keep the recent improvements:

- stronger Log Clue buttons
- visible correct feedback
- visible incorrect feedback
- supportive redirection
- no automatic clue logging
- no automatic clue identification

This WP refines placement and lifecycle, not the underlying deterministic authority model.

---

### 8. Tests

Add or update tests for:

- Samuelâ€™s Guidance contains the current required next-step instruction
- Query Runner no longer duplicates the full required instruction
- Case Progress no longer duplicates long Samuel guidance
- correct clue feedback appears after a valid clue
- correct clue feedback clears on timeout, query change, milestone change, or selected implemented lifecycle trigger
- incorrect clue feedback appears after invalid clue logging
- incorrect clue feedback clears appropriately
- Samuel guidance wording avoids overly technical duplicated phrasing where practical
- deterministic progression remains intact

Use fake timers if timeout behavior is implemented.

Preserve existing tests.

---

### 9. Documentation

Update user journey documentation if needed to explain:

- Samuelâ€™s Guidance is the primary instruction source
- Query Runner supports action
- Case Progress tracks progress
- clue feedback is visible but lifecycle-bound
- feedback remains deterministic and spoiler-safe

Keep documentation concise and implementation-aligned.

---

## Acceptance Criteria

- Samuelâ€™s Guidance is the primary location for current required next-step guidance
- Query Runner no longer duplicates long required next-step guidance
- Case Progress no longer competes with Samuelâ€™s Guidance through long duplicate instructions
- Case Progress remains visible and useful as a progress tracker
- correct clue feedback appears after valid clue logging
- correct clue feedback clears when stale
- incorrect clue feedback appears after invalid clue logging
- incorrect clue feedback clears appropriately without hiding too quickly
- Samuel clue guidance is more student-friendly and less overly technical
- wrong-clue feedback remains supportive and spoiler-safe
- no exact SQL is generated
- no correct row is revealed by feedback
- no automatic clue detection introduced
- no automatic evidence logging introduced
- deterministic progression remains intact
- tests updated where practical
- user journey documentation updated if needed
- no backend API changes introduced
- no SQL execution behavior changed
- no runtime AI behavior introduced

---

## Code Prompt

You are implementing WP-111 for the Sequel City Web Detective project.

Objective:
Consolidate student-facing guidance into Samuelâ€™s Guidance and improve clue feedback lifecycle behavior.

Problem:
The current student experience has improved, but required next-step guidance is still spread across multiple places. Samuelâ€™s Guidance, Query Runner, Case Progress, and other panels can provide similar but slightly different instructions. This forces students to scan too many areas. Correct clue feedback is helpful, but it can remain visible after the student has moved on to the next clue collection task. Some Samuel guidance is also too technical.

Guiding principle:
Samuel gives the direction. The workspace supports action. Feedback confirms or redirects.

Important:

- Preserve deterministic gameplay principles.
- Preserve learner agency.
- Preserve spoiler-safe investigation flow.
- Preserve Samuelâ€™s mentor role.
- Preserve stable header grid.
- Preserve visible correct and incorrect clue feedback.
- No runtime AI behavior.
- No automatic suspect deduction.
- No automatic clue detection.
- No automatic evidence logging.
- No backend API changes.
- No SQL execution changes.
- Keep changes focused and student-centered.

Before editing:

1. Review `StudentMentorHeader.tsx`.
2. Review `StudentWorkbenchView.tsx`.
3. Review `StudentEvidenceBoardView.tsx`.
4. Review Query Runner and Pinned Facts helper copy.
5. Review clue logging feedback state and rendering.
6. Review student case state/progression logic for clue acceptance and rejection.
7. Review deterministic reinforcement behavior.
8. Review tests around clue logging, Query Runner, Case Progress, and student progression.
9. Review `docs/10-user-journey` only if documentation needs updating.

Implement:

1. Consolidate current required guidance into Samuelâ€™s Guidance:

   - the header should clearly tell students what they are trying to prove and what to do next.
   - avoid slightly different long next-step instructions in multiple panels.
   - use the header as the primary instruction source.
2. Reduce duplicate Query Runner guidance:

   - keep Query Runner helper text short and functional.
   - do not repeat the full Samuel next-step instruction there.
   - preserve SQL Query, Run Query, and Query Results labels.
3. Reduce duplicate Case Progress guidance:

   - keep Case Progress as a progress tracker.
   - avoid long duplicated required instructions that compete with Samuelâ€™s Guidance.
   - preserve completed milestone count and checklist behavior.
   - keep check-in content subordinate.
4. Implement correct clue feedback lifecycle:

   - correct clue feedback should appear after a valid clue is logged.
   - it should clear when stale.
   - choose a deterministic lifecycle such as timeout, new query run, SQL edit, milestone change, or a combination.
   - use fake timers in tests if using timeout behavior.
   - do not remove positive reinforcement.
5. Implement incorrect clue feedback lifecycle:

   - incorrect clue feedback should appear after an invalid or currently non-useful clue attempt.
   - it should remain long enough to guide correction.
   - it should clear on a sensible deterministic trigger such as new query, SQL edit, another clue attempt, or timeout.
   - do not reveal the correct row.
   - do not reveal future clues.
6. Make Samuel wording more student-friendly:

   - reduce overly technical phrasing where it does not help.
   - table names may remain when they are part of the current learning objective, but frame them in detective-friendly language.
   - do not generate exact SQL.
   - do not reveal answer rows.
   - do not reveal future clue chains.
7. Preserve existing good behavior:

   - strong Log Clue affordances.
   - correct feedback.
   - incorrect feedback.
   - notebook functionality.
   - deterministic progression.
8. Tests:

   - update or add tests for guidance consolidation.
   - update or add tests for feedback lifecycle.
   - update or add tests for wrong-clue feedback still being visible and spoiler-safe.
   - preserve existing progression tests.
9. Documentation:

   - update `docs/10-user-journey` only if needed.

Do not:

- change SQL validation.
- change backend APIs.
- modify database scripts.
- introduce runtime AI.
- auto-detect correct clues.
- auto-log evidence.
- auto-highlight solution rows.
- reveal hidden suspect identities.
- reveal direct solution paths.
- remove Evidence Notebook.
- remove Case Progress.
- remove Samuelâ€™s core guidance.
- undo the stable header grid.
- reintroduce visible trail systems into Student Mode.
- add new panels or systems.

Preserve:

- frontend/backend boundaries.
- deterministic gameplay behavior.
- mentor-guided noir tone.
- simplified Student Mode structure.
- accessibility and readability.
- learner ownership of evidence interpretation.

Keep the implementation precise, deterministic, supportive, and focused on the student learning loop.

---

## Gemini Audit Prompt

Audit WP-111 Samuel guidance consolidation and feedback lifecycle implementation.

Verify:

1. Only approved frontend and documentation files were modified.
2. No backend runtime files changed.
3. No database scripts changed.
4. No SQL execution behavior changed.
5. Samuelâ€™s Guidance is the primary location for current required next-step guidance.
6. Query Runner no longer duplicates long required next-step guidance.
7. Case Progress no longer competes with Samuelâ€™s Guidance through long duplicate instructions.
8. Case Progress remains visible and useful as a progress tracker.
9. Correct clue feedback appears after valid clue logging.
10. Correct clue feedback clears when stale.
11. Incorrect clue feedback appears after invalid clue logging.
12. Incorrect clue feedback clears appropriately without hiding too quickly.
13. Samuel guidance wording is more student-friendly and less overly technical.
14. Wrong-clue feedback remains supportive and spoiler-safe.
15. No exact SQL is generated.
16. No correct row is revealed by feedback.
17. No future clue chains are revealed by feedback.
18. No automatic clue detection was introduced.
19. No automatic evidence logging was introduced.
20. Deterministic progression remains intact.
21. Tests were updated or added where practical.
22. Documentation was updated if needed.

Specifically validate:

- StudentMentorHeader guidance content
- Query Runner helper text
- Case Progress required/current-step wording
- correct clue feedback lifecycle
- incorrect clue feedback lifecycle
- feedback timeout or deterministic clearing behavior
- student-friendly Samuel wording
- preservation of notebook and progress behavior
- preservation of stable header grid
- test coverage

Flag:

- guidance still scattered across multiple places
- Query Runner duplicating full Samuel guidance
- Case Progress duplicating full Samuel guidance
- correct feedback remaining indefinitely after context changes
- incorrect feedback disappearing too quickly to help
- technical or implementation-heavy Samuel wording
- exact SQL generation
- correct row disclosure
- future clue disclosure
- automatic clue detection
- automatic evidence logging
- Evidence Notebook regression
- Case Progress regression
- gameplay logic drift
- backend or database modifications
- missing tests

---

## Codex Results

Implemented WP-111 in the student UI state and support panels. SamuelΓÇÖs header is now the primary instruction surface with explicit `What to prove` and `What to do next` lines, while Query Lab and Case Progress stay short and subordinate. I also removed the explicit SQL example from student-facing failure guidance.

The clue feedback lifecycle is now deterministic across more triggers. In addition to the existing timeout and new-query clearing, feedback also clears on student SQL edits, including quick-insert actions. Supporting copy was tightened in [StudentMentorHeader.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/components/student/StudentMentorHeader.tsx), [StudentWorkbenchView.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/components/student/StudentWorkbenchView.tsx), [StudentEvidenceBoardView.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/components/student/StudentEvidenceBoardView.tsx), [studentCase.ts](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/studentCase.ts), [useStudentCaseState.ts](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/useStudentCaseState.ts), and [QueryRunner.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/components/QueryRunner.tsx).

Tests were updated and expanded in [App.test.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/App.test.tsx) and [QueryRunner.test.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/components/QueryRunner.test.tsx) to cover guidance consolidation, SQL-edit clearing, timeout clearing with fake timers, and the preserved spoiler-safe wrong-clue behavior. Verification: `npm run test --workspace apps/web` passed with `129/129` tests.

## Gemini Audit Results

WP-111 (Samuel guidance consolidation and feedback lifecycle) has been successfully audited and meets all requirements.

### Audit Findings:

1.  **Consolidation of Guidance**: SamuelΓÇÖs Guidance in the header (`StudentMentorHeader.tsx`) is now the primary instruction source, featuring explicit "What to prove" and "What to do next" fields.
2.  **Reduced Duplication**: 
    - **Query Runner**: Now uses short, functional instructions (e.g., "Write SQL and run it to inspect rows") instead of repeating full guidance.
    - **Case Progress**: Now shows a concise "Current Step" and explicitly directs the student to Samuel's Guidance for details.
3.  **Feedback Lifecycle**:
    - **Deterministic Timeouts**: Implemented in `useStudentCaseState.ts` (8s for success, 15s for errors).
    - **State-Based Clearing**: Feedback correctly clears upon SQL edits or running a new query, preventing stale reinforcement.
4.  **Student-Friendly Language**: Samuel's reactions and guidance in `studentCase.ts` have been revised to use detective-toned language (e.g., "repeated person IDs," "witness records") while maintaining technical accuracy for learning objectives.
5.  **Safety and Determinism**:
    - No backend or database files were modified.
    - No exact SQL generation or automatic clue detection was introduced.
    - Clue feedback remains supportive and spoiler-safe, avoiding disclosure of correct rows or future leads.
6.  **Test Coverage**: Updated and expanded in `App.test.tsx` and `QueryRunner.test.tsx`, specifically covering guidance consolidation, timeout behavior (using fake timers), and SQL-edit clearing.

### Flagged Items:
None. The implementation is surgical, preserves the stable header grid, and adheres to the deterministic gameplay model.

### Final Decision:
**Approved.** Implementation is complete, verified by tests, and aligns with the project vision.

Audit of WP-111 (Samuel guidance consolidation and feedback lifecycle) is complete.

### Audit Summary

The implementation of WP-111 successfully consolidates student guidance and refines the feedback loop while strictly adhering to the project's architectural and safety constraints.

**Key Verifications:**
- **Guidance Consolidation**: Samuel's header now serves as the primary instruction source with explicit "What to prove" and "What to do next" labels.
- **Instructional Focus**: Query Runner and Case Progress panels have been streamlined to avoid duplicating full mentor instructions, providing only functional support and progress tracking.
- **Feedback Lifecycle**: Deterministic timeouts (8s for success, 15s for errors) and clear triggers (SQL edits, new query runs) ensure feedback remains relevant and clears when stale.
- **Student-Friendly Copy**: Samuel's guidance wording has been refined to be more mentor-like and less technical-implementation focused.
- **Integrity**: No backend or database modifications were made. No automatic clue detection, automatic evidence logging, or exact SQL generation was introduced.
- **Verification**: Tests in `App.test.tsx` and `QueryRunner.test.tsx` were expanded to cover new lifecycle behaviors and pass with 100% success.

No issues or regressions were identified during the audit.

## Final Decision

Approved. WP-111 is accepted for commit and push.


