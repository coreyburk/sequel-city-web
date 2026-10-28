# Case 001 complete mystery clue chain

## Lifecycle reconciliation (2026-10-28)

Status: Superseded - closed initial authoring proposal.

The initial backwards-designed mystery evolved through human review into the six-phase Case 001 v3 described in [the reverse clue chain](../15-case-plans/Case-001-Reverse-Clue-Chain.md). [WP-300](WP-300-case-001-full-resolution-runtime.md) delivered it and [WP-312](WP-312-integrated-runtime-backlog-closeout.md) records integration audit and human acceptance; WP-311 organized its current bootstrap origin. The original three-account/five-task requirements below are historical and must not be reimplemented as a new task. No separate WP-299 implementation or audit acceptance is inferred.

The remaining original proposal/prompt is retained for historical traceability; this disposition governs current routing.

## Objective

Replace the incomplete Case 001 authoring direction with one complete, backwards-designed mystery whose testimony, stored evidence, guidance, hints and terminal conclusion form a fair, executable chain. Produce the authoring specification and identify the exact implementation/release gaps before changing runtime authority or published data.

## Scope

The human requested inspection and, where necessary, a complete logical chain on 2026-10-15, and explicitly selected "Complete mystery with culprit resolution". Authoring direction is authorized; this planning record does not accept or release a new runtime implementation.

In scope: inspect actual released steps, seed evidence and validators; write the full replacement story in docs/15-case-plans/Case-001-Reverse-Clue-Chain.md; decide the culprit backwards from corroborated evidence; author natural witness testimony, a public dossier, report, every step's guidance/hint/starter, expected outputs, author-only SQL examples, spoiler boundaries and completion; specify bounded implementation and rollout requirements.

Out of scope in this planning pass: changing database scripts or live data, implementing new validators/verifier roles, changing classification globally, publishing new case content, accepting, committing, pushing or invoking external auditors. No new dependencies, runtime AI or UI redesign. The existing app continues to run the old three-step evidence-review release until a separately scoped implementation is executed.

## Impact Analysis

### Understand Status

- Required analysis: future case progression, public data, private answer and verification authority cross multiple layers.
- Graph available: knowledge-graph.json, fingerprints.json, meta.json and intermediate/scan-result.json.
- Graph baseline f79c3c5; HEAD 322e5e0. The graph was generated from the WP-290 closeout working snapshot before its commit. Metadata is behind; source inspection is authoritative. Current unrelated planning changes are outside this request.
- Targeted node/one-hop inspection found case001ResultPatternService validators and CaseAttemptService containment. Source confirms CrimeType/report/interview evaluation and the absence of a released identity task. This is advisory evidence, not a claim that graph edges prove narrative correctness.
- Verified against current source: seed report at date 20230502 and its three linked accounts; EventID 2993 is already a four-person ceremony roster (historical inventory is stale); no access-ledger table; hard-coded old transcript token checks; Case 001 release validator restricts it to three evidence-review handlers; protected verification is Case 004-only and role types are trigger_man/mastermind.
- Read-only configured SQL check confirmed first name Les plus 361 Quarter Circle, Vernal selects exactly one existing person: Les Eskridge, PersonID 27412. No evidence, account, application setting or attempt was changed by this inspection.

### Affected Architecture

Authoring specification only now. Future implementation affects authoritative creation/seed/FK manifests, dataset readiness/installer compatibility, immutable app case definitions and bindings, result validation, attempt proof and private single-culprit verification, shared theory API/types and regression/browser fixtures. Candidate sources include case001ResultPatternService.ts, caseContentValidationService.ts, caseAttemptService.ts, caseRuntimeRepository.ts, caseRuntimeRoutes.ts, caseRuntime/caseVerification types and student Query Lab. Verify the full file-level scope in a dedicated implementation WP before edits; this document grants none of those files write permission.

### Regression Surface

Existing Case 001 v1/v2, complete Case 004 v1/v2 paths and both roles, actual learner/repository login boundaries, metadata/privacy, SQL safety, immutable releases, ownership/CSRF/revisions, idempotency, saved notes/drafts/proof and launcher readiness. Changing shared public evidence is a compatibility issue, not just copy editing.

### Graph Update Decision

No regeneration during this author-only planning pass: no architecture/import/schema/runtime changes. Future implementation must own regeneration of all four tracked artifacts after its scoped changes. Do not create a separate refresh package to avoid owning that known work.

## Files Allowed to Change

Allowed:
- docs/01-work-packages/WP-299-case-001-complete-mystery-clue-chain.md
- docs/15-case-plans/Case-001-Reverse-Clue-Chain.md

Do Not Modify:
- database/**
- apps/**
- scripts/**
- .understand-anything/**
- docs/00-ssot/**
- docs/01-work-packages/WP-284-simplify-case-001-query-lab-guidance.md
- docs/01-work-packages/WP-285-case-runtime-architecture-improvement-plan.md
- docs/01-work-packages/WP-298-correct-legacy-city-repair-encoding-signature.md
- docs/15-case-plans/CASE-RUNTIME-ARCHITECTURE-IMPROVEMENT-PLAN.md

## Constraints

Witnesses describe observation and plausible memory, not schema identifiers, SQL instructions, laboratory knowledge or unsupported access records. Samuel owns investigative/database guidance. Each next predicate is public or earned, never guessed. Registration is not attendance, access or guilt. Establish poisoning opportunity before drinking, not after the toast.

Use existing schema and person identity scaffolding without treating random old narrative as meaningful evidence. Explicitly label every new story fact and proposed answer. No final motive or mastermind is inferred. Do not expose the hidden answer in initial runtime guidance.

Do not quietly preserve Foundations classification after replacing the onboarding slice with a full mystery. Record a tier review gate, including the difference between investigation complexity and gratuitous SQL syntax. Existing released content is immutable; altering shared public evidence still needs a tested dataset compatibility boundary. A fresh rebuild is destructive to SQL-owned attempts and requires explicit consent; backup/export and launcher/account setup cannot be hand-waved.

## Required Behavior

1. Document the actual current chain and why the three interviews lead nowhere in the released flow.
2. Define the final conclusion first, then prove each dependency backwards to the dossier.
3. Supply complete replacement report and all three transcripts, with source-of-knowledge limits and a purpose for every account.
4. Specify all forward tasks, exact Samuel direction/hints, broad starters, earned outputs and next transitions. Give author-only reference SQL and expected result cardinality without distributing hidden starter answers.
5. Keep the smallest coherent full mystery: CrimeType -> incident -> three accounts -> unique person -> controlled conclusion. No invented ledger, driver-license detour, unnecessary roster puzzle or new AI engine.
6. State concrete backend, private-role, dataset/version, deployment and testing changes needed for implementation. Do not claim a dialogue patch alone releases a complete mystery.
7. Require adversarial narrative review and real SQL/API/browser completion, including failed guesses, forged evidence and preserved state, before release acceptance.

## Acceptance Criteria

- [ ] Current dead end and unsupported ledger/after-toast logic are documented against actual source.
- [ ] Every reverse dependency and forward next step has a concrete earned evidence source.
- [ ] Natural testimony is separate from official findings and mentor SQL guidance.
- [ ] Candidate clues resolve exactly one existing identity in a read-only check; new guilt/story facts are clearly proposed.
- [ ] Full step/dossier/report/transcript/hint/starter/completion copy and author-only queries are supplied.
- [ ] Report/transcripts fit existing column limits; no false assertion of live publication or saved-attempt compatibility.
- [ ] Tier, verifier role, immutable publication and safe dataset rollout gates are explicit.
- [ ] No runtime, live database, unrelated planning or graph changes occur in this planning pass.

## Code Prompt

Review the authoring specification as an end-to-end mystery rather than isolated copy edits. Try to solve it with only public/earned evidence and identify any unexplained transition, timing gap or source of knowledge. Check each quote against its column limit and the identity predicates against existing rows. Complete this author-only design record without changing runtime files.

Before implementing the application, create a dedicated scoped implementation WP covering the actual affected files and a concrete evidence-version/old-attempt compatibility decision, single-culprit authority contract, classification decision, fresh-seed/launcher readiness and real regression proof. Use this specification as the complete narrative acceptance contract. Do not silently broaden this planning package or mutate the configured classroom dataset.

## Audit Prompt

Independently falsify the clue chain, not just its prose style. Does the timing support poisoning before drinking? Do the witnesses have a plausible reason to know each fact? Does the record search identify one person from earned clues? Does the report provide the missing toxicology rather than making witnesses omniscient? Is there any unsupported inference from registration or physical appearance? Is the conclusion supported without the verifier supplying the missing answer? Check all dialogue lengths, exact real identities, honest tier/compatibility gaps and separation from the old runtime. No live writes or premature acceptance. Report PASS, FAIL or BLOCKED with concrete evidence.

## Code Results

Historical planning only under this identifier. Delivery belongs to the successor packages identified above; no standalone implementation is claimed.

## Audit Results

No separate audit of this superseded proposal is claimed. Successor audit evidence remains in the delivery records above.

## Final Decision

Superseded. Closed as a historical proposal during the human-requested 2026-10-28 reconciliation. Use the successor records linked above; do not execute or finalize this proposal as delivered work. This disposition does not grant independent implementation acceptance.
