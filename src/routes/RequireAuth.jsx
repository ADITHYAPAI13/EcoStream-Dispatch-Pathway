import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function RequireAuth({ user, children }) {
  const location = useLocation();
  if (user) return children;
  return <Navigate to="/" replace state={{ from: location.pathname + location.search }} />;
}
