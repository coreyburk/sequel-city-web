# Code Agent And Gemini Execution Guide

## Code Agent Purpose

The code agent performs the implementation side of a work package. It follows the package instructions, makes the allowed changes, and reports what it completed, what it could not complete, and any scope or environment concerns.

The project supports two code agents: Codex and Claude. Both read from the `Code Prompt` section and write results to the `Code Results` section.

## Gemini Purpose

Gemini performs the audit side of a work package. It reviews changed files, checks compliance with the package, and records pass, fail, or warning-oriented findings for acceptance review.

## Runner Modes

Use the project runner with one of these modes:

- `scripts/run-work-package.ps1` followed by a work package slug and `-Execute Full`
- `scripts/run-work-package.ps1` followed by a work package slug and `-Execute Codex`
- `scripts/run-work-package.ps1` followed by a work package slug and `-Execute Claude`
- `scripts/run-work-package.ps1` followed by a work package slug and `-Execute Gemini`
- `scripts/run-work-package.ps1` followed by a work package slug and `-Execute None`

## Full Mode

`-Execute Full` runs the standard implementation and audit flow. Use this when the work package is ready for code agent execution and Gemini review in the same cycle.

To select the code agent for Full mode, pass `-CodeAgent Codex` or `-CodeAgent Claude`. The default is Codex for backward compatibility.

Examples:

- `-Execute Full -CodeAgent Codex` runs Codex then Gemini
- `-Execute Full -CodeAgent Claude` runs Claude then Gemini

## Codex-Only Mode

`-Execute Codex` runs only the Codex implementation step. Use this when:

- you need Codex output before requesting audit results
- the Gemini prompt still needs adjustment
- you are resolving implementation issues first

## Claude-Only Mode

`-Execute Claude` runs only the Claude implementation step. Use this when:

- you prefer Claude Code as the implementation engine
- you need Claude output before requesting audit results
- you are resolving implementation issues first

## Claude Permission Mode

When Claude is the code agent, pass `-ClaudePermissionMode` to control how Claude handles file writes during non-interactive execution.

Supported values:

- `default` — no permission mode argument is passed; Claude uses its default behavior
- `acceptEdits` — Claude accepts file edits without prompting
- `auto` — Claude makes decisions automatically
- `dontAsk` — Claude does not ask for confirmation
- `bypassPermissions` — Claude bypasses all permission checks

Default value is `default`.

### When to use acceptEdits

Use `acceptEdits` when you want Claude to apply file writes but still want it to stop and prompt for any action beyond editing, such as running shell commands.

### When to use bypassPermissions

Use `bypassPermissions` when running Claude in a trusted local repository where you want fully autonomous execution with no approval prompts. This allows Claude to write, create, and modify files without any interactive confirmation.

Only use `bypassPermissions` in repositories you control. Do not use it in shared, remote, or untrusted environments.

### Recommended usage for this project

For local trusted development in this project, the recommended approach when running implementation work packages via Claude is:

    .\scripts\run-work-package.ps1 "work-package-slug" -Execute Claude -ClaudePermissionMode bypassPermissions

    .\scripts\run-work-package.ps1 "work-package-slug" -Execute Full -CodeAgent Claude -ClaudePermissionMode bypassPermissions

Without `-ClaudePermissionMode bypassPermissions`, Claude launched non-interactively from the PowerShell runner will refuse file writes because no approval channel exists.

The `-ClaudePermissionMode` parameter applies only when Claude is the selected code agent. It has no effect on Codex or Gemini execution.

## Gemini-Only Mode

`-Execute Gemini` runs only the audit side. Use this when:

- implementation already exists and needs audit
- you are re-running review after prompt or formatting corrections
- you need focused audit feedback on changed files

## None Mode

`-Execute None` performs no agent execution. Use this when:

- preparing or validating work package structure
- updating prompts before a real run
- documenting the package before execution starts

## How To Interpret Code Results

Review `Code Results` for:

- what changed
- whether the requested behavior was implemented
- any blocked steps or environment limitations
- any scope warnings or deviations

Do not treat `Code Results` as acceptance by themselves. They are implementation evidence, not the final project decision.

## Backward Compatibility

Existing work packages that use `Codex Prompt` and `Codex Results` continue to work. The runner prefers `Code Prompt` and `Code Results` when present and falls back to `Codex Prompt` and `Codex Results` automatically.

## How To Interpret Gemini Audit Results

Review `Gemini Audit Results` for:

- pass or fail status
- concrete defects or missing requirements
- scope compliance warnings
- prompt formatting or runner issues

Gemini audit output informs acceptance, but the project still records the actual decision in `Final Decision`.

## What To Do On PASS

- confirm the changed files remain within allowed scope
- confirm acceptance criteria are satisfied
- update `Final Decision` to reflect acceptance
- commit the accepted work package and related changes

## What To Do On FAIL

- do not mark the work package accepted
- review the specific failure details
- decide whether to fix within scope or open a corrective work package
- rerun the appropriate execution mode after addressing the problem

## What To Do With Scope Warnings

- inspect whether the warning reflects real out-of-scope change risk
- reject or correct accidental scope expansion before acceptance
- if additional work is truly required, document it and open a follow-up or corrective work package

## What To Do When Environment Limitations Occur

- record the limitation clearly in the result sections
- distinguish environment failure from implementation failure
- decide in `Final Decision` whether the work is accepted, blocked, or needs rerun
- rerun only after the limitation or prompt issue is addressed

## How To Rerun After Prompt Formatting Fixes

- clean up the work package prompt formatting first
- preserve the original work package intent and scope
- rerun the most appropriate mode, usually `-Execute Codex`, `-Execute Claude`, `-Execute Gemini`, or `-Execute Full`
- replace ambiguous or malformed runner input before assuming a tooling defect

For prompt hygiene details, see [Prompt Formatting Guidelines](./Prompt-Formatting-Guidelines.md).
