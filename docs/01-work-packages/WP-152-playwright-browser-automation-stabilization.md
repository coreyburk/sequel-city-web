# WP-152: Playwright Browser Automation Stabilization

**Status:** Accepted
**Owner:** Codex
**Created:** 2026-06-30

## Objective

Restore reliable local Playwright browser-test execution for `apps/web` so the suite reaches product assertions without requiring optional video tooling.

## Scope

### In Scope

- remove or gate browser-test configuration that currently forces optional video capture
- preserve the repo-owned Playwright launch workflow and local Vite orchestration
- keep the default browser test path runnable in both normal and headed modes on the current local machine setup
- document implementation, verification, and audit results in this work package

### Out of Scope

- changing Student Mode product behavior
- redesigning or rewriting the browser test scenarios
- adding new frontend features or Case 004 progression changes
- changing API behavior, database assets, or SQL fixtures
- installing global tools or requiring machine-specific manual steps as the primary fix
- broad Playwright harness refactors beyond what is needed to make the suite runnable again

## Impact Analysis

### Understand Status
- Graph available: Yes
- Baseline commit: `834216bd32ffb567db572e725908d2e54c795e9d`
- Freshness assessment: `Structurally stale; regenerate before relying on scope`
- Analysis performed: Recommended-tier browser-harness analysis. The graph still identifies the relevant browser automation surfaces (`apps/web/playwright.config.ts`, `apps/web/tests/browser/run-playwright.mjs`, `apps/web/tests/browser/student-mode.spec.ts`), but the baseline predates recent Student Mode and browser-test changes. Source inspection and the current handoff are authoritative for scope. The immediate observed blocker is `video: "on"` in `apps/web/playwright.config.ts`, which can force an ffmpeg dependency before the suite reaches app assertions.

### Affected Architecture
- Layers: frontend test harness; browser automation workflow
- Primary files/components:
  - `apps/web/playwright.config.ts`
  - `apps/web/tests/browser/run-playwright.mjs`
  - optionally `apps/web/package.json` if a script adjustment is needed
- Upstream consumers:
  - `npm run test:browser --workspace apps/web`
  - `npm run test:browser:headed --workspace apps/web`
  - faculty demo-readiness verification flow
- Downstream dependencies:
  - `apps/web/tests/browser/student-mode.spec.ts`
  - local Vite server startup for browser tests
  - Playwright runtime configuration on Windows

### Regression Surface
- Related tests:
  - `npm run test:browser --workspace apps/web`
  - `npm run test:browser:headed --workspace apps/web`
  - optionally `npm run test --workspace apps/web` if harness-facing UI selectors need validation
- User workflows:
  - automated Student Mode walkthrough validation
  - demo-readiness regression checks before faculty presentation
- Security/data boundaries:
  - no API, database, answer-key, or restricted-table policy changes
  - no Student Mode clue or progression logic changes unless a true browser-test defect requires a separately scoped follow-up

### Graph Update Decision
- Regeneration required: No
- Rationale: This task should stay inside test-harness configuration and launch scripts. It is not intended to change source architecture or product behavior.

## Files Allowed to Change

Allowed:

- `apps/web/playwright.config.ts`
- `apps/web/tests/browser/run-playwright.mjs`
- `apps/web/package.json`
- `docs/01-work-packages/WP-152-playwright-browser-automation-stabilization.md`

Do Not Modify:

- `apps/web/src/**`
- `apps/web/tests/browser/student-mode.spec.ts`
- `apps/api/**`
- `database/**`
- `docs/00-ssot/**`
- `package-lock.json` unless a dependency change is explicitly approved in a follow-up WP

## Constraints

- Preserve current browser test intent and scenario coverage.
- Prefer configuration changes over dependency installation.
- Do not make ffmpeg/video capture a default requirement for routine browser verification.
- If optional artifact capture is preserved, it must be opt-in rather than mandatory.
- Do not change product code just to accommodate a test-environment issue.
- Keep the fix compatible with the current Windows local workflow used by this repository.

## Required Behavior

- Default `npm run test:browser --workspace apps/web` runs without depending on always-on video capture.
- Default browser tests reach product assertions instead of failing during Playwright startup due to missing ffmpeg/video tooling.
- Headed browser execution remains available for walkthrough/debug runs.
- Any retained trace, screenshot, or video behavior is clearly scoped so normal regression runs do not require optional binaries.
- The repo-owned local server orchestration remains intact.

## Acceptance Criteria

- [x] `npm run test:browser --workspace apps/web` reaches product assertions on the current machine setup.
- [x] If the suite fails, the remaining failure is a real product or test issue rather than missing ffmpeg/video prerequisites.
- [x] `npm run test:browser:headed --workspace apps/web` remains available.
- [x] No frontend product files under `apps/web/src/**` are modified.
- [x] No API, database, SSOT, or unrelated browser-test files are modified.
- [x] Code Results, Audit Results, and Final Decision are updated after implementation.

## Code Prompt

Implement WP-152 as a narrow Playwright harness stabilization.

1. Remove or gate the always-on video requirement in the Playwright configuration so normal browser test runs do not depend on ffmpeg being installed locally.
2. Preserve the existing repo-owned launch flow in `run-playwright.mjs` unless a small script adjustment is required for stability.
3. Keep headed execution available for manual walkthroughs and debugging.
4. Do not modify Student Mode product code or browser scenario coverage unless a separate, clearly identified product defect blocks the suite after startup.
5. Run:
   - `npm run test:browser --workspace apps/web`
   - optionally `npm run test:browser:headed --workspace apps/web` if practical on this machine
6. Update Code Results, Audit Results, and Final Decision.

## Audit Prompt

Audit WP-152 for browser-harness scope compliance and demo-readiness value.

Verify:

1. The Playwright startup path no longer requires always-on video capture for default runs.
2. Default browser tests now reach product assertions or fail only on actual product/test issues.
3. Headed execution remains available.
4. No product files under `apps/web/src/**` changed.
5. No API, database, SSOT, or unrelated files changed.
6. The work package stayed focused on harness/config stabilization.

Output:
- Verdict: PASS or FAIL
- Scope violations
- Remaining environment blockers
- Regression risks

## Code Results

Implemented.

- Updated `apps/web/playwright.config.ts` so video capture is no longer mandatory for routine browser runs.
- Preserved the existing browser channel, local base URL, and repo-owned Playwright launcher flow.
- Made video opt-in through `PLAYWRIGHT_VIDEO=on`.
- Kept traces and screenshots available without forcing ffmpeg:
  - trace defaults to `retain-on-failure`
  - screenshot defaults to `only-on-failure`
  - both remain overridable through environment variables

Verification:

- `npm run test:browser --workspace apps/web`
  - Result: passed
  - Detail: `5 passed, 1 skipped`
- `npm run test:browser:headed --workspace apps/web`
  - Result: passed
  - Detail: `5 passed, 1 skipped`

Notes:

- No changes were required in `run-playwright.mjs`, `package.json`, browser specs, or product code.
- The remaining skipped browser test is an existing intentional skip, not a startup/tooling blocker.

## Audit Results

Self-audit completed.

- Verdict: PASS
- Scope compliance: PASS. Changes are limited to `apps/web/playwright.config.ts` and this work package document.
- Harness stabilization: PASS. Default browser runs no longer depend on always-on video capture or local ffmpeg availability.
- Headed-path preservation: PASS. Headed Playwright execution still works through the existing script.
- Regression risk: Low. The change narrows artifact capture defaults but preserves opt-in video and failure-focused traces/screenshots.
- Remaining environment blockers: None observed for the browser suite on this machine after the configuration change.

## Final Decision

Accepted.

- Keep Playwright video capture opt-in instead of mandatory.
- Preserve the existing repo-owned browser harness and headed walkthrough path.
- Treat any future browser failures as product/test regressions unless a new environment issue is independently observed.
