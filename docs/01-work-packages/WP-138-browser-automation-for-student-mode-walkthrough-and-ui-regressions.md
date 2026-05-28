# WP-138: Browser Automation for Student Mode Walkthrough and UI Regressions

**Status:** Planned  
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

- [ ] A real-browser automation harness is configured for `apps/web`
- [ ] Contributors can run a documented browser test command locally
- [ ] At least one automated Student Mode walkthrough covers a meaningful multi-step progression
- [ ] Browser tests exist for the high-risk UI/UX regressions in Query Lab, Case File, and clue logging continuity
- [ ] The suite produces actionable debugging artifacts on failure
- [ ] Existing Vitest-based student-flow coverage remains intact

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

Pending implementation.

## Audit Results

Pending audit.

## Verification

Pending implementation.

## Final Decision

Pending implementation.
