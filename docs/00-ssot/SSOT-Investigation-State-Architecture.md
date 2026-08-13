# SSOT Investigation State Architecture

## Principle

Investigation state ownership must be deterministic, explicitly assigned, and aligned with the layered authority model. The database and backend are authoritative for evidence and verification. The frontend is responsible for presentation and learner interaction only. Learner reasoning is owned by the learner and must not be replaced by automated systems.

## Document Scope

This document owns investigation state ownership boundaries, gameplay state transition authority, investigation thread concepts, mentor guidance authority, notebook authority, evidence ownership, persistence expectations, and future expansion boundaries.

Runtime layering and technology stack are owned by `SSOT-Architecture.md`. Investigation milestones and evidence detection triggers are owned by `SSOT-Case-Progression.md`. SQL safety rules are owned by `SSOT-SQL-Safety-Rules.md`. UI screen responsibilities are owned by `SSOT-UI-UX-Experience.md`. AI advisory limits are owned by `SSOT-AI-Agent-Boundaries.md`.

---

## State Ownership Model

The investigation experience involves several categories of state. Each category has a defined owner.

### State Ownership Table

| State Category | Owner | Authority Basis |
|---|---|---|
| Evidence data | SQL Server database | Authoritative data source |
| Schema metadata | Database via backend | Catalog query |
| SQL safety decisions | Backend safety service | Deterministic rule set |
| Query execution results | Backend execution service | Read-only database access |
| Suspect verification verdicts | Database via backend trigger | Solution table and trigger |
| Query history records | Backend in-memory service | Execution outcome recording |
| Milestone progression | Backend progression service (when implemented) | Deterministic result-pattern evaluation |
| Case content definition | Authored case data | Static per-case authored record |
| Investigation step progress | Frontend runtime state | Learner-driven interaction |
| Notebook entries | Learner via frontend | Learner-recorded content |
| Pinned facts | Learner via frontend | Learner-selected evidence |
| Mentor guidance display | Frontend presentation | Deterministic authored copy |
| Transient UI display state | Frontend | Rendering only |

### Investigation Progression State

Investigation progression state tracks which milestones have been reached and which investigation steps are active. When implemented as a backend service, this state is deterministic and driven only by verified query results or deterministic result-pattern checks. The frontend may display progression state returned by the backend, but it must not decide progression locally.

The current runtime maintains active step progress in the frontend as authored case content navigation. This is a frontend presentation concern. Full deterministic backend progression is defined in `SSOT-Case-Progression.md` and is a planned future implementation.

### Evidence State

Evidence state is the set of query results and database-backed facts the learner has retrieved. Evidence is authoritative only when it comes from actual query results returned by the backend from the local database. Evidence state includes the returned rows, columns, and row counts from approved read-only queries.

The frontend may display evidence returned by the backend. The frontend must not invent evidence, infer evidence from UI state alone, or substitute authored hints for actual database results.

### Notebook State

Notebook state consists of learner-recorded entries and pinned facts. The learner owns the content of their notebook. Notebook entries are learner-created annotations and observations. Pinned facts are learner-selected evidence highlights.

Notebook state is a learner-authored record, not an authoritative evidence source. A notebook entry does not replace database-backed evidence for progression or verification decisions. Notebook content must not be treated as correctness proof.

In the current runtime, notebook state is managed in frontend memory. Future implementations may persist notebook state across sessions, but such persistence infrastructure must be scoped through a dedicated work package.

### Mentor Guidance State

Mentor guidance is authored, deterministic, and case-specific. The single authorized mentor voice is Samuel Tupleton. Samuel's guidance is triggered by deterministic case state transitions, not by runtime AI inference.

Mentor guidance state includes:

- the active guidance message shown to the learner
- the current comprehension check or reasoning prompt
- the response to a learner's logged clue or check-in answer

Mentor guidance must not reveal hidden suspect identities, must not name solution paths before they are discovered, and must not replace learner reasoning. Future optional advisory AI may augment mentor framing, but it must not override the authored mentor voice or determine correctness.

### Thread State

An investigation thread represents a line of inquiry the learner is pursuing. A thread connects an evidence lead to a possible conclusion through a traceable sequence of queries and results.

Thread state categories:

| State | Meaning |
|---|---|
| Unresolved | Lead identified but not yet pursued by the learner |
| Active | Learner is currently following this lead |
| Resolved | Learner followed the lead to a confirmed evidence outcome |
| Blocked | Lead reached a dead end or was ruled out through evidence |

Thread state transitions are learner-driven and evidence-driven. The system does not automatically advance thread state through hidden inference. Thread state must not be used to disclose hidden suspects before the learner has retrieved supporting evidence.

### Milestone State

Milestone state tracks which investigation milestones have been reached. The milestone model is defined in `SSOT-Case-Progression.md`. Milestones are triggered only by valid progression sources: verified query results, deterministic result-pattern checks, explicit suspect submissions, or database-backed solution verdicts.

Milestone state is a backend responsibility when implemented. In the current runtime, milestone transitions are approximated through frontend case step navigation. Full backend milestone authority is a future scoped implementation.

### Pinned Fact State

Pinned facts are evidence highlights the learner has explicitly saved. Pinned facts are learner-selected and frontend-managed. They represent the learner's working evidence set and do not have backend authority for progression or verification.

Future query-building assistance may use pinned facts as convenience hints, but pinned fact content must not become an automatic solver or an authoritative evidence claim.

### Query History State

Query history is maintained by the backend in-memory service. It records submitted query text, outcome, row count, execution time, error message, record ID, and timestamp. Query history is backend-owned and readable by the frontend through the history endpoint. The frontend does not maintain its own authoritative execution log.

---

## Deterministic Gameplay Principles

### Deterministic Progression

Investigation advancement must be explainable, reproducible, and grounded in real database evidence. The same set of queries against the same local database must always produce the same evidence availability. Progression must not depend on timing, non-deterministic AI inference, or UI-only state changes.

### Backend Authority Requirements

The backend is authoritative for:

- whether a query is safe to execute
- whether a query execution succeeded or failed
- what evidence rows were returned
- what the database verdict is for a submitted suspect

No frontend logic may override these authorities. Frontend components must treat backend responses as definitive for the purposes of evidence and verification.

### Frontend Presentation Limitations

The frontend is responsible for displaying investigation state, collecting learner input, and rendering backend-provided responses. The frontend must not:

- decide whether a query is safe
- execute SQL against the database directly
- determine whether a suspect is correct
- advance milestone state without backend confirmation
- infer evidence from authored content alone
- present hidden solution information

### Educational Fairness Requirements

All learners work against the same local database, the same backend safety boundary, and the same authored case content. Investigation advancement must not rely on privileged information the learner has not yet discovered through their own queries. The system must not reward guessing, circumvention of SQL reasoning, or UI-only shortcut paths.

### Why Runtime AI Is Excluded From Gameplay Authority

Runtime AI is excluded from initial gameplay authority because:

- AI inference is non-deterministic and cannot guarantee reproducible evidence authority
- AI output cannot be held to the same spoiler-safe standard as authored content
- AI advisory behavior risks leaking hidden solution information
- correctness must remain database-backed for educational fairness
- the local-first runtime must be fully functional without external services

Any future optional advisory AI must remain advisory only and must not determine progression, verify correctness, or name hidden suspects.

---

## Investigation Thread Model

An investigation thread is the architectural unit representing a coherent line of inquiry within the case. Threads are defined per case as authored content. The learner follows threads by running queries, interpreting results, and logging evidence.

### Thread Lifecycle

A thread begins as Unresolved. The learner activates a thread by pursuing the associated evidence lead through queries. The thread becomes Resolved when the learner has retrieved confirming evidence. The thread becomes Blocked if the lead is ruled out or the learner has confirmed a dead end.

Threads do not advance automatically. The system may present the next relevant thread direction based on completed milestone state, but thread advancement is always initiated by learner action.

### Lead Categories

| Lead Type | Evidence Source |
|---|---|
| Scene report lead | CrimeSceneReport query results |
| Witness lead | InterviewLog query results |
| Physical evidence lead | DriversLicense, Employment, or physical attribute query results |
| Membership lead | FitNFlabClub or FitNFlabClubCheckIn query results |
| Event lead | EventSchedule or EventRegistration query results |
| Suspect lead | Cross-table correlation results pointing to a candidate person |
| Mastermind lead | Interview evidence retrieved after murderer identification |

These lead categories exist in the data model. The system must never name the specific persons, identifiers, or values associated with hidden suspects when presenting thread direction.

### Learner-Driven Thread Progression

Thread progression is always initiated by learner action:

- the learner chooses which query to run next
- the learner decides what the results mean
- the learner logs evidence they consider significant
- the learner selects a suspect for verification

The system supports this reasoning loop by presenting relevant schema hints, safety feedback, and mentor guidance. The system does not complete the reasoning for the learner.

---

## State Transition Authority

### Valid Transition Triggers

| Transition | Valid Trigger |
|---|---|
| Clue discovered | Backend query returns rows matching a result-pattern check |
| Clue logged | Learner explicitly logs evidence via notebook or clue action |
| Mentor check-in unlocked | Reaching a defined case milestone |
| Milestone advanced | Deterministic backend progression service evaluation |
| Suspect submitted | Learner explicit submit action to verification endpoint |
| Verification verdict received | Database trigger response via backend |
| Case closed | Learner explicit case conclusion action after verification |
| Thread resolved | Learner explicitly marks lead resolved, or milestone confirms resolution |
| Pinned fact added | Learner explicit pin action |
| Notebook entry created | Learner explicit entry action |

### Learner-Controlled Actions

The following state changes are always learner-initiated:

- submitting a SQL query
- logging a clue or evidence observation
- answering a comprehension check
- pinning a fact
- submitting a suspect for verification
- advancing to the next investigation step

The system may suggest the next direction, but it must not execute these actions automatically.

### System-Controlled Actions

The following state changes are system-controlled based on deterministic evaluation:

- recording query execution outcome in history
- returning safety verdict for a submitted query
- returning execution result rows from the database
- returning database-backed verification verdict
- displaying authored mentor guidance when a milestone condition is met

### Prohibited Automation

The system must not:

- automatically resolve a suspect without learner submission
- automatically advance case milestones without a valid trigger
- infer thread resolution from non-evidence signals
- replace learner comprehension checks with automatic pass-through
- use runtime AI to determine evidence significance
- use frontend UI state alone to advance deterministic progression
- automatically log clues without learner action
- automatically pin facts without learner selection

---

## Frontend vs Backend Gameplay Responsibilities

### Frontend Responsibilities

The frontend is responsible for:

- rendering the investigation workspace, case briefing, schema explorer, query editor, results display, and evidence board
- collecting SQL text from the learner and submitting it to the backend
- collecting suspect names and submitting them to the backend verification endpoint
- displaying backend-provided query results, safety messages, and execution feedback
- displaying backend-provided verification verdicts
- managing learner notebook entries and pinned facts in local state
- presenting authored mentor guidance based on current case step
- rendering progress indicators tied to current step state
- managing transient UI display state such as open panels, active tabs, and drawer visibility

The frontend does not decide correctness, execute SQL locally, infer schema, or determine case advancement.

### Backend Responsibilities

The backend is responsible for:

- validating SQL safety before any database access
- executing approved read-only SQL against the local database
- normalizing query results for consistent frontend consumption
- loading schema metadata from database catalogs
- reporting database and health diagnostics
- recording query history in the backend in-memory service
- verifying submitted suspects through the database-backed Solution trigger
- enforcing all case-relevant read-only execution boundaries

The backend does not use runtime AI, expose general mutation SQL execution, manage frontend display state, or manage learner notebook content.

### Prohibited Frontend Behaviors

The frontend must not:

- decide whether a SQL query is safe to execute
- execute SQL against any database directly
- determine whether a suspect verification is correct
- advance deterministic milestone state without backend confirmation
- display invented schema or invented evidence
- present hidden solution information before it has been earned through evidence
- claim correctness authority on behalf of the database
- maintain an authoritative execution log independent of the backend history service

---

## Persistence Expectations

### Current Persistence State

The current runtime has case-id keyed local browser persistence for learner-owned frontend progress. The only currently playable and restorable case is `case-004`; locked and future case ids must not hydrate or write investigation progress. The student workspace stores convenience state in browser `localStorage`, including notebook entries, pinned fact page placement, current student view, draft query text, Samuel step, completed frontend milestone display state, pending evidence step, earned check-in IDs, and visible suspect-theory display state.

The local storage envelope is versioned and includes the active case id plus the persisted frontend state payload. Current payload fields are common learner-owned progress concepts, but validation remains Case 004-specific because the current implementation validates against Case 004 milestones, views, pending evidence steps, and suspect-verification response shape. Future playable cases must define their own storage validation contract before their progress can be restored.

This frontend storage is not authoritative evidence, verification, backend history, or production persistence. It does not execute SQL, verify suspects, advance new milestones by itself, sync across devices, create accounts, or provide multi-user isolation.

Query history is still in-memory in the backend service and is lost when the backend process restarts. No database, file system, cloud, account, or authenticated storage is used for gameplay persistence in the current implementation.

Malformed, unsupported-version, wrong-case, locked-case, or future-case browser storage is ignored and the app falls back to authored defaults. The active Case 004 investigation also exposes a user-facing reset/clear-progress affordance. That control is Case 004-only, requires explicit confirmation, clears only learner-owned Case 004 browser progress (`sequel-city.case-004.student-state.v1` and `sequel-city.case-004.threads.v1`), and resets the active in-memory student progress and investigation threads to authored defaults. It does not clear backend query history, database state, account/cloud data, browser history state, case-library metadata, locked/future case data, or unrelated localStorage keys. Future playable cases still require their own scoped case-module and storage contract before reset/clear-progress behavior can be generalized.

### Playable Case Module Boundary

A case becomes playable only when it has an explicit playable-case module contract. The current released implementation registers only `case-004` as the normal playable case. App entry and investigation rendering consume this playable-case module registry; case-library `isUnlocked` metadata alone is not sufficient to enter, restore, or render an investigation. Locked and future case library entries are presentation metadata only until a scoped work package defines their playable module.

Future cases must also pass the authoring contract defined in `SSOT-Case-Authoring.md` before release or migration work. That contract is a production validation surface for case identity, dossier metadata, evidence requirements, SQL milestones, state categories, persistence/reset semantics, thread and guidance ownership, release gates, and spoiler boundaries. It does not make authored metadata authoritative at runtime; database-backed evidence, SQL safety, query execution, deterministic result-pattern checks, and suspect verification remain backend/database responsibilities.

Case 001 (`The Clocktower Poisoning`) has a dev/test-only playable skeleton path behind the explicit `VITE_ENABLE_CASE_001_PLAYABLE_SKELETON === "true"` gate. With the gate disabled, Case 001 remains locked, its landing action remains `Archive Locked`, browser-history restoration cannot render its investigation view, and no Case 001 progress storage is written. With the gate enabled, Case 001 may render only a minimal skeleton surface with non-persistent, non-spoiler ceremony timeline, record-comparison, and clue-narrowing checks plus a derived checkpoint summary over those three selections. These slices let students compare public ceremony timing and crowd claims against record-backed timing, then prioritize an early record-backed clue type and review the current selections together, but they do not implement full gameplay, persistence, investigation threads, SQL progression, evidence logging, suspect verification, reset behavior, or release availability. Case 001 owns its current skeleton state contract in `studentCase001.ts`: the state is versioned, defaults to no selected timeline, record-comparison, or clue-narrowing option, normalizes unknown or malformed values back to the default, and is consumed only as component-memory state by the skeleton view. The checkpoint is derived from those existing component-memory selections and does not add a persisted state field. Case 001 also declares a first SQL milestone boundary, `case-001-clocktower-report-located`, and now has an unwired deterministic backend service-level result-pattern validator that can recognize the public clocktower `CrimeSceneReport` row from normalized backend-approved read-only SQL results. A gated backend integration-boundary consumer can call that validator only when `case-001` and an explicit Case 001 skeleton-gate input are provided, and it returns non-spoiler match metadata with `milestoneAdvanced: false`. The validator and gated boundary consumer are backend contract surfaces only: they are not connected to API routes, query execution, query history, frontend rendering, milestone state, persistence, evidence logging, investigation threads, suspect verification, or release behavior. The boundary, authoring definition, fixture, validator, and gated consumer do not render Case 001 Query Lab, execute SQL, advance milestones, persist progress, reset progress, log clues, create evidence-board entries, create investigation threads, verify suspects, add runtime database mutation behavior, or release the case. This state contract does not authorize localStorage, frontend UI state, skeleton selections, prompt text, runtime AI output, free-text guesses, answer keys, restricted tables, suspect verification, account/cloud state, query-history state, thread state, notebook state, milestone state, clue-log state, or reset persistence as progression authority.

A playable-case module must identify:

- the case id and authored case-library metadata it owns
- the milestone id set and case-specific validation schema
- the local browser progress storage key strategy
- the persisted-state validator and default state factory
- the authored investigation-thread seed and thread-storage validation contract
- the mentor guidance and progression ownership notes for that case

Future cases must not be enabled for investigation entry, progress restoration, or thread persistence until those module fields exist and preserve the same authority boundaries described in this document. Adding a module does not make local storage authoritative; database-backed evidence, SQL safety, query execution, and suspect verification remain backend/database responsibilities.

### Architectural Expectations

When persistence is implemented, ownership boundaries must be preserved:

- query history persistence is a backend responsibility
- notebook entry persistence is a learner-owned record; the current implementation uses local browser storage only
- investigation milestone persistence is a backend responsibility when the deterministic progression service is implemented
- pinned fact persistence follows the same ownership model as notebook entries
- case step state persistence must remain aligned with deterministic backend milestone authority when implemented

Persistence must not change the authority model. Persisted state is still subject to the same ownership rules as in-memory state.

### Future Persistence Scope

Persistence infrastructure must not be invented speculatively. Any future persistence layer must be introduced through a scoped work package that defines the storage approach, authority boundaries, and spoiler-safe recovery behavior. No current work package authorizes a persistence implementation for investigation state.

---

## Spoiler-Safe Investigation Principles

### Guidance Rules

Guidance provided to the learner must:

- scaffold investigative reasoning without replacing it
- reference structural and relational facts rather than hidden answer values
- rely only on schema structure, backend rules, and already-returned learner-visible evidence
- use authored, deterministic content rather than runtime AI inference

Guidance must not:

- name hidden suspects, answer persons, or solution identifiers
- provide query paths that directly solve the case without learner reasoning
- imply the frontend has its own correctness authority
- invent data or relationships not present in the actual database
- use speculative runtime AI behavior as a guidance source

### What Guidance May Reference Safely

- table names and column names from the schema
- general query patterns such as JOIN, WHERE, or GROUP BY
- safety rules that explain why a query was blocked
- the category of evidence trail to follow (for example, a witness trail, a membership trail, or an event trail)
- the structure of the verification endpoint and what kind of name to submit
- already-returned learner-visible evidence from a prior query result

### What Guidance Must Never Reference

- the specific name, identifier, or attribute value of a hidden suspect
- rows that only appear in the answer key
- the internal contents of the Solution table
- direct confirmation of a guess before database verification
- answer paths that allow the learner to skip evidence reasoning

---

## Future Gameplay Expansion Boundaries

### Safe Expansion Categories

Future gameplay systems may include:

- additional cases with their own authored content, milestones, and thread definitions
- reusable case-authoring definitions that pass the contract in `SSOT-Case-Authoring.md`
- additional evidence lead categories that remain within the database schema model
- optional advisory AI roles scoped within the boundaries defined in `SSOT-AI-Agent-Boundaries.md`
- notebook and thread persistence implemented through a scoped work package
- a deterministic case progression service implementing the milestone model from `SSOT-Case-Progression.md`
- detective rank and career progression systems following the design defined in `docs/14-progression-design/`
- enhanced mentor guidance surfaces that remain authored and spoiler-safe
- multi-case navigation and case selection for future case library growth

### Required Preservation Rules

All future gameplay systems must preserve:

- deterministic state transition authority as defined in this document
- backend authority for evidence, execution, and verification
- frontend presentation-only responsibility for gameplay state
- learner ownership of reasoning and conclusion
- spoiler-safe investigation principles
- local-first runtime assumptions with no external service dependency
- alignment with the existing SSOT package authority boundaries

Future systems must not introduce:

- runtime AI decision authority over gameplay progression
- frontend correctness authority over evidence or verification
- hidden automatic progression not triggered by learner action
- multiplayer or shared investigation state
- cloud gameplay infrastructure
- persistence systems outside a scoped work package

---

## Governance Cross-References

- Investigation milestones and evidence detection triggers are defined in `SSOT-Case-Progression.md`.
- Runtime architecture layers and technology stack are defined in `SSOT-Architecture.md`.
- SQL safety enforcement and blocked statement families are defined in `SSOT-SQL-Safety-Rules.md`.
- Database tables, relationships, and spoiler-control rules are defined in `SSOT-Database-Schema.md`.
- UI screen responsibilities and learner workflow are defined in `SSOT-UI-UX-Experience.md`.
- Future optional AI advisory roles and all AI prohibition rules are defined in `SSOT-AI-Agent-Boundaries.md`.
- Detective rank, reward tiers, and progression terminology are defined in `docs/14-progression-design/Detective-Rank-and-Reward-System-Guide.md`.
