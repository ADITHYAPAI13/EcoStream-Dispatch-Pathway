import React from 'react';

import { getAlerts, getFleet, normalizeAlerts, normalizeFleetUnits } from '../api/ecostream.js';

export function useLiveBackend({ intervalMs = 1000 } = {}) {
  const [fleet, setFleet] = React.useState(() => []);
  const [alerts, setAlerts] = React.useState(() => []);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [lastUpdatedAt, setLastUpdatedAt] = React.useState(null);

  React.useEffect(() => {
    let cancelled = false;
    let timer;

    async function tick() {
      try {
        const [fleetResp, alertsResp] = await Promise.all([getFleet(), getAlerts()]);

        if (cancelled) return;
        const nextFleet = normalizeFleetUnits(fleetResp?.units);
        const nextAlerts = normalizeAlerts(alertsResp?.alerts);

        setFleet(nextFleet);
        setAlerts(nextAlerts);
        setLastUpdatedAt(new Date());
        setError(null);
        setLoading(false);
      } catch (e) {
        if (cancelled) return;
        setError(e);
        setLoading(false);
      }
    }

    tick();
    timer = setInterval(tick, Math.max(350, intervalMs));

    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
  }, [intervalMs]);

  return { fleet, alerts, loading, error, lastUpdatedAt };
}
