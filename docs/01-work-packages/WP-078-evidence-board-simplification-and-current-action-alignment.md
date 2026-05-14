# WP-078: Evidence Board Simplification And Current Action Alignment

## Objective

Simplify the Evidence Board so students see one clear current action, their notebook, and progress without competing guidance surfaces.

## Scope

### In Scope
- Consolidate Evidence Board right-column guidance into one current-action surface.
- Remove duplicate or competing Evidence Board labels such as `Emerging Leads`, `Samuel Check-In`, and `Available Leads`.
- Restore comprehension checks as a compact `Case Review` assessment with a small reward counter, not as a second advice source.
- Preserve the Evidence Notebook, manual notes, witness evidence checklist, milestone list, and lead gating behavior.
- Keep Samuel's avatar section as the single source of mentor advice.
- Update tests and styles for the simplified Evidence Board.

### Out of Scope
- Changing the guided SQL sequence.
- Changing witness bundle logging or milestone advancement rules.
- Revealing witness, gym, suspect, or solution details earlier.
- Backend, database, package, route, runtime AI, or artwork changes.
- Redesigning Query Lab or Samuel's Briefing.

## Files Allowed to Change

- `docs/01-work-packages/WP-078-evidence-board-simplification-and-current-action-alignment.md`
- `apps/web/src/App.tsx`
- `apps/web/src/App.test.tsx`
- `apps/web/src/styles.css`

## Constraints

- Preserve existing case progression and evidence validation behavior.
- Do not add new guidance surfaces.
- Do not duplicate Samuel's advice outside the avatar section.
- Keep assessment questions clearly separate from current-action guidance.
- Keep the Evidence Board scannable and action-oriented.
- No new dependencies.

## Required Behavior

- Evidence Board must keep the notebook and manual note controls.
- Evidence Board must show one right-column `Current Action` surface instead of separate `Emerging Leads`, `Samuel Check-In`, and `Available Leads` blocks.
- The first-clue `Return to Query Lab` handoff must remain available.
- Current lead text must remain available without the `Emerging Leads` label.
- The milestone list must remain visible as progress context.
- The witness evidence checklist must remain state-aware and unchanged in behavior.
- `Samuel Check-In` must not render on the simplified Evidence Board.
- `Case Review` must provide check-for-understanding questions without telling students what to do next.
- `Insight Marks` must reward correct Case Review answers without changing case progression.
- Tests must verify the simplified labels and preserved progression surfaces.

## Acceptance Criteria

- [x] Evidence Board no longer renders `Emerging Leads`.
- [x] Evidence Board no longer renders `Samuel Check-In`.
- [x] Evidence Board no longer renders `Available Leads`.
- [x] Evidence Board renders a single `Current Action` block in the case progress column.
- [x] The first-clue handoff still includes `Return to Query Lab`.
- [x] Witness Discovery and Gym Lead gating remain preserved.
- [x] The witness evidence checklist remains state-aware.
- [x] Case Review preserves comprehension-check opportunities without rendering as Samuel guidance.
- [x] Insight Marks reward correct Case Review answers without changing progression.
- [x] Tests cover the simplified Evidence Board labels.
- [x] No unrelated files changed.

## Codex Prompt

Implement WP-078.

Scope:
- Only modify the allowed files.

Constraints:
- Preserve evidence logging, milestone gating, and query behavior.
- Do not add another mentor guidance location.
- Keep Samuel's avatar section as the single source of mentor advice.

Return:
- Exact code changes.
- Short summary of what was implemented.

## Gemini Audit Prompt

Audit WP-078 against the current Student Mode simplification direction.

Verify:
- All acceptance criteria are satisfied.
- No files outside allowed list were modified.
- Evidence Board has one clear current-action surface.
- Samuel remains the only mentor advice source.
- Notebook, checklist, milestone, and lead gating behavior remain intact.
- No spoiler regression was introduced.

Output:
- Verdict: PASS or FAIL
- Violations
- Regressions
- Drift risks

## Codex Results

Implemented WP-078.

Changes made:

- Renamed the Evidence Board right panel from `Detective's Case Notes` to `Case Progress`.
- Removed the separate `Emerging Leads` surface.
- Replaced the `Samuel Check-In` quiz block with a compact `Case Review` assessment so students still get comprehension checks without a second advice source.
- Added `Insight Marks` as a lightweight reward counter for correct Case Review answers; it does not unlock leads or change case progression.
- Removed the `Available Leads` label and replaced the right-column action area with one `Current Action` block.
- Preserved the first-clue `Return to Query Lab` handoff inside the same current-action surface.
- Preserved Witness Discovery and Gym Lead lead cards, but rendered them as the current action instead of a separate emerging-leads board.
- Preserved the Evidence Notebook, manual note controls, state-aware witness evidence checklist, and milestone list.
- Replaced Samuel Check-In styles with compact Case Review assessment styles.
- Updated app tests to verify:
  - old Evidence Board labels no longer render
  - `Case Progress` and `Current Action` render
  - `Case Review` renders as assessment and awards Insight Marks
  - first-clue handoff still works
  - Witness Discovery and Gym Lead remain gated and visible at the correct points

Verification:

- `npm run test --workspace apps/web` passed: 7 test files, 34 tests.
- `npm run build --workspace apps/web` remains blocked by the existing `vite.config.ts` typing issue:
  - `Object literal may only specify known properties, and 'test' does not exist in type 'UserConfigExport'`
- The build issue predates WP-078 and remains outside this work package scope.

## Gemini Audit Results

Audit of WP-078 (Evidence Board Simplification and Current Action Alignment) against the Student Mode simplification direction.

### Verdict: PASS

The implementation successfully consolidated the competing guidance surfaces on the Evidence Board into a single, clear "Current Action" surface while maintaining core progression mechanics and mentor-led identity.

### Violations
- **None.** All acceptance criteria are satisfied. The implementation adheres strictly to the allowed file list.

### Regressions
- **None.** Existing milestone gating, evidence logging, and the first-clue handoff behavior remain intact. The "Witness Discovery" and "Gym Lead" cards appear only at the correct progression points. No spoilers for future stages (suspect names or solution details) were revealed ahead of schedule.

### Drift risks
- **Lead Board Specificity:** The `Current Action` card for the Witness Discovery phase mentions specific identifiers found in the data (`Northwestern Dr` and `Annabel`). While this is accurate to the report the student has just unlocked, it is more specific than Samuel's own advice in the header ("two witness clues"). This creates a minor inconsistency where the "system guidance" is more descriptive than the "mentor advice."
- **Distributed Instruction Surfaces:** While the Evidence Board itself is simplified to one "Current Action" block, the overall Student Mode still maintains multiple surfaces for instructions: the Samuel Avatar Header (global), the Witness Trail Guide (Workbench view), and the Current Action block (Evidence Board view). This successfully satisfies the WP-078 goal for the Evidence Board but represents a potential future consolidation point if the "single source of mentor advice" constraint is interpreted as a single global UI element.

### Summary of Improvements
- **Label Cleanup:** Removed `Emerging Leads`, `Samuel Check-In`, and `Available Leads` labels, significantly reducing visual noise and mental load.
- **Unified Action Surface:** Students now have one dedicated spot on the Evidence Board to determine their next move.
- **Assessment Separation:** The `Case Review` section successfully provides comprehension checks and "Insight Marks" rewards without competing for attention as a primary guidance source.
- **Test Coverage:** Updated `App.test.tsx` confirms that the old labels are gone and the new simplified surfaces are functioning as expected.

## Final Decision

Accepted.

WP-078 is accepted based on the passing audit and verification. The implementation may be committed and pushed as one cohesive work package.

