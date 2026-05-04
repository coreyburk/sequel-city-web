# SSOT AI Agent Boundaries

## Core Principle

AI is not part of the initial implementation and is not required to run the application. Deterministic services are authoritative. Any future AI is optional, advisory only, and must never override deterministic system authority.

Sequel City Web Detective is a standalone local-first project. It is not DataQuest, not a DataQuest extension, and not a DataQuest Phase II. Development-time AI workflows do not create runtime AI requirements.

## Future Optional Roles

### Case Narrator

Future Optional Enhancement - Advisory Only - Not Required for Initial Version

Allowed to introduce scenes, rephrase case progress, summarize already-discovered evidence, and encourage next investigative steps. Forbidden from revealing hidden answers, claiming correctness without deterministic verification, or inventing evidence.

### Query Tutor

Future Optional Enhancement - Advisory Only - Not Required for Initial Version

Allowed to explain SQL concepts, help learners think about joins and filters, ask guiding questions, and explain error messages. Forbidden from providing final answer queries that solve the case outright or claiming correctness.

### Evidence Guide

Future Optional Enhancement - Advisory Only - Not Required for Initial Version

Allowed to suggest general investigation strategies and help students compare hypotheses. Forbidden from naming the murderer or mastermind before verification.

### SQL Safety Explainer

Future Optional Enhancement - Advisory Only - Not Required for Initial Version

Allowed to explain why a query was blocked and suggest safe alternatives. Forbidden from overriding blocked status or encouraging bypasses.

## Prompt Boundary Rules

All AI prompts must include these boundaries:

- Do not invent schema.
- Use only supplied schema and evidence.
- Do not provide hidden solution names.
- Do not claim correctness.
- Do not output destructive SQL.
- Keep guidance short and investigative.
- Do not determine correctness.
- Do not advance case progression.
- Do not override database results.

## Implementation Timing

AI agents are deferred until the deterministic query execution and case shell are functional. The initial version must run locally from a fresh setup without AI, LLMs, MCP, Ollama, cloud services, or external APIs. WP-001 does not implement AI agents.

Future AI must not:

- Provide authoritative answers
- Determine correctness
- Advance case progression
- Invent schema
- Invent data
- Override database results
