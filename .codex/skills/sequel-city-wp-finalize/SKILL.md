---
name: sequel-city-wp-finalize
description: Finalize accepted Sequel City Web Detective work packages using the repo's required multi-line commit format and helper script. Use when a work package has passed review, its Final Decision is accepted, and Codex needs to stage, preview, commit, or push the change without drifting into one-line Conventional Commit messages.
---

# Sequel City WP Finalize

## Overview

Use this skill when an accepted work package is ready for closeout. It standardizes the finalization sequence so Codex verifies the accepted state, drafts a compliant commit message, previews it through the repo helper, and only then commits and pushes.

## Workflow

1. Read:
   - `docs/05-development-workflow/Contributor-Workflow-Guide.md`
   - `docs/05-development-workflow/Commit-Message-Guide.md`
   - `references/finalization-checklist.md`
2. Read the target work package and confirm `## Final Decision` contains `Approved` or `Accepted`.
3. Review the actual changed files and confirm they stay within the work package scope.
4. Draft:
   - one imperative title line
   - one bullet per concrete change
   - one preservation bullet when scope or architecture boundaries were intentionally preserved
5. Run the helper in preview mode first:
   - `scripts/commit-work-package.ps1 ... -Preview`
6. Compare the preview text against the actual changed files.
7. Run the helper without `-Preview` to commit.
8. Push only after the commit succeeds and branch state is understood.

## Rules

- Do not use one-line `git commit -m "docs: ..."` or similar Conventional Commit prefixes for accepted WP closeout.
- Do not commit before the work package final decision is accepted.
- Do not describe intended work as if it already happened.
- Keep one cohesive commit per accepted work package.
- Include the work package documentation in the same commit when applicable.

## Commit Construction

Build the commit message from the actual diff:

- Title: imperative, specific, no Conventional Commit prefix
- Body bullets: concrete completed changes only
- Final bullet: use when the commit intentionally preserved documentation-only scope, runtime boundaries, or architecture constraints

If the title starts with `docs:`, `feat:`, `fix:`, or similar prefixes, rewrite it before previewing.

## Resources

- `references/finalization-checklist.md`
  - helper command pattern
  - required reads
  - commit shape reminder
