# WP-132: Generic Audit Prompt and Results Headings

**Status:** Accepted  
**Owner:** Codex  
**Created:** 2026-05-24

## Objective

Replace tool-specific work-package audit section names with generic `Audit Prompt` and `Audit Results` headings while preserving backward compatibility with legacy `Gemini` and `AntiGravity` variants in the runner and workflow docs.

## Scope

### In Scope

- update the work-package runner to recognize generic audit section headings
- add a generic `-Execute Audit` runner alias for audit-only execution
- preserve support for legacy `Gemini Audit Prompt`, `Gemini Audit Results`, `AntiGravity Audit Prompt`, and `AntiGravity Audit Results`
- update the work-package template to emit generic audit headings for new WPs
- update workflow documentation so the preferred heading names are generic rather than vendor-specific

### Out of Scope

- mass-renaming existing historical work packages
- changing code-agent section names beyond existing `Code Prompt` / `Code Results` support

## Files Allowed to Change

Allowed:

- `scripts/run-work-package.ps1`
- `scripts/new-lite-work-package.ps1`
- `docs/00-ssot/SSOT-Development-Workflow.md`
- `docs/05-development-workflow/Work-Package-Lifecycle.md`
- `docs/05-development-workflow/Codex-Gemini-Execution-Guide.md`
- `docs/05-development-workflow/Contributor-Workflow-Guide.md`
- `docs/01-work-packages/WP-132-generic-audit-prompt-and-results-headings.md`

Do Not Modify:

- `apps/**`
- `database/**`
- `package-lock.json`

## Constraints

- preserve runner compatibility with existing Gemini-named work packages
- preserve compatibility with in-flight AntiGravity-named work packages
- prefer generic headings for all newly generated work packages
- do not require bulk edits to historical accepted work packages

## Required Behavior

- `run-work-package.ps1` must successfully read `## Audit Prompt` for audit execution
- `run-work-package.ps1` must successfully write results into `## Audit Results` when present
- `run-work-package.ps1` must accept `-Execute Audit` as the generic audit-only command surface
- the runner must continue to fall back to legacy Gemini and AntiGravity audit headings when generic headings are absent
- `new-lite-work-package.ps1` must create `## Audit Prompt` and `## Audit Results`
- workflow docs must describe the generic heading convention and note legacy compatibility

## Acceptance Criteria

- [x] A new work package generated from the template uses `## Audit Prompt` and `## Audit Results`
- [x] The runner can preview a generic `Audit Prompt` without throwing a missing-section error
- [x] The runner accepts `-Execute Audit` without a parameter validation error
- [x] The runner documentation names generic audit sections as the preferred standard
- [x] Legacy Gemini/AntiGravity audit headings are documented as supported compatibility forms
- [x] No application source files are changed

## Code Prompt

Implement WP-132 exactly as scoped.

Requirements:

- make `Audit Prompt` and `Audit Results` the preferred work-package headings
- keep `Gemini Audit Prompt`, `Gemini Audit Results`, `AntiGravity Audit Prompt`, and `AntiGravity Audit Results` working
- update the work-package creation template and workflow docs to match the new standard
- do not edit historical work packages in bulk

Return:

- exact files changed
- brief summary of the compatibility approach
- verification performed

## Audit Prompt

Audit WP-132 for heading standardization and backward compatibility.

Verify:

1. The runner supports generic `Audit Prompt` and `Audit Results` headings.
2. The runner still supports legacy Gemini and AntiGravity audit headings.
3. The work-package template now emits generic audit headings.
4. Workflow docs now present generic audit headings as the preferred convention.
5. The change does not require edits to historical accepted work packages.
6. No application source files were modified.

## Code Results

Implemented the generic audit-heading compatibility layer.

Summary:

- updated `scripts/run-work-package.ps1` so audit execution now prefers `## Audit Prompt` and `## Audit Results`, while still accepting legacy Gemini and AntiGravity heading names
- added a generic `-Execute Audit` alias so contributors no longer need to use a vendor-specific execution mode for audit-only runs
- updated `scripts/new-lite-work-package.ps1` so new work packages are created with generic audit headings
- updated the SSOT and workflow docs to describe `Audit Prompt` / `Audit Results` as the preferred standard and to note backward compatibility for older heading variants
- cleaned and rewrote the lifecycle and contributor workflow docs where older encoding damage would have made piecemeal edits brittle

Changed files:

- `scripts/run-work-package.ps1`
- `scripts/new-lite-work-package.ps1`
- `docs/00-ssot/SSOT-Development-Workflow.md`
- `docs/05-development-workflow/Work-Package-Lifecycle.md`
- `docs/05-development-workflow/Codex-Gemini-Execution-Guide.md`
- `docs/05-development-workflow/Contributor-Workflow-Guide.md`
- `docs/01-work-packages/WP-132-generic-audit-prompt-and-results-headings.md`

Verification:

- `scripts/run-work-package.ps1 "WP-132-generic-audit-prompt-and-results-headings" -Execute None`
- `scripts/run-work-package.ps1 "WP-132-generic-audit-prompt-and-results-headings.md" -Execute Audit`
- `scripts/run-work-package.ps1 "WP-132-generic-audit-prompt-and-results-headings.md" -Type Gemini -Execute None`

## Audit Results

Verdict: PASS

Confirmed:

- `run-work-package.ps1` now prefers generic `Audit Prompt` and `Audit Results` headings
- legacy Gemini and AntiGravity audit headings still resolve correctly as compatibility fallbacks
- `-Execute Audit` is accepted as a generic audit-only command surface
- `new-lite-work-package.ps1` now emits generic audit headings for new work packages
- SSOT and workflow docs now present generic audit sections as the preferred convention while noting backward compatibility

Violations:

- none

Regressions:

- none

Drift risks:

- none

## Final Decision

Accepted.

WP-132 successfully standardizes audit section naming without requiring edits to historical work packages, and the runner now exposes a generic audit command surface that matches the new heading convention.

