# Release Readiness Checklist

## Purpose

This checklist confirms whether the current local runtime is operationally ready for use in its supported environment.

## Validation Snapshot (post-presentation refresh, 2026-07-17)

The faculty capstone presentation has completed. This checklist now distinguishes recorded presentation-readiness evidence from the validation still required before a future student pilot, package handoff, or local runtime demonstration.

Earlier presentation-readiness evidence combined the 2026-06-30 live local runtime validation with the 2026-07-03 browser and build verification completed after Student Mode and incorrect-path testing work.

Live runtime observations from 2026-06-30:

- backend reachable at `http://127.0.0.1:3001`
- frontend reachable at `http://127.0.0.1:5173`
- database health passed for `SequelCityCrimesDB`
- full health passed with schema readiness
- schema metadata loaded successfully
- safe `SELECT TOP 1 * FROM CrimeSceneReport` executed successfully in the API and the frontend
- `DELETE FROM CrimeSceneReport` was blocked by backend SQL safety validation
- query history recorded both the successful `SELECT` and blocked `DELETE`
- suspect verification passed for `Jeremy Bowers`

Automated verification from 2026-07-03:

- `npm run test:browser --workspace apps/web -- outlier-user-path.spec.ts` passed
- `npm run test --workspace apps/web` passed with `178 passed`
- `npm run build --workspace apps/web` passed
- the incorrect-path browser framework now validates varied wrong SQL, client-blocked SQL, wrong mouse-click detours, wrong theory choices, and query draft preservation

Additional accepted package evidence after the earlier presentation-readiness snapshot:

- `WP-162`: `npm run package:student`, `npm run build`, `npm run test --workspace apps/api`, and `npm run test --workspace apps/web` passed; the student package excluded secrets, dependencies, build output, test artifacts, and local logs.
- `WP-164`: active/script `EventSchedule` and `EventRegistration` row counts matched, tuple diff counts were 0, and no destructive SQL was run against the active database.
- `WP-165`: PowerShell syntax checks, focused bootstrap service test, API tests, web tests, `npm run package:student`, archive validation, and `git diff --check` passed.
- `WP-234`: Case 004 learner notebook and frontend case progress were scoped to persist in local browser storage only. Backend query history, account-backed persistence, multi-user isolation, and cloud/cross-device sync remain outside the current runtime.

Required validation before the next student pilot or package handoff:

- re-run the relevant automated test/build/package commands from the current worktree
- re-run a live local runtime smoke test against the SQL Server instance used for the pilot or demonstration
- confirm the generated student package starts from a fresh extract without relying on developer-local secrets
- confirm Case 004 local browser progress restore works on the target browser when that resume behavior matters for the pilot or demonstration

## Local Environment Readiness

- [x] Repository is available locally on a Windows machine
- [x] `npm install` completed successfully from the repository root
- [x] `apps/api/.env` exists
- [x] `SQLSERVER_HOST=localhost` is set for documented SQL host guidance
- [x] `SQLSERVER_PORT=1433` is configured
- [x] `SQLSERVER_DATABASE=SequelCityCrimesDB` is configured
- [x] SQL login credentials in `apps/api/.env` are present

Note: the observed `.env` value is `SQLSERVER_HOST=127.0.0.1`, which is functioning as the local loopback equivalent of the documented localhost guidance.

## SQL Server Readiness

- [x] Local SQL Server service is running
- [x] TCP/IP is enabled
- [x] Port `1433` is listening
- [x] `SequelCityCrimesDB` is restored on the local SQL Server instance
- [x] The configured SQL login can read `SequelCityCrimesDB`

## Process Startup Readiness

- [x] `npm run dev` starts both the backend and frontend
- [x] Backend is reachable at `http://127.0.0.1:3001` or the locally configured equivalent
- [x] Frontend is reachable at `http://127.0.0.1:5173` or the locally configured equivalent
- [x] The frontend can reach the backend without local connectivity failure
- [ ] Target machine has revalidated startup after pulling the latest accepted state

## Backend API Validation

- [x] `GET /api/health/database` reports a successful database connection
- [x] `GET /api/health/full` reports API, database, and schema readiness
- [x] `GET /api/schema/tables` returns table and relationship metadata

## Read-Only Query Validation

- [x] `POST /api/query/execute` accepts a safe `SELECT`
- [x] The returned query result is normalized and rendered by the frontend
- [x] A mutating query such as `DELETE` is blocked by backend safety validation
- [x] Query execution does not require frontend-side SQL authority

## Query History Validation

- [x] `GET /api/query/history` returns records successfully
- [x] A successful safe query appears in query history
- [x] A blocked query attempt appears in query history when executed

## Student Local Progress Persistence

- [x] Case 004 learner notebook and frontend case progress persist in local browser storage
- [x] Local progress persistence remains frontend-owned convenience state
- [x] Local progress persistence does not replace backend query execution, query history, SQL safety, or suspect verification authority
- [ ] Target browser has revalidated Case 004 local progress restore after pulling the latest accepted state

## Student Mode Demo Validation

- [x] Demo route script drafted
- [x] Shot-by-shot recording checklist drafted
- [x] Case library opens before the playable case
- [x] Case 004 landing page opens before live investigation
- [x] Browser history steps through library, landing, and case states
- [x] Case 004 can progress through first suspect and mastermind confirmation in browser automation
- [x] Incorrect-path browser coverage validates recovery after varied wrong SQL attempts
- [x] Incorrect-path browser coverage validates recovery after wrong suspect theory choices
- [x] Incorrect-path browser coverage validates query draft preservation across navigation
- [x] Faculty presentation route completed for capstone context
- [ ] Future pilot route revalidated on the target machine
- [ ] Fallback screenshots or clips refreshed if they are needed for a future session

## Final Ready / Not Ready Rule

For future pilots or demonstrations, the runtime is ready only when:

- the backend is running
- the frontend is running
- the backend is connected to a restored local `SequelCityCrimesDB`
- schema metadata loads
- safe read-only query execution works
- the scripted Student Mode route or pilot path has been rehearsed on the target machine

If any of those conditions are false, the current release target should be treated as not ready in its documented supported environment.
