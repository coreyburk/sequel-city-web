# Troubleshooting Boundaries

## Purpose

This document defines what troubleshooting is in scope for the current project documentation and what issues should be treated as environment deviations rather than application defects.

## Troubleshooting Scope

Current troubleshooting guidance is in scope for:

- Windows local development setup
- local Node.js and npm usage
- local backend startup
- local frontend startup
- local SQL Server connectivity
- local `SequelCityCrimesDB` availability
- deterministic health, schema, query execution, and query history flows

## Supported Troubleshooting Assumptions

Troubleshooting assumes:

- the repository is checked out locally
- dependencies were installed from the repository root
- the backend uses `apps/api/.env`
- the frontend and backend run on the same machine
- SQL Server is intended to be local
- the target database is `SequelCityCrimesDB`

## SQL Host Boundary

If SQL connectivity behaves differently between `localhost` and `127.0.0.1`, treat this as an expected local SQL configuration concern first.

Supported operational guidance:

- prefer `localhost` for `SQLSERVER_HOST`
- use `localhost` to avoid SQL TLS hostname consistency issues
- do not treat `127.0.0.1` failure alone as proof of an application defect

## Backend Dependency Boundary

If the frontend loads but health, schema, query execution, or query history fail, first assume backend unavailability or backend startup failure.

Current frontend behavior depends on the backend for all operational features beyond static shell rendering.

## Database Restoration Boundary

If SQL Server is reachable but schema metadata or expected application data is missing, first assume the required database has not been restored correctly.

Troubleshooting should verify:

- the configured database name is `SequelCityCrimesDB`
- the database actually exists on the local SQL Server instance
- the configured SQL login can read it

Missing database restoration is outside application troubleshooting until the database state is corrected.

## Read-Only Execution Boundary

If a learner query is blocked, do not troubleshoot the block as a defect unless it contradicts the documented safety contract.

Current supported behavior is:

- safe read-only execution only
- backend-owned blocking of mutating, administrative, or multi-statement SQL

## Environment Mismatch Boundary

The following situations are outside the current documented troubleshooting boundary unless separately validated:

- Linux or macOS runtime differences
- remote SQL Server machines
- production hosting issues
- cloud networking
- container networking
- reverse proxy behavior
- authentication integration
- runtime AI integration

## Escalation Rule

Treat an issue as an application problem only after the documented local assumptions have been confirmed:

1. dependencies installed
2. backend running
3. frontend running
4. SQL Server reachable
5. `SequelCityCrimesDB` restored
6. backend `.env` values correct

Before those conditions are met, most failures should be handled as setup or environment readiness issues rather than code defects.
