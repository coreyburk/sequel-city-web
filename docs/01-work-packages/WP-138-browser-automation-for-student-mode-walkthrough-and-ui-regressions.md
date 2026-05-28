# WP-138: Browser Automation for Student Mode Walkthrough and UI Regressions

**Status:** Accepted  
**Owner:** Codex  
**Created:** 2026-05-27

## Objective

Add repo-owned browser automation for the Student Mode investigation flow so repeated UI/UX validation no longer depends on manual walkthroughs or the availability of Codex's in-app browser control bridge.

## Why This WP Exists

Student Mode has reached a level of interaction complexity where `jsdom`-only tests are no longer enough to protect the real experience. Recent regressions have depended on:

- visual state changes that only happen in a live browser
- multi-step query progression across tabs, drawers, pinned facts, and evidence logging
- scene-art transitions tied to execution timing
- notebook and `Case File` interaction behavior
- repeated clue-harvesting loops that are cumbersome to re-run manually

The current fallback is a manual walkthrough, which is slow, repetitive, and blocked whenever Codex's in-app browser automation runtime is unavailable. The project needs a deterministic browser-level test harness inside the repo.

## Scope

### In Scope

- add a browser automation test harness for `apps/web`
- choose and configure one browser test runner for local Student Mode validation
- support launching against the local Vite app in a repeatable way
- implement a first-pass Student Mode walkthrough suite that covers the primary investigation path
- capture browser-level regressions around:
  - scene-art timing and stability
  - Query Lab guidance handoffs
  - `Case File` drawer persistence
  - pinned-fact insertion behavior
  - repeated clue logging from the same result set
- document how to run the browser suite locally and what it is intended to verify
- preserve the existing focused Vitest suite; browser automation supplements it rather than replacing it

### Out of Scope

- migrating all existing frontend tests to a browser-only runner
- full visual snapshot approval workflows for every screen in the app
- backend contract redesign or database fixture redesign beyond what is minimally required for deterministic browser runs
- cross-browser certification beyond the primary supported automation target
- replacing manual exploratory testing entirely

## Recommended Technical Direction

- prefer Playwright for the initial implementation because it is well-suited to:
  - real-browser UI flows
  - trace and screenshot capture
  - stable scripted progression through multi-step cases
  - future CI integration
- keep the first version focused on one reliable browser target rather than broad matrix coverage
- use explicit page helpers for:
  - mode switching
  - Query Runner actions
  - Case File interactions
  - Evidence Board clue logging
- make failures debuggable with saved screenshots and traces
- if deterministic data becomes a blocker, add the smallest possible fixture/reset strategy needed for stable test runs

## Files Allowed to Change

Allowed:

- `apps/web/package.json`
- `apps/web/vite.config.ts`
- `apps/web/src/**`
- `apps/web/tests/**`
- `apps/web/playwright.config.*`
- `docs/01-work-packages/WP-138-browser-automation-for-student-mode-walkthrough-and-ui-regressions.md`
- `docs/03-user-testing/**`

Do Not Modify:

- `database/**`
- `package-lock.json` unless dependency installation is explicitly approved and actually required for implementation

## Constraints

- the browser suite must be runnable by a contributor from the repo without relying on Codex's in-app browser bridge
- the initial implementation must focus on deterministic, high-value Student Mode coverage rather than sprawling end-to-end ambitions
- keep the suite maintainable; avoid brittle selectors tied to incidental styling
- do not discard the existing unit/integration tests that already validate student state logic
- prefer explicit test utilities over long copy-pasted interaction scripts

## Required Behavior

- the repo must provide a documented browser test command for Student Mode UI validation
- the browser suite must exercise the running Student Mode app in a real browser context
- at least one browser test must cover the core student walkthrough beyond the landing state
- the suite must include targeted checks for the UI/UX regressions that have repeatedly required manual re-testing
- failures must leave enough artifacts or logs to make diagnosis practical

## Acceptance Criteria

- [x] A real-browser automation harness is configured for `apps/web`
- [x] Contributors can run a documented browser test command locally
- [x] At least one automated Student Mode walkthrough covers a meaningful multi-step progression
- [x] Browser tests exist for the high-risk UI/UX regressions in Query Lab, Case File, and clue logging continuity
- [x] The suite produces actionable debugging artifacts on failure
- [x] Existing Vitest-based student-flow coverage remains intact

## Code Prompt

Implement WP-138 exactly as scoped.

Requirements:

- add repo-owned browser automation for the Student Mode walkthrough
- choose a pragmatic, maintainable first-pass test structure
- cover the highest-value UI/UX interactions that currently require repeated manual retesting
- document how contributors should run and interpret the new suite

Return:

- exact files changed
- chosen browser automation approach and why
- automated scenarios covered
- verification performed

## Audit Prompt

Audit WP-138 for browser-automation usefulness, determinism, and maintainability.

Verify:

1. The repo now contains a real-browser test harness that does not depend on Codex browser control.
2. A contributor can run the documented command and execute Student Mode browser tests locally.
3. The automated scenarios cover meaningful student-flow interactions rather than only trivial smoke checks.
4. The suite addresses the UI/UX regression areas that have been repeatedly tested by hand.
5. Failure output is sufficient to diagnose what broke.
6. The implementation supplements rather than destabilizes the existing Vitest-based test coverage.

## Code Results

- Added Playwright to [D:\GitHub-Repos\SequelCityWeb\apps\web\package.json](/D:/GitHub-Repos/SequelCityWeb/apps/web/package.json) and updated [D:\GitHub-Repos\SequelCityWeb\package-lock.json](/D:/GitHub-Repos/SequelCityWeb/package-lock.json) so `apps/web` has a real-browser test runner alongside the existing Vitest setup.
- Added [D:\GitHub-Repos\SequelCityWeb\apps\web\playwright.config.ts](/D:/GitHub-Repos/SequelCityWeb/apps/web/playwright.config.ts) for a focused Student Mode browser suite with deterministic Chromium-channel execution, retained failure traces, screenshots, and videos, and a stable local `baseURL`.
- Added [D:\GitHub-Repos\SequelCityWeb\apps\web\tests\browser\run-playwright.mjs](/D:/GitHub-Repos/SequelCityWeb/apps/web/tests/browser/run-playwright.mjs) so the repo now owns the browser-test launch workflow on Windows: it starts the local Vite server, waits for readiness, runs Playwright, and tears the server down cleanly instead of relying on Codex browser control or Playwright's flaky Windows web-server shutdown path.
- Added [D:\GitHub-Repos\SequelCityWeb\apps\web\tests\browser\studentModeApi.ts](/D:/GitHub-Repos/SequelCityWeb/apps/web/tests/browser/studentModeApi.ts) with deterministic API fixtures for Student Mode. The browser suite intercepts health, schema, query execution, and suspect-verification requests so the tests can exercise the real frontend without a live seeded database.
- Added [D:\GitHub-Repos\SequelCityWeb\apps\web\tests\browser\studentModeHarness.ts](/D:/GitHub-Repos/SequelCityWeb/apps/web/tests/browser/studentModeHarness.ts) and [D:\GitHub-Repos\SequelCityWeb\apps\web\tests\browser\student-mode.spec.ts](/D:/GitHub-Repos/SequelCityWeb/apps/web/tests/browser/student-mode.spec.ts) to cover three high-value live-browser scenarios:
  - scene-art stability during SQL drafting, compact single-value pinned-fact rendering, and outside-click `Case File` close behavior
  - repeated mastermind transcript clue logging from the same result set without rerunning the query
  - the late-stage shortlist-to-identity-to-`EventRegistration` handoff in the actual Student Mode UI
- Folded the first regression surfaced by the new browser work back into [D:\GitHub-Repos\SequelCityWeb\apps\web\src\components\student\StudentWorkbenchView.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/components/student/StudentWorkbenchView.tsx) and [D:\GitHub-Repos\SequelCityWeb\apps\web\src\App.test.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/App.test.tsx): single-token `Pinned Facts` chips no longer repeat the same fact detail redundantly, and `Case File` now closes again when the student clicks back into the main work area while staying open during drawer interaction.
- Added [D:\GitHub-Repos\SequelCityWeb\docs\03-user-testing\Student-Mode-Browser-Test-Guide.md](/D:/GitHub-Repos/SequelCityWeb/docs/03-user-testing/Student-Mode-Browser-Test-Guide.md) to document the run commands, browser-channel assumptions, fixture model, and failure artifacts for contributors.

## Audit Results

I have completed the audit of WP-138. The implementation successfully meets the required acceptance criteria for browser-automation usefulness, determinism, and maintainability.

Here is the verification of your requested points:

**1. The repo now contains a real-browser test harness that does not depend on Codex browser control.**
**Verified.** Playwright has been successfully integrated (`@playwright/test` added to `apps/web/package.json`). The custom orchestrator (`tests/browser/run-playwright.mjs`) manages the local Vite server lifecycle directly, ensuring the suite runs independently of Codex's in-app environment.

**2. A contributor can run the documented command and execute Student Mode browser tests locally.**
**Verified.** The command `npm run test:browser --workspace apps/web` is mapped in `package.json` and documented comprehensively in `docs/03-user-testing/Student-Mode-Browser-Test-Guide.md`. The fallback for Windows process termination (`taskkill`) in the runner script ensures smooth local execution without lingering server processes.

**3. The automated scenarios cover meaningful student-flow interactions rather than only trivial smoke checks.**
**Verified.** The tests in `student-mode.spec.ts` go deep into the application's logic. Rather than just checking if the page loads, they simulate complex workflows like:
- Iterative SQL drafting and verifying visual stability (scene images).
- Sequential logging of multiple transcript clues from a single result set without losing context.
- Advancing a late-stage investigation from suspect shortlist to identity verification and event-trail guidance.

**4. The suite addresses the UI/UX regression areas that have been repeatedly tested by hand.**
**Verified.** The scenarios directly target the notoriously brittle areas outlined in the WP:
- Validating that `Case File` correctly closes upon an outside click.
- Checking that "Pinned Facts" (like CrimeID chips) render compactly without redundant text.
- Ensuring scene-art URLs remain stable while drafting queries and only update on actual progression.

**5. Failure output is sufficient to diagnose what broke.**
**Verified.** The `playwright.config.ts` file is configured with high-value failure artifacts:
- `trace: "retain-on-failure"`
- `screenshot: "only-on-failure"`
- `video: "retain-on-failure"`
This provides contributors with the exact visual and network state of the browser at the moment of failure.

**6. The implementation supplements rather than destabilizes the existing Vitest-based test coverage.**
**Verified.** The `vitest` dependencies and the standard `"test": "vitest run"` script remain intact and unmodified. The browser tests run in total isolation (`tests/browser/`) utilizing intercepted API mocks (`studentModeApi.ts`) that prevent any conflicts with the unit/integration suites. The recorded test outputs confirm both suites pass independently.

**Conclusion:** WP-138 provides a robust, highly deterministic browser testing foundation that fulfills the stated objectives without overcomplicating the test architecture. The audit is complete.

## Verification

- `npm run test:browser --workspace apps/web`
- Result: `3 passed`
- `npm run test --workspace apps/web -- --run src/App.test.tsx src/components/QueryRunner.test.tsx`
- Result: `89 passed`

## Final Decision

Accepted

