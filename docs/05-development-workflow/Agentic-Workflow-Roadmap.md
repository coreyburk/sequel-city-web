# Agentic Workflow Roadmap

## Purpose

This roadmap describes the development-time agentic workflow layer for Sequel Detective. It explains what the project is creating, why it improves development throughput, what exists now, what remains human-owned, and what should come next.

This document is descriptive. It does not authorize runtime AI, app behavior changes, dependency adoption, database changes, graph refresh, external data sharing, commit, or push. Those actions still require scoped work packages and the existing human-owned gates.

## What We Are Creating

Sequel Detective is building a development workflow layer around the existing work-package process. The layer is not a replacement for human engineering judgment. It is a set of docs, scripts, skills, graph-refresh practices, and audit contracts that make the next development step easier to determine and harder to execute incorrectly.

The target workflow is:

```text
idea or issue
-> scoped work package
-> impact analysis and validation plan
-> implementation within allowed files
-> independent audit
-> human final decision
-> accepted-WP closeout, handoff refresh, commit, and push
-> graph refresh when structural drift requires it
```

The useful automation is mostly around state detection, planning, evidence collection, and safe recommendations. The workflow should reduce manual rereading and repeated decision-making, but it must not bypass acceptance, audit, scope, or safety gates.

## Why This Helps Development

The workflow improves development speed by making repository state explicit. A contributor or agent can inspect the work package, dirty files, validation evidence, audit result, final decision, and graph freshness instead of reconstructing the state from conversation history.

It improves consistency by routing recurring decisions through the same scripts and skills. Work-package creation, validation-plan review, audit readiness, closeout readiness, and accepted-WP commits have deterministic helpers instead of ad hoc judgment.

It improves resumability by keeping durable artifacts in the repository: work packages, the live handoff, graph metadata, and current workflow docs. This matters because Sequel Detective development spans long sessions, machine switches, context compaction, and multiple agents.

It improves audit quality by preserving independent review and human acceptance as separate gates. Audit results can inform acceptance, but no code or audit agent accepts its own work.

It improves planning by using Understand as an advisory graph. The graph helps locate likely relationships and stale surfaces, then source, tests, SSOT, and observed behavior remain authoritative.

## Current Assets

| Asset | Current Role |
|---|---|
| `docs/00-ssot/SSOT-Development-Workflow.md` | Defines the development-only collaboration model, agent roles, work-package rules, and human final decision authority. |
| `docs/05-development-workflow/Work-Package-Lifecycle.md` | Defines required WP sections, impact analysis, graph freshness, scope control, failure handling, and closeout expectations. |
| `docs/05-development-workflow/Contributor-Workflow-Guide.md` | Explains the practical contributor loop and points contributors to lifecycle, validation, closeout, and decision helpers. |
| `docs/05-development-workflow/Agentic-Development-Workflow-Evaluation.md` | Evaluates the agentic workflow concept, boundaries, options, and early POC direction. This roadmap complements it with current-state direction. |
| `docs/05-development-workflow/OpenAI-Agents-SDK-Orchestration-Readiness.md` | Defines readiness constraints for a possible future SDK manager. It does not authorize dependency installation or runtime AI. |
| `docs/05-development-workflow/Understand-Codebase-Analysis.md` | Defines graph usage, refresh readiness, refresh commands, artifact hygiene, and freshness classifications. |
| `scripts/new-lite-work-package.ps1` | Public canonical WP creation command. It currently remains a compatibility shim over `scripts/work-package/new-lite-work-package.ps1`. |
| `.codex/skills/sequel-city-wp-planning/` | Repository-local planning skill for creating scoped WPs with conservative Understand-assisted impact analysis. |
| `.codex/skills/sequel-city-wp-corrective/` | Corrective planning skill for converting failed audit findings or review defects into narrow follow-up WPs. |
| `scripts/get-work-package-status.ps1` | Read-only lifecycle-state preflight for a target WP. |
| `scripts/get-work-package-validation-plan.ps1` | Read-only validation evidence and planned-command preflight. |
| `scripts/check-work-package-closeout.ps1` | Read-only closeout readiness preflight that composes lifecycle and validation state. |
| `scripts/get-agentic-workflow-status.ps1` | Read-only aggregate status bundle for repository and WP state. |
| `scripts/get-agentic-workflow-decision.ps1` | Read-only decision-router dry run that recommends a next action without executing it. |
| `scripts/audit-work-package.ps1` | Human-facing audit wrapper that routes to independent audit after explicit authorization when required. |
| `.codex/skills/sequel-city-audit-runner-contracts/` | Audit contract skill for AntiGravity, blocked external audits, and self-audit fallback labeling. |
| `.codex/skills/sequel-city-wp-closeout-handoff/` | Closeout workflow skill for accepted WPs, audit review, final decision recording, handoff refresh, commit, and push. |
| `scripts/commit-work-package.ps1` | Accepted-WP commit gate and project-format commit helper. |
| `.understand-anything/**` | Tracked Understand graph baseline and scan inventory used for architecture and planning context. |
| `scripts/check-understand-refresh-readiness.ps1` | Read-only readiness and artifact hygiene preflight for graph refresh packages. |
| `scripts/refresh-understand-graph.ps1` | Repository-owned deterministic Understand graph refresh wrapper. |
| `scripts/get-sdk-manager-recommendation.ps1` and `scripts/get-sdk-manager-orchestration-dry-run.ps1` | Development-time preview surfaces for future SDK manager decisions. They remain advisory and non-executing. |

## Human-Owned Gates

These decisions remain human-owned:

- product direction and sprint priority
- instructional value and classroom suitability
- SSOT approval
- final work-package acceptance, rejection, or deferral
- destructive database or filesystem actions
- dependency adoption
- runtime AI authorization
- external audit data-sharing authorization
- release or pilot readiness
- commit and push of accepted work

Agents may recommend, inspect, draft, implement within scope, audit, or record evidence. They may not accept their own work or treat previews as authorization.

## Forbidden Automation Boundaries

This roadmap does not authorize agents to:

- add runtime AI to Sequel Detective
- change application behavior
- change database schema or data
- install dependencies or modify package/lock files
- run live SDK/model calls
- transmit repository context to external tools without explicit authorization
- run destructive operations
- refresh the Understand graph outside a scoped graph-refresh WP
- commit or push without accepted-WP finalization
- update SSOT silently
- broaden a WP after implementation begins
- treat graph output, generated summaries, or external tool advice as more authoritative than source, tests, SSOT, and observed behavior

## Current Maturity

The workflow is now more than manual discipline. The repository has deterministic helpers for most lifecycle checkpoints and repository-local skills for planning, corrective work, audit contracts, and closeout.

It is not yet a fully orchestrated development loop. The strongest current path is still human-steered: create a WP, implement it, audit it, accept it, close it out, and refresh the graph when needed.

The next improvement should be clarity and coordination, not broader automation. The project needs a stable shared roadmap, better surfaced next-step recommendations, and tighter documentation around when an agent should stop.

## Roadmap

### Near Term

- Keep this roadmap current as the single short explanation of the agentic workflow direction.
- Use `scripts/get-agentic-workflow-status.ps1` and `scripts/get-agentic-workflow-decision.ps1` as the default read-only state and recommendation layer when resuming work.
- Continue script-directory cleanup one domain at a time, preserving public top-level compatibility shims until docs, skills, command previews, and tests are deliberately migrated.
- Continue focused graph-refresh WPs after accepted structural changes under `scripts/**`, `.codex/skills/**`, `tools/**`, workflow docs, app architecture, database structure, restricted-data boundaries, or Case 004 progression.
- Improve documentation where workflow behavior is still spread across WPs, handoff text, and individual skill instructions.

### Medium Term

- Harden test-selection recommendations so planning can more reliably connect impact analysis to the smallest useful validation set.
- Improve the decision router so it gives clearer blocked-state explanations and safer next-action previews.
- Keep SDK manager recommendation and orchestration dry-run outputs advisory until they prove value with fixture coverage and no dependency/runtime risk.
- Add or refine fixture matrices for malformed WPs, missing sections, stale graph data, failed audits, blocked audits, and mixed worktrees.
- Make handoff refresh expectations easier to audit without turning handoff updates into unscoped documentation churn.

### Deferred

- Evaluate OpenAI Agents SDK only after the repo-native workflow is stable enough that an orchestrator would wrap known behavior instead of inventing process.
- Do not adopt SDK dependencies, tracing, credentials, or live model calls until a scoped WP explicitly authorizes them.
- Do not move from recommendation to execution for audit dispatch, graph refresh, commit, push, dependency installation, or destructive actions without explicit human authorization and guardrail tests.

## Done Enough For This Phase

The current workflow-improvement phase is done enough when:

- a clean repo can report the likely next development step from durable repository state
- new work can be planned through a narrow WP without relying on conversation memory
- implementation scope is machine-checkable against allowed files
- validation evidence is recorded and reviewable
- independent audit results are recorded without replacing human acceptance
- accepted work is committed with the project format and refreshed handoff
- graph freshness is either current or explicitly handled before graph-backed planning
- the next roadmap item is visible without rereading many WPs

That standard is intentionally practical. The goal is faster Sequel Detective development with fewer state errors, not autonomous coding for its own sake.

## Relationship To Other Docs

- `SSOT-Development-Workflow.md` remains the authority for development-time roles, agent boundaries, and workflow rules.
- `Work-Package-Lifecycle.md` remains the authority for WP structure, impact analysis, graph freshness, scope control, and closeout expectations.
- `Contributor-Workflow-Guide.md` remains the practical contributor workflow.
- `Agentic-Development-Workflow-Evaluation.md` remains the evaluation record for why the project chose incremental repo-native workflow improvements before SDK adoption.
- `OpenAI-Agents-SDK-Orchestration-Readiness.md` remains the readiness contract for any future SDK manager package.
- `Understand-Codebase-Analysis.md` remains the authority for graph usage, graph refresh, and artifact hygiene.

