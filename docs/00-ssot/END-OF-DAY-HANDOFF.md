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

- Date: 2026-07-03
- Presentation target: 2026-07-15
- Current product name: `Sequel Detective`
- Recommended tagline: `Learn SQL by solving data mysteries.`
- Branch: `main`
- Current HEAD: `7b6054006bb495cb9a03d0a9f94209faff41a07a`
- Repo status at handoff refresh: clean before documentation update
- Active work package: none
- Current mode: faculty presentation preparation, demo-route scripting, rehearsal, and final verification

## Current Product Summary

`Sequel Detective` is an interactive, local-first SQL learning application that teaches students database querying through a detective investigation. Students work cases in Sequel City by inspecting a relational schema, writing backend-validated read-only SQL, interpreting query results as evidence, logging clues, following leads across tables, and testing suspect theories through deterministic backend/database verification.

The first case experience currently includes:

- case library entry screen
- themed Case 004 landing page
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
- browser coverage for happy-path and incorrect-path progression

## Original Checklist Re-Evaluation

The original 10-day checklist is no longer accurate as a forward plan. It was useful for the stabilization sprint, but the project has moved beyond its early gates.

| Original Task | Current Status | Decision |
|---|---|---|
| Stabilize API build | Complete | No further work unless regression appears |
| Repair browser automation | Complete | Keep browser suite in final gate |
| Run real local runtime smoke test | Complete on primary machine | Re-run on presentation machine before freeze |
| Complete full Student Mode walkthrough | Browser coverage is strong; manual rehearsal still needed | Replace exploratory walkthrough with scripted demo rehearsal |
| Fix demo-blocking UX bugs | Mostly complete through WP-154 to WP-159 | Only fix true blockers from rehearsal |
| Sequel Detective naming pass | Complete | Avoid broad copy churn |
| Presentation path hardening | Pending | Highest-priority remaining task |
| Faculty framing and learning outcomes | Pending | Pair with demo script |
| Final regression day | Pending | Keep as final gate |
| Demo freeze and handoff | Pending | Final action before presentation |

## Recent Project Progress

Presentation-readiness work now includes:

- `WP-150`: API TypeScript build stabilization
- `WP-151`: substantive API `dist` output synchronization
- `WP-152`: Playwright browser automation defaults stabilized
- `WP-153`: live local runtime smoke test and release-readiness refresh
- `WP-154`: full Student Mode walkthrough and issue capture
- `WP-155`: visible `Sequel Detective` naming pass
- `WP-156`: multi-screen onboarding and case-entry flow
- `WP-157`: visual case library and header-level case switching
- `WP-158`: case landing pages and three-step library entry flow
- `WP-159`: incorrect-path and lost-input browser testing framework

Recent commits at the top of `main`:

- `7b60540` Add incorrect-path browser testing framework
- `b838ab4` Finalize case landing pages and student library entry flow
- `e75f027` Add student onboarding and case-entry flow for Case 004
- `2dc2b5b` Refresh visible Sequel Detective branding
- `155936b` Document cross-machine student walkthrough validation
- `af36488` Refresh runtime readiness and handoff status
- `6820d86` Stabilize Playwright browser automation defaults

## Latest Verification Evidence

Validation already completed:

- `npm run test:browser --workspace apps/web -- outlier-user-path.spec.ts`
  - Result: passed on 2026-07-03
- `npm run test --workspace apps/web`
  - Result: `178 passed` on 2026-07-03
- `npm run build --workspace apps/web`
  - Result: passed on 2026-07-03
- Prior live runtime smoke test on 2026-06-30:
  - `npm run dev`: passed for local runtime startup
  - `GET /api/health/database`: passed
  - `GET /api/health/full`: passed
  - `GET /api/schema/tables`: passed
  - health panel: passed
  - schema explorer load: passed
  - safe `SELECT TOP 1 * FROM CrimeSceneReport`: passed
  - blocked `DELETE FROM CrimeSceneReport`: passed
  - query history refresh: passed
  - suspect verification for `Jeremy Bowers`: passed

Interpretation:

- The primary development machine has strong automated and runtime evidence.
- The presentation machine still needs final verification after pulling latest `main`.
- Browser coverage now includes incorrect-path behavior, not only correct-choice progression.

## Current Demo-Critical Gaps

1. Demo script is not yet written.
   - This is now the highest-priority work.
   - The app is strong enough that scripting and rehearsal matter more than adding features.

2. Presentation machine still needs final validation.
   - Pull latest `main`.
   - Confirm `git status` is clean.
   - Run final verification commands.
   - Launch `npm run dev` and verify the actual local SQL Server setup.

3. Fallback presentation assets are not yet captured.
   - Capture screenshots or short clips after the demo script is stable.
   - Store them only in an agreed artifact location if they are intended to be kept.

4. Faculty framing still needs a concise pass.
   - Emphasize SQL learning, schema reading, evidence interpretation, safe read-only execution, and hypothesis testing.
   - Do not imply production deployment, grading, accounts, cloud hosting, persistence, or runtime AI.

5. Frontend/backend authority must be described accurately.
   - Backend/database are authoritative for SQL safety, query results, schema metadata, answer-table restriction, and suspect verification.
   - Current case guidance/progression presentation is deterministic authored frontend behavior.
   - Full backend milestone progression remains future work.

## Revised Presentation Task Plan

### 2026-07-03: Documentation And Plan Refresh

Status: complete after this documentation refresh.

Tasks:

- refresh this handoff
- refresh the release readiness checklist
- add the presentation-day readiness plan
- make the new plan discoverable from release-readiness docs

### 2026-07-04 To 2026-07-06: Demo Route Script

Goal:

- Create the exact 8-10 minute faculty-facing route through the app.

Tasks:

- write exact screens, queries, expected results, and talking points
- include case library, Case 004 landing page, Samuel guidance, Query Lab, Evidence Board, suspect verification, and mastermind closeout
- include fallback language for local SQL Server or browser issues

Done when:

- the route can be rehearsed from one script without improvising the sequence

### 2026-07-07 To 2026-07-09: Rehearsal And Friction Pass

Goal:

- Verify the scripted route works as a live presentation.

Tasks:

- rehearse the demo path in a real browser
- note only presentation-impacting friction
- fix only true blockers
- avoid new feature work

Done when:

- the demo route is repeatable without explaining around broken UI

### 2026-07-10 To 2026-07-11: Faculty Framing

Goal:

- Make the learning value explicit and accurate.

Tasks:

- prepare concise talking points for schema reading, filtering, evidence interpretation, safe SQL, and hypothesis testing
- state current limitations plainly
- avoid unsupported claims

Done when:

- presentation content matches current implementation boundaries

### 2026-07-12: Evidence Capture

Goal:

- Capture fallback presentation assets.

Tasks:

- capture screenshots or short clips of the key demo screens
- confirm where artifacts should live before committing any of them

Done when:

- the presentation can continue if the live environment has an issue

### 2026-07-13: Final Regression Gate

Goal:

- Confirm the repo is still green.

Tasks:

- `npm run test --workspace apps/web`
- `npm run build --workspace apps/web`
- `npm run test --workspace apps/api`
- `npm run build --workspace apps/api`
- `npm run test:browser --workspace apps/web`
- `npm run test:browser --workspace apps/web -- outlier-user-path.spec.ts`
- run a local runtime smoke test against the actual SQL Server setup

Done when:

- all final checks pass or documented non-blocking exceptions are explicit

### 2026-07-14: Presentation Machine Freeze

Goal:

- Make the actual presentation machine predictable.

Tasks:

- pull latest `main`
- confirm `git status` is clean
- run final verification commands on the presentation machine
- confirm the app launches with `npm run dev`
- confirm demo script and fallback assets are locally available

Done when:

- no further feature work is allowed unless a true blocker appears

### 2026-07-15: Presentation Day

Goal:

- Present the prepared local runtime and learning narrative.

Tasks:

- start the app before the session
- follow the scripted route
- use fallback assets only if the live environment fails

## Updated Sprint Rule

Until presentation day, accept only work that improves one of these:

- demo route clarity
- local runtime reliability
- final verification confidence
- faculty-facing learning narrative
- fallback presentation readiness

Defer everything else.

## Immediate Next Step

Create the demo route script.

The script should include:

- exact starting state
- exact browser URL
- exact screens to open
- exact SQL queries to run
- expected result summaries
- what to say at each step
- fallback path if SQL Server or the browser fails

Do not add more gameplay features before the script exists.

## Resume Prompt

Continue from `docs/00-ssot/END-OF-DAY-HANDOFF.md`. We are preparing `Sequel Detective` for a 2026-07-15 faculty presentation. The project has moved beyond the original stabilization checklist: API build, browser automation, live runtime smoke validation, visible naming, case library/landing entry, and incorrect-path browser coverage are complete. The next priority is writing the exact 8-10 minute demo route script, then rehearsing it on the presentation machine and running the final regression gate.

## Update Checklist

Before committing this live handoff, confirm:

- date is current
- branch and HEAD are current
- repo status is current
- active WP status is current
- verification results are current
- open risks reflect actual observed state
- presentation plan still matches the 2026-07-15 target
