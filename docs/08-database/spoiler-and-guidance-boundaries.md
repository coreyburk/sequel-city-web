# Spoiler And Guidance Boundaries

## Purpose

This package supports investigation learning without disclosing hidden answers or hidden verification logic.

## Allowed Content

The documentation may:

- describe the actual schema
- describe actual table purposes
- describe actual foreign key relationships
- explain safe investigation patterns at a high level
- state that database-backed evidence is authoritative

## Prohibited Content

The documentation must not:

- reveal hidden suspect identities
- restate hidden answer-key values
- expose the exact hidden verification path as learner guidance
- provide final-answer walkthroughs
- present spoiler-sensitive tables as shortcut instructions

## Guidance Boundary

Safe guidance should help learners:

- understand how evidence tables relate
- think in joins, filters, and cross-references
- inspect reports, people, events, and activity records

Safe guidance should not:

- collapse the investigation into a direct answer sequence
- skip evidence interpretation
- replace database discovery with answer disclosure

## Backend And UI Boundary

The backend and frontend should preserve these educational boundaries:

- schema visibility is allowed
- evidence visibility is query-driven
- authoritative answers must not be auto-disclosed through documentation text
- database-backed verification support remains spoiler-sensitive

## Runtime Boundary

No current runtime AI behavior is part of this boundary model. Spoiler control is currently achieved through deterministic architecture, backend ownership, and documentation discipline.
