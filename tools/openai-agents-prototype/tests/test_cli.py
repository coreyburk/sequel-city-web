import json
import os
import subprocess
import sys
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"


def run_cli(*args: str) -> subprocess.CompletedProcess[str]:
    env = os.environ.copy()
    env["PYTHONPATH"] = str(SRC)
    env.pop("OPENAI_API_KEY", None)
    return subprocess.run(
        [sys.executable, "-m", "sequel_agents_prototype", *args],
        cwd=ROOT.parents[1],
        env=env,
        text=True,
        capture_output=True,
        check=False,
    )


class CliTests(unittest.TestCase):
    def test_help_lists_fixture_command(self) -> None:
        result = run_cli("--help")

        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("run-fixture", result.stdout)
        self.assertIn("offline", result.stdout)
        self.assertIn("idea-intake", result.stdout)
        self.assertIn("audit-request", result.stdout)
        self.assertIn("corrective-planning", result.stdout)
        self.assertIn("closeout", result.stdout)

    def test_idea_intake_outputs_json(self) -> None:
        result = run_cli(
            "run-fixture",
            "idea-intake",
            "--slug",
            "docs only fixture",
        )

        payload = json.loads(result.stdout)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(payload["kind"], "work_package_draft")
        self.assertEqual(
            payload["work_package_path"],
            "docs/01-work-packages/WP-###-docs-only-fixture.md",
        )
        self.assertIn("blockers", payload)

    def test_audit_request_blocks_without_authorization(self) -> None:
        result = run_cli(
            "run-fixture",
            "audit-request",
            "--work-package",
            "docs/01-work-packages/WP-185-fixture.md",
        )

        payload = json.loads(result.stdout)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(payload["kind"], "audit_dispatch")
        self.assertFalse(payload["external_data_authorized"])
        self.assertFalse(payload["audit_invoked"])
        self.assertIn("External audit requires explicit authorization.", payload["blockers"])

    def test_audit_request_with_authorization_still_does_not_invoke_audit(self) -> None:
        result = run_cli(
            "run-fixture",
            "audit-request",
            "--work-package",
            "docs/01-work-packages/WP-185-fixture.md",
            "--external-data-authorized",
        )

        payload = json.loads(result.stdout)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertTrue(payload["external_data_authorized"])
        self.assertFalse(payload["audit_invoked"])
        self.assertIn("does not invoke AGY", payload["blockers"][0])

    def test_corrective_planning_outputs_json(self) -> None:
        result = run_cli(
            "run-fixture",
            "corrective-planning",
            "--source-work-package",
            "docs/01-work-packages/WP-184-source.md",
            "--corrective-work-package",
            "docs/01-work-packages/WP-185-corrective.md",
            "--finding-type",
            "omission",
        )

        payload = json.loads(result.stdout)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(payload["kind"], "corrective_work_package")
        self.assertEqual(payload["finding_type"], "omission")
        self.assertTrue(payload["scope_narrowed"])

    def test_closeout_preserves_commit_push_guardrails(self) -> None:
        result = run_cli(
            "run-fixture",
            "closeout",
            "--work-package",
            "docs/01-work-packages/WP-185-fixture.md",
            "--final-decision",
            "Accepted",
            "--closeout-state",
            "ReadyForFinalization",
            "--user-requested-push",
        )

        payload = json.loads(result.stdout)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(payload["kind"], "closeout_readiness")
        self.assertFalse(payload["commit_allowed"])
        self.assertIn("Handoff must be refreshed before commit.", payload["blockers"])

    def test_closeout_allows_commit_after_all_gates(self) -> None:
        result = run_cli(
            "run-fixture",
            "closeout",
            "--work-package",
            "docs/01-work-packages/WP-185-fixture.md",
            "--final-decision",
            "Accepted",
            "--closeout-state",
            "ReadyForFinalization",
            "--handoff-refreshed",
            "--user-requested-push",
        )

        payload = json.loads(result.stdout)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertTrue(payload["commit_allowed"])
        self.assertEqual(payload["blockers"], [])

    def test_pretty_outputs_indented_json(self) -> None:
        result = run_cli(
            "--pretty",
            "run-fixture",
            "idea-intake",
            "--slug",
            "pretty fixture",
        )

        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn('\n  "blockers":', result.stdout)
        json.loads(result.stdout)

    def test_invalid_fixture_returns_nonzero(self) -> None:
        result = run_cli("run-fixture", "not-a-fixture")

        self.assertNotEqual(result.returncode, 0)
        self.assertIn("invalid choice", result.stderr)


if __name__ == "__main__":
    unittest.main()
