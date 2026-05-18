# WP-115: fix-query-lab-progression-handoffs-and-width

## Objective

Fix the latest live-browser Query Lab UX inconsistencies in Student Mode.

The affected issues are:

- after the broad `CrimeSceneReport` run, the editor advances to a narrower query while the visible results still show the broader backlog
- logging the first correct clue force-switches the student out of Query Lab even though the next task is another query step
- the desktop Query Lab layout still leaves the results action column clipped at common app-window widths
- the Briefing header pushes database-task language too early instead of onboarding the student into Samuel and the case first
- the restored Query Lab polish drifted away from Samuel's intended progressive queued help for narrowing `CrimeSceneReport`

The goal is:

Keep Student Mode momentum inside Query Lab, keep the draft SQL and visible results in sync, and make the desktop workbench width behave cleanly at the in-app browser size.

---

## Scope

Refine Student Mode Briefing and Query Lab progression handoffs plus the desktop workbench layout.

This WP may modify:

- student progression state in `useStudentCaseState.ts`
- Samuel guidance text in `studentCase.ts`
- Query Runner result-reset behavior
- Student workbench layout and Query Results sizing in `styles.css`
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
- docs/01-work-packages/WP-115-fix-query-lab-progression-handoffs-and-width.md

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

- keep Query Lab active when the student should immediately continue querying
- do not show a narrower queued draft above broader previous-step results
- do allow result resets when a logged clue intentionally starts the next query task
- keep the Briefing header focused on orientation before active query coaching begins
- preserve Samuel's progressive queued help for the report-narrowing phase
- keep the desktop workbench readable at the Codex in-app browser width
- keep the Pinned Facts rail present without letting it crop the query editor or row actions

---

## Required Behavior

### 1. Keep the Student in Query Lab After the First Logged Clue

When the student logs the first correct `CrimeType` clue:

- the app should not force-switch to Evidence Board
- Query Lab should remain active
- Samuel's guidance should point directly to the next query task
- the previous `CrimeType` result should not linger under the next-step draft

---

### 2. Keep Draft SQL and Results in Agreement During Report Narrowing

During the `CrimeSceneReport` progression:

- broad report results should remain paired with the broad report draft
- the murder-filter results should remain paired with the murder-filter draft
- guidance may advance, but the editor should not silently jump to a different narrower draft while the old result is still visible

Students are still expected to build the next filter themselves.

---

### 3. Restore Briefing-First Guidance Tone

On the Briefing page:

- Samuel's header should not jump straight into database-task coaching
- the header should orient the student toward Samuel, the case, and the briefing content below
- the stronger query-task coaching should still appear in Query Lab where it is actionable

---

### 4. Tighten the Desktop Query Lab Width

At the in-app browser desktop width:

- the query editor and `Run Query` button must remain fully visible
- the Pinned Facts rail should consume slightly less width and sit closer to the right edge
- the Query Results action area should no longer clip the `Log Clue` button
- the `Log Clue` header and buttons should no longer be right-justified against the edge
- long-text result columns should remain readable without breaking the action column

---

### 5. Tests

Add or update tests for:

- first-clue logging keeping the student in Query Lab
- clearing prior results when a logged clue intentionally starts the next query task
- restored progressive queued report narrowing after the broad and murder-only runs
- briefing header orientation copy staying non-task-first on the Briefing page
- existing witness-handoff and pinned-fact progression remaining intact

Preserve existing tests where still relevant.

---

## Acceptance Criteria

- first clue logging keeps the student in Query Lab
- the next-step draft after first clue does not display stale `CrimeType` results
- broad `CrimeSceneReport` results do not display under a narrower draft
- Samuel's progressive queued narrowing help is restored for the broad and murder-only report steps
- the Briefing header now orients before it instructs
- Query Lab desktop width no longer clips the query editor or `Log Clue` action at the tested app width
- deterministic progression remains intact
- tests updated where practical
- no backend API changes introduced
- no SQL execution behavior changed
- no runtime AI behavior introduced

---

## Codex Prompt

Implement WP-115 for Sequel City Web Detective.

Objective:
Fix the latest Query Lab progression and desktop-width inconsistencies so the student remains in Query Lab when they should keep querying, the draft SQL stays aligned with the visible result set, and the desktop workbench no longer clips the row action area.

Implement:

1. Keep the student in Query Lab after logging the first correct `CrimeType` clue.
2. Clear prior results when a logged clue intentionally starts the next query task.
3. Restore Samuel's progressive queued narrowing help for `CrimeSceneReport`, but clear old results when the next queued draft takes over so the student never sees a mismatched draft/result pair.
4. Soften the Briefing header so it orients the student before active database coaching begins.
5. Tighten the desktop Query Lab width so the Pinned Facts rail takes slightly less space, the `Log Clue` column no longer crops, and the action area is no longer right-justified against the edge.
6. Update focused tests for those behaviors.

Do not:

- change backend APIs
- change SQL validation or execution
- alter database scripts
- introduce runtime AI
- broaden scope beyond the affected Student Mode Query Lab UX path

Preserve:

- deterministic gameplay behavior
- spoiler-safe guidance
- Samuel's mentor role
- the current Student Mode structure
- the student's responsibility to build the next query

---

## Gemini Audit Prompt

Audit WP-115 student Query Lab handoff and width fixes.

Verify:

1. Only approved frontend and work-package files changed.
2. No backend runtime files changed.
3. No database scripts changed.
4. No SQL execution behavior changed.
5. Logging the first correct `CrimeType` clue keeps the student in Query Lab.
6. The first-clue handoff does not leave stale `CrimeType` results under the next-step draft.
7. Samuel's progressive queued report narrowing is restored after the broad and murder-only `CrimeSceneReport` runs.
8. Old results are cleared when the next queued draft takes over so no mismatched draft/result pair appears.
9. The Briefing header now orients the student before active query coaching begins.
10. The Query Lab desktop layout no longer clips the `Log Clue` action at the tested app width, and the action column is no longer right-justified against the edge.
11. Tests were updated or added where practical.

Flag:

- forced Evidence Board jumps after the first clue
- draft/result mismatches during report narrowing
- clipped desktop Query Lab action buttons
- backend or database modifications
- missing tests

---

## Codex Results

Implemented WP-115 in the Student Mode Query Lab handoff and desktop layout path.

- Updated [useStudentCaseState.ts](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/useStudentCaseState.ts) so the first correct `CrimeType` clue keeps the student in Query Lab, resets the prior result view before the next task starts, and now restores Samuel's queued report narrowing help by advancing to the murder-only draft after the broad report run and to the SQL City draft after the murder-only run.
- Updated [studentCase.ts](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/studentCase.ts) so Samuel's guidance again explains the queued report-narrowing help during the `CrimeSceneReport` phase, while keeping the Briefing/Query Lab distinction intact.
- Updated [StudentMentorHeader.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/components/student/StudentMentorHeader.tsx) so the Briefing header now acts as orientation copy instead of pushing the student straight into database-task coaching before they read the briefing content below.
- Updated [QueryRunner.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/components/QueryRunner.tsx), [StudentWorkbenchView.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/components/student/StudentWorkbenchView.tsx), and [App.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/App.tsx) so the query surface can intentionally clear old results on a clue-handoff reset while still preserving restored review contexts where needed.
- Updated [styles.css](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/styles.css) so the desktop workbench rail takes less width, sits closer to the right edge, and leaves enough room for the Query Results action column to render without clipping at the tested in-app browser width, with the `Log Clue` action column left-aligned instead of pressed against the edge.
- Expanded [App.test.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/App.test.tsx) and [QueryRunner.test.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/components/QueryRunner.test.tsx) to cover the new Query Lab handoff, intentional result reset, and report-draft alignment behavior.

Verification:

- `npm run test --workspace apps/web` passed with `139` tests passing.
- `npm run build --workspace apps/web` passed.
- Earlier live browser re-check in Codex confirmed:
  - the first clue now keeps the student in Query Lab with a fresh `CrimeSceneReport` draft and no stale `CrimeType` table left on screen
  - the broad `CrimeSceneReport` step no longer forces the student into Evidence Board
  - the SQL City report table now renders the `Log Clue` column fully inside the visible panel width at the tested viewport
- A fresh post-adjustment browser pass could not be completed in this session because the Browser plugin started rejecting new interaction with `http://127.0.0.1:5173/` under its security policy. The final iteration is therefore verified by green tests and build, plus the immediately prior live browser pass before that policy block appeared.

Status:

- Implemented and verified locally
- Not yet audited
- Not yet committed or pushed

## Gemini Audit Results
Audit complete. WP-115 passes.

- File scope verified: only approved frontend files and the work package record changed.
- Query Lab handoff verified: logging the first `CrimeType` clue now keeps the student in Query Lab instead of forcing Evidence Board.
- Progressive Samuel help verified: the broad `CrimeSceneReport` run now queues the murder-only draft, and the murder-only run queues the SQL City draft.
- Result synchronization verified: stale prior-step results are cleared when the next queued draft takes over, so no draft/result mismatch is shown.
- Briefing UX verified: the Briefing header now orients the student before active query coaching begins.
- Desktop layout verified: the Query Lab rail width and action column changes prevent `Log Clue` from clipping, and the action area is no longer right-justified against the edge.
- Deterministic boundaries verified: no backend, database, SQL execution, or runtime AI behavior changes were introduced.
- Test coverage verified: focused App and Query Runner tests cover the accepted WP-115 handoff and guidance behaviors.

No flags or violations were identified during the audit.

## Final Decision

Accepted. WP-115 now keeps the student in Query Lab after the first clue, restores Samuel's progressive report-narrowing help without reintroducing stale result mismatches, improves the Briefing header onboarding tone, and fixes the desktop Query Lab action-column layout without changing backend or database behavior.


