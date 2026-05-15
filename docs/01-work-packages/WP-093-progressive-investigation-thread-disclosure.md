# WP-093: progressive-investigation-thread-disclosure

## Objective

Refine the Investigation Thread System so it supports Samuelâ€™s one-step-at-a-time guidance model instead of presenting all investigation trails at once.

This WP reduces cognitive overload by progressively disclosing investigation threads based on the learnerâ€™s current deterministic case progress.

The goal is to make the student experience clearer:

- one primary next investigation thread visible by default
- completed or unavailable threads visually de-emphasized
- future threads hidden or collapsed until relevant
- thread completion aligned with deterministic milestone or evidence state
- optional broader context available without overwhelming the learner

---

## Scope

Update the frontend Investigation Thread System introduced in WP-091.

This WP may modify:

- investigation thread feature module
- evidence board integration
- thread panel UI
- thread filtering and visibility logic
- thread state derivation
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
- docs/01-work-packages/WP-093-progressive-investigation-thread-disclosure.md

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
- Thread visibility must be deterministic and explainable
- Learner reasoning must remain learner-owned

UX constraints:

- Avoid showing all investigation threads by default
- Avoid cognitive overload
- Keep the current next step obvious
- Preserve optional access to broader trail context
- Preserve existing noir visual identity

---

## Required Behavior

### 1. Progressive Thread Disclosure

Update the Investigation Threads panel so the default student view shows only the most relevant current thread or current small set of threads.

Default view should prioritize:

- the thread connected to Samuelâ€™s current next step
- active or newly relevant thread
- unresolved thread tied to current milestone or current evidence state

Do not show all six seed threads as a flat open list by default.

---

### 2. Deterministic Thread Visibility Rules

Implement deterministic visibility rules based on existing frontend gameplay state.

Visibility may be derived from:

- completed milestones
- current active milestone
- notebook evidence entries
- pinned evidence
- existing clue state
- existing case progress state

Thread visibility must be:

- deterministic
- explainable
- spoiler-safe
- not AI-derived

---

### 3. Thread Completion Alignment

Threads should reflect completed or resolved state when the learner has already completed the corresponding deterministic investigation step.

Examples:

- the crime scene thread should not remain visibly â€œNewâ€ after the crime scene evidence has clearly been logged
- the witness thread should become the primary visible thread when Samuel is guiding the learner toward witness discovery
- resolved or completed threads should be visually de-emphasized or moved to a collapsed completed area

Completion should be derived from existing deterministic progress or learner-controlled status where appropriate.

Do not introduce hidden suspect deduction or solution automation.

---

### 4. Student-First Default View

The student default view should answer:

- What am I working on now?
- Why does this thread matter?
- What evidence is connected to it?
- What is the next action Samuel expects?

The default view should not require students to choose from many possible trails at once.

---

### 5. Optional Broader Context

Students may still access broader context through a secondary control such as:

- Show completed trails
- Show later leads
- View all trails
- Case archive

This broader view must be collapsed or secondary by default.

Do not remove learner access to previously discovered or completed trail context.

---

### 6. Mentor Guidance Alignment

Thread guidance should align with Samuelâ€™s current case direction.

Guidance should:

- reinforce the current next step
- reference evidence already discovered
- avoid revealing future trail details too early
- avoid showing premature suspect or mastermind-related language

---

### 7. Visual Hierarchy

Update the visual hierarchy so:

- current thread is prominent
- completed threads are subdued
- future threads are hidden or collapsed
- optional archive controls are secondary
- evidence board remains readable

Preserve the existing noir detective aesthetic.

---

### 8. Tests

Update or add tests for:

- default visible thread behavior
- current thread selection
- completed thread de-emphasis
- future thread hiding or collapsed access
- deterministic visibility based on progress/evidence state

Preserve existing tests.

---

### 9. Documentation

Update user journey documentation to explain:

- progressive thread disclosure
- one-step-at-a-time student guidance
- optional broader trail access
- deterministic visibility rules
- spoiler-safe design intent

Keep documentation concise and implementation-aligned.

---

## Acceptance Criteria

- Investigation Threads no longer displays all seed threads by default
- default student view clearly emphasizes the current relevant investigation thread
- future threads are hidden or collapsed until relevant
- completed threads are visually de-emphasized or collapsed
- thread status/visibility aligns with deterministic progress or evidence state
- Samuelâ€™s current guidance remains the primary next-step signal
- optional access to broader trail context remains available
- spoiler-safe gameplay is preserved
- no runtime AI behavior introduced
- no backend API changes introduced
- no SQL execution behavior changed
- tests updated or added for progressive disclosure behavior
- user journey docs updated

---

## Code Prompt

You are implementing WP-093 for the Sequel City Web Detective project.

Objective:
Refine the Investigation Thread System so threads are progressively disclosed instead of all shown at once.

Problem:
The current Investigation Threads panel displays all seeded trails at once. This creates cognitive overload and conflicts with Samuelâ€™s one-step-at-a-time guidance model. The student should always quickly understand what to do next.

Important:

- Preserve deterministic gameplay principles
- Preserve learner agency
- Preserve spoiler-safe investigation flow
- Preserve Samuelâ€™s one-step-at-a-time guidance model
- No runtime AI behavior
- No automatic suspect deduction
- No backend API changes
- No SQL execution changes
- No broad UI redesign

Before editing:

1. Read docs/00-ssot/SSOT-Investigation-State-Architecture.md
2. Review apps/web/src/features/investigationThreads
3. Review StudentEvidenceBoardView and current evidence board layout
4. Review current milestone/progress/notebook state available to the frontend
5. Review existing tests for investigation threads and student case state

Implement:

1. Progressive thread disclosure:

   - default view shows only the current relevant thread or small current set
   - future trails are hidden or collapsed
   - completed trails are de-emphasized or collapsed
2. Deterministic visibility rules:

   - derive visibility from existing progress, milestone, notebook, pinned evidence, or clue state
   - do not use AI or hidden inference
3. Thread completion alignment:

   - threads should not remain prominently New after their related step is complete
   - current Samuel-guided thread should become visually primary
4. Optional broader context:

   - provide a secondary collapsed or optional way to view completed/later/all trails
   - do not make all trails the default student view
5. Mentor guidance alignment:

   - guidance should focus on the current next investigation step
   - avoid exposing future trail details too early
6. Tests:

   - add or update tests for default visibility, current thread selection, completed/collapsed behavior, and spoiler-safe progressive disclosure
7. Documentation:

   - update docs/10-user-journey to reflect progressive investigation thread disclosure

Do not:

- remove the Investigation Thread System
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

Keep the implementation focused, deterministic, spoiler-safe, and student-centered.

---

## Gemini Audit Prompt

Audit WP-093 progressive investigation thread disclosure implementation.

Verify:

1. Only approved frontend and documentation files were modified.
2. No backend runtime files changed.
3. No database scripts changed.
4. No SQL execution behavior changed.
5. Investigation threads no longer display all seed threads by default.
6. Default student view emphasizes the current relevant thread or current small set.
7. Future threads are hidden, collapsed, or secondary until relevant.
8. Completed threads are de-emphasized or collapsed.
9. Thread visibility is deterministic and derived from existing progress/evidence state.
10. Samuelâ€™s one-step-at-a-time guidance model is preserved.
11. Learner agency remains preserved.
12. No runtime AI behavior was introduced.
13. No automatic suspect deduction was introduced.
14. No hidden automatic case completion was introduced.
15. Optional broader trail context remains available.
16. Tests were added or updated for progressive disclosure behavior.
17. User journey documentation was updated.

Specifically validate:

- default thread visibility
- current thread selection logic
- completed thread presentation
- later/future trail handling
- mentor guidance wording
- spoiler-safe behavior
- frontend architecture alignment
- visual hierarchy
- test coverage
- local-first assumptions

Flag:

- all trails shown by default
- cognitive overload regression
- speculative gameplay systems
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

Implemented WP-093 as a frontend-only, deterministic refinement of the Investigation Thread System.

The main change is a new derived visibility layer in [threadVisibility.ts](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/features/investigationThreads/threadVisibility.ts:1) and the updated [InvestigationThreadsPanel.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/features/investigationThreads/InvestigationThreadsPanel.tsx:1). The default Evidence Board now shows the current Samuel-guided trail first, de-emphasizes milestone-complete trails behind a collapsed `Completed trails` section, and keeps later authored trails hidden behind an optional `Later trails` section. Visibility is derived only from existing frontend state: completed milestones, learner notebook content, and learner-owned thread state. ThereΓÇÖs no AI behavior, no backend/API change, and no automatic suspect deduction.

I wired the panel to existing case progress in [StudentEvidenceBoardView.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/components/student/StudentEvidenceBoardView.tsx:1), added focused tests in [threadVisibility.test.ts](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/features/investigationThreads/threadVisibility.test.ts:1), [InvestigationThreadsPanel.test.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/features/investigationThreads/InvestigationThreadsPanel.test.tsx:1), and [App.test.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/App.test.tsx:487), and updated the user-journey doc in [investigation-thread-system.md](/D:/GitHub-Repos/SequelCityWeb/docs/10-user-journey/investigation-thread-system.md:1).

Verified with `npm run test --workspace apps/web -- InvestigationThreadsPanel threadVisibility App` and `npm run build --workspace apps/web`.

One note: the build created an untracked `apps/web/dist/` folder. I attempted to remove it, but the environment blocked that deletion policy-side, so it remains in the working tree.

## Gemini Audit Results

The audit of WP-093 **Progressive investigation thread disclosure** is complete. The implementation successfully achieves the goal of reducing cognitive overload while preserving SamuelΓÇÖs one-step-at-a-time guidance model.

### **Audit Summary**

1.  **Scope & Boundaries:** Only approved frontend files (`apps/web/src/features/investigationThreads/**`, `apps/web/src/components/student/**`, etc.) and documentation were modified. No backend (`apps/api`) or database changes were introduced.
2.  **Thread Visibility Logic:**
    *   The system now uses a deterministic visibility model (`threadVisibility.ts`) that categorizes threads into **Current**, **Completed**, and **Later**.
    *   **Current trails** are prioritized based on the active milestone (Samuel's guidance) or direct learner engagement (notes, evidence links, or notebook signals).
    *   **Completed trails** are automatically de-emphasized and collapsed once their related milestone is reached.
    *   **Later trails** stay hidden in a collapsed section until they become relevant, preventing spoilers and cognitive overload.
3.  **Deterministic Progression:** Visibility is derived purely from frontend state (`completedMilestones`, `notebookEntries`). String matching in `threadHasNotebookSignal` provides a robust, non-AI way to surface threads if the learner discovers evidence ahead of the guided path.
4.  **SamuelΓÇÖs Guidance Model:** The implementation reinforces the one-step-at-a-time model. The primary thread is clearly marked as "Current focus" and aligns with the active "Do This Next" step.
5.  **User Agency:** The "Later trails" and "Completed trails" sections remain accessible, allowing learners to review the broader board if they choose, maintaining the "learner-owned reasoning" principle.
6.  **Testing & Documentation:**
    *   New unit tests (`threadVisibility.test.ts`) verify that threads are promoted and resolved correctly based on milestones.
    *   Component tests (`InvestigationThreadsPanel.test.tsx`) confirm the UI correctly reflects the visibility model.
    *   The `investigation-thread-system.md` user journey documentation was updated to reflect the new behavior and spoiler-safe intent.

### **Checklist Validation**

- [x] Only approved frontend and documentation files were modified.
- [x] No backend runtime files changed.
- [x] No database scripts changed.
- [x] No SQL execution behavior changed.
- [x] Investigation threads no longer display all seed threads by default.
- [x] Default student view emphasizes the current relevant thread.
- [x] Future threads are hidden/collapsed until relevant.
- [x] Completed threads are de-emphasized/collapsed.
- [x] Thread visibility is deterministic and derived from progress/evidence.
- [x] SamuelΓÇÖs one-step-at-a-time model is preserved.
- [x] Learner agency remains preserved.
- [x] No runtime AI behavior was introduced.
- [x] No automatic suspect deduction was introduced.
- [x] No hidden automatic case completion was introduced.
- [x] Optional broader trail context remains available.
- [x] Tests were added/updated for progressive disclosure.
- [x] User journey documentation was updated.

### **Final Determination**

The implementation is approved. It effectively implements the requested behavior without violating any architectural or gameplay constraints.

## Final Decision

Approved. Progressive thread disclosure is implemented via a deterministic `threadVisibility.ts` layer that categorizes threads as Current, Completed, or Later based solely on existing frontend state — completed milestones, notebook entries, and learner-owned thread status. The default Evidence Board shows only the active Samuel-guided trail; completed trails collapse automatically; later trails stay hidden until relevant. Learner access to the full board is preserved. No backend changes, no SQL changes, no runtime AI, no automatic suspect deduction. `dist/` added to `.gitignore` to prevent build output from being committed. All 16 Gemini audit checklist items passed with no flags.


