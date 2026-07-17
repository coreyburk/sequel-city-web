# WP-168: Agentic Development Workflow Evaluation

## Objective

Evaluate whether OpenAI Agents SDK should orchestrate the existing Sequel Detective Codex skills and work-package workflow, and define a narrow first proof of concept if the evaluation supports proceeding.

## Scope

### In Scope

- Evaluate agentic development workflow needs for this repository.
- Compare OpenAI Agents SDK against the existing Codex skills, work-package runner, Understand graph workflow, and finalization helper.
- Define hard boundaries for development-time agents.
- Identify the first proof-of-concept workflow, with audit-to-corrective-work-package generation as the preferred candidate unless evaluation rejects it.
- Document evaluation criteria, success/failure signals, dependency posture, and next-step implementation options.
- Update development workflow documentation if needed to distinguish agentic development tooling from runtime AI.
- Update the live handoff if needed to point to the chosen next step.

### Out of Scope

- Adding OpenAI Agents SDK as a dependency.
- Creating production agent orchestration code.
- Adding runtime AI to Sequel Detective.
- Adding Firecrawl, browser-use, Daytona, ECC, Ponytail, LangGraph, CrewAI, AutoGen, or LlamaIndex dependencies.
- Replacing the current work-package lifecycle.
- Allowing agents to approve their own work.
- Changing application runtime behavior, database behavior, or Case 004 progression.
- Regenerating the Understand graph during implementation unless explicitly requested as a finalization step.

## Impact Analysis

### Understand Status

- Graph available: Yes.
- Baseline commit: `2dc2b5b7fdc9c18cd4d11421e2f74bbd2a397792`.
- Freshness assessment: Structurally stale for current repository state. Current `HEAD` is `418990872a72e034197857ff383f74dfa575a90f`; later accepted work added student packaging, database seed synchronization, first-run bootstrap support, post-presentation documentation, app branding assets, and capstone artifacts. For this planning package, the stale graph is usable only as background context, not as authoritative scope evidence.
- Analysis performed: Read the development workflow SSOT, work-package lifecycle, Understand guide, planning skill instructions, current Git state, and recent work-package sequence through `WP-167`. Verified proposed scope against current docs and scripts rather than relying on graph relationships.

### Affected Architecture

- Layers: Architecture and Operations; Repository Tooling; Development Workflow Documentation.
- Primary files/components:
  - `docs/01-work-packages/WP-168-agentic-development-workflow-evaluation.md`
  - `docs/00-ssot/SSOT-Development-Workflow.md`
  - `docs/00-ssot/SSOT-AI-Agent-Boundaries.md`
  - `docs/05-development-workflow/Work-Package-Lifecycle.md`
  - `docs/05-development-workflow/Codex-Gemini-Execution-Guide.md`
  - `docs/05-development-workflow/Contributor-Workflow-Guide.md`
  - `docs/05-development-workflow/Understand-Codebase-Analysis.md`
  - `docs/00-ssot/END-OF-DAY-HANDOFF.md`
  - `.codex/skills/sequel-city-wp-planning/**`
  - `.codex/skills/sequel-city-wp-finalize/**`
  - `scripts/new-lite-work-package.ps1`
  - `scripts/run-work-package.ps1`
  - `scripts/commit-work-package.ps1`
- Upstream consumers: human developer, Codex/Claude code agents, Gemini/AntiGravity audit agents, future planning and finalization skills.
- Downstream dependencies: future agentic workflow proof of concept, corrective work-package generation, test-selection guidance, handoff refresh discipline, dependency decisions for development tooling.

### Regression Surface

- Related tests:
  - documentation review
  - `git diff --check`
  - PowerShell parser validation only if scripts are changed
  - skill validation only if repository-local skills are changed
- User workflows:
  - creating work packages
  - evaluating implementation/audit results
  - converting audit failures into corrective work
  - selecting verification commands
  - refreshing handoff state
  - finalizing accepted work
- Security/data boundaries:
  - No runtime SQL, database, spoiler, answer-key, student-data, or backend safety boundaries should change.
  - Development-time agents must remain advisory/executory under human acceptance.
  - Runtime AI remains prohibited unless separately authorized by SSOT and a future work package.

### Graph Update Decision

- Regeneration required: No for the evaluation implementation itself.
- Finalization update: Yes, after explicit user request.
- Rationale: This package is a planning/evaluation record and does not change application architecture, imports, database structure, Case 004 progression, or runtime behavior. During closeout, the user separately requested an Understand graph refresh. The refresh updated graph metadata and the fingerprint baseline against accepted `HEAD` so future graph-update checks start from the current commit.

## Files Allowed to Change

Allowed:

- `docs/01-work-packages/WP-168-agentic-development-workflow-evaluation.md`
- `docs/00-ssot/SSOT-Development-Workflow.md`
- `docs/05-development-workflow/Contributor-Workflow-Guide.md`
- `docs/05-development-workflow/Work-Package-Lifecycle.md`
- `docs/05-development-workflow/Codex-Gemini-Execution-Guide.md`
- `docs/05-development-workflow/Understand-Codebase-Analysis.md`
- `docs/00-ssot/END-OF-DAY-HANDOFF.md`
- optional focused evaluation document under `docs/05-development-workflow/` if the evaluation needs more structure
- `.understand-anything/fingerprints.json` for the requested final graph baseline refresh
- `.understand-anything/knowledge-graph.json` for the requested final graph metadata refresh
- `.understand-anything/meta.json` for the requested final graph metadata refresh

Do Not Modify:

- `apps/api/**`
- `apps/web/**`
- `database/**`
- `scripts/**`
- `.codex/skills/**`
- package manifests
- dependency lockfiles
- `outputs/**`

## Constraints

- Keep this package evaluative unless implementation is separately requested.
- Do not install or add OpenAI Agents SDK.
- Do not add Python tooling to the repo in this package.
- Do not add runtime AI behavior, runtime LLM calls, MCP runtime requirements, cloud services, or external APIs to Sequel Detective.
- Do not weaken the work-package lifecycle, final human acceptance, or independent audit expectations.
- Do not let any agent accept its own work.
- Do not let agentic tooling silently update SSOT, execute destructive file/database actions, or expand scope without a follow-up work package.
- Treat OpenAI Agents SDK, Ponytail, ECC, Firecrawl, browser-use, Daytona, LangGraph, CrewAI, AutoGen, LlamaIndex, and MCP servers as evaluation candidates only.

## Required Behavior

The evaluation must answer:

- Which parts of the current process should become more agentic?
- Which parts must remain human-owned?
- Whether OpenAI Agents SDK is a good orchestration layer over the existing Codex skills/work-package system.
- Whether the repo should first improve Codex skills directly instead of adding a Python orchestration layer.
- What the first proof of concept should be.
- What evaluation criteria determine success or failure.
- What dependency boundaries apply if OpenAI Agents SDK is later introduced.

The evaluation must use these default assumptions unless it explicitly rejects them with reasons:

- First target workflow: `idea/intake -> WP draft -> impact analysis -> test recommendation -> implementation prompt -> audit prompt -> corrective WP if needed`.
- First proof of concept: audit-to-corrective-work-package generation.
- OpenAI Agents SDK is a development-time candidate only.
- Existing work-package lifecycle, audit requirements, and human final decision remain authoritative.

## Acceptance Criteria

- [x] The evaluation defines a target agentic development workflow.
- [x] The evaluation defines hard agent boundaries and human-owned decisions.
- [x] The evaluation inventories the existing relevant repo skills/scripts/docs.
- [x] The evaluation compares OpenAI Agents SDK with improving existing Codex skills directly.
- [x] The evaluation identifies the first proof of concept or explains why no proof of concept should proceed.
- [x] The evaluation defines success and failure criteria for the proof of concept.
- [x] The evaluation documents dependency posture for Python/OpenAI Agents SDK without adding dependencies.
- [x] Runtime AI remains explicitly out of scope.
- [x] No app, database, script, skill, package-manifest, lockfile, or output artifact files are modified.
- [x] Understand graph metadata and fingerprints are refreshed only as an explicit finalization request.

## Code Prompt

Perform `WP-168` as an evaluation and documentation package.

Scope:

- Only modify allowed documentation files.
- Do not add dependencies, scripts, skills, or runtime code.

Required evaluation content:

1. Define the target agentic development workflow.
2. Identify human-owned gates and forbidden agent actions.
3. Inventory the existing process assets:
   - work-package lifecycle
   - `sequel-city-wp-planning`
   - `sequel-city-wp-finalize`
   - Understand graph workflow
   - `run-work-package.ps1`
   - `new-lite-work-package.ps1`
   - `commit-work-package.ps1`
4. Compare:
   - OpenAI Agents SDK orchestration
   - direct Codex skill improvements
   - no new framework yet
5. Evaluate related candidates only as context:
   - Ponytail
   - ECC
   - Firecrawl
   - browser-use
   - Daytona
   - LangGraph
   - CrewAI
   - AutoGen
   - LlamaIndex
   - MCP servers
6. Recommend the first proof of concept, preferably audit-to-corrective-WP generation if still justified.
7. Define success/failure criteria and dependency boundaries.
8. Update handoff or workflow docs only where needed.

Return:

- files changed
- evaluation conclusion
- recommended next work package
- verification performed

## Audit Prompt

Audit `WP-168`.

Verify:

- The package remained evaluation-only.
- No runtime AI support was added or implied.
- No dependencies, scripts, skills, app files, database files, package manifests, lockfiles, or outputs changed.
- Any graph changes are limited to the explicitly requested finalization refresh.
- The evaluation clearly distinguishes development-time agent tooling from Sequel Detective runtime behavior.
- Human final authority, SSOT control, independent audit, and destructive-action gates remain intact.
- The OpenAI Agents SDK recommendation is justified against current repo process assets.
- The first proof of concept is narrow, testable, and low risk.
- Acceptance criteria are satisfied.
- Graph regeneration decision was followed.

Output:

- Verdict: PASS or FAIL
- Scope violations
- Unsupported runtime-AI claims
- Missing boundaries
- Weak evaluation assumptions
- Recommended corrections

## Code Results

Implemented.

Changed files:

- Added `docs/05-development-workflow/Agentic-Development-Workflow-Evaluation.md`.
- Updated `docs/05-development-workflow/Contributor-Workflow-Guide.md` to link the new evaluation guide.
- Updated `docs/00-ssot/END-OF-DAY-HANDOFF.md` to reflect `WP-168`, current `HEAD`, and the recommended next step.
- Updated this work package with completed results and acceptance evidence.
- Updated `.understand-anything/knowledge-graph.json`, `.understand-anything/meta.json`, and `.understand-anything/fingerprints.json` for the user-requested final graph refresh.

Evaluation conclusion:

- Do not install OpenAI Agents SDK yet.
- First validate agentic workflow value with a repo-local Codex skill.
- Use audit-to-corrective-work-package generation as the first proof of concept.
- Treat OpenAI Agents SDK as a second-stage orchestration option after the workflow proves valuable.
- Keep runtime AI, cloud services, external APIs, dependency changes, app behavior, database behavior, and graph regeneration out of scope.
- Treat the Understand refresh as a finalization baseline update, not a new architecture analysis or app behavior change.

Recommended next work package:

- Audit-to-corrective-work-package skill package.

Verification performed:

- Documentation review against `WP-168` scope and acceptance criteria.
- `git diff --check` for changed files.
- `rg` checks for runtime-AI boundary language and pending placeholders.
- Understand graph metadata now points at `418990872a72e034197857ff383f74dfa575a90f`.
- Bundled Understand fingerprint builder reported `Fingerprints baseline: 416 files`.

## Audit Results

AntiGravity audit completed after the user explicitly approved AGY access for independent audit.

### Verdict

PASS.

### Scope Violations

None. AntiGravity confirmed all modified and created files are documentation-only under `docs/`. No dependencies, scripts, skills, application code, database files, graph files, package manifests, lockfiles, or output files were changed.

### Unsupported Runtime-AI Claims

None. AntiGravity confirmed the evaluation and updated files explicitly keep runtime AI, runtime LLM calls, and external runtime APIs out of scope for the student-facing Sequel Detective application.

### Missing Boundaries

None. AntiGravity confirmed the evaluation defines human-owned gates and forbidden agent actions, keeping sprint priorities, SSOT updates, dependency adoption, final work-package acceptance, and destructive-action control human-owned.

### Weak Evaluation Assumptions

- Stale Understand graph reliance: the impact analysis correctly notes the graph is structurally stale. Future POC work should avoid relying on stale graph output for authoritative test selection or impact analysis.
- Orchestration complexity: the evaluation assumes direct repository-local Codex skill improvements can validate the workflow before SDK orchestration. This is low-risk, but complex multi-step workflows may still need structured orchestration later.

### Recommended Corrections

None. AntiGravity found `WP-168` and its referenced changes compliant with repository constraints, process expectations, and safety boundaries.

### Post-Audit Finalization Note

After the audit passed, the user explicitly requested an Understand graph update before finalization. The closeout refresh updated graph metadata and fingerprints to current accepted `HEAD` and did not add application code, dependencies, scripts, skills, database changes, package changes, lockfile changes, or output artifacts. It did not rerun full LLM graph extraction for every source change since the prior graph baseline.

## Final Decision

Accepted.

Reason: The evaluation is complete, AntiGravity audit passed, runtime AI remains out of scope, human acceptance and independent audit boundaries remain intact, and the requested Understand graph closeout refresh was limited to graph metadata and fingerprint baseline artifacts.
