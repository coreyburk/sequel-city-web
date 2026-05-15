# Investigation Thread System

## Purpose

The Investigation Thread System is a frontend gameplay support layer that externalizes the learner's working set of leads. It keeps each line of inquiry visible so the learner can decide what to pursue next without losing context across queries.

## Authority Boundary

Threads are presentation-only frontend state. They do not decide correctness, advance milestones, or replace evidence. Thread state never overrides backend-authoritative truth (SQL safety, query execution, suspect verification). All authority rules in `docs/00-ssot/SSOT-Investigation-State-Architecture.md` continue to apply.

## Thread Statuses

| Status | Meaning |
|---|---|
| New | Lead identified but not yet pursued |
| Active | Learner is currently following this trail |
| Blocked | Learner has ruled the trail out or hit a dead end |
| Resolved | Learner has confirmed the trail with database-backed evidence |

Status transitions are learner-initiated. No transition is triggered automatically by query content, AI inference, or hidden correctness checks.

## Thread Content Authoring

Each thread carries authored, spoiler-safe content:

- a structural title describing the line of inquiry
- a category (Crime Scene, Witness, Person, Vehicle, Timeline, Organization, Financial, Communication, Physical Evidence)
- a short summary of the trail in structural terms
- mentor guidance authored in Samuel Tupleton's voice that scaffolds reasoning without naming hidden suspects or solution paths

Mentor text follows the same rules as the rest of the gameplay copy: it references tables, columns, filters, and already-returned learner-visible facts. It never names hidden suspects, never asserts correctness, and never proposes a solution-path query.

## Evidence Linkage

The learner attaches evidence to a thread by picking from their own Evidence Notebook. The frontend does not infer which notebook entry belongs to which thread. If a notebook entry is removed, the system prunes that linkage automatically because the underlying evidence is no longer present.

Threads display their linked evidence inline so the learner can keep their working set visible while writing the next query.

## Persistence

Thread state (status, notes, evidence links) is persisted to browser localStorage under a versioned key so that page refresh, tab restoration, and gameplay navigation do not lose the learner's working set. Persistence is local-first and frontend-only. No backend API or storage is involved.

If the storage layer is unavailable, the system continues in memory without surfacing an error to the learner.

## Spoiler Safety

The thread system preserves spoiler-safe gameplay by:

- authoring all thread titles, summaries, and mentor guidance in structural terms
- never naming hidden suspects, hidden identifiers, or answer-only rows in thread text
- requiring learner action for every status change
- leaving all evidence interpretation to the learner

## Out Of Scope

The thread system does not:

- generate SQL on the learner's behalf
- infer suspect identity from notebook entries
- advance milestones or close the case
- modify backend APIs or SQL execution
- introduce runtime AI behavior
