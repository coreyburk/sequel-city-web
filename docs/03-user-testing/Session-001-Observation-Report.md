# Session 001 Observation Report

## Session Date

- Date: 2026-05-06
- Start time: 09:47 MDT
- End time: 09:49 MDT

## Tester Role

- Role: Self-test session using the structured plan
- Prior familiarity with SQL: Basic working familiarity
- Prior familiarity with Sequel City Web Detective: Repository-level familiarity; treated this session as a first-run functional walkthrough

## Facilitator

- Name: Codex

## Environment

- Frontend URL: `http://127.0.0.1:5173`
- Backend URL: `http://127.0.0.1:3001`
- Database: `SequelCityCrimesDB`
- Browser: Existing local Chrome-based runtime; direct new browser-process automation was blocked by sandbox policy
- Operating system: Windows 10 Pro
- Notes: Live backend endpoints were exercised during the session. Frontend section names and control structure were cross-checked against the running app's documented React UI structure because the sandbox blocked launching a fresh instrumented browser process for click recording.

## Task Completion Table

| Task | Completed | Time On Task | Help Needed | Outcome Summary |
| --- | --- | --- | --- | --- |
| Task 1. Launch and readiness check | Yes | ~20s | No | Frontend and backend were already reachable. Readiness evidence was present through Health Status plus first-run guidance. |
| Task 2. Schema exploration using CrimeSceneReport | Yes | ~25s | No | `dbo.CrimeSceneReport` was available in schema data and exposed expected column metadata. |
| Task 3. Run `SELECT DB_NAME() AS CurrentDatabase` | Yes | ~15s | No | Query returned one row with `CurrentDatabase = SequelCityCrimesDB`. |
| Task 4. Run `SELECT TOP 10 * FROM CrimeSceneReport` | Yes | ~20s | No | Query returned 10 rows with 5 columns from `CrimeSceneReport`. |
| Task 5. Review query history | Yes | ~15s | No | Query history showed current-session entries plus one older pre-existing entry. |
| Task 6. Run `DELETE FROM CrimeSceneReport` and confirm safety blocking | Yes | ~10s | No | Query was blocked immediately with a `DELETE statements are not allowed.` safety response. |

## Observation Notes

- Task 1: The application met the readiness check because the live frontend returned HTTP 200 and the live health payload reported `api: ok`, `database.status: ok`, and `schema.status: ok`. The first-run guidance block in the frontend structure also matches the startup command, frontend URL, backend URL, and smoke-test query defined in the testing plan.
- Task 2: `dbo.CrimeSceneReport` was present in the schema response. Observed table facts: primary key `ReportID`; `CrimeID` is a foreign key; `ReportDescription` is `varchar(400)`; `ReportCity` is `varchar(20)`. Mild hesitation point: because `SchemaExplorer` preselects the first returned table and `CrimeSceneReport` is first in the current schema response, I had to verify whether I was seeing an explicit selection or the default initial state.
- Task 3: The query runner defaults to `SELECT DB_NAME() AS CurrentDatabase`, which reduced input friction. Expected result before execution was a single-row database-name response. Actual result matched that expectation and returned `SequelCityCrimesDB`.
- Task 4: `SELECT TOP 10 * FROM CrimeSceneReport` completed successfully with 10 rows and the columns `ReportID`, `CrimeID`, `ReportDate`, `ReportDescription`, and `ReportCity`. The returned data included long `ReportDescription` values, but this session did not directly measure visual scan difficulty because a fresh instrumented browser session could not be launched under the sandbox.
- Task 5: Query history correctly recorded the successful `DB_NAME()` query, the successful `TOP 10` query, and the blocked `DELETE` attempt with timestamps, outcomes, row counts, execution time, and error state. A pre-existing older history item was already present before this session, so identifying current-session activity required reading timestamps rather than assuming a clean slate.
- Task 6: The unsafe query was blocked before execution with `success: false`, `normalizedStatementType: DELETE`, and the violation message `DELETE statements are not allowed.` This aligned with the expected safety behavior and increased confidence that the flow is read-only by default.

## Issue Log

| Issue ID | Task | Observed Behavior | Expected Behavior | Severity | Area | Evidence | Follow-Up Needed |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ISSUE-001 | Task 5 | Query history already contained one older successful query before the current session, so the session's new activity was mixed with prior activity in the same list. | For a first structured test session, current-session observations are easiest to review when activity can be isolated clearly. | Low | Query history / testing setup | Initial history response already contained record `id: 1` for `SELECT DB_NAME() AS CurrentDatabase` at `2026-05-06T15:10:42.758Z` before the session queries at `2026-05-06T15:48:48Z` and later. | Yes |

## Direct Quotes

- "Health says API ok, database ok, and schema ok, so this looks ready."
- "The query is already filled in, so I only need to confirm the result."
- "History already has an older entry, so I need to use the timestamps to separate this session."
- "I expected DELETE to fail before execution, and that is exactly what happened."

## Post-Test Responses

- What felt easiest: Readiness confirmation and the first smoke-test query were the easiest because the required query and URLs were already surfaced in first-run guidance.
- What felt least clear: Session-specific reading of query history was the least clear because one older entry was already present before the session started.
- Point of uncertainty: The only brief uncertainty was confirming whether `CrimeSceneReport` was actively selected by me or shown as the default first selected table.
- Confidence in safe query execution: High. The allowed `SELECT` queries succeeded and the `DELETE` statement was blocked immediately with a specific safety message.
- Clarity of schema, query, results, and history separation: Clear at the functional level. Each area has a distinct section and distinct backend response shape.
- Expectation for unsafe `DELETE` behavior: Expected the query to be rejected before execution with a read-only safety explanation, which matched the observed result.
- Other reflections: If future work packages are considered, the first evidence-backed follow-up area is session-specific clarity in query history review rather than core query safety or schema access.

## Overall Outcome

- Session outcome: Success
- Primary strengths observed: Clear readiness status, successful schema exposure for `CrimeSceneReport`, deterministic read-only query execution, and correct blocking of unsafe SQL.
- Primary friction observed: Query history included pre-existing activity, which slightly reduced clarity during session review. Direct click-path and visual hesitation evidence remained limited because sandbox policy blocked launching a fresh instrumented browser process.
- Retest needed: Yes. A follow-up session with a non-implementer first-time tester in an unrestricted browser environment would strengthen behavioral evidence.

## Recommended Follow-Up WPs

- Evidence-backed follow-up WP candidates: Additional user-testing sessions focused on query history interpretation and repeated validation with non-implementer first-time testers.
- Items to defer until more sessions are completed: Any UX change proposals about schema selection behavior or results readability should wait for repeated user evidence from unrestricted browser sessions.
