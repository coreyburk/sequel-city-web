# End-of-Day Handoff

## Purpose

Use this file to transfer current working context between development sessions and machines.

This is the live handoff artifact. Refresh it from `docs/00-ssot/END-OF-DAY-HANDOFF-TEMPLATE.md` before each handoff commit so older state does not remain in place.

Workflow:

1. Update this file before switching machines or pausing a sprint.
2. Commit and push when the current work is ready.
3. Pull on the other machine.
4. Continue from this handoff.

When recording accepted work packages, use the project multi-line commit format:

- imperative title line
- blank line
- bullet list of concrete changes

## Current State

- Date: 2026-06-30
- Presentation deadline: 15 days from 2026-06-30
- Current product name recommendation: `Sequel Detective`
- Recommended tagline: `Learn SQL by solving data mysteries.`
- Branch: `main`
- Current HEAD: `6820d8686c5dc9365c5b8cdcb2dc4647f0c05252`
- Repo status: `main...origin/main` clean
- Active work package: `WP-153` runtime validation and release-readiness refresh
- Current mode: faculty demo sprint execution after build, browser, and runtime validation

## Current Product Summary

`Sequel Detective` is an interactive, local-first SQL learning application that teaches students database querying through a detective investigation. Students work cases in Sequel City by inspecting a relational schema, writing backend-validated read-only SQL, interpreting query results as evidence, logging clues, following leads across tables, and testing suspect theories through deterministic backend/database verification.

The first case experience now includes:

- Student Mode with noir detective presentation
- Samuel Tupleton mentor guidance
- Query Lab
- Evidence Board / notebook surfaces
- pinned facts and query-building support
- row-specific `Log Clue` feedback
- deferred, duplicate, rejected, and logged clue states
- suspect theory testing
- late-case Mastermind progression
- EventSchedule, EventRegistration, and Employment tie-break guidance
- Mastermind Confirmed closeout shell
- backend SQL safety and answer-table restrictions

## Recent Project Progress

The demo-readiness sprint has now cleared the first three engineering gates:

- `WP-150`: API TypeScript build stabilization completed and accepted
- `WP-151`: substantive API `dist` output synchronized after WP-150
- `WP-152`: Playwright browser automation defaults stabilized so default runs no longer depend on always-on video/ffmpeg
- `WP-153`: live local runtime smoke test executed and release-readiness artifacts refreshed

Recent commits at the top of `main`:

- `6820d86` Stabilize Playwright browser automation defaults
- `39bcffc` Synchronize API dist after build stabilization
- `e48eecf` Stabilize API build for demo readiness
- `6223c44` Refresh handoff for Sequel Detective demo sprint
- `a74481a` Close remaining API dist worktree noise
- `4bb8410` Synchronize tracked API dist outputs with committed source

## Verification Run On 2026-06-30

Passed:

- `npm run test --workspace apps/web`
  - Result: `174 passed`
- `npm run build --workspace apps/web`
  - Result: passed
- `npm run test --workspace apps/api`
  - Result: passed
- `npm run build --workspace apps/api`
  - Result: passed
- `npm run build`
  - Result: passed
- `npm run test:browser --workspace apps/web`
  - Result: passed
  - Detail: `5 passed, 1 skipped`
- `npm run test:browser:headed --workspace apps/web`
  - Result: passed
  - Detail: `5 passed, 1 skipped`
- `npm run dev`
  - Result: passed for live local runtime startup
- live backend validation
  - `GET /api/health/database`: passed
  - `GET /api/health/full`: passed
  - `GET /api/schema/tables`: passed
- live frontend/admin runtime validation
  - health panel: passed
  - schema explorer load: passed
  - safe `SELECT TOP 1 * FROM CrimeSceneReport`: passed
  - blocked `DELETE FROM CrimeSceneReport`: passed
  - query history refresh with current session records: passed
  - suspect verification for `Jeremy Bowers`: passed

Important interpretation:

- The documented local supported runtime is currently working on this machine.
- The remaining unknown is whether the same Playwright/browser environment behaves cleanly on computer 2 after pulling `6820d86`.

## Demo-Critical Gaps

1. Cross-machine confirmation is still pending.
   - Computer 1 is green for build, browser, and live runtime validation.
   - Computer 2 should re-run the browser suite after pulling the Playwright fix.

2. The implementation has a rich frontend-authored Student Mode progression, while SSOT still states full backend milestone progression is future-scoped.
   - For the faculty demo, describe this honestly:
     - backend/database are authoritative for SQL safety, query results, schema metadata, answer-table restriction, and suspect verification
     - current case guidance/progression presentation is authored deterministic frontend behavior
     - full backend milestone progression remains future work

3. Release-readiness framing and presentation materials still need a demo-specific pass.
   - The technical runtime checklist is now fresh.
   - The presentation route and faculty-facing explanation still need deliberate refinement.

## 10-Day Faculty Demo Sprint Plan

### Day 1: Stabilize The Build

Goal:

- Make API TypeScript build green.

Tasks:

- Fix or scope API `tsconfig` so production build excludes test files.
- Resolve `.ts` import extension strategy.
- Add or declare `mssql` types.
- Re-run:
  - `npm run build --workspace apps/api`
  - root `npm run build`

Done when:

- API build passes cleanly.
- Root build passes cleanly or the root script is intentionally corrected and documented.

### Day 2: Repair Browser Automation

Goal:

- Make Playwright browser tests runnable again.

Tasks:

- Decide whether to install Playwright ffmpeg or remove temporary always-on video capture.
- Prefer disabling video by default unless a specific artifact-capture run needs it.
- Re-run:
  - `npm run test:browser --workspace apps/web`
  - optionally `npm run test:browser:headed --workspace apps/web`

Done when:

- Browser suite reaches product assertions and passes, or any remaining failure is a real product issue with a scoped fix.

### Day 3: Full Real Runtime Smoke Test

Goal:

- Validate the actual local app against the real SQL Server database.

Tasks:

- Start the app with `npm run dev`.
- Open `http://127.0.0.1:5173`.
- Confirm backend at `http://127.0.0.1:3001`.
- Verify health panel, schema loading, safe `SELECT`, blocked `DELETE`, query history, and suspect verification.

Done when:

- The release-readiness checklist has fresh results.
- Any environment issue is separated from product defects.

### Day 4: Full Student Mode Walkthrough

Goal:

- Manually complete the whole case from briefing through Mastermind Confirmed.

Tasks:

- Walk the exact demo path in a browser.
- Capture friction, stale guidance, unclear handoffs, broken tokens, and confusing next actions.
- Do not redesign yet; collect only observed issues.

Done when:

- A short issue list exists, ordered by demo severity.

### Day 5: Fix Demo-Blocking UX Bugs

Goal:

- Remove issues that would make the faculty demo feel broken or confusing.

Tasks:

- Fix blockers from Day 4.
- Focus on stale state, wrong guidance, broken buttons/tokens, layout overlap, or unclear required next action.
- Avoid new feature invention.

Done when:

- The manual walkthrough is completable without facilitator improvisation.

### Day 6: Sequel Detective Naming And Visible Copy Pass

Goal:

- Replace externally visible working-title language where appropriate.

Tasks:

- Update visible app title/copy to `Sequel Detective`.
- Keep `Sequel City` as the fictional case setting.
- Preserve internal repo/package names unless there is a scoped reason to rename them.
- Update overview copy where needed.

Done when:

- Faculty-facing surfaces no longer lead with `Sequel City Web`.

### Day 7: Presentation Path Hardening

Goal:

- Create a precise 8-10 minute demo route.

Tasks:

- Write exact demo steps and queries.
- Record expected results and talking points.
- Prepare fallback steps if local SQL Server or browser automation misbehaves.

Done when:

- The demo can be rehearsed from a single script.

### Day 8: Faculty Framing And Learning Outcomes

Goal:

- Make the educational value easy for faculty to understand.

Tasks:

- Frame the experience around schema reading, filtering, joins, evidence interpretation, safe SQL, and hypothesis testing.
- Prepare concise language for what is implemented now versus future work.
- Avoid overselling unsupported capabilities such as cloud deployment, accounts, grading, persistence, or runtime AI.

Done when:

- Presentation content accurately matches current implementation boundaries.

### Day 9: Final Regression Day

Goal:

- Freeze features and verify.

Tasks:

- Run:
  - `npm run test --workspace apps/web`
  - `npm run build --workspace apps/web`
  - `npm run test --workspace apps/api`
  - `npm run build --workspace apps/api`
  - `npm run test:browser --workspace apps/web`
- Run a final manual runtime smoke test.

Done when:

- All agreed release checks pass or documented non-blocking exceptions are explicit.

### Day 10: Demo Freeze And Handoff

Goal:

- Package the project for presentation confidence.

Tasks:

- Refresh this handoff.
- Refresh release-readiness checklist.
- Prepare final presentation outline/deck.
- Capture screenshots or short recordings if useful.
- Stop feature work unless a true blocker appears.

Done when:

- Demo script, app state, tests, and presentation materials are aligned.

## Sprint Rule

For the next 10 days, defer anything outside the faculty demo path unless it affects:

- safety
- correctness
- case completion
- presentation credibility
- local runtime reliability

The app does not need to become a full platform before the presentation. It needs to be coherent, reliable, and impressive in the path being shown.

## Immediate Next Step

Move to Day 4 of the sprint:

- manually complete the full Student Mode case from briefing through `Mastermind Confirmed`
- record friction, stale guidance, unclear handoffs, broken tokens, or confusing next actions
- do not redesign during the walkthrough; collect only observed issues
- after the walkthrough, decide whether the findings justify a narrow demo-blocker WP

Parallel operational follow-up:

- on computer 2, pull `main` and rerun:
  - `npm run test:browser --workspace apps/web`
  - `npm run test:browser:headed --workspace apps/web`
- if computer 2 still fails, treat that as a machine-specific environment follow-up unless the failure proves a product regression

## Resume Prompt

Continue from `docs/00-ssot/END-OF-DAY-HANDOFF.md`. We are preparing `Sequel Detective` for a faculty presentation in 15 days from 2026-06-30. Days 1 through 3 are now green on computer 1: the API build passes, the Playwright browser suite passes, and the real local runtime smoke test passed against the live SQL Server setup. The next priority is Day 4: perform a full Student Mode walkthrough from briefing to `Mastermind Confirmed`, capture only demo-relevant friction, and then decide whether a narrow UX-fix work package is needed. Also recheck the Playwright suite on computer 2 after pulling commit `6820d86`.

## Update Checklist

Before committing this live handoff, confirm:

- date is current
- branch and HEAD are current
- repo status is current
- active WP status is current
- verification results are current
- open risks reflect actual observed state
- 10-day plan still matches the deadline and demo goals
