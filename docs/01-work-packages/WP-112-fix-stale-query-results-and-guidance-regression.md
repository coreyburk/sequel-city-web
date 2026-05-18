# WP-112: fix-stale-query-results-and-guidance-regression

## Objective

Fix two live Student Mode regressions discovered during in-app browser evaluation:

- Query Lab can show stale results from the previous query while the editor has already advanced to a different queued query.
- Samuel's Guidance can fall back to generic mentor copy after success feedback clears, even when the student is still on a specific required step.

The guiding principle is:

Queued work should never look like it already ran, and Samuel's header should stay the clearest source of the current next step.

---

## Scope

Refine Student Mode query restoration and deterministic header guidance persistence.

This WP may modify:

- student guidance content mapping
- Query Lab restored-result behavior
- student state shaping for restored executions
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
- docs/01-work-packages/WP-112-fix-stale-query-results-and-guidance-regression.md

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
- Preserve intentional restored-result review states where they are part of the learning flow
- No runtime AI behavior
- No automatic suspect deduction
- No automatic clue detection
- No automatic evidence logging
- No hidden automatic case completion
- No backend API changes
- No SQL execution changes
- No broad visual redesign

UX constraints:

- Do not present stale results as if they belong to the queued query currently shown in the editor
- Keep intentionally restored results only when they support a deliberate review handoff
- Keep Samuel's Guidance specific after feedback timeouts or view switches
- Do not force students to scan Case Progress to recover the real next step

---

## Required Behavior

### 1. Prevent Stale Result Restoration On Queued Query Handoffs

When the student returns to Query Lab and the editor has already advanced to a different queued query, do not restore the previous query's result set as if it belongs to the newly queued query.

Required outcome:

- after `CrimeID 1080` is logged and Query Lab queues `CrimeSceneReport`, the old `CrimeType` rows should not appear as the current results for that queued query
- the editor can still queue the next query immediately
- the student should see either no restored results or only intentionally restored results that match the current review context

---

### 2. Preserve Intentional Restored Review States

Do not remove legitimate restored-result review behavior that supports the learning flow.

Example:

- when the student pins the target report row and returns to Query Lab for the witness handoff, the focused restored report review should still be available

This WP is about suppressing misleading carry-over results, not removing all restoration behavior.

---

### 3. Keep Samuel's Guidance Specific After Feedback Clears

Samuel's header guidance must remain specific to the active deterministic step even after success feedback times out or the student switches between Query Lab and Evidence Board.

Examples of acceptable persistence:

- after the murder CrimeID is logged, Samuel should continue directing the student to inspect the report archive
- after the broad report backlog is opened, Samuel should continue directing the student to narrow to murder reports
- after murder reports are isolated, Samuel should continue directing the student to add the SQL City filter until the target report row is ready to log

Do not fall back to generic mentor copy when a more precise next-step instruction is already known from deterministic state.

---

### 4. Tests

Add or update tests for:

- stale previous results are not restored when the queued query advances to a different step
- focused restored report review still appears for the witness handoff state
- Samuel's Guidance remains specific after positive feedback clears for the post-CrimeID step
- Samuel's Guidance remains specific after positive feedback clears for the report backlog narrowing step
- existing deterministic progression behavior remains intact

Preserve existing tests.

---

## Acceptance Criteria

- queued Query Lab drafts do not display stale results from a different previous query
- intentionally restored review states still work where required by the student flow
- Samuel's Guidance remains specific after feedback lifecycle clearing
- Case Progress remains subordinate and no longer acts as the only precise step source during the affected states
- deterministic progression remains intact
- tests updated where practical
- no backend API changes introduced
- no SQL execution behavior changed
- no runtime AI behavior introduced

---

## Codex Prompt

You are implementing WP-112 for the Sequel City Web Detective project.

Objective:
Fix the Student Mode stale-results handoff and guidance regression found during live browser evaluation.

Problem:
Student Mode currently has two regressions:

1. Query Lab can show stale results from the previous query while the editor already shows a different queued query.
2. Samuel's Guidance can lose its specific next-step instruction after success feedback clears, falling back to generic mentor copy even though deterministic state still knows the active task.

Guiding principle:
Queued work should never look like it already ran, and Samuel's header should stay the clearest source of the current next step.

Important:

- Preserve deterministic gameplay principles.
- Preserve learner agency.
- Preserve spoiler-safe investigation flow.
- Preserve Samuel's mentor role.
- Preserve intentional restored-result review states where they are part of the learning flow.
- No runtime AI behavior.
- No automatic suspect deduction.
- No automatic clue detection.
- No automatic evidence logging.
- No backend API changes.
- No SQL execution changes.
- Keep the implementation focused and surgical.

Before editing:

1. Review `useStudentCaseState.ts`.
2. Review `studentCase.ts`.
3. Review `StudentWorkbenchView.tsx`.
4. Review `QueryRunner.tsx` only as needed for restored-result behavior.
5. Review relevant tests in `App.test.tsx` and `QueryRunner.test.tsx`.

Implement:

1. Prevent stale results from restoring when Query Lab has already advanced to a different queued query.
2. Preserve intentional restored-result review states such as the focused report handoff.
3. Keep Samuel's Guidance specific after success feedback clears by deriving the next-step copy from deterministic state rather than only transient feedback.
4. Add or update focused tests for both regressions.

Do not:

- change SQL validation
- change backend APIs
- modify database scripts
- introduce runtime AI
- remove intentional restored review states that support the learning flow
- move primary guidance responsibility away from Samuel's header

Preserve:

- frontend/backend boundaries
- deterministic gameplay behavior
- mentor-guided noir tone
- simplified Student Mode structure
- accessibility and readability

---

## Gemini Audit Prompt

Audit WP-112 stale Query Lab restoration and Samuel guidance persistence fixes.

Verify:

1. Only approved frontend and documentation files were modified.
2. No backend runtime files changed.
3. No database scripts changed.
4. No SQL execution behavior changed.
5. Query Lab does not restore stale previous results when the queued query has already advanced to a different step.
6. Intentional restored report review still works where the witness handoff requires it.
7. Samuel's Guidance remains specific after positive feedback clears for the post-CrimeID handoff.
8. Samuel's Guidance remains specific after positive feedback clears for the report backlog narrowing step.
9. Case Progress is not the only precise remaining instruction surface for the affected states.
10. Deterministic progression remains intact.
11. Tests were updated or added where practical.

Flag:

- stale rows shown under a different queued query
- restored review behavior removed where it was intentionally needed
- Samuel header falling back to generic copy when deterministic state already knows the active next step
- gameplay logic drift
- backend or database modifications
- missing tests

---

## Codex Results

Implemented WP-112 in the student state and workbench handoff path.

- Added a dedicated restored-execution gate in [useStudentCaseState.ts](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/useStudentCaseState.ts) so Query Lab only restores previous results when the current student draft still matches that execution or when the flow intentionally enters a `draftQuery = null` review state.
- Updated [StudentWorkbenchView.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/components/student/StudentWorkbenchView.tsx) and [App.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/App.tsx) to pass that narrower restored-execution signal instead of always rehydrating the last student execution.
- Refined deterministic header guidance mapping in [studentCase.ts](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/studentCase.ts) so Samuel keeps the specific report-archive and murder-filter instructions after success feedback clears, instead of dropping back to generic mentor copy.
- Expanded [App.test.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/App.test.tsx) to cover the stale-restoration regression and the post-timeout guidance persistence path.

Verification:

- `npm run test --workspace apps/web` passed.
- `npm run build --workspace apps/web` passed.
- Live in-app browser verification confirmed the original regression path now keeps the queued `CrimeSceneReport` draft visible without restoring the old `CrimeType` table, and the header guidance stays specific through the report-backlog handoff.

## Gemini Audit Results

The WP-112 audit is complete and approved.

- Approved scope: verified. Only frontend files and this work package document changed.
- System integrity: verified. No backend runtime, database, or SQL execution behavior changed.
- Stale result fix: verified. The restored-execution gate suppresses old result sets when Query Lab has already advanced to a different queued draft.
- Review handoff preservation: verified. Intentional focused report review still restores results when the draft is intentionally cleared.
- Guidance persistence: verified. Samuel keeps specific post-CrimeID and report-backlog instructions after positive feedback clears.
- Deterministic progression: verified. Milestone progression still depends on logged clues and deterministic state transitions.

Minor audit polish items were resolved during closeout:

- normalized the new Samuel guidance copy to plain ASCII punctuation
- removed the leftover skipped-test residue so the suite reflects the accepted state cleanly

## Final Decision

Approved. WP-112 fixes the stale Query Lab restoration regression and the Samuel guidance fallback regression without changing backend, database, or SQL execution behavior. Audit completed, closeout polish applied, and the work is accepted for commit and push.

