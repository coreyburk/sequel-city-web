# contributor-development-workflow-system

## Objective

Create a contributor development workflow system that documents how structured work continues on Sequel City Web Detective using work packages, SSOT governance, Codex implementation, Gemini audit, final decisions, and commit discipline.

## Scope

### In Scope

- Document the contributor workflow for continuing development
- Document the work package lifecycle
- Document how to create new work packages
- Document how to run Codex and Gemini through project scripts
- Document how to review Codex results
- Document how to review Gemini audit results
- Document when and how to write Final Decision sections
- Document commit message standards
- Document scope control and SSOT governance expectations
- Document recovery steps for failed Codex/Gemini runs
- Document common runner and prompt formatting pitfalls

### Out of Scope

- No application code changes
- No backend changes
- No frontend changes
- No database changes
- No install/runtime setup documentation beyond references
- No new automation scripts
- No script refactoring
- No SSOT changes unless a reference/index update already exists and is necessary
- No AI runtime behavior

## Files Allowed to Change

- docs/05-development-workflow/Contributor-Workflow-Guide.md
- docs/05-development-workflow/Work-Package-Lifecycle.md
- docs/05-development-workflow/Codex-Gemini-Execution-Guide.md
- docs/05-development-workflow/Commit-Message-Guide.md
- docs/05-development-workflow/Prompt-Formatting-Guidelines.md
- docs/02-runtime/Developer-Startup-Workflow.md
- docs/04-developer-setup/Developer-Installation-and-Configuration-Guide.md

If docs/05-development-workflow does not exist, create it.

## Constraints

- Documentation-only work package
- Must not modify application code
- Must not modify backend code
- Must not modify frontend code
- Must not modify database files
- Must not modify scripts
- Must not modify SSOT documents unless only adding a minimal reference is already standard
- Must document the current workflow as it exists
- Must not invent unimplemented tooling
- Must use copy/paste-ready commands
- Must emphasize scope discipline
- Must emphasize evidence-based audits
- Must preserve deterministic architecture principles
- Must not introduce runtime AI behavior

## Required Behavior

1. Create contributor workflow guide

Create:

docs/05-development-workflow/Contributor-Workflow-Guide.md

The guide must include:

- Purpose
- Audience
- Contributor prerequisites
- High-level development loop
- Branch and pull workflow
- Work package workflow overview
- Codex and Gemini responsibilities
- Review and acceptance expectations
- Commit and push expectations
- Links to related workflow documents

The high-level loop must include:

- pull latest changes
- verify working tree is clean
- create work package
- execute Codex
- execute Gemini audit
- review results
- update Final Decision
- commit accepted work
- push changes

2. Create work package lifecycle guide

Create:

docs/05-development-workflow/Work-Package-Lifecycle.md

The guide must document:

- What a work package is
- Why work packages are required
- Required WP sections:
  - Objective
  - Scope
  - Files Allowed to Change
  - Constraints
  - Required Behavior
  - Acceptance Criteria
  - Codex Prompt
  - Gemini Audit Prompt
  - Codex Results
  - Gemini Audit Results
  - Final Decision
- How to create a WP using the project script
- How WP numbers are auto-assigned by the script
- How to handle deferred or skipped work
- How to handle failed or partial WPs
- How to keep WPs tightly scoped
- How to avoid mixing unrelated work

Include the command:

powershell command:
scripts/new-lite-work-package.ps1 "short descriptive slug"

3. Create Codex/Gemini execution guide

Create:

docs/05-development-workflow/Codex-Gemini-Execution-Guide.md

The guide must document:

- Purpose of Codex in the workflow
- Purpose of Gemini in the workflow
- How to run the full pipeline
- How to run Codex only
- How to run Gemini only
- How to run no execution and only copy/review prompts
- How to interpret Codex Results
- How to interpret Gemini Audit Results
- How to respond to FAIL audits
- How to handle scope warnings
- How to handle environment limitations
- How to rerun after fixing prompt formatting

Include commands:

powershell command:
scripts/run-work-package.ps1 "work package slug" -Execute Full

powershell command:
scripts/run-work-package.ps1 "work package slug" -Execute Codex

powershell command:
scripts/run-work-package.ps1 "work package slug" -Execute Gemini

powershell command:
scripts/run-work-package.ps1 "work package slug" -Execute None

4. Create commit message guide

Create:

docs/05-development-workflow/Commit-Message-Guide.md

The guide must document the established commit message style:

- imperative title
- blank line
- bullet list of concrete implementation changes
- final bullet preserving architecture constraints where appropriate

Include examples based on project style.

Example format:

Title line:
Add structured user testing plan and observation protocol

Body bullets:

- Created structured user testing plan for first usable application flow
- Defined testing goals, tester profiles, prerequisites, and facilitator guidance
- Added observation checklist, success criteria, and issue severity definitions
- Preserved application code, backend contracts, database, and SSOT integrity

The guide must also explain:

- Commit only after Final Decision is accepted
- Prefer one cohesive commit per accepted WP
- Include WP documentation in the commit
- Do not commit failed or unresolved WPs unless intentionally documenting a blocked state

5. Create prompt formatting guidelines

Create:

docs/05-development-workflow/Prompt-Formatting-Guidelines.md

The guide must document formatting rules learned from actual runner failures:

- Use plain markdown or plain text
- Avoid malformed fenced code blocks copied from rendered UI
- Avoid code block attributes such as id values
- Avoid HTML fragments
- Avoid backslash-escaped quote examples in Codex prompts
- Avoid nested code fences where possible
- Prefer plain command descriptions when quoting causes runner issues
- Keep Codex prompts explicit but runner-safe
- Keep Gemini audits scoped to changed files unless a full audit is intentionally required
- Include source/scope boundaries in Gemini prompts

It must include known failure examples:

- unexpected argument px-0 data-start
- unexpected argument npm run dev workspace
- malformed prompt caused by escaped quotes

Do not include raw hidden UI markup beyond short illustrative text.

6. Update existing docs with references

Update:

docs/02-runtime/Developer-Startup-Workflow.md

Add a short reference to the contributor workflow docs for continuing development.

Update:

docs/04-developer-setup/Developer-Installation-and-Configuration-Guide.md

Add a short reference to contributor workflow docs after installation/setup is complete.

7. Verification

Confirm:

- only documentation files were changed
- no app code changed
- no backend code changed
- no frontend code changed
- no database files changed
- no scripts changed
- documentation reflects current implemented scripts and workflow

## Acceptance Criteria

1. Contributor-Workflow-Guide.md exists.
2. Work-Package-Lifecycle.md exists.
3. Codex-Gemini-Execution-Guide.md exists.
4. Commit-Message-Guide.md exists.
5. Prompt-Formatting-Guidelines.md exists.
6. Contributor guide documents the high-level development loop.
7. Contributor guide references Codex and Gemini responsibilities.
8. Work package lifecycle guide lists all required WP sections.
9. Work package lifecycle guide documents auto-assigned WP numbers.
10. Work package lifecycle guide documents deferred or skipped work handling.
11. Codex/Gemini guide documents Full execution mode.
12. Codex/Gemini guide documents Codex-only execution mode.
13. Codex/Gemini guide documents Gemini-only execution mode.
14. Codex/Gemini guide documents None execution mode.
15. Codex/Gemini guide explains how to respond to failed audits.
16. Codex/Gemini guide explains scope warnings.
17. Commit guide matches established project commit style.
18. Commit guide includes imperative title and bullet body examples.
19. Commit guide states commits happen after accepted Final Decision.
20. Prompt formatting guide includes known runner pitfalls.
21. Prompt formatting guide warns against escaped quote examples.
22. Prompt formatting guide warns against malformed code block attributes and hidden HTML fragments.
23. Runtime/developer setup docs reference the new contributor workflow docs.
24. No frontend code is modified.
25. No backend code is modified.
26. No database files are modified.
27. No scripts are modified.
28. No SSOT files are modified unless only a minimal reference update is necessary.
29. No AI runtime behavior is introduced.

## Codex Prompt

You are implementing WP-024 for the Sequel City Web Detective project.

Goal:
Create contributor development workflow documentation that explains how to continue work on the project using work packages, Codex, Gemini, Final Decisions, and commit discipline.

Context:
The application is installed, runnable, and documented. The next documentation need is contributor workflow: how to continue development safely.

Important:
This is documentation-only.
Do not modify application code.
Do not modify backend code.
Do not modify frontend code.
Do not modify database files.
Do not modify scripts.
Do not modify SSOT files unless only adding a minimal reference is already standard.
Do not invent unimplemented tooling.

TASK 1: Create workflow docs folder

Create this folder if it does not already exist:

docs/05-development-workflow

TASK 2: Create contributor workflow guide

Create this file:

docs/05-development-workflow/Contributor-Workflow-Guide.md

Include:

- purpose
- audience
- prerequisites
- high-level development loop
- branch and pull guidance
- work package overview
- Codex role
- Gemini role
- review and acceptance expectations
- commit and push expectations
- links to the other workflow documents

The loop must include:

- pull latest changes
- check git status
- create a work package
- execute Codex and Gemini
- review results
- update Final Decision
- commit accepted work
- push

TASK 3: Create work package lifecycle guide

Create this file:

docs/05-development-workflow/Work-Package-Lifecycle.md

Include:

- definition of a work package
- why work packages are required
- required work package sections
- project script used to create a work package
- note that work package numbers are auto-assigned by the script
- how to handle deferred or skipped work
- how to handle failed work
- how to handle corrective work packages
- scope control guidance

Required work package sections to list:

- Objective
- Scope
- Files Allowed to Change
- Constraints
- Required Behavior
- Acceptance Criteria
- Codex Prompt
- Gemini Audit Prompt
- Codex Results
- Gemini Audit Results
- Final Decision

Document the create-work-package command without using quoted arguments.

Use this form:

scripts/new-lite-work-package.ps1 followed by a short descriptive slug argument

TASK 4: Create Codex and Gemini execution guide

Create this file:

docs/05-development-workflow/Codex-Gemini-Execution-Guide.md

Include:

- Codex purpose
- Gemini purpose
- Full mode
- Codex-only mode
- Gemini-only mode
- None mode
- how to interpret Codex Results
- how to interpret Gemini Audit Results
- what to do on PASS
- what to do on FAIL
- what to do with scope warnings
- what to do when environment limitations occur
- how to rerun after prompt formatting fixes

Document the run-work-package commands without quoted arguments.

Use these forms:

scripts/run-work-package.ps1 followed by a work package slug and Execute Full

scripts/run-work-package.ps1 followed by a work package slug and Execute Codex

scripts/run-work-package.ps1 followed by a work package slug and Execute Gemini

scripts/run-work-package.ps1 followed by a work package slug and Execute None

TASK 5: Create commit message guide

Create this file:

docs/05-development-workflow/Commit-Message-Guide.md

Document the established commit style:

- imperative title
- blank line
- bullet list of concrete changes
- final architecture or scope preservation bullet when appropriate

Include at least two examples based on existing project style.

Mention:

- commit after accepted Final Decision
- one cohesive commit per accepted work package
- include work package documentation in the commit
- do not commit unresolved failed work unless intentionally documenting a blocked state

TASK 6: Create prompt formatting guide

Create this file:

docs/05-development-workflow/Prompt-Formatting-Guidelines.md

Include:

- use plain markdown or plain text
- avoid malformed code blocks from copied rendered content
- avoid code block attributes
- avoid hidden HTML fragments
- avoid backslash-escaped quote examples in Codex prompts
- avoid nested code fences when possible
- prefer quote-free command descriptions if runner errors occur
- scope Gemini audits to changed files unless a full audit is required

Mention these known runner failure symptoms:

- unexpected argument px-0 data-start
- unexpected argument npm run dev workspace
- unexpected argument run
- unexpected argument descriptive
- Codex CLI exited with code 2 after prompt parsing problems

TASK 7: Update existing setup docs

Update this file:

docs/02-runtime/Developer-Startup-Workflow.md

Add a short reference:

For continuing development after the app is running, see docs/05-development-workflow/Contributor-Workflow-Guide.md.

Update this file:

docs/04-developer-setup/Developer-Installation-and-Configuration-Guide.md

Add a short reference to the contributor workflow guide after installation and validation.

TASK 8: Verification

Confirm only documentation files were changed.

Do not run application tests unless already standard for documentation-only work. If tests are not run, document that this was documentation-only and no app code changed.

END OF TASK

## Gemini Audit Prompt

Audit WP-024 implementation for Sequel City Web Detective.

Goal:
Verify that contributor development workflow documentation was created without changing application code or inventing unimplemented tooling.

Scope the audit to:

- docs/05-development-workflow
- docs/02-runtime/Developer-Startup-Workflow.md
- docs/04-developer-setup/Developer-Installation-and-Configuration-Guide.md
- git diff summary

Do not perform a full repository audit.

Check:

1. Does docs/05-development-workflow/Contributor-Workflow-Guide.md exist?
2. Does docs/05-development-workflow/Work-Package-Lifecycle.md exist?
3. Does docs/05-development-workflow/Codex-Gemini-Execution-Guide.md exist?
4. Does docs/05-development-workflow/Commit-Message-Guide.md exist?
5. Does docs/05-development-workflow/Prompt-Formatting-Guidelines.md exist?
6. Does the contributor guide document the development loop?
7. Does the contributor guide explain Codex and Gemini responsibilities?
8. Does the WP lifecycle guide list all required WP sections?
9. Does the WP lifecycle guide document auto-assigned WP numbers?
10. Does the WP lifecycle guide explain deferred or skipped work?
11. Does the Codex/Gemini guide document Full mode?
12. Does the Codex/Gemini guide document Codex-only mode?
13. Does the Codex/Gemini guide document Gemini-only mode?
14. Does the Codex/Gemini guide document None mode?
15. Does the Codex/Gemini guide explain what to do on PASS?
16. Does the Codex/Gemini guide explain what to do on FAIL?
17. Does the Codex/Gemini guide explain scope warnings?
18. Does the commit guide match the established commit message style?
19. Does the commit guide state commits happen after accepted Final Decision?
20. Does the prompt formatting guide document known runner pitfalls?
21. Does the prompt formatting guide warn against escaped quote examples?
22. Does the prompt formatting guide warn against malformed code block attributes and hidden HTML fragments?
23. Do setup/runtime docs reference the contributor workflow guide?
24. Were frontend files left unchanged?
25. Were backend files left unchanged?
26. Were database files left unchanged?
27. Were scripts left unchanged?
28. Were SSOT files left unchanged?
29. Did the implementation avoid inventing unimplemented tooling?
30. Was runtime AI behavior avoided?

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

Created the new workflow docs in [docs/05-development-workflow/Contributor-Workflow-Guide.md](/C:/GitHub-Repos/SequelCityWeb/docs/05-development-workflow/Contributor-Workflow-Guide.md), [Work-Package-Lifecycle.md](/C:/GitHub-Repos/SequelCityWeb/docs/05-development-workflow/Work-Package-Lifecycle.md), [Codex-Gemini-Execution-Guide.md](/C:/GitHub-Repos/SequelCityWeb/docs/05-development-workflow/Codex-Gemini-Execution-Guide.md), [Commit-Message-Guide.md](/C:/GitHub-Repos/SequelCityWeb/docs/05-development-workflow/Commit-Message-Guide.md), and [Prompt-Formatting-Guidelines.md](/C:/GitHub-Repos/SequelCityWeb/docs/05-development-workflow/Prompt-Formatting-Guidelines.md). I also added the requested contributor-workflow references to [Developer-Startup-Workflow.md](/C:/GitHub-Repos/SequelCityWeb/docs/02-runtime/Developer-Startup-Workflow.md) and [Developer-Installation-and-Configuration-Guide.md](/C:/GitHub-Repos/SequelCityWeb/docs/04-developer-setup/Developer-Installation-and-Configuration-Guide.md).

This was documentation-only work. I did not modify application, backend, frontend, database, or script files, and I did not run application tests because no app code changed. I could not run shell-based verification in this session because the command runner was blocked, but the edits I made were limited to the seven documentation files above.

## Gemini Audit Results

Gemini Audit Results

Status: PASS

Summary:

- Verified that all five new documentation files in `docs/05-development-workflow/` exist and contain the required content.
- Confirmed that the `Contributor Workflow Guide` correctly documents the development loop, Codex/Gemini roles, and review expectations.
- Confirmed that the `Work Package Lifecycle` guide lists all 11 required sections and documents auto-assigned numbers and deferred work handling.
- Confirmed that the `Codex And Gemini Execution Guide` documents all four runner modes (Full, Codex, Gemini, None) and provides guidance for PASS/FAIL/Warning outcomes.
- Verified that the `Commit Message Guide` matches the imperative title and bullet-list style and correctly instructs on the timing of commits.
- Verified that the `Prompt Formatting Guidelines` address known runner pitfalls, escaped quotes, and malformed code blocks.
- Confirmed that `docs/02-runtime/Developer-Startup-Workflow.md` and `docs/04-developer-setup/Developer-Installation-and-Configuration-Guide.md` were updated with references to the new contributor guide.
- Based on `Codex Results` and file structure analysis, application code, database files, and scripts remained unchanged.
- No unimplemented tooling was invented; the documentation refers to existing scripts in the `scripts/` directory.

Issues Found:

- None
  Warning: 256-color support not detected. Using a terminal with at least 256-color support is recommended for a better visual experience.
  Ripgrep is not available. Falling back to GrepTool.

## Final Decision

Status: Accepted

WP-024 is complete and satisfies the contributor development workflow documentation requirements.

The implementation creates a complete documentation system for continuing development on Sequel City Web Detective using work packages, Codex, Gemini, Final Decisions, and commit discipline. The new workflow docs correctly document the development loop, WP lifecycle, execution modes, audit response process, commit style, and prompt formatting pitfalls discovered during the project.

The work stayed within scope:

* No application code changed
* No backend code changed
* No frontend code changed
* No database files changed
* No scripts changed
* No SSOT files changed
* No unimplemented tooling was invented

No violations of scope, constraints, or architecture were identified.
