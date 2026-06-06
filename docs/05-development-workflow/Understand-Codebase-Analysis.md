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

```text
$understand
```

Regenerates or incrementally updates the knowledge graph.

```text
$understand-chat Explain the Case 004 student progression
```

Answers repository questions using the generated graph.

```text
$understand-dashboard
```

Starts the local interactive dashboard and prints a tokenized local URL.

## Update Expectations

Regenerate the graph after changes that materially alter architecture, imports, Case 004 progression, database structure, or major documentation organization.

Before committing an updated baseline:

1. Confirm the Understand run completes all validation phases.
2. Confirm the reported analyzed commit matches the intended repository state.
3. Review changes to the graph, fingerprints, metadata, and scan inventory.
4. Do not commit `.trash-*`, temporary extraction data, or dashboard logs.
5. Include the regenerated baseline in the work package that introduced the structural change, or create a focused documentation/tooling work package when establishing or repairing the baseline.

## Current Baseline

The initial full-repository analysis was completed on 2026-06-06 at commit `834216bd32ffb567db572e725908d2e54c795e9d`.

It analyzed 393 files and produced:

- 611 nodes
- 516 relationships
- 9 architecture layers
- 10 guided tour steps
- 0 graph-integrity issues

The baseline includes the complete repository, including application code, tests, database assets, work packages, source-of-truth documents, and local repository skills.
