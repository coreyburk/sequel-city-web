# Audit runner clean-worktree null normalization

## Objective

Allow a clean worktree to pass the work-package audit isolation preflight and reach the selected audit authorization or dispatch path without a PowerShell null-array binding error.

## Scope

Correct the runner's clean-worktree handling and add a regression check for the empty modified-file set.

### In Scope
- Normalize the empty result from `git status --porcelain` before it is passed to isolation and scope-report functions.
- Preserve mixed-worktree blocking, `-AllowMixedWorktree`, audit authorization, and result-writing behavior.
- Extend the existing work-package isolation test to cover the clean-worktree path.
- Refresh `docs/00-ssot/END-OF-DAY-HANDOFF.md` during closeout only; it is not part of implementation scope.

### Out of Scope
- Changes to Case 001 runtime behavior, database contents, or student-facing guidance.
- Changes to audit policy, external-audit authorization, or worktree isolation rules.
- Refactors of unrelated lifecycle helpers or introduction of dependencies.

## Impact Analysis

### Understand Status
- Graph available: Yes; `.understand-anything/knowledge-graph.json`, `fingerprints.json`, `meta.json`, and `intermediate/scan-result.json` are present.
- Baseline commit: `7b675bd097416365e4c525d6f1f51f4adab8787c`.
- Freshness assessment: Structurally stale for lifecycle scripts because accepted changes after the baseline touch `scripts/**`; source inspection is authoritative for this narrow correction.
- Analysis performed: Traced `Get-GitModifiedFiles`, `Test-WorktreeIsolation`, `Invoke-ExecutionStep`, and the existing isolation regression script. A clean `git status --porcelain` produces no pipeline output, which becomes `$null` when assigned and violates the non-nullable `ModifiedFiles` parameter before AntiGravity dispatch.

### Affected Architecture
- Layers: Development workflow tooling and PowerShell regression tests.
- Primary files/components: `scripts/work-package/run-work-package.ps1`; `scripts/tests/test-run-work-package-isolation.ps1`.
- Upstream consumers: `scripts/audit-work-package.ps1`, `scripts/work-package/audit-work-package.ps1`, and the top-level runner shim.
- Downstream dependencies: AntiGravity/Gemini isolation checks and parser-safe audit result recording.

### Regression Surface
- Related tests: `scripts/tests/test-run-work-package-isolation.ps1`, plus parser and audit-wrapper checks in `scripts/tests/`.
- User workflows: clean-worktree audit, mixed-worktree block, intentional mixed-worktree override, and unauthorized external-audit block.
- Security/data boundaries: preserve the pre-dispatch isolation gate and never invoke an external auditor when scope is blocked or authorization is absent.

### Graph Update Decision
- Regeneration required: No for this narrow repair; the graph is already structurally stale from prior lifecycle-script drift, and this change uses direct source/test evidence rather than graph relationships. Track a separate graph-refresh package when the stale tooling surface is next refreshed.

## Files Allowed to Change

Allowed:

- `scripts/work-package/run-work-package.ps1`
- `scripts/tests/test-run-work-package-isolation.ps1`
- `docs/01-work-packages/WP-282-audit-runner-clean-worktree-null-normalization.md`
- `docs/00-ssot/END-OF-DAY-HANDOFF.md`

The handoff file is allowed for closeout refresh only; it is not part of implementation scope.

Do Not Modify:

- `apps/**`
- `database/**`
- `docs/01-work-packages/WP-280-correct-case-001-completion-guidance.md`
- `docs/01-work-packages/WP-281-case-001-foundation-first-step.md`
- `.understand-anything/**`

## Constraints

- Preserve existing behavior unless explicitly changing it.
- No architectural changes.
- No renaming outside scope.
- No speculative improvements.
- No "while we're here" changes.
- Do not weaken isolation or external-audit authorization gates.

## Required Behavior

- `Get-GitModifiedFiles` and its call sites must represent a clean worktree as an empty string array, not `$null`.
- A clean AntiGravity or Gemini preflight must reach its existing authorization/dispatch logic without parameter-binding failure.
- Existing mixed-worktree blocking and explicit `-AllowMixedWorktree` behavior must remain unchanged.
- The regression test must exercise the empty modified-file path and retain current mixed-worktree and authorization checks.

## Acceptance Criteria

- [ ] Clean worktree audit preflight no longer throws `ParameterArgumentValidationError` for `ModifiedFiles`.
- [ ] Existing isolation tests pass, including blocked mixed worktrees and explicit override behavior.
- [ ] Unauthorized external audit remains blocked before dispatch.
- [ ] No unrelated files changed.

## Code Prompt

Implement the required behavior exactly as specified.

Scope:
- Only modify the allowed files.

Constraints:
- No refactors.
- No new dependencies.
- Preserve all existing behavior.
- Treat empty `git status --porcelain` output as an empty collection at the producer and/or call sites so mandatory array parameters receive a valid value.

Return:
- Exact code changes.
- Short summary of what was implemented.

## Audit Prompt

Audit this change against the work package.

Verify:
- All acceptance criteria are satisfied.
- No files outside allowed list were modified.
- No functional regression.
- Behavior remains consistent outside scope.
- Impact analysis matches the actual changed files.
- Dependencies and related tests were not omitted.
- Graph regeneration decision was followed.
- Understand output did not override SSOT or source evidence.
- A clean worktree reaches the existing authorization/dispatch branch, while mixed worktrees still block before an auditor is invoked.

Output:
- Verdict: PASS or FAIL.
- Violations.
- Regressions.
- Drift risks.

## Code Results

Implemented in `scripts/work-package/run-work-package.ps1` by returning one typed empty string array from `Get-GitModifiedFiles` and assigning it directly at both call sites. Added a clean-clone AntiGravity regression path to `scripts/tests/test-run-work-package-isolation.ps1`; the clean-clone setup now skips the commit when the copied runner is already clean, and the allowed-file audit path keeps the isolation gate active. Existing mixed-worktree blocking, override, and authorization checks remain covered.

Validation:
- PASS: `powershell -ExecutionPolicy Bypass -File scripts/tests/test-run-work-package-isolation.ps1` from a clean temporary clone.
- PASS: scoped `git diff --check` for the WP-282 implementation, test, and work-package files.

## Audit Results

### Independent Audit Report: WP-282 Clean-Worktree Null Normalization

- **Work Package**: [WP-282-audit-runner-clean-worktree-null-normalization.md](docs/01-work-packages/WP-282-audit-runner-clean-worktree-null-normalization.md)
- **Target Commit**: [`fc3bed0`]() (`prepare WP-282 audit scope`)
- **Auditor**: AntiGravity Independent Auditor

---

### Verification Summary

| Dimension | Evaluated Source & Test Evidence | Finding | Status |
|---|---|---|---|
| **1. Acceptance Criteria** | [`run-work-package.ps1`](scripts/work-package/run-work-package.ps1#L981-L983) and [`test-run-work-package-isolation.ps1`](scripts/tests/test-run-work-package-isolation.ps1#L233-L272) | Returning `,([string[]]$modifiedFiles.ToArray())` prevents PowerShell pipeline unrolling into `$null`. A clean worktree supplies a valid empty array to [`Format-WorktreeIsolationBlock`](scripts/work-package/run-work-package.ps1#L1083-L1086), eliminating `ParameterArgumentValidationError`. Clean and mixed paths pass all assertions. | **PASS** |
| **2. Allowed Files Scope** | `git diff --name-only HEAD~1 HEAD` | Exactly 3 files modified, all within the allowed list: [`WP-282`](docs/01-work-packages/WP-282-audit-runner-clean-worktree-null-normalization.md), [`test-run-work-package-isolation.ps1`](scripts/tests/test-run-work-package-isolation.ps1), and [`run-work-package.ps1`](scripts/work-package/run-work-package.ps1). No files in `apps/**`, `database/**`, or `.understand-anything/**` were touched. | **PASS** |
| **3. Functional Regression** | Automated test suite execution across tooling scripts | Zero functional regressions. Regression tests passed: `test-run-work-package-isolation.ps1`, `test-work-package-status.ps1`, `test-work-package-validation-plan.ps1`, `test-work-package-closeout-preflight.ps1`, `test-agentic-workflow-status.ps1`, and `test-agentic-workflow-decision.ps1`. | **PASS** |
| **4. Consistency Outside Scope** | [`run-work-package.ps1`](scripts/work-package/run-work-package.ps1#L1885-L1936) | Parameter signatures for runner shims remain unchanged. Implementation execution for Codex and Claude, prompt extraction, and result parsing remain untouched. Non-empty modified-file behavior returns identical path lists. | **PASS** |
| **5. Impact Analysis Accuracy** | [WP-282 Impact Analysis](docs/01-work-packages/WP-282-audit-runner-clean-worktree-null-normalization.md#L22-L43) | Accurately identifies affected layers (workflow tooling and test scripts), primary files, upstream consumers, downstream dependencies, and security boundaries. | **PASS** |
| **6. Dependencies & Related Tests** | [`test-run-work-package-isolation.ps1`](scripts/tests/test-run-work-package-isolation.ps1#L233-L272) | Dedicated clean-clone regression test was added to exercise the empty modified-file path through [`scripts/audit-work-package.ps1`](scripts/audit-work-package.ps1) with mock dispatch verification. No dependencies omitted. | **PASS** |
| **7. Graph Regeneration Decision** | [`.understand-anything/`](.understand-anything) | Decision ("No for this narrow repair") was strictly followed; no graph artifacts were modified. | **PASS** |
| **8. SSOT / Source Evidence Authority** | [`run-work-package.ps1`](scripts/work-package/run-work-package.ps1) | Source evidence and direct PowerShell language runtime semantics governed the repair without deferring to stale graph data. | **PASS** |
| **9. Worktree Gating & Dispatch Behavior** | [`Test-WorktreeIsolation`](scripts/work-package/run-work-package.ps1#L1152-L1175) & lines [1887-1912](scripts/work-package/run-work-package.ps1#L1887-L1912) | A clean worktree produces `Passed = $true` and proceeds directly to the authorization check (`-AllowExternalAudit`) and dispatch logic. A mixed worktree produces `Passed = $false` and halts immediately with `Blocker type: mixed worktree` before invoking an auditor or checking authorization. | **PASS** |

---

### Output

#### Verdict: PASS

The change satisfies all acceptance criteria, enforces expected worktree isolation behavior, and stays strictly within the authorized scope.

#### Violations
- **None**. All modified files match the allowed list in [WP-282](docs/01-work-packages/WP-282-audit-runner-clean-worktree-null-normalization.md#L44-L60), and no prohibited files were touched.

#### Regressions
- **None detected**. Core lifecycle test suites passed:
  - `scripts/tests/test-run-work-package-isolation.ps1`: PASS
  - `scripts/tests/test-work-package-status.ps1`: PASS
  - `scripts/tests/test-work-package-validation-plan.ps1`: PASS
  - `scripts/tests/test-work-package-closeout-preflight.ps1`: PASS
  - `scripts/tests/test-agentic-workflow-status.ps1`: PASS
  - `scripts/tests/test-agentic-workflow-decision.ps1`: PASS

#### Drift Risks
1. **Preexisting hardcoded paths in legacy wrapper tests**: Tests in [`test-run-work-package-audit-runner.ps1`](scripts/tests/test-run-work-package-audit-runner.ps1#L295) and [`test-audit-work-package-wrapper.ps1`](scripts/tests/test-audit-work-package-wrapper.ps1#L258) retain preexisting hardcoded mock URIs (`D:/GitHub-Repos/SequelCityWeb/...`), which fail when executed outside that specific drive root. They do not affect the runner itself or [`test-run-work-package-isolation.ps1`](scripts/tests/test-run-work-package-isolation.ps1), but should be parameterized in a future test-maintenance work package.
2. **Stale Understand knowledge graph**: `.understand-anything` remains structurally stale with respect to lifecycle scripts following recent tooling updates. This was explicitly documented as out-of-scope for WP-282 and should be refreshed in a dedicated graph-update work package.

## Final Decision

Accepted. AntiGravity independently audited the corrected implementation as PASS, and the clean-clone isolation regression passed after the audit corrections.




