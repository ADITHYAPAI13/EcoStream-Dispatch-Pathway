from __future__ import annotations

import random
import time
from dataclasses import dataclass
from datetime import datetime, timezone

import pathway as pw


class TelemetrySchema(pw.Schema):
    ts: pw.DateTimeUtc
    unit_id: str
    speed_kph: float
    motor_temp_c: float
    battery_v: float
    soc_pct: float
    lat: float
    lon: float


@dataclass(frozen=True)
class TelemetrySimConfig:
    unit_ids: tuple[str, ...] = ("ECO-101", "ECO-102", "ECO-103", "ECO-104")
    interval_s: float = 0.6


class TelemetrySubject(pw.io.python.ConnectorSubject):
    deletions_enabled = False

    def __init__(self, cfg: TelemetrySimConfig | None = None):
        super().__init__(datasource_name="telemetry")
        self._cfg = cfg or TelemetrySimConfig()
        self._soc: dict[str, float] = {uid: random.uniform(35, 95) for uid in self._cfg.unit_ids}
        self._base_temp: dict[str, float] = {uid: random.uniform(55, 72) for uid in self._cfg.unit_ids}

    def run(self) -> None:
        # Pathway starts this in a separate thread.
        while True:
            for unit_id in self._cfg.unit_ids:
                now = datetime.now(timezone.utc)

                # Simulated dynamics
                speed = max(0.0, random.gauss(42, 12))
                self._soc[unit_id] = max(0.0, self._soc[unit_id] - random.uniform(0.02, 0.35))

                temp = self._base_temp[unit_id] + random.gauss(0, 2.2)
                # Occasionally spike one unit to trigger alerts.
                if random.random() < 0.03:
                    temp += random.uniform(18, 35)

                battery_v = 360 + (self._soc[unit_id] / 100.0) * 70 + random.gauss(0, 1.8)

                # Fake location jitter (Coimbatore-ish)
                lat = 11.0168 + random.gauss(0, 0.002)
                lon = 76.9558 + random.gauss(0, 0.002)

                self.next(
                    ts=now,
                    unit_id=unit_id,
                    speed_kph=float(speed),
                    motor_temp_c=float(temp),
                    battery_v=float(battery_v),
                    soc_pct=float(self._soc[unit_id]),
                    lat=float(lat),
                    lon=float(lon),
                )

            time.sleep(self._cfg.interval_s)
