# WP-145: Understand Codebase Knowledge Graph Baseline

**Status:** Accepted
**Owner:** Codex
**Created:** 2026-06-06

## Objective

Add Understand Anything as a documented repository analysis capability and commit a validated full-repository knowledge-graph baseline without placing temporary analysis artifacts under source control.

## Why This WP Exists

The project has grown across a React student experience, Fastify API, SQL Server data assets, deterministic Case 004 progression logic, browser tests, source-of-truth documents, and more than 140 work packages. Understanding relationships across those surfaces requires repeated manual searches.

Understand Anything was installed as a Codex skill and run against the full repository. The initial run generated a validated architecture graph, structural fingerprints, an incremental scan inventory, and a local dashboard. This work package records the repository policy for those artifacts and makes the capability discoverable to future contributors.

## Scope

### In Scope

- retain the validated `.understand-anything` knowledge graph
- retain structural fingerprints and analyzed-commit metadata
- retain the deterministic scan inventory required for incremental analysis
- retain project-specific Understand ignore and output configuration
- ignore temporary extraction files, delayed cleanup directories, and logs
- document installation, common commands, tracked artifacts, and update expectations
- link the contributor-facing Understand guide from the repository README

### Out of Scope

- vendoring the Understand Anything plugin or its dependencies
- modifying application runtime behavior
- changing Case 004 progression, database data, or tests
- requiring Understand for normal build, test, or production execution
- committing dashboard server output or temporary batch-analysis files
- guaranteeing that the external Understand project remains API-compatible

## SSOT References

- `docs/00-ssot/SSOT-Development-Workflow.md`
- `docs/00-ssot/SSOT-AI-Agent-Boundaries.md`
- `docs/05-development-workflow/Contributor-Workflow-Guide.md`
- `docs/05-development-workflow/Commit-Message-Guide.md`

## Files Allowed To Change

- `.gitignore`
- `.understand-anything/.understandignore`
- `.understand-anything/config.json`
- `.understand-anything/fingerprints.json`
- `.understand-anything/knowledge-graph.json`
- `.understand-anything/meta.json`
- `.understand-anything/intermediate/scan-result.json`
- `README.md`
- `docs/05-development-workflow/Understand-Codebase-Analysis.md`
- this work-package document

Do not commit:

- `.understand-anything/.trash-*/`
- `.understand-anything/tmp/`
- `.understand-anything/*.log`
- generated batch graphs or extraction inputs
- external plugin source or package dependencies

## Required Behavior

- `$understand` can use the tracked baseline for future incremental analysis.
- `$understand-chat` can answer codebase questions after the skill is installed.
- `$understand-dashboard` can load the tracked knowledge graph locally.
- Repository users can identify which generated files are durable and which are transient.
- Normal application build and test workflows remain independent of Understand.

## Acceptance Criteria

- [x] A full-repository Understand analysis completes.
- [x] The graph covers all 393 scanned repository files.
- [x] Final graph validation reports no integrity issues.
- [x] The graph contains architecture layers and a guided tour.
- [x] Structural fingerprints are generated for incremental updates.
- [x] The scan inventory is retained.
- [x] Temporary analysis and dashboard artifacts are ignored.
- [x] Contributor documentation explains installation, usage, and update policy.
- [x] The README links to the contributor documentation.
- [x] No application runtime, database, or test behavior changes.

## Code Prompt

Establish the repository's Understand Anything baseline:

1. Run `$understand` against the full repository.
2. Retain the validated knowledge graph, fingerprints, metadata, configuration, and scan inventory.
3. Add ignore rules for temporary and delayed-cleanup output.
4. Document how contributors install and invoke the Understand skills.
5. Record when graph regeneration is expected.
6. Preserve complete separation from application build and runtime behavior.

## Code Results

Implemented:

- Generated a full-repository knowledge graph covering 393 files.
- Generated structural fingerprints for all 393 analyzed files.
- Retained the deterministic scan inventory for future incremental runs.
- Added repository ignore rules for Understand trash, temporary, and non-baseline intermediate files.
- Added a contributor guide covering installation, commands, tracked files, ignored files, and update expectations.
- Linked the guide from the repository README.
- Kept the external plugin installation outside the repository and preserved normal runtime independence.

## Verification

Completed on 2026-06-06:

- Understand scan:
  - 393 files analyzed
  - 174 deterministic internal import edges discovered
  - 36 semantic batches processed
- Final graph:
  - 611 nodes
  - 516 relationships
  - 9 architecture layers
  - 10 guided tour steps
- Validation:
  - 0 integrity issues
  - 0 missing inventory files
  - 295 intentionally isolated reference nodes, primarily historical work packages, standalone documentation, CSV design data, and SQL assets
- Fingerprint baseline:
  - 393 files
- JSON parsing:
  - knowledge graph, fingerprints, metadata, configuration, and scan inventory parse successfully

Application tests were not rerun because this package changes only documentation and repository analysis artifacts.

## Audit Prompt

Audit WP-145 for repository hygiene, reproducibility, documentation clarity, and scope compliance.

Verify:

1. The committed graph and fingerprints are valid JSON.
2. The graph reports the expected project, file coverage, layers, and tour.
3. The analyzed commit metadata matches the baseline described in documentation.
4. The scan inventory is retained for incremental analysis.
5. Temporary batch output, logs, and trash directories are not staged.
6. Installation instructions clearly state that the external plugin is not vendored.
7. Normal application build and runtime behavior remain unchanged.

## Audit Results

Audit completed on 2026-06-06.

### Audit Summary: PASS

1. Durable artifact policy: PASS. The graph, fingerprints, metadata, configuration, ignore rules, and scan inventory are retained.
2. Repository hygiene: PASS. Trash directories, temporary extraction files, logs, and non-baseline intermediate files are ignored and excluded from the accepted change set.
3. Graph integrity: PASS. The final validator reports zero node, edge, layer, tour, or inventory-reference issues.
4. Coverage: PASS. All 393 scanned files have graph representation.
5. Incremental readiness: PASS. Fingerprints and `scan-result.json` are present for future updates.
6. Documentation: PASS. The guide explains installation boundaries, commands, update expectations, and tracked-versus-local files.
7. Runtime isolation: PASS. No application, database, test, package manifest, or production configuration files changed.

### Residual Risk

- Understand Anything is an external project installed in the user's Codex environment. Future plugin changes may require documentation or generated-format updates.
- The generated graph includes many intentionally isolated historical/reference nodes because full repository coverage was selected.

## Final Decision

Accepted.

Reason: WP-145 establishes a validated and reproducible repository knowledge-graph baseline, documents contributor usage, preserves incremental update support, and keeps external tooling and transient output isolated from application runtime behavior.
