# WP-321 Case 001 identity clue and interview flow

## Objective and impact

Make the Case 001 identity investigation discoverable through PersonID. The steward statement currently names the suspect, and guidance offers that name before the student queries PersonsOfInterest. The student also reported being asked to log an interview row again after identifying the person.

The steward's interview row has PersonID 62764. The other row has PersonID 27412. The steward's ID must not be presented as the other person's ID. Review the complete player-visible evidence chain and establish a fair reason to investigate a student-observed and logged PersonID. Changing only the hint will not remove the name from the transcript.

Changes may affect canonical bootstrap, authored data, validators, bindings, guidance, saved attempts and installation compatibility. Trace dependencies using the project graph and verify against source before choosing the versioning and migration strategy. Document impact analysis here before implementation.

## Acceptance criteria

- A relevant PersonID comes from earned public evidence and is a clickable condition for PersonsOfInterest. Player-visible text and guidance do not reveal the name before the identity query.
- The case fairly explains which ID to follow, without treating the steward's ID as the suspect's or exposing an unearned ID.
- A previously logged canonical interview row remains meaningful. The student does not have to log the same record twice to establish later progress. Follow WP-319's explicit student logging rule.
- The identity query and explicit Log Clue establish the name and advance the milestone. Unrelated and fabricated rows cannot earn proof.
- Samuel identifies the Evidence Board as the location for submitting the final theory.
- Provide an explicit versioning and compatibility plan for fresh installations, existing installations and saved attempts. Preserve progress and backups. Do not reset or repair a database without separate authorization of the exact target.
- Validate the complete student-visible Case 001 journey, pre-discovery spoiler checks, saved/resumed attempts, alternative projections, first and repeated logs, and final submission. Verify Case 004 through the single registered workspace runner.

## Out of scope

New cases, unrelated schema features, per-run database clones, and unapproved live migration.

## Files Allowed to Change

Allowed:

- `docs/01-work-packages/WP-321-case001-identity-clue.md`
- `docs/00-ssot/SSOT-Case-Authoring.md`
- `docs/00-ssot/SSOT-Case-Progression.md`
- `database/01-SequelCityCrimesDB - Create DB.sql`
- `database/02-SequelCityCrimesDB - Insert Data.sql`
- `apps/api/src/services/case001FullResolutionService.ts`
- `apps/api/src/services/caseAttemptService.ts`
- `scripts/student-package/install-student-database.ps1`
- `apps/api/src/services/case001FullResolution.test.ts`
- `apps/web/tests/browser/case-001-full-resolution.spec.ts`
- `scripts/tests/test-case-runtime-bootstrap.ps1`
- `scripts/tests/fixtures/bootstrap-current-baseline.json`
- `scripts/tests/fixtures/bootstrap-current-authoring-baseline.json`

Implementation uses the files listed below. The human confirmed on 2026-11-18 that existing attempts need not be preserved. Existing installed evidence is not modified automatically; use a separately authorized fresh bootstrap on the exact target.

## Code Prompt

Investigate the causal chain and record an evidence-backed impact analysis and implementation proposal. Explain how previously logged interview records can support later steps without silently logging, revealing future answers, or changing historical proof. Propose transitions for saved attempts and existing installations. Implement the canonical fresh-case changes and validate with the single registered workspace runner.

## Audit Prompt

Independently inspect the student-visible clue chain, ID provenance, spoiler boundary, replay and duplicate handling, historical attempts, canonical bootstrap, installed database transition and full walkthrough evidence. Verify the implementation against the approved scope and SQL safety rules.

## Code Results

The fresh canonical case now requires both interview rows to be explicitly logged in either order, derives the other interviewee PersonID from the selected account, and requires a PersonsOfInterest lookup and log to reveal the name. The earlier logged account is reused to prove the following milestone. Guidance points to the Evidence Board. The existing v3 story and saved attempts are not supported by this revised evidence; the human waived preservation. After testing, the human explicitly authorized refreshing SequelCityRuntimeTest_Workspace on localhost:1433. The exclusive runner verified and retained its recovery backup, refreshed the workspace, and the preview returned ready. The installed classroom database was not rebuilt. Full SQL integration passed including both Case 004 versions, and 14 browser tests passed on the revised fresh fixture. The later hint-label refinement was covered by bootstrap validation and the exact revised signatures. API TypeScript and launcher safety fixtures passed.

## Audit Results

Verdict: PASS

Auditor: AntiGravity (Independent Audit Agent)

### Audit Context & Execution Metadata
- Repository Path: `D:\GitHub-Repos\SequelCityWeb`
- Work Package: [WP-321-case001-identity-clue.md](docs/01-work-packages/WP-321-case001-identity-clue.md)
- External Audit Authorization: Invoked directly via the AntiGravity audit runner (`## Audit Prompt`).
- Worktree Isolation: Verified clean isolation before audit; all 12 modified files and 1 untracked work-package file match `## Files Allowed to Change` with zero out-of-scope modifications.
- Reviewed Surface: Inspected `git status`, full `git diff`, work package contract, SSOT documents, SQL bootstrap/manifest scripts, API progression services/repositories, installer compatibility scripts, and automated test suites.

### Scope Check Summary
All modified and untracked files in the working tree are explicitly permitted by [WP-321-case001-identity-clue.md](docs/01-work-packages/WP-321-case001-identity-clue.md#L25-L42):
- [WP-321-case001-identity-clue.md](docs/01-work-packages/WP-321-case001-identity-clue.md)
- [SSOT-Case-Authoring.md](docs/00-ssot/SSOT-Case-Authoring.md)
- [SSOT-Case-Progression.md](docs/00-ssot/SSOT-Case-Progression.md)
- [01-SequelCityCrimesDB - Create DB.sql](database/01-SequelCityCrimesDB - Create DB.sql)
- [02-SequelCityCrimesDB - Insert Data.sql](database/02-SequelCityCrimesDB - Insert Data.sql)
- [case001FullResolutionService.ts](apps/api/src/services/case001FullResolutionService.ts)
- [caseAttemptService.ts](apps/api/src/services/caseAttemptService.ts)
- [install-student-database.ps1](scripts/student-package/install-student-database.ps1)
- [case001FullResolution.test.ts](apps/api/src/services/case001FullResolution.test.ts)
- [case-001-full-resolution.spec.ts](apps/web/tests/browser/case-001-full-resolution.spec.ts)
- [test-case-runtime-bootstrap.ps1](scripts/tests/test-case-runtime-bootstrap.ps1)
- [bootstrap-current-baseline.json](scripts/tests/fixtures/bootstrap-current-baseline.json)
- [bootstrap-current-authoring-baseline.json](scripts/tests/fixtures/bootstrap-current-authoring-baseline.json)

### Detailed Inspection Findings

#### 1. Student-Visible Clue Chain, ID Provenance & Spoiler Boundary
- **No Pre-Discovery Name Spoilers**: In [02-SequelCityCrimesDB - Insert Data.sql](database/02-SequelCityCrimesDB - Insert Data.sql#L38450-L38454) and [case001FullResolutionService.ts](apps/api/src/services/case001FullResolutionService.ts#L6), the steward's transcript (`LogID=7141`, `PersonID=62764`) now reads: *"I was serving from the big jug. The other person interviewed for this report asked me to leave the mayor's glass in its paper sleeve; they would prepare that drink themselves..."* It no longer reveals `"Les Eskridge"`.
- **Fair ID Provenance**: The steward's `PersonID` (`62764`) is never conflated with the suspect's `PersonID` (`27412`). In [caseAttemptService.ts](apps/api/src/services/caseAttemptService.ts#L390-L398), `witness-account` completes only when both canonical interview rows (`steward` with `PersonID=62764` and `other` with `PersonID=27412` for the proved `ReportID`) have been explicitly logged by the student in either order. Upon completion, it outputs `PersonID:suspect = 27412` (`"Other interviewee PersonID"`) sourced from the `other` interview row (`field(other, "PersonID")`).
- **Clickable Condition & Fact Bindings**: In [02-SequelCityCrimesDB - Insert Data.sql](database/02-SequelCityCrimesDB - Insert Data.sql#L40446-L40476), `CaseFactDefinition` defines `PersonID` (`"Other interviewee PersonID"`, column `PersonID`, `integer`) and `PersonName` (`"Identity from records"`, column `PersonName`, `text`). `CaseStepFactBinding` binds `PersonID` as `output` of `witness-account` and `input` (`equals`) to `suspect-identity` and `suspect-account`, and binds `PersonName` as `output` of `suspect-identity` and `input` to `culprit-verification`.
- **Evidence Board Direction**: Step 6 (`culprit-verification`) Samuel direction in [02-SequelCityCrimesDB - Insert Data.sql](database/02-SequelCityCrimesDB - Insert Data.sql#L40419) explicitly instructs: *"Open the Evidence Board and use Suspect Theory Check to submit the person your evidence supports."*

#### 2. Replay, Duplicate Handling & Single-Log Interview Reuse
- **No Double-Logging Required**: When the student logs the matching `PersonsOfInterest` row (`PersonID=27412`) at step `suspect-identity`, [caseAttemptService.ts](apps/api/src/services/caseAttemptService.ts#L415-L425) inspects `savedRows` for the previously logged canonical `InterviewLog` row (`PersonID=27412`, matching `ReportID`, matching `CASE001_SUSPECT`), verifies canonical proof via `this.canonical004("InterviewLog", "LogID", [previous.row])`, validates authored facts, and records collection proof for `suspect-account` (`Statement:suspect`) using `previous.actionId`. Progress advances from 3 to 5 completed milestones without forcing the student to re-log row 7142, while strictly respecting WP-319's rule that only rows explicitly logged by the student can earn proof.
- **Idempotent Replay & Duplicate Protection**: Request replay via `this.repository.replay(ownerId, input.requestId, digest)` and duplicate clue logging (`hasLoggedRow`, `saveCollection` `IF NOT EXISTS` guards, and `appendNotebookRow` deduplication) preserve revision stability and prevent duplicate notebook entries or milestone inflation.

#### 3. Historical Attempts, Canonical Bootstrap & Installed Database Transition
- **Canonical Bootstrap & Manifest**: [01-SequelCityCrimesDB - Create DB.sql](database/01-SequelCityCrimesDB - Create DB.sql#L536-L554) updates `app.CheckCase001EvidenceManifest` to enforce the revised steward transcript while keeping `case001-complete-v5`. Both [bootstrap-current-baseline.json](scripts/tests/fixtures/bootstrap-current-baseline.json) (`InterviewLog` SHA-256) and [bootstrap-current-authoring-baseline.json](scripts/tests/fixtures/bootstrap-current-authoring-baseline.json) (`CaseFactDefinition`, `CaseStep`, `CaseStepFactBinding` SHA-256s) are updated to match the fresh canonical bootstrap, and [test-case-runtime-bootstrap.ps1](scripts/tests/test-case-runtime-bootstrap.ps1#L154) updates the manifest procedures when switching from historical to current Case 001 seed data during disposable workspace verification.
- **Installed Database Transition & Historical Attempts**: In [install-student-database.ps1](scripts/student-package/install-student-database.ps1#L160), `Assert-StudentEvidence` recognizes both the prior v3 steward transcript and the revised v3 steward transcript so pre-mutation compatibility checks do not misclassify existing installations, while `app.CheckCase001EvidenceManifest` remains authoritative for current v3 readiness and performs no automatic live story rewrite. Legacy v1/v2 attempts remain preserved in storage and report `409` / `compatible: false` when their pinned content/evidence is unavailable, and the human waiver for existing v3 attempts on fresh bootstrap is documented in the work package.

#### 4. Adversarial Contract-Shape, Execution-Safety & Negative-Path Verification
- **Contract Shape**: All required work-package sections (`## Objective and impact`, `## Acceptance criteria`, `## Out of scope`, `## Files Allowed to Change`, `## Code Prompt`, `## Audit Prompt`, `## Code Results`, `## Audit Results`, `## Final Decision`, `## Implementation investigation`) are present and properly formatted.
- **SQL Safety & Execution Boundaries**:
  - `canonical004` in [caseAttemptService.ts](apps/api/src/services/caseAttemptService.ts#L175-L192) rejects literal alias projections and verifies candidate rows against live canonical rows in the database.
  - All SQL queries in `CaseRuntimeRepository` and `CaseAttemptService` use parameterized inputs and `SERIALIZABLE` transactions with `UPDLOCK, HOLDLOCK`.
  - [test-case-runtime-bootstrap.ps1](scripts/tests/test-case-runtime-bootstrap.ps1) and [install-student-database.ps1](scripts/student-package/install-student-database.ps1) enforce local host/port checks, `SequelCityRuntimeTest_Workspace` isolation for test runs, verified `COPY_ONLY` backups with `CHECKSUM` before repair/upgrade, and contain no unauthorized destructive actions.
- **Negative-Path Coverage & Independent Verification**:
  - Executed `git diff --check` (passed with zero whitespace/conflict errors).
  - Independently executed unit and fixture suites:
    - `node --import tsx apps/api/src/services/case001FullResolution.test.ts` -> `PASS full Case 001 bounded prose, exact report isolation and earned report prerequisite`
    - `node --import tsx apps/api/src/services/caseAttemptService.test.ts` -> `PASS` (all 4 unit suites)
    - `node --import tsx apps/api/src/services/caseRuntimeAuthoring.test.ts` -> `PASS registered-handler collection counts independent of case ID; query handlers retain their projection`
    - `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-student-launcher.ps1` -> `PASS: launcher/configuration/safety fixtures.`
  - Verified full walkthrough and negative-path assertions in [case001FullResolution.test.ts](apps/api/src/services/case001FullResolution.test.ts#L42-L89) and [case-001-full-resolution.spec.ts](apps/web/tests/browser/case-001-full-resolution.spec.ts#L95-L154): forged transcript projection rejection, premature theory verification rejection (`422`), wrong person selection rejection (`422`), out-of-order interview logging (`[2, 1]` and `[steward, other]`), alternative column projection (`SELECT PersonID, PersonName FROM PersonsOfInterest WHERE PersonID=27412`), duplicate log feedback (`duplicate` vs `logged`), workspace save/reload/archive/resume persistence, and final theory verification on the Evidence Board.

### Unresolved Limitations & Follow-Up
- None. No out-of-scope changes, runtime AI modifications, or dependency changes were introduced. Ready for human review and final acceptance decision.

## Final Decision

Accepted by the human on 2026-11-18 after user testing and independent AntiGravity PASS, with instruction to commit, merge and push.

## Implementation investigation

The current v3 steward transcript contains the person's name and its exact text is enforced by both the runtime and database evidence manifest. The witness validator currently earns PersonName, identity validates that name, and final verification consumes it. Fact definitions and bindings in canonical seed data expose PersonName at the identity step. Simply replacing the UI token would still reveal the name and would misidentify the steward's PersonID as the other person's.

The human waived existing attempt preservation, so the revised canonical v3 is intended for fresh bootstrap. Existing installations must not be assumed to have been migrated. It must derive the target ID from the separately logged interview row, allow the identity step to complete without re-logging that row, with existing attempts disposable under the human decision. The installer uses recognized signatures and does not migrate existing story data automatically. The fresh bootstrap, manifest, runtime content validation, verifier, and integration fixtures must agree on the new contract. No live database migration is authorized by this WP.
