# WP-090: ssot-investigation-state-architecture

## Objective

Establish the authoritative investigation gameplay state architecture for Sequel City Web Detective.

This WP creates a formal SSOT governing:

- investigation state ownership
- evidence state ownership
- thread lifecycle rules
- progression authority
- mentor guidance authority
- notebook authority
- frontend/backend gameplay boundaries
- persistence expectations
- deterministic gameplay state transitions

The goal is to stabilize gameplay architecture before implementing the Deterministic Investigation Thread System planned for WP-091.

---

## Scope

Create a new SSOT document defining investigation gameplay state architecture and deterministic ownership boundaries.

This WP is documentation-only.

No runtime behavior changes.
No frontend changes.
No backend changes.
No database changes.

---

## Files Allowed to Change

Allowed:

- docs/00-ssot/SSOT-Investigation-State-Architecture.md
- docs/00-ssot/SSOT-Index.md
- docs/README.md

Do Not Modify:

- apps/api/**
- apps/web/**
- database/**
- docs/06-architecture/**
- docs/07-api-contracts/**
- docs/08-database/**
- docs/09-release-readiness/**
- docs/10-user-journey/**
- package.json files
- build configuration
- runner scripts

---

## Constraints

- Documentation only
- Preserve deterministic architecture principles
- Preserve backend authority terminology
- Preserve frontend presentation-only boundaries
- No speculative runtime AI behavior
- No speculative multiplayer systems
- No speculative cloud infrastructure
- No invented persistence systems
- No hidden gameplay automation
- No hidden suspect identity disclosure
- No direct solution disclosure

Formatting constraints:

- Use plain markdown only
- Avoid nested code fences
- Avoid escaped quote sequences
- Avoid malformed markdown tables
- Avoid hidden HTML fragments

Architecture constraints:

- State ownership must remain deterministic
- Backend remains authoritative for validation and execution
- Frontend may manage presentation state only
- Gameplay progression must remain explainable and reproducible
- Learner agency must remain preserved
- Spoiler-safe investigation principles must remain explicit

---

## Required Behavior

The new SSOT must define the authoritative gameplay state architecture used by the investigation experience.

### 1. Investigation State Ownership

Document authoritative ownership boundaries for:

- investigation progression
- evidence state
- notebook state
- mentor guidance state
- thread state
- milestone state
- pinned fact state
- query history state

Clarify:

- which state is frontend-only
- which state is backend-derived
- which state is deterministic gameplay state
- which state is transient UI state
- which state must not become hidden solution authority

---

### 2. Deterministic Gameplay Principles

Explicitly define:

- deterministic progression requirements
- reproducible investigation state expectations
- backend authority requirements
- frontend presentation limitations
- educational fairness requirements

Clarify why runtime AI is excluded from gameplay authority.

---

### 3. Investigation Thread Model

Define the architectural model for future investigation threads.

Document concepts such as:

- investigation threads
- thread lifecycle
- unresolved leads
- resolved leads
- blocked leads
- evidence-linked threads
- learner-driven thread progression

Do not implement runtime behavior.

This section establishes architectural direction only.

---

### 4. State Transition Authority

Document authoritative ownership for:

- clue discovery
- clue logging
- mentor unlocks
- milestone progression
- thread transitions
- notebook updates
- pinned evidence changes

Clarify:

- deterministic trigger expectations
- learner-controlled actions
- system-controlled actions
- prohibited automatic inference behavior

Explicitly prohibit:

- automatic suspect resolution
- runtime AI deduction
- hidden automatic gameplay advancement
- non-deterministic progression
- frontend-only correctness claims

---

### 5. Frontend vs Backend Gameplay Responsibilities

Document architectural boundaries for gameplay systems.

Frontend responsibilities:

- rendering investigation state
- collecting learner actions
- displaying progression
- displaying mentor guidance
- displaying evidence state
- managing transient UI display state

Backend responsibilities:

- deterministic validation
- query execution
- schema authority
- database evidence authority
- progression rule authority where implemented

Explicitly prohibit:

- frontend gameplay authority
- frontend evidence inference
- frontend progression validation
- frontend hidden solution logic
- frontend SQL safety authority

---

### 6. Persistence Expectations

Document architectural expectations for gameplay persistence.

Clarify conceptual ownership for:

- notebook persistence
- thread persistence
- milestone persistence
- evidence persistence
- query history persistence

Do not invent storage implementations not currently implemented.

This section defines architectural expectations only.

---

### 7. Spoiler-Safe Investigation Principles

Document gameplay guidance principles:

- preserve learner reasoning
- preserve investigative discovery
- avoid answer automation
- avoid premature suspect exposure
- maintain evidence-driven progression
- avoid direct solution path disclosure

Clarify:

- guidance should scaffold reasoning
- guidance should not replace reasoning

---

### 8. Future Gameplay Expansion Boundaries

Document safe future expansion boundaries for:

- additional cases
- additional evidence systems
- additional mentor guidance
- additional progression systems
- additional investigation threads

Clarify that all future systems must preserve:

- deterministic authority
- backend validation ownership
- learner agency
- spoiler-safe investigation flow

---

### 9. SSOT Index Integration

Update SSOT-Index.md to include the new SSOT document and its ownership responsibilities.

Update docs/README.md if needed to reflect the expanded SSOT package.

---

## Acceptance Criteria

- SSOT-Investigation-State-Architecture.md created
- gameplay state ownership boundaries documented
- deterministic gameplay principles documented
- investigation thread architecture documented
- frontend/backend gameplay responsibilities documented
- persistence expectations documented
- spoiler-safe gameplay principles documented
- future expansion boundaries documented
- SSOT index updated
- terminology aligned with existing SSOT package
- no speculative runtime AI behavior introduced
- no invented persistence infrastructure introduced
- no hidden solution disclosure introduced
- no runtime source files modified

---

## Code Prompt

You are implementing WP-090 for the Sequel City Web Detective project.

You have permission to write the approved files for this WP. Do not pause to ask for confirmation after preparing a draft. Apply the documentation changes directly.

Do not create or modify `.claude/` files. If Claude Code attempts to create local metadata, ignore those files and do not include them in the implementation summary.

Objective:
Create the authoritative gameplay investigation state architecture SSOT.

Important:

- Documentation only
- No runtime code changes
- No frontend/backend modifications
- No database modifications
- Preserve deterministic gameplay architecture
- Preserve backend authority boundaries
- Preserve learner agency
- No runtime AI behavior
- No hidden solution disclosure

Before editing:

1. Read all files in docs/00-ssot.
2. Read docs/06-architecture.
3. Read docs/07-api-contracts.
4. Read docs/08-database.
5. Read docs/10-user-journey.
6. Review recent gameplay-oriented Work Packages and current investigation UX direction.

Create:

- docs/00-ssot/SSOT-Investigation-State-Architecture.md

Update:

- docs/00-ssot/SSOT-Index.md
- docs/README.md if necessary

Required alignment:

- deterministic gameplay progression
- backend validation authority
- frontend presentation-only responsibilities
- spoiler-safe investigation flow
- learner-owned reasoning
- evidence-driven progression
- local-first runtime assumptions

The SSOT must formally define:

- investigation state ownership
- thread ownership concepts
- progression authority
- mentor guidance authority
- notebook authority
- evidence ownership
- deterministic state transitions
- persistence expectations
- future gameplay expansion boundaries

Do not:

- invent runtime AI systems
- invent autonomous gameplay
- invent multiplayer systems
- invent cloud gameplay infrastructure
- invent hidden automatic progression
- invent persistence infrastructure not currently implemented
- reveal hidden suspect identities
- reveal direct solution paths
- implement runtime features

Formatting requirements:

- Use simple markdown only
- Avoid nested code fences
- Avoid escaped quotes
- Avoid malformed markdown tables
- Avoid hidden HTML

Keep the SSOT authoritative, concise, deterministic, and implementation-aligned.

---

## Gemini Audit Prompt

Audit WP-090 SSOT Investigation State Architecture implementation.

Verify:

1. Only approved documentation files were modified.
2. No frontend runtime files changed.
3. No backend runtime files changed.
4. No database scripts changed.
5. The new SSOT aligns with existing SSOT terminology and architecture boundaries.
6. Deterministic gameplay authority remains explicit.
7. Backend validation authority remains explicit.
8. Frontend presentation-only responsibilities remain explicit.
9. Learner agency remains preserved.
10. Spoiler-safe investigation principles remain explicit.
11. No speculative runtime AI behavior was introduced.
12. No hidden automatic gameplay advancement was introduced.
13. Persistence expectations remain architectural only and do not invent unimplemented systems.
14. SSOT-Index.md correctly references the new SSOT.

Specifically validate:

- investigation state ownership clarity
- thread lifecycle architecture clarity
- milestone authority clarity
- evidence ownership clarity
- frontend/backend gameplay boundaries
- deterministic progression principles
- prohibited gameplay automation language
- spoiler-safe wording

Flag:

- speculative gameplay systems
- runtime AI implication
- frontend authority drift
- hidden solution disclosure
- contradictory state ownership
- invented persistence infrastructure
- terminology drift from SSOT package
- malformed architectural guidance

---

## Code Results

Created `docs/00-ssot/SSOT-Investigation-State-Architecture.md`:

- State ownership model with authority table covering all investigation state categories
- Deterministic gameplay principles: backend authority, frontend presentation limits, educational fairness, AI exclusion rationale
- Investigation thread model: thread concept, lifecycle states (Unresolved / Active / Resolved / Blocked), lead categories (scene, witness, physical, membership, event, suspect, mastermind), learner-driven progression rules
- State transition authority: valid triggers, learner-controlled actions, system-controlled actions, and explicit prohibited automation list
- Frontend vs backend gameplay responsibilities: explicitly lists what each layer may and must not do
- Persistence expectations: current in-memory state, architectural ownership rules for future persistence, prohibition on speculative persistence invention
- Spoiler-safe investigation principles: guidance rules, safe patterns, prohibited patterns
- Future gameplay expansion boundaries: safe categories and required preservation rules
- Governance cross-references to all related SSOT documents

Updated `docs/00-ssot/SSOT-Index.md`:

- Added `SSOT-Investigation-State-Architecture.md` row to the Documents table
- Added governance cross-reference entry for investigation state, thread lifecycle, and persistence expectations
- Minor cleanup: removed outdated "ChatGPT" reference in SSOT-Development-Workflow.md description

No changes required to `docs/README.md` — it references `SSOT-Index.md` as the SSOT map and does not list individual documents.

## Gemini Audit Results

The audit of **WP-090: SSOT Investigation State Architecture** has been completed.

### Audit Result: **PASS**

The implementation of WP-090 is successful. The core documentation artifacts have been created and integrated, establishing a clear architectural boundary for investigation state and deterministic gameplay authority.

---

### Verification Checklist

1. **Only approved documentation files were modified:** **PASS** (`docs/00-ssot/SSOT-Investigation-State-Architecture.md`, `docs/00-ssot/SSOT-Index.md`).
2. **No frontend runtime files changed:** **PASS**.
3. **No backend runtime files changed:** **PASS**.
4. **No database scripts changed:** **PASS**.
5. **New SSOT alignment with existing terminology:** **PASS** (Strong alignment with Samuel Tupleton mentor persona, SSOT-Architecture layering, and SQL safety terminology).
6. **Deterministic gameplay authority explicit:** **PASS** (Explicitly assigns authority to backend and database).
7. **Backend validation authority explicit:** **PASS** (Safety, execution, and verification confirmed as backend-owned).
8. **Frontend presentation responsibilities explicit:** **PASS** (Frontend limited to rendering and collecting input).
9. **Learner agency preserved:** **PASS** (Explicit prohibition on automated reasoning or inference).
10. **Spoiler-safe principles explicit:** **PASS** (Detailed guidance on scaffolded reasoning vs. direct disclosure).
11. **No speculative runtime AI behavior:** **PASS** (Explicitly excluded with a clear rationale).
12. **No hidden automatic gameplay advancement:** **PASS** (Prohibited in "Prohibited Automation" section).
13. **Persistence expectations architectural only:** **PASS** (Correctly defines current in-memory state and prohibits speculative invention).
14. **SSOT-Index.md correctly references the new SSOT:** **PASS**.

---

### Key Findings & Observations

* **State Ownership Clarity:** The implementation uses a high-signal "State Ownership Table" that precisely maps state categories (Evidence, Schema, Milestones, Notebook, etc.) to their respective owners and authority bases.
* **Thread Lifecycle:** The investigation thread model is well-defined with distinct lifecycle states (Unresolved, Active, Resolved, Blocked) and lead categories, providing a solid foundation for future implementation.
* **Operational Integrity:** The SSOT successfully bridges the gap between the current "approximate" frontend-only progression and the intended future deterministic backend progression without inventing unimplemented features.
* **Governance:** The document includes comprehensive cross-references to other SSOTs, ensuring a cohesive documentation package.

### Flags

* **None.** The implementation adheres strictly to the constraints and does not drift into speculative systems or AI implications.

---

## Final Decision

Approved. The investigation gameplay state architecture SSOT is created and registered. `SSOT-Investigation-State-Architecture.md` defines investigation state ownership boundaries, deterministic gameplay principles, investigation thread lifecycle model, state transition authority, frontend and backend gameplay responsibilities, persistence expectations, spoiler-safe investigation principles, and future expansion boundaries. All 14 Gemini audit checks passed with no flags, no terminology drift, and no speculative systems introduced. `SSOT-Index.md` updated to include the new document.
