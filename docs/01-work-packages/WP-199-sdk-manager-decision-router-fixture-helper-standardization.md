# WP-199: SDK Manager And Decision Router Fixture Helper Standardization

## Objective

Standardize the development-workflow test fixture helper pattern shared by the decision-router and SDK manager recommendation tests so temporary work-package fixtures are collision-resistant, easier to maintain, and behaviorally equivalent across both test suites without adding OpenAI Agents SDK execution, runtime AI, dependencies, network calls, or production routing changes.

## Scope

### In Scope

- Update `scripts/tests/test-agentic-workflow-decision.ps1` to avoid fixed temporary WP names such as `WP-9992` through `WP-9997`.
- Preserve the WP-198 collision-resistant temporary fixture allocation pattern used by `scripts/tests/test-sdk-manager-recommendation.ps1`.
- Standardize helper naming, route metadata shape, fixture allocation, fixture lookup, fail-before-overwrite checks, deterministic cleanup, and readable fixture titles across the two workflow test files.
- Optionally add a tiny PowerShell test-helper file under `scripts/tests/` only if it reduces meaningful duplication without making the tests harder to read or changing production behavior.
- Optionally update `scripts/tests/test-sdk-manager-recommendation.ps1` if needed to align helper contracts after the decision-router test is hardened.
- Keep all fixture files lifecycle-compatible with existing work-package resolver behavior.

### Out of Scope

- Installing, importing, invoking, or documenting live use of OpenAI Agents SDK.
- Live SDK/model calls.
- Runtime AI behavior.
- Network calls.
- External data transmission.
- Browser automation.
- MCP calls.
- Production wrapper behavior changes.
- Decision-router, status-bundle, SDK manager wrapper, audit runner, closeout preflight, commit helper, or work-package resolver production behavior changes.
- App runtime, API, route, UI, database, schema, migration, or Case 004 progression changes.
- Package manifests, lockfiles, Python dependency files, Node dependency files, or PowerShell module dependency changes.
- Graph refresh or `.understand-anything/**` artifact changes.
- Broad refactoring of unrelated tests.

## Impact Analysis

### Understand Status

- Graph available: Yes. `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, and `.understand-anything/meta.json` are present.
- Baseline commit: `4b26996fe50a90779c46f92aeddd4111808544c3`.
- Freshness assessment: Structurally stale for this development-workflow tooling surface. Accepted work since the baseline includes repo-local skill updates, workflow lifecycle scripts, Understand refresh wrappers, agentic workflow status and decision-router commands, SDK manager recommendation command work, and fixture-matrix test changes through WP-198.
- Analysis performed: Used the graph only as stale orientation. Verified the active surface with source search and direct inspection of `scripts/tests/test-agentic-workflow-decision.ps1`, `scripts/tests/test-sdk-manager-recommendation.ps1`, `scripts/get-agentic-workflow-decision.ps1`, `scripts/get-agentic-workflow-status.ps1`, `scripts/get-sdk-manager-recommendation.ps1`, and recent work packages WP-197 and WP-198.

### Affected Architecture

- Layers: development workflow tests, agentic workflow test contracts.
- Primary files/components:
  - `scripts/tests/test-agentic-workflow-decision.ps1`
  - `scripts/tests/test-sdk-manager-recommendation.ps1`
  - optional: a new `scripts/tests/*fixture*.ps1` helper file if a shared helper is justified by the implementation.
  - `docs/01-work-packages/WP-199-sdk-manager-decision-router-fixture-helper-standardization.md`
- Upstream consumers:
  - Human contributors running workflow test suites.
  - Future SDK manager and decision-router implementation WPs.
  - Audit agents validating temporary fixture cleanup and scope isolation.
- Downstream dependencies:
  - `scripts/get-agentic-workflow-decision.ps1`
  - `scripts/get-agentic-workflow-status.ps1`
  - `scripts/get-sdk-manager-recommendation.ps1`
  - `scripts/get-work-package-status.ps1`
  - work-package resolver behavior for `WP-###` shorthand and lifecycle sections.

### Regression Surface

- Related tests:
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-decision.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-recommendation.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-agentic-workflow-decision.ps1 -WorkPackage WP-199 -Json -SkipUnderstandReadiness`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-sdk-manager-recommendation.ps1 -WorkPackage WP-199 -Json -SkipUnderstandReadiness`
  - `git diff --check`
  - `git status --short --untracked-files=all`
- User workflows:
  - Running decision-router and SDK manager workflow tests repeatedly without fixed temporary fixture-name collisions.
  - Keeping temporary work-package fixture tests isolated from real project WP numbering.
  - Preparing later SDK manager orchestration work with reliable deterministic test scaffolding.
- Security/data boundaries:
  - No runtime AI.
  - No live SDK/model calls.
  - No external data transmission.
  - No dependency installation.
  - No app, database, restricted-table, answer-key, student-data, or spoiler-boundary changes.

### Graph Update Decision

- Regeneration required: No for this package.
- Rationale: This is a narrow development-workflow test-helper package over source-inspected PowerShell tests. It must not change application architecture, imports, database structure, Case 004 progression, or tracked graph artifacts. The graph is already stale for workflow tooling, so implementation must rely on direct source inspection rather than graph relationships.

## Files Allowed to Change

Allowed:

- docs/01-work-packages/WP-199-sdk-manager-decision-router-fixture-helper-standardization.md
- scripts/tests/test-agentic-workflow-decision.ps1
- scripts/tests/test-sdk-manager-recommendation.ps1
- scripts/tests/*fixture*.ps1
- docs/00-ssot/END-OF-DAY-HANDOFF.md

Do Not Modify:

- apps/**
- database/**
- docs/00-ssot/** except `docs/00-ssot/END-OF-DAY-HANDOFF.md` during accepted closeout
- docs/05-development-workflow/**
- .understand-anything/**
- tools/openai-agents-prototype/**
- scripts/get-agentic-workflow-decision.ps1
- scripts/get-agentic-workflow-status.ps1
- scripts/get-sdk-manager-recommendation.ps1
- scripts/get-work-package-status.ps1
- scripts/check-work-package-closeout.ps1
- scripts/run-work-package.ps1
- scripts/audit-work-package.ps1
- scripts/commit-work-package.ps1
- scripts/WorkPackageResolver.ps1
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
- Do not change app runtime, database behavior, package manifests, lockfiles, prototype source, production workflow commands, or graph artifacts.
- Do not change decision-router, status-bundle, SDK manager wrapper, work-package resolver, audit runner, closeout preflight, or commit helper behavior.
- Shared helper extraction is optional, not required. Prefer clear local helper standardization over a shared helper if extraction would increase coupling or reduce readability.
- Temporary fixture files must be removed by tests even when assertions fail.
- Tests must fail before overwrite if any generated fixture path unexpectedly exists.
- Preserve existing test assertions and route coverage unless a current assertion is proven redundant and the same behavior remains covered.

## Required Behavior

- Decision-router temporary work-package fixtures no longer use fixed `WP-9992` through `WP-9997` filenames.
- Decision-router and SDK manager tests use a consistent fixture route model for planned, implemented, audited, accepted, rejected, and deferred lifecycle states.
- Temporary fixture IDs are generated in a high-numbered range that avoids current project WP numbers and avoids the legacy fixed fixture ranges used by earlier tests.
- Generated fixture filenames remain compatible with existing `WP-###` shorthand resolution and use readable route labels.
- Both tests pre-check generated fixture paths and fail before writing if a collision is detected.
- Both tests remove all generated temporary fixture files in a `finally` cleanup path.
- Existing graph artifact hash checks and transient Understand artifact checks remain active where they exist.
- Snapshot-only test coverage remains guarded and does not become a production input path.

## Acceptance Criteria

- [ ] `scripts/tests/test-agentic-workflow-decision.ps1` no longer depends on fixed temporary fixture IDs `WP-9992` through `WP-9997`.
- [ ] Decision-router and SDK manager fixture allocation behavior is standardized enough that future test additions can follow one obvious pattern.
- [ ] Temporary fixture allocation is collision-resistant, fail-before-overwrite, lifecycle-compatible, and deterministic to clean up.
- [ ] Existing decision-router and SDK manager route coverage remains intact.
- [ ] No production workflow script behavior changes.
- [ ] No OpenAI Agents SDK execution, runtime AI, dependencies, network calls, external data transmission, app changes, database changes, package changes, lockfile changes, prototype-source changes, or graph artifact changes.
- [ ] Validation commands listed in the regression surface pass or any limitation is recorded in `Code Results`.
- [ ] No unrelated files changed.

## Code Prompt

Implement WP-199 exactly as scoped.

Context:
- WP-198 hardened `scripts/tests/test-sdk-manager-recommendation.ps1` by replacing fixed SDK manager fixture IDs with collision-resistant generated temporary work-package fixtures.
- `scripts/tests/test-agentic-workflow-decision.ps1` still uses fixed `WP-9992` through `WP-9997` fixture IDs.
- The goal is to standardize the fixture helper pattern across both tests while staying dependency-free and development-only.

Scope:
- Modify only the files listed under `Allowed`.
- Prefer a narrow local-helper update in the existing test files.
- Add a small shared helper under `scripts/tests/*fixture*.ps1` only if it clearly reduces duplication without changing production behavior or making the tests harder to audit.

Required implementation:
- Replace fixed decision-router temporary fixture IDs with generated high-numbered fixture IDs.
- Preserve route labels for planned, implemented, audited, accepted, rejected, and deferred states.
- Preserve lifecycle-compatible filenames and `WP-###` shorthand resolution.
- Preserve fail-before-overwrite behavior and deterministic cleanup.
- Preserve current decision-router and SDK manager test assertions.
- Keep graph hash and transient artifact checks intact where present.

Validation:
- Run `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-decision.ps1`.
- Run `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-recommendation.ps1`.
- Run `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-agentic-workflow-decision.ps1 -WorkPackage WP-199 -Json -SkipUnderstandReadiness`.
- Run `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-sdk-manager-recommendation.ps1 -WorkPackage WP-199 -Json -SkipUnderstandReadiness`.
- Run `git diff --check`.
- Run `git status --short --untracked-files=all`.

Return:
- Summary of changed helper behavior.
- Validation results.
- Confirmation that no production scripts, runtime AI, dependencies, graph artifacts, app files, or database files changed.

## Audit Prompt

Audit WP-199 against this work package and the actual repository diff.

Verify:
- `scripts/tests/test-agentic-workflow-decision.ps1` no longer relies on fixed `WP-9992` through `WP-9997` temporary fixture IDs.
- Decision-router and SDK manager tests now use a consistent collision-resistant fixture helper pattern.
- Temporary fixture paths are pre-checked before write and cleaned up in a `finally` path.
- Generated fixture filenames remain lifecycle-compatible and readable.
- Existing route coverage and assertions remain behaviorally equivalent.
- No production workflow scripts changed.
- No OpenAI Agents SDK execution, runtime AI, dependency, network, external data, app, database, package, lockfile, prototype-source, or graph artifact change was introduced.
- Validation evidence in `Code Results` is sufficient and matches the changed files.
- The stale Understand graph was not used as authoritative evidence.

Output:
- Verdict: PASS or FAIL
- Violations
- Regressions
- Drift risks
- Required corrections

## Code Results

Implemented.

Changes:

- Updated `scripts/tests/test-agentic-workflow-decision.ps1` to replace fixed temporary fixture files `WP-9992` through `WP-9997` with generated per-run work-package fixture objects.
- Added the same local helper pattern used by the SDK manager recommendation test: `$tempFixtures`, `New-TemporaryWorkPackageFixtures`, `Get-FixtureByRoute`, route metadata, high-numbered contiguous fixture allocation, readable generated titles, fail-before-overwrite checks, and `finally` cleanup through `$tempWpPaths`.
- Preserved decision-router route coverage for repository-only, planned, implemented, audited, accepted, rejected, deferred, blocked snapshot, manual-review snapshot, invalid-WP, and text-output cases.
- Left `scripts/tests/test-sdk-manager-recommendation.ps1` unchanged because its WP-198 helper pattern already matched the standardized route model and no shared helper extraction was justified for two scripts.
- Did not add shared helper files, dependencies, SDK execution, runtime AI, network calls, external data transmission, production script changes, app changes, database changes, package changes, lockfile changes, prototype-source changes, or graph artifact changes.

Validation:

- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-decision.ps1`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-recommendation.ps1`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-agentic-workflow-decision.ps1 -WorkPackage WP-199 -Json -SkipUnderstandReadiness`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-sdk-manager-recommendation.ps1 -WorkPackage WP-199 -Json -SkipUnderstandReadiness`
- PASS: `git diff --check` with CRLF warnings only.
- PASS: `git status --short --untracked-files=all` showed only WP-199 scoped files.

Implementation note:

- The wrapper validation commands were rerun serially after fixture-test cleanup. A concurrent early run observed temporary fixture files while the fixture tests were still executing, which correctly produced a mixed-worktree blocker; no temporary files remained after test cleanup.

## Audit Results

I have set a timer to monitor the background test execution of `test-agentic-workflow-decision.ps1`. Once notified of completion, I will verify the final test output and complete the audit response.
I am waiting for `test-sdk-manager-recommendation.ps1` to finish running in the background.
I am waiting for `test-sdk-manager-recommendation.ps1` to finish running in the background.
### Verdict
**PASS**

---

### Verification Summary

1. **Fixed Fixture ID Replacement**:
   - [scripts/tests/test-agentic-workflow-decision.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/tests/test-agentic-workflow-decision.ps1#L292-L344) no longer references fixed temporary IDs `WP-9992` through `WP-9997`.
   - Dynamic fixture allocation is handled via `New-TemporaryWorkPackageFixtures`, selecting random base IDs in the `9000-9780` range.

2. **Consistent Fixture Helper Pattern**:
   - Decision-router tests now share the standardized helper model established in WP-198 for [scripts/tests/test-sdk-manager-recommendation.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/tests/test-sdk-manager-recommendation.ps1#L292-L344): `New-TemporaryWorkPackageFixtures`, `Get-FixtureByRoute`, route-based metadata, and high-numbered allocation.

3. **Pre-Check and Deterministic Cleanup**:
   - Both test suites verify generated fixture paths do not pre-exist (`Test-Path -LiteralPath`) before writing contents and enforce cleanup of all `$tempWpPaths` within a `finally` block.

4. **Lifecycle & Resolvability Compatibility**:
   - Fixture filenames (`WP-####-agentic-decision-$route-temp.md`) maintain standard `WP-###` shorthand resolution and include human-readable route labels and titles.

5. **Behavioral Assertion Equivalence**:
   - Route coverage across `planned`, `implemented`, `audited`, `accepted`, `rejected`, `deferred`, repository-only, guarded/unguarded mocked snapshots, invalid WPs, and CLI text output remains behaviorally identical.

6. **Scope Isolation**:
   - No production scripts (`scripts/get-*.ps1`, `scripts/WorkPackageResolver.ps1`, `scripts/audit-work-package.ps1`, etc.) were modified.

7. **Zero Prohibited Changes**:
   - No OpenAI Agents SDK execution, runtime AI, network calls, dependency packages/lockfiles, app code, database files, or `.understand-anything` graph artifacts were modified or introduced. Graph artifact SHA256 integrity checks remained intact and verified.

8. **Validation Evidence**:
   - Empirical runtime execution of all validation scripts succeeded cleanly:
     - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-decision.ps1` (PASS)
     - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-recommendation.ps1` (PASS)
     - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-agentic-workflow-decision.ps1 -WorkPackage WP-199 -Json -SkipUnderstandReadiness` (PASS)
     - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-sdk-manager-recommendation.ps1 -WorkPackage WP-199 -Json -SkipUnderstandReadiness` (PASS)
     - `git diff --check` (PASS - line ending warning only)
     - `git status --short --untracked-files=all` (PASS - scoped files only)

9. **Authoritative Evidence Usage**:
   - Direct source inspection and live test executions were used for verification; stale Understand graph artifacts were not treated as authoritative.

---

### Violations
- None.

---

### Regressions
- None.

---

### Drift Risks
- None.

---

### Required Corrections
- None.

## Final Decision

Accepted on 2026-07-25 after AntiGravity audit PASS, closeout preflight confirmation, and human acceptance for WP-199 finalization.

