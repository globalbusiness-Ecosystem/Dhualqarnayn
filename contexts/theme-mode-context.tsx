"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { pi } from "@/lib/pi";

export type ThemeMode = "auto" | "day" | "night";
export type ResolvedTheme = "day" | "night";

const STORAGE_KEY = "theme.mode";

/** Day window: 5:30 (fajr-ish) through 18:00 (maghrib-ish) counts as "day". */
function resolveFromClock(): ResolvedTheme {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const dayStart = 5 * 60 + 30;
  const dayEnd = 18 * 60;
  return minutes >= dayStart && minutes < dayEnd ? "day" : "night";
}

interface ThemeModeContextValue {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
  ready: boolean;
}

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

export function ThemeModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("auto");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("night");
  const [ready, setReady] = useState(false);
  const modeRef = useRef(mode);
  modeRef.current = mode;

  // Load saved preference from the Pi-backed per-user store.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const record = await pi.userState.get(STORAGE_KEY);
        const saved = (record?.blob as { mode?: ThemeMode } | null)?.mode;
        if (!cancelled && (saved === "auto" || saved === "day" || saved === "night")) {
          setModeState(saved);
        }
      } catch {
        // Fresh start / offline — keep default "auto".
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Recompute resolved theme whenever mode changes, and every minute while in auto mode.
  useEffect(() => {
    const recompute = () => {
      setResolvedTheme(modeRef.current === "auto" ? resolveFromClock() : (modeRef.current as ResolvedTheme));
    };
    recompute();
    const iv = setInterval(recompute, 60_000);
    return () => clearInterval(iv);
  }, [mode]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("theme-day", resolvedTheme === "day");
      document.documentElement.classList.toggle("theme-night", resolvedTheme === "night");
    }
  }, [resolvedTheme]);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    pi.userState.set(STORAGE_KEY, { mode: next }).catch(() => {
      // Non-blocking — selection still applies for this session.
    });
  }, []);

  return (
    <ThemeModeContext.Provider value={{ mode, resolvedTheme, setMode, ready }}>
      {children}
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) {
    throw new Error("useThemeMode must be used within a ThemeModeProvider");
  }
  return ctx;
}
