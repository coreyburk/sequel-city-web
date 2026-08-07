# WP-235 - Correct Audit Result Heading Normalization

## Objective

Prevent AntiGravity or Gemini audit output from creating parser-breaking sibling `##` headings inside a work package `## Audit Results` section, so lifecycle helpers detect completed audits without manual markdown repair.

## Scope

### In Scope
- Correct the WP-234 audit-recording defect where AntiGravity output wrote `## Verdict: PASS` and other `##` subheadings inside `## Audit Results`, causing lifecycle helpers to treat audit results as empty.
- Normalize independent audit output before insertion so any top-level markdown heading in retained audit text is safe inside the target audit-results section.
- Add or update fixture tests that prove:
  - AGY-style output with `## Verdict: PASS` and additional `##` subheadings is written under `## Audit Results` without ending the section early.
  - `scripts/get-work-package-status.ps1` detects the updated fixture as audited.
  - `scripts/check-work-package-closeout.ps1` detects the updated fixture as ready for human acceptance when final decision is pending.
- Update repo-local audit-runner contract guidance so audit records must not contain sibling `##` headings inside `## Audit Results`, and runner normalization is expected to enforce this for external auditor output.
- Refresh tracked Understand graph artifacts after implementation because this package changes workflow scripts, tests, repo-local skills/docs, or both.

### Out of Scope
- Changing app runtime code, product behavior, Case 004 persistence, database files, package manifests, lockfiles, or backend APIs.
- Changing final-decision, acceptance, commit, push, graph-refresh authorization, or external-audit authorization gates.
- Broad lifecycle parser rewrites unrelated to audit result insertion.
- Changing audit verdict semantics, blocked-audit semantics, or PASS/FAIL detection rules except as required to keep inserted audit markdown parser-safe.
- Retrofitting old accepted WP records.
- Adding dependencies or adopting SDK/orchestration frameworks.

## Corrective Basis

- Original WP: `docs/01-work-packages/WP-234-student-case-local-state-persistence.md`
- Finding classification: defect in workflow tooling/audit-recording contract, discovered during WP-234 closeout.
- Defect: AntiGravity audit completed and the runner wrote results to `## Audit Results`, but the auditor output used same-level `##` headings (`## Verdict: PASS`, `## Audit Verification Summary`, etc.). The lifecycle helpers parse `##` as top-level WP sections, so `get-work-package-status.ps1` reported `Audit results recorded: False` and `check-work-package-closeout.ps1` remained `ReadyForAudit` until the headings were manually demoted.
- Why corrective: The implementation and audit for WP-234 were substantively acceptable, but the workflow required post-audit manual markdown repair. This package corrects that lifecycle tooling defect so future audits are parser-safe on first write.

## Impact Analysis

### Understand Status
- Graph available: Yes. `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, `.understand-anything/meta.json`, and `.understand-anything/intermediate/scan-result.json` are present.
- Baseline commit: `073c8c1c0a9218145a305057d8587b6306ed98e4`.
- Freshness assessment: Usable with non-structural drift for audit workflow planning. `HEAD` is `5b6697a2375b40a5dd53d9c19744de3506f77c89`; changed paths since the baseline are the accepted WP-234 product implementation, current-state docs, handoff, WP record, and graph refresh artifacts. They do not alter audit runner scripts or audit workflow tests.
- Analysis performed: Targeted graph search for audit runner and closeout nodes (`run-work-package.ps1`, `audit-work-package.ps1`, `check-work-package-closeout.ps1`, `test-run-work-package-audit-runner.ps1`, `test-audit-work-package-wrapper.ps1`, and audit contract skill/docs), plus source verification with `rg` and focused reads of the audit result normalization/write path and existing fixture tests.

### Affected Architecture
- Layers: development workflow scripts, work-package audit runner, lifecycle parser consumers, PowerShell fixture tests, repo-local Codex audit skill/docs, Understand graph artifacts.
- Primary files/components:
  - `scripts/work-package/run-work-package.ps1`
  - `scripts/tests/test-run-work-package-audit-runner.ps1`
  - `scripts/tests/test-audit-work-package-wrapper.ps1`
  - `.codex/skills/sequel-city-audit-runner-contracts/SKILL.md`
  - `.codex/skills/sequel-city-audit-runner-contracts/references/audit-contract.md`
  - `docs/05-development-workflow/Codex-Gemini-Execution-Guide.md`
  - `docs/05-development-workflow/Work-Package-Lifecycle.md`
- Upstream consumers:
  - `scripts/audit-work-package.ps1` top-level shim delegates to `scripts/work-package/audit-work-package.ps1`, which delegates to `scripts/work-package/run-work-package.ps1`.
  - Human operators use `scripts/audit-work-package.ps1 WP-### -AllowExternalAudit` for audit-only runs.
  - Closeout flow uses `scripts/get-work-package-status.ps1` and `scripts/check-work-package-closeout.ps1` after audit insertion.
- Downstream dependencies:
  - `Update-WorkPackageResults` calls `Normalize-ResultText`, resolves the audit result heading, then writes through `Set-SectionBody`.
  - `get-work-package-status.ps1` and `check-work-package-closeout.ps1` depend on the written markdown section shape.
  - Existing audit wrapper and runner tests create temporary WPs and mock AGY output.

### Regression Surface
- Related tests:
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-run-work-package-audit-runner.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-audit-work-package-wrapper.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-work-package-status.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-work-package-closeout-preflight.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-decision.ps1`
- User workflows:
  - Running an AntiGravity audit through `scripts/audit-work-package.ps1`.
  - Running lower-level `scripts/run-work-package.ps1 -Execute AntiGravity` or `-Execute Audit -AuditAgent AntiGravity`.
  - Reviewing post-audit lifecycle state with status, closeout preflight, decision router, and SDK manager recommendations.
- Security/data boundaries:
  - External audit still requires explicit `-AllowExternalAudit`.
  - No runtime AI, app runtime, database, dependency, package, lockfile, destructive filesystem, commit, push, or acceptance behavior is authorized.
  - The runner must not fabricate, weaken, or reinterpret audit verdicts while normalizing markdown heading levels.

### Graph Update Decision
- Regeneration required: Yes.
- Rationale: Planned changes touch workflow scripts, tests, repo-local skill/docs, and development workflow docs. Include tracked graph artifacts in this originating WP and refresh them after implementation before audit.

## Files Allowed to Change

Allowed:

- `scripts/work-package/run-work-package.ps1`
- `scripts/tests/test-run-work-package-audit-runner.ps1`
- `scripts/tests/test-audit-work-package-wrapper.ps1`
- `scripts/tests/test-work-package-status.ps1`
- `scripts/tests/test-work-package-closeout-preflight.ps1`
- `scripts/tests/test-agentic-workflow-decision.ps1`
- `docs/05-development-workflow/Codex-Gemini-Execution-Guide.md`
- `docs/05-development-workflow/Work-Package-Lifecycle.md`
- `.codex/skills/sequel-city-audit-runner-contracts/SKILL.md`
- `.codex/skills/sequel-city-audit-runner-contracts/references/audit-contract.md`
- `.understand-anything/knowledge-graph.json`
- `.understand-anything/fingerprints.json`
- `.understand-anything/meta.json`
- `.understand-anything/intermediate/scan-result.json`
- `docs/01-work-packages/WP-235-correct-audit-result-heading-normalization.md`
- `docs/00-ssot/END-OF-DAY-HANDOFF.md`

Do Not Modify:

- `apps/**`
- `apps/api/**`
- `apps/web/**`
- `database/**`
- `tools/**`
- `package.json`
- `package-lock.json`
- `apps/web/package.json`
- `apps/api/package.json`
- `scripts/work-package/audit-work-package.ps1`
- `scripts/audit-work-package.ps1`
- `scripts/work-package/get-work-package-status.ps1`
- `scripts/work-package/check-work-package-closeout.ps1`
- `scripts/work-package/commit-work-package.ps1`
- `.codex/skills/sequel-city-wp-finalize/**`

## Constraints

- Preserve existing behavior unless explicitly changing audit result heading normalization.
- No new dependencies.
- No app, backend, database, package, lockfile, runtime AI, SDK, network, destructive action, commit, push, or acceptance behavior changes.
- Preserve explicit external-audit authorization requirements.
- Preserve blocked-audit and failed-audit recording semantics.
- Do not hide or delete audit content merely because it uses headings.
- Do not reinterpret audit verdicts; only make retained audit markdown safe inside the target WP section.
- Keep compatibility with existing Gemini audit compression and blocked AntiGravity audit formatting.
- Keep this corrective scope limited to parser-safe audit result insertion and its contract/test coverage.

## Required Behavior

- Independent audit output retained for insertion into `## Audit Results` must not contain sibling top-level `##` headings that terminate the section early for lifecycle helpers.
- Audit output that begins with `## Verdict: PASS` must be inserted in a parser-safe form, such as `Verdict: PASS`, while preserving the verdict text.
- Additional auditor subheadings such as `## Audit Verification Summary`, `## Changed Files Audit`, `## Violations`, `## Regressions`, and `## Drift Risks` must be inserted as lower-level headings or otherwise parser-safe labels.
- The normalization must apply to AntiGravity output and any other independent audit result path that writes to `## Audit Results`.
- Existing blocked-audit output from the runner must remain parseable and must still be classified as blocked where appropriate.
- Fixture tests must prove that mock AGY output containing nested `##` headings is written under `## Audit Results` and lifecycle helpers report audited/ready-for-acceptance without manual markdown edits.
- Skill and workflow documentation must encode the rule so future agents and auditors know not to emit sibling `##` headings inside `## Audit Results`.
- Refresh Understand graph artifacts after implementation and record the refresh in Code Results.

## Acceptance Criteria

- [ ] Mock AntiGravity output containing `## Verdict: PASS` and at least one additional `##` audit subheading is normalized before insertion into `## Audit Results`.
- [ ] After insertion, the target WP contains exactly the expected top-level lifecycle headings and does not contain extra top-level audit subheadings between `## Audit Results` and `## Final Decision`.
- [ ] `scripts/get-work-package-status.ps1` detects the fixture as `AuditedNeedsFinalDecision`.
- [ ] `scripts/check-work-package-closeout.ps1` detects the fixture as `ReadyForAcceptance` when final decision is pending.
- [ ] Existing blocked AntiGravity audit behavior remains parseable and classified as blocked.
- [ ] Audit contract skill/docs explicitly state that audit result subheadings inside `## Audit Results` must use parser-safe heading levels or labels, and runner normalization enforces this for external auditor output.
- [ ] Related PowerShell fixture tests pass.
- [ ] Understand graph artifacts are refreshed after implementation, with no transient `.understand-anything/.trash-*`, temp, or log artifacts committed.
- [ ] No app, backend, database, package, lockfile, runtime AI, or dependency files changed.
- [ ] No unrelated files changed.

## Code Prompt

Implement WP-235 exactly as specified.

Before editing:
- Confirm `git status --short --branch --untracked-files=all`.
- Review WP-234's audit-heading failure and final decision notes.
- Review `scripts/work-package/run-work-package.ps1` around `Update-WorkPackageResults`, `Normalize-ResultText`, `Select-ResultBlock`, and Gemini/AntiGravity normalization.
- Review existing audit runner fixtures in `scripts/tests/test-run-work-package-audit-runner.ps1` and `scripts/tests/test-audit-work-package-wrapper.ps1`.

Implementation:
- Add parser-safe audit result heading normalization before audit text is written into `## Audit Results`.
- Preserve audit content and verdict wording while preventing nested output from creating sibling `##` work-package sections.
- Add or update fixtures so mock AGY output includes `## Verdict: PASS` and additional `##` subheadings, then assert status and closeout helpers parse the resulting WP as audited/ready for acceptance.
- Update the audit-runner skill/docs and workflow docs with the parser-safe audit heading rule.
- Refresh tracked Understand graph artifacts after implementation.

Validation:
- Run `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-run-work-package-audit-runner.ps1`.
- Run `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-audit-work-package-wrapper.ps1`.
- Run `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-work-package-status.ps1`.
- Run `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-work-package-closeout-preflight.ps1`.
- Run `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-decision.ps1`.
- Run `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1` before and after graph refresh.
- Run `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refresh-understand-graph.ps1`.
- Run `git diff --check`.

Return:
- Exact files changed.
- Test and graph-refresh results.
- Confirmation that AGY-style `##` audit subheadings no longer require manual repair.

## Audit Prompt

Audit WP-235 against the work package, WP-234 corrective finding, source, tests, and changed files.

Verify:
- The corrective scope addresses the exact WP-234 audit-heading parser defect.
- Audit output with `## Verdict: PASS` and additional `##` subheadings is normalized into parser-safe content inside `## Audit Results`.
- The target WP retains only valid top-level lifecycle headings after audit insertion.
- Status and closeout helpers detect the fixture as audited and ready for human acceptance without manual heading repair.
- Blocked and failed audit semantics are preserved.
- External audit authorization, human final acceptance, commit, push, graph refresh, runtime AI, database, package, and dependency boundaries are preserved.
- Only allowed files were modified.
- Required fixture tests and graph refresh evidence are recorded.
- Understand output did not override SSOT, source, tests, or observed behavior.

Output:
- Verdict: PASS or FAIL
- Violations
- Regressions
- Drift risks

## Code Results

Implemented.

Changed files:

- `scripts/work-package/run-work-package.ps1`
- `scripts/tests/test-run-work-package-audit-runner.ps1`
- `scripts/tests/test-audit-work-package-wrapper.ps1`
- `scripts/tests/test-work-package-status.ps1`
- `scripts/tests/test-work-package-closeout-preflight.ps1`
- `scripts/tests/test-agentic-workflow-decision.ps1`
- `docs/05-development-workflow/Codex-Gemini-Execution-Guide.md`
- `docs/05-development-workflow/Work-Package-Lifecycle.md`
- `.codex/skills/sequel-city-audit-runner-contracts/SKILL.md`
- `.codex/skills/sequel-city-audit-runner-contracts/references/audit-contract.md`
- `.understand-anything/knowledge-graph.json`
- `.understand-anything/fingerprints.json`
- `.understand-anything/meta.json`
- `.understand-anything/intermediate/scan-result.json`
- `docs/01-work-packages/WP-235-correct-audit-result-heading-normalization.md`

Implementation notes:

- Added audit-result heading normalization in `Normalize-ResultText` for Gemini and AntiGravity output before result insertion.
- Preserved explicit verdict text while converting `## Verdict: PASS` to `Verdict: PASS`.
- Converted auditor `#` or `##` subsection headings to `###` headings so retained audit text remains inside `## Audit Results`.
- Expanded mock AGY runner and wrapper fixtures to emit parser-breaking `##` audit headings and assert the written WP has demoted audit subsections.
- Added runner fixture checks that `scripts/get-work-package-status.ps1` reports `AuditedNeedsFinalDecision` and `scripts/check-work-package-closeout.ps1` reports `ReadyForAcceptance` after parser-safe mock AGY insertion.
- Updated audit-runner contract skill/docs and lifecycle workflow docs to state that audit result bodies must not contain sibling `##` work-package headings.
- Updated related fixture allowed lists so required validation commands pass while WP-235's own audit-contract/test files are dirty.
- Refreshed tracked Understand graph artifacts after implementation.

Validation:

- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-run-work-package-audit-runner.ps1`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-audit-work-package-wrapper.ps1`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-work-package-status.ps1`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-work-package-closeout-preflight.ps1`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-decision.ps1`
- PASS: serial execution of the five required PowerShell fixture tests above in one run.
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1` before graph refresh.
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refresh-understand-graph.ps1` (`filesScanned=596`, `nodes=927`, `edges=331`, `files=596`; graph metadata baseline `5b6697a2375b40a5dd53d9c19744de3506f77c89`).
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1` after graph refresh.
- PASS: `git diff --check` (Git reported CRLF working-copy warnings only).

Notes:

- `scripts/tests/test-agentic-workflow-decision.ps1` was added to the allowed file list during implementation because it is a required WP-235 validation command and its fixture needed the same WP-235 dirty-scope allowance as the other lifecycle fixture tests.

## Audit Results

Verdict: PASS

### Violations
None.

### Regressions
None.

### Drift Risks
None. Understand graph artifacts were refreshed cleanly after implementation and verified ready without transient or untracked trash artifacts.

## Final Decision

Accepted on 2026-08-07 after AntiGravity audit recorded `PASS` with no violations, no regressions, and no drift risks. The parser-safe audit heading normalization, lifecycle fixture coverage, audit contract documentation, and refreshed Understand graph artifacts satisfy the corrective WP scope.
