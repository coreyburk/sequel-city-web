# SSOT UI UX Experience

## UX Goal

The website should make SQL investigation feel like an interactive detective case rather than a static assignment page.

The initial experience must be self-contained, locally hosted, and playable from a fresh setup with no required internet connection or runtime AI dependency.

## Document Scope

This document owns screen responsibilities, learner workflow, and interface principles. Backend validation ownership is defined in `SSOT-Architecture.md` and `SSOT-SQL-Safety-Rules.md`. Deterministic progression rules are defined in `SSOT-Case-Progression.md`.

## Primary Screen Layout

| Region | Purpose |
|---|---|
| Case Briefing | Narrative, task, current objective |
| Schema Explorer | Tables, columns, and relationships |
| SQL Editor | Learner query input |
| Results Grid | Query output |
| Evidence Notebook | Learner notes and discovered clues |
| Guidance Panel | Deterministic messages, progress indicators, and safety feedback |

## Learner Workflow

1. Read the briefing.
2. Inspect available tables.
3. Write and run SQL.
4. Review immediate query feedback and evidence.
5. Save important findings to the notebook.
6. Follow clues to the next table.
7. Submit suspect for verification.
8. Complete final case summary.

## Design Principles

- Keep the mystery atmosphere, but do not obscure the learning task.
- Make schema access easy.
- Make query feedback immediate.
- Center evidence-based reasoning over freeform speculation.
- Show errors clearly and constructively.
- Keep deterministic status visible.
- Avoid overwhelming students with too many panels at once.
- Use a static or deterministic case narrative in the initial version.
- Present backend validation, execution, and verification results without becoming the authority for those decisions.

## Initial Pages

The first version may contain one case only: `Case File 004: SELECT * FROM Suspects`.

The investigation workspace requires case intro text, schema list, SQL editor, run query button, results table, and safety or error message area.

The initial version also requires an evidence notebook and visible progress indicators. Any progress indicators that imply case advancement must be tied to deterministic case progression rules, not UI-only state.

No AI UI components are required for the initial version.
