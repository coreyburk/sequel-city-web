# WP-197: SDK Manager Real-State Fixture Matrix

## Objective

Harden the dependency-free SDK manager recommendation wrapper by validating it against real decision-router states created through temporary work-package fixtures, without adding OpenAI Agents SDK execution, runtime AI, dependencies, network calls, or external data transmission.

## Scope

### In Scope

- Extend or add focused tests so `scripts/get-sdk-manager-recommendation.ps1` is exercised against real `scripts/get-agentic-workflow-decision.ps1 -Json` output produced from temporary work-package files.
- Cover the manager recommendation contract for planned, implemented-needs-audit, audited-needs-final-decision, accepted-ready-for-finalization, rejected/deferred closed, invalid-WP/blocker, no-WP, and manual-review states.
- Verify the wrapper preserves:
  - `kind = "sdk_manager_recommendation"`
  - mapped `recommendedAction`
  - `statusState`
  - inert `commandPreview`
  - `requiresHumanAuthorization`
  - `requiresExternalAuthorization`
  - `forbiddenToExecute = true`
  - blockers and evidence/source metadata
- Keep the existing decision-router status/closeout logic as the source of truth.
- Optionally refactor only the local test helper code needed to keep the fixture matrix readable and deterministic.

### Out of Scope

- Installing, importing, or upgrading OpenAI Agents SDK.
- Live SDK/model calls.
- Network calls.
- Runtime app AI.
- External data transmission.
- Browser automation.
- MCP calls.
- Runtime app, API, route, UI, database, schema, migration, or Case 004 progression changes.
- Package manifests, lockfiles, Python dependency files, Node dependency files, or PowerShell module dependency changes.
- Graph refresh or `.understand-anything/**` artifact changes.
- Changing manager or decision-router public behavior unless a narrow contract bug is found and fixed within the allowed files.
- Handoff refresh, commit, push, audit execution, implementation dispatch, graph refresh, dependency installation, or final acceptance from the manager wrapper.

## Impact Analysis

### Understand Status

- Graph available: Yes. `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, and `.understand-anything/meta.json` are present.
- Baseline commit: `4b26996fe50a90779c46f92aeddd4111808544c3`.
- Freshness assessment: Structurally stale for this workflow-tooling surface. Accepted changes since the baseline include repo-local skills, workflow scripts, workflow tests, graph refresh wrappers, agentic status and decision-router commands, SDK manager transition planning, and the SDK manager recommendation wrapper.
- Analysis performed: Used the graph baseline only as stale orientation. Verified the active surface directly with source search and inspection of `scripts/get-sdk-manager-recommendation.ps1`, `scripts/tests/test-sdk-manager-recommendation.ps1`, `scripts/get-agentic-workflow-decision.ps1`, `scripts/tests/test-agentic-workflow-decision.ps1`, and `docs/05-development-workflow/OpenAI-Agents-SDK-Orchestration-Readiness.md`.

### Affected Architecture

- Layers: development workflow tooling, agentic workflow command contracts, workflow tests.
- Primary files/components:
  - `scripts/tests/test-sdk-manager-recommendation.ps1`
  - optional: `scripts/get-sdk-manager-recommendation.ps1`
  - optional: `scripts/tests/test-agentic-workflow-decision.ps1`
  - optional: `docs/05-development-workflow/OpenAI-Agents-SDK-Orchestration-Readiness.md`
  - `docs/01-work-packages/WP-197-sdk-manager-real-state-fixture-matrix.md`
- Upstream consumers:
  - Human contributors using SDK manager recommendation preflights.
  - Future OpenAI Agents SDK manager prototype work packages.
  - Audit agents checking agentic workflow boundaries.
- Downstream dependencies:
  - `scripts/get-agentic-workflow-decision.ps1 -Json`
  - `scripts/get-agentic-workflow-status.ps1 -Json`
  - Lifecycle, validation-plan, closeout, and Understand-readiness helpers consumed by the status bundle.
  - Temporary work-package fixture behavior under `docs/01-work-packages`.

### Regression Surface

- Related tests:
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-recommendation.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-decision.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-sdk-manager-recommendation.ps1 -WorkPackage WP-197 -Json -SkipUnderstandReadiness`
  - `git diff --check`
  - `git status --short --untracked-files=all`
- User workflows:
  - Confirming manager recommendations from real repository state before a future SDK manager consumes them.
  - Keeping decision-router output advisory and non-executing.
  - Preparing a later SDK orchestration manager without dependency or network adoption yet.
- Security/data boundaries:
  - No runtime AI.
  - No live SDK/model calls.
  - No external data transmission.
  - No dependency installation.
  - No app, database, restricted-table, answer-key, student-data, or spoiler-boundary changes.

### Graph Update Decision

- Regeneration required: No for this package.
- Rationale: This is a narrow development-workflow test hardening package over source-inspected scripts. The graph is stale for workflow tooling but not needed for correctness, and this WP must not modify graph artifacts.

## Files Allowed to Change

Allowed:

- docs/01-work-packages/WP-197-sdk-manager-real-state-fixture-matrix.md
- scripts/tests/test-sdk-manager-recommendation.ps1
- scripts/get-sdk-manager-recommendation.ps1
- scripts/tests/test-agentic-workflow-decision.ps1
- docs/05-development-workflow/OpenAI-Agents-SDK-Orchestration-Readiness.md
- docs/00-ssot/END-OF-DAY-HANDOFF.md

Do Not Modify:

- apps/**
- database/**
- docs/00-ssot/** except `docs/00-ssot/END-OF-DAY-HANDOFF.md`
- .understand-anything/**
- tools/openai-agents-prototype/**
- scripts/get-agentic-workflow-decision.ps1
- scripts/get-agentic-workflow-status.ps1
- package.json
- package-lock.json
- pyproject.toml
- requirements*.txt
- pnpm-lock.yaml
- yarn.lock

## Constraints

- Keep the work dependency-free and PowerShell-only.
- Do not install, import, invoke, or document live use of OpenAI Agents SDK.
- Do not add runtime AI, model calls, MCP calls, browser automation, network behavior, or external data transmission.
- Do not change app runtime, database behavior, package manifests, lockfiles, prototype source, or graph artifacts.
- Do not change decision-router routing semantics; use existing decision-router output as the source of truth.
- Temporary fixture files must be removed by tests even when assertions fail.
- Tests must not leave `.understand-anything/tmp`, `.trash-*`, logs, or temporary work-package fixtures behind.
- Keep test-only fixture injection guarded and separate from public/contributor usage.

## Required Behavior

- Expand the SDK manager recommendation test coverage to include real work-package fixtures that exercise the wrapper through its normal path:
  - `scripts/get-sdk-manager-recommendation.ps1 -WorkPackage <fixture-wp> -Json -SkipUnderstandReadiness`
- Real-state fixture coverage must include:
  - no work package -> `plan`
  - planned WP -> `implement`
  - implemented WP -> `audit`
  - audited WP -> `request_human_decision`
  - accepted WP -> `finalize`
  - rejected/deferred WP -> `no_action`
  - invalid WP or blocked state -> `resolve_blockers`
  - unexpected lifecycle/closeout state, if practical without changing production scripts -> `manual_review`
- For each real-state route, assert:
  - `kind = "sdk_manager_recommendation"`
  - `forbiddenToExecute = true`
  - `source.executed = false`
  - expected `recommendedAction`
  - expected authorization flags
  - expected `commandPreview` presence or absence
  - relevant `statusState`
  - evidence includes decision-router and status-bundle metadata.
- Existing guarded decision snapshot tests may remain, but real-state tests must be the main contract hardening coverage.
- Do not execute any command preview.

## Acceptance Criteria

- [x] `scripts/tests/test-sdk-manager-recommendation.ps1` validates manager recommendations against real decision-router output from temporary work-package fixtures.
- [x] The fixture matrix covers planned, implemented, audited, accepted, closed, blocked/invalid, no-WP, and manual-review or documented-not-practical states.
- [x] Tests prove `forbiddenToExecute` remains true and `source.executed` remains false for every route.
- [x] Tests prove command previews are preserved as inert display text and never executed.
- [x] Tests prove audit recommendations require external authorization.
- [x] Tests prove test-only snapshot injection remains guarded and normal manager usage does not require it.
- [x] Temporary fixture cleanup is deterministic and leaves no generated WP fixtures, Understand temp/trash/log artifacts, package changes, lockfile changes, graph changes, or runtime files.
- [x] Existing decision-router tests still pass.
- [x] No SDK dependency, runtime AI, model call, network call, app code, database file, package file, lockfile, prototype source, or graph artifact changes are introduced.

## Code Prompt

Implement WP-197 exactly as scoped.

Primary task:

- Harden `scripts/tests/test-sdk-manager-recommendation.ps1` so the SDK manager wrapper is tested against real decision-router output from temporary work-package fixtures, not only injected manager decision snapshots.

Implementation requirements:

- Reuse existing PowerShell patterns from `scripts/tests/test-agentic-workflow-decision.ps1` where practical.
- Create temporary work-package fixtures under `docs/01-work-packages` with high-numbered WP names that will not collide with real WPs.
- Delete every temporary fixture in a `finally` block.
- Confirm tracked Understand graph artifacts are not modified and transient Understand temp/trash/log files are not created.
- Keep `scripts/get-agentic-workflow-decision.ps1` and `scripts/get-agentic-workflow-status.ps1` read-only and unchanged.
- Only change `scripts/get-sdk-manager-recommendation.ps1` if the real-state tests expose a narrow wrapper contract defect.
- Update documentation only if needed to clarify the real-state test contract.

Validation to run and record in Code Results:

- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-recommendation.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-decision.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-sdk-manager-recommendation.ps1 -WorkPackage WP-197 -Json -SkipUnderstandReadiness`
- `git diff --check`
- `git status --short --untracked-files=all`

Record:

- Exact files changed.
- The real-state fixture routes covered.
- Whether any wrapper code needed to change.
- Validation results.
- Confirmation that no SDK dependency, runtime AI, network behavior, app code, database files, package files, lockfiles, prototype source, or graph artifacts changed.

## Audit Prompt

Audit WP-197 against the work package, source diff, tests, and validation evidence.

Verify:

- The SDK manager wrapper is validated against real decision-router output generated from temporary work-package fixtures.
- The fixture matrix covers the required lifecycle states or clearly explains any impractical manual-review state.
- The implementation does not duplicate or alter decision-router lifecycle/status routing.
- `forbiddenToExecute` remains true and `source.executed` remains false for every route.
- Command previews remain inert and are not invoked.
- Audit recommendations require external authorization.
- Test-only snapshot injection remains guarded and is not required by normal manager usage.
- Temporary fixtures and generated artifacts are cleaned up.
- No files outside the allowed list changed.
- No SDK dependency, runtime AI, model call, network call, MCP call, browser automation, dependency installation, graph refresh, app change, database change, package change, lockfile change, or prototype-source change was introduced.
- Existing decision-router tests still pass.
- Impact analysis matches the actual changed files.
- Graph regeneration decision was followed.

Output:

- Verdict: PASS or FAIL
- Violations
- Regressions
- Drift risks
- Required corrections

## Code Results

Implemented WP-197.

Files changed:

- `scripts/tests/test-sdk-manager-recommendation.ps1`
- `docs/01-work-packages/WP-197-sdk-manager-real-state-fixture-matrix.md`

Implementation summary:

- Hardened `scripts/tests/test-sdk-manager-recommendation.ps1` with real temporary work-package fixtures under `docs/01-work-packages`.
- Exercised `scripts/get-sdk-manager-recommendation.ps1` through its normal path:
  - `scripts/get-sdk-manager-recommendation.ps1 -WorkPackage <fixture-wp> -Json -SkipUnderstandReadiness`
- Preserved existing guarded decision snapshot tests for manual-review and unknown-action routes that are not practical to create through the current public lifecycle helpers without changing production decision-router/status scripts.
- Added deterministic fixture cleanup in a `finally` block.
- Added graph artifact hash checks and transient Understand temp/trash/log checks to confirm the test leaves graph artifacts untouched.
- No wrapper code changes were required.

Real-state fixture routes covered:

- no work package -> `plan`
- planned WP -> `implement`
- implemented WP -> `audit`
- audited WP -> `request_human_decision`
- accepted WP -> `finalize`
- rejected WP -> `no_action`
- deferred WP -> `no_action`
- invalid WP -> `resolve_blockers`

Snapshot-only guarded coverage retained:

- manual-review route -> `manual_review`
- unknown decision-router action -> `manual_review`
- unguarded snapshot input -> `resolve_blockers` with no workflow command preview

Validation:

- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-recommendation.ps1`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-decision.ps1`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-sdk-manager-recommendation.ps1 -WorkPackage WP-197 -Json -SkipUnderstandReadiness`
- PASS: `git diff --check` with CRLF warnings only.
- PASS: `git status --short --untracked-files=all` showed only WP-197 allowed files.

Scope confirmation:

- No OpenAI Agents SDK dependency was installed or invoked.
- No runtime AI, model call, network behavior, MCP call, browser automation, app code, database file, package file, lockfile, prototype source, graph artifact, external-data transmission, or dependency change was introduced.

## Audit Results

# Audit Results: WP-197

**Verdict:** PASS

---

### Verification Summary

| Check | Requirement | Status | Details |
| :--- | :--- | :---: | :--- |
| 1 | **Real-State Validation** | **PASS** | `scripts/tests/test-sdk-manager-recommendation.ps1` exercises `scripts/get-sdk-manager-recommendation.ps1` against real `scripts/get-agentic-workflow-decision.ps1 -Json` output generated from temporary work-package fixtures (`WP-9981`ΓÇô`WP-9986`). |
| 2 | **Fixture Matrix Coverage** | **PASS** | Covers repository-only (`plan`), planned (`implement`), implemented (`audit`), audited (`request_human_decision`), accepted (`finalize`), rejected (`no_action`), deferred (`no_action`), and invalid WP (`resolve_blockers`). Retains snapshot coverage for `manual_review` and unhandled actions with clear justification. |
| 3 | **No Duplicated/Altered Routing** | **PASS** | Decision-router routing logic is preserved as single source of truth; wrapper maps `recommendation.action` via `ConvertTo-DecisionAction` without altering decision semantics. |
| 4 | **Execution Flags Invariant** | **PASS** | `forbiddenToExecute` remains `true` and `source.executed` remains `false` across all real-state fixture routes and snapshot tests. |
| 5 | **Inert Command Previews** | **PASS** | Workflow command previews are emitted strictly as display metadata and are never executed. |
| 6 | **External Authorization** | **PASS** | `audit` recommendation (`ImplementedNeedsAudit` state) explicitly requires `requiresExternalAuthorization = true`. |
| 7 | **Guarded Snapshot Injection** | **PASS** | Snapshot injection requires `-AllowTestDecisionSnapshot`. Unguarded calls correctly fall back to `resolve_blockers` with `RequiresAllowTestDecisionSnapshot` blocker. Normal usage is unimpacted. |
| 8 | **Artifact & Fixture Cleanup** | **PASS** | Temporary fixture files (`WP-9981`ΓÇô`WP-9986`) are cleaned up inside a `finally` block. Understand graph file hashes remain identical, and no transient `.understand-anything/tmp`, `.trash-*`, or log artifacts remain. |
| 9 | **Allowed Files Only** | **PASS** | Only [test-sdk-manager-recommendation.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/tests/test-sdk-manager-recommendation.ps1) and [WP-197-sdk-manager-real-state-fixture-matrix.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-197-sdk-manager-real-state-fixture-matrix.md) were modified/added. |
| 10 | **Zero Extra Dependencies/Side Effects** | **PASS** | No SDK dependency, runtime AI, model call, network call, MCP call, browser automation, dependency installation, graph refresh, app change, database change, package change, lockfile change, or prototype-source change introduced. |
| 11 | **Existing Tests Pass** | **PASS** | `test-agentic-workflow-decision.ps1` passes cleanly with exit code 0. |
| 12 | **Impact Analysis Alignment** | **PASS** | Impact analysis in WP-197 accurately identifies affected test scripts and work package documentation. |
| 13 | **Graph Regeneration Decision** | **PASS** | Followed the decision ("No for this package"). Tracked graph artifact SHA-256 hashes verified unchanged. |

---

### Violations

- **None**

---

### Regressions

- **None**

---

### Drift Risks

- **Low**: Ensure temporary fixture names (`WP-9981`ΓÇô`WP-9986`) do not collide with future production work packages. The `finally` block ensures deterministic cleanup even if tests fail mid-execution.

---

### Required Corrections

- **None**

## Final Decision

Accepted on 2026-07-24 after AntiGravity audit PASS and closeout preflight confirmation.

Closeout note:

- Expanded the allowed-file list only for `docs/00-ssot/END-OF-DAY-HANDOFF.md` because current project closeout rules require handoff refresh before accepted-WP commit and push.

