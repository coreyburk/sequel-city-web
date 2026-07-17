# Corrective Work Package Checklist

Use this checklist after reading the original WP and the audit/review findings.

## Inputs

- Original WP path is known.
- Audit/review finding text is available.
- Finding is actionable, not just a preference.
- Original WP scope, constraints, acceptance criteria, code results, audit results, and final decision have been reviewed when present.

## Classification

Classify each finding as one of:

- `defect`: implemented behavior is wrong or incomplete.
- `omission`: required artifact, verification, documentation, or boundary is missing.
- `scope violation`: work exceeded allowed files, constraints, or SSOT boundaries.
- `optional enhancement`: useful but not required by the original WP.

Only defects, omissions, and scope violations should become corrective WPs by default.

## Corrective Scope

The corrective WP should:

- reference the original WP.
- name the exact defect or omission.
- explain why the package is corrective.
- use the smallest practical allowed-file set.
- preserve original do-not-modify boundaries unless the correction cannot work without a new boundary.
- keep optional enhancements out of scope.
- preserve runtime AI, dependency, database, script, graph, package, lockfile, and output boundaries unless the original accepted scope explicitly allows otherwise.

## Required Sections

The corrective WP must include:

- `Objective`
- `Scope`
- `Impact Analysis`
- `Files Allowed to Change`
- `Constraints`
- `Required Behavior`
- `Acceptance Criteria`
- `Code Prompt`
- `Audit Prompt`
- `Code Results`
- `Audit Results`
- `Final Decision`

Leave these as pending:

- `Code Results`
- `Audit Results`
- `Final Decision`

## Blockers

Stop and report a blocker when:

- no original WP is provided.
- no actionable finding is provided.
- the finding is ambiguous enough that scope would be invented.
- the requested correction requires implementation before planning.
- the user asks to bypass human final acceptance, independent audit, or finalization rules.

## Final Review

Before reporting the new WP:

- run `git diff --check` on the generated WP.
- verify the new WP path and number.
- verify the corrective allowed files are narrow.
- verify the audit prompt checks the original failure.
- verify no implementation files changed.
