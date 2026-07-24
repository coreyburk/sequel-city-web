# WP-193: Decision Router Fixture Matrix

## Objective

Strengthen the agentic workflow decision-router tests with a stable fixture matrix that covers the remaining lifecycle routes without depending on live work-package state.

## Scope

### In Scope

- Add fixture-driven coverage to `scripts/tests/test-agentic-workflow-decision.ps1` for:
  - accepted/finalization-ready work package state
  - audited/needs-human-final-decision state
  - rejected and deferred closed states
  - blocked mixed-worktree or out-of-scope dirty-file state
  - manual-review fallback state
- Keep temporary fixtures deterministic, self-cleaning, and isolated to test-created files.
- Adjust `scripts/get-agentic-workflow-decision.ps1` only if the expanded fixture matrix exposes a narrow routing defect or brittle output contract.
- Preserve text and JSON output behavior from WP-192.
- Preserve graph hygiene checks proving tracked Understand artifacts and transient graph directories/logs are not created or modified by the test.

### Out of Scope

- Runtime application behavior.
- OpenAI Agents SDK runtime orchestration.
- External audit execution.
- Commit, push, handoff refresh, graph refresh, or workflow action execution from the decision router.
- New dependencies.
- Renaming workflow scripts.
- Broad refactors of work-package status, validation-plan, closeout, audit, run, or commit helpers.
- Documentation updates outside this work package unless a narrow correction is required to keep the test contract accurate.

## Impact Analysis

### Understand Status

- Graph available: Yes. `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, and `.understand-anything/meta.json` are present.
- Baseline commit: `4b26996fe50a90779c46f92aeddd4111808544c3`.
- Freshness assessment: Structurally stale for this planning surface. Accepted changes after the baseline touched workflow scripts, workflow tests, repo-local skills, and major development-workflow documentation, including WP-191 and WP-192.
- Analysis performed: Used the graph only as stale orientation, then verified the active surface with source inspection of `scripts/get-agentic-workflow-decision.ps1`, `scripts/tests/test-agentic-workflow-decision.ps1`, WP-192, and workflow documentation.

### Affected Architecture

- Layers: development workflow tooling and work-package lifecycle validation.
- Primary files/components:
  - `scripts/get-agentic-workflow-decision.ps1`
  - `scripts/tests/test-agentic-workflow-decision.ps1`
  - `docs/01-work-packages/WP-193-decision-router-fixture-matrix.md`
- Upstream consumers:
  - Contributors and future agentic managers that preview next allowed workflow actions.
  - Future OpenAI Agents SDK development-time orchestration prototypes that may consume decision-router JSON.
- Downstream dependencies:
  - `scripts/get-agentic-workflow-status.ps1 -Json`
  - `scripts/get-work-package-status.ps1`
  - `scripts/check-work-package-closeout.ps1`
  - `scripts/get-work-package-validation-plan.ps1`
  - `scripts/WorkPackageResolver.ps1`

### Regression Surface

- Related tests:
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-decision.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-agentic-workflow-decision.ps1 -WorkPackage WP-193 -Json -SkipUnderstandReadiness`
  - `powershell -NoProfile -Command "[scriptblock]::Create((Get-Content -Raw scripts/get-agentic-workflow-decision.ps1)) | Out-Null"`
- User workflows:
  - Previewing the next allowed workflow action before implementation, audit, human decision, or finalization.
  - Using fixture-backed tests to prevent live WP lifecycle drift from breaking decision-router validation.
- Security/data boundaries:
  - No runtime AI behavior.
  - No database access or schema changes.
  - No answer-key, restricted-table, or spoiler-boundary changes.
  - No external network or audit-agent invocation.

### Graph Update Decision

- Regeneration required: No for this package.
- Rationale: This package is development-tooling test hardening over an already known stale graph surface. It must not rely on graph relationships for correctness, and it must not modify tracked graph artifacts. A separate graph-refresh package should remain the correct path for updating the baseline.

## Files Allowed to Change

Allowed:

- docs/01-work-packages/WP-193-decision-router-fixture-matrix.md
- docs/00-ssot/END-OF-DAY-HANDOFF.md
- scripts/get-agentic-workflow-decision.ps1
- scripts/tests/test-agentic-workflow-decision.ps1

Do Not Modify:

- apps/**
- database/**
- docs/00-ssot/** except `docs/00-ssot/END-OF-DAY-HANDOFF.md`
- docs/05-development-workflow/**
- .understand-anything/**
- scripts/get-agentic-workflow-status.ps1
- scripts/get-work-package-status.ps1
- scripts/get-work-package-validation-plan.ps1
- scripts/check-work-package-closeout.ps1
- scripts/run-work-package.ps1
- scripts/audit-work-package.ps1
- scripts/commit-work-package.ps1
- scripts/WorkPackageResolver.ps1
- package.json
- package-lock.json

## Constraints

- Keep the decision router read-only and dry-run-only.
- Do not execute implementation, audit, acceptance, handoff refresh, commit, push, external calls, or graph refresh from the router or tests.
- Do not depend on the live lifecycle state of WP-193 or any accepted historical work package for matrix assertions.
- Use temporary fixture files with high, clearly test-only WP numbers and remove them in `finally` cleanup.
- Keep fixture file writes limited to `docs/01-work-packages/` and any temporary dirty-file fixture required to simulate mixed-worktree blockers.
- If a temporary out-of-scope dirty-file fixture is needed, create it only under a path that is guaranteed to be cleaned up before test exit and does not overwrite an existing file.
- Preserve all existing tested WP-192 behavior.
- No new dependencies.

## Required Behavior

- The decision-router test suite must cover these recommendation actions with fixture-controlled state:
  - `ProvideWorkPackage`
  - `ImplementWorkPackage`
  - `RequestIndependentAudit`
  - `RequestHumanFinalDecision`
  - `FinalizeAcceptedWorkPackage`
  - `NoActionClosed` for rejected work
  - `NoActionClosed` for deferred work
  - `ResolveBlockers`
  - `ManualReview`
- Each fixture-backed assertion must verify:
  - `dryRun` is `true`
  - `executed` is `false`
  - the expected `recommendation.action`
  - command-preview presence or absence for that route
  - human-decision and external-authorization flags where relevant
- The finalization-ready route must verify the preview uses `scripts/commit-work-package.ps1` with `-Preview`.
- The audit-ready route must verify the preview uses `scripts/audit-work-package.ps1` with `-AllowExternalAudit`.
- The implementation-ready route must verify the preview uses `scripts/run-work-package.ps1` with `-Execute Codex`.
- The blocked mixed-worktree route must prove blockers are surfaced and no workflow command is previewed as executable.
- The manual-review route must use a deterministic fixture or mocked status-bundle shape that does not require changing shared lifecycle helpers.
- The test must continue to verify that tracked `.understand-anything` graph artifacts are unchanged and no `.understand-anything/tmp`, `.trash-*`, or log artifacts are created.

## Acceptance Criteria

- [x] `scripts/tests/test-agentic-workflow-decision.ps1` covers the full action matrix listed in Required Behavior.
- [x] Fixture setup and cleanup are deterministic and leave `git status --short --untracked-files=all` without temporary test files after test completion.
- [x] No matrix assertion depends on the live state of WP-193, WP-192, or any historical accepted work package.
- [x] `scripts/get-agentic-workflow-decision.ps1` remains read-only and dry-run-only.
- [x] `scripts/get-agentic-workflow-decision.ps1` text and JSON output contracts from WP-192 remain compatible.
- [x] Graph hygiene checks continue to prove tracked Understand artifacts are not modified.
- [x] No new dependencies are introduced.
- [x] No runtime app, database, package manifest, lockfile, SSOT, graph baseline, audit-runner, status-helper, closeout-helper, run-helper, commit-helper, or resolver files are changed.

## Code Prompt

Implement WP-193 exactly as scoped.

Primary task:

- Expand `scripts/tests/test-agentic-workflow-decision.ps1` into a fixture matrix for decision-router lifecycle routes.

Required matrix:

- no work package -> `ProvideWorkPackage`
- planned fixture -> `ImplementWorkPackage`
- implemented fixture with validation evidence -> `RequestIndependentAudit`
- audited fixture with audit PASS and no final decision -> `RequestHumanFinalDecision`
- accepted fixture with final decision accepted -> `FinalizeAcceptedWorkPackage`
- rejected fixture -> `NoActionClosed`
- deferred fixture -> `NoActionClosed`
- blocked mixed-worktree or out-of-scope dirty-file fixture -> `ResolveBlockers`
- unknown or intentionally unsupported fixture/status shape -> `ManualReview`

Implementation constraints:

- Prefer changing only `scripts/tests/test-agentic-workflow-decision.ps1`.
- Modify `scripts/get-agentic-workflow-decision.ps1` only for a narrow defect exposed by the matrix.
- Do not modify shared lifecycle helpers.
- Keep all fixtures temporary and remove them in `finally`.
- Do not overwrite any existing repository file while creating temporary fixtures.
- Preserve graph hygiene assertions.
- Do not execute any workflow action beyond read-only status and decision commands.

Validation to run and record in Code Results:

- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-decision.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-agentic-workflow-decision.ps1 -WorkPackage WP-193 -Json -SkipUnderstandReadiness`
- `powershell -NoProfile -Command "[scriptblock]::Create((Get-Content -Raw scripts/get-agentic-workflow-decision.ps1)) | Out-Null"`
- `git diff --check`
- `git status --short --untracked-files=all`

Record:

- Exact files changed.
- Whether `scripts/get-agentic-workflow-decision.ps1` needed any behavior correction.
- Test fixture names or numbers used.
- Validation results.
- Confirmation that no graph artifacts or transient Understand files were created or modified.

## Audit Prompt

Audit WP-193 against the work package, source, and validation evidence.

Verify:

- The matrix covers every route listed in Required Behavior.
- Fixture states are deterministic and do not depend on the live lifecycle state of WP-193, WP-192, or accepted historical work packages.
- Temporary files are cleaned up even on failure paths.
- The decision router remains read-only, dry-run-only, and non-executing.
- Command previews remain previews only and preserve required gates:
  - implementation requires human-controlled Codex execution
  - audit requires `-AllowExternalAudit`
  - finalization uses commit-helper preview
- No shared lifecycle helper was changed outside scope.
- No runtime app, database, dependency, SSOT, graph baseline, audit-runner, status-helper, closeout-helper, run-helper, commit-helper, or resolver files changed.
- Validation evidence is accurate and sufficient.
- Graph regeneration decision was followed and tracked graph artifacts were not modified.
- Understand output did not override SSOT, source code, tests, or observed behavior.

Output:

- Verdict: PASS or FAIL
- Violations
- Regressions
- Drift risks
- Required corrections

## Code Results

Implemented WP-193.

Files changed:

- `scripts/tests/test-agentic-workflow-decision.ps1`
- `scripts/get-agentic-workflow-decision.ps1`
- `docs/01-work-packages/WP-193-decision-router-fixture-matrix.md`

Implementation summary:

- Expanded the decision-router test into a fixture matrix covering:
  - `ProvideWorkPackage`
  - `ImplementWorkPackage`
  - `RequestIndependentAudit`
  - `RequestHumanFinalDecision`
  - `FinalizeAcceptedWorkPackage`
  - `NoActionClosed` for rejected work
  - `NoActionClosed` for deferred work
  - `ResolveBlockers`
  - `ManualReview`
- Added high-numbered temporary WP fixtures:
  - `WP-9992-agentic-decision-planned-temp.md`
  - `WP-9993-agentic-decision-implemented-temp.md`
  - `WP-9994-agentic-decision-audited-temp.md`
  - `WP-9995-agentic-decision-accepted-temp.md`
  - `WP-9996-agentic-decision-rejected-temp.md`
  - `WP-9997-agentic-decision-deferred-temp.md`
- Kept temporary fixture creation guarded so existing files are never overwritten, and fixture cleanup runs in `finally`.
- Preserved graph hygiene assertions for tracked `.understand-anything` files plus transient temp/trash/log checks.
- Added a base64-encoded `-StatusSnapshotJsonBase64` status-snapshot input to `scripts/get-agentic-workflow-decision.ps1` so tests can deterministically cover mocked blocked and manual-review status shapes without changing shared lifecycle helpers.
- Fixed a narrow routing defect: `ClosedRejected` and `ClosedDeferred` are now classified as `NoActionClosed` before the general blocked-state guard.

Behavior correction:

- `scripts/get-agentic-workflow-decision.ps1` required a narrow behavior correction for closed rejected/deferred states. Before this package, the status bundle marked those states as blocked and the router returned `ResolveBlockers` before reaching `NoActionClosed`.

Validation:

- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-decision.ps1`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-agentic-workflow-decision.ps1 -WorkPackage WP-193 -Json -SkipUnderstandReadiness`
- PASS: `powershell -NoProfile -Command "[scriptblock]::Create((Get-Content -Raw scripts/get-agentic-workflow-decision.ps1)) | Out-Null"`
- PASS: `git diff --check` with CRLF warnings only.
- PASS: `git status --short --untracked-files=all` showed only WP-193 allowed files after fixture cleanup.

Graph artifact confirmation:

- `scripts/tests/test-agentic-workflow-decision.ps1` hashes tracked graph artifacts before and after the matrix run and fails if any tracked `.understand-anything` artifact changes.
- The test also fails if `.understand-anything/tmp`, `.understand-anything/.trash-*`, or `.understand-anything/*.log` artifacts exist after decision-router execution.
- No graph refresh was run.

## Audit Results

### Audit Result: WP-193 Decision Router Fixture Matrix

#### Verdict
**PASS**

---

### Detailed Verification

1. **Route Coverage**:
   - The test matrix in [`test-agentic-workflow-decision.ps1`](file:///D:/GitHub-Repos/SequelCityWeb/scripts/tests/test-agentic-workflow-decision.ps1) covers every route specified in the Required Behavior:
     - `ProvideWorkPackage`: Verified with repository-only input.
     - `ImplementWorkPackage`: Verified with planned fixture (`WP-9992`).
     - `RequestIndependentAudit`: Verified with implemented fixture (`WP-9993`).
     - `RequestHumanFinalDecision`: Verified with audited fixture (`WP-9994`).
     - `FinalizeAcceptedWorkPackage`: Verified with accepted fixture (`WP-9995`).
     - `NoActionClosed`: Verified for both rejected (`WP-9996`) and deferred (`WP-9997`) fixtures.
     - `ResolveBlockers`: Verified with mocked blocker status snapshot (`WP-9998`) and non-existent work package (`WP-0000`).
     - `ManualReview`: Verified with mocked unsupported status state snapshot (`WP-9999`).

2. **Fixture Determinism & Lifecycle Independence**:
   - High-numbered temporary work package fixtures (`WP-9992` through `WP-9997`) and base64-encoded mocked status snapshots are constructed on-the-fly during test execution.
   - Assertions do not depend on the live lifecycle state of WP-193, WP-192, or any accepted historical work package.

3. **Cleanup Reliability**:
   - Fixture creation and teardown are safely scoped inside `try...finally` blocks in [`test-agentic-workflow-decision.ps1`](file:///D:/GitHub-Repos/SequelCityWeb/scripts/tests/test-agentic-workflow-decision.ps1#L314-L390).
   - Verified that `git status --short --untracked-files=all` reports no leftover temporary files after test execution.

4. **Read-Only / Non-Executing Router Design**:
   - [`get-agentic-workflow-decision.ps1`](file:///D:/GitHub-Repos/SequelCityWeb/scripts/get-agentic-workflow-decision.ps1) maintains `dryRun = $true` and `executed = $false` across all output paths.
   - No external scripts, git mutations, or lifecycle actions are executed by the decision router.

5. **Command Preview Gate Preservation**:
   - Implementation preview explicitly requires Codex execution (`run-work-package.ps1 WP-9992 -Execute Codex`).
   - Audit preview explicitly requires external authorization (`audit-work-package.ps1 WP-9993 -AllowExternalAudit`).
   - Finalization preview uses the commit-helper preview flag (`commit-work-package.ps1 -WorkPackagePath WP-9995 -Preview`).
   - Routes with blockers omit command previews to prevent accidental execution.

6. **Helper & Scope Integrity**:
   - No shared lifecycle helpers (`WorkPackageResolver.ps1`, `get-agentic-workflow-status.ps1`, `get-work-package-status.ps1`, `check-work-package-closeout.ps1`, `commit-work-package.ps1`, `audit-work-package.ps1`, `run-work-package.ps1`) were modified.
   - Changes are strictly limited to the 3 allowed files:
     - [`scripts/get-agentic-workflow-decision.ps1`](file:///D:/GitHub-Repos/SequelCityWeb/scripts/get-agentic-workflow-decision.ps1)
     - [`scripts/tests/test-agentic-workflow-decision.ps1`](file:///D:/GitHub-Repos/SequelCityWeb/scripts/tests/test-agentic-workflow-decision.ps1)
     - [`docs/01-work-packages/WP-193-decision-router-fixture-matrix.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-193-decision-router-fixture-matrix.md)

7. **Validation Evidence Accuracy**:
   - Clean execution confirmed for:
     - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-decision.ps1` (PASS)
     - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-agentic-workflow-decision.ps1 -WorkPackage WP-193 -Json -SkipUnderstandReadiness` (PASS)
     - `powershell -NoProfile -Command "[scriptblock]::Create((Get-Content -Raw scripts/get-agentic-workflow-decision.ps1)) | Out-Null"` (PASS)
     - `git diff --check` (PASS)
     - `git status --short --untracked-files=all` (PASS)

8. **Graph Hygiene & Artifacts**:
   - The tracked Understand graph baseline files (`knowledge-graph.json`, `fingerprints.json`, `meta.json`, `scan-result.json`) were checked via SHA256 hashes before and after test execution and confirmed unchanged.
   - No transient `.understand-anything/tmp`, `.trash-*`, or log artifacts were created.

---

### Violations
- **None**.

### Regressions
- **None**.

### Drift Risks
- **None**.

### Required Corrections
- **None**.

## Final Decision

Accepted on 2026-07-24 after AntiGravity audit PASS and human acceptance. The fixture matrix covers the required decision-router routes, the closed-state routing defect is corrected, validation evidence is recorded, and the work remains development-tooling-only with no runtime app, database, dependency, graph-baseline, or shared lifecycle-helper changes.


