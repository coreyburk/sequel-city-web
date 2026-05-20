# WP-125: improve-query-construction-feedback-and-mastermind-transition

## Objective

Refine the Student Mode experience after the trigger-man reveal by improving two weak points:

- query-construction feedback is not helpful enough when the student writes malformed or incomplete SQL
- the transition from confirming the murderer into investigating the mastermind is still too abrupt and not guided enough

The goal is:

Keep the stronger WP-124 breakthrough moment, but make the next investigative move feel smoother and make failed or malformed query attempts easier for students to recover from.

---

## Scope

Implement a Student Mode UX follow-up that addresses:

- better feedback for malformed or incomplete student queries
- clearer support when a required keyword or clause is missing
- a smoother handoff from trigger-man confirmation into the mastermind trail
- alignment between Samuel's guidance, Query Lab support panels, Query Runner instructions, and the next concrete student action
- focused frontend regression coverage
- this work package document

This WP is frontend-only.

---

## Files Allowed to Change

Allowed:

- apps/web/src/**
- docs/01-work-packages/WP-125-improve-query-construction-feedback-and-mastermind-transition.md

Do Not Modify:

- apps/api/src/**
- database/**
- docs/00-ssot/**
- package.json files

---

## Concerns To Address In Implementation

### 1. Better Query-Construction Feedback

When a student submits SQL that is malformed or incomplete, the current response is not instructional enough.

The implementation should consider:

- detecting common student mistakes like missing `FROM`, `WHERE`, `SELECT`, or malformed filter syntax
- turning generic backend/database errors into more student-friendly guidance where safe
- distinguishing between:
  - invalid SQL structure
  - missing required narrowing clues
  - backend/database availability problems

The experience should help the student recover, not just fail.

### 2. Smoother Mastermind Transition

After the trigger-man reveal, the app should carry students more clearly into the mastermind investigation.

The implementation should consider:

- whether the mastermind handoff should direct students to a broad `InterviewLog` review first, then narrowing
- whether Samuel should more explicitly explain why the transcript matters
- whether the workbench should make the first mastermind-step query easier to understand without over-solving it
- whether the evidence/progression view should better reflect the transition from solved suspect to new investigation thread

### 3. Keep Guidance Surfaces Aligned

The following surfaces should stay synchronized:

- Samuel's Guidance header
- Query Lab support panel
- Query Runner helper copy
- Case Progress / current step

They should all point to the same next move during the mastermind ramp.

---

## Acceptance Criteria

- malformed student queries receive more helpful, student-facing guidance
- missing-keyword or missing-clause attempts are easier to recover from
- backend outages are not confused with student SQL mistakes
- the trigger-man reveal flows naturally into the mastermind trail
- Samuel guidance and Query Lab support stay aligned through that transition
- the implementation preserves spoiler-safe guidance and scaffold taper discipline
- focused frontend tests updated where practical

---

## Codex Results

Implemented as a frontend-only Student Mode refinement.

Summary:

- added student-side query-construction coaching in `QueryRunner` for missing `SELECT`, missing `FROM`, incomplete `WHERE`, incomplete `ORDER BY`, and similar recoverable SQL structure mistakes
- translated backend syntax-style query failures into more student-friendly recovery guidance while preserving backend/database setup guidance when the issue is environmental
- tightened the mastermind handoff so Samuel, Query Lab, and Query Runner now point students toward isolating Jeremy Bowers' `InterviewLog` rows tied to the pinned murder report
- updated the mastermind support panel and post-breakthrough query guidance so students can start broad with `InterviewLog`, then narrow with pinned facts without being handed a solved query
- updated focused frontend regression coverage for the new query coach and the refined mastermind transition

Files changed:

- `apps/web/src/App.test.tsx`
- `apps/web/src/components/QueryRunner.test.tsx`
- `apps/web/src/components/QueryRunner.tsx`
- `apps/web/src/components/student/StudentWorkbenchView.tsx`
- `apps/web/src/features/queryReinforcement/generateReinforcement.ts`
- `apps/web/src/studentCase.ts`
- `apps/web/src/useStudentCaseState.ts`
- `docs/01-work-packages/WP-125-improve-query-construction-feedback-and-mastermind-transition.md`

Verification:

- `npm run test --workspace apps/web` passed with `146/146` tests
- `npm run build --workspace apps/web` passed

## Gemini Audit Prompt

Audit WP-125 query-construction feedback and mastermind transition refinement.

Verify:

1. Only approved frontend files and the WP document changed.
2. Student malformed-query feedback is more helpful for missing or incomplete SQL structure such as missing `FROM`, incomplete `WHERE`, or incomplete `ORDER BY`.
3. Student-facing malformed-query feedback does not expose unnecessary backend jargon when the issue is just recoverable SQL structure.
4. Backend/database outage guidance is still preserved and not confused with student SQL mistakes.
5. The post-trigger-man mastermind handoff is more concrete than before and points students toward isolating the murderer's transcript from `InterviewLog`.
6. Samuel's Guidance, Query Lab support, Query Runner instruction, and Query Runner failure guidance all stay aligned during the mastermind transition.
7. The implementation remains spoiler-safe and does not over-scaffold the mastermind query into a solved answer.
8. Focused frontend regression coverage was updated for both the query coach and the mastermind transition.
9. No backend, SQL safety, or database changes were introduced.

## Gemini Audit Results

The audit of **WP-125: improve-query-construction-feedback-and-mastermind-transition** is complete. All requirements have been verified successfully.

### Audit Findings

1.  **File Integrity & Scope:** The implementation is strictly confined to the approved frontend files and the work package document. No changes were introduced to the backend, SQL safety layers, or database schemas.
2.  **Query Construction Feedback:**
    *   `QueryRunner.tsx` now provides proactive, helpful feedback for common SQL structural mistakes (missing `FROM`, incomplete `WHERE`, `ORDER BY`, or `LIKE` patterns) before attempting execution.
    *   Backend syntax errors are caught and translated into a generic but actionable student recovery hint, successfully hiding technical jargon.
    *   Environment/outage guidance (e.g., "Backend unavailable") is correctly preserved and prioritized over SQL coaching.
3.  **Mastermind Transition Refinement:**
    *   The post-trigger-man handoff is significantly more concrete. Samuel now explicitly directs students to isolate Jeremy Bowers' confession by narrowing `InterviewLog` with his pinned `PersonID` and the murder `ReportID`.
    *   Alignment is maintained across Samuel's Guidance, Query Lab support panels, and Query Runner instructions, ensuring a cohesive experience as students enter the final investigative phase.
    *   The implementation is spoiler-safe; it provides the "how" (isolating the transcript) without giving away the final query or the mastermind's identity.
4.  **Regression & Validation:**
    *   `QueryRunner.test.tsx` includes new test cases for the query coach (missing `FROM`, incomplete `WHERE`, and syntax translation).
    *   `App.test.tsx` was updated to verify the full end-to-end flow of the trigger-man reveal and the subsequent mastermind transition.

### Final Result
**Audit Status:** PASS
**Recommendation:** The changes are ready for final review and approval.

## Final Decision

Accepted.

