from __future__ import annotations

from dataclasses import dataclass, field
from threading import RLock
from typing import Any


@dataclass
class FleetState:
    _lock: RLock = field(default_factory=RLock, init=False, repr=False)
    _units: dict[str, dict[str, Any]] = field(default_factory=dict, init=False, repr=False)
    _alerts: list[dict[str, Any]] = field(default_factory=list, init=False, repr=False)
    _max_alerts: int = 250

    def upsert_unit(self, unit_id: str, payload: dict[str, Any]) -> None:
        with self._lock:
            self._units[unit_id] = payload

    def append_alert(self, alert: dict[str, Any]) -> None:
        with self._lock:
            self._alerts.append(alert)
            if len(self._alerts) > self._max_alerts:
                self._alerts = self._alerts[-self._max_alerts :]

    def snapshot(self) -> dict[str, Any]:
        with self._lock:
            return {
                "units": list(self._units.values()),
                "alerts": list(self._alerts),
            }

    def units(self) -> list[dict[str, Any]]:
        with self._lock:
            return list(self._units.values())

    def alerts(self) -> list[dict[str, Any]]:
        with self._lock:
            return list(self._alerts)
