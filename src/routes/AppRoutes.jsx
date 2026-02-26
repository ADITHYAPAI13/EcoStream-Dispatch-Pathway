import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import AppShell from '../layout/AppShell.jsx';
import RequireAuth from './RequireAuth.jsx';

import DashboardPage from '../pages/Dashboard.jsx';
import Landing from '../pages/Landing.jsx';
import FleetPage from '../pages/Fleet.jsx';
import AlertsPage from '../pages/Alerts.jsx';
import SettingsPage from '../pages/Settings.jsx';
import NotFoundPage from '../pages/NotFound.jsx';

export default function AppRoutes({ user, onOpenSignIn, onOpenSignUp, onSignOut }) {
  return (
    <Routes>
      <Route
        element={
          <AppShell
            user={user}
            onOpenSignIn={onOpenSignIn}
            onOpenSignUp={onOpenSignUp}
            onSignOut={onSignOut}
          />
        }
      >
        <Route index element={user ? <DashboardPage /> : <Landing onGetStarted={onOpenSignIn} />} />

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
  );
}
