# Database Documentation

This folder documents the current `SequelCityCrimesDB` reference model for Sequel City Web Detective.

Scope rules for this package:

- document the actual checked-in database structure only
- treat SQL Server as the authority for evidence data and schema metadata
- treat the backend as the authority for schema retrieval and schema exposure
- treat the frontend as presentation-only
- preserve spoiler-aware educational boundaries
- do not describe runtime AI behavior

## Package Contents

| Document | Purpose |
|---|---|
| `database-overview.md` | Current database role, authority model, and local SQL Server assumptions |
| `evidence-model.md` | Evidence-oriented view of how tables support investigation workflows |
| `schema-access-rules.md` | Rules for backend-owned schema retrieval and frontend presentation boundaries |
| `table-reference.md` | Concise reference for actual tables in `SequelCityCrimesDB` |
| `relationship-reference.md` | Reference for actual foreign key relationships and safe traversal patterns |
| `spoiler-and-guidance-boundaries.md` | Spoiler-safe documentation and guidance boundaries |
| `backend-schema-usage.md` | How the current backend loads and exposes schema metadata |

## Source Alignment

This package is aligned to:

- `docs/00-ssot/SSOT-Database-Schema.md`
- `docs/00-ssot/SSOT-Architecture.md`
- `docs/00-ssot/SSOT-AI-Agent-Boundaries.md`
- `docs/06-architecture/README.md`
- `docs/06-architecture/frontend-backend-boundaries.md`
- `docs/07-api-contracts/schema-endpoints.md`
- `docs/09-release-readiness/local-runtime-requirements.md`

## Current Boundary

The current repository defines:

- a local SQL Server database named `SequelCityCrimesDB`
- 11 application tables created by the checked-in SQL scripts
- 9 checked-in foreign key relationships
- backend-owned schema metadata retrieval
- backend-exposed read-only schema inspection for the frontend

This package does not add new schema, new runtime behavior, or solution disclosure.
