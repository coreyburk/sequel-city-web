# ssot independence and deterministic architecture alignment

## Objective

Update the existing SSOT documents so they clearly define Sequel City Web Detective as a standalone, local-first, deterministic SQL investigation web application with no required runtime AI dependency.

## Scope (Strict)

### In Scope

- Clarify that this project is not DataQuest and has no DataQuest runtime dependency
- Clarify that the initial application must run locally from a fresh setup
- Clarify that AI is future optional only and not required for the initial version
- Define deterministic database-backed SQL execution as authoritative
- Define deterministic case progression as the only progression mechanism
- Define SQL safety expectations for the initial version
- Define the Codex + Gemini workflow as a development-only process
- Update terminology for consistency across SSOT documents

### Out of Scope

- Code implementation
- New application files
- New SSOT documents
- New dependencies
- UI redesign
- Database schema changes
- AI runtime implementation
- MCP, Ollama, or LLM integration
- DataQuest integration
- Refactoring document structure beyond the targeted SSOT updates

## Files Allowed to Change

Only the following files may be modified:

- `docs/00-ssot/SSOT-Project-Vision.md`
- `docs/00-ssot/SSOT-Architecture.md`
- `docs/00-ssot/SSOT-Database-Schema.md`
- `docs/00-ssot/SSOT-Case-Progression.md`
- `docs/00-ssot/SSOT-SQL-Safety-Rules.md`
- `docs/00-ssot/SSOT-AI-Agent-Boundaries.md`
- `docs/00-ssot/SSOT-UI-UX-Experience.md`
- `docs/00-ssot/SSOT-Development-Workflow.md`

No new files may be created.

## Constraints

- Preserve existing SSOT structure unless a section directly conflicts with this work package
- Do not introduce new runtime frameworks, tools, services, or dependencies
- Do not imply that this project depends on DataQuest
- Do not imply that AI is required for initial runtime behavior
- Do not add MCP, Ollama, local LLM, or cloud AI as initial requirements
- Do not make speculative improvements
- Do not add implementation details beyond SSOT-level requirements
- Do not modify files outside the allowed list
- Do not remove useful existing content unless it contradicts the required alignment

## Required Behavior

- The SSOT must state that Sequel City Web Detective is a new, independent project.
- The SSOT must state that the project is not DataQuest, not a DataQuest extension, and not a DataQuest Phase II.
- The SSOT must state that the application is self-contained and locally hosted.
- The SSOT must state that a student should be able to launch and play the application locally from a fresh setup.
- The SSOT must state that the initial runtime application does not require AI, LLMs, MCP, Ollama, cloud services, or external APIs.
- The SSOT must document AI only as future optional enhancement scope.
- Any future AI roles must be labeled as advisory only and not authoritative.
- The SSOT must state that database query results are authoritative.
- The SSOT must state that case progression is deterministic and driven by verified SQL query results.
- The SSOT must state that AI must not determine correctness, advance case state, invent schema, invent data, or override database results.
- The SSOT must define initial SQL execution as `SELECT`-only.
- The SSOT must explicitly block destructive or mutating SQL operations including `INSERT`, `UPDATE`, `DELETE`, `DROP`, and `ALTER`.
- The SSOT must define the Codex + Gemini workflow as a development workflow only.
- The SSOT must not imply runtime AI dependency because Codex or Gemini are used during development.
- Terminology must be consistent across all edited SSOT files.

## Acceptance Criteria (Binary)

- [ ] Project independence is explicitly documented.
- [ ] No SSOT document describes this project as DataQuest, a DataQuest extension, or a DataQuest phase.
- [ ] The application is described as self-contained and locally runnable from a fresh setup.
- [ ] Initial runtime AI is explicitly marked as not required.
- [ ] AI is documented only as future optional advisory scope.
- [ ] Deterministic SQL/database results are identified as authoritative.
- [ ] Case progression is defined as deterministic and database-backed.
- [ ] SQL execution safety is defined as `SELECT`-only for the initial version.
- [ ] Mutating or destructive SQL statements are explicitly blocked.
- [ ] Codex + Gemini are documented only as development workflow tools.
- [ ] No new files created.
- [ ] No unrelated files changed.

## Codex Prompt

Implement the SSOT alignment exactly as specified in this work package.

You are updating SSOT documents for the Sequel City Web Detective project.

## Context

This is a new, independent project.

It is not DataQuest, not a DataQuest extension, and not a Phase II of any existing system.

This project is:

- A self-contained, locally hosted web application
- Based on the SequelCityCrimesDB SQL investigation assignment
- Inspired by the SQL Island interaction model
- Designed so a student can launch and play locally from a clean setup

No external systems, services, or prior projects are required.

## Development Methodology

This project uses an AI-assisted development workflow:

- ChatGPT for architecture and planning
- Codex CLI for implementation
- Gemini CLI for audit

This workflow is only for development.

The runtime application must not depend on:

- AI
- LLMs
- MCP
- Ollama
- Cloud AI services
- External APIs

## Scope

Only modify these files:

- `docs/00-ssot/SSOT-Project-Vision.md`
- `docs/00-ssot/SSOT-Architecture.md`
- `docs/00-ssot/SSOT-Database-Schema.md`
- `docs/00-ssot/SSOT-Case-Progression.md`
- `docs/00-ssot/SSOT-SQL-Safety-Rules.md`
- `docs/00-ssot/SSOT-AI-Agent-Boundaries.md`
- `docs/00-ssot/SSOT-UI-UX-Experience.md`
- `docs/00-ssot/SSOT-Development-Workflow.md`

No new files may be created.

## Required SSOT Updates

### 1. Project Independence

Update the relevant SSOT documents so they explicitly state:

- Sequel City Web Detective is a standalone project.
- It is not DataQuest.
- It is not a DataQuest extension.
- It is not a DataQuest Phase II.
- It does not depend on DataQuest code, architecture, MCP services, agents, or runtime components.
- Reuse of general governance patterns is allowed, but coupling is not allowed.

### 2. Local-First Application Model

Update the relevant SSOT documents so they explicitly state:

- The application must run locally.
- A student must be able to launch and play from a fresh setup.
- The application uses the local SequelCityCrimesDB database.
- No internet connection is required to play the initial version.
- No external services are required for initial runtime behavior.

### 3. Runtime AI Scope

Update `SSOT-AI-Agent-Boundaries.md` and any related SSOT references so they clearly state:

- AI is not part of the initial implementation.
- AI is not required to run the application.
- AI is future optional enhancement scope only.

Future optional roles may include:

- Case Narrator
- Query Tutor
- Evidence Guide
- SQL Safety Explainer

Each future optional role must be labeled:

`Future Optional Enhancement – Advisory Only – Not Required for Initial Version`

Future AI must not:

- Provide authoritative answers
- Determine correctness
- Advance case progression
- Invent schema
- Invent data
- Override database results

### 4. Deterministic Authority

Update the relevant SSOT documents so they explicitly state:

- SQL execution results are authoritative.
- Database-backed evidence is authoritative.
- Case progression is deterministic.
- Case progression is triggered only by verified query results or deterministic result-pattern checks.
- AI must not determine correctness or progression.

### 5. SQL Safety Rules

Update `SSOT-SQL-Safety-Rules.md` so it explicitly defines:

Allowed initial SQL behavior:

- `SELECT` queries only
- Safe filtering
- Safe joins
- Safe ordering
- Safe grouping

Blocked initial SQL behavior:

- `INSERT`
- `UPDATE`
- `DELETE`
- `DROP`
- `ALTER`
- Schema modification
- Data mutation
- Any destructive operation

Also state:

- All submitted SQL must be validated before execution.
- Violations must return a structured safety response.
- Safety enforcement must be deterministic.

### 6. Development Workflow

Update `SSOT-Development-Workflow.md` so it defines the work package model:

Each work package includes:

- `## Codex Prompt`
- `## Gemini Audit Prompt`
- `## Codex Results`
- `## Gemini Audit Results`
- Manual final decision or review section

Execution modes:

- `None` means prompt only
- `Codex` means implementation only
- `Gemini` means audit only
- `Full` means Codex first, then Gemini

Governance:

- Codex modifies files according to the work package.
- Gemini audits work against the work package and SSOT.
- Humans approve final decisions.
- This workflow is development-only and must not imply runtime AI usage.

### 7. UI/UX Initial Scope

Update `SSOT-UI-UX-Experience.md` so the initial experience is defined around:

- SQL-driven discovery
- Immediate query feedback
- Evidence-based reasoning
- Static or deterministic case narrative
- Evidence notebook
- Progress indicators

Explicitly state:

- No AI UI components are required for the initial version.

### 8. Consistency Pass

Review all allowed SSOT files and ensure:

- Terminology is consistent.
- No document contradicts project independence.
- No document implies required runtime AI.
- No document implies DataQuest dependency.
- No document implies non-deterministic case progression.

## Constraints

- Make additive, surgical changes.
- Do not introduce new frameworks or dependencies.
- Do not restructure files.
- Do not create files.
- Do not include implementation work.
- Do not make speculative improvements.
- Do not modify files outside the allowed list.
- Preserve useful existing content unless it conflicts with this work package.

## Return

After making changes, return:

- List of modified files
- Short summary of changes
- Any concerns or assumptions

## Gemini Audit Prompt

Audit the SSOT updates against this work package.

## Allowed Files

Only these files may have changed:

- `docs/00-ssot/SSOT-Project-Vision.md`
- `docs/00-ssot/SSOT-Architecture.md`
- `docs/00-ssot/SSOT-Database-Schema.md`
- `docs/00-ssot/SSOT-Case-Progression.md`
- `docs/00-ssot/SSOT-SQL-Safety-Rules.md`
- `docs/00-ssot/SSOT-AI-Agent-Boundaries.md`
- `docs/00-ssot/SSOT-UI-UX-Experience.md`
- `docs/00-ssot/SSOT-Development-Workflow.md`

No new files are allowed.

## Audit Requirements

Verify:

### 1. Project Independence

- The SSOT clearly states this is not DataQuest.
- The SSOT clearly states this is not a DataQuest extension.
- The SSOT clearly states this is not a DataQuest Phase II.
- There are no hidden DataQuest runtime dependencies.

### 2. Local-First Operation

- The SSOT defines the application as self-contained.
- The SSOT states the application must run locally.
- The SSOT states students can launch and play from a fresh setup.
- The SSOT does not require internet access for initial play.

### 3. Runtime AI Scope

- AI is explicitly not required for the initial version.
- AI is documented only as future optional enhancement scope.
- Any future AI role is advisory only.
- No document implies LLM, MCP, Ollama, cloud AI, or external AI is required at runtime.

### 4. Deterministic Authority

- SQL execution results are authoritative.
- Database-backed evidence is authoritative.
- Case progression is deterministic.
- Case progression is tied to verified query results or deterministic result-pattern checks.
- AI does not determine correctness or progression.

### 5. SQL Safety

- Initial SQL execution is limited to `SELECT`.
- Mutating or destructive SQL statements are explicitly blocked.
- Validation before execution is required.
- Violations return structured safety responses.

### 6. Development Workflow Separation

- Codex and Gemini are documented as development tools only.
- The workflow does not imply runtime AI dependency.
- Human final approval is preserved.

### 7. File Scope

- No files outside the allowed list were modified.
- No new files were created.

### 8. Drift and Regression

Flag any:

- Runtime AI requirement
- DataQuest coupling
- MCP/Ollama/LLM dependency
- External service dependency
- Non-deterministic progression
- Over-engineering
- Unapproved architecture expansion
- Vague or unenforceable language

## Output Format

Return:

- Verdict: PASS or FAIL
- Strengths
- Violations
- Regressions
- Drift risks
- Required fixes

Be precise. No filler. No narrative.

## Codex Results


Modified files:

- [SSOT-Project-Vision.md](D:/GitHub-Repos/SequelCityWeb/docs/00-ssot/SSOT-Project-Vision.md)
- [SSOT-Architecture.md](D:/GitHub-Repos/SequelCityWeb/docs/00-ssot/SSOT-Architecture.md)
- [SSOT-Database-Schema.md](D:/GitHub-Repos/SequelCityWeb/docs/00-ssot/SSOT-Database-Schema.md)
- [SSOT-Case-Progression.md](D:/GitHub-Repos/SequelCityWeb/docs/00-ssot/SSOT-Case-Progression.md)
- [SSOT-SQL-Safety-Rules.md](D:/GitHub-Repos/SequelCityWeb/docs/00-ssot/SSOT-SQL-Safety-Rules.md)
- [SSOT-AI-Agent-Boundaries.md](D:/GitHub-Repos/SequelCityWeb/docs/00-ssot/SSOT-AI-Agent-Boundaries.md)
- [SSOT-UI-UX-Experience.md](D:/GitHub-Repos/SequelCityWeb/docs/00-ssot/SSOT-UI-UX-Experience.md)
- [SSOT-Development-Workflow.md](D:/GitHub-Repos/SequelCityWeb/docs/00-ssot/SSOT-Development-Workflow.md)

The SSOT now explicitly defines the project as a standalone Sequel City Web Detective application, not DataQuest or any extension/phase of it, with a self-contained local-first runtime that must work from a fresh setup without internet, AI, MCP, Ollama, cloud services, or external APIs. I also aligned authority rules so database-backed query results and deterministic progression are authoritative, and AI is documented only as future optional advisory scope.

I tightened the SQL safety document to require deterministic pre-execution validation, `SELECT`-only initial execution, explicit blocking of mutating/destructive SQL, and structured safety responses. I also updated the development workflow to define the required work package sections, execution modes, and the Codex/Gemini roles as development-only.

Concerns or assumptions: none beyond the existing line-ending warnings from Git (`LF` to `CRLF`) on these Markdown files. No files outside the allowed list were changed.

## Gemini Audit Results

Verdict: PASS

Strengths:
- Explicit and consistent language across all 8 SSOT documents defining Sequel City Web Detective as a standalone, independent project with no DataQuest dependency.
- Clear "Future Optional Enhancement - Advisory Only - Not Required for Initial Version" labels for all AI-related roles.
- Deterministic authority model correctly identifies database results as the only source of truth for case progression.
- SQL Safety rules are strictly defined as SELECT-only with clear blocking of all mutating/destructive operations.
- Development workflow is clearly separated from runtime requirements.

Violations: None.
Regressions: None.
Drift risks: None.
Required fixes: None.

## Final Decision

Approved. The SSOT documents are now correctly aligned with the deterministic, local-first, independent architecture required for the project.
