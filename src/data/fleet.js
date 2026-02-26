export const initialFleetData = [
  {
    id: 'FLT-001',
    name: 'Volvo FH16 Semi-Truck',
    type: 'Ground',
    status: 'In Transit',
    location: 'NH-44 (Bengaluru > Hyd)',
    telemetry: '92°C (Optimal)',
    anomaly: false,
  },
  {
    id: 'FLT-002',
    name: 'Tata Prima 5530.S',
    type: 'Ground',
    status: 'Critical',
    location: 'Western Exp Hwy, Mumbai',
    telemetry: '115°C (High)',
    anomaly: true,
  },
  {
    id: 'FLT-003',
    name: 'Mahindra Treo Zor (EV)',
    type: 'Ground',
    status: 'Charging',
    location: 'Chennai Urban Depot',
    telemetry: 'Bat: 35°C',
    anomaly: false,
    isEV: true,
  },
  {
    id: 'FLT-004',
    name: 'Boeing 777F Freighter',
    type: 'Air',
    status: 'In Transit',
    location: 'DEL > DXB Sector',
    telemetry: 'Nominal',
    anomaly: false,
  },
];

export function getAnomalyAlerts(fleetData) {
  return fleetData
    .filter((v) => v.anomaly)
    .map((v) => ({
      id: `ALRT-${v.id}`,
      unitId: v.id,
      severity: 'Critical',
      title: `${v.id} thermal threshold exceeded`,
      summary: `${v.name} reporting abnormal telemetry at ${v.location}.`,
      createdAt: new Date().toISOString(),
    }));
}
