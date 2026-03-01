import React from 'react';
import { Info, Github, SlidersHorizontal } from 'lucide-react';

const PROJECT_REPO_URL = 'https://github.com/ADITHYAPAI13/EcoStream-Dispatch-Pathway';

export default function SettingsPage() {
  const [compactMode, setCompactMode] = React.useState(false);

  return (
    <div className="grid grid-cols-12 gap-4">
      <section className="col-span-12 lg:col-span-7 rounded-3xl bg-slate-900/50 ring-1 ring-slate-800 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-800/70 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-50">Settings</h2>
            <p className="text-sm text-slate-400">Local demo only</p>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div className="rounded-2xl bg-slate-950/40 ring-1 ring-slate-800 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-slate-50 font-semibold">
                <SlidersHorizontal size={16} className="text-slate-300" />
                Compact mode
              </div>
              <button
                className={
                  'rounded-xl px-3 py-2 text-sm font-semibold transition-colors ring-1 ' +
                  (compactMode
                    ? 'bg-emerald-600 text-white ring-emerald-600'
                    : 'bg-slate-950/40 text-slate-200 ring-slate-800 hover:bg-slate-950/60')
                }
                onClick={() => setCompactMode((v) => !v)}
              >
                {compactMode ? 'On' : 'Off'}
              </button>
            </div>
            <p className="mt-2 text-sm text-slate-300">
              This toggle is UI-only. If you want, I can wire it into Tailwind classes via context and persist to
              localStorage.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-950/40 ring-1 ring-slate-800 p-4">
            <div className="text-xs text-slate-400">Environment</div>
            <div className="mt-1 text-sm font-semibold text-slate-50">Vite + React + Tailwind</div>
          </div>
        </div>
      </section>

      <aside className="col-span-12 lg:col-span-5 rounded-3xl bg-slate-900/50 ring-1 ring-slate-800 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-800/70 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-50">About</h2>
            <p className="text-sm text-slate-400">Prototype</p>
          </div>
        </div>

        <div className="p-5 space-y-3">
          <div className="flex items-start gap-2 text-slate-200 text-sm">
            <Info size={16} className="text-slate-400 mt-0.5" />
            <p className="leading-relaxed">
              This is a single-page app (SPA) with multiple routes, so it feels like a professional product while still
              deploying as one frontend.
            </p>
          </div>

          <a
            href={PROJECT_REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950/40 hover:bg-slate-950/60 ring-1 ring-slate-800 px-3 py-2 text-sm font-semibold text-slate-200"
          >
            <Github size={16} className="text-slate-400" />
            Project repo
          </a>
        </div>
      </aside>
    </div>
  );
}
