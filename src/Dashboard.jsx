import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  ChevronRight,
  MapPin,
  Plane,
  Terminal,
  Thermometer,
  Truck,
  X,
  Zap,
} from 'lucide-react';

import { initialFleetData } from './data/fleet.js';

function typeIcon(type) {
  return type === 'Air' ? Plane : Truck;
}

const Dashboard = () => {
  const navigate = useNavigate();

  const [fleetData] = React.useState(() => initialFleetData);
  const [selectedId, setSelectedId] = React.useState(null);
  const selected = fleetData.find((v) => v.id === selectedId) ?? null;

  const alertCount = React.useMemo(() => fleetData.filter((v) => v.anomaly).length, [fleetData]);

  const [messages, setMessages] = React.useState(() => [
    {
      role: 'system',
      text: 'Monitoring 4 active streams via Pathway Engine. 320 EPS.',
      tone: 'system',
    },
    {
      role: 'alert',
      text: 'FLT-002 engine coolant temperature exceeding operating limits. High probability of thermal failure.',
      tone: 'alert',
    },
    {
      role: 'recommendation',
      text:
        'Reduce engine load immediately. Do not halt completely to maintain airflow. Reroute to Tata Motors Authorized Heavy Commercial Service, Thane (4.2km away).',
      tone: 'recommendation',
      source: 'Pathway Doc Store (tata_prima_service_manual_v3.pdf - Section 3.1)',
    },
  ]);
  const [query, setQuery] = React.useState('');

  function pushUserQuery() {
    const trimmed = query.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: trimmed, tone: 'user' },
      {
        role: 'system',
        text: `ACK: queued doc search for "${trimmed}" (demo).`,
        tone: 'system',
      },
    ]);
    setQuery('');
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-50">Dashboard</h2>
          <p className="text-sm text-slate-300">Fleet telemetry + anomaly awareness</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-slate-900/40 ring-1 ring-slate-800 px-3 py-1.5 text-sm text-slate-200">
            <span className="font-semibold">{fleetData.length}</span> units
          </div>
          <div
            className={
              'rounded-full ring-1 px-3 py-1.5 text-sm font-semibold ' +
              (alertCount
                ? 'bg-rose-500/10 text-rose-200 ring-rose-500/20'
                : 'bg-emerald-500/10 text-emerald-200 ring-emerald-500/20')
            }
          >
            {alertCount ? `${alertCount} alerts` : 'No active alerts'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Fleet */}
        <section className="col-span-12 lg:col-span-4 rounded-3xl bg-slate-900/50 ring-1 ring-slate-800 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800/70 px-5 py-4">
            <div className="flex items-center gap-2 text-slate-50 font-semibold">
              <Activity size={18} className="text-slate-300" /> Fleet telemetry
            </div>
            <button
              className="text-sm font-semibold text-emerald-200 hover:text-emerald-100"
              onClick={() => navigate('/fleet')}
            >
              Open fleet
            </button>
          </div>

          <div className="p-5 space-y-3">
            {fleetData.map((vehicle) => {
              const Icon = typeIcon(vehicle.type);
              const active = vehicle.id === selectedId;

              return (
                <button
                  key={vehicle.id}
                  className={
                    'w-full text-left rounded-2xl ring-1 p-4 transition-colors ' +
                    (active
                      ? 'ring-emerald-500/25 bg-emerald-500/10'
                      : vehicle.anomaly
                        ? 'ring-rose-500/25 bg-rose-500/10 hover:bg-rose-500/15'
                        : 'ring-slate-800 bg-slate-950/30 hover:bg-slate-950/45')
                  }
                  onClick={() => setSelectedId(vehicle.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-slate-950 text-white ring-1 ring-slate-800">
                          {vehicle.id}
                        </span>
                        <span
                          className={
                            'text-xs font-semibold px-2 py-1 rounded-full ring-1 ' +
                            (vehicle.anomaly
                              ? 'bg-rose-500/10 text-rose-200 ring-rose-500/20'
                              : 'bg-emerald-500/10 text-emerald-200 ring-emerald-500/20')
                          }
                        >
                          {vehicle.status}
                        </span>
                        {vehicle.isEV ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-amber-500/10 text-amber-200 ring-1 ring-amber-500/20">
                            <Zap size={14} /> EV
                          </span>
                        ) : null}
                        {vehicle.anomaly ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-rose-600 text-white">
                            <AlertTriangle size={14} /> Alert
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-2 font-semibold text-slate-50 truncate">{vehicle.name}</div>
                      <div className="mt-1 text-sm text-slate-300 inline-flex items-center gap-1">
                        <MapPin size={16} className="text-slate-400" />
                        {vehicle.location}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="h-10 w-10 rounded-2xl bg-slate-950 text-white ring-1 ring-slate-800 grid place-items-center">
                        <Icon size={18} />
                      </div>
                      <div className="text-sm text-slate-200 inline-flex items-center gap-1">
                        <Thermometer size={16} className={vehicle.anomaly ? 'text-rose-400' : 'text-emerald-400'} />
                        <span className={vehicle.anomaly ? 'font-semibold text-rose-200' : 'font-medium text-slate-200'}>
                          {vehicle.telemetry}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Map */}
        <section className="col-span-12 lg:col-span-5 rounded-3xl bg-slate-900/50 ring-1 ring-slate-800 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800/70 px-5 py-4">
            <div>
              <div className="font-semibold text-slate-50">Map</div>
              <div className="text-sm text-slate-400">Geospatial placeholder</div>
            </div>
          </div>

          <div className="relative p-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(16,185,129,0.18),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(56,189,248,0.14),transparent_55%),radial-gradient(circle_at_60%_110%,rgba(99,102,241,0.12),transparent_60%)]" />
            <div className="relative rounded-2xl overflow-hidden ring-1 ring-slate-800 bg-slate-950/30">
              <div className="h-72 bg-[linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(0deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:28px_28px]" />
              <div className="absolute inset-0 grid place-items-center text-sm text-slate-400">Live map coming soon</div>

              <div className="absolute left-10 top-12 h-3 w-3 rounded-full bg-emerald-600 shadow-[0_0_0_6px_rgba(16,185,129,0.18)]" />
              <div className="absolute left-10 top-12 w-44 h-[2px] bg-gradient-to-r from-emerald-600/70 to-transparent rotate-12 origin-left" />
            </div>

            {alertCount ? (
              <div className="relative mt-4 rounded-2xl bg-rose-500/10 ring-1 ring-rose-500/20 p-4">
                <div className="flex items-center gap-2 font-semibold text-rose-200">
                  <AlertTriangle size={18} /> Critical anomaly detected
                </div>
                <p className="mt-1 text-sm text-rose-100/90">
                  Unit FLT-002 exceeds thermal threshold. Start the diagnostic workflow to generate recommended actions.
                </p>
                <button
                  className="mt-3 w-full rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2"
                  onClick={() => navigate('/alerts?unit=FLT-002')}
                >
                  Open diagnostics
                </button>
              </div>
            ) : null}
          </div>
        </section>

        {/* Diagnostics */}
        <section className="col-span-12 lg:col-span-3 rounded-3xl bg-slate-900/50 ring-1 ring-slate-800 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-800/70 flex items-center gap-2">
            <Terminal size={18} className="text-slate-300" />
            <div>
              <div className="font-semibold text-slate-50">LLM diagnostics</div>
              <div className="text-sm text-slate-400">RAG console (demo)</div>
            </div>
          </div>

          <div className="flex-1 p-5 space-y-3 overflow-y-auto">
            {messages.map((m, idx) => {
              if (m.tone === 'recommendation') {
                return (
                  <div key={idx} className="rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/20 p-4">
                    <div className="text-xs font-semibold text-emerald-200">Recommendation</div>
                    <div className="mt-1 text-sm text-emerald-50 leading-relaxed">{m.text}</div>
                    {m.source ? (
                      <div className="mt-2 text-xs text-emerald-100/70 italic">Source: {m.source}</div>
                    ) : null}
                  </div>
                );
              }

              if (m.tone === 'alert') {
                return (
                  <div key={idx} className="rounded-2xl bg-rose-500/10 ring-1 ring-rose-500/20 p-4">
                    <div className="text-xs font-semibold text-rose-200">Alert</div>
                    <div className="mt-1 text-sm text-rose-50">{m.text}</div>
                  </div>
                );
              }

              if (m.tone === 'user') {
                return (
                  <div key={idx} className="rounded-2xl bg-slate-950/40 ring-1 ring-slate-800 p-4">
                    <div className="text-xs font-semibold text-slate-400">You</div>
                    <div className="mt-1 text-sm text-slate-100">{m.text}</div>
                  </div>
                );
              }

              return (
                <div key={idx} className="rounded-2xl bg-slate-950/25 ring-1 ring-slate-800 p-4">
                  <div className="text-xs font-semibold text-slate-400">System</div>
                  <div className="mt-1 text-sm text-slate-200">{m.text}</div>
                </div>
              );
            })}
          </div>

          <div className="p-4 border-t border-slate-800/70">
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') pushUserQuery();
                }}
                placeholder="Ask about an alert…"
                className="w-full rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
              />
              <button
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3 py-2 text-sm font-semibold text-white"
                onClick={pushUserQuery}
              >
                Send
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Modal: Unit details */}
      {selected ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedId(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-slate-900/80 shadow-xl ring-1 ring-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800/70 px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-slate-950 text-white ring-1 ring-slate-800">{selected.id}</span>
                <span className="text-sm font-semibold text-slate-50">{selected.name}</span>
                <ChevronRight size={16} className="text-slate-400" />
                <span className="text-xs text-slate-400">Details</span>
              </div>
              <button
                className="rounded-xl p-2 hover:bg-slate-800/60 text-slate-300"
                onClick={() => setSelectedId(null)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="text-sm text-slate-300 flex items-center gap-2">
                <MapPin size={16} className="text-slate-400" /> {selected.location}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-slate-950/40 ring-1 ring-slate-800 p-4">
                  <div className="text-xs text-slate-400">Status</div>
                  <div className={selected.anomaly ? 'text-rose-200 font-semibold' : 'text-slate-50 font-semibold'}>
                    {selected.status}
                  </div>
                </div>
                <div className="rounded-2xl bg-slate-950/40 ring-1 ring-slate-800 p-4">
                  <div className="text-xs text-slate-400">Telemetry</div>
                  <div className={selected.anomaly ? 'text-rose-200 font-semibold' : 'text-emerald-200 font-semibold'}>
                    {selected.telemetry}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  className="rounded-xl bg-slate-950/40 hover:bg-slate-950/60 ring-1 ring-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-200"
                  onClick={() => {
                    setSelectedId(null);
                    navigate('/fleet');
                  }}
                >
                  Open in Fleet
                </button>
                <button
                  className={
                    'rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ' +
                    (selected.anomaly
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-slate-800/60 text-slate-500 cursor-not-allowed')
                  }
                  disabled={!selected.anomaly}
                  onClick={() => {
                    setSelectedId(null);
                    navigate(`/alerts?unit=${encodeURIComponent(selected.id)}`);
                  }}
                >
                  Run diagnostic
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Dashboard;