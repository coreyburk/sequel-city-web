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

The Query Results table supports this step with readability affordances that stay neutral about what the evidence means:

- long transcript and narrative fields render a short preview with a visible "Show more" / "Show less" button so the learner can read full text inline without losing context
- alternating row shading and consistent padding reduce eye strain while comparing rows
- a compact "Log Clue" button at the end of each row keeps clue logging intentional and learner-triggered; the application never logs evidence automatically

### 7. Iterate

The learner repeats the schema-review and query-review cycle until enough evidence is gathered to support a conclusion.

### 8. Verify Suspect

The learner can submit a suspect name through the frontend suspect verification panel. The frontend sends the name to the backend verification endpoint and displays the returned database-backed verdict text. The frontend does not decide correctness locally.

## Current Frontend Support

The present frontend supports this workflow through:

- `HealthStatus`
- `SchemaExplorer`
- `QueryRunner`
- `QueryHistoryPanel`
- `SuspectVerificationPanel`

## Explicit Non-Behavior

The current workflow does not include:

- runtime AI guidance
- automated answer generation
- hidden gameplay mechanics
- scoring or achievements
- multiplayer or shared investigation state
- frontend correctness authority

## Current Backend Verification Boundary

The backend exposes a database-backed suspect verification route, and the frontend now includes a panel that submits suspect names and renders returned verification results.

Case closure and full deterministic case progression remain future scoped work and must remain backend-authoritative and database-backed when added.

## Student Task Flow Baseline (WP-040)

### Task 1: Orient To Case Context

Completion steps:

1. Learner identifies that the workspace is a detective investigation experience.
2. Learner confirms the environment is ready by reading visible health/setup signals.
3. Learner states an initial investigation direction before running a query.

### Task 2: Run And Interpret Safe Query Feedback

Completion steps:

1. Learner selects a table/relationship context from schema information.
2. Learner submits a read-only query through the query runner.
3. Learner correctly interprets whether the query succeeded, failed, or was blocked.
4. Learner explains one evidence-backed next step based on returned rows or safety feedback.

### Task 3: Verify Suspect And Explain Outcome

Completion steps:

1. Learner enters a suspect name in the suspect verification panel.
2. Learner submits verification and reads backend verdict text.
3. Learner explains the verdict as backend/database-determined rather than frontend-determined.

## View-Specific Header And Guidance Hierarchy

Student Mode tailors the case header and guidance treatment to the active student view so the learner sees only the imagery and signals that help in that moment.

### View-Specific Header Imagery

- Samuel's Briefing shows both the Samuel mentor avatar and the noir scene image so case entry keeps full atmospheric framing.
- Query Lab shows the Samuel avatar but hides the scene image. Vertical space is reclaimed for SQL work while mentor presence is preserved during active querying.
- Evidence Board shows the scene image but hides the Samuel avatar. The view reads as independent evidence review and avoids duplicating mentor framing learners already saw in the briefing.

The header remains visually cohesive across views, but each view exposes only the imagery that supports it.

### Required Vs Optional Guidance Hierarchy

Required next-step callouts and optional check-ins use distinct, non-color-only treatments:

- Required action callouts (Samuel's witness trail field note in Query Lab, the "Do This Next" card and the witness evidence checklist on the Evidence Board) carry a labeled "Required Next Step" badge, a stronger left accent border, and a solid container. The "Do This Next" wording remains so learners can match callouts to Samuel's mentor copy.
- Optional content (Samuel's optional reasoning check-in on the Evidence Board) carries an explicit "Optional" label, a dashed border, and a subdued background so it reads as supportive rather than progression-blocking.

Both treatments rely on structure and labeling, not color alone, so the distinction is legible without relying on hue cues.

### Cognitive Load Goal

The view-specific header and guidance hierarchy reduce wasted vertical space in working views and make required progression actions easier to scan ahead of optional reasoning prompts and ambient mentor copy. Gameplay logic, query execution, and Samuel's one-step-at-a-time guidance model are unchanged.
