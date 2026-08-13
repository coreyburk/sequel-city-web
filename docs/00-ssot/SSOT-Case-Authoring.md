# SSOT Case Authoring

## Principle

Playable cases must be produced from a repeatable authored contract before they are released. The contract is a pre-release validation surface for case content and ownership boundaries. It is not runtime authority by itself and does not replace backend-approved SQL results, deterministic result-pattern checks, SQL safety, database evidence, or suspect verification.

## Document Scope

This document owns the scalable case-production contract for future Sequel City Web Detective cases. Runtime layering is owned by `SSOT-Architecture.md`. Database tables and spoiler-control rules are owned by `SSOT-Database-Schema.md`. Progression authority is owned by `SSOT-Case-Progression.md`. Investigation state ownership is owned by `SSOT-Investigation-State-Architecture.md`.

## Authoring Contract

Every future playable case must define these authored sections before release work begins:

| Section | Purpose |
|---|---|
| Case identity | Stable case id and public case number/name |
| Release status | Whether the case is released, gated, or locked, including any release-gate behavior |
| Public dossier | Non-spoiler metadata used by the case library and briefing |
| Evidence requirements | Database table families the case depends on |
| SQL milestones | Learner objectives, table-family references, and deterministic validation ownership |
| State contract | Common learner-owned state and case-specific learner-owned state |
| Persistence/reset semantics | Storage strategy, version expectations, and clear-progress behavior |
| Investigation threads | Authored thread ownership and seed responsibility |
| Guidance | Authored Samuel Tupleton guidance ownership |
| Spoiler boundary | Explicit answer-key, restricted-data, and hidden-solution exclusions |

## Production Sequence

Future cases should be built in production-sized packages rather than isolated skeleton polish:

1. Fill the case-authoring contract.
2. Add the minimum database-backed evidence data for the first SQL milestone.
3. Add deterministic result-pattern validation for that milestone.
4. Wire the case into the playable module boundary while preserving release gates.
5. Add learner-owned persistence and reset semantics for that case.
6. Add investigation threads, evidence-board behavior, suspect verification, and release unlock through separate scoped packages.

Each package must remain independently auditable. A filled authoring contract does not release a case, render Query Lab, create database rows, advance milestones, persist progress, or expose suspect verification.

Case 001 has completed the first three pre-release production-sequence surfaces for its opening SQL milestone: a filled authoring definition, one base seed `CrimeSceneReport` fixture for the public clocktower incident report, and a deterministic backend service-level result-pattern validator for `case-001-clocktower-report-located`. It also has a gated backend integration-boundary consumer that can call that validator only when an explicit Case 001 skeleton-gate input is enabled. These surfaces do not release Case 001, render Query Lab, advance runtime milestones, persist progress, expose suspect verification, or make authoring metadata runtime authority. The validator boundary remains unwired from runtime progression until a later scoped package connects approved SQL results to milestone state.

## Progression Authority

SQL milestones must use backend-approved read-only SQL results and deterministic backend/result-pattern checks. The following are never valid SQL progression authorities:

- UI state
- skeleton selections
- localStorage
- AI output
- prompt text
- free-text guesses

Every SQL milestone must reference at least one declared evidence table family. A milestone cannot point to an undeclared table family, inferred schema, hidden answer-key row, or restricted data source.

## State And Persistence

The authoring contract must distinguish common learner-owned state from case-specific state. Common state includes concepts such as notebook entries, pinned facts, draft query text, and visible learner progress. Case-specific state includes authored milestone ids, case-specific thread ids, case-specific clue ids, and case-specific validation payloads.

Persistence and reset behavior must be declared before a case can be restored. Reset semantics must clear only learner-owned progress for that case id. Persistence must not clear or mutate backend query history, database state, account/cloud data, browser history state, case-library metadata, locked/future case data, or unrelated localStorage keys.

## Spoiler Boundary

Public case metadata, authored guidance, and pre-release validation examples must not include culprit identity, mastermind identity, answer-key rows, restricted table contents, hidden solution values, or direct solution query paths. Spoiler-bearing implementation details must stay behind scoped backend/database and verification packages that preserve the existing restricted-data boundaries.

## Current Runtime Status

The current runtime is not migrated to this contract. Case 004 remains the only released playable/restorable case. Case 001 remains a gated skeleton-only case with a first SQL milestone declaration, a filled pre-release authoring definition, one public `CrimeSceneReport` base seed fixture for the planned first evidence row, an unwired deterministic backend service-level validator for that first row, and a gated backend integration-boundary consumer for that validator. That definition, fixture, validator, and boundary consumer record the existing public dossier, `CrimeSceneReport` first evidence table family, and planned first SQL milestone boundary, but they do not release the case or make authored metadata runtime authority. Future packages may migrate cases toward this contract after WP-247, but runtime progression wiring, UI wiring, persistence, suspect verification, and release unlock are separate work.
