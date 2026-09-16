# Case 001 Clue-by-Clue Guidance

## Objective

Make the released Case 001 M1-to-M2 path actionable: students must learn how to reduce a broad CrimeSceneReport result set to the clocktower row before the UI asks them to use its ReportID in InterviewLog.

## Scope

### In Scope

- Refine Case 001 visible Samuel guidance, query-guide clue text, starter drafts, feedback, and focused tests.
- Teach the sequence: inspect columns; filter CrimeID 1080; filter Sequel City and the observed date; identify the clocktower poisoning row; then use its ReportID in InterviewLog.
- Preserve learner-owned SQL and backend result-based milestone authority.

### Out of Scope

- Database schema or seed data, API validators, milestone definitions, Case 004, hidden answer exposure, and header navigation.

## Impact Analysis

### Understand Status
- Graph available: Yes; baseline `3243f12b0a30a6a122a6468afebd3584c3f8beb2`.
- Freshness: Usable with non-structural drift for this focused Case 001 guidance surface.
- Analysis: Verified `studentCase001.ts` owns displayed steps and feedback slices; `useStudentCaseState.ts` supplies the active step and query-guide clue; focused Case 001 tests cover state behavior.

### Affected Architecture
- Layers: Case 001 frontend guidance constants and student state presentation.
- Primary files: `apps/web/src/studentCase001.ts`, `apps/web/src/useStudentCaseState.ts`.
- Consumers: Case 001 students using Briefing and Query Lab.
- Dependencies: Existing backend result-pattern evaluation remains authoritative.

### Regression Surface
- Tests: `apps/web/src/studentCase001.test.ts`, `apps/web/src/useStudentCaseState.case001.test.tsx`, relevant App tests.
- Workflow: reset Case 001, run broad report query, progressively narrow based on displayed guidance, inspect the single report, then query linked interviews.
- Security: do not prefill ReportID, expose protected Case 004 data, or advance milestones from client-side text.

### Graph Update Decision
- Regeneration required: No.
- Rationale: copy and presentation guidance only; no imports, modules, schemas, or authority boundaries change.

## Files Allowed to Change

Allowed:
- docs/01-work-packages/WP-277-case-001-clue-guidance.md
- apps/web/src/studentCase001.ts
- apps/web/src/useStudentCaseState.ts
- apps/web/src/studentCase001.test.ts
- apps/web/src/useStudentCaseState.case001.test.tsx
- apps/web/src/App.test.tsx
- docs/00-ssot/SSOT-UI-UX-Experience.md
- docs/00-ssot/END-OF-DAY-HANDOFF.md

Do Not Modify:
- apps/api/**
- database/**
- apps/web/src/studentCase001Progress.ts
- apps/web/tests/browser/**
- package.json
- package-lock.json

## Constraints

- Keep exactly two Case 001 milestones and existing backend result-based validation.
- Do not prefill the answer-shaped ReportID query or reveal the ReportID in guidance.
- Every instruction must be usable from fields or values the student has already seen.
- No database changes.

## Required Behavior

- After the broad report query, the next clue tells students how to narrow the large result set before mentioning InterviewLog.
- The InterviewLog clue appears only after the report row is meaningfully identified through the existing M1 result path.
- Guidance gives one concrete next action at a time and explains why it is justified.

## Acceptance Criteria

- [x] Case 001 no longer asks for an unknown ReportID after a broad result set.
- [x] M1 guidance provides an explicit, spoiler-safe narrowing sequence.
- [x] M2 guidance tells students to use the ReportID only after they have located the report row.
- [x] Existing result-based progression and Case 001 two-milestone scope remain unchanged.
- [x] Focused tests and build pass; audit and human acceptance remain separate.

## Code Prompt

Implement only the allowed Case 001 guidance and test changes. Make every visible clue actionable from evidence already available to the student. Preserve backend authority, the two-milestone release slice, and no-answer-prefill constraints. Record validation; leave audit and final decision pending.

## Audit Prompt

Independently verify that each Case 001 clue follows the learner's available evidence, the ReportID is never demanded before it is discoverable, no answer is prefilled, Case 004 is unaffected, and backend result evaluation remains the only progression authority.

## Code Results

Updated Case 001 guidance so the broad report query is explicitly a column-discovery step, then directs students to narrow by CrimeID, city, and date before reading a visible report row's ReportID. The active follow-up clue now explicitly prohibits opening InterviewLog until that ReportID is observable, then explains how to apply it to the interview query. Backend result-based progression, the two active milestones, starter broad queries, and database content remain unchanged.

- `npm run test --workspace apps/web -- --run src/App.test.tsx --reporter=dot` â€” 66 passed.
- `npm run build --workspace apps/web` â€” passed.

## Audit Results

### Independent Audit Report: Case 001 Clue Guidance & Progression Authority

**Work Package:** [WP-277-case-001-clue-guidance.md](docs/01-work-packages/WP-277-case-001-clue-guidance.md)  
**Repository:** `D:/GitHub-Repos/SequelCityWeb`  
**Verdict:** **PASS** (Final decision remains pending human review)

---

### Verification Summary

| Dimension | Evaluated Source & Runtime Evidence | Audit Finding | Status |
|---|---|---|---|
| **1. Evidence-Backed Clues** | [`studentCase001.ts`](apps/web/src/studentCase001.ts#L38-L43), [`studentCase001.ts`](apps/web/src/studentCase001.ts#L320-L348), and [`useStudentCaseState.ts`](apps/web/src/useStudentCaseState.ts#L4500-L4558). | Clues guide the student to run a broad query to discover column names, then narrow sequentially using known briefing facts (`CrimeID = 1080`, `ReportCity = 'Sequel City'`, `ReportDate = 20230502`) before inspecting the clocktower poisoning description. Step 2 builds strictly on the single row isolated in Step 1. | **PASS** |
| **2. ReportID Discoverability** | [`studentCase001.ts`](apps/web/src/studentCase001.ts#L266-L267), [`studentCase001.ts`](apps/web/src/studentCase001.ts#L328-L343), and [`useStudentCaseState.ts`](apps/web/src/useStudentCaseState.ts#L3930-L3934). | Step 1 match message explicitly warns against opening `InterviewLog` until `CrimeSceneReport` is narrowed to one visible row. Step 2 guidance states *"A ReportID is evidence, not a guess. Copy it from the single report row..."* and *"Do not query InterviewLog until the report row is visible."* Runtime logic strictly rejects Step 2 evaluations until Step 1 is recorded. | **PASS** |
| **3. No Prefilled Answers** | [`studentCase001.ts`](apps/web/src/studentCase001.ts#L262), [`studentCase001.ts`](apps/web/src/studentCase001.ts#L283), [`useStudentCaseState.ts`](apps/web/src/useStudentCaseState.ts#L3857-L3863), and [`App.test.tsx`](apps/web/src/App.test.tsx#L2166-L2168). | Starter queries are generic table sweeps (`SELECT * FROM CrimeSceneReport;` and `SELECT * FROM InterviewLog;`). No `WHERE ReportID = ...` or `WHERE CrimeID = 1080` filters are prefilled in drafts or query assist. `CASE_001_AUTHORING_DEFINITION.spoilerBoundary` maintains zero answer-key exposure. | **PASS** |
| **4. Case 004 Unaffected** | [`useStudentCaseState.ts`](apps/web/src/useStudentCaseState.ts#L4489), [`case001ResultPatternService.ts`](apps/api/src/services/case001ResultPatternService.ts#L41), and [`App.test.tsx`](apps/web/src/App.test.tsx). | All changes in `useStudentCaseState.ts` are guarded inside `if (getShellStudentCaseId(activeCaseId) === CASE_001_ENTRY_ID)`. Case 004 files are unmodified. `PROTECTED_CASE_004_REPORT_ID = "10975"` is explicitly protected and rejected in Case 001 evaluation. The full Case 004 test suite in `App.test.tsx` passed with 0 regressions. | **PASS** |
| **5. Backend Progression Authority** | [`studentCase001.ts`](apps/web/src/studentCase001.ts#L196-L205), [`useStudentCaseState.ts`](apps/web/src/useStudentCaseState.ts#L3905-L3940), and [`useStudentCaseState.case001.test.tsx`](apps/web/src/useStudentCaseState.case001.test.tsx#L19-L37). | Milestone progression depends entirely on `payload.response.caseMilestoneEvaluation` produced by deterministic backend result-pattern evaluation. Arbitrary row clicks do not advance milestones, stored `localStorage` flags are untrusted and re-executed against the API upon restore, and Step 2 cannot advance ahead of Step 1. | **PASS** |

---

### Test & Build Execution

- **Web Unit Tests (`App.test.tsx`)**: 66 passed
- **Case 001 State & Progress Tests (`useStudentCaseState.case001.test.tsx`, `studentCase001Progress.test.ts`)**: 5 passed
- **API Unit & Route Tests (`apps/api`)**: all suites passed
- **Web App Production Build (`npm run build --workspace apps/web`)**: clean (`tsc -b && vite build` passed)
- **Work Package Governance (`scripts/get-work-package-status.ps1 WP-277`)**: `AuditedNeedsFinalDecision`, 0 out-of-scope files

## Final Decision

Accepted by the human reviewer after the recorded PASS re-audit. Close out the Case 001 clue-by-clue guidance improvement.



