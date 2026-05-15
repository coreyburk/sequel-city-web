# Investigation Thread System

## Purpose

The Investigation Thread System is a frontend gameplay support layer that models the deterministic trail a case progresses through. As of WP-097 it is **not student-facing by default**. Student Mode no longer renders a Current Investigation Focus card or a Review Investigation Trails control. The trail architecture is preserved for Developer/Admin diagnostics, future case authoring, progression debugging, and case balancing.

The guiding principle is:

> Students need the next action. Admins need the progression model.

For students, Samuel's guidance gives the next step, Case Progress is the visible step tracker, and the Evidence Notebook is where evidence and reasoning live. None of those depend on the thread system, and the student no longer sees trail status, trail summaries, or trail review controls in the normal flow.

## Authority Boundary

Threads are presentation-only frontend state. They do not decide correctness, advance milestones, or replace evidence. Thread state never overrides backend-authoritative truth (SQL safety, query execution, suspect verification). All authority rules in `docs/00-ssot/SSOT-Investigation-State-Architecture.md` continue to apply.

## Student-Facing Surface

Student Mode shows:

- Samuel's mentor header and one-step-at-a-time guidance
- Samuel's Briefing view (case background, first lead, next step)
- Query Lab (Query Runner, schema snapshot, reinforcement feedback)
- Evidence Board (Evidence Notebook + Case Progress)

Student Mode does **not** show:

- Current Investigation Focus card
- Review investigation trails control
- visible investigation trail summaries
- trail-status badges
- thread categories or thread titles
- any all-trails management view

If a student-facing affordance for an individual trail is reintroduced in the future, it must remain subordinate to Samuel's guidance and the notebook, follow the spoiler-safety constraints below, and never duplicate Case Progress.

## Developer/Admin Surface

Developer Mode exposes a lightweight **Investigation Trail Diagnostics** panel that renders the deterministic visibility model:

- the primary thread id for the current stage
- the derived status of every thread (Current, Needs Evidence, Completed, Later)
- thread id, title, and category for inspection

This panel is intended for case authoring, progression debugging, and balance review. It is not a learner-facing workspace. It is intentionally narrow in scope — WP-097 explicitly avoids building a broad admin system on top of the thread module.

## System-Derived Thread Status

The deterministic visibility model still derives thread status from existing case state — completed milestones, the current Samuel-guided step, learner-attached evidence, and learner-logged notebook signal. Manual `ThreadStatus` values ("New", "Active", "Blocked", "Resolved") remain on the data model only for persistence backwards compatibility and developer tooling; the visibility model does not consult them.

| Derived Status | Deterministic Source |
|---|---|
| Current | The trail tied to Samuel's current guided step (the primary focus) |
| Needs Evidence | A trail that is in scope (unlocked by stage) or that the learner has already touched, but has not yet been closed by case progress |
| Completed | A trail whose completing milestone has been reached through database-backed progress |
| Later | A trail that is not yet in scope and the learner has not surfaced through their own evidence |

## Notebook Stays The Evidence Workspace

Evidence logging and note-taking are centered in the Evidence Notebook. Notebook entries continue to feed the deterministic visibility model behind the scenes, but the student is never asked to attach evidence to a thread, link a notebook entry, or write thread-scoped notes.

If the underlying thread data model retains evidence links or learner notes (for persistence backwards compatibility or future scoped admin work), they are not surfaced as a primary student task.

## Case Progress Stays The Step Tracker

Case Progress is the primary student-facing source for:

- completed milestones
- current step
- next action
- Samuel's optional check-in

It is not replaced by trail terminology and does not surface trail names to the student.

## Deterministic Current Trail Selection

The visibility model derives the current trail from existing deterministic state:

- the current Samuel-guided milestone
- completed milestones
- notebook evidence signals

No runtime AI, hidden inference, or automatic suspect deduction is introduced. The same case state always produces the same derived trail status.

## Persistence

Underlying thread data continues to be persisted to browser localStorage under a versioned key so that page refresh and tab restoration do not lose case state. Persistence is local-first and frontend-only. No backend API or storage is involved. Hydration safely tolerates legacy persisted manual status values from earlier releases.

## Spoiler Safety

The thread system preserves spoiler-safe gameplay by:

- not rendering later authored trails in Student Mode at all
- authoring all trail titles, summaries, and mentor guidance in structural terms
- never naming hidden suspects, hidden identifiers, or answer-only rows in trail text
- deriving status only from deterministic, learner-visible state — no hidden inference
- leaving all evidence interpretation to the learner

## Out Of Scope

The thread system does not:

- render in Student Mode
- generate SQL on the learner's behalf
- infer suspect identity from notebook entries
- advance milestones or close the case
- modify backend APIs or SQL execution
- introduce runtime AI behavior
- require the learner to manage trail status to make progress
