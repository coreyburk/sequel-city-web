# Samuel Reactive Guidance

## Purpose

This document describes the deterministic Samuel reactive guidance layer.
After the learner runs a query, Samuel can offer a short, authored,
noir-toned mentor reaction that reinforces investigative momentum. The
reactive layer complements the structural reinforcement feedback
documented in `query-reinforcement-feedback.md` without replacing it.

The guiding principle is:

> Samuel reacts to investigative behavior without solving the case.

## Distinction From The Reinforcement Layer

The reinforcement layer is mechanical: it states what the query did to the
result set (narrowed, broadened, joined, returned no rows) and points the
learner at the kind of next move that would help. It is concise and
instructional.

The reactive layer is mentor-toned: it reacts to meaningful behavior with
short authored encouragement, redirection, or acknowledgement of progress.
It is intentionally rare and lighter than the reinforcement panel.

| Layer | Voice | Purpose |
|---|---|---|
| Reinforcement (WP-096) | Structural narration | Help the learner judge whether the result set moved the trail forward |
| Reactive guidance (WP-098) | Samuel, in character | Offer brief mentor reinforcement of investigative momentum |

Both layers are deterministic, authored, and spoiler-safe. Neither layer
generates SQL on the learner's behalf, names hidden suspects, or confirms
a guess.

## Authority Boundary

Samuel reactions are frontend presentation-only state. They are computed
from:

- the deterministic investigation stage derived from milestone state
- the current reinforcement signal (when one applies)
- the deterministic completed-milestone map
- the count of learner notebook entries
- the moderation memory carried by the React hook

Reactions never:

- decide whether SQL is safe
- validate suspect identity
- advance milestones or close the case
- introduce runtime AI behavior
- name hidden suspects, hidden answer rows, or solution paths
- generate SQL or recommend an exact next query
- read or echo back the contents of the `Solution` table

All authority rules in
`docs/00-ssot/SSOT-Investigation-State-Architecture.md` continue to
apply. Backend authority for SQL safety, execution, and suspect
verification is unchanged.

## Authored Response Pools

Samuel reactions are selected from authored copy pools defined in
`apps/web/src/features/samuelReactions/mentorReactionPools.ts`. Every
entry is hand-written, short, and reviewed for spoiler safety.

| Category | Tone | When it can fire |
|---|---|---|
| productive-narrowing | encouraging | reinforcement reports productive narrowing on the current query |
| useful-join | encouraging | reinforcement reports a JOIN that landed in a tight result tier |
| broad-query | redirecting | the learner produced multiple consecutive broad scans |
| investigation-persistence | redirecting | the learner produced multiple consecutive empty-result queries |
| evidence-progression | milestone | a deterministic milestone advanced since the previous reaction |
| clue-discovery | milestone | the learner logged a new notebook entry since the previous reaction |

Selection inside a pool is deterministic. Repeated firings of the same
category rotate through the authored entries so back-to-back reactions
are not identical, but selection never depends on runtime randomness or
AI inference.

## Trigger Moderation

Samuel does not react after every query. The moderation layer is
deterministic and is the same across learners.

Moderation rules:

- A minimum query gap (currently two executed queries) must pass between
  any two reactions of any category. Milestone-tier categories
  (`evidence-progression`, `clue-discovery`) bypass this gap because the
  learner has just earned a meaningful step.
- A per-category cooldown is applied immediately after a category fires.
  The same category cannot fire again until the cooldown decays through
  additional query executions.
- When multiple categories qualify on the same query, the highest-priority
  category wins. Milestone-tier categories outrank structural categories
  so the mentor reacts to the most meaningful event.
- Broad-query and investigation-persistence categories only fire after a
  run of consecutive broad or empty-result queries. A single broad query
  is not enough — the learner is allowed to be wide-open without being
  interrupted.

Silence is acceptable and frequent. The mentor stays quiet whenever no
category passes the eligibility check.

## Visual Integration

Samuel reactions render as a short, italicized aside directly below the
reinforcement panel inside the Query Lab. The aside is labeled
`role="note"` with an accessible label of `Samuel's mentor reaction`.

The visual hierarchy in the Query Lab is:

1. Samuel's mentor header guidance
2. Query editor and run controls
3. Query result table
4. Reinforcement feedback panel
5. Reactive mentor note

The reaction aside uses the noir palette already established for the
student workspace and is intentionally quieter than the reinforcement
panel and the result table. It does not steal focus, does not require
dismissal, and replaces itself on the next eligible execution.

## Determinism And Spoiler Safety

Reactive copy is authored, deterministic, and reviewed for spoiler
safety:

- the same deterministic state plus the same moderation memory always
  produces the same reaction
- no runtime AI inference is performed
- no answer key is read
- no hidden suspects are named
- no answer-only column values are echoed back into reaction strings
- the generator never proposes the next exact query

These guarantees are exercised by unit tests in
`apps/web/src/features/samuelReactions/generateSamuelReaction.test.ts`,
including a spoiler-safety sweep across every stage, reinforcement
category, milestone state, and notebook-state combination.

## Learner Agency

Samuel's reactive guidance supports learner reasoning, it does not
replace it. The learner still:

- decides which query to run next
- decides which row in the result table to log
- decides what their pinned facts mean
- selects a suspect for verification

Samuel may celebrate productive narrowing, redirect a run of broad
scans, or acknowledge an earned milestone, but he never validates a
guess and never tells the learner who did it.

## Out Of Scope

The reactive layer does not:

- generate SQL on the learner's behalf
- infer suspect identity from notebook entries
- advance milestones or close the case
- modify backend APIs or SQL execution
- introduce runtime AI behavior
- claim correctness authority over backend evidence or verification
