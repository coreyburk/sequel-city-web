# WP-170: Audit To Corrective Work Package Skill

## Objective

Create a repository-local Codex skill that turns failed audit results, review findings, or unmet acceptance criteria into a narrow corrective work package, then stops before implementation.

## Scope

### In Scope

- Add a new repo-local Codex skill for corrective work-package generation.
- Teach the skill to read the original work package, audit/review findings, lifecycle rules, and relevant SSOT references.
- Require the skill to generate a new corrective WP using `scripts/new-lite-work-package.ps1` as the canonical creation mechanism.
- Require the generated corrective WP to reference the original WP, identify the exact defect or omission, keep scope narrow, and preserve original boundaries unless explicitly justified.
- Add a concise checklist/reference file for corrective-WP generation.
- Add lightweight fixture or example material if practical to validate expected skill behavior.
- Keep the skill development-only and documentation/tooling-only.

### Out of Scope

- Implementing the corrective work package after it is generated.
- Accepting, auditing, committing, or pushing generated corrective work.
- Adding OpenAI Agents SDK or any other dependency.
- Adding Python, Node, or PowerShell orchestration beyond the existing `scripts/new-lite-work-package.ps1` call guidance.
- Changing `scripts/new-lite-work-package.ps1`, `scripts/run-work-package.ps1`, or `scripts/commit-work-package.ps1`.
- Changing app runtime behavior, database behavior, Case 004 progression, package manifests, lockfiles, generated outputs, or production AI/runtime behavior.
- Replacing `sequel-city-wp-planning` or `sequel-city-wp-finalize`.

## Impact Analysis

### Understand Status

- Graph available: Yes.
- Baseline commit: `418990872a72e034197857ff383f74dfa575a90f`.
- Freshness assessment: Usable with non-structural drift. Current `HEAD` is `530078dd0d6573e6a370de6cb152f97ea4a5a4ee`; later commits are `WP-168` agentic workflow documentation and `WP-169` naming-policy documentation. Those commits do not change app architecture, imports, scripts, database structure, or runtime behavior.
- Analysis performed: Reviewed `SSOT-Development-Workflow.md`, `Work-Package-Lifecycle.md`, `Understand-Codebase-Analysis.md`, `Agentic-Development-Workflow-Evaluation.md`, existing repo-local skills, `new-lite-work-package.ps1`, `run-work-package.ps1`, and targeted graph/source search for work-package, corrective, audit, and skill references.

### Affected Architecture

- Layers: Architecture and Operations; Repository Tooling; Development Workflow Documentation.
- Primary files/components:
  - `docs/01-work-packages/WP-170-audit-to-corrective-work-package-skill.md`
  - `.codex/skills/sequel-city-wp-corrective/SKILL.md`
  - `.codex/skills/sequel-city-wp-corrective/agents/openai.yaml`
  - `.codex/skills/sequel-city-wp-corrective/references/corrective-work-package-checklist.md`
  - optional fixture/example files under `.codex/skills/sequel-city-wp-corrective/references/`
  - read-only references: `docs/05-development-workflow/Work-Package-Lifecycle.md`, `docs/05-development-workflow/Agentic-Development-Workflow-Evaluation.md`, `scripts/new-lite-work-package.ps1`
- Upstream consumers: human developer, Codex agents, future audit agents, reviewers converting audit failures into follow-up work.
- Downstream dependencies: future corrective WPs, possible later OpenAI Agents SDK orchestration evaluation, handoff and roadmap planning discipline.

### Regression Surface

- Related tests:
  - documentation and skill review
  - `git diff --check`
  - `rg` checks for forbidden dependency/runtime claims
  - fixture/example review if added
  - optional dry-run review of generated corrective WP structure without accepting or implementing it
- User workflows:
  - failed audit interpretation
  - review finding triage
  - corrective WP creation
  - work-package scope control
  - human final acceptance
- Security/data boundaries:
  - No runtime AI, cloud service, external API, student-data, SQL safety, answer-key, credential, database, or Case 004 behavior changes.
  - Skill must not run destructive actions.
  - Skill must not accept its own generated work or bypass independent audit/finalization.

### Graph Update Decision

- Regeneration required: No.
- Rationale: This package plans a repo-local development skill and small reference docs. It does not change application architecture, imports, runtime behavior, database structure, Case 004 progression, package manifests, lockfiles, scripts, or generated outputs. If implementation materially expands local skill structure beyond documentation/skill instructions, reassess during audit.

## Files Allowed to Change

Allowed:

- `docs/01-work-packages/WP-170-audit-to-corrective-work-package-skill.md`
- `.codex/skills/sequel-city-wp-corrective/**`

Do Not Modify:

- `apps/api/**`
- `apps/web/**`
- `database/**`
- `scripts/**`
- `.codex/skills/sequel-city-wp-planning/**`
- `.codex/skills/sequel-city-wp-finalize/**`
- `.understand-anything/**`
- package manifests
- dependency lockfiles
- `outputs/**`
- historical work packages other than this active `WP-170`

## Constraints

- Keep the skill development-only.
- Do not add dependencies.
- Do not add runtime AI, runtime LLM calls, MCP runtime requirements, cloud services, or external APIs to Sequel Detective.
- Do not change existing scripts or app code.
- Do not let the corrective skill accept, implement, audit, commit, or push generated work.
- Do not let audit output override SSOT, source, tests, or human final judgment.
- Preserve `scripts/new-lite-work-package.ps1` as the canonical WP file creation mechanism.
- Preserve `sequel-city-wp-planning` for general planning and `sequel-city-wp-finalize` for accepted closeout.

## Required Behavior

The new skill must:

- Be named clearly as a corrective work-package skill.
- Trigger when the user asks to turn audit failures, review findings, or unmet acceptance criteria into a corrective WP.
- Read its `SKILL.md` instructions and the corrective checklist before acting.
- Read the original WP and identify:
  - objective
  - allowed files
  - do-not-modify boundaries
  - constraints
  - acceptance criteria
  - code results
  - audit results
  - final decision, if present
- Distinguish defects/omissions from optional enhancements.
- Generate the next corrective WP using `scripts/new-lite-work-package.ps1`.
- Populate the corrective WP with:
  - reference to the original WP
  - exact defect or omission
  - narrow allowed-file set
  - explicit out-of-scope boundaries
  - impact analysis
  - acceptance criteria
  - code prompt
  - audit prompt
  - pending code results, audit results, and final decision
- Stop after creating the corrective WP unless the user separately requests implementation.
- State unresolved assumptions when audit findings are ambiguous or the original WP is missing required sections.

The skill must refuse or stop when:

- No original WP or actionable audit/review finding is available.
- The user asks it to accept, implement, commit, push, or bypass audit as part of corrective WP generation.
- The requested correction would require runtime AI, dependency adoption, database mutation, or destructive actions without a separate scoped WP.

## Acceptance Criteria

- [x] A repo-local Codex skill exists under `.codex/skills/sequel-city-wp-corrective/`.
- [x] The skill instructions clearly describe when to use it and when to stop.
- [x] The skill preserves the existing WP lifecycle and human final acceptance.
- [x] The skill requires `scripts/new-lite-work-package.ps1` for new WP creation.
- [x] The skill creates corrective WPs, not implementation changes.
- [x] The skill narrows scope from the original failed work and records exact defects/omissions.
- [x] The skill handles missing or ambiguous audit findings by stopping with a clear blocker.
- [x] Fixture/example material or manual validation demonstrates the intended corrective-WP shape.
- [x] No app, database, script, graph, package-manifest, lockfile, dependency, runtime AI, or output files are modified.

## Code Prompt

Implement `WP-170` as a repository-local Codex skill package.

Scope:

- Add `.codex/skills/sequel-city-wp-corrective/SKILL.md`.
- Add `.codex/skills/sequel-city-wp-corrective/agents/openai.yaml` if consistent with the existing repo-local skill pattern.
- Add `.codex/skills/sequel-city-wp-corrective/references/corrective-work-package-checklist.md`.
- Add fixture/example reference material under `.codex/skills/sequel-city-wp-corrective/references/` if practical.
- Update this WP with Code Results after implementation.

Required implementation:

1. Model the skill metadata and file layout after the existing repo-local skills.
2. Require the skill to read:
   - `docs/05-development-workflow/Work-Package-Lifecycle.md`
   - `docs/05-development-workflow/Agentic-Development-Workflow-Evaluation.md`
   - `.codex/skills/sequel-city-wp-corrective/references/corrective-work-package-checklist.md`
3. Instruct the skill to create the corrective WP with `scripts/new-lite-work-package.ps1`.
4. Define the corrective WP output structure and stopping rules.
5. Define blocker behavior for missing original WP, missing audit findings, ambiguous findings, or requests to implement/accept/commit.
6. Preserve runtime AI, dependency, app, database, script, graph, package, lockfile, and output boundaries.

Verification:

- Run `git diff --check` for changed files.
- Run targeted `rg` checks for forbidden dependency/runtime claims and for required lifecycle references.
- Review any fixture/example material against the acceptance criteria.

Return:

- files changed
- skill behavior summary
- validation performed
- unresolved limitations, if any

## Audit Prompt

Audit `WP-170`.

Verify:

- The new skill is repository-local and development-only.
- The skill generates corrective WPs and stops before implementation, acceptance, commit, or push.
- The skill requires `scripts/new-lite-work-package.ps1` as the WP creation mechanism.
- The skill preserves human final acceptance, independent audit, and finalization boundaries.
- The skill distinguishes exact defects/omissions from optional enhancements.
- The skill narrows allowed files and records explicit out-of-scope boundaries.
- The skill blocks or asks for missing context when no original WP or actionable audit finding is available.
- No app, database, script, graph, package-manifest, lockfile, dependency, runtime AI, or output files changed.
- Graph regeneration decision was followed.

Output:

- Verdict: PASS or FAIL
- Scope violations
- Missing lifecycle boundaries
- Unsafe automation or acceptance drift
- Missing blocker behavior
- Recommended corrections

## Code Results

Implemented.

Changed files:

- Added `.codex/skills/sequel-city-wp-corrective/SKILL.md`.
- Added `.codex/skills/sequel-city-wp-corrective/agents/openai.yaml`.
- Added `.codex/skills/sequel-city-wp-corrective/references/corrective-work-package-checklist.md`.
- Added `.codex/skills/sequel-city-wp-corrective/references/example-corrective-work-package.md`.
- Updated this work package with implementation results and acceptance evidence.

Skill behavior summary:

- Triggers for failed audits, review findings, unmet acceptance criteria, scope violations, and incomplete prior work that need a corrective WP.
- Requires reading the lifecycle, agentic workflow evaluation, corrective checklist, original WP, and audit/review findings.
- Classifies findings as defect, omission, scope violation, or optional enhancement.
- Requires `scripts/new-lite-work-package.ps1` for corrective WP creation.
- Requires generated corrective WPs to reference the original WP, name the exact defect, use narrow allowed files, preserve do-not-modify boundaries, and leave results/final decision pending.
- Stops when the original WP or actionable finding is missing, when the finding is optional only, or when the user asks it to implement, accept, audit, commit, push, or bypass review.

Validation performed:

- `python C:\Users\cburk\.codex\skills\.system\skill-creator\scripts\quick_validate.py .codex\skills\sequel-city-wp-corrective`: PASS.
- `git diff --check` for WP-170 and `.codex/skills/sequel-city-wp-corrective/**`: PASS.
- Targeted `rg` checks confirmed required lifecycle references, `new-lite-work-package.ps1` usage, pending result sections, runtime/dependency boundaries, and package/lockfile boundaries.
- Fixture/example review confirmed the intended corrective-WP shape leaves implementation results and final decision pending.

Unresolved limitations:

- No live corrective WP was generated during implementation because that would create a new work package outside `WP-170` scope.

## Audit Results

- Verdict: PASS
- Scope violations: None. Only files within the allowed boundaries (`docs/01-work-packages/WP-170-audit-to-corrective-work-package-skill.md` and `.codex/skills/sequel-city-wp-corrective/**`) were created or modified.
- Missing lifecycle boundaries: None. The skill enforces the work package lifecycle, requiring `scripts/new-lite-work-package.ps1` for creation and preserving human final acceptance, independent audit, and finalization rules.
- Unsafe automation or acceptance drift: None. The skill restricts automated actions to generating corrective WPs and explicitly blocks implementation, acceptance, commit, or push.
- Missing blocker behavior: None. The skill blocks execution when original WPs, actionable findings, or context are missing, or when requested corrections exceed allowed capabilities or lifecycle rules.
- Recommended corrections: None.

Post-audit lifecycle correction:

- AntiGravity wrote an accepted final decision while recording the audit. That was corrected to pending human acceptance because final work-package acceptance remains human-owned.

## Final Decision

Accepted.

Reason: Human acceptance was given after implementation and AntiGravity audit. The skill is repo-local, development-only, preserves corrective work-package lifecycle boundaries, and does not modify app, database, script, graph, package, lockfile, dependency, runtime AI, or output files.
