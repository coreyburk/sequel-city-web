# WP-121: query-lab-support-panel-consistency-and-token-visibility

## Objective

Normalize the Student Mode Query Lab support panels so Samuel's clue/token surfaces stay visually and structurally consistent across the witness, witness-name, gym, and suspect-theory steps.

The immediate concerns are:

- some steps use `Report Clues` and `Query Tokens` while others use `Why This Matters` and `Useful Clues`
- the shift in labels makes later panels read less interactive, even when clickable tokens are present
- some stages expose weaker or less visible token sets than others, making the guidance feel inconsistent
- the student should be able to trust that each Query Lab phase will show a clear clue summary and a visible set of clickable tokens

The goal is:

Make the support panels feel like one coherent system, with consistent structure and relevant token visibility at every phase, without over-scaffolding the SQL.

---

## Scope

Refine the Query Lab support-panel presentation and token visibility across the relevant Student Mode investigation steps.

This WP may modify:

- student Query Lab support-panel copy and structure
- the visible token sets for witness, witness-name, gym, and suspect-theory phases
- related frontend tests
- this work package document

No backend API changes.
No database changes.
No SQL execution changes.
No runtime AI behavior.

---

## Files Allowed to Change

Allowed:

- apps/web/src/components/**
- apps/web/src/components/student/**
- apps/web/src/features/**
- apps/web/src/hooks/**
- apps/web/src/utils/**
- apps/web/src/types/**
- apps/web/src/state/**
- apps/web/src/App.tsx
- apps/web/src/App.test.tsx
- apps/web/src/styles.css
- docs/01-work-packages/WP-121-query-lab-support-panel-consistency-and-token-visibility.md

Do Not Modify:

- apps/api/**
- database/**
- docs/00-ssot/**
- docs/06-architecture/**
- docs/07-api-contracts/**
- docs/08-database/**
- docs/09-release-readiness/**
- package.json files
- backend build configuration
- runner scripts

---

## Constraints

- Preserve deterministic gameplay behavior
- Preserve spoiler-safe guidance
- Preserve Samuel's mentor role
- Preserve the student's responsibility to build their own SQL
- Keep token support helpful but tapered
- Do not reintroduce solved or near-solved queries
- Do not broaden into milestone-logic rewrites beyond what is required for panel consistency

---

## Required Behavior

### 1. Normalize Support-Panel Structure

Across the relevant Query Lab phases, the support panels should use one consistent structure so students can quickly scan them.

The structure should consistently present:

- the panel title
- a short line explaining that the clues/tokens are clickable query support
- one clue-oriented section
- one token-oriented section
- optional short footer guidance when needed

### 2. Keep Labels Consistent

The panel labels should not arbitrarily switch between patterns that make the interaction feel different.

For example:

- if `Query Tokens` is used in one phase, later phases should not switch to `Useful Clues` unless there is a strong reason
- clue-summary labels should also stay consistent enough to feel like the same UI system

### 3. Keep Tokens Visible And Relevant

Each active phase should expose a token set that is both visible and relevant to the current student task.

Examples:

- witness discovery should still emphasize report/witness lookup tokens
- witness-name lookup should clearly expose `PersonsOfInterest`, `PersonID`, and any lightweight connector tokens needed for the task
- gym lookup should clearly expose the table/column/filter tokens needed for the current narrowing step
- suspect-theory handoff should expose visible candidate-resolution tokens rather than reading like an empty text panel

### 4. Preserve Taper Discipline

Token improvements must not turn into answer-copying.

Do:

- expose helpful building pieces
- make the clickable support obvious

Do not:

- restore full clause-by-clause solved queries
- duplicate solved values that should remain in `Pinned Facts`

### 5. Tests

Add or update focused tests for:

- consistent panel labeling/structure where practical
- visible token presence for each major phase
- suspect-theory panel token visibility

---

## Acceptance Criteria

- Query Lab support panels use a coherent, consistent structure across the relevant phases
- token labels and clue labels feel like one shared UI system
- clickable tokens remain visible and relevant at each step
- no solved-query regression is introduced
- tests updated where practical
- no backend API changes introduced
- no SQL execution behavior changed
- no runtime AI behavior introduced

---

## Codex Prompt

Implement WP-121 for Sequel City Web Detective.

Objective:
Normalize the Query Lab support-panel structure and token visibility across the witness, witness-name, gym, and suspect-theory phases so the UI feels consistent and the clickable support remains obvious.

Implement:

1. Normalize the panel structure across the relevant Query Lab phases.
2. Align clue/token labels so the panels feel like one shared interaction pattern.
3. Ensure each phase exposes visible, relevant clickable tokens.
4. Preserve scaffold taper and avoid turning tokens into solved queries.
5. Update focused tests.

Do not:

- change backend APIs
- change SQL validation or execution
- alter database scripts
- introduce runtime AI
- broaden beyond Query Lab support-panel consistency and related tests

Preserve:

- deterministic gameplay behavior
- spoiler-safe guidance
- Samuel's mentor role
- the student's responsibility to build investigative queries

---

## Gemini Audit Prompt

Audit WP-121 Query Lab support-panel consistency and token-visibility fixes.

Verify:

1. Only approved frontend and work-package files changed.
2. No backend runtime files changed.
3. No database scripts changed.
4. No SQL execution behavior changed.
5. Query Lab support panels now use a more consistent structure across the relevant phases.
6. Clue/token labels feel aligned rather than switching arbitrarily between different patterns.
7. Tokens remain visible and relevant in witness, witness-name, gym, and suspect-theory phases.
8. No solved-query regression was introduced.
9. Tests were updated where practical.

Flag:

- inconsistent panel structures that remain after the change
- token sets that are still too sparse or too answer-like
- regressions that duplicate values that should stay in `Pinned Facts`
- backend, database, or SQL-execution changes
- missing regression coverage

---

## Codex Results

Implemented the Query Lab support-panel consistency pass in [apps/web/src/components/student/StudentWorkbenchView.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/components/student/StudentWorkbenchView.tsx) and refreshed the focused assertions in [apps/web/src/App.test.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/App.test.tsx).

The final accepted shape uses one shared `InvestigationBrief` component across the witness discovery, witness-name, gym, and suspect-theory phases. That refactor normalizes the visible structure, keeps the phase-specific Samuel intro line, standardizes the labels to `Case Clues` and `Query Tokens`, and preserves visible clickable tokens that stay relevant to each current task without reintroducing solved-query help.

Verification:

- `npm run test --workspace apps/web` passed with `143/143` tests
- `npm run build --workspace apps/web` passed

## Gemini Audit Results

Audit reviewed and accepted after the final refactor pass.

Confirmed:

- only approved frontend and work-package files changed
- the shared `InvestigationBrief` component now drives all four Query Lab support-panel phases
- the witness discovery outlier was aligned from `Report Clues` to `Case Clues`
- helper text and section structure are now consistent across witness, witness-name, gym, and suspect-theory phases
- visible clickable tokens remain present and relevant without drifting into solved-query scaffolding
- no backend, database, SQL-execution, or runtime AI behavior changes were introduced

## Final Decision

Accepted.

