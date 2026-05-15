# User Journey Documentation

This package documents the deterministic learner investigation journey for Sequel City Web Detective.

Scope rules for this package:

- document the implemented local-first runtime and SSOT-aligned deterministic investigation model only
- keep the backend authoritative for validation, execution, and response shaping
- keep SQL Server authoritative for evidence data and schema metadata
- keep the frontend presentation-only
- preserve spoiler-safe educational framing
- do not describe runtime AI, speculative gameplay systems, or hidden answer disclosure as implemented behavior

## Package Contents

| Document | Purpose |
|---|---|
| `investigation-overview.md` | High-level view of the learner investigation journey and authority model |
| `learner-workflow.md` | Step-by-step learner workflow through startup, schema review, query execution, and iteration |
| `query-feedback-loop.md` | Deterministic loop from learner SQL input to backend response and learner interpretation |
| `evidence-discovery-model.md` | Spoiler-safe evidence-finding model based on relational traversal and narrowing |
| `deterministic-learning-model.md` | Why the investigation experience is deterministic and backend-led |
| `frontend-interaction-flow.md` | Frontend responsibilities and non-responsibilities during investigation |
| `spoiler-safe-guidance-principles.md` | Rules for educational guidance that preserve discovery |
| `investigation-thread-system.md` | Frontend thread-tracking layer that externalizes the learner's working set of leads |
| `diagrams/investigation-flow.md` | Lightweight Mermaid overview of the investigation path |
| `diagrams/query-feedback-sequence.md` | Lightweight Mermaid sequence for query submission and feedback |

## Alignment

This package is aligned to:

- `docs/00-ssot/SSOT-Architecture.md`
- `docs/00-ssot/SSOT-Case-Progression.md`
- `docs/00-ssot/SSOT-SQL-Safety-Rules.md`
- `docs/00-ssot/SSOT-Database-Schema.md`
- `docs/00-ssot/SSOT-UI-UX-Experience.md`
- `docs/00-ssot/SSOT-AI-Agent-Boundaries.md`
- `docs/06-architecture/README.md`
- `docs/07-api-contracts/README.md`
- `docs/08-database/README.md`
- `docs/09-release-readiness/README.md`

## Current Runtime Boundary

The current repository already supports:

- frontend health and startup guidance
- backend-backed schema browsing
- backend-validated read-only SQL execution
- normalized query result presentation
- backend in-memory query history
- backend-owned suspect verification route
- frontend suspect verification panel and verdict rendering

The current repository does not yet support:

- persisted notebook evidence
- deterministic case progression services
- runtime AI guidance

This package therefore documents both:

- current implemented investigation interactions
- SSOT-approved deterministic investigation rules for later case flow work

It does not present non-implemented features as active runtime behavior.
