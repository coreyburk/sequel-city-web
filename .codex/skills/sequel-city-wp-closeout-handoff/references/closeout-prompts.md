# Closeout Prompt Text

Use these prompts when the user wants a work package closed out consistently.

## Standard Closeout

```text
Close out WP-178.

Review the work package, audit results, changed files, validation evidence, and final decision.
Run `scripts/check-work-package-closeout.ps1 WP-178` before finalization.
Apply any audit-required corrections within scope.
If accepted, update Final Decision, refresh END-OF-DAY-HANDOFF.md from current repo state, commit with the WP helper, and push.
Do not commit if audit failed, closeout preflight is blocked, scope is dirty, validation evidence is missing, or acceptance is not recorded.
```

## AGY Audit Complete

```text
AGY audit is complete. Close out WP-178.

Review the audit results and changed files.
Run `scripts/check-work-package-closeout.ps1 WP-178` before finalization.
Apply any required corrections within WP scope.
If the audit is PASS and the work is acceptable, mark Final Decision accepted, update END-OF-DAY-HANDOFF.md from current repo state, commit with the WP helper, and push.
Do not represent blocked or self-audit evidence as an independent AGY pass.
```

## Commit And Handoff Closeout

```text
Close out WP-178, including handoff refresh.

Run the WP status and validation-plan checks.
Run `scripts/check-work-package-closeout.ps1 WP-178`.
Review audit results and apply required corrections.
If accepted, update Final Decision, refresh END-OF-DAY-HANDOFF.md from current repo state, commit with scripts/commit-work-package.ps1, and push main.
```

## Minimal Commit-Only Closeout

```text
Close out WP-178 with the required handoff refresh.

Review audit and validation evidence.
Run `scripts/check-work-package-closeout.ps1 WP-178`.
If accepted, update Final Decision, refresh END-OF-DAY-HANDOFF.md, commit with the WP helper, and push.
```

## Required Closeout Checks

Before committing:

- `scripts/get-work-package-status.ps1 WP-178`
- `scripts/get-work-package-validation-plan.ps1 WP-178` when available
- `scripts/check-work-package-closeout.ps1 WP-178`
- focused validation commands recorded in the WP
- `git diff --check`
- `git status --short`
- `docs/00-ssot/END-OF-DAY-HANDOFF.md` refreshed from current repo state

The final commit must use `scripts/commit-work-package.ps1` and the project multi-line commit format.
