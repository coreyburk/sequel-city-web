# Future gameplay ideas

Status: Idea backlog only. No schema, feature, implementation or release approval is implied. Captured from human feedback on 2026-10-28. Evaluate each idea through a separate case plan and scoped work package before implementation.

## Forensic laboratory records

Human proposal: introduce one database table defining lab types and another containing many lab report/log entries. Initial types: DNA, Fingerprints, Ballistics, Blood Spatter, Toxicology and Handwriting.

Working names consistent with existing evidence tables:

- `ForensicLabType`: type identifier, display name and plain-language explanation.
- `ForensicLabReport`: report/log identifier, lab type identifier, incident ReportID, tested evidence reference, finding and result status. Submission/completion dates could support timelines if a case genuinely needs them.

These are conceptual fields, not an approved schema. Start with the two requested tables; do not build a laboratory simulation or generic evidence platform before a case requires it. Link records to the existing incident and use stable evidence identifiers so students discover relationships through SQL. If physical evidence needs its own catalog, plan that explicitly rather than silently inventing a runtime table.

Additional possible categories: trace material/fibers, glass or paint comparison, questioned documents and digital evidence. Choose categories for their role in a fair fictional clue chain; this is an SQL investigation game, not forensic certification or proof that a lab technique identifies a culprit with certainty.

### Gameplay rules for lab clues

- Give the student a reason to look for a lab report: a witness observation, recovered item or incident report reference.
- Findings should answer a bounded question and require comparison with other records. Avoid a report that simply names the culprit or gives the full query path.
- Include negative and inconclusive findings when they fairly eliminate or distinguish leads. Never require students to guess unpublished forensic knowledge.
- Use ordinary vocabulary and explain necessary terms in the case context. The lab category alone must not establish guilt.
- Keep beginner cases on separate SELECT/WHERE queries; introduce joins, grouping and comparisons only when the tier calls for them.
- Keep all current released lab data in the canonical bootstrap scripts if the feature is implemented. Historical/test data belongs separately, following the database source guide.

## Other ideas worth evaluating

| Idea | Contribution to play | Scope discipline |
| --- | --- | --- |
| Physical evidence register | Follow an item from recovery location to witness description and lab finding | Add only when a case needs durable evidence-item links; do not invent unnecessary joins |
| Alibis and event timelines | Compare where people said they were with independent records | Establish what each record proves; registration alone is not attendance |
| Neutral evidence-board connections | Let students connect two collected records and write the inference | Student notes organize reasoning; they never grant SQL proof automatically |
| Competing explanations | Require one corroborating clue to distinguish two plausible leads | Every rejected theory must have discoverable counterevidence; avoid arbitrary red herrings |
| Final evidence-backed explanation | Ask the student to cite the records supporting the culprit theory | Keep deterministic progression and answer verification; avoid requiring runtime AI grading |
| Optional mentor hint ladder | Offer a conceptual nudge, then a table clue, then SQL help on request | Preserve discovery and leave the student's draft intact |
| Short post-case debrief | Explain how the evidence fits and recap the SQL skills practiced | Reveal the explanation after resolution; keep it separate from initial guidance |

Suggested first experiment: one Toxicology lab type/report in a separately planned case slice. It is familiar to the Clocktower story and can move an official finding out of a dense incident report, provided that the revised clue chain still leads students naturally to the lab record. This is a proposal for review, not authorization to change Case 001 or its existing version/data.

Prioritize clue quality, clear guidance and reliable evidence logging before adding more tables. A new record type is useful only when it creates a meaningful investigative decision.
