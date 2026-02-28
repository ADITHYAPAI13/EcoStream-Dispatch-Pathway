import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, FileSearch, ChevronRight, Sparkles } from 'lucide-react';
import { initialFleetData, getAnomalyAlerts } from '../data/fleet.js';
import { postDiagnose } from '../api/ecostream.js';
import { useLiveBackend } from '../hooks/useLiveBackend.js';

function useQuery() {
  const location = useLocation();
  return React.useMemo(() => new URLSearchParams(location.search), [location.search]);
}

export default function AlertsPage() {
  const navigate = useNavigate();
  const query = useQuery();

  const { fleet: liveFleet, alerts: liveAlerts, loading, error } = useLiveBackend({ intervalMs: 1000 });
  const fleet = liveFleet.length ? liveFleet : initialFleetData;
  const alerts = React.useMemo(() => {
    if (liveAlerts.length) return liveAlerts;
    return getAnomalyAlerts(fleet);
  }, [fleet, liveAlerts]);

  const initialUnit = query.get('unit');
  const [selectedUnitId, setSelectedUnitId] = React.useState(() => initialUnit ?? alerts[0]?.unitId ?? null);
  const [diagnostic, setDiagnostic] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    if (!initialUnit) return;
    setSelectedUnitId(initialUnit);
  }, [initialUnit]);

  const selectedVehicle = fleet.find((v) => v.id === selectedUnitId) ?? null;
  const selectedAlert = alerts.find((a) => a.unitId === selectedUnitId) ?? null;

  React.useEffect(() => {
    if (selectedUnitId) return;
    if (alerts.length) setSelectedUnitId(alerts[0].unitId);
  }, [alerts, selectedUnitId]);

  async function runDiagnostic() {
    if (!selectedVehicle) return;
    setBusy(true);
    setDiagnostic('');

    try {
      const question = selectedAlert?.summary
        ? `Diagnose this alert: ${selectedAlert.summary}`
        : `Diagnose this telemetry: ${selectedVehicle.telemetry}`;

      const resp = await postDiagnose(selectedVehicle.id, question);

      const header = [
        `UNIT: ${selectedVehicle.id} (${selectedVehicle.name})`,
        `LOCATION: ${selectedVehicle.location}`,
        `SIGNAL: ${selectedVehicle.telemetry}`,
        `MODE: ${resp?.mode || 'unknown'}`,
        '',
      ];

      const steps = Array.isArray(resp?.steps) ? resp.steps : [];
      const stepsBlock = steps.length
        ? ['RECOMMENDED ACTIONS:', ...steps.map((s) => `- ${s}`), '']
        : [];

      const retrieved = resp?.retrieve?.response;
      const retrievedBlock = retrieved
        ? ['RETRIEVED SNIPPETS (raw):', JSON.stringify(retrieved, null, 2), '']
        : [];

      setDiagnostic([...header, ...stepsBlock, ...retrievedBlock].join('\n'));
    } catch (e) {
      setDiagnostic(
        [
          'Backend diagnose failed.',
          error ? 'Backend not reachable (showing demo alerts).' : '',
          'Tip: start backend (8780) and docstore (8765) for retrieval fallback.',
        ]
          .filter(Boolean)
          .join('\n')
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid grid-cols-12 gap-4">
      <section className="col-span-12 lg:col-span-5 rounded-3xl bg-slate-900/50 ring-1 ring-slate-800 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-800/70 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-50">Alert queue</h2>
            <p className="text-sm text-slate-400">
              {alerts.length} active
              {liveAlerts.length ? (
                <span className="ml-2 text-xs text-emerald-200/90">Live</span>
              ) : (
                <span className="ml-2 text-xs text-slate-400">Mock</span>
              )}
              {loading ? <span className="ml-2 text-xs text-slate-400">Connecting…</span> : null}
            </p>
          </div>
        </div>

        <div className="p-5 space-y-3">
          {alerts.length === 0 ? (
            <div className="text-sm text-slate-400">No active anomalies.</div>
          ) : (
            alerts.map((a) => {
              const active = a.unitId === selectedUnitId;
              return (
                <button
                  key={a.id}
                  className={
                    'w-full text-left rounded-2xl ring-1 p-4 transition-colors ' +
                    (active
                      ? 'ring-rose-500/25 bg-rose-500/10'
                      : 'ring-slate-800 bg-slate-950/30 hover:bg-slate-950/45')
                  }
                  onClick={() => {
                    setSelectedUnitId(a.unitId);
                    navigate(`/alerts?unit=${encodeURIComponent(a.unitId)}`, { replace: true });
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-rose-200 font-semibold">
                        <AlertTriangle size={16} />
                        {a.severity}
                        <span className="text-slate-200">{a.unitId}</span>
                      </div>
                      <div className="mt-1 text-sm text-slate-300">{a.summary}</div>
                    </div>
                    <ChevronRight size={18} className="text-slate-500" />
                  </div>
                </button>
              );
            })
          )}
        </div>
      </section>

      <section className="col-span-12 lg:col-span-7 rounded-3xl bg-slate-900/50 ring-1 ring-slate-800 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-800/70 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-50">Diagnostics</h2>
            <p className="text-sm text-slate-400">Demo workflow</p>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div className="rounded-2xl bg-slate-950/40 ring-1 ring-slate-800 p-4">
            <div className="text-xs text-slate-400">Target</div>
            <div className="mt-1 text-slate-50 font-semibold">
              {selectedVehicle ? (
                <span>
                  {selectedVehicle.name} <span className="text-emerald-200">({selectedVehicle.id})</span>
                </span>
              ) : (
                <span className="text-slate-400 font-medium">Select an alert</span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              disabled={!selectedVehicle || busy}
              className={
                'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ' +
                (!selectedVehicle || busy
                  ? 'bg-slate-800/60 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white')
              }
              onClick={runDiagnostic}
            >
              <FileSearch size={16} /> Run diagnostic
            </button>

            <button
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950/40 hover:bg-slate-950/60 ring-1 ring-slate-800 px-3 py-2 text-sm font-semibold text-slate-200"
              onClick={() => setDiagnostic('')}
            >
              <Sparkles size={16} className="text-slate-400" /> Clear
            </button>
          </div>

          <textarea
            readOnly
            value={diagnostic}
            placeholder="Run a diagnostic to generate a response..."
            className="h-72 w-full resize-none rounded-2xl border border-slate-800 bg-slate-950/30 p-4 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />

          {busy ? <div className="text-sm text-slate-400">Running diagnostic…</div> : null}
        </div>
      </section>
    </div>
  );
}
