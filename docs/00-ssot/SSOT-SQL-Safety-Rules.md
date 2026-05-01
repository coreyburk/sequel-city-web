# SSOT SQL Safety Rules

## Purpose

The application allows students to practice SQL against the local SequelCityCrimesDB database. Query execution must be constrained so the learning environment remains safe, repeatable, and non-destructive.

## Initial Allowed SQL

The first implementation should allow only read-oriented `SELECT` statements.

## Initially Blocked SQL

The safety service must block statements containing destructive, mutating, administrative, or multi-batch behavior.

Blocked statement families:

- `INSERT`
- `UPDATE`
- `DELETE`
- `DROP`
- `ALTER`
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

## Authority

The SQL safety service is authoritative for whether a learner-submitted query may execute. AI agents may explain why something was blocked, but they may not override the safety service.
