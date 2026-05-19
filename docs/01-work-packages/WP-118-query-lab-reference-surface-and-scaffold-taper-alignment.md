# WP-118: query-lab-reference-surface-and-scaffold-taper-alignment

## Objective

Evaluate and refine the next UX corrections needed after WP-117 so Query Lab has enough working space and Samuel's support taper stays consistent with the intended student learning curve.

The immediate concerns are:

- the persistent `Pinned Facts` rail continues to consume horizontal space and contributes to recurring Query Lab cropping
- the current desktop layout is still structurally fragile because Query Lab, sticky clue actions, the `Case File` trigger, and the reference rail all compete for width
- Samuel regressed into over-assistance by queueing both witness `PersonID` filters after the product had already started weaning students toward more self-constructed queries
- the witness-name narrowing handoff should guide the student toward the next move without handing them a near-complete solved filter

The goal is:

Define and implement a more durable Query Lab reference-surface pattern while restoring the intended scaffold taper, so the student has more usable workspace and Samuel's witness-name guidance points the way without solving the narrowing step for them.

---

## Scope

Refine the Student Mode Query Lab layout and post-witness guidance taper.

This WP may modify:

- student workbench layout and reference-surface presentation
- `Pinned Facts` placement, visibility model, or integration with `Case File`
- Samuel guidance, objectives, and post-witness taper logic
- query-assist presentation in student components
- related tests
- this work package document

This WP should evaluate and choose one durable direction for `Pinned Facts`, such as:

- folding `Pinned Facts` into `Case File` as an additional tab or panel
- replacing the persistent right rail with a pop-out reference surface

No backend API changes.
No database changes.
No SQL execution changes.
No runtime AI behavior.

---

## Files Allowed to Change

Allowed:

- apps/web/src/components/student/**
- apps/web/src/components/**
- apps/web/src/features/**
- apps/web/src/hooks/**
- apps/web/src/utils/**
- apps/web/src/types/**
- apps/web/src/state/**
- apps/web/src/App.tsx
- apps/web/src/App.test.tsx
- apps/web/src/styles.css
- docs/01-work-packages/WP-118-query-lab-reference-surface-and-scaffold-taper-alignment.md

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
- Preserve Samuel's mentor role
- Preserve the existing Student Mode structure
- Preserve visible correct and incorrect clue feedback
- Preserve the student's responsibility to build their own queries
- Preserve the clue-logging affordance in query results
- No runtime AI behavior
- No automatic suspect deduction
- No automatic clue detection
- No automatic evidence logging
- No hidden automatic case completion
- No backend API changes
- No SQL execution changes
- No broad visual redesign

Layout and taper constraints:

- Query Lab must gain durable horizontal breathing room rather than relying on repeated micro-adjustments
- the chosen `Pinned Facts` pattern must remain discoverable and useful during query building
- the `Log Clue` affordance must remain visible and usable when result tables are wide
- Samuel should not queue both witness `PersonID` filters as the default post-broad-step handoff
- support should continue tapering after the witness phase rather than regressing into heavier solutioning
- witness-name narrowing guidance should tell the student what to use next without prebuilding the full narrowing query

---

## Required Behavior

### 1. Reclaim Query Lab Width With A Durable Reference Pattern

The current persistent `Pinned Facts` rail should be reevaluated and replaced or restructured if needed.

WP-118 must choose and implement a durable reference-surface approach that reduces recurring cropping pressure in Query Lab.

The chosen approach must:

- preserve student access to pinned facts while query building
- improve main-column working width for the query editor and results table
- reduce the likelihood of sticky clue actions or wide tables being cropped

The solution should address the root layout competition, not just trim widths again.

---

### 2. Keep Reference Material Discoverable

If `Pinned Facts` no longer lives as a persistent rail:

- students must still be able to open or reveal it with minimal friction
- the relationship between `Case File`, pinned facts, and query-building support should remain understandable
- the reference surface should feel intentional, not hidden

The product should gain space without making the student's known facts harder to use.

---

### 3. Restore The Intended Scaffold Taper

During the witness-name narrowing phase:

- Samuel should not queue both witness `PersonID` clauses by default
- guidance should point students toward the correct table, clue type, and narrowing strategy
- the student should need to assemble more of the narrowing step themselves than in rescue-oriented flows

Acceptable support patterns include:

- naming the relevant table
- naming one or two relevant columns
- reminding students to use both pinned witness `PersonID`s
- offering broad query-builder tokens

Do not default to a prewritten `WHERE PersonID = ... OR PersonID = ...` query unless a clearly defined recovery state justifies it.

---

### 4. Keep Guidance And Progression State Aligned

When the student has already determined the witness names:

- Samuel's guidance must not speak as if the witness-name step is still unresolved
- the Evidence Board `Current Step`, header guidance, and Query Lab helper content must reflect the same real phase
- guidance should stay focused on the active task and avoid introducing premature side trails

This is a progression-state consistency requirement.

---

### 5. Tests

Add or update tests for:

- the chosen `Pinned Facts` presentation model
- improved Query Lab width assumptions where practical
- witness-name narrowing guidance no longer queuing the full `PersonID` filter by default
- guidance and current-step state staying synchronized after witness names are known
- continued visibility/usability of clue logging affordances

Preserve existing tests where still relevant.

---

## Acceptance Criteria

- Query Lab gains durable usable width through a clearer reference-surface pattern
- `Pinned Facts` remains discoverable and useful
- the clue-logging affordance remains visible and usable on wide result tables
- Samuel no longer defaults to prewriting both witness `PersonID` filters
- scaffold taper remains consistent with the intended student learning curve
- guidance, current step, and helper content stay synchronized
- deterministic progression remains intact
- tests updated where practical
- no backend API changes introduced
- no SQL execution behavior changed
- no runtime AI behavior introduced

---

## Codex Prompt

Implement WP-118 for Sequel City Web Detective.

Objective:
Reclaim durable Query Lab working space and restore the intended scaffold taper after the witness phase, so students have more room to work and Samuel guides the narrowing step without solving it for them.

Implement:

1. Choose and apply a more durable `Pinned Facts` / reference-surface pattern that reduces recurring Query Lab cropping.
2. Preserve easy access to pinned facts while query building.
3. Keep the clue-logging affordance visible and usable on wide result tables.
4. Remove the default behavior where Samuel queues both witness `PersonID` filters after the broad witness-name lookup.
5. Keep guidance, helper content, and current-step state synchronized on the real progression phase.
6. Update focused tests for the new layout/help behavior.

Do not:

- change backend APIs
- change SQL validation or execution
- alter database scripts
- introduce runtime AI
- broaden scope beyond the affected Student Mode layout and scaffold behavior

Preserve:

- deterministic gameplay behavior
- spoiler-safe guidance
- Samuel's mentor role
- the current Student Mode structure
- the student's responsibility to build narrowing queries

---

## Gemini Audit Prompt

Audit WP-118 Query Lab reference-surface and scaffold-taper fixes.

Verify:

1. Only approved frontend and work-package files changed.
2. No backend runtime files changed.
3. No database scripts changed.
4. No SQL execution behavior changed.
5. Query Lab has materially more durable working width than the prior persistent-right-rail arrangement.
6. `Pinned Facts` remains discoverable and usable during query building.
7. The `Log Clue` affordance remains visible and usable on wide result tables.
8. Samuel no longer defaults to queuing both witness `PersonID` filters after the broad witness-name lookup.
9. Guidance, helper content, and `Current Step` remain synchronized on the real progression phase.
10. Tests were updated or added where practical.

Flag:

- persistent layout cropping caused by unchanged structural width competition
- hidden or awkward pinned-facts access
- over-scaffolded witness-name narrowing help
- stale or contradictory progression guidance
- backend or database modifications
- missing tests

---

## Codex Results

Implemented WP-118 in the Student Mode Query Lab layout and witness-name scaffold.

- Updated [StudentWorkbenchView.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/components/student/StudentWorkbenchView.tsx) to remove the persistent `Pinned Facts` right rail and fold pinned facts into `Case File` as a first-class drawer tab beside `Quick Table Clues` and `Case Facts`. This reclaims the main Query Lab width without creating a second side mechanism.
- Updated [styles.css](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/styles.css) so the desktop workbench now uses a two-column structure (`Case File` drawer trigger plus main Query Lab column) instead of a permanent three-column layout. The drawer tabs were expanded to support `Pinned Facts`, and the drawer panel width was increased to fit the consolidated reference surface.
- Updated [QueryRunner.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/components/QueryRunner.tsx) so the student helper text now points to `Case File` facts instead of a now-removed pinned-facts rail.
- Updated [useStudentCaseState.ts](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/useStudentCaseState.ts) to remove the default behavior that queued the full witness-name `PersonID` filter after a broad `PersonsOfInterest` step. Samuel now tells the student to use the two pinned witness `PersonID`s from `Case File` to narrow the table themselves.
- Updated [studentCase.ts](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/studentCase.ts) so witness-name guidance now references `Case File` for exact values and no longer depends on a prebuilt `WHERE PersonID = ... OR PersonID = ...` draft to move the student forward.
- Updated [App.test.tsx](/D:/GitHub-Repos/SequelCityWeb/apps/web/src/App.test.tsx) so the Query Lab tests now open `Case File > Pinned Facts` when checking pinned evidence availability, and the witness-name phase tests now assert the lighter non-queued scaffold.

Verification:

- `npm run test --workspace apps/web` passed with `139/139` tests.
- `npm run build --workspace apps/web` passed.

---

## Gemini Audit Results

Audit passed.

- Verified frontend-only scope with no backend, database, or SQL execution changes.
- Confirmed the persistent `Pinned Facts` right rail was replaced by a `Case File` drawer tab so Query Lab regains durable working width.
- Confirmed the sticky `Log Clue` affordance remains visible on wide result tables.
- Confirmed Samuel no longer defaults to queuing both witness `PersonID` filters after the broad witness-name lookup, and instead points students back to `Case File` for the exact values.
- Confirmed focused tests cover the consolidated reference surface and the lighter witness-name scaffold.

## Final Decision

Accepted. WP-118 successfully consolidates the Query Lab reference surface into `Case File`, reduces recurring width pressure, and restores the intended post-witness scaffold taper without changing backend or SQL execution behavior.

