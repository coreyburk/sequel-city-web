# Case Runtime Implementation Contracts

Status: WP-286 contract independently audited and accepted. WP-287 implements the protected foundation; WP-288 implements Case 001 and the shared page. Case 004 migration remains WP-289 scope.
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
| LocalLearner | PK OwnerId; unique BINARY(32) capability hash; CreatedAtUtc, LastSeenAtUtc. No student PII. |
| LearnerRequest | PK (OwnerId, RequestId), checked FK to LocalLearner; BINARY(32) digest, bounded JSON outcome, UTC creation. Separate from attempt deletion so lifecycle/workspace retries remain idempotent. |
| LearnerAttempt | PK AttemptId; FK OwnerId and content version; unique (AttemptId, CaseId, ContentVersion); EvidenceVersion; Status (active/completed/archived/incompatible); ArchivedFromStatus nullable active/completed; Revision; Created/Updated UTC. |
| AttemptWorkspace | PK/FK AttemptId; bounded WorkspaceJson (ISJSON); revision uses owning attempt. Separate offered starter from learner draft. |
| AttemptAction | PK ActionId; FK AttemptId; unique (AttemptId, RequestId); action kind/query/log/verify; request digest, prerequisite revision, SQL or submission reference, validator result, bounded proof JSON, creation/expiry UTC; unique (AttemptId, ActionId). |
| AttemptStepEvidence | PK (AttemptId, StepKey); CaseId, ContentVersion and composite FK to attempt; same-version FK to step; qualifying ActionId with composite FK (AttemptId, ActionId); ValidatorVersion, observed facts/proof summary, UTC. |

Foreign keys use WITH CHECK and NO ACTION; deletion is explicit transaction in child-first order. Insert definitions and steps before entry-step FK is added in the foreign-key script; that FK is same-version and checked after seed. Prerequisite graph must be acyclic, reachable from entry and have unambiguous eligible DisplayOrder. Validate JSON parameters against the chosen handler schema, public evidence names, safe SELECT starters, required messages, completion scope and no hidden identifier interpolation. Unsupported validators, cycles, missing prerequisites or incomplete released paths prevent release/readiness. Content is not executable SQL/JavaScript. No future step prose/validator parameters is returned to students.

Use schema key case-runtime-v1 and explicit released-content/evidence manifests; readiness checks objects, columns, checked FKs, content validation, roles and permissions, not only the latest legacy migration name. Attempts pin immutable content and evidence versions. Changed released content receives a new version. Never silently remap old attempts.

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