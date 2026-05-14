# Sequel City Web Detective Documentation

This folder contains project documentation for Sequel City Web Detective.

## Documentation Map

| Folder | Purpose |
|---|---|
| `docs/00-ssot/` | Authoritative SSOT package |
| `docs/01-work-packages/` | Scoped implementation work packages |
| `docs/02-runtime/` | Runtime validation, setup verification, and issue capture |
| `docs/03-user-testing/` | User testing plans, observations, and session artifacts |
| `docs/04-developer-setup/` | Developer installation and troubleshooting guidance |
| `docs/05-development-workflow/` | Contributor workflow and execution guidance |
| `docs/06-architecture/` | Formal architecture package for the current implemented runtime |
| `docs/07-api-contracts/` | Implemented Fastify API contract package for health, schema, query execution, and history |
| `docs/08-database/` | Database reference and evidence model package for the checked-in `SequelCityCrimesDB` schema |
| `docs/09-release-readiness/` | Release-readiness package for supported local environments, runtime requirements, limitations, and operational boundaries |
| `docs/10-user-journey/` | Deterministic learner investigation flow, evidence discovery, frontend interaction boundaries, and spoiler-safe guidance package |
| `docs/11-testing-strategy/` | Testing strategy and deterministic validation package for backend authority, API contracts, frontend rendering, and local runtime checks |
| `docs/12-progress-reports/` | Daily and weekly progress-report templates for handoff continuity, audit tracking, commit summaries, risks, and next priorities |
| `docs/13-art-direction/` | Student Mode visual direction, static artwork prompt packs, asset constraints, and generated-image integration guidance |
| `docs/14-progression-design/` | Detective rank, reward, badge, and future tier-placement design package |

## Authoritative SSOT

The authoritative documentation set lives in `docs/00-ssot/`.

Start with `docs/00-ssot/SSOT-Index.md` for the active SSOT map and document authority boundaries.

## Architecture Package

The first formal architecture documentation package lives in `docs/06-architecture/`.

It documents the currently implemented runtime only:

- React + Vite + TypeScript frontend
- Fastify + TypeScript backend
- local SQL Server database
- local-first request flow
- deterministic backend-owned validation and execution
- no runtime AI behavior

## API Contract Package

The current API contract documentation package lives in `docs/07-api-contracts/`.

It documents implemented backend routes only:

- health diagnostics
- schema metadata
- read-only query execution
- in-memory query history
- deterministic error and response-shape behavior

## Database Package

The current database reference package lives in `docs/08-database/`.

It documents the checked-in database structure only:

- local `SequelCityCrimesDB` assumptions
- evidence-oriented table roles
- actual foreign key relationships
- backend-owned schema retrieval
- frontend presentation-only schema usage
- spoiler-aware documentation boundaries

## Release Readiness Package

The release-readiness and operational assumptions package lives in `docs/09-release-readiness/`.

It documents the current operational boundary only:

- supported local environment assumptions
- required local runtime dependencies
- restored local `SequelCityCrimesDB` expectation
- backend-required frontend operation
- localhost guidance for SQL Server TLS hostname consistency
- known limitations and unsupported configurations
- no production deployment support
- no runtime AI behavior

## User Journey Package

The user journey documentation package lives in `docs/10-user-journey/`.

It documents the deterministic learner investigation experience:

- high-level investigation flow
- startup, schema, query, and iteration workflow
- backend-owned query feedback loop
- spoiler-safe evidence discovery model
- frontend presentation-only interaction boundaries
- no runtime AI behavior

## Testing Strategy Package

The testing strategy and deterministic validation package lives in `docs/11-testing-strategy/`.

It documents current testing expectations for:

- deterministic backend validation
- read-only SQL safety verification
- API contract verification
- frontend rendering boundaries
- local runtime manual test scenarios
- testing non-goals and excluded scope

## Progress Reports Package

The progress-report documentation package lives in `docs/12-progress-reports/`.

It provides reusable reporting templates for:

- daily machine handoff and session continuity
- weekly work package summaries
- audit and final decision tracking
- commit and push summaries
- risk capture and next-priority planning

## Art Direction Package

The art-direction package lives in `docs/13-art-direction/`.

It documents development-time artwork production guidance only:

- Student Mode noir visual bible
- Gemini / Nano Banana prompt pack
- static asset output requirements
- crop, naming, review, and integration guidance
- no runtime AI behavior

## Progression Design Package

The progression-design package lives in `docs/14-progression-design/`.

It documents the intended future career-progression model only:

- detective rank ladder
- reward terminology and progression boundaries
- badge labels and role framing
- provisional case tier-placement guidance
- no runtime implementation by itself

## Documentation Governance

- SSOT documents override chat history, generated notes, and temporary implementation assumptions.
- Runtime architecture changes must stay aligned with the SSOT package or include an explicit SSOT update in the same scoped work package.
- Documentation-only work packages must not modify frontend code, backend code, database scripts, package files, or build configuration.
