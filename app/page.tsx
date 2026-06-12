"use client";

import { useState } from "react";
import AppHeader from "@/components/islamic/AppHeader";
import QuoteTicker from "@/components/islamic/QuoteTicker";
import HeroSection from "@/components/islamic/HeroSection";
import DailyVerse from "@/components/islamic/DailyVerse";
import FeatureCards from "@/components/islamic/FeatureCards";
import DhikrCounter from "@/components/islamic/DhikrCounter";
import IslamicHistory from "@/components/islamic/IslamicHistory";
import PiNetworkBanner from "@/components/islamic/PiNetworkBanner";
import BottomNav from "@/components/islamic/BottomNav";
import PremiumFeatures from "@/components/islamic/PremiumFeatures";
import DonationHub from "@/components/islamic/DonationHub";

interface SurahMeta {
  n: number; ar: string; en: string; ayahs: number; juz: number; rev: string;
}

function Divider({ shape }: { shape: "star" | "diamond" | "crescent" }) {
  return (
    <div className="px-6 py-1">
      <div className="flex items-center gap-3">
        <div className="ornament-line flex-1"/>
        {shape === "star" && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#C9A84C" opacity="0.28">
            <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9"/>
          </svg>
        )}
        {shape === "diamond" && (
          <svg width="10" height="10" viewBox="0 0 16 16">
            <polygon points="8,1 15,8 8,15 1,8" fill="none" stroke="#C9A84C" strokeWidth="1" opacity="0.25"/>
            <circle cx="8" cy="8" r="1.8" fill="#C9A84C" opacity="0.18"/>
          </svg>
        )}
        {shape === "crescent" && (
          <svg width="11" height="11" viewBox="0 0 18 18">
            <path d="M12 3 C8.5 3 6 6 6 9.5 C6 13 8.5 16 12 16 C9.5 14.5 8 12 8 9.5 C8 7 9.5 4.5 12 3Z" fill="#C9A84C" opacity="0.26"/>
          </svg>
        )}
        <div className="ornament-line flex-1"/>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedSurah, setSelectedSurah] = useState<SurahMeta | null>(null);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab !== "quran") setSelectedSurah(null);
  };

  const handleSurahSelect = (surah: SurahMeta) => {
    setSelectedSurah(surah);
  };

  const handleBack = () => {
    setSelectedSurah(null);
  };

  const showQuranReader = activeTab === "quran" && selectedSurah;
  const showQuranBrowser = activeTab === "quran" && !selectedSurah;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#050C16",
      color: "#F5ECD7",
      fontFamily: "'Tajawal', sans-serif",
      maxWidth: 480,
      margin: "0 auto",
      position: "relative",
    }}>
      {/* Home page: always render header + ticker, only show when activeTab === home */}
      {activeTab === "home" && (
        <>
          <AppHeader />
          <div style={{ height: 62 }} />
          <QuoteTicker />
          <main>
            <HeroSection />
            <Divider shape="star" />
            <DailyVerse />
            <Divider shape="diamond" />
            <FeatureCards />
            <Divider shape="crescent" />
            <DhikrCounter />
            <Divider shape="star" />
            <IslamicHistory />
            <Divider shape="diamond" />
            <PiNetworkBanner />
            <footer className="px-4 pt-3 pb-5 text-center"
              style={{ borderTop: "1px solid rgba(201,168,76,0.06)" }}>
              <div className="flex justify-center mb-2">
                <svg width="28" height="28" viewBox="0 0 28 28" opacity="0.2">
                  <polygon points="14,2 17,10 26,10 19,15 22,24 14,19 6,24 9,15 2,10 11,10"
                    fill="none" stroke="#C9A84C" strokeWidth="0.75"/>
                </svg>
              </div>
              <p style={{ fontFamily: "'Amiri', serif", color: "rgba(201,168,76,0.45)", fontSize: 13 }}>
                بسم الله الرحمن الرحيم
              </p>
              <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#5A4830", fontSize: 10, marginTop: 3 }}>
                ذو القرنين © ١٤٤٦ هـ — Pi Network
              </p>
            </footer>
            <div style={{ height: 76 }} />
          </main>
        </>
      )}

      {/* Quran Browser */}
      {showQuranBrowser && (
        <div style={{ paddingTop: 0 }}>
          <QuranBrowser onSelect={handleSurahSelect} />
          <div style={{ height: 80 }} />
        </div>
      )}

      {/* Surah Reader */}
      {showQuranReader && (
        <div>
          <SurahReader surah={selectedSurah} onBack={handleBack} />
          <div style={{ height: 80 }} />
        </div>
      )}

      {/* Prayer times placeholder */}
      {activeTab === "prayer" && (
        <div style={{ minHeight: "100vh", paddingTop: 60 }}>
          <AppHeader />
          <div style={{ height: 62 }} />
          <QuoteTicker />
          <HeroSection />
          <div style={{ height: 80 }} />
        </div>
      )}

      {/* Dhikr tab */}
      {activeTab === "dhikr" && (
        <div style={{ paddingTop: 0 }}>
          <div style={{ height: 20 }} />
          <DhikrCounter />
          <div style={{ height: 80 }} />
        </div>
      )}

      {/* More tab - Premium + Donations */}
      {activeTab === "more" && (
        <div style={{ paddingTop: 0 }}>
          <PremiumFeatures />
          <div style={{ height: 16 }} />
          <DonationHub />
          <div style={{ height: 80 }} />
        </div>
      )}

      <BottomNav activeTab={activeTab} onChange={handleTabChange} />
    </div>
  );
}
