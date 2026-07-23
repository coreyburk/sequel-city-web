# WP-191: Agentic Workflow Status Bundle Command

## Objective

Add a read-only workflow status bundle command that gives a human or future development-time agentic orchestrator one reliable snapshot of repository state, work-package lifecycle state, validation-plan state, closeout readiness, and Understand refresh readiness.

## Scope

### In Scope

- Add a PowerShell script that composes existing read-only helper outputs into one text or JSON report.
- Support optional work-package input using the same identifier forms already accepted by the existing lifecycle helpers.
- Include git state needed for agentic workflow decisions: branch, short HEAD, remote URL summary, dirty file list, and whether the working tree is clean.
- Include component status for:
  - work-package lifecycle status
  - work-package validation plan
  - closeout preflight
  - Understand refresh readiness
- Preserve component failures as structured report data instead of masking them.
- Add focused script tests for JSON shape, text output, read-only behavior, optional work-package handling, and blocked component capture.
- Update development workflow documentation so the bundle command becomes the first status check before agentic orchestration decisions.

### Out of Scope

- Implementing an OpenAI Agents SDK orchestration manager.
- Installing dependencies or changing package manifests or lockfiles.
- Running AntiGravity, Gemini, Codex subagents, audits, commits, pushes, or graph refreshes from the new command.
- Changing existing helper behavior in:
  - `scripts/get-work-package-status.ps1`
  - `scripts/get-work-package-validation-plan.ps1`
  - `scripts/check-work-package-closeout.ps1`
  - `scripts/check-understand-refresh-readiness.ps1`
- Regenerating or modifying `.understand-anything` graph artifacts.
- Changing application runtime code, database scripts, Case 004 progression, UI, API, or release packaging.

## Impact Analysis

### Understand Status

- Graph available: Yes. `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, and `.understand-anything/meta.json` are present.
- Baseline commit: `4b26996fe50a90779c46f92aeddd4111808544c3`.
- Freshness assessment: Usable with tooling drift for this planning task. Accepted changes since the baseline touched repo-local planning skills, workflow docs, Understand graph artifacts, and development scripts. That makes the graph structurally stale for detailed script relationships, but the planned package is narrow and source inspection of the current scripts is the controlling evidence.
- Analysis performed: Read SSOT workflow, work-package lifecycle, Understand analysis guidance, current handoff, graph metadata, recent commits, changed paths since baseline, existing lifecycle helper references, orchestration readiness docs, and current helper script names/contracts. Used targeted graph search only to confirm that lifecycle helper scripts and workflow docs are represented in the baseline.

### Affected Architecture

- Layers: Development tooling only; documentation only for workflow guidance.
- Primary files/components:
  - `scripts/get-agentic-workflow-status.ps1`
  - `scripts/tests/test-agentic-workflow-status.ps1`
  - `docs/05-development-workflow/OpenAI-Agents-SDK-Orchestration-Readiness.md`
  - `docs/05-development-workflow/Contributor-Workflow-Guide.md`
  - `docs/01-work-packages/WP-191-agentic-workflow-status-bundle-command.md`
- Upstream consumers:
  - Human contributors deciding the next work-package action.
  - Future development-time OpenAI Agents SDK prototype or manager.
  - Codex skills and handoff workflows that need a compact preflight snapshot.
- Downstream dependencies:
  - `git` CLI for repository state.
  - Existing read-only helper scripts for lifecycle, validation, closeout, and Understand readiness.
  - PowerShell JSON output via `ConvertTo-Json`.

### Regression Surface

- Related tests:
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-status.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-agentic-workflow-status.ps1 -WorkPackage WP-191`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-agentic-workflow-status.ps1 -WorkPackage WP-191 -Json`
  - `powershell -NoProfile -Command "[scriptblock]::Create((Get-Content -Raw scripts/get-agentic-workflow-status.ps1)) | Out-Null"`
  - `git diff --check`
- User workflows:
  - Start-of-task status inspection.
  - Pre-implementation, pre-audit, and pre-closeout work-package triage.
  - Future development-time agentic orchestration preflight.
- Security/data boundaries:
  - The command must be read-only.
  - The command must not transmit data externally.
  - The command must not invoke AntiGravity, Gemini, Codex, OpenAI APIs, or browser automation.
  - The command must not expose runtime secrets, database credentials, answer keys, or restricted table data.

### Graph Update Decision

- Regeneration required: No for this work package.
- Rationale: The planned change is development-tooling-only and can be validated through direct source inspection and focused script tests. It must not mutate graph artifacts. Graph drift should remain visible as a reported status input where practical, and future structural tooling expansion can be paired with a graph refresh package.

## Files Allowed to Change

Allowed:

- `docs/01-work-packages/WP-191-agentic-workflow-status-bundle-command.md`
- `scripts/get-agentic-workflow-status.ps1`
- `scripts/tests/test-agentic-workflow-status.ps1`
- `docs/05-development-workflow/OpenAI-Agents-SDK-Orchestration-Readiness.md`
- `docs/05-development-workflow/Contributor-Workflow-Guide.md`
- `docs/00-ssot/END-OF-DAY-HANDOFF.md`

Do Not Modify:

- `.understand-anything/**`
- `.codex/skills/**`
- `apps/**`
- `database/**`
- `docs/00-ssot/**` except `docs/00-ssot/END-OF-DAY-HANDOFF.md`
- `package.json`
- `package-lock.json`
- `tools/**`
- `scripts/get-work-package-status.ps1`
- `scripts/get-work-package-validation-plan.ps1`
- `scripts/check-work-package-closeout.ps1`
- `scripts/check-understand-refresh-readiness.ps1`
- `scripts/run-work-package.ps1`
- `scripts/audit-work-package.ps1`
- `scripts/commit-work-package.ps1`

## Constraints

- Keep the command read-only.
- Preserve existing helper behavior and contracts.
- Do not duplicate work-package identifier resolution logic when an existing helper can resolve the identifier.
- Do not treat a component failure as a successful component result.
- Do not make the aggregate command require a work package when the caller only needs repository-level status.
- Do not add new dependencies.
- Do not change app runtime behavior.
- Do not run external audits, code agents, commits, pushes, or mutating graph refreshes.

## Required Behavior

- Add `scripts/get-agentic-workflow-status.ps1`.
- Parameters:
  - `-WorkPackage <string>` optional.
  - `-Json` optional.
  - `-SkipUnderstandReadiness` optional for environments where Understand plugin readiness should not be probed.
  - `-Strict` optional, causing a non-zero exit when any captured component reports a non-zero exit code or blocked state.
- Default text output must summarize repository state and component states in a compact human-readable format.
- JSON output must include, at minimum:
  - `generatedAt`
  - `repository`
  - `git.branch`
  - `git.head`
  - `git.isClean`
  - `git.dirtyFiles`
  - `workPackage.input`
  - `workPackage.available`
  - `components.workPackageStatus`
  - `components.validationPlan`
  - `components.closeoutPreflight`
  - `components.understandReadiness`
  - `overall.state`
  - `overall.blockers`
  - `overall.nextAction`
- If `-WorkPackage` is provided, invoke existing helpers with `-Json` and capture each helper's parsed JSON, raw output on parse failure, and exit code.
- If `-WorkPackage` is omitted, do not run work-package-specific helpers; mark those components as skipped with a clear reason.
- Unless `-SkipUnderstandReadiness` is provided, invoke `scripts/check-understand-refresh-readiness.ps1 -Json` and capture its parsed JSON, raw output on parse failure, and exit code.
- The default non-strict mode should return exit code `0` when the bundle script itself completed and captured all requested component outcomes, even when a component reports blocked/non-ready status.
- `-Strict` should return non-zero when a component exits non-zero, reports a blocked lifecycle state, reports readiness failure, or cannot be parsed.
- Tests must confirm the command does not modify tracked graph artifacts, create `.understand-anything/tmp`, create `.trash-*`, or create Understand log files.

## Acceptance Criteria

- [x] `scripts/get-agentic-workflow-status.ps1` exists and supports text and JSON output.
- [x] The command can run without `-WorkPackage` and returns repository-level status with work-package components marked skipped.
- [x] The command can run with `-WorkPackage WP-191` and delegates to existing lifecycle helpers.
- [x] JSON output contains the required top-level and nested fields.
- [x] Component failures or blocked states are visible in the report and can produce non-zero exit only under `-Strict`.
- [x] `-SkipUnderstandReadiness` avoids invoking Understand readiness while preserving a clear skipped component.
- [x] Script tests cover text output, JSON output, work-package input, skipped work-package components, strict/non-strict component handling, and read-only graph-artifact behavior.
- [x] Documentation identifies the bundle command as the recommended first snapshot before future agentic orchestration decisions.
- [x] No existing helper script behavior is changed.
- [x] No application, database, package, lockfile, graph artifact, audit runner, work-package runner, commit helper, or repo-local skill files are modified.
- [x] The live handoff may be refreshed during accepted closeout because repo policy requires handoff refresh before every accepted-WP commit and push.

## Code Prompt

Implement WP-191 exactly as specified.

Scope:

- Add `scripts/get-agentic-workflow-status.ps1`.
- Add `scripts/tests/test-agentic-workflow-status.ps1`.
- Update only the allowed development workflow docs.
- Update this work package's `Code Results` with the changed files and verification evidence.

Implementation guidance:

- Compose existing read-only helper scripts rather than reimplementing their lifecycle logic.
- Capture helper exit code, parsed JSON when available, raw output when JSON parsing fails, and concise component state.
- Keep default output human-readable and compact.
- Keep `-Json` output deterministic enough for tests.
- Make `-Strict` the only mode that fails the aggregate command for captured component blockers.
- Ensure tests do not depend on network access, external audit agents, OpenAI APIs, or mutating graph refresh.

Validation commands:

- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-status.ps1`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-agentic-workflow-status.ps1 -WorkPackage WP-191`
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-agentic-workflow-status.ps1 -WorkPackage WP-191 -Json`
- `powershell -NoProfile -Command "[scriptblock]::Create((Get-Content -Raw scripts/get-agentic-workflow-status.ps1)) | Out-Null"`
- `git diff --check`
- `git status --short --untracked-files=all`

Return:

- Exact files changed.
- Verification results.
- Any limitations or skipped validation.

## Audit Prompt

Audit WP-191 against the work package and SSOT.

Verify:

- The new command is read-only and does not invoke external agents, OpenAI APIs, commits, pushes, audits, or graph mutation.
- It composes existing helper outputs instead of duplicating or changing their lifecycle logic.
- Work-package shorthand and path handling are delegated through existing helper scripts when `-WorkPackage` is provided.
- Text and JSON outputs include repository, git, component, and overall state.
- Component failures are represented truthfully and `-Strict` controls aggregate non-zero behavior.
- `-SkipUnderstandReadiness` is documented and tested.
- Tests cover the required behavior and do not rely on external services.
- Documentation updates are limited to development workflow guidance.
- No files outside the allowed list were modified.
- Graph regeneration decision was followed.

Output:

- Verdict: PASS or FAIL
- Violations
- Regressions
- Drift risks
- Required corrections

## Code Results

Implemented.

Changed files:

- `scripts/get-agentic-workflow-status.ps1`
- `scripts/tests/test-agentic-workflow-status.ps1`
- `docs/05-development-workflow/OpenAI-Agents-SDK-Orchestration-Readiness.md`
- `docs/05-development-workflow/Contributor-Workflow-Guide.md`
- `docs/01-work-packages/WP-191-agentic-workflow-status-bundle-command.md`

Implementation summary:

- Added a read-only agentic workflow status bundle command.
- The command reports repository root, branch, short HEAD, origin remote, dirty files, work-package input status, component states, overall state, blockers, and next action.
- The command composes existing helper JSON outputs instead of changing or duplicating their lifecycle logic.
- Work-package-specific helpers are skipped when no `-WorkPackage` value is provided.
- Understand readiness can be skipped with `-SkipUnderstandReadiness`; otherwise the command captures the existing readiness preflight result.
- Non-strict mode returns `0` when the aggregate command captures component outcomes, even when a component is blocked.
- `-Strict` returns non-zero when a captured component fails, blocks, or cannot be parsed.
- Documentation now identifies the bundle command as the first read-only snapshot for future development-time agentic orchestration decisions.

Validation:

- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-status.ps1`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-agentic-workflow-status.ps1 -WorkPackage WP-191`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-agentic-workflow-status.ps1 -WorkPackage WP-191 -Json`
- PASS: `powershell -NoProfile -Command "[scriptblock]::Create((Get-Content -Raw scripts/get-agentic-workflow-status.ps1)) | Out-Null"`
- PASS: `git diff --check` with existing CRLF normalization warnings only
- PASS: `git status --short --untracked-files=all` showed only WP-191 allowed files

Notes:

- The status bundle reported `closeoutPreflight: Blocked` before this `Code Results` section was recorded because the closeout preflight correctly requires implementation evidence before audit readiness.
- No `.understand-anything` graph artifacts, transient tmp/trash/log artifacts, app runtime files, database files, package manifests, lockfiles, audit runners, work-package runners, commit helpers, or repo-local skill files were modified.
- Post-audit closeout update: added `docs/00-ssot/END-OF-DAY-HANDOFF.md` to the allowed closeout scope because project policy requires a live handoff refresh before every accepted-WP commit and push.

## Audit Results

# Audit Report: WP-191

## Verdict
**PASS**

---

## Audit Verification Summary

1. **Read-Only Operation & Safety Boundary**
   - Verified that [get-agentic-workflow-status.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/get-agentic-workflow-status.ps1) is strictly read-only.
   - It performs read-only `git` state queries (`status`, `branch`, `rev-parse`, `remote get-url`) and delegates to existing read-only PowerShell helper scripts.
   - It does not invoke external subagents, OpenAI APIs, commits, pushes, audits, browser automation, or graph mutations.

2. **Helper Script Composition**
   - Composes [get-work-package-status.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/get-work-package-status.ps1), [get-work-package-validation-plan.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/get-work-package-validation-plan.ps1), [check-work-package-closeout.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/check-work-package-closeout.ps1), and [check-understand-refresh-readiness.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/check-understand-refresh-readiness.ps1) via `-Json` parameters.
   - Preserves existing helper lifecycle contracts without duplicating or altering helper logic.

3. **Shorthand & Path Delegation**
   - The `-WorkPackage` parameter is passed directly to existing helpers without custom path resolution, relying on established lifecycle resolution.

4. **Output Completeness (Text & JSON)**
   - Includes repository root, git state (`branch`, `head`, `remote`, `isClean`, `dirtyFiles`), component breakdown (`workPackageStatus`, `validationPlan`, `closeoutPreflight`, `understandReadiness`), and overall aggregate evaluation (`state`, `blockers`, `nextAction`).

5. **Truthful Error Handling & Aggregate Non-Zero Exit**
   - Preserves unparsed outputs and helper failures as structured component state (`status: Blocked`, `state: Unparsed`) rather than masking exceptions.
   - Default execution returns exit code `0` for complete state reporting, while `-Strict` mode raises exit code `2` when component blockers exist.

6. **`-SkipUnderstandReadiness` Verification**
   - Documented in [Contributor-Workflow-Guide.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/05-development-workflow/Contributor-Workflow-Guide.md).
   - Validated via script tests to ensure the readiness check is bypassed cleanly without blocking overall status.

7. **Test Coverage & External Service Independence**
   - [test-agentic-workflow-status.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/tests/test-agentic-workflow-status.ps1) executes offline without relying on network or external APIs.
   - Covers text output, JSON schema, missing `-WorkPackage` handling, `-SkipUnderstandReadiness`, strict/non-strict exit modes, and zero graph artifact mutation.

8. **Documentation Scope**
   - Changes are strictly limited to development workflow guidance:
     - [Contributor-Workflow-Guide.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/05-development-workflow/Contributor-Workflow-Guide.md)
     - [OpenAI-Agents-SDK-Orchestration-Readiness.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/05-development-workflow/OpenAI-Agents-SDK-Orchestration-Readiness.md)

9. **File Change Scope**
   - No files outside the allowed list were modified.

10. **Graph Regeneration Decision**
    - The `No regeneration required` decision was followed. Tracked baseline artifacts in `.understand-anything/` were verified unchanged before and after test runs.

---

## Findings

### Violations
- **None**

### Regressions
- **None**

### Drift Risks
- **None** (Script tests assert SHA256 hashes of `.understand-anything` graph baseline artifacts to prevent unintended mutation or transient file leaks).

### Required Corrections
- **None**

## Final Decision

Accepted.


