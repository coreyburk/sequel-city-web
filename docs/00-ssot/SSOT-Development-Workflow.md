# SSOT Development Workflow

## Collaboration Model

| Role | Responsibility |
|---|---|
| ChatGPT | Architecture, SSOT design, work package creation, prompt preparation, reasoning |
| Codex CLI | Scoped implementation tasks |
| Claude CLI | Optional architecture-heavy or UI-heavy implementation support |
| AntiGravity | Preferred local independent audits against SSOT and work package scope when available and approved |
| Gemini CLI | Legacy/alternate independent audit agent when available |
| Human Developer | Final authority, testing, acceptance, and instructional judgment |

This workflow is development-only. It must not imply that Sequel City Web Detective requires runtime AI, LLMs, MCP, Ollama, cloud services, or external APIs.

## Document Scope

This document owns work package structure, implementation rules, audit rules, and development-time agent responsibilities. Runtime AI boundaries are owned by `SSOT-AI-Agent-Boundaries.md`. Runtime architecture is owned by `SSOT-Architecture.md`.

## Work Package Rules

Every implementation change should be driven by a work package that includes objective, scope, out-of-scope boundaries, SSOT references, implementation tasks, acceptance criteria, code prompt, audit prompt, results sections, and final decision.

Cross-module, architectural, database, security-boundary, and case-progression work packages must include an impact analysis before implementation. Use the repository Understand graph when available to identify affected layers, dependencies, and regression coverage, but verify conclusions against source files and preserve SSOT and human judgment as the final authority. Narrow isolated changes may record why graph analysis is unnecessary.

Stack decisions must be explicit in SSOT before implementation work packages begin. Implementation work packages must not infer technology choices from prior unrelated projects, prior experiments, or previously generated scaffolds.

Each work package must include these sections:

- `## Code Prompt`
- `## Audit Prompt`
- `## Code Results`
- `## Audit Results`
- Manual final decision or review section

Execution modes:

- `None` means prompt only
- `Codex` means implementation only
- `Gemini` means audit only
- `Full` means Codex first, then Gemini

## Implementation Rules

- Make minimal, scoped changes.
- Do not refactor unrelated files.
- Do not add dependencies unless explicitly allowed.
- Do not change SSOT silently.
- Confirm the selected stack explicitly before creating implementation scaffolding.
- Do not infer the stack from prior unrelated projects or abandoned work.
- Do not implement AI behavior before deterministic boundaries exist.
- Do not introduce runtime AI behavior in documentation-only work packages.
- Prefer clear service boundaries over controller-heavy logic.
- Codex modifies files according to the work package.

## Agentic Handoff Contracts

Agentic development is allowed only as a development workflow around scoped work packages. The handoff order is:

```text
planner -> code agent -> independent audit agent -> human final decision
```

Each role has a bounded authority:

- planners create scope, prompts, impact analysis, and acceptance criteria
- code agents implement within the approved files and record results
- audit agents review the package, changed files, SSOT alignment, validation evidence, and boundary risks
- humans accept, reject, defer, or request corrective work

No agent may accept its own work. Self-audit can support low-risk or environment-blocked review, but it must be labeled as non-independent and cannot be represented as AntiGravity, Gemini, or other external audit evidence.

## Audit Rules

AntiGravity is the preferred current independent audit agent when local access is available and the user approves any required data-sharing/tool access. Gemini remains a supported legacy or alternate independent audit agent.

- Independent audits must check SSOT alignment, scope compliance, deterministic boundary preservation, database safety, no spoiler exposure, no AI authority drift, and build or test implications.
- Independent audits work against the work package and SSOT.
- Blocked external audits must record the blocker and any local fallback checks.
- Self-audit fallback must be labeled and is not equivalent to independent audit.
- Humans approve final decisions.
