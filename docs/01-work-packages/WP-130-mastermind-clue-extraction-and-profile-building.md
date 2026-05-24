# WP-130: Mastermind Clue Extraction and Profile Building

**Status:** Accepted
**Owner:** Codex
**Created:** 2026-05-23

## Goal

Turn the post-killer `InterviewLog` phase into a real clue-mining investigation where students collect multiple mastermind-relevant details from the killer's transcript trail, organize them into a working profile, and use that profile to decide what to investigate next.

The student should not jump from:

- confirming the hired killer
- to one generic `Mastermind Lead`
- to magically knowing how to identify the mastermind

Instead, the app should help the student extract usable descriptors from the transcript rows and build a profile of the person who ordered the hit.

## Problem Statement

After the hired killer is confirmed, the case needed a richer midpoint between:

- `the killer is confirmed`
- and `the mastermind is identified`

The transcript trail contains several profile clues that should become student-earned evidence:

- hired by a redheaded woman
- met three times in December
- met next to Symphony Hall
- stiletto shoes
- expensive jewelry / serious ice
- high-roller with deep pockets
- contract killing
- drives a BMW M8
- about 5'5" to 5'8" tall

Without a profile-building phase, the case felt like a leap from one clue to the final answer.

## Desired Outcome

Students should:

1. isolate the killer's report-linked transcript rows
2. log multiple mastermind-relevant clue rows or extracted clue notes
3. see those clues accumulate into a working mastermind profile
4. use that profile to decide what table or fact trail to investigate next

This should feel like real detective synthesis, not a leap from one clue to the final answer.

## Scope

### 1. Multiple mastermind clue logging

- allow multiple mastermind-relevant transcript clues to be logged from the killer's `InterviewLog`
- treat each clue as a student-earned note, not one generic catch-all `Mastermind Lead`
- keep the clues grounded in what the rows actually prove

### 2. Mastermind profile building

- introduce a student-facing mastermind profile concept on notebook Page 2
- distinguish between:
  - raw transcript evidence
  - synthesized profile facts

### 3. Progressive guidance

- after each logged clue, Samuel should help the student interpret what kind of clue it is
- once enough clue threads are collected, Samuel should guide the student to the next narrowing trail

### 4. Evidence notebook support

- preserve the Page 1 / Page 2 notebook structure from WP-128
- use Page 2 as the active mastermind working surface
- keep the notebook organized even as multiple transcript clues are pinned

## Out of Scope

- final in-app admin authoring of murderer/mastermind identities
- bootstrap, setup, or migration changes
- packaging/distribution work
- the suspect-interview pacing before the first suspect theory check

## Acceptance Criteria

- students can log more than one mastermind-relevant clue from the transcript trail
- those clues are visible and organized on the mastermind notebook page
- Samuel gives useful progressive synthesis guidance after clue logging
- the case no longer jumps directly from one generic mastermind lead to the final mastermind search
- the mastermind clue phase remains grounded in evidence the student actually earned from `InterviewLog`

## Verification

- walkthrough from hired-killer confirmation into transcript mining
- confirm multiple mastermind clues can be logged
- confirm notebook Page 2 reflects the growing mastermind profile
- confirm the next-step guidance changes as more mastermind clues are collected
- confirm web tests and build remain green

## Codex Results

Implemented the mastermind clue-extraction phase as a real evidence-building chapter.

Summary:

- transcript rows from the murder-report interview trail can now be logged as multiple distinct mastermind clues instead of collapsing into one generic lead
- added clue parsing and synthesis for evidence threads such as:
  - paid hit / hidden employer
  - woman who hired him
  - deep pockets / wealth
  - repeated December meetings
  - Symphony Hall meeting location
  - BMW M8
  - red hair
  - stilettos
  - expensive jewelry / serious ice
  - height between roughly 5'5" and 5'8"
- added progressive mastermind profile tracking so the notebook can show how many clue threads have been pinned and what kind of clue is still missing
- improved mastermind note summaries so the notebook records useful, student-facing evidence statements instead of generic `client` language
- added height-clue recognition for fully written transcript wording such as `five foot five inches ... five foot seven inches`
- aligned jewelry parsing to the real transcript wording by recognizing `serious ice` and `rocks on her fingers and toes`
- removed the unproven `date night` requirement from the mandatory mastermind profile so the profile only depends on evidence the student can actually earn from the transcript
- kept the full transcript result set available after clue logging so students can continue collecting additional mastermind clues from the same narrowed query
- once the mastermind profile is complete, the guidance now pivots clearly into the `DriversLicense` narrowing step instead of leaving the student in transcript limbo

Changed files:

- `apps/web/src/useStudentCaseState.ts`
- `apps/web/src/studentCase.ts`
- `apps/web/src/components/student/StudentEvidenceBoardView.tsx`
- `apps/web/src/App.test.tsx`
- `docs/01-work-packages/WP-130-mastermind-clue-extraction-and-profile-building.md`

Verification:

- `npm run test --workspace apps/web` passed with `152/152` tests
- `npm run build --workspace apps/web` passed

## Gemini Audit Prompt

Audit the mastermind clue-extraction phase after hired-killer confirmation.

Verify all of the following:

1. The student can log multiple mastermind-relevant transcript clues instead of only one generic lead.
2. The notebook organizes those clues into a usable mastermind working page.
3. Samuel's guidance helps students interpret and synthesize the clues instead of making the leap for them.
4. The case progression from murderer confirmation into mastermind investigation feels like evidence-building, not a sudden answer jump.
5. The clues collected remain faithful to what the transcript rows actually prove, including the height clue from the fully written transcript wording.
6. Once the profile is complete, the next step into `DriversLicense` narrowing is explicit.

## Gemini Audit Results

Audit confirmed the phase design and surfaced two real evidence-alignment issues:

- jewelry parsing expected literal `expensive jewelry` even though the transcript actually says `serious ice` and `rocks on her fingers and toes`
- the mandatory profile count included a `date night` clue that the current interview rows do not actually prove

Accepted follow-up:

- expand jewelry parsing to recognize the transcript's real wording
- remove the unproven `date night` requirement from the mandatory mastermind profile

With those adjustments applied, the phase satisfies the accepted criteria and the student can complete the mastermind profile without hidden dead ends.

## Final Decision

Accepted.

The mastermind clue-extraction phase now depends only on transcript evidence that is actually present in the case data, and it provides a complete, student-earned handoff into the `DriversLicense` narrowing step.
