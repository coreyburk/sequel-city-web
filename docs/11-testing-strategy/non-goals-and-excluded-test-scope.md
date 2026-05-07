# Non-Goals And Excluded Test Scope

## Purpose

This document identifies testing areas that are intentionally outside the current Sequel City Web Detective runtime.

## Excluded Runtime Areas

The current testing strategy does not cover:

- production deployment testing
- cloud hosting validation
- internet-facing security testing
- authentication or authorization testing
- user account testing
- multi-user isolation testing
- persistent notebook testing
- persistent case-state testing
- deterministic case progression service testing
- runtime AI validation

Those areas are not implemented in the active runtime.

## Excluded Infrastructure Areas

The current testing strategy does not introduce:

- CI/CD requirements
- container testing
- distributed systems testing
- load testing
- browser farm testing
- managed database testing
- external service contract testing
- cloud observability checks

These may be considered by future scoped work packages only if the runtime scope changes.

## Excluded AI Scope

No runtime AI behavior is implemented. Therefore testing must not imply validation of:

- LLM responses
- agent orchestration
- prompt execution
- MCP services
- Ollama or cloud AI dependencies
- AI-driven correctness decisions
- AI-driven case progression

Development-time AI tools may help write or audit documentation, but they are not runtime dependencies and do not create testable runtime behavior.

## Future Scope Rule

If future work adds new runtime behavior, testing documentation should be updated in the same scoped work package. Until then, tests and documentation should describe only the implemented local-first React, Fastify, and SQL Server runtime.
