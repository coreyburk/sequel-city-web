# Work Package Lifecycle

## Definition Of A Work Package

A work package is the project’s required planning and acceptance record for a discrete unit of development work. It defines what should happen, what may change, how Codex should execute, how Gemini should audit, and how the project records the final decision.

## Why Work Packages Are Required

Work packages are required because they:

- control scope before implementation begins
- make allowed file boundaries explicit
- separate requested work from accidental drift
- preserve an auditable acceptance trail
- support corrective follow-up when work fails or is incomplete

## Required Work Package Sections

Each work package must contain these sections:

- `Objective`
- `Scope`
- `Files Allowed to Change`
- `Constraints`
- `Required Behavior`
- `Acceptance Criteria`
- `Codex Prompt`
- `Gemini Audit Prompt`
- `Codex Results`
- `Gemini Audit Results`
- `Final Decision`

## Creating A Work Package

Create a new work package with the project script:

`scripts/new-lite-work-package.ps1` followed by a short descriptive slug argument

Use a short slug that describes the task clearly. Work package numbers are auto-assigned by the script, so contributors should not try to choose or reserve the numeric identifier manually.

## Scope Control Guidance

- Keep each work package focused on one coherent outcome.
- Limit `Files Allowed to Change` to the smallest practical set.
- Split unrelated work into separate work packages instead of broadening scope midstream.
- Treat out-of-scope findings as follow-up candidates unless they are required to satisfy the current package safely.
- If corrective work is needed beyond the approved scope, open a corrective work package instead of silently expanding the current one.

## Handling Deferred Or Skipped Work

- Mark deferred or skipped items explicitly in `Final Decision`.
- State why the work was deferred or skipped.
- If the work still matters, create a follow-up work package instead of leaving the status ambiguous.
- Do not report skipped scope as completed scope.

## Handling Failed Work

- Record the failure clearly in `Codex Results`, `Gemini Audit Results`, or both, depending on where it occurred.
- Preserve useful failure context, including scope problems, environment limitations, or unmet acceptance criteria.
- Use `Final Decision` to state that the work was not accepted.
- If another attempt is needed, create a new work package or a corrective work package rather than rewriting history.

## Handling Corrective Work Packages

Use a corrective work package when accepted or attempted work needs targeted repair, cleanup, or compliance correction. A corrective work package should:

- reference the earlier work package it corrects
- define the exact defect, omission, or noncompliance being addressed
- keep the corrective scope narrow
- produce its own results and `Final Decision`

Corrective work packages keep the project history honest without mixing old acceptance with new repairs.
