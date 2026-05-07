# Backend Schema Usage

## Purpose

This document describes how the current backend uses `SequelCityCrimesDB` schema metadata.

## Current Usage Areas

The backend currently uses schema metadata for:

- `GET /api/schema/tables`
- `GET /api/health/full` schema availability reporting
- frontend schema explorer support

## Schema Loading Model

The current schema service reads metadata from SQL Server system catalogs.

It loads:

- user table and column metadata from `sys.tables`, `sys.schemas`, `sys.columns`, and `sys.types`
- primary key metadata from `sys.key_constraints`, `sys.index_columns`, and `sys.columns`
- foreign key metadata from `sys.foreign_keys` and `sys.foreign_key_columns`

The backend then shapes that metadata into deterministic `tables` and `relationships` arrays.

## Response Shaping

The current backend adds:

- `fullName` as `${schemaName}.${tableName}`
- `isPrimaryKey` flags on columns
- `isForeignKey` flags on columns
- stable table ordering by schema and table name
- stable column ordering by ordinal
- stable relationship ordering by constraint and source fields

## Route Usage

### `GET /api/schema/tables`

This route is the main schema exposure path.

It returns:

- table metadata
- column metadata
- primary key metadata
- relationship metadata

If schema loading fails, the route returns a backend failure response rather than guessed schema content.

### `GET /api/health/full`

This route uses schema loading to report:

- whether schema metadata is available
- current table count
- current relationship count

It does not expose a second schema format.

## Query Execution Boundary

The current query execution path is backend-owned and database-backed, but it is not schema-aware in the sense of semantic table validation before execution.

Current query execution behavior is:

- SQL safety validation happens before database execution
- approved read-only SQL runs against SQL Server
- SQL Server remains the authority for whether referenced tables and columns exist

This means schema metadata currently supports exploration and diagnostics, not pre-execution query correction or inference.

## Frontend Support Boundary

The backend provides schema metadata so the frontend can:

- render the schema explorer
- show actual table and relationship structure
- help learners compose evidence queries against real schema

The frontend does not load schema directly from SQL Server and does not generate its own authoritative schema model.
