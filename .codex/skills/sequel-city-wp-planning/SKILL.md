---
name: sequel-city-wp-planning
description: Create the next Sequel City Web work package with conservative Understand-assisted impact analysis. Use when planning a new feature, correction, architecture change, database change, security-boundary change, Case 004 progression change, or other work that needs scoped files, dependencies, tests, audit coverage, and a graph-regeneration decision before implementation.
---

# Sequel City WP Planning

Create a planning record only. Stop after writing the WP unless the user separately requests implementation.

## Workflow

1. Read:
   - `docs/00-ssot/SSOT-Development-Workflow.md`
   - `docs/05-development-workflow/Work-Package-Lifecycle.md`
   - `docs/05-development-workflow/Understand-Codebase-Analysis.md`
   - `references/planning-checklist.md`
2. Inspect `git status`, current branch, and recent commits. Do not discard unrelated changes.
3. Find the next WP number from `docs/01-work-packages/WP-*.md`.
4. Classify the requested work as Required, Recommended, or Optional Understand analysis.
5. Evaluate graph availability and freshness:
   - read `.understand-anything/meta.json`
   - confirm `knowledge-graph.json` and `fingerprints.json`
   - compare the baseline commit with `HEAD`
   - inspect changed paths since the baseline when possible
   - treat Understand-only baseline commits as non-structural drift
   - classify cumulative drift as structurally stale when accepted changes since the baseline touch `.codex/skills/**`, `scripts/**`, `tools/**`, major development-workflow docs, app architecture/imports, database structure, restricted data boundaries, or Case 004 progression
6. Search the graph narrowly for relevant names, summaries, tags, layers, and one-hop edges. Do not load the entire graph when targeted searches suffice.
7. Verify proposed files, dependencies, and tests against current source using `rg`, imports, and test references.
8. Propose:
   - smallest practical `Allowed` file set
   - explicit `Do Not Modify` boundaries
   - affected layers and user workflows
   - related unit, integration, and browser tests
   - graph regeneration decision with rationale
   - tracked graph artifacts in the originating WP scope when graph refresh is already known to be required and the package can safely include generated graph output
9. Create the next numbered WP using `scripts/new-lite-work-package.ps1`, then replace placeholders with the scoped plan.
10. Report the created path, freshness classification, and any unresolved assumptions. Do not implement, accept, commit, push, or regenerate the graph without a separate request.

## Rules

- Treat SSOT, source, tests, and observed behavior as authoritative over generated summaries.
- Never invent graph relationships or file paths.
- Report an unavailable or structurally stale graph explicitly.
- When planned source, skill, script, or workflow-document changes are known to require graph regeneration, include the tracked graph artifacts in that same WP unless the scope cannot safely own generated graph output.
- Reserve separate graph-refresh WPs for unplanned prior drift, graph repair, or active packages that did not or could not include graph artifacts.
- Do not repeatedly waive graph regeneration when cumulative accepted WPs make the graph stale for the active planning surface; recommend or create a focused refresh package only when it is the real next task rather than a refresh that should have been scoped into the originating package.
- Do not make Understand installation a prerequisite for creating a WP; use source analysis and record the limitation.
- Keep optional-tier changes lightweight. Record why graph analysis or regeneration is unnecessary.
- Do not overlap with `$sequel-city-wp-finalize`; finalization begins only after implementation, audit, and acceptance.

## Output

The WP must include a completed `Impact Analysis` section and leave:

- `Code Results` pending
- `Audit Results` pending
- `Final Decision` pending

Use `references/planning-checklist.md` for the final completeness check.
