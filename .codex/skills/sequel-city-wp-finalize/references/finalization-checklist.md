# Finalization Checklist

Use this checklist when closing an accepted work package in Sequel City Web Detective.

## Required Reads

- `docs/05-development-workflow/Contributor-Workflow-Guide.md`
- `docs/05-development-workflow/Commit-Message-Guide.md`

## Required Preconditions

- The target work package `Final Decision` contains `Approved` or `Accepted`.
- Changed files remain within the accepted work package scope.
- The commit describes actual changes, not intent.

## Required Commit Shape

```text
Imperative title line

- concrete change bullet
- concrete change bullet
- preservation/scope bullet when appropriate
```

## Required Helper Command Pattern

Preview first:

```powershell
scripts/commit-work-package.ps1 `
  -WorkPackagePath docs/01-work-packages/WP-050-example.md `
  -Title "Refine workflow closeout guidance for accepted work packages" `
  -Bullet @(
    "update the contributor workflow guide with explicit commit formatting rules",
    "add a helper script for multi-line accepted-WP commits"
  ) `
  -PreservationBullet "preserve documentation-only scope with no runtime code changes" `
  -Preview
```

Commit after preview review:

```powershell
scripts/commit-work-package.ps1 `
  -WorkPackagePath docs/01-work-packages/WP-050-example.md `
  -Title "Refine workflow closeout guidance for accepted work packages" `
  -Bullet @(
    "update the contributor workflow guide with explicit commit formatting rules",
    "add a helper script for multi-line accepted-WP commits"
  ) `
  -PreservationBullet "preserve documentation-only scope with no runtime code changes" `
  -StagePath docs/05-development-workflow/Contributor-Workflow-Guide.md `
  -StagePath scripts/commit-work-package.ps1
```

## Do Not Do

- Do not use one-line `git commit -m "docs: ..."` or `git commit -m "feat: ..."` format for accepted WPs.
- Do not commit before the `Final Decision` is accepted.
- Do not summarize planned work as if it already happened.
