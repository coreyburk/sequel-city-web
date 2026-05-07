# create-user-journey-and-investigation-flow-documentation


## Objective

Create the first formal user journey and investigation flow documentation package for Sequel City Web Detective.

This WP establishes:

- learner investigation flow documentation
- end-to-end user journey mapping
- frontend interaction flow documentation
- deterministic learning loop documentation
- evidence discovery workflow documentation
- educational UX intent documentation

The goal is to formally document how a learner moves through the current deterministic investigation experience without introducing speculative gameplay systems or runtime AI behavior.

---

## Scope

Create a new user journey documentation section:

docs/10-user-journey/

Document only currently implemented and explicitly planned deterministic investigation flow assumptions already supported by the SSOT and architecture packages.

This WP is documentation-only.

No runtime behavior changes.
No frontend changes.
No backend changes.
No database changes.

---

## Files Allowed to Change

Allowed:

- docs/10-user-journey/README.md
- docs/10-user-journey/investigation-overview.md
- docs/10-user-journey/learner-workflow.md
- docs/10-user-journey/query-feedback-loop.md
- docs/10-user-journey/evidence-discovery-model.md
- docs/10-user-journey/deterministic-learning-model.md
- docs/10-user-journey/frontend-interaction-flow.md
- docs/10-user-journey/spoiler-safe-guidance-principles.md
- docs/10-user-journey/diagrams/investigation-flow.md
- docs/10-user-journey/diagrams/query-feedback-sequence.md
- docs/README.md

Do Not Modify:

- apps/api/**
- apps/web/**
- docs/00-ssot/**
- docs/06-architecture/**
- docs/07-api-contracts/**
- docs/08-database/**
- docs/09-release-readiness/**
- database/**
- package.json files
- build configuration
- runner scripts

---

## Constraints

- Documentation only
- Reflect deterministic investigation behavior only
- No speculative gameplay systems
- No runtime AI behavior
- No invented progression systems
- No invented scoring systems
- No invented multiplayer behavior
- Preserve spoiler-safe educational framing
- Preserve deterministic architecture terminology
- Preserve backend authority terminology

Formatting constraints:

- Use plain markdown only
- Avoid nested code fences
- Avoid escaped quote sequences
- Avoid malformed markdown tables
- Avoid hidden HTML fragments

Diagram constraints:

- Use Mermaid only
- Keep diagrams lightweight and readable
- Avoid deeply nested graphs
- Keep flows simple and deterministic

---

## Required Behavior

The user journey package must document the intended deterministic investigation experience for learners using the currently implemented runtime architecture.

### 1. Investigation Overview

Document the high-level learner experience:

- entering the investigation
- exploring schema information
- writing SQL queries
- reviewing deterministic results
- discovering evidence patterns
- refining investigation hypotheses

Explicitly state:

- database results are authoritative
- backend validation is authoritative
- frontend presents deterministic feedback only

---

### 2. Learner Workflow

Document the current investigation workflow:

- startup
- schema exploration
- SQL query submission
- result interpretation
- investigation iteration

Clarify:

- learner controls investigation pacing
- backend validates all execution
- no automated answer generation exists

---

### 3. Query Feedback Loop

Document the deterministic query loop:

Learner Input
→ Backend Validation
→ Safe Execution
→ Normalized Results
→ Frontend Presentation
→ Learner Interpretation

Include:

- blocked query behavior
- deterministic error responses
- iterative learning behavior

---

### 4. Evidence Discovery Model

Document the evidence-oriented educational workflow.

Include concepts such as:

- relational traversal
- filtering and narrowing
- cross-table investigation
- hypothesis refinement
- evidence correlation

Keep descriptions spoiler-safe.

---

### 5. Deterministic Learning Model

Document why the project uses deterministic systems rather than runtime AI guidance.

Include:

- reproducibility
- fairness
- predictable educational outcomes
- backend authority
- stable query feedback

Do not position runtime AI as planned behavior.

---

### 6. Frontend Interaction Flow

Document frontend responsibilities during investigation flow.

Include:

- rendering schema data
- collecting learner input
- displaying deterministic results
- presenting validation feedback
- preserving backend authority

Explicitly prohibit:

- frontend correctness authority
- frontend schema invention
- frontend SQL safety authority

---

### 7. Spoiler-Safe Guidance Principles

Document educational guidance principles:

- preserve discovery
- avoid revealing solutions
- encourage relational reasoning
- encourage iterative investigation
- preserve learner ownership of conclusions

---

### 8. Investigation Diagrams

Create lightweight Mermaid diagrams for:

- overall investigation flow
- query feedback sequence

Keep diagrams VSCode-friendly and readable.

---

### 9. Documentation Navigation

Update docs/README.md to include the user journey package.

---

## Acceptance Criteria

- docs/10-user-journey exists
- investigation workflow documented
- deterministic query loop documented
- evidence discovery workflow documented
- frontend interaction responsibilities documented
- spoiler-safe guidance principles documented
- Mermaid diagrams render correctly
- terminology aligns with SSOT and architecture docs
- no speculative gameplay systems introduced
- no runtime AI behavior documented as implemented
- no runtime source files modified

---

## Codex Prompt

You are implementing WP-032 for the Sequel City Web Detective project.

Objective:
Create the user journey and investigation flow documentation package under docs/10-user-journey.

Important:

- Documentation only
- No runtime code changes
- No frontend/backend modifications
- No database modifications
- Reflect deterministic investigation behavior only
- No speculative gameplay systems
- No runtime AI behavior

Before editing:

1. Read docs/00-ssot.
2. Read docs/06-architecture.
3. Read docs/07-api-contracts.
4. Read docs/08-database.
5. Read docs/09-release-readiness.
6. Review current frontend/backend interaction assumptions from the repository.

Create:

- docs/10-user-journey/README.md
- docs/10-user-journey/investigation-overview.md
- docs/10-user-journey/learner-workflow.md
- docs/10-user-journey/query-feedback-loop.md
- docs/10-user-journey/evidence-discovery-model.md
- docs/10-user-journey/deterministic-learning-model.md
- docs/10-user-journey/frontend-interaction-flow.md
- docs/10-user-journey/spoiler-safe-guidance-principles.md
- docs/10-user-journey/diagrams/investigation-flow.md
- docs/10-user-journey/diagrams/query-feedback-sequence.md

Update:

- docs/README.md

Required alignment:

- deterministic backend authority
- database-backed evidence authority
- frontend presentation-only responsibilities
- read-only SQL execution
- local-first runtime
- spoiler-safe educational framing

Do not:

- invent scoring systems
- invent achievements
- invent multiplayer systems
- invent runtime AI guidance
- invent hidden gameplay mechanics
- reveal hidden suspect identities
- present future ideas as implemented behavior

Diagram requirements:

- Mermaid only
- Lightweight
- Readable in VSCode markdown preview
- Avoid excessive complexity

Formatting requirements:

- Use simple markdown only
- Avoid nested code fences
- Avoid escaped quotes
- Avoid malformed markdown tables
- Avoid hidden HTML

Keep the documentation educational, deterministic, concise, and spoiler-safe.

---

## Gemini Audit Prompt

Audit WP-032 user journey documentation implementation.

Verify:

1. Only approved documentation files were modified.
2. No frontend runtime files changed.
3. No backend runtime files changed.
4. No database scripts changed.
5. Investigation flow documentation aligns with SSOT and architecture packages.
6. Deterministic backend authority remains explicit.
7. Frontend presentation-only responsibility remains explicit.
8. Read-only SQL execution guarantees remain explicit.
9. Spoiler-safe guidance principles are preserved.
10. No speculative gameplay systems were introduced.
11. No hidden suspect identities or solution disclosures appear.
12. No runtime AI behavior was documented as implemented.
13. Mermaid diagrams remain lightweight and readable.

Specifically validate:

- learner workflow accuracy
- query feedback loop accuracy
- frontend interaction boundaries
- evidence discovery framing
- deterministic learning rationale
- spoiler-safe examples

Flag:

- speculative gameplay mechanics
- invented progression systems
- hidden solution disclosure
- frontend authority drift
- runtime AI implication
- malformed Mermaid syntax
- contradictory educational guidance
- terminology drift from SSOT package

---

## Codex Results

Created the WP-032 documentation package under [docs/10-user-journey/README.md](/D:/GitHub-Repos/SequelCityWeb/docs/10-user-journey/README.md) and updated [docs/README.md](/D:/GitHub-Repos/SequelCityWeb/docs/README.md). The new docs cover the investigation overview, learner workflow, deterministic query loop, evidence discovery model, deterministic learning rationale, frontend presentation-only boundaries, spoiler-safe guidance, and two lightweight Mermaid diagrams.

The package stays aligned with SSOT and the implemented runtime: backend authority is explicit, evidence remains database-backed, SQL execution is read-only, the frontend is presentation-only, and non-implemented features like suspect verification, notebook persistence, case progression services, and runtime AI are called out as not currently active behavior. Verification pass completed with only the approved documentation files changed; no runtime code or database files were modified.

## Gemini Audit Results

The audit of Work Package 032 (User Journey Documentation) is complete. The implementation rigorously adheres to the architectural boundaries, deterministic authority model, and spoiler-safe principles defined in the project's Single Source of Truth (SSOT).

### Audit Summary

1.  **File Integrity:** Verified that only approved documentation files in `docs/10-user-journey/` and `docs/README.md` were modified. 
2.  **Runtime Protection:** Confirmed that no frontend code (`apps/web/**`), backend code (`apps/api/**`), or database scripts (`database/**`) were altered.
3.  **Architectural Alignment:** The documentation correctly identifies the **Backend** as the authority for SQL safety, execution, and normalization, and the **Database** as the authority for evidence truth.
4.  **Frontend Boundary:** The **Frontend** is explicitly documented as a presentation-only layer responsible for transport and rendering, with no authority over SQL safety or evidence interpretation.
5.  **Spoiler Safety:** No hidden suspect identities, solution disclosures, or "answer-only" query paths were introduced. Guidance principles prioritize relational discovery over disclosure.
6.  **Deterministic Focus:** The documents explicitly state that no runtime AI behavior or speculative gameplay mechanics (scoring, achievements, multiplayer) are implemented.
7.  **Visual Clarity:** Mermaid diagrams for the investigation flow and query feedback sequence are lightweight, accurate, and render correctly.

### Specific Validations

-   **Learner Workflow:** Accurately reflects the current startup, schema-review, and query-iteration cycle.
-   **Query Feedback Loop:** Correctly maps the path from SQL input to normalized response, including blocked and failure states.
-   **Evidence discovery:** Framed as a structural traversal of relational data rather than a narrative search for hidden flags.
-   **Deterministic Rationale:** Clearly explains why the local-first, backend-led model provides a stable educational experience.

The WP-032 documentation package is verified as complete, accurate, and safe for inclusion in the project.

---
**Audit Status:** PASSED
**Files Verified:** 11 documentation files
**Regressions:** None detected
Warning: 256-color support not detected. Using a terminal with at least 256-color support is recommended for a better visual experience.
Ripgrep is not available. Falling back to GrepTool.

## Final Decision

Pending review and approval.


