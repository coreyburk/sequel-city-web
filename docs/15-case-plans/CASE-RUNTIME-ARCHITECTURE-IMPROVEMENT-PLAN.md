# Case Runtime Architecture Improvement Plan

Status: Architecture direction reviewed by the user; implementation authorized on 2026-10-08. WP-286 implements contracts, pending independent audit and human acceptance before runtime packages.
Planning date: 2026-10-08. Source baseline: aea394a.
Owner record: WP-285. This proposal does not replace accepted SSOT until the architecture decision package is independently reviewed and accepted.

## 1. Outcome and design principles

Every playable case uses one Query Lab page. A case author supplies versioned case/step records rather than duplicating React components or editing case-specific instructional branches. The backend selects the eligible task from verified attempt state and returns one coherent presentation. Starting fresh creates a new attempt; resuming opens an existing attempt and clearly shows saved progress.

Separate these concerns:
- Content: what a case asks the student to do and what Samuel says.
- Progression: which tasks the student has proved and which task is eligible now.
- Presentation: how the current task is displayed and edited.

SQL Server is the runtime repository for content and attempts. Version-controlled creation/seed scripts remain the reproducible authoring source. Deterministic validator implementations remain backend code. No runtime AI, arbitrary rules interpreter, plugin framework, new frontend library, or cloud account system is introduced.

## 2. Verified current state and architectural gap

| Concern | Current implementation | Gap |
|---|---|---|
| Public evidence | SQL Server CrimeType, CrimeSceneReport, InterviewLog, and related evidence tables | Preserve these relationships and data during the transition |
| Authored steps/starter SQL | apps/web/src/studentCase.ts and studentCase001.ts | Case content is compiled into the frontend |
| Guidance/substep selection | useStudentCaseState.ts and StudentWorkbenchView.tsx | Content selection and presentation are intertwined; multiple panels can repeat or contradict directions |
| Case shell | App.tsx composes StudentMentorHeader and StudentWorkbenchView for both playable cases | Shared composition exists, but no single case-neutral current-task contract |
| Case 001 validation | Backend result-pattern evaluators return match metadata; the frontend orders/presents progress | No durable backend attempt progression; metadata currently reports evaluated-no-progression |
| Case 004 progression | Existing deterministic frontend step/evidence logic plus backend/database suspect verification | Port existing gates to the backend without changing their teaching semantics |
| Saved workspace | Browser localStorage, case-specific query references and notes | Progress, saved SQL, and content version are not owned through one attempt API |
| Case API | caseRoutes.ts currently exposes suspect verification | No case-content/current-task/attempt API |
| Restricted data | studentRestrictedTables.ts excludes answer keys and Solution; schemaService filters restricted tables | New application tables need database permissions and query/schema restrictions before release |
| Learner identity | No account/authentication system | Attempts require a defined local ownership mechanism |

Some architecture SSOT prose describes older runtime limitations. Treat current source/tests as implementation evidence and reconcile these inconsistencies in the decision package; do not interpret stale prose as proof that features do not exist.

## 3. Shared Query Lab surface

Use the same component structure for Cases 001, 004, and future released cases:
1. Task header: step title/status and one warm, actionable direction from Samuel.
2. Optional hint: one collapsed, keyboard-accessible disclosure; additional hint levels may be introduced only when authored and required.
3. Evidence tools: schema, proved facts, and query tokens. Keep schema names distinct from observed identifier values.
4. SQL editor: learner-owned draft and an explicit Use starter action; the offered starter is separate data.
5. Results and feedback: actual query rows, validation feedback, SQL errors, and evidence logging.

The whole-case briefing remains a separate screen and uses the case objective, not the current step instruction. Evidence Board displays the attempt's evidence/workspace. Neither screen recreates a competing Query Lab direction.

Success/error feedback is event feedback, not a second persistent next-step panel. A retained earlier query must be labeled as the student's draft; do not imply it is the current recommended starter.

A generic current-task response contains case/version, attempt ID/revision/status, current step key/title, Samuel direction, optional hint, optional starter, observed fact/token references, and progress summary. It contains no future-step guidance, validator parameters, answer keys, expected result rows, or hidden identifiers. Loading/empty/error states are explicit; never fall back to another case's content.

## 4. Content and authoring model

Use an application-owned SQL schema (proposed name app) in SequelCityCrimesDB, distinct from learner evidence tables. Exact DDL is owned by a later schema package.

| Proposed record | Responsibilities and key fields |
|---|---|
| app.CaseDefinition | CaseId + ContentVersion, case number/title, public dossier, whole-case objective, tier, release status, entry step, released completion scope, evidence compatibility version |
| app.CaseStep | CaseId + ContentVersion + StepKey, display order, task title, learner objective, Samuel direction, optional hint, optional starter SQL, completion mode, validator key, evidence requirements, constrained guidance variant key if necessary |
| app.CaseStepPrerequisite | Same-version predecessor/required-step keys, enabling linear paths and explicit branches without an arbitrary expression language |

Prefer a direction and one hint on the step row initially; do not add translation/CMS/hint hierarchies before there is a requirement. Substeps can be independently keyed steps if they require different evidence or instruction. Introduce explicit prerequisite group semantics only if a verified Case 004 branch requires AND/OR behavior; document that behavior before DDL rather than guessing.

Starter SQL is an offered learning scaffold, not a solution query. Use broad, safe starters and typed placeholders for observed values. Only server-produced, attempt-scoped facts can fill placeholders. Missing facts leave placeholders unfilled; do not substitute hidden answers.

ValidatorKey refers to an allowlisted backend handler. Case records cannot contain executable JavaScript, arbitrary evaluation SQL, or free-form rules. New cases using existing validator types require authored data and tests; genuinely new evidence logic may require a new backend validator. Do not promise no-code authoring for all future cases.

Authoring lane:
1. Author/vet the full clue path and completion boundary using existing case templates.
2. Add versioned content and evidence rows to authoritative base creation/seed scripts.
3. Validate keys, prerequisites, reachability, no cycles, supported validators, evidence tables, starter SELECT safety, release completeness, and spoiler exclusions.
4. Run fixture-backed playthroughs before marking a version released.
5. Later, add an admin authoring UI only through a separate package; SQL records plus validation are the initial input workflow.

Source-of-truth rule: seed scripts define shipped authored content; the installed database is the runtime read repository. Do not also maintain competing frontend prose or allow invisible manual database edits to become released content.

## 5. Local learner ownership and attempts

Proposed initial identity: a browser-local opaque owner capability minted by the backend and delivered in an HttpOnly same-site cookie. Store a one-way hash/identifier server-side. This is continuity for a local installation, not an authenticated human identity, classroom account, or cross-device login. Loopback local hosting is retained. Specify the exact development-origin cookie/CORS configuration and CSRF defenses in the contract package; no wildcard credentialed origins.

| Proposed record | Purpose |
|---|---|
| app.LocalLearner | Owner identifier/capability hash and timestamps; no personal information required |
| app.LearnerAttempt | AttemptId, owner ID, CaseId/ContentVersion/evidence version, active/completed/archived/incompatible status, timestamps, concurrency revision |
| app.AttemptStepEvidence | Backend-issued completion evidence references by AttemptId and StepKey, validator version, qualifying execution/action ID, and evaluation time; unique completion identity for idempotency |
| app.AttemptWorkspace | Bounded learner draft, selected view, notebook/pinned evidence references, and revision; one document/row per attempt avoids unnecessary note-table complexity |

Keep query execution audit/evidence references durably sufficient to explain why a step passed. The schema package must decide the bounded evidence payload (query plus referenced evidence identifiers/validation summary), retention, and redaction; do not store an unbounded copy of every query result. A raw client-provided completion flag, hash, or SQL string is never proof.

Fresh/resume behavior:
- The case entry screen lists or summarizes owned attempts with saved time and progress, clearly distinguishing completed/released-review/in-progress states.
- Start fresh creates a new attempt from the entry step. Preserve the previous attempt as archived/resumable; do not silently overwrite it.
- Resume verifies owner, case/content/evidence versions, and current backend progression before returning the workspace and task.
- Delete/reset is a separate explicitly confirmed operation limited to the selected attempt. Browser/session clearing does not delete SQL evidence or another attempt.
- Clearing the ownership cookie removes browser access to those attempts unless a later explicit recovery mechanism exists. Do not claim automatic cross-browser recovery.

Content versions are immutable once released. Pin attempts to a compatible version. Initial rebuild/version mismatch behavior is to mark old attempts incompatible and offer fresh start, not pretend their completion still applies. Existing base-script drop/rebuild policy requires explicit human confirmation and can erase attempts stored in the same database; provide export/backup guidance before rebuild, without introducing a new database service. Future infrastructure migration policy requires a separate accepted decision; this plan does not authorize destructive execution.

## 6. Backend progression and API contract

The backend owns attempt transitions. Preserve existing result-pattern logic but move ordered gates and applicable Case 004 substep decisions behind the attempt service. Load the case definition by pinned version, resolve prerequisites against validated attempt evidence, and select the current task deterministically.

Proposed API operations (paths finalized in contract package):
- List released case dossiers and owned attempt summaries.
- Start a new attempt or resume an owned attempt.
- Get current task and workspace for an attempt.
- Execute learner SQL through the existing safe execution service with owned attempt context.
- Log a row/evidence reference from a backend-issued result/action; preserve cases that require explicit learner logging before advancement.
- Save bounded workspace edits with revision checks; no completion/progress fields accepted.
- Verify a suspect through the existing controlled database-verification path with attempt/case context.
- Archive/delete a selected attempt through explicit, owner-checked actions.

Client step IDs are advisory at most: the backend resolves the eligible step and validator from its attempt state. Validate actual returned rows, prerequisite completion, and required logging/verification before committing a transition. Content selection happens after transition resolution and returns an updated revision with the relevant result response or subsequent task fetch.

Atomic/idempotent changes: commit evidence completion and revision changes in a transaction; serialize conflicting progress updates or reject stale revisions. Duplicate requests cannot double-advance. Responses carry attempt/version/revision so the UI ignores stale/out-of-order results and late replies after switching cases/resetting. Do not keep separate frontend authoritative milestone flags.

Preserve the distinction between successful SQL execution and persisted progression: if execution succeeds but attempt persistence fails, return rows plus an explicit unsaved-progress error and safe retry path; do not claim completion. No broad transcript query, zero-row result, or starter application can itself advance a step.

## 7. Database permissions and spoiler protection

Before serving new tables, create two explicitly bounded backend database access paths:
- Learner execution: SELECT on allowlisted public evidence tables only; no app schema, Solution, CaseAnswerKey, system metadata extraction, writes, or internal views/synonyms/functions that expose them.
- Application repository: narrowly parameterized content/attempt reads/writes and controlled verification access; never executes arbitrary learner SQL through this connection.

Application-level SQL checks and schema filtering remain defense in depth. Database authorization is the final boundary: protect joins, subqueries, CTEs, schema qualification, views/synonyms, and alias tricks. Do not rely solely on the current table-name denylist or hide tables only in the UI. Cover metadata leakage as well as direct rows.

Only current eligible task content is exposed. Public dossier endpoint returns no step repository. Never ship full future guidance or validator parameters to the browser and hide them with CSS. Wrong-owner/wrong-case attempts, arbitrary step selection, unreleased case IDs, and expired/version-incompatible attempts fail closed. Network/API unavailability produces a retryable explicit state, not fallback completion or leaked static future content.

## 8. Implementation packages and dependencies

These are dependency-ordered bundles, not reserved WP numbers. Create numbered implementation WPs only after architecture review so scopes follow verified interfaces.

| Bundle | Concrete result | Gate before next bundle |
|---|---|---|
| A: Architecture decisions and contracts | Reconcile relevant architecture/schema/progression/state/authoring/UI/safety SSOT; pin identity, fresh/resume/reset semantics, content versioning, proposed DDL constraints, response shapes, and Case 004 step matrix | Independent design audit and human acceptance; no runtime/db writes |
| B: Protected repository foundation | Base-script app schema/content records and fixture seed lane; separate DB access roles/pools, query/schema protection, content validator, parameterized repository, setup/version handling; internal/contract tests, no new public learning release | Clean-build and access-boundary tests prove app data unreachable from learner SQL |
| C: Case 001 vertical slice | Backend-owned attempts/evidence/progression, protected current-task API, workspace preservation/import, and shared Query Lab consuming the response through CrimeType/report/interview/released-review completion | Live fresh/resume/multi-row/draft/reset/duplicate-request/version/owner browser and API tests pass |
| D: Case 004 migration | Port the full existing witness/gym/suspect/mastermind path and verification/logging semantics into authored records and backend handlers; consume same Query Lab contract; remove obsolete case-specific instructional branches | Full reference playthrough and substep parity matrix, Case 001 regression, and cross-case isolation pass |
| E: Authoring acceptance and removal of transition scaffolding | Prove a synthetic non-spoiler fixture case can be supplied through content records and existing validators without editing Query Lab components; retire legacy content/progress routes once both released cases use repository paths | Rebuild and full regression; no competing frontend content or legacy proof flags remain |

WP-284 is the shared Query Lab implementation scope to be rewritten around C/D, not executed under its current frontend-only allowed list. Bundle C delivers the case-neutral component once; D supplies another case through the same contract rather than introducing a second page. Bundle B/C ordering must keep SQL evidence protection complete before an application writer connection exists.

During migration, switch an entire case adapter atomically, not half its panels. Legacy cases may remain functional temporarily, but a migrated case cannot mix old frontend guidance with repository content. Keep per-case release routing explicit; no long-lived duplicate content repository. Do not release partially authored Case 004 steps or claim Case 001's evidence review solves the full crime.

## 9. Legacy saved data transition

Preserve existing browser saves before any change. Import learner draft/notes as untrusted workspace data. Case 001 query references can be re-executed in order and accepted only after fresh backend validation. For Case 004, map only available verifiable evidence; do not import local completion flags as proof. Show imported notes separately from proved facts until checked. No arbitrary SQL auto-replay without normal SELECT safety checks and bounded replay policy. If compatible proof cannot be reconstructed, offer a fresh attempt while retaining the saved notes/export.

Preserve draft text even before the first milestone. Keep app-offered starter provenance separate from custom draft; applying a starter is explicit. Content fetches, step changes, query execution, reload, and evidence logging must not silently replace custom SQL.

## Rollback and rollout gates

Keep each migrated case behind an explicit release-routing decision until its parity playthrough passes. Before importing a legacy save, retain an export/recovery copy and record import provenance; never delete browser saves merely because an attempt was created. Within a pinned compatible content version, rollback can restore the last accepted application release/adapter without mutating evidence or marking unverified imported flags complete. Do not roll a live case back to a frontend-only progression adapter if it would invalidate backend-owned attempt semantics; leave that case unavailable with a clear resume message until repaired.

Repository/schema changes must have a tested clean-build and backup/restore procedure approved before a destructive rebuild. A failed content import leaves the installed accepted content version active and reports a setup error. No partially seeded or unreleased version may be selected for play. Case-level switching is temporary migration scaffolding, removed only after both released cases pass the new contract. No rollback operation is executed by this planning document.
## 10. Validation and measurable acceptance

- One shared Query Lab component contract for both released cases, with no case-specific display branches or duplicate next-step panels.
- All current Case 001 steps and Case 004 substeps/branches represented in a reviewed parity matrix before migration; no invented clue-path shortcuts.
- Authors can edit versioned step content and starters through the seed lane without modifying React rendering code; unsupported validator keys fail pre-release validation.
- API/schema/learner SQL cannot read app content, future steps, other attempts, hidden solution data, or internal execution proofs, including adversarial query shapes.
- Fresh attempt begins at the actual entry step; resume shows correct persisted progress; two attempts of the same case do not overwrite each other.
- SQL result validation, explicit evidence logging, and suspect verification retain their distinct semantics; replay/double requests, stale requests, and concurrency are covered.
- Custom draft and notes survive reload/restart and remain isolated by owner/attempt/case/version. Starter matches current task and requires deliberate application.
- Rebuild/version mismatch is explicit; browser-only legacy flags never establish progress.
- Reference playthroughs validate fresh, intermediate, resumed, and complete states for both cases against the live local stack; keyboard hint and error recovery checks included.
- All affected API/web regression suites pass. Database fresh-build/version/access tests pass. Each structural implementation bundle owns its four tracked graph refresh artifacts and readiness check.

## 11. Decisions and scope discipline

Recommended architecture is database-backed content and attempts with backend-selected current-task presentation. This plan proposes acceptance of that direction; it does not claim implementation authorization or final human acceptance.

Before Bundle A closes, resolve exact learner-cookie/CORS/CSRF behavior, completion/logging trigger matrix for every Case 004 substep, evidence-proof payload retention, database privileges under local setup, and rebuild/export behavior. These are contract decisions, not reasons to add accounts, a workflow engine, or a CMS.

No implementation, database mutation/rebuild, acceptance, commit, push, or independent external audit is authorized by creating this plan. Implementation packages must include exact allowed files and validators verified against current source, explicit audit scope, and human final decisions.

## Implementation authorization and numbered packages

The user reviewed the direction, required bootstrap coverage, and authorized methodical implementation. Bundles A-E are now WP-286, WP-287, WP-288, WP-289 and WP-290 respectively. Detailed contracts and Case 004 parity are recorded beside this plan. The earlier proposal-only statements describe creation of WP-285, not a restriction on the subsequent user authorization. Independent audits and human acceptance gates remain in force. No live destructive rebuild, automatic acceptance, commit or push is authorized by this implementation request.
