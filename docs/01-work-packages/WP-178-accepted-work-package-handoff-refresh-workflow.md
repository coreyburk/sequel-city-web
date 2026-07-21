# Accepted Work Package Handoff Refresh Workflow

## Objective

Create a repo-local Codex skill that triggers on accepted-WP closeout requests and guides audit review, scoped corrections, final decision, optional handoff refresh, commit, and push using project gates.

## Scope

### In Scope

- Create a repo-local `sequel-city-wp-closeout-handoff` skill.
- Include trigger keywords for common closeout requests:
  - `close out WP`
  - `finalize WP`
  - `audit complete`
  - `review, update, commit, and push`
  - `update handoff`
  - `refresh handoff`
  - `accepted work package`
  - `proper closeout request`
- Add reusable closeout prompt text under the skill references.
- Add UI metadata for the skill with a default prompt that names `$sequel-city-wp-closeout-handoff`.
- Add focused validation that checks trigger metadata, required reads, prompt text, and UI metadata.
- Update workflow documentation with the proper closeout request wording and handoff-refresh rule.

### Out of Scope

- Automatically refreshing the live handoff during this implementation package.
- Committing or pushing another work package.
- Running AGY, Gemini, Codex, or Claude from the skill.
- Adding OpenAI Agents SDK, new dependencies, MCP servers, Python package dependencies, or runtime AI.
- Application frontend/backend behavior.
- Database schema, seed, migration, or SQL safety changes.
- Understand graph regeneration.

## Impact Analysis

### Understand Status

- Graph available: Yes. `.understand-anything/knowledge-graph.json`, `.understand-anything/fingerprints.json`, and `.understand-anything/meta.json` exist.
- Baseline commit: `418990872a72e034197857ff383f74dfa575a90f`.
- Freshness assessment: Structurally stale for current repository state. Later accepted work added database identity validation, AGY runner support, audit/finalization isolation checks, lifecycle readiness checking, validation-plan checking, and repo-local workflow skills/scripts.
- Analysis performed: Read `SSOT-Development-Workflow.md`, `Work-Package-Lifecycle.md`, `Understand-Codebase-Analysis.md`, planning checklist, skill-creator instructions, existing repo-local skills, handoff template, live handoff, recent WP-170 through WP-177 records, and current workflow scripts. Used source inspection rather than graph relationships because the relevant surface is repo-local development workflow tooling added after the graph baseline.

### Affected Architecture

- Layers:
  - repo-local Codex skills
  - work-package documentation
  - development workflow documentation
  - handoff workflow guidance
- Primary files/components:
  - `docs/01-work-packages/WP-178-accepted-work-package-handoff-refresh-workflow.md`
  - `.codex/skills/sequel-city-wp-closeout-handoff/SKILL.md`
  - `.codex/skills/sequel-city-wp-closeout-handoff/agents/openai.yaml`
  - `.codex/skills/sequel-city-wp-closeout-handoff/references/closeout-prompts.md`
  - `scripts/tests/test-wp-closeout-handoff-skill.ps1`
  - `docs/05-development-workflow/Contributor-Workflow-Guide.md`
  - `docs/05-development-workflow/Work-Package-Lifecycle.md`
- Upstream consumers:
  - human developer
  - Codex closeout/finalization agents
  - future OpenAI Agents SDK orchestration
  - machine-switch handoff workflow
- Downstream dependencies:
  - accepted-WP closeout consistency
  - handoff freshness
  - future agentic orchestration

### Regression Surface

- Related tests:
  - `powershell -ExecutionPolicy Bypass -File scripts/tests/test-wp-closeout-handoff-skill.ps1`
  - `python C:\Users\cburk\.codex\skills\.system\skill-creator\scripts\quick_validate.py .codex/skills/sequel-city-wp-closeout-handoff`
  - `powershell -ExecutionPolicy Bypass -File scripts/run-work-package.ps1 WP-178 -Execute None`
  - `git diff --check`
- User workflows:
  - asking Codex to close out a WP after audit
  - asking for `commit and push` after audit
  - deciding whether to refresh `END-OF-DAY-HANDOFF.md`
  - machine-switch handoff after accepted work
- Security/data boundaries:
  - no runtime AI
  - no application or database changes
  - no external audit invocation
  - no dependency changes
  - no automatic Git mutation by the skill itself

### Graph Update Decision

- Regeneration required: No.
- Rationale: This package adds repo-local workflow skill metadata, prompt guidance, documentation, and a validation script. It does not change application architecture, imports, database structure, Case 004 progression, runtime behavior, or package dependencies.

## Files Allowed to Change

Allowed:

- docs/01-work-packages/WP-178-accepted-work-package-handoff-refresh-workflow.md
- .codex/skills/sequel-city-wp-closeout-handoff/**
- scripts/tests/test-wp-closeout-handoff-skill.ps1
- docs/05-development-workflow/Contributor-Workflow-Guide.md
- docs/05-development-workflow/Work-Package-Lifecycle.md

Do Not Modify:

- apps/**
- database/**
- package.json
- package-lock.json
- apps/**/package.json
- apps/**/package-lock.json
- .understand-anything/**
- docs/00-ssot/**
- scripts/run-work-package.ps1
- scripts/commit-work-package.ps1
- scripts/get-work-package-status.ps1
- scripts/get-work-package-validation-plan.ps1

## Constraints

- Keep the skill development-only.
- Do not add runtime AI behavior, runtime LLM calls, cloud services, external APIs, or SDK dependencies.
- Do not let the closeout skill bypass independent audit, validation evidence, scoped file checks, or human final acceptance.
- Do not make handoff refresh mandatory for every WP; require a material resume-context reason.
- Do not update the live handoff in this package unless separately requested.
- Preserve the existing `sequel-city-wp-finalize` helper workflow for accepted-WP commits.

## Required Behavior

- The new skill must trigger from closeout language and handoff-refresh language.
- The skill must instruct Codex to read the target WP, workflow docs, finalization skill, and audit contract skill when relevant.
- The skill must provide explicit closeout stopping rules.
- The skill must define when to refresh or skip `END-OF-DAY-HANDOFF.md`.
- The prompt reference must include user-facing closeout prompt examples.
- The validation test must prove trigger phrases and prompt references are present.
- Workflow docs must tell users which wording to use.

## Acceptance Criteria

- [x] `sequel-city-wp-closeout-handoff` skill exists under `.codex/skills`.
- [x] Skill frontmatter description includes closeout, audit-complete, commit/push, and handoff-refresh trigger wording.
- [x] Skill body defines required reads, closeout workflow, handoff-refresh rules, and stopping rules.
- [x] Prompt reference includes standard, AGY-audit-complete, handoff-inclusive, and minimal closeout prompt examples.
- [x] `agents/openai.yaml` includes a default prompt naming `$sequel-city-wp-closeout-handoff`.
- [x] Focused validation checks the trigger phrases, prompt text, required reads, and UI metadata.
- [x] Workflow docs explain the proper closeout request wording.
- [x] No app, database, package, lockfile, graph, SSOT, runtime AI, or generated-output files are modified.

## Code Prompt

Implement WP-178 exactly as scoped.

Scope:

- Only modify files listed under `Files Allowed to Change`.
- Do not modify app, database, dependency, package, lockfile, graph, SSOT, handoff, runtime AI, or generated-output files.

Implementation guidance:

1. Create `.codex/skills/sequel-city-wp-closeout-handoff` using the skill-creator guidance.
2. Ensure skill metadata includes closeout trigger keywords.
3. Add reusable prompt text under `references/closeout-prompts.md`.
4. Add or correct `agents/openai.yaml` so the default prompt explicitly names `$sequel-city-wp-closeout-handoff`.
5. Add a focused PowerShell test for trigger phrases, required reads, prompt examples, and UI metadata.
6. Update contributor/lifecycle docs with proper closeout request wording.
7. Update this WP with code results and validation evidence.

Verification:

- `powershell -ExecutionPolicy Bypass -File scripts/tests/test-wp-closeout-handoff-skill.ps1`
- `python C:\Users\cburk\.codex\skills\.system\skill-creator\scripts\quick_validate.py .codex/skills/sequel-city-wp-closeout-handoff`
- `powershell -ExecutionPolicy Bypass -File scripts/run-work-package.ps1 WP-178 -Execute None`
- `git diff --check`

Return:

- exact files changed
- trigger keywords supported
- closeout prompt text added
- validation results
- any limitations

## Audit Prompt

Audit WP-178 against the work package and development workflow docs.

Verify:

- Skill trigger metadata contains the closeout and handoff keywords needed for future requests.
- Prompt text is explicit enough for audit/review/update/commit/push/handoff closeout.
- The skill does not bypass audit, validation evidence, human acceptance, scoped file checks, or the finalization helper.
- Handoff refresh is conditional on material resume-context impact.
- No runtime AI, app, database, dependency, package, lockfile, graph, SSOT, or generated-output files changed.
- Tests validate trigger phrases, required reads, prompt references, and UI metadata.
- Workflow docs align with the skill behavior.

Output:

- Verdict: PASS or FAIL
- Scope violations
- Trigger or prompt gaps
- Boundary risks
- Missing tests
- Recommended corrections

## Code Results

Implemented.

Files changed:

- `docs/01-work-packages/WP-178-accepted-work-package-handoff-refresh-workflow.md`
- `.codex/skills/sequel-city-wp-closeout-handoff/SKILL.md`
- `.codex/skills/sequel-city-wp-closeout-handoff/agents/openai.yaml`
- `.codex/skills/sequel-city-wp-closeout-handoff/references/closeout-prompts.md`
- `scripts/tests/test-wp-closeout-handoff-skill.ps1`
- `docs/05-development-workflow/Contributor-Workflow-Guide.md`
- `docs/05-development-workflow/Work-Package-Lifecycle.md`

Trigger keywords supported:

- `close out WP`
- `finalize WP`
- `audit complete`
- `review/update/commit/push`
- `update handoff`
- `refresh handoff`
- `accepted work package`
- `proper closeout request`

Closeout prompt text added:

- standard closeout prompt
- AGY audit complete prompt
- commit and handoff closeout prompt
- minimal commit-only closeout prompt
- required closeout checks list
- resolved-WP-path guidance for status and validation helper scripts

Validation:

- PASS: `powershell -ExecutionPolicy Bypass -File scripts/tests/test-wp-closeout-handoff-skill.ps1`
- PASS: `python C:\Users\cburk\.codex\skills\.system\skill-creator\scripts\quick_validate.py .codex/skills/sequel-city-wp-closeout-handoff`
- PASS: `powershell -ExecutionPolicy Bypass -File scripts/run-work-package.ps1 WP-178 -Execute None`
- PASS: `git diff --check` with CRLF warnings only.

Limitations:

- This package creates the closeout/handoff skill and docs. It does not refresh the live handoff because the live handoff should be updated during a material accepted-WP closeout, not during every workflow-tooling implementation.
- The closeout skill resolves this by instructing agents to pass resolved WP paths to status/validation helper scripts; number-only input currently works for `scripts/run-work-package.ps1`, while the helper scripts may require the full WP path.

## Audit Results

### Audit Summary: WP-178

I have audited [WP-178-accepted-work-package-handoff-refresh-workflow.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-178-accepted-work-package-handoff-refresh-workflow.md) against the work package specification and development workflow guidelines.

---

### **Verdict**: PASS

---

### Audit Findings

1. **Trigger Metadata**:
   - Both frontmatter `description` and the `## Closeout Request Keywords` section in [SKILL.md](file:///D:/GitHub-Repos/SequelCityWeb/.codex/skills/sequel-city-wp-closeout-handoff/SKILL.md) include all required closeout and handoff keywords (`close out WP`, `finalize WP`, `audit complete`, `review/update/commit/push`, `update handoff`, `refresh handoff`, `accepted work package`, `proper closeout request`).
   - [openai.yaml](file:///D:/GitHub-Repos/SequelCityWeb/.codex/skills/sequel-city-wp-closeout-handoff/agents/openai.yaml) specifies `default_prompt: "Use $sequel-city-wp-closeout-handoff..."`.

2. **Prompt Completeness**:
   - [closeout-prompts.md](file:///D:/GitHub-Repos/SequelCityWeb/.codex/skills/sequel-city-wp-closeout-handoff/references/closeout-prompts.md) provides explicit prompt templates for standard closeout, AGY audit complete, handoff refresh, and minimal commit-only cases.
   - Clear guidance is included for WP path resolution, running helper status/validation scripts, performing `git diff --check` and `git status --short`, and using `scripts/commit-work-package.ps1`.

3. **Gate Preservation**:
   - The skill explicitly states it does not replace independent audit, human acceptance, or `sequel-city-wp-finalize`.
   - Stopping rules prevent commit/push if audit fails, dirty files exist outside scope, required validation evidence is missing, or human acceptance is absent.

4. **Handoff Refresh Rules**:
   - Refresh of `docs/00-ssot/END-OF-DAY-HANDOFF.md` is strictly conditional on material resume-context or project-state impact. Rote updates are explicitly prohibited, requiring a stated reason when skipped.

5. **Scope & File Boundaries**:
   - Changes are strictly isolated to permitted files:
     - [WP-178-accepted-work-package-handoff-refresh-workflow.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/01-work-packages/WP-178-accepted-work-package-handoff-refresh-workflow.md)
     - [.codex/skills/sequel-city-wp-closeout-handoff/SKILL.md](file:///D:/GitHub-Repos/SequelCityWeb/.codex/skills/sequel-city-wp-closeout-handoff/SKILL.md)
     - [.codex/skills/sequel-city-wp-closeout-handoff/agents/openai.yaml](file:///D:/GitHub-Repos/SequelCityWeb/.codex/skills/sequel-city-wp-closeout-handoff/agents/openai.yaml)
     - [.codex/skills/sequel-city-wp-closeout-handoff/references/closeout-prompts.md](file:///D:/GitHub-Repos/SequelCityWeb/.codex/skills/sequel-city-wp-closeout-handoff/references/closeout-prompts.md)
     - [test-wp-closeout-handoff-skill.ps1](file:///D:/GitHub-Repos/SequelCityWeb/scripts/tests/test-wp-closeout-handoff-skill.ps1)
     - [Contributor-Workflow-Guide.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/05-development-workflow/Contributor-Workflow-Guide.md)
     - [Work-Package-Lifecycle.md](file:///D:/GitHub-Repos/SequelCityWeb/docs/05-development-workflow/Work-Package-Lifecycle.md)
   - Zero runtime AI, app, database, package, lockfile, graph, SSOT, or generated-output files were modified.

6. **Test & Documentation Verification**:
   - `test-wp-closeout-handoff-skill.ps1` executes and passes (validates trigger phrases, required reads, prompt references, and UI metadata).
   - `quick_validate.py` passes for skill structural validity.
   - `Contributor-Workflow-Guide.md` and `Work-Package-Lifecycle.md` correctly reference the closeout trigger phrasing and handoff refresh rules.

---

### Verification Output Format

- **Verdict**: PASS
- **Scope violations**: None
- **Trigger or prompt gaps**: None
- **Boundary risks**: None
- **Missing tests**: None
- **Recommended corrections**: None

> [!TIP]
> **Workspace Recommendation**: It is recommended to set `D:\GitHub-Repos\SequelCityWeb` as your active workspace for future work package execution and audits in this repository.
All background tasks have completed. The audit for WP-178 is complete with a **PASS** verdict and all findings are documented above.

## Final Decision

Accepted.

Reason: Human instruction was given to review, update, commit, and push after audit completion. AGY audit passed with no scope violations, trigger/prompt gaps, boundary risks, missing tests, or recommended corrections. WP-178 is accepted because it adds the repo-local closeout/handoff skill, trigger wording, reusable prompt text, workflow documentation, and validation coverage while preserving independent audit, human final acceptance, finalization-helper, application, database, SSOT, graph, dependency, generated-output, and runtime AI boundaries.

Handoff refresh decision: skipped for this package. WP-178 creates the closeout/handoff workflow and explicitly keeps live `END-OF-DAY-HANDOFF.md` refresh out of scope unless separately requested during a material accepted-WP closeout.


