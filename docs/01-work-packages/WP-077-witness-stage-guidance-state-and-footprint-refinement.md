# WP-077: Witness Stage Guidance State And Footprint Refinement

## Objective

Refine the witness-stage student experience after `WP-076` so the guidance stays clear, compact, and state-aware as students move from report review to witness bundle logging and then into the next lookup handoff.

## Why This WP Next

`WP-076` corrected the major post-report UX issues:

- it removed premature autonomy framing
- it kept Samuel in the guide role
- it restored the report row as a transition clue
- it introduced witness-bundle logging with `Log clue`

That work improved the witness stage substantially, but review of the live experience surfaced new friction:

- the witness guide still consumed too much vertical space in Query Lab
- the ordered steps were clearer than before, but still heavier than necessary
- the Evidence Notebook checklist repeated already-completed witness tasks
- once both witness bundles were logged, the UI still showed stale discovery guidance instead of collapsing to the one remaining action
- some wording still leaned on `prove` / `proven` language that did not fit the detective-learning tone as well as `found`, `use`, or `follow`

This WP narrows that second-pass witness-stage friction without changing the underlying case flow.

## Scope

### In Scope

- Reduce the footprint of the witness-stage guidance in Query Lab.
- Keep the witness-stage workflow ordered and explicit while making it more compact.
- Make the Evidence Notebook witness checklist state-aware so it shows only remaining tasks.
- Collapse the witness-stage guide to a single remaining-action prompt after both witness bundles are logged.
- Remove remaining `prove` / `proven` witness-stage wording where it conflicts with the detective-learning tone.
- Update tests for the refined witness-stage states and wording.
- Document implementation and verification in this work package.

### Out of Scope

- Changing the opening `CrimeType` or `CrimeSceneReport` onboarding flow.
- Changing witness gating rules beyond the already-accepted witness-bundle plus next-note flow.
- Revealing witness names, addresses, gym details, suspects, or later case content earlier than current behavior.
- Backend, database, API, asset, or route work.

## Files Allowed To Change

- `docs/01-work-packages/WP-077-witness-stage-guidance-state-and-footprint-refinement.md`
- `apps/web/src/App.tsx`
- `apps/web/src/App.test.tsx`
- `apps/web/src/components/QueryRunner.tsx`
- `apps/web/src/components/QueryRunner.test.tsx`
- `apps/web/src/styles.css`

Only change additional frontend files if directly required by verification.

## Required Behavior

- Query Lab witness guidance must take materially less space than the earlier stacked step-card version.
- The witness-stage guide must remain ordered and explicit, but should read as a compact action strip rather than a second mini-page.
- After the first witness bundle is logged, the Evidence Notebook checklist must stop listing that step as still needed.
- After both witness bundles are logged, the witness guide must collapse to the one remaining action: add the next lookup note.
- Samuelâ€™s visible witness-stage guidance should use `found`, `use`, `follow`, `log`, and `lookup` language rather than stale `prove` / `proven` phrasing in the witness handoff.
- The notebook support text must align with Samuelâ€™s guide and avoid repeating already-completed tasks.
- Existing spoiler boundaries and milestone gating must remain preserved.

## Acceptance Criteria

- [ ] The witness-stage guide uses a compact summary layout instead of the taller multi-card layout.
- [ ] The witness-stage workflow remains clearly ordered.
- [ ] The Evidence Notebook checklist shows only remaining witness-stage tasks.
- [ ] After one witness bundle is logged, the checklist no longer lists the first bundle as still needed.
- [ ] After both witness bundles are logged, the guide collapses to a single remaining-action prompt.
- [ ] Samuelâ€™s witness-stage wording no longer uses stale `prove` / `proven` phrasing in the refined witness handoff states.
- [ ] Query Runner guidance, witness guide content, and notebook checklist stay aligned on the same current next action.
- [ ] Tests cover the refined witness-stage states and wording.
- [ ] No unrelated files change.

## Codex Prompt

Implement WP-077.

Primary goal:
- make the witness-stage guidance smaller, more state-aware, and better aligned with the detective-learning tone.

Constraints:
- preserve the accepted witness-bundle logging flow from `WP-076`
- do not reintroduce autonomy framing
- do not expose later clues early
- preserve the current on-ramp and milestone gating behavior

Implementation expectations:
- compress the witness guide footprint
- keep the step order explicit
- make the notebook checklist state-aware
- collapse the guide to the final remaining action after both witness bundles are logged
- replace stale `prove` / `proven` phrasing in the witness handoff
- update tests
- run `npm run test --workspace apps/web`
- update this work package with implementation and verification

Return:
- exact code changes
- short summary of what was implemented

## Gemini Audit Prompt

Audit WP-077 against the current Student Mode direction.

Verify:

- the witness-stage guide is materially smaller than the earlier stacked-step version
- ordered guidance is still clear
- the notebook checklist reflects only remaining tasks
- the post-bundle state collapses to the final remaining action
- stale `prove` / `proven` witness-stage wording was removed where intended
- no spoiler regression was introduced
- milestone gating remains intact
- no files outside the allowed scope changed

Output:

- Verdict: PASS or FAIL
- Violations
- Regressions
- Drift risks

## Codex Results

Implemented WP-077.

Changes made:

- Compressed the witness-stage guide from a taller stacked-card layout into a compact guidance block.
- Kept the witness workflow ordered while reducing its footprint in Query Lab.
- Changed the witness guide to use a shorter summary plus a tighter ordered list of actions.
- Made the Evidence Notebook witness checklist state-aware so it shows only remaining tasks.
- Removed already-completed witness checklist items once their notebook entries were present.
- Changed the post-bundle witness state so, after both witness bundles are logged, the witness guide collapses to a single remaining-action prompt.
- Aligned Query Runner, witness guide, and notebook checklist so they point to the same current next action.
- Replaced remaining witness-stage `prove` / `proven` phrasing in the visible handoff states with clearer detective-oriented wording such as `found`, `use`, and `lookup`.
- Updated the final notebook-note guidance to ask for which person/address lookup the logged `PersonID` values should be used for next.
- Updated tests to cover:
  - the compact witness guide wording
  - the reduced-height witness-state copy
  - the state-aware notebook checklist
  - the collapsed post-bundle remaining-action state
  - the witness-stage wording cleanup

Verification:

- `npm run test --workspace apps/web` passed: 7 test files, 34 tests.

## Gemini Audit Results

WP-077 has been audited against the Student Mode direction. The implementation successfully addresses the vertical footprint issues, state-awareness in the notebook, and tone refinement for the witness stage.

- **Verdict: PASS**
- **Violations: None**
- **Regressions: None**
- **Drift risks: Low.** Early-stage guidance (Stage 1-3) still uses "prove/proven" in some places (e.g., `INVESTIGATION_OVERVIEW`, `KNOWN_CASE_FACTS`), which is consistent with the scope of this WP but should be monitored for overall project tone consistency as the "detective-learning" tone matures.

### Audit Summary

1.  **Compact Guidance:** The witness-stage guide in the Query Lab has been compressed from the multi-card layout into a single `student-investigation-brief` section. It uses a compact summary and an ordered list (`ol`) that takes up significantly less vertical space.
2.  **State-Aware Checklist:** The Evidence Notebook witness checklist dynamically filters out completed tasks. It correctly transitions from listing both witness bundles to only the second bundle, and finally to just the "Add the next lookup note" action once both bundles are pinned.
3.  **Post-Bundle Collapse:** Once both witness bundles are logged, the Query Lab guidance collapses into a single "One Step Left" prompt, clearly identifying the final manual note required to advance the milestone.
4.  **Tone Alignment:** Visible witness-stage guidance from Samuel has been updated to use active detective verbs (`found`, `use`, `follow`, `log`, `lookup`, `review`, `connect`) instead of the stale `prove`/`proven` phrasing.
5.  **Milestone Integrity:** Case progression logic and milestone gating remain intact. The `witness-clues` milestone still requires two witness bundles and a manual discovery note.
6.  **Scope Verification:** Changes were restricted to the allowed files: `App.tsx`, `App.test.tsx`, `QueryRunner.tsx`, `QueryRunner.test.tsx`, and `styles.css`. Tests were updated and verified to cover the new compact states and wording.

All acceptance criteria for WP-077 have been met.
Warning: 256-color support not detected. Using a terminal with at least 256-color support is recommended for a better visual experience.
Ripgrep is not available. Falling back to GrepTool.

## Final Decision

Approved. Audit passed, scope stayed within WP-077, and the witness-stage guidance refinements are accepted for commit and push.

