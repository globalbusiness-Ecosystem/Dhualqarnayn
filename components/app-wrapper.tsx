"use client";

import type { ReactNode } from "react";
import { PiAuthProvider, usePiAuth } from "@/contexts/pi-auth-context";
import { LanguageProvider } from "@/contexts/language-context";
import { ThemeModeProvider } from "@/contexts/theme-mode-context";
import { PrayerTimesProvider } from "@/contexts/prayer-times-context";
import { AdhanProvider } from "@/contexts/adhan-context";
import { QuranAudioProvider } from "@/contexts/quran-audio-context";
import { InstallPromptProvider } from "@/contexts/install-prompt-context";
import { AuthLoadingScreen } from "./auth-loading-screen";
import QuranMiniPlayer from "./islamic/QuranMiniPlayer";

function AppContent({ children }: { children: ReactNode }) {
  const { isAuthenticated } = usePiAuth();
  if (!isAuthenticated) return <AuthLoadingScreen />;
  return (
    <>
      {children}
      <QuranMiniPlayer />
    </>
  );
}

export function AppWrapper({ children }: { children: ReactNode }) {
  return (
    <PiAuthProvider>
      <LanguageProvider>
        <ThemeModeProvider>
          <PrayerTimesProvider>
            <AdhanProvider>
              <QuranAudioProvider>
                <InstallPromptProvider>
                  <AppContent>{children}</AppContent>
                </InstallPromptProvider>
              </QuranAudioProvider>
            </AdhanProvider>
          </PrayerTimesProvider>
        </ThemeModeProvider>
      </LanguageProvider>
    </PiAuthProvider>
  );
}
