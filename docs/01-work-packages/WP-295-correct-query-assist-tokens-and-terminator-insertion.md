# WP-295: Correct Query Lab hint tokens and terminator insertion

## Objective

Restore clickable proved-fact hint tokens and make all query-assistance insertion respect a trailing SQL statement terminator. Correct accepted WP-294 without changing case progression or database content.

## Scope

Corrective planning from human review on 2026-10-13. Original package: docs/01-work-packages/WP-294-shared-detective-layout-and-story-context.md, accepted main 165ff4fe55728a2de388a628733bb20af7c5e625. Findings: omission (hint conditions are plain text rather than insertable tokens); defect (builder appends WHERE after a semicolon, producing an invalid statement). Keep WP-293 launcher audit isolated. Implementation authorized by the human: Proceed with WP-295. The isolated branch codex/wp-295-query-assist was rebased onto accepted main 492f1cfc9a15310193ebf25ec92db23218f279a5 before implementation. Independent audit and acceptance remain pending.

## Impact Analysis

Required analysis: shared SQL editing across protected and legacy Query Lab. Graph available at accepted main; verified CurrentCaseTask -> ProtectedCasePresentation and legacy StudentWorkbenchView -> QueryRunner in source. Both editors contain local insertion functions; protected Case File facts append text directly. A shared pure insertion utility avoids divergent behavior. Graph baseline predates its own closeout commit but describes accepted WP-294 structure; WP-293 dirty launcher/graph files are excluded by a separate worktree.

### Regression Surface

Related tests:

- apps/web/src/components/student/CurrentCaseTask.test.tsx
- apps/web/src/components/QueryRunner.test.tsx
- apps/web/tests/browser/case-001-live-smoke.spec.ts
- apps/web/tests/browser/student-mode.spec.ts

Affected flow: starter -> caret selection -> WHERE token -> proved fact condition -> Run Query. Preserve custom drafts, selection replacement, keyboard/focus, quoted values, comments, result logging and legacy Case 004 behavior. No frontend proof authority.

Graph regeneration required after implementation; all four outputs are scoped. Planning alone does not regenerate.

## Files Allowed to Change

Allowed:

- docs/01-work-packages/WP-295-correct-query-assist-tokens-and-terminator-insertion.md
- apps/web/src/components/student/CurrentCaseTask.tsx
- apps/web/src/components/student/CurrentCaseTask.test.tsx
- apps/web/src/components/student/ProtectedCasePresentation.tsx
- apps/web/src/components/QueryRunner.tsx
- apps/web/src/components/QueryRunner.test.tsx
- apps/web/src/components/queryAssistInsertion.ts
- apps/web/src/components/queryAssistInsertion.test.ts
- apps/web/src/styles.css
- apps/web/tests/browser/case-001-live-smoke.spec.ts
- apps/web/tests/browser/student-mode.spec.ts
- .understand-anything/knowledge-graph.json
- .understand-anything/fingerprints.json
- .understand-anything/meta.json
- .understand-anything/intermediate/scan-result.json
- docs/00-ssot/END-OF-DAY-HANDOFF.md

Do Not Modify:

- apps/api/**
- database/**
- scripts/**
- apps/web/src/useCaseAttempt.ts
- apps/web/src/useStudentCaseState.ts
- apps/web/src/studentCase.ts
- apps/web/src/assets/**
- package.json
- apps/web/package.json
- package-lock.json

Handoff is closeout-only. Amend scope before touching any additional integration file.

## Constraints

No dependencies, live SQL mutation, case-specific hint values or automatic query execution. SQL Server accepts semicolons; correct insertion rather than corrupting valid SQL or stripping punctuation indiscriminately. Authored starters remain database-supplied, so no bootstrap/schema/seed change is required. Do not overwrite drafts when guidance advances.

## Required Behavior

1. Render proved facts in Hint as accessible, styled clickable tokens, using snapshot values only. Case File facts, hint tokens and SQL blocks use the same insertion behavior. Fresh attempts must not offer unproved tokens.
2. Insertion normally replaces the current selection or inserts at the retained editor caret. Return focus/caret to the editor; preserve the rest of the draft. No implicit WHERE invention or execution.
3. When an append-position caret is after a terminal semicolon, insert clauses before that terminator. Example: SELECT * FROM CrimeSceneReport; -> click WHERE -> SELECT * FROM CrimeSceneReport WHERE; -> click proved CrimeID condition -> SELECT * FROM CrimeSceneReport WHERE CrimeID = 1080;.
4. Distinguish a genuine terminal semicolon from punctuation in string literals, escaped quotes, bracket/double-quoted identifiers, line/block comments or earlier statements. Preserve those contents, trailing comments, whitespace and explicit selection edits. If interpretation is ambiguous, preserve text instead of destructive rewriting; document/test limits.
5. Use one small pure insertion utility for protected and legacy editors. Keep existing legacy query execution/progression paths unchanged.
6. Preserve the established visual identity, keyboard focus and responsive layout. Hint tokens do not replace Samuel's database-authored guidance.

Simplicity check: one insertion function with an actual shared purpose; no SQL generator, new parser dependency, case-specific React branches or extra persistent panels.

## Acceptance Criteria

- [ ] Hint facts are clickable and show backend-observed values.
- [ ] Starter + WHERE + fact-token produces one valid query with a trailing terminator.
- [ ] Text/identifier/comment semicolons, selections, trailing whitespace/comments and keyboard focus are preserved.
- [ ] Custom drafts are retained and no token executes a query.
- [ ] Protected Case 001 and legacy Case 004 builder regression passes.
- [ ] Database, bootstrap, API and proof boundaries are unchanged.

## Code Prompt

Implement the authorized correction. Add the smallest shared insertion helper and connect hint/Case File/block actions to the editor's retained selection. Preserve database starter text and optional terminators. Test lexical edge cases and a real browser build-and-execute flow; do not accept, commit or push.

Verification commands:

- npm run test --workspace web
- npm run build --workspace web
- node ../../node_modules/@playwright/test/cli.js test case-001-live-smoke.spec.ts student-mode.spec.ts --workers=1 (configured local runtime)
- scripts/refresh-understand-graph.ps1
- scripts/check-understand-refresh-readiness.ps1
- scripts/check-work-package-closeout.ps1 WP-295
- git diff --check

## Audit Prompt

Verify token clickability, genuine proved-value source, caret/selection preservation, terminator-safe insertion and lexical negative cases. Verify no automatic execution or lost custom text and unchanged Case 001 proof/Case 004 legacy behavior. Fail on naive semicolon removal, hardcoded observed IDs, mixed WP-293 changes or altered database authority. Leave final acceptance to the human.

## Code Results

Implemented on codex/wp-295-query-assist in C:/Users/cburk/.codex/worktrees/wp295-query-assist/SequelCityWeb, based on accepted main 492f1cfc9a15310193ebf25ec92db23218f279a5. Uncommitted; audit and human acceptance pending.

Added a shared pure insertQueryAssist function, used by protected editor controls and the legacy QueryRunner. Hint facts are styled clickable buttons reading snapshot labels/values; Hint and Case File buttons call the same editor insertion handle. Token actions preserve retained selection and return focus/caret without execution. Starters remain database-authored and unchanged.

A lightweight lexical scan recognizes one genuine terminal semicolon outside quoted/escaped strings, bracket/double-quoted identifiers and nested/line comments. Append-position assistance inserts before that terminator, preserving trailing comments/whitespace. Explicit selections are respected. Unterminated lexical constructs or multiple statements do not trigger relocation; their text is preserved. This is an editing helper, not a SQL validator/parser or safety boundary; existing backend validation remains authoritative.

### Validation

- Full web suite 22 files/265 tests PASS; final focused insertion/editor suites 66 PASS after the raw-spacing edge-case refinement. Production build PASS. Browser checks exercise starter -> WHERE -> clicked proved CrimeID -> valid terminated query -> actual SQL execution with multiple report rows and no premature proof. Legacy Case 004 builder also verifies WHERE insertion before the terminator. Combined browser suite: 15 PASS, one existing intentional legacy skip. Actual builder-produced terminated SQL executes successfully, returns 183 report rows and keeps the report step unproved. Desktop/mobile/keyboard and legacy Case 004 checks pass. Screenshot inspected; ignored review URL: http://127.0.0.1:5173/test-results/wp295-hint-token-query.png.

No API, database/seed/bootstrap, dependencies, controller/state authority or case progression source changes. Node dependency junctions reuse the existing installation in this isolated worktree and are ignored. Development web at http://127.0.0.1:5173 serves this candidate; backend remains the existing bounded runtime. Screenshot test-results/wp295-hint-token-query.png is ignored review evidence. Handoff remains closeout-only. Graph refresh PASS: 708 files, 1,172 nodes, 464 edges. Readiness READY, git diff --check PASS, closeout preflight ReadyForAudit with no findings.
## Audit Results

I have launched the web test suite and will wait for it to complete.
I am waiting for the web test suite to complete.
I have launched the Playwright browser tests and will wait for them to finish.
I am waiting for the browser tests to finish.
I am waiting for the browser tests to finish.
I am waiting for the live smoke browser tests to finish.
I am waiting for the remaining browser tests to complete.
I am waiting for the remaining student-mode tests to finish.
I am waiting for the test execution to complete.
I am waiting for task-84 to finish.
I am waiting for the browser tests to finish.
I am waiting for task-84 to complete.
I am waiting for the browser tests to finish.
I am waiting for the graph refresh script to finish.
### Independent Audit Report: WP-295 Correct Query Lab Hint Tokens and Terminator Insertion

**Work Package**: [WP-295-correct-query-assist-tokens-and-terminator-insertion.md](docs/01-work-packages/WP-295-correct-query-assist-tokens-and-terminator-insertion.md)  
**Branch**: `codex/wp-295-query-assist`  
**Verdict**: **PASS**  
**Acceptance Status**: **Pending Human Acceptance** *(Audit recorded; final acceptance left to the human)*

---

### Key Findings & Verification

1. **Token Clickability & Shared Insertion**:
   - In [`CurrentCaseTask.tsx`](apps/web/src/components/student/CurrentCaseTask.tsx#L92-L96), both Hint proved facts (`task.hint` with `s.facts`) and Case File facts render as styled, accessible clickable buttons (`<button type="button" className="query-builder-block">` and `<button className="evidence-snapshot-detail-button">`).
   - Token and SQL block actions route through a shared handle ([`QueryAssistHandle`](apps/web/src/components/student/ProtectedCasePresentation.tsx#L154)) to the pure utility [`insertQueryAssist`](apps/web/src/components/queryAssistInsertion.ts#L38-L46).
   - In the legacy [`QueryRunner`](apps/web/src/components/QueryRunner.tsx#L270-L277), SQL building blocks and Case File assist requests use the exact same shared [`insertQueryAssist`](apps/web/src/components/queryAssistInsertion.ts#L38-L46) function.

2. **Genuine Proved-Value Source (No Hardcoded IDs)**:
   - Hint conditions and Case File facts source their keys and values dynamically from `snapshot.facts` via `factCondition(fact)`.
   - Numeric values format without quotes (`CrimeID = 1080`), while string values are escaped and single-quoted (`ReportCity = 'Sequel City'`).
   - Fresh attempts render zero hint tokens (`s.facts.length === 0`).
   - No observed IDs (e.g. `1080`, `10975`, `67318`) are hardcoded into components. Existing tests in [`CurrentCaseTask.test.tsx`](apps/web/src/components/student/CurrentCaseTask.test.tsx#L112-L115) confirm dynamic evidence binding (e.g., `CrimeID = 9876`).

3. **Caret & Selection Preservation**:
   - Explicit editor selections (`start !== end`) are replaced in place without relocation.
   - Carets positioned inside the statement before `;` insert at the exact caret position.
   - Append-position carets at or after the terminal semicolon relocate insertion to immediately before the semicolon.
   - Editor focus and caret position are restored via `requestAnimationFrame` with `setSelectionRange(inserted.caret, inserted.caret)` in both protected and legacy query editors.

4. **Terminator Safety & Zero Naive Semicolon Removal**:
   - Genuine terminal semicolons are recognized by [`terminalSemicolon`](apps/web/src/components/queryAssistInsertion.ts#L4-L36).
   - Append-position clauses insert before the terminal semicolon without deleting, stripping, or re-adding punctuation. Trailing whitespace, comments (`-- ...`, `/* ... */`), and newlines are preserved.
   - Spacing is clean: `SELECT * FROM CrimeSceneReport;` + `WHERE` produces `SELECT * FROM CrimeSceneReport WHERE;`, and adding `CrimeID = 1080` produces `SELECT * FROM CrimeSceneReport WHERE CrimeID = 1080;`.
   - Zero instances of naive semicolon removal (`replace(/;/, "")` or `.slice(0, -1)`) exist in the codebase.

5. **Lexical Negative Cases**:
   - Semicolons inside string literals (`'a;b''c'`), bracket identifiers (`[a]];b]`), double-quoted identifiers (`"a;""b"`), line comments (`-- a; comment`), and nested block comments (`/* outer; /* inner; */ text */`) are parsed and ignored.
   - Unterminated literals, unclosed block comments, multiple statements (`SELECT 1; SELECT 2;`), and statements with trailing unparsed text return `null`, which bypasses relocation and preserves user text without corruption.

6. **No Automatic Execution & Custom Draft Retention**:
   - Clicking hint tokens, Case File facts, or SQL building blocks only mutates draft SQL (`onChange` / `setSql`); no query submission (`handleSubmit` / `c.run`) occurs.
   - Custom drafts in `w.draftSql` are preserved and not overwritten when guidance updates or hint tokens are clicked.

7. **Case 001 Proof & Case 004 Legacy Progression**:
   - Live smoke suite verified: starter -> WHERE -> clicked proved hint token -> `SELECT * FROM CrimeSceneReport WHERE CrimeID = 1080;` -> executed on real backend -> 183 rows returned, step remains unproved (until specific clocktower report row is logged), draft retention verified.
   - Case 004 legacy adapter successfully completes real query verification and suspect accusation.

8. **Scope Isolation & Unchanged Authority**:
   - Zero WP-293 changes or files are modified or mixed into this worktree.
   - `apps/api/**`, `database/**`, and `scripts/**` remain untouched. Database authority, safety checks, and proof evaluation remain solely with the backend.

---

### Verification Matrix

| Verification Step | Result | Details |
|---|---|---|
| `npm run test --workspace web` | **PASS** | 22 test files, 265 passed |
| `npm run build --workspace web` | **PASS** | TypeScript and Vite client build clean |
| Playwright live browser suite (`case-001-live-smoke.spec.ts`, `student-mode.spec.ts`) | **PASS** | 15 passed, 1 intentional legacy skip (56.8s) |
| `scripts/refresh-understand-graph.ps1` | **PASS** | 708 files, 1,172 nodes, 464 edges |
| `scripts/check-understand-refresh-readiness.ps1` | **READY** | Dry run succeeded, no stale artifacts |
| `scripts/check-work-package-closeout.ps1 WP-295` | **ReadyForAcceptance** | `StatusState: AuditedNeedsFinalDecision`, 0 findings |
| `git diff --check` | **PASS** | Zero whitespace or conflict markers |

---

*Final acceptance is left to the human reviewer.*

## Final Decision

Accepted by the human on 2026-10-13 following independent audit PASS. Authorized closeout, commit and push. Accepted scope includes clickable proved-fact tokens and shared terminator-safe insertion; follow-up must consolidate the student Query Lab into one database-populated surface.
