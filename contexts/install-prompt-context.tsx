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

type Platform = "android" | "ios" | "desktop" | "other";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface InstallPromptContextValue {
  /** True once the device/browser has reported it's ready to install directly. */
  canInstallDirectly: boolean;
  /** True if the app is already running as an installed/standalone app. */
  isInstalled: boolean;
  platform: Platform;
  /** Triggers the native install prompt (Android/desktop). Resolves to whether it was accepted. */
  promptInstall: () => Promise<boolean>;
}

const InstallPromptContext = createContext<InstallPromptContextValue | null>(null);

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent || "";
  const isIOS = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === "MacIntel" && (navigator as any).maxTouchPoints > 1);
  if (isIOS) return "ios";
  if (/android/i.test(ua)) return "android";
  if (/windows|macintosh|linux/i.test(ua)) return "desktop";
  return "other";
}

function detectStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const mql = window.matchMedia?.("(display-mode: standalone)")?.matches;
  const iosStandalone = (window.navigator as any).standalone === true;
  return Boolean(mql || iosStandalone);
}

export function InstallPromptProvider({ children }: { children: ReactNode }) {
  const [canInstallDirectly, setCanInstallDirectly] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [platform, setPlatform] = useState<Platform>("other");
  const deferredRef = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    setPlatform(detectPlatform());
    setIsInstalled(detectStandalone());

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      deferredRef.current = e as BeforeInstallPromptEvent;
      setCanInstallDirectly(true);
    };
    const onInstalled = () => {
      setIsInstalled(true);
      setCanInstallDirectly(false);
      deferredRef.current = null;
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    const deferred = deferredRef.current;
    if (!deferred) return false;
    try {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === "accepted") {
        setCanInstallDirectly(false);
        deferredRef.current = null;
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  return (
    <InstallPromptContext.Provider value={{ canInstallDirectly, isInstalled, platform, promptInstall }}>
      {children}
    </InstallPromptContext.Provider>
  );
}

export function useInstallPrompt() {
  const ctx = useContext(InstallPromptContext);
  if (!ctx) throw new Error("useInstallPrompt must be used within InstallPromptProvider");
  return ctx;
}
