# structured-user-testing-plan-and-observation-protocol

## Objective

Create a structured user testing plan and observation protocol for the first usable Sequel City Web Detective application flow, focused on schema exploration, safe SQL execution, result interpretation, and query history review.

## Scope

### In Scope

- Create a structured user testing plan
- Define tester profile and testing context
- Define first usable task flow
- Define observation checklist
- Define success criteria
- Define issue severity levels
- Define post-test reflection questions
- Define facilitator notes
- Create a reusable user testing results template
- Keep testing focused on observed user behavior, not speculative redesign

### Out of Scope

- No frontend code changes
- No backend code changes
- No UI redesign
- No UX implementation
- No new product features
- No database changes
- No automated testing framework
- No AI, LLM, or heuristic behavior
- No formal grading rubric changes

## Files Allowed to Change

- docs/03-user-testing/Structured-User-Testing-Plan.md
- docs/03-user-testing/User-Testing-Observation-Template.md
- docs/02-runtime/First-Launch-Issue-Triage.md
- docs/02-runtime/Frontend-First-Launch-Validation.md

If docs/03-user-testing does not exist, create it.

## Constraints

- Documentation-only work package
- Must not change application code
- Must not change backend contracts
- Must not change frontend behavior
- Must not modify database files
- Must not modify SSOT files
- Must focus only on the currently working application
- Must not invent user feedback
- Must not recommend design changes without observed evidence
- Must not introduce AI or heuristic behavior

## Required Behavior

1. Create structured user testing plan

Create:

docs/03-user-testing/Structured-User-Testing-Plan.md

The document must include:

- Purpose
- Testing goals
- Tester profile
- Prerequisites
- Environment setup
- Facilitator role
- Testing script
- Task list
- Observation checklist
- Success criteria
- Issue severity definitions
- Data to collect
- Post-test reflection questions
- Follow-up workflow

2. Testing goals

The testing plan must evaluate whether a first-time user can:

- Confirm the app is connected and ready
- Understand the first-run guidance
- Use the schema explorer to inspect tables and columns
- Enter and run a safe SELECT query
- Interpret normalized query results
- Review query history
- Understand blocked-query feedback if unsafe SQL is attempted

3. Tester profile

The plan must support testers such as:

- instructor/developer self-test
- peer reviewer
- student user with basic SQL experience

4. Required task flow

The plan must include these tasks:

Task 1: Launch and readiness check

- Open the frontend
- Review first-run guidance
- Confirm health status

Task 2: Schema exploration

- Locate the CrimeSceneReport table
- Inspect its columns
- Identify at least one primary key and one foreign key indicator

Task 3: Basic query execution

Run:

SELECT DB_NAME() AS CurrentDatabase

Expected:

- query succeeds
- result table displays CurrentDatabase
- row count is visible

Task 4: Data query execution

Run:

SELECT TOP 10 * FROM CrimeSceneReport

Expected:

- query succeeds
- multiple columns display
- row count is visible

Task 5: Query history review

- Refresh or inspect query history
- Confirm previous queries appear
- Confirm outcome, timestamp, row count, and execution time are visible

Task 6: Safety feedback check

Run an unsafe query such as:

DELETE FROM CrimeSceneReport

Expected:

- query is blocked
- backend safety message displays
- user understands that only safe read-only SELECT queries are allowed

5. Observation checklist

The plan must include checklist items for:

- Can the user identify system readiness?
- Can the user locate the schema explorer?
- Can the user select or inspect a table?
- Can the user determine column meaning from the display?
- Can the user find where to enter SQL?
- Can the user understand that SQL is validated by the backend?
- Can the user run a valid SELECT query?
- Can the user interpret results?
- Can the user locate query history?
- Can the user understand blocked-query feedback?
- Where does the user hesitate?
- What wording causes confusion?
- What UI area draws attention first?
- What issue, if any, blocks task completion?

6. Success criteria

The plan must define success as:

- User completes the main flow without facilitator intervention
- User can explain what the schema explorer is showing
- User can run at least one safe SELECT query
- User can interpret the result table
- User can locate query history
- User understands why unsafe SQL is blocked

7. Issue severity definitions

Use:

- Blocker: prevents completion of the main testing flow
- High: requires facilitator intervention
- Medium: causes hesitation or confusion but user recovers
- Low: cosmetic or wording issue
- Deferred: valid suggestion outside current first usable flow

8. Create observation template

Create:

docs/03-user-testing/User-Testing-Observation-Template.md

The template must include:

- Session date
- Tester role
- Facilitator
- Environment
- Task completion table
- Observation notes
- Issue log
- Direct quotes
- Post-test responses
- Overall outcome
- Recommended follow-up WPs

9. Update runtime docs

Update:

docs/02-runtime/Frontend-First-Launch-Validation.md

Add a reference to the structured user testing plan.

Update:

docs/02-runtime/First-Launch-Issue-Triage.md

Add a note that structured user testing is the next source of evidence for future UX changes.

## Acceptance Criteria

1. docs/03-user-testing/Structured-User-Testing-Plan.md exists.
2. docs/03-user-testing/User-Testing-Observation-Template.md exists.
3. Testing plan includes purpose and goals.
4. Testing plan defines tester profile.
5. Testing plan includes prerequisites and environment setup.
6. Testing plan includes facilitator role.
7. Testing plan includes task flow.
8. Task flow includes launch and readiness check.
9. Task flow includes schema exploration.
10. Task flow includes SELECT DB_NAME() query.
11. Task flow includes SELECT TOP 10 query.
12. Task flow includes query history review.
13. Task flow includes unsafe SQL safety check.
14. Observation checklist is included.
15. Success criteria are included.
16. Issue severity definitions are included.
17. Post-test reflection questions are included.
18. Observation template includes task completion table.
19. Observation template includes issue log.
20. Observation template includes direct quotes section.
21. Observation template includes recommended follow-up WP section.
22. Frontend first-launch validation doc references the testing plan.
23. First-launch issue triage doc notes that future UX changes should be based on structured testing evidence.
24. No frontend code is changed.
25. No backend code is changed.
26. No database files are changed.
27. No SSOT files are changed.
28. No AI, LLM, or heuristic behavior is introduced.

## Codex Prompt

You are implementing WP-021 for the Sequel City Web Detective project.

Goal:
Create a structured user testing plan and observation protocol for the first usable application flow.

Context:
The application now launches successfully and supports the core browser-based flow:

- health status
- first-run guidance
- schema explorer
- safe query execution
- normalized query results
- query history

WP-020 improved readability after first launch. WP-021 must prepare for structured user testing before additional UX changes are made.

Important:
This is documentation-only.
Do not change frontend code.
Do not change backend code.
Do not change database files.
Do not change SSOT files.
Do not invent user feedback.
Do not recommend redesigns unless tied to future observed evidence.

Tasks:

1. Create user testing folder if needed.

Create:

docs/03-user-testing

2. Create structured testing plan.

Create:

docs/03-user-testing/Structured-User-Testing-Plan.md

Include:

- Purpose
- Testing goals
- Tester profile
- Prerequisites
- Environment setup
- Facilitator role
- Testing script
- Required task flow
- Observation checklist
- Success criteria
- Issue severity definitions
- Data to collect
- Post-test reflection questions
- Follow-up workflow

3. Include these required testing tasks.

Task 1:
Launch and readiness check.

Task 2:
Schema exploration using CrimeSceneReport.

Task 3:
Run SELECT DB_NAME() AS CurrentDatabase.

Task 4:
Run SELECT TOP 10 * FROM CrimeSceneReport.

Task 5:
Review query history.

Task 6:
Run DELETE FROM CrimeSceneReport and confirm safety blocking.

4. Create observation template.

Create:

docs/03-user-testing/User-Testing-Observation-Template.md

Include:

- Session date
- Tester role
- Facilitator
- Environment
- Task completion table
- Observation notes
- Issue log
- Direct quotes
- Post-test responses
- Overall outcome
- Recommended follow-up WPs

5. Update runtime documentation.

Update:

docs/02-runtime/Frontend-First-Launch-Validation.md

Add a reference to:

docs/03-user-testing/Structured-User-Testing-Plan.md

Update:

docs/02-runtime/First-Launch-Issue-Triage.md

Add a note that future UX changes should be based on structured user testing evidence.

6. Do not change anything else.

Do not modify:

- apps/api
- apps/web
- database files
- docs/00-ssot

7. Verification.

Confirm only documentation files were changed.

## Gemini Audit Prompt

Audit WP-021 implementation for Sequel City Web Detective.

Goal:
Verify that structured user testing documentation was created without changing application code or introducing speculative UX changes.

Scope the audit to:

- docs/03-user-testing
- docs/02-runtime/Frontend-First-Launch-Validation.md
- docs/02-runtime/First-Launch-Issue-Triage.md
- git diff summary

Do not perform a full repository audit.

Check:

1. Does docs/03-user-testing/Structured-User-Testing-Plan.md exist?
2. Does docs/03-user-testing/User-Testing-Observation-Template.md exist?
3. Does the testing plan include purpose and goals?
4. Does the testing plan define tester profile?
5. Does the testing plan include prerequisites and environment setup?
6. Does the testing plan define facilitator role?
7. Does the testing plan include a task flow?
8. Does the task flow include launch and readiness check?
9. Does the task flow include schema exploration?
10. Does the task flow include SELECT DB_NAME() AS CurrentDatabase?
11. Does the task flow include SELECT TOP 10 * FROM CrimeSceneReport?
12. Does the task flow include query history review?
13. Does the task flow include unsafe SQL safety check?
14. Does the plan include observation checklist?
15. Does the plan include success criteria?
16. Does the plan include issue severity definitions?
17. Does the plan include post-test reflection questions?
18. Does the observation template include a task completion table?
19. Does the observation template include an issue log?
20. Does the observation template include direct quotes?
21. Does the observation template include recommended follow-up WPs?
22. Does Frontend-First-Launch-Validation.md reference the testing plan?
23. Does First-Launch-Issue-Triage.md state that future UX changes should be based on structured testing evidence?
24. Were frontend code files left unchanged?
25. Were backend code files left unchanged?
26. Were database files left unchanged?
27. Were SSOT files left unchanged?
28. Did the implementation avoid inventing user feedback?
29. Did the implementation avoid speculative redesign recommendations?
30. Was AI, LLM, or heuristic behavior avoided?

Report findings using this format:

Gemini Audit Results

Status: PASS or FAIL

Summary:

- ...

Evidence:

- ...

Issues Found:

- None

If issues exist, include:

Required Fixes:

1. ...
2. ...

## Codex Results

Created the WP-021 documentation set in [docs/03-user-testing/Structured-User-Testing-Plan.md](/D:/GitHub-Repos/SequelCityWeb/docs/03-user-testing/Structured-User-Testing-Plan.md) and [docs/03-user-testing/User-Testing-Observation-Template.md](/D:/GitHub-Repos/SequelCityWeb/docs/03-user-testing/User-Testing-Observation-Template.md). The plan includes the required purpose, goals, tester profile, setup, facilitator guidance, scripted task flow, observation checklist, success criteria, severity definitions, data capture, reflection questions, and follow-up workflow, with all six required tasks explicitly defined.

I also updated [docs/02-runtime/Frontend-First-Launch-Validation.md](/D:/GitHub-Repos/SequelCityWeb/docs/02-runtime/Frontend-First-Launch-Validation.md) to reference the structured testing plan, and [docs/02-runtime/First-Launch-Issue-Triage.md](/D:/GitHub-Repos/SequelCityWeb/docs/02-runtime/First-Launch-Issue-Triage.md) to state that future UX changes should be based on structured user testing evidence.

Verification: only documentation files were changed in my work. `git status` shows the two modified runtime docs and the new `docs/03-user-testing/` folder. There is also a pre-existing unrelated untracked file at [docs/01-work-packages/WP-021-structured-user-testing-plan-and-observation-protocol.md](/D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-021-structured-user-testing-plan-and-observation-protocol.md), which I did not modify.

## Gemini Audit Results

Gemini Audit Results

Status: PASS

Summary:

The audit of WP-021 confirms that the structured user testing documentation has been successfully implemented and integrated into the project. The documentation provides a rigorous, evidence-based framework for future UX evaluations without introducing premature code changes or speculative design decisions. All 30 audit criteria have been met, ensuring that the testing process is repeatable, objective, and focused on observed user behavior rather than assumptions.

Evidence:

- **Documentation Existence:** Both `docs/03-user-testing/Structured-User-Testing-Plan.md` and `docs/03-user-testing/User-Testing-Observation-Template.md` were created and verified.
- **Testing Plan Content:** The plan includes all required sections: Purpose, Goals, Tester Profile, Environment Setup, Facilitator Role, and a detailed 6-task script.
- **Task Flow Alignment:** The tasks specifically cover launch readiness, schema exploration, smoke-test queries (`SELECT DB_NAME()`), real data inspection (`SELECT TOP 10 * FROM CrimeSceneReport`), history review, and safety enforcement (`DELETE`).
- **Standardized Evaluation:** Success criteria, severity definitions, and post-test reflection questions are clearly defined to ensure consistent data collection.
- **Template Completeness:** The observation template provides structured fields for task completion, issue logging, direct quotes, and evidence-backed recommendations for future work packages.
- **Integration:** `Frontend-First-Launch-Validation.md` now references the testing plan, and `First-Launch-Issue-Triage.md` includes the mandatory statement that future UX changes must be evidence-driven.
- **Scope Integrity:** `glob` analysis confirms that no application code (frontend/backend), database scripts, or SSOT files were modified during this work package.

Issues Found:

- None

Required Fixes:

- None
  Warning: 256-color support not detected. Using a terminal with at least 256-color support is recommended for a better visual experience.
  Ripgrep is not available. Falling back to GrepTool.

## Final Decision

Status: Accepted

WP-021 is complete and executed exactly as intended.

You now have a **formal, structured, repeatable user testing system** in place before making further UX decisions. This is a major inflection point in the project.
