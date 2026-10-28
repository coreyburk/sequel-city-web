# SSOT Case Authoring

## Principle

Playable cases must be produced from a repeatable authored contract before they are released. The contract is a pre-release validation surface for case content and ownership boundaries. It is not runtime authority by itself and does not replace backend-approved SQL results, deterministic result-pattern checks, SQL safety, database evidence, or suspect verification.

## Document Scope

This document owns the scalable case-production contract for future Sequel City Web Detective cases. Runtime layering is owned by `SSOT-Architecture.md`. Database tables and spoiler-control rules are owned by `SSOT-Database-Schema.md`. Progression authority is owned by `SSOT-Case-Progression.md`. Investigation state ownership is owned by `SSOT-Investigation-State-Architecture.md`. Case difficulty tiers, Foundations mapping, and tier-axis compliance are owned by `SSOT-Case-Tier-System.md`.

## Authoring Contract

Every future playable case must define these authored sections before release work begins:

| Section | Purpose |
|---|---|
| Case identity | Stable case id and public case number/name |
| Tier classification | Declared tier or Foundations/on-ramp label, with evidence for story steps, SQL scope, people/entities, clues/evidence, and interpretation complexity |
| Release status | Pedagogical/public availability and review gate; persisted runtime ReleaseStatus is draft, released or retired |
| Public dossier | Non-spoiler metadata used by the case library and briefing |
| Evidence requirements | Database table families the case depends on |
| SQL milestones | Learner objectives, table-family references, and deterministic validation ownership |
| Completion contract | Completion criteria, completion signal, terminal SQL result evidence, and whether the case has one deterministic conclusion or an auditable Tier 5 evaluation framework |
| State contract | Common learner-owned state and case-specific learner-owned state |
| Persistence/reset semantics | Storage strategy, version expectations, and clear-progress behavior |
| Investigation threads | Authored thread ownership and seed responsibility |
| Guidance | Authored Samuel Tupleton guidance ownership |
| Spoiler boundary | Explicit answer-key, restricted-data, and hidden-solution exclusions |

## Full-Case Plan

The reusable authoring contract is necessary but not sufficient for building a complete playable case. Before broad implementation of a new playable case, create a full case plan artifact under `docs/15-case-plans/` that defines the intended end state, declared tier, tier-axis budget, evidence path, SQL milestones, expected query shapes, assessed SQL concepts, fixture/data needs, distractor/red-herring rules, complexity budget, completion criteria, completion signal, guidance pacing, persistence/reset expectations, suspect verification expectations, automated playthrough criteria, and future implementation sequence.

A full case plan is still authoring documentation. It does not release a case, create database rows, expose answer keys, render Query Lab, advance milestones, persist progress, verify suspects, or become runtime authority. Runtime progression must still be implemented later through backend-approved read-only SQL results and deterministic validators.

Use `docs/15-case-plans/CASE-AUTHORING-TEMPLATE.md` for new case plans and `docs/15-case-plans/CASE-VETTING-CHECKLIST.md` before implementation or release review.

Use `docs/05-development-workflow/Case-Production-Workflow.md` for the development workflow that turns those artifacts into low-churn production steps, Tier 1/Foundations shaping decisions, implementation bundle sizing, validation selection, audit, and closeout.

## Production Sequence

Future cases should be built in production-sized packages rather than isolated skeleton polish:

1. Fill the case-authoring contract.
2. Create a full case plan that defines the complete playable path, declared tier, five-axis tier compliance, and completion contract.
3. Inventory existing relational scaffolding before authoring case data.
4. Add database-backed evidence data in coherent milestone bundles through the fresh-build creation/seed scripts.
5. Add deterministic result-pattern validation for those milestones.
6. Publish reviewed versioned SQL records and discover them through the existing shared Query Lab; no compiled case registration or new React case page is required.
7. Reuse owned, version-pinned attempts/workspaces and verify fresh/archive/resume/delete behavior without importing local proof flags.
8. Add investigation threads, evidence-board behavior, suspect verification, database rebuild/version enforcement, and release unlock through separate scoped packages.

Each package must remain independently auditable. To reduce churn, implementation packages should follow the tier-system bundle guidance: Foundations and Tier 1 may use whole-case or large case-slice packages when practical, Tiers 2 and 3 should bundle two to three coherent story steps when possible, and Tiers 4 and 5 should bundle by investigation thread or evidence web rather than single-row polish. A filled authoring contract does not release a case, render Query Lab, create database rows, advance milestones, persist progress, or expose suspect verification.

Case 001 v3 has a complete six-phase introductory evidence chain, described below and in its case plan. Earlier three-step evidence-review releases remain compatibility-only content outside fresh bootstrap. Frontend state is presentation convenience; server-validated evidence remains progression authority.

## Case Data Authoring

Existing seed data may provide useful relational scaffolding, but it must not be treated as already containing coherent mystery story threads. Case authors should reuse existing `PersonsOfInterest`, `DriversLicense`, `Employment`, `EventSchedule`, and `EventRegistration` rows when their relationships support the planned case fairly. Story-bearing `CrimeSceneReport` and `InterviewLog` content should be authored, replaced, or modified as needed so the mystery path is intentional rather than accidental.

Future case data packages must document which rows are reused unchanged, modified for story fit, newly inserted, or avoided. They must preserve referential integrity, avoid breaking released Case 004 behavior, and avoid relying on random coincidental data as clue logic.

Author production data/content through reviewed authoritative creation/seed/FK coverage. Supported additive setup retains a verified backup and preserves compatible content, evidence and attempts. Unknown or incompatible databases report setup required; no automatic reset is allowed. A destructive rebuild requires separate explicit human authorization and recovery preparation. Notes/drafts and version-pinned SQL proof are protected runtime state, not disposable browser convenience.

## Progression Authority

SQL milestones must use backend-approved read-only SQL results and deterministic backend/result-pattern checks. The following are never valid SQL progression authorities:

- UI state
- skeleton selections
- localStorage
- AI output
- prompt text
- free-text guesses

Every SQL milestone must reference at least one declared evidence table family. A milestone cannot point to an undeclared table family, inferred schema, hidden answer-key row, or restricted data source.

Completion criteria and completion signals must be declared in the case plan before implementation. Tiers 1 through 4 require one deterministic completion outcome. Tier 5 may allow multiple defensible conclusions only when the case declares an auditable evaluation framework and required SQL result evidence.

## State And Persistence

The authoring contract must distinguish common learner-owned state from case-specific state. Common state includes concepts such as notebook entries, pinned facts, draft query text, and visible learner progress. Case-specific state includes authored milestone ids, case-specific thread ids, case-specific clue ids, and case-specific validation payloads.

Persistence and reset behavior must be declared before a case can be restored. Fresh archives previous owned attempts; explicit deletion removes only the selected owned attempt. Any legacy reset must affect only that case's learner workspace. Persistence must not clear or mutate backend query history, database state, account/cloud data, browser history state, case-library metadata, locked/future case data, or unrelated localStorage keys.

## Spoiler Boundary

Public case metadata, authored guidance, and pre-release validation examples must not include culprit identity, mastermind identity, answer-key rows, restricted table contents, hidden solution values, or direct solution query paths. Spoiler-bearing implementation details must stay behind scoped backend/database and verification packages that preserve the existing restricted-data boundaries.

## Current Runtime Status

The current runtime follows this contract for released Case 001 and Case 004. Case 001 begins at `CrimeType`, then requires the report and linked-interview result boundaries in order. Its authored guidance, deterministic validators, persistence revalidation, and browser coverage are part of the released onboarding path; suspect verification and answer-key work remain separate future scope.

## Case runtime transition contract (WP-286)

Status: WP-286 contracts and WP-289 protected runtime are delivered. WP-290 proves additional SQL authoring reuse without a new production release; its own audit/acceptance remain separate.

Shipped case guidance, whole-case objectives, step objectives and starters are authored in versioned base seed records. Allowlisted backend validators remain code. Released versions are immutable; validate prerequisites, supported handlers, starter safety and spoilers before release. A new evidence mechanism may require a new validator; data-only authoring is promised only for supported patterns.

Detailed interfaces and bootstrap responsibilities: [Case Runtime Contracts](../15-case-plans/CASE-RUNTIME-CONTRACTS.md). Case 004 gates: [Runtime Parity Matrix](../15-case-plans/CASE-004-RUNTIME-PARITY-MATRIX.md). Implementation sequence: WP-287 foundation, WP-288 Case 001, WP-289 Case 004, WP-290 authoring/cleanup. The protected runtime is current; older module/local-storage contracts describe retained Admin/recovery adapters only.


## Current SQL authoring formula (WP-290)

Use [Protected Runtime Case Authoring Guide](../15-case-plans/CASE-RUNTIME-AUTHORING-GUIDE.md) for concrete fields, test-only SQL example, publication/versioning and bootstrap safety. Metadata, wording, supported prerequisites and typed facts are authored SQL; registered backend handlers remain evidence authority. Current handler parameters are empty; arbitrary case semantics, OR/optional paths and new verification roles are not data-only capabilities. Human case/spoiler/tier review remains required alongside bounded automated validation.

Unused compiled released-case registration is retired; historical skeleton type/fixture exports, Admin diagnostics, local notes/draft recovery and independent pedagogical tests remain. Case 001 v3 provides complete introductory culprit resolution; Case 004 retains its complete sixteen-step controlled resolution.

## Case 001 complete Tier 1 contract (WP-300)

Case 001 v3 follows six natural phases: prove Murder in CrimeType, find the report, follow the steward account, identify the named Les in PersonsOfInterest, retrieve his own InterviewLog statement, then verify the supported culprit. Basic separate SELECT/WHERE queries span four tables; no joins or aggregation are required. The briefing supplies only city/date and incident context. The student connects selective poisoning, separate preparation/service, and Les's private drink mix. Three people and three narrative records remain within Tier 1. Archive exploration is supported without artificial inspection milestones.

Fresh builds contain one Case 001 incident report and two linked accounts. Immutable historical definitions and saved work remain preserved, but v1/v2 attempts are incompatible with this changed evidence. Legacy installations retain their old evidence-review case; no automatic live story rewrite or destructive rebuild is authorized.

The new case-specific evidence version is case001-complete-v5. A static, non-spoiler manifest validates the new evidence/answer/marker; a separate private Case 001 procedure checks only its single culprit. The old Case 004 verifier and both roles remain unchanged. The learner never reads answer tables or advances from SQL text, guessed names or client flags. Independent audit and human acceptance are still required before closeout.


## Shared clue, token and notebook pattern (WP-306)

Apply this pattern to future cases using the shared protected presentation. The rules below describe the intended authoring/review contract; runtime support remains limited to registered evidence handlers and supported SQL metadata.

### Clue logic and guidance

- Design backwards from the supported conclusion. For each transition, identify what evidence the student has, what it logically suggests investigating next, and which basic query can retrieve that next record. Require enough evidence to support the conclusion; identifying someone who served a drink is not by itself proof of poisoning.
- Use the number of steps the natural investigation needs. Tier 1 can provide a short introductory success without a fixed three-, five- or six-step limit, artificial inspection tasks, unnecessary joins or extra narrative to inflate difficulty. Keep within the tier's SQL and narrative boundaries.
- Write witness accounts as plausible recollection: what the person saw, heard, did or remembers, with ordinary vocabulary. Preserve uncertainty where appropriate. Do not have witnesses explain database keys, prescribe the complete query chain or announce the solution without investigative work.
- Guidance states the current evidence goal and the next useful action. Say “log its CrimeID” when logging is required; distinguish query proof, notebook logging and final verification. Hints explain the relevant SQL operation without supplying future evidence or the full resolution.

### Background and shared layout

- Keep one authored, non-spoiler background consistent across the case page and Samuel's whole-case briefing; make it available in Case Facts for later reference. The shelf uses a shorter accurate synopsis. Do not retain obsolete step counts or repeat the same long background in adjacent panels.
- Reuse the shared briefing, Query Lab, reference drawer and Evidence Board layout. Current guidance is short and separate from whole-case context. Full story text must wrap and fit when resized; do not rely on fixed-height cards to hide overflow.

### Canonical query tokens

- Pinned Facts offers canonical, typed link/filter values, not a button for every returned column. Prefer one useful token per clue concept, with the human meaning in its label and the actual target column/value in its insertion.
- Example: “Murder CrimeID: 1080” inserts `CrimeID = 1080` for linking to CrimeSceneReport. Do not insert `CrimeType = 1080`. `CrimeType = 'Murder'` is a valid classification-table predicate, but is not the report link and must not compete as a second token once that CrimeID is earned. Keep the classification label in the notebook.
- The shared collected-detail UI currently permits ID, Name, City and Date field families as candidate filter tokens. Other returned fields are reference text by default. Additional useful field families require scoped review and regression coverage; do not bypass that rule by renaming display labels. These tokens are column-specific building blocks, not a promise that a column exists in every selected table.
- Preserve exact column identity, type and value: numeric keys remain numeric; text is quoted with embedded apostrophes escaped; text codes with leading zeros remain text. Never map a display name to an ID by guessing. Narrative descriptions, witness accounts and conclusions remain readable reference text.
- Earlier earned facts remain available after a task changes. Current helper recommendations can be limited to the current task. Clicking inserts at the editor selection; it must not execute SQL, earn proof or silently replace the student's whole query.

### Notebook, collected details and authority

- Proved facts come from accepted server evidence. Collected reference details come from owned proved-query/logged-row actions, not manual/imported workspace notes. Reference visibility does not prove extra tasks. Do not infer missing values or reveal future/restricted evidence.
- Group notebook evidence by record type and its primary identifier. Merge repeated compatible partial/full rows without repeating their text; retain distinct records, conflicting narratives and personal notes. A foreign key repeated under two different record types explains their relationship and is not duplicate evidence.
- Use compact `Label: value` lines, clear record headings, natural narrative wrapping and modest spacing. Preserve full text. Keep personal notes separate from progress authority.
- Use consistent high-contrast query tokens, including nested labels and hover/focus states, with a visible keyboard focus indicator. Verify text contrast of at least 4.5:1 and narrow-window wrapping. A button-shaped value must actually support insertion; reference text must not imply that it does.

Author review and verification checklist: [Protected Runtime Case Authoring Guide](../15-case-plans/CASE-RUNTIME-AUTHORING-GUIDE.md#shared-pattern-review-checklist-wp-306).


### Saving statements versus proving a task (WP-307)

For query-proof tasks, a returned stored evidence row may be saved as a notebook note before the query isolates the current canonical record. Each successful save needs visible row confirmation; failures must leave an explicit retryable outcome, not a permanently pending button. Saving multiple returned statements retains multiple confirmations and reference records, without advancing query proof or identifying every interviewee as a suspect. The student still follows the current account's observations, resolves the named identity and compares that person's own account through the authored prerequisites. Selected-row log-proof tasks retain their separate canonical validation. Review both broad exploration/logging and isolated proof in case tests.


### Selected steward evidence (WP-308)

Case 001 v3's steward account supports two equivalent proof paths: an isolated canonical query, or logging its canonical row from a broader returned statement set while that step is current. The selected row is checked against live public evidence and the proved report; it earns the same name fact and exposes the already-authored PersonsOfInterest direction/PersonName hint. Logging another interviewee's account is a note only and cannot skip the steward prerequisite. This bounded exception supersedes WP-307's query-only advancement rule for this step; it does not convert arbitrary notebook notes into proof. Existing saved notes are not automatically promoted: students re-log the steward statement or run the isolated query.


## Current database authoring origin

Follow the [canonical database source and authoring workflow](../../database/README.md). Bootstrap contains only current live records and definitions, organized by table and case; historical compatibility and test fixtures live separately. Existing-installation changes require their own guarded migration scope.
