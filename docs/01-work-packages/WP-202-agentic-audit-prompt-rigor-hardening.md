# WP-202: Agentic Audit Prompt Rigor Hardening

## Objective

Strengthen the development-workflow audit prompt contract so future Sequel Detective work-package audits must include adversarial contract-shape checks, execution-safety proof, negative-path probing, and explicit failure thresholds before any audit can be treated as pass evidence.

## Scope

### In Scope

- Update the repo-local audit contract skill/reference so audit agents are instructed to actively try to falsify work-package compliance, not only confirm the happy path.
- Add required audit-prompt expectations for:
  - adversarial contract-shape checks against structured outputs, headings, required fields, result states, and command-preview boundaries
  - execution-safety proof that audited commands or prototypes do not execute forbidden actions without explicit authorization
  - negative-path probing for blocked, missing, malformed, stale, dirty-worktree, unauthorized, timeout, invalid-WP, and failed-audit states
  - explicit failure thresholds that force `FAIL` or `BLOCKED` when required evidence is absent
- Update workflow documentation that contributors and agents use when preparing or interpreting audit prompts.
- Add or adjust narrow tests only if implementation changes runner/testable prompt-generation behavior rather than documentation-only guidance.
- Add or adjust SDK prototype fixture tests only if the audit-dispatch fixture contract must encode the new negative-path or execution-safety requirements.

### Out of Scope

- Running an implementation, audit, closeout, handoff refresh, commit, push, or graph refresh as part of this planning package.
- Installing, importing, invoking, or documenting live use of OpenAI Agents SDK beyond existing development-only readiness language.
- Runtime AI behavior, model calls, MCP calls, browser automation, network calls, trace export, or external data transmission.
- App runtime, API, UI, route, database, schema, migration, Case 004 progression, student data, restricted-table, answer-key, or spoiler-boundary changes.
- Package manifests, lockfiles, Python dependency files, Node dependency files, generated outputs, presentation artifacts, or `.understand-anything/**` graph artifacts.
- Broad runner refactors, work-package lifecycle redesign, new audit agents, or replacing human final acceptance.

## Impact Analysis

### Understand Status

- Graph available: Yes. `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, and `.understand-anything/meta.json` are present.
- Baseline commit: `4b26996fe50a90779c46f92aeddd4111808544c3`.
- Freshness assessment: Structurally stale for this development-workflow and agentic tooling surface. Accepted work since the baseline has changed repo-local Codex skills, workflow lifecycle docs, audit runner scripts/tests, OpenAI Agents SDK prototype files, SDK manager recommendation/dry-run tooling, and commit-helper workflow rules through `873ae203caa526699aa17e5543ffa97f44d2c9c3`.
- Analysis performed: Used graph search only as stale orientation for relevant audit-surface nodes. Verified current scope directly with source reads and `rg` across `.codex/skills/sequel-city-audit-runner-contracts/**`, `docs/05-development-workflow/**`, `docs/00-ssot/SSOT-Development-Workflow.md`, `scripts/audit-work-package.ps1`, `scripts/run-work-package.ps1`, `scripts/tests/test-audit-work-package-wrapper.ps1`, `scripts/tests/test-run-work-package-audit-runner.ps1`, `docs/05-development-workflow/OpenAI-Agents-SDK-Orchestration-Readiness.md`, and `tools/openai-agents-prototype/**`.

### Affected Architecture

- Layers: development workflow policy, repository-local Codex audit skill, audit runner contract documentation, optional PowerShell audit wrapper tests, optional development-only SDK prototype fixture contracts.
- Primary files/components:
  - `.codex/skills/sequel-city-audit-runner-contracts/SKILL.md`
  - `.codex/skills/sequel-city-audit-runner-contracts/references/audit-contract.md`
  - `docs/05-development-workflow/Codex-Gemini-Execution-Guide.md`
  - `docs/05-development-workflow/Work-Package-Lifecycle.md`
  - `docs/05-development-workflow/OpenAI-Agents-SDK-Orchestration-Readiness.md`
  - optional if implementation requires executable prompt/runner contract coverage: `scripts/audit-work-package.ps1`, `scripts/run-work-package.ps1`, `scripts/tests/test-audit-work-package-wrapper.ps1`, `scripts/tests/test-run-work-package-audit-runner.ps1`
  - optional if SDK audit-dispatch fixtures require hardening: `tools/openai-agents-prototype/src/sequel_agents_prototype/**`, `tools/openai-agents-prototype/tests/test_offline_manager.py`, `tools/openai-agents-prototype/tests/test_cli.py`
  - `docs/01-work-packages/WP-202-agentic-audit-prompt-rigor-hardening.md`
- Upstream consumers: human planners, Codex planning/implementation agents, Claude implementation agents, AntiGravity/Gemini audit agents, future SDK manager audit-dispatch surfaces, closeout/finalization reviewers.
- Downstream dependencies: work-package `Audit Prompt` sections, `scripts/audit-work-package.ps1`, `scripts/run-work-package.ps1`, audit result interpretation, corrective-WP creation, accepted-WP closeout and commit gates.

### Regression Surface

- Related tests:
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-audit-work-package-wrapper.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-run-work-package-audit-runner.ps1`
  - `python -m unittest discover -s tools/openai-agents-prototype/tests` if prototype contracts or tests change
  - targeted `rg` checks for the required audit rigor terms in the skill/reference/docs
  - `git diff --check`
  - `git status --short --untracked-files=all`
- User workflows: planning future WPs, preparing audit prompts, dispatching AGY/Gemini audits, interpreting blocked/self-audit results, routing failed audits into corrective WPs, and preserving human final acceptance.
- Security/data boundaries: development-only workflow. No runtime AI, app behavior, database mutation, dependency adoption, external audit invocation, external data sharing, trace export, destructive action, commit, push, or graph refresh is authorized by this package.

### Graph Update Decision

- Regeneration required: No for this package.
- Rationale: The existing graph is structurally stale for workflow tooling and must not be treated as authoritative. This package should rely on direct source inspection. The expected implementation is a narrow workflow-contract hardening change that should not modify app architecture, imports, database structure, Case 004 progression, or graph artifacts. A separate focused graph-refresh package remains appropriate before future graph-reliant planning over workflow tooling.

## Files Allowed to Change

Allowed:

- docs/01-work-packages/WP-202-agentic-audit-prompt-rigor-hardening.md
- .codex/skills/sequel-city-audit-runner-contracts/SKILL.md
- .codex/skills/sequel-city-audit-runner-contracts/references/audit-contract.md
- docs/00-ssot/END-OF-DAY-HANDOFF.md
- docs/05-development-workflow/Codex-Gemini-Execution-Guide.md
- docs/05-development-workflow/Work-Package-Lifecycle.md
- docs/05-development-workflow/OpenAI-Agents-SDK-Orchestration-Readiness.md
- scripts/audit-work-package.ps1
- scripts/run-work-package.ps1
- scripts/tests/test-audit-work-package-wrapper.ps1
- scripts/tests/test-run-work-package-audit-runner.ps1
- tools/openai-agents-prototype/src/sequel_agents_prototype/**
- tools/openai-agents-prototype/tests/test_offline_manager.py
- tools/openai-agents-prototype/tests/test_cli.py

Do Not Modify:

- apps/**
- database/**
- docs/00-ssot/** except `docs/00-ssot/END-OF-DAY-HANDOFF.md` during accepted closeout
- docs/01-work-packages/** except `docs/01-work-packages/WP-202-agentic-audit-prompt-rigor-hardening.md`
- .understand-anything/**
- scripts/get-agentic-workflow-status.ps1
- scripts/get-agentic-workflow-decision.ps1
- scripts/get-sdk-manager-recommendation.ps1
- scripts/get-sdk-manager-orchestration-dry-run.ps1
- scripts/get-work-package-status.ps1
- scripts/get-work-package-validation-plan.ps1
- scripts/check-work-package-closeout.ps1
- scripts/commit-work-package.ps1
- scripts/lib/**
- tools/openai-agents-prototype/pyproject.toml
- package.json
- package-lock.json
- pyproject.toml
- requirements*.txt
- pnpm-lock.yaml
- yarn.lock
- outputs/**

## Constraints

- Keep the hardening narrow and contract-focused.
- Prefer documentation/skill hardening unless executable tests are required to prevent regression in runner or fixture behavior.
- Do not add dependencies.
- Do not execute AntiGravity, Gemini, OpenAI Agents SDK, live model calls, network calls, trace export, browser automation, app startup, database scripts, commit, push, handoff refresh, or graph refresh.
- Preserve existing human authorization gates for external audit data sharing, implementation, final acceptance, commit, push, dependency adoption, destructive actions, and graph refresh.
- Preserve the rule that self-audit is non-independent and cannot be the sole review for script runner, database, security, dependency, runtime, or destructive-automation changes.
- Do not make audit prompts so broad that auditors perform full-repository review unrelated to the active WP. The adversarial checks must target the active WP contract and changed-file surface.
- Do not weaken current AGY/Gemini compatibility, blocked-audit recording, mixed-worktree isolation, or work-package section parsing.

## Required Behavior

- The audit contract requires auditors to perform adversarial contract-shape checks:
  - verify required WP sections, allowed/prohibited file boundaries, output headings, structured output fields, result-state labels, command previews, and evidence fields
  - treat malformed, missing, or prose-only substitutes for required machine-readable fields as failures when the WP requires structured output
- The audit contract requires execution-safety proof:
  - verify that audited dry-run, preview, recommendation, and prototype paths do not execute implementation, audit, acceptance, handoff refresh, commit, push, graph refresh, dependency install, live SDK/model, network, trace export, destructive filesystem, or database actions without explicit authorization
  - require concrete source or test evidence for non-execution claims
- The audit contract requires negative-path probing:
  - include unauthorized external audit, invalid WP identifier, missing/malformed prompt or result sections, dirty/mixed worktree, stale/unavailable Understand graph, timeout/tool failure, blocked audit, self-audit fallback, failed audit, and missing validation evidence paths when relevant to the active WP
  - require fixture or command-level evidence for negative paths when the implementation adds or changes executable workflow tooling
- The audit contract defines explicit failure thresholds:
  - `FAIL` when acceptance criteria, scope isolation, structured contract shape, execution-safety evidence, required negative-path coverage, or boundary preservation cannot be verified
  - `BLOCKED` when independent audit cannot run, required repository context is inaccessible, external authorization is absent, the worktree is mixed without approval, or environment/tooling limitations prevent a valid verdict
  - `SELF-AUDIT WARN/FAIL` when fallback evidence is useful but insufficient for the risk level
- Workflow docs and the repo-local audit skill describe these expectations consistently enough that future WPs can copy them into `Audit Prompt` sections.
- Any changed tests prove the new requirements without invoking production execution paths or external audit services.

## Acceptance Criteria

- [x] `.codex/skills/sequel-city-audit-runner-contracts/references/audit-contract.md` defines adversarial contract-shape checks, execution-safety proof, negative-path probing, and explicit failure thresholds.
- [x] `.codex/skills/sequel-city-audit-runner-contracts/SKILL.md` instructs agents to apply the hardened audit contract before recording or interpreting audit results.
- [x] `docs/05-development-workflow/Codex-Gemini-Execution-Guide.md` or `Work-Package-Lifecycle.md` explains the hardened audit-prompt expectations for future WPs.
- [x] `OpenAI-Agents-SDK-Orchestration-Readiness.md` is updated only if needed to keep SDK manager audit-dispatch expectations consistent with the hardened contract.
- [x] If executable workflow behavior or fixture contracts change, focused tests cover negative-path and execution-safety expectations without invoking external audit services or production workflow actions.
- [x] No runtime AI, live SDK/model call, network call, external data transmission, dependency, app, database, package, lockfile, generated output, graph artifact, commit, push, handoff refresh, or Case 004 progression change is introduced.
- [x] Validation evidence includes relevant tests or a documented no-automated-validation rationale if the change remains documentation/skill-only.
- [x] No unrelated files changed.

## Code Prompt

Implement WP-202 exactly as scoped.

Context:
- Future Sequel Detective audits need to be harder to pass accidentally. Audit prompts should actively probe contract shape, execution safety, negative paths, and failure thresholds instead of only confirming happy-path behavior.
- The work is development-workflow hardening only. It does not authorize runtime AI, external audit execution, dependency changes, graph refresh, app changes, database changes, or human acceptance automation.
- The Understand graph is structurally stale for this surface. Use direct source inspection as authoritative evidence.

Scope:
- Modify only the files listed under `Allowed`.
- Prefer hardening `.codex/skills/sequel-city-audit-runner-contracts/**` and workflow docs.
- Touch runner scripts or SDK prototype files only if needed to encode or test an executable contract requirement.

Required implementation:
- Add reusable audit-prompt requirements for adversarial contract-shape checks.
- Add reusable audit-prompt requirements for execution-safety proof.
- Add reusable audit-prompt requirements for negative-path probing.
- Add explicit `FAIL`, `BLOCKED`, and `SELF-AUDIT WARN/FAIL` thresholds.
- Keep the contract targeted to the active WP and changed-file surface.
- Preserve existing external-audit authorization, mixed-worktree isolation, self-audit labeling, and human final acceptance gates.

Validation:
- Run `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-audit-work-package-wrapper.ps1` if audit wrapper behavior or tests change.
- Run `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-run-work-package-audit-runner.ps1` if runner behavior or tests change.
- Run `python -m unittest discover -s tools/openai-agents-prototype/tests` if prototype files or tests change.
- Run targeted `rg` checks proving the required contract terms are present in the updated skill/reference/docs.
- Run `git diff --check`.
- Run `git status --short --untracked-files=all`.
- If the implementation remains documentation/skill-only and no automated behavior changes, record that no runner/prototype tests were necessary and why.

Return:
- Summary of changed audit contract requirements.
- Validation results or no-automated-validation rationale.
- Confirmation that no runtime AI, external audit invocation, dependencies, app files, database files, graph artifacts, package files, generated outputs, handoff refresh, commit, or push changed.

## Audit Prompt

Audit WP-202 against this work package and the actual repository diff.

Apply the hardened audit stance being introduced by this WP:

- Adversarial contract-shape checks:
  - Verify required audit-contract concepts are present and consistent across the skill/reference/docs.
  - Verify no required result state, heading, authorization field, scope boundary, or structured-output expectation was weakened or replaced with vague prose.
- Execution-safety proof:
  - Verify the change does not execute AntiGravity, Gemini, OpenAI Agents SDK, model calls, network calls, trace export, workflow actions, app startup, database actions, dependency installation, graph refresh, handoff refresh, commit, or push.
  - If any script or prototype code changed, inspect source and tests for proof that forbidden actions remain non-executing without explicit authorization.
- Negative-path probing:
  - Verify the new contract covers blocked audit, unauthorized external audit, invalid/malformed WP, missing validation, dirty/mixed worktree, stale/unavailable graph, timeout/tool failure, failed audit, and self-audit fallback paths where relevant.
  - If executable workflow code changed, require test or fixture evidence for representative negative paths.
- Failure thresholds:
  - Return `FAIL` if required contract-shape, execution-safety, negative-path, scope, validation, or boundary evidence is missing.
  - Return `BLOCKED` if an independent verdict cannot be formed because required repository context, authorization, tooling, or clean scope is unavailable.

Also verify:
- The stale Understand graph was not used as authoritative evidence.
- No files outside the allowed list were modified.
- No runtime AI, dependency, app, database, package, lockfile, generated output, graph artifact, external data transmission, or Case 004 progression change was introduced.
- Validation evidence in `Code Results` is appropriate for the actual changed files.

Output:
- Verdict: PASS, FAIL, or BLOCKED
- Violations
- Regressions
- Drift risks
- Required corrections

## Code Results

Implemented.

Changes:

- Updated `.codex/skills/sequel-city-audit-runner-contracts/SKILL.md` so audit handlers must apply hardened audit checks before recording or interpreting audit results.
- Expanded `.codex/skills/sequel-city-audit-runner-contracts/references/audit-contract.md` with reusable requirements for:
  - adversarial contract-shape checks
  - execution-safety proof
  - negative-path probing
  - explicit `PASS`, `FAIL`, `BLOCKED`, `SELF-AUDIT PASS`, `SELF-AUDIT WARN`, and `SELF-AUDIT FAIL` thresholds
- Updated `docs/05-development-workflow/Codex-Gemini-Execution-Guide.md` to require hardened audit prompts and to treat missing required evidence as audit failure rather than acceptance-time assumption.
- Updated `docs/05-development-workflow/Work-Package-Lifecycle.md` so audit review explicitly verifies contract shape, execution safety, negative paths, and failure thresholds.
- Updated `docs/05-development-workflow/OpenAI-Agents-SDK-Orchestration-Readiness.md` so future SDK manager audit-dispatch recommendations must use the hardened audit prompt requirements and prove audit-dispatch negative paths before live dispatch.
- Did not modify runner scripts, SDK prototype files, app files, database files, package manifests, lockfiles, graph artifacts, generated outputs, handoff, commit, or push behavior.

Validation:

- PASS: targeted `rg` check for `adversarial contract-shape`, `execution-safety proof`, `negative-path probing`, `failure thresholds`, `SELF-AUDIT WARN`, `command-preview`, `unauthorized external audit`, `invalid work-package`, and `dirty or mixed worktree` across `.codex/skills/sequel-city-audit-runner-contracts` and `docs/05-development-workflow`.
- PASS: `git diff --check` with CRLF warnings only.
- PASS: `git status --short --untracked-files=all` showed only WP-202 scoped files.

No automated runner or SDK prototype tests were run because this implementation changed documentation and repo-local skill guidance only. No executable workflow behavior, fixture contract code, runner code, or prototype code changed.

## Audit Results

# WP-202 Independent Audit Findings

An independent audit of [WP-202-agentic-audit-prompt-rigor-hardening.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-202-agentic-audit-prompt-rigor-hardening.md) against its work package specification and the actual repository diff in `D:\GitHub-Repos\SequelCityWeb` has been completed. Detailed audit notes are recorded in the [audit-wp-202-verification.md](file:///C:/Users/cburk/.gemini/antigravity-cli/brain/f056043e-37ff-45bd-a330-dd689468a9f3/audit-wp-202-verification.md) artifact.

---

### Audit Output

- **Verdict**: **PASS**
- **Violations**: None. All modified files are strictly within the `Allowed` list, and no prohibited files, runtime AI logic, app code, database files, dependencies, lockfiles, or graph artifacts were changed.
- **Regressions**: None. The changes harden audit documentation and repo-local skill guidance without introducing breaking changes or changing executable script runner logic.
- **Drift Risks**: Low. Future work package authors should ensure their `Audit Prompt` sections adopt the hardened audit prompt requirements.
- **Required Corrections**: None.

---

### Verification Summary

1. **Adversarial Contract-Shape Checks**:
   - Hardened expectations are consistently defined across [.codex/skills/sequel-city-audit-runner-contracts/SKILL.md](file:///D:/GitHub-Repos/SequelCityWeb/.codex/skills/sequel-city-audit-runner-contracts/SKILL.md), [.codex/skills/sequel-city-audit-runner-contracts/references/audit-contract.md](file:///D:/GitHub-Repos/SequelCityWeb/.codex/skills/sequel-city-audit-runner-contracts/references/audit-contract.md), [Codex-Gemini-Execution-Guide.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/05-development-workflow/Codex-Gemini-Execution-Guide.md), [Work-Package-Lifecycle.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/05-development-workflow/Work-Package-Lifecycle.md), and [OpenAI-Agents-SDK-Orchestration-Readiness.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/05-development-workflow/OpenAI-Agents-SDK-Orchestration-Readiness.md).
   - Structured output fields, result state labels, authorization flags, allowed/prohibited boundaries, and command preview markers were preserved and strengthened; replacing required machine-readable fields with vague prose is explicitly forbidden.

2. **Execution-Safety Proof**:
   - Verified via `git diff` that no execution of AntiGravity, Gemini, OpenAI Agents SDK, live model calls, network calls, trace export, workflow actions, app startup, database actions, dependency installation, graph refresh, handoff refresh, commit, or push was introduced.
   - No script or prototype files were modified in this WP.

3. **Negative-Path Probing**:
   - The contract explicitly enumerates and mandates coverage for 12 negative paths (unauthorized external audit, malformed/invalid WP, dirty/mixed worktree, stale graph, missing validation, timeout/tool failures, blocked audit, self-audit fallback, etc.).

4. **Failure Thresholds**:
   - Explicit thresholds (`PASS`, `FAIL`, `BLOCKED`, `SELF-AUDIT PASS/WARN/FAIL`) are defined and enforced. Missing evidence forces `FAIL`, while missing repository context or authorization forces `BLOCKED`.

5. **Repository & Boundary Controls**:
   - Stale Understand graph was ignored in favor of direct source inspection and git diffs.
   - `git diff --check` and `git status --short --untracked-files=all` confirmed clean formatting and scope boundaries.

## Final Decision

Accepted on 2026-07-25 after independent audit PASS and human acceptance. The package is accepted as a documentation/skill-only hardening change that strengthens future audit prompt rigor while preserving runtime, database, dependency, graph, and human-acceptance boundaries.

