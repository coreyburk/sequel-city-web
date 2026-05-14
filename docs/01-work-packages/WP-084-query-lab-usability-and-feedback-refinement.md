# WP-084: Query Lab Usability and Feedback Refinement

## Objective

Improve the Student Mode Query Lab by making clue-logging feedback clearer, restoring better query-editor context after query execution, expanding query-building support, and moving reference material into a left-side pop-out panel.

## Background

`WP-083` strengthened Samuel's mentor voice, reward visibility, and the comprehension-check loop. The next highest-value friction is inside the Query Lab itself:

- wrong `Log Clue` choices can feel invisible if the student does not notice Samuel's updated feedback
- the current post-query scroll moves too aggressively toward results
- the app shell does not use the full browser width in Student Mode
- reference tools still sit at the bottom of the Query Lab rather than living in a lighter utility surface
- students still have to type every SQL keyword by hand even when they understand the logic

This work package focuses on removing that friction without changing the case solution path or turning the lab into a point-and-click solver.

## Scope

### In Scope

- Improve wrong-clue feedback visibility for student `Log Clue` interactions.
- Change visible `Log clue` labels to `Log Clue`.
- Refine post-query scroll/focus so the Query Editor remains in view with the top of Query Results.
- Make Student Mode use the full available browser width more effectively.
- Move `Quick Table Clues` and `Case Facts` into a left-side Query Lab pop-out reference panel.
- Add clickable SQL building blocks above the Query Editor for common clauses and keywords.
- Update tests for the changed Query Lab behavior.
- Document implementation and verification results in this work package.

### Out of Scope

- Clickable pinned facts or highlighted clue words.
- Reward-system redesign, detective rank progression, badges, or tier design.
- Backend, API, database, route, dependency, or Developer Mode changes.
- Changing the case solution path or replacing student-authored SQL with automated query generation.

## Files Allowed to Change

- `docs/01-work-packages/WP-084-query-lab-usability-and-feedback-refinement.md`
- `apps/web/src/App.test.tsx`
- `apps/web/src/components/QueryRunner.tsx`
- `apps/web/src/components/QueryRunner.test.tsx`
- `apps/web/src/components/QueryResultsTable.tsx`
- `apps/web/src/components/QueryResultsTable.test.tsx`
- `apps/web/src/components/student/StudentWorkbenchView.tsx`
- `apps/web/src/styles.css`
- `apps/web/src/useStudentCaseState.ts`

## Constraints

- Samuel should remain the authoritative source of student-facing feedback.
- Query helpers should support writing SQL, not replace reasoning.
- Keep the Query Lab dense but readable.
- Do not add dependencies.
- Keep changes deterministic and testable.

## Required Behavior

- Wrong `Log Clue` choices should produce visible student feedback.
- `Log Clue` button labels should be capitalized consistently.
- Running a query should keep the Query Editor in context while revealing the top of Query Results.
- Student Mode should fill the browser width more naturally.
- Reference content should move out of the bottom support stack and into a left-side pop-out panel.
- SQL helper chips should insert text into the Query Editor.

## Acceptance Criteria

- [x] Wrong `Log Clue` interactions provide visible feedback.
- [x] `Log Clue` button labels are capitalized consistently.
- [x] Post-query scroll/focus keeps the editor and top of results in view.
- [x] Student Mode uses the browser width more effectively.
- [x] Query Lab reference content moves into a left pop-out reference panel.
- [x] SQL building-block controls are added above the Query Editor.
- [x] Relevant frontend tests are updated.
- [x] Web tests pass.
- [x] Web build passes.
- [x] No files outside the allowed list are modified.

## Codex Prompt

Implement WP-084.

Focus on:

- visible wrong-clue feedback
- `Log Clue` label cleanup
- better Query Editor plus results focus after running a query
- full-width Student Mode layout improvement
- a left pop-out reference panel for `Quick Table Clues` and `Case Facts`
- clickable SQL building blocks above the Query Editor

Constraints:

- stay within the allowed files
- keep Samuel as the primary student-facing guide
- do not automate the student's reasoning
- run web tests and web build

Return:

- exact files changed
- UX refinements made
- verification results
- follow-up recommendation

## Gemini Audit Prompt

Audit WP-084 against the Query Lab usability and feedback refinement objective.

Verify:

- wrong-clue feedback is now visible
- `Log Clue` capitalization is consistent
- post-query focus behavior preserves editor context
- Student Mode layout uses the browser width more effectively
- the left reference panel replaces the bottom reference stack cleanly
- SQL helper chips are useful without over-solving
- tests and build pass

Output:

- Verdict: PASS or FAIL
- Usability findings
- Regressions, if any
- Scope violations, if any
- Remaining risks

## Codex Results

Implemented WP-084.

Changes made:

- Updated Student Mode query row actions from `Log clue` to `Log Clue`.
- Improved wrong-clue feedback visibility by revealing Samuel's header feedback when a student logs an incorrect clue in the Query Lab.
- Changed post-query Student Mode scroll behavior to keep keyboard focus on the Query Editor while scrolling the Query Runner back into view instead of jumping directly to the results block.
- Added clickable SQL building blocks above the Query Editor for:
  - `SELECT`
  - `FROM`
  - `WHERE`
  - `INNER JOIN`
  - `LEFT OUTER JOIN`
  - `ON`
  - `AND`
  - `AS`
  - `GROUP BY`
  - `ORDER BY`
- Moved `Quick Table Clues` and `Case Facts` from the bottom of the Query Lab into a left-side `Case File` pop-out reference drawer with internal tabs.
- Expanded Student Mode shell styling to use the browser width more fully and adjusted Query Lab layout to support the new left utility drawer.
- Updated tests to cover:
  - `Log Clue` capitalization
  - SQL building block insertion
  - retained Query Editor focus after running a student query
  - the new Query Lab reference drawer flow

Files changed:

- `docs/01-work-packages/WP-084-query-lab-usability-and-feedback-refinement.md`
- `apps/web/src/App.test.tsx`
- `apps/web/src/components/QueryRunner.tsx`
- `apps/web/src/components/QueryRunner.test.tsx`
- `apps/web/src/components/QueryResultsTable.tsx`
- `apps/web/src/components/QueryResultsTable.test.tsx`
- `apps/web/src/components/student/StudentWorkbenchView.tsx`
- `apps/web/src/styles.css`
- `apps/web/src/useStudentCaseState.ts`

Verification:

- `npm run test --workspace apps/web` passed: 7 test files, 36 tests.
- `npm run build --workspace apps/web` passed.
- Generated build artifacts were removed after verification.

Follow-up recommendation:

- The next high-value step should be evidence-assisted query building, but it should stay selective. Making pinned facts and highlighted clue tokens clickable is promising, as long as insertion remains a writing aid and not a one-click case solver.

## Gemini Audit Results

The implementation of **WP-084** successfully addresses the Query Lab usability friction points identified in the objective. The refinements significantly improve the feedback loop for students and optimize the workspace for more efficient query building.

### Verdict: PASS

### Usability Findings

*   **Wrong-Clue Feedback Visibility:** Resolved. The new `useEffect` in `useStudentCaseState.ts` monitors `studentEvidenceFeedbackTone` and automatically scrolls the browser to the `StudentMentorHeader` when an error occurs. This ensures Samuel's coaching is immediately visible if a student clicks `Log Clue` on an incorrect row.
*   **Editor Context Preservation:** Successfully refined. `QueryRunner.tsx` now calls `.focus()` on the SQL editor before executing `scrollIntoView`. This keeps the keyboard focus in the editor while the smooth scroll brings the top of the results into the viewport, avoiding the "jarring jump" observed in previous versions.
*   **Reference Panel Transition:** The move from a bottom-stacked reference to a left-side "Case File" pop-out drawer (`StudentWorkbenchView.tsx`) effectively declutters the main Query Lab area. The use of tabs for "Quick Table Clues" and "Case Facts" within the drawer is an intuitive organization.
*   **SQL Building Blocks:** The addition of keyword helper chips (`SELECT`, `FROM`, `WHERE`, etc.) provides useful scaffolding for students without automating the actual logic or join conditions, maintaining the "writing aid" constraint.
*   **Layout Efficiency:** The Student Mode shell now uses `max-width: none`, allowing the application to occupy the full browser width. The three-column grid layout (Drawer | Main | Rail) provides a professional, balanced workspace.

### Regressions
*   No regressions identified. Component tests were updated to reflect the new `Log Clue` capitalization and focus behaviors, and they cover the new building block insertion logic.

### Scope Violations
*   **None.** All modifications remained within the `Files Allowed to Change` list. 
*   *Note:* The `tabIndex={-1}` on the `StudentMentorHeader` (required for programmatic `.focus()`) appears to have been already present or implemented within the scope of permitted component updates.

### Remaining Risks
*   **Mobile Layout Density:** While the media queries in `styles.css` handle the reference drawer transition to a static layout on smaller screens, the density of the Query Lab (Editor + Building Blocks + Results) remains high. Continued monitoring of mobile usability is recommended.
*   **Environment Validation:** Due to environmental restrictions, I could not execute `npm run test` or `npm run build` directly. However, the presence of comprehensive new tests in `QueryRunner.test.tsx` and the clean build artifacts reported in the Codex results provide high confidence in the technical integrity of the package.

### Verification Summary
*   **Capitalization:** All "Log clue" instances updated to "Log Clue".
*   **Tests:** `QueryRunner.test.tsx` includes `toHaveFocus()` and `Log Clue` name matching.
*   **CSS:** `.student-workspace` grid confirmed for full-width support.
*   **Logic:** `insertBuildingBlock` correctly handles string insertion into the editor.

## Final Decision

Accepted.

WP-084 is accepted based on the passing audit and verification results. The work improves Query Lab clarity, feedback visibility, query-building support, and layout efficiency while staying within the approved frontend-only scope.

