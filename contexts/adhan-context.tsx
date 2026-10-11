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
import { ADHAN_PRAYERS } from "@/lib/prayer-times";
import { DEFAULT_ADHAN_VOICE_ID, getAdhanVoice } from "@/lib/adhan-voices";

const STORAGE_KEY = "adhan.settings";

interface AzkarReminderSettings {
  enabled: boolean;
  morningTime: string; // "HH:MM"
  eveningTime: string; // "HH:MM"
}

interface AdhanSettings {
  enabled: boolean;
  voiceId: string;
  mutedPrayers: string[]; // prayer `name`s the user turned off individually
  azkar: AzkarReminderSettings;
}

const DEFAULT_AZKAR_SETTINGS: AzkarReminderSettings = {
  enabled: false,
  morningTime: "06:30",
  eveningTime: "17:30",
};

const DEFAULT_SETTINGS: AdhanSettings = {
  enabled: false,
  voiceId: DEFAULT_ADHAN_VOICE_ID,
  mutedPrayers: [],
  azkar: DEFAULT_AZKAR_SETTINGS,
};

interface AdhanContextValue {
  settings: AdhanSettings;
  ready: boolean;
  nowPlaying: string | null; // prayer nameAr currently sounding, or null
  setEnabled: (v: boolean) => void;
  setVoice: (id: string) => void;
  togglePrayer: (name: string) => void;
  testVoice: (voiceId?: string) => void;
  stopPlaying: () => void;
  notificationPermission: NotificationPermission | "unsupported";
  requestNotificationPermission: () => Promise<NotificationPermission | "unsupported">;
  sendTestNotification: () => void;
  setAzkarEnabled: (v: boolean) => void;
  setAzkarTime: (which: "morning" | "evening", time: string) => void;
}

const AdhanContext = createContext<AdhanContextValue | null>(null);

export function AdhanProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AdhanSettings>(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);
  const [nowPlaying, setNowPlaying] = useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | "unsupported">(
    "default"
  );
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const firedTodayRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (typeof window === "undefined") return;
    audioRef.current = new Audio();
    setNotificationPermission("Notification" in window ? Notification.permission : "unsupported");
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Notifications fall back to the plain API if the worker fails to install.
      });
    }
  }, []);

  // Load saved settings
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const record = await pi.userState.get(STORAGE_KEY);
        const saved = record?.blob as Partial<AdhanSettings> | null;
        if (!cancelled && saved) {
          const savedAzkar = saved.azkar as Partial<AzkarReminderSettings> | undefined;
          setSettings({
            enabled: !!saved.enabled,
            voiceId: typeof saved.voiceId === "string" ? saved.voiceId : DEFAULT_ADHAN_VOICE_ID,
            mutedPrayers: Array.isArray(saved.mutedPrayers) ? saved.mutedPrayers : [],
            azkar: {
              enabled: !!savedAzkar?.enabled,
              morningTime: typeof savedAzkar?.morningTime === "string" ? savedAzkar.morningTime : DEFAULT_AZKAR_SETTINGS.morningTime,
              eveningTime: typeof savedAzkar?.eveningTime === "string" ? savedAzkar.eveningTime : DEFAULT_AZKAR_SETTINGS.eveningTime,
            },
          });
        }
      } catch {
        // Fresh start — keep defaults.
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback((next: AdhanSettings) => {
    pi.userState.set(STORAGE_KEY, next).catch(() => {
      // Non-blocking — selection still applies for this session.
    });
  }, []);

  const setEnabled = useCallback(
    (v: boolean) => {
      setSettings((s) => {
        const next = { ...s, enabled: v };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const setVoice = useCallback(
    (id: string) => {
      setSettings((s) => {
        const next = { ...s, voiceId: id };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const togglePrayer = useCallback(
    (name: string) => {
      setSettings((s) => {
        const muted = s.mutedPrayers.includes(name)
          ? s.mutedPrayers.filter((n) => n !== name)
          : [...s.mutedPrayers, name];
        const next = { ...s, mutedPrayers: muted };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const setAzkarEnabled = useCallback(
    (v: boolean) => {
      setSettings((s) => {
        const next = { ...s, azkar: { ...s.azkar, enabled: v } };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const setAzkarTime = useCallback(
    (which: "morning" | "evening", time: string) => {
      setSettings((s) => {
        const next = {
          ...s,
          azkar: {
            ...s.azkar,
            [which === "morning" ? "morningTime" : "eveningTime"]: time,
          },
        };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const requestNotificationPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return "unsupported" as const;
    try {
      const p = await Notification.requestPermission();
      setNotificationPermission(p);
      return p;
    } catch {
      return notificationPermission;
    }
  }, [notificationPermission]);

  const showNotification = useCallback((title: string, body: string) => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission !== "granted") return;
    const icon = "/icon.svg";
    const options: NotificationOptions = { body, icon, badge: icon, tag: title };
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready
        .then((reg) => {
          const ctrl = navigator.serviceWorker.controller;
          if (ctrl) {
            ctrl.postMessage({ type: "SHOW_NOTIFICATION", title, options });
          } else {
            reg.showNotification(title, options);
          }
        })
        .catch(() => {
          try {
            new Notification(title, options);
          } catch {
            // Some mobile browsers reject the plain constructor entirely — nothing more to do.
          }
        });
    } else {
      try {
        new Notification(title, options);
      } catch {
        // Unsupported in this browser.
      }
    }
  }, []);

  const sendTestNotification = useCallback(() => {
    showNotification("ذو القرنين 🕌", "هكذا ستصلك تذكيرات الصلاة والأذكار — كل شيء يعمل بنجاح");
  }, [showNotification]);

  const stopPlaying = useCallback(() => {
    const el = audioRef.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
    setNowPlaying(null);
  }, []);

  const playAdhan = useCallback((voiceId: string, label: string | null) => {
    const el = audioRef.current;
    if (!el) return;
    el.src = getAdhanVoice(voiceId).url;
    el.play().catch(() => {
      // Playback can be blocked without a prior user gesture — ignored silently.
    });
    setNowPlaying(label);
    el.onended = () => setNowPlaying(null);
  }, []);

  const testVoice = useCallback(
    (voiceId?: string) => {
      playAdhan(voiceId ?? settingsRef.current.voiceId, "تجربة");
    },
    [playAdhan]
  );

  // Minute-tick scheduler: fires the adhan + a notification once per prayer per day.
  useEffect(() => {
    if (!ready) return;

    const tick = () => {
      const s = settingsRef.current;
      const now = new Date();
      const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const dateKey = now.toDateString();

      if (s.enabled) {
        for (const prayer of ADHAN_PRAYERS) {
          if (prayer.time !== hhmm) continue;
          if (s.mutedPrayers.includes(prayer.name)) continue;
          const fireKey = `${dateKey}:${prayer.name}`;
          if (firedTodayRef.current.has(fireKey)) continue;
          firedTodayRef.current.add(fireKey);

          playAdhan(s.voiceId, prayer.nameAr);
          showNotification(`حان الآن وقت صلاة ${prayer.nameAr}`, "ذو القرنين — بوابتك الإسلامية الشاملة");
        }
      }

      if (s.azkar.enabled) {
        const azkarSlots: { time: string; key: string; title: string; body: string }[] = [
          {
            time: s.azkar.morningTime,
            key: "azkar-morning",
            title: "حان وقت أذكار الصباح 🌅",
            body: "لا تنس نصيبك من أذكار الصباح المأثورة اليوم",
          },
          {
            time: s.azkar.eveningTime,
            key: "azkar-evening",
            title: "حان وقت أذكار المساء 🌙",
            body: "لا تنس نصيبك من أذكار المساء المأثورة اليوم",
          },
        ];
        for (const slot of azkarSlots) {
          if (slot.time !== hhmm) continue;
          const fireKey = `${dateKey}:${slot.key}`;
          if (firedTodayRef.current.has(fireKey)) continue;
          firedTodayRef.current.add(fireKey);
          showNotification(slot.title, slot.body);
        }
      }
    };

    tick();
    const iv = setInterval(tick, 20_000);
    return () => clearInterval(iv);
  }, [ready, playAdhan, showNotification]);

  return (
    <AdhanContext.Provider
      value={{
        settings,
        ready,
        nowPlaying,
        setEnabled,
        setVoice,
        togglePrayer,
        testVoice,
        stopPlaying,
        notificationPermission,
        requestNotificationPermission,
        sendTestNotification,
        setAzkarEnabled,
        setAzkarTime,
      }}
    >
      {children}
    </AdhanContext.Provider>
  );
}

export function useAdhan() {
  const ctx = useContext(AdhanContext);
  if (!ctx) {
    throw new Error("useAdhan must be used within an AdhanProvider");
  }
  return ctx;
}
