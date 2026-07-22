"""Structured contracts for offline work-package orchestration fixtures."""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Literal


UnderstandFreshness = Literal[
    "current",
    "usable_with_drift",
    "structurally_stale",
    "unavailable",
]


@dataclass(frozen=True)
class WorkPackageDraftState:
    kind: Literal["work_package_draft"] = "work_package_draft"
    work_package_path: str = ""
    status: Literal["ready_for_implementation"] = "ready_for_implementation"
    understand_freshness: UnderstandFreshness = "structurally_stale"
    allowed_files: tuple[str, ...] = field(default_factory=tuple)
    do_not_modify: tuple[str, ...] = field(default_factory=tuple)
    planned_validation: tuple[str, ...] = field(default_factory=tuple)
    requires_human_decision: bool = True
    blockers: tuple[str, ...] = field(default_factory=tuple)

    def to_dict(self) -> dict[str, object]:
        return asdict(self)


@dataclass(frozen=True)
class AuditDispatchState:
    kind: Literal["audit_dispatch"] = "audit_dispatch"
    work_package_path: str = ""
    agent: Literal["AntiGravity", "Gemini", "self-audit-fallback"] = "AntiGravity"
    external_data_authorized: bool = False
    audit_invoked: bool = False
    result_section_updated: bool = False
    blockers: tuple[str, ...] = field(default_factory=tuple)

    def to_dict(self) -> dict[str, object]:
        return asdict(self)


@dataclass(frozen=True)
class CorrectivePlanningState:
    kind: Literal["corrective_work_package"] = "corrective_work_package"
    source_work_package_path: str = ""
    corrective_work_package_path: str = ""
    finding_type: Literal["defect", "omission", "scope_violation"] = "defect"
    scope_narrowed: bool = True
    blockers: tuple[str, ...] = field(default_factory=tuple)

    def to_dict(self) -> dict[str, object]:
        return asdict(self)


@dataclass(frozen=True)
class CloseoutReadinessState:
    kind: Literal["closeout_readiness"] = "closeout_readiness"
    work_package_path: str = ""
    closeout_state: Literal[
        "ReadyForAudit",
        "ReadyForAcceptance",
        "ReadyForFinalization",
        "Blocked",
    ] = "Blocked"
    final_decision: Literal["Pending", "Accepted", "Rejected", "Deferred"] = "Pending"
    handoff_refreshed: bool = False
    commit_allowed: bool = False
    blockers: tuple[str, ...] = field(default_factory=tuple)

    def to_dict(self) -> dict[str, object]:
        return asdict(self)
