# WP-094: derive-investigation-thread-status-from-deterministic-progress

## Objective

Refine the Investigation Thread System so thread status is derived from deterministic case progress instead of requiring students to manually manage thread completion.

This WP removes student-facing meta-progress burden from the thread system. Students should focus on investigating, logging evidence, and reasoning through the case. The application should deterministically track whether a thread is current, completed, later, or needs attention based on existing progress and evidence state.

The goal is to reinforce the learning principle:

Students investigate the case. The system tracks the structure.

---

## Scope

Update the frontend Investigation Thread System introduced in WP-091 and progressively disclosed in WP-093.

This WP may modify:

- investigation thread feature module
- thread visibility and status derivation logic
- thread panel UI
- evidence board integration
- local thread state handling
- thread tests
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
- apps/web/src/App.tsx
- apps/web/src/styles.css
- docs/10-user-journey/**
- docs/01-work-packages/WP-094-derive-investigation-thread-status-from-deterministic-progress.md

Do Not Modify:

- apps/api/**
- database/**
- docs/00-ssot/**
- docs/06-architecture/**
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
- Do not require students to manually mark thread completion
- No runtime AI behavior
- No automatic suspect deduction
- No hidden automatic case completion
- No backend API changes
- No SQL execution changes
- No speculative gameplay systems
- No broad UI redesign

Architecture constraints:

- Frontend remains presentation-oriented
- Backend remains authoritative for SQL validation and execution
- Investigation threads remain gameplay support structures only
- Threads must not become hidden correctness authority
- Thread status must be derived from deterministic state
- Learner reasoning must remain learner-owned

UX constraints:

- Remove student-facing status management burden
- Keep the current next step obvious
- Keep evidence and notes learner-owned
- Preserve optional review of completed and later trails
- Preserve existing noir visual identity

---

## Required Behavior

### 1. Derived Thread Status

Thread status in the student experience must be derived from deterministic state rather than manual student selection.

Status derivation may use:

- completed milestones
- current active milestone
- notebook evidence entries
- linked evidence
- existing clue/progress state
- current Samuel-guided step

Derived student-facing statuses may include:

- Current
- Completed
- Later
- Needs Evidence
- Blocked or Needs Review, only if deterministically supported

Do not require students to choose New, Active, Blocked, or Resolved to advance or organize the investigation.

---

### 2. Remove or De-Emphasize Manual Status Controls

The student-facing Investigation Threads panel should not present status buttons as a required workflow task.

Remove or de-emphasize controls such as:

- New
- Active
- Blocked
- Resolved

If manual status controls are retained for developer mode or future debugging, they must not appear as part of the standard student flow.

---

### 3. Preserve Learner-Owned Controls

Students may still control:

- attaching notebook entries to a thread
- removing linked evidence from a thread
- writing thread notes
- reviewing completed trails
- reviewing later trails when intentionally expanded

Do not remove learner-owned reasoning affordances.

---

### 4. Completion Alignment

Threads should visually align with deterministic case progress.

Examples:

- a thread tied to a completed milestone should appear completed or collapsed
- the thread tied to Samuelâ€™s current next step should appear as the current focus
- future threads should remain later or hidden until relevant
- evidence-linked threads may become visible if the learner discovers relevant evidence early

Do not introduce hidden solution inference or suspect deduction.

---

### 5. Mentor Guidance Alignment

Samuelâ€™s thread guidance should reinforce what the student should do next without making the student manage system state.

Guidance should focus on:

- what evidence to inspect
- what relationship to verify
- what kind of SQL reasoning is useful
- why the current trail matters

Guidance should not say or imply:

- manually mark this thread complete
- change this thread status to proceed
- select the correct status to unlock progress

---

### 6. Persistence Behavior

Local persistence should continue supporting learner-owned content.

Persist:

- thread notes
- evidence attachments
- expanded/collapsed UI preferences where appropriate

Do not persist manual status as student progress authority unless it remains strictly non-authoritative UI preference.

If existing persisted thread status exists, handle it safely:

- do not break hydration
- ignore legacy manual status for student-facing progress when deterministic derived status is available
- avoid data loss for notes and evidence links

---

### 7. Tests

Update or add tests for:

- deterministic status derivation
- completed thread status based on completed milestones
- current thread status based on active guidance
- absence or de-emphasis of student status buttons
- preservation of notes and evidence attachment behavior
- safe handling of persisted legacy status data

Preserve existing tests.

---

### 8. Documentation

Update user journey documentation to explain:

- thread status is system-derived
- students are not responsible for managing thread completion
- learner-owned actions remain evidence logging, note-taking, and reasoning
- deterministic progress drives thread presentation
- spoiler-safe guidance remains preserved

Keep documentation concise and implementation-aligned.

---

## Acceptance Criteria

- student-facing thread status is derived from deterministic progress/evidence state
- manual status controls are removed or de-emphasized from the student flow
- students are not required to mark threads complete
- current thread remains clearly tied to Samuelâ€™s current next step
- completed threads are automatically de-emphasized or collapsed
- later threads remain hidden or secondary until relevant
- learner notes and evidence attachment controls remain available
- legacy persisted status data does not break hydration
- tests cover derived status behavior
- user journey docs updated
- spoiler-safe gameplay is preserved
- no runtime AI behavior introduced
- no backend API changes introduced
- no SQL execution behavior changed

---

## Code Prompt

You are implementing WP-094 for the Sequel City Web Detective project.

Objective:
Refine the Investigation Thread System so thread status is derived from deterministic case progress instead of manually managed by students.

Problem:
The current Investigation Threads panel asks students to set thread status using controls such as New, Active, Blocked, and Resolved. This adds cognitive overhead and conflicts with the goal of simplifying the investigation. Students should investigate, log evidence, and reason. The application should track thread structure automatically from deterministic progress and evidence state.

Important:

- Preserve deterministic gameplay principles
- Preserve learner agency
- Preserve spoiler-safe investigation flow
- Preserve Samuelâ€™s one-step-at-a-time guidance model
- Do not require students to manually mark threads complete
- No runtime AI behavior
- No automatic suspect deduction
- No backend API changes
- No SQL execution changes
- No broad UI redesign

Before editing:

1. Read docs/00-ssot/SSOT-Investigation-State-Architecture.md
2. Review apps/web/src/features/investigationThreads
3. Review threadVisibility.ts and existing progressive disclosure logic
4. Review InvestigationThreadsPanel.tsx
5. Review StudentEvidenceBoardView and current progress/notebook state
6. Review existing tests for investigation threads

Implement:

1. Derived thread status:

   - derive student-facing status from completed milestones, active milestone, notebook entries, linked evidence, and current Samuel-guided state
   - ensure completed milestones automatically de-emphasize or complete related threads
   - ensure the current Samuel-guided thread is clearly marked as the current focus
2. Remove or de-emphasize manual status controls:

   - remove New / Active / Blocked / Resolved buttons from the standard student view
   - do not require students to manually mark a thread complete
   - if any manual status support remains, keep it non-authoritative and outside the standard student workflow
3. Preserve learner-owned controls:

   - attaching notebook entries
   - removing evidence links
   - writing thread notes
   - reviewing completed or later trails intentionally
4. Persistence compatibility:

   - keep notes and evidence attachments persistent
   - safely handle any legacy persisted manual status values
   - do not let legacy manual status override deterministic derived status in the student view
5. Tests:

   - add or update tests for derived status behavior
   - test that student status buttons are absent or no longer part of the required workflow
   - test completed/current/later behavior
   - test persistence compatibility for notes and evidence links
6. Documentation:

   - update docs/10-user-journey to reflect system-derived thread status and reduced student burden

Do not:

- generate SQL automatically
- infer hidden suspect relationships
- implement runtime AI systems
- implement automatic case completion
- modify backend APIs
- change SQL validation logic
- introduce speculative gameplay systems
- reveal hidden suspect identities
- reveal direct solution paths

Preserve:

- frontend architecture boundaries
- deterministic gameplay behavior
- existing gameplay visual identity
- mentor-guided investigation tone
- local-first persistence
- progressive disclosure behavior from WP-093

Keep the implementation focused, deterministic, spoiler-safe, and student-centered.

---

## Gemini Audit Prompt

Audit WP-094 derived investigation thread status implementation.

Verify:

1. Only approved frontend and documentation files were modified.
2. No backend runtime files changed.
3. No database scripts changed.
4. No SQL execution behavior changed.
5. Student-facing thread status is derived from deterministic progress/evidence state.
6. Students are not required to manually mark thread status or completion.
7. New / Active / Blocked / Resolved controls are removed or de-emphasized from standard student flow.
8. Current thread remains tied to Samuelâ€™s current next step.
9. Completed threads are automatically de-emphasized or collapsed.
10. Later threads remain hidden or secondary until relevant.
11. Learner-owned notes and evidence attachment controls remain available.
12. Legacy persisted status data is handled safely.
13. No runtime AI behavior was introduced.
14. No automatic suspect deduction was introduced.
15. No hidden automatic case completion was introduced.
16. Tests were added or updated for derived status behavior.
17. User journey documentation was updated.

Specifically validate:

- derived status logic
- current/completed/later presentation
- absence or de-emphasis of manual student status controls
- persistence compatibility
- mentor guidance wording
- spoiler-safe behavior
- frontend architecture alignment
- visual hierarchy
- test coverage
- local-first assumptions

Flag:

- students still needing to manage thread completion manually
- manual status controls presented as required workflow
- runtime AI implications
- hidden correctness authority
- automatic solution inference
- frontend/backend boundary violations
- duplicated progression logic
- spoiler disclosure risks
- visual regressions
- missing tests

---

## Code Results

All changes are within the allowed scope (frontend features, components, styles, user-journey docs). Typecheck passes; 56/56 tests pass.

## Summary

WP-094 implemented end-to-end:

- **Derived status model** (`threadVisibility.ts`, `types.ts`): added `DerivedThreadStatus = "Current" | "Completed" | "Later" | "Needs Evidence"` computed from completed milestones, primary Samuel-guided thread, stage unlock, learner-attached evidence/notes, and notebook signal. The legacy `thread.status !== "New"` engagement check was removed so the derivation is fully deterministic and cannot be skewed by stale manual status.
- **Student panel** (`InvestigationThreadsPanel.tsx`): removed the New/Active/Blocked/Resolved fieldset and `setThreadStatus` call entirely; the badge now displays the derived label and the description text is sourced from `DERIVED_THREAD_STATUS_DESCRIPTIONS`. The "Current focus" tag still highlights the Samuel-guided thread, and completed/later sections remain collapsible.
- **Learner-owned controls preserved**: notebook-entry attaching, evidence unlinking, and thread notes textarea all unchanged.
- **Persistence compatibility** (`useInvestigationThreads.ts`): hydration still tolerates legacy persisted `status` values (no data loss for notes/evidence), but the student view never reads it; `setThreadStatus` stays on the API surface only for non-authoritative dev/debug.
- **CSS** (`styles.css`): replaced active/resolved/blocked/new badge and modifier styles with `--current`, `--completed`, `--later`, `--needs-evidence`; removed the unused fieldset/button styles.
- **Tests**: rewrote panel tests to assert absence of the manual fieldset and the four status buttons, persistence of notes, and that legacy persisted `Active`/`Resolved` does **not** promote or auto-complete threads in the student view. Visibility tests cover Current/Completed/Later/Needs-Evidence transitions and legacy-status isolation.
- **Docs** (`docs/10-user-journey/investigation-thread-system.md`): rewrote the status section to describe system-derived status and the reduced student burden.

No backend, SQL, schema, or SSOT files were touched.

### Scope Check

Result: PASS - no out-of-scope file changes detected

Allowed patterns
----------------
- apps/web/src/features/investigationthreads/**
- apps/web/src/components/student/**
- apps/web/src/app.tsx
- apps/web/src/styles.css
- docs/10-user-journey/**
- docs/01-work-packages/wp-094-derive-investigation-thread-status-from-deterministic-progress.md

Prohibited patterns (Do Not Modify)
-----------------------------------
- apps/api/**
- database/**
- docs/00-ssot/**
- docs/06-architecture/**
- docs/07-api-contracts/**
- docs/08-database/**
- docs/09-release-readiness/**

Modified files
--------------
- apps/web/src/features/investigationthreads/investigationthreadspanel.test.tsx
- apps/web/src/features/investigationthreads/investigationthreadspanel.tsx
- apps/web/src/features/investigationthreads/index.ts
- apps/web/src/features/investigationthreads/threadvisibility.test.ts
- apps/web/src/features/investigationthreads/threadvisibility.ts
- apps/web/src/features/investigationthreads/types.ts
- apps/web/src/features/investigationthreads/useinvestigationthreads.ts
- apps/web/src/styles.css
- docs/10-user-journey/investigation-thread-system.md
- docs/01-work-packages/wp-094-derive-investigation-thread-status-from-deterministic-progress.md

Out-of-scope files
------------------
- None

## Gemini Audit Results

WP-094 implementation audit complete. The refinement of the Investigation Thread System to use deterministic derived status has been successfully implemented across the frontend and documentation.

### Audit Summary

1.  **Scope and Boundaries**: Confirmed all modifications are restricted to the approved frontend feature modules (`apps/web/src/features/investigationThreads`), components, and documentation. No backend, database, or SSOT files were changed.
2.  **Deterministic Logic**: The new status model (`DerivedThreadStatus`) successfully replaces manual student-facing progress management. Status is derived from:
    *   **Current Stage/Milestone**: Determines the "Current focus" thread.
    *   **Completed Milestones**: Automatically marks threads as "Completed".
    *   **Learner Engagement**: Uses evidence links, notes, and notebook keywords (notebook signal) to promote threads to "Needs Evidence" if touched early.
3.  **UI/UX Alignment**: 
    *   Manual status controls (New, Active, Blocked, Resolved) have been completely removed from the student panel.
    *   The visual hierarchy clearly distinguishes between Current, Completed, and Later trails.
    *   Learner-owned controls (notes, evidence linking) are preserved and functional.
4.  **Persistence**: Hydration logic in `useInvestigationThreads.ts` safely handles legacy `status` values without data loss for notes or evidence links, while ensuring legacy status no longer drives the student UI.
5.  **Tests and Documentation**: 
    *   Comprehensive unit tests (`threadVisibility.test.ts`) and component tests (`InvestigationThreadsPanel.test.tsx`) verify the derivation logic, absence of manual controls, and persistence behavior.
    *   `docs/10-user-journey/investigation-thread-system.md` has been updated to reflect the reduced cognitive burden on the student.

### Verification of Specific Constraints

*   **No Runtime AI**: Verified; all logic is deterministic and keyword/milestone based.
*   **No Automatic Deduction**: Verified; the system only tracks the *structure* of the investigation, not the *solution*.
*   **Spoiler Safety**: Verified; future trails remain hidden in the "Later" section unless specifically surfaced by learner action or stage progression.
*   **Samuel Alignment**: Verified; mentor guidance remains focused on reasoning and does not reference manual status management.

### Conclusion

The implementation fulfills all requirements of WP-094. The system now tracks investigation progress automatically, allowing students to focus on reasoning and evidence gathering rather than managing application state.

Result: **PASS**

## Final Decision

Approved. Investigation thread status is now fully derived from deterministic progress state — completed milestones, the primary Samuel-guided thread, stage unlock, and learner-attached evidence and notes. The manual New/Active/Blocked/Resolved student controls have been removed from the panel. Badge labels now display the derived `DerivedThreadStatus` (Current, Completed, Later, Needs Evidence). Legacy persisted status values are tolerated on hydration with no data loss. Learner-owned note and evidence attachment controls are unchanged. CSS updated to match new derived badge states. Tests rewritten to assert absence of manual controls and correct derivation behavior including legacy-status isolation. User journey documentation updated to reflect reduced student burden. Scope check PASS. Gemini audit: PASS with all 17 checklist items verified, no flags.


