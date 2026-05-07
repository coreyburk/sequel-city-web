# Database Overview

## Purpose

`SequelCityCrimesDB` is the authoritative data source for the Sequel City investigation experience. It stores the evidence, relationship structure, and verification-supporting data used by the local application.

## Authority Model

- database contents are authoritative
- schema metadata originates from SQL Server
- the backend retrieves and shapes schema metadata
- the frontend displays backend-returned schema information only

This keeps evidence and schema truth deterministic and database-backed.

## Local Runtime Assumptions

The current project assumes:

- local SQL Server
- local database name `SequelCityCrimesDB`
- backend connection through environment configuration
- local-first execution with no cloud database dependency

These assumptions match the current setup and release-readiness documentation.

## Investigation Structure

The checked-in schema supports investigation work through a small set of evidence areas:

- crime categories and crime scene reports
- people records
- interview transcripts
- driver and vehicle details
- employment records
- club membership and check-in records
- event scheduling and registration records
- spoiler-sensitive suspect verification support

## Evidence Workflow

The current learning flow is evidence-driven:

1. learners inspect schema metadata exposed by the backend
2. learners run read-only SQL through the backend
3. SQL Server returns the authoritative evidence rows
4. the frontend renders those results without changing their meaning

## Backend Consumption Model

The backend currently uses the database for:

- connection health reporting
- schema metadata retrieval
- read-only query execution
- database-backed evidence display

The backend does not invent tables, columns, or relationships. The frontend does not retrieve schema directly from SQL Server.
