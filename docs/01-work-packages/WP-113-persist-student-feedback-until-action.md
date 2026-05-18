# WP-113: persist-student-feedback-until-action

## Objective

Improve the first-run Student Mode UX by keeping clue and guidance feedback visible until the student takes a meaningful follow-up action, rather than clearing it on a timer.

This WP also tightens the same walkthrough path where the feedback appears:

- remove timer-based disappearance for student feedback
- keep feedback until the student edits SQL, runs another query, logs another row, or takes another action that supersedes it
- make inline success callouts accurately describe non-clue progression updates
- align Samuel's broad-report guidance so it does not claim a queued filter when the editor still shows the broad report query

The goal is:

Students should not lose the clue they were reading just because time passed, and the UI should not describe the next step more confidently than the editor actually supports.

---

## Scope

Refine Student Mode feedback lifecycle and first-run query guidance copy.

This WP may modify:

- student state lifecycle in `useStudentCaseState.ts`
- Samuel guidance copy in `studentCase.ts`
- Query Runner feedback presentation
- related tests
- this work package document

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
- docs/01-work-packages/WP-113-persist-student-feedback-until-action.md

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
- Preserve Samuel's mentor role
- Preserve the existing Student Mode structure
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

- do not clear feedback just because a timer elapsed
- clear stale feedback only when a later student action makes it obsolete
- keep the feedback language accurate to what the editor and current view actually show
- preserve the existing deterministic handoff flow between Query Lab and Evidence Board

---

## Required Behavior

### 1. Remove Timer-Based Feedback Expiry

Student feedback should remain visible until superseded by a later action.

Examples:

- a correct clue message should remain visible if the student pauses to read it
- a wrong-clue correction should remain visible until the student edits SQL, runs another query, or otherwise takes a new attempt
- the feedback should no longer disappear after a fixed number of seconds

---

### 2. Preserve Action-Based Clearing

The existing action-based clearing behavior should remain intact where it helps prevent stale guidance.

Examples:

- editing SQL clears stale clue feedback
- running another query clears the old clue feedback before the next result state is processed
- a new clue log or check-in result can replace the previous feedback

---

### 3. Make Inline Feedback Labels Accurate

The inline Query Lab callout should not label every success state as `Clue Logged`.

Examples:

- real evidence logging can still use `Clue Logged`
- broad progress or next-step updates should use a more accurate label such as a lead or progress update
- wrong-clue feedback should still clearly signal an error state

---

### 4. Align Broad Report Guidance With Actual Editor State

When the student opens the broad `CrimeSceneReport` backlog, Samuel should not claim a filter was already queued if the editor still shows the broad report query.

The guidance should stay specific, but it must match what the student actually sees.

---

### 5. Tests

Add or update tests for:

- feedback remains visible even after the old timeout durations have elapsed
- action-based clearing still works on SQL edit and new query execution
- non-clue progress feedback uses the correct inline label
- Samuel's broad-report guidance remains specific without falsely claiming a queued filter
- existing deterministic progression behavior remains intact

Preserve existing tests where still relevant.

---

## Acceptance Criteria

- student feedback no longer disappears on a timer
- stale feedback still clears when the student takes a superseding action
- broad progress states are not mislabeled as `Clue Logged`
- Samuel's broad-report guidance matches the actual visible editor state
- deterministic progression remains intact
- tests updated where practical
- no backend API changes introduced
- no SQL execution behavior changed
- no runtime AI behavior introduced

---

## Codex Prompt

Implement WP-113 for Sequel City Web Detective.

Objective:
Keep student clue feedback visible until action supersedes it, and clean up first-run Student Mode UX wording discovered during a fresh walkthrough.

Implement:

1. Remove timer-based clearing for student evidence feedback.
2. Preserve action-based clearing when SQL is edited, a new query is run, or new feedback replaces old feedback.
3. Make Query Runner success callouts distinguish between real clue logs and broader lead/progress updates.
4. Adjust Samuel's broad-report guidance so it remains specific without falsely claiming that a filter is already queued when the editor still shows the broad report query.
5. Update focused tests for the new lifecycle and copy behavior.

Do not:

- change backend APIs
- change SQL validation or execution
- alter database scripts
- introduce runtime AI
- broaden scope beyond the affected Student Mode UX path

Preserve:

- deterministic gameplay behavior
- spoiler-safe guidance
- Samuel's mentor role
- the current Student Mode structure

---

## Gemini Audit Prompt

Audit WP-113 feedback persistence and first-run Student Mode UX cleanup.

Verify:

1. Only approved frontend and work-package files changed.
2. No backend runtime files changed.
3. No database scripts changed.
4. No SQL execution behavior changed.
5. Student clue feedback no longer disappears on a timer.
6. Feedback still clears when superseded by SQL edits, new queries, or replacement feedback.
7. Query Runner does not label every success state as `Clue Logged`.
8. Samuel's broad-report guidance remains specific without falsely claiming a queued filter that is not visible in the editor.
9. Deterministic progression remains intact.
10. Tests were updated or added where practical.

Flag:

- any remaining timer-based feedback expiry
- stale feedback persisting after a new attempt
- misleading `Clue Logged` labeling on non-clue progress states
- guidance/editor mismatches in the broad report step
- backend or database modifications
- missing tests

---

## Codex Results

Implemented WP-113 in the student feedback lifecycle and Query Lab feedback presentation.

- Removed timer-based student feedback expiry from [useStudentCaseState.ts](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/useStudentCaseState.ts) so clue and guidance feedback now remains visible until a later student action supersedes it.
- Preserved action-based clearing by keeping the existing SQL-edit and new-query clearing paths, now routed through a shared feedback reset helper.
- Updated [studentCase.ts](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/studentCase.ts) so the broad report guidance remains specific without overstating the next step as an already queued filter.
- Updated [QueryRunner.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/components/QueryRunner.tsx) so non-clue progress states render as a lead update instead of always using the `Clue Logged` label.
- Expanded [App.test.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/App.test.tsx) and [QueryRunner.test.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/components/QueryRunner.test.tsx) to cover feedback persistence, action-based clearing, and the new lead-update labeling.

Verification:

- `npm run test --workspace apps/web` passed with `132` tests passing.
- `npm run build --workspace apps/web` passed.
- Live in-app browser walkthrough confirmed that the first clue feedback still remains visible after nine seconds with no student action, and that the broad report step now uses a `Next Lead Ready` callout instead of mislabeling that progress state as a logged clue.

## Gemini Audit Results

The WP-113 audit is complete and passed.

- Approved scope: verified. Only approved frontend files and this work package document changed.
- System integrity: verified. No backend runtime, database, or SQL execution behavior changed.
- Feedback persistence: verified. Timer-based clearing was removed, and feedback now remains visible until a later student action supersedes it.
- Action-based clearing: verified. SQL edits and new query executions still clear stale feedback before the next attempt state renders.
- Label accuracy: verified. Query Runner distinguishes real clue logs from broader progress updates and uses `Next Lead Ready` for non-clue success states.
- Guidance alignment: verified. Samuel no longer claims a queued filter during the broad report step unless the filtered draft is actually present.
- Deterministic progression: verified. Milestone progression still depends on deterministic SQL-state and clue-log transitions.
- Validation: verified. `App.test.tsx` and `QueryRunner.test.tsx` cover persistence and label behavior.

## Final Decision

Approved. WP-113 keeps student feedback visible until action supersedes it, improves Query Lab feedback labeling, and aligns Samuel's broad-report guidance without changing backend, database, or SQL execution behavior. Audit passed and the work is accepted for commit and push.

