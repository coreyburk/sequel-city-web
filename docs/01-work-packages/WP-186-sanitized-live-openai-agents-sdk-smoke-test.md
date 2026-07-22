# WP-186: Sanitized Live OpenAI Agents SDK Smoke Test

## Objective

Plan a narrow, development-only live OpenAI Agents SDK smoke test that proves the WP-185 prototype can run one sanitized fixture through `Agent` and `Runner` without exposing repository source, diffs, audit results, handoff text, credentials, answer keys, student data, app runtime behavior, or trace exports.

## Scope

### In Scope

- Add a development-only live smoke-test module under `tools/openai-agents-prototype/src/sequel_agents_prototype/`.
- Add a command surface that can be run from the prototype package with `PYTHONPATH=tools/openai-agents-prototype/src`.
- Use only a fixed sanitized fixture prompt that contains no repository source, diffs, audit content, handoff content, credentials, answer keys, student data, database paths, or user-specific context.
- Use the already declared optional `openai-agents` prototype extra; do not add dependency metadata or lockfiles.
- Require explicit local environment readiness for live execution:
  - `openai-agents` import succeeds
  - `OPENAI_API_KEY` is present
  - `SEQUEL_AGENTS_ALLOW_LIVE_SMOKE=1` is present
- Force tracing disabled before live execution by setting `OPENAI_AGENTS_DISABLE_TRACING=1` and using SDK-level tracing disablement when available.
- Return structured JSON with `status` values such as `skipped`, `passed`, or `failed`.
- Add offline standard-library tests that validate:
  - sanitized fixture text contains no forbidden repo data markers
  - missing SDK/API key/live opt-in returns `skipped`
  - tracing disablement is applied before the live-run boundary
  - output schema is stable
- Update prototype README and implementation manifest with live smoke-test boundaries and commands.
- Update this WP with Code Results and validation evidence during implementation.

### Out of Scope

- Sending repository source, diffs, audit output, work-package bodies, handoff text, prompts from active work, credentials, answer keys, student data, database paths, or spoiler-bearing case content to OpenAI.
- Enabling trace export or relying on the OpenAI dashboard trace viewer.
- Adding runtime AI or Agents SDK use to Sequel Detective app code.
- Adding root dependencies, app dependencies, lockfiles, package manifests, virtual environments, deployment behavior, or runtime startup integration.
- Calling AntiGravity, Gemini, MCP tools, web services, lifecycle helper scripts, Git commands, database operations, or destructive filesystem operations from the smoke-test code.
- Replacing the offline WP-184/WP-185 deterministic prototype path.
- Making live SDK success mandatory for normal local validation.
- Changing existing lifecycle helper scripts, repo-local Codex skills, app code, database files, graph artifacts, outputs, release artifacts, or historical work packages.

## Impact Analysis

### Understand Status

- Graph available: Yes.
- Baseline commit: `418990872a72e034197857ff383f74dfa575a90f`.
- Freshness assessment: Structurally stale for current development-workflow tooling. Current `HEAD` is `250ba274d79536ca0f50fdfa933f771efc18b361`; later accepted work added workflow helpers, audit and closeout wrappers, SDK readiness documentation, the WP-184 offline prototype, and the WP-185 CLI runner. The graph does not include the current prototype surfaces and is not authoritative for this package.
- Analysis performed: Read development workflow SSOT, work-package lifecycle guidance, Understand guidance, OpenAI Agents SDK orchestration readiness document, WP-184, WP-185, current prototype source/tests/metadata, current Git state, and official OpenAI Agents SDK quickstart, running-agents, agents, and tracing documentation. Verified planned scope directly against current source under `tools/openai-agents-prototype/`.

### Affected Architecture

- Layers:
  - Development Workflow Tooling
  - Agentic Development Governance
  - Prototype SDK Boundary
- Primary files/components:
  - `docs/01-work-packages/WP-186-sanitized-live-openai-agents-sdk-smoke-test.md`
  - `tools/openai-agents-prototype/src/sequel_agents_prototype/live_smoke.py`
  - `tools/openai-agents-prototype/tests/test_live_smoke.py`
  - `tools/openai-agents-prototype/README.md`
  - `tools/openai-agents-prototype/IMPLEMENTATION-MANIFEST.md`
- Upstream consumers:
  - human developer explicitly authorizing live SDK smoke-test execution
  - Codex development workflow
  - future agentic orchestration evaluation packages
  - existing WP-184/WP-185 prototype package
- Downstream dependencies:
  - future decision whether a real SDK manager should wrap sanitized fixture workflows
  - future data/tracing policy package if trace export or repo-context runs are ever considered
  - future decision whether SDK-based orchestration provides enough value over deterministic CLI contracts

### Regression Surface

- Related tests:
  - `python -m unittest discover tools/openai-agents-prototype/tests`
  - `python -m compileall tools/openai-agents-prototype/src`
  - smoke-test offline skip command with no `OPENAI_API_KEY`
  - optional human-authorized live smoke command with `SEQUEL_AGENTS_ALLOW_LIVE_SMOKE=1`, `OPENAI_API_KEY`, and installed `openai-agents`
  - `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-status.ps1 WP-186`
  - `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-validation-plan.ps1 WP-186`
  - `powershell -ExecutionPolicy Bypass -File scripts/check-work-package-closeout.ps1 WP-186`
  - `git diff --check`
- User workflows:
  - safely determining whether the Agents SDK can execute a minimal development-only fixture
  - preserving the offline prototype path when live SDK prerequisites are unavailable
  - deciding whether a later SDK manager package is worth planning
- Security/data boundaries:
  - No runtime app AI.
  - No repository source, diffs, audits, handoffs, credentials, answer keys, student data, database paths, or spoiler-bearing case content may be sent externally.
  - Trace export must be disabled by environment and code before any live run boundary.
  - Live execution requires explicit local opt-in through `SEQUEL_AGENTS_ALLOW_LIVE_SMOKE=1`.
  - Missing SDK, missing API key, or missing opt-in must return `skipped`, not fail ordinary validation.

### Graph Update Decision

- Regeneration required: No.
- Rationale: This package plans an isolated development-only smoke-test addition under `tools/openai-agents-prototype/`. It does not change app architecture, imports, runtime package manifests, database structure, Case 004 progression, deployment behavior, generated graph artifacts, or workflow script behavior.

## Files Allowed to Change

Allowed:

- `docs/01-work-packages/WP-186-sanitized-live-openai-agents-sdk-smoke-test.md`
- `tools/openai-agents-prototype/src/sequel_agents_prototype/live_smoke.py`
- `tools/openai-agents-prototype/tests/test_live_smoke.py`
- `tools/openai-agents-prototype/README.md`
- `tools/openai-agents-prototype/IMPLEMENTATION-MANIFEST.md`
- `docs/00-ssot/END-OF-DAY-HANDOFF.md`

Do Not Modify:

- `apps/**`
- `database/**`
- `scripts/**`
- `.codex/skills/**`
- `.understand-anything/**`
- `tools/openai-agents-prototype/pyproject.toml`
- `tools/openai-agents-prototype/src/sequel_agents_prototype/__init__.py`
- `tools/openai-agents-prototype/src/sequel_agents_prototype/__main__.py`
- `tools/openai-agents-prototype/src/sequel_agents_prototype/cli.py`
- `tools/openai-agents-prototype/src/sequel_agents_prototype/contracts.py`
- `tools/openai-agents-prototype/src/sequel_agents_prototype/guardrails.py`
- `tools/openai-agents-prototype/src/sequel_agents_prototype/manager.py`
- `tools/openai-agents-prototype/src/sequel_agents_prototype/sdk_boundary.py`
- `tools/openai-agents-prototype/src/sequel_agents_prototype/tools.py`
- `tools/openai-agents-prototype/tests/test_cli.py`
- `tools/openai-agents-prototype/tests/test_offline_manager.py`
- root `package.json`
- root `package-lock.json`
- app package manifests
- app dependency lockfiles
- virtual environment directories
- `outputs/**`
- historical work packages other than this active `WP-186`

## Constraints

- Keep the smoke test development-only and isolated under `tools/openai-agents-prototype/`.
- Use only sanitized synthetic fixture input.
- Do not send repository content or user/private project context to OpenAI.
- Do not enable trace export. Set `OPENAI_AGENTS_DISABLE_TRACING=1` before live execution and call SDK tracing-disable API when available.
- Do not make live SDK execution required for implementation validation, audit, or closeout.
- Do not add dependencies, lockfiles, virtual environments, app package changes, runtime startup changes, or deployment changes.
- Do not execute lifecycle helper scripts, AGY, Gemini, MCP tools, Git commands, database actions, destructive filesystem actions, or web requests from smoke-test code.
- Do not mutate repository files from smoke-test code.
- Do not accept work, invoke audit, commit, push, or broaden workflow authority from smoke-test code.
- Keep failure/skip results explicit and machine-readable.

## Required Behavior

- Add `sequel_agents_prototype.live_smoke` with a small public function surface for:
  - inspecting live prerequisites
  - returning the sanitized fixture prompt
  - disabling tracing before a live boundary
  - running the live smoke test only when all opt-in gates pass
- Add a module execution path such as:

```powershell
$env:PYTHONPATH='tools/openai-agents-prototype/src'
python -m sequel_agents_prototype.live_smoke
```

- When `openai-agents` is unavailable, `OPENAI_API_KEY` is missing, or `SEQUEL_AGENTS_ALLOW_LIVE_SMOKE` is not `1`, the command must output JSON with `status: "skipped"` and a concrete reason.
- When live execution is permitted, create one minimal `Agent` with sanitized instructions and run one sanitized prompt through `Runner`.
- The expected model output must be non-sensitive and small, such as identifying the fixture workflow category or echoing an allowed fixture label.
- Output JSON must include:
  - `status`
  - `live_execution_attempted`
  - `tracing_disabled`
  - `sdk_available`
  - `api_key_present`
  - `live_opt_in`
  - `fixture_name`
  - `forbidden_markers_present`
  - `result_summary` or `skip_reason`
- Offline tests must not require the SDK, API key, network, or trace export.
- Tests must assert that known forbidden markers such as `docs/01-work-packages/`, `apps/`, `database/`, `BEGIN PRIVATE KEY`, `OPENAI_API_KEY`, `END-OF-DAY-HANDOFF`, `Audit Results`, and `Case 004` are absent from the fixture payload sent to the SDK.
- README and manifest must document:
  - no-key/no-SDK skip behavior
  - live opt-in environment variable
  - tracing disabled by default
  - sanitized fixture-only input
  - no runtime app integration
  - no repository content transmission

## Acceptance Criteria

- [x] Smoke-test module exists only under `tools/openai-agents-prototype/src/sequel_agents_prototype/live_smoke.py`.
- [x] Offline tests exist in `tools/openai-agents-prototype/tests/test_live_smoke.py`.
- [x] Missing SDK, missing `OPENAI_API_KEY`, or missing `SEQUEL_AGENTS_ALLOW_LIVE_SMOKE=1` returns structured `skipped` JSON.
- [x] Live execution path sets tracing disabled before importing/running SDK code.
- [x] Sanitized fixture prompt contains no forbidden repository/private-data markers.
- [x] Live SDK run, when explicitly authorized and environment-ready, uses only sanitized fixture input and returns structured JSON.
- [x] Offline validation passes without `openai-agents`, `OPENAI_API_KEY`, network access, or trace export.
- [x] README and manifest document live smoke-test boundaries and commands.
- [x] No app, database, script, skill, graph, output, package manifest, lockfile, virtual environment, deployment, runtime behavior, or historical WP files change.
- [x] Code Results record validation evidence, including whether live execution was skipped or manually run.
- [x] Audit Results and Final Decision remain pending until independent audit and human acceptance.

## Code Prompt

Implement `WP-186` exactly as specified.

Scope:

- Only modify files listed under `Files Allowed to Change`.
- Add a sanitized live SDK smoke-test module under the existing prototype package.
- Add offline tests for skip behavior, tracing controls, fixture sanitation, and output schema.
- Update README and implementation manifest only enough to document smoke-test use and boundaries.
- Refresh `docs/00-ssot/END-OF-DAY-HANDOFF.md` during closeout.
- Update this WP with Code Results and validation evidence after implementation.

Implementation requirements:

1. Add `tools/openai-agents-prototype/src/sequel_agents_prototype/live_smoke.py`.
2. Add `tools/openai-agents-prototype/tests/test_live_smoke.py`.
3. Use only the Python standard library for tests.
4. Import `openai-agents` SDK components only inside the live-run path after skip gates and tracing disablement are applied.
5. Do not install dependencies, modify `pyproject.toml`, create lockfiles, or create virtual environments.
6. Do not pass repo source, diffs, audit text, handoff text, credentials, answer keys, student data, database paths, or Case 004 content to the SDK.
7. Do not execute lifecycle helpers, Git, AGY, Gemini, MCP tools, database commands, or destructive filesystem actions.
8. Ensure ordinary validation succeeds when the SDK/key/opt-in are unavailable by returning `skipped`.
9. If a live run is not performed, record that as a limitation rather than a failure.

Verification:

- `python -m unittest discover tools/openai-agents-prototype/tests`
- `python -m compileall tools/openai-agents-prototype/src`
- `$env:PYTHONPATH='tools/openai-agents-prototype/src'; Remove-Item Env:SEQUEL_AGENTS_ALLOW_LIVE_SMOKE -ErrorAction SilentlyContinue; python -m sequel_agents_prototype.live_smoke`
- Optional manual live run only if explicitly authorized and environment-ready:
  - `$env:PYTHONPATH='tools/openai-agents-prototype/src'`
  - `$env:SEQUEL_AGENTS_ALLOW_LIVE_SMOKE='1'`
  - `$env:OPENAI_AGENTS_DISABLE_TRACING='1'`
  - `python -m sequel_agents_prototype.live_smoke`
- `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-status.ps1 WP-186`
- `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-validation-plan.ps1 WP-186`
- `powershell -ExecutionPolicy Bypass -File scripts/check-work-package-closeout.ps1 WP-186`
- `git diff --check`

Return:

- files changed
- smoke-test behavior summary
- validation performed
- whether live execution was skipped or run
- unresolved limitations

## Audit Prompt

Audit `WP-186`.

Verify:

- Smoke-test code is development-only and isolated under `tools/openai-agents-prototype/`.
- The live prompt is sanitized synthetic fixture input only.
- Forbidden repository/private-data markers are not present in any live SDK input.
- Missing SDK, missing API key, or missing explicit live opt-in returns structured `skipped` JSON.
- Tracing is disabled before live SDK execution.
- Live execution does not send repository source, diffs, audit output, handoff text, credentials, answer keys, student data, database paths, or Case 004 content.
- Offline tests pass without `openai-agents`, `OPENAI_API_KEY`, network access, or trace export.
- README and manifest document the live smoke-test boundaries and commands.
- Existing lifecycle helper scripts and repo-local skills remain unchanged.
- No app, database, graph, output, package manifest, lockfile, virtual environment, runtime behavior, deployment behavior, or historical WP files changed.
- Impact analysis matches actual changed files.
- Graph regeneration decision was followed.

Output:

- Verdict: PASS or FAIL
- Scope violations
- Sanitization gaps
- Tracing/data-policy gaps
- Offline validation gaps
- Runtime AI or app-integration risks
- Dependency/lockfile risks
- Recommended corrections

## Code Results

Implemented.

Changed files:

- `docs/01-work-packages/WP-186-sanitized-live-openai-agents-sdk-smoke-test.md`
- `tools/openai-agents-prototype/src/sequel_agents_prototype/live_smoke.py`
- `tools/openai-agents-prototype/tests/test_live_smoke.py`
- `tools/openai-agents-prototype/README.md`
- `tools/openai-agents-prototype/IMPLEMENTATION-MANIFEST.md`

Smoke-test behavior summary:

- Added `sequel_agents_prototype.live_smoke` as a development-only module execution surface.
- Added a fixed sanitized fixture prompt and a forbidden-marker scan for repository/private-data markers.
- Added prerequisite inspection for SDK availability, `OPENAI_API_KEY`, and explicit `SEQUEL_AGENTS_ALLOW_LIVE_SMOKE=1` opt-in.
- Added structured JSON output with `status`, live execution, tracing, prerequisite, fixture, forbidden-marker, result, skip, and error fields.
- Added skip behavior when SDK, API key, or explicit live opt-in is missing.
- Added tracing disablement before the live SDK boundary via `OPENAI_AGENTS_DISABLE_TRACING=1` and SDK-level `set_tracing_disabled(True)` when the SDK is imported.
- Added live execution path using a minimal `Agent` and `Runner` only after all gates pass.
- Added standard-library tests for fixture sanitization, skip gates, tracing disablement, output schema, and module execution.
- Updated README and implementation manifest with live smoke-test boundaries and commands.

Validation performed:

- PASS: `python -m unittest discover tools/openai-agents-prototype/tests`
- PASS: `python -m compileall tools/openai-agents-prototype/src`
- PASS: `$env:PYTHONPATH='tools/openai-agents-prototype/src'; Remove-Item Env:SEQUEL_AGENTS_ALLOW_LIVE_SMOKE -ErrorAction SilentlyContinue; Remove-Item Env:OPENAI_API_KEY -ErrorAction SilentlyContinue; python -m sequel_agents_prototype.live_smoke`

Live execution status:

- Live execution was skipped during implementation validation.
- Skip output reported `status: "skipped"`, `live_execution_attempted: false`, `api_key_present: false`, `live_opt_in: false`, `sdk_available: false`, and no forbidden markers.

Unresolved limitations:

- No live SDK run was performed because the local environment was not opted in and did not have the SDK/API key gate available for this validation path.
- No dependency installation, API call, network access, trace export, lifecycle helper execution, Git action, database action, repository mutation, app runtime change, or deployment behavior occurred.

## Audit Results

# Audit Summary: WP-186

- **Verdict**: PASS

## Audit Details

### 1. Scope Violations
- **None**. All new code is isolated strictly under [live_smoke.py](file:///D:/GitHub-Repos/SequelCityWeb/tools/openai-agents-prototype/src/sequel_agents_prototype/live_smoke.py) and [test_live_smoke.py](file:///D:/GitHub-Repos/SequelCityWeb/tools/openai-agents-prototype/tests/test_live_smoke.py) within `tools/openai-agents-prototype/`.
- No helper scripts, repo skills, `apps/`, `database/`, or historical work packages were altered.

### 2. Sanitization Gaps
- **None**. The smoke test payload uses fixed synthetic strings (`SANITIZED_FIXTURE_PROMPT` and `SANITIZED_AGENT_INSTRUCTIONS`).
- The payload is guarded by `get_forbidden_markers_present()`, which scans for forbidden markers (`docs/01-work-packages/`, `apps/`, `database/`, `BEGIN PRIVATE KEY`, `OPENAI_API_KEY`, `END-OF-DAY-HANDOFF`, `Audit Results`, `Case 004`).
- No repository source files, diffs, audit records, handoffs, student data, or database paths are read or transmitted.

### 3. Tracing/Data-Policy Gaps
- **None**. `disable_tracing_before_live_boundary()` sets `OPENAI_AGENTS_DISABLE_TRACING=1` prior to SDK initialization.
- In the live execution path, `set_tracing_disabled(True)` and `RunConfig(tracing_disabled=True, trace_include_sensitive_data=False)` explicitly disable tracing at the SDK level.

### 4. Offline Validation Gaps
- **None**. Running `python -m unittest discover tools/openai-agents-prototype/tests` executes 26/26 passing tests without requiring `openai-agents`, `OPENAI_API_KEY`, network access, or trace export.
- Skipping behavior returns structured JSON with `status: "skipped"` when SDK, API key, or `SEQUEL_AGENTS_ALLOW_LIVE_SMOKE=1` is missing.

### 5. Runtime AI or App-Integration Risks
- **None**. Smoke test logic is strictly development-only and completely decoupled from Sequel Detective app runtime code and database logic.

### 6. Dependency/Lockfile Risks
- **None**. No package manifests (`package.json`, `pyproject.toml`), lockfiles, or virtual environments were created or modified.

### 7. Recommended Corrections
- **None**. The implementation satisfies all acceptance criteria, validation checks, documentation standards, and lifecycle status constraints.
The background tasks have concluded and the audit of **WP-186** is complete.

### Audit Summary
- **Verdict**: PASS
- All validation criteria, sanitization checks, tracing boundaries, offline standard-library tests, and impact analysis expectations have been verified against the repository at `D:\GitHub-Repos\SequelCityWeb`.

## Final Decision

Accepted for closeout on 2026-07-22.

Basis:

- AntiGravity independent audit returned `PASS`.
- Audit found no scope violations, sanitization gaps, tracing/data-policy gaps, offline validation gaps, runtime AI or app-integration risks, dependency/lockfile risks, or required corrections.
- User reported the audit completed and requested continuation of the established closeout workflow.
- Live SDK execution was intentionally skipped during implementation validation because the environment was not opted in and did not have SDK/API-key readiness.
- WP-186 remains development-only: no runtime app AI, repository-content transmission, trace export, dependency installation, lockfile, app integration, database behavior, lifecycle helper script changes, repo-local skill changes, graph artifacts, outputs, or deployment behavior changed.

