# WP-206: Workflow Test Fixture Cleanup Hygiene

## Objective

Prevent repo-root temporary work-package fixtures created by SDK manager and workflow status tests from leaking into `docs/01-work-packages` and blocking later audit or finalization scope checks.

## Scope

### In Scope

- Harden SDK manager and workflow status/decision test fixtures that create temporary work-package markdown files under `docs/01-work-packages`.
- Add deterministic pre-test cleanup for only each test's own generated fixture filename patterns.
- Add post-test assertions or cleanup checks that prove each test leaves no matching temporary work-package fixture files behind.
- Preserve the existing tested workflow-helper behavior and fixture coverage.
- Keep the change test-only and repo-native.

### Out of Scope

- Changing production workflow helper behavior.
- Changing work-package lifecycle, audit, closeout, finalization, commit, push, or status policies.
- Changing SDK manager output contracts or dry-run recommendation semantics.
- Broad cleanup of arbitrary untracked files.
- Removing or rewriting real work-package records.
- Adding dependencies, SDK adoption, runtime AI, external calls, graph refresh, app startup, browser automation, package/lockfile changes, database changes, or Case 004 progression changes.

## Impact Analysis

### Understand Status
- Graph available: Yes. `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, `.understand-anything/meta.json`, and `.understand-anything/intermediate/scan-result.json` are present.
- Baseline commit: `7186b432ad74156d817cdb552eb01dbe1581def6`.
- Freshness assessment: Structurally stale for this planning surface. Current `HEAD` is `fe314a3`; accepted WP-205 changed workflow helper scripts and tests after the graph baseline. Because this package targets those changed workflow test relationships, graph relationships were treated as stale and source inspection was used as authoritative.
- Analysis performed: Recommended-tier workflow-tooling test hygiene planning. Used direct source search for tests that create temporary work-package fixtures under `docs/01-work-packages`, inspected SDK manager recommendation/orchestration tests, status/decision tests, validation-plan tests, and closeout/status fixture patterns. Graph artifacts were read only for availability/freshness; no graph relationships were relied on for final scope.

### Affected Architecture
- Layers: development workflow test harness, work-package fixture hygiene, SDK manager/status regression tests.
- Primary files/components:
  - `scripts/tests/test-sdk-manager-recommendation.ps1`
  - `scripts/tests/test-sdk-manager-orchestration-dry-run.ps1`
  - `scripts/tests/test-agentic-workflow-decision.ps1`
  - `scripts/tests/test-agentic-workflow-status.ps1`
  - `scripts/tests/test-work-package-status.ps1`
  - `scripts/tests/test-work-package-closeout-preflight.ps1`
  - `scripts/tests/test-work-package-validation-plan.ps1`
  - `docs/01-work-packages/WP-206-workflow-test-fixture-cleanup-hygiene.md`
- Upstream consumers:
  - contributors running workflow-helper test suites before audit or closeout
  - `scripts/get-work-package-status.ps1`
  - `scripts/check-work-package-closeout.ps1`
  - `scripts/get-sdk-manager-recommendation.ps1`
  - `scripts/get-sdk-manager-orchestration-dry-run.ps1`
- Downstream dependencies:
  - `scripts/lib/WorkPackageResolver.ps1`
  - existing fixture markdown section conventions
  - Git worktree isolation checks used by audit and finalization helpers

### Regression Surface
- Related tests:
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-recommendation.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-orchestration-dry-run.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-decision.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-status.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-work-package-status.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-work-package-closeout-preflight.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-work-package-validation-plan.ps1`
- User workflows:
  - running SDK manager/status tests before audit
  - running closeout preflight after test execution
  - preserving clean worktree isolation for AGY audit and accepted-WP finalization
- Security/data boundaries:
  - development-only test cleanup
  - no runtime AI
  - no live SDK/model calls
  - no external audit dispatch
  - no dependency installation
  - no app/database/package/lockfile changes
  - no graph baseline mutation
  - no broad destructive cleanup

### Graph Update Decision
- Regeneration required: No for this package.
- Rationale: The package should change only workflow tests and its WP record. Graph relationships are already structurally stale for workflow helper surfaces after WP-205, but this package does not need graph relationship evidence to implement narrow fixture cleanup. Create a separate focused graph-refresh package after this accepted test-hygiene change if future planning will rely on workflow-helper graph relationships again.

## Files Allowed to Change

Allowed:

- docs/01-work-packages/WP-206-workflow-test-fixture-cleanup-hygiene.md
- scripts/tests/test-sdk-manager-recommendation.ps1
- scripts/tests/test-sdk-manager-orchestration-dry-run.ps1
- scripts/tests/test-agentic-workflow-decision.ps1
- scripts/tests/test-agentic-workflow-status.ps1
- scripts/tests/test-work-package-status.ps1
- scripts/tests/test-work-package-closeout-preflight.ps1
- scripts/tests/test-work-package-validation-plan.ps1

Do Not Modify:

- apps/**
- database/**
- docs/00-ssot/**
- docs/01-work-packages/** except `docs/01-work-packages/WP-206-workflow-test-fixture-cleanup-hygiene.md`
- docs/05-development-workflow/**
- .codex/**
- .understand-anything/**
- tools/**
- scripts/*.ps1
- scripts/lib/**
- scripts/tests/** except the explicitly allowed test files
- package.json
- package-lock.json
- pyproject.toml
- requirements*.txt
- pnpm-lock.yaml
- yarn.lock
- outputs/**

## Constraints

- Keep this package narrow and test-only.
- Add no dependencies.
- Do not change production helper behavior or output contracts.
- Do not broaden cleanup to arbitrary user files or real work-package records.
- Cleanup may remove only deterministic temporary fixture filenames owned by the current test file or by explicitly documented legacy fixture patterns from the same test family.
- Preserve existing fixture coverage and assertions unless a test assertion is directly updated to prove cleanup hygiene.
- Keep all commands local and deterministic.
- Do not execute implementation, audit, acceptance, finalization, handoff refresh, commit, push, graph refresh, app startup, browser automation, live SDK/model calls, dependency installation, network calls, or destructive broad filesystem actions as part of the helper behavior.

## Required Behavior

- SDK manager recommendation tests must not leave `*-sdk-manager-*-temp.md` work-package fixtures in `docs/01-work-packages` after success or failure.
- SDK manager orchestration dry-run tests must not leave `*-sdk-manager-orchestration-*-temp.md` work-package fixtures in `docs/01-work-packages` after success or failure.
- Status, decision, validation-plan, and closeout tests that create temporary work-package fixtures must either:
  - clean their own deterministic fixture paths before and after the test, or
  - assert that their fixture allocation and `finally` cleanup leave no matching temp WP files behind.
- Tests must guard against pre-existing orphan fixture files from their own deterministic pattern before allocating new fixtures, without deleting unrelated WPs.
- Failure-path coverage must prove cleanup still runs when an assertion fails or a mocked command path returns a blocked/invalid result.
- The implementation must record a targeted `git status --short --untracked-files=all` check after running the relevant tests to prove no temporary WP fixtures remain.

## Acceptance Criteria

- [x] `scripts/tests/test-sdk-manager-recommendation.ps1` removes or rejects stale owned SDK manager temp WP fixtures before allocation and proves none remain after execution.
- [x] `scripts/tests/test-sdk-manager-orchestration-dry-run.ps1` removes or rejects stale owned orchestration temp WP fixtures before allocation and proves none remain after execution.
- [x] Status/decision/validation/closeout tests that create WP fixtures have deterministic cleanup or explicit no-orphan assertions for their own fixture patterns.
- [x] Cleanup logic is narrowly constrained to owned temp fixture filename patterns and cannot remove real work-package records.
- [x] Existing SDK manager recommendation and orchestration dry-run contract assertions remain covered.
- [x] Existing status, decision, validation-plan, work-package status, and closeout preflight assertions remain covered.
- [x] Tests cover at least one failure-path or blocked/invalid path while still proving cleanup occurs.
- [x] `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-recommendation.ps1` passes.
- [x] `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-orchestration-dry-run.ps1` passes.
- [x] `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-decision.ps1` passes.
- [x] `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-status.ps1` passes.
- [x] `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-work-package-status.ps1` passes.
- [x] `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-work-package-closeout-preflight.ps1` passes.
- [x] `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-work-package-validation-plan.ps1` passes.
- [ ] `git status --short --untracked-files=all` after validation shows only allowed WP-206 files changed and no generated temp WP fixtures.
- [x] `git diff --check` passes or records only known line-ending warnings.
- [x] No production helper, app, database, docs policy, graph baseline, SDK prototype, package, lockfile, dependency, output, runtime AI, external data, commit/push, or Case 004 progression change is introduced.

## Code Prompt

Implement WP-206 exactly as scoped.

Context:
- During WP-205 closeout, `scripts/tests/test-sdk-manager-recommendation.ps1` and `scripts/tests/test-sdk-manager-orchestration-dry-run.ps1` left generated `wp-97xx-sdk-manager-*-temp.md` files under `docs/01-work-packages` after interruption or failed cleanup, causing `get-work-package-status.ps1` and `check-work-package-closeout.ps1` to report mixed-worktree blockers.
- The fix should make the relevant tests self-cleaning and self-verifying, not change production lifecycle behavior.

Scope:
- Modify only the WP-206 record and the explicitly allowed test files.
- Do not modify production scripts, lifecycle docs, graph artifacts, app/database files, SDK prototype files, package files, lockfiles, or outputs.

Implementation guidance:
1. Identify deterministic temporary WP filename patterns owned by each allowed test.
2. Add narrow helper logic inside the relevant test files to remove or reject stale owned fixtures before allocation.
3. Ensure existing `finally` cleanup removes all allocated fixture paths with `-ErrorAction SilentlyContinue` where appropriate.
4. Add post-cleanup assertions that no owned temp WP fixture patterns remain in `docs/01-work-packages`.
5. Keep cleanup pattern-specific; do not delete arbitrary `WP-*.md` files or unrelated untracked files.
6. Preserve existing contract assertions and test coverage for SDK manager recommendation, orchestration dry-run, status, decision, validation-plan, work-package status, and closeout preflight behavior.
7. Record validation evidence and final `git status --short --untracked-files=all` in `Code Results`.

Validation:
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-recommendation.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-orchestration-dry-run.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-decision.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-status.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-work-package-status.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-work-package-closeout-preflight.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-work-package-validation-plan.ps1`
- `git status --short --untracked-files=all`
- `git diff --check`

Return:
- Summary of cleanup/guard changes.
- Validation results.
- Confirmation that no generated temp WP fixtures remain.
- Confirmation that no production helper, app, database, docs policy, graph baseline, SDK dependency, package/lockfile, runtime AI, external data, or Case 004 progression changes were made.

## Audit Prompt

Audit WP-206 against this work package and the actual repository diff.

Verify:
- Changes are limited to the allowed test files and the WP-206 record.
- Cleanup logic is narrowly constrained to each test's owned temp fixture filename patterns.
- No cleanup can delete real work-package records or arbitrary untracked files.
- SDK manager recommendation and orchestration tests cannot leave generated `*-sdk-manager-*-temp.md` or `*-sdk-manager-orchestration-*-temp.md` files behind after success, blocked/invalid paths, or assertion failure.
- Status/decision/validation/closeout tests that create WP fixtures either clean their own deterministic paths or assert no owned fixtures remain.
- Existing SDK manager, status, decision, validation-plan, work-package status, and closeout contract assertions remain intact.
- No production helper behavior, lifecycle policy, audit/finalization gate, SDK output contract, app/database behavior, graph baseline, dependency, package/lockfile, runtime AI, external data behavior, output artifact, or Case 004 progression changed.
- The audit applies the hardened audit stance from WP-202: adversarial contract-shape checks, execution-safety proof, negative-path probing, and explicit failure thresholds.

Output:
- Verdict: PASS, FAIL, or BLOCKED
- Violations
- Regressions
- Drift risks
- Required corrections

## Code Results

Implemented with one worktree isolation caveat.

Changes:
- Added owned-pattern pre-cleanup, final cleanup, and post-test no-orphan assertions to `scripts/tests/test-sdk-manager-recommendation.ps1` for `WP-####-sdk-manager-(planned|implemented|audited|accepted|rejected|deferred)-temp.md`.
- Added owned-pattern pre-cleanup, final cleanup, and post-test no-orphan assertions to `scripts/tests/test-sdk-manager-orchestration-dry-run.ps1` for `WP-####-sdk-manager-orchestration-planned-temp.md`.
- Added owned-pattern pre-cleanup, final cleanup, and post-test no-orphan assertions to `scripts/tests/test-agentic-workflow-decision.ps1` for `WP-####-agentic-decision-(planned|implemented|audited|accepted|rejected|deferred)-temp.md`.
- Added exact-path cleanup and post-test no-orphan assertions to `scripts/tests/test-work-package-status.ps1` for `WP-9996-status-temp.md` and `docs/wp-status-temp-out-of-scope.md`.
- Added exact-path cleanup and post-test no-orphan assertions to `scripts/tests/test-work-package-closeout-preflight.ps1` for `WP-9993-closeout-preflight-temp.md`.
- Added exact-path cleanup and post-test no-orphan assertions to `scripts/tests/test-work-package-validation-plan.ps1` for `WP-9995-validation-plan-temp.md`.
- Updated the closeout preflight fixture's allowed file list so the test can run while WP-206's allowed SDK manager and decision test files are dirty.

Validation:
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-recommendation.ps1`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-orchestration-dry-run.ps1`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-decision.ps1`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-status.ps1`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-work-package-status.ps1`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-work-package-closeout-preflight.ps1`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-work-package-validation-plan.ps1`
- PASS: targeted temp-fixture scan returned no generated SDK manager, orchestration, decision, status, validation-plan, or closeout-preflight temp WP fixtures.
- PASS with known line-ending warnings only: `git diff --check`

Worktree caveat:
- `git status --short --untracked-files=all` shows the WP-206 implementation files plus the pre-existing unrelated untracked `docs/01-work-packages/WP-207-script-directory-taxonomy-compatibility-shims.md`.
- Resolve WP-207's untracked state or explicitly authorize a mixed-worktree audit exception before running independent audit for WP-206.

Safety:
- No production helper, app, database, docs policy, graph baseline, SDK prototype, package, lockfile, dependency, output, runtime AI, external data, commit/push, or Case 004 progression change was introduced.

## Audit Results

I have launched `test-sdk-manager-recommendation.ps1` in the background and will inspect the test results and complete the audit once execution finishes.
I have launched `test-sdk-manager-orchestration-dry-run.ps1` and will wait for it to complete.
I have launched `test-agentic-workflow-decision.ps1` and will wait for it to complete.
I have launched `test-work-package-closeout-preflight.ps1` and will wait for it to complete.
I have created an artificial stale fixture (`WP-9999-sdk-manager-planned-temp.md`) to probe pre-test cleanup, and launched the test task. I will wait for it to complete.
### Audit Report: WP-206 (Workflow Test Fixture Cleanup Hygiene)

#### Verdict
**PASS**

---

### Audit Verification Summary

#### 1. Scope & Allowed File Boundaries
- **Verification**: Evaluated `git status --short --untracked-files=all` against the allowed files list in [WP-206-workflow-test-fixture-cleanup-hygiene.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-206-workflow-test-fixture-cleanup-hygiene.md#L83-L94).
- **Files Changed**:
  - `docs/01-work-packages/WP-206-workflow-test-fixture-cleanup-hygiene.md`
  - `scripts/tests/test-agentic-workflow-decision.ps1`
  - `scripts/tests/test-sdk-manager-orchestration-dry-run.ps1`
  - `scripts/tests/test-sdk-manager-recommendation.ps1`
  - `scripts/tests/test-work-package-closeout-preflight.ps1`
  - `scripts/tests/test-work-package-status.ps1`
  - `scripts/tests/test-work-package-validation-plan.ps1`
- **Result**: Exactly 6 test files modified and 1 WP record added. No production scripts, schemas, apps, database files, dependencies, graph baselines, or lifecycle policies were modified.

#### 2. Narrow Cleanup Logic & Safety Against Real Work Packages
- **Verification**: Evaluated cleanup regexes and deterministic literal paths across all modified test files:
  - [test-agentic-workflow-decision.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/tests/test-agentic-workflow-decision.ps1#L121): `^WP-\d{4}-agentic-decision-(planned|implemented|audited|accepted|rejected|deferred)-temp\.md$`
  - [test-sdk-manager-recommendation.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/tests/test-sdk-manager-recommendation.ps1#L169): `^WP-\d{4}-sdk-manager-(planned|implemented|audited|accepted|rejected|deferred)-temp\.md$`
  - [test-sdk-manager-orchestration-dry-run.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/tests/test-sdk-manager-orchestration-dry-run.ps1#L105): `^WP-\d{4}-sdk-manager-orchestration-planned-temp\.md$`
  - [test-work-package-status.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/tests/test-work-package-status.ps1#L10-L11): `WP-9996-status-temp.md` & `docs/wp-status-temp-out-of-scope.md`
  - [test-work-package-closeout-preflight.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/tests/test-work-package-closeout-preflight.ps1#L9): `WP-9993-closeout-preflight-temp.md`
  - [test-work-package-validation-plan.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/tests/test-work-package-validation-plan.ps1#L7): `WP-9995-validation-plan-temp.md`
- **Safety Proof**: Tested all cleanup patterns against all existing 206 real work-package records in `docs/01-work-packages`. 
- **Result**: Zero matches against real work packages. Real work packages use 3-digit numbering (`WP-###`) and lack `-temp.md` suffixes, ensuring real work-package records can never be matched or deleted.

#### 3. Execution Safety & Exception/Failure Path Cleanup (Hardened Audit Stance)
- **Verification**: Audited `try { ... } catch { $testFailure = $_ } finally { ... }` wrappers in each test file.
- **Negative-Path Probing**:
  - Inserted an artificial pre-existing stale temp file (`docs/01-work-packages/WP-9999-sdk-manager-planned-temp.md`).
  - Executed `test-sdk-manager-recommendation.ps1`.
- **Result**: Pre-test cleanup automatically cleared the stale fixture before allocation, the test passed, and post-test assertions confirmed zero leftover temp fixtures. Exception handling guarantees `finally` cleanup and post-test no-orphan assertions execute before re-throwing test errors.

#### 4. Test Suite Execution & Assertion Preservation
- **Verification**: Executed all 7 relevant workflow test suites in the local environment:
  - `test-sdk-manager-recommendation.ps1`: **PASS**
  - `test-sdk-manager-orchestration-dry-run.ps1`: **PASS**
  - `test-agentic-workflow-decision.ps1`: **PASS**
  - `test-agentic-workflow-status.ps1`: **PASS**
  - `test-work-package-status.ps1`: **PASS**
  - `test-work-package-closeout-preflight.ps1`: **PASS**
  - `test-work-package-validation-plan.ps1`: **PASS**
- **Formatting/Diff Hygiene**: Executed `git diff --check`. Returned exit code `0` with only standard CRLF line-ending warnings.

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

Accepted on 2026-07-26.

Human reviewer accepted WP-206 after implementation evidence and independent audit PASS. The package hardens workflow test fixture cleanup so owned temporary work-package files are removed before and after relevant tests, preserves existing workflow-helper behavior, and introduces no production helper, app, database, docs policy, graph baseline, SDK prototype, package, lockfile, dependency, output, runtime AI, external data, commit/push, or Case 004 progression changes.

