# Case 001: The Clocktower Poisoning — reverse clue chain

## Human decisions

Case 001 introduces basic SQL while retaining an actual mystery. On 2026-10-16 the human clarified that five steps is not a hard requirement; use the natural number of clue phases. The human approved selective poisoning plus separate preparation/service, without a witness seeing a bottle being added, and requested Les's own statement. This six-phase path supersedes the prior archive-inspection/five-task design.

## Resolution and evidence fairness

Les Eskridge supplied and served the mayor's separate drink. The report establishes that only the mayor's glass contained poison; the communal jug and other drinks were clear. The steward identifies Les, remembers a separately prepared glass, and describes uninterrupted custody until delivery. Les's own account explains the missing source: his personal drink mix, used for nobody else. The student must connect the laboratory finding, the steward's memory, and Les's claim. No witness reports seeing poison or an overt poisoning. The case concludes who supplied the poisoned drink; the statements do not establish a motive or a larger conspiracy.

## Authored records

### Incident report

Clocktower ceremony, May 2: the mayor collapsed after the noon toast. Toxicology found poison in his red-ribbon glass. The shared jug and the other served drinks tested clear. A statement was taken from the serving steward.

### Serving steward — PersonID 62764

I was serving from the big jug. Les Eskridge asked me to leave the mayor's glass in its paper sleeve; he would do that drink himself. I know Les from last year's ceremony. He unwrapped it and poured at the side table while I served the crowd. He kept the red-ribbon glass with him, then handed it straight to the mayor for the toast. The other drinks came straight from my tray. I remember being annoyed that he wouldn't just take one of those.

### Les Eskridge — PersonID 27412

Yes, I made the mayor's drink. He never liked the ceremony punch, so I used a drink mix for his. I kept the mix in my coat until I prepared his glass at the side table. I didn't use it for anyone else. Once I'd handed him the glass, I went back to the bell ropes. What happened after the toast wasn't anything to do with me.

The current dataset contains one city/date incident and two linked statements. The report's reference to a serving steward supplies a fair vocabulary bridge to that account. A ReportID search can expose both accounts; open exploration is allowed. PersonName -> PersonsOfInterest.PersonID confirms the named speaker before the student's targeted suspect interview query. Existing unrelated records remain background data, not required red herrings.

## Natural progression

1. Identify Murder in CrimeType. Selecting Log Clue on the canonical Murder row earns CrimeID 1080 and the Pinned Fact “Murder CrimeID”. Broad exploration is supported, but it is not a separate milestone.
2. Find the report using city/date from the briefing and the earned CrimeID. One canonical report earns ReportID. Read the lab findings; no suspect name is in the briefing or report.
3. Follow ReportID into InterviewLog and retrieve the steward's account. Read the results and distinguish the serving account. The named Les becomes an earned PersonName, not a verdict.
4. Find that name in PersonsOfInterest and retrieve its PersonID. This uses one basic WHERE query, no join or guessed identifier.
5. Retrieve Les's incident statement using the earned PersonID and ReportID. His explanation supplies the private drink mix source; compare both accounts and the lab findings. No verification is allowed before this proof.
6. Resolve the investigation through controlled culprit verification. Use the full name supported by the proved identities and statements. No prefilled answer, client flags, arbitrary SQL literals or free-text reasoning can establish completion.

## Scaffolding and presentation

Initial briefing supplies only city/date, the incident and the objective. Display it once. Query starters identify current public tables; optional hints describe filters and linking columns. Current directions ask the student to read and compare, without narrating the final inference. Briefing and guidance use intrinsic height and a responsive one-column label/value flow; text remains inside its region at desktop, medium, mobile and enlarged text sizes.

Pinned Facts are backend-earned outputs. Murder is pinned only after the student logs the canonical Murder row; ReportID after the incident; Les's name after the steward; PersonID after the name lookup; the interview finding after Les's statement. Logging Murder proves the first selected-row task and saves its fact/note. Other query tasks are proved by execution; their Log Clue action saves an optional notebook note.

## Tier and compatibility

Tier 1: six clear phases, simple separate SELECT/WHERE queries across CrimeType, CrimeSceneReport, InterviewLog and PersonsOfInterest; no joins or aggregation. Three people (victim, steward, Les), three narrative records, no major red herrings or unresolved contradictions required for the accepted conclusion. Natural progression replaces the arbitrary task cap.

Publish Case 001 content v3 with exact evidence marker case001-complete-v5. Current fresh scripts directly seed this bundle. Legacy report/three-account fixtures remain separately supported and guarded to owned disposable tests. Old content and raw saved work remain preserved; legacy proof is incompatible on the changed dataset. The launcher never silently rewrites a classroom story. New preview builds use a newly named isolated database, retaining previous preview work.

## Verification and observation

Real SQL must reject forged records, wrong owners, wrong report/person links, missing/corrupt statements, and verification before Les's own account. Browser checks cover responsive briefing bounds, no duplicated Snapshot, earned Murder Pinned Fact, all six phases, notebook semantics and save/reload/resume. Preserve Case 004 and legacy regression coverage. Independent audit and human acceptance remain pending.

Observe first-time students: can they explain the link between the report and accounts, why the shared drink source matters, and which part of Les's statement changes the inference? Automated completion does not prove comprehension. Do not pad the case to meet a duration target.

## Story context across surfaces

Shelf premise: A civic celebration ends with the mayor's sudden death. Follow the records to uncover what happened at Sequel City's clocktower.

Canonical full background, authored once in the SQL Dossier: May 2, 2023. Sequel City gathered beneath the clocktower for a civic celebration. During the noon toast, the mayor collapsed in front of the crowd. What first looked like a medical emergency became a murder investigation. The city's records hold the accounts of those involved. Follow their evidence and establish who was responsible.

The Case Page and Samuel's Briefing show the same full background, each once in its own view. During Query Lab, Case File -> Case Facts -> Case background exposes that same text without replacing the current Samuel direction or changing the draft. The shelf shows only its short presentation teaser, not a step-count or an evidence roadmap. All initial context excludes laboratory findings, suspect names, identifiers and drink-source details.
