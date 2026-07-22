# OpenAI Agents SDK Development Prototype

## Purpose

This prototype models a development-only orchestration layer for the Sequel Detective work-package lifecycle.

It is not part of the Sequel Detective runtime. It does not add runtime AI, LLM calls, MCP runtime requirements, cloud services, external APIs, or autonomous behavior to the student-facing application.

## Default Mode

Default validation is offline:

```powershell
python -m unittest discover tools/openai-agents-prototype/tests
python -m compileall tools/openai-agents-prototype/src
```

The fixture CLI also runs offline when the prototype `src` directory is on `PYTHONPATH`:

```powershell
$env:PYTHONPATH='tools/openai-agents-prototype/src'
python -m sequel_agents_prototype --help
python -m sequel_agents_prototype run-fixture idea-intake --slug docs-only-fixture
python -m sequel_agents_prototype run-fixture audit-request --work-package docs/01-work-packages/WP-185-fixture.md
python -m sequel_agents_prototype run-fixture corrective-planning --source-work-package docs/01-work-packages/WP-184-source.md --corrective-work-package docs/01-work-packages/WP-185-corrective.md --finding-type omission
python -m sequel_agents_prototype run-fixture closeout --work-package docs/01-work-packages/WP-185-fixture.md --final-decision Accepted --closeout-state ReadyForFinalization --handoff-refreshed --user-requested-push
```

The tests use only the Python standard library. They do not require:

- `openai-agents`
- `OPENAI_API_KEY`
- network access
- trace export
- OpenAI API calls
- AntiGravity or Gemini calls

## Optional SDK Posture

`openai-agents` is declared as an optional extra in this prototype package only. Installing it is not required for offline validation.

Future live SDK runs must be separately authorized by an accepted work package and should keep:

- tracing disabled by default
- sensitive trace data excluded when tracing is enabled
- repository prompt, diff, source, audit, handoff, credential, answer-key, and student data out of exported traces unless explicitly approved
- all app/runtime packages untouched

## Boundaries

The prototype may model workflow states and command contracts. It must not:

- accept work packages
- invoke external audits without explicit authorization
- commit or push
- mutate databases
- run destructive filesystem operations
- add runtime AI behavior
- replace the existing PowerShell lifecycle helpers or repo-local Codex skills

The existing lifecycle helpers remain authoritative.

## Prototype Surfaces

- `IMPLEMENTATION-MANIFEST.md` gives auditors a stable file inventory and validation summary.
- `cli.py` exposes deterministic fixture scenarios as JSON through `python -m sequel_agents_prototype`.
- `__main__.py` provides the module entry point for the fixture CLI.
- `contracts.py` defines structured output contracts.
- `guardrails.py` blocks unsafe workflow actions.
- `tools.py` defines local command contracts over existing helper scripts.
- `manager.py` routes offline fixture intents into structured outputs.
- `sdk_boundary.py` isolates optional OpenAI Agents SDK imports.

## Fixture Scenarios

The offline manager covers:

- idea intake to WP draft
- implemented WP to audit request
- failed audit to corrective WP
- accepted WP to closeout and handoff refresh

The CLI can run the same scenarios with these fixture names:

- `idea-intake`
- `audit-request`
- `corrective-planning`
- `closeout`
