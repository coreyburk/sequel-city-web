# student experience definition and task flow baseline

## Objective

Establish a clear, testable student-focused UX baseline that defines target learners, core task flows, and success criteria so the product can transition from a developer-first interface to a student-first experience.

## Scope

### In Scope

- Define student personas and learning-context assumptions for current runtime.
- Define top student tasks and expected end-to-end flow steps.
- Define measurable UX success criteria for upcoming manual testing sessions.
- Align existing user-journey and user-testing docs to the student-first direction without changing runtime behavior.

### Out of Scope

- Any frontend or backend implementation changes.
- Any new API endpoints or data model changes.
- Any redesign work in `apps/web`.
- Any automation or CI changes.

## Files Allowed to Change

- docs/01-work-packages/WP-040-student-experience-definition-and-task-flow-baseline.md
- docs/10-user-journey/investigation-overview.md
- docs/10-user-journey/learner-workflow.md
- docs/10-user-journey/frontend-interaction-flow.md
- docs/03-user-testing/Structured-User-Testing-Plan.md
- docs/03-user-testing/Session-Data-Collection-Guide.md

## Constraints

- Preserve existing backend-authority and deterministic-behavior boundaries.
- Preserve spoiler-safe principles and no-AI-runtime constraints.
- Keep edits concrete, implementation-aligned, and non-speculative.
- Do not imply features that are not currently implemented.

## Required Behavior

- Add a student-focused UX baseline section across user-journey docs that explicitly distinguishes:
  - current implemented experience
  - student-first target direction for near-term WPs
- Define the top 3 student tasks for usability testing:
  - orient to case context
  - run and interpret safe query feedback
  - verify suspect and explain reasoning outcome
- Add explicit success metrics and observation fields to the user-testing plan for those tasks.
- Keep all changes documentation-only and scoped to allowed files.

## Acceptance Criteria

- [ ] Student UX baseline is documented in user-journey docs with clear current-vs-target distinction.
- [ ] Top 3 student task flows are documented with observable completion steps.
- [ ] Structured user-testing plan and data-collection guide include measurable task success criteria for student testing.
- [ ] Documentation remains aligned with current runtime constraints and does not introduce speculative feature claims.
- [ ] No files outside allowed list changed.

## Codex Prompt

Implement WP-040 as documentation-only alignment for student-focused product direction.

Do:

- update allowed user-journey and user-testing docs with a concrete student UX baseline
- define top task flows and measurable UX success criteria for upcoming sessions

Do not:

- modify runtime code
- add speculative non-implemented behaviors
- edit files outside allowed list

Return:

- files changed
- student task-flow summary
- success-criteria summary
- scope confirmation

## Gemini Audit Prompt

Audit WP-040 student experience definition and task-flow baseline.

Verify:

1. Only allowed files were modified.
2. Student UX baseline is explicit and distinguishes current implemented behavior vs target direction.
3. Top 3 student task flows are clearly defined and testable.
4. User-testing plan includes measurable success criteria aligned to those tasks.
5. No speculative or non-implemented runtime behavior was introduced.

Output:

- Verdict: PASS or FAIL
- Violations
- Regressions
- Drift risks

## Codex Results

Completed:

- Created WP-040 to establish student-focused UX baseline and measurable testing criteria.
- Added student baseline context to investigation overview with explicit current-vs-target distinction.
- Added top 3 student task flow completion steps to learner workflow.
- Added student-focused UX direction to frontend interaction flow while preserving presentation-only boundaries.
- Added measurable student baseline metrics to structured user-testing plan.
- Added explicit student baseline evidence fields to the session data collection guide.

Updated Files:

- docs/01-work-packages/WP-040-student-experience-definition-and-task-flow-baseline.md
- docs/10-user-journey/investigation-overview.md
- docs/10-user-journey/learner-workflow.md
- docs/10-user-journey/frontend-interaction-flow.md
- docs/03-user-testing/Structured-User-Testing-Plan.md
- docs/03-user-testing/Session-Data-Collection-Guide.md

Validation Performed:

- Confirmed docs-only scope.
- Confirmed no runtime code, API contract code, or database files were modified.

Acceptance Criteria Status:

- [X] Student UX baseline is documented in user-journey docs with clear current-vs-target distinction.
- [X] Top 3 student task flows are documented with observable completion steps.
- [X] Structured user-testing plan and data-collection guide include measurable task success criteria for student testing.
- [X] Documentation remains aligned with current runtime constraints and does not introduce speculative feature claims.
- [X] No files outside allowed list changed.

## Gemini Audit Results

Audit of WP-040 student experience definition and task-flow baseline is complete.

- Verdict: PASS
- Violations: None.
- Regressions: None.
- Drift risks: None.

  Verification Summary

1. Scope Control: Only the allowed documentation files were modified. No runtime code or database changes were introduced.
2. Explicit Student UX Baseline: docs/10-user-journey/investigation-overview.md now explicitly distinguishes between the "Current Implemented Experience"
   (development-oriented) and the "Student-First Target Direction" (improving clarity and flow guidance).
3. Testable Task Flows: docs/10-user-journey/learner-workflow.md defines the top 3 student task flows (Orient, Query Feedback, Suspect Verification) with clear,
   observable completion steps.
4. Measurable Success Criteria: docs/03-user-testing/Structured-User-Testing-Plan.md and docs/03-user-testing/Session-Data-Collection-Guide.md have been updated
   with concrete metrics (e.g., time-to-readiness, interpretation accuracy) and dedicated evidence collection fields.
5. Alignment with Implementation: All documentation updates respect the established "presentation-only" frontend boundaries and current backend-authority model.
   No speculative or non-implemented features (such as notebook persistence or automated case progression) were documented as currently present.

  Files Modified

- docs/01-work-packages/WP-040-student-experience-definition-and-task-flow-baseline.md
- docs/10-user-journey/investigation-overview.md
- docs/10-user-journey/learner-workflow.md
- docs/10-user-journey/frontend-interaction-flow.md
- docs/03-user-testing/Structured-User-Testing-Plan.md
- docs/03-user-testing/Session-Data-Collection-Guide.md

  Strategic Intent: Audit WP-040 student experience definition and task-flow baseline.

  Audit Verdict: PASS

## Final Decision

Approved.

Reason:
Codex stayed within allowed documentation scope and Gemini returned PASS with no violations, regressions, or drift risks. The student UX baseline, task-flow definitions, and measurable testing criteria are now established for upcoming student-focused product work.
