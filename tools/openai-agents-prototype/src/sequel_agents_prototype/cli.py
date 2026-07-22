"""Command-line runner for offline agentic workflow fixtures."""

from __future__ import annotations

import argparse
import json
import sys
from typing import Any

from .manager import OfflineWorkPackageManager


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="sequel_agents_prototype",
        description="Run development-only offline work-package workflow fixtures.",
        epilog=(
            "Available fixtures: idea-intake, audit-request, "
            "corrective-planning, closeout."
        ),
    )
    parser.add_argument(
        "--pretty",
        action="store_true",
        help="emit indented JSON output",
    )

    commands = parser.add_subparsers(dest="command", required=True)
    fixture_command = commands.add_parser(
        "run-fixture",
        help="run one deterministic fixture scenario",
    )
    fixtures = fixture_command.add_subparsers(dest="fixture", required=True)

    idea = fixtures.add_parser(
        "idea-intake",
        help="route a short idea into a work-package draft state",
    )
    idea.add_argument("--slug", default="prototype-fixture")

    audit = fixtures.add_parser(
        "audit-request",
        help="prepare an audit dispatch state without invoking an auditor",
    )
    audit.add_argument("--work-package", required=True)
    audit.add_argument("--external-data-authorized", action="store_true")

    corrective = fixtures.add_parser(
        "corrective-planning",
        help="route a failed audit finding into a corrective planning state",
    )
    corrective.add_argument("--source-work-package", required=True)
    corrective.add_argument("--corrective-work-package", required=True)
    corrective.add_argument(
        "--finding-type",
        choices=("defect", "omission", "scope_violation"),
        default="defect",
    )

    closeout = fixtures.add_parser(
        "closeout",
        help="prepare closeout readiness without committing or pushing",
    )
    closeout.add_argument("--work-package", required=True)
    closeout.add_argument(
        "--final-decision",
        choices=("Pending", "Accepted", "Rejected", "Deferred"),
        default="Pending",
    )
    closeout.add_argument(
        "--closeout-state",
        choices=(
            "ReadyForAudit",
            "ReadyForAcceptance",
            "ReadyForFinalization",
            "Blocked",
        ),
        default="Blocked",
    )
    closeout.add_argument("--handoff-refreshed", action="store_true")
    closeout.add_argument("--user-requested-push", action="store_true")

    return parser


def run_fixture(args: argparse.Namespace) -> dict[str, Any]:
    manager = OfflineWorkPackageManager()

    if args.fixture == "idea-intake":
        return manager.route("idea_intake", slug=args.slug).to_dict()

    if args.fixture == "audit-request":
        return manager.route(
            "implemented_wp_audit_request",
            work_package_path=args.work_package,
            external_data_authorized=args.external_data_authorized,
        ).to_dict()

    if args.fixture == "corrective-planning":
        return manager.route(
            "failed_audit_corrective_wp",
            source_work_package_path=args.source_work_package,
            corrective_work_package_path=args.corrective_work_package,
            finding_type=args.finding_type,
        ).to_dict()

    if args.fixture == "closeout":
        return manager.route(
            "accepted_wp_closeout",
            work_package_path=args.work_package,
            final_decision=args.final_decision,
            closeout_state=args.closeout_state,
            handoff_refreshed=args.handoff_refreshed,
            user_requested_push=args.user_requested_push,
        ).to_dict()

    raise ValueError(f"Unsupported fixture: {args.fixture}")


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)

    if args.command == "run-fixture":
        result = run_fixture(args)
        json.dump(
            result,
            sys.stdout,
            indent=2 if args.pretty else None,
            sort_keys=True,
        )
        sys.stdout.write("\n")
        return 0

    parser.error(f"Unsupported command: {args.command}")
    return 2
