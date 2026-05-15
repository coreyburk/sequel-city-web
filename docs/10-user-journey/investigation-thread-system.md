# Investigation Thread System

## Purpose

The Investigation Thread System is a frontend gameplay support layer that externalizes the learner's working set of leads. It keeps the current Samuel-guided trail visible by default so the learner can decide what to do next without scanning every seeded lead at once.

## Authority Boundary

Threads are presentation-only frontend state. They do not decide correctness, advance milestones, or replace evidence. Thread state never overrides backend-authoritative truth (SQL safety, query execution, suspect verification). All authority rules in `docs/00-ssot/SSOT-Investigation-State-Architecture.md` continue to apply.

## System-Derived Thread Status

Student-facing thread status is derived deterministically from existing case state — completed milestones, the current Samuel-guided step, learner-attached evidence, and learner-logged notebook signal. Students do not manage thread completion themselves; the system tracks the structure while the student focuses on investigating, logging evidence, and reasoning.

| Derived Status | Deterministic Source |
|---|---|
| Current | The trail tied to Samuel's current guided step (the primary focus) |
| Needs Evidence | A trail that is in scope (unlocked by stage) or that the learner has already touched, but has not yet been closed by case progress |
| Completed | A trail whose completing milestone has been reached through database-backed progress |
| Later | A trail that is not yet in scope and the learner has not surfaced through their own evidence |

Manual status controls (New, Active, Blocked, Resolved) are no longer part of the standard student workflow. The student is never asked to mark a thread complete, change its state, or pick the correct status to unlock progress. A legacy `ThreadStatus` field remains in the data model for persistence backwards compatibility only; the student view never reads it.

## Progressive Disclosure

The default student view stays progressive and spoiler-safe:

- the current Samuel-guided trail is shown first and visually emphasized as "Current focus"
- trails whose milestones have been reached are moved into a secondary collapsed Completed section
- later authored trails stay collapsed until their stage window opens or the learner surfaces them through real evidence
- learner-engaged trails (evidence links, written notes, or notebook signal that matches a trail) appear in the current set marked "Needs evidence", without revealing every future trail

This keeps the board aligned with Samuel's one-step-at-a-time model while preserving learner agency. The learner can still open Completed or Later sections to review the full authored board, but that broader context is not the default presentation.

## Learner-Owned Controls

Students continue to own:

- attaching notebook entries to a thread
- removing linked evidence from a thread
- writing thread notes
- expanding Completed or Later sections to intentionally review the broader board

These are the learner reasoning affordances the system preserves. Nothing about thread completion is on the learner's todo list.

## Thread Content Authoring

Each thread carries authored, spoiler-safe content:

- a structural title describing the line of inquiry
- a category (Crime Scene, Witness, Person, Vehicle, Timeline, Organization, Financial, Communication, Physical Evidence)
- a short summary of the trail in structural terms
- mentor guidance authored in Samuel Tupleton's voice that scaffolds reasoning without naming hidden suspects or solution paths

Mentor text follows the same rules as the rest of the gameplay copy: it references tables, columns, filters, and already-returned learner-visible facts. It never names hidden suspects, never asserts correctness, never proposes a solution-path query, and never tells the learner to manage thread status to make progress.

## Evidence Linkage

The learner attaches evidence to a thread by picking from their own Evidence Notebook. The frontend does not infer which notebook entry belongs to which thread. If a notebook entry is removed, the system prunes that linkage automatically because the underlying evidence is no longer present.

Threads display their linked evidence inline so the learner can keep their working set visible while writing the next query.

Thread visibility may also react to notebook evidence in a deterministic way. If a learner logs evidence or notes that clearly belong to a later authored trail, that trail may appear in the current visible set even before it becomes the default Samuel-guided focus. This preserves agency without revealing every future trail by default.

## Persistence

Thread notes and evidence attachments are persisted to browser localStorage under a versioned key so that page refresh, tab restoration, and gameplay navigation do not lose the learner's working set. Persistence is local-first and frontend-only. No backend API or storage is involved.

Hydration safely tolerates legacy persisted manual status values from earlier releases — notes and evidence links are preserved without data loss. Legacy manual status never overrides the derived student-facing status. If the storage layer is unavailable, the system continues in memory without surfacing an error to the learner.

## Spoiler Safety

The thread system preserves spoiler-safe gameplay by:

- keeping future authored trails collapsed in the default student view
- authoring all thread titles, summaries, and mentor guidance in structural terms
- never naming hidden suspects, hidden identifiers, or answer-only rows in thread text
- deriving status only from deterministic, learner-visible state — no hidden inference
- leaving all evidence interpretation to the learner

## Out Of Scope

The thread system does not:

- generate SQL on the learner's behalf
- infer suspect identity from notebook entries
- advance milestones or close the case
- modify backend APIs or SQL execution
- introduce runtime AI behavior
- require the learner to manage thread status to make progress
