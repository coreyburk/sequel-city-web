# Query Reinforcement Feedback

## Purpose

This document describes the deterministic reinforcement feedback layer that
helps the learner judge whether a SQL query is moving the investigation
forward. Reinforcement appears after a query executes successfully and
gives one short structural signal in support of the learner's reasoning.

The guiding principle is:

> The system reinforces productive investigation behavior without solving
> the case.

Reinforcement is intentionally light. It does not replace Samuel's guidance,
the Evidence Notebook, or the Case Progress panel.

## Authority Boundary

Reinforcement is frontend presentation-only state. It is computed from:

- the SQL text the learner submitted
- the backend-returned row count for the executed query
- the deterministic milestone map
- the deterministic investigation stage derived from milestones
- the learner's own notebook entries

Reinforcement never:

- decides whether a query is safe to execute
- validates suspect identity
- advances milestones or closes the case
- introduces runtime AI behavior
- names hidden suspects, hidden answer rows, or solution paths
- generates SQL or recommends an exact next query

All authority rules in `docs/00-ssot/SSOT-Investigation-State-Architecture.md`
continue to apply.

## Reinforcement Categories

The reinforcement generator produces one signal per executed query. Each
signal is in exactly one of the following categories:

| Category | Tone | When it appears |
|---|---|---|
| productive-narrowing | positive | filtered query that returns a small, focused result set |
| useful-filtering | positive | filtered query that returns a moderate, workable result set |
| useful-join | positive or redirect | JOIN executed; tone depends on whether the result is still wide |
| relevant-evidence | positive | reserved for future evidence-aligned reinforcement (not currently emitted) |
| investigation-alignment | neutral or redirect | query touches the records the current trail expects |
| overly-broad | redirect | unfiltered or weakly filtered scan of a large table |
| unrelated-results | redirect | query targets tables outside the current investigation focus |
| incomplete-chain | redirect | query executed but returned no rows |

## Stage Alignment

Reinforcement labels carry a short structural stage label so the learner
knows which trail the feedback is anchored to. The stages are:

- `crime-catalog` — opening trail, before the murder code is logged
- `report-filter` — after the murder code is logged, before the report row is pinned
- `witness-trail` — after the report row is pinned, before the witness bundles are pinned
- `gym-trail` — after the witness bundles are pinned, before the gym chain is closed
- `trigger-check` — after the gym chain is closed, before the verification step
- `mastermind-trail` — after the verification step, before the final trail closes
- `closed` — all milestones reached

Each stage has an authored, spoiler-safe focus hint that talks about
record categories (catalog, report archive, interviews, membership, events)
rather than answer identities.

## Feedback Timing

Reinforcement displays directly below the query result table inside the
student Query Lab. It only renders for student-audience query execution
that succeeded, and only when a deterministic signal applies.

Reinforcement does not interrupt the query flow:

- it does not block the run button or the editor
- it does not require dismissal
- it does not steal focus from the result table
- it replaces itself on the next successful execution

## Visual Hierarchy

Reinforcement is intentionally subordinate. The visual hierarchy preserved
in the Query Lab is:

1. Samuel's mentor header guidance
2. Query editor and run controls
3. Query result table
4. Reinforcement feedback panel

The reinforcement panel uses the noir palette already established for the
student workspace and remains visually quieter than the result table and
mentor header.

## Determinism And Spoiler Safety

Reinforcement copy is authored, deterministic, and reviewed for spoiler
safety:

- the same SQL plus the same milestone state plus the same row count plus
  the same notebook always produces the same signal
- no runtime AI inference is performed
- no answer key is read
- no hidden suspects are named
- no answer-only column values are echoed back into feedback strings
- the generator never proposes the next exact query

These guarantees are exercised by unit tests in
`apps/web/src/features/queryReinforcement/generateReinforcement.test.ts`,
including a spoiler-safety sweep across every stage and category.

## Learner Agency

Reinforcement supports learner reasoning, it does not replace it. The
learner still:

- decides which query to run next
- decides which row in the result table to log
- decides what their pinned facts mean
- selects a suspect for verification

The reinforcement panel is allowed to celebrate productive narrowing or
suggest narrowing further, but it never validates a guess and never tells
the learner who did it.

## Out Of Scope

The reinforcement layer does not:

- generate SQL on the learner's behalf
- infer suspect identity from notebook entries
- advance milestones or close the case
- modify backend APIs or SQL execution
- introduce runtime AI behavior
- claim correctness authority over backend evidence or verification
