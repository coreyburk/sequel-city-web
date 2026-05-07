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

## Documentation Governance

- SSOT documents override chat history, generated notes, and temporary implementation assumptions.
- Runtime architecture changes must stay aligned with the SSOT package or include an explicit SSOT update in the same scoped work package.
- Documentation-only work packages must not modify frontend code, backend code, database scripts, package files, or build configuration.
