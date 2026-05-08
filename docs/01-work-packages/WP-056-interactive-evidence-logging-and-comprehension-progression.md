# interactive-evidence-logging-and-comprehension-progression

## Objective

Make Student Mode evidence collection explicit, interactive, and tied to comprehension rather than implying that clues were automatically logged.

This WP establishes:

- row-level clue logging from student query results
- an Evidence Notebook inside Student Mode case notes
- Samuel progression that waits for the student to log the correct evidence on guided steps
- clearer student result messaging that distinguishes between finding a clue and actually logging it

The goal is to make the investigation feel more like active detective work while assessing whether the student understood which evidence mattered.

---

## Scope

Improve Student Mode evidence capture, result interactions, and related frontend tests.

In scope:

- evidence logging actions in query results
- Student Mode notebook entries for guided clues
- comprehension-based progression for guided opening steps
- student result messaging updates
- app, query runner, and query results tests for the evidence loop
- styling required for the notebook and evidence prompt UI

Out of scope:

- backend changes
- schema loading behavior changes
- developer mode behavior changes
- suspect verification logic changes

---

## Files Allowed to Change

- docs/01-work-packages/WP-056-interactive-evidence-logging-and-comprehension-progression.md
- apps/web/src/App.tsx
- apps/web/src/App.test.tsx
- apps/web/src/components/QueryRunner.tsx
- apps/web/src/components/QueryRunner.test.tsx
- apps/web/src/components/QueryResultsTable.tsx
- apps/web/src/components/QueryResultsTable.test.tsx
- apps/web/src/styles.css

Do Not Modify:

- apps/api/**
- database/**
- scripts/**
- package.json files
- build configuration

---

## Constraints

- Preserve backend-authoritative query execution
- Keep evidence logging frontend-only and deterministic
- Do not imply clues are logged unless the student explicitly logs them
- Do not add dependencies
- Preserve Developer Mode behavior

---

## Required Behavior

### 1. Interactive Evidence Logging

Student Mode should allow the student to explicitly log a clue from query results instead of implying that a result was automatically recorded.

### 2. Evidence Notebook

Logged clues should appear in Student Mode case notes as notebook entries with enough detail to show what was understood.

### 3. Comprehension-Based Progression

At least the guided opening clue flow should wait for the student to log the correct evidence before Samuel advances.

### 4. Honest Result Messaging

Student result messaging should distinguish between:

- a clue being found
- a clue being logged
- a wrong or insufficient clue being selected

### 5. Test Coverage

Add or update tests to verify:

- row logging controls appear when evidence capture is expected
- notebook entries update after a successful clue log
- Samuel progression waits for clue logging on guided steps
- Developer Mode remains unchanged

---

## Acceptance Criteria

- `WP-056` exists
- Student Mode can log clues from query results
- case notes include an Evidence Notebook section
- Samuel does not advance the guided opening clue solely on query execution
- result messaging no longer falsely claims a clue was logged automatically
- tests cover the new evidence loop and progression behavior
- no files outside allowed scope are changed

---

## Codex Prompt

Implement WP-056 interactive evidence logging and comprehension-based progression.

Do:

- add the work package
- add explicit clue logging from student query results
- record logged evidence in Student Mode case notes
- make guided progression depend on logging the right clue where appropriate
- update result messaging, tests, and styling as needed

Do not:

- change backend behavior
- change Developer Mode behavior
- add dependencies

Return:

- files changed
- evidence logging behavior summary
- test summary

---

## Gemini Audit Prompt

Audit WP-056 interactive evidence logging and comprehension-based progression.

Verify:

1. Only approved files were modified.
2. Student Mode supports explicit clue logging from query results.
3. The Evidence Notebook records logged clues in case notes.
4. Guided opening progression waits for correct evidence logging where intended.
5. Student-facing result messaging no longer implies automatic logging.
6. Developer Mode remains unchanged.
7. Tests cover the evidence logging loop and updated progression behavior.

Flag:

- fake or implied logging without student action
- progression that still advances too early
- unauthorized file changes
- missing test coverage

---

## Codex Results

Implemented interactive evidence logging and notebook-driven progression for the guided Student Mode opening.

Files changed:

- `docs/01-work-packages/WP-056-interactive-evidence-logging-and-comprehension-progression.md`
- `apps/web/src/App.tsx`
- `apps/web/src/App.test.tsx`
- `apps/web/src/components/QueryRunner.tsx`
- `apps/web/src/components/QueryRunner.test.tsx`
- `apps/web/src/components/QueryResultsTable.tsx`
- `apps/web/src/components/QueryResultsTable.test.tsx`
- `apps/web/src/styles.css`

Behavior delivered:

- Added row-level `Log clue` actions in Student Mode query results when a guided clue needs to be captured.
- Added an `Evidence Notebook` section inside Student Mode case notes so logged facts become visible artifacts of student understanding.
- Changed Samuel progression so guided opening steps no longer rely only on query execution:
  - the `CrimeType` step waits for the student to log the `Murder` row
  - the filtered `CrimeSceneReport` step waits for the student to log a filtered murder report row
- Replaced the misleading student result language that implied clues were automatically logged.
- Added explicit prompt and feedback states so Student Mode distinguishes between:
  - possible clue found
  - clue logged successfully
  - wrong or insufficient clue selected

Verification:

- `npm run test --workspace apps/web`
- Result: `7` test files passed, `29` tests passed

## Gemini Audit Results

Audit of Work Package WP-056: **interactive evidence logging and comprehension-based progression** is complete.

### Audit Summary

The implementation successfully transitions Student Mode from automatic, implied evidence collection to an active, comprehension-based logging loop. The "Evidence Notebook" now serves as a tangible record of the student's progress and understanding.

### Verification Results

1.  **Authorized Changes**: Only the eight approved files were modified. No backend or Developer Mode files were touched.
2.  **Interactive Logging**: Added `Log clue` buttons to query results in Student Mode. These buttons are only visible when a `studentEvidencePrompt` is active, ensuring the interaction is focused and intentional.
3.  **Evidence Notebook**: A new `Evidence Notebook` section is visible within the "Detective's Case Notes". Logged clues (e.g., "CrimeID 1080 = Murder") are recorded here as permanent artifacts of the investigation.
4.  **Comprehension-Based Progression**: 
    *   Samuel's briefing now waits for the student to log the correct evidence for the `CrimeType` and filtered `CrimeSceneReport` steps.
    *   Query execution alone no longer advances these specific milestones, requiring the student to identify and log the correct row.
5.  **Honest Result Messaging**: Updated the student result visual strip to distinguish between "Possible clue found" (after query execution) and "Clue logged" (after explicit student action). Messaging no longer implies that the system is tracking progress automatically.
6.  **Developer Mode Integrity**: Verified that Developer Mode continues to provide direct, diagnostic-heavy query results without the student-facing logging UI or progression constraints.
7.  **Test Coverage**: 
    *   `App.test.tsx` verifies the full loop: query execution -> prompt appearance -> evidence log -> notebook update -> milestone advancement.
    *   `QueryRunner.test.tsx` and `QueryResultsTable.test.tsx` verify the UI components for prompts and logging buttons.
    *   Existing Developer Mode tests pass, confirming no regressions.

### Findings

- **Strategic implementation**: The use of a `pendingEvidenceStep` state in `App.tsx` effectively decouples query execution from milestone completion, enforcing comprehension.
- **Robust validation**: The logging handler verifies that the student is logging the *correct* row (e.g., checking for "murder" in the `CrimeType` result) rather than just clicking any button.

### Final Decision: **APPROVED**
Warning: 256-color support not detected. Using a terminal with at least 256-color support is recommended for a better visual experience.
Ripgrep is not available. Falling back to GrepTool.

## Final Decision

Approved.

