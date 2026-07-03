# Presentation Day Readiness Plan

## Purpose

This plan re-evaluates the original faculty-demo preparation checklist against the current repository state as of 2026-07-03.

The presentation target remains 2026-07-15. The project is no longer in basic stabilization mode. It is now in demo-route hardening, rehearsal, and final evidence capture mode.

## Current Readiness Judgment

Status: mostly ready for a local faculty demonstration, with the route drafted and rehearsal still pending.

The core runtime and Student Mode experience have improved materially since the original checklist:

- API build stabilization is complete.
- Browser automation is stable without mandatory video tooling.
- Live local runtime validation has passed on the primary machine.
- Visible product naming now leads with `Sequel Detective`.
- Student Mode now opens through a case library and themed case landing page.
- Case 004 has deterministic browser coverage for both happy-path and incorrect-path progression.
- A reusable incorrect-path browser harness now exists for future outlier and lost-input coverage.

The remaining work is not platform expansion. It is preparation discipline: rehearse the drafted demonstration, capture current screenshots or short clips, and run final verification on the actual presentation machine.

## Original Checklist Re-Evaluation

| Original Task | Current Status | Decision |
|---|---|---|
| Stabilize API build | Complete | No further work unless regression appears |
| Repair browser automation | Complete | Keep `npm run test:browser --workspace apps/web` in final gate |
| Run real local runtime smoke test | Complete on primary machine | Re-run on presentation machine before freeze |
| Complete full Student Mode walkthrough | Covered by browser progression tests, but manual rehearsal still needed | Replace broad exploratory walkthrough with scripted demo rehearsal |
| Fix demo-blocking UX bugs | Mostly complete through WP-154 to WP-159 | Only fix true blockers from rehearsal |
| Visible naming/copy pass | Complete | No broad copy churn |
| Presentation path hardening | Still pending | Highest-priority remaining task |
| Faculty framing and learning outcomes | Still pending | Pair with demo script |
| Final regression day | Pending | Keep as final gate |
| Demo freeze and handoff | Pending | Final action before presentation |

## Revised Task Plan

### 2026-07-03: Documentation And Plan Refresh

Objective:

- Bring the readiness checklist, live handoff, and presentation prep plan current with WP-154 through WP-159.

Tasks:

- Record that the project has moved past basic stabilization.
- Treat the incorrect-path browser harness as part of the readiness gate.
- Replace the old 10-day plan with a date-based plan from 2026-07-03 through presentation day.

Done when:

- Current docs identify the actual remaining risks instead of stale early-sprint work.

### 2026-07-04 To 2026-07-06: Demo Route Rehearsal

Objective:

- Rehearse and tighten the drafted faculty-facing route through the app.

Tasks:

- Walk the drafted route in a live browser.
- Confirm the route still matches the current UI labels and step order.
- Trim or expand the talk track only where live rehearsal shows friction.
- Keep the live route on the positive path.
- Add fallback language for backend/database issues only if rehearsal exposes a gap.

Done when:

- A presenter can rehearse from the drafted route without improvising the sequence.

### 2026-07-07 To 2026-07-09: Rehearsal And Friction Pass

Objective:

- Verify the scripted route works as a live presentation, not just as a test suite.

Tasks:

- Rehearse the demo path in a real browser.
- Note only presentation-impacting friction:
  - stale guidance
  - unclear next action
  - visible layout issue
  - confusing wording
  - runtime startup risk
- Fix only true blockers.
- Avoid new feature work.

Done when:

- The demo route is repeatable without explaining around broken UI.

### 2026-07-10 To 2026-07-11: Faculty Framing

Objective:

- Make the learning value explicit and accurate.

Tasks:

- Prepare concise talking points for:
  - SQL schema reading
  - filtering and evidence interpretation
  - safe read-only execution
  - hypothesis testing through suspect verification
  - deterministic guidance versus unsupported AI claims
- State current limitations plainly:
  - local-only runtime
  - no accounts
  - no grading system
  - no notebook persistence
  - no production deployment support

Done when:

- The presentation does not oversell unsupported capabilities.

### 2026-07-12: Evidence Capture

Objective:

- Capture fallback presentation assets.

Tasks:

- Follow the shot-by-shot recording checklist to capture the demo route at an easy pace.
- Capture screenshots or short clips of:
  - case library
  - Case 004 landing page
  - Query Lab with results
  - Evidence Board
  - suspect confirmation
  - mastermind closeout
- Store them in an agreed artifact location only if they are intended to be kept.

Done when:

- The presentation can continue even if the live runtime has an environment issue.

### 2026-07-13: Final Regression Gate

Objective:

- Confirm the repo is still green after preparation changes.

Tasks:

- Run:
  - `npm run test --workspace apps/web`
  - `npm run build --workspace apps/web`
  - `npm run test --workspace apps/api`
  - `npm run build --workspace apps/api`
  - `npm run test:browser --workspace apps/web`
  - `npm run test:browser --workspace apps/web -- outlier-user-path.spec.ts`
- Run a local runtime smoke test against the actual SQL Server setup.

Done when:

- All final checks pass or documented non-blocking exceptions are explicit.

### 2026-07-14: Presentation Machine Freeze

Objective:

- Make the actual presentation machine boring and predictable.

Tasks:

- Pull latest `main`.
- Confirm `git status` is clean.
- Run the final verification commands on the presentation machine.
- Confirm the app launches with `npm run dev`.
- Confirm the demo script and fallback assets are locally available.

Done when:

- The presentation machine is verified and no further feature work is allowed.

### 2026-07-15: Presentation Day

Objective:

- Present the prepared local runtime and learning narrative.

Tasks:

- Start the app before the session.
- Keep terminal output visible only if useful for local-runtime credibility.
- Follow the scripted route.
- Use fallback assets only if the live environment fails.

Done when:

- The demo shows a coherent local SQL learning experience without implying unsupported production features.

## Current Risks

| Risk | Severity | Current Mitigation |
|---|---|---|
| Demo route not yet rehearsed | High | Rehearse the drafted route on the presentation machine |
| Presentation machine not yet revalidated after WP-159 | High | Run final gate on that machine before freeze |
| Live SQL Server environment issue during demo | Medium | Prepare screenshots or short clips as fallback |
| Overexplaining implementation details | Medium | Use faculty framing focused on learning outcomes |
| Adding new features too close to presentation | High | Freeze feature work except true blockers |
| Misstating backend/frontend authority | Medium | Use documented framing: backend owns safety, execution, schema, and suspect verification; frontend presents deterministic authored guidance |

## Updated Rule

Until presentation day, accept only work that improves one of these:

- demo route clarity
- local runtime reliability
- final verification confidence
- faculty-facing learning narrative
- fallback presentation readiness

Defer everything else.
