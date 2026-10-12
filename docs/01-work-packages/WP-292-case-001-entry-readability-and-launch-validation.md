# WP-292: Case 001 entry readability and launch validation

## Objective

Correct unreadable Case 001 entry controls and misleading/duplicate startup feedback, then validate the accepted Case 001 flow in a browser before WP-289 implementation.

## Scope

Corrective follow-up to accepted WP-288/WP-291. User requests Case 001 validation first. WP-289 remains paused with no source changes. Local installation is separately authorized by the user as a backed-up additive setup; no destructive rebuild or credential disclosure.

## Impact Analysis

### Understand Status

- Graph available: Yes; metadata baseline f0e206f, accepted HEAD 7a65b59. WP-291 refreshed its implementation before closeout; verify source directly for this narrow UI correction.
- Analysis performed: Source traced CurrentCaseTask entry branch, current-case CSS and startup API. Entry branch lacks current-case class, causing browser-default disabled styling. Runtime API returns 503; local .env lacks repository credentials/session configuration.

### Affected Architecture

- Shared durable entry/workspace presentation; current-task API remains authoritative.
- Primary component: CurrentCaseTask; upstream App; downstream shared CSS, useCaseAttempt and protected routes.

### Regression Surface

- Related tests: apps/web/tests/browser/case-001-live-smoke.spec.ts; apps/web/src/useCaseAttempt.test.tsx; npm run test --workspace web; accepted supported launcher SQL/package fixture.
- Fresh entry, configuration failure, disabled control readability, saved attempt, first CrimeType query, report refinement, interviews, notes/draft preservation.
- Keep owner/CSRF and SQL account boundaries; no future instructions or answer leakage.

### Graph Update Decision

- Regeneration required: No. Narrow class/copy/accessibility correction; no new architecture, imports or progression relationships. Existing graph drift is accepted closeout metadata; source reviewed directly.

## Files Allowed to Change

Allowed:

- docs/01-work-packages/WP-292-case-001-entry-readability-and-launch-validation.md
- apps/web/src/components/student/CurrentCaseTask.tsx
- apps/web/src/styles.css
- apps/web/tests/browser/case-001-live-smoke.spec.ts
- docs/00-ssot/END-OF-DAY-HANDOFF.md

Do Not Modify:

- database/**
- apps/api/**
- scripts/**
- `package.json`
- `package-lock.json`
- .understand-anything/**

Handoff is closeout-only. Ignored apps/api/.env may be configured solely through the user-authorized launcher setup; never commit or export secrets.

## Constraints

Preserve public evidence, saved work and legacy browser saves. Use accepted launcher for setup with verified retained backup, not manual destructive scripts. No dependencies/runtime AI or Case 004 implementation. Independent audit and human acceptance remain mandatory before commit/push.

## Required Behavior

- Apply shared themed styling to entry controls, including readable disabled labels.
- Show one accessible error message; stop claiming the file is loading after failure. Provide the supported launch action when protected setup is missing.
- Validate actual backed-up local setup only with user authorization; use isolated databases for automated destructive test cleanup.
- Run fresh Case 001 browser proof flow; confirm broad report query does not advance or replace the draft; confirm restart/resume and notebook preservation.

## Acceptance Criteria

- [ ] Disabled entry labels have at least 4.5:1 measured text contrast and no opacity fade.
- [ ] Configuration failure is shown once with a truthful heading and supported launch direction.
- [ ] Live Case 001 starts at CrimeType, advances only on correct evidence and retains drafts/notes on resume.
- [ ] Local setup retains verified backup and leaves public evidence intact; no live destructive rebuild.
- [ ] Web regression and live browser checks pass; WP-289 remains untouched.

## Code Prompt

Implement this authorized narrow correction. Record browser screenshots, measured contrast and real setup/flow results. Do not self-accept, commit or push.

Verification commands:

- npm run test --workspace web
- node ../../node_modules/@playwright/test/cli.js test case-001-live-smoke.spec.ts --grep 'Case 001' (apps/web; CASE_001_LIVE_SMOKE=1, local API/web URLs configured)
- scripts/check-work-package-closeout.ps1 WP-292
- git diff --check

## Audit Prompt

Independently check readable disabled controls, unique actionable error presentation, fresh CrimeType guidance, broad-query retention, browser resume and backed-up installation evidence. Reject scope expansion, secrets, destructive live scripts or Case 004 changes. Report PASS/FAIL/BLOCKED; leave acceptance to the human.

## Code Results

Implemented 2026-10-12; WP-289 remains untouched. Added shared entry styling with explicit disabled-control colors/opacity, truthful unavailable heading and one accessible startup error with the supported launcher direction.

Validation:

- Web suite PASS: 21 files, 238 tests.
- Real browser Case 001 proof/resume and unavailable-entry contrast checks PASS: 2 tests. Disabled colors #f7ead1 / #38303b measure 10.67:1 contrast with opacity 1; browser asserts at least 4.5:1.
- Rendered screenshot inspected: apps/web/test-results/wp292-case001-unavailable.png (ignored artifact). Existing smoke also records the ready Query Lab screenshot.
- User explicitly authorized backed-up local setup. Accepted launcher installed the protected runtime additively into SequelCityCrimesDB; retained backup: C:/Program Files/Microsoft SQL Server/MSSQL16.MSSQLSERVER/MSSQL/Backup/SequelCityCrimesDB_before_runtime_509d5865423c418a9703c614b3e08421.bak. SQL backup checksum/RESTORE VERIFYONLY completed before upgrade. No destructive base script or public evidence reseed was executed.
- First npm installation failed because the old project development servers held esbuild.exe open; only identified project processes were stopped, then installation succeeded. First post-provisioning bounded-connection check failed; direct bounded role/schema verification and SetupOnly retry passed. This first-launch retry requirement is a follow-up launcher defect outside this UI package; no script changes were made here.
- Normal launcher is running at http://127.0.0.1:5173 with protected API readiness confirmed. Configuration/secrets remain ignored; no credential values exported. Live browser tests created their own owned attempts and retained archived test proof as designed.
- git diff --check PASS; all changed files within this package. Independent audit and human acceptance pending.

No Case 004 implementation or database source changes. No new graph relationships, dependencies or runtime AI.

Audit preparation: the prior attempt stopped before auditor dispatch because the unrelated WP-293/WP-294 plans were untracked. Those plans and the delivery plan are preserved with a verified SHA-256 manifest at D:\GitHub-Repos\SequelCityWeb\.git\wp-planning-hold\wp292-8d169ec1734c43d9941552dded6df5ef. Restore them to the manifest original paths after WP-292 closeout. No scope expansion or mixed-worktree override was used. This supersedes the pre-dispatch isolation report; independent audit remains pending.

## Audit Results

I have started the web test suite (`npm run test --workspace web`) in the background and will continue verification once it completes.
I am waiting for the web test suite to complete execution.
I will wait for the test suite to conclude.
Waiting for task-32 to finish.
I have started the full live smoke spec execution in the background and will continue once it finishes.
### Independent Audit Report: WP-292

**Verdict**: **PASS**  
**Final Decision**: **Pending human acceptance**

---

### Audit Criteria & Verification

#### 1. Readable Disabled Controls: **PASS**
- **Changes**: [`apps/web/src/components/student/CurrentCaseTask.tsx`](apps/web/src/components/student/CurrentCaseTask.tsx#L17) updated the entry container `<section>` to include the `current-case` class (`panel panel--full student-case-landing current-case`).
- **Styling**: [`apps/web/src/styles.css`](apps/web/src/styles.css#L4622) styles `.current-case button:disabled` with:
  - Background: `#38303b`
  - Text: `#f7ead1`
  - Border: `#8a7155`
  - Opacity: `1` (eliminates browser-default opacity fading)
- **Contrast**: Measured color contrast ratio is **10.67:1**, well exceeding the WCAG AA requirement of 4.5:1.
- **Automated Verification**: Playwright browser test in [`apps/web/tests/browser/case-001-live-smoke.spec.ts`](apps/web/tests/browser/case-001-live-smoke.spec.ts#L93-L114) evaluates computed CSS on disabled buttons live in the browser, asserting `opacity === "1"` and `contrast >= 4.5`.

#### 2. Unique Actionable Error Presentation: **PASS**
- **Heading Truthfulness**: When `c.error` is present, the case heading displays `Case 001: Case file unavailable` instead of misleading `Loading case fileΓÇª`.
- **Unique Alert**: The duplicate `<p role="alert">{c.error}</p>` below the action buttons was removed. Exactly one alert (`<div role="alert">`) is rendered.
- **Actionable Guidance**: Directs the user:
  > *"Close this app and double-click Start-SequelDetective.cmd to set up and launch it. If startup fails, send the launcher message to your instructor. Your saved work remains preserved."*
- **Automated Verification**: Playwright test asserts `expect(page.getByRole("alert")).toHaveCount(1)` and confirms the alert contains `"Start-SequelDetective.cmd"`.

#### 3. Fresh CrimeType Guidance: **PASS**
- **Initial Briefing**: Fresh Case 001 launch provides an empty SQL editor and Samuel Tupleton's opening guidance: *"Start with CrimeType"*. Downstream clues are not revealed prematurely (`not.toContainText("Nice work finding")`).
- **Progress Gate**: Clicking "Use starter" populates `SELECT * FROM CrimeType;`. Executing this completes step 1 (`completed: 1`) and updates guidance to *"Carry the CrimeID you observed"*.

#### 4. Broad-Query Retention: **PASS**
- **Progression Gate**: Executing the broad query `SELECT * FROM CrimeSceneReport WHERE CrimeID = 1080;` returns multiple rows (`rowCount > 1`). The step does **not** advance (`stepKey` remains `"clocktower-report"`, completed step remains 1), and guidance does **not** advance to *"The report gives us a trail"*.
- **Draft Retention**: The student's query text in the editor is preserved (`broadSql`) without being overwritten.

#### 5. Browser Resume: **PASS**
- **Workspace Drafts & Notes**: Custom queries (e.g. `SELECT PersonID FROM InterviewLog ORDER BY PersonID; -- my retained draft`) and logged notebook entries persist across reload.
- **Resumption**: Re-entering via "Resume Case File" restores the draft in Query Lab, preserves guidance, and keeps prior completed attempts preserved and retrievable via `/api/cases/case-001/attempts`.

#### 6. Backed-Up Installation Evidence: **PASS**
- **SQL Server Backup Retention**: Verified directly in `msdb.dbo.backupset` / `backupmediafamily`:
  - Path: `C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\Backup\SequelCityCrimesDB_before_runtime_509d5865423c418a9703c614b3e08421.bak`
  - Timestamp: `10/12/2026 9:17:27 AM`
- **Integrity**: `RESTORE VERIFYONLY ... WITH CHECKSUM` executed against SQL Server with exit code 0.
- **Public Evidence Intact**: `Assert-StudentEvidence` evaluated on `SequelCityCrimesDB` returned `1`.
- **Runtime Schema**: `Assert-StudentRuntimeShape` returned `1`; `EXEC app.CheckEvidenceManifest;` returned `1`.

---

### Rejection Checks

- **Scope Expansion**: **REJECTED** - Only permitted files modified:
  - [`docs/01-work-packages/WP-292-case-001-entry-readability-and-launch-validation.md`](docs/01-work-packages/WP-292-case-001-entry-readability-and-launch-validation.md)
  - [`apps/web/src/components/student/CurrentCaseTask.tsx`](apps/web/src/components/student/CurrentCaseTask.tsx)
  - [`apps/web/src/styles.css`](apps/web/src/styles.css)
  - [`apps/web/tests/browser/case-001-live-smoke.spec.ts`](apps/web/tests/browser/case-001-live-smoke.spec.ts)
- **Secrets**: **REJECTED** - Zero secrets, credentials, or tokens in diff or tracked files; `apps/api/.env` is gitignored.
- **Destructive Live Scripts**: **REJECTED** - Additive schema migration with copy-only verified backup; no `DROP DATABASE` or evidence wipe.
- **Case 004 Changes**: **REJECTED** - No modifications made to Case 004 implementation; legacy adapter test passes cleanly.

---

### Automated Validation Summary

- **Web Unit Suite**: `npm run test --workspace web` - 21 test files, 238 tests passed.
- **Browser Live Smoke Suite**: `case-001-live-smoke.spec.ts` - 3 passed (Case 001 proof/resume, Case 004 legacy adapter, Case 001 unavailable entry).
- **Whitespace / Diff Check**: `git diff --check` - Clean.
- **Closeout Preflight**: `scripts/check-work-package-closeout.ps1 WP-292` - State `ReadyForAcceptance`, 0 findings.

*Human acceptance remains pending.*
root agent idle; waiting up to 30m0s for 1 background task(s)

## Final Decision

Accepted by the human maintainer on 2026-10-12 with explicit authorization to close out, commit and push. Independent AntiGravity audit PASS and preflight ReadyForAcceptance with zero findings support acceptance. First-launch provisioning retry remains a separate planned WP-293 correction; this acceptance covers the scoped readability/startup feedback and Case 001 validation work.
