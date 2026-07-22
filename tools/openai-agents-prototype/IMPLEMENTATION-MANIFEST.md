# WP-184 Implementation Manifest

## Purpose

This manifest gives auditors a stable inventory of the development-only OpenAI Agents SDK prototype added for `WP-184`.

The prototype is intentionally isolated under `tools/openai-agents-prototype/`. It is not wired into app runtime, app builds, app packages, database behavior, deployment behavior, or lifecycle helper scripts.

## File Inventory

- `README.md`: prototype purpose, default offline validation, optional SDK posture, data/tracing boundaries, and runtime prohibitions.
- `pyproject.toml`: prototype-local package metadata and optional `openai-agents` extra.
- `src/sequel_agents_prototype/__init__.py`: package exports for prototype contracts and offline manager.
- `src/sequel_agents_prototype/__main__.py`: module entry point for `python -m sequel_agents_prototype`.
- `src/sequel_agents_prototype/cli.py`: offline fixture CLI that serializes existing contract objects as JSON.
- `src/sequel_agents_prototype/contracts.py`: frozen dataclass output contracts for draft, audit dispatch, corrective planning, and closeout readiness states.
- `src/sequel_agents_prototype/guardrails.py`: pure guardrail checks for runtime AI prohibition, external audit authorization, and commit/push gating.
- `src/sequel_agents_prototype/tools.py`: command contract declarations for existing PowerShell lifecycle helpers without subprocess execution.
- `src/sequel_agents_prototype/manager.py`: deterministic offline manager that routes fixture intents without a live LLM call.
- `src/sequel_agents_prototype/sdk_boundary.py`: optional SDK availability inspection without importing or calling OpenAI APIs.
- `tests/test_cli.py`: standard-library subprocess and JSON coverage for the offline CLI fixtures.
- `tests/test_offline_manager.py`: standard-library unittest coverage for fixture routing, guardrails, SDK fallback, and command contracts.

## Validation Commands

These commands were run locally during implementation:

```powershell
python -m unittest discover tools/openai-agents-prototype/tests
python -m compileall tools/openai-agents-prototype/src
powershell -ExecutionPolicy Bypass -File scripts/get-work-package-status.ps1 WP-184
powershell -ExecutionPolicy Bypass -File scripts/get-work-package-validation-plan.ps1 WP-184
powershell -ExecutionPolicy Bypass -File scripts/check-work-package-closeout.ps1 WP-184
git diff --check
```

Additional CLI validation added by `WP-185`:

```powershell
$env:PYTHONPATH='tools/openai-agents-prototype/src'
python -m sequel_agents_prototype --help
python -m sequel_agents_prototype run-fixture idea-intake --slug docs-only-fixture
```

## Audit Visibility Note

The first independent audit reported the prototype artifacts as missing. At the time of that audit, the new prototype files existed in the local working tree but were not yet committed. Auditors should inspect untracked working-tree files with:

```powershell
git status --short --untracked-files=all
Get-ChildItem -Path tools/openai-agents-prototype -Recurse -File
```

The failed audit verdict remains recorded in `WP-184` until a follow-up independent audit verifies the actual working-tree artifacts.

## External Execution Boundaries

The prototype and tests do not require:

- `openai-agents`
- `OPENAI_API_KEY`
- network access
- trace export
- OpenAI API calls
- AntiGravity or Gemini calls

Future live SDK orchestration requires a separate accepted work package.

The CLI only runs local fixture routing and JSON serialization. It does not execute lifecycle helper scripts, invoke audit agents, commit, push, mutate files, mutate databases, call APIs, or export traces.
