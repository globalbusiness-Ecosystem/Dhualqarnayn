"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { loadPrayerTimes, type PrayerStatus } from "@/lib/prayer-times";

interface PrayerTimesValue {
  /** Bumps whenever PRAYERS is updated — reading it makes a component re-render. */
  version: number;
  status: PrayerStatus;
}

const PrayerTimesContext = createContext<PrayerTimesValue>({ version: 0, status: "fallback" });

export function PrayerTimesProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PrayerTimesValue>({ version: 0, status: "loading" });

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
  }, []);

  return <PrayerTimesContext.Provider value={state}>{children}</PrayerTimesContext.Provider>;
}

export const usePrayerTimes = () => useContext(PrayerTimesContext);
