"""Offline manager that routes fixture intents without a live LLM call."""

from __future__ import annotations

from .contracts import (
    AuditDispatchState,
    CloseoutReadinessState,
    CorrectivePlanningState,
    WorkPackageDraftState,
)
from .guardrails import WorkflowGuardrails


class OfflineWorkPackageManager:
    """Deterministic prototype for future SDK orchestration behavior."""

    def __init__(self, guardrails: WorkflowGuardrails | None = None) -> None:
        self.guardrails = guardrails or WorkflowGuardrails()

    def route(self, intent: str, **kwargs: object):
        normalized = intent.lower().strip()
        if normalized == "idea_intake":
            return self.create_work_package_draft(
                slug=str(kwargs.get("slug", "prototype-fixture")),
            )
        if normalized == "implemented_wp_audit_request":
            return self.prepare_audit_dispatch(
                work_package_path=str(kwargs.get("work_package_path", "")),
                external_data_authorized=bool(
                    kwargs.get("external_data_authorized", False)
                ),
            )
        if normalized == "failed_audit_corrective_wp":
            return self.plan_corrective_work_package(
                source_work_package_path=str(kwargs.get("source_work_package_path", "")),
                corrective_work_package_path=str(
                    kwargs.get("corrective_work_package_path", "")
                ),
                finding_type=str(kwargs.get("finding_type", "defect")),
            )
        if normalized == "accepted_wp_closeout":
            return self.prepare_closeout(
                work_package_path=str(kwargs.get("work_package_path", "")),
                final_decision=str(kwargs.get("final_decision", "Pending")),
                closeout_state=str(kwargs.get("closeout_state", "Blocked")),
                handoff_refreshed=bool(kwargs.get("handoff_refreshed", False)),
                user_requested_push=bool(kwargs.get("user_requested_push", False)),
            )
        if not self.guardrails.check_runtime_ai_action(normalized).allowed:
            return CloseoutReadinessState(
                blockers=("Runtime AI is outside development workflow scope.",)
            )
        return CloseoutReadinessState(blockers=(f"Unknown intent: {intent}",))

    def create_work_package_draft(self, slug: str) -> WorkPackageDraftState:
        safe_slug = slug.replace(" ", "-").lower()
        return WorkPackageDraftState(
            work_package_path=f"docs/01-work-packages/WP-###-{safe_slug}.md",
            allowed_files=("docs/01-work-packages/WP-###-*.md",),
            do_not_modify=("apps/**", "database/**"),
            planned_validation=(
                "scripts/get-work-package-status.ps1 WP-###",
                "scripts/get-work-package-validation-plan.ps1 WP-###",
            ),
        )

    def prepare_audit_dispatch(
        self,
        work_package_path: str,
        external_data_authorized: bool,
    ) -> AuditDispatchState:
        authorization = self.guardrails.check_external_audit(external_data_authorized)
        if not authorization.allowed:
            return AuditDispatchState(
                work_package_path=work_package_path,
                external_data_authorized=False,
                audit_invoked=False,
                blockers=(authorization.reason,),
            )
        return AuditDispatchState(
            work_package_path=work_package_path,
            external_data_authorized=True,
            audit_invoked=False,
            blockers=("Prototype prepares audit dispatch only; it does not invoke AGY.",),
        )

    def plan_corrective_work_package(
        self,
        source_work_package_path: str,
        corrective_work_package_path: str,
        finding_type: str,
    ) -> CorrectivePlanningState:
        allowed_finding_types = {"defect", "omission", "scope_violation"}
        if finding_type not in allowed_finding_types:
            return CorrectivePlanningState(
                source_work_package_path=source_work_package_path,
                corrective_work_package_path=corrective_work_package_path,
                blockers=("Corrective finding must be defect, omission, or scope_violation.",),
            )
        return CorrectivePlanningState(
            source_work_package_path=source_work_package_path,
            corrective_work_package_path=corrective_work_package_path,
            finding_type=finding_type,  # type: ignore[arg-type]
            scope_narrowed=True,
        )

    def prepare_closeout(
        self,
        work_package_path: str,
        final_decision: str,
        closeout_state: str,
        handoff_refreshed: bool,
        user_requested_push: bool,
    ) -> CloseoutReadinessState:
        gate = self.guardrails.check_commit_push(
            final_decision=final_decision,
            closeout_state=closeout_state,
            user_requested_push=user_requested_push,
        )
        if not gate.allowed:
            return CloseoutReadinessState(
                work_package_path=work_package_path,
                closeout_state=closeout_state,  # type: ignore[arg-type]
                final_decision=final_decision,  # type: ignore[arg-type]
                handoff_refreshed=handoff_refreshed,
                commit_allowed=False,
                blockers=(gate.reason,),
            )
        if not handoff_refreshed:
            return CloseoutReadinessState(
                work_package_path=work_package_path,
                closeout_state="ReadyForFinalization",
                final_decision="Accepted",
                handoff_refreshed=False,
                commit_allowed=False,
                blockers=("Handoff must be refreshed before commit.",),
            )
        return CloseoutReadinessState(
            work_package_path=work_package_path,
            closeout_state="ReadyForFinalization",
            final_decision="Accepted",
            handoff_refreshed=True,
            commit_allowed=True,
        )
