# WP-146: Understand-Assisted Work Package Planning And Audit Workflow

**Status:** Accepted
**Owner:** Codex
**Created:** 2026-06-06

## Objective

Integrate Understand-assisted impact analysis into the standard work-package lifecycle so new WPs define more accurate scope, dependencies, regression coverage, and graph-update expectations before implementation begins.

## Why This WP Exists

WP-145 established a validated repository knowledge graph, but the current work-package workflow does not consistently use it. Contributors can still create a WP without checking upstream consumers, downstream dependencies, related tests, architectural layers, or whether a structural graph update will be required.

The project already has the correct authority boundaries:

- `SSOT-Development-Workflow.md` owns mandatory WP rules.
- `Work-Package-Lifecycle.md` owns the operational lifecycle.
- `new-lite-work-package.ps1` creates the standard WP structure.
- `sequel-city-wp-finalize` closes accepted WPs.
- Understand provides codebase analysis but should not become a runtime dependency or a mandatory regeneration step for every minor change.

This package adds a complementary planning workflow without creating a second SSOT or duplicating finalization behavior.

## Scope

### In Scope

- add an Understand-assisted impact-analysis rule to the existing development-workflow SSOT
- document when Understand analysis is required, recommended, or unnecessary
- add an `Impact Analysis` section to newly generated lite WPs
- require each new WP to record affected layers, dependencies, tests, and graph-regeneration disposition
- create a repository-local `sequel-city-wp-planning` Codex skill
- have the planning skill check the current WP number and graph availability/freshness
- have the planning skill use targeted Understand graph queries to propose WP scope and regression coverage
- keep the human or requesting agent responsible for approving the WP before implementation
- repair or explicitly deprecate the legacy `new-work-package.ps1` script that currently references the unrelated Canvas repository
- update contributor and Understand documentation to describe the planning workflow
- add focused validation for WP generation and skill structure

### Out of Scope

- changing application runtime behavior
- changing Case 004 progression or database data
- making Understand a build, test, install, or production dependency
- regenerating the graph for every documentation, copy, CSS, or isolated test change
- allowing the planning skill to implement code automatically
- replacing the audit or finalization workflow
- replacing human scope approval
- vendoring the external Understand Anything plugin
- creating a new SSOT dedicated only to Understand

## Impact Analysis

### Understand Status

- Graph available: Yes
- Baseline commit: `834216bd32ffb567db572e725908d2e54c795e9d`
- Freshness assessment: `Usable with non-structural drift`
- Analysis performed: Reviewed the workflow, generator, existing finalization skill, repository graph policy, and current skill conventions. The commit after the graph baseline established the tracked Understand artifacts and did not alter application architecture.

### Affected Architecture

- Layers: Architecture and Operations; Repository Tooling
- Primary files/components: development workflow SSOT, WP lifecycle, contributor and Understand guides, WP generator scripts, repository-local planning skill
- Upstream consumers: contributors and agents creating new work packages
- Downstream dependencies: work-package audit prompts, scope checks, implementation planning, and eventual accepted-WP finalization

### Regression Surface

- Related tests: PowerShell parser validation, isolated WP-generation fixtures, skill validator
- User workflows: creating a new WP, using the legacy generator entry point, planning cross-cutting work, auditing impact assumptions
- Security/data boundaries: No application security or data boundary changes; the workflow only requires those boundaries to be recorded when relevant

### Graph Update Decision

- Regeneration required: No
- Rationale: This package changes development documentation and repository-local planning tooling, not application architecture, imports, database structure, or Case 004 runtime progression. A future structural graph refresh can incorporate the new skill and workflow documents.

## SSOT References

- `docs/00-ssot/SSOT-Development-Workflow.md`
- `docs/00-ssot/SSOT-AI-Agent-Boundaries.md`
- `docs/05-development-workflow/Contributor-Workflow-Guide.md`
- `docs/05-development-workflow/Work-Package-Lifecycle.md`
- `docs/05-development-workflow/Understand-Codebase-Analysis.md`
- `docs/05-development-workflow/Commit-Message-Guide.md`

## Files Allowed To Change

Allowed:

- `docs/00-ssot/SSOT-Development-Workflow.md`
- `docs/05-development-workflow/Contributor-Workflow-Guide.md`
- `docs/05-development-workflow/Work-Package-Lifecycle.md`
- `docs/05-development-workflow/Understand-Codebase-Analysis.md`
- `scripts/new-lite-work-package.ps1`
- `scripts/new-work-package.ps1`
- `.codex/skills/sequel-city-wp-planning/**`
- focused script or skill validation files if required
- this work-package document

Do Not Modify:

- `apps/api/**`
- `apps/web/**`
- `database/**`
- `.understand-anything/knowledge-graph.json`
- `.understand-anything/fingerprints.json`
- `.understand-anything/meta.json`
- `.understand-anything/intermediate/scan-result.json`
- `.codex/skills/sequel-city-wp-finalize/**`
- unrelated work-package documents

## Constraints

- Extend `SSOT-Development-Workflow.md`; do not create a competing SSOT.
- Keep the SSOT rule concise and place detailed procedure in the lifecycle and Understand guides.
- The planning skill must be advisory and deterministic where possible.
- The planning skill must not edit application code or mark a WP accepted.
- The planning skill must not silently regenerate or commit the knowledge graph.
- Missing or stale graph data must be reported, not concealed.
- Graph freshness must be classified rather than treated as a simplistic `meta commit == HEAD` requirement.
- A baseline commit that only adds or refreshes Understand artifacts must not make the graph unusable for planning.
- Narrow changes may explicitly record that Understand analysis or regeneration is not required.
- The generated WP must remain usable when Understand is not installed; the limitation must be recorded in `Impact Analysis`.
- The existing accepted-WP finalization skill remains the sole repository skill for commit and push closeout.

## Required Behavior

### SSOT Rule

`SSOT-Development-Workflow.md` must establish:

- cross-module, architectural, database, security-boundary, and case-progression WPs require an impact analysis before implementation
- Understand should be used when its graph is available
- the impact analysis informs scope and audit coverage but does not override SSOT or human judgment
- narrow isolated changes may document why graph analysis is unnecessary

### Impact Analysis Section

New lite WPs must include:

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

The section must be completed before implementation for cross-cutting WPs.

### Analysis Tiers

The workflow must define three tiers:

1. **Required**
   - cross-module changes
   - architecture or dependency changes
   - database schema or migration changes
   - restricted-table, answer-key, or security-boundary changes
   - Case 004 milestone, clue, guidance, or state-machine changes
   - new services, routes, major components, or feature modules

2. **Recommended**
   - changes to shared components or utilities
   - test-harness changes
   - substantial workflow documentation changes
   - corrective work where the affected surface is uncertain

3. **Optional**
   - isolated copy edits
   - local CSS polish without component restructuring
   - narrow test expectation corrections
   - typo and formatting corrections

### Graph Freshness

The planning workflow must report:

- whether `knowledge-graph.json`, `meta.json`, and `fingerprints.json` exist
- the graph baseline commit
- current `HEAD`
- files changed since the baseline when Git history permits
- whether those changes are structural, potentially relevant, or Understand-only baseline changes

Freshness outcomes:

- `Current`
- `Usable with non-structural drift`
- `Structurally stale; regenerate before relying on scope`
- `Unavailable`

Freshness is an input to planning, not an automatic failure condition.

### Planning Skill

Create `.codex/skills/sequel-city-wp-planning/` with:

- `SKILL.md`
- `agents/openai.yaml`
- focused references or scripts only when they remove repeated logic

The skill must:

1. inspect repository status and existing WP numbering
2. read the WP lifecycle and Understand guide
3. evaluate graph availability and freshness
4. search relevant graph nodes and one-hop relationships
5. identify architecture layers, likely files, dependencies, and tests
6. propose the smallest practical allowed-file set
7. identify explicit `Do Not Modify` boundaries
8. classify Understand analysis and regeneration requirements
9. create the next numbered WP using the standard structure
10. stop after WP creation unless implementation is separately requested

The skill must not:

- invent graph relationships
- treat generated summaries as more authoritative than source files
- modify runtime code
- run finalization, commit, or push without a separate request

### WP Generator

Update `new-lite-work-package.ps1` so generated WPs contain the new `Impact Analysis` section in the correct location before implementation requirements.

Handle `new-work-package.ps1` by either:

- converting it into a repository-relative wrapper around the supported generator, or
- replacing its behavior with a clear deprecation message directing contributors to `new-lite-work-package.ps1`

It must no longer reference `D:\GitHub-Repos\Canvas`.

### Audit Integration

The lifecycle and generated Audit Prompt must direct reviewers to verify:

- the impact analysis matches the actual changed files
- affected dependencies and tests were not omitted
- graph regeneration was performed when required
- generated graph changes, when present, contain no transient artifacts
- Understand output did not override SSOT, source code, or observed behavior

## Acceptance Criteria

- [x] The existing development-workflow SSOT contains a concise impact-analysis rule.
- [x] No new Understand-specific SSOT is created.
- [x] The lifecycle defines required, recommended, and optional Understand analysis tiers.
- [x] The lifecycle defines graph-freshness classifications.
- [x] New lite WPs include the complete `Impact Analysis` section.
- [x] The generated Audit Prompt includes impact-analysis verification.
- [x] A repository-local `sequel-city-wp-planning` skill exists.
- [x] The planning skill proposes scope, boundaries, dependencies, and tests from targeted graph evidence.
- [x] The planning skill records when the graph is unavailable or stale.
- [x] The planning skill stops after WP creation unless implementation is separately requested.
- [x] The legacy WP generator no longer references the Canvas repository.
- [x] Contributor and Understand documentation explain the new workflow.
- [x] Focused generator/skill validation passes.
- [x] No application, database, or existing graph-baseline files change.
- [x] No unrelated files change.

## Code Prompt

Implement WP-146 as a documentation, workflow, script, and repository-skill change.

1. Add a concise Understand-assisted impact-analysis requirement to `SSOT-Development-Workflow.md`.
2. Put detailed analysis tiers, freshness rules, planning steps, and audit expectations in `Work-Package-Lifecycle.md`.
3. Update `new-lite-work-package.ps1` with the required `Impact Analysis` structure and audit checks.
4. Create the `sequel-city-wp-planning` skill using the repository's existing skill conventions.
5. Ensure the skill uses targeted graph evidence, source verification, and conservative scope proposals.
6. Ensure the skill creates a WP and stops; it must not implement, accept, commit, or push automatically.
7. Repair or deprecate `new-work-package.ps1` so it is repository-relative and no longer references Canvas.
8. Update contributor and Understand documentation.
9. Add and run focused validation without modifying application or graph-baseline files.

## Implementation Plan

Expected approach:

1. Add the authority-level rule to the existing SSOT.
2. Extend the lifecycle guide with the detailed decision matrix and freshness classification.
3. Update the lite WP template embedded in `new-lite-work-package.ps1`.
4. Build the planning skill with a short workflow and references to existing project documents.
5. Reuse repository-relative PowerShell and Git commands rather than hardcoded machine paths.
6. Validate the generator in an isolated temporary destination or with a non-writing preview mechanism.
7. Validate skill metadata and required files.
8. Audit changed paths against this package.

## Verification Requirements

At minimum:

- PowerShell syntax validation for both WP generator scripts
- generated-WP fixture or temporary generation showing the complete `Impact Analysis` section
- confirmation that no `D:\GitHub-Repos\Canvas` reference remains in the generator scripts
- skill manifest and required-file validation
- targeted documentation review for conflicting or duplicated authority
- `git diff --check`
- scope review confirming no application, database, or graph-baseline changes

## Code Results

Implemented:

- Added the concise mandatory impact-analysis rule to `SSOT-Development-Workflow.md`.
- Added required/recommended/optional analysis tiers, the complete impact-analysis schema, graph-freshness classifications, fallback behavior, and audit expectations to `Work-Package-Lifecycle.md`.
- Updated the contributor workflow to place impact analysis before implementation and link the Understand guide.
- Extended the Understand guide with planning-skill usage, freshness classifications, and source-verification expectations.
- Updated `new-lite-work-package.ps1` to:
  - generate the complete `Impact Analysis` section
  - generate preferred `Allowed` and `Do Not Modify` scope subsections
  - add impact-analysis checks to the Audit Prompt
  - accept a destination override for isolated validation
- Replaced the hardcoded Canvas implementation in `new-work-package.ps1` with a repository-relative compatibility wrapper around the supported lite generator.
- Created `.codex/skills/sequel-city-wp-planning/` with:
  - concise trigger metadata and workflow instructions
  - OpenAI interface metadata
  - a focused planning checklist reference
- Kept the planning skill advisory and stopped it before implementation, acceptance, finalization, commit, push, or graph regeneration.

## Verification

Completed on 2026-06-06:

- PowerShell parser validation:
  - `scripts/new-lite-work-package.ps1`: PASS
  - `scripts/new-work-package.ps1`: PASS
- Skill validation:
  - `quick_validate.py .codex/skills/sequel-city-wp-planning`: PASS
- Generator fixture validation:
  - direct lite generator produced `WP-901-impact-analysis-fixture.md`: PASS
  - legacy compatibility wrapper produced `WP-902-legacy-wrapper-fixture.md`: PASS
  - both fixtures contained all required impact-analysis headings and the new audit check
  - temporary fixtures were removed after validation
- Hardcoded path check:
  - no `D:\GitHub-Repos\Canvas` reference remains in the generator scripts
- Repository diff validation:
  - `git diff --check`: PASS
- Scope check:
  - no `apps/api/**`, `apps/web/**`, `database/**`, existing graph-baseline, or finalization-skill files changed

## Audit Prompt

Audit WP-146 for authority alignment, planning usefulness, conservative automation, graph-freshness handling, and scope compliance.

Verify:

1. The SSOT contains only the mandatory rule and delegates procedure to workflow documentation.
2. No competing Understand-specific SSOT was created.
3. Required/recommended/optional analysis tiers are concrete and usable.
4. Freshness logic distinguishes Understand-only baseline drift from structural application drift.
5. New WPs contain the complete impact-analysis fields.
6. The planning skill uses graph evidence but verifies source files before asserting scope.
7. The planning skill proposes related tests and explicit prohibited boundaries.
8. The planning skill does not implement, accept, commit, push, or regenerate the graph without separate authorization.
9. The workflow remains usable when Understand is unavailable.
10. The legacy generator no longer references another repository.
11. Validation demonstrates the generator and skill structure work.
12. No application, database, or graph-baseline files changed.

Output:

- Verdict: PASS or FAIL
- Authority or duplication problems
- Missing planning safeguards
- Freshness-classification defects
- Scope violations
- Regression or workflow risks

## Audit Results

Audit completed on 2026-06-06.

### Audit Summary: PASS

No blocking findings were identified.

1. **Authority alignment:** PASS. The existing development-workflow SSOT contains one concise mandatory rule. Detailed tiers, freshness handling, and procedures remain in the lifecycle and Understand guides.
2. **No duplicate SSOT:** PASS. No Understand-specific SSOT was created.
3. **Analysis tiers:** PASS. Required, recommended, and optional tiers are concrete and cover cross-module, database, security, Case 004, shared-component, documentation, and narrow-change cases.
4. **Freshness handling:** PASS. The workflow checks graph artifacts, baseline commit, `HEAD`, and changed paths while explicitly allowing Understand-only baseline drift.
5. **Generated WP structure:** PASS. Direct and compatibility generators produce the complete `Impact Analysis`, preferred scope subsections, and audit-verification fields.
6. **Planning skill safeguards:** PASS. The skill uses targeted graph evidence, verifies findings against source, proposes tests and boundaries, reports stale/unavailable graphs, and stops before implementation or finalization.
7. **Understand-unavailable fallback:** PASS. The lifecycle and skill require source, import, and test discovery when external Understand skills are unavailable.
8. **Legacy generator:** PASS. `new-work-package.ps1` is repository-relative, warns that it is a compatibility wrapper, and contains no Canvas repository reference.
9. **Runner compatibility:** PASS. `run-work-package.ps1` successfully resolves and previews WP-146, and its scope parser recognizes the generated `Allowed:` and `Do Not Modify:` markers.
10. **Graph diff review:** PASS. Understand diff analysis matched the changed baseline files to the Architecture and Operations and Repository Tooling layers, with no downstream runtime graph edges.
11. **Validation:** PASS. PowerShell parsing, skill validation, isolated generator fixtures, auto-numbering, duplicate-slug behavior, hardcoded-path checks, and `git diff --check` pass.
12. **Scope compliance:** PASS. No application, database, graph-baseline, finalization-skill, or unrelated WP files changed.

### Audit Corrections

No implementation correction was required.

The transient `.understand-anything/diff-overlay.json` produced during audit was removed after the graph review so it does not enter the accepted change set.

### Residual Risk

- The repository-local planning skill is discovered by Codex on a fresh session or skill refresh; an already-running session may not list it immediately.
- Freshness classification intentionally requires engineering judgment. The workflow mitigates this by requiring changed-path inspection and source verification instead of relying on commit equality alone.
- Understand remains an external optional installation. The documented fallback preserves WP creation when it is unavailable.

## Final Decision

Accepted.

Reason: WP-146 adds a conservative, testable impact-analysis step to new work-package planning, keeps authority in the existing SSOT and source files, provides a validated repository-local planning skill, and preserves application/runtime independence. All acceptance criteria and focused audits pass.
