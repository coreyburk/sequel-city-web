# create-database-reference-and-evidence-model-documentation

## Objective

Create the first formal database reference and evidence model documentation package for Sequel City Web Detective.

This WP establishes:

- database reference documentation
- evidence-oriented schema documentation
- table relationship documentation
- spoiler-aware learner guidance boundaries
- backend schema usage documentation
- deterministic evidence authority documentation

The goal is to create a stable database reference layer aligned with the SequelCityCrimesDB schema and the deterministic investigation architecture.

---

## Scope

Create a new database documentation section:

docs/08-database/

Document only currently implemented schema assumptions and evidence relationships derived from the existing SequelCityCrimesDB database and SSOT package.

This WP is documentation-only.

No runtime behavior changes.
No backend changes.
No frontend changes.
No database schema changes.

---

## Files Allowed to Change

Allowed:

- docs/08-database/README.md
- docs/08-database/database-overview.md
- docs/08-database/evidence-model.md
- docs/08-database/schema-access-rules.md
- docs/08-database/table-reference.md
- docs/08-database/relationship-reference.md
- docs/08-database/spoiler-and-guidance-boundaries.md
- docs/08-database/backend-schema-usage.md
- docs/README.md

Do Not Modify:

- database/**
- apps/api/**
- apps/web/**
- docs/00-ssot/**
- docs/06-architecture/**
- docs/07-api-contracts/**
- docs/09-release-readiness/**
- package.json files
- build configuration
- runner scripts

---

## Constraints

- Documentation only
- Reflect actual database structure only
- Do not invent tables or columns
- Do not invent relationships
- Do not reveal hidden solutions or suspect identities
- No speculative schema extensions
- Preserve deterministic architecture terminology
- Preserve backend schema authority terminology
- Preserve spoiler-aware educational framing

Formatting constraints:

- Use plain markdown only
- Avoid nested code fences
- Avoid escaped quote sequences
- Avoid malformed markdown tables
- Avoid hidden HTML fragments

Database documentation constraints:

- Keep schema descriptions concise and factual
- Avoid dumping raw CREATE TABLE scripts
- Avoid exposing hidden solution mechanics unnecessarily
- Keep guidance educational rather than exhaustive
- Preserve investigation-oriented framing

---

## Required Behavior

The database documentation package must describe the current SequelCityCrimesDB structure and its role in deterministic investigation gameplay.

### 1. Database Overview

Document:

- purpose of SequelCityCrimesDB
- investigation-oriented schema structure
- local SQL Server assumptions
- evidence-driven query workflow
- backend schema consumption model

Explicitly state:

- database results are authoritative
- schema metadata originates from the database
- frontend displays backend-returned schema information only

---

### 2. Evidence Model Documentation

Document the evidence-oriented structure of the database.

Include conceptual descriptions for:

- people-related entities
- location-related entities
- witness/interview data
- crime/event data
- relationship-driven investigation flow

Do not reveal hidden case solutions.

---

### 3. Table Reference

Document actual implemented tables and their high-level purposes.

For each table include:

- table purpose
- investigation role
- notable relationships
- spoiler-aware usage notes

Avoid exhaustive column-by-column dumps unless necessary.

---

### 4. Relationship Reference

Document key relationship patterns used during investigations.

Include:

- entity linkage concepts
- cross-reference investigation patterns
- relational evidence traversal examples

Keep examples spoiler-safe.

---

### 5. Schema Access Rules

Document:

- backend ownership of schema retrieval
- frontend presentation-only responsibilities
- deterministic schema authority
- restrictions on inferred schema generation

Explicitly prohibit:

- invented schema
- frontend schema authority
- AI-generated schema assumptions

---

### 6. Spoiler and Guidance Boundaries

Document educational and spoiler-control principles.

Clarify:

- schema visibility is allowed
- direct hidden-solution disclosure is prohibited
- guidance should preserve investigation discovery
- backend and UI should avoid revealing final answers automatically

---

### 7. Backend Schema Usage

Document how the backend currently uses schema metadata for:

- schema endpoints
- query execution context
- deterministic validation
- frontend rendering support

Do not invent runtime behavior not currently implemented.

---

### 8. Documentation Navigation

Update docs/README.md to include the database documentation package.

---

## Acceptance Criteria

- docs/08-database exists
- database overview documented
- evidence model documented
- table reference documented
- relationship reference documented
- schema access rules documented
- spoiler boundaries documented
- backend schema usage documented
- terminology aligns with SSOT and architecture docs
- no hidden solution disclosure
- no speculative schema introduced
- no runtime source files modified
- no runtime AI behavior documented as implemented

---

## Codex Prompt

You are implementing WP-031 for the Sequel City Web Detective project.

Objective:
Create the database reference and evidence model documentation package under docs/08-database.

Important:

- Documentation only
- No runtime code changes
- No frontend/backend modifications
- No database schema modifications
- Reflect actual SequelCityCrimesDB structure only
- No speculative schema additions
- No hidden solution disclosure
- No runtime AI behavior

Before editing:

1. Read docs/00-ssot.
2. Read docs/06-architecture.
3. Read docs/07-api-contracts.
4. Read docs/09-release-readiness.
5. Review the existing SequelCityCrimesDB schema references already present in the repository.
6. Use only actual database tables and relationships already defined by the project.

Create:

- docs/08-database/README.md
- docs/08-database/database-overview.md
- docs/08-database/evidence-model.md
- docs/08-database/schema-access-rules.md
- docs/08-database/table-reference.md
- docs/08-database/relationship-reference.md
- docs/08-database/spoiler-and-guidance-boundaries.md
- docs/08-database/backend-schema-usage.md

Update:

- docs/README.md

Required alignment:

- deterministic backend authority
- database-backed evidence authority
- frontend presentation-only responsibilities
- backend-owned schema retrieval
- local SQL Server assumptions
- spoiler-aware educational design

Do not:

- invent tables
- invent columns
- invent relationships
- reveal hidden suspect identities
- expose hidden solution logic
- invent future schema plans
- invent cloud database infrastructure
- invent runtime AI behavior

Formatting requirements:

- Use simple markdown only
- Avoid nested code fences
- Avoid escaped quotes
- Avoid malformed markdown tables
- Avoid hidden HTML

Keep the documentation concise, educational, deterministic, and spoiler-safe.

---

## Gemini Audit Prompt

Audit WP-031 database reference documentation implementation.

Verify:

1. Only approved documentation files were modified.
2. No frontend runtime files changed.
3. No backend runtime files changed.
4. No database schema files changed.
5. Documentation reflects actual database structure only.
6. No invented tables, columns, or relationships were introduced.
7. Backend schema authority remains explicit.
8. Frontend presentation-only responsibility remains explicit.
9. Spoiler boundaries are preserved.
10. No hidden suspect identities or direct solution disclosures appear.
11. Terminology aligns with SSOT and architecture documents.
12. No runtime AI behavior was documented as implemented.

Specifically validate:

- schema accuracy
- relationship accuracy
- evidence model clarity
- backend schema usage accuracy
- spoiler-safe examples
- deterministic evidence authority language

Flag:

- hidden solution disclosure
- speculative schema additions
- invented relationships
- frontend schema authority
- AI-generated schema claims
- contradictory database guidance
- malformed schema examples
- terminology drift from SSOT package

---

## Codex Results

Created the WP-031 documentation package under [docs/08-database/README.md](D:/GitHub-Repos/SequelCityWeb/docs/08-database/README.md) and added it to the main docs index at [docs/README.md](D:/GitHub-Repos/SequelCityWeb/docs/README.md).

The new package covers the database overview, evidence model, schema access rules, table reference, relationship reference, spoiler boundaries, and current backend schema usage. It stays aligned to the checked-in SQL scripts and current backend behavior: local `SequelCityCrimesDB`, backend-owned schema retrieval, frontend presentation-only responsibilities, deterministic database authority, and no runtime AI. I kept the `Solution` table documented only at a boundary level and did not restate hidden suspect identities or trigger logic.

Verification was manual and documentation-only: I cross-checked the content against `database/01-SequelCityCrimesDB - Create DB.sql`, `database/03-SequelCityCrimesDB - ForeignKeys.sql`, and the current schema service and route implementation under `apps/api/src/services/schemaService.ts` and `apps/api/src/routes/schemaRoutes.ts`. No runtime code, frontend/backend source, or database scripts were changed.

## Gemini Audit Results

The audit of the **WP-031 Database Reference Documentation** implementation is complete. The implementation is highly compliant with the work package constraints, architectural boundaries, and the Single Source of Truth (SSOT).

### Audit Summary

1. **Scope and File Integrity:**
   * **Approved Files:** Modifications were strictly limited to the `docs/08-database/` directory and the `docs/README.md` index.
   * **Runtime Integrity:** No changes were made to backend (`apps/api/`), frontend (`apps/web/`), or database schema files (`database/*.sql`).
2. **Schema Accuracy:**
   * The documentation accurately reflects the 11 tables and 9 foreign key relationships defined in the checked-in SQL scripts (`01-SequelCityCrimesDB - Create DB.sql` and `03-SequelCityCrimesDB - ForeignKeys.sql`).
   * No invented tables, columns, or speculative relationships were introduced.
3. **Architectural Alignment:**
   * **Authority Model:** Documentation explicitly maintains that **backend schema retrieval is authoritative** and the **frontend is presentation-only**.
   * **Deterministic Flow:** The language consistently reinforces the "database-backed evidence" and "deterministic investigation" terminology found in the SSOT and architecture documents.
4. **Spoiler and Guidance Boundaries:**
   * **Spoiler Safety:** The `Solution` table is documented only at a structural level. No hidden suspect identities (e.g., the hex-encoded names in the `CheckSuspect` trigger) or direct solution paths are disclosed.
   * **Educational Framing:** Guidance is focused on relational traversal (joins, filters) rather than providing walkthroughs or answer keys.
5. **Terminology and AI Boundaries:**
   * **Terminology:** Aligned with `SSOT-Database-Schema.md` and `SSOT-Architecture.md`.
   * **AI Prohibition:** Multiple documents (e.g., `database-overview.md`, `spoiler-and-guidance-boundaries.md`) explicitly state that **no runtime AI behavior is currently implemented or documented**.

### Verification Details

* **Table Reference:** Matches `database/01-SequelCityCrimesDB - Create DB.sql` exactly (11 tables).
* **Relationship Reference:** Matches `database/03-SequelCityCrimesDB - ForeignKeys.sql` exactly (9 FK constraints).
* **Evidence Model:** Correctly describes the "Person-centric" relational model without revealing the specific clues that lead to the solution.

### Conclusion

The WP-031 implementation is **Approved**. It successfully establishes a stable, accurate, and spoiler-safe database documentation layer that serves as a reliable reference for developers and a boundary for future feature implementation.

---

**Audit Status:** Passed
**Flagged Issues:** None
Warning: 256-color support not detected. Using a terminal with at least 256-color support is recommended for a better visual experience.
Ripgrep is not available. Falling back to GrepTool.

## Final Decision

Approved.

WP-031 successfully established the database reference and evidence model documentation package for SequelCityCrimesDB.

Verified outcomes:

- Created docs/08-database documentation package.
- Documented database overview and evidence-oriented investigation model.
- Added schema access rules and backend schema authority documentation.
- Added spoiler-safe table and relationship reference documentation.
- Documented deterministic database evidence authority.
- Added backend schema usage documentation aligned to implemented services and routes.
- Preserved spoiler-control boundaries and educational framing.
- Updated docs navigation through docs/README.md.
- Preserved strict documentation-only scope.

Verification notes:

- Documentation aligns with SSOT, architecture, API contract, and release readiness packages.
- Documentation reflects actual checked-in database structure only.
- No invented tables, columns, or relationships were introduced.
- Backend schema retrieval authority remains explicit.
- Frontend presentation-only responsibility remains explicit.
- Hidden suspect identities and solution logic were not disclosed.
- No speculative schema extensions or infrastructure were introduced.
- No runtime AI behavior was documented as implemented.
- No runtime source files or database scripts were modified.

Acceptable warnings:

- 256-color terminal warnings are informational only.
- Ripgrep fallback behavior is informational only.

Approved for commit.
