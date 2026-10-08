# Simplify Query Lab guidance across all cases


## Architecture Dependency and Implementation Hold

WP-285 and docs/15-case-plans/CASE-RUNTIME-ARCHITECTURE-IMPROVEMENT-PLAN.md propose database-backed content, backend-owned attempts, and a shared current-task response. Do not implement WP-284 under its existing frontend-only scope. First independently review and accept the architecture contracts, then implement the protected repository/API dependencies. Rewrite WP-284's allowed files and acceptance criteria around the Case 001 vertical slice and Case 004 migration bundles before implementation. The sections below remain a record of the earlier UI proposal, not authorization to bypass these dependencies.

## Objective

Give students in every playable case one shared Query Lab surface with a clear current-step instruction, optional progressively disclosed help, proved facts, and an aligned query starter. Remove duplicate instructional panels and prevent a later-step starter from contradicting validated progression.

## Scope

### In Scope
- Simplify the shared Query Lab for all playable cases: Samuel owns the visible current-step direction. Remove Clocktower Evidence Path, Case Clues, and other standalone witness, gym, suspect, and mastermind instructional panels; retain their essential teaching content in the shared optional hint and their evidence tools in the facts/token area.
- Provide one optional expandable hint adjacent to Samuel's direction, with accessible keyboard operation.
- Retain Pinned Facts and query tokens as evidence tools rather than duplicate instructions.
- Align guidance, hints, and offered starters to the same validated active step/substep under each case's existing progression authority through fresh attempts, progression, resumption, and completion.
- Preserve student-authored SQL and distinguish an offered starter from the current editable draft.
- Keep the Case Briefing focused on proving who committed the crime, with an accurate released-flow limitation.
- Update focused tests, browser smoke, UI/progression documentation, graph artifacts, and closeout handoff.

### Out of Scope
- Changing any case resolution path or backend milestone validation, unlocking planned cases, adding unreleased culprit-solving steps, database changes, or runtime AI.
- Global navigation redesign, new UI libraries, and unrelated query-editor refactoring.

## Impact Analysis

### Understand Status
- Scope revised on 2026-10-08 at the human's request: application-wide presentation, including Case 004; not a Case 001-only patch.
- Post-WP-283 reassessment: graph refreshed at baseline 9237261; HEAD aea394a contains WP-283 tooling changes. Graph remains advisory; current source inspection confirms the shared App/header/workbench composition. Include another graph refresh after this shared UI/state change.
- Analysis tier: Required; cross-module UI, state, persistence, and guidance alignment.
- Graph available: Yes; four tracked artifacts exist.
- Current graph baseline: 9237261c87af0e5fbc42408ba0dc4dba1322b4b7; revised planning HEAD: aea394a.
- Freshness assessment: Refreshed by WP-283; lifecycle normalizer changes are represented in the working-snapshot graph. Commit metadata predates the closeout. Use current source to verify shared UI relationships and refresh after WP-284 implementation.
- Analysis performed: Targeted graph nodes and containment edges identify StudentWorkbenchView, StudentMentorHeader, studentCase001, and useStudentCaseState. Current source verifies App.tsx composes the mentor header and workbench; the Case 001 state branch derives mentorMessage and caseQueryGuide.intro from the same guidance, duplicates nextStep into clues/instructions, and sources the editable SQL draft separately from persisted state.

### Affected Architecture
- Layers: Shared student presentation, authored Case 001 and Case 004 steps/substeps, case module contracts, persisted query draft/state, tests, and UI/progression SSOT.
- Primary files/components: App.tsx, StudentMentorHeader.tsx, StudentWorkbenchView.tsx, studentCase.ts (Case 004 authored steps), studentCase001.ts, studentCaseModule.ts, useStudentCaseState.ts, and studentCase001Progress.ts.
- Upstream consumers: Case selection, fresh/resume selection, backend query evaluation, and evidence restoration.
- Downstream dependencies: QueryRunner, notebook/Pinned Facts, query tokens, active milestone display, and browser smoke. QueryRunner and API validation are read-only dependencies for this package.

### Regression Surface
- Related tests: App.test.tsx; useStudentCaseState.case001.test.tsx; useStudentCaseState.upsert.test.tsx; studentCase001Progress.test.ts; studentCaseModule.test.ts; browser/case-001-live-smoke.spec.ts, student-mode.spec.ts, and outlier-user-path.spec.ts. Run existing web and API suites for shared-component/progression regression coverage.
- User workflows: Fresh start, each released milestone, broad/intermediate queries, logging results, reload/resume, edited drafts, optional hint keyboard access, and completion.
- Security/data boundaries: Backend remains authoritative; no milestone from draft text or local flags. Preserve SQL safety, spoiler protection, and Case 004 evidence and verification authority.

### Graph Update Decision
- Regeneration required: Yes after implementation using scripts/refresh-understand-graph.ps1; this package changes shared UI/state relationships and owns its generated refresh. Verify readiness and review all four allowed artifacts. Do not run a refresh during planning.

## Files Allowed to Change

Allowed:
- apps/web/src/App.tsx
- apps/web/src/App.test.tsx
- apps/web/src/components/student/StudentMentorHeader.tsx
- apps/web/src/components/student/StudentWorkbenchView.tsx
- apps/web/src/studentCase.ts
- apps/web/src/studentCaseModule.ts
- apps/web/src/studentCaseModule.test.ts
- apps/web/src/studentCase001.ts
- apps/web/src/useStudentCaseState.ts
- apps/web/src/useStudentCaseState.case001.test.tsx
- apps/web/src/useStudentCaseState.upsert.test.tsx
- apps/web/src/studentCase001Progress.ts
- apps/web/src/studentCase001Progress.test.ts
- apps/web/src/styles.css
- apps/web/tests/browser/case-001-live-smoke.spec.ts
- apps/web/tests/browser/student-mode.spec.ts
- apps/web/tests/browser/outlier-user-path.spec.ts
- docs/00-ssot/SSOT-UI-UX-Experience.md
- docs/00-ssot/SSOT-Case-Progression.md
- docs/00-ssot/SSOT-Case-Authoring.md
- docs/00-ssot/SSOT-Investigation-State-Architecture.md
- docs/15-case-plans/Case-001-Clocktower-Poisoning-Plan.md
- docs/01-work-packages/WP-284-simplify-case-001-query-lab-guidance.md
- docs/00-ssot/END-OF-DAY-HANDOFF.md
- .understand-anything/knowledge-graph.json
- .understand-anything/fingerprints.json
- .understand-anything/meta.json
- .understand-anything/intermediate/scan-result.json

The handoff file is closeout-only. Styles are limited to the new guidance/hint presentation. Graph files are generated refresh output only.

Do Not Modify:
- apps/api/**
- database/**
- scripts/**
- apps/web/src/components/QueryRunner.tsx
- apps/web/src/studentCase004.ts
- docs/01-work-packages/WP-283-portable-audit-wrapper-tests.md

## Constraints

- Apply the shared presentation to Cases 001 and 004 now, and make it the default contract for future playable case modules. Preserve each case's progression, evidence requirements, and essential instructional content while changing presentation.
- No new dependencies or general progression framework. Use one minimal typed presentation contract shared by all case modules.
- Simplicity check: Reuse the existing authored active step and native disclosure control where suitable. Avoid storing another progression state or repeating the direction in panels, labels, and editor instructions.
- Never silently replace student-authored SQL to make it match the displayed step.
- Known prior issue in Case 001: an InterviewLog draft can be visible alongside report-step guidance. Reproduce and identify its state/restore source rather than assuming the screenshot proves early milestone advancement.

## Shared Presentation Contract

Every playable case supplies an active step key, one primary direction, an optional progressive hint, an optional starter, and evidence-derived tokens to the same header/workbench presentation. Derive this projection from existing validated case state; do not create another progression engine or persist proof flags. A missing hint or starter has an explicit empty state and must never fall back to another case's content.

Case 004's witness bundle, gym, suspect, mastermind employment/event, and verification substeps require specific hints and starter choices. Consolidate their existing content without dropping necessary instructions or introducing spoilers. Keep result feedback, SQL error feedback, reinforcement, and evidence logging as distinct responses to student actions, rather than duplicate next-step instructions.

New playable modules must use this shared contract; locked cases remain locked. The existing file name retains its original slug to preserve WP-284 identity, but its title and scope are application-wide.

## Required Behavior

1. Case Briefing presents the whole-case culprit objective. Query Lab presents one current-step instruction in Samuel's warm mentor voice, without unearned congratulations.
2. Remove separate Clocktower Evidence Path and Case Clues instructional blocks plus Case 004's standalone instructional panels. Retain proved facts and useful tokens without duplicated teaching prose.
3. For every playable case, hint starts collapsed, opens by keyboard, exposes correct expanded state, and provides incremental support rather than repeating the primary direction or revealing unproved identifiers.
4. Derive visible direction, hint, and suggested starter from each case's same validated active step/substep. For Case 001: CrimeType, then CrimeSceneReport, then InterviewLog. A fresh attempt offers SELECT * FROM CrimeType; after CrimeID is proved, the report starter is SELECT * FROM CrimeSceneReport; offer InterviewLog only after the single clocktower report is proved.
5. Treat offered starter and editable draft separately. Preserve custom drafts through incomplete results, logging, reload, and resume; replace a draft only through explicit starter selection or a documented transition from an unchanged app-owned starter. If a preserved draft differs from the active step, present a concise applicable starter action rather than overwriting it or implying the query is the recommended next step.
6. Report queries returning many rows remain editable and cannot advance the student or substitute InterviewLog. Saved evidence is revalidated in order before guidance advances.
7. Pinned Facts contain proved evidence. Query tokens do not advertise unproved CrimeID or ReportID values; retain discovered values and usable schema names.
8. Released completion remains evidence-review completion, not a solved crime; preserve optional exploration drafts and the whole-case distinction.
9. Document the simplified surface responsibilities and validate fresh, intermediate, resumed, and completed states.

## Acceptance Criteria

- [ ] Case 004 regression tests cover every existing instructional panel being consolidated, including witness bundles, identity, gym membership, suspect interviews, mastermind candidates/identity/employment/events, and case verification.
- [ ] Browser validation covers Case 004 fresh start, intermediate step, resume, and completion in addition to the Case 001 live smoke.
- [ ] Switching cases never carries a direction, hint, starter, or proved token from one case into another.
- [ ] Shared future-module guidance contract is documented in Case Authoring SSOT and tested through the module interface.


- [ ] Cases 001 and 004 use the same Query Lab surface: one primary direction, one collapsed optional hint, proved facts/tokens, and the editor; no duplicate instructional panels. Future case modules use this same contract without a Case 001 presentation switch.
- [ ] Guidance and offered starter agree at all three released Case 001 steps and all Case 004 substeps, including reload/resume.
- [ ] Fresh state never claims a clue was found; whole-case briefing and current-step guidance remain distinct.
- [ ] Custom SQL survives incomplete queries and resume; applying a starter is explicit and test-covered.
- [ ] SELECT * FROM CrimeSceneReport WHERE CrimeID = 1080 returning multiple rows does not advance or overwrite the draft.
- [ ] Hint is keyboard-accessible and does not reveal unproved values; proved CrimeID/ReportID facts and tokens remain available.
- [ ] Focused state/UI tests, full web/API regression suites, and live browser smoke pass; validate the running stack from fresh reset plus resume.
- [ ] Case 004 report, witness, gym, suspect, mastermind, and verification flows retain their established evidence gates and content; backend authority, SQL safety, and released completion boundaries are preserved.
- [ ] Documentation and graph refresh align with implemented behavior; scoped diff check and graph readiness pass.

## Code Prompt

Implement the application-wide Query Lab simplification within the allowed scope. Reproduce the guidance/editor mismatch before fixing it. Use a minimal shared presentation contract derived from each case's existing deterministic active step/substep as the source for Samuel's direction, optional hint, and offered starter; retain backend progression authority and distinguish user drafts from app-owned starters. Remove duplicate instructional panels without removing evidence tools. Cover fresh, intermediate, transition, resume, custom-draft, and completion behavior in focused tests and live browser smoke. Update scoped documentation, refresh the graph, and record validation evidence. Leave independent audit and final decision pending.

## Audit Prompt

Independently verify all acceptance criteria against source, tests, and a browser from fresh reset and resume. Check the single-direction presentation, hint accessibility, query starter alignment, custom draft preservation, multi-row report behavior, proved facts/tokens, whole-case briefing distinction, completion limitation, and Case 004 substep coverage and cross-case isolation. Verify graph refresh and allowed scope. Report Verdict: PASS or FAIL, violations, regressions, and drift risks; do not accept on the human's behalf.

## Code Results

Pending.

## Audit Results

Pending.

## Final Decision

Pending.

## Implementation routing update (2026-10-08)

The reviewed architecture is implemented through WP-286 contracts, WP-287 protected bootstrap, WP-288 Case 001/shared Query Lab, WP-289 Case 004 parity and WP-290 authoring/cleanup. WP-288/WP-289 replace this document's frontend-only implementation proposal. Retain this WP as historical design context; do not execute its stale Code Prompt. No completion or acceptance of WP-284 is claimed.
