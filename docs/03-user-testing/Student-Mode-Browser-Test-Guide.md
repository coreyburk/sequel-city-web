# Student Mode Browser Test Guide

## Purpose

This guide explains how to run the repo-owned browser automation suite for Student Mode and what the suite is intended to protect.

Use it when validating live Student Mode behavior that cannot be trusted to `jsdom` tests alone, especially for multi-step Query Lab, Case File, Evidence Board, and scene-state regressions.

## What This Suite Covers

The WP-138 browser suite focuses on high-value Student Mode behaviors:

- scene art stays stable while students draft SQL and only shifts when real progression occurs
- `Case File` stays open while students interact inside the drawer and closes again when they click back into the main work area
- repeated mastermind transcript clue logging does not force a rerun of the same query
- late-stage mastermind flow advances from shortlist to identity lookup to event-trail guidance in a real browser

The suite supplements existing Vitest coverage. It does not replace state-level unit and integration tests.

## Default Run Command

From the repository root:

```powershell
npm run test:browser --workspace apps/web
```

To watch the browser while the suite runs:

```powershell
npm run test:browser:headed --workspace apps/web
```

## Browser Channel

The Playwright config defaults to:

- `msedge` on Windows
- `chrome` on non-Windows systems

Override the browser channel if needed:

```powershell
$env:PLAYWRIGHT_BROWSER_CHANNEL = "chrome"
npm run test:browser --workspace apps/web
```

If a machine does not have the chosen system browser available, install a supported local browser first or adjust the channel before running the suite.

## Test Environment Model

The suite launches the local Vite frontend and intercepts Student Mode API calls with deterministic browser-test fixtures.

That means:

- the suite does not require a live classroom database
- browser assertions still run against the real frontend UI
- student progression remains stable and repeatable from one run to the next

## Failure Artifacts

Playwright is configured to retain failure diagnostics:

- screenshots on failure
- traces on failure
- videos on failure

Use those artifacts to inspect which UI state or interaction broke before drafting a follow-up work package.

## When To Use This Suite

Run the browser suite when:

- changing Student Mode guidance or progression handoffs
- modifying `QueryRunner`, `StudentWorkbenchView`, or `StudentEvidenceBoardView`
- changing pinned-fact insertion, clue logging, or Case File drawer behavior
- auditing whether a UI/UX regression fix actually holds in a live browser

## Relationship To Manual Walkthroughs

Use [Student-Mode-UI-UX-Walkthrough-Checklist.md](/D:/GitHub-Repos/SequelCityWeb/docs/03-user-testing/Student-Mode-UI-UX-Walkthrough-Checklist.md) for exploratory review and broader experience observation.

Use the browser suite when you need deterministic live-browser regression protection for known Student Mode behaviors.
