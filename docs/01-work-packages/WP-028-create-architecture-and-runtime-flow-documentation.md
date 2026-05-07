# create-architecture-and-runtime-flow-documentation


## Objective

Create the first formal architecture documentation package for Sequel City Web Detective.

This WP establishes:

- system architecture overview
- frontend/backend/database runtime boundaries
- deterministic request lifecycle documentation
- runtime interaction diagrams
- service responsibility clarification
- local-first execution flow documentation

The goal is to create a stable architectural reference layer that aligns with the normalized SSOT governance package completed in WP-027.

---

## Scope

Create a new architecture documentation section:

docs/06-architecture/

Add foundational architecture documents describing the currently implemented system only.

This WP is documentation-only.

No runtime behavior changes.
No frontend changes.
No backend changes.
No database changes.

---

## Files Allowed to Change

Allowed:

- docs/06-architecture/README.md
- docs/06-architecture/system-overview.md
- docs/06-architecture/runtime-request-flow.md
- docs/06-architecture/frontend-backend-boundaries.md
- docs/06-architecture/deterministic-execution-model.md
- docs/06-architecture/diagrams/system-context.md
- docs/06-architecture/diagrams/query-execution-sequence.md
- docs/README.md

Do Not Modify:

- apps/api/**
- apps/web/**
- docs/00-ssot/**
- database/**
- package.json files
- build configuration
- runner scripts

---

## Constraints

- Documentation only
- Reflect implemented behavior only
- No speculative runtime AI behavior
- No future architecture presented as current implementation
- Preserve deterministic architecture principles
- Preserve backend ownership of validation and execution
- Preserve local-first architecture assumptions
- Keep architecture terminology aligned with SSOT documents
- Diagrams must remain simple and maintainable

Prompt formatting constraints:

- Use plain markdown only
- Avoid nested code fences
- Avoid escaped quote sequences
- Avoid malformed markdown tables
- Avoid hidden HTML fragments

Diagram constraints:

- Use Mermaid diagrams only
- Keep diagrams lightweight and readable in VSCode
- Avoid deeply nested subgraphs
- Avoid excessive edge crossings

---

## Required Behavior

The architecture package must document the currently implemented runtime architecture.

### 1. System Overview

Document:

- React/Vite frontend
- Fastify backend
- SQL Server database
- local-only runtime model
- deterministic architecture principles
- read-only SQL execution model

Clearly state:

- frontend is presentation-oriented
- backend owns validation and execution
- database results are authoritative

---

### 2. Runtime Request Flow

Document the request lifecycle for:

- schema metadata requests
- SQL execution requests
- query history recording
- deterministic validation flow

Flow must accurately reflect:

Frontend
→ Route
→ Service
→ Database layer
→ Response normalization
→ Frontend rendering

---

### 3. Frontend / Backend Boundaries

Explicitly document:

Frontend responsibilities:

- rendering
- input collection
- response presentation
- UI state

Backend responsibilities:

- validation
- execution authorization
- normalization
- SQL safety enforcement
- deterministic result shaping

Database responsibilities:

- authoritative data source only

Explicitly prohibit:

- frontend SQL validation duplication
- frontend direct database access
- frontend execution authority

---

### 4. Deterministic Execution Model

Document:

- why deterministic validation exists
- why runtime AI is excluded
- why backend ownership matters
- why read-only execution matters
- why local-first architecture was selected

This document should explain architectural rationale, not implementation detail.

---

### 5. Architecture Diagrams

Create lightweight Mermaid diagrams for:

- overall system context
- query execution sequence

Diagrams must remain readable in VSCode markdown preview.

---

### 6. Documentation Navigation

Update docs/README.md to include the new architecture section.

---

## Acceptance Criteria

- docs/06-architecture exists
- architecture overview documentation exists
- runtime request flow documented
- frontend/backend boundaries documented
- deterministic execution rationale documented
- Mermaid diagrams render correctly
- diagrams remain lightweight and readable
- terminology aligns with SSOT package
- no runtime source files modified
- no speculative architecture introduced
- no runtime AI behavior documented as implemented

---

## Codex Prompt

You are implementing WP-028 for the Sequel City Web Detective project.

Objective:
Create the first formal architecture documentation package under docs/06-architecture.

Important:

- Documentation only
- No runtime code changes
- No frontend/backend modifications
- No database modifications
- Reflect implemented behavior only
- No speculative future runtime AI architecture

Before editing:

1. Read all files in docs/00-ssot.
2. Read docs/README.md.
3. Review the currently implemented architecture assumptions from the SSOT package.

Create:

- docs/06-architecture/README.md
- docs/06-architecture/system-overview.md
- docs/06-architecture/runtime-request-flow.md
- docs/06-architecture/frontend-backend-boundaries.md
- docs/06-architecture/deterministic-execution-model.md
- docs/06-architecture/diagrams/system-context.md
- docs/06-architecture/diagrams/query-execution-sequence.md

Update:

- docs/README.md

Required architectural alignment:

- React + Vite + TypeScript frontend
- Fastify + TypeScript backend
- Local SQL Server database
- Local-first architecture
- Deterministic backend
- Backend-owned validation and execution
- Read-only SQL execution
- Frontend presentation-oriented responsibilities
- No runtime AI behavior

Diagram requirements:

- Mermaid only
- Lightweight
- VSCode-compatible
- Avoid deep nesting
- Avoid excessive complexity

Do not:

- invent unimplemented endpoints
- invent authentication systems
- invent deployment infrastructure
- invent cloud architecture
- invent runtime AI orchestration
- present future ideas as implemented behavior

Formatting requirements:

- Use simple markdown only
- Avoid nested code fences
- Avoid escaped quotes
- Avoid malformed markdown tables
- Avoid hidden HTML

---

## Gemini Audit Prompt

Audit WP-028 architecture documentation implementation.

Verify:

1. Only approved documentation files were modified.
2. No frontend runtime files changed.
3. No backend runtime files changed.
4. No database scripts changed.
5. Architecture terminology aligns with the SSOT package.
6. Backend ownership boundaries remain explicit.
7. Frontend presentation-only responsibilities remain explicit.
8. Read-only SQL execution guarantees remain explicit.
9. No speculative architecture was introduced.
10. No runtime AI behavior was documented as implemented.
11. Mermaid diagrams remain lightweight and VSCode-compatible.
12. Runtime request flow accurately reflects deterministic architecture.

Specifically validate:

- routes/services/db separation
- deterministic validation authority
- local-first runtime assumptions
- query execution flow accuracy
- frontend/backend interaction clarity

Flag:

- contradictory architecture statements
- speculative infrastructure
- cloud assumptions
- frontend validation duplication
- oversized or unreadable diagrams
- malformed Mermaid syntax
- terminology drift from SSOT documents

---

## Codex Results

Created the architecture package under [docs/06-architecture/README.md](/D:/GitHub-Repos/SequelCityWeb/docs/06-architecture/README.md) with the requested pages and Mermaid diagrams:
[system-overview.md](/D:/GitHub-Repos/SequelCityWeb/docs/06-architecture/system-overview.md), [runtime-request-flow.md](/D:/GitHub-Repos/SequelCityWeb/docs/06-architecture/runtime-request-flow.md), [frontend-backend-boundaries.md](/D:/GitHub-Repos/SequelCityWeb/docs/06-architecture/frontend-backend-boundaries.md), [deterministic-execution-model.md](/D:/GitHub-Repos/SequelCityWeb/docs/06-architecture/deterministic-execution-model.md), [system-context.md](/D:/GitHub-Repos/SequelCityWeb/docs/06-architecture/diagrams/system-context.md), and [query-execution-sequence.md](/D:/GitHub-Repos/SequelCityWeb/docs/06-architecture/diagrams/query-execution-sequence.md).

I also updated [docs/README.md](/D:/GitHub-Repos/SequelCityWeb/docs/README.md) to index the new architecture section. The content is aligned to the SSOT plus the actual implemented runtime in `apps/web` and `apps/api`, and it explicitly avoids presenting unimplemented features like suspect verification, notebook persistence, case progression services, auth, cloud infrastructure, or runtime AI as if they already exist.

No runtime code, frontend/backend logic, or database files were changed. No tests were needed for this docs-only work.

## Gemini Audit Results

The audit of the **WP-028 Architecture Documentation** implementation is complete. The documentation successfully provides a high-fidelity, deterministic representation of the current system while strictly adhering to the architectural boundaries defined in the SSOT package.

### **Audit Findings**

#### **1. Scope and Boundary Integrity**
- **File Isolation:** Only documentation files within `docs/06-architecture/` and the work package tracking file were modified. No runtime code (`apps/web`, `apps/api`) or database scripts were altered.
- **Explicit Responsibilities:** The documentation correctly identifies the **Frontend** as presentation-only (rendering UI, collecting SQL input) and the **Backend** as the sole authority for SQL safety, execution, and data normalization.
- **Security Guarantees:** Read-only SQL execution is explicitly documented, including a comprehensive list of blocked statement families (e.g., `INSERT`, `UPDATE`, `DELETE`, `DROP`, `EXEC`).

#### **2. SSOT Alignment and Terminology**
- **Terminology Consistency:** The documents use established SSOT terms such as "Local-First," "Deterministic," "Presentation Layer," and "API Layer."
- **Authority Mapping:** The "Authority Model" in the documentation aligns perfectly with `SSOT-Architecture.md`, placing truth in the database and validation authority in the backend services.

#### **3. Technical Accuracy**
- **Runtime Request Flow:** The documented request paths for health diagnostics, schema metadata, query execution, and history accurately reflect the current routes implemented in `apps/api/src/routes/`.
- **Diagrams:** The Mermaid diagrams (`system-context.md` and `query-execution-sequence.md`) are lightweight, syntactically correct, and compatible with standard Markdown previewers.

#### **4. Avoidance of Speculative Architecture**
- **AI Boundaries:** No runtime AI behavior is documented as implemented. AI is explicitly listed as a "Non-Goal" for the current version, adhering to the requirement to avoid speculative infrastructure.
- **Feature Scope:** The documentation clearly distinguishes between the broader product vision (e.g., case progression, evidence notebooks) and the currently implemented runtime, flagging the former as "project direction" rather than active architecture.

### **Conclusion**
The documentation implementation is **verified and compliant**. It provides a clear and accurate foundation for future development without violating project constraints or introducing technical debt through speculative documentation.
Warning: 256-color support not detected. Using a terminal with at least 256-color support is recommended for a better visual experience.
Ripgrep is not available. Falling back to GrepTool.

## Final Decision

Pending review and approval.


