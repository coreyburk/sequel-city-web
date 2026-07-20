# Work Package Lifecycle

## Definition Of A Work Package

A work package is the project's required planning and acceptance record for a discrete unit of development work. It defines what should happen, what may change, how the code agent should execute, how the audit agent should review, and how the project records the final decision.

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
- `Impact Analysis`
- `Files Allowed to Change`
- `Constraints`
- `Required Behavior`
- `Acceptance Criteria`
- `Code Prompt`
- `Audit Prompt`
- `Code Results`
- `Audit Results`
- `Final Decision`

Legacy work packages that use `Codex Prompt`, `Codex Results`, `Gemini Audit Prompt`, `Gemini Audit Results`, `AntiGravity Audit Prompt`, or `AntiGravity Audit Results` continue to function without modification.

## Understand-Assisted Impact Analysis

Complete an impact analysis before implementation when a work package affects shared or structural behavior. Understand is advisory: use graph evidence to locate likely relationships, then verify important conclusions against source files, tests, SSOT, and observed behavior.

### Analysis Tiers

**Required**

- cross-module changes
- architecture or dependency changes
- database schema or migration changes
- restricted-table, answer-key, or security-boundary changes
- Case 004 milestone, clue, guidance, or state-machine changes
- new services, routes, major components, or feature modules

**Recommended**

- shared component or utility changes
- browser or test-harness changes
- substantial workflow documentation changes
- corrective work where the affected surface is uncertain

**Optional**

- isolated copy edits
- local CSS polish without component restructuring
- narrow test expectation corrections
- typo and formatting corrections

If Understand is unavailable, record that limitation and perform the same analysis with source search, import inspection, and test discovery. The absence of the external skill must not block work-package creation.

### Required Impact Analysis Fields

New work packages should record:

```text
## Impact Analysis

### Understand Status
- Graph available:
- Baseline commit:
- Freshness assessment:
- Analysis performed:

### Affected Architecture
- Layers:
- Primary files/components:
- Upstream consumers:
- Downstream dependencies:

### Regression Surface
- Related tests:
- User workflows:
- Security/data boundaries:

### Graph Update Decision
- Regeneration required: Yes/No
- Rationale:
```

### Graph Freshness

Check `.understand-anything/knowledge-graph.json`, `meta.json`, and `fingerprints.json`. Compare the baseline commit in `meta.json` with `HEAD`, and inspect changed files since the baseline when Git history permits.

Classify freshness as:

- `Current` - the graph represents the relevant source state
- `Usable with non-structural drift` - later changes do not materially affect the planned scope, or only establish/refresh Understand artifacts
- `Structurally stale; regenerate before relying on scope` - later changes alter relevant files, imports, database structure, or progression behavior
- `Unavailable` - required graph artifacts are missing or unreadable

Freshness is a planning input, not an automatic failure. Do not require exact commit equality when the only later commit adds the graph baseline itself.

### Planning And Audit Use

Use `$sequel-city-wp-planning` when available to create the next numbered WP with a conservative impact analysis. The skill stops after WP creation unless implementation is separately requested.

Use `scripts/get-work-package-status.ps1 <work-package>` as a read-only preflight before implementation, audit, or finalization when the next lifecycle step is unclear. The checker reports the current lifecycle state, parsed final decision, dirty files, out-of-scope dirty files, and the next recommended action. It is advisory and does not replace human acceptance or independent audit.

Use `scripts/get-work-package-validation-plan.ps1 <work-package>` as a read-only planning/audit preflight when test selection is uncertain. The checker reports related tests, planned verification commands, recorded validation evidence, missing validation findings, and no-automated-validation explanations. It does not run tests or replace audit judgment.

During audit, verify:

- the impact analysis matches the actual changed files
- affected dependencies and related tests were not omitted
- graph regeneration was performed when the recorded decision requires it
- generated graph changes contain no transient logs, batch data, or trash directories
- Understand output did not override SSOT, source code, tests, or observed behavior

## Creating A Work Package

Create a new work package with the project script:

`scripts/new-lite-work-package.ps1` followed by a short descriptive slug argument

Use a short slug that describes the task clearly. Work package numbers are auto-assigned by the script, so contributors should not try to choose or reserve the numeric identifier manually.

The generated package includes an `Impact Analysis` section. Complete it before implementation for required-tier work.

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

- `Allowed patterns` - entries parsed from `Allowed:` (or the legacy flat list)
- `Prohibited patterns (Do Not Modify)` - entries parsed from `Do Not Modify:`, when present
- `Modified files` - paths reported by `git status --porcelain`
- `Out-of-scope files` - modified files that no allowed pattern covers

Out-of-scope entries that look like generated build output (for example `*.tsbuildinfo`, `dist/`, `build/`, `coverage/`, `node_modules/`) are annotated with `(build artifact)` so reviewers can tell at a glance whether a violation is incidental tooling output or a real scope expansion. Build artifacts are still reported as violations unless an `Allowed:` pattern explicitly covers them - the runner does not silently ignore them.

## Audit And Finalization Isolation

Before audit or accepted-WP finalization, the worktree should contain dirty files only for the active work package. The audit runner and commit helper compare `git status --porcelain` against the active WP's `Allowed:` patterns.

If unrelated modified or untracked files are present:

- audit modes record or report a blocked mixed-worktree state before invoking Gemini or AntiGravity
- finalization fails before staging or committing
- the contributor must commit, stash, revert, or otherwise resolve the unrelated work in a deliberate way

Use an explicit mixed-worktree override only for a reviewed exception. The override must not become the normal path, and it does not make unrelated scope changes accepted.

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

- Record the failure clearly in `Code Results`, `Audit Results`, or both, depending on where it occurred.
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
