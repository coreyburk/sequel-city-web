# SSOT UI UX Experience

## UX Goal

The website should make SQL investigation feel like an interactive detective case rather than a static assignment page.

## Primary Screen Layout

| Region | Purpose |
|---|---|
| Case Briefing | Narrative, task, current objective |
| Schema Explorer | Tables, columns, and relationships |
| SQL Editor | Learner query input |
| Results Grid | Query output |
| Evidence Notebook | Learner notes and discovered clues |
| Guidance Panel | Deterministic messages first, AI advisory later |

## Learner Workflow

1. Read the briefing.
2. Inspect available tables.
3. Write and run SQL.
4. Review results.
5. Save important findings to the notebook.
6. Follow clues to the next table.
7. Submit suspect for verification.
8. Complete final case summary.

## Design Principles

- Keep the mystery atmosphere, but do not obscure the learning task.
- Make schema access easy.
- Make query feedback immediate.
- Show errors clearly and constructively.
- Keep deterministic status visible.
- Avoid overwhelming students with too many panels at once.

## Initial Pages

The first version may contain one case only: `Case File 004: SELECT * FROM Suspects`.

The investigation workspace requires case intro text, schema list, SQL editor, run query button, results table, and safety or error message area.
