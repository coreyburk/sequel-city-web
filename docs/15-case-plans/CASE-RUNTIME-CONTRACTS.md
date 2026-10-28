# Case Runtime Implementation Contracts

Status: WP-286 contract independently audited and accepted. WP-287 implements the protected foundation; WP-288 implements Case 001. WP-289 implements the single student Query Lab, complete Case 004 progression and typed authoring extension; independent audit and human acceptance remain pending.
Baseline: aea394a, 2026-10-08. React/Vite, Fastify/TypeScript and local SQL Server remain the stack. No additional runtime dependency is required by this contract.

## Ownership and delivery gates

SQL Server stores versioned authored content and durable attempts. Backend allowlisted validators own progression; React renders the current task and accepts learner input. Seed scripts are the shipped authoring source. Case dossier objective describes the whole investigation; current-task direction describes only the eligible step. Case 001 remains its released evidence-review scope, not a completed culprit investigation.

Implementation sequence: WP-286 contracts -> WP-287 protected foundation -> WP-288 Case 001/shared page -> WP-289 Case 004 parity -> WP-290 authoring proof/cleanup. Every predecessor requires independent audit and human acceptance before its dependent package begins. WP-284 is superseded implementation scope, retained as historical context; its frontend-only proposal must not execute. WP-285 records the original reviewed direction.

## Browser ownership and request protection

Mint 32 cryptographically random bytes as an opaque owner capability. Store only its SHA-256 hash in app.LocalLearner. Deliver the capability in a host-only HttpOnly cookie named sequel_owner, Path=/api, SameSite=Strict, Max-Age=31536000. Use Secure under HTTPS. Plain HTTP is supported only for explicit loopback development; startup rejects non-loopback HTTP use. Never log cookies or return the capability in JSON. Clearing the cookie loses access; this is browser continuity, not a human login or cross-device recovery.

Configure CASE_RUNTIME_ALLOWED_ORIGINS as exact origins, defaulting in development to http://localhost:5173 and http://127.0.0.1:5173. Origin comparison includes scheme, host, and port. Responses echo only a configured origin, set Vary: Origin and Access-Control-Allow-Credentials: true; never use wildcard origins. Frontend API requests use credentials: include and retain the same hostname for frontend/API. Loopback hostname mismatch is a setup error, not a reason to relax cookies.

GET /api/session establishes or resumes an owner and returns a CSRF token bound to that owner using HMAC-SHA256 and a configured stable CASE_RUNTIME_SESSION_SECRET (minimum 32 random bytes; no source-controlled default). Reject untrusted Origins even for session issuance. All mutations, including initial session issuance, require an exact trusted Origin. Owner mutations additionally require JSON Content-Type and X-CSRF-Token, compared in constant time. GET session is the narrowly defined bootstrap exception to having an existing CSRF token, not to trusted Origin validation. CLI tests supply configured Origin and cookie/token explicitly. Missing Origin is rejected on runtime mutation routes; no permissive localhost, Referer or Fetch-Metadata fallback. Ordinary read routes do not mutate progress. Cookies, CSRF secrets and repository credentials never appear in query history, error messages, graph artifacts or exports.

## Content schema and validation

Application schema is app; existing public evidence tables remain dbo. Identifiers are NVARCHAR bounded keys; use DATETIME2 UTC timestamps and BIGINT revisions (serialize revisions as decimal strings). UUID identifiers are UNIQUEIDENTIFIER minted server-side.

| Table | Required key/constraints and payload |
|---|---|
| CaseDefinition | PK (CaseId, ContentVersion); positive INT version; title, dossier, WholeCaseObjective, EntryStepKey, EvidenceVersion, CompletionScope, ReleaseStatus (draft/released/retired). Released rows immutable. |
| CaseStep | PK (CaseId, ContentVersion, StepKey); FK to definition; unique DisplayOrder per version; TaskTitle, StepObjective, SamuelDirection, nullable Hint/StarterSql; CompletionMode (query/log/verify); ValidatorKey and bounded server-only ValidatorParametersJson. |
| CaseStepPrerequisite | PK (CaseId, ContentVersion, StepKey, RequiredStepKey); two same-version FKs to CaseStep; CHECK distinct step keys. All prerequisites AND. No OR/rules interpreter initially. |
| CaseFactDefinition | PK case/version/fact; authored label, public EvidenceColumn, checked ValueType and cardinality; same-version definition FK; unique fact/type key. |
| CaseBriefingFact | PK case/version/fact/item; typed value columns with exactly one populated according to ValueType, separate display text; same-version fact/type FK. Public known facts cannot establish proof. |
| CaseStepFactBinding | PK case/version/step/fact/use; input/output use, optional source step and bounded insertion operator; same-version step/fact/source FKs; author validation requires source output and prerequisite ancestry. |
| AttemptEvidenceItem | PK attempt/step/item; stable distinct observation key, owned ActionId, validator version and bounded private proof; checked same-version attempt/step and owned-action FKs. Partial items never satisfy prerequisites. |
| LocalLearner | PK OwnerId; unique BINARY(32) capability hash; CreatedAtUtc, LastSeenAtUtc. No student PII. |
| LearnerRequest | PK (OwnerId, RequestId), checked FK to LocalLearner; BINARY(32) digest, bounded JSON outcome, UTC creation. Separate from attempt deletion so lifecycle/workspace retries remain idempotent. |
| LearnerAttempt | PK AttemptId; FK OwnerId and content version; unique (AttemptId, CaseId, ContentVersion); EvidenceVersion; Status (active/completed/archived/incompatible); ArchivedFromStatus nullable active/completed; Revision; Created/Updated UTC. |
| AttemptWorkspace | PK/FK AttemptId; bounded WorkspaceJson (ISJSON); revision uses owning attempt. Separate offered starter from learner draft. |
| AttemptAction | PK ActionId; FK AttemptId; unique (AttemptId, RequestId); action kind/query/log/verify; request digest, prerequisite revision, SQL or submission reference, validator result, bounded proof JSON, creation/expiry UTC; unique (AttemptId, ActionId). |
| AttemptStepEvidence | PK (AttemptId, StepKey); CaseId, ContentVersion and composite FK to attempt; same-version FK to step; qualifying ActionId with composite FK (AttemptId, ActionId); ValidatorVersion, observed facts/proof summary, UTC. |

Foreign keys use WITH CHECK and NO ACTION; deletion is explicit transaction in child-first order. Insert definitions and steps before entry-step FK is added in the foreign-key script; that FK is same-version and checked after seed. Prerequisite graph must be acyclic, reachable from entry and have unambiguous eligible DisplayOrder. Validate JSON parameters against the chosen handler schema, public evidence names, safe SELECT starters, required messages, completion scope and no hidden identifier interpolation. Unsupported validators, cycles, missing prerequisites or incomplete released paths prevent release/readiness. Content is not executable SQL/JavaScript. No future step prose/validator parameters is returned to students.

Retain the case-runtime-v1 foundation marker and require the case-runtime-v2 extension with explicit released-content/evidence manifests; readiness checks objects, columns, checked FKs, content validation, roles and permissions, not only the latest legacy migration name. Attempts pin immutable content and evidence versions. Changed released content receives a new version. Never silently remap old attempts.

## Progress and proof

Resolve the lowest DisplayOrder incomplete step with all prerequisite proofs. Query mode completes only from actual returned rows/columns after safety approval; log mode requires a selected row from a backend-issued execution, never client-supplied row values; verify mode uses controlled database verification with attempt context and proved prerequisites. Source matching by SQL text alone is not proof. Hint expansion, starter application, notes and draft changes never advance progress.

Retain qualifying proof while its attempt exists: source SQL (maximum 32 KiB), evidence keys/selected columns, row count, handler version, prerequisite revision, action ID and server validation summary. Do not persist entire unrestricted result sets. Unlogged executions may retain bounded selectable proof candidates for 24 hours, maximum 100 per attempt; exceeding bounds returns an explicit limit response, never truncated correctness proof. Cap proof JSON at 64 KiB/action; allowlisted handlers select relevant candidates. If candidate evidence cannot fit, query results remain visible but logging requires refinement. Qualifying proof remains durable; expired candidates require re-execution. No automatic attempt deletion. Notes/draft workspace maximum 256 KiB, draft maximum 32 KiB; reject oversize writes without losing prior data.

SQL execution succeeds separately from saving proof. On repository failure return rows plus progressSaved=false and a retryable message; show no completed task. Log/verify persistence is transactional. Every mutation requires UUID RequestId and ExpectedRevision. Lock the attempt row, check owner/status/version/revision, insert action/evidence and increment revision in one transaction. A duplicate RequestId with identical digest returns recorded outcome and current snapshot; different payload returns 409. Concurrent stale revision returns 409 and latest owned snapshot. Do not keep a transaction open while arbitrary SQL runs: validate and execute against the current snapshot, then lock/recheck revision before accepting proof. Old execution responses cannot complete a newly selected task.

## API and presentation

| Route | Purpose and boundary |
|---|---|
| GET /api/session | Trusted-origin owner bootstrap and CSRF token; no step data |
| GET /api/cases | Released public dossiers/objectives/completion scope only |
| GET /api/cases/:caseId/attempts | Owned summaries, archived/incompatible labels and saved progress |
| POST /api/cases/:caseId/attempts | Fresh compatible attempt at entry; atomically archive prior active attempt of that case, retaining it |
| GET /api/attempts/:attemptId | Owned pinned-version current task/workspace snapshot; no progress mutation |
| POST /api/attempts/:attemptId/resume | Restore archived original active/completed status after compatibility check; archive another active attempt of same case |
| POST /api/attempts/:attemptId/query | Safe learner connection; execution rows/action reference and resulting snapshot |
| POST /api/attempts/:attemptId/evidence | Log server action/row reference with optional annotation; row values not accepted as proof |
| PATCH /api/attempts/:attemptId/workspace | Bounded learner notes/draft/view only; reject progress fields |
| POST /api/attempts/:attemptId/verify | Controlled suspect verification with case/attempt context |
| POST /api/attempts/:attemptId/archive | Preserve an owned attempt with its original status |
| DELETE /api/attempts/:attemptId | Confirmed deletion of this owned attempt only |

Return 404 for missing/wrong-owner IDs, 409 for stale/incompatible state, 422 for invalid evidence or workspace, 503 for repository unavailability. Request schemas reject additional authority fields. Session CSRF header must be included in allowed preflight headers; include PATCH in methods. Safe reads are owner-checked where applicable.

Snapshot shape: { caseId, contentVersion, evidenceVersion, attemptId, revision, status, completionScope, progress: {completed, total, savedAtUtc}, task: null | {stepKey, title, objective, direction, hint?, starter?: {sql, placeholders}}, facts: [{key, label, value, sourceActionId}], workspace: {draftSql, notes, selectedView} }. Null task means released scope complete, not automatically solved. Response facts are from accepted backend proofs only. Placeholders use a bounded typed map from facts; missing values remain explicit placeholders and block Use starter execution until the learner supplies them. Schema names are not earned identifiers. Public case dossier contains WholeCaseObjective, not this task objective.

Shared Query Lab renders one direction, an optional native details/summary hint, proved facts/schema tools, editor and actual results/event feedback. Case-specific React branches and repeated next-step panels are removed per migrated case. Applying a starter is explicit and asks before replacing a nonempty changed draft. On task change preserve the draft; label it retained while showing the current offered starter. Track local unsaved edit generation as well as server revision so a workspace response cannot overwrite typing after dispatch. Late query/save responses must match active attempt/version and not supersede newer revisions.

## Bootstrap coverage and safe installation

| Authoritative file | Required responsibility |
|---|---|
| database/01-SequelCityCrimesDB - Create DB.sql | All app tables/checks/indexes and role creation; no duplicate shadow schema. Existing destructive rebuild remains explicit human operation. |
| database/02-SequelCityCrimesDB - Insert Data.sql | Versioned definitions/steps/prerequisites and runtime/evidence manifest, including Case 001 and later Case 004. One shipped content source. |
| database/03-SequelCityCrimesDB - ForeignKeys.sql | All checked app relationships/entry-step FK and role grants after seed; no new NOCHECK constraints. |
| apps/api/src/services/databaseBootstrapService.ts | Provision scoped accounts consistently; remove learner db_datareader membership; never auto-drop/rebuild on mismatch. |
| apps/api/src/services/databaseIdentityService.ts | Explicit runtime object, permissions, manifest and content readiness checks; reject partial bootstrap. |
| scripts/student-package/setup-local-sql-accounts.ps1 | Mirror bounded roles/credentials and configuration; top-level shim continues delegating. |
| apps/api/src/config/database.ts and db pools | Separate learner execution pool and parameterized app repository pool; fail closed on missing/misassigned credentials. |

Learner role grants SELECT on explicit dbo evidence objects only; DENY SELECT/INSERT/UPDATE/DELETE on app schema and hidden Solution/CaseAnswerKey, deny VIEW DEFINITION, no broad db_datareader membership. Existing controlled suspect verification must remain on its dedicated trusted path; deny must not accidentally disable the verifier's ownership-chain behavior. Repository role has only content SELECT and needed attempt table DML, no DDL, no broad reader and no arbitrary learner execution. Bootstrap role remains separate. Schema metadata uses a trusted bounded reader and emits only explicit public table/column/FK metadata, never general catalogs to the learner. SQL checks deny system catalogs/functions, forbidden object references and internal views/synonyms in addition to DB permissions. Test metadata extraction under the actual learner login: ordinary table DENY alone is insufficient.

Installed old databases report setup-required; do not silently run base destructive scripts or load story content through automatic migrations. Existing legacy migration behavior must not declare the new runtime ready. Document SQL Server backup/restore plus workspace export before an explicitly authorized rebuild. Full attempt recovery uses database backup and preserved browser capability; workspace export is learner notes/draft only and grants neither ownership nor proof. Smoke tests rebuild only a named disposable database with verified target identity; never default SequelCityCrimesDB. Check create -> data -> FKs -> account setup -> readiness -> API startup from zero, repeat readiness, and partial/mismatched bootstrap failure. Deliver base-script changes in the same WP as each new schema/content release.

## Migration and verification

Legacy saves remain backed up and available until explicit removal. Import notes/draft as untrusted workspace; frontend milestone flags never become proof. Re-execution requires normal safety, ordered backend validation and a bounded user-visible replay action. Case 001 query-mode foundation/report/interview milestones preserve the existing evaluator requirements; logging adds learner notebook entries without changing those query-mode semantics. Fresh begins with CrimeType and no congratulations for unobserved rows. Case 004 uses the parity matrix; unsupported paths block migration rather than jump clues.

Required audit evidence: source-traced parity; actual SQL permission/metadata adversarial tests; zero-state bootstrap; API owner/CSRF/version/concurrency/idempotency negatives; custom-draft reload/race checks; both live reference playthroughs; synthetic fixture data-only authoring; no runtime AI. No live destructive database action is authorized by this contract.

## WP-291 single-launch installation

The single-launch installer owns bounded local installation before API startup. Supported transitions are newly claimed empty database to current, recognized compatible legacy database to current after a retained verified backup, and current to verified current. Explicit authoritative script sections keep runtime definitions in the three base SQL scripts; app/content installation is not delegated to automatic story migrations. Legacy additions execute in one transaction, preserve public evidence and never rebuild an existing database. Unknown or inconsistent schemas stop. Persist random bounded credentials and the session secret; disable privileged setup in a launcher-managed verify-mode student API. See CASE-RUNTIME-BOOTSTRAP-RUNBOOK for execution and recovery boundaries.

### Evidence Board projection

Attempt snapshots include evidenceSteps, ordered by the pinned app.CaseStep.DisplayOrder, with stepKey, title from TaskTitle, and status (proved or current). Only completed steps and the eligible current task are projected. Completion comes from app.AttemptStepEvidence, never notebook text or frontend guesses. Future steps, guidance, hints, starters and validator fields remain withheld. Existing creation and seed scripts already contain these authored step records; this projection requires no schema/data migration.

## WP-289 schema extension design (2026-10-14, implementation in progress)

Authored facts have explicit case/version keys, public-column bindings and value types. CaseFactDefinition describes a fact; CaseBriefingFact supplies public known values; CaseStepFactBinding determines the current task's input/output facts and their earned source step. These records are immutable once released. They contain no arbitrary executable expression or SQL fragment.

AttemptEvidenceItem stores distinct accepted observations with an owned source action and same-version step/attempt relationships. Partial collections survive independently of completed milestones. AttemptStepEvidence retains its existing meaning: a completed step. A transaction accepts an item, derives collection completion through its registered backend validator, optionally inserts completed-step proof, and increments the attempt revision. Stable item keys make duplicates idempotent; client notes never count.

Use bounded private JSON for heterogeneous evidence detail, not relational identity, uniqueness, ownership or authored fact type. Existing AND prerequisite graphs support branches and joins. Do not claim OR/optional-path support until its eligibility/completion semantics are separately implemented and tested. Display order resolves presentation priority among eligible tasks and cannot replace prerequisites.

Existing pinned content stays immutable. New authoring fields are published in a new content version; old versions remain readable. Creation, data, checked-FK and additive-launcher setup scripts must agree. Readiness checks the extension and supported released versions; it must not silently accept a partial installation.

Draft assembly contract: EntryStepKey may be NULL while an unpublished draft's steps are assembled. A checked CK_Definition_ReleasedEntry requires an entry before ReleaseStatus becomes released; the existing same-version FK validates that entry. This removes the circular insert dependency for additive publishing without disabling constraints. Released rows remain immutable, and old attempts keep their original entry.

WP-289 delivery invariants: one StudentQueryLab and one ProtectedCaseQueryEditor serve all released cases. The app's student route does not instantiate useStudentCaseState or StudentWorkbenchView; the latter is retired. QueryRunner and legacy thread diagnostics are Admin-only. The library uses released database dossiers for availability and supports additional released case keys without another page component. Artwork remains presentation metadata.

Schema readiness now reports case-runtime-v2 and checks the v1 foundation plus extension tables, columns, checked relationships, release entry check, immutable triggers, repository grants, required released content and both evidence manifests. The launch installer recognizes intact v1 installations, retains and verifies a COPY_ONLY/CHECKSUM backup, applies the authoritative extension blocks in one transaction, and validates before commit. Unknown/partial extensions stop. The original extension path never modifies existing public evidence; WP-297 adds only the fixed-identity backed-up city correction described below. Fresh DriversLicense seed sentinels are synchronized to the verified accepted live Case 004 records.

Case 001 version 1 stays immutable and readable; new attempts use version 2 with typed briefing facts and starters without terminators. Case 004 version 1 includes all sixteen tasks. Current hint tokens use typed authored fact bindings, not narrative parsing or inferred column names. Only earned prerequisite outputs and public briefing facts are eligible for insertion; values are quoted by type and the bounded operator. Existing pre-extension fact projections retain their original compatibility behavior.
## Query attempt feedback (WP-296)

The executor returns an optional typed QueryAttemptFeedback payload alongside the existing response. It separates execution (blocked, failed, succeeded or not-repeated) from evidence (unchanged, ready-to-log, partial, proved, complete or not-saved). Stable category, severity, title, explanation and nextAction are public teaching data; raw exceptions, server/database identities, private metadata and validator parameters never form part of this payload.

Technical categories are selected from structured SQL Server/driver codes. Invalid columns/objects, ambiguity, syntax, conversion, timeout, connection failure and unknown causes have distinct safe actions. Detailed wrong-table column explanations require the public schema plus an invalid-column diagnostic; joins/CTEs/unsupported shapes receive an honest generic explanation. The existing safety/unknown-table policy runs first and is not relaxed. A column/object error is not used to expose whether a private object exists. Metadata failure leaves safe generic feedback available.

CaseAttemptService interprets result counts and its existing canonical validator outcome; the feedback service cannot execute SQL, write proof, evaluate an answer, invent a clue or advance progress. Zero rows suggests checking observed values/relaxing conditions, without disclosing correct values. Broad results are valid inspection work when the authored handler accepts them; isolation/narrowing advice follows validator rejection or the actual candidate storage limit, never a universal row threshold. Log-ready feedback uses the existing pure collection handler on canonically checked candidates. It describes rows as available to inspect/log, not as already proved. Partial collections report durable accepted/required counts; duplicate logging remains a no-op with an explicit duplicate notice. Completion preserves evidence-review versus full-resolution scope.

rowCount counts returned rows, not an inferred total population. A response explicitly marked isTruncated is described as at least that many rows. No truncation is assumed from a round number, TOP clause or count alone. Execution/persistence failure keeps the draft/results and reports that proof was not saved. Request replay is reported as not repeated; ownership, CSRF, revisions and evidence action provenance remain unchanged.

The shared Query Lab displays one status area with explanation and one next action, using the existing green clue-log feedback style. It replaces the browser's former SQL-string heuristic. Results are bound to the originating attempt and latest dispatched run; edits are explicitly distinguished from the last executed SQL. Feedback never silently rewrites a draft, applies a starter or logs evidence. Legacy API consumers without feedback retain the existing message fallback. Briefing tokens remain visible before query execution and are separate from earned proof.


## Canonical city compatibility (WP-297)

The current fictional report city is Sequel City. Fresh seed and repaired evidence agree on the same fifteen legacy report identities; ReportCity is the only public evidence column changed. Person-address data, original verifier narrative and historical records retain their original values.

New Case 004 attempts use immutable content version 2. Version 1 remains stored unchanged and readable. The repository validates released source records, then projects only the known Case 004 v1 briefing city and public guidance to Sequel City. Source proof, IDs, status, notebook text and SQL drafts remain unchanged. A v1 notice tells learners to edit historical SQL City filters and rerun queries; pre-correction report candidates cannot be logged against canonical current evidence. Existing accepted ReportID proof continues to establish its original identity.

The one-launch installer recognizes an intact old runtime, checks the fixed report identity/CrimeID/date/description signatures, retains a verified COPY_ONLY/CHECKSUM backup, and applies the bounded ReportCity correction, v2 publication, manifest replacement and canonical-city-v1 marker in one transaction. Fresh/current/legacy/extension paths converge on the same release. Unknown or mixed city states and unexpected report rows stop for instructor review; no automatic rebuild occurs. The general runtime/extension public-evidence DML prohibition remains in force. Administrative signature locking is not part of restricted runtime account readiness; the existing owner-executed manifest checks public evidence and readiness additionally requires v2 and the marker.

Required regression includes backup verification, interruption rollback, idempotency, altered report signatures/unknown row refusal, immutable content and workspace preservation, both full Case 004 versions and verifier roles, Case 001, and actual restricted-account access checks.


## Supported authoring reuse (WP-290)

The disposable case-008 fixture demonstrates independent SQL case/step identity through the same protected UI and existing crime-type, archive-inspection and report-isolation handlers. Current task collection metadata and evidence logging dispatch use the registered handler instead of checking CaseId. Canonical result/provenance, author bindings, prerequisites, expiry and revision checks are retained; verification remains Case 004-only. No fixture is shipped in production seed. Draft/retired content stays undiscoverable; released content stays immutable. The worked fields, limits, release process and legacy inventory are in CASE-RUNTIME-AUTHORING-GUIDE.md.

## Case 001 complete Tier 1 contract (WP-300)

Case 001 v3 follows six natural phases: prove Murder in CrimeType, find the report, follow the steward account, identify the named Les in PersonsOfInterest, retrieve his own InterviewLog statement, then verify the supported culprit. Basic separate SELECT/WHERE queries span four tables; no joins or aggregation are required. The briefing supplies only city/date and incident context. The student connects selective poisoning, separate preparation/service, and Les's private drink mix. Three people and three narrative records remain within Tier 1. Archive exploration is supported without artificial inspection milestones.

Fresh builds contain one Case 001 incident report and two linked accounts. Immutable historical definitions and saved work remain preserved, but v1/v2 attempts are incompatible with this changed evidence. Legacy installations retain their old evidence-review case; no automatic live story rewrite or destructive rebuild is authorized.

The new case-specific evidence version is case001-complete-v5. A static, non-spoiler manifest validates the new evidence/answer/marker; a separate private Case 001 procedure checks only its single culprit. The old Case 004 verifier and both roles remain unchanged. The learner never reads answer tables or advances from SQL text, guessed names or client flags. Independent audit and human acceptance are still required before closeout.
