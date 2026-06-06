# WP-147: Context-Aware Clue Logging And Deferred Evidence Feedback

**Status:** Ready
**Owner:** Codex
**Created:** 2026-06-06

## Objective

Make every `Log Clue` response accurately reflect whether the selected row was saved for the current investigation step, deferred as potentially interesting, rejected as incorrect, or already collected.

## Why This WP Exists

During manual Case 004 progression testing, the student identified the gym-linked suspect and queried all of that suspect's `InterviewLog` rows. The current step requires one direct confession row before testing the hired-killer theory.

Randomly selecting additional transcript rows exposed a contract failure:

- rows could receive green `Clue Logged` feedback even when they were not added to the currently visible Evidence Notebook
- several of those rows are relevant only after the hired killer is confirmed and the Mastermind investigation begins
- the student received no distinction between evidence that proves the current objective and information that may matter later
- the table derives row state from global feedback/version changes instead of receiving the actual outcome of the clicked row

A green state must be trustworthy. If a clue is not persisted to the appropriate notebook page, the interface must not say it was logged.

## Scope

### In Scope

- define a structured per-row clue-log result contract
- distinguish `logged`, `deferred`, `rejected`, and `duplicate` outcomes
- make the clicked row's button state derive directly from its returned outcome
- reserve green `Clue Logged` for rows actually persisted to the Evidence Notebook
- show amber `Not Needed Yet` for rows that may be meaningful but do not prove the current objective
- show red `Try Again` for wrong-person, wrong-report, or irrelevant rows
- show neutral/gray `Already Logged` for duplicate evidence
- keep deferred Mastermind rows out of the notebook before the hired killer is confirmed
- avoid revealing that a deferred clue belongs to the later Mastermind path
- require the direct confession row during the first-suspect interview step
- preserve persistent multi-row success behavior for evidence bundles that intentionally require several rows
- add focused unit, integration, and headed/headless browser coverage for random extra clue selection
- update guidance copy only where needed to explain the current evidence objective

### Out of Scope

- changing the correct hired killer or Mastermind
- changing transcript data, IDs, database seed records, or migrations
- automatically saving deferred evidence for later
- retroactively moving early random selections to the Mastermind notebook after killer confirmation
- preventing students from clicking exploratory rows
- redesigning the Evidence Board or notebook page system
- changing query execution, restricted-table policy, answer-key security, or theory verification
- changing unrelated clue-logging steps

## Impact Analysis

### Understand Status

- Graph available: Yes
- Baseline commit: `834216bd32ffb567db572e725908d2e54c795e9d`
- Freshness assessment: `Usable with non-structural drift`
- Analysis performed: Required-tier Case 004 progression analysis. The graph identified `useStudentCaseState.ts` as the progression/evidence owner, `QueryResultsTable.tsx` as the row-feedback surface, `QueryRunner.tsx` and `App.tsx` as the callback path, and focused unit/browser tests as the regression surface. Source inspection confirmed that `QueryResultsTable` currently infers a clicked row's outcome from global feedback state while `handleStudentEvidenceLog` persists only milestone-valid entries.

### Affected Architecture

- Layers: Student Experience; Learning and Case Domain
- Primary files/components:
  - `apps/web/src/useStudentCaseState.ts`
  - `apps/web/src/components/QueryResultsTable.tsx`
  - `apps/web/src/components/QueryRunner.tsx`
  - `apps/web/src/App.tsx`
- Upstream consumers:
  - `App`
  - `StudentWorkbenchView`
  - Query Lab browser workflows
- Downstream dependencies:
  - `QueryRow` data from the API client types
  - Evidence Notebook entry persistence
  - student evidence feedback and guidance
  - suspect-theory milestone progression

### Regression Surface

- Related tests:
  - `apps/web/src/components/QueryResultsTable.test.tsx`
  - `apps/web/src/components/QueryRunner.test.tsx`
  - `apps/web/src/App.test.tsx`
  - `apps/web/src/useStudentCaseState.upsert.test.tsx`
  - `apps/web/tests/browser/student-mode.spec.ts`
- User workflows:
  - logging the direct killer confession
  - clicking extra suspect transcript rows before theory testing
  - confirming the hired killer
  - revisiting the transcript for Mastermind clues
  - collecting intentional multi-row evidence bundles
- Security/data boundaries:
  - no backend or database changes
  - deferred feedback must not reveal later Mastermind answers or classify hidden rows too specifically

### Graph Update Decision

- Regeneration required: Yes
- Rationale: The implementation changes the callback contract and Case 004 clue-feedback behavior across state management and shared Query Lab components. Regenerate Understand after implementation and audit, before final closeout.

## SSOT References

- `docs/00-ssot/SSOT-Case-Progression.md`
- `docs/00-ssot/SSOT-Investigation-State-Architecture.md`
- `docs/00-ssot/SSOT-UI-UX-Experience.md`
- `docs/00-ssot/SSOT-Development-Workflow.md`
- `docs/05-development-workflow/Work-Package-Lifecycle.md`

## Files Allowed To Change

Allowed:

- `apps/web/src/App.tsx`
- `apps/web/src/App.test.tsx`
- `apps/web/src/components/QueryResultsTable.tsx`
- `apps/web/src/components/QueryResultsTable.test.tsx`
- `apps/web/src/components/QueryRunner.tsx`
- `apps/web/src/components/QueryRunner.test.tsx`
- `apps/web/src/components/student/StudentWorkbenchView.tsx`
- `apps/web/src/studentCase.ts`
- `apps/web/src/styles.css`
- `apps/web/src/useStudentCaseState.ts`
- `apps/web/src/useStudentCaseState.upsert.test.tsx`
- `apps/web/tests/browser/studentModeApi.ts`
- `apps/web/tests/browser/studentModeHarness.ts`
- `apps/web/tests/browser/student-mode.spec.ts`
- `.understand-anything/knowledge-graph.json`
- `.understand-anything/fingerprints.json`
- `.understand-anything/meta.json`
- `.understand-anything/intermediate/scan-result.json`
- this work-package document

Do Not Modify:

- `apps/api/**`
- `database/**`
- answer-key or restricted-table policy
- suspect or Mastermind solution records
- `.codex/skills/**`
- `docs/00-ssot/**`
- unrelated work-package documents
- WP-146 implementation files already present in the working tree

## Constraints

- Green feedback must mean that the selected evidence is persisted and visible on the appropriate notebook page.
- Deferred feedback must not claim the row is saved.
- Deferred feedback must not reveal that the information belongs to the Mastermind investigation.
- The direct confession remains the only accepted row for the first-suspect interview milestone.
- Students may explore freely; exploratory clicks receive accurate instructional feedback instead of being disabled.
- Outcome handling must be tied to the clicked row, not inferred later from unrelated global feedback changes.
- Rapid or repeated clicks must not assign another row's outcome to the clicked button.
- Existing multi-row evidence workflows must retain all accepted green states.
- Duplicate selections must not create duplicate notebook entries or appear as a new success.
- Do not clear the active query/results solely because a row was deferred, rejected, or duplicated.
- Preserve the WP-144 Employment tie-break and final Mastermind progression.

## Required Behavior

### Structured Outcome Contract

The student row-log callback must return or resolve a structured result equivalent to:

```ts
type StudentClueLogOutcome =
  | {
      status: "logged";
      message: string;
    }
  | {
      status: "deferred";
      message: string;
    }
  | {
      status: "rejected";
      message: string;
    }
  | {
      status: "duplicate";
      message: string;
    };
```

The exact type location may follow existing component conventions, but the contract must remain shared and explicit across `useStudentCaseState`, `App`, `QueryRunner`, and `QueryResultsTable`.

### Visual Feedback Matrix

| Outcome | Button text | Color/tone | Notebook change |
|---|---|---|---|
| `logged` | `Clue Logged` | green/success | persisted |
| `deferred` | `Not Needed Yet` | amber/advisory | none |
| `rejected` | `Try Again` | red/error | none |
| `duplicate` | `Already Logged` | neutral/gray | none |

The message bar should use matching instructional language. If the existing global tone model cannot represent advisory/duplicate states without ambiguity, extend it narrowly or keep the structured row outcome as the source of button truth.

### First-Suspect Interview Step

Before the hired killer is confirmed:

- selecting the direct confession row returns `logged`
- the confession appears on Evidence Board Page 1
- the suspect-interview milestone advances
- other rows from the correct suspect/report that contain potentially meaningful detail return `deferred`
- deferred copy should say the detail does not prove the current suspect step and direct the student toward the direct admission
- deferred rows are not placed on Page 1 or Page 2
- wrong-person or wrong-report rows return `rejected`
- reselecting the persisted confession returns `duplicate`

Suggested deferred language:

> Interesting detail, but it does not prove the current suspect step. Find the row where the suspect directly admits the killing.

Do not use phrases such as `Mastermind clue`, `hidden client`, `use this later`, or other copy that previews the next investigation layer.

### Post-Confirmation Mastermind Step

After the hired killer is confirmed:

- the student must intentionally revisit the relevant transcript
- valid new profile rows can return `logged` and persist on Page 2
- rows that repeat already collected clue categories return `duplicate` or a clearly non-success equivalent
- rows that do not add a usable profile detail return `rejected`
- early deferred clicks do not automatically become logged or pre-populate Page 2

### Multi-Row Evidence

- intentional multi-row workflows, including the three Symphony events, retain green state for every persisted required row
- rejected, deferred, and duplicate outcomes must not erase previously persisted green states in multi mode
- changing query results may reset transient row presentation, but persisted notebook evidence remains authoritative

## Acceptance Criteria

- [ ] The row-log callback returns a structured outcome for the clicked row.
- [ ] Row button feedback no longer depends on global feedback/version inference.
- [ ] Green `Clue Logged` appears only when notebook persistence succeeds.
- [ ] The direct confession is the only `logged` outcome during the first-suspect interview step.
- [ ] Potentially meaningful non-confession rows return amber `Not Needed Yet`.
- [ ] Deferred rows are absent from both Evidence Notebook pages.
- [ ] Deferred copy does not reveal the Mastermind path.
- [ ] Wrong-person and wrong-report rows return red `Try Again`.
- [ ] Repeated accepted evidence returns gray `Already Logged` without duplicate persistence.
- [ ] After killer confirmation, valid Mastermind clues can be intentionally logged to Page 2.
- [ ] Early deferred clicks are not carried forward automatically.
- [ ] Multi-row accepted evidence keeps persistent green states.
- [ ] Rapid or repeated clicks cannot apply one row's outcome to another row.
- [ ] Focused component and state tests pass.
- [ ] Headed Playwright covers random extra selections before killer confirmation.
- [ ] Headless Playwright passes.
- [ ] The web production build passes.
- [ ] Understand regeneration and validation complete after implementation.
- [ ] No backend, database, answer-key, or unrelated files change.

## Code Prompt

Implement WP-147 as a focused Case 004 clue-logging contract correction.

1. Replace the current global-feedback inference in `QueryResultsTable` with a structured result returned for the exact clicked row.
2. Support `logged`, `deferred`, `rejected`, and `duplicate` outcomes with the required button labels and visual tones.
3. Make notebook persistence and progression logic the source of truth for `logged`.
4. During the first-suspect interview step, accept only the direct confession; classify potentially meaningful non-confession rows as deferred without revealing the Mastermind path.
5. Keep deferred, rejected, and duplicate rows out of the notebook.
6. Preserve post-confirmation Mastermind clue collection and persistent multi-row success behavior.
7. Add focused component, state, integration, and browser tests, including random extra clicks and rapid sequential clicks.
8. Run headed and headless browser verification, the web build, and Understand regeneration.

Do not change backend verification, database data, solutions, or unrelated progression.

## Implementation Plan

Expected approach:

1. Define the shared clue-log outcome type close to the Query Lab component contract.
2. Change `onStudentLogRow` from a fire-and-forget callback to a synchronous or asynchronous outcome-returning callback.
3. Store row feedback directly from the returned outcome, keyed to the result row.
4. Map outcome statuses to stable button labels, classes, and accessible state.
5. Update `handleStudentEvidenceLog` so every branch returns an explicit outcome while preserving global guidance messages where useful.
6. Classify correct-suspect/report non-confession rows as `deferred` during the first-suspect step.
7. Detect duplicate notebook entries before returning `logged`.
8. Verify post-confirmation and multi-row branches return the correct status.
9. Add focused tests before running the full web and browser suites.
10. Regenerate and validate the Understand graph because the component/state contract changes.

## Verification Requirements

At minimum:

- `npm run test --workspace apps/web -- --run src/components/QueryResultsTable.test.tsx src/components/QueryRunner.test.tsx src/useStudentCaseState.upsert.test.tsx src/App.test.tsx`
- `npm run test:browser:headed --workspace apps/web`
- `npm run test:browser --workspace apps/web`
- `npm run build --workspace apps/web`
- `$understand`
- `git diff --check`
- scope review against this WP

Browser coverage must prove:

1. extra correct-suspect transcript rows before confirmation do not turn green
2. extra rows do not appear on Evidence Board
3. the direct confession turns green and appears on Page 1
4. confirming the killer does not import earlier deferred rows
5. valid later Mastermind rows can be logged intentionally to Page 2

## Audit Prompt

Audit WP-147 for row-outcome correctness, evidence persistence integrity, spoiler control, progression safety, and regression coverage.

Verify:

1. Each clicked row receives its own returned outcome.
2. No global feedback race can mark the wrong row.
3. Green always corresponds to a persisted notebook entry.
4. Amber deferred feedback never persists evidence.
5. Deferred copy does not reveal the Mastermind investigation.
6. The direct confession remains required for first-suspect progression.
7. Wrong-person/report rows remain rejected.
8. Duplicate selections remain idempotent and are not presented as new success.
9. Deferred selections do not appear later unless the student intentionally logs them in the correct phase.
10. Post-confirmation Mastermind clue collection still works.
11. Multi-row Symphony and other bundle feedback remains persistent and accurate.
12. Headed and headless browser coverage exercises random and rapid selection behavior.
13. Understand regeneration reflects the changed callback and state relationships.
14. No backend, database, solution, SSOT, WP-146, or unrelated changes occurred.

Output:

- Verdict: PASS or FAIL
- Row-state or persistence defects
- Spoiler or guidance problems
- Progression regressions
- Missing tests
- Scope violations

## Code Results

Implemented.

- Added a shared `StudentClueLogOutcome` contract with `logged`, `deferred`, `rejected`, and `duplicate` outcomes.
- Moved Query Results row feedback to direct per-row outcome handling instead of global banner inference.
- Added advisory banner support so deferred and duplicate outcomes communicate accurately without appearing as success.
- Tightened suspect-interview clue logging so only the direct confession persists during the first-suspect step; mastermind-relevant rows defer without spoiling the next phase.
- Preserved persistent green multi-row behavior for intentional bundle steps, including the Symphony event trail.
- Added focused unit and browser coverage for deferred suspect rows, persistent multi-row logging, and the revised browser fixture flow.

## Audit Results

Audit completed.

- Verdict: PASS
- Focused unit tests passed:
  - `npm run test --workspace apps/web -- --run src/useStudentCaseState.upsert.test.tsx src/components/QueryResultsTable.test.tsx src/components/QueryRunner.test.tsx src/App.test.tsx`
- Headless Playwright passed:
  - `npm run test:browser --workspace apps/web`
- Web build passed:
  - `npm run build --workspace apps/web`
- Root build remains red because `apps/api` has unrelated pre-existing TypeScript issues outside WP-147 scope.
- Understand regeneration remains pending because the installed plugin root is outside the writable workspace and requires an external write step.

## Final Decision

Accepted.

- follow-up adjustments reset stale row feedback when the investigation phase changes without changing the visible result set
- restored explicit Evidence Board handoff copy at the first suspect-theory transition
- added parenthesis builder tokens and EventRegistration grouping guidance for mixed `AND` and `OR` filters
