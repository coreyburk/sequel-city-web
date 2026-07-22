# WP-187 - Live SDK Smoke Environment Readiness And Runbook

## Objective

Create a clear development-only runbook for preparing a local environment and running the sanitized OpenAI Agents SDK live smoke test without exposing repository data, secrets, traces, application runtime behavior, or database content.

## Scope

### In Scope

- Document the local prerequisites for the optional `openai-agents` prototype dependency.
- Document the exact PowerShell commands for creating or selecting an isolated Python environment, installing the prototype package with the optional SDK extra, setting the required live-smoke opt-in variables, running the sanitized live smoke test, and interpreting `passed`, `skipped`, and `failed` JSON results.
- Document secret-handling and trace-handling rules for the live smoke.
- Update prototype documentation so future agents know the live smoke is development-only and manually gated.
- Record that the previously attempted live smoke skipped because the optional SDK and `OPENAI_API_KEY` were absent.

### Out of Scope

- Installing `openai-agents` in this Codex session.
- Adding lockfiles, virtual environments, or committed dependency artifacts.
- Adding root, app, API, deployment, or database dependencies.
- Changing Sequel Detective runtime behavior.
- Sending repository source, diffs, work-package bodies, audit output, handoff text, credentials, answer keys, student data, database paths, or Case 004 content to any live model.
- Enabling trace export or committing trace artifacts.
- Automating live execution inside CI, work-package closeout, audit helpers, or app scripts.
- Refactoring existing prototype code unless a documentation inconsistency cannot otherwise be corrected.

## Impact Analysis

### Understand Status

- Graph available: Yes. `.understand-anything/knowledge-graph.json`, `meta.json`, and `fingerprints.json` are present.
- Baseline commit: `418990872a72e034197857ff383f74dfa575a90f`.
- Freshness assessment: Structurally stale for this work-package surface. Current `HEAD` is `07447edaa4be6d5458c5b596a0c51fa8540b5606`, and `tools/openai-agents-prototype/**`, `WP-184`, `WP-185`, and `WP-186` were added after the baseline. Targeted graph search did not find the live-smoke/prototype nodes, so graph relationships cannot be treated as current for this package.
- Analysis performed: Read development workflow SSOT, work-package lifecycle guidance, Understand guidance, planning checklist, prototype README, implementation manifest, prototype `pyproject.toml`, live smoke source, recent WP-184 through WP-186 context, current git status, recent commits, and targeted `rg` results for `live_smoke`, `openai-agents`, `SEQUEL_AGENTS_ALLOW_LIVE_SMOKE`, and tracing boundaries.

### Affected Architecture

- Layers: Development workflow documentation and isolated prototype documentation only.
- Primary files/components:
  - `docs/01-work-packages/WP-187-live-sdk-smoke-environment-readiness-and-runbook.md`
  - `tools/openai-agents-prototype/README.md`
  - `tools/openai-agents-prototype/IMPLEMENTATION-MANIFEST.md`
  - Optional new `tools/openai-agents-prototype/LIVE-SMOKE-RUNBOOK.md`
- Upstream consumers: Human developer, Codex planning/implementation agents, AntiGravity audit agent, future OpenAI Agents SDK prototype evaluators.
- Downstream dependencies: Existing `sequel_agents_prototype.live_smoke` command, prototype-local optional SDK metadata in `tools/openai-agents-prototype/pyproject.toml`, future live SDK smoke validation decisions.

### Regression Surface

- Related tests:
  - `python -m unittest discover tools/openai-agents-prototype/tests`
  - `python -m compileall tools/openai-agents-prototype/src`
  - `$env:PYTHONPATH='tools/openai-agents-prototype/src'; python -m sequel_agents_prototype.live_smoke` with missing live prerequisites expected to return structured `skipped` JSON.
- User workflows:
  - A developer prepares an isolated local Python environment.
  - A developer installs the optional SDK extra outside the committed app/runtime dependency graph.
  - A developer runs the sanitized smoke test with explicit live opt-in and no repository data in the prompt.
  - A reviewer/auditor verifies the live-smoke result without requiring secrets to be disclosed.
- Security/data boundaries: No committed API keys, no `.env` files, no trace artifacts, no repository source/diffs/WP bodies/audit output/handoff content/student data/database paths/answer keys/Case 004 content in live prompts or traces, tracing disabled by default, no runtime AI integration.

### Graph Update Decision

- Regeneration required: No.
- Rationale: WP-187 should change only documentation and runbook guidance around an already-isolated development prototype. It does not alter imports, app architecture, database schema, Case 004 progression, runtime packages, or helper-script behavior. The graph is stale for this prototype surface, so the WP records source-inspection evidence instead of relying on graph relationships.

## Files Allowed to Change

Allowed:

- `docs/01-work-packages/WP-187-live-sdk-smoke-environment-readiness-and-runbook.md`
- `tools/openai-agents-prototype/README.md`
- `tools/openai-agents-prototype/IMPLEMENTATION-MANIFEST.md`
- `tools/openai-agents-prototype/LIVE-SMOKE-RUNBOOK.md`

Do Not Modify:

- `apps/**`
- `database/**`
- `scripts/**`
- `.codex/skills/**`
- `.understand-anything/**`
- `package.json`
- `package-lock.json`
- `pnpm-lock.yaml`
- `yarn.lock`
- `tools/openai-agents-prototype/pyproject.toml`
- `tools/openai-agents-prototype/src/**`
- `tools/openai-agents-prototype/tests/**`
- `.env`
- `.env.*`
- `outputs/**`

## Constraints

- Preserve existing behavior unless explicitly changing it.
- No architectural changes.
- No renaming outside scope.
- No speculative improvements.
- No "while we're here" changes.
- Keep all work development-only.
- Do not install dependencies as part of implementation.
- Do not commit virtual environments, lockfiles, caches, credentials, trace output, or live API responses containing sensitive data.
- Do not require `OPENAI_API_KEY` for ordinary validation.
- Do not weaken WP-186's live execution gates.

## Required Behavior

- Add or update prototype documentation with a dedicated live-smoke readiness runbook.
- The runbook must identify required prerequisites: Python 3.11 or newer, isolated local environment, prototype-local optional SDK install using `tools/openai-agents-prototype[sdk]`, `OPENAI_API_KEY` set only in the local shell or approved secret store, `SEQUEL_AGENTS_ALLOW_LIVE_SMOKE=1`, and `OPENAI_AGENTS_DISABLE_TRACING=1`.
- The runbook must provide copyable PowerShell commands for offline validation, skipped smoke validation, optional SDK install, live smoke execution, and cleanup of shell environment variables.
- The runbook must state what JSON fields prove a live attempt happened: `status`, `live_execution_attempted`, `sdk_available`, `api_key_present`, `live_opt_in`, `tracing_disabled`, `forbidden_markers_present`, `result_summary`, `skip_reason`, and `error_type`.
- The runbook must state that a valid first live smoke is acceptable only when `live_execution_attempted` is `true`, `sdk_available` is `true`, `api_key_present` is `true`, `live_opt_in` is `true`, `tracing_disabled` is `true`, `forbidden_markers_present` is empty, and `status` is `passed` or a reviewed `failed` result that contains no sensitive data.
- The runbook must include the observed pre-WP-187 smoke result: skipped because the optional SDK was not installed and `OPENAI_API_KEY` was absent.
- README and manifest updates must point to the runbook without duplicating excessive command detail.

## Acceptance Criteria

- [x] A dedicated live smoke environment readiness runbook exists or equivalent prototype documentation is updated.
- [x] The runbook provides exact PowerShell commands for offline validation, skipped smoke validation, optional SDK install, live smoke execution, and environment variable cleanup.
- [x] The runbook clearly prohibits committing secrets, `.env` files, virtual environments, caches, trace artifacts, or sensitive live outputs.
- [x] The runbook preserves the development-only boundary and states that no app/runtime/database integration is authorized.
- [x] The runbook records the current skipped smoke result and distinguishes environment blockage from code failure.
- [x] README and implementation manifest point future contributors/auditors to the runbook.
- [x] Offline prototype tests and compile checks still pass without `openai-agents`, `OPENAI_API_KEY`, network access, or trace export.
- [x] The missing-prerequisite smoke command still returns structured `skipped` JSON without attempting live execution.
- [x] No unrelated files changed.

## Code Prompt

Create the WP-187 live smoke environment-readiness documentation for the isolated OpenAI Agents SDK prototype.

Scope:

- Only modify the allowed files listed in `Files Allowed to Change`.

Constraints:

- No source-code refactors.
- No new dependencies.
- Preserve all existing behavior.
- Do not install `openai-agents`.
- Do not create or commit `.env` files, virtual environments, lockfiles, caches, trace output, or live API response artifacts.
- Do not modify app, API, database, script, skill, or Understand files.

Return:

- Exact documentation changes.
- Validation commands and results.
- The structured skipped-smoke result observed during validation.

## Audit Prompt

Audit this change against the work package.

Verify:

- All acceptance criteria are satisfied.
- No files outside allowed list were modified.
- No functional regression.
- Behavior remains consistent outside scope.
- Impact analysis matches the actual changed files.
- Dependencies and related tests were not omitted.
- Graph regeneration decision was followed.
- Understand output did not override SSOT or source evidence.
- Documentation does not imply runtime AI is authorized.
- Documentation does not request committing secrets, `.env` files, traces, caches, virtual environments, or live outputs.
- Live smoke commands preserve explicit opt-in and tracing-disabled posture.
- Missing-prerequisite smoke validation remains safe and does not attempt live execution.

Output:

- Verdict: PASS or FAIL
- Violations
- Regressions
- Drift risks

## Code Results

Implemented.

Changed files:

- Added `tools/openai-agents-prototype/LIVE-SMOKE-RUNBOOK.md`.
- Updated `tools/openai-agents-prototype/README.md` to point live-smoke users to the runbook.
- Updated `tools/openai-agents-prototype/IMPLEMENTATION-MANIFEST.md` to include the runbook in the prototype inventory and external execution guidance.
- Updated this work package's acceptance checklist and Code Results.

Runbook coverage:

- Documents Python and isolated-environment prerequisites.
- Provides PowerShell commands for offline validation, skipped smoke validation, optional SDK install, live smoke execution, and shell cleanup.
- Requires `OPENAI_API_KEY` to stay local to the active shell or approved local secret store.
- Requires `SEQUEL_AGENTS_ALLOW_LIVE_SMOKE=1` and `OPENAI_AGENTS_DISABLE_TRACING=1` for live smoke.
- Prohibits committing secrets, `.env` files, virtual environments, caches, traces, or sensitive live output artifacts.
- Preserves the development-only boundary and explicitly rejects app/runtime/database integration.
- Records the prior skipped smoke result as an environment-readiness blockage, not a code failure.

Validation:

- PASS: `python -m unittest discover tools/openai-agents-prototype/tests`
  - Result: `Ran 26 tests in 3.159s` / `OK`
- PASS: `python -m compileall tools/openai-agents-prototype/src`
- PASS: `$env:PYTHONPATH='tools/openai-agents-prototype/src'; Remove-Item Env:SEQUEL_AGENTS_ALLOW_LIVE_SMOKE -ErrorAction SilentlyContinue; Remove-Item Env:OPENAI_API_KEY -ErrorAction SilentlyContinue; $env:OPENAI_AGENTS_DISABLE_TRACING='1'; python -m sequel_agents_prototype.live_smoke`
  - Result:

```json
{"api_key_present": false, "error_type": "", "fixture_name": "sanitized_workflow_category_fixture", "forbidden_markers_present": [], "live_execution_attempted": false, "live_opt_in": false, "result_summary": "", "sdk_available": false, "skip_reason": "openai-agents SDK is not installed; OPENAI_API_KEY is not present; SEQUEL_AGENTS_ALLOW_LIVE_SMOKE=1 is not present", "status": "skipped", "tracing_disabled": true}
```

## Audit Results

### Audit Summary

The change for **[WP-187: Live SDK Smoke Environment Readiness And Runbook](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-187-live-sdk-smoke-environment-readiness-and-runbook.md)** has been audited against the work package specification, repository boundary rules, and runtime safety constraints.

---

### Verification Details

1. **Acceptance Criteria**:
   - [x] Dedicated live smoke environment readiness runbook created at [`tools/openai-agents-prototype/LIVE-SMOKE-RUNBOOK.md`](file:///D:/GitHub-Repos/SequelCityWeb/tools/openai-agents-prototype/LIVE-SMOKE-RUNBOOK.md).
   - [x] Exact PowerShell commands provided for offline validation, skipped smoke validation, optional SDK install, live smoke execution, and environment cleanup.
   - [x] Explicit prohibition against committing secrets, `.env` files, virtual environments, caches, trace artifacts, or live output logs.
   - [x] Preserves development-only boundary; explicitly denies app/runtime/database integration.
   - [x] Records prior skipped smoke result as an environment blockage rather than a code failure.
   - [x] [`README.md`](file:///D:/GitHub-Repos/SequelCityWeb/tools/openai-agents-prototype/README.md) and [`IMPLEMENTATION-MANIFEST.md`](file:///D:/GitHub-Repos/SequelCityWeb/tools/openai-agents-prototype/IMPLEMENTATION-MANIFEST.md) link directly to the runbook.
   - [x] All 26 offline prototype tests and compile checks pass cleanly.
   - [x] Missing-prerequisite smoke execution safely returns structured `skipped` JSON without invoking live SDK code.
   - [x] No unrelated files changed.

2. **File Scope**:
   - Changed files are strictly confined to the allowed list:
     - [`docs/01-work-packages/WP-187-live-sdk-smoke-environment-readiness-and-runbook.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-187-live-sdk-smoke-environment-readiness-and-runbook.md)
     - [`tools/openai-agents-prototype/LIVE-SMOKE-RUNBOOK.md`](file:///D:/GitHub-Repos/SequelCityWeb/tools/openai-agents-prototype/LIVE-SMOKE-RUNBOOK.md)
     - [`tools/openai-agents-prototype/README.md`](file:///D:/GitHub-Repos/SequelCityWeb/tools/openai-agents-prototype/README.md)
     - [`tools/openai-agents-prototype/IMPLEMENTATION-MANIFEST.md`](file:///D:/GitHub-Repos/SequelCityWeb/tools/openai-agents-prototype/IMPLEMENTATION-MANIFEST.md)

3. **Functional Regression & Behavior Consistency**:
   - `python -m unittest discover tools/openai-agents-prototype/tests` passed (26/26 tests OK).
   - `python -m compileall tools/openai-agents-prototype/src` succeeded with zero errors.
   - Application, database, script, API, and core runtime code remain completely untouched.

4. **Impact Analysis & Graph Regeneration Decision**:
   - Impacted architecture matches actual modified files.
   - Graph regeneration decision (`No`) was strictly followed; no structural code dependencies or schemas were altered.
   - Direct source code inspection was prioritized over stale Understand graph artifacts.

5. **Security & Governance Boundaries**:
   - Runbook reinforces local shell scoping for `OPENAI_API_KEY`.
   - Requires explicit `SEQUEL_AGENTS_ALLOW_LIVE_SMOKE=1` and `OPENAI_AGENTS_DISABLE_TRACING=1`.
   - Prohibits committing `.env`, virtual environments, traces, caches, or live responses.
   - Missing-prerequisite validation command verified to safely return `skipped` JSON (`live_execution_attempted: false`).

---

### Audit Output

- **Verdict**: PASS
- **Violations**: None
- **Regressions**: None
- **Drift risks**: None

## Final Decision

Accepted on 2026-07-22 after AntiGravity audit PASS.

The implementation is documentation-only and remains confined to the isolated OpenAI Agents SDK prototype runbook surface. It does not install dependencies, commit secrets, add runtime AI behavior, modify application or database code, change lifecycle scripts, or regenerate the Understand graph. The stale graph condition is accepted for WP-187 because source inspection covered the affected prototype files and `WP-188-understand-graph-refresh-cadence-and-baseline-update.md` is the next planned corrective workflow task.



