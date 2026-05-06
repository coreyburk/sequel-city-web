# Prompt Formatting Guidelines

## Preferred Prompt Format

- Use plain markdown or plain text.
- Keep prompts structurally simple and easy for the runner to pass through.
- Prefer quote-free command descriptions if runner errors occur.
- Scope Gemini audits to changed files unless a full audit is required.

## Avoid These Formatting Problems

- malformed code blocks copied from rendered content
- code block attributes
- hidden HTML fragments
- backslash-escaped quote examples in Codex prompts
- nested code fences when possible

## Known Runner Failure Symptoms

These symptoms often indicate prompt parsing or formatting problems rather than real project logic failures:

- `unexpected argument px-0 data-start`
- `unexpected argument npm run dev workspace`
- `unexpected argument run`
- `unexpected argument descriptive`
- `Codex CLI exited with code 2 after prompt parsing problems`

## Prompt Repair Guidance

If runner parsing fails:

1. Remove copied rendered markup or malformed fence syntax.
2. Replace complicated quoted examples with simpler plain text instructions.
3. Remove code block attributes and hidden fragments.
4. Simplify nested fences when they are not necessary.
5. Rerun the appropriate work package mode after the prompt is clean.

## Audit Scope Guidance

Gemini audits should usually focus on the files changed by the work package. Expand to a broader audit only when the package explicitly requires full-project review or when the changed area makes broader regression review necessary.
