# Schema Access Rules

## Core Rule

Schema truth is database-backed and backend-owned.

## Backend Responsibilities

The backend is responsible for:

- connecting to local SQL Server
- reading table metadata from SQL Server system catalogs
- reading primary key metadata
- reading foreign key metadata
- exposing schema metadata through backend routes
- preserving deterministic ordering in schema responses

## Frontend Responsibilities

The frontend is responsible for:

- requesting schema metadata from the backend
- rendering table and relationship data returned by the backend
- presenting schema information for learner exploration

The frontend must not:

- connect directly to SQL Server
- invent schema
- infer missing columns or relationships as authoritative facts
- override backend-returned schema metadata

## Documentation And Guidance Responsibilities

Documentation, UI copy, and future helper systems must:

- use actual schema already defined by the project
- describe tables and relationships conservatively
- avoid adding invented schema semantics

## Prohibited Schema Behavior

The current project prohibits:

- invented tables
- invented columns
- invented relationships
- frontend schema authority
- AI-generated schema assumptions presented as truth

## Current API Boundary

The current implementation exposes schema metadata through:

- `GET /api/schema/tables`
- `GET /api/health/full` for schema availability counts

No current route allows the frontend to define or mutate schema metadata.
