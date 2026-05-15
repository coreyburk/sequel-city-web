# WP-089: tool-agnostic-code-runner-and-work-package-structure

## Objective

Update the Sequel City Web Detective Work Package execution workflow to support tool-agnostic code implementation execution.

This WP standardizes the Work Package structure around generic code execution terminology while allowing either Codex or Claude Code to serve as the implementation engine.

The goal is to preserve the existing deterministic workflow while removing Codex-specific assumptions from Work Package structure and runner behavior.

---

## Scope

Update the Work Package templates, runner scripts, and workflow documentation to support:

- generic code prompt sections
- generic code result sections
- Codex implementation execution
- Claude implementation execution
- backward compatibility with existing Work Packages

This WP modifies workflow tooling and documentation only.

No runtime application behavior changes.
No frontend changes.
No backend changes.
No database changes.

---

## Files Allowed to Change

Allowed:

- scripts/run-work-package.ps1
- scripts/new-lite-work-package.ps1
- docs/05-development-workflow/**
- docs/README.md

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

- Preserve existing deterministic workflow behavior
- Preserve existing WP filename stub workflow
- Preserve Gemini audit workflow
- Preserve Final Decision workflow
- Preserve backward compatibility with existing WPs
- No runtime application behavior changes
- No speculative workflow behavior
- No hidden automation

Formatting constraints:

- Use plain markdown only
- Avoid nested code fences
- Avoid escaped quote sequences
- Avoid malformed markdown tables
- Avoid hidden HTML fragments

Workflow constraints:

- Existing WPs must continue functioning
- Existing Codex execution support must remain operational
- Gemini execution behavior must remain unchanged
- Full execution sequencing must remain deterministic
- Console output should remain readable and concise

---

## Required Behavior

The workflow system must support generic code implementation execution independent of the underlying implementation engine.

### 1. New Work Package Section Names

Add support for the following preferred section names:

- ## Code Prompt
- ## Code Results

These become the new standard section names for implementation prompts and implementation outputs.

---

### 2. Backward Compatibility

Preserve support for legacy section names:

- ## Codex Prompt
- ## Codex Results

Runner behavior must:

- prefer new section names if present
- fall back to legacy section names if needed

This allows all historical WPs to continue functioning without modification.

---

### 3. New Execution Modes

Update the runner to support:

-Execute None|Codex|Claude|Gemini|Full

Behavior:

- Codex => run Code Prompt using Codex
- Claude => run Code Prompt using Claude
- Gemini => run Gemini Audit Prompt using Gemini
- Full => run code phase first, then Gemini audit phase

---

### 4. Full Execution Support

Add a new parameter:

-CodeAgent Codex|Claude

Behavior:

-Execute Full -CodeAgent Codex

runs:

- Code Prompt via Codex
- Gemini Audit Prompt via Gemini

Behavior:

-Execute Full -CodeAgent Claude

runs:

- Code Prompt via Claude
- Gemini Audit Prompt via Gemini

Default:

-CodeAgent Codex

for backward compatibility.

---

### 5. Result Writing Behavior

Implementation execution must always write to:

- ## Code Results

If the WP only contains:

- ## Codex Results

the runner may continue supporting legacy writes for compatibility.

Preferred behavior:

- use Code Results if present
- otherwise fall back to Codex Results

---

### 6. Template Generator Updates

Update the Work Package template generator to produce:

- ## Code Prompt
- ## Code Results

instead of Codex-specific headings.

Gemini sections remain unchanged.

---

### 7. Console Output Improvements

Console output should become implementation-agent aware.

Examples:

- Executing code implementation via Claude...
- Executing code implementation via Codex...
- Executing Gemini audit...

Avoid hardcoded Codex-specific messaging when Claude is selected.

---

### 8. Documentation Updates

Update workflow documentation to describe:

- tool-agnostic implementation workflow
- Claude support
- backward compatibility behavior
- preferred new WP structure
- execution examples
- Full execution semantics

---

### 9. Preserve Existing Workflow Semantics

Preserve the existing semantics:

-Execute Codex => implementation phase only
-Execute Claude => implementation phase only
-Execute Gemini => audit phase only
-Execute Full => implementation then audit

Do not introduce additional execution phases.

---

## Acceptance Criteria

- run-work-package.ps1 supports Claude execution
- run-work-package.ps1 supports Code Prompt and Code Results
- existing WPs continue functioning
- new WPs use Code Prompt and Code Results
- Full execution supports selectable implementation engine
- Gemini workflow remains unchanged
- workflow documentation updated
- console messaging reflects selected implementation engine
- no runtime application source files modified
- no database files modified

---

## Code Prompt

You are implementing WP-089 for the Sequel City Web Detective project.

Objective:
Update the Work Package runner and workflow structure to support tool-agnostic code implementation execution.

Important:

- Preserve backward compatibility
- Do not modify runtime application code
- Do not modify frontend/backend runtime behavior
- Preserve existing workflow semantics
- Preserve WP filename stub workflow
- Preserve Gemini audit behavior

Before editing:

1. Review scripts/run-work-package.ps1
2. Review scripts/new-lite-work-package.ps1
3. Review docs/05-development-workflow
4. Understand current -Execute semantics and filename stub behavior

Implement:

1. Support for preferred WP sections:

   - ## Code Prompt
   - ## Code Results
2. Backward compatibility for:

   - ## Codex Prompt
   - ## Codex Results
3. New execution modes:

   - -Execute Codex
   - -Execute Claude
   - -Execute Gemini
   - -Execute Full
4. Add:

   - -CodeAgent Codex|Claude
5. Full execution behavior:

   - implementation first
   - Gemini audit second
6. Update WP template generator to emit:

   - ## Code Prompt
   - ## Code Results
7. Update workflow documentation.

Preserve:

- existing WP stub resolution
- deterministic sequencing
- Gemini audit behavior
- Final Decision workflow

Do not:

- introduce runtime application changes
- introduce speculative workflow behavior
- remove legacy support
- change WP filename conventions

Formatting requirements:

- Use simple markdown only
- Avoid nested code fences
- Avoid escaped quotes
- Avoid malformed markdown tables
- Avoid hidden HTML

Keep the implementation surgical, backward-compatible, and deterministic.

---

## Gemini Audit Prompt

Audit WP-089 tool-agnostic code runner implementation.

Verify:

1. Only approved workflow and documentation files were modified.
2. No frontend runtime files changed.
3. No backend runtime files changed.
4. No database files changed.
5. Existing WP stub resolution behavior remains intact.
6. Existing Codex execution behavior remains operational.
7. Claude execution support was added correctly.
8. Code Prompt and Code Results support was added correctly.
9. Legacy Codex Prompt and Codex Results support remains operational.
10. Gemini workflow behavior remains unchanged.
11. Full execution sequencing remains deterministic.
12. Workflow documentation matches implemented behavior.

Specifically validate:

- section resolution behavior
- backward compatibility behavior
- Full execution semantics
- CodeAgent selection behavior
- result writing behavior
- console output behavior
- template generator output

Flag:

- broken backward compatibility
- malformed section parsing
- incorrect execution sequencing
- hardcoded Codex assumptions
- Gemini workflow regressions
- runtime application modifications
- contradictory workflow documentation

---

## Code Results

Updated `scripts/run-work-package.ps1`:

- Added `"Claude"` to `-Execute` ValidateSet
- Added `-CodeAgent Codex|Claude` parameter (default `Codex`)
- `Get-PromptHeading`: prefers `Code Prompt`, falls back to `Codex Prompt` then `7. Codex Prompt`
- `Get-ResultHeading`: returns `Code Results` for code agents (was `Codex Results`)
- `Get-ConfiguredCliName`: added Claude branch returning `$env:LITE_WP_CLAUDE_CLI` or `claude`
- `Resolve-PreviewPromptType`: added `Claude` to `$ExecuteMode` ValidateSet and mapping
- `Invoke-PromptCli`: added `Claude` to ValidateSet; Claude uses `-p` arg like Gemini, ReadToEnd output like Codex
- `Show-Prompt`, `Normalize-ResultText`: added `Claude` to ValidateSet; Claude uses Codex normalization path
- `Update-WorkPackageResults`: added `Claude` to ValidateSet; added Code Results â†’ Codex Results fallback for legacy WPs; exposes `ResultHeading` in return object
- `Invoke-ExecutionStep`: added `Claude` to ValidateSet; agent-aware console messages ("Executing code implementation via Claude/Codex..." / "Executing Gemini audit..."); Claude included in scope check; result messages use `$writeResult.ResultHeading`
- Preview path: shows step 3 (run Gemini audit) for both Codex and Claude
- Main switch block: added `"Claude"` case; `"Full"` uses `$CodeAgent` to select implementation engine

Updated `scripts/new-lite-work-package.ps1`:

- Template now emits `## Code Prompt` and `## Code Results` instead of Codex-specific headings
- Updated next-steps message to reference `Code Prompt`

Updated `docs/05-development-workflow/Codex-Gemini-Execution-Guide.md`:

- Renamed to "Code Agent And Gemini Execution Guide"
- Described Claude and Codex as supported code agents
- Added `-Execute Claude` and `-CodeAgent` documentation
- Updated result section references from `Codex Results` to `Code Results`
- Added backward compatibility note

Updated `docs/05-development-workflow/Work-Package-Lifecycle.md`:

- Updated "Definition" to say "code agent" instead of "Codex"
- Updated required sections list to use `Code Prompt` and `Code Results`
- Added backward compatibility note for legacy `Codex Prompt`/`Codex Results`
- Updated failure handling reference from `Codex Results` to `Code Results`

Updated `docs/05-development-workflow/Contributor-Workflow-Guide.md`:

- Updated high-level loop step 4 to say "code agent" instead of "Codex"
- Renamed "Codex Role" section to "Code Agent Role"
- Updated `Codex Results` references to `Code Results`
- Updated cross-reference link text to "Code Agent And Gemini Execution Guide"

Updated `docs/05-development-workflow/Prompt-Formatting-Guidelines.md`:

- Updated "Codex prompts" to "code prompts"
- Added Claude CLI failure symptom alongside Codex

---

## Gemini Audit Results

Verdict: PASS

- Section resolution: `Get-PromptHeading` prefers `Code Prompt`, falls back to `Codex Prompt` and `7. Codex Prompt`. `Update-WorkPackageResults` prefers `Code Results`, falls back to `Codex Results` for legacy WPs.
- Claude support: `Invoke-PromptCli` and `Invoke-ExecutionStep` handle Claude CLI name resolution, `-p` argument, ReadToEnd output capture, and scope check inclusion.
- `-CodeAgent` parameter: added and wired into the `Full` mode switch case with default `Codex` for backward compatibility.
- Console output: agent-aware messages generated dynamically for Codex, Claude, and Gemini paths.
- Template generator: `new-lite-work-package.ps1` emits `Code Prompt` and `Code Results`.
- Scope compliance: only approved `scripts/` and `docs/` files modified; no runtime, database, or SSOT changes.
- Documentation: all five workflow docs updated to tool-agnostic terminology.

## Final Decision

Approved. The work package runner and template are now tool-agnostic. `Code Prompt` and `Code Results` are the new preferred section names, with automatic fallback to `Codex Prompt` and `Codex Results` so all existing work packages continue functioning without modification. Claude Code is supported as a first-class implementation engine via `-Execute Claude` and `-Execute Full -CodeAgent Claude`. Gemini audit behavior and deterministic sequencing are unchanged. Gemini audit returned PASS with no violations or regressions.

