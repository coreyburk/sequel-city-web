# WP-229 workflow process refinement for skills and closeout

## Objective

Update the repo-local workflow skills and documentation so known graph refreshes, closeout handoff scope, commit-helper PowerShell syntax, sandbox escalation, and audit-result wording hazards are encoded before future work starts.

## Scope

### In Scope

- Refine WP planning guidance so graph refresh artifacts are included in the originating WP when graph regeneration is already known to be required by that WP's changes.
- Refine closeout guidance so `docs/00-ssot/END-OF-DAY-HANDOFF.md` is planned or handled explicitly as closeout-only scope instead of discovered as an out-of-scope dirty file.
- Refine finalization guidance with the working PowerShell array syntax for `-Bullet` and `-StagePath`.
- Refine finalization guidance to expect sandbox escalation for `scripts/commit-work-package.ps1` in this managed environment because it writes `.git/index.lock`.
- Refine audit wording guidance so PASS audit records and prompts do not contain parser-triggering blocked-state words unless recording an actual blocked audit result.
- Refresh the Understand graph in this same WP after accepted skill/documentation edits, before audit, because this package knowingly changes repo-local skills and major workflow docs.

### Out of Scope

- Changing workflow helper scripts.
- Changing lifecycle parser behavior.
- Changing audit runner behavior.
- Changing app, database, runtime AI, dependency, package, lockfile, Case 004 progression, or browser behavior.
- Adding new tools or dependencies.
- Retrofitting older work packages.

## Impact Analysis

### Understand Status

- Graph available: Yes. `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, `.understand-anything/intermediate/scan-result.json`, and `.understand-anything/meta.json` are present.
- Baseline commit: `7ef6c7fd340ca3c7a16d58011b6479f5d2279972`
- Freshness assessment: Usable with non-structural drift for planning. Current HEAD is `89b6af5211fbf03d5ef72982d099bcf9f49745fe`; the only commit after the graph baseline is accepted WP-228, a focused graph refresh package that updated tracked graph artifacts, the WP-228 record, and the live handoff. The active source/skill surfaces were not changed after the baseline.
- Analysis performed: Verified clean worktree at `89b6af5211fbf03d5ef72982d099bcf9f49745fe`, read graph metadata, inspected current workflow SSOT/lifecycle/Understand guidance, searched the refreshed graph for repo-local skill and workflow-doc nodes, and directly read the relevant skill files and references: `sequel-city-wp-planning`, `sequel-city-wp-closeout-handoff`, `sequel-city-wp-finalize`, finalization checklist, closeout prompts, and audit contract.

### Affected Architecture

- Layers: Development workflow documentation, repo-local Codex skill instructions, generated Understand graph baseline.
- Primary files/components:
  - `.codex/skills/sequel-city-wp-planning/SKILL.md`
  - `.codex/skills/sequel-city-wp-planning/references/planning-checklist.md`
  - `.codex/skills/sequel-city-wp-closeout-handoff/SKILL.md`
  - `.codex/skills/sequel-city-wp-closeout-handoff/references/closeout-prompts.md`
  - `.codex/skills/sequel-city-wp-finalize/SKILL.md`
  - `.codex/skills/sequel-city-wp-finalize/references/finalization-checklist.md`
  - `.codex/skills/sequel-city-audit-runner-contracts/references/audit-contract.md`
  - `docs/05-development-workflow/Work-Package-Lifecycle.md`
  - `docs/05-development-workflow/Understand-Codebase-Analysis.md`
  - `docs/05-development-workflow/Contributor-Workflow-Guide.md`
  - `docs/05-development-workflow/Commit-Message-Guide.md`
- Upstream consumers: Codex agents using repo-local skills, human developers following the workflow docs, work-package planning/closeout/finalization flows.
- Downstream dependencies: future WPs, future graph-refresh scope decisions, accepted-WP closeout commits, audit result interpretation.

### Regression Surface

- Related tests:
  - `rg` checks over modified skill/docs for graph-refresh scoping, closeout handoff scope, PowerShell array syntax, sandbox escalation, and audit wording guidance.
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1 -Json`
  - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refresh-understand-graph.ps1`
  - `git diff --check`
  - `git status --short --untracked-files=all`
- User workflows: planning work packages, implementing packages with known graph refresh needs, closing accepted WPs, committing accepted WPs, recording audit results.
- Security/data boundaries: Development-only documentation and skill instructions. No runtime AI, app behavior, external API, database mutation, dependency installation, destructive action, audit dispatch, or package/lockfile mutation.

### Graph Update Decision

- Regeneration required: Yes, inside this WP before audit.
- Rationale: This package intentionally changes repo-local skills and major workflow documentation. To avoid another unnecessary follow-up graph-refresh WP, the tracked graph artifacts are included in scope from the start and must be refreshed before audit.

## Files Allowed to Change

Allowed:

- `docs/01-work-packages/WP-229-workflow-process-refinement-for-skills-and-closeout.md`
- `docs/00-ssot/END-OF-DAY-HANDOFF.md`
- `.codex/skills/sequel-city-wp-planning/SKILL.md`
- `.codex/skills/sequel-city-wp-planning/references/planning-checklist.md`
- `.codex/skills/sequel-city-wp-closeout-handoff/SKILL.md`
- `.codex/skills/sequel-city-wp-closeout-handoff/references/closeout-prompts.md`
- `.codex/skills/sequel-city-wp-finalize/SKILL.md`
- `.codex/skills/sequel-city-wp-finalize/references/finalization-checklist.md`
- `.codex/skills/sequel-city-audit-runner-contracts/references/audit-contract.md`
- `docs/05-development-workflow/Work-Package-Lifecycle.md`
- `docs/05-development-workflow/Understand-Codebase-Analysis.md`
- `docs/05-development-workflow/Contributor-Workflow-Guide.md`
- `docs/05-development-workflow/Commit-Message-Guide.md`
- `.understand-anything/knowledge-graph.json`
- `.understand-anything/fingerprints.json`
- `.understand-anything/meta.json`
- `.understand-anything/intermediate/scan-result.json`

Do Not Modify:

- `scripts/**`
- `.codex/skills/sequel-city-wp-corrective/**`
- `.codex/skills/ui-ux-pro-max/**`
- `docs/00-ssot/SSOT-*.md`
- `docs/00-ssot/END-OF-DAY-HANDOFF-TEMPLATE.md`
- `docs/02-product/**`
- `docs/03-architecture/**`
- `docs/04-api/**`
- `docs/06-operations/**`
- `apps/**`
- `database/**`
- `tools/**`
- `package.json`
- `package-lock.json`

## Constraints

- Keep this as a process-instruction refinement; do not change executable helper behavior.
- Do not add new dependencies or scripts.
- Do not weaken independent audit, human final acceptance, scope isolation, external audit authorization, or runtime AI boundaries.
- Do not recommend bypassing sandbox controls; document when escalation is the correct first attempt for known Git index writes.
- Do not use the word `BLOCKED` inside PASS audit examples or generic prompt output contracts unless the example is explicitly about a blocked audit result.
- Use `scripts/refresh-understand-graph.ps1` for the graph refresh; do not manually edit graph artifacts.
- Do not leave Understand transient artifacts.

## Required Behavior

- Planning guidance must tell future WPs to include tracked `.understand-anything/**` artifacts in the originating WP when graph refresh is known to be required by planned source, skill, or workflow-doc changes.
- Planning guidance must reserve separate graph-refresh WPs for unplanned prior drift, repair, or cases where the originating WP did not or could not include graph artifacts.
- Closeout guidance must tell future WPs to include `docs/00-ssot/END-OF-DAY-HANDOFF.md` as closeout-only scope when accepted-WP closeout is expected.
- Finalization guidance must show the working PowerShell syntax that passes `-Bullet` and `-StagePath` as arrays in one invocation.
- Finalization guidance must state that, in the managed Codex desktop environment, commit-helper execution should request escalation up front because staging/committing writes `.git/index.lock`.
- Audit guidance must distinguish actual blocked audit results from generic PASS audit wording, and avoid parser-triggering blocked-state tokens in PASS examples unless quoting an actual blocked-audit case.
- Workflow docs must reflect the same policy so skills and durable docs do not diverge.
- The Understand graph must be refreshed in this WP after the skill/doc edits and before audit.

## Acceptance Criteria

- [ ] Planning skill/checklist says known-required graph refresh artifacts should be included in the originating WP scope.
- [ ] Planning skill/checklist says separate graph-refresh WPs are for unplanned prior drift, repairs, or scopes that did not include graph artifacts.
- [ ] Closeout skill/prompts and lifecycle/contributor docs document `END-OF-DAY-HANDOFF.md` closeout-only scope handling.
- [ ] Finalize skill/checklist and commit guide include working PowerShell array syntax for `-Bullet` and `-StagePath`.
- [ ] Finalize skill/checklist document managed-sandbox escalation for commit-helper Git index writes.
- [ ] Audit contract guidance prevents PASS audit examples/output contracts from using parser-triggering blocked-state wording except for actual blocked-audit examples.
- [ ] Understand graph refresh is performed in this WP after skill/doc edits.
- [ ] `.understand-anything/meta.json` records the Git HEAD used by the refresh wrapper, and Code Results records the pre-closeout HEAD/worktree refresh behavior.
- [ ] No executable helper scripts, app files, database files, package files, or dependencies are modified.
- [ ] No transient Understand temp, trash, or log artifacts remain.

## Code Prompt

Implement WP-229 exactly as scoped.

Update the allowed repo-local skills and workflow docs so future agents know the correct first-attempt process:

- Include tracked `.understand-anything/**` graph artifacts in the originating WP when graph refresh is already known to be required.
- Use separate graph-refresh WPs only for unplanned prior drift, graph repair, or scopes that did not include graph artifacts.
- Include `docs/00-ssot/END-OF-DAY-HANDOFF.md` as closeout-only allowed scope when accepted-WP closeout is expected.
- Use working PowerShell array syntax for `-Bullet` and `-StagePath` when calling `scripts/commit-work-package.ps1`.
- Request sandbox escalation up front for accepted-WP commit-helper execution in this environment because staging/committing writes `.git/index.lock`.
- Avoid parser-triggering blocked-state wording in PASS audit examples or generic output contracts unless recording an actual blocked audit.

After the documentation/skill edits, run the Understand readiness checks and refresh the graph inside this same WP:

1. `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1`
2. `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1 -Json`
3. `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refresh-understand-graph.ps1`

Then verify graph metadata, transient artifact hygiene, `git diff --check`, `git status --short --untracked-files=all`, and focused `rg` checks over the changed skill/docs. Record implementation results in `Code Results`, including the wrapper's Git HEAD metadata behavior for this pre-closeout worktree refresh.

Do not change scripts, apps, database files, package files, dependencies, runtime AI behavior, or Case 004 behavior.

## Audit Prompt

Audit WP-229 against this work package, the workflow SSOT, changed skill files, changed workflow docs, and graph artifacts.

Verify:

- Only allowed files changed.
- Skill instructions and durable docs agree on graph-refresh scoping, handoff closeout scope, commit-helper PowerShell array syntax, sandbox escalation expectation, and audit wording hazard.
- The guidance reduces repeat attempts rather than documenting workarounds after failure.
- Human final acceptance, independent audit, external audit authorization, scope isolation, and runtime AI boundaries remain intact.
- Graph refresh ran inside this WP after the skill/doc edits.
- Graph metadata records the Git HEAD used by the refresh wrapper, and Code Results accurately describe the pre-closeout worktree refresh behavior.
- No transient Understand artifacts remain.
- No scripts, app files, database files, package files, dependencies, runtime AI, or Case 004 behavior changed.

Output:

- Verdict: PASS, FAIL, or unable to complete
- Scope violations
- Process-guidance gaps
- Missing validation evidence
- Graph artifact concerns
- Drift risks

## Code Results

Implemented WP-229.

Changed repo-local workflow guidance:

- Updated `.codex/skills/sequel-city-wp-planning/SKILL.md` and `references/planning-checklist.md` so known-required graph refreshes include tracked `.understand-anything/**` artifacts in the originating WP when safe, and separate graph-refresh WPs are reserved for unplanned prior drift, repair, or scopes that could not include graph artifacts.
- Updated `.codex/skills/sequel-city-wp-closeout-handoff/SKILL.md` and `references/closeout-prompts.md` so accepted-WP closeout confirms `docs/00-ssot/END-OF-DAY-HANDOFF.md` is explicit closeout-only scope before editing the live handoff.
- Updated `.codex/skills/sequel-city-wp-finalize/SKILL.md` and `references/finalization-checklist.md` with first-attempt PowerShell helper syntax using comma-separated `-Bullet` and `-StagePath` arrays, plus managed Codex desktop escalation guidance for real helper commits that write `.git/index.lock`.
- Updated `.codex/skills/sequel-city-audit-runner-contracts/references/audit-contract.md` so PASS audit examples and generic output contracts avoid blocked-state parser tokens unless documenting an actual blocked audit result.
- Updated `docs/05-development-workflow/Work-Package-Lifecycle.md`, `Understand-Codebase-Analysis.md`, `Contributor-Workflow-Guide.md`, and `Commit-Message-Guide.md` with the same durable policies.

Refreshed the Understand graph inside this WP after the skill/doc edits:

- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1` passed before refresh: READY, dry run succeeded, no temp/trash/log artifacts.
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/check-understand-refresh-readiness.ps1 -Json` passed before refresh with `ready: true`.
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/refresh-understand-graph.ps1` passed: scanned 590 files, produced 906 nodes, 316 edges, 6 layers, 7 tour steps, and fingerprinted 590 files.
- After recording Code Results, `scripts/refresh-understand-graph.ps1` was rerun so the tracked graph artifacts include the final WP-229 implementation record before audit.
- Post-refresh `scripts/check-understand-refresh-readiness.ps1` passed: READY, dry run succeeded, no temp/trash/log artifacts.
- `.understand-anything/meta.json` records `gitCommitHash` `89b6af5211fbf03d5ef72982d099bcf9f49745fe` and `analyzedFiles` 590. This is the Git HEAD recorded by the refresh wrapper for the pre-closeout implementation worktree; the wrapper scans the current worktree but records HEAD, and WP-229 does not allow changing wrapper behavior.

### Validation

- Focused `rg` checks confirmed the modified skills/docs contain the required graph scoping, closeout-only handoff scope, helper array syntax, sandbox escalation, and PASS audit wording guidance.
- `rg -n -- "-Bullet @\(" .codex/skills/sequel-city-wp-finalize docs/05-development-workflow/Commit-Message-Guide.md` returned no matches.
- `rg -n -- "-StagePath" .codex/skills/sequel-city-wp-finalize/references/finalization-checklist.md docs/05-development-workflow/Commit-Message-Guide.md` shows only the comma-separated array examples and the "do not repeat" guidance.
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-work-package-status.ps1 WP-229` reported no out-of-scope dirty files.
- `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/get-work-package-validation-plan.ps1 WP-229` reported `ValidationPlanReady` with no missing findings.
- `git diff --check` passed. Git printed line-ending normalization warnings only.
- `git status --short --untracked-files=all` shows only WP-229 allowed files modified or untracked.

No executable helper scripts, app files, database files, package files, dependencies, runtime AI behavior, or Case 004 behavior were changed. No transient Understand temp, trash, or log artifacts remain.

## Audit Results

### Verdict

**PASS**

---

### Audit Verification Summary

1. **Scope Verification**
   - **Allowed files changed**: All modified/untracked files strictly match the allowed list in WP-229:
     - `.codex/skills/sequel-city-audit-runner-contracts/references/audit-contract.md`
     - `.codex/skills/sequel-city-wp-closeout-handoff/SKILL.md`
     - `.codex/skills/sequel-city-wp-closeout-handoff/references/closeout-prompts.md`
     - `.codex/skills/sequel-city-wp-finalize/SKILL.md`
     - `.codex/skills/sequel-city-wp-finalize/references/finalization-checklist.md`
     - `.codex/skills/sequel-city-wp-planning/SKILL.md`
     - `.codex/skills/sequel-city-wp-planning/references/planning-checklist.md`
     - `docs/05-development-workflow/Commit-Message-Guide.md`
     - `docs/05-development-workflow/Contributor-Workflow-Guide.md`
     - `docs/05-development-workflow/Understand-Codebase-Analysis.md`
     - `docs/05-development-workflow/Work-Package-Lifecycle.md`
     - `.understand-anything/fingerprints.json`
     - `.understand-anything/intermediate/scan-result.json`
     - `.understand-anything/knowledge-graph.json`
     - `.understand-anything/meta.json`
     - `docs/01-work-packages/WP-229-workflow-process-refinement-for-skills-and-closeout.md`
   - No out-of-scope dirty files were reported by [`scripts/get-work-package-status.ps1 WP-229`](file:///D:/GitHub-Repos/SequelCityWeb/scripts/get-work-package-status.ps1).

2. **Skill and Durable Documentation Alignment**
   - **Graph-refresh scoping**: Both [`sequel-city-wp-planning`](file:///D:/GitHub-Repos/SequelCityWeb/.codex/skills/sequel-city-wp-planning/SKILL.md) and [`Work-Package-Lifecycle.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/05-development-workflow/Work-Package-Lifecycle.md) / [`Understand-Codebase-Analysis.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/05-development-workflow/Understand-Codebase-Analysis.md) agree that known-required graph refreshes must include tracked `.understand-anything/**` artifacts in the originating WP allowed scope, reserving separate graph-refresh WPs for unplanned prior drift, graph repair, or scopes that cannot safely contain graph artifacts.
   - **Handoff closeout scope**: Both [`sequel-city-wp-closeout-handoff`](file:///D:/GitHub-Repos/SequelCityWeb/.codex/skills/sequel-city-wp-closeout-handoff/SKILL.md) and [`Work-Package-Lifecycle.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/05-development-workflow/Work-Package-Lifecycle.md) / [`Contributor-Workflow-Guide.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/05-development-workflow/Contributor-Workflow-Guide.md) agree that `docs/00-ssot/END-OF-DAY-HANDOFF.md` must be explicitly listed in the active WP as closeout-only allowed scope before editing the live handoff.
   - **PowerShell array syntax**: Both [`sequel-city-wp-finalize`](file:///D:/GitHub-Repos/SequelCityWeb/.codex/skills/sequel-city-wp-finalize/SKILL.md) and [`Commit-Message-Guide.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/05-development-workflow/Commit-Message-Guide.md) specify direct comma-separated array syntax (`-Bullet "a", "b"` and `-StagePath path1, path2`) and instruct agents not to repeat `-StagePath` or use `@(...)` inside nested command strings.
   - **Sandbox escalation expectation**: Both [`sequel-city-wp-finalize`](file:///D:/GitHub-Repos/SequelCityWeb/.codex/skills/sequel-city-wp-finalize/SKILL.md) and [`Commit-Message-Guide.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/05-development-workflow/Commit-Message-Guide.md) note that preview runs without escalation, but real helper commits require requesting sandbox escalation up front because staging/committing writes `.git/index.lock`.
   - **Audit wording hazard**: Both [`audit-contract.md`](file:///D:/GitHub-Repos/SequelCityWeb/.codex/skills/sequel-city-audit-runner-contracts/references/audit-contract.md) and [`Work-Package-Lifecycle.md`](file:///D:/GitHub-Repos/SequelCityWeb/docs/05-development-workflow/Work-Package-Lifecycle.md) instruct that PASS audit records and generic prompt examples must avoid parser-sensitive non-ready status tokens unless documenting an actual non-ready audit result.

3. **First-Attempt Process Efficiency**
   - Refinements focus on encoding correct initial behavior (upfront escalation request, direct array syntax, upfront graph/handoff scope inclusion, clean PASS audit wording) to eliminate repetitive trial-and-error failures.

4. **Governance and Boundary Integrity**
   - Human final acceptance, independent audit requirements, external audit authorization boundaries, scope isolation rules, and runtime AI restrictions remain completely intact.

5. **Graph Refresh Execution and Hygiene**
   - The graph was regenerated inside WP-229 after skill/doc modifications.
   - [`.understand-anything/meta.json`](file:///D:/GitHub-Repos/SequelCityWeb/.understand-anything/meta.json) correctly records `gitCommitHash` `89b6af5211fbf03d5ef72982d099bcf9f49745fe` (the baseline HEAD used by the wrapper for pre-closeout worktree scans), which matches the explanation recorded in WP-229 `Code Results`.
   - [`scripts/check-understand-refresh-readiness.ps1`](file:///D:/GitHub-Repos/SequelCityWeb/scripts/check-understand-refresh-readiness.ps1) confirms `READY` status with zero temporary, trash, or log artifacts remaining.

6. **Non-Modification of Protected Surfaces**
   - No executable helper scripts, application code, database files, package manifests, external dependencies, runtime AI behaviors, or Case 004 assets were touched.

---

### Required Findings Sections

- **Scope violations**: None.
- **Process-guidance gaps**: None.
- **Missing validation evidence**: None (`git diff --check`, `check-understand-refresh-readiness.ps1`, `get-work-package-status.ps1`, and focused regex checks all passed clean).
- **Graph artifact concerns**: None. Graph artifacts are tracked, clean, fresh, and free of transient files.
- **Drift risks**: None. Repo-local skill instructions and durable workflow documentation are synchronized.
The background task notification for `task-60` has been processed. The audit of WP-229 remains complete with a verdict of **PASS**.

## Final Decision

Accepted on 2026-08-06 after PASS audit and human closeout request.

Rationale: WP-229 implemented the scoped process-refinement guidance, refreshed the Understand graph within the package, preserved development-only boundaries, and produced no audit findings requiring correction.

