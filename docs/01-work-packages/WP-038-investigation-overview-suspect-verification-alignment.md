# investigation overview suspect verification alignment

## Objective

Align `investigation-overview.md` with implemented runtime behavior by correcting stale wording about suspect verification availability.

## Scope

### In Scope

- Update current implementation notes in the investigation overview doc.

### Out of Scope

- Any code changes.
- Any other documentation package changes.
- Feature behavior changes.

## Files Allowed to Change

- docs/10-user-journey/investigation-overview.md
- docs/01-work-packages/WP-038-investigation-overview-suspect-verification-alignment.md

Do Not Modify:

- apps/**
- database/**
- all other docs files

## Constraints

- Keep edit minimal.
- Preserve backend authority language.
- Preserve future-scope boundaries for case progression and notebook persistence.

## Required Behavior

- Remove stale statement claiming suspect verification is not implemented.
- Replace with wording that reflects backend route + frontend panel availability.
- Keep future-scope items accurate and unchanged where still true.

## Acceptance Criteria

- [ ] Investigation overview no longer claims suspect verification is absent.
- [ ] Updated wording is consistent with WP-034 and WP-035 behavior.
- [ ] No files outside allowed list changed.

## Codex Prompt

Implement WP-038 as a minimal docs-only correction.

Do:

- update `docs/10-user-journey/investigation-overview.md` current implementation notes for suspect verification

Do not:

- edit any other docs
- touch runtime code

Return:

- files changed
- wording delta summary
- scope confirmation

## Gemini Audit Prompt

Audit WP-038 investigation overview alignment.

Verify:

1. Only allowed files changed.
2. Stale suspect-verification-absent wording was removed.
3. Updated wording matches implemented runtime boundaries.
4. No unrelated scope drift.

Output:

- Verdict: PASS or FAIL
- Violations
- Drift risks

## Codex Results

Implemented WP-038.

Updated:

- docs/10-user-journey/investigation-overview.md

Wording delta summary:

- Added implemented items:
  - backend suspect verification route
  - frontend suspect verification panel
- Removed stale non-implemented item:
  - suspect verification in the active API

Scope check:

- Docs-only change.
- No files outside WP-038 allowed list were modified.

## Gemini Audit Results

Audit of WP-038 investigation overview alignment is complete.

- Verdict: PASS
- Violations: None.
- Drift risks: None.

  Verification Summary

1. Scope Control: Only the allowed file (docs/10-user-journey/investigation-overview.md) was modified.
2. Stale Wording Removal: The statement - suspect verification in the active API was correctly removed from the "The current runtime does not yet implement"
   section.
3. Accuracy & Consistency: Added backend suspect verification route and frontend suspect verification panel to the "The current runtime already implements"
   section. This is consistent with the implementations in WP-034 and WP-035.
4. Preservation of Future Scope: Future-scoped items such as persisted notebook evidence and deterministic milestone tracking remain correctly listed as not yet
   implemented.

  Change Details

  File: docs/10-user-journey/investigation-overview.md

  Wording Changes:

- Added to "already implements":
  - backend suspect verification route
  - frontend suspect verification panel
- Removed from "does not yet implement":
  - suspect verification in the active API

  Strategic Intent: Audit WP-038 investigation overview alignment.

  Audit Verdict: PASS

## Final Decision

Approved.

Reason:
Codex implementation stayed within scope and Gemini audit returned PASS with no violations or drift risks. Investigation overview wording now matches implemented suspect verification behavior while preserving future-scope boundaries.

Commit is approved for this work package.
