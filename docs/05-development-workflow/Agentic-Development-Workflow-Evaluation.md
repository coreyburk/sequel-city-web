# Agentic Development Workflow Evaluation

## Purpose

This document evaluates whether Sequel Detective should add an agentic development orchestration layer around the existing work-package process.

The evaluation is development-only. It does not authorize runtime AI, runtime LLM calls, cloud services, external APIs, MCP services, or autonomous behavior inside the student-facing application.

## Current Process Assessment

The project is already agent-assisted and partly agentic:

- work packages define objective, scope, impact analysis, allowed files, constraints, acceptance criteria, implementation prompt, audit prompt, results, and final decision
- Codex or Claude can implement scoped work
- Gemini or AntiGravity can audit scoped work
- Understand-assisted planning can identify affected layers and regression surfaces
- final human acceptance remains explicit
- finalization is guarded by the accepted-work-package commit helper

The process is not yet a fully agentic development loop. The weak points are the handoffs between steps:

- rough idea to scoped work package
- impact analysis to test selection
- failed audit to corrective work package
- accepted work to handoff refresh
- repeated planning patterns to reusable skills

Those gaps are better targets than autonomous coding.

## Target Workflow

The first agentic workflow target should be:

```text
idea/intake
-> work package draft
-> impact analysis
-> test recommendation
-> implementation prompt
-> audit prompt
-> corrective work package if needed
```

The workflow should produce planning and review artifacts. It should not accept work, push code, run destructive actions, or change source-of-truth documents without explicit human approval and a scoped work package.

## Human-Owned Gates

These decisions must remain human-owned:

- product direction and sprint priority
- instructional value and classroom suitability
- SSOT changes
- final work-package acceptance
- destructive database or filesystem actions
- dependency adoption
- runtime AI authorization
- release or pilot readiness decisions

Agents may recommend. They may not approve their own recommendations.

## Forbidden Agent Actions

Development-time agents must not:

- add runtime AI to Sequel Detective
- silently update SSOT
- accept their own work
- commit or push without accepted-WP finalization rules
- run destructive database operations without explicit gating
- broaden a work package after implementation begins without opening a follow-up
- treat graph summaries, generated output, or external tool advice as more authoritative than source, tests, SSOT, and observed behavior
- install new dependencies as part of evaluation-only work

## Existing Process Assets

| Asset | Current Role | Agentic Opportunity |
|---|---|---|
| `docs/05-development-workflow/Work-Package-Lifecycle.md` | Defines package structure, scope control, impact analysis, failures, and corrective packages | Keep as authority; use it as the schema for generated planning artifacts |
| `.codex/skills/sequel-city-wp-planning/` | Creates scoped WPs with Understand-assisted impact analysis | Extend later with stronger test-selection and risk-classification prompts |
| `.codex/skills/sequel-city-wp-finalize/` | Finalizes accepted WPs using the commit helper | Keep separate; do not let planning or orchestration agents bypass it |
| `docs/05-development-workflow/Understand-Codebase-Analysis.md` | Defines graph use and freshness rules | Use as advisory context for affected files and tests |
| `scripts/new-lite-work-package.ps1` | Generates standard WP files | Keep as the canonical WP creation mechanism |
| `scripts/run-work-package.ps1` | Runs implementation/audit prompts through supported agents | Keep as deterministic execution surface |
| `scripts/commit-work-package.ps1` | Enforces accepted-WP commit format | Keep as the commit gate |
| `docs/00-ssot/END-OF-DAY-HANDOFF.md` | Live resume state | Candidate for a future handoff-refresh skill |

## Options

### Option 1: OpenAI Agents SDK Orchestration

OpenAI Agents SDK is a good candidate when the project needs a real orchestrator that can manage agents, tools, handoffs, guardrails, sessions, and traces across a multi-step workflow.

Strengths:

- explicit agent and handoff model
- guardrails and structured outputs
- tracing and session support
- can wrap repository tools as development-time functions
- provides a path to sandboxed long-horizon development workflows

Costs:

- introduces Python tooling into a Node/TypeScript/PowerShell repository
- requires dependency, credential, and tracing policy decisions
- adds another orchestration layer around workflows that already work manually
- risks over-automation if adopted before the workflow shape is stable

Verdict:

- Worth evaluating as the eventual orchestration layer.
- Do not add it yet.
- First prove that the target workflow is valuable with a smaller repo-native POC.

### Option 2: Improve Codex Skills Directly

Direct skill improvement is the lowest-risk next step because this repo already uses repository-local Codex skills.

Strengths:

- fits the current process
- no new dependency stack
- easy to review in work packages
- keeps behavior close to existing docs and scripts
- can improve planning/audit immediately

Costs:

- less structured orchestration than a full SDK
- weaker tracing/session model
- harder to coordinate multi-agent workflows beyond prompt discipline

Verdict:

- Best first implementation path.
- Use it to validate the workflow before adding SDK orchestration.

### Option 3: No New Framework Yet

The project can continue with manual work packages, Codex/Claude implementation, Gemini/AntiGravity audit, and human final decision.

Strengths:

- no dependency or process risk
- preserves current discipline
- avoids premature abstraction

Costs:

- recurring manual effort remains
- audit failures and test-selection logic stay inconsistent
- process improvements depend on memory instead of reusable tools

Verdict:

- Acceptable fallback.
- Not the best path if the goal is to improve development throughput and consistency.

## Related Tool Candidates

These tools are useful context, but none should be added in this evaluation package.

| Candidate | Best Use | Current Decision |
|---|---|---|
| Ponytail | Minimalism and reuse discipline for coding agents | Study principles; do not install yet |
| ECC | Broad cross-harness operator/skill system | Use as reference architecture only |
| Firecrawl | Web research, source capture, monitoring | Consider later for research workflows; not needed for first POC |
| browser-use | AI-driven exploratory browser tasks | Use later for UX exploration; keep Playwright for deterministic tests |
| Daytona | Isolated agent sandboxes and parallel code execution | Defer until long-running or untrusted agent execution is needed |
| LangGraph | Explicit state-machine orchestration | Compare if SDK orchestration proves too broad or if state transitions become central |
| CrewAI | Role-based teams | Useful conceptually, but likely too loose for this repo's governance |
| AutoGen | Multi-agent code/research experiments | Study only if we need conversational agent teams |
| LlamaIndex | Retrieval and knowledge workflows | Consider if repo/document retrieval becomes a primary need |
| MCP servers | Tool boundary standardization | High-value pattern for future integration; evaluate per concrete tool |

## Recommended First Proof Of Concept

The first proof of concept should be an **audit-to-corrective-work-package generator**.

Why this target:

- It has a clear input: failed audit output, warnings, or unmet acceptance criteria.
- It has a clear output: a narrow corrective WP.
- It does not require autonomous coding.
- It reinforces the existing lifecycle instead of replacing it.
- It reduces a real friction point: turning review findings into scoped follow-up work.

The POC should be implemented as a Codex skill or documentation-backed workflow first, not as an OpenAI Agents SDK application.

## POC Inputs

The corrective-WP generator should accept:

- original work package path
- audit results or review findings
- current `git status`
- allowed files from the original package
- relevant SSOT references
- test/build failures, when present

## POC Outputs

The generator should produce a new work package with:

- reference to the original WP
- exact defect or omission
- narrow allowed-file set
- explicit out-of-scope boundaries
- impact analysis
- acceptance criteria
- implementation prompt
- audit prompt
- pending results and final decision

It should stop after creating the corrective WP.

## Success Criteria

The POC succeeds if it:

- produces a corrective WP that is narrower than the original failed work
- correctly preserves SSOT and runtime boundaries
- identifies related tests or explains why none apply
- separates defects from optional enhancements
- avoids claiming completion
- leaves acceptance to the human reviewer
- reduces manual planning effort without reducing review quality

## Failure Criteria

The POC fails if it:

- broadens scope beyond the audit finding
- rewrites the original WP instead of creating a corrective package
- treats audit output as automatically authoritative
- proposes app/runtime changes when documentation-only correction is sufficient
- omits relevant tests or affected files
- weakens human final decision or independent audit
- requires new dependencies before proving workflow value

## Dependency Posture

No dependency should be added for evaluation.

If a later package evaluates OpenAI Agents SDK implementation, it should:

- keep Python tooling in a dedicated development-only location
- avoid adding it to app runtime workspaces
- document API key and tracing behavior
- support offline/no-network fallback for planning-only work
- use structured outputs for generated work-package drafts
- preserve `scripts/new-lite-work-package.ps1` as the canonical WP creation mechanism unless explicitly replaced by an accepted workflow package
- include tests or fixtures for malformed audit input, missing sections, stale graph data, and out-of-scope findings

## Recommendation

Proceed in two stages:

1. Create a repository-local Codex skill for audit-to-corrective-WP generation.
2. After that skill proves useful, evaluate OpenAI Agents SDK as an orchestration layer for multi-step workflows that combine planning, test selection, audit interpretation, and handoff refresh.

Do not start by installing OpenAI Agents SDK. The workflow shape should be proven first.

## Recommended Next Work Package

Create the next available work package for an audit-to-corrective-work-package skill.

Scope it to:

- create a repo-local Codex skill
- read the lifecycle and corrective-WP rules
- parse an existing WP and audit result text
- generate the next corrective WP using `scripts/new-lite-work-package.ps1`
- stop before implementation, acceptance, commit, or push
- add focused validation with fixture WPs/audit snippets if practical

Keep app, database, package manifest, lockfile, and runtime behavior out of scope.
