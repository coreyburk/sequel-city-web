# Closeout Prompt Text

Use these prompts when the user wants a work package closed out consistently.

## Standard Closeout

```text
Close out WP-178.

Review the work package, audit results, changed files, validation evidence, and final decision.
Apply any audit-required corrections within scope.
If accepted, update Final Decision, refresh END-OF-DAY-HANDOFF.md if this WP changes current project state or next-task guidance, commit with the WP helper, and push.
Do not commit if audit failed, scope is dirty, validation evidence is missing, or acceptance is not recorded.
```

## AGY Audit Complete

```text
AGY audit is complete. Close out WP-178.

Review the audit results and changed files.
Apply any required corrections within WP scope.
If the audit is PASS and the work is acceptable, mark Final Decision accepted, update END-OF-DAY-HANDOFF.md as appropriate, commit with the WP helper, and push.
Do not represent blocked or self-audit evidence as an independent AGY pass.
```

## Commit And Handoff Closeout

```text
Close out WP-178, including handoff refresh.

Run the WP status and validation-plan checks.
Review audit results and apply required corrections.
If accepted, update Final Decision, refresh END-OF-DAY-HANDOFF.md from current repo state, commit with scripts/commit-work-package.ps1, and push main.
```

## Minimal Commit-Only Closeout

```text
Close out WP-178 without handoff refresh unless it materially changes resume context.

Review audit and validation evidence.
If accepted, update Final Decision, commit with the WP helper, and push.
State why handoff refresh was skipped.
```

## Required Closeout Checks

Before committing:

- resolve `WP-178` to its full `docs/01-work-packages/WP-178-*.md` path
- `scripts/get-work-package-status.ps1 <resolved-WP-path>`
- `scripts/get-work-package-validation-plan.ps1 <resolved-WP-path>` when available
- focused validation commands recorded in the WP
- `git diff --check`
- `git status --short`

The final commit must use `scripts/commit-work-package.ps1` and the project multi-line commit format.
