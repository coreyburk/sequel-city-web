"""Guardrails for the development-only orchestration prototype."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class GuardrailResult:
    allowed: bool
    reason: str


class WorkflowGuardrails:
    """Pure guardrail checks; no filesystem, network, Git, or audit side effects."""

    def check_runtime_ai_action(self, action: str) -> GuardrailResult:
        normalized = action.lower()
        if "runtime ai" in normalized or "runtime llm" in normalized:
            return GuardrailResult(False, "Runtime AI is outside development workflow scope.")
        return GuardrailResult(True, "Action is not a runtime AI request.")

    def check_external_audit(self, authorized: bool) -> GuardrailResult:
        if not authorized:
            return GuardrailResult(False, "External audit requires explicit authorization.")
        return GuardrailResult(True, "External audit authorization is present.")

    def check_commit_push(
        self,
        final_decision: str,
        closeout_state: str,
        user_requested_push: bool,
    ) -> GuardrailResult:
        if final_decision != "Accepted":
            return GuardrailResult(False, "Commit requires accepted final decision.")
        if closeout_state != "ReadyForFinalization":
            return GuardrailResult(False, "Commit requires closeout readiness.")
        if not user_requested_push:
            return GuardrailResult(False, "Push requires explicit user request.")
        return GuardrailResult(True, "Commit and push gates are satisfied.")
