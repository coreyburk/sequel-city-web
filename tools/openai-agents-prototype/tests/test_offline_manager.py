import sys
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
sys.path.insert(0, str(SRC))

from sequel_agents_prototype import (  # noqa: E402
    AuditDispatchState,
    CloseoutReadinessState,
    CorrectivePlanningState,
    OfflineWorkPackageManager,
    WorkPackageDraftState,
)
from sequel_agents_prototype.guardrails import WorkflowGuardrails  # noqa: E402
from sequel_agents_prototype.sdk_boundary import inspect_sdk_availability  # noqa: E402
from sequel_agents_prototype.tools import WorkPackageToolContracts  # noqa: E402


class OfflineManagerTests(unittest.TestCase):
    def setUp(self) -> None:
        self.manager = OfflineWorkPackageManager()

    def test_idea_intake_to_wp_draft(self) -> None:
        result = self.manager.route("idea_intake", slug="docs only fixture")

        self.assertIsInstance(result, WorkPackageDraftState)
        self.assertEqual(result.kind, "work_package_draft")
        self.assertEqual(result.status, "ready_for_implementation")
        self.assertTrue(result.requires_human_decision)
        self.assertIn("database/**", result.do_not_modify)

    def test_implemented_wp_to_audit_request_blocks_without_authorization(self) -> None:
        result = self.manager.route(
            "implemented_wp_audit_request",
            work_package_path="docs/01-work-packages/WP-999-fixture.md",
            external_data_authorized=False,
        )

        self.assertIsInstance(result, AuditDispatchState)
        self.assertFalse(result.external_data_authorized)
        self.assertFalse(result.audit_invoked)
        self.assertIn("External audit requires explicit authorization.", result.blockers)

    def test_implemented_wp_to_audit_request_prepares_when_authorized(self) -> None:
        result = self.manager.route(
            "implemented_wp_audit_request",
            work_package_path="docs/01-work-packages/WP-999-fixture.md",
            external_data_authorized=True,
        )

        self.assertIsInstance(result, AuditDispatchState)
        self.assertTrue(result.external_data_authorized)
        self.assertFalse(result.audit_invoked)
        self.assertIn("Prototype prepares audit dispatch only; it does not invoke AGY.", result.blockers)

    def test_failed_audit_to_corrective_wp(self) -> None:
        result = self.manager.route(
            "failed_audit_corrective_wp",
            source_work_package_path="docs/01-work-packages/WP-010-source.md",
            corrective_work_package_path="docs/01-work-packages/WP-011-corrective.md",
            finding_type="omission",
        )

        self.assertIsInstance(result, CorrectivePlanningState)
        self.assertEqual(result.finding_type, "omission")
        self.assertTrue(result.scope_narrowed)
        self.assertEqual(result.blockers, ())

    def test_accepted_wp_closeout_requires_handoff_refresh(self) -> None:
        result = self.manager.route(
            "accepted_wp_closeout",
            work_package_path="docs/01-work-packages/WP-999-fixture.md",
            final_decision="Accepted",
            closeout_state="ReadyForFinalization",
            handoff_refreshed=False,
            user_requested_push=True,
        )

        self.assertIsInstance(result, CloseoutReadinessState)
        self.assertFalse(result.commit_allowed)
        self.assertIn("Handoff must be refreshed before commit.", result.blockers)

    def test_accepted_wp_closeout_can_allow_commit_after_all_gates(self) -> None:
        result = self.manager.route(
            "accepted_wp_closeout",
            work_package_path="docs/01-work-packages/WP-999-fixture.md",
            final_decision="Accepted",
            closeout_state="ReadyForFinalization",
            handoff_refreshed=True,
            user_requested_push=True,
        )

        self.assertIsInstance(result, CloseoutReadinessState)
        self.assertTrue(result.commit_allowed)
        self.assertEqual(result.blockers, ())

    def test_runtime_ai_intent_is_blocked(self) -> None:
        result = self.manager.route("add runtime AI tutor")

        self.assertIsInstance(result, CloseoutReadinessState)
        self.assertIn("Runtime AI is outside development workflow scope.", result.blockers)

    def test_sdk_availability_defaults_to_offline_without_requirements(self) -> None:
        availability = inspect_sdk_availability()

        self.assertFalse(availability.tracing_enabled)
        if not availability.installed or not availability.api_key_present:
            self.assertTrue(availability.offline_mode)

    def test_tool_contracts_do_not_execute_commands(self) -> None:
        tools = WorkPackageToolContracts()

        status = tools.resolve_wp_status("WP-184")
        audit = tools.prepare_audit_dispatch("WP-184", authorized=False)

        self.assertTrue(status.read_only)
        self.assertIn("scripts/get-work-package-status.ps1", status.command)
        self.assertTrue(audit.requires_authorization)
        self.assertIn("scripts/audit-work-package.ps1", audit.command)


class GuardrailTests(unittest.TestCase):
    def test_commit_push_guard_requires_all_gates(self) -> None:
        guardrails = WorkflowGuardrails()

        missing_acceptance = guardrails.check_commit_push(
            final_decision="Pending",
            closeout_state="ReadyForFinalization",
            user_requested_push=True,
        )
        missing_push = guardrails.check_commit_push(
            final_decision="Accepted",
            closeout_state="ReadyForFinalization",
            user_requested_push=False,
        )

        self.assertFalse(missing_acceptance.allowed)
        self.assertFalse(missing_push.allowed)


if __name__ == "__main__":
    unittest.main()
