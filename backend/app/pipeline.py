from __future__ import annotations

import pathway as pw

from .connectors import TelemetrySchema, TelemetrySubject
from .license import configure_pathway_license_from_env
from .observers import AlertObserver, TelemetryObserver
from .state import FleetState


def build_and_run_pipeline(state: FleetState) -> None:
    configure_pathway_license_from_env()

    subject = TelemetrySubject()

    telemetry = pw.io.python.read(
        subject,
        schema=TelemetrySchema,
        autocommit_duration_ms=500,
        name="telemetry_in",
    )

    # Windowed feature engineering (sliding window per unit)
    w = telemetry.windowby(
        telemetry.ts,
        window=pw.temporal.sliding(duration=pw.Duration(seconds=60), hop=pw.Duration(seconds=10)),
        instance=telemetry.unit_id,
    ).reduce(
        unit_id=pw.reducers.latest(pw.this.unit_id),
        window_end=pw.this._pw_window_end,
        avg_temp_c=pw.reducers.avg(pw.this.motor_temp_c),
        max_temp_c=pw.reducers.max(pw.this.motor_temp_c),
        avg_speed_kph=pw.reducers.avg(pw.this.speed_kph),
        last_soc_pct=pw.reducers.latest(pw.this.soc_pct),
    )

    alerts = (
        w.select(
            unit_id=pw.this.unit_id,
            ts=pw.this.window_end,
            severity=pw.if_else(pw.this.max_temp_c > 90.0, "HIGH", "MEDIUM"),
            alert_type=pw.if_else(pw.this.max_temp_c > 85.0, "MOTOR_OVERHEAT", "OK"),
            avg_temp_c=pw.this.avg_temp_c,
            max_temp_c=pw.this.max_temp_c,
            last_soc_pct=pw.this.last_soc_pct,
            avg_speed_kph=pw.this.avg_speed_kph,
        )
        .filter(pw.this.alert_type != "OK")
        .select(
            *pw.this,
            message=pw.apply(
                lambda unit_id, max_temp, soc: (
                    f"{unit_id}: motor temp spike (max={max_temp:.1f}°C), SOC={soc:.1f}%"
                ),
                pw.this.unit_id,
                pw.this.max_temp_c,
                pw.this.last_soc_pct,
            ),
        )
    )

    pw.io.python.write(telemetry, TelemetryObserver(state), name="telemetry_out")
    pw.io.python.write(alerts, AlertObserver(state), name="alerts_out")

    pw.run(monitoring_level=pw.MonitoringLevel.NONE)
