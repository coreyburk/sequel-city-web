# WP-155: Sequel Detective Visible Naming Pass

**Status:** Accepted
**Owner:** Codex
**Created:** 2026-06-30

## Objective

Replace the remaining faculty-facing product-name copy that still leads with `Sequel City` or `Case Files`, while preserving `Sequel City` as the fictional case setting.

## Scope

### In Scope

- update the visible application title to `Sequel Detective`
- update visible setup-guidance copy that refers to the product by the old name
- update automated tests and browser harness expectations that assert the changed visible text
- document implementation, verification, and audit results in this work package

### Out of Scope

- renaming the repository, packages, or code identifiers
- changing fictional setting text such as `Sequel City` within case content
- rewriting guided case copy beyond the narrow product-name correction
- changing gameplay, progression, or backend behavior
- broad marketing or presentation copy expansion

## Impact Analysis

### Understand Status
- Graph available: Yes
- Baseline commit: `834216bd32ffb567db572e725908d2e54c795e9d`
- Freshness assessment: `Usable with non-structural drift`
- Analysis performed: Optional-tier visible-copy analysis verified directly against current source. Remaining faculty-facing naming drift is confined to `App.tsx`, `HealthStatus.tsx`, and the corresponding tests/browser harness. `studentCase.ts` strings describing murders in Sequel City are case-setting text and remain in scope as read-only references.

### Affected Architecture
- Layers: frontend presentation; frontend test expectations
- Primary files/components:
  - `apps/web/src/App.tsx`
  - `apps/web/src/components/HealthStatus.tsx`
  - `apps/web/src/App.test.tsx`
  - `apps/web/src/components/HealthStatus.test.tsx`
  - `apps/web/tests/browser/studentModeHarness.ts`
- Upstream consumers:
  - faculty-facing app shell
  - Admin Mode setup guidance
  - browser and unit test expectations
- Downstream dependencies:
  - Student Mode startup assertion in browser tests
  - visible first-run guidance copy

### Regression Surface
- Related tests:
  - `npm run test --workspace apps/web`
  - `npm run test:browser --workspace apps/web`
- User workflows:
  - opening the app in Student Mode
  - reading the title/header
  - seeing Admin Mode classroom setup guidance
- Security/data boundaries:
  - no SQL safety, answer-key, database, or progression changes

### Graph Update Decision
- Regeneration required: No
- Rationale: The task is a narrow visible-copy correction and test-alignment pass only.

## Files Allowed to Change

Allowed:

- `apps/web/src/App.tsx`
- `apps/web/src/components/HealthStatus.tsx`
- `apps/web/src/App.test.tsx`
- `apps/web/src/components/HealthStatus.test.tsx`
- `apps/web/tests/browser/studentModeHarness.ts`
- `docs/01-work-packages/WP-155-sequel-detective-visible-naming-pass.md`

Do Not Modify:

- `apps/web/src/studentCase.ts`
- `apps/api/**`
- `database/**`
- `docs/00-ssot/**`
- `apps/web/tests/browser/student-mode.spec.ts`
- any other work-package documents

## Constraints

- Keep `Sequel City` as the fictional setting for the case itself.
- Only replace product-name copy that is clearly faculty-facing or app-brand-facing.
- Do not broaden the change into a repo or package rename.
- Keep test coverage proportional to the visible-copy surface changed.

## Required Behavior

- The main app title should present `Sequel Detective`.
- Setup guidance that previously referred to the product as `Sequel City` should use the product name instead.
- Fictional setting references such as murders happening in `Sequel City` should remain unchanged.
- Browser and unit tests should assert the updated visible branding.

## Acceptance Criteria

- [x] The visible app title is updated to `Sequel Detective`.
- [x] Product-facing setup guidance uses `Sequel Detective` rather than `Sequel City`.
- [x] Fictional setting references in case content remain unchanged.
- [x] Web unit tests pass.
- [x] Browser checks still pass or the remaining failure is unrelated to the naming change.
- [x] No API, database, or unrelated frontend behavior changes are introduced.
- [x] Code Results, Audit Results, and Final Decision are updated.

## Code Prompt

Implement WP-155 as a narrow visible-branding correction.

1. Update the app shell title to `Sequel Detective`.
2. Update any clearly product-facing setup guidance that still names the product as `Sequel City`.
3. Leave `Sequel City` case-setting text untouched.
4. Update only the tests and browser harness expectations required by the changed visible text.
5. Run:
   - `npm run test --workspace apps/web`
   - `npm run test:browser --workspace apps/web`
6. Update Code Results, Audit Results, and Final Decision.

## Audit Prompt

Audit WP-155 for scope control and visible-brand correctness.

Verify:

1. Product-facing branding now leads with `Sequel Detective`.
2. Fictional setting references to `Sequel City` remain where they are part of case content.
3. No unintended gameplay or backend changes occurred.
4. Tests were updated only where the visible text changed.
5. No files outside the allowed set were modified.

Output:
- Verdict: PASS or FAIL
- Scope violations
- Remaining naming drift
- Regression risks

## Code Results

Implemented.

- Updated the visible app-shell title in `apps/web/src/App.tsx` from `Sequel City Case Files` to `Sequel Detective`.
- Updated product-facing Admin Mode setup guidance in `apps/web/src/components/HealthStatus.tsx` so it now refers to `Sequel Detective` rather than `Sequel City`.
- Left `Sequel City` fictional setting references untouched in `studentCase.ts` and other case-content surfaces.
- Updated the affected unit-test assertions and browser harness heading expectation only where the visible text changed.

Verification:

- `npm run test --workspace apps/web`
  - Result: passed
  - Detail: `174 passed`
- `npm run test:browser --workspace apps/web`
  - Result: passed
  - Detail: `5 passed, 1 skipped`

## Audit Results

Self-audit completed.

- Verdict: PASS
- Scope compliance: PASS. Changes are limited to the allowed frontend visible-copy surfaces, the corresponding tests/browser harness expectation, and this work package.
- Branding correctness: PASS. Product-facing copy now leads with `Sequel Detective`, while fictional setting references to `Sequel City` remain in case content.
- Regression risk: Low. Browser and unit verification both passed after the copy update.
- Remaining naming drift: None found in the currently scoped faculty-facing frontend surfaces.

## Final Decision

Accepted.

- Keep `Sequel Detective` as the visible product name in the app shell and product-facing setup guidance.
- Preserve `Sequel City` as the fictional case setting.
- Proceed to the next demo-readiness task without opening a corrective WP for this naming pass.
