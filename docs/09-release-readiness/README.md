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
| `student-tester-package.md` | Build, setup, bootstrap boundary, and pilot-testing instructions for a local student package |
| `student-install-and-run-guide.md` | Student-facing install, launch, readiness check, and failure-reporting handout |
| `ai-handoff-brief.md` | Concise product and runtime summary for handing off to another AI tool |
| `demo-route-script.md` | Exact faculty demo route, queries, talk track, and fallback path |
| `demo-shot-by-shot-recording-checklist.md` | Shot-by-shot recording order and pacing guidance for the demo video |
| `presentation-day-readiness-plan.md` | Faculty-presentation outcome, historical readiness plan, and post-presentation follow-up guidance |
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

## Post-Presentation Position

As of 2026-07-17, the faculty capstone presentation has completed. The pre-presentation readiness plan is now historical context, not the active development plan.

The current operational position is:

- the local-first runtime and Student Mode experience are credible enough for faculty demonstration context
- student tester packaging and first-run setup support have been added through `WP-162` and `WP-165`
- base `EventSchedule` and `EventRegistration` seed data were synchronized with the active database through `WP-164`
- future use with students still requires normal local runtime validation before each pilot or package handoff
- the next development push should be chosen through a post-presentation planning work package rather than by extending the demo-hardening sprint

Keep the demo documents for reference:

- `demo-route-script.md` records the faculty demonstration route.
- `demo-shot-by-shot-recording-checklist.md` records the paced capture order.
- `ai-handoff-brief.md` remains useful when handing the product summary to another AI tool.
- `presentation-day-readiness-plan.md` now records the presentation outcome and follow-up implications.
