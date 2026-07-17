---
name: sequel-city-wp-corrective
description: Create a narrow corrective work package from failed audit results, review findings, unmet acceptance criteria, or noncompliant prior work. Use when Codex is asked to convert audit/review output into a follow-up WP while preserving Sequel Detective work-package lifecycle boundaries, human final acceptance, independent audit, and no-implementation stopping rules.
---

# Sequel City WP Corrective

Create a corrective work package only. Stop after writing the new WP unless the user separately requests implementation.

## Required Reads

Before creating a corrective WP, read:

- `docs/05-development-workflow/Work-Package-Lifecycle.md`
- `docs/05-development-workflow/Agentic-Development-Workflow-Evaluation.md`
- `.codex/skills/sequel-city-wp-corrective/references/corrective-work-package-checklist.md`

Read the original work package and the supplied audit/review findings. If either is missing, stop and ask for the missing artifact.

## Workflow

1. Confirm the request is corrective planning:
   - failed audit result
   - review finding
   - unmet acceptance criterion
   - out-of-scope change that needs follow-up
   - incomplete accepted work that needs a narrow repair
2. Extract from the original WP:
   - objective
   - allowed files and do-not-modify boundaries
   - constraints
   - acceptance criteria
   - code results
   - audit results
   - final decision, if present
3. Classify each finding:
   - `defect` - required behavior is wrong or incomplete
   - `omission` - required artifact, test, doc, or boundary is missing
   - `scope violation` - changed or proposed work exceeds allowed files or constraints
   - `optional enhancement` - useful but not required; do not include unless the user explicitly scopes it
4. Choose the smallest corrective scope that repairs the defect or omission.
5. Create the WP with the canonical script:
   - `scripts/new-lite-work-package.ps1 "correct <short defect slug>"`
6. Replace the generated template with a completed corrective plan.
7. Leave `Code Results`, `Audit Results`, and `Final Decision` pending.
8. Report the new WP path, defect summary, scope, and unresolved assumptions.

## Corrective WP Requirements

The generated WP must include:

- reference to the original WP path and identifier
- exact defect, omission, or noncompliance being corrected
- why it is corrective rather than a new feature
- narrow allowed-file set
- explicit do-not-modify boundaries
- impact analysis
- acceptance criteria
- implementation prompt
- audit prompt
- pending results and final decision sections

Prefer correcting within the original allowed files. If the fix requires new files, explain why and keep the new allowed set minimal.

## Stopping Rules

Stop without creating a WP when:

- the original WP is unavailable
- no actionable audit/review finding is provided
- the finding is only an optional enhancement
- the requested corrective work would require runtime AI, dependency adoption, database mutation, destructive actions, or broad product scope
- the user asks this skill to implement, accept, audit, commit, push, or bypass review as part of corrective-WP creation

If a user asks for implementation after the corrective WP is created, treat that as a separate request.

## Boundaries

- Do not modify application code.
- Do not modify database files.
- Do not modify package manifests or lockfiles.
- Do not add dependencies.
- Do not change scripts unless a separate accepted WP explicitly allows it.
- Do not change `.understand-anything/**` unless a separate accepted WP requires graph work.
- Do not accept or finalize the corrective WP.
- Do not let audit output override SSOT, source, tests, or human final judgment.

## Validation

Before reporting completion:

- run `git diff --check` on the new WP
- confirm the new WP references the original WP
- confirm the scope is narrower than the failed work, or explain why it cannot be narrower
- confirm results/final decision remain pending
- confirm no implementation files changed
