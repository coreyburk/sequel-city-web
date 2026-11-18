# WP-320 Case version and fresh attempt feedback

## Objective
Identify the content version on the Evidence Board and clarify the menu action that starts a new attempt. The installed Case 001 has three milestones and the current preview has six. Use the attempt snapshot for both the count and version. Place the final theory submission directly in the Case Progress column so it stays visible beside the notebook. Scope is presentation only.

## Files Allowed to Change

Allowed:

- `apps/web/src/App.tsx`
- `apps/web/src/App.test.tsx`
- `apps/web/src/components/student/StudentQueryLab.tsx`
- `apps/web/src/components/student/StudentQueryLab.test.tsx`
- `apps/web/src/components/student/ProtectedCasePresentation.tsx`
- `docs/01-work-packages/WP-320-case-version-and-fresh-start.md`

## Code Prompt
Show the pinned case version with the milestone count. Clarify Start Fresh Attempt, preserve saved work, and reset transient screen state when the attempt changes.

## Audit Prompt
Check that the server still owns counts, guidance and saved progress. Verify the new attempt opens the briefing with an empty draft and that the former attempt remains available.

## Code Results
App and StudentQueryLab tests passed, including 36 combined tests and submission placement for both cases. TypeScript passed. Previously, all 17 App tests passed, including a menu restart from a partially completed six-step attempt, return to the briefing, empty editor and zero-of-six board. Read-only SQL inspection found three steps for the installed older versions and six for preview v3.

## Audit Results
An independent audit of **WP-320** has been completed. All requirements **PASS**.

### Summary of Audit Findings

| Requirement | Status | Verification Summary |
| :--- | :--- | :--- |
| **Server still owns counts, guidance, and saved progress** | **PASS** | Milestone counts, case content version, step status, mentor guidance, theory options, and saved workspace state are read directly from the server's `AttemptSnapshot` and `CaseDossier` without client-side authority or hardcoded counts. |
| **New attempt opens the briefing with an empty draft** | **PASS** | Starting a fresh attempt creates a server workspace with `selectedView: "briefing"`, `draftSql: ""`, and `notes: []`, replaces client workspace state, and remounts `StudentQueryLab` via `key={durableCase.snapshot?.attemptId}` to clear transient state. |
| **Former attempt remains available** | **PASS** | Before creating a fresh attempt, `useCaseAttempt.open(true)` saves any dirty changes on the current attempt, the server archives (rather than deletes) the prior active attempt in a serializable transaction, and `refreshSummaries()` keeps it listed and resumable. |
| **Scope & Test Verification** | **PASS** | Changes are strictly confined to the 6 files allowed by [WP-320-case-version-and-fresh-start.md](docs/01-work-packages/WP-320-case-version-and-fresh-start.md#L6-L15). TypeScript (`tsc --noEmit`) and all 233 web unit tests (including the 36 tests in `App.test.tsx` and `StudentQueryLab.test.tsx`) pass. |

---

### Detailed Verification

1. **Server Ownership of Counts, Guidance, and Saved Progress**
   - **Counts & Pinned Content Version**: In [ProtectedCasePresentation.tsx](apps/web/src/components/student/ProtectedCasePresentation.tsx#L206-L209), `ProtectedCaseBoard` renders `Completed milestones: {s.progress.completed} / {s.progress.total} ┬╖ Case version {s.contentVersion}`, the `<progress>` bar, and `s.evidenceSteps` strictly from the server snapshot produced by `CaseAttemptService.snapshot` ([caseAttemptService.ts](apps/api/src/services/caseAttemptService.ts#L92-L117)).
   - **Guidance & Theory Submission**: In [StudentQueryLab.tsx](apps/web/src/components/student/StudentQueryLab.tsx#L110-L115) and [StudentQueryLab.tsx](apps/web/src/components/student/StudentQueryLab.tsx#L130), briefing objectives, task titles, Samuel's directions, hints, starter SQL, and verification eligibility (`task?.completionMode === "verify"` and `task.theoryChoices`) come exclusively from `c.dossier` and `c.snapshot.task`. In [ProtectedCasePresentation.tsx](apps/web/src/components/student/ProtectedCasePresentation.tsx#L210-L211), the `theory` slot is rendered inside the `Case Progress` card and hides `Continue in Query Lab` when `task.completionMode === "verify"`, as verified for both `case-001` and `case-004` in [StudentQueryLab.test.tsx](apps/web/src/components/student/StudentQueryLab.test.tsx#L154-L165).

2. **Fresh Attempt Opens Briefing with Empty Draft & Resets Transient State**
   - **Server Initialization**: `CaseAttemptService.fresh` ([caseAttemptService.ts](apps/api/src/services/caseAttemptService.ts#L125-L138)) inserts a new active `app.LearnerAttempt` pinned to the latest released `contentVersion` and initializes `app.AttemptWorkspace` to `{"draftSql":"","notes":[],"selectedView":"briefing"}`.
   - **Client Switch & Remount**:
     - Selecting **Start Fresh Attempt** in the header menu ([App.tsx](apps/web/src/App.tsx#L271-L273), [App.tsx](apps/web/src/App.tsx#L314-L321)) confirms with the user and invokes `durableCase.open(true)`.
     - In [useCaseAttempt.ts](apps/web/src/useCaseAttempt.ts#L78-L82), because the newly created `result.attemptId` differs from `current.current?.attemptId`, `retainUnsaved` is `false` and `accept(result, edits.current, true, active)` replaces local workspace state with the server's initial briefing workspace (`selectedView: "briefing"`, `draftSql: ""`, `notes: []`).
     - In [App.tsx](apps/web/src/App.tsx#L393), keying `<StudentQueryLab key={durableCase.snapshot?.attemptId} ... />` (along with the `attemptId` effect in [StudentQueryLab.tsx](apps/web/src/components/student/StudentQueryLab.tsx#L33)) resets transient component state (`theory`, `starterUndo`, `result`, `feedback`).
     - Verified by `"starts a fresh attempt at the briefing and clears the old editor"` in [App.test.tsx](apps/web/src/App.test.tsx#L54-L70).

3. **Former Attempt Remains Saved and Available**
   - **Pre-Switch Save**: In [useCaseAttempt.ts](apps/web/src/useCaseAttempt.ts#L76), `open(true)` first saves any dirty workspace on the active/completed attempt via `saveCaseWorkspace(current.current, local.current)` before creating the new attempt.
   - **Non-Destructive Archival**: In [caseAttemptService.ts](apps/api/src/services/caseAttemptService.ts#L132), `CaseAttemptService.fresh` transitions any prior active attempt to `Status = 'archived'` (`ArchivedFromStatus = Status`) inside the same transaction without deleting its proofs, logged actions, or workspace.
   - **Resumability**: `open(true)` calls `await refreshSummaries()` ([useCaseAttempt.ts](apps/web/src/useCaseAttempt.ts#L82)), keeping the prior attempt listed under **Saved attempts** on the case landing view ([StudentQueryLab.tsx](apps/web/src/components/student/StudentQueryLab.tsx#L46-L49)), where **Resume saved attempt** invokes `open(false, s.attemptId)` &rarr; `resumeCaseAttempt` ([caseAttemptService.ts](apps/api/src/services/caseAttemptService.ts#L158-L163)).

## Final Decision
Accepted by the human on 2026-11-18 following the independent PASS, with explicit instruction to commit and push.
