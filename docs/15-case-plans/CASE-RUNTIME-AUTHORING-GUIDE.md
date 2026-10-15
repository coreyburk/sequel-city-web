# Protected Runtime Case Authoring Guide

## What is data-authored

WP-289 already delivered versioned SQL content, typed briefing/earned facts, backend proof, and one shared Query Lab for both released cases. WP-296 supplies shared feedback and WP-297 preserves immutable versions during the canonical city transition. WP-290 proves reuse through an additional disposable SQL-authored evidence-review case; it does not introduce another production case, UI module, schema or generic validator engine.

Dossiers, task wording, hints, broad starters, supported prerequisite order and typed fact bindings are data. Evidence interpretation, supported source tables, required collection counts and controlled suspect verification are registered backend code. Arbitrary new mysteries are not executable merely by changing SQL rows or identifier labels.

## Record recipe

| Record | Required authored fields and meaning |
|---|---|
| app.CaseDefinition | Stable CaseId/ContentVersion; Title and public Dossier; WholeCaseObjective; EntryStepKey; matching EvidenceVersion; evidence-review or full-resolution CompletionScope; draft/released/retired ReleaseStatus |
| app.CaseStep | Same case/version; stable StepKey and unique DisplayOrder; TaskTitle, StepObjective, SamuelDirection; optional Hint and broad StarterSql; CompletionMode matching registered ValidatorKey; ValidatorParametersJson currently exactly {} |
| app.CaseStepPrerequisite | StepKey and RequiredStepKey in the same version. Every non-entry task must have a predecessor; order is acyclic and prerequisites precede the task. Multiple prerequisites mean AND. |
| app.CaseFactDefinition | FactKey, learner-safe Label, actual public EvidenceColumn, ValueType (text/integer/decimal/date), Cardinality (single/collection). A label cannot change a handler's emitted fact key. |
| app.CaseBriefingFact | FactKey/ItemKey, matching ValueType, exactly one typed value, public DisplayValue. City/date are known briefing information, never earned proof. |
| app.CaseStepFactBinding | Current StepKey, FactKey, input/output use; earned inputs name an earlier proved SourceStepKey; permitted InsertOperator is equals/prefix/contains. Public briefing inputs have no source step. |

Authored rows never contain arbitrary executable validator SQL. Broad starters must be the allowlisted handler table's SELECT * FROM scaffold, without answer filters. Learners refine them through normal safe SQL execution. Whole-case objective and current-task objective are separate fields.

## Supported handlers and limits

The authoritative registries are SUPPORTED_CASE_VALIDATORS in caseContentValidationService.ts and CASE004_HANDLERS in case004ProgressionService.ts. Inspect them and their tests before choosing a handler; a namespace is not a declaration of arbitrary semantics.

| Family | Existing supported behavior | Limit |
|---|---|---|
| case001.crime-type/report/interviews | Query-mode Murder catalogue, clocktower report and linked interview proof | Encodes Case 001's existing evidence semantics; changing text does not create a new poison investigation |
| case004.crime-type | Explicit log of the canonical Murder row; emits CrimeID | Recognizes Murder, not arbitrary crime categories |
| case004.report-inspection | Canonical report archive inspection | Requires expected public report columns/source |
| case004.report-isolation | Log one canonical report matching earned CrimeID and typed briefing city/date; emits ReportID | Reuses this comparison pattern; it is not arbitrary row filtering from JSON parameters |
| Other case004 evidence handlers | Registered witness, identity, gym, confession, profile, license, event, attendance and employment patterns | Their actual clue categories, relationship checks and collection counts remain code; authentic prerequisite outputs are required |
| case004 verification handlers | Ordered, prerequisite-gated murderer/mastermind checks | Existing verifier authority remains Case 004-only; an additional authored case cannot gain suspect verification by referencing a key |

Registered collection metadata and evidence logging are selected from the validated handler, not the case ID. Canonical rows, action ownership, expiry, revision, authored output bindings and prerequisite checks are unchanged. A successful query never substitutes for an authored log task. Query mode, explicit evidence logging and verification have distinct authority.

Supported parameters are currently an empty object; OR/optional paths, arbitrary validator expressions, new crime semantics and additional verifier roles require separately reviewed backend work. A three-task reuse fixture does not prove a complete new mystery or tier classification.

## Worked disposable example

The complete runnable SQL is apps/api/src/services/fixtures/case-runtime-authoring.sql. It is deliberately outside all authoritative database install sections and refuses a non-SequelCityRuntimeTest_ target or an existing fixture identity. The owning bootstrap harness creates a new disposable target and cleans it in finally; do not run this fixture against classroom data.

The example releases case-008, Authored Incident Review, with independent step keys:

1. catalogue uses case004.crime-type/log. A real canonical Murder row is explicitly logged, producing CrimeID.
2. archive uses case004.report-inspection/query, requiring catalogue. A broad archive query proves inspection.
3. incident uses case004.report-isolation/log, requiring archive, the proved CrimeID, and public Sequel City/January 15, 2023 briefing values. The learner logs the isolated actual report and receives ReportID.

Bindings are catalogue -> CrimeID output; incident <- CrimeID from catalogue; incident <- typed city/date; incident -> ReportID output. The example reuses existing public evidence; it neither injects milestone flags nor creates a new React renderer/route/artwork entry. The public library discovers released SQL dossiers through the existing generic entry.

Run the real proof with a new target name:

```powershell
scripts/tests/test-case-runtime-bootstrap.ps1 -DatabaseName SequelCityRuntimeTest_Authoring_New -RunBrowsers
```

It verifies the shipped catalogue first has no case-008, adds the test-only fixture, validates its records, tests draft/retired non-discovery and released-content immutability, and drives real owned API query/log/query/log progress with archive/resume and retained drafts/notes. The browser uses real API calls and the unchanged shared Query Lab; it verifies entry, public facts, ordered proof, reload/resume and completion. Existing full Case 001 and Case 004 v1/v2 regressions run separately in the same disposable harness. The fixture's partial resume is one of three completed tasks; authentic multi-item collection resume remains covered by the released Case 004 tests.

## Validation and publication

1. Complete the full pedagogical plan, tier budget, evidence path, expected result shapes, fairness/spoiler review and release scope using CASE-AUTHORING-TEMPLATE and CASE-VETTING-CHECKLIST.
2. Choose existing handlers only where their exact semantics fit. Inventory their emitted fact keys, source relationships, prerequisites and collection counts. Plan a reviewed handler change when they do not fit.
3. Assemble draft rows under a new version. EntryStepKey can be NULL while assembling; set a valid entry before validation/publication. Keep all same-version checked relationships enabled.
4. Pass assembled CaseContent to validateCaseContent through trusted authoring/test code. It checks supported registry/mode/empty parameters, broad safe starters, types/cardinality, bindings, ordered acyclic reachability and bounded literal-ID checks. There is no general draft-publishing CLI/CMS. The static disposable fixture is pre-reviewed SQL and validates loaded released content in its test; it is not an automatic production publishing service.
5. Human review remains required. The literal-ID scan is not a complete natural-language spoiler detector; it does not understand all answer-bearing prose or pedagogical shortcuts.
6. Publish only through a scoped, audited release package after test proof. Production changes belong in authoritative creation/seed/FK scripts together with readiness and supported additive setup coverage when required. The test fixture never enters shipped seed.
7. Released authored rows are immutable. Publish a new ContentVersion; keep existing attempts pinned to their original content/evidence version. Current discovery chooses the latest released version while saved attempts can resume older supported versions.
8. Draft/retired records are not discoverable or playable. The current immutability trigger also prevents updating an already released definition to retired in place; do not claim a general retirement workflow exists or bypass the trigger. Review a separate design if that lifecycle operation is needed.

## Bootstrap and saved work

Use the accepted single-launch setup path. A recognized supported additive upgrade retains and verifies a COPY_ONLY/CHECKSUM backup and applies its bounded transaction. Unknown/partial schemas stop; the full creation script is destructive and is not the default upgrade path. Destructive rebuilds require separate explicit human authorization and recovery preparation.

Notes/drafts are bounded owned workspace, not proof. Fresh archives earlier attempts; archive/resume preserves their pinned content and accepted evidence. Legacy browser notes/drafts may be recovered explicitly, but local milestone flags cannot be imported as completion. Preserve browser capability/session configuration for ownership recovery; exporting notes alone does not grant proof or ownership. WP-298 separately records the configured database's refused city-description encoding; this authoring work never changes that live dataset.

## Retained legacy dependencies

- App's student route uses released SQL dossiers, useCaseAttempt and the shared protected presentation. Additional released cases do not need a compiled registry.
- AdminInvestigationDiagnostics still consumes useStudentCaseState, which depends on studentCase/studentCase001/studentCase001Progress and recovery/shared types. Preserve them.
- StudentPlayableCaseSkeletonView still imports SkeletonPlayableStudentCaseModule; its test uses CASE_001_PLAYABLE_SKELETON_MODULE. Keep these historical type/fixture exports and their interaction-only tests.
- The unused released-case registry, lookup and storage re-exports in studentCaseModule are retired. Keep independent pedagogical author-vetting tests and generic runtime discovery proof; do not replace those with assertions that merely mirror the removed registry.
- CurrentCaseTask remains a tested compatibility export. No production UI, assets, Admin/recovery flow or legacy local-storage record is removed by this package.
