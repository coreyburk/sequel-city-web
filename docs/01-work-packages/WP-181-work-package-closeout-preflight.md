# Work Package Closeout Preflight

## Objective

Add a read-only closeout preflight command that summarizes whether a work package is ready for audit, acceptance, finalization, or blocked before any audit, commit, push, or file mutation occurs.

## Scope

### In Scope

- Add `scripts/check-work-package-closeout.ps1`.
- Support `WP-###` shorthand and other work-package identifiers supported by the shared resolver.
- Compose existing status and validation-plan checks using their JSON output.
- Inspect `Audit Results`, `Final Decision`, dirty-file scope, validation evidence, and handoff freshness indicators.
- Emit a clear state:
  - `ReadyForAudit`
  - `ReadyForAcceptance`
  - `ReadyForFinalization`
  - `Blocked`
- Add focused tests for the preflight states and read-only behavior.
- Update closeout skill and workflow docs to use the preflight before finalization.
- Refresh `docs/00-ssot/END-OF-DAY-HANDOFF.md` for the current WP state before final closeout.

### Out of Scope

- Running AntiGravity, Gemini, Codex, Claude, or any external audit.
- Modifying work-package content from the preflight script.
- Staging, committing, pushing, or refreshing handoff from the preflight script.
- Changing underlying audit runner, status checker, validation-plan checker, or commit helper behavior.
- Application frontend/backend behavior.
- Database schema, seed, migration, bootstrap, or SQL safety behavior.
- Package, lockfile, dependency, graph, runtime AI, or SDK changes.

## Impact Analysis

### Understand Status

- Graph available: Yes. `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, and `.understand-anything/meta.json` exist.
- Baseline commit: `418990872a72e034197857ff383f74dfa575a90f`.
- Freshness assessment: Structurally stale for current workflow tooling because WP-170 through WP-180 added and changed repo-local skills and helper scripts after the graph baseline.
- Analysis performed: Read workflow SSOT, work-package lifecycle docs, Understand guidance, planning checklist, closeout skill, current status and validation-plan helper scripts, and existing helper tests. Used direct source/test inspection because the affected surface is development workflow tooling added after the graph baseline.

### Affected Architecture

- Layers:
  - development workflow scripts
  - repo-local closeout skill guidance
  - work-package lifecycle documentation
  - live handoff documentation
- Primary files/components:
  - `scripts/check-work-package-closeout.ps1`
  - `scripts/tests/test-work-package-closeout-preflight.ps1`
  - `.codex/skills/sequel-city-wp-closeout-handoff/SKILL.md`
  - `.codex/skills/sequel-city-wp-closeout-handoff/references/closeout-prompts.md`
  - `docs/05-development-workflow/Contributor-Workflow-Guide.md`
  - `docs/05-development-workflow/Work-Package-Lifecycle.md`
  - `docs/00-ssot/END-OF-DAY-HANDOFF.md`
  - `docs/01-work-packages/WP-181-work-package-closeout-preflight.md`
- Upstream consumers:
  - human developer closeout requests
  - Codex closeout/finalization workflow
  - future agentic orchestration over work-package lifecycle helpers
- Downstream dependencies:
  - `get-work-package-status.ps1`
  - `get-work-package-validation-plan.ps1`
  - accepted-WP finalization workflow
  - audit readiness workflow

### Regression Surface

- Related tests:
  - `powershell -ExecutionPolicy Bypass -File scripts/tests/test-work-package-closeout-preflight.ps1`
  - `powershell -ExecutionPolicy Bypass -File scripts/tests/test-work-package-status.ps1`
  - `powershell -ExecutionPolicy Bypass -File scripts/tests/test-work-package-validation-plan.ps1`
  - `powershell -ExecutionPolicy Bypass -File scripts/run-work-package.ps1 WP-181 -Execute None`
  - `powershell -ExecutionPolicy Bypass -File scripts/check-work-package-closeout.ps1 WP-181`
  - `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-status.ps1 WP-181`
  - `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-validation-plan.ps1 WP-181`
  - `git diff --check`
- User workflows:
  - checking whether implementation is ready for audit
  - checking whether audit results are ready for human acceptance
  - checking whether accepted work is ready for finalization
  - catching blockers before commit/push
- Security/data boundaries:
  - read-only local inspection
  - no external audit invocation
  - no file mutation by the preflight script
  - no runtime AI
  - no app or database changes

### Graph Update Decision

- Regeneration required: No.
- Rationale: This package adds a read-only development workflow preflight, tests, docs, skill guidance, handoff state, and a work-package record. It does not alter application architecture, imports, database structure, Case 004 progression, package dependencies, or runtime behavior.

## Files Allowed to Change

Allowed:

- docs/01-work-packages/WP-181-work-package-closeout-preflight.md
- scripts/check-work-package-closeout.ps1
- scripts/tests/test-work-package-closeout-preflight.ps1
- scripts/tests/test-work-package-status.ps1
- scripts/tests/test-work-package-validation-plan.ps1
- .codex/skills/sequel-city-wp-closeout-handoff/SKILL.md
- .codex/skills/sequel-city-wp-closeout-handoff/references/closeout-prompts.md
- docs/05-development-workflow/Contributor-Workflow-Guide.md
- docs/05-development-workflow/Work-Package-Lifecycle.md
- docs/00-ssot/END-OF-DAY-HANDOFF.md

Do Not Modify:

- apps/**
- database/**
- package.json
- package-lock.json
- apps/**/package.json
- apps/**/package-lock.json
- .understand-anything/**
- scripts/run-work-package.ps1
- scripts/audit-work-package.ps1
- scripts/commit-work-package.ps1
- scripts/get-work-package-status.ps1
- scripts/get-work-package-validation-plan.ps1
- scripts/lib/**
- docs/00-ssot/SSOT-Architecture.md
- docs/00-ssot/SSOT-AI-Agent-Boundaries.md

## Constraints

- The preflight script must be read-only.
- Do not run external audit, implementation agents, staging, commit, push, or handoff refresh from the script.
- Reuse existing helper outputs instead of duplicating their full logic.
- Keep output deterministic and machine-readable with `-Json`.
- Preserve current status, validation, audit, and finalization helper behavior.
- Do not change app, database, package, lockfile, graph, dependency, or runtime AI files.

## Required Behavior

- `scripts/check-work-package-closeout.ps1 WP-181` must resolve `WP-181`.
- The script must call `get-work-package-status.ps1 <wp> -Json` and `get-work-package-validation-plan.ps1 <wp> -Json`.
- The script must emit:
  - `ReadyForAudit` when code results are recorded, validation evidence or plan exists, no audit result is recorded, and no blockers are present.
  - `ReadyForAcceptance` when audit results are recorded, final decision is pending, validation is acceptable, and no blockers are present.
  - `ReadyForFinalization` when final decision is accepted, validation evidence is recorded, audit results are recorded, and no blockers are present.
  - `Blocked` when mixed-worktree scope, incomplete planning, blocked audit, missing validation plan/evidence, failed/closed decision, or other required closeout gate fails.
- The script must report findings and next action in text and JSON modes.
- The script must not modify files.
- Closeout skill/docs must recommend the preflight before finalization.

## Acceptance Criteria

- [x] `scripts/check-work-package-closeout.ps1` exists and parses.
- [x] The preflight script supports `WP-###` shorthand.
- [x] The preflight script emits `ReadyForAudit`.
- [x] The preflight script emits `ReadyForAcceptance`.
- [x] The preflight script emits `ReadyForFinalization`.
- [x] The preflight script emits `Blocked` for at least one lifecycle blocker.
- [x] The preflight script has JSON output.
- [x] Focused tests prove the script is read-only for fixture files.
- [x] Closeout skill/docs recommend the preflight before finalization.
- [x] No app, database, package, lockfile, graph, runtime AI, or unrelated files changed.

## Code Prompt

Implement WP-181 exactly as specified.

Scope:

- Only modify files listed under `Files Allowed to Change`.
- Keep all app, database, dependency, package, lockfile, graph, runner, audit wrapper, commit helper, status helper, validation-plan helper, resolver, and runtime AI files unchanged unless explicitly allowed.

Implementation:

1. Add `scripts/check-work-package-closeout.ps1` as a read-only preflight script.
2. Add focused tests for readiness states, JSON output, `WP-###` resolution, and fixture immutability.
3. Update the closeout handoff skill and prompt reference to run the preflight before finalization.
4. Update workflow docs with the preflight command and state meanings.
5. Update this WP with Code Results and validation evidence.
6. Refresh `docs/00-ssot/END-OF-DAY-HANDOFF.md` for the current WP state.

Verification:

- `powershell -ExecutionPolicy Bypass -File scripts/tests/test-work-package-closeout-preflight.ps1`
- `powershell -ExecutionPolicy Bypass -File scripts/tests/test-work-package-status.ps1`
- `powershell -ExecutionPolicy Bypass -File scripts/tests/test-work-package-validation-plan.ps1`
- `powershell -ExecutionPolicy Bypass -File scripts/run-work-package.ps1 WP-181 -Execute None`
- `powershell -ExecutionPolicy Bypass -File scripts/check-work-package-closeout.ps1 WP-181`
- `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-status.ps1 WP-181`
- `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-validation-plan.ps1 WP-181`
- `git diff --check`

Return:

- Exact code changes
- Validation results
- Any limitations

## Audit Prompt

Audit WP-181 against this work package and development workflow docs.

Verify:

- All acceptance criteria are satisfied.
- No files outside allowed list were modified.
- The preflight script is read-only.
- The preflight script composes existing helper outputs rather than replacing them.
- The readiness states are conservative and match lifecycle expectations.
- JSON output is usable by future agentic orchestration.
- Closeout skill/docs recommend the preflight before finalization.
- Handoff was refreshed for the current repo state.
- No app, database, package, lockfile, graph, runtime AI, or unrelated files changed.

Output:

- Verdict: PASS or FAIL
- Scope violations
- Preflight behavior gaps
- Read-only risks
- Documentation gaps
- Missing tests
- Boundary risks

## Code Results

Implemented.

Files changed:

- `scripts/check-work-package-closeout.ps1`
- `scripts/tests/test-work-package-closeout-preflight.ps1`
- `.codex/skills/sequel-city-wp-closeout-handoff/SKILL.md`
- `.codex/skills/sequel-city-wp-closeout-handoff/references/closeout-prompts.md`
- `docs/05-development-workflow/Contributor-Workflow-Guide.md`
- `docs/05-development-workflow/Work-Package-Lifecycle.md`
- `docs/00-ssot/END-OF-DAY-HANDOFF.md`
- `docs/01-work-packages/WP-181-work-package-closeout-preflight.md`

Implementation summary:

- Added `scripts/check-work-package-closeout.ps1` as a read-only closeout preflight.
- Composed existing `get-work-package-status.ps1 -Json` and `get-work-package-validation-plan.ps1 -Json` outputs instead of replacing those helpers.
- Added conservative states for `ReadyForAudit`, `ReadyForAcceptance`, `ReadyForFinalization`, and `Blocked`.
- Added JSON and text output for future agentic orchestration.
- Added focused tests covering shorthand resolution, JSON output, read-only fixture behavior, readiness states, and PASS audits that mention the `Blocked` lifecycle state in explanatory text.
- Updated closeout skill, prompt reference, contributor workflow guide, and lifecycle docs to recommend the preflight before finalization.
- Refreshed the live handoff for the current WP-181 state.
- Corrected post-audit preflight parsing so a PASS audit is not treated as blocked merely because explanatory text names the `Blocked` lifecycle state.

Validation:

- PASS: `powershell -ExecutionPolicy Bypass -File scripts/tests/test-work-package-closeout-preflight.ps1`
- PASS: `powershell -ExecutionPolicy Bypass -File scripts/tests/test-work-package-status.ps1`
- PASS: `powershell -ExecutionPolicy Bypass -File scripts/tests/test-work-package-validation-plan.ps1`
- PASS: `powershell -ExecutionPolicy Bypass -File scripts/run-work-package.ps1 WP-181 -Execute None`
- PASS: `powershell -ExecutionPolicy Bypass -File scripts/check-work-package-closeout.ps1 WP-181`
- PASS: `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-status.ps1 WP-181`
- PASS: `powershell -ExecutionPolicy Bypass -File scripts/get-work-package-validation-plan.ps1 WP-181`
- PASS: `git diff --check` with CRLF warnings only.

Limitations:

- `scripts/check-work-package-closeout.ps1 WP-181` reported `ReadyForAudit` after Code Results were recorded, which was the intended pre-audit state.
- Independent AGY audit was run outside Codex by the human reviewer and recorded a PASS verdict before final acceptance.

## Audit Results

- **Verdict**: PASS
- **Scope violations**: None. All changed and untracked files are strictly within the allowed list in [WP-181](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-181-work-package-closeout-preflight.md#L97-L110).
- **Preflight behavior gaps**: None. [check-work-package-closeout.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/check-work-package-closeout.ps1) composes `get-work-package-status.ps1 -Json` and `get-work-package-validation-plan.ps1 -Json` without replacing them, resolves `WP-###` shorthand, emits the four required lifecycle readiness states (`ReadyForAudit`, `ReadyForAcceptance`, `ReadyForFinalization`, `Blocked`), and outputs machine-readable JSON.
- **Read-only risks**: None. The preflight script only reads files and calls read-only helper scripts. Immutability is verified by [test-work-package-closeout-preflight.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/tests/test-work-package-closeout-preflight.ps1#L170-L172).
- **Documentation gaps**: None. The closeout skill ([SKILL.md](file:///D:/GitHub-Repos/SequelCityWeb/.codex/skills/sequel-city-wp-closeout-handoff/SKILL.md)), prompt reference ([closeout-prompts.md](file:///D:/GitHub-Repos/SequelCityWeb/.codex/skills/sequel-city-wp-closeout-handoff/references/closeout-prompts.md)), [Contributor-Workflow-Guide.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/05-development-workflow/Contributor-Workflow-Guide.md), and [Work-Package-Lifecycle.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/05-development-workflow/Work-Package-Lifecycle.md) all instruct running the preflight before finalization.
- **Missing tests**: None. Test coverage includes script parsing, `WP-###` shorthand resolution, JSON structure, fixture immutability, and all 4 readiness states.
- **Boundary risks**: None. The preflight script is strictly scoped to local workflow tooling. No application, database, package, lockfile, graph baseline, or runtime AI files were modified.

---

### Audit Verification Details

1. **Acceptance Criteria**: All 10 acceptance criteria defined in [WP-181](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-181-work-package-closeout-preflight.md#L152-L163) are satisfied.
2. **Changed Files**:
   - [WP-181-work-package-closeout-preflight.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-181-work-package-closeout-preflight.md)
   - [check-work-package-closeout.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/check-work-package-closeout.ps1)
   - [test-work-package-closeout-preflight.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/tests/test-work-package-closeout-preflight.ps1)
   - [SKILL.md](file:///D:/GitHub-Repos/SequelCityWeb/.codex/skills/sequel-city-wp-closeout-handoff/SKILL.md)
   - [closeout-prompts.md](file:///D:/GitHub-Repos/SequelCityWeb/.codex/skills/sequel-city-wp-closeout-handoff/references/closeout-prompts.md)
   - [Contributor-Workflow-Guide.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/05-development-workflow/Contributor-Workflow-Guide.md)
   - [Work-Package-Lifecycle.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/05-development-workflow/Work-Package-Lifecycle.md)
   - [END-OF-DAY-HANDOFF.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/00-ssot/END-OF-DAY-HANDOFF.md)
3. **Execution Verification**:
   - `test-work-package-closeout-preflight.ps1`: PASS
   - `test-work-package-status.ps1`: PASS
   - `test-work-package-validation-plan.ps1`: PASS
   - `run-work-package.ps1 WP-181 -Execute None`: PASS
   - `check-work-package-closeout.ps1 WP-181`: PASS (State: `ReadyForAudit` before audit; `ReadyForAcceptance` after AGY audit PASS)
   - `get-work-package-status.ps1 WP-181`: PASS (State: `ImplementedNeedsAudit`)
   - `get-work-package-validation-plan.ps1 WP-181`: PASS (State: `ValidationEvidenceRecorded`)
   - `git diff --check`: PASS
I have processed the notification from background task-13. 

The audit for **WP-181** is complete and passed all checks without scope violations or preflight behavior gaps. Refer to the audit summary above for full details.
Background search task-54 has completed. The WP-181 audit remains finalized with a **PASS** verdict. Let me know if you need anything else!

## Final Decision

Accepted.

Reason:

- Independent AGY audit recorded a PASS verdict with no scope violations, behavior gaps, read-only risks, documentation gaps, missing tests, or boundary risks.
- Post-audit preflight parsing was corrected within WP-181 scope so explanatory lifecycle text cannot convert a PASS audit into a blocked closeout state.
- Focused validation passed after the correction, and no app, database, dependency, graph, runner, audit wrapper, commit helper, or runtime AI boundaries were changed.

