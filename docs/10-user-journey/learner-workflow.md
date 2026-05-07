# Learner Workflow

## Purpose

This document describes the learner workflow supported by the current runtime and the deterministic investigation rules that govern it.

## Current Workflow

### 1. Start The Local Workspace

The learner launches the local frontend and backend, then opens the browser workspace. The startup guidance in the frontend shows the expected URLs and a first smoke-test query.

### 2. Confirm System Readiness

The learner reviews the health and setup feedback before treating the workspace as usable. This keeps investigation work grounded in a working backend and a reachable local database.

### 3. Inspect The Schema

The learner opens the schema explorer and reviews backend-provided tables, columns, and key markers. This step helps the learner decide where to begin and which relationships are worth following.

### 4. Submit A Read-Only Query

The learner writes SQL in the query runner and submits it to the backend. The learner is responsible for choosing the investigation direction. The frontend does not auto-generate answer queries or auto-solve the case.

### 5. Review The Backend Response

The learner reviews:

- the backend safety message
- the backend execution message
- execution timing
- normalized rows and columns when execution succeeds

If the query is blocked or fails, the learner receives deterministic feedback and must revise the query.

### 6. Interpret Evidence

The learner compares returned rows, narrows candidate sets, and decides the next question to ask. Evidence interpretation remains learner-owned. The application returns data and messages, but it does not decide conclusions for the learner.

### 7. Iterate

The learner repeats the schema-review and query-review cycle until enough evidence is gathered to support a conclusion.

## Current Frontend Support

The present frontend supports this workflow through:

- `HealthStatus`
- `SchemaExplorer`
- `QueryRunner`
- `QueryHistoryPanel`

## Explicit Non-Behavior

The current workflow does not include:

- runtime AI guidance
- automated answer generation
- hidden gameplay mechanics
- scoring or achievements
- multiplayer or shared investigation state
- frontend correctness authority

## SSOT-Defined Later Deterministic Steps

The SSOT defines later deterministic case actions such as suspect verification and case closure. Those actions belong to future scoped implementation work and must remain backend-authoritative and database-backed when added.
