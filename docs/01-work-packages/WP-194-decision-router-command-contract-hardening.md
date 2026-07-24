# WP-194: Decision Router Command Contract Hardening

## Objective

Harden the agentic workflow decision-router command contract so public contributor and future SDK usage remains limited to real status-bundle reads while fixture-only status-snapshot injection is explicitly internal to tests.

## Scope

### In Scope

- Review `scripts/get-agentic-workflow-decision.ps1` parameters added during WP-193.
- Ensure `StatusSnapshotJson` and `StatusSnapshotJsonBase64` cannot be mistaken for normal contributor or SDK command inputs.
- Either:
  - hide status-snapshot injection behind an explicit test-only guard such as `-AllowTestStatusSnapshot`, or
  - otherwise make the test-only contract explicit in script behavior, errors, and tests.
- Update `scripts/tests/test-agentic-workflow-decision.ps1` so mocked status-snapshot fixture routes still work through the hardened test-only contract.
- Add focused assertions that snapshot-injection parameters are rejected or ignored unless the test-only guard is present.
- Update only narrowly necessary workflow documentation if the accepted public command contract needs clarification.

### Out of Scope

- Runtime application behavior.
- OpenAI Agents SDK runtime orchestration.
- External audit execution.
- Changing decision-router route semantics unrelated to the test-only status-snapshot contract.
- Modifying shared lifecycle helpers.
- New dependencies.
- Renaming workflow scripts.
- Graph refresh.
- Commit, push, handoff refresh, audit execution, or workflow action execution from the decision router.

## Impact Analysis

### Understand Status

- Graph available: Yes. `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, and `.understand-anything/meta.json` are present.
- Baseline commit: `4b26996fe50a90779c46f92aeddd4111808544c3`.
- Freshness assessment: Structurally stale for this planning surface. Accepted changes since the baseline touched workflow scripts, tests, repo-local skills, and major development-workflow documentation through WP-193.
- Analysis performed: Used the graph only as stale orientation, then verified the current command contract with source search over `scripts/get-agentic-workflow-decision.ps1`, `scripts/tests/test-agentic-workflow-decision.ps1`, `Contributor-Workflow-Guide.md`, `OpenAI-Agents-SDK-Orchestration-Readiness.md`, and the live handoff.

### Affected Architecture

- Layers: development workflow tooling and future agentic orchestration contract.
- Primary files/components:
  - `scripts/get-agentic-workflow-decision.ps1`
  - `scripts/tests/test-agentic-workflow-decision.ps1`
  - `docs/01-work-packages/WP-194-decision-router-command-contract-hardening.md`
  - optional: `docs/05-development-workflow/Contributor-Workflow-Guide.md`
  - optional: `docs/05-development-workflow/OpenAI-Agents-SDK-Orchestration-Readiness.md`
- Upstream consumers:
  - Contributors running decision-router dry runs.
  - Future OpenAI Agents SDK development-time manager tooling.
  - Decision-router tests using mocked status snapshots.
- Downstream dependencies:
  - `scripts/get-agentic-workflow-status.ps1 -Json`
  - `scripts/get-work-package-status.ps1`
  - `scripts/check-work-package-closeout.ps1`
  - `scripts/get-work-package-validation-plan.ps1`
  - `scripts/WorkPackageResolver.ps1`

### Regression Surface

- Related tests:
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-decision.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-agentic-workflow-decision.ps1 -WorkPackage WP-194 -Json -SkipUnderstandReadiness`
  - `powershell -NoProfile -Command "[scriptblock]::Create((Get-Content -Raw scripts/get-agentic-workflow-decision.ps1)) | Out-Null"`
- User workflows:
  - Contributors previewing the next allowed workflow action for a real work package.
  - Future SDK manager using `get-agentic-workflow-decision.ps1 -WorkPackage <wp> -Json` as a read-only advisory tool.
  - Tests simulating edge states without mutating shared lifecycle helpers.
- Security/data boundaries:
  - No runtime AI behavior.
  - No database access.
  - No answer-key, restricted-table, or spoiler-boundary changes.
  - No external network or audit-agent invocation.

### Graph Update Decision

- Regeneration required: No for this package.
- Rationale: This is a narrow command-contract hardening pass on development tooling. The graph is stale for workflow scripts, so source inspection is authoritative for this WP. The implementation must not modify tracked graph artifacts or run a graph refresh.

## Files Allowed to Change

Allowed:

- docs/01-work-packages/WP-194-decision-router-command-contract-hardening.md
- docs/00-ssot/END-OF-DAY-HANDOFF.md
- scripts/get-agentic-workflow-decision.ps1
- scripts/tests/test-agentic-workflow-decision.ps1
- docs/05-development-workflow/Contributor-Workflow-Guide.md
- docs/05-development-workflow/OpenAI-Agents-SDK-Orchestration-Readiness.md

Do Not Modify:

- apps/**
- database/**
- docs/00-ssot/** except `docs/00-ssot/END-OF-DAY-HANDOFF.md`
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
- Normal usage must remain `scripts/get-agentic-workflow-decision.ps1 -WorkPackage <wp>` with optional `-Json` and `-SkipUnderstandReadiness`.
- Future SDK usage must remain `scripts/get-agentic-workflow-decision.ps1 -WorkPackage <wp> -Json`.
- Test-only status-snapshot injection must not be presented as a public orchestration input.
- Do not execute implementation, audit, acceptance, handoff refresh, commit, push, external calls, or graph refresh from the router or tests.
- Do not change shared lifecycle helper semantics.
- Do not add dependencies.

## Required Behavior

- Public command contract is explicit:
  - `-WorkPackage`
  - `-Json`
  - `-SkipUnderstandReadiness`
- Status-snapshot injection is test-only and must require an explicit test-only guard or equivalent clear protection.
- If status-snapshot injection is supplied without the test-only guard, the command must return a deterministic non-executing result or error that cannot be mistaken for a real workflow recommendation.
- The test matrix from WP-193 must continue to cover:
  - `ProvideWorkPackage`
  - `ImplementWorkPackage`
  - `RequestIndependentAudit`
  - `RequestHumanFinalDecision`
  - `FinalizeAcceptedWorkPackage`
  - `NoActionClosed`
  - `ResolveBlockers`
  - `ManualReview`
- Tests must verify the guarded status-snapshot path and the unguarded rejection path.
- Public docs must not instruct contributors or future SDK orchestration to use status-snapshot injection.

## Acceptance Criteria

- [x] `scripts/get-agentic-workflow-decision.ps1` clearly separates public real-status usage from test-only mocked-status usage.
- [x] Status-snapshot injection cannot be used silently without an explicit test-only guard or equivalent protection.
- [x] `scripts/tests/test-agentic-workflow-decision.ps1` passes and still covers the WP-193 matrix.
- [x] Tests include at least one assertion that unguarded status-snapshot injection is rejected or produces a deterministic no-execution blocker result.
- [x] Contributor and SDK documentation, if changed, describe only the public real-status command contract.
- [x] No shared lifecycle helper files are changed.
- [x] No runtime app, database, dependency, lockfile, graph baseline, SSOT, audit-runner, run-helper, commit-helper, or resolver files are changed.
- [x] No graph refresh is run.

## Code Prompt

Implement WP-194 exactly as scoped.

Primary task:

- Harden `scripts/get-agentic-workflow-decision.ps1` so status-snapshot injection is not a public-looking command contract.

Recommended implementation shape:

- Add a clearly named test-only guard such as `-AllowTestStatusSnapshot`.
- Require that guard before honoring `-StatusSnapshotJson` or `-StatusSnapshotJsonBase64`.
- When snapshot injection is supplied without the guard, return a deterministic read-only result such as `ResolveBlockers` with a clear reason and blocker message, or fail safely with a non-executing parseable JSON result.
- Keep normal real-status behavior unchanged for `-WorkPackage`, `-Json`, and `-SkipUnderstandReadiness`.
- Update tests to pass the guard for mocked status-snapshot cases.
- Add an unguarded injection test that proves the path is protected.
- Update workflow docs only if needed to clarify the public command contract; do not document test-only parameters as contributor usage.

Validation to run and record in Code Results:

- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-decision.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-agentic-workflow-decision.ps1 -WorkPackage WP-194 -Json -SkipUnderstandReadiness`
- `powershell -NoProfile -Command "[scriptblock]::Create((Get-Content -Raw scripts/get-agentic-workflow-decision.ps1)) | Out-Null"`
- `git diff --check`
- `git status --short --untracked-files=all`

Record:

- Exact files changed.
- Public command contract after the change.
- Test-only guard behavior.
- Validation results.
- Confirmation that no graph artifacts were modified or refreshed.

## Audit Prompt

Audit WP-194 against the work package, source, and validation evidence.

Verify:

- Public decision-router usage remains focused on real `get-agentic-workflow-status.ps1 -Json` reads.
- Status-snapshot injection is protected by an explicit test-only guard or equivalent deterministic safeguard.
- Unguarded snapshot injection cannot silently produce a normal workflow recommendation.
- The WP-193 decision-route matrix still passes.
- No shared lifecycle helpers were modified.
- No runtime app, database, dependency, SSOT, graph baseline, audit-runner, run-helper, commit-helper, or resolver files changed.
- Documentation, if changed, does not promote test-only injection as contributor or SDK usage.
- Validation evidence is accurate.
- Graph regeneration decision was followed and tracked graph artifacts were not modified.
- Understand output did not override SSOT, source code, tests, or observed behavior.

Output:

- Verdict: PASS or FAIL
- Violations
- Regressions
- Drift risks
- Required corrections

## Code Results

Implemented WP-194.

Files changed:

- `scripts/get-agentic-workflow-decision.ps1`
- `scripts/tests/test-agentic-workflow-decision.ps1`
- `docs/01-work-packages/WP-194-decision-router-command-contract-hardening.md`

Public command contract after the change:

- `scripts/get-agentic-workflow-decision.ps1 -WorkPackage <wp>`
- `scripts/get-agentic-workflow-decision.ps1 -WorkPackage <wp> -Json`
- `scripts/get-agentic-workflow-decision.ps1 -WorkPackage <wp> -Json -SkipUnderstandReadiness`

Implementation summary:

- Added explicit `-AllowTestStatusSnapshot` guard to `scripts/get-agentic-workflow-decision.ps1`.
- Kept `-StatusSnapshotJson` and `-StatusSnapshotJsonBase64` available only as test-controlled injection inputs.
- Added deterministic guarded behavior: mocked snapshot input is honored only when `-AllowTestStatusSnapshot` is present.
- Added deterministic unguarded behavior: mocked snapshot input without the guard returns a read-only `ResolveBlockers` recommendation with blocker `testStatusSnapshot: RequiresAllowTestStatusSnapshot`.
- Preserved normal real-status behavior for public contributor and future SDK usage.
- Updated `scripts/tests/test-agentic-workflow-decision.ps1` so mocked blocker and manual-review status shapes pass the explicit test-only guard.
- Added test coverage proving unguarded snapshot injection does not silently produce a normal workflow recommendation or command preview.

Documentation:

- No contributor or SDK documentation changes were needed. Existing public docs already describe only real-status decision-router usage through `-WorkPackage`, `-Json`, and optional `-SkipUnderstandReadiness`.

Validation:

- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-decision.ps1`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-agentic-workflow-decision.ps1 -WorkPackage WP-194 -Json -SkipUnderstandReadiness`
- PASS: `powershell -NoProfile -Command "[scriptblock]::Create((Get-Content -Raw scripts/get-agentic-workflow-decision.ps1)) | Out-Null"`
- PASS: `git diff --check` with CRLF warnings only.
- PASS: `git status --short --untracked-files=all` showed only WP-194 allowed files after fixture cleanup.

Graph artifact confirmation:

- No graph refresh was run.
- No `.understand-anything/**` files were modified.

## Audit Results

### Audit Verdict

**Verdict: PASS**

---

### Verification Summary

1. **Public Decision-Router Usage**:
   - **Status**: Verified
   - **Details**: `scripts/get-agentic-workflow-decision.ps1` retains `Invoke-StatusBundle` as its primary execution path, invoking `scripts/get-agentic-workflow-status.ps1 -Json` for real status reads.

2. **Test-Only Guard for Status-Snapshot Injection**:
   - **Status**: Verified
   - **Details**: Added explicit `-AllowTestStatusSnapshot` switch parameter. Snapshot injection parameters (`-StatusSnapshotJson` and `-StatusSnapshotJsonBase64`) are evaluated only when `-AllowTestStatusSnapshot` is set.

3. **Unguarded Snapshot Injection Protection**:
   - **Status**: Verified
   - **Details**: Supplying snapshot injection without `-AllowTestStatusSnapshot` returns a deterministic `ResolveBlockers` recommendation containing blocker `testStatusSnapshot: RequiresAllowTestStatusSnapshot` and no command preview. It cannot silently recommend or execute any normal workflow action.

4. **WP-193 Decision-Route Matrix**:
   - **Status**: Verified
   - **Details**: Running `scripts/tests/test-agentic-workflow-decision.ps1` passes all 6 WP lifecycle states (Planned, Implemented, Audited, Accepted, Rejected, Deferred) as well as repository-only, invalid WP, blocker snapshot, and manual review test cases.

5. **Shared Lifecycle Helpers Unmodified**:
   - **Status**: Verified
   - **Details**: No shared lifecycle scripts (`get-agentic-workflow-status.ps1`, `get-work-package-status.ps1`, `check-work-package-closeout.ps1`, `WorkPackageResolver.ps1`, `run-work-package.ps1`, `audit-work-package.ps1`, `commit-work-package.ps1`) were modified.

6. **Scope Integrity**:
   - **Status**: Verified
   - **Details**: Only allowed files were changed (`scripts/get-agentic-workflow-decision.ps1`, `scripts/tests/test-agentic-workflow-decision.ps1`, and [WP-194-decision-router-command-contract-hardening.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-194-decision-router-command-contract-hardening.md)). No runtime app (`apps/`), database (`database/`), SSOT (`docs/00-ssot/`), or dependency files were touched.

7. **Documentation Usage**:
   - **Status**: Verified
   - **Details**: Contributor and SDK workflow documentation remain strictly scoped to public parameters (`-WorkPackage`, `-Json`, `-SkipUnderstandReadiness`) and do not promote test-only injection parameters.

8. **Validation Evidence Accuracy**:
   - **Status**: Verified
   - **Details**: All listed validation commands (`test-agentic-workflow-decision.ps1`, `get-agentic-workflow-decision.ps1 -WorkPackage WP-194 -Json -SkipUnderstandReadiness`, PowerShell syntax check, `git diff --check`, and `git status`) were re-executed live and succeeded cleanly.

9. **Graph Artifact Integrity**:
   - **Status**: Verified
   - **Details**: No graph refresh was executed, and `.understand-anything/**` artifacts were verified unchanged via pre- and post-test SHA-256 hash assertions in the test suite.

10. **SSOT / Source Precedence**:
    - **Status**: Verified
    - **Details**: Code and test contracts were derived from authoritative source files and empirical test execution rather than stale graph metadata.

---

### Audit Findings

- **Violations**: None.
- **Regressions**: None.
- **Drift Risks**: None.
- **Required Corrections**: None.
The background task (`task-28`) scanning system directories for `.git` repositories has completed. All relevant repositories and files were located during the audit, and the audit for **WP-194** remains complete with a status of **PASS**.

## Final Decision

Accepted on 2026-07-24 after AntiGravity audit PASS and human acceptance. The command contract now protects mocked status-snapshot inputs behind an explicit test-only guard, public decision-router usage remains focused on real status-bundle reads, validation evidence is recorded, and the work remains development-tooling-only with no runtime app, database, dependency, graph-baseline, or shared lifecycle-helper changes.



