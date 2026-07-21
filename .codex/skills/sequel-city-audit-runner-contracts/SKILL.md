---
name: sequel-city-audit-runner-contracts
description: Prepare, run, interpret, or document Sequel Detective work-package audits using AntiGravity or another independent audit agent, and record blocked external audits or self-audit fallback without weakening human final acceptance. Use when Codex is asked about AGY/AntiGravity audits, self-audit acceptability, audit runner handoffs, or agentic workflow audit contracts.
---

# Sequel City Audit Runner Contracts

Use this skill when work-package audit handling is part of the task. It defines the current contract between planner, code agent, audit agent, and human acceptor.

## Required Reads

Read these before advising on or recording an audit outcome:

- target work package
- `docs/05-development-workflow/Work-Package-Lifecycle.md`
- `docs/05-development-workflow/Codex-Gemini-Execution-Guide.md`
- `docs/05-development-workflow/Contributor-Workflow-Guide.md`
- `references/audit-contract.md`

For agentic workflow policy changes, also read:

- `docs/05-development-workflow/Agentic-Development-Workflow-Evaluation.md`
- `docs/00-ssot/SSOT-Development-Workflow.md`

## Workflow

1. Identify the audit type:
   - independent audit with AntiGravity or equivalent external audit agent
   - blocked external audit
   - self-audit fallback
2. Inspect the work package:
   - objective, scope, allowed files, do-not-modify boundaries
   - acceptance criteria
   - code results
   - prior audit results
   - final decision state
3. Inspect actual changed files with Git before judging scope.
4. Apply `references/audit-contract.md`.
5. Record the audit result in the work package without accepting the work.
6. Leave final acceptance to the human unless the user has explicitly accepted the implemented package.

## Rules

- Prefer AntiGravity for independent audit when available and approved.
- For audit-only AGY audits, prefer `scripts/audit-work-package.ps1 <work-package> -AllowExternalAudit` only when the human has explicitly authorized external audit data sharing for the repository state. The wrapper delegates to `scripts/run-work-package.ps1 -Execute Audit -AuditAgent AntiGravity`.
- `scripts/run-work-package.ps1 <work-package> -Execute AntiGravity -AllowExternalAudit` and `-Execute Audit -AuditAgent AntiGravity -AllowExternalAudit` remain supported lower-level runner forms.
- Confirm the worktree is isolated to the active work package before independent audit. If the runner reports a mixed-worktree block, record it as blocked and resolve unrelated dirty files before claiming independent audit completion.
- If AGY is selected without `-AllowExternalAudit`, or AGY is missing, unauthenticated, timed out, or blocked by policy, record the runner's blocked audit result. Do not retry through an indirect path.
- Treat self-audit as non-independent. It can support low-risk documentation review or blocked-audit closeout, but it must be labeled.
- Never claim "AntiGravity audit passed" unless AGY actually ran and produced a pass.
- Record approval, policy, authentication, network, timeout, or tool-access blockers exactly.
- Do not broaden scope after implementation begins. Create a corrective or follow-up WP instead.
- Do not modify app, database, script, package, lockfile, graph, dependency, output, or runtime AI files unless the active WP explicitly allows them.
- Do not let any agent accept its own work. Human final decision remains the acceptance gate.

## Output Contract

When reporting an audit result, include:

- verdict: PASS, FAIL, BLOCKED, or SELF-AUDIT PASS/WARN/FAIL
- auditor: AntiGravity, other independent agent, or self-audit
- scope check summary
- acceptance-criteria check summary
- runtime AI / dependency / destructive-action boundary check
- unresolved limitations
- recommended follow-up only when needed
