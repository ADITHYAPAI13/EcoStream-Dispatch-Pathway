import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  Activity,
  Bell,
  Clock,
  LogOut,
  Settings,
  Truck,
} from 'lucide-react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function useLiveClock() {
  const [now, setNow] = React.useState(() => new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return now;
}

function initialsFromEmail(email) {
  const name = (email || '').split('@')[0] || '';
  const parts = name.split(/[._-]+/).filter(Boolean);
  const letters = (parts[0]?.[0] || 'U') + (parts[1]?.[0] || '');
  return letters.toUpperCase();
}

export default function AppShell({ user, onOpenSignIn, onOpenSignUp, onSignOut }) {
  const now = useLiveClock();

  const navItems = user
    ? [
        { to: '/', label: 'Dashboard', icon: Activity, end: true },
        { to: '/fleet', label: 'Fleet', icon: Truck },
        { to: '/alerts', label: 'Alerts', icon: Bell },
        { to: '/settings', label: 'Settings', icon: Settings },
      ]
    : [{ to: '/', label: 'Home', icon: Activity, end: true }];

  return (
    <div className="min-h-screen bg-transparent">
      <header className="sticky top-0 z-40 border-b border-slate-800/70 bg-slate-950/60 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-white grid place-items-center shadow-sm">
                  <Activity size={18} />
                </div>
                <div>
                  <div className="font-semibold text-slate-50 leading-tight">Ecostream Dispatch</div>
                  <div className="text-xs text-slate-400">Pathway streaming engine • Route management</div>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-2 rounded-full bg-slate-900/40 ring-1 ring-slate-800 px-3 py-1.5 text-sm text-slate-200">
                <Clock size={16} className="text-slate-300" />
                {now.toLocaleTimeString()}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 md:justify-end">
              <nav className="flex flex-wrap gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) =>
                        classNames(
                          'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors ring-1 ring-transparent',
                          isActive
                            ? 'bg-emerald-500/12 text-emerald-200 ring-emerald-500/25'
                            : 'text-slate-200 hover:bg-slate-900/40 hover:ring-slate-800'
                        )
                      }
                    >
                      <Icon size={16} className={item.to === '/alerts' ? 'text-rose-400' : 'text-slate-300'} />
                      {item.label}
                    </NavLink>
                  );
                })}
              </nav>

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
                      className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm"
                    >
                      Create account
                    </button>
                  </>
                ) : (
                  <>
                    <div className="hidden sm:flex items-center gap-2 pr-1">
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
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
