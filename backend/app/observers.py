from __future__ import annotations

from datetime import datetime
from typing import Any

import pathway as pw

from .state import FleetState


def _jsonable(value: Any) -> Any:
    if isinstance(value, datetime):
        return value.isoformat()
    return value


class TelemetryObserver(pw.io.python.ConnectorObserver):
    def __init__(self, state: FleetState):
        self._state = state

    def on_change(self, key: pw.Pointer, row: dict, time: int, is_addition: bool):
        if not is_addition:
            return

        unit_id = row.get("unit_id")
        if not unit_id:
            return

        payload = {k: _jsonable(v) for k, v in row.items()}
        payload["_batch"] = time
        self._state.upsert_unit(unit_id=str(unit_id), payload=payload)


class AlertObserver(pw.io.python.ConnectorObserver):
    def __init__(self, state: FleetState):
        self._state = state

    def on_change(self, key: pw.Pointer, row: dict, time: int, is_addition: bool):
        if not is_addition:
            return
        payload = {k: _jsonable(v) for k, v in row.items()}
        payload["_batch"] = time
        self._state.append_alert(payload)
