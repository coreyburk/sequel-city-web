# create-api-contract-documentation

## Objective

Create the first formal API contract documentation package for Sequel City Web Detective.

This WP establishes:

- endpoint inventory documentation
- request/response contract documentation
- deterministic response guarantees
- validation/error response documentation
- backend execution authority documentation
- frontend/backend API interaction guidance

The goal is to create a stable API reference layer aligned with the implemented Fastify backend and the deterministic SSOT architecture.

---

## Scope

Create a new API documentation section:

docs/07-api-contracts/

Document only currently implemented endpoints and response behavior.

This WP is documentation-only.

No runtime behavior changes.
No backend logic changes.
No frontend changes.
No database changes.

---

## Files Allowed to Change

Allowed:

- docs/07-api-contracts/README.md
- docs/07-api-contracts/health-endpoints.md
- docs/07-api-contracts/schema-endpoints.md
- docs/07-api-contracts/query-execution-endpoints.md
- docs/07-api-contracts/history-endpoints.md
- docs/07-api-contracts/error-response-model.md
- docs/07-api-contracts/deterministic-response-guarantees.md
- docs/README.md

Do Not Modify:

- apps/api/**
- apps/web/**
- docs/00-ssot/**
- docs/06-architecture/**
- database/**
- package.json files
- build configuration
- runner scripts

---

## Constraints

- Documentation only
- Reflect implemented endpoints only
- Do not invent endpoints
- Do not invent authentication systems
- Do not invent authorization systems
- Do not invent cloud infrastructure
- Do not introduce speculative runtime AI behavior
- Preserve deterministic architecture terminology
- Preserve backend execution authority terminology
- Preserve read-only SQL guarantees

Formatting constraints:

- Use plain markdown only
- Avoid nested code fences
- Avoid escaped quote sequences
- Avoid malformed markdown tables
- Avoid hidden HTML fragments

API documentation constraints:

- Keep examples concise and deterministic
- Use stable example payloads
- Avoid fake production infrastructure examples
- Clearly separate implemented behavior from future project direction

---

## Required Behavior

The API documentation package must describe the currently implemented Fastify backend contracts.

### 1. Endpoint Inventory

Document implemented endpoint groups for:

- runtime health
- schema metadata
- SQL execution
- query history

For each endpoint include:

- route path
- HTTP method
- purpose
- deterministic guarantees
- request shape
- response shape

---

### 2. Query Execution Contracts

Document:

- read-only execution guarantees
- backend validation authority
- normalized response behavior
- deterministic error handling
- SQL safety enforcement

Explicitly state:

- frontend does not validate SQL authority
- backend is authoritative
- database results remain authoritative

---

### 3. Error Response Model

Document current deterministic error behavior for:

- blocked SQL
- invalid SQL
- backend execution failures
- database connectivity issues
- malformed requests

Clarify:

- errors are deterministic
- backend-generated
- presentation-only in frontend

---

### 4. Deterministic Response Guarantees

Document why deterministic response contracts matter.

Include:

- reproducibility
- stable frontend rendering
- backend authority
- safety enforcement consistency
- predictable educational behavior

---

### 5. Documentation Navigation

Update docs/README.md to include the API contracts section.

---

## Acceptance Criteria

- docs/07-api-contracts exists
- implemented endpoints documented
- request/response examples documented
- deterministic error behavior documented
- backend authority clearly documented
- read-only SQL guarantees clearly documented
- terminology aligns with SSOT package
- no speculative endpoints introduced
- no runtime source files modified
- no runtime AI behavior documented as implemented

---

## Codex Prompt

You are implementing WP-029 for the Sequel City Web Detective project.

Objective:
Create the API contract documentation package under docs/07-api-contracts.

Important:

- Documentation only
- No runtime code changes
- No frontend/backend modifications
- No database modifications
- Reflect implemented endpoints only
- No speculative runtime AI architecture
- No invented APIs

Before editing:

1. Read all files in docs/00-ssot.
2. Read docs/06-architecture/.
3. Inspect currently implemented Fastify routes under apps/api.
4. Document only endpoints that actually exist.

Create:

- docs/07-api-contracts/README.md
- docs/07-api-contracts/health-endpoints.md
- docs/07-api-contracts/schema-endpoints.md
- docs/07-api-contracts/query-execution-endpoints.md
- docs/07-api-contracts/history-endpoints.md
- docs/07-api-contracts/error-response-model.md
- docs/07-api-contracts/deterministic-response-guarantees.md

Update:

- docs/README.md

Required alignment:

- deterministic backend authority
- read-only SQL execution
- frontend presentation-only responsibility
- backend-owned validation
- backend-owned execution
- stable response contracts
- local-first architecture

Do not:

- invent authentication
- invent authorization
- invent cloud deployment
- invent endpoints
- invent AI runtime behavior
- present future ideas as implemented features

Formatting requirements:

- Use simple markdown only
- Avoid nested code fences
- Avoid escaped quotes
- Avoid malformed markdown tables
- Avoid hidden HTML

Example payload requirements:

- Keep examples concise
- Keep examples deterministic
- Avoid environment-specific secrets
- Avoid speculative fields

---

## Gemini Audit Prompt

Audit WP-029 API contract documentation implementation.

Verify:

1. Only approved documentation files were modified.
2. No frontend runtime files changed.
3. No backend runtime files changed.
4. Only implemented endpoints are documented.
5. API terminology aligns with SSOT and architecture documents.
6. Backend validation authority remains explicit.
7. Read-only SQL execution guarantees remain explicit.
8. Frontend presentation-only responsibility remains explicit.
9. Error response behavior is documented deterministically.
10. No speculative APIs were introduced.
11. No runtime AI behavior was documented as implemented.
12. Example payloads remain concise and deterministic.

Specifically validate:

- route accuracy
- request/response consistency
- deterministic response guarantees
- SQL safety authority
- query execution flow accuracy
- history endpoint accuracy

Flag:

- undocumented invented endpoints
- speculative infrastructure
- cloud assumptions
- frontend execution authority
- malformed payload examples
- terminology drift from SSOT package
- inconsistent deterministic guarantees

---

## Codex Results

Created the API contract package under [docs/07-api-contracts/README.md](D:/GitHub-Repos/SequelCityWeb/docs/07-api-contracts/README.md) and added the route-specific documents for health, schema, query execution, history, error modeling, and deterministic guarantees. The content is limited to the five implemented Fastify routes in `apps/api` and stays aligned with the SSOT and architecture docs: backend authority, read-only SQL execution, stable response contracts, frontend presentation-only responsibility, and local-first runtime.

I also updated [docs/README.md](D:/GitHub-Repos/SequelCityWeb/docs/README.md) to include the new package. No runtime code, frontend, backend, or database files were changed.

Verification: I cross-checked the docs against `docs/00-ssot`, `docs/06-architecture`, the route/service/type files under `apps/api/src`, and the existing route/service tests. I did not run automated tests because this work package was documentation-only.

## Gemini Audit Results

I have completed the audit of WP-029 (API contract documentation). The implementation is accurate, professionally formatted, and strictly adheres to the project's deterministic and local-first architecture.

### Audit Findings

1. **Scope Verification**: Only the approved documentation files in `docs/07-api-contracts/` and `docs/README.md` were modified. No runtime files in `apps/api` or `apps/web` were changed.
2. **Endpoint Accuracy**: The documentation accurately reflects the 5 implemented Fastify routes:
   * `GET /api/health/database`
   * `GET /api/health/full`
   * `GET /api/schema/tables`
   * `POST /api/query/execute`
   * `GET /api/query/history`
3. **Terminology Alignment**: The documentation maintains strict alignment with SSOT and architecture documents, consistently using terms like "backend authority," "deterministic response," "read-only execution," and "presentation-only frontend."
4. **Authority Model**: The documentation explicitly states that the backend is the authority for SQL safety, validation, and execution, while the database remains the authority for schema and results.
5. **Deterministic Guarantees**:
   * **SQL Safety**: Clearly documents the backend validation layer and blocked statement families (INSERT, DELETE, etc.).
   * **Normalization**: Accurately describes how result sets are shaped into `values` and `displayValues`.
   * **Error Handling**: Deterministically maps status codes (200, 400, 500, 503) and body shapes for failure states.
6. **No Speculation**: No invented APIs, cloud assumptions, or speculative AI behaviors were introduced. Non-implemented features (e.g., suspect verification, case progression) are correctly identified as out-of-scope for the current runtime.
7. **Payload Examples**: JSON examples are concise, stable, and use realistic but safe sample data (e.g., `SequelCityCrimesDB`, `Ada Lovelace`).

### Conclusion

The WP-029 implementation successfully establishes a high-quality API contract layer that serves as a reliable reference for both frontend development and future backend enhancements. No issues were flagged during this audit.
Warning: 256-color support not detected. Using a terminal with at least 256-color support is recommended for a better visual experience.
Ripgrep is not available. Falling back to GrepTool.

## Final Decision

Approved.

WP-029 successfully established the API contract documentation package for the currently implemented Fastify backend.

Verified outcomes:

- Created docs/07-api-contracts documentation package.
- Documented implemented health, schema, query execution, and query history endpoints.
- Added deterministic request/response contract documentation.
- Documented backend validation authority and read-only SQL execution guarantees.
- Added deterministic error response modeling documentation.
- Documented deterministic response guarantees and normalization behavior.
- Updated docs navigation through docs/README.md.
- Preserved strict documentation-only scope.

Verification notes:

- API documentation aligns with the SSOT and architecture packages.
- Only implemented Fastify routes were documented.
- Backend authority for validation and execution remains explicit.
- Frontend presentation-only responsibility remains explicit.
- Read-only SQL execution guarantees remain explicit.
- No speculative APIs or infrastructure were introduced.
- No runtime AI behavior was documented as implemented.
- Example payloads remain concise and deterministic.
- No runtime source files were modified.

Acceptable warnings:

- 256-color terminal warnings are informational only.
- Ripgrep fallback behavior is informational only.

Approved for commit.
