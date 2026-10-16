# WP-301: Evidence-based workflow guidance

## Objective

Make implementation decisions, debugging, and completion claims evidence-based without adding a competing skill framework or duplicating existing simplicity guidance.

## Scope

Documentation-only additions to the existing workflow SSOT and links from contributor/lifecycle guidance. The user explicitly authorized implementation on 2026-10-16 after requesting review of current skills. No skill installation, new skill, or skill-file changes are needed.

## Impact Analysis

### Understand Status
- Analysis tier: Recommended for shared workflow guidance; direct source review used.
- Graph available: Yes; metadata, graph, and fingerprints exist.
- Baseline commit: 322e5e0f016d66ba8c77f3f92c6c0134fb0a5632, equal to HEAD at planning.
- Freshness assessment: Usable with non-structural drift for the three target documents, which were clean at planning. Graph artifacts and application files contain unrelated uncommitted work; no claim of graph freshness for those surfaces.
- Analysis performed: Read all six repository-local SKILL.md files, supporting workflow references, canonical workflow documents, WP-278 and WP-279, and installed gsd-debug, React best practices, and web-design-guidelines entrypoints. No generated graph relationships relied upon.

### Affected Architecture
- Layers: Development instructions only.
- Primary files/components: Workflow SSOT, Contributor Workflow Guide, Work Package Lifecycle.
- Upstream consumers: Human requests and scoped work packages.
- Downstream dependencies: Existing planning, implementation, corrective, audit, and closeout workflows.

### Regression Surface
- Related tests: Documentation diff/link/section review; no automated runtime validation required because no executable behavior changes.
- User workflows: Clarification, debugging, validation reporting, skill selection.
- Security/data boundaries: Preserve SQL safety, spoiler protection, deterministic behavior, external-audit authorization, independent review, and human acceptance.

### Graph Update Decision
- Regeneration required: No for this narrow guidance addition.
- Rationale: Existing document ownership and workflow order remain unchanged; no skill, script, import, dependency, architecture, or documentation reorganization changes. Target documents are unchanged since the recorded baseline. Existing dirty graph artifacts belong to other work and remain untouched.

## Files Allowed to Change

Allowed:

- docs/00-ssot/SSOT-Development-Workflow.md
- docs/05-development-workflow/Contributor-Workflow-Guide.md
- docs/05-development-workflow/Work-Package-Lifecycle.md
- docs/01-work-packages/WP-301-evidence-based-workflow-guidance.md
- docs/00-ssot/END-OF-DAY-HANDOFF.md

Do Not Modify:

- apps/**
- database/**
- scripts/**
- tools/**
- .codex/**
- .understand-anything/**
- package.json
- package-lock.json

The live handoff is allowed for later accepted closeout only. Preserve all pre-existing dirty files, including WP-298 through WP-300 and graph artifacts. Do not use a mixed-worktree override, stash, or discard other work.

## Constraints

Keep one canonical source for guidance and reference it from existing entry points. Preserve the existing simplicity check and lifecycle gates. No global instruction edits, framework installation, dependencies, or external audit transmission. The original implementation did not authorize acceptance or publication; the subsequent human request to commit and push WP-301 on 2026-10-16 authorizes this closeout.

## Required Behavior

- State material assumptions and ask only when uncertainty materially affects scope, correctness, safety, or irreversible actions; continue independent authorized work.
- Tie edits to acceptance criteria; remove only newly orphaned code and leave unrelated cleanup for follow-up.
- Reproduce defects, gather evidence, test one hypothesis at a time, and use regression checks proportionate to the change.
- Record actual verification commands, results, tested state, limitations, and acceptance-criteria coverage; rerun when relevant state changes, not merely because a new message is sent.
- Keep installed specialist skills subordinate to project scope and retain WP-279 debugger/frontend boundaries.
- Use concise, matter-of-fact reports without timeline estimates or unsupported completion claims.

## Acceptance Criteria

- [x] Existing skills and prior overlapping work reviewed before implementation; reuse decisions recorded.
- [x] Canonical guidance covers assumptions, surgical edits, debugging, and state-based verification without duplicating the simplicity checklist.
- [x] Contributor and lifecycle entry points link to the canonical guidance.
- [x] Guidance does not weaken required validation, independent audit, external-sharing authorization, or human final acceptance.
- [x] Only allowed documentation changed by this task; links and diff checks pass.

## Code Prompt

Implement the Required Behavior in the existing workflow SSOT. Link the canonical guidance from contributor and lifecycle instructions. Reuse existing skills; do not install or modify them. Validate changed Markdown, local links, required WP sections, and actual diffs. Report unrelated dirty state honestly.

## Audit Prompt

Review the scoped diff and each acceptance criterion. Try the following counterexamples: trivial ambiguity causing unnecessary approval; material ambiguity silently guessed; passing lint described as a successful build; old tests reused after relevant edits; unchanged tests rerun solely for a new message; unrelated cleanup bundled into a fix; a generic skill replacing project acceptance; multiple models agreeing without independent evidence. Confirm the guidance prevents these without reducing required checks. Verify Markdown links and section shape. Label self-review non-independent; external audit requires authorization and isolated scope. No executable negative-path tests are necessary for prose-only changes.

## Code Results

Implemented on 2026-10-16. Added 32 lines of canonical implementation/skill/communication guidance to SSOT-Development-Workflow.md and two-line references in each existing contributor/lifecycle guide. No skills created, changed, or installed. Existing simplicity and specialist boundaries are reused.

Validation on the final instruction diff:

- PASS: `git diff --check -- docs/00-ssot/SSOT-Development-Workflow.md docs/05-development-workflow/Contributor-Workflow-Guide.md docs/05-development-workflow/Work-Package-Lifecycle.md`.
- PASS: PowerShell local-link/anchor inspection resolved all 21 local Markdown links across the three changed guides; all 12 required WP sections occur exactly once.
- PASS: Complete scoped diff review found only the intended additions; `.codex/skills` has no diff. Tool mutations were limited to this WP and the three allowed guides; unrelated dirty work was not edited, staged, stashed, or discarded.
- PASS: `scripts/get-work-package-validation-plan.ps1 WP-301` reports `NoAutomatedValidationExplained` with no missing findings. Runtime tests are unnecessary for prose-only changes; no application validation is claimed.
- LIMITATION: `scripts/check-work-package-closeout.ps1 WP-301` returns exit 1, `BlockedMixedWorktree`, because unrelated dirty files already exist. Final Decision remains pending. No independent auditor ran, no external audit authorization was requested, and no mixed-worktree override was used.
- Environment: sandboxed read commands stalled; elevated read/write commands succeeded. No approval rejection occurred. The repository has no root AGENTS.md; this task's user-supplied relationship instructions were preserved in canonical communication guidance.

### Skill review and reuse decisions

- sequel-city-wp-planning: Already owns impact analysis, scope, and graph decisions; reuse existing SSOT/lifecycle reads.
- sequel-city-wp-corrective: Already distinguishes defects from optional enhancements and preserves planning/implementation boundaries; no edit needed.
- sequel-city-audit-runner-contracts: Already requires adversarial evidence and separates independent review from fallback; no edit needed.
- sequel-city-wp-closeout-handoff: Already checks validation, acceptance, handoff scope, and closeout; contributor guidance supplies the additional verification rule.
- sequel-city-wp-finalize: Already owns accepted-WP commits and reads contributor guidance; no competing completion skill needed.
- ui-ux-pro-max: Specialist design advice; generic design-system/Tailwind recommendations must not override the established project stack or expand scope.
- Installed gsd-debug, React best practices, and web-design-guidelines: Preserve WP-279 integration boundaries. Debug artifacts must use authorized paths; generic framework/API recommendations are not adoption authority.
- WP-278 already owns the simplicity checklist. Adapt selected concepts from the previously reviewed multica-ai/andrej-karpathy-skills and obra/superpowers sources into original project-specific guidance rather than copying skill text or installing either framework. Do not install i-have-adhd or Octopus.

## Audit Results

Verdict: PASS (SELF-AUDIT PASS; non-independent)

Auditor: implementing Codex context, using the existing low-risk documentation fallback. Reviewed actual additions against every acceptance criterion and the audit-prompt counterexamples. Routine choices remain autonomous; material ambiguity requires clarification; evidence must match the tested state and claimed behavior; unchanged checks are reusable; required validation remains mandatory; unrelated cleanup and generic skill scope expansion remain excluded. Human acceptance and external audit authorization retain their existing gates.

Mechanical evidence: scoped whitespace check, 21 resolved local links/anchors, 12 unique required WP headings, validation-plan helper, and complete instruction diff review. No executable changes, so runtime and executable negative-path tests are not applicable. This is not independent review or a behavioral evaluation of future agent sessions. Closeout remains unavailable due to the recorded unrelated worktree changes; local self-review does not waive isolation or authorize acceptance.

### Closeout Review

On 2026-10-16, resolved the mixed-worktree finalization limitation by copying only the four WP-301 files to a separate primary clone at baseline 322e5e0 on codex/wp-301-workflow-guidance. Refreshed the allowed live handoff there. No mixed-worktree override, stash, or unrelated file changes. Rechecked the exact documentation diff and retained the non-independent self-audit classification. Earlier mixed-worktree findings above describe the original checkout, not this isolated closeout.

## Final Decision

Accepted. On 2026-10-16 the human requested "commit and push WP-301" after receiving the implementation, validation, and non-independent review summary. This authorizes accepted closeout with the disclosed documentation self-audit limitation; no independent audit is claimed.
