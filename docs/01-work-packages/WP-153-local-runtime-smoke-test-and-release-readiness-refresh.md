# WP-153: Local Runtime Smoke Test And Release-Readiness Refresh

**Status:** Accepted
**Owner:** Codex
**Created:** 2026-06-30

## Objective

Run the real local application against the supported local SQL Server setup, confirm whether the documented release-readiness checks pass today, and record the results accurately.

## Scope

### In Scope

- start the real local backend and frontend from the repository workspace
- validate backend reachability, frontend reachability, and live frontend-to-backend connectivity
- validate database health, schema metadata, safe query execution, blocked mutation handling, query history visibility, and suspect verification on the running app
- refresh the release-readiness checklist with current observed results
- refresh the live handoff so the repo reflects the current sprint state and completed recent work packages
- correct stale top-level status metadata on already accepted work packages if encountered during the refresh
- document implementation, verification, audit results, and outcome in this work package

### Out of Scope

- redesigning or expanding Student Mode
- changing API or frontend behavior unless a narrowly scoped runtime blocker is discovered and separately approved
- database schema changes, seed changes, or SQL object changes
- broader SSOT rewrites beyond factual handoff/readiness status updates
- speculative performance or UX improvements

## Impact Analysis

### Understand Status
- Graph available: Yes
- Baseline commit: `834216bd32ffb567db572e725908d2e54c795e9d`
- Freshness assessment: `Usable with non-structural drift`
- Analysis performed: Recommended-tier validation/documentation analysis. The graph baseline predates the latest build and Playwright stabilization work, but this package is primarily operational verification and status documentation. Current source, current runtime behavior, and live documents are authoritative.

### Affected Architecture
- Layers: local runtime validation; release-readiness documentation; handoff documentation
- Primary files/components:
  - running root `npm run dev` workflow
  - backend health, schema, query, history, and suspect-verification surfaces
  - `docs/09-release-readiness/release-readiness-checklist.md`
  - `docs/00-ssot/END-OF-DAY-HANDOFF.md`
  - `docs/01-work-packages/WP-150-api-typescript-build-stabilization.md`
  - `docs/01-work-packages/WP-153-local-runtime-smoke-test-and-release-readiness-refresh.md`
- Upstream consumers:
  - faculty demo-readiness sprint
  - future machine handoffs
  - future release-readiness reviews
- Downstream dependencies:
  - local SQL Server instance and app environment configuration
  - current backend/frontend startup behavior

### Regression Surface
- Related tests:
  - live `npm run dev` runtime startup
  - live backend API endpoints
  - live frontend browser workflow against the backend
- User workflows:
  - viewing health status
  - loading schema metadata
  - running a safe `SELECT`
  - observing blocked `DELETE`
  - viewing query history
  - running suspect verification
- Security/data boundaries:
  - no answer-key exposure changes
  - no SQL safety policy changes
  - no database mutation beyond the existing dedicated suspect verification endpoint

### Graph Update Decision
- Regeneration required: No
- Rationale: This package is operational validation and documentation refresh, not a structural source change.

## Files Allowed to Change

Allowed:

- `docs/09-release-readiness/release-readiness-checklist.md`
- `docs/00-ssot/END-OF-DAY-HANDOFF.md`
- `docs/01-work-packages/WP-150-api-typescript-build-stabilization.md`
- `docs/01-work-packages/WP-153-local-runtime-smoke-test-and-release-readiness-refresh.md`

Do Not Modify:

- `apps/web/**`
- `apps/api/**`
- `database/**`
- other SSOT documents under `docs/00-ssot/**`
- any other work-package documents unless a factual stale status correction is explicitly listed above

## Constraints

- Treat observed live runtime behavior as authoritative.
- Record failures honestly; do not mark readiness items complete without direct verification.
- Do not fix product behavior inside this package unless a separate scoped follow-up is required and approved.
- Keep documentation updates factual and bounded to observed state.
- Preserve the current sprint framing and avoid inventing new roadmap items beyond what the observations justify.

## Required Behavior

- Start the app locally through the documented dev workflow.
- Confirm whether backend and frontend are reachable.
- Confirm whether the backend reports database and schema readiness.
- Confirm whether a safe read-only query executes successfully.
- Confirm whether a mutating query is blocked.
- Confirm whether query history reflects current session activity.
- Confirm whether suspect verification works through the dedicated supported path.
- Update the release-readiness checklist to reflect the current observed runtime state.
- Refresh the live handoff so recent completed work and current open priorities are accurate.
- Correct the stale top-level `Status` in `WP-150` from `Ready` to the accepted state reflected by its body and commit history.

## Acceptance Criteria

- [x] The real local app is started and checked through the documented dev workflow.
- [x] Backend health and schema readiness are directly verified.
- [x] Safe `SELECT` execution is directly verified.
- [x] Blocked `DELETE` handling is directly verified.
- [x] Query history behavior is directly verified.
- [x] Suspect verification is directly verified.
- [x] `docs/09-release-readiness/release-readiness-checklist.md` reflects current observed status.
- [x] `docs/00-ssot/END-OF-DAY-HANDOFF.md` reflects the current sprint state and recent accepted work.
- [x] `WP-150` top-level status is corrected to match its accepted outcome.
- [x] No application source, database, or unrelated documentation files are modified.

## Code Prompt

Implement WP-153 as a runtime-validation and documentation-refresh package.

1. Start the real app locally through the documented dev workflow.
2. Validate backend health, schema, safe query execution, blocked mutation handling, query history, and suspect verification against the live runtime.
3. Update the release-readiness checklist with the directly observed results.
4. Refresh the live handoff so it accurately reflects the current branch state, completed recent work packages, verification status, and next sprint priorities.
5. Correct `WP-150` top-level status metadata so it matches the accepted completion recorded in the body and commit history.
6. Do not modify application source, tests, database assets, or unrelated docs.
7. Update Code Results, Audit Results, and Final Decision with the real observed outcome.

## Audit Prompt

Audit WP-153 for honesty, scope control, and operational usefulness.

Verify:

1. The runtime checks were performed against the live local app rather than inferred from prior test output.
2. The checklist and handoff reflect observed current state.
3. `WP-150` status correction is factual and does not change any other substantive WP content.
4. No source, database, or unrelated documentation files changed.
5. Any runtime failure is recorded accurately without overstating readiness.

Output:
- Verdict: PASS or FAIL
- Scope violations
- Remaining runtime blockers
- Documentation drift risks

## Code Results

Implemented.

Observed live runtime validation on computer 1:

- `npm run dev` started both backend and frontend successfully.
- Frontend was reachable at `http://127.0.0.1:5173`.
- Backend was reachable at `http://127.0.0.1:3001`.
- `GET /api/health/database` returned a successful database connection for `SequelCityCrimesDB`.
- `GET /api/health/full` returned API, database, bootstrap, and schema readiness.
- `GET /api/schema/tables` returned schema metadata.
- `POST /api/query/execute` accepted `SELECT TOP 1 * FROM CrimeSceneReport`.
- The successful query result rendered in the live frontend query surface.
- `DELETE FROM CrimeSceneReport` was blocked by backend SQL safety validation in both API and frontend.
- Query history showed both successful `SELECT` and blocked `DELETE` records from the current session.
- Suspect verification succeeded for `Jeremy Bowers` through the dedicated backend endpoint and live frontend surface.

Documentation refresh completed:

- Updated `docs/09-release-readiness/release-readiness-checklist.md` with a 2026-06-30 validation snapshot and checked items that were directly verified.
- Updated `docs/00-ssot/END-OF-DAY-HANDOFF.md` to reflect:
  - current `HEAD`
  - clean repo state
  - completed `WP-150` through `WP-152`
  - successful build, browser, and runtime validation
  - the next sprint step after Day 3
- Corrected the stale top-level status in `WP-150` from `Ready` to `Accepted`.

Verification commands and paths used:

- `npm run dev`
- `GET http://127.0.0.1:3001/api/health/database`
- `GET http://127.0.0.1:3001/api/health/full`
- `GET http://127.0.0.1:3001/api/schema/tables`
- `POST http://127.0.0.1:3001/api/query/execute` with:
  - `SELECT TOP 1 * FROM CrimeSceneReport`
  - `DELETE FROM CrimeSceneReport`
- `GET http://127.0.0.1:3001/api/query/history`
- `POST http://127.0.0.1:3001/api/case/verify-suspect` with `Jeremy Bowers`
- Browser validation against `http://127.0.0.1:5173` in Admin Mode

Notes:

- The observed `.env` host value is `127.0.0.1` rather than the checklist's original `localhost` wording. The checklist now records this as a working loopback-equivalent configuration.
- Cross-machine browser confirmation is still pending on computer 2.

## Audit Results

Self-audit completed.

- Verdict: PASS
- Scope compliance: PASS. Changes are limited to the release-readiness checklist, live handoff, factual `WP-150` status correction, and this work package.
- Runtime honesty: PASS. All completed checks were executed against the live local runtime rather than inferred from prior test history.
- Remaining runtime blockers: None observed on computer 1 for the documented supported environment.
- Documentation drift risk: Low after this refresh. The remaining uncertainty is machine-specific browser behavior on computer 2, which is recorded explicitly in the handoff.

## Final Decision

Accepted.

- Treat Day 3 local runtime validation as complete on computer 1.
- Use the refreshed checklist and handoff as the current operational baseline.
- Proceed to the Day 4 full Student Mode walkthrough, while separately confirming browser behavior on computer 2 after pulling the latest Playwright fix.
