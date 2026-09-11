# Case 001 Released Runtime Documentation Alignment

## Objective

Align runtime-facing documentation with the accepted WP-274 Case 001 M1-M2 Foundations release so contributors and learners are not directed by obsolete gated-preview, M1-M3, or no-persistence claims.

## Scope

### In Scope

- Correct active-runtime descriptions of Case 001's normal library entry, exact M1-M2 milestone set, learner-owned local-browser storage, API revalidation, reset isolation, and released live smoke.
- Replace obsolete skeleton-gate instructions and test expectations with the current released smoke prerequisites.
- Preserve the distinction between learner-owned convenience state and backend/database completion authority.
- Update limitations and high-level learning/interaction documentation to acknowledge deterministic Case 001 milestone progression without overstating broader backend persistence or Case 004 behavior.

### Out of Scope

- Any application, API, database, bootstrap SQL, test, script, package, graph, or dependency change.
- Case 001 M3-M6, suspect verification, answer-key content, data migrations, UI redesign, or Case 004 progression changes.
- Rewriting historical work packages or author-only plan history.

## Impact Analysis

### Understand Status

- Graph available: Yes; all tracked artifacts exist and the graph indexes the WP-274 Case 001 progress module and live-smoke surface.
- Baseline commit: `3243f12b0a30a6a122a6468afebd3584c3f8beb2`.
- Freshness assessment: Usable with non-structural documentation drift. The graph refresh performed during WP-274 already contains the new Case 001 source modules; the later accepted commit records that source and documentation closeout.
- Analysis performed: Searched the graph for Case 001 modules and verified findings against `studentCase001.ts`, `studentCase001Progress.ts`, `studentCaseModule.ts`, `useStudentCaseState.ts`, the case library, and the released browser smoke. Searched runtime-facing documentation for stale gate, M1-M3, and no-persistence statements.

### Affected Architecture

- Layers: runtime/UX SSOT, API contract, browser-test guidance, local-runtime scenario guidance, release-readiness limitations, and learner interaction documentation.
- Primary files/components: Case 001 release constants and module, Case 001 progress envelope, student state restoration/reset, query execution milestone contract, browser smoke.
- Upstream consumers: contributors, auditors, local testers, case authors, and future work-package planners.
- Downstream dependencies: accurate release validation, future Case 001 expansion planning, and safe maintenance of Case 004 isolation.

### Regression Surface

- Related tests: no automated test is needed for documentation-only changes; validate source-linked claims with targeted `rg`, review document consistency, run work-package scope/status helpers, and `git diff --check`.
- User workflows: opening Case 001 normally, completing M1/M2 through SQL evidence, reloading with API revalidation, reset without Case 004 storage effects, and running the released live smoke.
- Security/data boundaries: documentation must preserve read-only SQL, backend-evaluated completion authority, non-authoritative local storage, no answer-key exposure, and the M3-M6/suspect-verification deferral.

### Graph Update Decision

- Regeneration required: No.
- Rationale: this package changes documentation only. The current graph has already indexed the relevant WP-274 source modules; no runtime imports, architecture, or database structure change.

## Files Allowed to Change

The live handoff is closeout-only scope after human acceptance.

Allowed:

- docs/01-work-packages/WP-275-case-001-released-runtime-documentation-alignment.md
- docs/00-ssot/SSOT-Investigation-State-Architecture.md
- docs/00-ssot/SSOT-UI-UX-Experience.md
- docs/07-api-contracts/query-execution-endpoints.md
- docs/03-user-testing/Student-Mode-Browser-Test-Guide.md
- docs/11-testing-strategy/frontend-rendering-testing.md
- docs/11-testing-strategy/local-runtime-test-scenarios.md
- docs/10-user-journey/deterministic-learning-model.md
- docs/10-user-journey/frontend-interaction-flow.md
- docs/10-user-journey/investigation-overview.md
- docs/09-release-readiness/known-limitations.md
- docs/00-ssot/END-OF-DAY-HANDOFF.md

Do Not Modify:

- apps/**
- database/**
- scripts/**
- tools/**
- .codex/**
- .understand-anything/**
- package.json
- package-lock.json
- docs/15-case-plans/Case-001-Clocktower-Poisoning-Plan.md
- docs/01-work-packages/WP-273-case-001-tier-1-m1-m2-release-slice-implementation-bundle.md
- docs/01-work-packages/WP-274-case-001-tier-1-release-readiness-and-entry-bundle.md

## Constraints

- Treat WP-274 accepted source and recorded validation as the runtime authority; preserve SSOT authority boundaries where they remain current.
- Describe only the released M1 report and M2 linked-interviews path. Do not revive M3-M6, suspects, or answer-key data through examples or wording.
- Keep browser storage explicitly non-authoritative: stored references are re-executed through the API before milestones restore.
- Preserve Case 004 behavior and state isolation. Do not imply cross-case reset, shared Case 001 threads, accounts, cloud storage, or backend progress history.
- Do not claim fresh validation that this documentation package did not run.

## Required Behavior

- Runtime and UX SSOT describe Case 001 as normally playable in the student library for the two-step Foundations release, with a separate legacy skeleton flag no longer required for normal entry.
- API and browser-test guidance identify both active Case 001 milestone identifiers and the released live smoke command without setting the developer gate.
- Test and runtime scenarios cover M1/M2 evidence, reload/API revalidation, Case 001-only reset, and preservation of Case 004 and unrelated local storage.
- Learning, interaction, overview, and limitation documents accurately distinguish implemented deterministic Case 001 milestone progression and local learner state from still-unimplemented backend/account/cloud persistence.
- Obsolete active-runtime claims that Case 001 is archive locked, M1-M3, component-memory-only, or forbidden from persistence are removed from the allowed current-state documents.

## Acceptance Criteria

- [x] Every allowed runtime-facing document agrees that Case 001 is released for exactly M1-M2 and does not require the skeleton environment flag for normal entry or released smoke.
- [x] Documentation explains Case 001 local-browser state and API revalidation without treating storage as completion authority or changing Case 004 ownership.
- [x] API/test guidance reflects the two milestone contract and actual released live-smoke behavior.
- [x] Broader limitations retain accurate boundaries for backend, account, cloud, query-history, answer-key, and deferred expansion capabilities.
- [x] Targeted source/document consistency checks and `git diff --check` pass; no unrelated files change.
- [x] Independent audit and human acceptance remain separate recorded gates.

## Code Prompt

Implement the documentation alignment exactly within the allowed files. Verify each runtime claim against current WP-274 source and recorded validation rather than historical work packages. Replace stale release-gate, M1-M3, and no-persistence instructions with concise released M1-M2 guidance. Preserve all backend-authority, SQL-safety, Case 004-isolation, and deferred-expansion boundaries. Record changed documents and validation in Code Results. Keep Final Decision pending.

## Audit Prompt

Independently audit the documentation diff against WP-274, active Case 001 source, SQL safety, state-architecture SSOT, and the allowed-file list. Attempt to falsify claimed release behavior, milestone count, storage authority, reset isolation, smoke prerequisites, and Case 004 preservation. FAIL if an allowed current-state document still gives an obsolete active-runtime instruction, if it overstates persistence/progression authority, or if scope drifts into implementation/history rewriting. Confirm graph regeneration was correctly deferred for documentation-only work. Record the verdict and limitations without accepting the work.

## Code Results

Updated the runtime-facing Case 001 documentation to match the accepted WP-274 release.

- Replaced obsolete gated-preview and M1-M3 descriptions with the released M1 report and M2 linked-interviews path.
- Documented normal library entry, learner-owned Case 001 browser state, API revalidation before milestone restoration, and Case 001-only reset that leaves Case 004 and unrelated local storage untouched.
- Updated the API contract, browser guide, rendering strategy, and local runtime scenario to use the released live smoke without a developer environment gate. The request metadata retains `isSkeletonGateEnabled: true` and the response retains its legacy gate name as compatibility details, not a user-facing release requirement.
- Preserved the boundaries on backend/account/cloud persistence, read-only SQL, answer keys, suspect verification, Case 004 ownership, and deferred M3-M6 expansion.

Validation:

- PASS: targeted source inspection of the Case 001 release switch, M1/M2 identifiers, local progress key, revalidation flow, case module, library entry, and released live smoke.
- PASS: targeted stale-claim scan across all changed current-state documents; remaining gate references are explicitly labeled legacy transport compatibility rather than release instructions.
- PASS: `git diff --check`.

No automated test run was needed because this package changes documentation only; source-linked claims were checked against the accepted WP-274 implementation.

## Audit Results

### Independent Audit Report: WP-275 Documentation Alignment

- **Audit Target**: [WP-275](docs/01-work-packages/WP-275-case-001-released-runtime-documentation-alignment.md) and working tree documentation diff on `SequelCityWeb`
- **Audit Baseline**: [WP-274](docs/01-work-packages/WP-274-case-001-tier-1-release-readiness-and-entry-bundle.md), active Case 001 source code, [SSOT SQL Safety Rules](docs/00-ssot/SSOT-SQL-Safety-Rules.md), and [SSOT Investigation State Architecture](docs/00-ssot/SSOT-Investigation-State-Architecture.md)
- **Work Acceptance**: **NOT ACCEPTED** (Recorded as pending human review and decision in [WP-275](docs/01-work-packages/WP-275-case-001-released-runtime-documentation-alignment.md))
- **Verdict**: **PASS**

---

### 1. Scope & Allowed-File Audit

- **Exact Allowed-File Scope**: **PASS**. Exactly 11 files changed (10 modified documentation files + untracked WP-275 work package). Zero out-of-scope files detected.
  - [SSOT-Investigation-State-Architecture.md](docs/00-ssot/SSOT-Investigation-State-Architecture.md)
  - [SSOT-UI-UX-Experience.md](docs/00-ssot/SSOT-UI-UX-Experience.md)
  - [Student-Mode-Browser-Test-Guide.md](docs/03-user-testing/Student-Mode-Browser-Test-Guide.md)
  - [query-execution-endpoints.md](docs/07-api-contracts/query-execution-endpoints.md)
  - [known-limitations.md](docs/09-release-readiness/known-limitations.md)
  - [deterministic-learning-model.md](docs/10-user-journey/deterministic-learning-model.md)
  - [frontend-interaction-flow.md](docs/10-user-journey/frontend-interaction-flow.md)
  - [investigation-overview.md](docs/10-user-journey/investigation-overview.md)
  - [frontend-rendering-testing.md](docs/11-testing-strategy/frontend-rendering-testing.md)
  - [local-runtime-test-scenarios.md](docs/11-testing-strategy/local-runtime-test-scenarios.md)
  - [WP-275-case-001-released-runtime-documentation-alignment.md](docs/01-work-packages/WP-275-case-001-released-runtime-documentation-alignment.md)
- **Git Diff Hygiene**: `git diff --check` passed cleanly with 0 whitespace or conflict errors.
- **No Implementation Drift**: Zero files modified in `apps/**`, `database/**`, `scripts/**`, `tools/**`, or `.codex/**`.
- **No History Rewriting**: Historical work packages ([WP-274](docs/01-work-packages/WP-274-case-001-tier-1-release-readiness-and-entry-bundle.md), [WP-273](docs/01-work-packages/WP-273-case-001-tier-1-m1-m2-release-slice-implementation-bundle.md), WP-240-WP-262) and authoring plans remain untouched.

---

### 2. Falsification Analysis

| Audit Dimension | Evaluated Source & Ground Truth | Audit Finding | Status |
|---|---|---|---|
| **Claimed Release Behavior** | Verified in [`studentCase001.ts:L11-15`](apps/web/src/studentCase001.ts#L11-L15) (`CASE_001_RELEASED = true`, `isCase001PlayableEnabled()`) and [`studentCaseLibrary.ts:L49-60`](apps/web/src/components/student/studentCaseLibrary.ts#L49-L60) (`isUnlocked: true`, `statusLabel: "Open Case"`). Case 001 opens normally without requiring `VITE_ENABLE_CASE_001_PLAYABLE_SKELETON`. | Documentation accurately reflects released status and removes obsolete gate requirement for normal entry. | **Falsification Failed (Verified)** |
| **Milestone Count** | Verified in [`studentCase001.ts:L231-348`](apps/web/src/studentCase001.ts#L231-L348) and [`case001GatedMilestoneEvaluationService.ts:L24-31`](apps/api/src/services/case001GatedMilestoneEvaluationService.ts#L24-L31). Active runtime evaluates exactly two milestones: M1 (`case-001-clocktower-report-located`) and M2 (`case-001-report-interviews-located`). M3-M6, suspect verification, and answer keys are strictly deferred. | All modified docs consistently cite the two-step M1-M2 Foundations path; obsolete M1-M3 and suspect verification references removed. | **Falsification Failed (Verified)** |
| **Storage Authority** | Verified in [`studentCase001Progress.ts:L16-42`](apps/web/src/studentCase001Progress.ts#L16-L42) and [`useStudentCaseState.ts:L809-842`](apps/web/src/useStudentCaseState.ts#L809-L842). Browser storage (`sequel-city.case-001.student-state.v1`) stores only learner notes, view, draft, and query references. Stored completion flags are ignored; milestone restoration requires fresh server-side API re-execution. | All updated docs explicitly define local storage as non-authoritative convenience state and mandate API revalidation. | **Falsification Failed (Verified)** |
| **Reset Isolation** | Verified in [`useStudentCaseState.ts:L2697-2723`](apps/web/src/useStudentCaseState.ts#L2697-L2723) and [`useInvestigationThreads.ts:L253-263`](apps/web/src/features/investigationThreads/useInvestigationThreads.ts#L253-L263). Case 001 reset removes only `sequel-city.case-001.student-state.v1` and resets in-memory Case 001 state. Case 004 storage and threads are disabled and untouched. | Documentation accurately specifies isolated reset behavior that preserves Case 004 and unrelated local storage keys. | **Falsification Failed (Verified)** |
| **Smoke Prerequisites** | Inspected [`case-001-live-smoke.spec.ts:L143-146`](apps/web/tests/browser/case-001-live-smoke.spec.ts#L143-L146). The test runner gate is exclusively `CASE_001_LIVE_SMOKE=1`; it does not check or require `VITE_ENABLE_CASE_001_PLAYABLE_SKELETON`. `isSkeletonGateEnabled: true` is retained solely as an internal API request compatibility field. | Test guides and scenarios updated to reflect true smoke command prerequisites without the developer gate flag. | **Falsification Failed (Verified)** |
| **Case 004 Preservation** | Verified Case 004 files (`studentCase.ts`, `case004Threads.ts`, `threadState.ts`) and regression suite. Case 004 remains fully functional and isolated. | No cross-case leakage, shared threads, or altered Case 004 semantics introduced in documentation. | **Falsification Failed (Verified)** |

---

### 3. Failure Criteria & SSOT Verification

- **Obsolete Active-Runtime Instructions**: Scanned all 10 modified current-state documents. No instructions direct users to set `VITE_ENABLE_CASE_001_PLAYABLE_SKELETON` for normal play, claim Case 001 is archive-locked, describe it as M1-M3, or state that progress cannot be saved locally. Remaining gate references in the API contract are explicitly labeled as legacy backend transport compatibility fields.
- **Authority / Persistence Overstatement**: Documentation in [known-limitations.md](docs/09-release-readiness/known-limitations.md) and [SSOT-Investigation-State-Architecture.md](docs/00-ssot/SSOT-Investigation-State-Architecture.md) clearly separates local browser convenience storage from unimplemented backend, account, cloud, or cross-device persistence.
- **Scope & Boundaries**: Maintained read-only `SELECT` boundaries, deterministic backend evaluation, and rejection of client-side validation authority across all contract and scenario documents.
- **Graph Regeneration**: Correctly deferred. Running [`scripts/check-understand-refresh-readiness.ps1`](scripts/check-understand-refresh-readiness.ps1) confirmed `READY` with 0 tracked artifacts changed. Regeneration was correctly deferred for documentation-only work.

---

### 4. Work Package Status & Limitations

- **Work Package Lifecycle Status**: Running [`scripts/get-work-package-status.ps1 WP-275`](scripts/get-work-package-status.ps1) confirms the package transitioned to `AuditedNeedsFinalDecision`.
- **Audit Limitations**:
  1. Audit was performed via comprehensive diff review and static verification against the accepted WP-274 codebase and test definitions.
  2. The Playwright live smoke test was not rerun in a headless browser during this documentation audit turn, as background dev/API servers were not running and documentation changes do not alter runtime behavior.
- **Work Acceptance**: The work has been recorded as audited with a **PASS** verdict in [WP-275](docs/01-work-packages/WP-275-case-001-released-runtime-documentation-alignment.md), but is **NOT ACCEPTED**. Final decision remains pending human review.

## Final Decision

Accepted on 2026-09-11. The human reviewed the recorded PASS audit, documentation validation evidence, and scope check, then explicitly authorized closeout.

