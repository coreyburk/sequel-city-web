# Detective Rank and Reward System Guide

**Date:** May 14, 2026
**Status:** Working Design Standard
**Version:** 1.1
**Classification:** Documentation Standard - Future Progression and Case Design

## Purpose

This document defines the intended long-term progression model for Sequel City Web Detective.

It exists so future UI, case design, reward wording, and progression implementation all follow one shared system instead of adding isolated labels or mechanics piecemeal.

This guide is the authoritative design reference for future detective-rank and reward work until a later accepted work package revises it.

## Scope Boundary

This guide is for future implementation planning.

It does:

- define the official rank ladder
- define reward terminology and progression rules
- define badge intent and naming
- define tier-oriented case design expectations
- provide a provisional placement for the current murder case

It does not:

- mean the full rank system is already implemented
- define save-file architecture
- define classroom roster or teacher tooling
- define badge artwork production
- define backend persistence or profile APIs

## Executive Vision

Sequel City Web Detective should make SQL learning feel like a data-investigation career, not a sequence of disconnected game points.

Students should feel that they are growing from guided evidence readers into trusted investigators who can handle ambiguity, synthesize findings, and close increasingly difficult cases.

The key psychological shift is:

- not "I finished another level"
- but "I advanced in my detective career because I proved what the data actually says"

## Design Principles

1. Rewards must reinforce verified reasoning and evidence-backed progress, not guessing.
2. Case-local progress and long-term career progression must remain separate.
3. Progression should feel professional and detective-themed rather than arcade-like.
4. The model must remain deterministic and compatible with the project's no-runtime-AI boundary.
5. SQL learning must remain the center of the experience; rewards support the investigation, not replace it.

## Two Progression Layers

### Layer 1: Case Progress

Case progress exists only inside a single investigation.

It should answer questions like:

- How many verified clues has the student logged in this case?
- Which current step is Samuel guiding?
- Which evidence still needs to be proven?
- Is the case still open, narrowed, or closed?

Recommended case-progress language:

- `Clues Logged`
- `Current Lead`
- `Case Status`
- `Case Closed`

Case progress should never act as the main long-term reward currency.

### Layer 2: Career Progress

Career progress spans many cases.

It should answer questions like:

- What detective rank has the student earned?
- How many commendations have they earned across cases?
- Which badges have they unlocked?
- Which case tiers are now available?

Recommended long-term progression language:

- `Detective Rank`
- `Commendations`
- `Badges Earned`
- `Tier Access`

## Official Reward Model

### Keep

- `Clues Logged`

This is strong case-local language and should remain tied to evidence progress in the active case.

### Replace or Reframe

- `Insight Marks`

Recommendation:
Retire this as the primary visible long-term reward label.

Reason:
It reads more like a classroom token than a detective-career reward. It works as lightweight feedback, but it does not naturally connect to promotion, badges, or rank advancement.

- `Samuel's Trust`

Recommendation:
Stop using this as the primary persistent progression value.

Reason:
It is intuitive in a moment-to-moment mentor interaction, but too abstract for a formal career ladder. If retained at all, it should be treated as temporary case-local mentor-state language rather than a permanent currency.

### Introduce

- `Commendations`

Recommended as the official long-term reward currency.

Why it fits:

- professional
- detective-themed
- institutionally credible
- easy to connect to promotions, badges, and case completion

Recommended earning model:

- Correct Samuel check-in answer: `+1 Commendation`
- Case completion: `+3 to +5 Commendations`
- Optional later clean-investigation bonus: reserved for future design

Important rule:

Commendations reward verified learning moments, but they do not bypass case prerequisites or unlock later tiers early.

## Official Rank Ladder

The official detective career ladder for Sequel City Web Detective is:

1. `Junior Data Analyst`
2. `Senior Data Analyst`
3. `Data Inspector`
4. `Data Detective`
5. `Director of Data Integrity`

## Official Tier Definitions

### Tier 1: Junior Data Analyst

Official definition:
Entry-level learner beginning a data-investigation career with close guidance and foundational SQL skills.

Career stage:
Foundational

Responsibility level:
Learning and observation

Authority level:
None; guided by the system and mentor

Role narrative:
`I'm beginning my data career.`

Student competencies:

- simple `SELECT`
- basic `WHERE`
- table and column reading
- following structured clue prompts

Case characteristics:

- short
- guided
- low ambiguity
- minimal or no red herrings
- clear success conditions

Promotion criteria:

- complete all required Tier 1 cases
- demonstrate dependable basic query construction
- show understanding of simple filtering and table reading

Badge:

- Bronze medal
- `Started Your Data Career`

### Tier 2: Senior Data Analyst

Official definition:
Independent learner who can combine evidence sources and write more capable SQL without constant step-by-step guidance.

Career stage:
Developing specialization

Responsibility level:
Independent analysis with guidance available

Authority level:
Technical competence, no leadership framing

Role narrative:
`I'm specializing in data analysis.`

Student competencies:

- multi-table joins across a small number of tables
- multi-condition filtering
- basic aggregation
- increasingly independent investigation steps

Case characteristics:

- moderate guidance
- a few branching clues
- limited ambiguity
- early contradictions or red herrings

Promotion criteria:

- complete all required Tier 2 cases
- demonstrate reliable join construction
- reason across multiple related data sources

Badge:

- Silver medal
- `Reached Individual Contributor Expertise`

### Tier 3: Data Inspector

Official definition:
Verification-focused investigator who specializes in data quality, evidence integrity, contradiction handling, and systematic narrowing.

Career stage:
Quality and verification specialization

Responsibility level:
Evidence verification and careful narrowing

Authority level:
Quality and correctness expertise

Role narrative:
`I'm ensuring data quality and integrity.`

Student competencies:

- multi-table joins
- pattern recognition
- layered verification
- resolving contradictions with evidence
- careful elimination of misleading rows

Case characteristics:

- moderate red herrings
- layered evidence chains
- stronger emphasis on narrowing and verification
- meaningful follow-up query planning

Promotion criteria:

- complete all required Tier 3 cases
- demonstrate systematic evidence validation
- handle contradictions and misleading clues appropriately

Badge:

- Gold medal
- `Specialized in Data Quality`

### Tier 4: Data Detective

Official definition:
Advanced investigator who can lead complex, ambiguous investigations with larger evidence webs and deeper synthesis.

Career stage:
Investigation specialist

Responsibility level:
Complex investigation leadership

Authority level:
Lead investigator capability

Role narrative:
`I'm solving mysteries hidden in data.`

Student competencies:

- sophisticated multi-step investigation logic
- deeper synthesis across several sources
- strategic query planning
- separating signal from noise in larger cases
- handling layered red herrings and ambiguity

Case characteristics:

- substantial branching
- higher ambiguity
- multiple deceptive leads
- longer evidence chains

Promotion criteria:

- complete all required Tier 4 cases
- demonstrate strategic investigation thinking
- synthesize complex findings without over-reliance on guided prompts

Badge:

- Platinum medal
- `Lead Complex Investigations`

### Tier 5: Director of Data Integrity

Official definition:
Executive-level investigator who can reason through ambiguity, strategic implications, and multiple defensible interpretations in large organizational cases.

Career stage:
Strategic oversight

Responsibility level:
Organization-scale data integrity judgment

Authority level:
Executive decision-making and strategic framing

Role narrative:
`I'm leading organizational data strategy.`

Student competencies:

- advanced synthesis
- strategic interpretation
- professional handling of incomplete evidence
- explaining tradeoffs and uncertainty
- reasoning across complex, organization-scale data stories

Case characteristics:

- long-form investigations
- high ambiguity
- multiple valid interpretations
- strategic or organizational scope

Promotion criteria:

- complete all required Tier 5 cases
- demonstrate expert evidence synthesis
- make defensible recommendations under uncertainty

Badge:

- Diamond medal
- `Executive Leadership Achieved`

## Progression Rules

### Rule 1: Sequential Progression

Students may not skip tiers.

Rationale:
Each tier should build the habits, SQL fluency, and investigation mindset required for the next one.

### Rule 2: Case Completion Definition

A case should count as completed only when the student reaches the accepted deterministic case-close condition for that case.

For Sequel City, that should eventually mean:

- the required evidence is logged
- the required verification step is completed
- the accepted suspect or solution check is satisfied

Rationale:
Completion should reflect demonstrated understanding, not superficial progress or partial exploration.

### Rule 3: Promotion Requires Two Gates

Promotion should eventually require both:

1. Tier completion
   The learner completes the required cases in the current tier.
2. Commendation threshold
   The learner earns a minimum number of commendations through verified learning moments.

Rationale:
Case completion alone proves persistence; commendations help reward understanding and not just brute-force finishing.

### Rule 4: No Mid-Tier Promotion

Students should not promote while actively partway through a tier.

Rationale:
Promotion should feel earned as the close of a coherent chapter, not as a surprise interruption in the middle of a case set.

### Rule 5: Promotion Messaging Is Required

Each rank advancement should have an explicit promotion moment.

The system should eventually communicate:

- previous rank
- new rank
- unlocked tier access or new case category
- badge earned

Rationale:
Career progression only feels real when the transition is acknowledged.

## Case Design Standards By Tier

### Tier 1 Case Standards

- no major red herrings
- little to no contradiction handling
- simple story steps
- obvious query targets
- confidence-building wins

### Tier 2 Case Standards

- light branching
- a few misleading possibilities
- joins begin to matter
- some inference required
- guidance becomes less explicit

### Tier 3 Case Standards

- evidence narrowing is central
- contradictions and misleading rows matter
- students verify rather than merely retrieve
- multiple evidence sources must align
- clue logging should reward precision

### Tier 4 Case Standards

- substantial ambiguity
- several red herrings
- longer, less linear evidence chains
- strategic query planning matters
- students must decide what deserves pursuit

### Tier 5 Case Standards

- genuine ambiguity with multiple plausible interpretations
- strategic and organizational implications
- complex evidence synthesis
- some uncertainty remains even near the end
- students justify conclusions, not just produce them

## UI Terminology Standards

### Rank Display

Use full titles exactly as defined in this guide.

Examples:

- `Detective Rank: Data Inspector`
- `Next Rank: Data Detective`

Do not shorten to:

- `Tier 3`
- `Inspector`
- `Level 3`

### Reward Display

Use:

- `Commendations`

Do not use `Insight Marks` as the long-term system label once the runtime migration happens.

### Badge Display

Badges should use the rank-linked label from this guide and should be presented as promotion artifacts, not micro-rewards for every action.

### Case Tier Display

Case-tier language should be used in authoring, filtering, and future progression summaries, but not necessarily foregrounded in the active case UI unless it helps orientation.

## Samuel Guidance Standard

The DataQuest example's Socratic guidance model is valuable, but Sequel City should treat it as a mentor-design principle rather than as proof of an already implemented runtime tutor system.

Recommended adaptation:

- Samuel should guide with questions before answers
- hints should become more specific before becoming directive
- higher tiers should reduce scaffolding and increase strategic prompting
- future guidance systems should preserve evidence-first reasoning instead of auto-solving

This should inform future mentor and hint design, but it should not yet be written as if Sequel City already has a full tier-aware tutor runtime.

## Current Runtime Mapping

Current implemented labels map to the future system like this:

- `Clues Logged`
  Keep as case-local progress.

- `Insight Marks`
  Transition toward `Commendations`.

- `Samuel's Trust`
  Reduce as a persistent reward term.
  If retained, use it only as a temporary mentor-state explanation inside a case.

- `Samuel's Check-In`
  Keep as the assessment pattern that can eventually award commendations.

## Current Murder Case Placement

### Provisional Recommendation

`Case 004: The SQL City Murder` should currently be treated as a provisional `Tier 3: Data Inspector` case.

### Reasoning

The current and planned case structure requires:

- stepwise evidence narrowing
- multi-stage report verification
- witness trail interpretation
- joins and follow-up identity work
- distinguishing correct clues from misleading ones

That places it above a beginner guided case and closer to a quality-and-verification investigation than a fully open-ended expert detective case.

### Important Caveat

This is a provisional placement only.

The final tier assignment should happen after:

1. the full murder case is playable end to end
2. the final query complexity is validated
3. the actual time-to-completion and student confusion points are observed

## Future Implementation Guidance

The first implementation WP that applies this guide should:

1. Rename visible long-term reward language from `Insight Marks` to `Commendations`.
2. Decide whether `Samuel's Trust` is removed or reduced to a case-local mentor-state explainer.
3. Add a compact `Detective Rank` summary surface.
4. Preserve `Clues Logged` as case-only progress.
5. Avoid building a large profile or persistence system in the first runtime pass.

## Version Notes

| Version | Date | Changes |
|---|---|---|
| 1.0 | May 14, 2026 | Initial detective rank and reward system guide |
| 1.1 | May 14, 2026 | Added formal tier definitions, progression rules, case-design standards, UI terminology standards, and Samuel guidance adaptation notes |
