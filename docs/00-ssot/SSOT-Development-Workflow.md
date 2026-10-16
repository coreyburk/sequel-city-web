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
- `AntiGravity` means AGY audit only
- `Audit` means audit only, defaulting to Gemini unless `-AuditAgent AntiGravity` is selected
- `Full` means code agent first, then the selected audit agent

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

## Simplicity Check

During planning and review, ask:

1. Can existing code, native platform features, or installed dependencies satisfy the requirement?
2. Does every new abstraction have a current purpose?
3. Is this the smallest clear, complete change that meets acceptance criteria and preserves required testing?

Record material findings in the existing scope, implementation tasks, or audit results; no separate report is required. Simplicity must not reduce approved requirements, SQL safety, spoiler protection, deterministic progression, accessibility, or required validation. Prefer readability over fewer lines, and keep unrelated cleanup outside the work package.

## Evidence-Based Implementation

Apply this guidance within the active work package and the existing Simplicity Check; it adds no separate report or approval gate.

### Assumptions And Scope

- State assumptions when they materially affect the outcome. Ask when unresolved alternatives change scope, correctness, safety, or irreversible actions; resolve routine choices from current source and project conventions. Continue independent authorized work while awaiting necessary answers.
- Map implementation tasks to observable acceptance criteria and appropriate checks before editing. Authorization to implement permits the scoped work; it is not final acceptance or authorization for unrelated external actions.
- Keep each changed line attributable to the requirement or a necessary supporting change. Match surrounding conventions, remove imports or code made unused by your own edits, and record unrelated defects or cleanup as follow-up candidates. Do not add speculative features, configuration, or abstractions.

### Evidence-Led Debugging

1. Establish expected versus actual behavior and reproduce the defect when feasible. Read errors, relevant changes, and the affected data flow before proposing a fix. If reproduction is unavailable, state that limitation and gather diagnostic evidence rather than claiming a cause.
2. Compare a working path with the failing path, form a specific hypothesis, and use the smallest safe check to distinguish it from alternatives. Keep diagnostic output free of secrets and protected case answers.
3. Change one causal factor at a time. Use a focused regression test or reproducible check that exposes the original defect and verifies the fix; retain required broader coverage. Do not impose test-first ceremony on copy edits or low-impact changes where a direct check is sufficient.
4. When attempts fail, revisit the hypothesis and evidence instead of stacking speculative fixes. Escalate a demonstrated scope or architecture issue through the existing work-package process; a fixed attempt count alone does not prove an architecture defect.

Use the existing debugger when a sustained investigation benefits from it. The [WP-279 debugger boundaries](../01-work-packages/WP-279-specialist-skills-pilot.md#required-behavior) apply: use authorized artifact paths, respect investigation-only versus implementation scope, and retain project acceptance/commit gates.

### Verification And Completion Claims

- Record the commands or manual checks actually performed, their results, and the state they covered in Code Results. Identify a commit when sufficient; for uncommitted work describe the relevant diff or files tested. State checks not run and environmental limitations explicitly.
- Match the evidence to the claim: lint does not prove a build, a unit test does not prove browser behavior, and passing tests do not prove every acceptance criterion. Check criteria against the actual implementation and inspect delegated results rather than relying only on an agent summary.
- Rerun affected checks after relevant code, configuration, dependency, or environment changes, or when evidence is missing or uncertain. Reuse recorded results when the tested state remains applicable; a new message alone is not a reason to rerun them. Complete all validation required by the work package.
- Distinguish implemented, verified, independently audited, and human-accepted states. Agent agreement does not establish correctness or replace independent audit evidence and human final acceptance.

## Skill Use And Communication

Before adding or changing a project skill, review the existing project-local skills and relevant installed specialists for overlap. Prefer a narrow change to the existing owner of the guidance; keep one canonical rule and link to it. Skills support the active scope, SSOT, and acceptance criteria. Generic framework, design-system, dependency, or lifecycle recommendations do not authorize stack changes, expanded scope, installation, external data sharing, or acceptance. Retain the [WP-279 specialist boundaries](../01-work-packages/WP-279-specialist-skills-pilot.md#required-behavior).

Lead reports with the outcome or decision, then material evidence, limitations, and any required next action. Be concise and matter-of-fact, challenge unsupported assumptions, and omit flattery and timeline estimates. Do not impose a fixed response template or hide necessary findings to meet an arbitrary length limit.

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
- AGY audits require explicit external-audit authorization before repository prompt or diff context is sent to AntiGravity.
- Independent audits and accepted-WP finalization require a worktree isolated to the active WP's allowed files unless a human explicitly authorizes a mixed-worktree exception.
- Blocked external audits must record the blocker and any local fallback checks.
- Self-audit fallback must be labeled and is not equivalent to independent audit.
- Humans approve final decisions.
