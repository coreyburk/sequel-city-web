# Sequel City Web Detective SSOT Index

## Purpose

This folder is the authoritative documentation set for the Sequel City Web Detective project. The project converts the SequelCityCrimesDB SQL murder mystery into a locally hosted interactive website inspired by SQL Island.

## SSOT Rule

When implementation decisions conflict, the SSOT documents win over chat history, generated code, agent suggestions, and temporary implementation notes. Code changes must either comply with the SSOT or include an explicit SSOT update in the same work package.

## Documents

| Document | Authority |
|---|---|
| SSOT-Project-Vision.md | Product purpose, learner experience, scope, and non-goals |
| SSOT-Architecture.md | System layers, runtime boundaries, and local hosting architecture |
| SSOT-Database-Schema.md | Database tables, relationships, and schema access rules |
| SSOT-Case-Progression.md | Investigation milestones and deterministic progression model |
| SSOT-SQL-Safety-Rules.md | Allowed SQL, blocked SQL, safety result model, and execution constraints |
| SSOT-AI-Agent-Boundaries.md | AI agent roles, allowed behavior, and forbidden behavior |
| SSOT-UI-UX-Experience.md | Interface model, learner workflow, and screen responsibilities |
| SSOT-Development-Workflow.md | ChatGPT, Codex or Claude CLI, and Gemini CLI responsibilities |

## Initial Work Package

- `../01-work-packages/WP-001-establish-ssot-and-local-database-connection.md`
