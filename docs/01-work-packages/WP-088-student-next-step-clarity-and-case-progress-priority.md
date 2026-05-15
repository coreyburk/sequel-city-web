# WP-088: Student Next-Step Clarity And Case Progress Priority

## Objective

Refine the Student Mode `Case Progress` experience so students can immediately tell the one thing they should do next, without having to infer whether they should answer `Samuel's Check-In` or return to `Query Lab`.

## Background

Recent Student Mode work substantially improved the workspace:

- `WP-084` refined Query Lab usability and reference access
- `WP-085` defined the accepted long-term progression model
- `WP-086` added selective query-building assistance
- `WP-087` refined the Case File overlay into a clearer temporary reference layer

Those improvements strengthened the student experience, but the current `Case Progress` panel still presents a progression ambiguity:

- `Current Action` can point students back to `Query Lab`
- `Samuel's Check-In` sits immediately below and also looks actionable
- both surfaces appear important, but the UI does not clearly state whether the question is required now, optional now, or meant for later

This creates hesitation at the exact moment students should feel guided momentum.

The next step is not to add more content. It is to establish a strict priority model so Student Mode always communicates one primary next move.

## Scope

### In Scope

- Clarify the relationship between `Current Action` and `Samuel's Check-In` in the Evidence Board.
- Establish a single primary next-step model for the student-facing progression panel.
- Make it explicit whether the reasoning question is:
  - required before continuing, or
  - optional reinforcement after the current action
- Refine labels, helper copy, and emphasis so the next required action is unmistakable.
- Update relevant frontend tests.
- Record the implementation and verification in this work package.

### Out of Scope

- Rewriting case progression rules or Samuel's core milestone logic.
- Adding new progression systems from `WP-085` beyond what is necessary for clarity.
- New backend, API, or database work.
- Full redesign of Evidence Board or Query Lab layout.
- Introducing persistence, profiles, or save-state work.

## Files Allowed To Change

- `docs/01-work-packages/WP-088-student-next-step-clarity-and-case-progress-priority.md`
- `apps/web/src/components/student/StudentEvidenceBoardView.tsx`
- `apps/web/src/components/student/StudentProgressPanel.tsx`
- `apps/web/src/App.tsx`
- `apps/web/src/App.test.tsx`
- `apps/web/src/studentCase.ts`
- `apps/web/src/styles.css`
- `apps/web/src/useStudentCaseState.ts`

Only change additional frontend files if directly required by verification.

## Constraints

- Keep the work frontend-only.
- Preserve Samuel as the single mentor voice.
- Do not expose later case clues earlier than currently earned.
- Do not create two equal-weight primary actions in the same state.
- Keep the solution deterministic and easy for students to parse quickly.

## Required Behavior

- The Evidence Board must present only one clearly primary next step at a time.
- Students must be able to tell immediately whether `Samuel's Check-In` is:
  - required now, or
  - optional now
- `Current Action` and `Samuel's Check-In` must no longer compete as equal next steps.
- Button labels and helper text must reflect the actual sequence instead of forcing students to infer it.
- The clarified flow must preserve current spoiler boundaries and earned-clue discipline.

## Acceptance Criteria

- [ ] The Evidence Board shows one primary next action at a time.
- [ ] Students can clearly tell whether the reasoning question is required or optional.
- [ ] `Current Action` and `Samuel's Check-In` no longer compete for equal attention.
- [ ] The case-progress wording reflects the true action order.
- [ ] Existing milestone flow remains intact.
- [ ] No later clues are exposed early.
- [ ] Updated frontend tests cover the clarified priority model.
- [ ] No backend or API files are changed.

## Codex Prompt

Implement WP-088 in the Student Mode frontend.

Primary goal:

- make the next required student action unmistakable inside `Case Progress`

The current issue:

- `Current Action` and `Samuel's Check-In` both look actionable
- students cannot quickly tell whether they should answer the question now or return to `Query Lab`

Implementation expectations:

- establish one primary next-step model
- make the question explicitly required or explicitly optional in the UI
- refine labels, emphasis, and helper copy so the sequence is obvious
- preserve Samuel as the mentor voice
- preserve current case progression and spoiler boundaries
- update tests
- run `npm run test --workspace apps/web`
- update this work package with implementation and verification

Return:

- exact files changed
- how the next-step hierarchy was clarified
- verification results

## Gemini Audit Prompt

Audit WP-088 against the student next-step clarity objective.

Verify:

- the Evidence Board now presents one primary next action at a time
- `Samuel's Check-In` is clearly marked as required or optional
- students no longer have to infer the order between answering the question and returning to Query Lab
- no later clues are exposed early
- the work remains frontend-only
- no unrelated progression systems were changed

Output:

- Verdict: PASS or FAIL
- UX strengths
- Residual ambiguity risks
- Scope violations, if any

## Codex Results

Implemented in:

- `apps/web/src/components/student/StudentEvidenceBoardView.tsx`
- `apps/web/src/App.tsx`
- `apps/web/src/App.test.tsx`
- `apps/web/src/studentCase.ts`
- `apps/web/src/styles.css`
- `apps/web/src/useStudentCaseState.ts`

Changes made:

- Replaced the competing `Current Action` treatment with a single primary `Do This Next` surface for handoff, lead-card, active-lead, and fallback states.
- Reworded the first handoff action so Samuel still feels active in the mentorship: he has created the queued `CrimeSceneReport` query, and the student uses Query Lab to inspect it and find the entry for this crime.
- Removed redundant `Return to Query Lab` / `Continue in Query Lab` buttons from the `Case Progress` panel so the visible tab navigation remains the only route back to Query Lab.
- Kept milestone progress between the primary next action and the reasoning question, so students see sequence before optional reinforcement.
- Demoted `Samuel's Check-In` to `Optional Samuel's Check-In` and updated its helper copy to explicitly say it is optional reinforcement.
- Added a higher-contrast primary next-action treatment with a subtle pulse so the correct next task is visually distinct from the optional check-in.
- Removed the now-unused `setStudentView` prop from `StudentEvidenceBoardView` and its caller.
- Aligned Samuel's staged reaction copy and the evidence-log success feedback with the same "Use Query Lab next" wording so the primary handoff stays consistent across the student flow.
- Updated app-level tests to cover the clarified next-step hierarchy, removed redundant return button, and optional-check-in wording.

Verification:

- `npm run test --workspace apps/web`
- `npm run build --workspace apps/web`

Results:

- Web tests passed: 7 files, 39 tests.
- Web production build passed.

## Gemini Audit Results

The following audit evaluates the implementation of **WP-088** against the student next-step clarity objective.

### Verdict: PASS

The implementation successfully establishes a strict visual and cognitive hierarchy in the Student Mode Evidence Board, ensuring students always have a single, unmistakable primary action.

---

### UX Strengths
- **Single Source of Truth:** The replacement of competing actions with a unified `Do This Next` surface eliminates the "where do I go now?" hesitation.
- **Actionable Handoffs:** Rewording the handoff text (e.g., Samuel has created a query for the student to inspect) maintains Samuel's active mentorship role while clearly directing the student to the Query Lab.
- **Affordance through Animation:** The addition of a subtle pulse animation on primary actions provides a clear visual signal that does not rely solely on text parsing.
- **Intentional Demotion:** Explicitly labeling Samuel's Check-In as "Optional" and using secondary typography (reduced opacity/contrast) clearly separates case progression from knowledge reinforcement.
- **Navigational Purity:** Removing the redundant "Return to Query Lab" buttons from the progress panel forces reliance on the primary tab navigation, reinforcing a consistent mental model of the workspace layout.

### Residual Ambiguity Risks
- **Tab Awareness:** Students who rely heavily on in-context buttons rather than top-level navigation might momentarily look for a "Go" button to reach the Query Lab, though the persistent tabs are standard and accessible.
- **Manual Note Proximity:** While the notebook and case progress are distinct sections, the "Add Note" button remains visually heavy; however, its placement in the left rail (or top in stacked views) sufficiently separates it from the case progression flow.

### Scope Violations
- **None:** The work was strictly limited to the frontend (`.tsx`, `.css`, `.test.tsx`). No backend, API, or database changes were introduced, and no unrelated progression systems (like the Detective Rank system) were modified.

---

### Verification Summary
- **Primary Action:** Verified logic in `StudentEvidenceBoardView.tsx` renders exactly one `Do This Next` block.
- **Optionality:** Verified `Optional Samuel's Check-In` label and helper copy.
- **Tests:** Verified `App.test.tsx` covers the removal of redundant buttons and the new labeling.
- **Styling:** Verified `styles.css` contains the pulse animation and high-contrast primary treatment.
Warning: 256-color support not detected. Using a terminal with at least 256-color support is recommended for a better visual experience.
Ripgrep is not available. Falling back to GrepTool.

## Final Decision

Accepted.

WP-088 meets the next-step clarity objective and the Gemini audit passed without scope violations.
The accepted implementation keeps the work frontend-only, preserves milestone flow and spoiler boundaries, and makes the Evidence Board present one clearly primary next action while marking Samuel's Check-In as optional reinforcement.

