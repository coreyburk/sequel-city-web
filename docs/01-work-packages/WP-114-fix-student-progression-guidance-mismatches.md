# WP-114: fix-student-progression-guidance-mismatches

## Objective

Fix the Student Mode progression inconsistencies found during the latest end-to-end walkthrough.

The affected issues are:

- Samuel's header becomes too generic when the student first opens Query Lab before running the opening `CrimeType` query.
- After a report query succeeds, Query Lab can erase the result panel as soon as the next draft query is queued.
- The witness-handoff review leaves the editor intentionally blank, but a blank submit currently fails clumsily instead of giving a graceful student-facing prompt.
- After both witness bundles are found, the `What to Prove` and `What to do next` guidance still points backward instead of using the pinned witness PersonIDs to open the next lead.

The goal is:

Each student step should keep Samuel, the editor, the visible results, and the pinned facts in agreement.

---

## Scope

Refine Student Mode progression guidance, result handoffs, and blank-query behavior.

This WP may modify:

- student progression state in `useStudentCaseState.ts`
- Samuel guidance and objective mapping in `studentCase.ts`
- Query Runner state handling and student-side blank-query behavior
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
- docs/01-work-packages/WP-114-fix-student-progression-guidance-mismatches.md

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
- No runtime AI behavior
- No automatic suspect deduction
- No automatic clue detection
- No automatic evidence logging
- No hidden automatic case completion
- No backend API changes
- No SQL execution changes
- No broad visual redesign

UX constraints:

- keep Samuel's primary guidance specific at each active step
- do not restore stale results from an older step under a different queued query
- do keep the result the student just ran visible while Samuel queues the next draft
- allow the witness-handoff editor to remain student-built rather than auto-filled
- make a blank student submit fail gracefully and instructionally without losing the current review context
- use the pinned witness PersonIDs to point the student toward identifying names or following the gym clue

---

## Required Behavior

### 1. Keep Opening Query Lab Guidance Specific

When the student first opens Query Lab before running the opening `CrimeType` query, Samuel's header should still give the concrete first instruction instead of falling back to generic mentor prose.

---

### 2. Preserve Fresh Results While Preventing Stale Restores

If Query Lab advances the editor to a new student draft query, it should not restore stale output from an older step under the new draft.

This applies to the report-narrowing progression where the editor moves from:

- broad `CrimeSceneReport`
- to murder-filtered `CrimeSceneReport`
- to SQL City filtered `CrimeSceneReport`

However, when the student has just run a query successfully, the fresh result they earned should remain visible while Samuel queues the next draft query.

---

### 3. Fail Blank Witness-Handoff Submits Gracefully

The witness-handoff editor may stay blank so the student still has to build the next query.

However:

- clicking `Run Query` on a blank student editor should not produce a clumsy backend-style failure
- the response should be local, graceful, and instructional
- the restored report review should remain visible so the student does not lose context

---

### 4. Realign Post-Witness Guidance With Pinned PersonIDs

After both witness bundles are found:

- `What to Prove` should no longer describe the current state in a vague or mismatched way
- `What to do next` should no longer tell the student to keep pulling witness records they already found
- Samuel should direct the student to use the pinned witness `PersonID` clues to identify the witnesses by name or to follow the gym lead revealed by those witness bundles

The pinned witness PersonIDs must remain present and useful in `Pinned Facts`.

---

### 5. Tests

Add or update tests for:

- specific first-step guidance remains visible on initial Query Lab entry
- stale restored results do not appear under a different queued draft
- fresh just-run report results remain visible while the next draft query is queued
- blank student submits during witness handoff fail locally and preserve the restored review context
- post-witness Samuel guidance and objective align with the pinned PersonIDs / gym lead transition
- existing deterministic progression remains intact

Preserve existing tests where still relevant.

---

## Acceptance Criteria

- first-step Query Lab guidance remains specific instead of generic
- stale restored draft/result mismatches no longer appear during student progression
- fresh just-run results do not disappear when the next draft is queued
- blank witness-handoff submits fail gracefully without backend-style friction and without removing the restored review state
- post-witness guidance uses the pinned PersonIDs and gym clue to point the student forward
- pinned witness PersonIDs remain present in pinned facts
- deterministic progression remains intact
- tests updated where practical
- no backend API changes introduced
- no SQL execution behavior changed
- no runtime AI behavior introduced

---

## Codex Prompt

Implement WP-114 for Sequel City Web Detective.

Objective:
Fix Student Mode progression mismatches so Samuel, the editor, the visible results, and the pinned facts stay aligned during the opening case flow.

Implement:

1. Keep Samuel's first Query Lab guidance specific before the student runs the opening `CrimeType` query.
2. Prevent stale restored result tables from appearing under a different queued draft while keeping the student's just-run results visible when Samuel advances the next draft.
3. Keep the witness-handoff editor student-built, but make blank submits fail gracefully and locally while preserving the restored report review context.
4. After both witness bundles are found, update `What to Prove` and `What to do next` so they use the pinned witness PersonIDs to point the student toward identifying names or following the gym lead.
5. Update focused tests for those behaviors.

Do not:

- auto-fill the witness handoff query
- change backend APIs
- change SQL validation or execution
- alter database scripts
- introduce runtime AI
- broaden scope beyond the affected Student Mode progression UX path

Preserve:

- deterministic gameplay behavior
- spoiler-safe guidance
- Samuel's mentor role
- the current Student Mode structure
- the student's responsibility to build the query

---

## Gemini Audit Prompt

Audit WP-114 student progression guidance and handoff fixes.

Verify:

1. Only approved frontend and work-package files changed.
2. No backend runtime files changed.
3. No database scripts changed.
4. No SQL execution behavior changed.
5. Samuel's first Query Lab guidance remains specific before the opening query is run.
6. Query Lab does not restore previous-step results under a newly advanced draft query, and it keeps fresh just-run results visible while the next draft is queued.
7. Blank student submits during witness handoff fail locally and preserve the restored review context.
8. Post-witness `What to Prove` and `What to do next` align with the pinned witness PersonIDs and gym lead transition.
9. Pinned witness PersonIDs remain present in pinned facts.
10. Deterministic progression remains intact.
11. Tests were updated or added where practical.

Flag:

- generic opening guidance on first Query Lab entry
- stale editor/result mismatches during draft advancement
- fresh results disappearing immediately after a successful report query
- backend-style blank-submit failures in the witness handoff
- backward-facing post-witness guidance
- missing pinned PersonID continuity
- backend or database modifications
- missing tests

---

## Codex Results

Implemented WP-114 in the Student Mode progression and Query Lab handoff path.

- Updated [studentCase.ts](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/studentCase.ts) so Samuel keeps the first Query Lab instruction specific before the opening `CrimeType` run, and so post-witness guidance now points forward using the pinned witness PersonIDs and gym lead instead of repeating the earlier witness-query instruction.
- Updated [useStudentCaseState.ts](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/useStudentCaseState.ts) so the broad `CrimeSceneReport` step now advances the student draft to the murder-filter query, witness-stage editor instructions are more concrete, and the post-witness success copy points the student toward using the pinned PersonIDs or gym clue.
- Updated [QueryRunner.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/components/QueryRunner.tsx) so blank student submits fail locally with a graceful prompt while preserving any restored review context, and so a fresh result no longer disappears just because the next draft query was queued.
- Updated [QueryResultsTable.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/components/QueryResultsTable.tsx) and [styles.css](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/styles.css) so results stay readable inside the available window width with better wrapping and overflow behavior, long-text columns get more room than compact ID/date columns, and Query Results headers keep a stable one-line style.
- Refined [styles.css](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/styles.css) further after live browser review so the desktop Query Lab layout gives more width back to Query Runner, tightens the gap to the Pinned Facts rail, moves the rail closer to the right edge, and keeps the right rail from stealing width from the main workbench column.
- Tuned the Student Mode `Run Query` button styling in [styles.css](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/styles.css) so the button face stands out more clearly while still matching the established burgundy-gold navigation palette.
- Expanded [App.test.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/App.test.tsx) and [QueryRunner.test.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/components/QueryRunner.test.tsx) to cover the specific first-step guidance, preserved post-clue next-step guidance after an Insight Mark, fresh-results persistence while the next draft is queued, graceful blank witness submit behavior, and the post-witness PersonID / gym-lead guidance transition.

Verification:

- `npm run test --workspace apps/web` passed with `136` tests passing.
- `npm run build --workspace apps/web` passed.
- Live browser re-check confirmed the first Query Lab entry now carries specific opening guidance instead of the prior generic fallback, the just-run results stay visible when the next draft is queued, and the follow-up desktop Query Lab polish now produces a narrower Pinned Facts rail plus a more balanced Query Runner / Query Results presentation.

## Gemini Audit Results

Audit complete. WP-114 passes.

- File scope verified: only approved frontend components, state, styles, tests, and the work package record changed.
- Query Lab opening guidance verified: Samuel keeps the specific `CrimeType` instruction instead of falling back to generic prose.
- Result alignment verified: stale prior-step restores do not appear under a newly queued draft, and fresh just-run report results remain visible while the next draft is queued.
- Witness handoff verified: blank student submits fail locally with the instructional `Write the next query before you run it.` prompt while preserving the restored review context.
- Post-witness guidance verified: `What to Prove` and `What to do next` now use the pinned witness `PersonID` clues and gym lead transition correctly.
- Pinned Facts continuity verified: witness `PersonID` clues remain present and usable in the rail.
- Deterministic progression verified: no backend, database, or runtime AI behavior changes were introduced.
- Test coverage verified: focused App and Query Runner tests were expanded for the accepted progression and Query Lab behaviors.

No flags or violations were identified during the audit.

## Final Decision

Accepted. WP-114 correctly fixes the student progression guidance mismatches, preserves fresh query results during queued draft advancement, handles blank witness-handoff submits gracefully, and improves the Query Lab desktop presentation without changing backend or database behavior.

