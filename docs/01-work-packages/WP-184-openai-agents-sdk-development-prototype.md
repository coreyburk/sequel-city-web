# WP-184: OpenAI Agents SDK Development Prototype

## Objective

Create a development-only OpenAI Agents SDK prototype scaffold that models the Sequel Detective work-package lifecycle with local tool contracts, offline fixtures, and no runtime app integration.

## Scope

### In Scope

- Add a dedicated development-only prototype folder under `tools/openai-agents-prototype/`.
- Add Python prototype source that models:
  - a central work-package manager/orchestrator
  - read-only lifecycle tool contracts over existing helper scripts
  - structured output objects for planning, audit dispatch, corrective planning, and closeout readiness
  - guardrail checks for human acceptance, external audit authorization, runtime AI prohibition, and commit/push gating
- Add optional OpenAI Agents SDK dependency metadata for the prototype only.
- Add offline/no-network fixture tests using the Python standard library.
- Add documentation explaining setup, offline validation, optional SDK execution posture, API key assumptions, tracing defaults, and boundaries.
- Update `docs/05-development-workflow/OpenAI-Agents-SDK-Orchestration-Readiness.md` only enough to point to the prototype once implemented.
- Refresh `docs/00-ssot/END-OF-DAY-HANDOFF.md` during implementation closeout.
- Update this WP with Code Results and validation evidence.

### Out of Scope

- Adding runtime AI, runtime LLM calls, runtime MCP requirements, cloud services, or external APIs to Sequel Detective.
- Calling OpenAI APIs during implementation or tests.
- Requiring network access for validation.
- Enabling tracing export by default.
- Adding the prototype to app workspaces, app package manifests, app build scripts, or runtime startup paths.
- Replacing existing PowerShell lifecycle helpers, Codex skills, AGY audit runner, closeout preflight, or commit helper.
- Allowing agents to accept their own work, invoke external audit without authorization, commit, push, mutate databases, or perform destructive filesystem operations.
- Changing application runtime behavior, database behavior, Case 004 progression, app tests, graph artifacts, or release assets.

## Impact Analysis

### Understand Status

- Graph available: Yes.
- Baseline commit: `418990872a72e034197857ff383f74dfa575a90f`.
- Freshness assessment: Structurally stale for current workflow tooling. Current `HEAD` is `6c60b2cdebdb0f4865344d46a0a328198e7fd671`; later accepted work added lifecycle helpers, audit/closeout wrappers, repo-local skills, database identity health work, SDK readiness documentation, and closeout verdict-format tolerance. The graph is not authoritative for this prototype scope.
- Analysis performed: Read development workflow SSOT, work-package lifecycle, Understand guidance, OpenAI Agents SDK orchestration readiness guide, WP-182, WP-183, current helper scripts, repo-local skills, current Git state, and official OpenAI Agents SDK docs for Agents, Runner, handoffs, configuration, tracing, and quickstart behavior. Used source and documentation search rather than graph relationships for the affected development-tooling surface.

### Affected Architecture

- Layers:
  - Development Workflow Tooling
  - Agentic Development Governance
  - Repository Tool Contracts
- Primary files/components:
  - `docs/01-work-packages/WP-184-openai-agents-sdk-development-prototype.md`
  - `tools/openai-agents-prototype/README.md`
  - `tools/openai-agents-prototype/pyproject.toml`
  - `tools/openai-agents-prototype/src/sequel_agents_prototype/**`
  - `tools/openai-agents-prototype/tests/**`
  - `docs/05-development-workflow/OpenAI-Agents-SDK-Orchestration-Readiness.md`
  - `docs/00-ssot/END-OF-DAY-HANDOFF.md`
- Upstream consumers:
  - human developer
  - Codex planning, audit, corrective, closeout, and finalization skills
  - future SDK orchestration work
  - future audit workflows evaluating agentic development tooling
- Downstream dependencies:
  - later decision whether to run a live OpenAI Agents SDK manager against controlled repo fixtures
  - future deterministic wrappers over lifecycle helper scripts
  - possible later SDK tracing/data-policy hardening

### Regression Surface

- Related tests:
  - `python -m unittest discover tools/openai-agents-prototype/tests`
  - `python -m py_compile` for prototype source files
  - `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-status.ps1 WP-184`
  - `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-validation-plan.ps1 WP-184`
  - `powershell -ExecutionPolicy Bypass -File scripts/check-work-package-closeout.ps1 WP-184`
  - `git diff --check`
- User workflows:
  - work-package planning and state inspection
  - audit dispatch preparation
  - corrective WP planning
  - accepted-WP closeout and handoff refresh
  - deciding whether to run a live SDK prototype
- Security/data boundaries:
  - No runtime SQL, database, answer-key, student-data, spoiler, credential, or Case 004 progression behavior changes.
  - Prototype must not send prompt, diff, source, audit, or handoff context externally by default.
  - Tracing export must be disabled by default or configured to exclude sensitive data when live SDK execution is explicitly enabled.
  - `OPENAI_API_KEY` may be documented as optional for future manual live runs, but tests must not require it.

### Graph Update Decision

- Regeneration required: No.
- Rationale: This package adds isolated development tooling and documentation. It does not change application architecture, imports, database structure, Case 004 progression, app runtime behavior, package manifests for app workspaces, or graph artifacts.

## Files Allowed to Change

Allowed:

- `docs/01-work-packages/WP-184-openai-agents-sdk-development-prototype.md`
- `tools/`
- `tools/openai-agents-prototype/**`
- `docs/05-development-workflow/OpenAI-Agents-SDK-Orchestration-Readiness.md`
- `docs/00-ssot/END-OF-DAY-HANDOFF.md`

Do Not Modify:

- `apps/api/**`
- `apps/web/**`
- `database/**`
- `scripts/**`
- `.codex/skills/**`
- `.understand-anything/**`
- root `package.json`
- root `package-lock.json`
- app package manifests
- app dependency lockfiles
- `outputs/**`
- historical work packages other than this active `WP-184`

## Constraints

- Keep the prototype development-only and isolated under `tools/openai-agents-prototype/`.
- Do not call OpenAI APIs during implementation, tests, audit, or closeout.
- Do not require network access for validation.
- Do not enable trace export by default.
- Do not log or export repository prompt, diff, audit, source, handoff, credential, answer-key, or student data.
- Do not add the prototype to runtime startup, app build, app package, database, or deployment workflows.
- Do not modify existing lifecycle helper scripts or repo-local skills in this WP.
- Do not allow the prototype to accept work, invoke external audit, commit, push, mutate databases, or perform destructive filesystem operations.
- If `openai-agents` dependency metadata is added, it must be confined to the prototype package and optional for offline tests.
- Treat official OpenAI Agents SDK docs as API guidance only, not authorization to weaken repo workflow rules.

## Required Behavior

- The prototype package must include a README that explains:
  - development-only scope
  - installation is optional
  - offline tests are the default validation path
  - `OPENAI_API_KEY` is only for future explicit live runs
  - tracing defaults and sensitive-data policy
  - no runtime app integration
- The Python source must define structured contracts for:
  - work-package draft state
  - audit dispatch state
  - corrective planning state
  - closeout readiness state
- The Python source must define local tool wrappers or tool-contract stubs for:
  - `get-work-package-status.ps1 -Json`
  - `get-work-package-validation-plan.ps1 -Json`
  - `check-work-package-closeout.ps1 -Json`
  - prompt preview through `run-work-package.ps1 -Execute None`
  - work-package creation through `new-lite-work-package.ps1`
  - audit dispatch as preparation only unless explicit authorization is present
- The prototype must expose a manager/orchestrator object or function that routes fixture intents to the correct structured output without requiring a live LLM call.
- Optional OpenAI Agents SDK integration must be isolated behind an import boundary so tests pass when `openai-agents` is not installed.
- The prototype must include guardrail behavior proving:
  - external audit cannot be invoked without explicit authorization
  - commit/push is not allowed unless final decision is accepted and closeout is ready
  - runtime AI is not a valid action
  - missing SDK/API key falls back to offline mode
- Offline tests must cover the four readiness fixture scenarios from `OpenAI-Agents-SDK-Orchestration-Readiness.md`:
  - idea intake to WP draft
  - implemented WP to audit request
  - failed audit to corrective WP
  - accepted WP to closeout/handoff refresh
- Implementation must record validation evidence in Code Results.

## Acceptance Criteria

- [x] Prototype files exist only under `tools/openai-agents-prototype/**`.
- [x] Prototype dependency metadata is confined to `tools/openai-agents-prototype/pyproject.toml`.
- [x] Offline tests pass without `openai-agents`, `OPENAI_API_KEY`, network access, or trace export.
- [x] Structured output contracts exist for planning, audit dispatch, corrective planning, and closeout readiness.
- [x] A manager/orchestrator routes fixture intents without a live LLM call.
- [x] Guardrails block runtime AI, unauthorized external audit, and autonomous commit/push.
- [x] README documents setup, offline mode, optional live SDK posture, tracing/data policy, and runtime-app prohibition.
- [x] SDK readiness document points to the prototype without authorizing runtime AI or default external data transmission.
- [x] No app, database, script, skill, graph, output, app package, app lockfile, or runtime behavior files change.
- [x] Code Results record validation evidence.
- [x] Audit Results and Final Decision remain pending until independent audit and human acceptance.

## Code Prompt

Implement `WP-184` exactly as specified.

Scope:

- Only modify files listed under `Files Allowed to Change`.
- Add an isolated prototype under `tools/openai-agents-prototype/`.
- Update the SDK readiness document only enough to reference the prototype and its boundaries.
- Refresh `docs/00-ssot/END-OF-DAY-HANDOFF.md` during closeout.
- Update this WP with Code Results and validation evidence after implementation.

Implementation requirements:

1. Create a small Python package structure under `tools/openai-agents-prototype/`.
2. Add `pyproject.toml` with development-only metadata and an optional `openai-agents` dependency declaration confined to the prototype.
3. Add source modules for structured output contracts, guardrails, local tool contracts, and offline manager/orchestrator behavior.
4. Keep optional SDK imports behind a boundary so tests pass without installing `openai-agents`.
5. Add standard-library `unittest` coverage for the four readiness fixture scenarios and guardrail behavior.
6. Do not call OpenAI APIs or require network access.
7. Do not enable tracing export by default.
8. Do not modify scripts, skills, app code, database files, graph artifacts, package manifests outside the prototype, lockfiles, or runtime behavior.

Verification:

- `python -m unittest discover tools/openai-agents-prototype/tests`
- `python -m py_compile` over prototype source files
- `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-status.ps1 WP-184`
- `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-validation-plan.ps1 WP-184`
- `powershell -ExecutionPolicy Bypass -File scripts/check-work-package-closeout.ps1 WP-184`
- `git diff --check`

Return:

- files changed
- prototype behavior summary
- validation performed
- unresolved limitations

## Audit Prompt

Audit `WP-184`.

Before deciding whether artifacts are missing, inspect the working tree, including untracked files:

- `git status --short --untracked-files=all`
- `Get-ChildItem -Path tools/openai-agents-prototype -Recurse -File`
- `tools/openai-agents-prototype/IMPLEMENTATION-MANIFEST.md`

Verify:

- The prototype is development-only and isolated under `tools/openai-agents-prototype/`.
- Offline tests pass without `openai-agents`, `OPENAI_API_KEY`, network access, or trace export.
- Optional SDK dependency metadata is confined to the prototype.
- No OpenAI API calls, AGY/Gemini calls, external services, or trace export are required by implementation or tests.
- Structured output contracts and guardrails match the SDK readiness document.
- Runtime AI, unauthorized external audit, and autonomous commit/push are blocked.
- Existing lifecycle helper scripts and repo-local skills remain unchanged.
- No app, database, graph, output, app package, app lockfile, runtime behavior, or historical WP files changed.
- Impact analysis matches actual changed files.
- Graph regeneration decision was followed.

Output:

- Verdict: PASS or FAIL
- Scope violations
- SDK/dependency isolation issues
- Offline validation gaps
- Guardrail gaps
- Runtime AI or external data risks
- Recommended corrections

## Code Results

Implemented.

Changed files:

- `tools/openai-agents-prototype/README.md`
- `tools/openai-agents-prototype/IMPLEMENTATION-MANIFEST.md`
- `tools/openai-agents-prototype/pyproject.toml`
- `tools/openai-agents-prototype/src/sequel_agents_prototype/__init__.py`
- `tools/openai-agents-prototype/src/sequel_agents_prototype/contracts.py`
- `tools/openai-agents-prototype/src/sequel_agents_prototype/guardrails.py`
- `tools/openai-agents-prototype/src/sequel_agents_prototype/tools.py`
- `tools/openai-agents-prototype/src/sequel_agents_prototype/manager.py`
- `tools/openai-agents-prototype/src/sequel_agents_prototype/sdk_boundary.py`
- `tools/openai-agents-prototype/tests/test_offline_manager.py`
- `docs/05-development-workflow/OpenAI-Agents-SDK-Orchestration-Readiness.md`
- `docs/00-ssot/END-OF-DAY-HANDOFF.md`
- `docs/01-work-packages/WP-184-openai-agents-sdk-development-prototype.md`

Prototype behavior summary:

- Added an isolated development-only Python prototype under `tools/openai-agents-prototype/`.
- Added structured dataclass contracts for work-package draft, audit dispatch, corrective planning, and closeout readiness states.
- Added pure guardrail checks for runtime AI requests, external audit authorization, and commit/push gating.
- Added local command contract stubs for the existing PowerShell lifecycle helpers without executing subprocesses.
- Added an offline manager that routes the four readiness fixture intents without live LLM calls.
- Added optional SDK availability inspection that does not import or call OpenAI Agents SDK and keeps tracing disabled by default.
- Added prototype-local `pyproject.toml` with optional `openai-agents` metadata confined to the prototype.
- Added README guidance for offline validation, optional live SDK posture, tracing/data policy, and runtime-app prohibition.
- Added an implementation manifest so auditors can inspect the untracked working-tree prototype inventory before closeout commit.
- Updated the SDK readiness document with the prototype location and boundaries.

Validation performed:

- PASS: `python -m unittest discover tools/openai-agents-prototype/tests`
- PASS: `python -m compileall tools/openai-agents-prototype/src`
- PASS: `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-status.ps1 WP-184` after scope correction, with no out-of-scope dirty files.
- PASS: `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-validation-plan.ps1 WP-184`, with state `ValidationEvidenceRecorded`.
- PASS: `powershell -ExecutionPolicy Bypass -File scripts/check-work-package-closeout.ps1 WP-184`, with state `ReadyForAudit`.
- PASS: `git diff --check` with CRLF warnings only.

Unresolved limitations:

- No live SDK run was performed.
- No OpenAI API calls, AGY/Gemini calls, network access, or trace export were performed.
- The prototype uses offline deterministic routing only; future live SDK orchestration requires a separate accepted WP.

## Audit Results

# Audit Report: WP-184

**Verdict:** **PASS**

---

### Working Tree & Artifact Verification

Inspection of the working tree confirmed that all prototype files exist and are isolated under `tools/openai-agents-prototype/`:

1. `git status --short --untracked-files=all`: Verified. Modified files are strictly confined to `docs/00-ssot/END-OF-DAY-HANDOFF.md`, `docs/05-development-workflow/OpenAI-Agents-SDK-Orchestration-Readiness.md`, `docs/01-work-packages/WP-184-openai-agents-sdk-development-prototype.md`, and untracked files under `tools/openai-agents-prototype/`.
2. `Get-ChildItem -Path tools/openai-agents-prototype -Recurse -File`: Verified. 10 prototype files present across `src/`, `tests/`, `pyproject.toml`, `README.md`, and `IMPLEMENTATION-MANIFEST.md`.
3. `tools/openai-agents-prototype/IMPLEMENTATION-MANIFEST.md`: Verified. Provides file inventory, audit visibility guidance, and validation commands.

---

### Audit Findings & Breakdown

#### 1. Scope Violations
* **None.** All created and modified files match the allowed files listed in [WP-184](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-184-openai-agents-sdk-development-prototype.md#L96-L103). No files under `apps/`, `database/`, `scripts/`, `.codex/skills/`, `.understand-anything/`, root `package.json`, lockfiles, `outputs/`, or historical work packages were touched.

#### 2. SDK / Dependency Isolation Issues
* **None.** Optional SDK dependency metadata (`openai-agents`) is strictly confined to [tools/openai-agents-prototype/pyproject.toml](file:///D:/GitHub-Repos/SequelCityWeb/tools/openai-agents-prototype/pyproject.toml#L9) under `[project.optional-dependencies]`. No dependencies were added to root or app package manifests or lockfiles.

#### 3. Offline Validation Gaps
* **None.** Standard-library test suite in [tools/openai-agents-prototype/tests/test_offline_manager.py](file:///D:/GitHub-Repos/SequelCityWeb/tools/openai-agents-prototype/tests/test_offline_manager.py) passed completely (10/10 tests PASS in 0.001s). The suite executes without requiring `openai-agents`, `OPENAI_API_KEY`, network access, or trace export.

#### 4. Guardrail Gaps
* **None.** Structured output contracts in [contracts.py](file:///D:/GitHub-Repos/SequelCityWeb/tools/openai-agents-prototype/src/sequel_agents_prototype/contracts.py) and pure guardrails in [guardrails.py](file:///D:/GitHub-Repos/SequelCityWeb/tools/openai-agents-prototype/src/sequel_agents_prototype/guardrails.py) match the SDK readiness document. The offline manager covers all 4 required readiness fixture scenarios.

#### 5. Runtime AI or External Data Risks
* **None.** `WorkflowGuardrails` explicitly blocks runtime AI actions, unauthorized external audits, and autonomous commit/push operations. `inspect_sdk_availability()` defaults to offline mode and ensures `tracing_enabled = False`. No live API calls to OpenAI, AntiGravity, or Gemini are performed.

#### 6. Graph & Impact Analysis
* **Verified.** Impact analysis matches actual changed files. The graph regeneration decision (No) was strictly followed as no app architecture, imports, database, or runtime behavior changed.

---

### Recommended Corrections

* **None.** WP-184 implementation and prototype artifacts fulfill all constraints and criteria. Update the Audit Results in [WP-184-openai-agents-sdk-development-prototype.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-184-openai-agents-sdk-development-prototype.md) with this **PASS** verdict to enable closeout finalization.

## Final Decision

Accepted for closeout on 2026-07-22.

Basis:

- AntiGravity independent audit returned `PASS`.
- Audit found no scope violations, SDK/dependency isolation issues, offline validation gaps, guardrail gaps, runtime AI risks, external data risks, or required corrections.
- User reported the audit completed and requested continuation of the established closeout workflow.
- WP-184 remains development-only: no runtime AI, app integration, database behavior, scripts, skills, graph artifacts, app package manifests, app lockfiles, or deployment behavior changed.


