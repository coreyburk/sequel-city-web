# SSOT Development Workflow

## Collaboration Model

| Role | Responsibility |
|---|---|
| ChatGPT | Architecture, SSOT design, work package creation, prompt preparation, reasoning |
| Codex CLI | Scoped implementation tasks |
| Claude CLI | Optional architecture-heavy or UI-heavy implementation support |
| Gemini CLI | Independent audits against SSOT and work package scope |
| Human Developer | Final authority, testing, acceptance, and instructional judgment |

## Work Package Rules

Every implementation change should be driven by a work package that includes objective, scope, out-of-scope boundaries, SSOT references, implementation tasks, acceptance criteria, Codex prompt, Gemini audit prompt, results sections, and final decision.

## Implementation Rules

- Make minimal, scoped changes.
- Do not refactor unrelated files.
- Do not add dependencies unless explicitly allowed.
- Do not change SSOT silently.
- Do not implement AI behavior before deterministic boundaries exist.
- Prefer clear service boundaries over controller-heavy logic.

## Audit Rules

Gemini audits must check SSOT alignment, scope compliance, deterministic boundary preservation, database safety, no spoiler exposure, no AI authority drift, and build or test implications.
