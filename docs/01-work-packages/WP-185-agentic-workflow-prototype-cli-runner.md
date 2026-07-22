# WP-185: Agentic Workflow Prototype CLI Runner

## Objective

Add a development-only command-line runner for the WP-184 offline agentic workflow prototype so Codex can invoke deterministic fixture scenarios and receive structured JSON without live SDK execution, network access, API keys, tracing, or runtime app integration.

## Scope

### In Scope

- Add a Python module CLI entry point for `sequel_agents_prototype`.
- Support `python -m sequel_agents_prototype` execution when `tools/openai-agents-prototype/src` is on `PYTHONPATH`.
- Add fixture commands for:
  - idea intake to work-package draft
  - implemented work package to audit dispatch preparation
  - failed audit to corrective work-package planning
  - accepted work package to closeout readiness
- Emit structured JSON using the existing WP-184 contract objects.
- Include a `--pretty` option for indented JSON output.
- Keep all fixture behavior deterministic and offline.
- Add standard-library tests for CLI argument parsing, JSON output, fixture behavior, help text, and guardrail outcomes.
- Update prototype README and manifest with CLI usage and validation commands.
- Update this WP with Code Results and validation evidence during implementation.

### Out of Scope

- Installing, importing, or running OpenAI Agents SDK.
- Calling OpenAI APIs, AntiGravity, Gemini, MCP tools, external services, or network resources.
- Executing existing PowerShell lifecycle helper scripts from the CLI.
- Adding runtime AI, app integration, app package changes, root package changes, lockfiles, virtual environments, or deployment behavior.
- Adding autonomous commit, push, audit invocation, final acceptance, destructive filesystem actions, database mutations, or source-editing capabilities.
- Changing existing lifecycle helper scripts, repo-local Codex skills, app code, database files, graph artifacts, release artifacts, or historical work packages.

## Impact Analysis

### Understand Status

- Graph available: Yes.
- Baseline commit: `418990872a72e034197857ff383f74dfa575a90f`.
- Freshness assessment: Structurally stale for current development-workflow tooling. Current `HEAD` is `91db053e37dc766c963fbf872aeee90e40e5c49d`; later accepted work added lifecycle helpers, audit and closeout wrappers, repo-local skills, SDK readiness documentation, and the WP-184 prototype itself. The graph does not include the target prototype files and is not authoritative for this package.
- Analysis performed: Read development workflow SSOT, work-package lifecycle guidance, Understand guidance, OpenAI Agents SDK orchestration readiness document, WP-184, current prototype source, prototype tests, prototype metadata, current Git state, and targeted graph entries for workflow documents/scripts. Verified planned scope directly against source files under `tools/openai-agents-prototype/`.

### Affected Architecture

- Layers:
  - Development Workflow Tooling
  - Agentic Development Governance
  - Repository Tool Contracts
- Primary files/components:
  - `docs/01-work-packages/WP-185-agentic-workflow-prototype-cli-runner.md`
  - `tools/openai-agents-prototype/src/sequel_agents_prototype/cli.py`
  - `tools/openai-agents-prototype/src/sequel_agents_prototype/__main__.py`
  - `tools/openai-agents-prototype/tests/test_cli.py`
  - `tools/openai-agents-prototype/README.md`
  - `tools/openai-agents-prototype/IMPLEMENTATION-MANIFEST.md`
- Upstream consumers:
  - human developer
  - Codex development workflow
  - future SDK orchestration evaluation packages
  - existing WP-184 offline manager and contract classes
- Downstream dependencies:
  - future decision whether a sanitized live SDK smoke test is worthwhile
  - future decision whether deterministic helper-script subprocess wrappers should be introduced under a separate WP
  - future audit workflows that may use CLI JSON output as local evidence

### Regression Surface

- Related tests:
  - `python -m unittest discover tools/openai-agents-prototype/tests`
  - `python -m compileall tools/openai-agents-prototype/src`
  - CLI subprocess smoke tests using `PYTHONPATH=tools/openai-agents-prototype/src`
  - `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-status.ps1 WP-185`
  - `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-validation-plan.ps1 WP-185`
  - `powershell -ExecutionPolicy Bypass -File scripts/check-work-package-closeout.ps1 WP-185`
  - `git diff --check`
- User workflows:
  - running fixture scenarios from a terminal
  - letting Codex inspect deterministic JSON outputs before deciding the next lifecycle step
  - evaluating whether the prototype is useful before any live SDK smoke test
- Security/data boundaries:
  - CLI must not call OpenAI, AGY, Gemini, network, MCP, or trace export.
  - CLI must not execute PowerShell lifecycle helpers or mutate repository state.
  - CLI must not accept work, invoke audit, commit, push, mutate databases, or edit files.
  - Runtime app, database, answer-key, student-data, spoiler, package, lockfile, graph, and deployment boundaries remain unchanged.

### Graph Update Decision

- Regeneration required: No.
- Rationale: This package adds isolated development-only prototype CLI tooling under `tools/openai-agents-prototype/` and documentation for that prototype. It does not change app architecture, imports, runtime package manifests, database structure, Case 004 progression, deployment behavior, or graph artifacts.

## Files Allowed to Change

Allowed:

- `docs/01-work-packages/WP-185-agentic-workflow-prototype-cli-runner.md`
- `tools/openai-agents-prototype/README.md`
- `tools/openai-agents-prototype/IMPLEMENTATION-MANIFEST.md`
- `tools/openai-agents-prototype/src/sequel_agents_prototype/cli.py`
- `tools/openai-agents-prototype/src/sequel_agents_prototype/__main__.py`
- `tools/openai-agents-prototype/tests/test_cli.py`
- `docs/00-ssot/END-OF-DAY-HANDOFF.md`

Do Not Modify:

- `apps/**`
- `database/**`
- `scripts/**`
- `.codex/skills/**`
- `.understand-anything/**`
- `tools/openai-agents-prototype/pyproject.toml`
- `tools/openai-agents-prototype/src/sequel_agents_prototype/contracts.py`
- `tools/openai-agents-prototype/src/sequel_agents_prototype/guardrails.py`
- `tools/openai-agents-prototype/src/sequel_agents_prototype/manager.py`
- `tools/openai-agents-prototype/src/sequel_agents_prototype/sdk_boundary.py`
- `tools/openai-agents-prototype/src/sequel_agents_prototype/tools.py`
- root `package.json`
- root `package-lock.json`
- app package manifests
- app dependency lockfiles
- `outputs/**`
- historical work packages other than this active `WP-185`

## Constraints

- Keep the CLI development-only and isolated to the WP-184 prototype package.
- Use only the Python standard library.
- Do not add dependencies, package entry points, virtual environments, lockfiles, or SDK imports.
- Do not execute lifecycle helper scripts, AGY, Gemini, OpenAI APIs, MCP tools, network calls, or trace export.
- Do not add any runtime app integration or app-facing AI behavior.
- Do not introduce autonomous acceptance, audit invocation, commit, push, database mutation, destructive filesystem actions, or source edits.
- Keep JSON stable, machine-readable, and derived from existing contract `to_dict()` methods.
- If a CLI request would imply external audit execution or commit/push authority, return a blocked JSON state rather than performing the action.

## Required Behavior

- Add `sequel_agents_prototype.cli` with a `main(argv: list[str] | None = None) -> int` function.
- Add `sequel_agents_prototype.__main__` so the CLI runs through `python -m sequel_agents_prototype`.
- The CLI must provide help text that lists available fixture scenarios.
- The CLI must support a `run-fixture` command with these fixture names:
  - `idea-intake`
  - `audit-request`
  - `corrective-planning`
  - `closeout`
- The CLI must output one JSON object to stdout for successful fixture runs.
- The JSON object must include at least:
  - `kind`
  - fixture-specific contract fields from the existing structured state object
  - `blockers`
- `idea-intake` must accept `--slug`.
- `audit-request` must accept `--work-package` and optional `--external-data-authorized`; without authorization, it must return blocked audit dispatch JSON and must not invoke audit.
- `corrective-planning` must accept `--source-work-package`, `--corrective-work-package`, and `--finding-type`.
- `closeout` must accept `--work-package`, `--final-decision`, `--closeout-state`, `--handoff-refreshed`, and `--user-requested-push`.
- `--pretty` must emit indented JSON.
- Invalid fixture names or invalid arguments must return a non-zero process exit code through argparse behavior.
- Tests must prove the CLI can be invoked via subprocess with `PYTHONPATH=tools/openai-agents-prototype/src`.

## Acceptance Criteria

- [x] CLI runs with `python -m sequel_agents_prototype --help` when `PYTHONPATH` points at the prototype `src` directory.
- [x] CLI emits valid JSON for all four fixture scenarios.
- [x] CLI output uses existing structured contract fields and includes blockers.
- [x] Unauthorized audit request remains blocked and does not invoke AGY/Gemini/OpenAI/network.
- [x] Closeout fixture preserves commit/push guardrails.
- [x] CLI tests use only the Python standard library and pass without `openai-agents`, `OPENAI_API_KEY`, network access, or trace export.
- [x] README and implementation manifest document CLI usage and validation commands.
- [x] No lifecycle helper scripts, repo-local skills, app files, database files, package manifests, lockfiles, graph artifacts, outputs, or runtime behavior files change.
- [x] Code Results record validation evidence.
- [x] Audit Results and Final Decision remain pending until independent audit and human acceptance.

## Code Prompt

Implement `WP-185` exactly as specified.

Scope:

- Only modify files listed under `Files Allowed to Change`.
- Add a CLI wrapper for the existing WP-184 offline prototype manager.
- Update README and implementation manifest only enough to document CLI usage and validation.
- Refresh `docs/00-ssot/END-OF-DAY-HANDOFF.md` during closeout.
- Update this WP with Code Results and validation evidence after implementation.

Implementation requirements:

1. Add `tools/openai-agents-prototype/src/sequel_agents_prototype/cli.py`.
2. Add `tools/openai-agents-prototype/src/sequel_agents_prototype/__main__.py`.
3. Implement `run-fixture` with the four required fixture names and arguments.
4. Serialize existing contract objects with their `to_dict()` methods.
5. Use `json.dump` or equivalent standard-library JSON serialization.
6. Keep all behavior offline and deterministic.
7. Do not execute subprocesses or lifecycle helper scripts from the CLI.
8. Add standard-library `unittest` coverage in `tools/openai-agents-prototype/tests/test_cli.py`, including subprocess execution through `python -m sequel_agents_prototype`.
9. Update README and manifest with CLI commands and validation.
10. Do not modify scripts, skills, app code, database files, graph artifacts, package manifests, lockfiles, output files, or runtime behavior.

Verification:

- `python -m unittest discover tools/openai-agents-prototype/tests`
- `python -m compileall tools/openai-agents-prototype/src`
- `$env:PYTHONPATH='tools/openai-agents-prototype/src'; python -m sequel_agents_prototype --help`
- `$env:PYTHONPATH='tools/openai-agents-prototype/src'; python -m sequel_agents_prototype run-fixture idea-intake --slug docs-only-fixture`
- `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-status.ps1 WP-185`
- `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-validation-plan.ps1 WP-185`
- `powershell -ExecutionPolicy Bypass -File scripts/check-work-package-closeout.ps1 WP-185`
- `git diff --check`

Return:

- files changed
- CLI behavior summary
- validation performed
- unresolved limitations

## Audit Prompt

Audit `WP-185`.

Verify:

- CLI is development-only and isolated to the WP-184 prototype package.
- CLI runs through `python -m sequel_agents_prototype` with prototype `src` on `PYTHONPATH`.
- CLI emits valid JSON for all four required fixture scenarios.
- CLI uses existing structured contract fields and includes blockers.
- Unauthorized audit request remains blocked and does not invoke AGY, Gemini, OpenAI, network, MCP, or trace export.
- Closeout fixture preserves human acceptance, handoff refresh, commit, and push guardrails.
- Tests use only the Python standard library and pass without `openai-agents`, `OPENAI_API_KEY`, network access, or trace export.
- README and manifest document CLI usage and validation.
- Existing lifecycle helper scripts and repo-local skills remain unchanged.
- No app, database, graph, output, package manifest, app lockfile, runtime behavior, or historical WP files changed.
- Impact analysis matches actual changed files.
- Graph regeneration decision was followed.

Output:

- Verdict: PASS or FAIL
- Scope violations
- CLI behavior gaps
- Offline validation gaps
- Guardrail gaps
- Runtime AI, external data, dependency, or tracing risks
- Recommended corrections

## Code Results

Implemented.

Changed files:

- `docs/01-work-packages/WP-185-agentic-workflow-prototype-cli-runner.md`
- `tools/openai-agents-prototype/README.md`
- `tools/openai-agents-prototype/IMPLEMENTATION-MANIFEST.md`
- `tools/openai-agents-prototype/src/sequel_agents_prototype/cli.py`
- `tools/openai-agents-prototype/src/sequel_agents_prototype/__main__.py`
- `tools/openai-agents-prototype/tests/test_cli.py`

CLI behavior summary:

- Added a development-only `python -m sequel_agents_prototype` entry point.
- Added `run-fixture` scenarios for `idea-intake`, `audit-request`, `corrective-planning`, and `closeout`.
- Serialized existing offline manager contract objects to JSON through their `to_dict()` methods.
- Added `--pretty` for indented JSON output.
- Preserved audit and closeout guardrails: audit dispatch remains preparation-only and closeout commit/push requires accepted final decision, ready closeout state, refreshed handoff, and explicit push request.
- Kept the CLI offline and deterministic with no subprocess execution, SDK import, OpenAI API call, AGY/Gemini call, network access, MCP access, trace export, repository mutation, database mutation, commit, or push.
- Updated README and manifest with CLI commands and validation guidance.

Validation performed:

- PASS: `python -m unittest discover tools/openai-agents-prototype/tests`
- PASS: `python -m compileall tools/openai-agents-prototype/src`
- PASS: `$env:PYTHONPATH='tools/openai-agents-prototype/src'; python -m sequel_agents_prototype --help`
- PASS: `$env:PYTHONPATH='tools/openai-agents-prototype/src'; python -m sequel_agents_prototype run-fixture idea-intake --slug docs-only-fixture`
- PASS: `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-status.ps1 WP-185`, with state `ImplementedNeedsAudit` and no out-of-scope dirty files.
- PASS: `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-validation-plan.ps1 WP-185`, with state `ValidationEvidenceRecorded`.
- PASS: `powershell -ExecutionPolicy Bypass -File scripts/check-work-package-closeout.ps1 WP-185`, with state `ReadyForAudit`.
- PASS: `git diff --check` with CRLF warnings only.

Unresolved limitations:

- No live OpenAI Agents SDK execution was performed.
- No lifecycle helper scripts are executed by the CLI.
- No external audit, network access, API calls, tracing, commit, push, file mutation, or database mutation is performed by the CLI.
- Future sanitized live SDK smoke testing remains a separate WP.

## Audit Results

# Audit Report: WP-185

**Target Work Package:** [WP-185-agentic-workflow-prototype-cli-runner.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-185-agentic-workflow-prototype-cli-runner.md)  
**Target Repository:** `D:/GitHub-Repos/SequelCityWeb`

---

### Audit Checklist & Verification Summary

| Criteria / Verification Requirement | Status | Evidence / Notes |
| :--- | :---: | :--- |
| **Development-only & Isolated** | **PASS** | CLI is contained strictly inside [cli.py](file:///D:/GitHub-Repos/SequelCityWeb/tools/openai-agents-prototype/src/sequel_agents_prototype/cli.py) and [__main__.py](file:///D:/GitHub-Repos/SequelCityWeb/tools/openai-agents-prototype/src/sequel_agents_prototype/__main__.py) under `tools/openai-agents-prototype/`. No app or runtime code imports it. |
| **Module Entry Point (`python -m`)** | **PASS** | Verified execution of `python -m sequel_agents_prototype` with `PYTHONPATH=tools/openai-agents-prototype/src`. Entry point routes cleanly through `main()`. |
| **Valid JSON Emitted** | **PASS** | All 4 fixture scenarios (`idea-intake`, `audit-request`, `corrective-planning`, `closeout`) produce valid JSON parseable by standard tooling. `--pretty` formatting validated. |
| **Structured Contract Fields & Blockers** | **PASS** | `run_fixture()` invokes `.to_dict()` on existing contract objects (`WorkPackageDraft`, `AuditDispatch`, `CorrectiveWorkPackage`, `CloseoutReadiness`). All contain `kind` and `blockers`. |
| **Audit Guardrails & AI Prohibition** | **PASS** | `audit-request` without `--external-data-authorized` blocks dispatch (`audit_invoked: false`). Even when authorized, audit remains offline (`"does not invoke AGY"`). Zero network/SDK calls. |
| **Closeout Guardrails Preserved** | **PASS** | `closeout` requires `final_decision=Accepted`, `closeout_state=ReadyForFinalization`, `--handoff-refreshed`, and `--user-requested-push` before `commit_allowed` becomes `true`. |
| **Standard Library Only & Tests Pass** | **PASS** | All 19 tests in [test_cli.py](file:///D:/GitHub-Repos/SequelCityWeb/tools/openai-agents-prototype/tests/test_cli.py) and `test_offline_manager.py` pass cleanly in ~1s using only stdlib (`unittest`, `json`, `subprocess`, etc.). `OPENAI_API_KEY` is stripped during subprocess execution. |
| **Documentation Updated** | **PASS** | [README.md](file:///D:/GitHub-Repos/SequelCityWeb/tools/openai-agents-prototype/README.md) and [IMPLEMENTATION-MANIFEST.md](file:///D:/GitHub-Repos/SequelCityWeb/tools/openai-agents-prototype/IMPLEMENTATION-MANIFEST.md) accurately detail CLI commands and validation steps. |
| **Helper Scripts & Skills Unchanged** | **PASS** | `scripts/**` and `.codex/skills/**` remain untouched. |
| **No Inappropriate Changes** | **PASS** | No changes made to `apps/**`, `database/**`, graph artifacts, package manifests, lockfiles, outputs, or historical work packages. |
| **Impact Analysis Accuracy** | **PASS** | Scope in [WP-185-agentic-workflow-prototype-cli-runner.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-185-agentic-workflow-prototype-cli-runner.md) exactly matches all changed files. |
| **Graph Regeneration Followed** | **PASS** | Decision `Regeneration required: No` was observed. No `.understand-anything` files were modified. |

---

### Audit Findings

- **Verdict:** **PASS**
- **Scope violations:** None. Only files listed under *Files Allowed to Change* were modified or added.
- **CLI behavior gaps:** None. All required flags (`--pretty`, `--slug`, `--work-package`, `--external-data-authorized`, `--source-work-package`, `--corrective-work-package`, `--finding-type`, `--final-decision`, `--closeout-state`, `--handoff-refreshed`, `--user-requested-push`) behave deterministically and conform to specs.
- **Offline validation gaps:** None. Verification script `get-work-package-status.ps1 WP-185` reports `State: ImplementedNeedsAudit` with `Out-of-scope dirty files: none`. `get-work-package-validation-plan.ps1` reports `State: ValidationEvidenceRecorded`, and `check-work-package-closeout.ps1` reports `Closeout state: ReadyForAudit`.
- **Guardrail gaps:** None. Guardrails for commit, push, audit dispatch, and external data authorization are completely intact.
- **Runtime AI, external data, dependency, or tracing risks:** None. The prototype remains fully isolated, strictly offline, dependency-free, and trace-free.
- **Recommended corrections:** None required.

---

### Summary of Work

Conducted a thorough independent audit of [WP-185](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-185-agentic-workflow-prototype-cli-runner.md). Verified command-line execution, argument parsing, JSON serialization, unit test suite execution (19/19 tests passing), helper script outputs, git diff clean check, and guardrail enforcement. WP-185 meets all specified acceptance criteria and passes audit.

## Final Decision

Accepted for closeout on 2026-07-22.

Basis:

- AntiGravity independent audit returned `PASS`.
- Audit found no scope violations, CLI behavior gaps, offline validation gaps, guardrail gaps, runtime AI risks, external data risks, dependency risks, tracing risks, or required corrections.
- User reported the audit completed and requested continuation of the established closeout workflow.
- WP-185 remains development-only: no OpenAI Agents SDK execution, runtime AI, app integration, database behavior, lifecycle helper script changes, repo-local skill changes, package manifests, lockfiles, graph artifacts, outputs, or deployment behavior changed.

