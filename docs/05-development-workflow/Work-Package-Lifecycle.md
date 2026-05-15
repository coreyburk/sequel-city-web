# Work Package Lifecycle

## Definition Of A Work Package

A work package is the project’s required planning and acceptance record for a discrete unit of development work. It defines what should happen, what may change, how the code agent should execute, how Gemini should audit, and how the project records the final decision.

## Why Work Packages Are Required

Work packages are required because they:

- control scope before implementation begins
- make allowed file boundaries explicit
- separate requested work from accidental drift
- preserve an auditable acceptance trail
- support corrective follow-up when work fails or is incomplete

## Required Work Package Sections

Each work package must contain these sections:

- `Objective`
- `Scope`
- `Files Allowed to Change`
- `Constraints`
- `Required Behavior`
- `Acceptance Criteria`
- `Code Prompt`
- `Gemini Audit Prompt`
- `Code Results`
- `Gemini Audit Results`
- `Final Decision`

Legacy work packages that use `Codex Prompt` and `Codex Results` continue to function without modification.

## Creating A Work Package

Create a new work package with the project script:

`scripts/new-lite-work-package.ps1` followed by a short descriptive slug argument

Use a short slug that describes the task clearly. Work package numbers are auto-assigned by the script, so contributors should not try to choose or reserve the numeric identifier manually.

## Files Allowed To Change Structure

The `Files Allowed to Change` section drives the runner's automated scope check. The section supports two layouts.

### Preferred Layout: Allowed And Do Not Modify Subsections

New work packages should split the section into two clearly labeled subsections:

- `Allowed:` lists paths and patterns the work package may modify.
- `Do Not Modify:` lists paths and patterns that must not change even though they are referenced elsewhere in the work package.

Example:

    ## Files Allowed to Change

    Allowed:

    - scripts/run-work-package.ps1
    - docs/05-development-workflow/**

    Do Not Modify:

    - apps/api/**
    - database/**

The scope checker records `Allowed:` entries as allowed patterns and `Do Not Modify:` entries as prohibited patterns. Prohibited entries are surfaced in the scope check output but are never treated as allowed.

### Legacy Layout: Flat List

Older work packages list paths directly under `## Files Allowed to Change` without subsection markers. The runner preserves this behavior for backward compatibility: when no `Allowed:` marker is present, every path in the section is treated as allowed.

## Path Matching And Normalization

Before comparing a modified file against allowed patterns, the runner normalizes both sides the same way:

- backslashes become forward slashes
- a leading `./` is stripped
- surrounding backticks, quotes, and whitespace are trimmed
- the resulting path is lowercased so comparison is case-insensitive on Windows

Two pattern shapes are supported:

- exact paths (for example `scripts/run-work-package.ps1`) match only that specific file
- directory globs ending in `/**` (for example `apps/web/src/features/**`) match the directory itself and any file or subdirectory beneath it

Other glob shapes are not interpreted; list each file explicitly or use a directory glob.

## Scope Check Output

When the runner executes the Codex or Claude code agent, it appends a `### Scope Check` block to `Code Results` with four labeled lists:

- `Allowed patterns` — entries parsed from `Allowed:` (or the legacy flat list)
- `Prohibited patterns (Do Not Modify)` — entries parsed from `Do Not Modify:`, when present
- `Modified files` — paths reported by `git status --porcelain`
- `Out-of-scope files` — modified files that no allowed pattern covers

Out-of-scope entries that look like generated build output (for example `*.tsbuildinfo`, `dist/`, `build/`, `coverage/`, `node_modules/`) are annotated with `(build artifact)` so reviewers can tell at a glance whether a violation is incidental tooling output or a real scope expansion. Build artifacts are still reported as violations unless an `Allowed:` pattern explicitly covers them — the runner does not silently ignore them.

## Integration File Listing Guidance

When a feature touches a shared integration point (for example a frontend feature that imports from a shared component directory or types module), list the integration files explicitly under `Allowed:`. Prefer a precise directory glob such as `apps/web/src/types/**` over relying on case-insensitive substring guesses. If a path is referenced by the work package but must not change, place it under `Do Not Modify:` so the scope check distinguishes intentional read-only references from accidental writes.

## Scope Control Guidance

- Keep each work package focused on one coherent outcome.
- Limit `Files Allowed to Change` to the smallest practical set.
- Split unrelated work into separate work packages instead of broadening scope midstream.
- Treat out-of-scope findings as follow-up candidates unless they are required to satisfy the current package safely.
- If corrective work is needed beyond the approved scope, open a corrective work package instead of silently expanding the current one.

## Handling Deferred Or Skipped Work

- Mark deferred or skipped items explicitly in `Final Decision`.
- State why the work was deferred or skipped.
- If the work still matters, create a follow-up work package instead of leaving the status ambiguous.
- Do not report skipped scope as completed scope.

## Handling Failed Work

- Record the failure clearly in `Code Results`, `Gemini Audit Results`, or both, depending on where it occurred.
- Preserve useful failure context, including scope problems, environment limitations, or unmet acceptance criteria.
- Use `Final Decision` to state that the work was not accepted.
- If another attempt is needed, create a new work package or a corrective work package rather than rewriting history.

## Handling Corrective Work Packages

Use a corrective work package when accepted or attempted work needs targeted repair, cleanup, or compliance correction. A corrective work package should:

- reference the earlier work package it corrects
- define the exact defect, omission, or noncompliance being addressed
- keep the corrective scope narrow
- produce its own results and `Final Decision`

Corrective work packages keep the project history honest without mixing old acceptance with new repairs.
