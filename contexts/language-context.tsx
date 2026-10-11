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
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  getLocaleInfo,
  translate,
  type LocaleCode,
} from "@/lib/i18n";

interface LanguageContextValue {
  locale: LocaleCode;
  setLocale: (locale: LocaleCode) => void;
  dir: "rtl" | "ltr";
  t: (key: string) => string;
  ready: boolean;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>(DEFAULT_LOCALE);
  const [ready, setReady] = useState(false);
  const loadedRef = useRef(false);

  // Load saved preference once, from the Pi-backed per-user store.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const record = await pi.userState.get(LOCALE_STORAGE_KEY);
        const saved = (record?.blob as { locale?: LocaleCode } | null)?.locale;
        if (!cancelled && saved) setLocaleState(saved);
      } catch {
        // Fresh start / offline — keep default locale.
      } finally {
        if (!cancelled) {
          loadedRef.current = true;
          setReady(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setLocale = useCallback((next: LocaleCode) => {
    setLocaleState(next);
    pi.userState.set(LOCALE_STORAGE_KEY, { locale: next }).catch(() => {
      // Non-blocking — selection still applies for this session.
    });
  }, []);

  const info = getLocaleInfo(locale);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
      document.documentElement.dir = info.dir;
    }
  }, [locale, info.dir]);

  const t = useCallback((key: string) => translate(locale, key), [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, dir: info.dir, t, ready }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
