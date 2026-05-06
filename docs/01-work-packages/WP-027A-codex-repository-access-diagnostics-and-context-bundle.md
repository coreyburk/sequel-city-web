# codex-repository-access-diagnostics-and-context-bundle

## Objective

Fix the Codex workflow so Codex can reliably inspect required repository files before implementation.

Specifically, add a deterministic preflight/context-bundle path that verifies repository access and captures required files into the Work Package before Codex runs.

This prevents Codex from being blocked when shell access fails during documentation audits or multi-file implementation tasks.

---

## Scope

Update the Work Package execution workflow so a WP can declare required context files and have those files bundled into the WP before Codex execution.

This WP focuses on tooling reliability only.

It does not modify runtime application behavior.

---

## Files Allowed to Change

Allowed:

- scripts/run-work-package.ps1
- scripts/new-lite-work-package.ps1
- docs/05-development-workflow/*.md
- docs/01-work-packages/WP-027-ssot-governance-audit-and-normalization.md

Do Not Modify:

- apps/api/**
- apps/web/**
- database scripts
- docs/00-ssot/*.md, except through a later rerun of WP-027
- package files unless strictly required for script execution

---

## Constraints

- Do not change application runtime behavior
- Do not change backend logic
- Do not change frontend logic
- Do not modify SSOT content in this WP
- Do not treat bundled context as implementation output
- Keep the workflow deterministic and inspectable
- Preserve the Codex then Gemini then Final Decision workflow

Prompt formatting constraints:

- Use plain markdown only
- Avoid nested code fences inside generated prompts
- Avoid escaped quote sequences
- Avoid malformed markdown tables
- Avoid hidden HTML fragments

---

## Required Behavior

Add a repository access preflight and context bundling mechanism to the WP runner.

### 1. Repository Access Preflight

Before executing Codex, the runner must verify that the required files can be read by PowerShell.

At minimum, verify:

- repository root exists
- work package file exists
- declared context files exist
- declared context files are readable

If preflight fails, the runner must stop before Codex execution and print a clear error.

---

### 2. Required Context File Declaration

Support a simple section in a Work Package named:

## Required Context Files

The section may contain one file path per line, for example:

docs/00-ssot/SSOT-Index.md
docs/00-ssot/SSOT-Architecture.md
docs/00-ssot/SSOT-SQL-Safety-Rules.md

The runner must parse this section when present.

---

### 3. Context Bundle Injection

When running Codex, the runner must append a read-only context bundle to the Codex prompt.

The bundle must include:

- file path
- full file contents
- clear separators between files

The bundle must be labeled as read-only source context.

The bundle must not be written into the implementation result sections unless explicitly requested.

---

### 4. Safe Failure Behavior

If any required context file cannot be read:

- do not run Codex
- print the unreadable path
- explain that the WP requires repository context before execution
- leave the WP unchanged except for any intentionally logged failure output already supported by the runner

---

### 5. Documentation Update

Update the workflow documentation to explain:

- when to use Required Context Files
- why documentation audit WPs should declare context files
- how this avoids Codex shell/workspace access failures
- how this differs from implementation output

---

## Acceptance Criteria

- Runner detects a Required Context Files section
- Runner reads each declared file before Codex execution
- Runner fails clearly if a required file is missing or unreadable
- Runner appends readable context to the Codex prompt
- Codex receives SSOT file contents without needing shell access
- Runtime application files are untouched
- Workflow documentation explains the new mechanism
- WP-027 is updated to declare the nine SSOT files as required context
- Gemini audit prompt remains compatible with the workflow

---

## Codex Prompt

You are implementing WP-027A for the Sequel City Web Detective project.

Retry the work package.

Important diagnostic note:
A previous shell command failed once with CreateProcessAsUserW failed: 5, but a later Get-Location command succeeded from the same repo at C:\GitHub-Repos\SequelCityWeb.

If an initial shell command fails with CreateProcessAsUserW failed: 5, retry the same command once before declaring the repo inaccessible.

Before making changes:

1. Run Get-Location.
2. Run Get-ChildItem docs/00-ssot.
3. Read the required SSOT files.
4. Proceed only if those reads succeed.

Do not assume failure from a single transient shell launch error.

Objective:
Improve the Work Package runner so Codex receives required repository context files directly in the prompt when a WP declares them.

Problem:
Codex was able to read the Work Package but failed to inspect docs/00-ssot/ through shell access. The runner should support bundling required context files into the Codex prompt before Codex execution.

Implement support for a Work Package section named:

Required Context Files

The section contains one repository-relative file path per line.

Required behavior:

1. Parse the Required Context Files section if present.
2. Before running Codex, verify each listed file exists and is readable.
3. If any file is missing or unreadable, stop before running Codex and print a clear error.
4. If all files are readable, append their contents to the Codex prompt as read-only context.
5. Include clear file path headers and separators in the context bundle.
6. Do not modify runtime application files.
7. Update workflow documentation explaining how to use Required Context Files.
8. Update WP-027 so it declares all nine docs/00-ssot files as required context.

Required context files to add to WP-027:

docs/00-ssot/SSOT-AI-Agent-Boundaries.md
docs/00-ssot/SSOT-Architecture.md
docs/00-ssot/SSOT-Case-Progression.md
docs/00-ssot/SSOT-Database-Schema.md
docs/00-ssot/SSOT-Development-Workflow.md
docs/00-ssot/SSOT-Index.md
docs/00-ssot/SSOT-Project-Vision.md
docs/00-ssot/SSOT-SQL-Safety-Rules.md
docs/00-ssot/SSOT-UI-UX-Experience.md

Constraints:

- Do not edit docs/00-ssot files in this WP.
- Do not change frontend or backend runtime code.
- Do not introduce new package dependencies unless absolutely necessary.
- Preserve existing runner behavior when Required Context Files is absent.
- Keep output concise and readable.

Formatting requirements:

- Use simple markdown only.
- Avoid nested code fences in generated prompt text.
- Avoid escaped quote sequences.
- Avoid hidden HTML.
- Avoid malformed markdown tables.

---

## Gemini Audit Prompt

Audit WP-027A repository access diagnostics and context bundle implementation.

Verify:

1. Only approved files were modified.
2. No frontend runtime files changed.
3. No backend runtime files changed.
4. docs/00-ssot files were not modified.
5. The runner supports a Required Context Files section.
6. The runner verifies required files before Codex execution.
7. The runner fails before Codex if required files are missing or unreadable.
8. The runner appends required file contents to the Codex prompt as read-only context.
9. Existing runner behavior is preserved when Required Context Files is absent.
10. Workflow documentation explains the new mechanism.
11. WP-027 now declares all nine SSOT files as required context.

Also validate:

- prompt formatting remains quote-safe
- no nested code fence hazards were introduced
- no speculative runtime behavior was added
- no application behavior was changed

Flag:

- incomplete parsing
- unclear failure messages
- accidental SSOT edits
- runtime source changes
- brittle path handling
- prompt formatting hazards

---

## Codex Results

SUCCESS: The process with PID 59412 (child process of PID 36324) has been terminated.
SUCCESS: The process with PID 36324 (child process of PID 28080) has been terminated.
SUCCESS: The process with PID 28080 (child process of PID 52804) has been terminated.
SUCCESS: The process with PID 52804 (child process of PID 14928) has been terminated.
I retried the required initial commands once as instructed, but both attempts failed with:

`CreateProcessAsUserW failed: 5`

Because the required pre-change checks did not succeed, I did not read files and did not modify the repository.

## Gemini Audit Results

The audit of the repository access diagnostics and context bundle implementation (**WP-027A**) has been completed. The implementation is found to be **missing/incomplete**.

### Audit Summary

The audit confirms that **WP-027A has not been implemented**. The `Codex Results` recorded in the work package document indicate that the implementation attempt was blocked by a system environment failure (`CreateProcessAsUserW failed: 5`). As a result, no files were modified, and the requested features are not present in the codebase.

### Verification against Audit Points

1. **Only approved files were modified**: **PASS** (No files were modified by Codex).
2. **No frontend runtime files changed**: **PASS** (Verified via file system check).
3. **No backend runtime files changed**: **PASS** (Verified via file system check).
4. **docs/00-ssot files were not modified**: **PASS** (Verified via file system check).
5. **The runner supports a Required Context Files section**: **FAIL**. `scripts/run-work-package.ps1` does not contain parsing logic for this section.
6. **The runner verifies required files before Codex execution**: **FAIL**. Preflight verification logic is missing.
7. **The runner fails before Codex if required files are missing or unreadable**: **FAIL**. Implementation is missing.
8. **The runner appends required file contents to the Codex prompt as read-only context**: **FAIL**. Bundling logic is missing.
9. **Existing runner behavior is preserved when Required Context Files is absent**: **PASS** (The runner remains in its original state).
10. **Workflow documentation explains the new mechanism**: **FAIL**. No updates found in `docs/05-development-workflow/`.
11. **WP-027 now declares all nine SSOT files as required context**: **FAIL**. `WP-027` remains unchanged and does not contain the required context declarations.

### Validation & Flags

* **Prompt Formatting**: Compatibility could not be validated as no prompt generation logic was implemented.
* **Nested Code Fences**: No hazards introduced (no changes made).
* **Incomplete Parsing**: **FLAGGED**. The runner lacks any parsing for the new WP section.
* **Unclear Failure Messages**: **FLAGGED**. The runner does not yet provide the requested preflight failure diagnostics.
* **Accidental Edits**: None detected; the repository remains in its previous state.
* **Brittle Path Handling**: **FLAGGED**. The missing implementation prevents verification of path robustness.

### Conclusion

**Verdict: FAIL**

Work Package **WP-027A** cannot be accepted. The implementation phase failed to start due to environment restrictions. To proceed, the blocking issue must be resolved, or the implementation must be performed in an environment with valid process execution rights.
Warning: 256-color support not detected. Using a terminal with at least 256-color support is recommended for a better visual experience.
Ripgrep is not available. Falling back to GrepTool.

## Final Decision

Rejected / Not Approved.

Reason:
Codex retried the required repository inspection commands, but both attempts failed with `CreateProcessAsUserW failed: 5`.

No repository files were read.
No repository files were modified.

This confirms the blocker is still the Codex execution environment used by the WP runner, not the SSOT documents themselves.

Required next step:
Pause WP-027 and WP-027A. Diagnose the Codex runner invocation and process cleanup behavior before attempting more documentation work.

No commit should be made.
