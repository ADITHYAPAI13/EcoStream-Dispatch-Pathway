import React, { useMemo, useState } from 'react';
import { X, Lock, Mail } from 'lucide-react';

export default function AuthModal({ open, mode, onClose, onSignIn }) {
  const title = useMemo(() => (mode === 'signup' ? 'Create your account' : 'Sign in'), [mode]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail.includes('@')) {
      setError('Please enter a valid email.');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    setBusy(true);
    try {
      // Local-only auth (no backend): accept any credentials.
      // If you have a backend endpoint, we can swap this to a real API call.
      await new Promise((r) => setTimeout(r, 450));

      const user = {
        email: trimmedEmail,
        name: trimmedEmail.split('@')[0] || 'User',
        remember,
        signedInAt: new Date().toISOString(),
      };
      onSignIn(user);
      onClose();
    } catch {
      setError('Sign in failed. Try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-slate-900/80 shadow-xl ring-1 ring-slate-800">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
              <p className="text-sm text-slate-400">Ecostream Dispatch</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-300"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={submit} className="px-5 py-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-200">Email</label>
              <div className="mt-1 relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/40 px-10 py-2.5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-200">Password</label>
              <div className="mt-1 relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/40 px-10 py-2.5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500"
                />
              </div>
            </div>

            <label className="flex items-center justify-between gap-3 select-none">
              <span className="text-sm text-slate-300">Remember me</span>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-slate-600 bg-slate-950/40 text-emerald-500 focus:ring-emerald-500/25"
              />
            </label>

            {error ? (
              <div className="rounded-xl bg-rose-500/10 text-rose-200 border border-rose-500/30 px-3 py-2 text-sm">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:hover:bg-emerald-600 text-white font-semibold py-2.5"
            >
              {busy ? 'Working…' : mode === 'signup' ? 'Create account' : 'Sign in'}
            </button>

            <p className="text-xs text-slate-400">
              This demo sign-in is local-only (no backend). Tell me your auth API and I’ll connect it.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
