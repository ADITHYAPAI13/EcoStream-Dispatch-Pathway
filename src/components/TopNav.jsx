import React from 'react';
import { LogOut, Shield } from 'lucide-react';

function initialsFromEmail(email) {
  const name = (email || '').split('@')[0] || '';
  const parts = name.split(/[._-]+/).filter(Boolean);
  const letters = (parts[0]?.[0] || 'U') + (parts[1]?.[0] || '');
  return letters.toUpperCase();
}

export default function TopNav({ user, onOpenSignIn, onOpenSignUp, onSignOut }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/70 bg-slate-950/60 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 grid place-items-center text-white shadow-sm">
            <Shield size={18} />
          </div>
          <div>
            <div className="font-semibold text-slate-50 leading-tight">Ecostream Dispatch</div>
            <div className="text-xs text-slate-400">Fleet telemetry • Routing • Diagnostics</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!user ? (
            <>
              <button
                onClick={onOpenSignIn}
                className="px-3 py-2 rounded-xl text-slate-200 hover:bg-slate-900/40 ring-1 ring-transparent hover:ring-slate-800 font-medium"
              >
                Sign in
              </button>
              <button
                onClick={onOpenSignUp}
                className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                Create account
              </button>
            </>
          ) : (
            <>
              <div className="hidden sm:flex items-center gap-3 pr-2">
                <div className="h-9 w-9 rounded-full bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-500/20 grid place-items-center font-semibold">
                  {initialsFromEmail(user.email)}
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-semibold text-slate-100">{user.name || 'User'}</div>
                  <div className="text-xs text-slate-400">{user.email}</div>
                </div>
              </div>

              <button
                onClick={onSignOut}
                className="px-3 py-2 rounded-xl text-slate-200 hover:bg-slate-900/40 ring-1 ring-transparent hover:ring-slate-800 font-medium inline-flex items-center gap-2"
                title="Sign out"
              >
                <LogOut size={16} className="text-slate-300" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
