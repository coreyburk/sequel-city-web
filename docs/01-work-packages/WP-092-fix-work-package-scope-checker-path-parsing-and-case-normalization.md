# WP-092: fix-work-package-scope-checker-path-parsing-and-case-normalization

## Objective

Fix Work Package scope checking so it accurately separates allowed files from prohibited files, normalizes path casing, and avoids false positives for valid scoped changes.

This WP addresses scope checker issues observed during WP-091, where:

- `Do Not Modify` paths were incorrectly listed as allowed files
- case differences caused valid paths to be flagged
- necessary frontend integration files were flagged because allowed patterns were too narrow
- generated build artifacts were correctly detected but need clearer handling

The goal is to make scope checking reliable, deterministic, and aligned with the Work Package structure.

---

## Scope

Update the Work Package runner scope checking behavior.

This WP modifies workflow tooling and workflow documentation only.

No runtime application behavior changes.
No frontend runtime changes.
No backend runtime changes.
No database changes.

---

## Files Allowed to Change

Allowed:

- scripts/run-work-package.ps1
- docs/05-development-workflow/**
- docs/01-work-packages/WP-092-fix-work-package-scope-checker-path-parsing-and-case-normalization.md

Do Not Modify:

- apps/api/**
- apps/web/**
- database/**
- docs/00-ssot/**
- docs/06-architecture/**
- docs/07-api-contracts/**
- docs/08-database/**
- docs/09-release-readiness/**
- docs/10-user-journey/**
- package.json files
- build configuration

---

## Constraints

- Preserve existing `-Execute` semantics
- Preserve filename stub workflow
- Preserve Codex execution behavior
- Preserve Claude execution behavior
- Preserve Gemini audit behavior
- Preserve `-Execute Full` sequencing
- Do not weaken scope checking
- Do not treat prohibited files as allowed
- Do not modify application runtime files
- Keep implementation surgical and backward-compatible

Formatting constraints:

- Use plain markdown only
- Avoid nested code fences
- Avoid escaped quote sequences
- Avoid malformed markdown tables
- Avoid hidden HTML fragments

---

## Required Behavior

### 1. Parse Allowed Files Only From Allowed Section

The scope checker must extract allowed paths only from the `## Files Allowed to Change` section under the `Allowed:` subsection.

It must not treat files listed under `Do Not Modify:` as allowed.

Expected behavior:

- paths under `Allowed:` become allowed patterns
- paths under `Do Not Modify:` become prohibited patterns or are ignored for allowance
- prohibited paths must never appear in the scope check allowed list

---

### 2. Normalize Path Casing

The scope checker must compare paths case-insensitively on Windows.

Examples:

- `apps/web/src/components/student/StudentEvidenceBoardView.tsx`
- `apps/web/src/components/student/studentevidenceboardview.tsx`

should be treated as the same path for scope comparison.

Path normalization should also handle:

- backslashes
- forward slashes
- leading `./`
- repository-relative paths

---

### 3. Improve Pattern Matching

Scope matching must correctly handle common WP patterns:

- exact files
- directory globs ending in `/**`
- markdown docs under specific directories
- generated work package file paths

Examples:

- `apps/web/src/features/**` should allow files below that directory
- `docs/10-user-journey/**` should allow files below that directory
- `docs/01-work-packages/WP-092-fix-work-package-scope-checker-path-parsing-and-case-normalization.md` should allow the current WP file

---

### 4. Preserve Build Artifact Detection

The scope checker should continue flagging generated build artifacts unless explicitly allowed.

Examples that should remain flagged unless allowed:

- `*.tsbuildinfo`
- compiled Vite config output
- generated build output
- temporary tool metadata

Do not silently ignore build artifacts in this WP.

---

### 5. Improve Scope Check Output

Scope check output should clearly distinguish:

- allowed patterns
- prohibited patterns if tracked
- modified files
- out-of-scope files

The allowed list must not include `Do Not Modify` entries.

If a file is flagged because it is not covered by allowed patterns, the message should be clear.

---

### 6. Documentation Update

Update workflow documentation to explain:

- how allowed files are parsed
- how `Do Not Modify` differs from `Allowed`
- how path case normalization works on Windows
- how integration files should be listed in future WPs
- why build artifacts should remain out of scope unless explicitly allowed

---

## Acceptance Criteria

- Scope checker no longer lists `Do Not Modify` paths as allowed
- Scope checker compares paths case-insensitively on Windows
- Scope checker handles slash normalization
- Scope checker handles exact file and `/**` directory patterns
- Scope checker continues flagging build artifacts when not allowed
- Scope check output clearly separates allowed patterns from modified files and violations
- Existing Codex, Claude, Gemini, and Full execution behavior remains unchanged
- Workflow documentation updated
- No runtime application files modified
- No database files modified

---

## Code Prompt

You are implementing WP-092 for the Sequel City Web Detective project.

Objective:
Fix the Work Package scope checker so it accurately parses allowed files, excludes `Do Not Modify` entries from allowed scope, and normalizes paths case-insensitively on Windows.

Problem:
During WP-091, the scope checker reported false positives and misleading output. It listed `Do Not Modify` entries as allowed files, flagged valid paths due to case differences, and made scope results harder to trust.

Important:

- Modify workflow tooling only
- Do not modify runtime application code
- Do not modify frontend or backend runtime files
- Do not modify database scripts
- Preserve existing `-Execute` semantics
- Preserve Codex execution behavior
- Preserve Claude execution behavior
- Preserve Gemini execution behavior
- Preserve `-Execute Full` sequencing
- Do not weaken scope checking

Before editing:

1. Review `scripts/run-work-package.ps1`
2. Locate the existing scope checking logic
3. Review how the runner parses `Files Allowed to Change`
4. Review current output formatting for scope check results
5. Review docs under `docs/05-development-workflow`

Implement:

1. Ensure allowed patterns are parsed only from the `Allowed:` subsection of `## Files Allowed to Change`.
2. Ensure `Do Not Modify:` entries are not included in allowed patterns.
3. Normalize repository paths before comparison:
   - convert backslashes to forward slashes
   - remove leading `./`
   - compare case-insensitively on Windows
4. Preserve support for exact file paths.
5. Preserve support for directory glob patterns ending in `/**`.
6. Continue flagging generated build artifacts unless explicitly allowed.
7. Improve scope check output so allowed patterns and out-of-scope files are clear.
8. Update workflow documentation under `docs/05-development-workflow/`.

Do not:

- remove scope checking
- weaken scope checking
- ignore generated build artifacts globally
- change command-line semantics
- change WP filename stub resolution
- modify application runtime files
- introduce unrelated runner refactors

Keep the implementation surgical, deterministic, and backward-compatible.

---

## Gemini Audit Prompt

Audit WP-092 scope checker path parsing and normalization fixes.

Verify:

1. Only approved workflow files were modified.
2. No frontend runtime files changed.
3. No backend runtime files changed.
4. No database scripts changed.
5. Scope checker parses allowed patterns only from `Allowed:`.
6. Scope checker does not treat `Do Not Modify:` entries as allowed.
7. Scope checker normalizes path separators.
8. Scope checker compares paths case-insensitively on Windows.
9. Exact file patterns still work.
10. Directory patterns ending in `/**` still work.
11. Build artifacts remain flagged unless explicitly allowed.
12. Existing Codex execution behavior remains unchanged.
13. Existing Claude execution behavior remains unchanged.
14. Existing Gemini execution behavior remains unchanged.
15. Full execution sequencing remains unchanged.
16. Workflow documentation explains the corrected scope behavior.

Specifically validate:

- section parsing behavior
- path normalization behavior
- case normalization behavior
- allowed vs prohibited output clarity
- build artifact handling
- backward compatibility
- no runtime app modifications

Flag:

- `Do Not Modify` paths appearing in allowed scope
- weakened scope checking
- ignored generated artifacts
- case-sensitive false positives on Windows
- broken exact file matching
- broken directory glob matching
- runtime application modifications
- contradictory workflow documentation

---

## Code Results

**Implementation summary:**

- **`scripts/run-work-package.ps1`**
  - Replaced `Get-AllowedWorkPackageFiles` with `Get-WorkPackageScopeLists`, which walks the `## Files Allowed to Change` body and tracks an `Allowed:` / `Do Not Modify:` state machine. When the new `Allowed:` marker is absent, the function falls back to legacy flat-list behavior so older WPs continue to work.
  - `Get-AllowedWorkPackageFiles` is preserved as a thin wrapper for backward compatibility.
  - Added `Test-WorkPackagePathAllowed` to match a normalized modified path against allowed patterns: exact equality plus directory globs ending in `/**` (with prefix-boundary check so `apps/web/foo` does not match `apps/web/foobar`).
  - Added `Test-BuildArtifactPath` to detect generated build output (`*.tsbuildinfo`, `dist/`, `build/`, `out/`, `coverage/`, `.next/`, `.vite/`, `.turbo/`, `.cache/`, `.parcel-cache/`, `node_modules/`, `*.map`). Build artifacts are annotated `(build artifact)` in the report but are still reported as violations unless explicitly allowed.
  - Reworked `Format-ScopeCheckSection` to emit `Allowed patterns`, the new `Prohibited patterns (Do Not Modify)` block (only when populated), `Modified files`, and `Out-of-scope files` with the build-artifact annotation.
  - Wired the new lists into `Invoke-ExecutionStep` so the matcher (not raw `-notcontains`) decides scope; `-Execute`, Codex/Claude/Gemini, and `Full` sequencing are untouched.
  - Path normalization already lowercased and slash-normalized via `Normalize-WorkPackagePath`; tests confirm `apps\Web\Src\Features\...` is now considered in-scope against `apps/web/src/features/**`.

- **`docs/05-development-workflow/Work-Package-Lifecycle.md`** ΓÇö new sections: *Files Allowed To Change Structure* (preferred vs. legacy layout), *Path Matching And Normalization*, *Scope Check Output*, and *Integration File Listing Guidance*.

**Tests run (temporary harness, then removed):** 26 assertions across WP-092 (subsection parsing), WP-091 (verified the original false-positive bug is fixed), a legacy WP (WP-003 flat list still works), the `/**` matcher, path normalization, case-insensitivity, and build-artifact detection ΓÇö all passing. A simulated end-to-end run rendered the report and correctly flagged `apps/api/src/server.ts` and `apps/web/tsconfig.tsbuildinfo (build artifact)` as out-of-scope while accepting allowed paths.

**Scope:** only the three paths listed under `Allowed:` in WP-092 are modified.

### Scope Check

Result: PASS - no out-of-scope file changes detected

Allowed patterns
----------------
- scripts/run-work-package.ps1
- docs/05-development-workflow/**
- docs/01-work-packages/wp-092-fix-work-package-scope-checker-path-parsing-and-case-normalization.md

Prohibited patterns (Do Not Modify)
-----------------------------------
- apps/api/**
- apps/web/**
- database/**
- docs/00-ssot/**
- docs/06-architecture/**
- docs/07-api-contracts/**
- docs/08-database/**
- docs/09-release-readiness/**
- docs/10-user-journey/**

Modified files
--------------
- docs/05-development-workflow/work-package-lifecycle.md
- scripts/run-work-package.ps1
- docs/01-work-packages/wp-092-fix-work-package-scope-checker-path-parsing-and-case-normalization.md

Out-of-scope files
------------------
- None

## Gemini Audit Results

Verdict: PASS

## Final Decision

Approved. The scope checker now parses allowed patterns exclusively from the `Allowed:` subsection of `## Files Allowed to Change`, keeping `Do Not Modify:` entries out of the allowed list. Path comparison is case-insensitive and slash-normalized. The new `Test-WorkPackagePathAllowed` matcher handles exact file paths and `/**` directory globs with correct prefix-boundary checks. Build artifacts are annotated `(build artifact)` and remain flagged unless explicitly allowed. The new `Format-ScopeCheckSection` output distinguishes `Allowed patterns`, `Prohibited patterns (Do Not Modify)`, `Modified files`, and `Out-of-scope files`. Legacy flat-list WPs fall back automatically. `Work-Package-Lifecycle.md` updated with section structure guidance, path normalization rules, and integration file listing guidance. Scope check output in Code Results confirms PASS against the fixed checker. Gemini audit verdict: PASS.


