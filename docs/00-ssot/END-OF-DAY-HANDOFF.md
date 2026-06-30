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
- Current HEAD: `a74481a81124f52b683b83b5d75fda5024745c9b`
- Repo status: `main...origin/main` with generated `apps/api/dist/**` files modified after verification/build attempts
- Active work package: none
- Current mode: readiness planning for faculty demo sprint

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

The prior live handoff was stale and only reflected work through `WP-115` from 2026-05-18. Current repository history and work-package files show substantial accepted work through `WP-149`, including:

- `WP-141`: Mastermind endgame state machine and closeout shell
- `WP-142`: student access lockout for answer-bearing/backend-only tables
- `WP-143`: Mastermind walkthrough guidance and browser test hardening
- `WP-144`: clue feedback improvements and Employment tie-break for Mastermind resolution
- `WP-145`: Understand codebase knowledge graph baseline
- `WP-146`: Understand-assisted work-package planning and audit workflow
- `WP-147`: context-aware clue logging and deferred evidence feedback
- `WP-148`: API dist output synchronization
- `WP-149`: API dist line-ending cleanup

Recent commits at the top of `main`:

- `a74481a` Close remaining API dist worktree noise
- `4bb8410` Synchronize tracked API dist outputs with committed source
- `3a06fb8` Refine context-aware clue logging guidance and reset behavior
- `3084d02` Plan context-aware clue logging feedback
- `0f614d7` Add Understand-assisted work package planning
- `bac13a6` Establish the Understand codebase knowledge graph baseline
- `834216b` Finalize Mastermind progression guidance and clue feedback
- `47f7566` Lock down student access to answer tables

## Verification Run On 2026-06-30

Passed:

- `npm run test --workspace apps/web`
  - Result: `174 passed`
- `npm run build --workspace apps/web`
  - Result: passed
- `npm run test --workspace apps/api`
  - Result: passed

Failed / blocked:

- `npm run build --workspace apps/api`
  - Result: failed
  - Main issue categories:
    - `.ts` import extension errors under current TypeScript build configuration
    - missing declaration file for `mssql`
    - test files included in the production TypeScript build, causing duplicate globals and assertion typing errors
    - several type-shape mismatches in API tests
- `npm run test:browser --workspace apps/web`
  - Result: blocked before product assertions
  - Cause: Playwright config has temporary `video: "on"` and the local Playwright ffmpeg binary is missing at `C:\Users\cburk\AppData\Local\ms-playwright\ffmpeg-1011\ffmpeg-win64.exe`
  - Follow-up: either install Playwright ffmpeg with `npx playwright install ffmpeg` or change browser-test config so video is off by default

Important interpretation:

- The browser suite did not prove a product regression on 2026-06-30 because the failure occurred before pages opened.
- Frontend unit/integration tests and frontend production build are green.
- Backend runtime tests are green, but backend TypeScript build is not yet demo-ready.

## Demo-Critical Gaps

1. API build is red.
   - This is the highest engineering cleanup item.
   - Root `npm run build` currently maps to the API build, so the project cannot honestly claim clean build readiness until this is fixed.

2. Browser automation is blocked by temporary video configuration or missing ffmpeg.
   - The Student Mode browser suite needs to become reliable again before final demo freeze.

3. No fresh full local runtime validation has been completed in this session.
   - Still need `npm run dev` against the real local SQL Server database.
   - Confirm backend health, schema metadata, safe query execution, blocked mutation query, query history, and suspect verification.

4. The implementation has a rich frontend-authored Student Mode progression, while SSOT still states full backend milestone progression is future-scoped.
   - For the faculty demo, describe this honestly:
     - backend/database are authoritative for SQL safety, query results, schema metadata, answer-table restriction, and suspect verification
     - current case guidance/progression presentation is authored deterministic frontend behavior
     - full backend milestone progression remains future work

5. Release-readiness docs/checklists need a current pass.
   - The existing release-readiness checklist is still useful but not yet marked with current 2026-06-30 validation results.

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

Create the next scoped work package for Day 1:

- theme: API TypeScript build stabilization
- likely files:
  - `apps/api/tsconfig.json`
  - `apps/api/package.json`
  - API source import paths if needed
  - a local declaration file for `mssql` if type package installation is not preferred
  - this handoff document only if final state changes
- do not change backend runtime behavior unless required by the build fix

Then implement and verify:

- `npm run test --workspace apps/api`
- `npm run build --workspace apps/api`
- root `npm run build`

## Resume Prompt

Continue from `docs/00-ssot/END-OF-DAY-HANDOFF.md`. We are preparing `Sequel Detective` for a faculty presentation in 15 days from 2026-06-30. The current priority is the 10-day demo-readiness sprint. Start with Day 1: create a scoped work package for API TypeScript build stabilization, then fix the API build without changing runtime behavior. After that, repair Playwright browser automation and run a full local runtime validation.

## Update Checklist

Before committing this live handoff, confirm:

- date is current
- branch and HEAD are current
- repo status is current
- active WP status is current
- verification results are current
- open risks reflect actual observed state
- 10-day plan still matches the deadline and demo goals
