# user-testing-session-data-collection-package

## Objective

Create a structured user testing data collection package that prepares facilitators to collect real evidence for Session-002 and Session-003 before any additional observation reports or cross-session analysis are generated.

## Scope

### In Scope

- Create facilitator-ready data collection materials
- Create blank Session-002 and Session-003 evidence templates
- Define required evidence for each testing task
- Define note-taking expectations
- Define file naming conventions
- Define evidence quality standards
- Define what must be captured before analysis can occur
- Document that WP-025 was deferred because evidence was unavailable

### Out of Scope

- No execution of Session-002 or Session-003
- No completed observation reports
- No cross-session analysis
- No UI redesign
- No UX implementation
- No frontend code changes
- No backend code changes
- No database changes
- No speculative findings
- No AI, LLM, or heuristic behavior

## Files Allowed to Change

- docs/03-user-testing/Session-Data-Collection-Guide.md
- docs/03-user-testing/Session-002-Evidence-Capture.md
- docs/03-user-testing/Session-003-Evidence-Capture.md
- docs/03-user-testing/User-Testing-Observation-Template.md
- docs/03-user-testing/Structured-User-Testing-Plan.md
- docs/01-work-packages/WP-025-additional-user-testing-sessions-and-cross-session-analysis.md

Only update WP-025 if needed to mark it clearly as deferred due to missing evidence.

## Constraints

- Documentation-only work package
- Must not create completed Session-002 or Session-003 observation reports
- Must not create cross-session analysis
- Must not invent user behavior
- Must not infer findings
- Must not modify application code
- Must not modify backend code
- Must not modify frontend code
- Must not modify database files
- Must not modify SSOT files
- Must preserve evidence-first testing discipline

## Required Behavior

1. Create data collection guide

Create:

docs/03-user-testing/Session-Data-Collection-Guide.md

The guide must include:

- Purpose
- When to use this guide
- Required materials
- Facilitator responsibilities
- Observer responsibilities
- Evidence collection rules
- Session setup checklist
- During-session note-taking guidance
- After-session cleanup checklist
- Required evidence before analysis
- File naming conventions
- Quality standards for observation notes
- Common evidence collection mistakes to avoid

2. Evidence collection rules

The guide must state:

- Record only observed behavior
- Separate observation from interpretation
- Capture direct quotes when possible
- Capture hesitation or confusion points
- Capture whether facilitator help was required
- Capture task outcome
- Do not invent findings
- Do not generalize from a single tester
- Do not propose solutions during note capture

3. Required evidence per session

For each session, the facilitator must capture:

- Tester role
- Session date
- Environment
- Browser used
- Backend/frontend startup state
- Whether app launched successfully
- Whether database/schema status was healthy
- Task completion outcome for all six tasks
- Notes for each task
- Direct quotes
- Issues observed
- Post-test responses
- Overall outcome

4. Create Session-002 evidence capture template

Create:

docs/03-user-testing/Session-002-Evidence-Capture.md

The template must include blank sections for:

- Session metadata
- Environment
- Facilitator
- Tester role
- Task evidence table
- Observation notes
- Direct quotes
- Issue candidates
- Post-test responses
- Overall session outcome
- Evidence completeness checklist

5. Create Session-003 evidence capture template

Create:

docs/03-user-testing/Session-003-Evidence-Capture.md

Use the same structure as Session-002 but clearly labeled for Session-003.

6. Task evidence table

Each evidence capture file must include all six required tasks:

- Launch and readiness check
- Schema exploration
- SELECT DB_NAME() AS CurrentDatabase
- SELECT TOP 10 * FROM CrimeSceneReport
- Query history review
- Unsafe SQL safety check using DELETE FROM CrimeSceneReport

For each task include fields for:

- Completed: Yes / No / With Help
- Approximate time
- Observed behavior
- Facilitator help required
- Direct quote
- Issue candidate

7. Update observation template if needed

Update:

docs/03-user-testing/User-Testing-Observation-Template.md

Only if needed to better align with the new evidence capture templates.

8. Update structured testing plan if needed

Update:

docs/03-user-testing/Structured-User-Testing-Plan.md

Add a short reference to the new data collection guide.

9. Mark WP-025 as deferred if needed

Update:

docs/01-work-packages/WP-025-additional-user-testing-sessions-and-cross-session-analysis.md

If present, clearly record that WP-025 was deferred because Session-002 and Session-003 evidence did not yet exist.

Do not rewrite it as accepted.

10. Verification

Confirm only documentation files changed.

## Acceptance Criteria

1. Session-Data-Collection-Guide.md exists.
2. Session-002-Evidence-Capture.md exists.
3. Session-003-Evidence-Capture.md exists.
4. Data collection guide defines facilitator responsibilities.
5. Data collection guide defines observer responsibilities.
6. Data collection guide defines evidence collection rules.
7. Data collection guide defines required evidence before analysis.
8. Data collection guide includes file naming conventions.
9. Data collection guide includes evidence quality standards.
10. Session-002 template includes session metadata.
11. Session-003 template includes session metadata.
12. Both templates include all six required tasks.
13. Both templates include task completion fields.
14. Both templates include observation notes.
15. Both templates include direct quotes.
16. Both templates include issue candidate sections.
17. Both templates include post-test responses.
18. Both templates include evidence completeness checklist.
19. Structured testing plan references the data collection guide.
20. WP-025 is marked deferred if the WP file exists.
21. No completed Session-002 report is created.
22. No completed Session-003 report is created.
23. No cross-session analysis report is created.
24. No frontend code is modified.
25. No backend code is modified.
26. No database files are modified.
27. No SSOT files are modified.
28. No speculative findings are introduced.
29. No AI, LLM, or heuristic behavior is introduced.

## Codex Prompt

You are implementing WP-026 for the Sequel City Web Detective project.

Goal:
Create a user testing data collection package so Session-002 and Session-003 can be conducted with real evidence before observation reports or cross-session analysis are generated.

Context:
WP-025 failed correctly because Session-002 and Session-003 evidence did not exist. The project must not fabricate user testing reports. This work package prepares blank evidence collection materials for future real sessions.

Important:
This is documentation-only.
Do not modify frontend code.
Do not modify backend code.
Do not modify database files.
Do not modify SSOT files.
Do not create completed Session-002 or Session-003 observation reports.
Do not create cross-session analysis.
Do not invent user behavior.
Do not infer findings.

TASK 1: Create data collection guide

Create:

docs/03-user-testing/Session-Data-Collection-Guide.md

Include:

- purpose
- when to use this guide
- required materials
- facilitator responsibilities
- observer responsibilities
- evidence collection rules
- session setup checklist
- during-session note-taking guidance
- after-session cleanup checklist
- required evidence before analysis
- file naming conventions
- quality standards for observation notes
- common evidence collection mistakes to avoid

TASK 2: Evidence rules

The guide must clearly state:

- record only observed behavior
- separate observation from interpretation
- capture direct quotes when possible
- capture hesitation or confusion points
- capture whether facilitator help was required
- capture task outcome
- do not invent findings
- do not generalize from a single tester
- do not propose solutions during note capture

TASK 3: Create Session-002 blank evidence template

Create:

docs/03-user-testing/Session-002-Evidence-Capture.md

Include blank sections for:

- session metadata
- environment
- facilitator
- tester role
- task evidence table
- observation notes
- direct quotes
- issue candidates
- post-test responses
- overall session outcome
- evidence completeness checklist

TASK 4: Create Session-003 blank evidence template

Create:

docs/03-user-testing/Session-003-Evidence-Capture.md

Use the same structure as Session-002, clearly labeled for Session-003.

TASK 5: Required task table

Both evidence capture templates must include these six tasks:

- Launch and readiness check
- Schema exploration
- SELECT DB_NAME() AS CurrentDatabase
- SELECT TOP 10 * FROM CrimeSceneReport
- Query history review
- Unsafe SQL safety check using DELETE FROM CrimeSceneReport

For each task include blank fields for:

- Completed: Yes / No / With Help
- Approximate time
- Observed behavior
- Facilitator help required
- Direct quote
- Issue candidate

TASK 6: Update related testing docs

Update:

docs/03-user-testing/Structured-User-Testing-Plan.md

Add a short reference to:

docs/03-user-testing/Session-Data-Collection-Guide.md

Update:

docs/03-user-testing/User-Testing-Observation-Template.md

Only if needed to align with the evidence capture workflow.

TASK 7: Mark WP-025 as deferred if present

If this file exists:

docs/01-work-packages/WP-025-additional-user-testing-sessions-and-cross-session-analysis.md

Update its Final Decision or relevant status text to clearly state:

Status: Deferred

Reason:
Session-002 and Session-003 evidence was not available, so the required reports and cross-session analysis could not be completed without fabrication.

Do not mark WP-025 as accepted.

TASK 8: Verification

Confirm only documentation files were changed.

END OF TASK

## Gemini Audit Prompt

Audit WP-026 implementation for Sequel City Web Detective.

Goal:
Verify that the user testing data collection package was created without fabricating sessions, generating analysis, or changing application code.

Scope the audit to:

- docs/03-user-testing
- docs/01-work-packages/WP-025-additional-user-testing-sessions-and-cross-session-analysis.md if changed
- git diff summary

Do not perform a full repository audit.

Check:

1. Does Session-Data-Collection-Guide.md exist?
2. Does Session-002-Evidence-Capture.md exist?
3. Does Session-003-Evidence-Capture.md exist?
4. Does the data collection guide define facilitator responsibilities?
5. Does the data collection guide define observer responsibilities?
6. Does the guide define evidence collection rules?
7. Does the guide define required evidence before analysis?
8. Does the guide include file naming conventions?
9. Does the guide include quality standards?
10. Does the Session-002 template include session metadata?
11. Does the Session-003 template include session metadata?
12. Do both templates include all six required tasks?
13. Do both templates include task completion fields?
14. Do both templates include observation notes?
15. Do both templates include direct quotes?
16. Do both templates include issue candidate sections?
17. Do both templates include post-test responses?
18. Do both templates include evidence completeness checklists?
19. Does Structured-User-Testing-Plan.md reference the data collection guide?
20. If WP-025 was changed, is it marked deferred rather than accepted?
21. Was a completed Session-002 report avoided?
22. Was a completed Session-003 report avoided?
23. Was cross-session analysis avoided?
24. Were frontend files left unchanged?
25. Were backend files left unchanged?
26. Were database files left unchanged?
27. Were SSOT files left unchanged?
28. Were speculative findings avoided?
29. Was AI, LLM, or heuristic behavior avoided?

Report:

Gemini Audit Results

Status: PASS or FAIL

Summary:

- ...

Issues Found:

- None

If issues exist:

Required Fixes:

1. ...
2. ...

## Codex Results

Created the WP-026 documentation package and kept the changes to documentation paths only.

Added:

- [Session-Data-Collection-Guide.md](/C:/GitHub-Repos/SequelCityWeb/docs/03-user-testing/Session-Data-Collection-Guide.md)
- [Session-002-Evidence-Capture.md](/C:/GitHub-Repos/SequelCityWeb/docs/03-user-testing/Session-002-Evidence-Capture.md)
- [Session-003-Evidence-Capture.md](/C:/GitHub-Repos/SequelCityWeb/docs/03-user-testing/Session-003-Evidence-Capture.md)

Updated:

- [Structured-User-Testing-Plan.md](/C:/GitHub-Repos/SequelCityWeb/docs/03-user-testing/Structured-User-Testing-Plan.md)
- [User-Testing-Observation-Template.md](/C:/GitHub-Repos/SequelCityWeb/docs/03-user-testing/User-Testing-Observation-Template.md)
- [WP-025-additional-user-testing-sessions-and-cross-session-analysis.md](/C:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-025-additional-user-testing-sessions-and-cross-session-analysis.md)

The guide includes the evidence rules you specified, both session templates include the six required tasks with blank evidence fields, and WP-025 is now marked `Status: Deferred` with the required non-fabrication reason.

Verification: the edits I applied were limited to documentation files under `docs/`. I was not able to run an independent `git status` check in this environment because the shell runner was blocked, but no frontend, backend, database, or SSOT files were modified by my patches.

## Gemini Audit Results

Gemini Audit Results

Status: PASS

Summary:

The audit of Work Package 026 (WP-026) confirms that the user testing data collection package was correctly implemented without fabricating session data or modifying application code. All required documentation deliverables exist in the `docs/03-user-testing` directory, including the `Session-Data-Collection-Guide.md` and blank evidence capture templates for Session-002 and Session-003. These templates correctly include the six required tasks and all necessary evidence fields (metadata, task completion, observation notes, direct quotes, and checklists). The `Structured-User-Testing-Plan.md` was updated to reference the new guide, and WP-025 was appropriately marked as deferred due to missing evidence, ensuring project integrity. No changes were made to the frontend, backend, database, or SSOT files, and all materials remain grounded in process design rather than speculative or AI-generated findings.

Issues Found:

- None

Strategic Intent: Completed the audit of WP-026 for Sequel City Web Detective, confirming all documentation requirements were met and project integrity was maintained without fabricating data or changing code.
Warning: 256-color support not detected. Using a terminal with at least 256-color support is recommended for a better visual experience.
Ripgrep is not available. Falling back to GrepTool.

## Final Decision

Status: Accepted

WP-026 is complete and satisfies the evidence collection requirements.

The implementation correctly creates a documentation-only user testing data collection package without fabricating Session-002 or Session-003 results. The new guide and blank evidence capture templates establish the required process for collecting real observations before any future reports or cross-session analysis are created.

WP-025 was correctly marked as deferred because the required evidence did not exist, preserving the project’s evidence-first testing discipline.

The work stayed within scope:

* No completed Session-002 report was created
* No completed Session-003 report was created
* No cross-session analysis was created
* No frontend code changed
* No backend code changed
* No database files changed
* No SSOT files changed
* No speculative findings were introduced

No violations of scope, constraints, or project integrity were identified.
