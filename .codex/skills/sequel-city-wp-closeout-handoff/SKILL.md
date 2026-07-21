---
name: sequel-city-wp-closeout-handoff
description: Close out accepted Sequel Detective work packages with audit review, scoped corrections, final decision, END-OF-DAY-HANDOFF refresh, project-standard commit, and push. Use when the user says close out WP, finalize WP, closeout, audit complete, review/update/commit/push, update handoff, refresh handoff, accepted work package, commit and push after audit, or asks for the proper closeout request wording.
---

# Sequel City WP Closeout Handoff

## Overview

Use this skill when a work package appears ready to close after implementation and audit, especially when the user asks to review audit results, update the WP, commit, push, or refresh the live handoff.

This skill coordinates existing project gates. It does not replace independent audit, human final acceptance, or the `sequel-city-wp-finalize` helper workflow.

## Required Reads

Read these before closing a WP:

- target work package
- `docs/05-development-workflow/Contributor-Workflow-Guide.md`
- `docs/05-development-workflow/Work-Package-Lifecycle.md`
- `docs/05-development-workflow/Commit-Message-Guide.md`
- `.codex/skills/sequel-city-wp-finalize/SKILL.md`
- `.codex/skills/sequel-city-wp-finalize/references/finalization-checklist.md`
- `references/closeout-prompts.md` when the user asks for wording or a reusable prompt

If audit interpretation is involved, also read:

- `.codex/skills/sequel-city-audit-runner-contracts/SKILL.md`
- `.codex/skills/sequel-city-audit-runner-contracts/references/audit-contract.md`

## Workflow

1. Resolve the WP by number, filename, repo-relative path, absolute path, or slug. Lifecycle helpers accept `WP-###` shorthand.
2. Run or inspect:
   - `scripts/get-work-package-status.ps1 WP-###`
   - `scripts/get-work-package-validation-plan.ps1 WP-###` when available and relevant
   - `git status --short`
3. Review `Code Results`, `Audit Results`, acceptance criteria, changed files, and validation evidence.
4. If audit found required corrections, apply only in the active WP scope, rerun focused validation, and record the post-audit correction.
5. If audit failed or remains blocked, do not mark accepted unless the human explicitly accepts the limitation.
6. If accepted, update `## Final Decision` with a concise human-acceptance reason.
7. Refresh `docs/00-ssot/END-OF-DAY-HANDOFF.md` before every commit/push closeout so the live handoff reflects current project state.
8. Finalize with the existing `sequel-city-wp-finalize` rules and `scripts/commit-work-package.ps1`.
9. Push only after commit succeeds and branch state is understood.

## Closeout Request Keywords

These phrases should trigger this skill through the frontmatter description:

- `close out WP-178`
- `finalize WP-178`
- `audit complete`
- `review, update, commit, and push`
- `commit and push after audit`
- `update handoff`
- `refresh handoff`
- `accepted work package`
- `proper closeout request`

## Handoff Refresh Rules

When refreshing the live handoff:

- use `docs/00-ssot/END-OF-DAY-HANDOFF-TEMPLATE.md` as structure guidance
- record current date, branch, HEAD, repo status, active WP status, recent completed WPs, validation evidence, open risks, and next recommended step
- remove stale active-WP references
- do not claim fresh full-app validation unless it was actually run
- refresh the handoff for every accepted-WP commit and push, even for narrow packages
- do not modify SSOT architecture, database, runtime AI, or product direction as part of closeout unless the active WP explicitly allows it

## Stopping Rules

Stop before commit/push when:

- `Final Decision` is not accepted/approved
- audit is failed or blocked without explicit human acceptance of the limitation
- dirty files are outside the active WP allowed list
- validation required by the WP has not been run or its omission is not explained
- handoff refresh would require broader product/SSOT decisions not scoped by the WP; in that case, stop and create or request the needed scope rather than committing stale handoff state

## Prompt Text

For exact user-facing closeout prompts, read `references/closeout-prompts.md`.
