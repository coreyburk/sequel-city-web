# Release Readiness Documentation

This package defines the current operational assumptions and release-readiness boundaries for the implemented Sequel City Web Detective runtime.

Scope rules for this package:

- document implemented local runtime behavior only
- keep the backend and SQL Server as the operational authorities
- keep frontend responsibilities presentation-only
- keep SQL execution read-only and backend-validated
- do not describe production deployment, cloud hosting, Docker, authentication, distributed infrastructure, or runtime AI as supported

## Package Contents

| Document | Purpose |
|---|---|
| `supported-environments.md` | Supported local environment assumptions and validated operating context |
| `local-runtime-requirements.md` | Required local software, database state, and startup dependencies |
| `known-limitations.md` | Current operational limitations and intentionally missing runtime capabilities |
| `troubleshooting-boundaries.md` | What troubleshooting is in scope and what environment deviations fall outside current support |
| `release-readiness-checklist.md` | Deterministic checklist for confirming the local runtime is ready to use |
| `non-goals-and-unsupported-configurations.md` | Explicit non-goals and unsupported runtime or deployment configurations |

## Alignment

This package is aligned to:

- `docs/00-ssot/SSOT-Architecture.md`
- `docs/00-ssot/SSOT-SQL-Safety-Rules.md`
- `docs/00-ssot/SSOT-AI-Agent-Boundaries.md`
- `docs/06-architecture/README.md`
- `docs/06-architecture/system-overview.md`
- `docs/06-architecture/frontend-backend-boundaries.md`
- `docs/07-api-contracts/README.md`
- `docs/07-api-contracts/query-execution-endpoints.md`

## Current Operational Position

The implemented runtime is release-ready only for the documented local-first development environment:

- local browser frontend
- local Fastify backend
- local SQL Server database
- restored `SequelCityCrimesDB`
- deterministic backend-owned validation and execution
- no runtime AI

This package does not expand product scope. It documents what the repository can currently support in a practical local setup.
