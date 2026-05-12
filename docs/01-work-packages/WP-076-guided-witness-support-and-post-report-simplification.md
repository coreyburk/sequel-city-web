# WP-076: Guided Witness Support and Post-Report Simplification

## Objective

Refine the post-report student experience so the witness stage stays strongly guided, easier to follow, and lighter to scan without shifting students into a premature "training wheels off" autonomy phase.

## Why This WP Next

Recent accepted work packages improved the opening case flow in meaningful ways:

- `WP-073` preserved the on-ramp and added a post-report bridge.
- `WP-074` clarified Samuel's role, simplified the briefing copy, and stabilized the upper layout.
- `WP-075` improved the first-clue handoff back to Query Lab and reduced duplicate mentor guidance inside results.

That work moved the student experience in the right direction, but the current post-report state now shows a new mismatch:

- the implementation still uses explicit autonomy framing such as `Training wheels off`
- the witness stage asks for more student self-direction than the current story phase should require
- Query Lab and Evidence Board still ask students to read across several support surfaces before the next move feels obvious

The current direction for Student Mode is:

- continue simplifying
- continue improving clarity
- keep Samuel as the single mentor voice
- keep later clues hidden until earned
- do **not** treat this point in the story as the moment where student support comes off

## Recommendation Summary

The highest-value next work package is to replace the autonomy framing with a guided witness-support model.

Instead of telling students that Samuel will stop giving full support, the product should communicate:

- Samuel is still guiding the case
- the student is still proving clues step by step
- the next move is narrower and more specific than before
- the system is helping them connect the report row to interview evidence without giving away later witness facts

This is a correction toward better scaffolding, not a reversal of the simplification work.

## Scope

### In Scope

- Replace autonomy-language and "training wheels off" framing after the report row is proven.
- Reframe the post-report Query Lab panel as guided witness follow-through rather than a self-directed independence phase.
- Simplify the number and role of support surfaces students must scan during the witness stage.
- Make the next required action more obvious immediately after the report row is logged.
- Tighten the Evidence Board witness-stage guidance so it reads as a short checklist, not a second briefing.
- Keep Samuel's voice as the single mentor voice across the post-report flow.
- Update tests for the revised witness-stage guidance and absence of autonomy framing.
- Document final implementation and verification in this work package.

### Out of Scope

- Changing the opening `CrimeType` and `CrimeSceneReport` on-ramp query sequence.
- Revealing witness names, witness addresses, gym lead details, suspects, or solution content earlier than current behavior.
- Backend, database, package, runtime AI, art asset, or route changes.
- A general redesign of Student Mode beyond the post-report witness-support flow.

## Files Allowed to Change

- `docs/01-work-packages/WP-076-guided-witness-support-and-post-report-simplification.md`
- `apps/web/src/App.tsx`
- `apps/web/src/App.test.tsx`
- `apps/web/src/components/QueryRunner.tsx`
- `apps/web/src/components/QueryRunner.test.tsx`
- `apps/web/src/styles.css`

Only change additional frontend test files if directly required by verification.

## UX Review Findings

### What is working well

- Samuel is now clearly established as the mentor.
- The opening case briefing is more readable and less repetitive.
- The top visual area is more stable across Student Mode tabs.
- Query Lab no longer duplicates mentor guidance below results.
- The first-clue handoff back to Query Lab is clearer and more compact.

### Current friction after the report row

- `Samuel's Investigation Brief` currently uses `Training wheels off`, which signals reduced support at the wrong point in the story.
- The witness stage currently spreads help across too many places:
  - Samuel's mentor strip
  - the investigation brief panel
  - `Need Table Help?`
  - `Samuel's Case Briefing`
  - the Evidence Notebook contract
  - `Samuel Check-In`
- The product language leans toward "write your own query" instead of "follow this next clue with guidance."
- The witness evidence contract is useful, but it still reads like a block of process instructions instead of a compact progress aid.

## Required Behavior

- After the target report row is logged, the UI must not frame the next stage as "training wheels off" or as a withdrawal of support.
- Samuel must continue to sound like an active guide through the witness stage.
- Query Lab must present the next witness task as a guided follow-through from the proven report row.
- The post-report guidance should help the student answer:
  - what to look for next
  - which table to inspect first
  - which proven value to carry forward
  - which rows should be logged with `Log clue`
  - what notebook checkpoint must be completed before the case advances
- The witness-stage support surfaces should be simplified so students do not need to read the same guidance in multiple places.
- `Samuel's Case Briefing` and any post-report helper panel should complement each other instead of feeling like two briefings.
- Evidence Board should present witness-stage logging expectations as a short, scannable checklist.
- The UI must continue hiding witness names, witness addresses, gym lead details, and later suspect information until earned.
- Existing milestone gating must remain preserved.

## Recommended Design

### 1. Replace autonomy framing with guided follow-through

Replace `Training wheels off` and similar copy with language such as:

> "You proved the report row. Now follow that report into the interview records, and Samuel will keep the trail focused one clue at a time."

The student should feel guided, not dismissed into independence.

### 2. Rename the witness-stage panel

`Samuel's Investigation Brief` is structurally fine, but its current framing pushes too hard toward autonomy.

Recommended direction:

- rename it to something like `Samuel's Next Lead` or `Witness Trail Guide`
- keep the content compact
- focus it on one immediate action and one evidence target

### 3. Keep support, but narrow it

Do not return to full copy-paste answers, but also do not present the witness stage like a blank-page challenge.

Recommended support balance:

- keep the proven `ReportID` visible as the carried-forward clue
- explicitly point to `InterviewLog` as the next table
- explain that the student is looking for the interview row tied to the proven report
- explain that `PersonID` is the handoff value to the next lookup
- make it explicit that students should use `Log clue` on one strong witness row for each repeated `PersonID`
- avoid phrasing that suggests Samuel is stepping back

### 4. Reduce support-surface sprawl

The current witness stage likely does not need both:

- a post-report investigation panel
- a separate `Samuel's Case Briefing` panel repeating stable facts

Recommendation:

- keep the stable case-facts panel available but quieter
- prioritize one primary witness-stage guidance panel in Query Lab
- keep `Need Table Help?` available as optional support, not equal-weight primary content

### 5. Compress the witness evidence contract

Turn the witness evidence contract into a compact checklist with short labels instead of paragraph-style instructions.

Recommended checklist shape:

- `ReportID confirmed`
- `First witness bundle logged`
- `Second witness bundle logged`
- `Next lookup noted`

This keeps the contract useful while reducing reading overhead.

### 6. Review the role of Samuel Check-In

The comprehension check may still be valuable, but the next WP should assess whether it is helping at the witness stage or adding another block to read.

Recommendation:

- keep it if it reinforces the current clue cleanly
- simplify or defer it if it competes with the main next-step path

## Acceptance Criteria

- [ ] Post-report Student Mode no longer uses `Training wheels off` or equivalent support-withdrawal language.
- [ ] Samuel continues to guide the witness stage as an active mentor.
- [ ] Query Lab presents the witness step as a guided next lead, not a premature autonomy transition.
- [ ] The witness-stage panel clearly names the next table, the carried-forward clue, and the evidence target.
- [ ] The witness-stage flow explicitly tells students to use `Log clue` on strong rows from repeated `PersonID` witness bundles.
- [ ] The student does not need to scan multiple overlapping panels to understand the next move.
- [ ] The witness evidence contract becomes more compact and easier to scan.
- [ ] The witness trail does not advance until both witness bundles are logged and the student adds a short next-lookup notebook note.
- [ ] Stable case facts remain available without competing with the active witness-stage guidance.
- [ ] Witness names, witness addresses, gym lead details, and later clues remain hidden until earned.
- [ ] Existing milestone and lead gating behavior remains preserved.
- [ ] Tests verify the revised witness-stage guidance and the absence of autonomy framing.
- [ ] No unrelated files change.

## Codex Prompt

Implement WP-076.

Primary goal:
- Keep the student experience guided and simplified after the report row is proven.

Constraints:
- Do not extend the "training wheels off" direction.
- Do not expose later witness or suspect facts early.
- Preserve the current on-ramp and milestone gating behavior.
- Keep Samuel as the single mentor voice.
- Prefer simplification and consolidation over adding more guidance surfaces.

Implementation expectations:
- Remove autonomy-withdrawal framing from the post-report witness stage.
- Reframe the post-report panel into a guided next-step surface.
- Tighten and simplify witness-stage support content in Query Lab and Evidence Board.
- Reduce overlapping support copy where possible without removing needed guidance.
- Update tests.
- Run `npm run test --workspace apps/web`.
- Run `npx vite build` from `apps/web`.
- Remove generated Vite build outputs after verification.
- Update this work package with implementation results and verification.

Return:
- Exact code changes
- Short summary of what was implemented

## Gemini Audit Prompt

Audit WP-076 against the current Student Mode direction.

Verify:

- all acceptance criteria are satisfied
- no files outside the allowed list were modified
- the post-report witness stage no longer frames support as being removed
- Samuel remains the single mentor voice
- the next action is clearer and easier to find
- support surfaces are simplified instead of multiplied
- witness names, addresses, gym lead details, and later clues remain hidden until earned
- no regression was introduced in the opening on-ramp or milestone gating

Output:

- Verdict: PASS or FAIL
- Violations
- Regressions
- Drift risks

## Codex Results

Implemented WP-076.

Changes made:

- Replaced the post-report autonomy framing with guided witness-stage support.
- Removed `Training wheels off` and other support-withdrawal language from the witness-stage Query Lab flow.
- Renamed the post-report Query Lab panel from `Samuel's Investigation Brief` to `Samuel's Next Lead`.
- Reframed that panel around:
  - where to start
  - which proven value to carry forward
  - which relationship to follow next
  - what evidence can be logged
- Changed the post-report transition so Query Lab now reopens on a focused `SELECT * FROM CrimeSceneReport WHERE ReportID = 10975` review query with the proven single-row result restored.
- Added explicit mentor support that restates the earned witness clues from the report row:
  - last house on `Northwestern Dr`
  - `Annabel` on `Franklin Ave`
- Changed the witness-stage Query Runner guidance so it now tells students to:
  - sort `InterviewLog` rows by `PersonID`
  - use `Log clue` on one strong witness row for each repeated `PersonID`
  - let Samuel convert that row into a short notebook clue bundle
- Added witness-stage recovery guidance for failed queries so students are steered back to a simple `InterviewLog` query shape instead of jumping to `GROUP BY` or `JOIN`.
- Updated witness-stage notebook behavior so `Log clue` stores:
  - the witness `PersonID`
  - a short clue bundle summary built from matching witness-observation rows
- Changed witness-stage progression so the case does not advance until students have:
  - logged both repeated witness `PersonID` bundles
  - added one short notebook note stating that those `PersonID` values should drive the next person/address lookup
- Updated the post-report success feedback so Samuel directs students into `InterviewLog` instead of telling them to write the next query from an autonomy brief.
- Updated Samuel's mentor reaction after the report row is proven so he remains an active guide through the witness stage.
- Updated the `Witness Discovery` lead card so it reinforces guided follow-through rather than self-directed autonomy.
- Renamed `Need Table Help?` to `Quick Table Clues` and `Samuel's Case Briefing` to `Case Facts` so the support panels read as lighter secondary aids.
- Compressed the notebook witness-stage requirements into a `Witness Evidence Checklist` with short checklist labels:
  - `ReportID confirmed`
  - `First witness bundle logged`
  - `Second witness bundle logged`
  - `Next lookup noted`
- Adjusted styles so the witness guide reads more cleanly on mobile and the checklist items scan as compact cards instead of one larger instruction block.
- Updated app tests to verify:
  - the old autonomy framing is absent
  - the witness-stage panel uses the new guided-next-lead language
  - the support panel labels use the new quieter wording
  - the witness evidence checklist renders with the new compact labels

Verification:

- `npm run test --workspace apps/web` passed: 7 test files, 34 tests.
- `npm run build --workspace apps/web` remains blocked by the existing `vite.config.ts` typing issue:
  - `Object literal may only specify known properties, and 'test' does not exist in type 'UserConfigExport'`
- That build issue predates WP-076 and remains outside this work package scope.

## Gemini Audit Results

## Verdict
PASS

## Final Decision

Approved. Audit passed, scope stayed within the work package, and WP-076 is accepted for commit and push.

