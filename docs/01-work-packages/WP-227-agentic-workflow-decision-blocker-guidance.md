# WP-227 agentic workflow decision blocker guidance

## Objective

Improve the read-only agentic workflow decision router so blocked or unsupported workflow states produce clearer, stable blocker guidance and safer next-action previews for resume workflows.

## Scope

### In Scope

- Add a small, deterministic blocker-detail contract to `scripts/get-agentic-workflow-decision.ps1` output.
- Preserve the existing string `recommendation.blockers` collection for compatibility while adding richer guidance that callers can inspect without parsing free text.
- Ensure blocked, unsupported, unparseable, and test-only-guard states do not emit implementation, audit, finalization, graph-refresh, commit, push, dependency, or destructive command previews.
- Keep ready lifecycle routes working for implementation, independent audit request, human final decision request, accepted-WP finalization preview, and closed rejected/deferred no-action states.
- Update focused PowerShell tests for decision-router behavior and downstream SDK manager recommendation pass-through.

### Out of Scope

- Executing workflow actions.
- Running independent audits.
- Refreshing the Understand graph.
- Changing work-package status, validation-plan, closeout-preflight, audit, run, commit, or package-creation helpers.
- Changing SDK manager orchestration behavior beyond test updates needed for pass-through compatibility.
- Adding dependencies, runtime AI behavior, database behavior, frontend behavior, or browser automation.
- Broad script-directory cleanup or helper relocation.

## Impact Analysis

### Understand Status

- Graph available: Yes. `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, and `.understand-anything/meta.json` are present.
- Baseline commit: `6f60a997f5f60ad8e72942b663cd20cdd3c992cb`
- Freshness assessment: Structurally stale for major workflow-documentation coverage because `docs/05-development-workflow/Agentic-Workflow-Roadmap.md` was added after the baseline at current HEAD `c643dc956ccb0a724c97dcec93afe0981cd12f96`. The graph is still usable as historical navigation for already-indexed decision/status scripts, but this package relies on direct roadmap, source, and test verification rather than graph relationships alone.
- Analysis performed: Read the workflow SSOT, work-package lifecycle guidance, Understand analysis guidance, planning checklist, Agentic Workflow Roadmap, graph metadata, baseline-to-HEAD changed paths, targeted graph entries for agentic workflow and SDK manager scripts/tests, `scripts/agentic-workflow/get-agentic-workflow-decision.ps1`, `scripts/sdk-manager/get-sdk-manager-recommendation.ps1`, `scripts/tests/test-agentic-workflow-decision.ps1`, and `scripts/tests/test-sdk-manager-recommendation.ps1`.

### Affected Architecture

- Layers: Development workflow tooling, read-only lifecycle recommendation tooling, PowerShell workflow tests.
- Primary files/components: `scripts/agentic-workflow/get-agentic-workflow-decision.ps1`, `scripts/tests/test-agentic-workflow-decision.ps1`.
- Upstream consumers: Codex resume workflow, human developers using `scripts/get-agentic-workflow-decision.ps1`, SDK manager recommendation dry-run tooling that consumes decision-router output.
- Downstream dependencies: `scripts/sdk-manager/get-sdk-manager-recommendation.ps1` pass-through behavior, `scripts/tests/test-sdk-manager-recommendation.ps1`, existing work-package status, validation-plan, and closeout-preflight output shapes.

### Regression Surface

- Related tests:
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-decision.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-recommendation.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-status.ps1`
  - PowerShell parser checks for modified scripts/tests.
- User workflows: Resuming a repository or work package, selecting the next workflow action, seeing why a WP is blocked, previewing safe next commands before implementation/audit/finalization.
- Security/data boundaries: Development-only tooling. Must not introduce runtime AI, external API calls, database access, destructive filesystem operations, audit dispatch, graph refresh execution, commits, pushes, dependency installation, or authorization bypass.

### Graph Update Decision

- Regeneration required: Yes, after accepted implementation.
- Rationale: The planned change modifies `scripts/agentic-workflow/**`, a development workflow script surface that the Understand refresh cadence treats as structurally relevant. Do not refresh the graph in this WP; create or run a focused graph-refresh package only after this WP is accepted.

## Files Allowed to Change

Allowed:

- `docs/01-work-packages/WP-227-agentic-workflow-decision-blocker-guidance.md`
- `docs/00-ssot/END-OF-DAY-HANDOFF.md`
- `scripts/agentic-workflow/get-agentic-workflow-decision.ps1`
- `scripts/tests/test-agentic-workflow-decision.ps1`
- `scripts/tests/test-sdk-manager-recommendation.ps1`

Do Not Modify:

- `scripts/get-agentic-workflow-decision.ps1`
- `scripts/agentic-workflow/get-agentic-workflow-status.ps1`
- `scripts/get-agentic-workflow-status.ps1`
- `scripts/sdk-manager/get-sdk-manager-recommendation.ps1`
- `scripts/sdk-manager/get-sdk-manager-orchestration-dry-run.ps1`
- `scripts/work-package/**`
- `scripts/audit-work-package.ps1`
- `scripts/run-work-package.ps1`
- `scripts/commit-work-package.ps1`
- `scripts/refresh-understand-graph.ps1`
- `.understand-anything/**`
- `.codex/skills/**`
- `apps/**`
- `database/**`

## Constraints

- Preserve existing decision action names unless explicitly covered by this WP.
- Preserve existing `recommendation.blockers` string output for compatibility.
- Keep the decision router read-only: it may inspect status and produce dry-run recommendations only.
- Do not add dependencies.
- Do not broaden SDK manager behavior; only update SDK manager tests if needed to cover the decision-router output contract it already consumes.
- Do not weaken human final decision, external-audit authorization, finalization preview, or mixed-worktree safety boundaries.
- Do not regenerate Understand artifacts during implementation.
- `docs/00-ssot/END-OF-DAY-HANDOFF.md` is allowed only for accepted-WP closeout refresh.

## Required Behavior

- Add a stable structured blocker-detail field to `recommendation`, such as `blockerDetails`, that includes at minimum:
  - component or source identifier
  - state or code
  - human-readable message
  - safe next-step guidance
  - command preview value that is empty for blocked or unsupported states
- Populate structured blocker details for:
  - status-bundle parse failures
  - supplied test status snapshots without `-AllowTestStatusSnapshot`
  - overall blocked status snapshots, including mixed-worktree and closeout blockers surfaced by the status bundle
  - missing or invalid work-package status data
  - unsupported lifecycle or closeout state combinations that route to `ManualReview`
- Preserve existing safe command previews only for ready, supported routes:
  - `ReadyForImplementation` -> `scripts/run-work-package.ps1 <WP> -Execute Codex`
  - `ImplementedNeedsAudit` or `ReadyForAudit` -> `scripts/audit-work-package.ps1 <WP> -AllowExternalAudit`
  - `AcceptedReadyForFinalization` or `ReadyForFinalization` -> `scripts/commit-work-package.ps1 -WorkPackagePath <WP> -Preview`
- Continue to omit command previews for:
  - `ResolveBlockers`
  - `ManualReview`
  - `ProvideWorkPackage`
  - `RequestHumanFinalDecision`
  - `NoActionClosed`
  - unparseable status bundle
  - unguarded test status snapshot
- Keep `dryRun = $true` and `executed = $false` in all decision-router outputs.
- Ensure text output remains concise and includes blocked guidance when blocker details exist without requiring JSON-only inspection.

## Acceptance Criteria

- [ ] `recommendation.blockerDetails` or an equivalent structured field exists in JSON output and is stable enough for downstream dry-run tooling to consume.
- [ ] Existing `recommendation.blockers` string output remains present and compatible.
- [ ] Blocked, manual-review, unparseable, invalid-WP, and unguarded test-snapshot paths produce structured blocker guidance and no workflow execution command preview.
- [ ] Ready implementation, audit request, human final decision, accepted finalization preview, and closed rejected/deferred routes preserve their existing action names, authorization flags, reasons, and command-preview behavior.
- [ ] SDK manager recommendation tests prove downstream consumption still surfaces blockers safely and remains advisory/non-executing.
- [ ] PowerShell parser checks pass for modified scripts/tests.
- [ ] Required tests pass:
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-decision.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-recommendation.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-status.ps1`
- [ ] No `.understand-anything/**` files change during implementation.
- [ ] No files outside the allowed list are modified.

## Code Prompt

Implement WP-227 exactly as scoped.

Start by reading this work package, the workflow SSOT, lifecycle documentation, the Agentic Workflow Roadmap, and the current decision-router and SDK manager recommendation tests. Modify only the allowed files.

Update `scripts/agentic-workflow/get-agentic-workflow-decision.ps1` so its JSON recommendation includes a small structured blocker-detail contract while preserving the existing string `recommendation.blockers` field. Keep all outputs dry-run and non-executing. Do not add command previews to blocked, manual-review, no-work-package, final-human-decision, closed, unparseable, or unguarded test-snapshot paths. Preserve existing command previews only for ready implementation, audit request, and accepted finalization preview routes.

Update `scripts/tests/test-agentic-workflow-decision.ps1` to cover the new structured blocker guidance across representative blocked, invalid, manual-review, unparseable, and unguarded test-snapshot cases, plus regression coverage for the ready supported routes. Update `scripts/tests/test-sdk-manager-recommendation.ps1` only as needed to prove downstream blocker pass-through remains safe and advisory.

Run the required tests and record results in `Code Results`. Do not refresh Understand artifacts, run external audits, commit, push, or modify out-of-scope files.

## Audit Prompt

Audit WP-227 against the repository state and this work package.

Verify:

- The implementation modified only allowed files.
- The decision router remains read-only, dry-run, and non-executing.
- Structured blocker guidance exists and is stable enough for downstream tooling.
- Existing `recommendation.blockers` compatibility is preserved.
- Blocked, manual-review, invalid-WP, unparseable, and unguarded test-snapshot paths do not expose workflow execution command previews.
- Ready supported routes preserve existing action names, authorization flags, and command-preview behavior.
- SDK manager recommendation behavior remains advisory and does not execute actions.
- Required tests were run and their evidence is recorded.
- `.understand-anything/**` was not modified and the graph-refresh decision was followed.
- No runtime AI, external API, app, database, audit-dispatch, commit, push, dependency, or destructive behavior was introduced.

Output:

- Verdict: PASS, FAIL, or unable to complete
- Scope violations
- Contract regressions
- Missing validation evidence
- Drift risks

## Code Results

Implemented.

Summary:

- Added `recommendation.blockerDetails` to `scripts/agentic-workflow/get-agentic-workflow-decision.ps1` while preserving the existing string `recommendation.blockers` collection.
- Added deterministic blocker detail shaping for status-bundle parse failures, guarded test-snapshot blockers, overall blocked status snapshots, invalid work-package status blockers, and unsupported manual-review lifecycle combinations.
- Kept command previews limited to existing ready/supported routes and left blocked, manual-review, no-work-package, human-final-decision, closed, unparseable, and unguarded fixture paths without command previews.
- Updated decision-router fixture tests for structured blocker guidance and no-command-preview safety.
- Updated SDK manager recommendation fixture snapshots to include decision-router blocker details, verifying downstream advisory behavior remains safe without changing SDK manager implementation.

Modified files:

- `docs/01-work-packages/WP-227-agentic-workflow-decision-blocker-guidance.md`
- `scripts/agentic-workflow/get-agentic-workflow-decision.ps1`
- `scripts/tests/test-agentic-workflow-decision.ps1`
- `scripts/tests/test-sdk-manager-recommendation.ps1`

Validation:

- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-decision.ps1`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-recommendation.ps1`
- PASS: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-status.ps1`

Scope notes:

- No `.understand-anything/**` files were modified.
- No SDK manager implementation files were modified.
- No workflow action execution, audit dispatch, graph refresh, commit, push, dependency installation, app, database, or runtime AI behavior was introduced.

## Audit Results

Verdict: PASS

---

### Audit Verification Summary

| Check Item | Requirement | Status | Evidence / Notes |
| :--- | :--- | :---: | :--- |
| **Scope Boundary** | Modified only allowed files | **PASS** | `git status -s` confirms only the 4 allowed files were modified/added: [`scripts/agentic-workflow/get-agentic-workflow-decision.ps1`](file:///D:/GitHub-Repos/SequelCityWeb/scripts/agentic-workflow/get-agentic-workflow-decision.ps1), [`scripts/tests/test-agentic-workflow-decision.ps1`](file:///D:/GitHub-Repos/SequelCityWeb/scripts/tests/test-agentic-workflow-decision.ps1), [`scripts/tests/test-sdk-manager-recommendation.ps1`](file:///D:/GitHub-Repos/SequelCityWeb/scripts/tests/test-sdk-manager-recommendation.ps1), and [`WP-227`](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-227-agentic-workflow-decision-blocker-guidance.md). |
| **Decision Router Safety** | Remains read-only, dry-run, non-executing | **PASS** | Output object maintains `dryRun = $true` and `executed = $false`. Script performs non-destructive calculation and recommendation output only. |
| **Structured Blocker Contract** | `recommendation.blockerDetails` schema introduced | **PASS** | Added `New-BlockerDetail` and `ConvertTo-BlockerDetail` returning `{ source, state, message, nextStep, commandPreview }`. |
| **Backward Compatibility** | Existing `recommendation.blockers` string array preserved | **PASS** | The string array field `blockers` remains populated on all decision recommendation objects. |
| **Command Preview Omission** | No execution previews on non-ready/manual/unparseable/invalid states | **PASS** | Verified that `commandPreview` is set to `''` for `ResolveBlockers`, `ManualReview`, `ProvideWorkPackage`, `RequestHumanFinalDecision`, `NoActionClosed`, `Unparsed`, and unguarded fixture paths. Confirmed via `Assert-NotContainsText` in test suite. |
| **Ready Route Preservation** | Existing safe action names, auth flags, and previews retained | **PASS** | Preserved safe command previews for `ReadyForImplementation`, `ReadyForAudit`, and `ReadyForFinalization` routes. |
| **SDK Manager Integration** | Advisory behavior preserved without execution | **PASS** | [`scripts/sdk-manager/get-sdk-manager-recommendation.ps1`](file:///D:/GitHub-Repos/SequelCityWeb/scripts/sdk-manager/get-sdk-manager-recommendation.ps1) left unmodified. SDK tests updated to validate downstream snapshot compatibility with `blockerDetails`. |
| **Validation Evidence** | Required test suites run and recorded | **PASS** | Executed all required test suites cleanly: <br>ΓÇó `test-agentic-workflow-decision.ps1` -> **PASS** <br>ΓÇó `test-sdk-manager-recommendation.ps1` -> **PASS** <br>ΓÇó `test-agentic-workflow-status.ps1` -> **PASS** <br>ΓÇó PowerShell AST Parser syntax validation -> **PASS** (0 syntax errors). |
| **Understand Graph Rules** | `.understand-anything/**` unmodified & refresh decision respected | **PASS** | Zero modifications to `.understand-anything/**`. Graph regeneration correctly deferred post-acceptance per WP-227. |
| **Non-Destructive Safety** | No external APIs, AI runtime, DB, commits, or dependencies | **PASS** | Code diff inspection confirmed no external API calls, DB operations, package additions, git commits/pushes, or destructive commands. |

---

### Audit Findings

- **Scope violations:** None.
- **Contract regressions:** None.
- **Missing validation evidence:** None.
- **Drift risks:** Low. Understand graph regeneration was deliberately deferred until post-acceptance per WP-227 specification.

---

The work package document [`WP-227-agentic-workflow-decision-blocker-guidance.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-227-agentic-workflow-decision-blocker-guidance.md) has been updated with this **PASS** audit verdict.

## Final Decision

Accepted on 2026-08-06.

Human acceptance recorded after PASS audit rerun, recorded validation evidence, and closeout preflight readiness. The graph refresh remains required as follow-up because WP-227 changed `scripts/agentic-workflow/**` and intentionally kept `.understand-anything/**` out of scope.

