# stabilize work package automation pipeline

## Objective

Ensure the work package runner executes Codex and Gemini reliably in PowerShell 5.1 without runtime failures.

## Scope (Strict)

### In Scope

- Fix CLI execution in run-work-package.ps1
- Ensure Codex runs without stdin dependency
- Ensure Gemini runs without stdin dependency
- Ensure PowerShell 5.1 compatibility
- Eliminate null-valued expression errors
- Preserve existing workflow behavior

### Out of Scope

- SSOT changes
- Work package content changes
- New files
- Refactors outside this script
- Application code

## Files Allowed to Change

- scripts/run-work-package.ps1

No other files may be modified.

## Constraints

- Preserve all existing behavior
- Preserve execution modes: None, Codex, Gemini, Full
- Preserve result writing
- Preserve scope checking
- Preserve timeout handling
- No new dependencies
- No file changes outside allowed list

## Required Behavior

- Do not use $startInfo.ArgumentList
- Build arguments using $startInfo.Arguments
- Properly quote arguments
- Do not rely on stdin for Codex or Gemini
- Do not call .Write() or .Close() on null StandardInput
- Support .ps1 CLI shims via powershell.exe
- Support .cmd or exe CLIs directly
- Capture output correctly
- No null-valued expression errors

## Acceptance Criteria

- No usage of $startInfo.ArgumentList remains
- Codex execution works without errors
- Gemini execution works without errors
- Full mode runs Codex then Gemini
- Output is written to work package
- Scope checking still works
- Only allowed file is modified

## Codex Prompt

Fix scripts/run-work-package.ps1 for reliable CLI execution.

Context:
The script fails due to:

- ArgumentList incompatibility in PowerShell 5.1
- Invalid stdin assumptions
- Null StandardInput usage

Scope:
Only modify scripts/run-work-package.ps1

Required Fix:

1. Replace ArgumentList usage

- Remove all .ArgumentList.Add calls
- Build argument array
- Convert to string and assign to $startInfo.Arguments

2. Add safe quoting helper:

function ConvertTo-ProcessArgument {
    param([string]$Value)

    if ($Value -notmatch '[\s"]') {
        return $Value
    }

    return '"' + ($Value -replace '"', '\"') + '"'
}

3. Codex execution:

Command shape:
codex exec --cd `<projectRoot>` `<promptText>`

Do not use stdin.

4. Gemini execution:

Command shape:
gemini -p `<promptText>`

Do not use stdin.

5. ProcessStartInfo setup:

- RedirectStandardInput = false
- Keep stdout and stderr redirected

6. PowerShell shim handling:

If CLI ends in .ps1:

- Use powershell.exe -NoProfile -ExecutionPolicy Bypass -File `<script>`

7. Error handling:

- Throw clear errors for missing CLI
- Throw clear errors if process fails
- Prevent all null reference errors

8. Preserve:

- Output writing
- Scope checking
- Timeout handling
- Work package parsing

Return:

- Summary of changes
- Confirmation ArgumentList removed
- Confirmation PowerShell 5.1 compatibility
- Remaining risks

## Gemini Audit Prompt

Audit the pipeline fix.

Allowed file:

- scripts/run-work-package.ps1

Verify:

- No ArgumentList usage
- Arguments built via $startInfo.Arguments
- No stdin dependency for Codex or Gemini
- No null StandardInput usage
- PowerShell 5.1 compatibility
- Existing functionality preserved
- No unrelated changes

Output:

- Verdict: PASS or FAIL
- Violations
- Regressions
- Drift risks
- Required fixes

## Codex Results

Updated [run-work-package.ps1](D:\GitHub-Repos\SequelCityWeb\scripts\run-work-package.ps1).

Summary of changes:

- Replaced the process argument builder with a plain PowerShell array and final string assignment to `ProcessStartInfo.Arguments` in [run-work-package.ps1:310](D:\GitHub-Repos\SequelCityWeb\scripts\run-work-package.ps1:310).
- Added the requested `ConvertTo-ProcessArgument` quoting helper in [run-work-package.ps1:298](D:\GitHub-Repos\SequelCityWeb\scripts\run-work-package.ps1:298).
- Changed Codex execution to `codex exec --cd <projectRoot> <promptText>` in [run-work-package.ps1:373](D:\GitHub-Repos\SequelCityWeb\scripts\run-work-package.ps1:373).
- Changed Gemini execution to `gemini -p <promptText>` in [run-work-package.ps1:376](D:\GitHub-Repos\SequelCityWeb\scripts\run-work-package.ps1:376).
- Removed stdin writes entirely and set `RedirectStandardInput = $false` in [run-work-package.ps1:397](D:\GitHub-Repos\SequelCityWeb\scripts\run-work-package.ps1:397).
- Kept `.ps1` CLI shims on `powershell.exe -NoProfile -ExecutionPolicy Bypass -File ...` and preserved `.cmd`/`.bat` handling.
- Added a guard for unresolved executable paths and kept the existing nonzero-exit failure behavior.

Confirmation:

- `ArgumentList` usage is removed. There are no `ArgumentList` or `.ArgumentList.Add` calls left.
- The launch path is compatible with PowerShell 5.1 because it now uses `ProcessStartInfo.Arguments` as a string and does not depend on redirected stdin.
- The script parses successfully under `powershell.exe`.

Remaining risks:

- Very large multiline prompts can still hit Windows command-line length limits because both CLIs now receive prompt text as an argument, per your required command shape.
- Quoting for unusual shell edge cases inside third-party `.cmd` wrappers can still depend on how the wrapper itself parses arguments, though the script now quotes consistently before invoking `cmd.exe`.
- I did not run live `codex` or `gemini` commands here, so this is syntax-verified and logic-verified, not end-to-end CLI-verified.

## Gemini Audit Results

## Verdict

PASS

## Final Decision

Approved with implementation note: the final runner fix uses ProcessStartInfo.Arguments only for stable CLI options and uses guarded stdin for large multiline prompt payloads. Codex now avoids codex.ps1 when codex.cmd is available. Gemini audit returned PASS, but the runner currently trims Gemini output aggressively and retained only the verdict.
