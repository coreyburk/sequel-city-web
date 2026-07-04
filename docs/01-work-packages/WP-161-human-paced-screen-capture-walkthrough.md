# WP-161: Human-Paced Screen Capture Walkthrough

## Status

Accepted retroactive work package.

## Problem

The existing browser automation is useful for regression testing, but it moves too quickly and invisibly for a screen-captured demo. A presenter needs a repeatable Case 004 walkthrough that:

- opens a real headed browser,
- proceeds at human pace,
- shows visible mouse/click behavior,
- types SQL queries rather than jumping between filled states,
- reaches the final case-close splash reliably,
- can be started with one command.

## Goals

- Add a repeatable demo walkthrough entry point from the repo root.
- Reuse the deterministic Student Mode API mocks so recording does not depend on live database timing.
- Show a recording-only cursor overlay with visible click pulses.
- Type SQL queries character-by-character at configurable speed.
- Hold on the final `Case 004 Closed` splash long enough for screen capture.
- Document the command and timing controls.

## Non-Goals

- Do not change production Student Mode behavior.
- Do not change Case 004 progression logic, clue validation, or final reward behavior.
- Do not replace regression specs with the recording walkthrough.
- Do not require the live SQL Server database for the recording route.

## Scope

Allowed files:

- `package.json`
- `apps/web/package.json`
- `apps/web/tests/browser/demo-walkthrough.spec.ts`
- `docs/09-release-readiness/human-paced-demo-walkthrough.md`
- `docs/01-work-packages/WP-161-human-paced-screen-capture-walkthrough.md`

Out of scope:

- app source components
- API code
- database scripts
- generated build output

## Impact Analysis

- Runtime impact: none for production users. The visible cursor is injected only by the Playwright demo route.
- Test impact: low. The new spec is a dedicated manually-invoked demo walkthrough, not part of normal unit tests unless explicitly selected.
- Demo impact: high. Presenters can now initiate a deterministic, human-paced full-case walkthrough with one command.
- Database/API impact: none. The demo uses existing browser-test API mocks.
- Understand graph regeneration: not required. The change adds a test/demo harness and documentation, not application architecture or data contracts.

## Implementation Plan

1. Add a dedicated `demo-walkthrough.spec.ts` route under the browser tests.
2. Start from the case library and walk the full Case 004 happy path through the final mastermind splash.
3. Inject a recording-only cursor overlay and animate it to clickable controls.
4. Use click pulses before important interactions.
5. Type SQL through keyboard input instead of instant field fills.
6. Add root and web workspace npm scripts for repeatable launch.
7. Document the command and timing environment variables.
8. Validate the walkthrough with near-zero delays and verify the web build.

## Acceptance Criteria

- `npm run demo:walkthrough` starts a headed walkthrough from the repo root.
- The walkthrough uses deterministic mocked Student Mode API responses.
- The walkthrough shows a visible cursor overlay for recording.
- SQL queries are typed into the editor instead of instantly inserted.
- Clicks are visually indicated.
- Timing can be adjusted with environment variables.
- The route reaches the `Case 004 Closed` splash.
- Documentation explains how to run and tune the capture route.

## Code Results

Implemented.

- Added `apps/web/tests/browser/demo-walkthrough.spec.ts` with a full Case 004 happy-path walkthrough.
- Added a recording-only cursor overlay, animated cursor movement, click pulses, and keyboard typing for SQL queries.
- Added timing controls:
  - `DEMO_STEP_MS`
  - `DEMO_SHORT_STEP_MS`
  - `DEMO_TYPE_DELAY_MS`
  - `DEMO_CURSOR_MOVE_MS`
  - `DEMO_FINAL_HOLD_MS`
- Added `demo:walkthrough` scripts at the repo root and web workspace levels.
- Added `docs/09-release-readiness/human-paced-demo-walkthrough.md` with run instructions and screen-capture notes.

Validation:

- Fast full route validation with `DEMO_STEP_MS=1`, `DEMO_SHORT_STEP_MS=1`, `DEMO_FINAL_HOLD_MS=1`, `DEMO_TYPE_DELAY_MS=0`, and `DEMO_CURSOR_MOVE_MS=1` passed.
- `npm run build --workspace apps/web` passed.

## Audit Results

PASS.

- Scope compliance: PASS. Changes are limited to demo browser automation, package scripts, documentation, and this work package.
- Repeatability: PASS. The route uses existing deterministic API mocks.
- Screen-capture usability: PASS. The route opens headed, animates a visible cursor, pulses clicks, types SQL, and holds on the final closeout splash.
- Production safety: PASS. No production component, API, database, or runtime behavior changes were made.
- Remaining risk: headed recording quality depends on the local screen recorder and display scaling, but the route itself is deterministic.

## Final Decision

Accepted.

- WP-161 is accepted as the repeatable human-paced screen-capture walkthrough.
- The route is intended for demo recording and presentation prep, not ordinary regression execution.
