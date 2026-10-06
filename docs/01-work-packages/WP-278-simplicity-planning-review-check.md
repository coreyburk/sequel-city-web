# WP-278: Simplicity planning and review check

## Objective

Make reuse, justified abstractions, and the smallest clear, complete change explicit planning and review checks.

## Scope

Add a short canonical checklist to the development-workflow SSOT and reference it from lifecycle planning and audit guidance. The user explicitly requested implementation. No plugin installation, runtime changes, tooling changes, or unrelated cleanup.

## Impact Analysis

### Understand Status
- Analysis tier: Optional; narrow documentation guidance.
- Graph available: Yes; knowledge graph and fingerprints present.
- Baseline commit: 3243f12b0a30a6a122a6468afebd3584c3f8beb2.
- Freshness assessment: Usable with non-structural drift for this documentation surface; not a claim of freshness for application code. Baseline-to-HEAD paths include application and runtime documentation changes, but neither target workflow document changed.
- Analysis performed: Read both target documents and planning guidance, inspected baseline metadata and cumulative changed paths through bc26b56, and verified the insertion points directly against source. Graph relationships were unnecessary for these two linked documents.

### Affected Architecture
- Layers: Development workflow documentation only.
- Primary files/components: Development-workflow SSOT and Work Package Lifecycle.
- Upstream consumers: Work-package planners and implementers.
- Downstream dependencies: Reviewers applying lifecycle audit guidance.

### Regression Surface
- Related tests: No automated runtime tests required; documentation-only checklist and relative links.
- User workflows: Work-package planning and review.
- Security/data boundaries: Preserve SQL safety, spoiler protection, deterministic progression, accessibility, and required validation.

### Graph Update Decision
- Regeneration required: No.
- Rationale: Narrow guidance addition within existing documents; no documentation reorganization, architecture, scripts, skills, imports, or dependency changes. Baseline remains usable for this planning surface.

## Files Allowed to Change

Allowed:

- docs/00-ssot/SSOT-Development-Workflow.md
- docs/05-development-workflow/Work-Package-Lifecycle.md
- docs/01-work-packages/WP-278-simplicity-planning-review-check.md
- docs/00-ssot/END-OF-DAY-HANDOFF.md

Do Not Modify:

- apps/**
- database/**
- scripts/**
- .codex/**
- .understand-anything/**

## Constraints

Preserve lifecycle authority and acceptance requirements. No new report or approval gate. Favor clarity and completeness over line count. No installation is included. The user authorized acceptance, closeout-only handoff refresh, commit, and push on 2026-10-05.

## Required Behavior

The canonical check asks whether existing code, native features, or installed dependencies suffice; whether every new abstraction has a current purpose; and whether the change is the smallest clear, complete solution meeting acceptance criteria and required testing. Planning and audit guidance both reference it. Material findings use existing WP sections.

## Acceptance Criteria

- [x] All three questions appear in one canonical checklist.
- [x] Planning and audit guidance both reference the checklist.
- [x] Explicit safeguards prevent reduced requirements, safety protections, accessibility, or required validation.
- [x] No separate reporting requirement or plugin added.
- [x] Changes stay within the allowed documentation files.

## Code Prompt

Add the canonical Simplicity Check to the development-workflow SSOT. Link it from lifecycle planning and audit guidance. Preserve existing rules and use existing WP sections for material findings. Validate the diff, links, and scope.

## Audit Prompt

Review the three changed documents against the acceptance criteria. Confirm that the checklist cannot justify incomplete scope, weaker testing or safety, unrelated cleanup, or replacement of independent audit and human acceptance. Verify both relative links resolve to the new heading.

## Code Results

Implemented the canonical three-question check and planning/audit references. Explicitly preserved requirements, SQL safety, spoiler protection, deterministic progression, accessibility, and required validation. No runtime changes or dependencies.

- PASS: `git diff --check` passed. Reviewed the full guidance diff, verified both relative links target the existing SSOT document and its new `Simplicity Check` heading, and confirmed `git status --short` lists only the three allowed files. Runtime tests are unnecessary for this documentation-only change.

## Audit Results

Verdict: PASS (SELF-AUDIT PASS; non-independent)

Auditor: Codex self-audit, non-independent, using the low-risk documentation fallback. Reviewed the complete diff and acceptance criteria; both links resolve to the canonical checklist. Required sections and allowed/prohibited boundaries remain intact. No executable workflow, dependency, runtime, database, or destructive behavior changed, so executable negative-path tests are not applicable. git diff --check passed. WP-279 was temporarily preserved outside the checkout to isolate this closeout. Limitation: no independent auditor ran.

## Final Decision

Accepted. Human authorization: the user requested "commit and push then recommend next highest ROI task" on 2026-10-05 after reviewing the reported documentation changes and pending-review status. Acceptance records that request; the local review is non-independent.



