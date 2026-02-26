import React from 'react';
import { MapPin, Plane, Truck, Zap, ChevronRight } from 'lucide-react';
import { initialFleetData } from '../data/fleet.js';

function typeIcon(type) {
  return type === 'Air' ? Plane : Truck;
}

export default function FleetPage() {
  const [fleet] = React.useState(() => initialFleetData);
  const [selectedId, setSelectedId] = React.useState(() => fleet[0]?.id ?? null);

  const selected = fleet.find((v) => v.id === selectedId) ?? null;

  return (
    <div className="grid grid-cols-12 gap-4">
      <section className="col-span-12 lg:col-span-7 rounded-3xl bg-slate-900/50 ring-1 ring-slate-800 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800/70 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-50">Fleet</h2>
            <p className="text-sm text-slate-400">{fleet.length} units</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-slate-400">
              <tr className="border-b border-slate-800/70">
                <th className="px-5 py-3 text-left font-semibold">Unit</th>
                <th className="px-5 py-3 text-left font-semibold">Type</th>
                <th className="px-5 py-3 text-left font-semibold">Status</th>
                <th className="px-5 py-3 text-left font-semibold">Telemetry</th>
              </tr>
            </thead>
            <tbody>
              {fleet.map((v) => {
                const Icon = typeIcon(v.type);
                const isActive = v.id === selectedId;
                return (
                  <tr
                    key={v.id}
                    className={
                      'cursor-pointer border-b border-slate-800/70 transition-colors ' +
                      (isActive ? 'bg-emerald-500/10' : 'hover:bg-slate-950/40')
                    }
                    onClick={() => setSelectedId(v.id)}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-slate-950 text-white ring-1 ring-slate-800">
                          {v.id}
                        </span>
                        <span className="text-slate-100 font-medium truncate">{v.name}</span>
                        {v.isEV ? <Zap size={16} className="text-amber-400" /> : null}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-200">
                      <span className="inline-flex items-center gap-2">
                        <Icon size={16} className="text-slate-400" />
                        {v.type}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={
                          'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ' +
                          (v.anomaly
                            ? 'bg-rose-500/10 text-rose-200 ring-rose-500/20'
                            : 'bg-emerald-500/10 text-emerald-200 ring-emerald-500/20')
                        }
                      >
                        {v.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={v.anomaly ? 'text-rose-200 font-semibold' : 'text-emerald-200 font-medium'}>
                        {v.telemetry}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <aside className="col-span-12 lg:col-span-5 rounded-3xl bg-slate-900/50 ring-1 ring-slate-800 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-800/70 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-50">Unit details</h2>
            <p className="text-sm text-slate-400">Select a unit to view context</p>
          </div>
        </div>

        {selected ? (
          <div className="p-5 space-y-4">
            <div className="space-y-1">
              <div className="text-slate-50 text-lg font-semibold flex items-center gap-2">
                {selected.name}
                <ChevronRight size={16} className="text-slate-400" />
                <span className="text-emerald-200">{selected.id}</span>
              </div>
              <div className="text-sm text-slate-300 flex items-center gap-2">
                <MapPin size={16} className="text-slate-400" /> {selected.location}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl ring-1 ring-slate-800 bg-slate-950/40 p-4">
                <div className="text-xs text-slate-400">Status</div>
                <div className={selected.anomaly ? 'text-rose-200 font-semibold' : 'text-slate-50 font-semibold'}>
                  {selected.status}
                </div>
              </div>
              <div className="rounded-2xl ring-1 ring-slate-800 bg-slate-950/40 p-4">
                <div className="text-xs text-slate-400">Telemetry</div>
                <div className={selected.anomaly ? 'text-rose-200 font-semibold' : 'text-emerald-200 font-semibold'}>
                  {selected.telemetry}
                </div>
              </div>
            </div>

            <div className="rounded-2xl ring-1 ring-slate-800 bg-slate-950/40 p-4">
              <div className="text-xs text-slate-400">Notes</div>
              <p className="mt-1 text-sm text-slate-200 leading-relaxed">
                This is mock fleet data. Next step is wiring live streams (Pathway) and persisting unit state.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-5 text-sm text-slate-400">No unit selected.</div>
        )}
      </aside>
    </div>
  );
}
