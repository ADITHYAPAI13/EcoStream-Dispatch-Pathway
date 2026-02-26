import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import AuthModal from './components/AuthModal.jsx';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import AppShell from './layout/AppShell.jsx';
import Dashboard from './Dashboard.jsx';
import FleetPage from './pages/Fleet.jsx';
import AlertsPage from './pages/Alerts.jsx';
import SettingsPage from './pages/Settings.jsx';
import NotFoundPage from './pages/NotFound.jsx';
import Landing from './pages/Landing.jsx';

function RequireAuth({ user, children }) {
  const location = useLocation();
  if (user) return children;
  return <Navigate to="/" replace state={{ from: location.pathname + location.search }} />;
}

export default function App() {
  const [user, setUser] = useLocalStorage('ecostream.user', null);
  const [authModal, setAuthModal] = React.useState({ open: false, mode: 'signin' });

  const openSignIn = React.useCallback(() => setAuthModal({ open: true, mode: 'signin' }), []);
  const openSignUp = React.useCallback(() => setAuthModal({ open: true, mode: 'signup' }), []);
  const closeAuth = React.useCallback(() => setAuthModal((s) => ({ ...s, open: false })), []);
  const signOut = React.useCallback(() => setUser(null), [setUser]);

  return (
    <>
      <Routes>
        <Route
          element={
            <AppShell
              user={user}
              onOpenSignIn={openSignIn}
              onOpenSignUp={openSignUp}
              onSignOut={signOut}
            />
          }
        >
          <Route
            index
            element={
              user ? (
                <Dashboard />
              ) : (
                <Landing onGetStarted={openSignIn} />
              )
            }
          />

          <Route
            path="fleet"
            element={
              <RequireAuth user={user}>
                <FleetPage />
              </RequireAuth>
            }
          />
          <Route
            path="alerts"
            element={
              <RequireAuth user={user}>
                <AlertsPage />
              </RequireAuth>
            }
          />
          <Route
            path="settings"
            element={
              <RequireAuth user={user}>
                <SettingsPage />
              </RequireAuth>
            }
          />

          <Route path="home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>

      <AuthModal
        open={authModal.open}
        mode={authModal.mode}
        onClose={closeAuth}
        onSignIn={(u) => setUser(u)}
      />
    </>
  );
}
