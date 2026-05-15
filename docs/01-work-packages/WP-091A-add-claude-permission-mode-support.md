# WP-091A: add-claude-permission-mode-support.md

## Objective

Update the Work Package runner so Claude Code can execute implementation prompts with an explicit permission mode.

This WP addresses the current issue where Claude can plan and return output from the PowerShell runner, but cannot write approved files when launched non-interactively.

The goal is to make Claude execution reliable from `scripts/run-work-package.ps1` while preserving the established Work Package workflow.

---

## Scope

Update the workflow runner to support Claude Code permission mode selection.

This WP modifies workflow tooling only.

No runtime application behavior changes.
No frontend changes.
No backend changes.
No database changes.

---

## Files Allowed to Change

Allowed:

- scripts/run-work-package.ps1
- docs/05-development-workflow/**
- docs/01-work-packages/WP-091A-add-claude-permission-mode-support.md

Do Not Modify:

- apps/api/**
- apps/web/**
- database/**
- docs/00-ssot/**
- docs/06-architecture/**
- docs/07-api-contracts/**
- docs/08-database/**
- docs/09-release-readiness/**
- docs/10-user-journey/**
- package.json files
- build configuration

---

## Constraints

- Preserve existing `-Execute` semantics
- Preserve existing filename stub workflow
- Preserve Codex execution behavior
- Preserve Gemini audit behavior
- Preserve `-Execute Full` sequencing
- Do not hardcode unsafe Claude behavior
- Do not modify application runtime files
- Do not introduce hidden automation
- Keep the change surgical and backward-compatible

Formatting constraints:

- Use plain markdown only
- Avoid nested code fences
- Avoid escaped quote sequences
- Avoid malformed markdown tables
- Avoid hidden HTML fragments

---

## Required Behavior

### 1. Add Claude Permission Mode Parameter

Add a new runner parameter:

`-ClaudePermissionMode`

Supported values:

- `default`
- `acceptEdits`
- `auto`
- `dontAsk`
- `bypassPermissions`

Default value:

- `default`

When set to `default`, the runner should not pass a Claude permission mode argument.

When set to any other value, the runner should pass the selected permission mode to Claude Code.

---

### 2. Claude Invocation Behavior

When the selected code agent is Claude, the runner must invoke Claude with the selected permission mode.

Expected behavior examples:

`-Execute Claude -ClaudePermissionMode acceptEdits`

runs the code phase with Claude using `--permission-mode acceptEdits`.

`-Execute Claude -ClaudePermissionMode bypassPermissions`

runs the code phase with Claude using `--permission-mode bypassPermissions`.

`-Execute Full -CodeAgent Claude -ClaudePermissionMode bypassPermissions`

runs:

- Code Prompt through Claude using `--permission-mode bypassPermissions`
- Gemini Audit Prompt through Gemini

---

### 3. Preserve Default Behavior

Existing commands must continue to work:

`.\scripts\run-work-package.ps1 "some-stub" -Execute Claude`

should still invoke Claude without passing a permission mode.

`.\scripts\run-work-package.ps1 "some-stub" -Execute Codex`

should behave exactly as before.

`.\scripts\run-work-package.ps1 "some-stub" -Execute Gemini`

should behave exactly as before.

---

### 4. Console Output

When Claude is used, console output should clearly state whether a permission mode is being used.

Examples:

- `Executing code implementation via Claude...`
- `Claude permission mode: default`
- `Claude permission mode: bypassPermissions`

Keep console output concise.

---

### 5. Documentation Update

Update workflow documentation to explain:

- why Claude permission mode exists
- when to use `acceptEdits`
- when to use `bypassPermissions`
- why `bypassPermissions` should be used only in trusted local repositories
- recommended usage for the current project workflow

Example commands should include:

`.\scripts\run-work-package.ps1 "deterministic-investigation-thread-system" -Execute Claude -ClaudePermissionMode bypassPermissions`

`.\scripts\run-work-package.ps1 "deterministic-investigation-thread-system" -Execute Full -CodeAgent Claude -ClaudePermissionMode bypassPermissions`

---

### 6. Preserve Scope Checking

Do not remove or weaken scope checking.

This WP is only about Claude permission mode support.

If the existing scope checker has unrelated path parsing issues, document them as a follow-up concern rather than expanding this WP.

---

## Acceptance Criteria

- `run-work-package.ps1` accepts `-ClaudePermissionMode`
- `default` mode preserves existing Claude invocation behavior
- non-default Claude permission modes are passed to Claude as `--permission-mode`
- Codex execution behavior is unchanged
- Gemini execution behavior is unchanged
- Full execution with `-CodeAgent Claude` supports Claude permission mode
- workflow documentation includes usage examples
- no runtime application files modified
- no database files modified

---

## Code Prompt

You are implementing WP-091A for the Sequel City Web Detective project.

Objective:
Add Claude permission mode support to `scripts/run-work-package.ps1`.

Problem:
Claude Code can run from the PowerShell Work Package runner, but when launched non-interactively it refuses file writes because no approval channel exists. The runner needs an explicit Claude permission mode parameter so trusted local workflows can allow Claude to write approved files.

Important:

- Modify workflow tooling only
- Do not modify runtime application code
- Do not modify frontend or backend code
- Do not modify database scripts
- Preserve existing `-Execute` semantics
- Preserve existing Codex behavior
- Preserve existing Gemini behavior
- Preserve `-Execute Full` sequencing
- Preserve filename stub workflow

Implement:

1. Add a new parameter to `scripts/run-work-package.ps1`:

   `-ClaudePermissionMode`

   Supported values:

   - `default`
   - `acceptEdits`
   - `auto`
   - `dontAsk`
   - `bypassPermissions`

   Default:

   - `default`
2. When Claude is the selected code agent:

   - If `ClaudePermissionMode` is `default`, do not pass a permission mode argument.
   - If `ClaudePermissionMode` is not `default`, pass `--permission-mode <value>` to Claude.
3. Support this for:

   - `-Execute Claude`
   - `-Execute Full -CodeAgent Claude`
4. Keep Codex execution unchanged.
5. Keep Gemini execution unchanged.
6. Add concise console output indicating the Claude permission mode.
7. Update workflow documentation under `docs/05-development-workflow/` to explain Claude permission mode usage.
8. Include example commands:

   - `.\scripts\run-work-package.ps1 "deterministic-investigation-thread-system" -Execute Claude -ClaudePermissionMode bypassPermissions`
   - `.\scripts\run-work-package.ps1 "deterministic-investigation-thread-system" -Execute Full -CodeAgent Claude -ClaudePermissionMode bypassPermissions`

Do not:

- remove scope checking
- weaken scope checking
- expand this WP into broader runner refactoring
- fix unrelated scope parsing issues unless required for this feature
- introduce application runtime changes

Keep the implementation surgical, backward-compatible, and easy to audit.

---

## Gemini Audit Prompt

Audit WP-091A Claude permission mode runner support.

Verify:

1. Only approved workflow files were modified.
2. No frontend runtime files changed.
3. No backend runtime files changed.
4. No database scripts changed.
5. `run-work-package.ps1` accepts `-ClaudePermissionMode`.
6. `default` preserves existing Claude invocation behavior.
7. Non-default permission modes are passed to Claude as `--permission-mode <value>`.
8. `-Execute Claude` supports Claude permission mode.
9. `-Execute Full -CodeAgent Claude` supports Claude permission mode.
10. Codex execution behavior remains unchanged.
11. Gemini execution behavior remains unchanged.
12. Full execution sequencing remains unchanged.
13. Workflow documentation explains the new parameter and includes examples.

Specifically validate:

- parameter validation
- Claude command construction
- default behavior
- console output
- backward compatibility
- documentation accuracy

Flag:

- runtime application modifications
- weakened scope checking
- changed Codex behavior
- changed Gemini behavior
- broken Full execution sequencing
- unsafe permission mode hardcoding
- missing documentation

---

## Code Results

Updated `scripts/run-work-package.ps1`:

- Added `-ClaudePermissionMode` parameter to the main param block with ValidateSet `"default", "acceptEdits", "auto", "dontAsk", "bypassPermissions"` and default `"default"`
- Added `[string]$ClaudePermissionMode = "default"` parameter to `Invoke-PromptCli`
- In `Invoke-PromptCli` arguments block: when `PromptType` is `"Claude"` and `ClaudePermissionMode` is not `"default"`, appends `--permission-mode <value>` to the argument list
- Added `[string]$ClaudePermissionMode = "default"` parameter to `Invoke-ExecutionStep`
- In `Invoke-ExecutionStep` console output: when `PromptType` is `"Claude"`, writes `"Claude permission mode: $ClaudePermissionMode"` after the execution header line
- Updated `Invoke-PromptCli` call in `Invoke-ExecutionStep` to pass `-ClaudePermissionMode $ClaudePermissionMode`
- Updated `"Claude"` switch case to pass `-ClaudePermissionMode $ClaudePermissionMode` to `Invoke-ExecutionStep`
- Updated `"Full"` switch case to pass `-ClaudePermissionMode $ClaudePermissionMode` to the first `Invoke-ExecutionStep` call (code agent step); Gemini step is unchanged

Updated `docs/05-development-workflow/Codex-Gemini-Execution-Guide.md`:

- Added `## Claude Permission Mode` section explaining the parameter, all supported values, when to use `acceptEdits`, when to use `bypassPermissions`, why `bypassPermissions` is required for the PowerShell runner non-interactive context, and recommended usage examples for this project
- Included both example forms:
  - `-Execute Claude -ClaudePermissionMode bypassPermissions`
  - `-Execute Full -CodeAgent Claude -ClaudePermissionMode bypassPermissions`

No runtime application files modified. No database files modified. No SSOT files modified. Codex execution behavior unchanged. Gemini execution behavior unchanged. Full execution sequencing unchanged.

---

## Gemini Audit Results

The audit of **WP-091A: Claude Permission Mode Support** is complete. The implementation successfully addresses the requirement to support explicit permission modes for Claude Code while maintaining system integrity and backward compatibility.

### **Audit Findings**

1.  **Scope Integrity**: 
    *   Only `scripts/run-work-package.ps1` and `docs/05-development-workflow/Codex-Gemini-Execution-Guide.md` were modified.
    *   No runtime application code, database scripts, or SSOT files were touched.
2.  **Parameter Support**:
    *   `run-work-package.ps1` correctly implements the `-ClaudePermissionMode` parameter with a `ValidateSet` containing `default`, `acceptEdits`, `auto`, `dontAsk`, and `bypassPermissions`.
    *   The parameter defaults to `default`, ensuring no breaking changes for existing workflows.
3.  **Command Construction**:
    *   `Invoke-PromptCli` logic correctly appends `--permission-mode <value>` only when the agent is Claude and a non-default mode is selected.
    *   Gemini and Codex agents are unaffected by this parameter.
4.  **Execution Mode Integration**:
    *   `-Execute Claude` and `-Execute Full -CodeAgent Claude` both correctly pass the user-specified permission mode to the execution steps.
    *   Console output provides clear feedback on the active permission mode (e.g., `Claude permission mode: bypassPermissions`).
5.  **Documentation Accuracy**:
    *   The `Codex-Gemini-Execution-Guide.md` has been updated with a comprehensive section explaining the purpose of the new parameter, safety recommendations (restricting `bypassPermissions` to trusted local repos), and clear usage examples.
6.  **Sequencing & Compatibility**:
    *   The `Full` execution sequencing (Code Agent followed by Gemini Audit) remains intact.
    *   Existing commands without the new parameter continue to work exactly as before.

### **Conclusion**
The implementation is surgical, robustly validated, and fully compliant with the work package requirements. No issues or stray changes were identified.

**Verdict: PASS**

## Final Decision

Approved. Claude permission mode support is implemented in `scripts/run-work-package.ps1`. The `-ClaudePermissionMode` parameter accepts `default`, `acceptEdits`, `auto`, `dontAsk`, and `bypassPermissions`, defaulting to `default` to preserve existing behavior. When a non-default mode is selected and Claude is the code agent, `--permission-mode <value>` is appended to the Claude invocation. Console output states the active permission mode. Both `-Execute Claude` and `-Execute Full -CodeAgent Claude` support the new parameter. Codex execution, Gemini execution, and Full sequencing are unchanged. Workflow documentation updated with usage guidance, safety notes, and example commands. All 6 Gemini audit checks passed with no flags.

