"""Local command contracts for existing work-package lifecycle helpers."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class ToolContract:
    name: str
    command: tuple[str, ...]
    read_only: bool
    requires_authorization: bool = False


class WorkPackageToolContracts:
    """Command specifications only; this prototype does not execute subprocesses."""

    def resolve_wp_status(self, wp: str) -> ToolContract:
        return ToolContract(
            name="resolve_wp_status",
            command=(
                "powershell",
                "-ExecutionPolicy",
                "Bypass",
                "-File",
                "scripts/get-work-package-status.ps1",
                wp,
                "-Json",
            ),
            read_only=True,
        )

    def resolve_validation_plan(self, wp: str) -> ToolContract:
        return ToolContract(
            name="resolve_validation_plan",
            command=(
                "powershell",
                "-ExecutionPolicy",
                "Bypass",
                "-File",
                "scripts/get-work-package-validation-plan.ps1",
                wp,
                "-Json",
            ),
            read_only=True,
        )

    def resolve_closeout_preflight(self, wp: str) -> ToolContract:
        return ToolContract(
            name="resolve_closeout_preflight",
            command=(
                "powershell",
                "-ExecutionPolicy",
                "Bypass",
                "-File",
                "scripts/check-work-package-closeout.ps1",
                wp,
                "-Json",
            ),
            read_only=True,
        )

    def preview_work_package_prompt(self, wp: str) -> ToolContract:
        return ToolContract(
            name="preview_work_package_prompt",
            command=(
                "powershell",
                "-ExecutionPolicy",
                "Bypass",
                "-File",
                "scripts/run-work-package.ps1",
                wp,
                "-Execute",
                "None",
            ),
            read_only=True,
        )

    def create_work_package(self, slug: str) -> ToolContract:
        return ToolContract(
            name="create_work_package",
            command=(
                "powershell",
                "-ExecutionPolicy",
                "Bypass",
                "-File",
                "scripts/new-lite-work-package.ps1",
                slug,
            ),
            read_only=False,
        )

    def prepare_audit_dispatch(self, wp: str, authorized: bool) -> ToolContract:
        return ToolContract(
            name="dispatch_audit",
            command=(
                "powershell",
                "-ExecutionPolicy",
                "Bypass",
                "-File",
                "scripts/audit-work-package.ps1",
                wp,
                "-AllowExternalAudit",
            ),
            read_only=False,
            requires_authorization=not authorized,
        )
