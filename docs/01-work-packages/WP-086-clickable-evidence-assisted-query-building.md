# WP-086: Clickable Evidence-Assisted Query Building

## Objective

Improve Student Mode query writing by turning Samuel's highlighted clue tokens and the useful pinned facts into clickable query-building aids inside the Query Lab.

## Background

`WP-084` introduced SQL building blocks above the Query Editor and moved reference material into the Query Lab drawer. That reduced friction, but students still need to manually retype the exact evidence they just earned.

The next refinement is selective evidence-assisted query building:

- Samuel's highlighted clue words should be usable as direct query helpers.
- Pinned facts should become clickable when they represent a clean query fragment.
- The aid should support writing, not solve the case for the student.

This package should keep the Query Lab readable and preserve Samuel as the guide while making the workspace more supportive and tactile.

## Scope

### In Scope

- Make Samuel's highlighted Query Lab clue tokens clickable when they map to useful query text.
- Make suitable Pinned Facts clickable so they can insert query-ready fragments into the Query Editor.
- Reuse the existing Query Editor instead of creating a second query-building surface.
- Keep insertion behavior lightweight and deterministic.
- Add or update frontend tests for the new assist flow.
- Record the implementation in this work package.

### Out of Scope

- Backend, database, or API changes.
- Automatic query completion or full query generation.
- New reward-system behavior.
- Case progression rewrites.
- New evidence validation rules.

## Files Allowed to Change

- `docs/01-work-packages/WP-086-clickable-evidence-assisted-query-building.md`
- `apps/web/src/components/QueryRunner.tsx`
- `apps/web/src/components/QueryRunner.test.tsx`
- `apps/web/src/components/student/StudentWorkbenchView.tsx`
- `apps/web/src/App.test.tsx`
- `apps/web/src/styles.css`

## Constraints

- Keep the feature frontend-only.
- The inserted text must act as a writing aid, not an automatic case solver.
- Only make evidence clickable when the inserted text is still meaningful inside a hand-written query.
- Preserve the existing Query Lab layout and evidence progression behavior.
- Keep the interaction accessible with clear button semantics.

## Required Behavior

- The student can click selected clue tokens in Samuel's witness guidance and have those fragments added to the Query Editor.
- The student can click suitable pinned facts and have those fragments added to the Query Editor.
- Repeated renders must not duplicate the same insert automatically.
- Existing SQL building blocks must continue to work.
- Existing evidence logging, queued query updates, and mentor guidance must continue to work.

## Acceptance Criteria

- [x] Selected Samuel clue tokens in Query Lab are clickable.
- [x] Suitable pinned facts are clickable in Query Lab.
- [x] Clicking a token or fact inserts text into the existing Query Editor flow.
- [x] The same assist request is not duplicated on rerender.
- [x] QueryRunner tests cover the new insertion path.
- [x] App-level tests cover the Student Mode assist wiring.
- [x] No backend, database, or package configuration files are changed.

## Codex Prompt

Implement WP-086 in the existing Student Mode frontend.

Add clickable evidence-assisted query building that lets students use:

- selected Samuel clue tokens from the Query Lab witness guide
- suitable pinned facts from the Query Lab right rail

Rules:

- keep it selective and helpful
- do not auto-solve the case
- reuse the existing Query Editor insertion flow
- keep the interaction accessible and visually consistent

Return:

- exact files changed
- key UI decisions
- verification results

## Gemini Audit Prompt

Audit WP-086 against the clickable evidence-assisted query building objective.

Verify:

- the work remains frontend-only
- clickable clue tokens are selective and useful
- pinned facts only become clickable when they map to sensible query fragments
- the Query Editor remains the single writing surface
- the change avoids turning evidence assistance into one-click case solving
- test coverage reflects the new behavior

Output:

- Verdict: PASS or FAIL
- UX strengths
- Risks or over-assistance concerns
- Scope violations, if any

## Codex Results

Implemented WP-086 in the Student Mode frontend.

Changes made:

- Added a shared query-assist insertion path to `QueryRunner.tsx` so outside UI surfaces can insert text into the existing Query Editor.
- Kept the existing SQL building blocks and added a light helper hint so students understand that tokens and facts can also feed the editor.
- Updated `StudentWorkbenchView.tsx` so selected Samuel witness-guide tokens are now clickable and insert selective fragments such as table names, field names, sort clauses, and quoted clue values.
- Updated the Query Lab `Pinned Facts` rail so suitable notebook entries become clickable buttons when they map cleanly to query fragments such as `CrimeID = 1080`, `ReportID = 10975`, `ReportCity = 'SQL City'`, `ReportDate = '2023-01-15'`, and `PersonID = ...`.
- Preserved non-query-friendly notebook entries as plain text so the feature stays assistive instead of over-automated.
- Added tests for direct query-assist insertion in `QueryRunner.test.tsx`.
- Added app-level wiring tests in `App.test.tsx` for pinned-fact and Samuel-token assist behavior.
- Added styling for interactive clue tokens, query-assist hint text, and clickable pinned-fact buttons in `styles.css`.

Verification:

- `npm run test --workspace apps/web`
- `npm run build --workspace apps/web`

Results:

- Web tests passed: 7 files, 39 tests.
- Web production build passed.

## Gemini Audit Results

I have completed the audit of **WP-086: Clickable Evidence-Assisted Query Building**. The implementation successfully bridges the gap between mentor guidance and student action without compromising the educational challenge of writing SQL.

### Verdict: PASS

#### UX Strengths
- **Tactile Evidence Discovery:** Transforming Samuel's field notes into interactive "tokens" makes the investigative clues feel tangible. It reinforces the connection between the witness testimony and the required query.
- **Reduced Friction for Literals:** Clicking complex IDs (`1080`, `10975`) and specific strings (`'Northwestern Dr'`) eliminates the most frustrating source of student errorsΓÇötypos in literal valuesΓÇöwhile still requiring the student to understand the SQL structure.
- **Intelligent Fragment Mapping:** The logic in `getPinnedFactAssistText` demonstrates high polish by translating notebook-style entries (e.g., *"Witness PersonID = 14887"*) into syntactically correct query fragments (e.g., `PersonID = 14887`).
- **Seamless Integration:** The use of a shared insertion path in `QueryRunner` ensures that the Query Editor remains the single writing surface, preserving focus and cursor context for the student.

#### Risks or Over-Assistance Concerns
- **"Building Block" Balance:** While the assistance is significant (e.g., providing `ORDER BY PersonID`), it stops short of "one-click solving." The student must still provide the `SELECT`, `FROM`, and `WHERE` keywords (or use the existing building block buttons), ensuring they are still "writing" the query.
- **Contextual Awareness:** The tokens are scoped to Samuel's current instruction, which prevents the UI from becoming cluttered with irrelevant clickable elements.

#### Scope Violations
- **None:** The implementation is strictly frontend-only. All changes are contained within the `apps/web` workspace, specifically in components and styling files as defined in the work package scope. No backend, database, or API contracts were modified.

#### Verification Results
- **Logic:** Insertion logic correctly handles caret positioning and automatic spacing.
- **State Management:** The use of `lastAppliedQueryAssistIdRef` correctly prevents duplicate insertions on component rerenders.
- **Testing:** Unit tests in `QueryRunner.test.tsx` and integration tests in `App.test.tsx` confirm that the assist requests are correctly wired and executed across the workbench.

## Final Decision

Accepted.

WP-086 is accepted based on the passing audit and clean verification results. The feature improves student query-building support while keeping the Query Editor as the single writing surface and preserving the frontend-only scope.

