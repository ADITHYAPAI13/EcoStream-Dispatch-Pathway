import React from 'react';
import { Activity, Globe2, ShieldCheck, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Globe2,
    title: 'Live route awareness',
    body: 'A clean operational view of fleet location, routes, and ETAs — built to scale to streaming data.',
  },
  {
    icon: Activity,
    title: 'Telemetry at a glance',
    body: 'Surface anomalies quickly with friendly status chips and “what to do next” recommendations.',
  },
  {
    icon: ShieldCheck,
    title: 'Ops-ready UX',
    body: 'Designed like a proper web app: modern layout, readable colors, and accessible contrast.',
  },
];

export default function Landing({ onGetStarted }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 text-emerald-200 border border-emerald-500/20 px-3 py-1 text-sm font-medium">
            <Sparkles size={16} />
            Pathway-powered streaming UI
          </div>

          <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight text-slate-50">
            Dispatch that feels
            <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent"> modern</span>
          </h1>

          <p className="mt-4 text-lg text-slate-300 leading-relaxed">
            A brighter, cleaner dashboard for fleet operations — telemetry, anomaly awareness, and routing context in one
            place.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={onGetStarted}
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm"
            >
              Sign in to continue
            </button>
            <a
              href="#preview"
              className="px-5 py-3 rounded-2xl bg-slate-900/40 hover:bg-slate-900/55 text-slate-100 font-semibold ring-1 ring-slate-800"
            >
              See preview
            </a>
          </div>

          <div className="mt-6 text-sm text-slate-400">
            Tip: once you share your backend auth endpoint, we can make sign-in real.
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-br from-emerald-500/20 via-cyan-500/15 to-indigo-500/15 blur-2xl rounded-full" />
          <div className="relative rounded-3xl bg-slate-900/50 ring-1 ring-slate-800 shadow-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Fleet health</div>
                <div className="text-2xl font-bold text-slate-50">All systems nominal</div>
              </div>
              <div className="h-10 w-10 rounded-2xl bg-emerald-600 text-white grid place-items-center">
                <Activity size={18} />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-slate-950/40 ring-1 ring-slate-800 p-4">
                <div className="text-xs text-slate-400">Active units</div>
                <div className="text-xl font-bold text-slate-50">4</div>
              </div>
              <div className="rounded-2xl bg-slate-950/40 ring-1 ring-slate-800 p-4">
                <div className="text-xs text-slate-400">Alerts</div>
                <div className="text-xl font-bold text-slate-50">1</div>
              </div>
              <div className="rounded-2xl bg-slate-950/40 ring-1 ring-slate-800 p-4">
                <div className="text-xs text-slate-400">Streams</div>
                <div className="text-xl font-bold text-slate-50">320 EPS</div>
              </div>
              <div className="rounded-2xl bg-slate-950/40 ring-1 ring-slate-800 p-4">
                <div className="text-xs text-slate-400">Uptime</div>
                <div className="text-xl font-bold text-slate-50">99.9%</div>
              </div>
            </div>

            <div id="preview" className="mt-6 rounded-2xl overflow-hidden ring-1 ring-slate-800">
              <div className="h-32 bg-gradient-to-r from-emerald-500/20 via-cyan-500/10 to-indigo-500/10" />
              <div className="p-4 text-sm text-slate-300">Dashboard preview appears after sign in.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.title} className="rounded-3xl bg-slate-900/50 ring-1 ring-slate-800 p-6 shadow-sm">
              <div className="h-10 w-10 rounded-2xl bg-slate-950 text-white ring-1 ring-slate-800 grid place-items-center">
                <Icon size={18} />
              </div>
              <h3 className="mt-4 font-semibold text-slate-50">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">{f.body}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
