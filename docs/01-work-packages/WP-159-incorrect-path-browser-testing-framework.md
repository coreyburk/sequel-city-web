# WP-159: Incorrect-Path Browser Testing Framework

**Status:** Accepted
**Owner:** Codex
**Created:** 2026-07-03

## Objective

Create a reusable browser-test framework for validating incorrect-path, outlier-choice, and lost-input behavior in Student Mode, then use it to protect the Case 004 progression flow against realistic student mistakes before correct answers are entered.

## Scope

### In Scope

- extract reusable Playwright helpers for incorrect-path browser testing
- support varied incorrect SQL attempts before the correct progression query
- handle both API-rejected SQL and client-side blocked SQL without treating either recovery path as a false failure
- support incorrect suspect-theory submissions before correct suspect confirmation
- support wrong mouse-click paths such as locked case entry, mode detours, evidence-board detours, and wrong Samuel check-in choices
- add lost-input coverage for query drafts across navigation
- add a Case 004 regression spec that uses the reusable outlier harness
- document the rationale for `3`, `5`, and `7` incorrect-attempt budgets

### Out of Scope

- changing Student Mode product behavior
- changing Case 004 clue, suspect, mastermind, or endgame progression logic
- changing API routes, database fixtures, SQL safety rules, or answer-key behavior
- adding unseeded randomization to regression tests
- modifying `.understand-anything/**`
- cleaning up unrelated generated assets or temporary files already present in the worktree

## Impact Analysis

### Understand Status

- Graph available: Yes
- Baseline commit: not regenerated for this retroactive test-framework package
- Freshness assessment: usable for broad orientation, but source inspection was authoritative
- Analysis performed: direct source review of the existing browser harness, Student Mode browser specs, deterministic API mocks, and Case 004 progression helpers.

### Affected Architecture

- Layers:
  - frontend browser automation
  - Student Mode regression coverage
  - Case 004 outlier-path validation
- Primary files/components:
  - `apps/web/tests/browser/studentOutlierHarness.ts`
  - `apps/web/tests/browser/outlier-user-path.spec.ts`
- Upstream consumers:
  - `npm run test:browser --workspace apps/web`
  - future Student Mode browser regression specs
- Downstream dependencies:
  - existing `studentModeHarness.ts` query/clue helpers
  - existing `studentModeApi.ts` deterministic browser fixtures

### Regression Surface

- Related tests:
  - `npm run test:browser --workspace apps/web -- outlier-user-path.spec.ts`
  - `npm run test --workspace apps/web`
  - `npm run build --workspace apps/web`
- User workflows:
  - opening locked cases by mistake
  - switching modes accidentally and returning to Student Mode
  - visiting Evidence Board before useful evidence exists
  - entering plausible but wrong SQL
  - navigating away after drafting SQL
  - trying wrong suspect theories before the correct suspect
  - recovering after wrong mastermind choices
- Security/data boundaries:
  - no backend or database changes
  - no answer-table exposure changes
  - no changes to SQL safety enforcement

### Graph Update Decision

- Regeneration required: No
- Rationale: This is a frontend browser-test harness and regression-spec change. It does not alter runtime architecture or production behavior, and current `.understand-anything/**` changes in the worktree are unrelated and intentionally excluded.

## Files Allowed to Change

Allowed:

- `apps/web/tests/browser/studentOutlierHarness.ts`
- `apps/web/tests/browser/outlier-user-path.spec.ts`
- `docs/01-work-packages/WP-159-incorrect-path-browser-testing-framework.md`

Do Not Modify:

- `apps/web/src/**`
- `apps/api/**`
- `database/**`
- `docs/00-ssot/**`
- `.understand-anything/**`
- existing deterministic browser API fixtures unless a follow-up package explicitly scopes fixture expansion

## Constraints

- Incorrect SQL attempts must be varied and deterministic.
- The default incorrect-attempt floor should be `3`, with explicit constants available for `5` and `7` when a scenario needs extended or stress coverage.
- Regression tests must not use unseeded randomization.
- Client-side blocked SQL and API-rejected SQL are both valid incorrect-path outcomes if the UI recovers and the correct path can continue.
- Incorrect theory attempts may repeat when the UI exposes only a constrained set of wrong choices.
- The framework should not hide product regressions by force-clicking through disabled or intentionally blocked controls.

## Required Behavior

- Browser specs can call a shared helper to run incorrect SQL attempts before a correct query.
- The helper verifies the incorrect-attempt budget and requires distinct SQL mistakes.
- Browser specs can submit wrong theory choices, verify they do not confirm the target role, and continue navigation afterward.
- Browser specs can validate wrong check-in choices produce coaching feedback.
- Browser specs can validate that a drafted query survives navigation away from and back to Query Lab.
- Case 004 can be completed after repeated incorrect SQL, wrong theory choices, and wrong mouse-click detours.

## Acceptance Criteria

- [x] A reusable browser outlier harness exists.
- [x] The harness exposes configurable incorrect-attempt budgets for `3`, `5`, and `7`.
- [x] The harness distinguishes deterministic varied SQL mistakes from repeated wrong theory choices caused by constrained UI choices.
- [x] The harness supports API-rejected and client-blocked SQL recovery paths.
- [x] The Case 004 outlier spec uses the shared harness instead of local one-off helpers.
- [x] The Case 004 outlier spec verifies lost query draft input across navigation.
- [x] Focused Playwright coverage passes.
- [x] Web unit tests pass.
- [x] Web build passes.

## Code Prompt

Retroactive implementation record for the accepted work:

1. Extract the incorrect-path Playwright helpers into a reusable browser harness.
2. Keep the default incorrect-attempt floor at `3`, but expose `5` and `7` constants for explicit extended/stress scenarios.
3. Require distinct SQL mistakes for query-path tests.
4. Allow repeated wrong theory choices when the UI exposes a constrained answer set.
5. Treat client-blocked incorrect SQL and API-rejected incorrect SQL as valid recovery paths when the UI remains usable.
6. Update the Case 004 outlier spec to use the shared harness.
7. Add lost-input coverage for query drafts across navigation.
8. Run focused browser coverage, unit tests, and build verification.

## Audit Prompt

Audit the incorrect-path browser testing framework for future usability and scope discipline.

Verify:

1. The harness is reusable from future Playwright specs.
2. Incorrect SQL attempts are deterministic and varied.
3. The default attempt floor is not hard-coded as the only valid count.
4. Randomization is not used in a way that would create flaky regressions.
5. The Case 004 spec validates recovery after wrong SQL, wrong clicks, wrong theory choices, and lost-input risk.
6. No production source, API, database, or `.understand-anything` files changed.

Output:
- Verdict: PASS or FAIL
- Scope violations
- Reuse risks
- Remaining coverage gaps

## Code Results

Implemented.

- Added `apps/web/tests/browser/studentOutlierHarness.ts` with reusable helpers for:
  - incorrect SQL before correct SQL
  - configurable attempt budgets
  - incorrect theory submission
  - wrong Samuel check-in choices
  - query draft preservation across navigation
- Added explicit attempt-count constants:
  - `DEFAULT_INCORRECT_ATTEMPT_FLOOR = 3`
  - `EXTENDED_INCORRECT_ATTEMPT_COUNT = 5`
  - `STRESS_INCORRECT_ATTEMPT_COUNT = 7`
- Required distinct SQL mistakes in query-path testing so repeated identical bad SQL does not masquerade as meaningful coverage.
- Allowed repeated wrong theory attempts because the first suspect and mastermind panels can expose a constrained set of wrong UI choices.
- Updated the outlier regression spec to use the shared harness.
- Expanded the Case 004 browser outlier path to cover:
  - locked-case click recovery
  - Admin Mode detour and return
  - early Evidence Board detour
  - draft query preservation across navigation
  - varied wrong SQL before each correct progression query
  - wrong Samuel check-in choices
  - wrong first-suspect choices before `Jeremy Bowers`
  - wrong mastermind choices before `Miranda Priestly`
  - final case close after incorrect-path recovery

Validation:

- `npm run test:browser --workspace apps/web -- outlier-user-path.spec.ts`
- `npm run test --workspace apps/web`
- `npm run build --workspace apps/web`

## Audit Results

PASS

- Reuse: PASS. Incorrect-path primitives now live in a shared browser harness instead of a one-off spec.
- Attempt-count policy: PASS. `3` is a configurable default floor, with `5` and `7` available for explicit higher-pressure scenarios.
- Determinism: PASS. The regression path uses fixed, varied inputs and avoids unseeded randomness.
- Incorrect SQL coverage: PASS. The harness accepts both API-rejected and client-blocked SQL paths as long as the UI recovers.
- Incorrect theory coverage: PASS. Wrong theory attempts are verified through the controlled verification response and unchanged confirmation state.
- Lost-input coverage: PASS. The outlier spec now verifies that a drafted query survives navigation away from and back to Query Lab.
- Scope compliance: PASS. Changes are limited to browser tests and this work package document.
- Remaining gap: future specs can add seeded variation or explicit `5`/`7` stress paths for high-risk screens, but the baseline framework is in place.

## Final Decision

Accepted.

- WP-159 is accepted as the baseline framework for future incorrect-path and lost-input browser testing.
- Use `3` as the default minimum incorrect-attempt floor for regression coverage.
- Use `5` or `7` only when a scenario has enough distinct meaningful mistakes to justify extended or stress coverage.
- Do not use unseeded random behavior in normal regression tests.
