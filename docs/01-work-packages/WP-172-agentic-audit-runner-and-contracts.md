# Agentic Audit Runner And Contracts

## Objective

Create a reusable development workflow contract for independent work-package audits, including AntiGravity usage, self-audit limits, and agent handoff responsibilities.

## Scope

### In Scope
- Add a repo-local Codex skill for Sequel Detective audit runner contracts.
- Document when AntiGravity is the preferred independent audit agent.
- Define self-audit as an environment-limited fallback, not a substitute for independent review.
- Update workflow documentation so planner, implementer, auditor, and human acceptance responsibilities are explicit.
- Preserve the current runner as the deterministic execution surface without adding AGY automation.

### Out of Scope
- Adding OpenAI Agents SDK, AGY SDK integration, MCP servers, or new dependencies.
- Modifying application code, database files, tests, scripts, package manifests, lockfiles, generated graph files, or runtime behavior.
- Automating external audit execution through `scripts/run-work-package.ps1`.
- Allowing agents to accept their own work or bypass human final decision.

## Impact Analysis

### Understand Status
- Graph available: Yes; `.understand-anything/knowledge-graph.json`, `fingerprints.json`, and `meta.json` are present.
- Baseline commit: `418990872a72e034197857ff383f74dfa575a90f`.
- Freshness assessment: Usable with non-structural drift. Later commits changed workflow documentation, repo-local skills, handoff notes, and graph metadata/fingerprints, but this package is documentation/skill-only and does not depend on runtime code relationships.
- Analysis performed: Reviewed SSOT development workflow, work-package lifecycle, Understand analysis guidance, agentic workflow evaluation, code/audit execution guide, existing repo-local skills, `new-lite-work-package.ps1`, `run-work-package.ps1` references, and targeted audit/AntiGravity/self-audit references.

### Affected Architecture
- Layers: development workflow documentation, repo-local Codex skills, work-package lifecycle governance.
- Primary files/components:
  - `docs/01-work-packages/WP-172-agentic-audit-runner-and-contracts.md`
  - `docs/00-ssot/SSOT-Development-Workflow.md`
  - `docs/05-development-workflow/Codex-Gemini-Execution-Guide.md`
  - `docs/05-development-workflow/Contributor-Workflow-Guide.md`
  - `.codex/skills/sequel-city-audit-runner-contracts/**`
- Upstream consumers: human developer, Codex planning/implementation agents, Claude implementation agents, AntiGravity audit agent, future agentic orchestration packages.
- Downstream dependencies: future OpenAI Agents SDK evaluation, future AGY runner integration, future database identity validation package audit flow.

### Regression Surface
- Related tests: Documentation-only package; validate with `git diff --check`, skill validation, and targeted text search for workflow consistency.
- User workflows: work-package planning, code-agent execution, independent audit, self-audit fallback, final acceptance, corrective WP creation.
- Security/data boundaries: development-only agent workflow; no runtime AI; no external audit execution is automated; external data-sharing/approval limits must be recorded when AntiGravity cannot run.

### Graph Update Decision
- Regeneration required: No.
- Rationale: This package adds workflow documentation and a repo-local skill only. It does not change imports, application architecture, database structure, Case 004 progression, or major documentation organization.

## Files Allowed to Change

Allowed:

- docs/01-work-packages/WP-172-agentic-audit-runner-and-contracts.md
- docs/00-ssot/SSOT-Development-Workflow.md
- docs/05-development-workflow/Codex-Gemini-Execution-Guide.md
- docs/05-development-workflow/Contributor-Workflow-Guide.md
- .codex/skills/sequel-city-audit-runner-contracts/**

Do Not Modify:

- apps/**
- database/**
- scripts/**
- .understand-anything/**
- package.json
- package-lock.json
- apps/**/package.json
- apps/**/package-lock.json
- docs/00-ssot/SSOT-AI-Agent-Boundaries.md

## Constraints

- Keep the workflow development-only.
- Do not add runtime AI, runtime LLM calls, external APIs, or cloud dependencies.
- Do not install or vendor OpenAI Agents SDK, AGY tooling, or other agent frameworks.
- Do not change the work-package runner in this package.
- Do not claim independent audit completion when only self-audit was possible.
- Human final decision remains required for acceptance.
- External audit approval or policy blockers must be recorded in `Audit Results`.

## Required Behavior

- The new skill must trigger when Codex is asked to run, prepare, interpret, or document Sequel Detective work-package audits, especially AntiGravity audits or self-audit fallback.
- The skill must require reading the relevant WP, changed files, workflow docs, and audit contract reference before advising on audit outcome.
- The skill must define audit result states: independent PASS, independent FAIL, blocked external audit, and self-audit fallback.
- The workflow docs must identify AntiGravity as the current local independent audit agent when available.
- The workflow docs must state that self-audit is acceptable only for low-risk or environment-blocked cases and must be labeled as non-independent.
- The workflow docs must preserve human final acceptance.

## Acceptance Criteria

- [x] `WP-172-agentic-audit-runner-and-contracts.md` exists and includes completed impact analysis, scope, prompts, results, and final decision sections.
- [x] A repo-local `sequel-city-audit-runner-contracts` skill exists with valid frontmatter and concise workflow instructions.
- [x] The skill includes a reference contract for AntiGravity audit, blocked audit, and self-audit fallback handling.
- [x] Workflow docs distinguish independent audit from self-audit.
- [x] Workflow docs keep runtime AI and automated external tool execution out of scope.
- [x] No app, database, script, graph, package manifest, lockfile, dependency, or output files are changed.

## Code Prompt

Implement WP-172 exactly as scoped.

Required changes:
1. Create a repo-local Codex skill at `.codex/skills/sequel-city-audit-runner-contracts/`.
2. Add concise `SKILL.md` instructions for audit runner contracts.
3. Add a focused reference document for audit result states, AntiGravity handoff rules, blocked audit handling, and self-audit fallback limits.
4. Update `SSOT-Development-Workflow.md`, `Codex-Gemini-Execution-Guide.md`, and `Contributor-Workflow-Guide.md` to reflect the current AntiGravity/audit contract.
5. Update this work package with implementation results, validation, audit results, and final decision.

Do not modify application code, database files, scripts, package manifests, lockfiles, generated Understand graph files, or runtime AI boundaries.

## Audit Prompt

Audit WP-172 against the implemented changes.

Verify:
- The new skill is repo-local, concise, and scoped to work-package audit contracts.
- AntiGravity is documented as the preferred independent audit agent when available.
- Self-audit is clearly labeled as non-independent and limited to low-risk or blocked-audit situations.
- Human final acceptance remains mandatory.
- No runtime AI, dependency, script, app, database, graph, package, lockfile, or generated output changes were introduced.
- The work package impact analysis and allowed-file set match the actual changed files.

Output:
- Verdict: PASS or FAIL
- Scope violations
- Missing contract details
- Runtime AI or authority drift risks
- Follow-up recommendations

## Code Results

Implemented.

- Added `.codex/skills/sequel-city-audit-runner-contracts/SKILL.md`.
- Added `.codex/skills/sequel-city-audit-runner-contracts/references/audit-contract.md`.
- Updated `SSOT-Development-Workflow.md` to include AntiGravity, self-audit fallback, and agentic handoff contracts.
- Updated `Codex-Gemini-Execution-Guide.md` to document independent audit states, blocked external audits, and self-audit limits.
- Updated `Contributor-Workflow-Guide.md` to reference the new audit contract skill and clarify that self-audit is not independent audit.
- Kept app, database, scripts, dependencies, graph files, package manifests, lockfiles, generated outputs, and runtime AI boundaries unchanged.

Validation:
- `python C:\Users\cburk\.codex\skills\.system\skill-creator\scripts\quick_validate.py .codex\skills\sequel-city-audit-runner-contracts`
- `git diff --check`
- targeted `rg` checks for AntiGravity, self-audit, human final acceptance, and runtime AI boundaries

## Audit Results

SELF-AUDIT PASS for local scope and contract review:

- Verdict: PASS for local documentation and skill review.
- Scope violations: None found. Changed files are limited to this work package, workflow docs, and the new repo-local skill.
- Missing contract details: None found. Independent PASS/FAIL, blocked external audit, and self-audit fallback states are defined.
- Runtime AI or authority drift risks: None found. The docs preserve development-only use and human final acceptance.
- Follow-up recommendations: Consider a later, separately scoped package to add explicit AGY support to `scripts/run-work-package.ps1` only after approval/data-boundary behavior is settled.

External AntiGravity audit was not executed in this package. The package defines the contract for AGY usage but does not automate or invoke external audit tooling.

## Final Decision

Accepted.

Reason: Human acceptance was given after implementation. The self-audit fallback is sufficient for this documentation/skill-only package, the AntiGravity audit contract is now reusable as a repo-local skill, human final acceptance remains explicit, and the change does not modify runtime code, database assets, scripts, generated graph files, package manifests, lockfiles, dependencies, or runtime AI boundaries.
