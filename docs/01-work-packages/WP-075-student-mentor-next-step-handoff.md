# WP-075: Student Mentor Next Step Handoff

## Objective

After students log the first verified clue, Samuel must clearly affirm the clue and direct them back to Query Lab for the next queued investigation step.

## Scope

### In Scope
- Update the first-clue success feedback and Samuel header reaction.
- Add a compact Evidence Board handoff that points students back to Query Lab after CrimeID is pinned.
- Prevent restored Query Lab results from auto-scrolling when students navigate to the page.
- Simplify Query Lab guidance so Samuel's avatar section is the only source for prompts, feedback, and next-step advice.
- Rename the recurring mentor reaction heading from `Samuel's read` to `Samuel's advice`.
- Explain why Samuel changes queued queries after the broad `CrimeSceneReport` scan and after the murder-only report filter.
- Preserve the existing Samuel draft query progression.
- Update app tests for the new first-clue handoff.

### Out of Scope
- New case steps, new clues, or changed SQL validation rules.
- New art, assets, dependencies, or route structure.
- Broad Evidence Board redesign.
- Developer mode behavior.

## Files Allowed to Change

- `apps/web/src/App.tsx`
- `apps/web/src/App.test.tsx`
- `apps/web/src/components/QueryRunner.tsx`
- `apps/web/src/components/QueryRunner.test.tsx`
- `apps/web/src/components/QueryResultsTable.tsx`
- `apps/web/src/components/QueryResultsTable.test.tsx`
- `apps/web/src/styles.css`
- `docs/01-work-packages/WP-075-student-mentor-next-step-handoff.md`

## Constraints

- Preserve existing behavior unless explicitly changing first-clue handoff copy or navigation.
- Do not change the number or order of Samuel's existing guided steps.
- Do not expose later witness or suspect details earlier than the existing flow allows.
- Keep the Evidence Board action compact and tied to the current mentor step.

## Required Behavior

- When a student logs the Murder `CrimeID`, feedback must say the clue was logged and that Samuel queued the `CrimeSceneReport` draft.
- Samuel's header reaction after the first clue must affirm the pinned clue and direct the student back to Query Lab.
- Evidence Board must show a compact first-clue handoff with a `Return to Query Lab` action while `crime-type` is complete and `crime-scene-filter` is not complete.
- The handoff action must switch to Query Lab without changing case progress.
- Query Lab must not auto-scroll to restored results on tab navigation.
- Query Lab must not display a second Samuel feedback/guidance card below the navigation tabs.
- Query Results must not repeat Samuel's feedback, clue prompts, or notebook prompts.
- Samuel's avatar guidance must explain why the queued query changes from broad report scan to `CrimeID = 1080`.
- Samuel's avatar guidance must explain why the queued query changes from `CrimeID = 1080` to the added `ReportCity = 'SQL City'` filter.
- Existing later lead behavior must remain unchanged after the crime scene report is proven.

## Acceptance Criteria

- [x] First-clue success copy explicitly names the next Query Lab handoff.
- [x] Samuel's advice directs students to the queued `CrimeSceneReport` draft.
- [x] Evidence Board provides a compact `Return to Query Lab` action only during the first-clue handoff state.
- [x] Query Lab navigation no longer jumps to restored results.
- [x] Samuel's avatar section is the only Query Lab source for mentor feedback, insight, and guidance.
- [x] Query Results stay focused on rows and row logging controls without duplicate feedback blocks.
- [x] The mentor heading uses `Samuel's advice` instead of `Samuel's read`.
- [x] Samuel explains why each queued `CrimeSceneReport` filter is added during the guided report narrowing sequence.
- [x] App tests cover the new handoff copy and action.
- [x] No unrelated files changed.

## Codex Prompt

Implement the required behavior exactly as specified.

Scope:
- Only modify the allowed files.

Constraints:
- No refactors.
- No new dependencies.
- Preserve all existing behavior outside the first-clue mentor handoff.
- Preserve query-result scrolling after a new query is submitted.

Return:
- Exact code changes.
- Short summary of what was implemented.

## Gemini Audit Prompt

Audit this change against the work package.

Verify:
- All acceptance criteria are satisfied.
- No files outside allowed list were modified.
- No functional regression.
- The mentor handoff improves clarity without revealing later clues.

Output:
- Verdict: PASS or FAIL
- Violations
- Regressions
- Drift risks

## Codex Results

- Updated the first Murder `CrimeID` success feedback to tell students Samuel queued the `CrimeSceneReport` draft.
- Updated Samuel's first-clue reaction to affirm the pinned clue and direct students back to Query Lab.
- Added a compact Evidence Board handoff with a `Return to Query Lab` action while the next report step is waiting.
- Added responsive styling for the compact handoff.
- Removed navigation-time result scrolling while preserving query-submit result scrolling.
- Removed the duplicate Query Lab guidance card below the tabs.
- Removed result-level Samuel feedback and notebook prompt blocks so the results area stays focused on data and row logging.
- Renamed the mentor reaction heading to `Samuel's advice`.
- Added Samuel avatar guidance for why the queued query changes after the broad report scan and after the murder-only report filter.
- Updated app and component tests to verify the new copy, the handoff action, the queued draft query, and the simplified results guidance.

## Gemini Audit Results

## Verdict
PASS

## Final Decision

Accepted.

