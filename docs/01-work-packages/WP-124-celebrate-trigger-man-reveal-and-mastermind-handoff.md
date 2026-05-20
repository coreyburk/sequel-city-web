# WP-124: celebrate-trigger-man-reveal-and-mastermind-handoff

## Objective

Upgrade the first suspect confirmation in Student Mode from a technical status update into a meaningful breakthrough moment.

The immediate concerns are:

- the controlled suspect-theory check works, but the current success response is dry and clinical
- the database trigger already returns a flavorful verdict, but the app does not foreground that verdict as the main reward
- the suspect-theory panel disappears as soon as the trigger-man milestone completes, so the student loses the payoff too quickly
- Samuel's next-step guidance and case-progress state do not cleanly advance into the mastermind trail after the first suspect is confirmed

The goal is:

Preserve the working controlled suspect-theory flow from WP-123, but make the first confirmed suspect feel like a major case breakthrough and turn that success directly into the mastermind handoff.

---

## Scope

Implement a Student Mode UX follow-up for the first successful suspect verification.

This WP may modify:

- Student Mode suspect-theory success rendering
- Samuel guidance / objective / lead-card copy after the trigger-man confirmation
- Query Lab support panel copy and tokens for the mastermind handoff
- focused frontend tests
- this work package document

No backend contract changes unless strictly required.
No SQL safety changes.
No new database logic beyond what WP-123 already introduced.

---

## Files Allowed to Change

Allowed:

- apps/web/src/**
- docs/01-work-packages/WP-124-celebrate-trigger-man-reveal-and-mastermind-handoff.md

Do Not Modify:

- apps/api/src/**
- database/**
- docs/00-ssot/**
- package.json files

---

## Constraints

- Preserve the controlled theory-check mechanism from WP-123
- Preserve spoiler-safe guidance
- Show the database-trigger verdict in a student-facing way
- Make the first suspect confirmation feel rewarding, not clinical
- Advance the next step into the mastermind trail clearly

---

## Required Behavior

### 1. Keep The Trigger Verdict Visible

After the student correctly confirms Jeremy Bowers, the app should keep the trigger verdict visible long enough to feel like a breakthrough.

Do not immediately collapse back to a generic success line.

### 2. Celebrate The First Suspect

The success state should clearly communicate:

- the first suspect theory was correct
- Jeremy Bowers is confirmed
- the student unlocked the next layer of the case

The tone should feel rewarding and story-forward.

### 3. Show The Trigger's Actual Flavor

The app should foreground the trigger verdict text itself, not just a paraphrased technical summary.

It is acceptable to summarize around it, but the verdict should be visible.

### 4. Advance Samuel Into The Mastermind Handoff

Once the trigger-man check succeeds:

- Samuel's guidance should stop telling the student to test the first suspect theory
- the objective should advance to the mastermind trail
- the workbench support panel should point students toward the next evidence move, not the already-completed suspect test

### 5. Keep The Next Step Concrete

The next step after Jeremy Bowers is confirmed should direct students toward the murderer's transcript / mastermind trail in a concrete but spoiler-safe way.

### 6. Tests

Update focused frontend tests for:

- the persisted trigger-man celebration state
- the post-success mastermind handoff guidance
- visibility of the trigger verdict or equivalent success rendering

---

## Acceptance Criteria

- the first correct suspect theory produces a clear celebration / breakthrough moment
- the trigger verdict is visible in the student-facing success state
- the suspect-theory success does not collapse immediately into generic feedback
- Samuel guidance advances into the mastermind handoff
- Query Lab support content after success is relevant to the next step
- focused frontend tests updated where practical

---

## Codex Results

Implemented as a frontend follow-up on the accepted WP-123 controlled theory-check flow.

Summary:

- upgraded the suspect-theory panel into a real celebration state after the first correct trigger-man confirmation
- foregrounded the actual trigger verdict so the student sees the database response instead of only a technical confirmation
- kept the solved-theory panel visible after success instead of collapsing immediately back to a flat status line
- advanced Samuel's guidance, the objective, and the available lead into the mastermind trail once Jeremy Bowers is confirmed
- replaced the old post-success suspect-test support panel with a mastermind handoff panel that points students toward the murderer's transcript

Files changed:

- `apps/web/src/App.tsx`
- `apps/web/src/App.test.tsx`
- `apps/web/src/components/student/StudentSuspectTheoryPanel.tsx`
- `apps/web/src/components/student/StudentWorkbenchView.tsx`
- `apps/web/src/studentCase.ts`
- `apps/web/src/styles.css`
- `apps/web/src/useStudentCaseState.ts`

Verification:

- `npm run test --workspace apps/web` passed with `143/143` tests
- `npm run build --workspace apps/web` passed

## Gemini Audit Prompt

Audit WP-124 trigger-man celebration and mastermind handoff polish.

Verify:

1. Only approved frontend files and the WP document changed.
2. The first successful suspect-theory check now produces a visible celebration state instead of a flat technical confirmation.
3. The student-facing success state keeps the trigger verdict visible and readable.
4. The verdict text shown to the student comes from the trigger-backed verification response, not a fabricated placeholder.
5. Samuel's Guidance no longer stays on the first-suspect check after Jeremy Bowers is confirmed.
6. The objective and available next lead now advance into the mastermind trail.
7. Query Lab support content after the trigger-man confirmation points students toward the murderer's transcript rather than the already-completed suspect test.
8. The suspect-theory panel remains visible long enough to deliver the payoff instead of collapsing immediately after success.
9. Focused frontend regression coverage was updated for the celebration state and mastermind handoff.
10. No backend contract, SQL safety rule, or database logic changes were introduced in this WP.

Flag:

- any lingering clinical or purely technical success copy where the breakthrough should feel rewarding
- any case where the trigger verdict is hidden, truncated, or replaced by a generic summary
- any mismatch between Samuel's header guidance, Query Lab support panel, and the actual next mastermind step
- any accidental backend, API, SQL-safety, or database changes in this frontend-only WP

## Gemini Audit Results

Summary:

- only approved frontend files and the WP document changed
- the suspect-theory panel now delivers a visible breakthrough state instead of a flat technical confirmation
- the trigger-backed verdict is foregrounded and remains visible after success
- Samuel guidance, the next objective, and Query Lab support now advance into the mastermind trail once Jeremy Bowers is confirmed
- focused frontend regression coverage was updated for the celebration state and mastermind handoff

Final determination:

The implementation meets the WP-124 objective and acceptance criteria. Approve and close WP-124.

## Final Decision

Accepted.

