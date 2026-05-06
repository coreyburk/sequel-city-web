# Structured User Testing Plan

## Purpose

This plan defines a consistent moderated user testing process for the first usable Sequel City Web Detective application flow. The goal is to observe how a tester moves through the current browser-based experience before any further UX changes are proposed or prioritized.

## Testing Goals

- Validate whether a first-time tester can complete the current browser-based flow with the existing guidance.
- Observe where testers hesitate, misread interface language, or require facilitator clarification.
- Confirm whether the current flow supports safe schema exploration and safe query execution without accidental misuse.
- Capture evidence about comprehension, confidence, and friction across health status, first-run guidance, schema explorer, query execution, results review, and query history.
- Create a repeatable evidence base for future work packages without assuming solutions in advance.

## Tester Profile

- Primary tester: first-time or early-time user of the application
- Expected background: basic familiarity with databases or SQL concepts
- Acceptable roles: developer, QA tester, analyst, technical product stakeholder, or support-oriented internal tester
- Exclusion: do not use a tester who implemented the current frontend flow

## Prerequisites

- The application launches successfully in the current local environment.
- The backend is reachable from the frontend.
- The database connection is working and points to the expected test database.
- The `CrimeSceneReport` table is available in the schema explorer.
- Query history is enabled and reachable.
- The facilitator has reviewed the runtime validation steps in [Frontend-First-Launch-Validation.md](/D:/GitHub-Repos/SequelCityWeb/docs/02-runtime/Frontend-First-Launch-Validation.md).

## Environment Setup

- Start the application using the preferred runtime workflow documented in [Developer-Startup-Workflow.md](/D:/GitHub-Repos/SequelCityWeb/docs/02-runtime/Developer-Startup-Workflow.md).
- Confirm the frontend is available at `http://127.0.0.1:5173`.
- Confirm the backend is available at `http://127.0.0.1:3001`.
- Confirm the health panel reports a connected database before the session begins.
- Use a clean browser session when practical so the test starts from a fresh application launch.
- Prepare a note-taking document using [User-Testing-Observation-Template.md](/D:/GitHub-Repos/SequelCityWeb/docs/03-user-testing/User-Testing-Observation-Template.md).

## Facilitator Role

- Introduce the session, purpose, and timebox.
- Ask the tester to think aloud while completing tasks.
- Read task prompts exactly as written unless the tester is fully blocked.
- Avoid coaching, teaching, or suggesting interface actions during task execution.
- Record behavior, hesitations, errors, recovery attempts, and direct quotes.
- Only answer clarifying questions with neutral restatements of the task when possible.
- Do not defend the product or interpret intent on behalf of the interface.

## Testing Script

1. Opening statement:
   "This session is testing the application, not you. Please think aloud as you work. I will ask you to complete a set of tasks using the current application flow. I may not answer immediately if doing so would change the test outcome."
2. Context statement:
   "Assume you are opening this application to inspect the available database structure and run safe read-only queries."
3. Permission check:
   Confirm the tester is comfortable proceeding and being observed.
4. Task execution:
   Read each required task one at a time and allow the tester to work without interruption.
5. Wrap-up:
   Ask the post-test reflection questions after all tasks are complete or the session is stopped.

## Required Task Flow

### Task 1: Launch and readiness check

Prompt:
"Open the application and tell me when you believe it is ready for use."

Expected coverage:

- health status
- first-run guidance
- overall readiness judgment

### Task 2: Schema exploration using CrimeSceneReport

Prompt:
"Use the application to inspect the `CrimeSceneReport` table and describe what you learn from the schema explorer."

Expected coverage:

- schema explorer discoverability
- table selection flow
- column-level comprehension

### Task 3: Run `SELECT DB_NAME() AS CurrentDatabase`

Prompt:
"Run this query and tell me what result you expect before you submit it: `SELECT DB_NAME() AS CurrentDatabase`."

Expected coverage:

- safe query entry
- expectation setting
- interpretation of normalized query results

### Task 4: Run `SELECT TOP 10 * FROM CrimeSceneReport`

Prompt:
"Run this query and review the returned results: `SELECT TOP 10 * FROM CrimeSceneReport`."

Expected coverage:

- table-specific query execution
- result readability
- row and column scanning

### Task 5: Review query history

Prompt:
"Use the application to review the queries you have already run."

Expected coverage:

- query history discoverability
- understanding of historical records
- ability to confirm prior activity

### Task 6: Run `DELETE FROM CrimeSceneReport` and confirm safety blocking

Prompt:
"Attempt to run this query and explain what you think the application should do: `DELETE FROM CrimeSceneReport`."

Expected coverage:

- safety expectations
- blocked unsafe action handling
- trust in read-only safeguards

## Observation Checklist

- Did the tester recognize when the application was ready to use?
- Did the tester notice and use the first-run guidance?
- Did the tester locate `CrimeSceneReport` without facilitator help?
- Did the tester understand what the schema explorer was showing?
- Did the tester enter each required query without syntax-related confusion caused by the UI?
- Did the tester understand the result of `SELECT DB_NAME() AS CurrentDatabase`?
- Did the tester successfully read and interpret the `CrimeSceneReport` query results?
- Did the tester find query history without prompting?
- Did the tester understand what query history records represent?
- Did the tester expect the unsafe `DELETE` query to be blocked?
- Did the tester understand the blocking response when the unsafe query was rejected?
- Where did the tester pause, backtrack, misread labels, or ask for clarification?

## Success Criteria

- The tester completes Tasks 1 through 6 without facilitator instruction on where to click or what control to use.
- The tester correctly identifies that the application is intended for safe read-only query execution.
- The tester can inspect `CrimeSceneReport`, run the two required `SELECT` statements, and review query history.
- The tester observes that `DELETE FROM CrimeSceneReport` is blocked and can describe that behavior as intentional safety protection.
- Any failures, hesitations, or misunderstandings are captured as observed evidence rather than inferred redesign requests.

## Issue Severity Definitions

- Blocker: prevents task completion or causes a false understanding of system safety or readiness
- High: task completes only with substantial hesitation, repeated failed attempts, or facilitator intervention
- Medium: task completes, but the tester shows notable confusion, misreads key information, or loses confidence
- Low: cosmetic or wording friction that does not materially affect task completion
- Deferred: observation is valid but outside the current first usable flow or not actionable without more evidence

## Data To Collect

- Session date and duration
- Tester role and prior familiarity level
- Runtime environment details
- Completion outcome for each task
- Time on task for each step when practical
- Misclicks, backtracks, or retries
- Clarifying questions asked by the tester
- Notable pauses or signs of uncertainty
- Direct quotes
- Observed issues with severity and affected area
- Facilitator summary of overall outcome

## Post-Test Reflection Questions

- What part of the application felt easiest to understand?
- What part of the application felt least clear?
- At what point, if any, were you unsure what to do next?
- How confident were you that your queries were safe to run?
- How clear was the difference between schema exploration, query execution, results, and history?
- What did you expect to happen when you tried `DELETE FROM CrimeSceneReport`?
- Is there anything in the current flow that made you hesitate or double-check yourself?

## Follow-Up Workflow

1. Record observations in [User-Testing-Observation-Template.md](/D:/GitHub-Repos/SequelCityWeb/docs/03-user-testing/User-Testing-Observation-Template.md) immediately after each session.
2. Separate confirmed observations from assumptions or solution ideas.
3. Group issues by task, severity, and repeated pattern across sessions.
4. Compare findings against existing runtime notes in [First-Launch-Issue-Triage.md](/D:/GitHub-Repos/SequelCityWeb/docs/02-runtime/First-Launch-Issue-Triage.md).
5. Only propose future UX work packages when supported by repeated structured testing evidence or a confirmed blocker.
# Evidence Collection Reference

Use [Session-Data-Collection-Guide.md](./Session-Data-Collection-Guide.md) before running Session-002 or Session-003. Observation reports and any cross-session analysis must be deferred until the required session evidence has been captured in the corresponding evidence template.
