const API_BASE = import.meta.env.VITE_API_BASE || '';

async function fetchJson(path, options) {
  const resp = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options?.headers ?? {}),
    },
  });

  const text = await resp.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!resp.ok) {
    const err = new Error(`HTTP ${resp.status}`);
    err.status = resp.status;
    err.body = data;
    throw err;
  }

  return data;
}

const UNIT_LABELS = {
  'ECO-101': { name: 'EcoStream EV Truck 101', type: 'Ground', isEV: true },
  'ECO-102': { name: 'EcoStream EV Truck 102', type: 'Ground', isEV: true },
  'ECO-103': { name: 'EcoStream EV Van 103', type: 'Ground', isEV: true },
  'ECO-104': { name: 'EcoStream EV Van 104', type: 'Ground', isEV: true },
};

function formatLocation(u) {
  const lat = typeof u.lat === 'number' ? u.lat : null;
  const lon = typeof u.lon === 'number' ? u.lon : null;
  if (lat == null || lon == null) return '—';
  return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
}

function classifyStatus(motorTempC) {
  if (typeof motorTempC !== 'number') return { status: 'Unknown', anomaly: false };
  if (motorTempC >= 90) return { status: 'Critical', anomaly: true };
  if (motorTempC >= 85) return { status: 'Warning', anomaly: true };
  return { status: 'In Transit', anomaly: false };
}

export function normalizeFleetUnits(units) {
  if (!Array.isArray(units)) return [];
  return units
    .map((u) => {
      const unitId = String(u.unit_id ?? u.id ?? '').trim();
      if (!unitId) return null;

      const label = UNIT_LABELS[unitId] ?? { name: `Unit ${unitId}`, type: 'Ground', isEV: true };
      const motorTempC = typeof u.motor_temp_c === 'number' ? u.motor_temp_c : null;
      const socPct = typeof u.soc_pct === 'number' ? u.soc_pct : null;
      const speed = typeof u.speed_kph === 'number' ? u.speed_kph : null;
      const { status, anomaly } = classifyStatus(motorTempC);

      const tempText = motorTempC == null ? '—' : `${motorTempC.toFixed(1)}°C`;
      const socText = socPct == null ? '—' : `${socPct.toFixed(0)}%`;
      const speedText = speed == null ? '—' : `${speed.toFixed(0)} kph`;
      const telemetry = `Temp: ${tempText} • SOC: ${socText} • ${speedText}`;

      return {
        id: unitId,
        name: label.name,
        type: label.type,
        status,
        location: formatLocation(u),
        telemetry,
        anomaly,
        isEV: Boolean(label.isEV),
        raw: u,
      };
    })
    .filter(Boolean);
}

export function normalizeAlerts(alerts) {
  if (!Array.isArray(alerts)) return [];
  return alerts
    .map((a, idx) => {
      const unitId = String(a.unit_id ?? '').trim();
      if (!unitId) return null;
      const createdAt = a.ts || a.window_end || new Date().toISOString();
      const severity = String(a.severity || 'HIGH');
      const summary = String(a.message || a.alert_type || 'Anomaly');
      return {
        id: String(a.id ?? `ALRT-${unitId}-${a._batch ?? idx}`),
        unitId,
        severity,
        title: `${unitId} ${String(a.alert_type || 'ANOMALY')}`,
        summary,
        createdAt,
        raw: a,
      };
    })
    .filter(Boolean)
    .sort((x, y) => String(y.createdAt).localeCompare(String(x.createdAt)));
}

export async function getFleet() {
  return fetchJson('/api/fleet');
}

export async function getAlerts() {
  return fetchJson('/api/alerts');
}

export async function postDiagnose(unitId, question) {
  return fetchJson('/api/diagnose', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ unit_id: unitId, question }),
  });
}
