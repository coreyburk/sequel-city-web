# OpenAI Agents SDK Orchestration Readiness

## Purpose

This document defines what must be true before Sequel Detective evaluates OpenAI Agents SDK as a development-time orchestration layer over the existing work-package workflow.

This is not runtime application architecture. It does not authorize AI, LLM calls, MCP runtime requirements, cloud services, external APIs, or autonomous agents inside the student-facing Sequel Detective application.

## Current Decision

OpenAI Agents SDK is a reasonable candidate for a future development workflow prototype, but the repository is not ready to add it as a dependency yet.

Proceed only in this order:

1. Keep the existing work-package lifecycle authoritative.
2. Use this readiness document to define the orchestration contract.
3. Create a separate accepted work package before adding `openai-agents`, Python manifests, lockfiles, SDK runner code, or API calls.
4. Keep any SDK prototype development-only and isolated from app runtime packages.

## Prototype Location

The development-only prototype scaffold lives under `tools/openai-agents-prototype/`.

The prototype is intentionally isolated from application workspaces. Its offline tests use only the Python standard library and must pass without `openai-agents`, `OPENAI_API_KEY`, network access, or trace export. Optional SDK dependency metadata is confined to the prototype package and does not authorize runtime AI, external data transmission, or app integration.

## Existing Workflow Assets

The SDK should wrap these assets, not replace them.

| Asset | Current Role | Future SDK Role |
|---|---|---|
| `docs/05-development-workflow/Work-Package-Lifecycle.md` | Work-package schema, states, scope rules, audit/finalization isolation | Authoritative lifecycle policy |
| `scripts/new-lite-work-package.ps1` | Canonical WP creation | Tool called by planning/corrective agents |
| `scripts/run-work-package.ps1` | Prompt preview, implementation routing, audit routing | Tool for controlled execution requests |
| `scripts/audit-work-package.ps1` | Human-facing audit-only wrapper | Tool for audit dispatch after explicit authorization |
| `scripts/get-agentic-workflow-status.ps1` | Read-only repository and work-package status bundle | First tool for manager state inspection |
| `scripts/get-agentic-workflow-decision.ps1` | Read-only decision-router dry run | Advisory next-action recommendation only |
| `scripts/get-work-package-status.ps1` | Read-only lifecycle status | Tool for state inspection |
| `scripts/get-work-package-validation-plan.ps1` | Read-only validation-plan inspection | Tool for test/evidence selection |
| `scripts/check-work-package-closeout.ps1` | Read-only closeout preflight | Tool for finalization readiness checks |
| `scripts/commit-work-package.ps1` | Accepted-WP commit gate | Tool available only after human acceptance |
| `.codex/skills/sequel-city-wp-planning/` | Scoped WP planning | Instruction source for planning agent |
| `.codex/skills/sequel-city-wp-corrective/` | Corrective WP generation | Instruction source for corrective planner |
| `.codex/skills/sequel-city-audit-runner-contracts/` | Audit contract handling | Instruction source for audit dispatcher |
| `.codex/skills/sequel-city-wp-closeout-handoff/` | Accepted closeout and handoff refresh | Instruction source for closeout coordinator |
| `.codex/skills/sequel-city-wp-finalize/` | Finalization discipline | Instruction source for accepted commit gate |
| `docs/00-ssot/END-OF-DAY-HANDOFF.md` | Live resume state | Required artifact refreshed before accepted commits |

## Proposed SDK Role Mapping

### Intake And Planning Agent

Purpose:

- Convert a user request into a scoped work-package plan.
- Preserve the existing `sequel-city-wp-planning` behavior.
- Stop after creating or updating the planning artifact unless implementation is separately requested.

Allowed tools:

- `scripts/get-agentic-workflow-status.ps1`
- `scripts/new-lite-work-package.ps1`
- read-only source and documentation inspection
- `scripts/get-work-package-status.ps1`
- `scripts/get-work-package-validation-plan.ps1`

Forbidden actions:

- implementation edits
- acceptance decisions
- dependency installation
- runtime AI authorization
- commits or pushes

### Implementation Dispatcher

Purpose:

- Route implementation requests to the existing work-package prompt and code-agent flow.
- Ensure dirty-file scope is isolated before execution.

Allowed tools:

- `scripts/get-agentic-workflow-status.ps1 <wp>`
- `scripts/run-work-package.ps1 <wp> -Execute None`
- `scripts/run-work-package.ps1 <wp> -Execute Codex` or equivalent human-approved implementation path
- `scripts/get-work-package-status.ps1`
- `scripts/get-work-package-validation-plan.ps1`

Forbidden actions:

- broadening the WP after implementation begins
- accepting its own work
- sending audit data externally
- commit or push

### Audit Dispatcher

Purpose:

- Prepare and route independent audit requests after implementation evidence exists.
- Preserve AntiGravity/Gemini audit boundaries and explicit external-data authorization.

Allowed tools:

- `scripts/get-agentic-workflow-status.ps1 <wp>`
- `scripts/audit-work-package.ps1 <wp> -AllowExternalAudit` only after explicit user authorization
- `scripts/run-work-package.ps1 <wp> -Execute Audit -AuditAgent AntiGravity -AllowExternalAudit` only after explicit user authorization
- `scripts/check-work-package-closeout.ps1`
- `scripts/get-work-package-status.ps1`

Forbidden actions:

- invoking external audit without approval
- treating self-audit as independent audit
- editing final decisions
- accepting, committing, or pushing

### Corrective Planner

Purpose:

- Convert failed audits, review findings, unmet acceptance criteria, or noncompliant prior work into a narrow corrective WP.

Allowed tools:

- `scripts/new-lite-work-package.ps1`
- read-only original WP and audit-result inspection
- existing `sequel-city-wp-corrective` instructions

Forbidden actions:

- implementation of the corrective WP
- changing the original WP history to hide failed work
- accepting audit output as automatically authoritative
- commits or pushes

### Closeout Coordinator

Purpose:

- Coordinate accepted-WP finalization after audit evidence and human acceptance exist.
- Refresh the live handoff before commit and push.

Allowed tools:

- `scripts/get-agentic-workflow-status.ps1 <wp>`
- `scripts/check-work-package-closeout.ps1`
- `scripts/get-work-package-status.ps1`
- `scripts/get-work-package-validation-plan.ps1`
- `scripts/commit-work-package.ps1` only after human acceptance is recorded
- `git push` only after accepted-WP commit succeeds and user requested push

Forbidden actions:

- recording acceptance without the human decision
- committing with unrelated dirty files
- bypassing the commit helper
- omitting handoff refresh

### Human Acceptance Gate

Purpose:

- Own final acceptance, rejection, deferral, product priority, SSOT approval, dependency adoption, destructive actions, and runtime AI authorization.

This gate is not an SDK agent. The SDK may present recommendations and state summaries, but it must not decide final acceptance.

## Recommended Orchestration Pattern

Use a central manager agent for the first future SDK prototype.

Rationale:

- The current process has a clear lifecycle and human-owned gates.
- A central manager can inspect state, call deterministic tools, and decide which specialist flow is appropriate.
- Peer handoffs are useful later, but early handoffs risk hiding lifecycle state and making audit trails harder to review.

The central manager should expose specialist agents as tools or bounded handoff targets:

- planning tool
- implementation-dispatch tool
- audit-dispatch tool
- corrective-planning tool
- closeout-coordination tool

Every tool call should return structured state rather than freeform "done" claims.

## Lifecycle State Contract

The SDK manager should use the repository helper states as the source of truth.

| State Source | Expected States | Meaning |
|---|---|---|
| `get-agentic-workflow-status.ps1` | `Ready`, `Blocked`, with component-level states | First aggregate status snapshot |
| `get-work-package-status.ps1` | `ReadyForImplementation`, `ImplementedNeedsAudit`, `AuditedNeedsFinalDecision`, `AcceptedReadyForFinalization`, blocked/closed states | Lifecycle position |
| `get-work-package-validation-plan.ps1` | `ValidationPlanReady`, `ValidationEvidenceRecorded`, `NoAutomatedValidationExplained` | Validation readiness |
| `check-work-package-closeout.ps1` | `ReadyForAudit`, `ReadyForAcceptance`, `ReadyForFinalization`, `Blocked` | Closeout readiness |

The SDK prototype should call `get-agentic-workflow-status.ps1 -WorkPackage <wp> -Json` first, then drill into the more specific helper only when it needs detailed state. It should not infer lifecycle state from prose when a deterministic helper can report it.

When a future manager needs an advisory next-step route, it may call `get-agentic-workflow-decision.ps1 -WorkPackage <wp> -Json`. That command is dry-run only and must not be treated as authorization to execute the previewed command.

## Structured Output Contracts

A future SDK prototype should use structured outputs for every transition.

### Work Package Draft Result

```json
{
  "kind": "work_package_draft",
  "workPackagePath": "docs/01-work-packages/WP-###-slug.md",
  "status": "ready_for_implementation",
  "understandFreshness": "current | usable_with_drift | structurally_stale | unavailable",
  "allowedFiles": [],
  "doNotModify": [],
  "plannedValidation": [],
  "requiresHumanDecision": true,
  "blockers": []
}
```

### Audit Dispatch Result

```json
{
  "kind": "audit_dispatch",
  "workPackagePath": "docs/01-work-packages/WP-###-slug.md",
  "agent": "AntiGravity | Gemini | self-audit-fallback",
  "externalDataAuthorized": false,
  "auditInvoked": false,
  "resultSectionUpdated": false,
  "blockers": []
}
```

### Corrective Planning Result

```json
{
  "kind": "corrective_work_package",
  "sourceWorkPackagePath": "docs/01-work-packages/WP-###-source.md",
  "correctiveWorkPackagePath": "docs/01-work-packages/WP-###-corrective.md",
  "findingType": "defect | omission | scope_violation",
  "scopeNarrowed": true,
  "blockers": []
}
```

### Closeout Result

```json
{
  "kind": "closeout_readiness",
  "workPackagePath": "docs/01-work-packages/WP-###-slug.md",
  "closeoutState": "ReadyForAudit | ReadyForAcceptance | ReadyForFinalization | Blocked",
  "finalDecision": "Pending | Accepted | Rejected | Deferred",
  "handoffRefreshed": false,
  "commitAllowed": false,
  "blockers": []
}
```

## Tool Contract Inventory

Future SDK tools must be thin wrappers over existing commands.

| Tool Name | Command Surface | Mode |
|---|---|---|
| `resolve_agentic_workflow_status` | `powershell -ExecutionPolicy Bypass -File scripts/get-agentic-workflow-status.ps1 -WorkPackage <wp> -Json` | read-only aggregate snapshot |
| `preview_agentic_workflow_decision` | `powershell -ExecutionPolicy Bypass -File scripts/get-agentic-workflow-decision.ps1 -WorkPackage <wp> -Json` | read-only advisory dry run |
| `resolve_wp_status` | `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-status.ps1 <wp> -Json` | read-only |
| `resolve_validation_plan` | `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-validation-plan.ps1 <wp> -Json` | read-only |
| `resolve_closeout_preflight` | `powershell -ExecutionPolicy Bypass -File scripts/check-work-package-closeout.ps1 <wp> -Json` | read-only |
| `preview_work_package_prompt` | `powershell -ExecutionPolicy Bypass -File scripts/run-work-package.ps1 <wp> -Execute None` | read-only prompt preview |
| `create_work_package` | `powershell -ExecutionPolicy Bypass -File scripts/new-lite-work-package.ps1 <slug>` | creates WP only |
| `dispatch_audit` | `powershell -ExecutionPolicy Bypass -File scripts/audit-work-package.ps1 <wp> -AllowExternalAudit` | external audit, approval required |
| `preview_commit` | `scripts/commit-work-package.ps1 ... -Preview` | read-only preview |
| `commit_accepted_work` | `scripts/commit-work-package.ps1 ...` | writes commit, human acceptance required |

Do not add direct file-mutating SDK tools before the repository proves the manager can use deterministic wrappers safely.

## Guardrails

Any future SDK prototype must enforce these guardrails:

- No runtime AI behavior may be added to Sequel Detective.
- No `openai-agents` dependency, Python manifest, lockfile, virtual environment, or SDK runner may be added without a separate accepted WP.
- No external prompt, diff, source, audit, or repository context may be sent without explicit user authorization for that run.
- No agent may accept its own work.
- No self-audit may be labeled as AntiGravity, Gemini, or independent audit.
- No destructive filesystem, Git, or database action may run without explicit human instruction and the existing repo safety gates.
- No SSOT file may be changed without a scoped WP that explicitly allows it.
- No package manifest, lockfile, database, app runtime, or graph artifact may change during readiness-only work.
- No commit or push may happen before accepted-WP closeout, handoff refresh, and commit-helper validation.
- Decision-router output is advisory only; command previews must not be executed without the existing human-controlled workflow gates.

## Tracing And Data Policy

OpenAI Agents SDK supports tracing, and tracing can include workflow, model turn, tool call, guardrail, and handoff data. That is useful for development debugging, but repository prompts, diffs, source excerpts, audit outputs, and handoff text can be sensitive.

Before any SDK prototype enables trace export, a separate WP must decide:

- which API key source is allowed, such as `OPENAI_API_KEY`
- whether tracing is disabled by default
- whether trace export may include repository prompt or diff content
- how to redact secrets, answer keys, student data, database paths, and audit context
- how to label runs by workflow and work-package identifier
- what offline/no-network fallback does when API access or tracing is unavailable

Default posture for the first prototype:

- no runtime app integration
- no trace export unless explicitly authorized
- no external audit or model call without explicit user approval
- deterministic local helper scripts remain usable when SDK access is unavailable

## Fixture Scenarios

The first SDK proof of concept should be validated against fixtures before touching real active work.

### Fixture 1: Idea Intake To WP Draft

Input:

- a short user request for a documentation-only workflow improvement

Expected output:

- a new WP draft created with `scripts/new-lite-work-package.ps1`
- impact analysis completed
- Code Results, Audit Results, and Final Decision pending
- no implementation files changed

### Fixture 2: Implemented WP To Audit Request

Input:

- a WP with Code Results recorded
- dirty files limited to the WP allowed scope

Expected output:

- closeout preflight reports `ReadyForAudit`
- audit command is prepared
- external audit is not invoked until explicit authorization is present

### Fixture 3: Failed Audit To Corrective WP

Input:

- original WP
- audit result with a concrete defect or omission

Expected output:

- a corrective WP is created
- corrective scope is narrower than the original failed work
- original WP history is not rewritten
- implementation remains pending

### Fixture 4: Accepted WP To Closeout And Handoff Refresh

Input:

- WP with audit PASS and human `Accepted` final decision
- validation evidence recorded
- worktree isolated to allowed files

Expected output:

- closeout preflight reports `ReadyForFinalization`
- handoff refresh is required before commit
- commit helper preview is generated
- commit/push requires explicit user request

## Readiness Checklist

Do not create the SDK prototype WP until these are true:

- WP lifecycle helpers report reliable JSON for the target scenarios.
- The closeout preflight is the default finalization gate.
- The corrective-WP skill remains available and tested by at least fixture review.
- External audit authorization remains explicit.
- Human final acceptance remains outside agent authority.
- Dependency and tracing policy decisions are recorded.
- The prototype has a no-network fallback path.
- The prototype scope is development-only and isolated from app/runtime packages.
- Fixture scenarios are listed in the prototype WP acceptance criteria.

## Go / No-Go Criteria

### Go

Proceed to a separate SDK prototype WP when:

- the user explicitly accepts this readiness model
- the next WP authorizes dependency/tooling changes
- SDK usage is confined to development tooling
- expected tools are thin wrappers over existing scripts
- fixture validation can run without touching app, database, package, lockfile, graph, or runtime files

### No-Go

Do not proceed when:

- the goal is runtime app AI
- acceptance, audit, or commit authority would move from human-controlled gates to agents
- external trace/model/audit data policy is unresolved
- the prototype requires broad refactors
- the work can still be handled more safely with a repo-local skill or deterministic script

## Decision Statement

The next SDK-related implementation should be a separate, development-only prototype WP. It should not be created as part of this readiness package.

That future prototype may evaluate `openai-agents` only if it:

- is explicitly authorized by a new accepted WP
- does not touch app runtime packages
- wraps existing helper scripts as tools
- uses structured outputs for lifecycle states
- keeps tracing and external data transmission off unless explicitly approved
- preserves human acceptance and independent audit boundaries
