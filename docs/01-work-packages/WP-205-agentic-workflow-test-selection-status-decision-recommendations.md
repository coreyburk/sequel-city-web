# WP-205: Agentic Workflow Test Selection And Status Decision Recommendations

## Objective

Improve the repo-native agentic workflow helpers so a planner, implementer, or future manager can see explicit test-selection guidance and lifecycle decision context from the existing read-only status commands before choosing implementation, audit, acceptance, or finalization.

## Scope

### In Scope

- Use the refreshed Understand graph and direct source inspection to make a narrow workflow-tooling improvement.
- Extend `scripts/get-work-package-validation-plan.ps1` to emit a stable, read-only test-selection recommendation shape derived from existing work-package impact analysis, prompts, and recorded validation evidence.
- Extend `scripts/get-agentic-workflow-status.ps1` only as needed to surface that recommendation from the validation-plan component without duplicating validation parsing logic.
- Extend `scripts/get-agentic-workflow-decision.ps1` only as needed to include validation/test-selection context in advisory recommendation output or blocker reasoning.
- Add focused regression tests for validation-plan recommendation states and decision/status propagation.
- Preserve all existing text and JSON fields unless explicitly adding backward-compatible fields.
- Keep all commands read-only and dry-run; no implementation, audit, acceptance, handoff refresh, commit, push, graph refresh, package install, SDK call, or external call may be triggered.

### Out of Scope

- Adopting, installing, configuring, or expanding OpenAI Agents SDK.
- Modifying `tools/openai-agents-prototype/**`, Python package files, dependency manifests, lockfiles, or runtime app code.
- Changing work-package lifecycle policy, audit contract wording, closeout/finalization behavior, commit helper behavior, or graph refresh wrappers.
- Changing app runtime, API, UI, route, database, schema, migration, Case 004 progression, student data, restricted-table, answer-key, or spoiler-boundary behavior.
- Changing AntiGravity/Gemini audit dispatch behavior or external-audit authorization requirements.
- Running implementation, audit, finalization, handoff refresh, commit, push, graph refresh, app startup, browser automation, live SDK/model calls, dependency installation, or destructive filesystem actions as part of the helper behavior.

## Impact Analysis

### Understand Status

- Graph available: Yes. `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, `.understand-anything/meta.json`, and `.understand-anything/intermediate/scan-result.json` are present.
- Baseline commit: `7186b432ad74156d817cdb552eb01dbe1581def6`.
- Freshness assessment: Current for this planning surface. Current `HEAD` is `5c66538`; the only accepted commit after the graph baseline is the WP-203 graph refresh package and handoff refresh, which established the refreshed graph and did not change workflow helper scripts.
- Analysis performed: Required-tier agentic workflow tooling planning. Used targeted graph search for `get-work-package-validation-plan.ps1`, `get-agentic-workflow-status.ps1`, `get-agentic-workflow-decision.ps1`, `get-sdk-manager-recommendation.ps1`, and related tests. Verified graph findings directly against source in `scripts/get-work-package-validation-plan.ps1`, `scripts/get-agentic-workflow-status.ps1`, `scripts/get-agentic-workflow-decision.ps1`, `scripts/tests/test-work-package-validation-plan.ps1`, `scripts/tests/test-agentic-workflow-status.ps1`, and `scripts/tests/test-agentic-workflow-decision.ps1`. Confirmed existing SDK readiness documentation says SDK adoption must remain separate and later.

### Affected Architecture

- Layers: development workflow tooling, work-package validation-plan inspection, agentic workflow status bundle, decision-router dry-run.
- Primary files/components:
  - `scripts/get-work-package-validation-plan.ps1`
  - `scripts/get-agentic-workflow-status.ps1`
  - `scripts/get-agentic-workflow-decision.ps1`
  - `scripts/tests/test-work-package-validation-plan.ps1`
  - `scripts/tests/test-agentic-workflow-status.ps1`
  - `scripts/tests/test-agentic-workflow-decision.ps1`
  - `docs/01-work-packages/WP-205-agentic-workflow-test-selection-status-decision-recommendations.md`
- Upstream consumers:
  - `scripts/check-work-package-closeout.ps1`
  - `scripts/get-sdk-manager-recommendation.ps1`
  - `scripts/get-sdk-manager-orchestration-dry-run.ps1`
  - future repo-native or SDK-based manager flows
  - contributors deciding the next WP lifecycle action
- Downstream dependencies:
  - `scripts/lib/WorkPackageResolver.ps1`
  - existing work-package section conventions
  - validation evidence and planned command parsing in `Code Prompt`, `Audit Prompt`, and `Code Results`

### Regression Surface

- Related tests:
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-work-package-validation-plan.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-status.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-decision.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-recommendation.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-orchestration-dry-run.ps1`
- User workflows:
  - planning a WP and checking validation readiness
  - deciding whether to implement, audit, request human decision, or finalize
  - future manager-facing dry-run recommendations
  - closeout preflight review of validation evidence
- Security/data boundaries:
  - development-only, read-only workflow helpers
  - no runtime AI
  - no live model calls
  - no external audit dispatch
  - no dependency installation
  - no app/database/package/lockfile changes
  - no graph baseline mutation
  - no commit, push, destructive action, or data export

### Graph Update Decision

- Regeneration required: No.
- Rationale: This package may change workflow helper scripts and tests, but not during planning. If implemented and accepted, graph regeneration can be considered after closeout only if the helper changes materially alter graph-relevant workflow tooling relationships. Do not regenerate graph artifacts inside this package unless a later accepted implementation scope explicitly authorizes it.

## Files Allowed to Change

Allowed:

- docs/01-work-packages/WP-205-agentic-workflow-test-selection-status-decision-recommendations.md
- scripts/get-work-package-validation-plan.ps1
- scripts/get-agentic-workflow-status.ps1
- scripts/get-agentic-workflow-decision.ps1
- scripts/tests/test-work-package-validation-plan.ps1
- scripts/tests/test-agentic-workflow-status.ps1
- scripts/tests/test-agentic-workflow-decision.ps1
- scripts/tests/test-sdk-manager-recommendation.ps1
- scripts/tests/test-sdk-manager-orchestration-dry-run.ps1

Do Not Modify:

- apps/**
- database/**
- docs/00-ssot/**
- docs/01-work-packages/** except `docs/01-work-packages/WP-205-agentic-workflow-test-selection-status-decision-recommendations.md`
- docs/05-development-workflow/**
- .codex/**
- .understand-anything/**
- tools/**
- scripts/lib/**
- scripts/run-work-package.ps1
- scripts/audit-work-package.ps1
- scripts/check-work-package-closeout.ps1
- scripts/commit-work-package.ps1
- scripts/get-work-package-status.ps1
- scripts/get-sdk-manager-recommendation.ps1
- scripts/get-sdk-manager-orchestration-dry-run.ps1
- scripts/check-understand-refresh-readiness.ps1
- scripts/refresh-understand-graph.ps1
- package.json
- package-lock.json
- pyproject.toml
- requirements*.txt
- pnpm-lock.yaml
- yarn.lock
- outputs/**

## Constraints

- Keep the package narrow and repo-native.
- Add no dependencies.
- Do not change SDK prototype code or SDK readiness policy.
- Preserve existing command parameters and existing JSON/text fields.
- Add only backward-compatible output fields.
- Keep helper behavior read-only and dry-run.
- Do not execute workflow actions; command previews must remain display strings only.
- Do not loosen human acceptance, external-audit authorization, mixed-worktree, validation, closeout, commit, or push gates.
- Do not modify graph artifacts, app files, database files, docs policy files, package files, lockfiles, dependencies, outputs, runtime AI behavior, external data behavior, or Case 004 progression.

## Required Behavior

- `get-work-package-validation-plan.ps1 -Json` must include an explicit recommendation object or equivalent stable fields that classify:
  - missing validation plan
  - planned validation ready
  - no automated validation explained
  - validation evidence recorded
- The recommendation must include enough machine-readable context for downstream status/decision helpers to distinguish:
  - tests/commands that should be run
  - evidence already recorded
  - missing findings that block audit readiness
  - no-automation explanation cases that require audit review rather than automatic pass
- `get-agentic-workflow-status.ps1 -Json` must preserve component state behavior and surface the validation-plan recommendation without reparsing the work package itself.
- `get-agentic-workflow-decision.ps1 -Json` must remain read-only and include validation/test-selection context in the recommendation when it affects the next action or blocker explanation.
- Text output may add concise recommendation lines, but must not remove existing lines used by contributors or tests.
- All new behavior must be covered by focused tests using temporary work-package fixtures.
- Negative-path coverage must include malformed or missing validation plan data and test-only snapshot guard behavior where relevant.

## Acceptance Criteria

- [x] `get-work-package-validation-plan.ps1 -Json` exposes stable test-selection/recommendation fields for missing, ready, no-automation, and evidence-recorded states.
- [x] `get-agentic-workflow-status.ps1 -Json` surfaces the validation-plan recommendation from the validation component without duplicating validation parsing logic.
- [x] `get-agentic-workflow-decision.ps1 -Json` remains dry-run/read-only and includes relevant validation/test-selection context or blockers in advisory output.
- [x] Existing text output remains usable and backward-compatible.
- [x] Tests cover missing validation plan, planned validation ready, no-automated-validation explanation, validation evidence recorded, decision propagation, and status propagation.
- [x] Tests prove no helper executes implementation, audit, acceptance, finalization, handoff refresh, commit, push, external calls, graph refresh, dependency installation, app startup, browser automation, live SDK/model calls, or destructive actions.
- [x] `scripts/tests/test-work-package-validation-plan.ps1` passes.
- [x] `scripts/tests/test-agentic-workflow-status.ps1` passes.
- [x] `scripts/tests/test-agentic-workflow-decision.ps1` passes.
- [x] `scripts/tests/test-sdk-manager-recommendation.ps1` passes.
- [x] `scripts/tests/test-sdk-manager-orchestration-dry-run.ps1` passes.
- [x] `git diff --check` passes or records only known line-ending warnings.
- [x] `git status --short --untracked-files=all` shows only allowed WP-205 files changed.
- [x] No app, database, docs policy, graph baseline, SDK prototype, package, lockfile, dependency, output, runtime AI, external data, commit/push, or Case 004 progression change is introduced.

## Code Prompt

Implement WP-205 exactly as scoped.

Context:
- WP-203 refreshed the Understand graph baseline so workflow-tooling planning can rely on current graph relationships again.
- The next high-ROI improvement is repo-native test-selection/status-decision rigor, not SDK dependency adoption.
- Existing helpers already report lifecycle state, validation-plan state, status bundles, and dry-run decisions. This package should enrich those outputs with explicit validation/test-selection recommendation context without executing any workflow actions.

Scope:
- Modify only the files listed under `Allowed`.
- Do not modify SDK prototype files, docs policy files, graph artifacts, app files, database files, package files, lockfiles, or dependency manifests.

Implementation guidance:
1. Update `scripts/get-work-package-validation-plan.ps1` with a stable recommendation object or equivalent fields in JSON output.
2. Keep existing state names and existing fields intact.
3. Surface recommendation details in text output only as additive lines.
4. Update `scripts/get-agentic-workflow-status.ps1` to pass through validation-plan recommendation data from the component output.
5. Update `scripts/get-agentic-workflow-decision.ps1` only as needed to include validation/test-selection context in advisory output or blocker details.
6. Add focused temporary-fixture tests for all validation recommendation states and for status/decision propagation.
7. Confirm all helpers remain read-only/dry-run and do not execute command previews or external actions.
8. Record implementation and validation evidence in `Code Results`.

Validation:
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-work-package-validation-plan.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-status.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-decision.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-recommendation.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-orchestration-dry-run.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-work-package-validation-plan.ps1 WP-205 -Json`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-agentic-workflow-status.ps1 -WorkPackage WP-205 -Json -SkipUnderstandReadiness`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-agentic-workflow-decision.ps1 -WorkPackage WP-205 -Json -SkipUnderstandReadiness`
- `git diff --check`
- `git status --short --untracked-files=all`

Return:
- Summary of output-shape additions.
- Validation results.
- Confirmation that helper behavior remains read-only/dry-run.
- Confirmation that no SDK dependency, runtime, graph baseline, app, database, package, lockfile, external data, or Case 004 progression changes were made.

## Audit Prompt

Audit WP-205 against this work package, the refreshed graph planning basis, and the actual repository diff.

Verify:
- The package uses the refreshed graph only as planning context and does not modify graph artifacts.
- Changes are limited to the allowed workflow helper/test files and the WP-205 record.
- Validation-plan recommendation fields are stable, machine-readable, and backward-compatible.
- Status and decision helpers consume/pass through validation recommendation context instead of duplicating parsing logic unnecessarily.
- Helpers remain read-only/dry-run and do not execute implementation, audit, acceptance, finalization, handoff refresh, commit, push, external calls, graph refresh, dependency installation, app startup, browser automation, live SDK/model calls, or destructive actions.
- Existing lifecycle, human acceptance, external-audit authorization, mixed-worktree, closeout, and commit gates are not weakened.
- Tests cover positive and negative validation-plan states plus status/decision propagation.
- No SDK dependency adoption, package/lockfile mutation, SDK prototype expansion, runtime AI behavior, external data behavior, app/database change, docs policy change, graph baseline mutation, output artifact change, or Case 004 progression change occurred.
- The audit applies the hardened audit stance from WP-202: adversarial contract-shape checks, execution-safety proof, negative-path probing, and explicit failure thresholds.

Output:
- Verdict: PASS, FAIL, or BLOCKED
- Violations
- Regressions
- Drift risks
- Required corrections

## Code Results

Implemented.

Changes:
- Added a stable `recommendation` object to `scripts/get-work-package-validation-plan.ps1` JSON output with `kind`, `action`, `summary`, `requiresAction`, `reviewRequired`, `blocksAuditReadiness`, `commandsToRun`, `evidenceToReview`, `missingFindings`, and `noAutomatedValidationExplained`.
- Added recommendation actions for `add_validation_plan`, `run_planned_validation`, `review_no_automation_explanation`, and `review_recorded_evidence` while preserving existing state names and existing JSON/text fields.
- Added additive text output lines for validation recommendation and audit-readiness blocking.
- Surfaced validation recommendation data in `scripts/get-agentic-workflow-status.ps1` from the validation-plan component output without reparsing the work package.
- Included validation/test-selection context in `scripts/get-agentic-workflow-decision.ps1` recommendations, including blocked/manual paths, while preserving dry-run behavior.
- Added focused regression assertions for validation recommendation states and status/decision propagation.

Validation:
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-work-package-validation-plan.ps1`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-status.ps1`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-decision.ps1`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-recommendation.ps1`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-orchestration-dry-run.ps1`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-work-package-validation-plan.ps1 WP-205 -Json`
  - Observed after recording validation evidence: `state=ValidationEvidenceRecorded`, `recommendation.kind=validation_plan_recommendation`, `recommendation.action=review_recorded_evidence`, `commandsToRun=10`, `evidenceToReview=10`.
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-agentic-workflow-status.ps1 -WorkPackage WP-205 -Json -SkipUnderstandReadiness`
  - Observed `overall.state=Ready`, `validationRecommendation.kind=validation_plan_recommendation`, `validationRecommendation.action=review_recorded_evidence`, matching the validation component recommendation action.
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-agentic-workflow-decision.ps1 -WorkPackage WP-205 -Json -SkipUnderstandReadiness`
  - Observed `dryRun=true`, `executed=false`, `recommendation.action=RequestIndependentAudit`, `recommendation.validationPlan.kind=validation_plan_recommendation`, `recommendation.validationPlan.action=review_recorded_evidence`.
- PASS with known line-ending warnings only: `git diff --check`
- PASS: `git status --short --untracked-files=all` showed only allowed WP-205 files changed.

Safety:
- The changed helpers remain read-only/dry-run and only emit recommendation data or command preview strings.
- No implementation, audit, acceptance, finalization, handoff refresh, commit, push, external call, graph refresh, dependency installation, app startup, browser automation, live SDK/model call, destructive action, SDK dependency adoption, SDK prototype expansion, app/database change, package/lockfile change, output artifact change, external data change, or Case 004 progression was introduced.

## Audit Results

Verdict: PASS

Auditor: AntiGravity

External audit data sharing: explicitly authorized by the human reviewer for WP-205.

Worktree isolation: verified before audit; dirty files were limited to WP-205 allowed files.

# Audit Report: WP-205

**Target Work Package:** [WP-205: Agentic Workflow Test Selection And Status Decision Recommendations](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-205-agentic-workflow-test-selection-status-decision-recommendations.md)  
**Repository Location:** `D:\GitHub-Repos\SequelCityWeb`  
**Audit Stance:** Hardened Audit Stance (WP-202) — Adversarial contract-shape checks, execution-safety proof, negative-path probing, and explicit failure thresholds.

---

## Verdict

**PASS**

---

## Verification Summary

1. **Graph Artifact Integrity & Planning Basis Context**
   - **Status:** Verified.
   - The refreshed Understand graph (`.understand-anything/*`) was referenced strictly as read-only planning context. No graph artifacts, metadata, or baseline fingerprints were modified or regenerated.

2. **File & Scope Boundary Strictness**
   - **Status:** Verified.
   - Changes are strictly confined to allowed files listed in the work package:
     - [WP-205 Record](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-205-agentic-workflow-test-selection-status-decision-recommendations.md)
     - [scripts/get-work-package-validation-plan.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/get-work-package-validation-plan.ps1)
     - [scripts/get-agentic-workflow-status.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/get-agentic-workflow-status.ps1)
     - [scripts/get-agentic-workflow-decision.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/get-agentic-workflow-decision.ps1)
     - [scripts/tests/test-work-package-validation-plan.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/tests/test-work-package-validation-plan.ps1)
     - [scripts/tests/test-agentic-workflow-status.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/tests/test-agentic-workflow-status.ps1)
     - [scripts/tests/test-agentic-workflow-decision.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/tests/test-agentic-workflow-decision.ps1)
   - Zero modifications occurred in `apps/`, `database/`, `tools/`, `docs/00-ssot/`, `package.json`, `package-lock.json`, `pyproject.toml`, or other core framework files.

3. **Contract Stability & Backward Compatibility**
   - **Status:** Verified.
   - `get-work-package-validation-plan.ps1 -Json` emits a machine-readable `recommendation` object containing:
     - `kind`: `'validation_plan_recommendation'`
     - `action`: `'add_validation_plan'` | `'run_planned_validation'` | `'review_no_automation_explanation'` | `'review_recorded_evidence'`
     - `summary`, `requiresAction`, `reviewRequired`, `blocksAuditReadiness`, `commandsToRun`, `evidenceToReview`, `missingFindings`, and `noAutomatedValidationExplained`.
   - All legacy fields (`state`, `nextAction`, `plannedVerificationCommands`, `relatedTests`, `validationEvidence`, `noAutomatedValidationExplained`, `missingFindings`) remain intact and unmodified. Text output additions are purely additive.

4. **Status & Decision Context Pass-Through**
   - **Status:** Verified.
   - `get-agentic-workflow-status.ps1` surfaces `validationRecommendation` directly from the validation component output without reparsing work-package markdown.
   - `get-agentic-workflow-decision.ps1` consumes the snapshot's validation recommendation via `Get-ValidationRecommendation` without reparsing markdown, embedding `-ValidationPlan` in the advisory recommendation payload.

5. **Execution Safety & Read-Only / Dry-Run Guarantee**
   - **Status:** Verified.
   - Source code analysis confirms all helpers maintain strict read-only / dry-run guarantees. Command previews remain display strings (`commandPreview`) and are never passed to execution evaluation (`Invoke-Expression`, `Start-Process`, `&`, etc.).
   - Helpers perform zero git operations (`commit`, `push`), file mutations outside tests, external API/SDK calls, app startups, dependency installations, or graph refreshes.

6. **Gate Integrity Protection**
   - **Status:** Verified.
   - Human acceptance gates (`requiresHumanDecision`), external audit authorization gates (`requiresExternalAuthorization`), mixed-worktree blockers, closeout preflights, and commit controls remain fully unweakened.

7. **Test Coverage & Empirical Verification**
   - **Status:** Verified.
   - All target unit and integration test suites pass cleanly:
     - `scripts/tests/test-work-package-validation-plan.ps1` — **PASS**
     - `scripts/tests/test-agentic-workflow-status.ps1` — **PASS**
     - `scripts/tests/test-agentic-workflow-decision.ps1` — **PASS**
     - `scripts/tests/test-sdk-manager-recommendation.ps1` — **PASS**
     - `scripts/tests/test-sdk-manager-orchestration-dry-run.ps1` — **PASS**
   - Negative paths tested: missing validation plan (`ValidationPlanMissing`), missing findings blocking audit readiness, unautomated test explanation cases (`NoAutomatedValidationExplained`), invalid/non-existent WPs (`WP-0000-does-not-exist`), and blocked mixed worktree snapshots.

8. **Zero Out-of-Scope Side Effects**
   - **Status:** Verified.
   - No SDK dependency adoption, lockfile/package changes, SDK prototype expansion, app/database changes, runtime AI changes, or Case 004 progression changes occurred.

---

## Findings

### Violations
*None.*

### Regressions
*None.*

### Drift Risks
*None.*

### Required Corrections
*None.*

## Final Decision

Accepted on 2026-07-26.

Human reviewer accepted WP-205 after implementation evidence and independent AntiGravity audit PASS. The package adds read-only validation/test-selection recommendation context to the agentic workflow helper outputs, preserves dry-run boundaries and human-owned gates, and introduces no app, database, graph baseline, SDK dependency, package/lockfile, runtime AI, external data, output artifact, or Case 004 progression changes.


