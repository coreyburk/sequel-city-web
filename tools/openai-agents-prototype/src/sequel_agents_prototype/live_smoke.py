"""Sanitized live OpenAI Agents SDK smoke test boundary."""

from __future__ import annotations

import importlib.util
import json
import os
import sys
from dataclasses import asdict, dataclass
from typing import Any


LIVE_OPT_IN_ENV = "SEQUEL_AGENTS_ALLOW_LIVE_SMOKE"
TRACING_DISABLED_ENV = "OPENAI_AGENTS_DISABLE_TRACING"
FIXTURE_NAME = "sanitized_workflow_category_fixture"
SANITIZED_FIXTURE_PROMPT = (
    "Classify this synthetic development workflow label using exactly one short "
    "phrase: idea intake, audit dispatch, corrective planning, or closeout. "
    "Synthetic label: offline workflow fixture."
)
SANITIZED_AGENT_INSTRUCTIONS = (
    "You are evaluating a synthetic development-workflow fixture. "
    "Do not request files, tools, repositories, secrets, databases, traces, or external data. "
    "Reply with one short phrase only."
)
FORBIDDEN_MARKERS = (
    "docs/01-work-packages/",
    "apps/",
    "database/",
    "BEGIN PRIVATE KEY",
    "OPENAI_API_KEY",
    "END-OF-DAY-HANDOFF",
    "Audit Results",
    "Case 004",
)


@dataclass(frozen=True)
class SmokePrerequisites:
    sdk_available: bool
    api_key_present: bool
    live_opt_in: bool

    @property
    def ready(self) -> bool:
        return self.sdk_available and self.api_key_present and self.live_opt_in

    @property
    def skip_reason(self) -> str:
        missing: list[str] = []
        if not self.sdk_available:
            missing.append("openai-agents SDK is not installed")
        if not self.api_key_present:
            missing.append("OPENAI_API_KEY is not present")
        if not self.live_opt_in:
            missing.append(f"{LIVE_OPT_IN_ENV}=1 is not present")
        return "; ".join(missing)


def get_sanitized_fixture_prompt() -> str:
    return SANITIZED_FIXTURE_PROMPT


def get_forbidden_markers_present(text: str) -> tuple[str, ...]:
    return tuple(marker for marker in FORBIDDEN_MARKERS if marker in text)


def inspect_live_prerequisites() -> SmokePrerequisites:
    return SmokePrerequisites(
        sdk_available=importlib.util.find_spec("agents") is not None,
        api_key_present=bool(os.environ.get("OPENAI_API_KEY")),
        live_opt_in=os.environ.get(LIVE_OPT_IN_ENV) == "1",
    )


def disable_tracing_before_live_boundary() -> bool:
    os.environ[TRACING_DISABLED_ENV] = "1"
    return os.environ.get(TRACING_DISABLED_ENV) == "1"


def build_base_result(
    *,
    status: str,
    prerequisites: SmokePrerequisites,
    live_execution_attempted: bool,
    tracing_disabled: bool,
    result_summary: str = "",
    skip_reason: str = "",
    error_type: str = "",
) -> dict[str, Any]:
    prompt = get_sanitized_fixture_prompt()
    return {
        "status": status,
        "live_execution_attempted": live_execution_attempted,
        "tracing_disabled": tracing_disabled,
        "sdk_available": prerequisites.sdk_available,
        "api_key_present": prerequisites.api_key_present,
        "live_opt_in": prerequisites.live_opt_in,
        "fixture_name": FIXTURE_NAME,
        "forbidden_markers_present": list(get_forbidden_markers_present(prompt)),
        "result_summary": result_summary,
        "skip_reason": skip_reason,
        "error_type": error_type,
    }


def run_smoke_test() -> dict[str, Any]:
    prerequisites = inspect_live_prerequisites()
    if not prerequisites.ready:
        return build_base_result(
            status="skipped",
            prerequisites=prerequisites,
            live_execution_attempted=False,
            tracing_disabled=os.environ.get(TRACING_DISABLED_ENV) == "1",
            skip_reason=prerequisites.skip_reason,
        )

    tracing_disabled = disable_tracing_before_live_boundary()
    if get_forbidden_markers_present(get_sanitized_fixture_prompt()):
        return build_base_result(
            status="failed",
            prerequisites=prerequisites,
            live_execution_attempted=False,
            tracing_disabled=tracing_disabled,
            error_type="fixture_sanitization_failed",
            result_summary="Sanitized fixture contains forbidden markers.",
        )

    try:
        from agents import Agent, Runner, set_tracing_disabled

        try:
            from agents.run import RunConfig
        except Exception:
            RunConfig = None  # type: ignore[assignment]

        set_tracing_disabled(True)

        agent = Agent(
            name="Sequel Workflow Smoke Fixture",
            instructions=SANITIZED_AGENT_INSTRUCTIONS,
        )
        run_config = (
            RunConfig(tracing_disabled=True, trace_include_sensitive_data=False)
            if RunConfig is not None
            else None
        )
        if run_config is not None:
            result = Runner.run_sync(
                agent,
                get_sanitized_fixture_prompt(),
                run_config=run_config,
            )
        else:
            result = Runner.run_sync(agent, get_sanitized_fixture_prompt())
        final_output = str(getattr(result, "final_output", "")).strip()
        return build_base_result(
            status="passed" if final_output else "failed",
            prerequisites=prerequisites,
            live_execution_attempted=True,
            tracing_disabled=tracing_disabled,
            result_summary=final_output[:200],
        )
    except Exception as exc:
        return build_base_result(
            status="failed",
            prerequisites=prerequisites,
            live_execution_attempted=True,
            tracing_disabled=tracing_disabled,
            result_summary=str(exc)[:200],
            error_type=exc.__class__.__name__,
        )


def main() -> int:
    json.dump(run_smoke_test(), sys.stdout, sort_keys=True)
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
