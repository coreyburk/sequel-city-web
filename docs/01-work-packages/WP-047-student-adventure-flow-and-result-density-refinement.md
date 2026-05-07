# student adventure flow and result density refinement

## Objective

Refine Student Mode into a true query-driven adventure flow by removing manual story paging, aligning visual storytelling to investigation progress, simplifying student-facing language, renaming lead guidance as Detective's Case Notes, and reducing result-table scroll burden for large query outputs.

## Scope

### In Scope

- Remove manual story `Next`/`Previous` controls from Student Mode.
- Keep Story Narration as fixed case brief metadata for Case #004.
- Drive story visual caption/scene by query-progress state rather than manual paging.
- Rename "Case Progress" lead-guidance experience to "Detective's Case Notes".
- Simplify Student Query Runner instructional copy.
- Add Student Mode result-table row limiting with expand controls for large outputs.
- Keep Developer Mode diagnostic depth intact.
- Update tests for revised behavior.

### Out of Scope

- Backend/API changes.
- Persistent learner profile/progress storage.
- Automatic answer reveal.
- Developer Mode layout redesign.

## Files Allowed to Change

- docs/01-work-packages/WP-047-student-adventure-flow-and-result-density-refinement.md
- apps/web/src/App.tsx
- apps/web/src/App.test.tsx
- apps/web/src/components/QueryRunner.tsx
- apps/web/src/components/QueryResultsTable.tsx
- apps/web/src/components/QueryResultsTable.test.tsx
- apps/web/src/styles.css

## Constraints

- Preserve existing backend-authoritative query execution behavior.
- Keep Student Mode compact and spoiler-safe.
- Maintain existing callback flow used for milestone tracking.
- Do not add dependencies.

## Required Behavior

- Student story card remains concise and static for Case #004 context.
- Story visual changes from progress state (e.g., intro, active leads, advanced evidence, completion).
- Student progress block uses "Detective's Case Notes" naming and non-linear lead framing.
- Student Query Runner copy is plain learner language and non-technical.
- Student Query Results initially show a limited row set (e.g., first 25), with controls to show more/all.
- Developer audience continues to see full diagnostic cards and unrestricted table rendering behavior.

## Acceptance Criteria

- [ ] Student Mode no longer uses manual story paging controls.
- [ ] Story visual/caption updates based on query progress state.
- [ ] "Detective's Case Notes" naming replaces technical progression wording.
- [ ] Student query instructions are simplified.
- [ ] Large student result sets are row-limited with explicit expand controls.
- [ ] Developer behavior remains unchanged.
- [ ] No files outside allowed list changed.

## Codex Prompt

Implement WP-047 student adventure and result-density refinements.

Do:

- remove manual story stepping
- bind visual storytelling to progress state
- rename leads section to Detective's Case Notes
- simplify student query runner language
- add row-limited student result view with expand controls
- update tests

Do not:

- change backend behavior
- reveal answer keys
- add dependencies

Return:

- files changed
- behavior summary
- test summary
- scope confirmation

## Gemini Audit Prompt

Audit WP-047 student adventure flow and result-density refinement.

Verify:

1. Only allowed files were modified.
2. Story controls were removed and visual progression is query/progress-driven.
3. Detective's Case Notes naming and lead framing are present.
4. Student query copy is simplified.
5. Large student query results use row limits with expand controls.
6. Developer mode behavior remains intact.

Output:

- Verdict: PASS or FAIL
- Violations
- Regressions
- Drift risks

## Codex Results

Completed:

- Added WP-047 for student adventure and result-density refinements.
- Removed manual story navigation controls (`Next`/`Previous`) from Student Mode.
- Kept Story Narration as a fixed concise Case #004 brief.
- Mapped visual scene class/caption to investigation progress state (`completedCount`) rather than manual paging.
- Renamed progress section to `Detective's Case Notes`.
- Simplified student-facing Query Runner copy to plain learner language.
- Added audience-aware row limiting in `QueryResultsTable`:
  - Student mode shows first 25 rows for large results
  - `Show 25 More` and `Show All` controls reveal additional rows
- Preserved Developer Mode diagnostics behavior.
- Added/updated tests for:
  - fixed story brief behavior
  - Detective's Case Notes naming
  - student row-limiting and expand controls

Updated Files:

- docs/01-work-packages/WP-047-student-adventure-flow-and-result-density-refinement.md
- apps/web/src/App.tsx
- apps/web/src/App.test.tsx
- apps/web/src/components/QueryRunner.tsx
- apps/web/src/components/QueryResultsTable.tsx
- apps/web/src/components/QueryResultsTable.test.tsx
- apps/web/src/styles.css

Validation Performed:

- `npm run test --workspace apps/web` (PASS)

Acceptance Criteria Status:

- [x] Student Mode no longer uses manual story paging controls.
- [x] Story visual/caption updates based on query progress state.
- [x] "Detective's Case Notes" naming replaces technical progression wording.
- [x] Student query instructions are simplified.
- [x] Large student result sets are row-limited with explicit expand controls.
- [x] Developer behavior remains unchanged.
- [x] No files outside allowed list changed.

## Gemini Audit Results

- Verdict: PASS
- Violations: None detected. Only allowed files were updated, story controls were removed, visual state is query-driven, "Detective's Case Notes" logic is present, query copy is simplified, and row limits/expand controls are correctly applied.
- Regressions: None detected. Developer mode behavior is cleanly preserved via `audience="developer"` defaults and mode checks.
- Drift risks: Low. The changes rely on `completedCount` and existing data objects, maintaining the established callback flow and deterministic architecture without adding new state persistence or external dependencies.
Warning: 256-color support not detected. Using a terminal with at least 256-color support is recommended for a better visual experience.
Ripgrep is not available. Falling back to GrepTool.

## Final Decision
Approved.

Reason:
Gemini audit returned PASS with no violations or regressions, and WP-047 acceptance criteria are satisfied for fixed case brief narration, query-driven visuals, Detective's Case Notes framing, simplified student query language, and large-result expansion controls.

