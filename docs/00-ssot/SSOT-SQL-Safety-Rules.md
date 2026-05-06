# SSOT SQL Safety Rules

## Purpose

The application allows students to practice SQL against the local SequelCityCrimesDB database. Read-only SQL execution must be constrained so the learning environment remains safe, repeatable, and non-destructive.

## Document Scope

This document owns SQL validation rules, blocked statement families, safety result shape, and execution constraints for learner-submitted SQL. Runtime layering is owned by `SSOT-Architecture.md`. Database schema facts are owned by `SSOT-Database-Schema.md`.

## Initial Allowed SQL

The first implementation must allow only read-oriented `SELECT` statements through the learner SQL editor.

Allowed initial query behavior:

- `SELECT` queries only
- Safe filtering
- Safe joins
- Safe ordering
- Safe grouping

## Initially Blocked SQL

The safety service must block statements containing destructive, mutating, administrative, or multi-batch behavior.

Blocked statement families:

- `INSERT`
- `UPDATE`
- `DELETE`
- `DROP`
- `ALTER`
- Schema modification
- Data mutation
- Any destructive operation
- `CREATE`
- `TRUNCATE`
- `MERGE`
- `EXEC`
- `EXECUTE`
- `GRANT`
- `REVOKE`
- `DENY`
- `BACKUP`
- `RESTORE`
- `USE`
- `DBCC`

Blocked patterns:

- Multiple batches using `GO`.
- Multiple statements in one request, unless later explicitly supported.
- Attempts to access system databases.
- Attempts to change database state.

All learner-submitted SQL must be validated by the deterministic backend before execution. Safety enforcement is centralized in the backend safety service. The frontend may show safety feedback, but it must not duplicate or override backend validation logic.

## Special Case: Solution Verification

The original assignment uses `INSERT INTO Solution` to verify suspects. The web application should not allow general learner-submitted `INSERT` statements through the free SQL editor.

Instead, use a dedicated suspect verification endpoint:

```http
POST /api/case/verify-suspect
```

The backend may perform the required database-backed verification internally. This preserves the assignment's deterministic behavior without exposing general mutation rights in the editor.

## Safety Result Model

Recommended fields:

- `allowed`
- `outcome`
- `reason`
- `blockedTokens`
- `normalizedSql`

Violations must return a structured safety response using this deterministic result model.

## Authority

The SQL safety service is authoritative for whether a learner-submitted query may execute. Query execution is read-only and occurs only after backend approval. AI agents, if added later as optional advisory enhancements, may explain why something was blocked, but they may not override the safety service.

The initial learner SQL editor is `SELECT`-only. Mutating or destructive statements, including `INSERT`, `UPDATE`, `DELETE`, `DROP`, and `ALTER`, are explicitly blocked.
