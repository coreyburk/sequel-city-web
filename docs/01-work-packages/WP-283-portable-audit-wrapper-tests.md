# Portable audit wrapper tests

## Objective

Make the audit runner and wrapper regression tests pass in clean checkouts at arbitrary paths, including temporary clones and directories containing spaces, while retaining their audit-output normalization assertions.

## Scope

### In Scope
- Replace the two mock audit output file URIs that hardcode D:/GitHub-Repos/SequelCityWeb with correctly encoded URIs derived from the active test checkout.
- Retain assertions that in-repository file links normalize to repository-relative Markdown links.
- Approved scope expansion: decode URI path escapes before filesystem comparison in the existing audit-link normalizer.
- Validate both scripts in the primary checkout and a committed clean temporary clone located under a directory containing spaces.
- Refresh the generated graph after implementation and refresh the live handoff at closeout.

### Out of Scope
- Runtime application changes, audit runner behavior changes beyond URI decoding, authorization policy changes, and general test-harness refactoring.
- Fixing unrelated test failures or modifying WP-280, WP-281, or WP-282.

## Impact Analysis

### Understand Status
- Analysis tier: Recommended; test-harness correction.
- Graph available: Yes; graph, fingerprints, metadata, and scan inventory exist.
- Baseline commit: 7b675bd097416365e4c525d6f1f51f4adab8787c; planning HEAD: 9237261.
- Freshness assessment: Structurally stale for lifecycle tooling. Cumulative changes since baseline include scripts/work-package/run-work-package.ps1 and the isolation test, as well as application progression changes.
- Analysis performed: Narrow graph node lookup confirms both test files are inventoried. Current source is authoritative: hardcoded mock URIs occur at test-run-work-package-audit-runner.ps1:295 and test-audit-work-package-wrapper.ps1:258; nearby assertions require repository-relative links.

### Affected Architecture
- Layers: Development workflow tests and generated analysis artifacts.
- Primary files/components: The two audit regression scripts.
- Upstream consumers: PowerShell test invocation, independent auditors, and clean-clone validation workflows.
- Downstream dependencies: Existing runner/wrapper entry points and output normalization; the runner normalizer is the sole approved implementation exception.

### Regression Surface
- Related tests: scripts/tests/test-run-work-package-audit-runner.ps1; scripts/tests/test-audit-work-package-wrapper.ps1; scripts/tests/test-run-work-package-isolation.ps1.
- User workflows: Developer checkout, independent audit clone, paths with spaces, and parser-safe audit results.
- Security/data boundaries: Use mock auditors only for regression validation. Preserve isolation and external-audit authorization assertions; no real external invocation without authorization.

### Graph Update Decision
- Regeneration required: Yes after implementation, using scripts/refresh-understand-graph.ps1. This package owns the refresh needed for cumulative lifecycle drift; review the four tracked artifacts and run readiness checks. Do not change graph tooling or dependencies.

## Files Allowed to Change

Allowed:
- scripts/tests/test-run-work-package-audit-runner.ps1
- scripts/tests/test-audit-work-package-wrapper.ps1
- scripts/work-package/run-work-package.ps1
- docs/01-work-packages/WP-283-portable-audit-wrapper-tests.md
- docs/00-ssot/END-OF-DAY-HANDOFF.md
- .understand-anything/knowledge-graph.json
- .understand-anything/fingerprints.json
- .understand-anything/meta.json
- .understand-anything/intermediate/scan-result.json

The handoff file is closeout-only. Graph artifacts are generated refresh output only.

Do Not Modify:
- apps/**
- database/**
- scripts/work-package/audit-work-package.ps1
- scripts/work-package/commit-work-package.ps1
- scripts/lib/**
- docs/01-work-packages/WP-280-correct-case-001-completion-guidance.md
- docs/01-work-packages/WP-281-case-001-foundation-first-step.md
- docs/01-work-packages/WP-282-audit-runner-clean-worktree-null-normalization.md

## Constraints

- No new dependencies, shared abstractions, or audit policy changes.
- Preserve all existing assertions and test cleanup behavior.
- Simplicity check: Use the existing repository-root variable and native System.Uri conversion; avoid a new helper framework. Escape the generated mock script safely and retain literal variables used by its existing encoding checks.

## Required Behavior

1. Derive mock file URIs from the actual checkout root, with correct encoding for spaces and platform path separators.
2. Keep the expected normalized Markdown links repository-relative.
3. Run both scripts from a clean checkout; preserve their authorization, isolation, heading-normalization, and encoding coverage.
4. Run both scripts again from a clean committed temporary clone with spaces in its path. Preserve primary-checkout changes during setup.
5. Record validation and graph refresh evidence in this WP.

## Acceptance Criteria

- [ ] Neither mock fixture contains a machine-specific repository path.
- [ ] Both scripts pass in the primary checkout and clean temporary clone with spaces.
- [ ] Relative-link, heading, and encoding assertions remain meaningful and pass.
- [ ] Existing isolation regression passes; no gate was weakened.
- [ ] Graph refresh and readiness validation succeed with only the four allowed generated artifacts changed.
- [ ] Scoped diff check passes; no unrelated files changed.

## Code Prompt

Implement the scoped portability correction using existing root variables and native URI handling. Preserve assertions; do not solve portability by relaxing normalization expectations or isolation gates. Validate both scripts in the primary checkout and committed clean clone with spaces, run the isolation regression, refresh the graph, and record actual outcomes. Leave audit and final decision pending.

## Audit Prompt

Independently audit the diff against this scope. Verify both checkout contexts and paths with spaces, parser-safe fixture generation, unchanged normalization and authorization assertions, graph refresh evidence, and scoped diff cleanliness. Report Verdict: PASS or FAIL, violations, regressions, and drift risks. Do not accept the WP on the human's behalf.

## Code Results

Implemented checkout-derived mock review URIs with native System.Uri.AbsoluteUri in both audit test fixtures. Targeted placeholder replacement preserves the single-quoted mock script templates and their literal encoding-test variables. Existing assertions remain unchanged.

The human approved a narrow scope expansion for scripts/work-package/run-work-package.ps1 after the initial spaces-path test exposed a normalization defect. Normalize-AuditProseArtifacts now decodes URI escapes with System.Uri.UnescapeDataString inside the existing guarded conversion before filesystem comparison. No isolation, authorization, dispatch, or application behavior was changed.

Validation:
- PASS: test-run-work-package-audit-runner.ps1 and test-audit-work-package-wrapper.ps1 in the primary checkout after the decoding fix. Untracked planning records were preserved temporarily outside isolation checks and restored afterward.
- PASS: all three scripts (runner, wrapper, isolation) in committed clean clone C:/Users/cburk/AppData/Local/Temp/WP283 verified dbadd4e1c957414eb6bb5b8e1a9ba25d/clean checkout. This includes encoded spaces, repository-relative link assertions, heading/encoding checks, authorization, mixed-worktree blocking, and explicit override coverage.
- PASS: prior clean-clone run without spaces; initial primary-checkout isolation run before the runner change also passed.
- Primary-checkout isolation reruns after graph refresh were blocked at their allowed-file assertion by checkout/preflight interference. The identical test passes in the committed clean clone; no assertion or gate was bypassed to force a primary result. Preserve this limitation in independent review.
- PASS: graph refreshed again after the runner correction at baseline HEAD 9237261, with 671 files, 1086 nodes, and 415 edges. Four allowed artifacts refreshed.

- PASS: scripts/check-understand-refresh-readiness.ps1 reported READY after the final refresh, with no temporary, trash, or log artifacts.
- PASS: git diff --check after the final correction.

Final local validation is complete. Independent audit and human acceptance remain pending. WP-284 was preserved unchanged; no commit or push performed.
## Audit Results

Verdict: PASS

---

### Scope & Verification Summary

| Verification Target | Requirement | Finding / Verification Result | Status |
| :--- | :--- | :--- | :--- |
| **Path Portability & Spaces** | Dynamic URIs, paths with spaces | Verified via dedicated clean clone in path containing spaces (`.../scratch/clone with spaces`). Runner, wrapper, and isolation tests passed with exit code 0. | **PASS** |
| **Parser-Safe Fixture Generation** | Single-quoted templates, placeholder token substitution | [`test-audit-work-package-wrapper.ps1`](scripts/tests/test-audit-work-package-wrapper.ps1#L245-L263) and [`test-run-work-package-audit-runner.ps1`](scripts/tests/test-run-work-package-audit-runner.ps1#L282-L303) use `@'...'@.Replace('__MOCK_REVIEW_URI__', $mockReviewUri)`. Literal PowerShell variables (`$Print`, `$mojibakeDash`, etc.) are preserved unexpanded at fixture creation. | **PASS** |
| **Link & Heading Normalization** | Retain repo-relative link and heading normalization | [`Normalize-AuditProseArtifacts`](scripts/work-package/run-work-package.ps1#L1351-L1377) decodes URI escapes with `[System.Uri]::UnescapeDataString(...)` before canonicalization and `StartsWith` comparison. All assertions verifying markdown links, heading demotions, and mojibake dash conversions remain unchanged and passing. | **PASS** |
| **Authorization Assertions** | External audit authorization gate checks preserved | The authorization gate assertion (`Blocker type:\s*external audit not authorized`) in [`test-audit-work-package-wrapper.ps1`](scripts/tests/test-audit-work-package-wrapper.ps1#L240-L243) is unchanged and passing. | **PASS** |
| **Checkout Contexts** | Clean clone and primary checkout behavior | Tested clean clone under spaces path: all 3 test scripts exited with code 0. In the dirty primary checkout, worktree isolation correctly blocks audit execution on out-of-scope dirty files as designed. | **PASS** |
| **Graph Refresh Evidence** | Tracked artifacts refreshed and readiness checks pass | Refreshed at baseline commit `9237261c87af0e5fbc42408ba0dc4dba1322b4b7` with 671 analyzed files, 1086 nodes, and 415 edges. [`scripts/check-understand-refresh-readiness.ps1`](scripts/check-understand-refresh-readiness.ps1) returns `READY` with 0 temporary/trash/log artifacts. | **PASS** |
| **Scoped Diff Cleanliness** | Diff restricted to allowed files | Git diff touches strictly the 7 allowed files (2 test scripts, 1 runner script, 4 `.understand-anything` graph artifacts) plus the untracked [`WP-283-portable-audit-wrapper-tests.md`](docs/01-work-packages/WP-283-portable-audit-wrapper-tests.md). Zero prohibited files touched. `git diff --check` passes cleanly. | **PASS** |

---

### Violations
**None detected.**
- No prohibited paths (`apps/**`, `database/**`, `scripts/work-package/audit-work-package.ps1`, `scripts/work-package/commit-work-package.ps1`, `scripts/lib/**`, or prior WPs) were modified.
- No external dependencies or unnecessary abstractions were introduced.
- Scope expansion into [`scripts/work-package/run-work-package.ps1`](scripts/work-package/run-work-package.ps1#L1360) was explicitly authorized and strictly limited to URI unescaping (`[System.Uri]::UnescapeDataString`).

---

### Regressions
**None detected.**
- All existing assertions for heading demotion, mojibake dash sanitization, `file:///` URI conversion to relative paths, and authorization gate rejection were preserved verbatim.
- Worktree isolation gates in [`scripts/tests/test-run-work-package-isolation.ps1`](scripts/tests/test-run-work-package-isolation.ps1) continue to pass.

---

### Drift Risks & Observations

1. **Primary Checkout In-Flight Test Execution**:
   Because `WP-9999` in [`scripts/tests/test-run-work-package-audit-runner.ps1`](scripts/tests/test-run-work-package-audit-runner.ps1#L200-L215) defines an explicit allowed file list that omits `scripts/tests/test-run-work-package-audit-runner.ps1` itself, executing this test in a working tree where `test-run-work-package-audit-runner.ps1` has uncommitted modifications will trigger worktree isolation blocking (`mixed worktree detected`). This is an expected artifact of isolation enforcement during local test file editing, but worth keeping in mind during iterative test development.
2. **Sibling Directory Prefix Matching in Normalizer**:
   In [`Normalize-AuditProseArtifacts`](scripts/work-package/run-work-package.ps1#L1367), `StartsWith($projectRootFull)` does not append a trailing separator to `$projectRootFull`. If a checkout root were `C:\Repo` and a reviewed link pointed to `C:\Repo-other\file.txt`, `StartsWith` would match. In practice, repository paths are distinctive, but ensuring path boundary delineation (e.g., ensuring a trailing slash or directory comparison) is a minor potential hygiene improvement for future normalizer refactorings.

---

> [!NOTE]
> Per work package audit policy, **acceptance of [WP-283](docs/01-work-packages/WP-283-portable-audit-wrapper-tests.md) is not granted on the human's behalf** and remains pending human decision.


## Final Decision

Accepted by the human on 2026-10-08 after independent AntiGravity audit PASS. Portable fixtures, URI decoding, clean-clone regression coverage, and graph refresh are approved for commit and push.

