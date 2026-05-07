# Investigation Overview

## Purpose

This document describes the deterministic learner investigation experience at a high level.

## Core Model

The learner investigates by inspecting schema metadata, writing read-only SQL, reviewing database-backed results, and refining the next query. The learner controls pacing. The backend controls validation and execution. The database controls evidence truth.

## Authority Rules

| Concern | Authority |
|---|---|
| Evidence data | SQL Server database |
| Schema metadata | SQL Server database through the backend |
| SQL safety decision | Backend safety service |
| SQL execution | Backend query execution service |
| Result shape and error shape | Backend API |
| Query interpretation | Learner |
| Visual presentation | Frontend |

## Investigation Journey

1. The learner opens the local investigation workspace.
2. The learner confirms the backend and database are available through the visible diagnostics and setup guidance.
3. The learner reviews schema metadata to understand available tables, columns, and key relationships.
4. The learner writes a read-only SQL query and submits it through the frontend.
5. The backend validates the query before any database access.
6. If the query is allowed, the backend executes it and returns normalized results.
7. If the query is blocked or fails, the backend returns deterministic feedback.
8. The learner reviews the response, forms a narrower hypothesis, and iterates.

## Evidence Principle

Evidence is discovered through actual database rows and actual schema relationships. The system does not invent evidence, invent schema, or infer correctness from frontend state alone.

## Current Implementation Notes

The current runtime already implements:

- schema exploration
- read-only query execution
- normalized result display
- in-memory query history
- backend suspect verification route
- frontend suspect verification panel

The current runtime does not yet implement:

- persisted notebook evidence
- deterministic milestone tracking in the active backend

Those later deterministic flows are SSOT-defined, but not part of the current implemented runtime.

## Student Experience Baseline (WP-040)

### Current Implemented Experience

The current frontend is development-oriented and exposes investigation surfaces directly. Learners can complete the full deterministic loop, but they are expected to self-direct navigation across health, schema, query execution, history, and suspect verification panels.

### Student-First Target Direction (Near-Term)

Near-term student UX work packages should keep the same backend-authoritative behavior while improving clarity, flow guidance, and confidence for first-time student investigators.

The next student-focused UX baseline is centered on three core tasks:

1. Orient to case context and determine workspace readiness.
2. Run safe read-only queries and interpret deterministic backend feedback.
3. Verify a suspect and explain the reasoning outcome from returned evidence and verdict text.
