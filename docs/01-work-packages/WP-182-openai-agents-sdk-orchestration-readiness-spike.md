# WP-182: OpenAI Agents SDK Orchestration Readiness Spike

## Objective

Define a development-only OpenAI Agents SDK orchestration readiness package for the existing Sequel Detective work-package lifecycle, without adding dependencies, runtime AI, or autonomous acceptance behavior.

## Scope

### In Scope

- Create a focused development workflow document that maps the existing work-package lifecycle to a future OpenAI Agents SDK orchestration model.
- Define the proposed agent roles, handoff/tool boundaries, lifecycle states, structured outputs, guardrails, tracing/data policy, and human-owned gates.
- Define a no-install readiness checklist for a later SDK proof of concept.
- Define fixture scenarios for the future proof of concept:
  - idea intake to WP draft
  - implemented WP to audit request
  - failed audit to corrective WP
  - accepted WP to closeout/handoff refresh
- Update contributor workflow guidance only enough to point to the readiness document.
- Refresh the live handoff during implementation closeout.

### Out of Scope

- Installing `openai-agents` or any other dependency.
- Adding Python package manifests, lockfiles, virtual environments, or SDK runner code.
- Calling OpenAI APIs, AntiGravity, Gemini, or other external services.
- Adding runtime AI, runtime LLM calls, MCP runtime requirements, cloud services, or external APIs to Sequel Detective.
- Replacing existing scripts, Codex skills, work-package lifecycle rules, AGY audit runner, closeout preflight, or commit helper.
- Letting agents accept their own work, commit without accepted-WP finalization, or bypass independent audit.
- Changing application runtime behavior, database behavior, Case 004 progression, package manifests, lockfiles, generated graph artifacts, or app tests.

## Impact Analysis

### Understand Status

- Graph available: Yes.
- Baseline commit: `418990872a72e034197857ff383f74dfa575a90f`.
- Freshness assessment: Structurally stale for current workflow tooling. Current `HEAD` is `d881468e8cc29bf55928f3a2bd24c5fa5a1f8017`; later accepted work added repository-local skills, audit wrappers, status/validation/closeout helpers, database identity health work, and handoff workflow updates. The stale graph is not authoritative for this package.
- Analysis performed: Read development workflow SSOT, AI-agent runtime boundaries, work-package lifecycle, Understand guidance, agentic workflow evaluation, WP-170 corrective skill package, current repo-local skills, current workflow helper scripts, current Git state, and official OpenAI Agents SDK documentation for Agents, Runner, handoffs, configuration, and tracing.

### Affected Architecture

- Layers: Development Workflow Documentation; Repository Tooling Contracts; Agentic Development Governance.
- Primary files/components:
  - `docs/01-work-packages/WP-182-openai-agents-sdk-orchestration-readiness-spike.md`
  - `docs/05-development-workflow/OpenAI-Agents-SDK-Orchestration-Readiness.md`
  - `docs/05-development-workflow/Contributor-Workflow-Guide.md`
  - `docs/00-ssot/END-OF-DAY-HANDOFF.md`
- Upstream consumers:
  - human developer
  - Codex planning, implementation, corrective, audit, closeout, and finalization skills
  - future OpenAI Agents SDK proof-of-concept work package
  - AGY/Gemini independent audit workflows
- Downstream dependencies:
  - future decision whether to add `openai-agents` as a development-only dependency
  - future orchestration prototype that may wrap existing scripts as tools
  - future structured output schemas for work-package planning, audit routing, corrective planning, and closeout readiness

### Regression Surface

- Related tests:
  - documentation review against this WP
  - `git diff --check`
  - targeted `rg` checks for required boundaries:
    - runtime AI remains out of scope
    - no dependency installation is authorized
    - human final acceptance remains required
    - existing scripts remain canonical
- User workflows:
  - deciding whether and how to introduce OpenAI Agents SDK
  - planning work packages
  - converting audit findings into corrective WPs
  - auditing and closing out accepted WPs
  - refreshing handoff state before commit/push
- Security/data boundaries:
  - No runtime SQL, database, answer-key, spoiler, student-data, app-auth, credential, or Case 004 progression behavior changes.
  - Development-time SDK evaluation must treat repository prompt/diff context as data that may leave the local machine only with explicit user approval.
  - OpenAI tracing must be documented as opt-in or explicitly governed for any later proof of concept; sensitive prompt, diff, and audit data must not be exported accidentally.

### Graph Update Decision

- Regeneration required: No.
- Rationale: This package scopes development workflow documentation only. It does not change application architecture, imports, database structure, Case 004 progression, package dependencies, source code, or runtime behavior. The graph is stale for recent workflow tooling and should not be used as authoritative evidence here.

## Files Allowed to Change

Allowed:

- `docs/01-work-packages/WP-182-openai-agents-sdk-orchestration-readiness-spike.md`
- `docs/05-development-workflow/OpenAI-Agents-SDK-Orchestration-Readiness.md`
- `docs/05-development-workflow/Contributor-Workflow-Guide.md`
- `docs/00-ssot/END-OF-DAY-HANDOFF.md`

Do Not Modify:

- `apps/api/**`
- `apps/web/**`
- `database/**`
- `scripts/**`
- `.codex/skills/**`
- `.understand-anything/**`
- package manifests
- dependency lockfiles
- `outputs/**`
- historical work packages other than this active `WP-182`

## Constraints

- Keep this package development-only and documentation-only.
- Do not add dependencies, package manifests, lockfiles, virtual environments, or generated SDK artifacts.
- Do not run OpenAI API calls.
- Do not run AGY/Gemini as part of implementation; independent audit happens after implementation by the normal audit path.
- Do not imply that Sequel Detective runtime may use AI, LLMs, MCP, cloud services, or external APIs.
- Preserve the existing work-package lifecycle as authoritative.
- Preserve `scripts/new-lite-work-package.ps1`, `scripts/run-work-package.ps1`, `scripts/audit-work-package.ps1`, `scripts/check-work-package-closeout.ps1`, and `scripts/commit-work-package.ps1` as the canonical execution surfaces.
- Preserve human final acceptance, independent audit, and accepted-WP closeout requirements.
- Use official OpenAI Agents SDK documentation as a current reference, but do not treat SDK docs as authorization to change repo dependency or runtime policy.

## Required Behavior

The implementation must create `docs/05-development-workflow/OpenAI-Agents-SDK-Orchestration-Readiness.md` with:

- Purpose and explicit development-only boundary.
- Current workflow assets the SDK would wrap rather than replace.
- Proposed SDK role mapping:
  - intake/planning agent
  - implementation dispatcher
  - audit dispatcher
  - corrective planner
  - closeout coordinator
  - human acceptance gate
- Recommended orchestration pattern:
  - central manager agent with specialized agents exposed as tools or handoff targets
  - deterministic script wrappers as tools
  - structured output contracts for state transitions
  - no autonomous commit/push or final acceptance
- Tool contract inventory for existing scripts and skills.
- Guardrails:
  - no runtime AI
  - no dependency install without separate accepted WP
  - no external prompt/diff transmission without explicit authorization
  - no self-acceptance
  - no destructive actions
  - no SSOT edits without scoped WP approval
- Tracing and data policy for any future OpenAI Agents SDK run:
  - document API key assumptions
  - document tracing sensitivity
  - require explicit decision before enabling trace export with repository prompt/diff data
  - define offline/no-network fallback expectations
- Fixture scenarios for a later proof of concept.
- Readiness checklist and go/no-go criteria for a future SDK dependency work package.
- Decision statement: proceed to SDK prototype only after this readiness package is accepted and a separate WP authorizes dependency/tooling changes.

The implementation must update `docs/05-development-workflow/Contributor-Workflow-Guide.md` with a short pointer to the readiness document.

The implementation must refresh `docs/00-ssot/END-OF-DAY-HANDOFF.md` during accepted closeout.

## Acceptance Criteria

- [x] `OpenAI-Agents-SDK-Orchestration-Readiness.md` exists.
- [x] The readiness document clearly states development-only scope and runtime-AI prohibition.
- [x] The readiness document maps existing work-package lifecycle roles to future OpenAI Agents SDK concepts without replacing current scripts or skills.
- [x] The readiness document defines agent roles, handoff/tool boundaries, structured outputs, guardrails, tracing/data policy, fixture scenarios, readiness checklist, and go/no-go criteria.
- [x] The contributor guide links or points to the readiness document.
- [x] No dependency, package manifest, lockfile, script, skill, app, database, graph, output, or runtime behavior files change.
- [x] Code Results record validation evidence.
- [x] Audit Results and Final Decision remain pending until independent audit and human acceptance.

## Code Prompt

Implement `WP-182` exactly as specified.

Scope:

- Only modify files listed under `Files Allowed to Change`.
- Create `docs/05-development-workflow/OpenAI-Agents-SDK-Orchestration-Readiness.md`.
- Update `docs/05-development-workflow/Contributor-Workflow-Guide.md` with a concise pointer.
- Refresh `docs/00-ssot/END-OF-DAY-HANDOFF.md` for the current WP state during closeout.
- Update this WP with Code Results and validation evidence after implementation.

Reference inputs:

- `docs/00-ssot/SSOT-Development-Workflow.md`
- `docs/00-ssot/SSOT-AI-Agent-Boundaries.md`
- `docs/05-development-workflow/Work-Package-Lifecycle.md`
- `docs/05-development-workflow/Agentic-Development-Workflow-Evaluation.md`
- `docs/05-development-workflow/Contributor-Workflow-Guide.md`
- `.codex/skills/sequel-city-wp-planning/SKILL.md`
- `.codex/skills/sequel-city-wp-corrective/SKILL.md`
- `.codex/skills/sequel-city-audit-runner-contracts/SKILL.md`
- `.codex/skills/sequel-city-wp-closeout-handoff/SKILL.md`
- `.codex/skills/sequel-city-wp-finalize/SKILL.md`
- OpenAI Agents SDK documentation for Agents, Runner, handoffs, configuration, and tracing.

Required implementation:

1. Create the readiness document with the sections required above.
2. Treat the OpenAI Agents SDK as a development-time candidate only.
3. Prefer a central manager/orchestrator model for the first future SDK prototype unless the document records a specific reason to use peer handoffs instead.
4. Preserve all human-owned gates.
5. Preserve all existing repo scripts and skills as canonical workflow surfaces.
6. Do not authorize dependency installation in this package.
7. Record exact validation commands and results in Code Results.

Verification:

- `git diff --check`
- `rg -n "runtime AI|runtime-AI|No runtime|dependency|openai-agents|human final|self-accept|tracing|external" docs/05-development-workflow/OpenAI-Agents-SDK-Orchestration-Readiness.md docs/05-development-workflow/Contributor-Workflow-Guide.md docs/01-work-packages/WP-182-openai-agents-sdk-orchestration-readiness-spike.md`
- `powershell -ExecutionPolicy Bypass -File scripts/run-work-package.ps1 WP-182 -Execute None`
- `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-status.ps1 WP-182`
- `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-validation-plan.ps1 WP-182`

Return:

- files changed
- readiness conclusion
- validation performed
- unresolved limitations

## Audit Prompt

Audit `WP-182`.

Verify:

- The package stayed development-only and documentation-only.
- No dependency, package manifest, lockfile, script, skill, app, database, graph, output, or runtime behavior files changed.
- The readiness document does not authorize runtime AI, runtime LLM calls, MCP runtime requirements, cloud services, or external runtime APIs.
- The readiness document preserves existing scripts and skills as canonical workflow surfaces.
- Human final acceptance, independent audit, explicit external-data authorization, and accepted-WP finalization remain intact.
- The SDK mapping is consistent with official OpenAI Agents SDK concepts: agents, runner/orchestration, tools/handoffs, configuration, and tracing.
- Guardrails, structured outputs, fixture scenarios, readiness checklist, and go/no-go criteria are present.
- Impact analysis matches the actual changed files.
- Graph regeneration decision was followed.

Output:

- Verdict: PASS or FAIL
- Scope violations
- Runtime-AI or dependency boundary violations
- Missing human/audit gates
- Weak SDK mapping
- Missing readiness criteria
- Recommended corrections

## Code Results

Implemented.

Changed files:

- Added `docs/05-development-workflow/OpenAI-Agents-SDK-Orchestration-Readiness.md`.
- Updated `docs/05-development-workflow/Contributor-Workflow-Guide.md` with a pointer to the readiness document.
- Updated `docs/00-ssot/END-OF-DAY-HANDOFF.md` for the current WP-182 implementation state.
- Updated this work package with implementation results and acceptance evidence.

Readiness conclusion:

- OpenAI Agents SDK remains a development-time candidate only.
- Do not install `openai-agents` or add Python tooling in WP-182.
- A future SDK prototype should use a central manager/orchestrator over existing scripts and repo-local skills.
- Existing work-package lifecycle helpers remain the authoritative state and execution surfaces.
- Future SDK tooling must preserve explicit external-data authorization, independent audit, human final acceptance, accepted-WP closeout, and handoff refresh.
- Runtime AI, runtime LLM calls, MCP runtime requirements, cloud services, and external runtime APIs remain out of scope for Sequel Detective.

Validation performed:

- PASS: `git diff --check` after documentation updates, with CRLF warnings only.
- PASS: `rg -n "runtime AI|runtime-AI|No runtime|dependency|openai-agents|human final|self-accept|tracing|external" docs/05-development-workflow/OpenAI-Agents-SDK-Orchestration-Readiness.md docs/05-development-workflow/Contributor-Workflow-Guide.md docs/01-work-packages/WP-182-openai-agents-sdk-orchestration-readiness-spike.md`
- PASS: `powershell -ExecutionPolicy Bypass -File scripts/run-work-package.ps1 WP-182 -Execute None`
- PASS: `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-status.ps1 WP-182`
- PASS: `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-validation-plan.ps1 WP-182`

Unresolved limitations:

- No SDK dependency or executable prototype was added because WP-182 is readiness documentation only.
- No external audit was run during implementation; audit remains pending under the normal AGY audit path.

## Audit Results

# Audit Report: WP-182

**Target Work Package:** [WP-182-openai-agents-sdk-orchestration-readiness-spike.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-182-openai-agents-sdk-orchestration-readiness-spike.md)  
**Target Readiness Document:** [OpenAI-Agents-SDK-Orchestration-Readiness.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/05-development-workflow/OpenAI-Agents-SDK-Orchestration-Readiness.md)

---

### Audit Summary

| Check / Requirement | Status | Verification Detail |
| :--- | :---: | :--- |
| **Development-Only & Documentation-Only Scope** | **PASS** | Only 4 documentation files were changed (`WP-182`, `OpenAI-Agents-SDK-Orchestration-Readiness.md`, `Contributor-Workflow-Guide.md`, `END-OF-DAY-HANDOFF.md`). No application or infrastructure code was modified. |
| **No Unintended Changes** | **PASS** | `get-work-package-status.ps1 WP-182` reports zero out-of-scope dirty files. No dependency, package manifest (`package.json`), lockfile (`package-lock.json`), script, skill, app code, database file, graph artifact, output, or runtime behavior changed. |
| **Runtime AI / LLM / Cloud Prohibition** | **PASS** | Document explicitly prohibits adding runtime AI, LLM calls, MCP runtime requirements, cloud services, or external APIs to student-facing Sequel Detective application runtime. |
| **Canonical Script & Skill Preservation** | **PASS** | Existing workflow scripts (`new-lite-work-package.ps1`, `run-work-package.ps1`, `audit-work-package.ps1`, `check-work-package-closeout.ps1`, `commit-work-package.ps1`, `get-work-package-status.ps1`, `get-work-package-validation-plan.ps1`) and skills are defined as canonical execution surfaces that any future SDK layer must wrap, not replace. |
| **Human & Independent Audit Gates** | **PASS** | Human final acceptance remains non-delegable. Self-audit is prohibited from posing as independent audit. Explicit user authorization is strictly required prior to external data transmission or external audit invocation. |
| **OpenAI Agents SDK Mapping Quality** | **PASS** | Core SDK concepts (Agents, Orchestration/Runner, Tools/Handoffs, Configuration, Tracing) are mapped clearly to existing repository workflows using a central manager agent pattern. |
| **Required Sections & Quality Controls** | **PASS** | 9 explicit guardrails, 4 structured output JSON contracts, 4 fixture scenarios (Intake, Implemented WP, Failed Audit, Accepted WP), readiness checklist, and Go/No-Go criteria are present. |
| **Impact Analysis Alignment** | **PASS** | Allowed files list in `WP-182` exactly matches actual dirty files in Git state (`git status -s`). |
| **Graph Regeneration Decision** | **PASS** | `Regeneration required: No` decision followed correctly. No `.understand-anything` graph artifacts were touched. |

---

### Audit Output

- **Verdict:** PASS
- **Scope violations:** None
- **Runtime-AI or dependency boundary violations:** None
- **Missing human/audit gates:** None
- **Weak SDK mapping:** None
- **Missing readiness criteria:** None
- **Recommended corrections:** None. The readiness spike meets all architectural, governance, and verification requirements.

---

### Verification Commands Run

1. `git diff --check` ΓÇö Passed cleanly (CRLF warnings only).
2. `rg -n "runtime AI|runtime-AI|No runtime|dependency|openai-agents|human final|self-accept|tracing|external" docs/05-development-workflow/OpenAI-Agents-SDK-Orchestration-Readiness.md docs/05-development-workflow/Contributor-Workflow-Guide.md docs/01-work-packages/WP-182-openai-agents-sdk-orchestration-readiness-spike.md` ΓÇö All required guardrail terms verified present in all three files.
3. `powershell -ExecutionPolicy Bypass -File scripts/run-work-package.ps1 WP-182 -Execute None` ΓÇö Execution preview generated cleanly.
4. `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-status.ps1 WP-182` ΓÇö Reported `State: ImplementedNeedsAudit` with 0 out-of-scope dirty files.
5. `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-validation-plan.ps1 WP-182` ΓÇö Reported `State: ValidationEvidenceRecorded`.
6. `powershell -ExecutionPolicy Bypass -File scripts/check-work-package-closeout.ps1 WP-182` ΓÇö Reported `Closeout state: ReadyForAudit`.

## Final Decision

Accepted.

Reason:

- Independent AGY audit recorded a PASS verdict with no scope violations, runtime-AI or dependency boundary violations, missing human/audit gates, weak SDK mapping, missing readiness criteria, or recommended corrections.
- WP-182 remained development-only and documentation-only.
- No dependency, package manifest, lockfile, script, skill, app, database, graph, output, or runtime behavior files changed.
- Existing work-package lifecycle, external-data authorization, independent audit, human final acceptance, accepted-WP closeout, and handoff refresh boundaries remain intact.

Closeout note:

- Before this final decision was recorded, `scripts/check-work-package-closeout.ps1 WP-182` did not detect the AGY audit PASS because the audit used `**Verdict:** PASS` formatting. The actual audit text is an independent PASS. Script-format tolerance should be handled in a separate corrective WP because WP-182 does not allow script changes.

