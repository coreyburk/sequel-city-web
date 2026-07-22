import importlib.util
import json
import os
import subprocess
import sys
import unittest
from pathlib import Path
from unittest import mock


ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
sys.path.insert(0, str(SRC))

from sequel_agents_prototype import live_smoke  # noqa: E402


def run_live_smoke_without_opt_in() -> subprocess.CompletedProcess[str]:
    env = os.environ.copy()
    env["PYTHONPATH"] = str(SRC)
    env.pop(live_smoke.LIVE_OPT_IN_ENV, None)
    env.pop("OPENAI_API_KEY", None)
    env.pop(live_smoke.TRACING_DISABLED_ENV, None)
    return subprocess.run(
        [sys.executable, "-m", "sequel_agents_prototype.live_smoke"],
        cwd=ROOT.parents[1],
        env=env,
        text=True,
        capture_output=True,
        check=False,
    )


class LiveSmokeTests(unittest.TestCase):
    def test_sanitized_fixture_contains_no_forbidden_markers(self) -> None:
        prompt = live_smoke.get_sanitized_fixture_prompt()

        self.assertEqual(live_smoke.get_forbidden_markers_present(prompt), ())
        self.assertNotIn("docs/01-work-packages/", prompt)
        self.assertNotIn("apps/", prompt)
        self.assertNotIn("database/", prompt)
        self.assertNotIn("BEGIN PRIVATE KEY", prompt)
        self.assertNotIn("OPENAI_API_KEY", prompt)
        self.assertNotIn("END-OF-DAY-HANDOFF", prompt)
        self.assertNotIn("Audit Results", prompt)
        self.assertNotIn("Case 004", prompt)

    def test_missing_live_opt_in_returns_skipped_json(self) -> None:
        with mock.patch.dict(
            os.environ,
            {
                "OPENAI_API_KEY": "test-key-never-used",
            },
            clear=False,
        ):
            os.environ.pop(live_smoke.LIVE_OPT_IN_ENV, None)
            with mock.patch.object(importlib.util, "find_spec", return_value=object()):
                result = live_smoke.run_smoke_test()

        self.assertEqual(result["status"], "skipped")
        self.assertFalse(result["live_execution_attempted"])
        self.assertTrue(result["sdk_available"])
        self.assertTrue(result["api_key_present"])
        self.assertFalse(result["live_opt_in"])
        self.assertIn(live_smoke.LIVE_OPT_IN_ENV, result["skip_reason"])

    def test_missing_sdk_returns_skipped_json(self) -> None:
        with mock.patch.dict(
            os.environ,
            {
                "OPENAI_API_KEY": "test-key-never-used",
                live_smoke.LIVE_OPT_IN_ENV: "1",
            },
            clear=False,
        ):
            with mock.patch.object(importlib.util, "find_spec", return_value=None):
                result = live_smoke.run_smoke_test()

        self.assertEqual(result["status"], "skipped")
        self.assertFalse(result["live_execution_attempted"])
        self.assertFalse(result["sdk_available"])
        self.assertIn("openai-agents SDK is not installed", result["skip_reason"])

    def test_missing_api_key_returns_skipped_json(self) -> None:
        with mock.patch.dict(
            os.environ,
            {
                live_smoke.LIVE_OPT_IN_ENV: "1",
            },
            clear=False,
        ):
            os.environ.pop("OPENAI_API_KEY", None)
            with mock.patch.object(importlib.util, "find_spec", return_value=object()):
                result = live_smoke.run_smoke_test()

        self.assertEqual(result["status"], "skipped")
        self.assertFalse(result["live_execution_attempted"])
        self.assertFalse(result["api_key_present"])
        self.assertIn("OPENAI_API_KEY is not present", result["skip_reason"])

    def test_disable_tracing_sets_environment_before_live_boundary(self) -> None:
        with mock.patch.dict(os.environ, {}, clear=False):
            os.environ.pop(live_smoke.TRACING_DISABLED_ENV, None)

            disabled = live_smoke.disable_tracing_before_live_boundary()

            self.assertTrue(disabled)
            self.assertEqual(os.environ[live_smoke.TRACING_DISABLED_ENV], "1")

    def test_output_schema_is_stable_for_skip(self) -> None:
        with mock.patch.dict(os.environ, {}, clear=True):
            with mock.patch.object(importlib.util, "find_spec", return_value=None):
                result = live_smoke.run_smoke_test()

        self.assertEqual(
            set(result),
            {
                "status",
                "live_execution_attempted",
                "tracing_disabled",
                "sdk_available",
                "api_key_present",
                "live_opt_in",
                "fixture_name",
                "forbidden_markers_present",
                "result_summary",
                "skip_reason",
                "error_type",
            },
        )

    def test_module_execution_skips_without_opt_in_or_key(self) -> None:
        result = run_live_smoke_without_opt_in()

        payload = json.loads(result.stdout)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(payload["status"], "skipped")
        self.assertFalse(payload["live_execution_attempted"])
        self.assertFalse(payload["api_key_present"])
        self.assertFalse(payload["live_opt_in"])
        self.assertEqual(payload["forbidden_markers_present"], [])


if __name__ == "__main__":
    unittest.main()
