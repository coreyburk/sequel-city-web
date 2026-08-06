# Understand Codebase Analysis

## Purpose

Understand Anything provides a generated knowledge graph for exploring Sequel City Web architecture, dependencies, documentation, and the Case 004 learning flow.

The repository stores a validated baseline in `.understand-anything/`. Contributors can use that baseline for interactive codebase questions, launch the dashboard, or regenerate the graph after structural changes.

## Repository Files

Tracked:

- `.understand-anything/knowledge-graph.json` - validated architecture and relationship graph
- `.understand-anything/fingerprints.json` - structural baseline used for incremental analysis
- `.understand-anything/meta.json` - analyzed commit and file-count metadata
- `.understand-anything/intermediate/scan-result.json` - deterministic file inventory retained for incremental runs
- `.understand-anything/.understandignore` - project-specific analysis exclusions
- `.understand-anything/config.json` - Understand output configuration

Ignored:

- `.understand-anything/.trash-*/` - delayed cleanup from completed runs
- `.understand-anything/tmp/` - extraction inputs and intermediate scripts
- all intermediate files except `scan-result.json`
- dashboard and other `*.log` files

## Installation

Understand is installed as a Codex skill outside this repository. Follow the Codex instructions from the [Understand Anything project](https://github.com/Lum1104/Understand-Anything#codex), then restart Codex so the installed skills are discovered.

The expected skills include:

- `$understand`
- `$understand-chat`
- `$understand-dashboard`
- `$understand-diff`
- `$understand-explain`

## Common Commands

From the repository root:

```powershell
scripts/check-understand-refresh-readiness.ps1
```

Runs the read-only repository preflight for graph refresh readiness. It delegates to `scripts/refresh-understand-graph.ps1 -DryRun`, verifies tracked graph artifacts were not modified, and checks for transient Understand temp, trash, or log artifacts. Use `-Json` when a future agentic tool needs machine-readable readiness evidence.

```powershell
scripts/refresh-understand-graph.ps1 -DryRun
```

Checks whether the local Understand plugin scripts needed for a repository refresh are available without modifying tracked graph artifacts.

```powershell
scripts/refresh-understand-graph.ps1
```

Runs the repository-owned deterministic graph refresh wrapper. Use this first for work-package graph refreshes so the refresh path is repeatable and auditable. Pass `-PluginRoot <path>` when the local Understand plugin is installed outside the default user-profile locations.

```text
$understand
```

Regenerates or incrementally updates the knowledge graph through the installed Codex skill. Use this as the interactive fallback when the repository wrapper is unavailable or when a prompt-driven Understand workflow is specifically needed.

```text
$understand-chat Explain the Case 004 student progression
```

Answers repository questions using the generated graph.

```text
$understand-dashboard
```

Starts the local interactive dashboard and prints a tokenized local URL.

```text
$sequel-city-wp-planning
```

Creates the next numbered work package with targeted graph-based impact analysis. The skill proposes scope and tests, then stops before implementation.

## Work Package Planning

Use Understand before implementation when a WP crosses modules, changes architecture or database structure, touches security boundaries, or changes Case 004 progression.

Record:

- graph availability and baseline commit
- freshness classification
- affected architecture layers
- primary files and one-hop dependencies
- related tests and user workflows
- whether graph regeneration is required after implementation

Treat graph summaries as navigation aids. Verify proposed files, relationships, and tests against the current source before finalizing WP scope.

Graph freshness classifications are:

- `Current`
- `Usable with non-structural drift`
- `Structurally stale; regenerate before relying on scope`
- `Unavailable`

Exact baseline-to-HEAD equality is not required when later commits only add or refresh Understand artifacts.

## Update Expectations

Regenerate the graph after changes that materially alter architecture, imports, Case 004 progression, database structure, or major documentation organization.

Regeneration is also required when cumulative accepted work makes the graph stale for the active planning surface, even if each individual work package was narrow. Do not keep deferring refresh when recent accepted WPs changed lifecycle scripts, repo-local skills, prototype tooling, major development-workflow documents, app architecture, imports, database structure, restricted data boundaries, or Case 004 progression. In that state, create a focused graph-refresh work package or include graph regeneration in the active structural package.

When regeneration is known before implementation and the WP can safely include generated graph output, include the tracked graph artifacts in that originating WP and refresh them after implementation before audit. Reserve separate graph-refresh packages for unplanned prior drift, graph repair, or packages that did not or could not include graph artifacts.

Regeneration can be deferred for isolated copy edits, narrow documentation changes, or local polish only when the baseline is still usable for the current planning surface and the work package records that rationale.

Before committing an updated baseline:

1. Run `scripts/check-understand-refresh-readiness.ps1` to confirm the wrapper dry-run succeeds, tracked graph artifacts remain unchanged, and no transient Understand temp/trash/log artifacts are present.
2. Use `scripts/check-understand-refresh-readiness.ps1 -Json` when an agentic workflow needs machine-readable preflight evidence.
3. Refresh with `scripts/refresh-understand-graph.ps1` unless the work package explicitly requires the prompt-driven `$understand` skill.
4. Confirm the Understand run completes all validation phases.
5. Confirm the reported analyzed commit matches the intended repository state.
6. Review changes to the graph, fingerprints, metadata, and scan inventory.
7. Do not commit `.trash-*`, temporary extraction data, or dashboard logs.
8. Include the regenerated baseline in the work package that introduced the structural change when that need was known up front. Create a focused documentation/tooling graph-refresh work package only when establishing or repairing the baseline, handling unplanned prior drift, or recovering from a package that could not include graph artifacts.

When reviewing a refreshed baseline, compare the baseline commit in `.understand-anything/meta.json` with `HEAD`, inspect changed paths since the previous baseline, and confirm the graph now includes the active development surfaces that triggered the refresh.

## Current Baseline

The initial full-repository analysis was completed on 2026-06-06 at commit `834216bd32ffb567db572e725908d2e54c795e9d`.

It analyzed 393 files and produced:

- 611 nodes
- 516 relationships
- 9 architecture layers
- 10 guided tour steps
- 0 graph-integrity issues

The baseline includes the complete repository, including application code, tests, database assets, work packages, source-of-truth documents, and local repository skills.
