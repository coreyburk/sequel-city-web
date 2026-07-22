# Live SDK Smoke Runbook

## Purpose

This runbook prepares a local, development-only environment for the sanitized OpenAI Agents SDK live smoke test.

The smoke test is not part of the Sequel Detective runtime. It does not authorize app integration, database access, CI execution, external audit automation, committed secrets, trace export, or use of repository content in live prompts.

## Current Readiness State

The latest pre-runbook smoke attempt was intentionally safe and skipped live execution:

```json
{
  "api_key_present": false,
  "error_type": "",
  "fixture_name": "sanitized_workflow_category_fixture",
  "forbidden_markers_present": [],
  "live_execution_attempted": false,
  "live_opt_in": true,
  "result_summary": "",
  "sdk_available": false,
  "skip_reason": "openai-agents SDK is not installed; OPENAI_API_KEY is not present",
  "status": "skipped",
  "tracing_disabled": true
}
```

This is an environment-readiness blockage, not a code failure. Live execution requires the optional SDK, an API key, and explicit opt-in.

## Required Boundaries

- Do not commit `OPENAI_API_KEY`, `.env`, `.env.*`, virtual environments, caches, traces, or live output artifacts.
- Do not send repository source, diffs, work-package bodies, audit output, handoff text, credentials, answer keys, student data, database paths, or Case 004 content to the live model.
- Keep `OPENAI_AGENTS_DISABLE_TRACING=1` for this smoke test.
- Run the smoke test only from a human-controlled local shell.
- Do not wire this command into CI, app startup, lifecycle helpers, audit closeout, or database workflows.

## Prerequisites

- Python 3.11 or newer.
- An isolated local Python environment outside committed source control.
- The optional prototype SDK extra installed in that isolated environment.
- `OPENAI_API_KEY` available only in the local shell or an approved local secret store.
- `SEQUEL_AGENTS_ALLOW_LIVE_SMOKE=1`.
- `OPENAI_AGENTS_DISABLE_TRACING=1`.

## Offline Validation

Run these commands before preparing a live environment:

```powershell
python -m unittest discover tools/openai-agents-prototype/tests
python -m compileall tools/openai-agents-prototype/src
```

## Skipped Smoke Validation

This command must remain safe without the optional SDK or API key:

```powershell
$env:PYTHONPATH='tools/openai-agents-prototype/src'
Remove-Item Env:SEQUEL_AGENTS_ALLOW_LIVE_SMOKE -ErrorAction SilentlyContinue
Remove-Item Env:OPENAI_API_KEY -ErrorAction SilentlyContinue
$env:OPENAI_AGENTS_DISABLE_TRACING='1'
python -m sequel_agents_prototype.live_smoke
```

Expected posture:

- `status` is `skipped`
- `live_execution_attempted` is `false`
- `skip_reason` explains the missing gate or gates
- `forbidden_markers_present` is empty

## Prepare Isolated Environment

Create a local virtual environment that is ignored by Git:

```powershell
python -m venv .venv-openai-agents-smoke
.\.venv-openai-agents-smoke\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -e "tools/openai-agents-prototype[sdk]"
```

Before committing, confirm the environment remains untracked or ignored. Do not stage it.

```powershell
git status --short --untracked-files=all
```

## Configure Live Smoke

Set the key only in the active shell. Do not write it to a committed file.

```powershell
$env:OPENAI_API_KEY='<set-in-local-shell-only>'
$env:PYTHONPATH='tools/openai-agents-prototype/src'
$env:SEQUEL_AGENTS_ALLOW_LIVE_SMOKE='1'
$env:OPENAI_AGENTS_DISABLE_TRACING='1'
```

## Run Live Smoke

```powershell
python -m sequel_agents_prototype.live_smoke
```

The command prints one JSON object. A valid first live smoke requires:

- `live_execution_attempted` is `true`
- `sdk_available` is `true`
- `api_key_present` is `true`
- `live_opt_in` is `true`
- `tracing_disabled` is `true`
- `forbidden_markers_present` is empty
- `status` is `passed`, or `status` is `failed` with a reviewed non-sensitive `error_type` and `result_summary`

Important result fields:

- `status`: `passed`, `skipped`, or `failed`
- `live_execution_attempted`: whether the SDK path was actually invoked
- `sdk_available`: whether the optional SDK import was available
- `api_key_present`: whether the local shell had an API key
- `live_opt_in`: whether `SEQUEL_AGENTS_ALLOW_LIVE_SMOKE=1` was set
- `tracing_disabled`: whether tracing was disabled before the live boundary
- `forbidden_markers_present`: fixture-sanitization guardrail result
- `result_summary`: short model or error summary, capped by the smoke-test code
- `skip_reason`: missing gate explanation for skipped runs
- `error_type`: exception class name for failed live attempts

## Cleanup

Remove live-smoke environment variables from the current shell:

```powershell
Remove-Item Env:OPENAI_API_KEY -ErrorAction SilentlyContinue
Remove-Item Env:SEQUEL_AGENTS_ALLOW_LIVE_SMOKE -ErrorAction SilentlyContinue
Remove-Item Env:OPENAI_AGENTS_DISABLE_TRACING -ErrorAction SilentlyContinue
Remove-Item Env:PYTHONPATH -ErrorAction SilentlyContinue
```

Deactivate the virtual environment when finished:

```powershell
deactivate
```

## Recording Results

For work-package evidence, record only non-sensitive result fields. Do not paste secrets, full traces, raw provider logs, request IDs, or outputs that contain repository content.

Acceptable evidence:

- command used
- `status`
- `live_execution_attempted`
- `sdk_available`
- `api_key_present`
- `live_opt_in`
- `tracing_disabled`
- `forbidden_markers_present`
- summarized `skip_reason` or non-sensitive `error_type`

Do not commit live output files. If a live result is needed in a WP, paste only the reviewed non-sensitive summary.
