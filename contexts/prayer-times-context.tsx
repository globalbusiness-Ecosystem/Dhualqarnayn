"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { loadPrayerTimes, type PrayerStatus } from "@/lib/prayer-times";

interface PrayerTimesValue {
  /** Bumps whenever PRAYERS is updated — reading it makes a component re-render. */
  version: number;
  status: PrayerStatus;
  /** Re-fetch timings (e.g. after the calculation method changes). */
  refresh: () => void;
}

const PrayerTimesContext = createContext<PrayerTimesValue>({ version: 0, status: "fallback", refresh: () => {} });

export function PrayerTimesProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ version: number; status: PrayerStatus }>({ version: 0, status: "loading" });
  const [tick, setTick] = useState(0);
  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const status = await loadPrayerTimes();
        if (!cancelled) setState((s) => ({ version: s.version + 1, status }));
      } catch {
        if (!cancelled) setState((s) => ({ ...s, status: "fallback" }));
      }
    };
    run();
    // Refresh at least hourly so a new day (or a travelled-to city) is picked up.
    const t = setInterval(run, 60 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, [tick]);

  const value = useMemo(() => ({ ...state, refresh }), [state, refresh]);
  return <PrayerTimesContext.Provider value={value}>{children}</PrayerTimesContext.Provider>;
}

export const usePrayerTimes = () => useContext(PrayerTimesContext);
