# WP-116: reframe-witness-ramp-and-restore-intermediate-results

## Objective

Fix the current witness-ramp UX problems in Student Mode and reduce the jump in SQL complexity after the witness `PersonID` clues are found.

The affected issues are:

- intermediate `Query Results` are not reliably shown during the progressive `CrimeSceneReport` refinement steps
- after both witness `PersonID` bundles are logged, the Query Editor still shows the previous student-built `InterviewLog` query even though the next task has changed
- Samuel currently presents the post-witness branch as two roughly equal options before the UX has established a clear primary path
- the current guidance risks forcing a premature `JOIN` jump at a point where students have mostly been working with single-table filtering and ordering
- the witness-name step has lost some of Samuel's earlier â€œguided synopsis with clickable query-building cluesâ€ support

The goal is:

Restore visible results during each report-refinement step, make the witness handoff feel intentional instead of leftover, and guide students through a simpler identity-first path before any optional advanced `JOIN` pattern appears.

---

## Scope

Refine the Student Mode witness transition after the `CrimeSceneReport` phase.

This WP may modify:

- student progression state in `useStudentCaseState.ts`
- Samuel guidance and witness-stage copy in `studentCase.ts`
- student workbench and Query Runner handoff behavior
- pinned-fact / query-assist presentation in student components
- relevant query-results persistence or reset behavior
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
- docs/01-work-packages/WP-116-reframe-witness-ramp-and-restore-intermediate-results.md

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
- Preserve the expectation that students build their own queries
- Preserve the witness `PersonID` clues already earned
- No runtime AI behavior
- No automatic suspect deduction
- No automatic clue detection
- No automatic evidence logging
- No hidden automatic case completion
- No backend API changes
- No SQL execution changes
- No broad visual redesign

Witness-ramp constraints:

- each progressive `CrimeSceneReport` refinement step should visibly show its own result set
- the post-witness editor state should not imply the student should keep editing the old `InterviewLog` query when the next task has changed
- Samuel should present one clear recommended next step before exposing a broader strategic fork
- the next required witness step should remain achievable with single-table querying
- `JOIN` may appear only as optional or advanced Samuel help, not as the required first move
- any clickable Samuel support should insert useful fragments, not full solved queries

---

## Required Behavior

### 1. Restore Intermediate Results During Report Refinement

During the progressive `CrimeSceneReport` narrowing tasks:

- each submitted query should display its own `Query Results`
- results should not remain hidden until only the final refinement query runs
- Samuel's next-step guidance may advance, but the student must still be able to inspect the result set from the query they just executed

This is a regression-level UX issue and should be treated as a direct fix, not a redesign preference.

---

### 2. Reset the Editor Intentionally After Both Witness Bundles Are Logged

After the student logs both witness `PersonID` bundles:

- the Query Editor should no longer keep showing the previous `InterviewLog` query as if that is still the active task
- the next-state editor should either clear intentionally or shift into a neutral witness-name lookup handoff state
- the visible UI should make it obvious that the active task changed from witness discovery to witness identity follow-through

The editor must not create false continuity with the old query.

---

### 3. Make Witness Identity the Primary Next Step

After both witness bundles are found:

- Samuel should recommend one primary next step, not two equal branches
- that primary next step should be: identify the witness names using the pinned witness `PersonID` values
- the gym clue may remain visible as the later or secondary lead, but it should not compete with the immediate next action

The student should not be forced to decide between two equally weighted paths before the interface has established why one should come first.

---

### 4. Keep the Required Query Complexity Low at the Witness-Name Step

The next required task after both witness bundles are logged should be solvable with a simple query such as:

```sql
SELECT *
FROM PersonsOfInterest
WHERE PersonID = 14887
   OR PersonID = 16371
```

Expected behavior:

- students can identify the witness names from `PersonsOfInterest`
- Samuel should frame that as the required bridge from abstract `PersonID` facts to human-readable witness identities
- `JOIN` should not be required at this stage

If Samuel surfaces a `JOIN`, it must be positioned as:

- an optional advanced shortcut
- or a later teaching moment

not as the default required handoff.

---

### 5. Restore Samuel's Clickable Guided Synopsis for the Witness-Name Step

When the witness-name step begins:

- Samuel should provide a short synopsis that explains why the pinned `PersonID` values matter
- that synopsis should include clickable query-building clues or fragments
- the fragments should help the student build the next query without giving away a full solved statement

Examples of acceptable clickable support:

- `SELECT *`
- `FROM PersonsOfInterest`
- `WHERE PersonID = 14887`
- `OR PersonID = 16371`

Do not restore full copy-paste solutioning as the default.

---

### 6. Preserve the Gym Lead as the Next Follow-On Thread

Once witness identities are resolved:

- the gym clue should remain the strongest visible follow-on lead
- the UI should preserve the idea that names are a clarification bridge, not the final destination
- Samuel should be able to transition from the witness-name lookup into the gym evidence trail cleanly

The witness-name step should simplify the path, not derail the investigation.

---

### 7. Tests

Add or update tests for:

- intermediate report-refinement queries keeping their own visible results
- the post-witness editor no longer preserving the stale `InterviewLog` query as the active next task
- the post-witness Samuel guidance naming witness identity lookup as the primary next step
- witness-name lookup support using `PersonsOfInterest` with pinned `PersonID` values
- `JOIN` not being required in the visible primary guidance for this step
- the later gym-lead transition remaining intact

Preserve existing tests where still relevant.

---

## Acceptance Criteria

- progressive `CrimeSceneReport` refinement queries visibly display their own result sets
- the post-witness editor no longer implies the old `InterviewLog` query is still the active task
- Samuel presents witness identity lookup as the primary next step after both witness bundles are found
- the required witness-name task is achievable with a simple single-table `PersonsOfInterest` query
- Samuel again provides clickable guided-synopsis support for the witness-name lookup
- visible guidance does not require a `JOIN` at this ramp stage
- the gym clue remains preserved as the next follow-on trail
- deterministic progression remains intact
- tests updated where practical
- no backend API changes introduced
- no SQL execution behavior changed
- no runtime AI behavior introduced

---

## Codex Prompt

Implement WP-116 for Sequel City Web Detective.

Objective:
Fix the witness-ramp UX so students see intermediate results during report refinement, then transition from witness `PersonID` clues into a simpler identity-first lookup before any optional `JOIN` complexity is introduced.

Implement:

1. Restore visible results for each progressive `CrimeSceneReport` refinement query.
2. After both witness bundles are logged, stop leaving the previous `InterviewLog` query in the editor as if it is still the active task.
3. Make witness-name lookup through `PersonsOfInterest` the primary next step after both witness bundles are pinned.
4. Keep the required query complexity at this step to a simple single-table `PersonID` lookup.
5. Restore a Samuel synopsis with clickable query-building fragments for the witness-name step.
6. Keep the gym clue present as the next follow-on lead without competing as an equal first choice.
7. Update focused tests for the new handoff and guidance behavior.

Do not:

- change backend APIs
- change SQL validation or execution
- alter database scripts
- introduce runtime AI
- broaden scope beyond the affected Student Mode witness-ramp and intermediate-results path

Preserve:

- deterministic gameplay behavior
- spoiler-safe guidance
- Samuel's mentor role
- the current Student Mode structure
- the student's responsibility to build the next query

---

## Gemini Audit Prompt

Audit WP-116 witness-ramp and intermediate-results fixes.

Verify:

1. Only approved frontend and work-package files changed.
2. No backend runtime files changed.
3. No database scripts changed.
4. No SQL execution behavior changed.
5. Each progressive `CrimeSceneReport` refinement step shows its own visible results.
6. After both witness bundles are logged, the editor no longer misleadingly preserves the old `InterviewLog` query as the active task.
7. Samuel now presents witness identity lookup as the primary next step after the witness `PersonID` clues are found.
8. The primary required lookup is achievable with a simple `PersonsOfInterest` query using the pinned `PersonID` values.
9. During the witness-name phase, the Evidence Board `Current Step` and Samuel guidance both stay focused on witness-name lookup rather than prematurely switching to `Gym Lead`.
10. After a broad `PersonsOfInterest` run, Samuel queues a narrower draft using the pinned witness `PersonID` values instead of leaving the student at a full-table result with no next narrowing guidance.
11. Samuel provides clickable guided-synopsis support for that witness-name lookup.
12. The visible primary guidance does not require a `JOIN` at this stage.
13. The `Log Clue` action remains visibly discoverable during wide query-result tables.
14. The gym clue remains preserved as the next follow-on lead only after witness names are pinned.
15. Tests were updated or added where practical.

Flag:

- hidden intermediate results during report refinement
- stale witness-stage editor carryover
- equal-weight branching before witness identity is resolved
- witness-name guidance that mentions the gym clue too early
- missing queued narrowing help after broad `PersonsOfInterest` results
- cropped or hidden `Log Clue` affordance on wide tables
- premature required `JOIN` guidance
- backend or database modifications
- missing tests

---

## Codex Results

Implemented WP-116 in the Student Mode report-refinement and witness-ramp path.

- Updated [useStudentCaseState.ts](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/useStudentCaseState.ts) so Samuel's queued `CrimeSceneReport` refinement steps no longer clear the just-run result set, and so completing the second witness bundle now resets the query surface into a new `PersonsOfInterest` handoff instead of leaving the prior `InterviewLog` query in place.
- Updated [studentCase.ts](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/studentCase.ts) so the post-witness objective, Samuel guidance, and lead-board detail stay focused on witness names until that step is complete, then cleanly advance to the gym lead afterward.
- Updated [StudentWorkbenchView.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/components/student/StudentWorkbenchView.tsx) so the old witness-bundle shortcut panel gives way to a broader `Witness Identity Shortcuts` panel with clickable `PersonsOfInterest`, `PersonID`, and `OR` fragments instead of near-solution clauses.
- Updated [StudentEvidenceBoardView.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/components/student/StudentEvidenceBoardView.tsx) so the `Current Step` card stays on `Witness Name Lookup` during the name phase instead of prematurely falling through to `Gym Lead`.
- Updated [QueryRunner.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/components/QueryRunner.tsx) so the SQL builder now includes `*` and `OR`, and token clicks insert a trailing space for smoother query construction.
- Updated the witness-name phase so a broad `PersonsOfInterest` run now triggers a queued `WHERE PersonID = ... OR PersonID = ...` narrowing draft before the student is asked to log names.
- Updated [QueryResultsTable.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/components/QueryResultsTable.tsx) and [styles.css](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/styles.css) so the witness-name table surfaces a sticky right-side `Log Clue` action and a helper note that keeps the evidence affordance visible while the student scrolls.
- Expanded [App.test.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/App.test.tsx) and [QueryRunner.test.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/components/QueryRunner.test.tsx) to cover the preserved intermediate results, the new witness-name handoff draft/instruction state, the identity-shortcut panel, and the revised post-witness Samuel copy.

Verification:

- `npm run test --workspace apps/web` passed with `139/139` tests.
- `npm run build --workspace apps/web` passed.

## Gemini Audit Results

Audit status: PASSED.

Accepted audit findings:

- Scope stayed within approved frontend and work-package files; no backend or database paths changed.
- Progressive `CrimeSceneReport` refinement keeps intermediate results visible while Samuel queues the next narrowing step.
- The witness-name phase now resets the old `InterviewLog` context, keeps the Evidence Board and header focused on witness names, and delays the gym lead until that phase is complete.
- Broad `PersonsOfInterest` runs now trigger queued `PersonID` narrowing help instead of leaving the student with a full-table dead end.
- Witness-name guidance avoids requiring `JOIN`s and keeps the primary path achievable with simple filtering.
- The `Log Clue` action remains visible on wide result tables, and tests cover the revised witness-name flow and UI affordances.

## Final Decision

Accepted. WP-116 meets the approved scope and resolves the witness-ramp UX issues without backend, database, or SQL execution changes.

