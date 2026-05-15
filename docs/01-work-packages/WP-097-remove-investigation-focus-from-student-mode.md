# WP-097: remove-investigation-focus-from-student-mode

## Objective

Remove the student-facing Investigation Focus section from Student Mode and preserve the underlying investigation trail system for Developer/Admin use.

The Current Investigation Focus card duplicates Samuelâ€™s guidance and Case Progress, creating cognitive noise instead of improving query success. Students should focus on:

- Samuelâ€™s guidance
- Case Progress
- Query Lab
- Query Results
- Evidence Notebook
- deterministic query reinforcement feedback

The investigation trail system remains valuable, but primarily for Developer/Admin diagnostics, case authoring, future case balancing, and progression debugging.

The guiding principle is:

Students need the next action. Admins need the progression model.

---

## Scope

Update the frontend so Student Mode no longer displays the Current Investigation Focus card or visible investigation trail review.

Preserve the underlying investigation thread architecture where useful, but move student-facing trail visualization out of the standard student experience.

This WP may modify:

- Student Evidence Board rendering
- investigation thread feature exports or usage
- Developer/Admin mode presentation if an existing Developer Mode surface is available
- tests
- user journey documentation

No backend API changes.
No database changes.
No SQL execution changes.
No runtime AI behavior.

---

## Files Allowed to Change

Allowed:

- apps/web/src/features/investigationThreads/**
- apps/web/src/components/student/**
- apps/web/src/components/developer/**
- apps/web/src/App.tsx
- apps/web/src/App.test.tsx
- apps/web/src/styles.css
- docs/10-user-journey/**
- docs/06-architecture/**
- docs/01-work-packages/WP-097-remove-investigation-focus-from-student-mode.md

Do Not Modify:

- apps/api/**
- database/**
- docs/00-ssot/**
- docs/07-api-contracts/**
- docs/08-database/**
- docs/09-release-readiness/**
- package.json files
- build configuration
- runner scripts

---

## Constraints

- Preserve deterministic gameplay principles
- Preserve learner agency
- Preserve spoiler-safe investigation flow
- Preserve Samuelâ€™s one-step-at-a-time guidance model
- Remove redundant student-facing trail UI
- Do not delete useful investigation thread architecture unnecessarily
- No runtime AI behavior
- No automatic suspect deduction
- No hidden automatic case completion
- No backend API changes
- No SQL execution changes
- No speculative gameplay systems
- No broad visual redesign

Architecture constraints:

- Frontend remains presentation-oriented
- Backend remains authoritative for SQL validation and execution
- Investigation threads remain gameplay support structures only
- Threads must not become hidden correctness authority
- Thread status remains deterministic and derived
- Learner reasoning remains learner-owned

UX constraints:

- Student Mode must not display Current Investigation Focus
- Student Mode must not display Review Investigation Trails
- Student Mode must not display future/later trail architecture
- Student Mode should prioritize Samuel, Case Progress, Notebook, Query Lab, and Query Results
- Developer/Admin Mode may expose trails if an existing surface can support it cleanly
- Do not create a large new Admin system in this WP

---

## Required Behavior

### 1. Remove Student-Facing Investigation Focus

Student Mode must no longer show:

- Current Investigation Focus section
- Current Investigation Focus card
- Review investigation trails control
- visible investigation trail summaries
- later trail review
- thread architecture labels as part of the normal student workflow

The Student Evidence Board should remain focused on:

- Evidence Notebook
- Case Progress
- Samuelâ€™s check-in
- completed milestones
- current next step

---

### 2. Preserve Underlying Thread Architecture

Do not remove the investigation thread feature module unless cleanup is clearly safe and scoped.

The thread system may remain available for:

- Developer/Admin Mode
- future case authoring tools
- progression diagnostics
- case balancing
- hidden deterministic state inspection
- future admin-focused visualization

The student should not see the trail system by default.

---

### 3. Developer/Admin Exposure

If the existing Developer Mode has an appropriate place to show trail diagnostics, move or expose the thread visualization there in a lightweight way.

Developer/Admin display may include:

- current derived trail
- completed/later trail states
- thread visibility state
- milestone-to-thread mapping
- local persistence/debug state

If there is no clean existing Developer/Admin surface, do not create a broad new system. Preserve the thread module for future Admin work and document that exposure is deferred.

---

### 4. Preserve Case Progress Authority

Case Progress remains the primary visible student step tracker.

It should continue showing:

- completed milestone count
- current next action
- completed steps
- Samuelâ€™s check-in

Avoid replacing Case Progress with trail terminology.

---

### 5. Preserve Notebook Authority

Evidence Notebook remains the primary student workspace for:

- evidence logging
- clue notes
- learner reasoning
- manual reflections

Do not move note-taking back into trail UI.

---

### 6. Tests

Update or add tests to verify:

- Student Mode does not render Current Investigation Focus
- Student Mode does not render Review Investigation Trails
- Student Evidence Board still renders notebook and case progress
- underlying thread logic remains available if still exported
- Developer/Admin trail display works if implemented
- no backend or database behavior changed

Preserve existing relevant tests.

---

### 7. Documentation

Update user journey documentation to explain:

- Student Mode no longer exposes investigation trails
- Case Progress is the student-facing step tracker
- Notebook is the evidence workspace
- investigation trail architecture is reserved for Developer/Admin or future case-authoring support
- this change reduces cognitive load and reinforces one-step-at-a-time guidance

Keep documentation concise and implementation-aligned.

---

## Acceptance Criteria

- Student Mode no longer displays Current Investigation Focus
- Student Mode no longer displays Review Investigation Trails
- Student Mode no longer displays visible investigation trail lists
- Evidence Notebook remains visible and functional
- Case Progress remains visible and functional
- Samuelâ€™s one-step-at-a-time guidance remains intact
- underlying investigation thread architecture is preserved or cleanly unused
- Developer/Admin exposure is implemented only if it fits existing surfaces
- tests updated for removed student-facing trail UI
- user journey docs updated
- spoiler-safe gameplay is preserved
- no runtime AI behavior introduced
- no backend API changes introduced
- no SQL execution behavior changed

---

## Code Prompt

You are implementing WP-097 for the Sequel City Web Detective project.

Objective:
Remove the student-facing Investigation Focus section from Student Mode while preserving the underlying investigation trail architecture for Developer/Admin or future case-authoring use.

Problem:
The Current Investigation Focus card duplicates Samuelâ€™s guidance and Case Progress. It adds redundant instructional noise and does not directly improve the studentâ€™s ability to create successful SQL queries. Students should focus on Samuelâ€™s guidance, Case Progress, Query Lab, Query Results, and Evidence Notebook.

Guiding principle:
Students need the next action. Admins need the progression model.

Important:

- Preserve deterministic gameplay principles
- Preserve learner agency
- Preserve spoiler-safe investigation flow
- Preserve Samuelâ€™s one-step-at-a-time guidance model
- No runtime AI behavior
- No automatic suspect deduction
- No backend API changes
- No SQL execution changes
- No broad visual redesign

Before editing:

1. Review StudentEvidenceBoardView and current Student Mode rendering.
2. Review App.tsx and how investigationThreads are currently wired.
3. Review apps/web/src/features/investigationThreads.
4. Review existing tests around CurrentInvestigationFocusCard and App rendering.
5. Review docs/10-user-journey/investigation-thread-system.md.

Implement:

1. Remove student-facing trail UI:

   - Student Mode must not render Current Investigation Focus.
   - Student Mode must not render Review Investigation Trails.
   - Student Mode must not render visible investigation trail summaries.
   - Student Evidence Board should focus on Notebook and Case Progress.
2. Preserve useful architecture:

   - Do not delete the investigation thread module unless it is clearly unused and removal is safe.
   - Keep deterministic thread logic available for future Developer/Admin work.
3. Developer/Admin handling:

   - If an existing Developer Mode surface can cleanly display trail diagnostics, expose the trail system there.
   - If not, leave the trail module preserved and document that Admin trail visualization is deferred.
   - Do not create a broad new Admin system in this WP.
4. Preserve student-facing core:

   - Evidence Notebook remains visible and functional.
   - Case Progress remains visible and functional.
   - Samuelâ€™s guidance remains the primary next-step source.
5. Tests:

   - Update tests so they no longer expect Current Investigation Focus in Student Mode.
   - Add or update tests verifying Student Mode does not render Review Investigation Trails.
   - Preserve tests for underlying thread logic if still relevant.
   - Ensure App and StudentEvidenceBoardView tests reflect the simplified student view.
6. Documentation:

   - Update docs/10-user-journey to explain that investigation trails are not student-facing by default.
   - Document that trail architecture is reserved for Developer/Admin diagnostics or future case authoring.
   - Reinforce that Case Progress and Notebook are the student-facing supports.

Do not:

- remove Case Progress
- remove Evidence Notebook
- generate SQL automatically
- infer hidden suspect relationships
- implement runtime AI systems
- implement automatic case completion
- modify backend APIs
- change SQL validation logic
- introduce speculative gameplay systems
- reveal hidden suspect identities
- reveal direct solution paths
- turn trail visualization into another student panel

Preserve:

- frontend architecture boundaries
- deterministic gameplay behavior
- existing gameplay visual identity
- mentor-guided investigation tone
- local-first assumptions
- underlying thread architecture where useful

Keep the implementation focused, deterministic, spoiler-safe, and student-centered.

---

## Gemini Audit Prompt

Audit WP-097 removal of student-facing Investigation Focus UI.

Verify:

1. Only approved frontend and documentation files were modified.
2. No backend runtime files changed.
3. No database scripts changed.
4. No SQL execution behavior changed.
5. Student Mode no longer displays Current Investigation Focus.
6. Student Mode no longer displays Review Investigation Trails.
7. Student Mode no longer displays visible investigation trail lists.
8. Evidence Notebook remains visible and functional.
9. Case Progress remains visible and functional.
10. Samuelâ€™s one-step-at-a-time guidance remains intact.
11. Investigation thread architecture is preserved or cleanly unused.
12. Developer/Admin exposure is implemented only if it fits existing surfaces.
13. No runtime AI behavior was introduced.
14. No automatic suspect deduction was introduced.
15. No hidden automatic case completion was introduced.
16. Tests were updated for the simplified student view.
17. User journey documentation was updated.

Specifically validate:

- StudentEvidenceBoardView rendering
- App rendering expectations
- removed CurrentInvestigationFocusCard usage in Student Mode
- absence of Review Investigation Trails in Student Mode
- Notebook and Case Progress persistence
- preservation of deterministic gameplay architecture
- documentation accuracy
- test coverage
- frontend architecture alignment

Flag:

- Current Investigation Focus still visible in Student Mode
- Review Investigation Trails still visible in Student Mode
- trail lists still visible in Student Mode
- Notebook or Case Progress regression
- accidental deletion of useful deterministic thread architecture
- speculative Admin system creation
- runtime AI implications
- hidden correctness authority
- automatic solution inference
- frontend/backend boundary violations
- spoiler disclosure risks
- missing tests

---

## Code Results

WP-097 implementation complete. All 78 frontend tests pass.

**Student Mode changes** (`StudentEvidenceBoardView.tsx`)
- Removed the `CurrentInvestigationFocusCard` render and the `investigationThreads` prop. Evidence Board now contains only Evidence Notebook + Case Progress.

**Developer/Admin exposure** (new `apps/web/src/components/developer/DeveloperInvestigationThreadsPanel.tsx`)
- A lightweight diagnostics panel that calls the existing `deriveThreadVisibilityModel` and lists threads grouped by derived status (Current / Needs Evidence / Completed / Later). Wired into the existing Developer Mode `.app-grid` in `App.tsx`. No new admin system, no new state, no new logic ΓÇö it reuses the preserved module.

**Preserved**
- `apps/web/src/features/investigationThreads/**` untouched. `CurrentInvestigationFocusCard.tsx` and its tests remain in place but are no longer rendered by the student flow; the trail module is intact for future authoring work.

**Tests** (`App.test.tsx`)
- Flipped the prior Evidence-Board assertions: "Current Investigation Focus", "Anchor the crime scene report", and the "Review investigation trails" button are now asserted absent in Student Mode.
- Added a milestone-progression test verifying trail UI never reappears in Student Mode after stage 1 progression.
- Added a Developer Mode test verifying the diagnostics panel renders the primary thread id and trail ids.

**Docs**
- Rewrote `docs/10-user-journey/investigation-thread-system.md` to describe the system as a Developer/Admin diagnostic surface and document that Case Progress + Notebook are the student-facing supports.
- Updated the index in `docs/10-user-journey/README.md`.
- Filled the Code Results section of the WP file.

No backend, database, SSOT, or API-contract files were touched.

### Scope Check

Result: PASS - no out-of-scope file changes detected

Allowed patterns
----------------
- apps/web/src/features/investigationthreads/**
- apps/web/src/components/student/**
- apps/web/src/components/developer/**
- apps/web/src/app.tsx
- apps/web/src/app.test.tsx
- apps/web/src/styles.css
- docs/10-user-journey/**
- docs/06-architecture/**
- docs/01-work-packages/wp-097-remove-investigation-focus-from-student-mode.md

Prohibited patterns (Do Not Modify)
-----------------------------------
- apps/api/**
- database/**
- docs/00-ssot/**
- docs/07-api-contracts/**
- docs/08-database/**
- docs/09-release-readiness/**

Modified files
--------------
- apps/web/src/app.test.tsx
- apps/web/src/app.tsx
- apps/web/src/components/student/studentevidenceboardview.tsx
- docs/10-user-journey/readme.md
- docs/10-user-journey/investigation-thread-system.md
- apps/web/src/components/developer/
- docs/01-work-packages/wp-097-remove-investigation-focus-from-student-mode.md

Out-of-scope files
------------------
- None

## Gemini Audit Results

Audit of WP-097 complete. The implementation successfully removes the student-facing Investigation Focus UI while preserving the underlying deterministic trail architecture for Developer/Admin use.

### Verification Results

1.  **Scope Integrity**: Verified that only approved frontend and documentation files were modified. `apps/api/`, `database/`, and `docs/00-ssot/` remain untouched.
2.  **Student Mode Simplification**: Verified `StudentEvidenceBoardView.tsx` and `App.tsx`. The `CurrentInvestigationFocusCard` and investigation trail review controls have been removed from the student experience.
3.  **Core Tool Persistence**: Confirmed that **Evidence Notebook** and **Case Progress** remain primary student-facing features. Samuel's one-step-at-a-time guidance and the deterministic query reinforcement feedback loop are intact.
4.  **Developer Diagnostics**: A new `DeveloperInvestigationThreadsPanel.tsx` has been implemented and wired into Developer Mode, providing visibility into the trail model for debugging and authoring without exposing it to students.
5.  **Architectural Preservation**: The `investigationThreads` feature module remains fully functional and exported, ensuring the investment in deterministic trail logic is preserved for future use.
6.  **Test Validation**: `App.test.tsx` was updated to assert the absence of trail UI in Student Mode and verify the new diagnostic panel in Developer Mode. All 78 frontend tests pass.
7.  **Documentation Accuracy**: `docs/10-user-journey/investigation-thread-system.md` has been updated to reflect the new boundary, clarifying that trails are now a diagnostic surface rather than a primary student workspace.

### Key Observations
- **No Boundary Violations**: No backend logic or database schemas were modified.
- **No Spoiler Leakage**: The removal of trail summaries from Student Mode further protects the discovery-led investigation flow.
- **Clean Extraction**: The UI extraction was surgical, leaving the underlying `useInvestigationThreads` hook available for the developer panel.

The implementation is fully aligned with the WP-097 objectives and constraints.

**Verdict: PASS**

## Final Decision

Approved. Current Investigation Focus and Review Investigation Trails are removed from Student Mode. `StudentEvidenceBoardView` now renders only Evidence Notebook and Case Progress. The underlying `investigationThreads` feature module and `CurrentInvestigationFocusCard` are preserved intact. A new `DeveloperInvestigationThreadsPanel` reuses the existing `deriveThreadVisibilityModel` to surface thread diagnostics grouped by derived status in Developer Mode only — no new state, no new logic. `App.test.tsx` updated to assert trail UI is absent in Student Mode and present in Developer Mode. Scope check PASS. Gemini audit: PASS with all 17 checklist items verified, no flags.


