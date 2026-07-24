# WP-196: SDK Manager Recommendation Contract Command

## Objective

Create the first dependency-free implementation slice of the future OpenAI Agents SDK manager contract: a read-only command that consumes existing decision-router JSON and emits the documented SDK manager recommendation shape without live SDK execution, network calls, runtime AI, or new dependencies.

## Scope

### In Scope

- Add a narrow PowerShell command that wraps the existing agentic workflow decision router and translates its JSON output into the `sdk_manager_recommendation` contract documented in `OpenAI-Agents-SDK-Orchestration-Readiness.md`.
- The command must call or consume `scripts/get-agentic-workflow-decision.ps1 -Json` output and produce a stable manager-facing JSON shape.
- The command may expose a text mode for humans, but JSON mode must be the canonical contract.
- Add focused tests for the wrapper contract, including no-work-package, blocked, implementation, audit, final-decision, finalization, and manual-review scenarios.
- Add a short documentation pointer in the readiness document only if needed to make the command discoverable.

### Out of Scope

- Installing, importing, or upgrading OpenAI Agents SDK.
- Adding Python, Node, PowerShell module, package manifest, lockfile, or dependency changes.
- Live SDK/model calls.
- Network calls.
- Runtime app AI.
- External data transmission.
- Browser automation.
- AntiGravity/Gemini audit execution from the new command.
- Handoff refresh, commit, push, implementation dispatch, audit dispatch, graph refresh, dependency installation, or acceptance decisions from the new command.
- App runtime, database, schema, migration, Case 004 progression, UI, route, or API changes.
- Changing the existing decision-router routing semantics except where a narrow bug is required to satisfy the wrapper tests.

## Impact Analysis

### Understand Status

- Graph available: Yes. `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, and `.understand-anything/meta.json` are present.
- Baseline commit: `4b26996fe50a90779c46f92aeddd4111808544c3`.
- Freshness assessment: Structurally stale for this workflow-tooling surface. Accepted changes since the baseline include repo-local skills, workflow scripts, workflow tests, graph refresh wrappers, agentic status/decision-router commands, decision-router contract hardening, the SDK manager transition checklist, and handoff updates.
- Analysis performed: Used the graph baseline only as stale orientation. Verified the active surface directly with source inspection of `scripts/get-agentic-workflow-decision.ps1`, `scripts/get-agentic-workflow-status.ps1`, `scripts/tests/test-agentic-workflow-decision.ps1`, and `docs/05-development-workflow/OpenAI-Agents-SDK-Orchestration-Readiness.md`.

### Affected Architecture

- Layers: development workflow tooling, agentic workflow command contracts, workflow documentation.
- Primary files/components:
  - `scripts/get-sdk-manager-recommendation.ps1` (new)
  - `scripts/tests/test-sdk-manager-recommendation.ps1` (new)
  - `docs/05-development-workflow/OpenAI-Agents-SDK-Orchestration-Readiness.md`
  - `docs/01-work-packages/WP-196-sdk-manager-recommendation-contract-command.md`
- Upstream consumers:
  - Human contributors preparing future SDK manager implementation work.
  - A future OpenAI Agents SDK manager prototype.
  - Audit agents validating agentic workflow boundaries.
- Downstream dependencies:
  - `scripts/get-agentic-workflow-decision.ps1 -Json`
  - `scripts/get-agentic-workflow-status.ps1 -Json`
  - Existing lifecycle, validation-plan, closeout, and Understand-readiness helpers consumed by the status bundle.

### Regression Surface

- Related tests:
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-recommendation.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-decision.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-sdk-manager-recommendation.ps1 -WorkPackage WP-196 -Json -SkipUnderstandReadiness`
  - `git diff --check`
  - `git status --short --untracked-files=all`
- User workflows:
  - Previewing the future SDK manager recommendation contract from deterministic repo state.
  - Keeping the decision router advisory and dry-run only.
  - Preparing a later SDK manager implementation WP without adding dependencies yet.
- Security/data boundaries:
  - No runtime AI.
  - No live SDK or model calls.
  - No external data transmission.
  - No dependency installation.
  - No database, restricted-table, answer-key, student-data, or spoiler-boundary changes.

### Graph Update Decision

- Regeneration required: No for this package.
- Rationale: The graph is structurally stale for workflow tooling, but this is a narrow script/test contract wrapper over current source-inspected commands. It must not modify graph artifacts. A separate graph refresh can update baseline context, but it is not required to implement or audit this specific wrapper.

## Files Allowed to Change

Allowed:

- docs/01-work-packages/WP-196-sdk-manager-recommendation-contract-command.md
- docs/05-development-workflow/OpenAI-Agents-SDK-Orchestration-Readiness.md
- scripts/get-sdk-manager-recommendation.ps1
- scripts/tests/test-sdk-manager-recommendation.ps1
- scripts/get-agentic-workflow-decision.ps1
- scripts/tests/test-agentic-workflow-decision.ps1
- docs/00-ssot/END-OF-DAY-HANDOFF.md

Do Not Modify:

- apps/**
- database/**
- docs/00-ssot/** except `docs/00-ssot/END-OF-DAY-HANDOFF.md`
- .understand-anything/**
- tools/openai-agents-prototype/**
- package.json
- package-lock.json
- pyproject.toml
- requirements*.txt
- pnpm-lock.yaml
- yarn.lock

## Constraints

- Keep the new command dependency-free and PowerShell-only.
- Do not install or invoke OpenAI Agents SDK.
- Do not add runtime AI, model calls, MCP calls, browser automation, or network behavior.
- The wrapper must remain read-only and non-executing.
- The wrapper may recommend actions but must not run implementation, audit, acceptance, handoff refresh, commit, push, graph refresh, or dependency commands.
- Preserve the current decision-router public contract unless a narrow compatibility fix is required and tested.
- Public and future SDK-manager flows must use real status/decision reads; test-only status-snapshot injection must remain guarded and must not become a contributor-facing input.
- Do not refresh the Understand graph.

## Required Behavior

- Add `scripts/get-sdk-manager-recommendation.ps1`.
- The command must accept:
  - `-WorkPackage <wp>` / positional WP identifier.
  - `-Json`.
  - `-SkipUnderstandReadiness`.
- The command may accept test-only fixture input only behind an explicit guard, mirroring the existing decision-router test-snapshot guard.
- In normal use, the command must call `scripts/get-agentic-workflow-decision.ps1 -WorkPackage <wp> -Json`, passing `-SkipUnderstandReadiness` when requested.
- The JSON output must include:
  - `kind = "sdk_manager_recommendation"`
  - `generatedAt`
  - `workPackage`
  - `statusState`
  - `recommendedAction`
  - `commandPreview`
  - `requiresHumanAuthorization`
  - `requiresExternalAuthorization`
  - `forbiddenToExecute = true`
  - `blockers`
  - `evidence`
  - enough source decision/status metadata for audit without exposing new secrets or external data.
- Map existing decision-router actions into the documented manager action vocabulary:
  - `ProvideWorkPackage` -> `plan`
  - `ImplementWorkPackage` -> `implement`
  - `RequestIndependentAudit` -> `audit`
  - `RequestHumanFinalDecision` -> `request_human_decision`
  - `FinalizeAcceptedWorkPackage` -> `finalize`
  - `ResolveBlockers` -> `resolve_blockers`
  - `NoActionClosed` -> `no_action`
  - `ManualReview` or unknown actions -> `resolve_blockers` or `manual_review`, whichever the implementation documents and tests.
- `commandPreview` must remain display-only text; the wrapper must not invoke the previewed command.
- `requiresHumanAuthorization` must be true for any recommendation that could lead to implementation, audit, acceptance, finalization, handoff refresh, commit, push, external calls, graph refresh, or dependency changes.
- `requiresExternalAuthorization` must be true when the recommendation is audit/external-audit related.
- `forbiddenToExecute` must always be true.
- Text output, if provided, must clearly report that the command is a dry-run recommendation and executed nothing.

## Acceptance Criteria

- [x] `scripts/get-sdk-manager-recommendation.ps1` exists and returns the documented `sdk_manager_recommendation` JSON shape.
- [x] The command consumes existing decision-router JSON rather than duplicating lifecycle/status routing logic.
- [x] Normal command usage does not expose unguarded test-snapshot injection.
- [x] `forbiddenToExecute` is always true.
- [x] Implementation, audit, acceptance, finalization, handoff refresh, commit, push, graph refresh, dependency, SDK, model, network, and external-data actions are never executed by the new command.
- [x] Focused tests cover action mapping, blockers, authorization flags, command-preview preservation, and fixture guard behavior.
- [x] Existing decision-router tests still pass.
- [x] No app, database, graph, package, lockfile, prototype source, runtime AI, or dependency files are changed.
- [x] Validation evidence confirms in-scope files only.

## Code Prompt

Implement WP-196 exactly as scoped.

Primary task:

- Add `scripts/get-sdk-manager-recommendation.ps1` as a read-only dependency-free wrapper over `scripts/get-agentic-workflow-decision.ps1 -Json`.
- Add focused tests in `scripts/tests/test-sdk-manager-recommendation.ps1`.

Implementation requirements:

- Use existing PowerShell patterns from `scripts/get-agentic-workflow-decision.ps1` and `scripts/tests/test-agentic-workflow-decision.ps1`.
- Do not duplicate lifecycle/status routing logic when the existing decision router already supplies it.
- Produce the manager recommendation JSON shape documented in this WP and `OpenAI-Agents-SDK-Orchestration-Readiness.md`.
- Keep `forbiddenToExecute` true for every output.
- Treat command previews as inert display text.
- Preserve explicit human authorization gates and external-audit authorization flags.
- Keep fixture/status-snapshot input test-only and guarded if test injection is needed.
- Update `OpenAI-Agents-SDK-Orchestration-Readiness.md` only if a short command pointer is needed.

Validation to run and record in Code Results:

- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-recommendation.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-decision.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-sdk-manager-recommendation.ps1 -WorkPackage WP-196 -Json -SkipUnderstandReadiness`
- `git diff --check`
- `git status --short --untracked-files=all`

Record:

- Exact files changed.
- The action mapping implemented.
- Validation results.
- Confirmation that no SDK dependency, runtime AI, network behavior, app code, database files, package files, lockfiles, prototype source, or graph artifacts changed.

## Audit Prompt

Audit WP-196 against the work package, source diff, documentation, and validation evidence.

Verify:

- The new command consumes existing decision-router JSON rather than reimplementing lifecycle/status routing.
- The output matches the documented `sdk_manager_recommendation` shape.
- Action mapping is correct and tested.
- `forbiddenToExecute` is always true.
- Command previews remain inert and are never invoked.
- Human authorization and external-audit authorization flags are preserved.
- Fixture/status-snapshot injection, if present, is guarded and not part of normal public usage.
- No SDK dependency, runtime AI, model call, network call, MCP call, browser automation, dependency installation, graph refresh, app change, database change, package change, lockfile change, or prototype-source change was introduced.
- No files outside the allowed list changed.
- Existing decision-router behavior remains compatible.
- Impact analysis matches the actual changed files.
- Graph regeneration decision was followed.

Output:

- Verdict: PASS or FAIL
- Violations
- Regressions
- Drift risks
- Required corrections

## Code Results

Implemented WP-196.

Files changed:

- `scripts/get-sdk-manager-recommendation.ps1`
- `scripts/tests/test-sdk-manager-recommendation.ps1`
- `scripts/tests/test-agentic-workflow-decision.ps1`
- `docs/05-development-workflow/OpenAI-Agents-SDK-Orchestration-Readiness.md`
- `docs/01-work-packages/WP-196-sdk-manager-recommendation-contract-command.md`

Implementation summary:

- Added `scripts/get-sdk-manager-recommendation.ps1` as a read-only, dependency-free wrapper over `scripts/get-agentic-workflow-decision.ps1 -Json`.
- Added the manager-facing `sdk_manager_recommendation` JSON contract with:
  - `kind`
  - `generatedAt`
  - `workPackage`
  - `statusState`
  - `recommendedAction`
  - `commandPreview`
  - `requiresHumanAuthorization`
  - `requiresExternalAuthorization`
  - `forbiddenToExecute`
  - `blockers`
  - `evidence`
  - `source`
- Added guarded test-only decision snapshot input using `-AllowTestDecisionSnapshot`; unguarded snapshot input returns a blocker and does not preserve workflow command previews.
- Added `scripts/tests/test-sdk-manager-recommendation.ps1` covering no-work-package, implementation, audit, human-decision, finalization, blocked, no-action, manual-review, unknown-action, command-preview, authorization flag, and fixture guard behavior.
- Updated the existing decision-router fixture WP scope in `scripts/tests/test-agentic-workflow-decision.ps1` so the test remains valid while WP-196 has an allowed workflow-doc edit in the working tree.
- Added a short readiness-document pointer to the manager-facing recommendation wrapper and documented `manual_review` in the recommendation vocabulary.

Action mapping implemented:

- `ProvideWorkPackage` -> `plan`
- `ImplementWorkPackage` -> `implement`
- `RequestIndependentAudit` -> `audit`
- `RequestHumanFinalDecision` -> `request_human_decision`
- `FinalizeAcceptedWorkPackage` -> `finalize`
- `ResolveBlockers` -> `resolve_blockers`
- `NoActionClosed` -> `no_action`
- `ManualReview` -> `manual_review`
- unknown decision-router actions -> `manual_review`

Validation:

- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-recommendation.ps1`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-decision.ps1`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-sdk-manager-recommendation.ps1 -WorkPackage WP-196 -Json -SkipUnderstandReadiness`
- PASS: `git diff --check` with CRLF warnings only.
- PASS: `git status --short --untracked-files=all` showed only WP-196 allowed files.

Scope confirmation:

- No OpenAI Agents SDK dependency was installed or invoked.
- No runtime AI, model call, network behavior, MCP call, browser automation, app code, database file, package file, lockfile, prototype source, graph artifact, handoff refresh, commit, push, audit dispatch, implementation dispatch, graph refresh, external-data transmission, or dependency change was introduced.

## Audit Results

### Verdict
**PASS**

---

### Verification Summary

| Criteria | Result | Evidence / Details |
|---|---|---|
| **Consumes decision-router JSON** | **PASS** | [get-sdk-manager-recommendation.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/get-sdk-manager-recommendation.ps1#L23-L69) delegates via `Invoke-DecisionRouter` to `scripts/get-agentic-workflow-decision.ps1 -Json`. No lifecycle/status routing logic was duplicated. |
| **Documented `sdk_manager_recommendation` shape** | **PASS** | Returns canonical JSON containing `kind`, `generatedAt`, `workPackage`, `statusState`, `recommendedAction`, `commandPreview`, `requiresHumanAuthorization`, `requiresExternalAuthorization`, `forbiddenToExecute`, `blockers`, `evidence`, and `source`. Matches [OpenAI-Agents-SDK-Orchestration-Readiness.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/05-development-workflow/OpenAI-Agents-SDK-Orchestration-Readiness.md#L304-L318). |
| **Action mapping correct and tested** | **PASS** | Maps decision actions to `plan`, `implement`, `audit`, `request_human_decision`, `finalize`, `resolve_blockers`, `no_action`, and `manual_review` in [get-sdk-manager-recommendation.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/get-sdk-manager-recommendation.ps1#L71-L85). Covered in [test-sdk-manager-recommendation.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/tests/test-sdk-manager-recommendation.ps1#L175-L212). |
| **`forbiddenToExecute` is always true** | **PASS** | Hardcoded to `$true` on the recommendation output object in [get-sdk-manager-recommendation.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/get-sdk-manager-recommendation.ps1#L270) and verified in all test assertions. |
| **Command previews remain inert** | **PASS** | Command strings are parsed into display metadata only. No `Invoke-Expression`, `&`, or process execution is performed on `commandPreview`. |
| **Authorization flags preserved** | **PASS** | `requiresHumanAuthorization` and `requiresExternalAuthorization` are passed through from decision recommendation fields and default safely to `$true`/`$false`. |
| **Guarded test snapshot injection** | **PASS** | Snapshot overrides require the explicit `-AllowTestDecisionSnapshot` flag ([get-sdk-manager-recommendation.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/get-sdk-manager-recommendation.ps1#L210-L214)). Unguarded snapshot usage returns a blocker and suppresses command previews. |
| **Zero unauthorized dependencies or calls** | **PASS** | No SDK dependencies, runtime AI, model calls, network calls, MCP calls, browser automation, package manifest, database, graph, app, or prototype-source changes were introduced. |
| **Allowed files boundary enforced** | **PASS** | Changes were confined strictly to the allowed list: `docs/01-work-packages/WP-196-sdk-manager-recommendation-contract-command.md`, `docs/05-development-workflow/OpenAI-Agents-SDK-Orchestration-Readiness.md`, `scripts/get-sdk-manager-recommendation.ps1`, `scripts/tests/test-sdk-manager-recommendation.ps1`, and `scripts/tests/test-agentic-workflow-decision.ps1`. |
| **Existing decision-router compatibility** | **PASS** | `scripts/tests/test-agentic-workflow-decision.ps1` ran cleanly with zero failures (`PASS agentic workflow decision-router fixture matrix checks`). |
| **Impact analysis alignment** | **PASS** | WP-196 impact analysis accurately reflects affected architecture, downstream scripts, and modified files. |
| **Graph regeneration decision followed** | **PASS** | WP-196 specified no graph regeneration. `.understand-anything/` artifacts remain untouched. |

---

### Violations
*None.*

### Regressions
*None.*

### Drift Risks
*None.*

### Required Corrections
*None.*
The audit report for WP-196 has been completed with a verdict of **PASS**. All background search tasks have finished.

## Final Decision

Accepted on 2026-07-24 after AntiGravity audit PASS and closeout preflight confirmation.

Closeout note:

- Expanded the allowed-file list only for `docs/00-ssot/END-OF-DAY-HANDOFF.md` because current project closeout rules require handoff refresh before accepted-WP commit and push.

