"""Optional OpenAI Agents SDK import boundary."""

from __future__ import annotations

import importlib.util
import os
from dataclasses import dataclass


@dataclass(frozen=True)
class SdkAvailability:
    installed: bool
    api_key_present: bool
    offline_mode: bool
    tracing_enabled: bool


def inspect_sdk_availability() -> SdkAvailability:
    """Report SDK readiness without importing or calling the SDK."""

    installed = importlib.util.find_spec("agents") is not None
    api_key_present = bool(os.environ.get("OPENAI_API_KEY"))
    return SdkAvailability(
        installed=installed,
        api_key_present=api_key_present,
        offline_mode=not (installed and api_key_present),
        tracing_enabled=False,
    )
