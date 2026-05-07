# Known Limitations

## Purpose

This document records the current runtime limitations that should be treated as normal boundaries of the implemented system.

## Current Runtime Limitations

- the runtime is local-first and local-only
- the frontend depends on backend availability
- the backend depends on local SQL Server connectivity
- the backend depends on a restored `SequelCityCrimesDB`
- learner SQL is limited to backend-approved read-only queries
- suspect verification is available only through the dedicated backend case verification endpoint
- query history is in-memory only and is lost when the backend restarts
- the current implementation does not include persistent notebook or case-state storage

## Security And Access Limitations

- no authentication is implemented
- no authorization model is implemented
- no multi-user isolation is implemented
- no user account or session model is implemented

These are not hidden features. They are currently absent runtime capabilities.

## Deployment Limitations

- no production deployment support is documented or implemented
- no cloud deployment support is documented or implemented
- no internet-facing hosting model is documented or implemented
- no container or Docker workflow is documented or implemented

## Data And Execution Limitations

- no general SQL mutation is allowed from the learner query interface
- no `INSERT`, `UPDATE`, `DELETE`, `DROP`, `ALTER`, `CREATE`, `TRUNCATE`, `MERGE`, `EXEC`, `EXECUTE`, `GRANT`, `REVOKE`, `DENY`, `BACKUP`, `RESTORE`, or `USE` statements are supported through `POST /api/query/execute`
- only a single allowed `SELECT` statement may execute
- `WITH` is allowed only when it resolves to a top-level `SELECT`

This is intentional. The backend owns safety and execution boundaries.

The dedicated `POST /api/case/verify-suspect` route may perform the database-backed `Solution` verification flow internally. That route does not change the free SQL editor safety model.

## Runtime Architecture Limitations

- the frontend is presentation-only and cannot replace the backend
- direct frontend-to-database access is not supported
- backend validation and execution are required for all useful frontend behavior
- no runtime AI is implemented anywhere in the active request path

## Scope Limitations Relative To Broader SSOT Direction

The current runtime does not yet implement:

- deterministic case progression services
- notebook persistence
- production operations features

Those areas may exist in broader project direction, but they are not current release-readiness promises for the implemented runtime.
