# student-query-result-visibility

## Objective

Ensure students can immediately see that a query executed by bringing the query results or execution error into view after the query completes, then re-center the experience on Samuel's response when a clue is accepted.

## Background

During Student Mode evaluation, the first query can execute successfully while the results appear below the visible portion of the workbench. In the narrow Codex browser, this makes the interaction feel ambiguous because the student may not know whether anything happened.

The intended flow is:

- student runs Samuel's starter query
- the Query Lab makes the result area visible
- the student sees the evidence prompt and result rows
- the student can then decide which clue to log
- after a correct clue is logged, Samuel's response is brought back into view before the student reviews the notebook evidence

## Scope

In scope:

- Student Mode query result visibility
- Query Runner scroll behavior after execution
- post-clue refocus behavior when accepted evidence moves the student to the Evidence Board
- removal of redundant first-action controls that compete with the Query Lab location tab
- guided query wording/draft refinements needed to keep the target report discoverable in the visible results
- SQL editor auto-sizing so multi-line guided queries remain fully visible
- frontend test/build verification

Out of scope:

- backend/API changes
- database changes
- package/build configuration changes
- visual redesign beyond result visibility
- changing evidence validation or clue logging rules

## Files Allowed to Change

- `docs/01-work-packages/WP-071-student-query-result-visibility.md`
- `apps/web/src/components/QueryRunner.tsx`
- `apps/web/src/App.tsx`

Only change additional frontend test files if directly required by verification.

## Requirements

- When a Student Mode query returns results, the result block should scroll into view.
- When a Student Mode query returns an execution error, the error block should scroll into view.
- When a correct clue is logged and the Evidence Board opens, Samuel's response/header should scroll into view before the student reviews the notebook evidence.
- The briefing view should not show a redundant `Start Query` button when `Query Lab` already performs that navigation.
- The guided report-filter query should narrow by both murder `CrimeID` and `ReportCity` so the intended target report is easier to find in the visible result set.
- The SQL editor should expand vertically as query drafts or student edits add lines.
- Developer Mode should not receive new automatic scroll behavior.
- The behavior should remain safe in test environments where `scrollIntoView` may not exist.
- The query execution, evidence prompt, and evidence validation state machine must remain unchanged.

## Acceptance Criteria

- Running the first Student Mode query visibly moves the student to the result/evidence area.
- Result rows and evidence prompts are easier to discover in the narrow in-app browser.
- Errors are also brought into view when query execution fails.
- Accepted clue logging brings Samuel's reaction back into view while preserving the Evidence Board/notebook transition.
- The redundant `Start Query` control is removed from the briefing card.
- Samuel's report-filter prompt uses `AND ReportCity = 'SQL City'` with `CrimeID = 1080`.
- Multi-line query drafts remain visible because the SQL editor expands to fit its content.
- Existing tests pass.
- Vite production build passes or unrelated blockers are documented.
- No backend, database, package, build, or script changes are introduced.

## Codex Results

Implemented Student Mode result visibility behavior.

- Added a response anchor inside `QueryRunner`.
- Added Student Mode-only scroll behavior after query results or errors appear.
- Guarded the scroll call so tests and browsers without `scrollIntoView` do not fail.
- Added a focusable Student Mode case header ref so successful clue logging scrolls Samuel's reaction back into view when the Evidence Board opens.
- Removed the redundant `Start Query` button from the briefing card; students use the `Query Lab` location tab to begin querying.
- Updated the third guided query from a murder-only filter to `WHERE CrimeID = 1080 AND ReportCity = 'SQL City'`.
- Updated Samuel's copy, evidence prompt, and tests to reflect the narrower city-filtered report query.
- Added SQL textarea auto-sizing so additional query lines expand the editor instead of clipping the draft.
- Preserved Developer Mode behavior and existing query execution flow.

Verification:

- `npm run test --workspace apps/web` passed: 7 test files, 30 tests.
- `npx vite build` from `apps/web` passed; Vite reported existing deprecation warnings for `esbuild` and `optimizeDeps.esbuildOptions`.
- Generated Vite build outputs were removed after verification.
- Re-ran both checks after adding accepted-clue Samuel refocus behavior; results remained passing.
- Re-ran both checks after removing `Start Query` and adding the `ReportCity` query hint; results remained passing.
- Re-ran both checks after adding SQL editor auto-sizing; results remained passing.

## Gemini Audit Results

Pending.

## Final Decision

Accepted.

The query-result visibility, accepted-clue refocus, redundant `Start Query` removal, ReportCity query hint, and auto-expanding SQL editor changes are accepted for commit. Further gameplay and UX refinements will continue in a later work package.
