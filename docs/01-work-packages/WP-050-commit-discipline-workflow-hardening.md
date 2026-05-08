# commit-discipline-workflow-hardening

## Objective

Harden the accepted work package finalization process so commit-message drift is less likely to recur.

This WP establishes:

- explicit workflow wording that names the required multi-line commit format
- a repo helper script for accepted work package commits
- a repo-local Codex skill for repeatable work package finalization

The goal is to reduce process drift by replacing memory-based closeout steps with checked-in guidance and repeatable tooling.

---

## Scope

Tighten the current project development workflow by updating wording at the point of use and adding lightweight helper automation.

This WP may modify workflow documentation, reporting templates, one PowerShell helper script, and one repo-local Codex skill.

No frontend behavior changes.
No backend behavior changes.
No database changes.
No dependency changes.

---

## Files Allowed to Change

- docs/01-work-packages/WP-050-commit-discipline-workflow-hardening.md
- docs/05-development-workflow/Commit-Message-Guide.md
- docs/05-development-workflow/Contributor-Workflow-Guide.md
- docs/00-ssot/END-OF-DAY-HANDOFF.md
- docs/12-progress-reports/DAILY-YYYY-MM-DD.md
- docs/12-progress-reports/WEEKLY-YYYY-WW.md
- scripts/commit-work-package.ps1
- .codex/skills/sequel-city-wp-finalize/SKILL.md
- .codex/skills/sequel-city-wp-finalize/agents/openai.yaml
- .codex/skills/sequel-city-wp-finalize/references/finalization-checklist.md

Do Not Modify:

- apps/api/**
- apps/web/**
- database/**
- package.json files
- build configuration
- existing runtime source files

---

## Constraints

- Keep the hardening lightweight and local-first
- Do not introduce external dependencies
- Do not invent cloud automation, hosted release tooling, or CI requirements
- Keep the helper script safe for shared repo use
- Preserve the project's established work package and final decision workflow
- The skill must remain concise and reference repo artifacts instead of duplicating long guidance

---

## Required Behavior

### 1. Clarify Commit Format Wording

Update workflow/reporting docs so they explicitly state the project commit format:

- imperative title line
- blank line
- bullet list of concrete changes
- optional final preservation bullet

Explicitly discourage single-line Conventional Commit style for accepted work package finalization in this repo.

### 2. Add Commit Helper Script

Create `scripts/commit-work-package.ps1`.

The script must:

- accept a work package path
- accept a title and one or more body bullets
- optionally accept a preservation bullet
- verify the work package `Final Decision` reflects accepted or approved work before committing
- support a preview mode that prints the generated commit message without committing
- reject single-line Conventional Commit style titles such as `docs: ...` or `feat: ...`
- create a multi-line commit message that matches the documented project style

### 3. Add Repo-Local Finalization Skill

Create a repo-local skill at `.codex/skills/sequel-city-wp-finalize/`.

The skill must instruct Codex to:

- verify `Final Decision`
- read the workflow commit guide
- draft a compliant imperative title and concrete bullets
- use the helper script in preview mode first
- commit only after reviewing the preview against actual changes
- push only after commit success
- avoid one-line `git commit -m` closeout flow for accepted WPs

### 4. Keep Reporting Templates Aligned

Update progress-report and handoff templates so commit logging points contributors back to the required multi-line format.

---

## Acceptance Criteria

- `WP-050` exists
- workflow docs explicitly state the multi-line commit format
- ambiguous `single-spaced` wording is removed or clarified
- `scripts/commit-work-package.ps1` exists
- the script supports preview mode
- the script checks accepted/approved final decision state
- the script rejects single-line Conventional Commit title prefixes
- `.codex/skills/sequel-city-wp-finalize/` exists
- the skill references the helper script and workflow docs
- no runtime application files are modified

---

## Codex Prompt

Implement WP-050 commit-discipline workflow hardening.

Do:

- add a new work package record
- tighten workflow wording so commit format is explicit
- add a PowerShell helper for compliant accepted-WP commits
- add a repo-local Codex skill for WP finalization
- align handoff/progress templates with the corrected commit guidance

Do not:

- modify frontend or backend runtime code
- add dependencies
- add CI-specific tooling
- rewrite existing git history

Return:

- files changed
- process changes introduced
- verification performed

---

## Gemini Audit Prompt

Audit WP-050 commit-discipline workflow hardening.

Verify:

1. Only approved files were modified.
2. Workflow docs explicitly describe the required multi-line commit format.
3. Ambiguous wording that could imply one-line commit format was clarified.
4. `scripts/commit-work-package.ps1` exists and:
   - accepts WP path, title, and bullets
   - supports preview mode
   - checks `Final Decision`
   - rejects Conventional Commit style prefixes
5. The repo-local skill exists at `.codex/skills/sequel-city-wp-finalize/`.
6. The skill references the workflow docs and helper script rather than re-documenting everything inline.
7. Reporting templates now point back to the required commit style.
8. No frontend, backend, database, or dependency files changed.

Flag:

- workflow drift
- missing validation
- over-engineered automation
- unauthorized file changes

---

## Codex Results

Completed:

- Added `WP-050` for commit-discipline workflow hardening.
- Created `scripts/commit-work-package.ps1`.
- Created the repo-local skill at `.codex/skills/sequel-city-wp-finalize/`.
- Added `references/finalization-checklist.md` for the skill.
- Clarified commit-format expectations in:
  - `docs/05-development-workflow/Commit-Message-Guide.md`
  - `docs/05-development-workflow/Contributor-Workflow-Guide.md`
  - `docs/00-ssot/END-OF-DAY-HANDOFF.md`
  - `docs/12-progress-reports/DAILY-YYYY-MM-DD.md`
  - `docs/12-progress-reports/WEEKLY-YYYY-WW.md`

Validation Performed:

- Ran `scripts/commit-work-package.ps1` in preview mode against approved `WP-049` and confirmed it renders the required multi-line commit format.
- Verified the helper rejects Conventional Commit title prefixes such as `docs: ...`.
- Verified the helper blocks commit attempts when the work package `Final Decision` is still pending.
- Ran `quick_validate.py` against `.codex/skills/sequel-city-wp-finalize` and received `Skill is valid!`.
- Verified the current worktree changes stay within the allowed WP-050 file scope.

Notes:

- No runtime application tests were run because this work package changes workflow documentation, a helper script, and a repo-local skill only.

## Gemini Audit Results

Audit of **WP-050 commit-discipline workflow hardening** is complete. All verification points have been addressed and confirmed.

### Audit Summary

1.  **Approved Files Only:** Verified that modifications are strictly confined to `docs/`, `scripts/`, and `.codex/`. No changes were detected in `apps/`, `database/`, or dependency files (`package.json`).
2.  **Explicit Commit Format:** `docs/05-development-workflow/Commit-Message-Guide.md` and `Contributor-Workflow-Guide.md` now explicitly define the required multi-line format (imperative title, blank line, concrete bullets) and specifically reject Conventional Commit prefixes for WP finalization.
3.  **Wording Clarification:** Ambiguous wording (such as "single-spaced") has been clarified to ensure multi-line expectations are unmistakable.
4.  **Commit Helper Script:** `scripts/commit-work-package.ps1` is correctly implemented and:
    *   Accepts `-WorkPackagePath`, `-Title`, and `-Bullet` array.
    *   Supports `-Preview` mode for dry-run verification.
    *   Successfully validates that the `Final Decision` section contains "Approved" or "Accepted" before allowing a commit.
    *   Rejects Conventional Commit prefixes (e.g., `feat:`, `fix:`) in the title.
5.  **Repo-Local Skill:** `.codex/skills/sequel-city-wp-finalize/` is established with `SKILL.md` and `references/finalization-checklist.md`.
6.  **Skill Integration:** The skill correctly references workflow documentation and the helper script rather than duplicating instructions.
7.  **Template Alignment:** `DAILY-YYYY-MM-DD.md` and `WEEKLY-YYYY-WW.md` reporting templates now include reminders of the required commit style.
8.  **Scope Preservation:** `glob` sorting by modification time confirms that no runtime application files or database schemas were modified during this work package.

### Findings

- **Workflow Drift:** None identified; the updates successfully harden existing standards.
- **Validation:** Scripted validation of WP state is present and functional.
- **Automation:** The PowerShell helper is lightweight and appropriate for the task.
- **Unauthorized Changes:** None identified.

**Audit Status: PASS / APPROVED**
Warning: 256-color support not detected. Using a terminal with at least 256-color support is recommended for a better visual experience.
Ripgrep is not available. Falling back to GrepTool.

## Final Decision

Approved.

Reason:
Gemini audit returned PASS and confirmed the workflow wording is now explicit at the point of use, the helper script enforces the accepted-work-package and non-Conventional-title rules, the repo-local skill references the correct project artifacts, and the work remained within the approved documentation/script scope with no runtime or dependency drift.

