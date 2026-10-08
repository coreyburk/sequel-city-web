# Case 004 Runtime Parity Matrix

Status: WP-286 design implementation, pending independent audit and human acceptance. Source baseline aea394a. These are migration obligations, not claims of backend implementation.

Source: apps/web/src/useStudentCaseState.ts, apps/web/src/studentCase.ts and apps/api/src/services/caseVerificationService.ts. In the current hook, row logging is handled after line 2855, query completion after line 4025, and mastermind display phases after line 1534. Verify line numbers against the implementation baseline during WP-289; code/tests remain authoritative.

| Target step | Existing teaching/evidence behavior | Required completion mode and retained state |
|---|---|---|
| crime-type | Successful CrimeType results enable logging; Murder row records observed CrimeID | log; no fallback identifier when a returned column is missing |
| report-inspection | Broad CrimeSceneReport execution advances Samuel's inspection stage | query; actual successful rows/schema, not text-only matching; no custom draft replacement |
| report-isolation | Matching target report must be selected/logged with CrimeID, city, date and ReportID | log; broad/multi-row execution alone cannot prove isolation |
| witness-observations | Read report-linked InterviewLog; selected row contributes returned transcript bundle for that PersonID; reject confession-only material | log; two distinct witness bundles, retained independently; first log stays in task |
| witness-identities | Query PersonsOfInterest using observed witness PersonIDs and pin both names | log; two distinct proved identities required |
| gym-lead | Filter FitNFlabClub with earned witness membership lead and identify the relevant membership | log; preserve observed membership/PersonID link and existing check-in reasoning, no hidden lookup shortcuts |
| suspect-identity | Resolve PersonsOfInterest from pinned gym lead | log; observed suspect identity, not client name alone |
| suspect-confession | Return the identified suspect's InterviewLog confession; defer mastermind material until first verification | log; observed direct confession linked to proved suspect/report |
| murderer-verification | Evidence Board Test Theory calls controlled verification; trigger_man verdict proves first role | verify; prerequisite confession/identity; wrong theory leaves progress unchanged |
| mastermind-profile | Revisit confirmed killer's report-linked interviews; log new clue categories from actual transcripts until MASTERMIND_PROFILE_TARGETS covered | log; category set rather than duplicate row count; only earned profile facts appear in hints/tokens |
| mastermind-candidates | DriversLicense shortlist using earned profile; pin at least two distinct candidate LicenseIDs | log; actual attributes satisfy profile, equivalent safe SQL allowed; unrelated broad rows do not qualify |
| mastermind-identities | Resolve PersonsOfInterest for pinned candidate LicenseIDs and log at least two identities with PersonID/name/SSN/license | log; links must be proved; retain both alternatives rather than guess a winner |
| symphony-events | Query EventSchedule using earned event clue and pin all three relevant distinct Symphony events | log; one/two rows keep the task active; only actual EventIDs become tokens |
| attendance-comparison | Compare EventRegistration for both proved people and the three proved event IDs; both may remain eligible | query; actual person/event relationships and comparison recorded, no text-only progress |
| employment-comparison | Use earned identity SSNs and event comparison; log qualifying Employment evidence to resolve the wealth clue | log; preserve the ambiguity/tie-break lesson; SQL draft shape is not proof |
| mastermind-verification | Controlled verifier confirms mastermind; mastermind-trace completion | verify; require all preceding proof; final response distinguishes full completion from first murderer verdict |

Prerequisites form one AND chain in the order above. Set-collection steps keep individual accepted items while incomplete; all proofs within a step use distinct stable source keys. Duplicate logging is idempotent, not a second distinct observation. No OR grouping is needed for this release: the attendance comparison can retain two alternatives and continue into the employment tie-break.

Display phases inactive/profile/candidate-narrowing/identity-lookup/event-schedule-lookup/event-registration-cross-check/employment-cross-check/confirmed map to these task keys. Current code sometimes chooses a display phase from SQL draft text or notebook strings and marks some milestones from normalized SQL. Those are implementation defects, not proof semantics to preserve. Backend migration must require actual evidence, keep lesson order, and add regression coverage for a draft-only attempted pivot. Existing comprehension prompts and optional check-in help remain advisory and cannot bypass prerequisites.

WP-289 must trace membership/check-in helper predicates, witness bundle composition, all profile category handlers, candidate matching, attendance equivalence and employment tie-break against fixtures and the complete reference playthrough before releasing. Resolve any newly discovered semantic discrepancy in this matrix and package scope; do not invent missing validator rules from this summary. Preserve the current accepted clue chain while removing frontend authority and automatic draft substitution.

Required parity evidence: fresh entry; broad/zero/wrong rows; first/second witness and identity logs; duplicate logs; deferred mastermind material; both verification roles; incomplete profile/candidates/events; ambiguous attendance; employment tie-break; resume at every collection stage; cross-case isolation; edited draft and stale response preservation. Test both canonical SQL and equivalent safe SQL so validators recognize evidence rather than memorized strings.