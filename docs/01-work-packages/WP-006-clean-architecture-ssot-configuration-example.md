# clean architecture ssot configuration example

## Objective

Align SSOT-Architecture with the selected Node.js + TypeScript + Fastify stack by replacing the outdated ASP.NET-style connection string example with the correct .env-based configuration model.

## Scope

### In Scope

- Update SSOT-Architecture configuration examples
- Replace ASP.NET-style ConnectionStrings JSON example
- Introduce .env-based configuration model
- Ensure examples match actual backend implementation

### Out of Scope

- Any application code changes
- Backend logic changes
- Frontend work
- Database schema changes
- Work package changes
- Adding new SSOT documents

## Files Allowed to Change

- docs/00-ssot/SSOT-Architecture.md

## Constraints

- Do not modify any source code
- Do not introduce new configuration systems
- Must align with existing Node.js backend implementation
- Must remain local-first
- Must not include credentials in examples
- Must not reintroduce ASP.NET patterns
- Preserve all other SSOT content

## Required Behavior

- Remove any ASP.NET-style configuration examples such as:

ConnectionStrings:
  DefaultConnection: "Server=..."

- Replace with a Node.js-compatible .env-based configuration example
- Add a clear configuration section that includes:

Example .env:

SQLSERVER_HOST=localhost
SQLSERVER_PORT=1433
SQLSERVER_DATABASE=SequelCityCrimesDB
SQLSERVER_USER=your_username
SQLSERVER_PASSWORD=your_password
SQLSERVER_TRUST_SERVER_CERTIFICATE=true

- Add explanation:
- Configuration is loaded via environment variables
- Backend uses dotenv
- No credentials are stored in source code
- Configuration is local-first and machine-specific
- Ensure the documentation clearly reflects:
- Node.js + Fastify backend
- Environment-driven configuration
- SQL Server connectivity
- Do not alter unrelated sections

## Acceptance Criteria

- [ ] SSOT-Architecture no longer contains ASP.NET-style ConnectionStrings example
- [ ] .env-based configuration example is present
- [ ] Example matches backend variable names used in apps/api
- [ ] Documentation clearly explains environment-based configuration
- [ ] No credentials are hard-coded in examples
- [ ] No source code files are modified
- [ ] No unrelated SSOT content is changed

## Codex Prompt

Update SSOT-Architecture.md to align configuration documentation with the Node.js + Fastify backend.

Context:
The backend now uses environment-based configuration with dotenv. The SSOT currently contains an outdated ASP.NET-style configuration example using ConnectionStrings.

Scope:
Only modify docs/00-ssot/SSOT-Architecture.md.

Required changes:

1. Remove ASP.NET-style configuration examples:

- Remove any JSON or YAML examples referencing ConnectionStrings or appsettings.json patterns

2. Add new configuration section:

Add a section similar to:

Configuration Model

The backend uses environment-based configuration.

Example .env file:

SQLSERVER_HOST=localhost
SQLSERVER_PORT=1433
SQLSERVER_DATABASE=SequelCityCrimesDB
SQLSERVER_USER=your_username
SQLSERVER_PASSWORD=your_password
SQLSERVER_TRUST_SERVER_CERTIFICATE=true

3. Add explanation text:

- Configuration is loaded using dotenv
- Credentials are not stored in source control
- Each developer provides their own local configuration
- The system remains local-first and self-contained

4. Ensure consistency:

- Match variable names exactly with backend implementation
- Do not introduce new variables
- Do not modify unrelated sections

Return:

- Summary of changes
- Confirmation ASP.NET configuration example removed
- Confirmation .env configuration added
- Any remaining inconsistencies

## Gemini Audit Prompt

Audit the SSOT configuration update.

Allowed files:

- docs/00-ssot/SSOT-Architecture.md

Verify:

- ASP.NET ConnectionStrings examples are removed
- .env-based configuration example is present
- Variable names match backend implementation
- Documentation reflects Node.js + Fastify stack
- No credentials are hard-coded
- No unrelated sections were modified
- No source code files were changed

Output:

- Verdict: PASS or FAIL
- Violations
- Regressions
- Drift risks
- Required fixes

## Codex Results

Updated [SSOT-Architecture.md](/abs/path not available) in `docs/00-ssot/SSOT-Architecture.md` only.

Summary of changes: I removed the old JSON `ConnectionStrings` example and replaced the local configuration guidance with a `Configuration Model` section describing the current environment-based setup. The section now includes the exact `.env` example using `SQLSERVER_HOST`, `SQLSERVER_PORT`, `SQLSERVER_DATABASE`, `SQLSERVER_USER`, `SQLSERVER_PASSWORD`, and `SQLSERVER_TRUST_SERVER_CERTIFICATE`, plus the requested notes about `dotenv`, source-control safety, per-developer local config, and the local-first/self-contained model.

Confirmation ASP.NET configuration example removed: yes.
Confirmation `.env` configuration added: yes.

Remaining inconsistencies: none in this file. I also removed an orphaned `## Local Configuration` header that would otherwise have been left empty after the replacement.

## Gemini Audit Results

Audit of `docs/00-ssot/SSOT-Architecture.md` completed.

### Audit Report

- **Verdict:** PASS
- **Violations:** None.
- **Regressions:** None.
- **Drift risks:** None. The SSOT is tightly coupled with the current backend implementation in `apps/api/src/config/database.ts`.
- **Required fixes:** None.

### Verification Details

| Requirement                                        | Result | Notes                                                                                                |
| -------------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------- |
| **ASP.NET ConnectionStrings removed**        | PASS   | No matches found for `ConnectionString` or ASP.NET-style JSON config.                              |
| **.env-based configuration present**         | PASS   | Example provided in the "Configuration Model" section.                                               |
| **Variable names match backend**             | PASS   | Verified against `apps/api/src/config/database.ts` (e.g., `SQLSERVER_HOST`, `SQLSERVER_PORT`). |
| **Documentation reflects Node.js + Fastify** | PASS   | Explicitly stated in the "Technology Decision" table.                                                |
| **No credentials hard-coded**                | PASS   | Uses placeholders like `your_username` and `your_password`.                                      |
| **No unrelated sections modified**           | PASS   | The file remains focused on architecture principles and runtime layers.                              |
| **No source code files changed**             | PASS   | Audit was read-only for source files.                                                                |

The documentation correctly identifies the shift from ASP.NET to the Node.js + Fastify stack and provides accurate configuration guidance for developers.
Warning: 256-color support not detected. Using a terminal with at least 256-color support is recommended for a better visual experience.
Ripgrep is not available. Falling back to GrepTool.
(node:67612) [DEP0190] DeprecationWarning: Passing args to a child process with shell option true can lead to security vulnerabilities, as the arguments are not escaped, only concatenated.
(Use `node --trace-deprecation ...` to show where the warning was created)

## Final Decision

Approved. SSOT-Architecture is now fully aligned with the Node.js + TypeScript + Fastify stack and environment-based configuration model. The outdated ASP.NET ConnectionStrings pattern has been removed and replaced with a correct .env-based approach. No drift or inconsistencies remain.
