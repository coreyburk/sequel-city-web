# WP-198: SDK Manager Fixture Helper Hardening

## Objective

Harden the SDK manager recommendation test fixture utilities so temporary work-package fixture names are collision-resistant and helper code is easier to reuse locally, without adding SDK execution, runtime AI, dependencies, network calls, or production routing changes.

## Scope

### In Scope

- Update `scripts/tests/test-sdk-manager-recommendation.ps1` to avoid fixed temporary WP names such as `WP-9981` through `WP-9986`.
- Generate a per-run collision-resistant temporary WP number range or unique suffix while preserving lifecycle helper compatibility.
- Keep temporary fixture creation, assertion, cleanup, graph-hash checks, and transient-artifact checks deterministic.
- Improve local test-helper structure only inside `scripts/tests/test-sdk-manager-recommendation.ps1` if needed for clarity.
- Optionally apply the same collision-hardening pattern to `scripts/tests/test-agentic-workflow-decision.ps1` if it can be done narrowly and without changing production behavior.
- Optionally add a short note to `OpenAI-Agents-SDK-Orchestration-Readiness.md` only if the fixture-helper contract needs documentation for future SDK manager test work.

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
- Changing manager wrapper behavior unless a narrow test-helper hardening issue exposes a wrapper defect.
- Changing `scripts/get-agentic-workflow-decision.ps1` or `scripts/get-agentic-workflow-status.ps1`.
- Creating a shared test module unless it is strictly necessary; prefer scoped local helpers for this WP.

## Impact Analysis

### Understand Status

- Graph available: Yes. `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, and `.understand-anything/meta.json` are present.
- Baseline commit: `4b26996fe50a90779c46f92aeddd4111808544c3`.
- Freshness assessment: Structurally stale for this workflow-tooling surface. Accepted changes since the baseline include repo-local skills, workflow scripts, workflow tests, graph refresh wrappers, agentic status and decision-router commands, SDK manager transition planning, the SDK manager recommendation wrapper, and real-state SDK manager fixture tests.
- Analysis performed: Used the graph baseline only as stale orientation. Verified the active surface directly with source search and inspection of `scripts/tests/test-sdk-manager-recommendation.ps1`, `scripts/tests/test-agentic-workflow-decision.ps1`, `scripts/get-sdk-manager-recommendation.ps1`, and `docs/01-work-packages/WP-197-sdk-manager-real-state-fixture-matrix.md`.

### Affected Architecture

- Layers: development workflow tests, agentic workflow test contracts.
- Primary files/components:
  - `scripts/tests/test-sdk-manager-recommendation.ps1`
  - optional: `scripts/tests/test-agentic-workflow-decision.ps1`
  - optional: `docs/05-development-workflow/OpenAI-Agents-SDK-Orchestration-Readiness.md`
  - `docs/01-work-packages/WP-198-sdk-manager-fixture-helper-hardening.md`
- Upstream consumers:
  - Future SDK manager test hardening WPs.
  - Human contributors running workflow test suites.
  - Audit agents verifying temporary fixture cleanup and no persistent artifacts.
- Downstream dependencies:
  - `scripts/get-sdk-manager-recommendation.ps1`
  - `scripts/get-agentic-workflow-decision.ps1`
  - `scripts/get-work-package-status.ps1`
  - `scripts/check-work-package-closeout.ps1`
  - temporary fixture behavior under `docs/01-work-packages`

### Regression Surface

- Related tests:
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-recommendation.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-decision.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-sdk-manager-recommendation.ps1 -WorkPackage WP-198 -Json -SkipUnderstandReadiness`
  - `git diff --check`
  - `git status --short --untracked-files=all`
- User workflows:
  - Running SDK manager recommendation tests repeatedly without fixed fixture-name collisions.
  - Keeping temporary work-package fixture tests isolated from real project WP numbering.
  - Preparing later SDK manager orchestration work with reliable deterministic tests.
- Security/data boundaries:
  - No runtime AI.
  - No live SDK/model calls.
  - No external data transmission.
  - No dependency installation.
  - No app, database, restricted-table, answer-key, student-data, or spoiler-boundary changes.

### Graph Update Decision

- Regeneration required: No for this package.
- Rationale: This is a narrow development-workflow test-helper hardening package over source-inspected PowerShell tests. It must not modify graph artifacts.

## Files Allowed to Change

Allowed:

- docs/01-work-packages/WP-198-sdk-manager-fixture-helper-hardening.md
- scripts/tests/test-sdk-manager-recommendation.ps1
- scripts/tests/test-agentic-workflow-decision.ps1
- docs/05-development-workflow/OpenAI-Agents-SDK-Orchestration-Readiness.md
- docs/00-ssot/END-OF-DAY-HANDOFF.md

Do Not Modify:

- apps/**
- database/**
- docs/00-ssot/** except `docs/00-ssot/END-OF-DAY-HANDOFF.md` during accepted closeout
- .understand-anything/**
- tools/openai-agents-prototype/**
- scripts/get-sdk-manager-recommendation.ps1
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
- Do not change manager wrapper behavior or decision-router/status routing.
- Temporary fixture files must be removed by tests even when assertions fail.
- Tests must fail before overwrite if a generated fixture path unexpectedly exists.
- Tests must not leave `.understand-anything/tmp`, `.trash-*`, logs, or temporary work-package fixtures behind.
- Keep test-only fixture injection guarded and separate from public/contributor usage.

## Required Behavior

- Replace fixed SDK manager temporary WP names with collision-resistant names.
- Collision-resistant naming must:
  - remain compatible with lifecycle helper WP resolution.
  - avoid collisions with existing real WPs and common high-numbered fixture ranges.
  - fail before overwrite if a generated path already exists.
  - preserve clear route names in fixture titles.
- Refactor helper code only as needed to keep fixture generation and cleanup understandable.
- Preserve all existing SDK manager recommendation route assertions.
- Preserve graph artifact hash checks and transient Understand artifact checks.
- Do not modify production manager or decision-router scripts.

## Acceptance Criteria

- [x] SDK manager recommendation tests no longer depend on fixed `WP-9981` through `WP-9986` filenames.
- [x] Generated fixture names remain resolvable by `scripts/get-sdk-manager-recommendation.ps1 -WorkPackage <fixture-id> -Json -SkipUnderstandReadiness`.
- [x] Tests fail before overwriting any existing file if a generated collision occurs.
- [x] Fixture cleanup remains deterministic in a `finally` block.
- [x] Graph artifact hash checks and transient Understand artifact checks still run.
- [x] Existing SDK manager recommendation route coverage remains intact.
- [x] Existing decision-router fixture tests still pass.
- [x] No production wrapper, decision-router, status, app, database, package, lockfile, prototype source, graph, runtime AI, dependency, network, or SDK execution changes are introduced.

## Code Prompt

Implement WP-198 exactly as scoped.

Primary task:

- Harden temporary fixture helper behavior in `scripts/tests/test-sdk-manager-recommendation.ps1` so it no longer relies on fixed `WP-9981` through `WP-9986` filenames.

Implementation requirements:

- Generate collision-resistant temporary WP identifiers that still match the repository's `WP-###-slug.md` helper conventions.
- Keep the fixture matrix readable by preserving route labels such as planned, implemented, audited, accepted, rejected, and deferred.
- Ensure tests fail before overwriting any existing generated fixture path.
- Keep cleanup in a `finally` block.
- Keep graph hash checks and transient Understand artifact checks.
- Do not change `scripts/get-sdk-manager-recommendation.ps1`, `scripts/get-agentic-workflow-decision.ps1`, or `scripts/get-agentic-workflow-status.ps1`.
- Only update `scripts/tests/test-agentic-workflow-decision.ps1` if applying the same pattern is narrow and clearly reduces collision risk.
- Update documentation only if needed.

Validation to run and record in Code Results:

- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-recommendation.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-decision.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-sdk-manager-recommendation.ps1 -WorkPackage WP-198 -Json -SkipUnderstandReadiness`
- `git diff --check`
- `git status --short --untracked-files=all`

Record:

- Exact files changed.
- Fixture naming strategy implemented.
- Whether decision-router tests were also hardened.
- Validation results.
- Confirmation that no SDK dependency, runtime AI, network behavior, app code, database files, package files, lockfiles, prototype source, production scripts, or graph artifacts changed.

## Audit Prompt

Audit WP-198 against the work package, source diff, tests, and validation evidence.

Verify:

- SDK manager recommendation tests no longer depend on fixed `WP-9981` through `WP-9986` filenames.
- Generated fixture IDs remain compatible with lifecycle helper resolution.
- Tests fail before overwriting any generated collision.
- Fixture cleanup remains deterministic.
- Graph artifact and transient Understand artifact checks are preserved.
- Existing manager recommendation coverage remains intact.
- Existing decision-router fixture tests still pass.
- No production wrapper, decision-router, status, SDK dependency, runtime AI, model call, network call, MCP call, browser automation, dependency installation, graph refresh, app change, database change, package change, lockfile change, or prototype-source change was introduced.
- No files outside the allowed list changed.
- Impact analysis matches the actual changed files.
- Graph regeneration decision was followed.

Output:

- Verdict: PASS or FAIL
- Violations
- Regressions
- Drift risks
- Required corrections

## Code Results

Implemented WP-198.

Files changed:

- `scripts/tests/test-sdk-manager-recommendation.ps1`
- `docs/01-work-packages/WP-198-sdk-manager-fixture-helper-hardening.md`

Fixture naming strategy implemented:

- Replaced fixed SDK manager fixture paths (`WP-9981` through `WP-9986`) with per-run generated fixture IDs.
- Added `New-TemporaryWorkPackageFixtures`, which allocates a six-WP contiguous high-numbered range between `WP-9000` and `WP-9779`.
- Avoided the prior common fixed fixture ranges (`WP-998x` and `WP-999x`).
- Preserved lifecycle-helper-compatible identifiers and filenames in the form `WP-####-sdk-manager-<route>-temp.md`.
- Preserved readable route labels in fixture titles and slugs: planned, implemented, audited, accepted, rejected, and deferred.
- Preserved fail-before-overwrite behavior by checking every generated fixture path before writing.
- Preserved deterministic cleanup through the existing `finally` block over generated paths.

Decision-router tests:

- `scripts/tests/test-agentic-workflow-decision.ps1` was not changed. Applying the same pattern there is possible but not required for WP-198 because the requested highest-ROI correction was the SDK manager fixture collision risk introduced by WP-197.

Validation:

- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-recommendation.ps1`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-decision.ps1`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-sdk-manager-recommendation.ps1 -WorkPackage WP-198 -Json -SkipUnderstandReadiness`
- PASS: `git diff --check` with CRLF warnings only.
- PASS: `git status --short --untracked-files=all` showed only WP-198 allowed files.

Scope confirmation:

- No OpenAI Agents SDK dependency was installed or invoked.
- No runtime AI, model call, network behavior, MCP call, browser automation, app code, database file, package file, lockfile, prototype source, graph artifact, production script, external-data transmission, or dependency change was introduced.

## Audit Results

Waiting for the background test suite execution to finish. The system will resume automatically once complete.
Waiting for `test-agentic-workflow-decision.ps1` to finish. Execution will resume automatically.
# Audit Summary: WP-198 (SDK Manager Fixture Helper Hardening)

Audit completed for [WP-198-sdk-manager-fixture-helper-hardening.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-198-sdk-manager-fixture-helper-hardening.md) against the work package, source diff, runtime test execution, and validation evidence.

---

### Key Verification Results

1. **Collision-Resistant Fixture Naming**:
   - Fixed fixture IDs `WP-9981` through `WP-9986` were replaced in [test-sdk-manager-recommendation.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/tests/test-sdk-manager-recommendation.ps1#L292-L330) with `New-TemporaryWorkPackageFixtures`.
   - Generates per-run high-numbered identifiers (`WP-9000` through `WP-9779`) matching the standard `WP-####-sdk-manager-<route>-temp.md` naming convention.

2. **Lifecycle Resolution Compatibility**:
   - Generated fixture IDs remain fully resolvable by `scripts/get-sdk-manager-recommendation.ps1 -WorkPackage <fixture-id> -Json -SkipUnderstandReadiness`.

3. **Collision Safety (Fail-Before-Overwrite)**:
   - Candidate paths are checked using `Test-Path` before creation. Pre-execution checks throw explicitly if any generated fixture path unexpectedly exists.

4. **Deterministic Cleanup & Artifact Integrity**:
   - All temporary fixture paths are registered in `$tempWpPaths` and deterministically removed inside a `finally` block. Post-test `git status` confirmed zero leftover temporary files.
   - Graph artifact SHA-256 hash checks (`Get-FileHashMap`) and transient Understand artifact checks (`Test-NoUnderstandTransientArtifacts`) remain active and passed.

5. **Test Suite Matrix**:
   - `scripts/tests/test-sdk-manager-recommendation.ps1`: `PASS SDK manager recommendation contract checks`
   - `scripts/tests/test-agentic-workflow-decision.ps1`: `PASS agentic workflow decision-router fixture matrix checks`

6. **Scope & Constraint Enforcements**:
   - No production wrapper, decision-router, status, app, database, package manifest, lockfile, prototype source, graph, or runtime AI/SDK dependency changes were introduced.
   - Actual changed files (`scripts/tests/test-sdk-manager-recommendation.ps1` and `docs/01-work-packages/WP-198-sdk-manager-fixture-helper-hardening.md`) are a strict subset of the allowed file list.

---

### Audit Output

- **Verdict**: PASS
- **Violations**: None.
- **Regressions**: None.
- **Drift risks**: None.
- **Required corrections**: None.
The background search task for legacy Codex logs has completed. The audit for **WP-198** remains **PASS** with all verification criteria fully satisfied.
All background tasks have completed. The WP-198 audit verdict remains **PASS**.

## Final Decision

Accepted on 2026-07-25 after AntiGravity audit PASS, closeout preflight confirmation, and human acceptance for WP-198 finalization.

