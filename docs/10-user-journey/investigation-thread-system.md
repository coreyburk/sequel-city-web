# Investigation Thread System

## Purpose

The Investigation Thread System is a frontend gameplay support layer that explains the current trail to the learner. In the default student view it surfaces as a single compact **Current Investigation Focus card** aligned with Samuel's current step. It is contextual guidance, not a trail-management workspace.

The guiding principle is:

> Samuel gives the step. Notebook stores evidence. Threads explain the current trail.

The learner does not manage trails, attach thread-specific evidence, or review future trails during normal investigation flow. The Evidence Notebook remains the place for evidence and notes. Case Progress remains the visible step tracker. The thread system only explains the current trail when it helps the learner understand why the current step matters.

## Authority Boundary

Threads are presentation-only frontend state. They do not decide correctness, advance milestones, or replace evidence. Thread state never overrides backend-authoritative truth (SQL safety, query execution, suspect verification). All authority rules in `docs/00-ssot/SSOT-Investigation-State-Architecture.md` continue to apply.

## Current Investigation Focus Card

By default the student sees one card describing the trail Samuel is on right now. The card is compact and supportive.

It shows:

- the current trail title
- the trail category (Crime Scene, Witness, Person, Vehicle, Timeline, Organization, ...)
- a short structural purpose for the trail
- mentor guidance authored in Samuel Tupleton's voice
- a brief deterministic status label (for example `Current focus` or `Needs evidence`)

It does not show:

- a list of all open trails
- later authored trails
- attach-notebook-entry controls
- a Link to thread button
- a thread-specific notes textarea
- any all-trails management view

The card never competes with Case Progress for the "what do I do next" job. Samuel's guidance, the Case Progress panel, and the Evidence Notebook remain visually dominant. The focus card stays subordinate.

## Hidden Later Trails

Later authored trails are hidden from the default student view. They are intentionally not surfaced alongside the current focus card because doing so reintroduces management cognitive load and risks future-trail spoiler language.

If broader trail review is retained, it is collapsed behind an explicit optional control labelled `Review investigation trails`. Opening it reveals compact, title-and-category summaries of closed trails and trails that are not yet in play. The review section:

- is collapsed by default
- is clearly secondary
- never exposes management controls (no attach, no link, no notes)
- never uses future-trail spoiler language
- is for optional context only

## System-Derived Thread Status

Student-facing thread status is derived deterministically from existing case state — completed milestones, the current Samuel-guided step, learner-attached evidence, and learner-logged notebook signal. Students do not set this directly.

| Derived Status | Deterministic Source |
|---|---|
| Current | The trail tied to Samuel's current guided step (the primary focus) |
| Needs Evidence | A trail that is in scope (unlocked by stage) or that the learner has already touched, but has not yet been closed by case progress |
| Completed | A trail whose completing milestone has been reached through database-backed progress |
| Later | A trail that is not yet in scope and the learner has not surfaced through their own evidence |

Manual status controls (New, Active, Blocked, Resolved) are not part of the student workflow. A legacy `ThreadStatus` field remains in the data model for persistence backwards compatibility only; the focus card never reads it.

## Notebook Stays The Evidence Workspace

Evidence logging and note-taking remain centered in the Evidence Notebook. The Current Investigation Focus card never asks the learner to attach evidence to a thread, link a notebook entry, or write thread-scoped notes. Those affordances are intentionally absent from the primary flow.

If the underlying thread data model retains evidence links or learner notes (for persistence backwards compatibility or future scoped work), they are not surfaced as a primary student task.

## Case Progress Stays The Step Tracker

The Case Progress panel remains the primary source for:

- completed milestones
- current step
- next action
- Samuel's check-in

The Current Investigation Focus card supports this flow by explaining the current trail. It does not duplicate the full progress system.

## Deterministic Current Trail Selection

The focus card derives the current trail from existing deterministic state:

- the current Samuel-guided milestone
- completed milestones
- notebook evidence signals
- the derived thread visibility model

No runtime AI, hidden inference, or automatic suspect deduction is introduced. The same case state always produces the same current trail.

## Progressive Disclosure Behavior

Progressive disclosure behavior is preserved internally even when hidden from the default view. The underlying visibility model still distinguishes Current, Needs Evidence, Completed, and Later trails. The default student presentation simply surfaces only the Current trail and hides the rest behind an optional, clearly secondary review affordance.

## Persistence

Underlying thread data continues to be persisted to browser localStorage under a versioned key so that page refresh and tab restoration do not lose case state. Persistence is local-first and frontend-only. No backend API or storage is involved. Hydration safely tolerates legacy persisted manual status values from earlier releases.

## Spoiler Safety

The thread system preserves spoiler-safe gameplay by:

- hiding later authored trails from the default student view
- authoring all trail titles, summaries, and mentor guidance in structural terms
- never naming hidden suspects, hidden identifiers, or answer-only rows in trail text
- deriving status only from deterministic, learner-visible state — no hidden inference
- leaving all evidence interpretation to the learner

## Out Of Scope

The thread system does not:

- generate SQL on the learner's behalf
- infer suspect identity from notebook entries
- advance milestones or close the case
- modify backend APIs or SQL execution
- introduce runtime AI behavior
- require the learner to manage trail status to make progress
- expose a default all-trails management view
