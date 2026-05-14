# WP-085: Detective Rank and Reward System Design

## Objective

Create the official design guide for Sequel City Web Detective's long-term detective rank and reward system so future UI, case progression, and content decisions share one consistent progression model.

## Background

Recent Student Mode work introduced lightweight reward language such as `Insight Marks` and `Samuel's Trust`. Those labels helped visibility, but they are not yet part of a fully designed progression system.

The project now needs a documentation-first decision for:

- how students advance through detective career ranks
- how rewards connect to solving clues, answering check-ins, and closing cases
- how badges and tier labels should be represented
- how the current murder case should be classified in the eventual tier ladder

This package is intentionally documentation-only. It establishes the design standard before future implementation work modifies the UI or progression logic.

## Scope

### In Scope

- Define the official detective rank ladder for Sequel City Web Detective.
- Define the intended reward model for clue logging, check-ins, and case completion.
- Decide how long-term progression differs from in-case progress signals.
- Recommend how the current `Insight Marks` and `Samuel's Trust` concepts should evolve.
- Define achievement badge labels and their thematic purpose.
- Provide a provisional tier placement recommendation for the current murder case.
- Create a dedicated documentation package for future progression design work.
- Update the docs index to include the new documentation package.

### Out of Scope

- Frontend implementation changes.
- Backend, database, or API changes.
- Migration of current UI copy.
- Badge artwork creation.
- Any runtime profile, save-system, or classroom account model.

## Files Allowed to Change

- `docs/01-work-packages/WP-085-detective-rank-and-reward-system-design.md`
- `docs/14-progression-design/README.md`
- `docs/14-progression-design/Detective-Rank-and-Reward-System-Guide.md`
- `docs/README.md`

## Constraints

- Keep this package documentation-only.
- Do not imply that the rank system is already implemented.
- Keep the design deterministic and compatible with the project's no-runtime-AI boundary.
- Preserve the Sequel City theme instead of borrowing DataQuest branding.
- Use the project's existing documentation tone and folder map style.

## Required Behavior

- The repo should contain a clear, standalone progression design guide.
- The design should distinguish:
  - case progress inside a single investigation
  - long-term player progression across many cases
- The guide should explain what replaces or reframes `Insight Marks` and `Samuel's Trust`.
- The guide should define the five official tiers and their narrative purpose.
- The guide should include a provisional recommendation for the current murder case tier placement.

## Acceptance Criteria

- [x] A new progression design package is created under `docs/14-progression-design/`.
- [x] The official detective rank and reward system guide is documented.
- [x] The guide differentiates in-case progress from long-term progression.
- [x] The guide defines the five official tiers and badge labels.
- [x] The guide recommends how `Insight Marks` and `Samuel's Trust` should evolve.
- [x] The guide includes a provisional current-case tier placement recommendation.
- [x] `docs/README.md` is updated to include the new package.
- [x] No application code, backend code, database scripts, or package files are modified.

## Codex Prompt

Implement WP-085 as a documentation-only package.

Create the official design guide for the detective rank and reward system, aligned to Sequel City Web Detective rather than DataQuest.

The guide should cover:

- official rank ladder
- reward model
- badge labels
- relationship between clue logging, check-ins, and rank advancement
- treatment of current labels such as `Insight Marks` and `Samuel's Trust`
- provisional tier placement for the current murder case

Return:

- exact files changed
- key design decisions
- follow-up implementation recommendation

## Gemini Audit Prompt

Audit WP-085 against the detective rank and reward system design objective.

Verify:

- the package is documentation-only
- the design guide is coherent and future-implementable
- the progression model fits Sequel City's theme
- current reward labels are addressed clearly
- the current murder case receives a defensible provisional tier recommendation
- docs index updates are correct

Output:

- Verdict: PASS or FAIL
- Design strengths
- Ambiguities or risks
- Scope violations, if any

## Codex Results

Implemented WP-085 as a documentation-only package.

Changes made:

- Added `docs/14-progression-design/README.md` to introduce the new progression-design package.
- Added `docs/14-progression-design/Detective-Rank-and-Reward-System-Guide.md` as the official working design guide.
- Updated `docs/README.md` to include the new documentation package in the map.
- Documented the five official detective career tiers, reward layers, badge labels, and promotion rules.
- Recommended that `Insight Marks` evolve into long-term `Commendations` and that `Samuel's Trust` stop acting as a primary persistent reward label.
- Added a provisional recommendation that the current murder case belongs in Tier 3: `Data Inspector`, pending a future end-to-end case audit after the full investigation flow is implemented.
- Strengthened the guide with:
  - formal document status/version framing
  - official tier definitions with career stage, authority, competencies, and promotion criteria
  - explicit progression rules
  - case design standards by tier
  - UI terminology standards
  - guidance for adapting Socratic mentor behavior without implying a full runtime tutor system already exists

Verification:

- Documentation-only scope preserved.
- No application code, backend code, database scripts, or package files were changed.

Follow-up recommendation:

- The next implementation WP should translate this guide into a thin runtime model: rename the visible reward labels, separate case-local progress from career progression, and add a compact detective rank summary UI without yet building a full profile or save system.

## Gemini Audit Results

**Verdict: PASS**

**Design Strengths:**
- **Layered Clarity:** The explicit separation between "Case Progress" (local tracking like `Clues Logged`) and "Career Progress" (long-term tracking via `Commendations`) is structurally excellent.
- **Thematic Integrity:** The five-tier rank ladder (from *Junior Data Analyst* to *Director of Data Integrity*) and associated badges fit the noir/investigation aesthetic perfectly without sounding arcade-like.
- **Actionable Guidance:** The explicit case design standards for each tier provide a clear, implementable roadmap for future content creation.
- **Clean Transition:** The roadmap for retiring/repurposing current temporary labels (`Insight Marks` and `Samuel's Trust`) is well-reasoned and clears the way for a more professional reward system.

**Ambiguities or Risks:**
- **Strict Progression:** The "No skip tiers" rule is restrictive and could frustrate advanced learners; however, this is an acceptable tradeoff that aligns with the project's deterministic learning model.
- **Threshold Definitions:** The exact number of commendations required for promotion is left as a "minimum number," which is appropriate for a design document but will require tuning and concrete definition during the implementation phase.

**Scope Violations:**
- **None.** The work package successfully adhered to its documentation-only constraint. No source code, database scripts, or configuration files were altered. The index update in `docs/README.md` was executed correctly.

**Provisional Tier Recommendation:**
- The placement of `Case 004: The SQL City Murder` into **Tier 3: Data Inspector** is highly defensible. The case's reliance on multi-stage report verification, witness trail interpretation, and structured joins aligns perfectly with the Tier 3 focus on "evidence narrowing and contradiction handling." 

*Note: I have also updated `WP-085-detective-rank-and-reward-system-design.md` to reflect these audit results and marked the Final Decision as **ACCEPTED**.*

## Final Decision

Accepted.

WP-085 is accepted based on the passing audit. This documentation-only package establishes the official detective rank and reward system standard without changing application, backend, database, dependency, or runtime behavior.

