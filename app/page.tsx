"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import AppHeader from "@/components/islamic/AppHeader";
import QuoteTicker from "@/components/islamic/QuoteTicker";
import HeroSection from "@/components/islamic/HeroSection";
import DailyVerse from "@/components/islamic/DailyVerse";
import FeatureCards from "@/components/islamic/FeatureCards";
import DhikrCounter from "@/components/islamic/DhikrCounter";
import IslamicHistory from "@/components/islamic/IslamicHistory";
import PiNetworkBanner from "@/components/islamic/PiNetworkBanner";
import BottomNav from "@/components/islamic/BottomNav";
import InstallAppSheet from "@/components/islamic/InstallAppSheet";
import InstallBanner from "@/components/islamic/InstallBanner";

// Screens below are only needed once the user navigates away from the home
// tab, so they are code-split out of the initial bundle with next/dynamic.
// This keeps the first paint of the home screen fast no matter how many
// libraries the app grows to contain.
function screenLoading() {
  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{
        width: 40, height: 40, borderRadius: "50%",
        border: "3px solid rgba(201,168,76,0.18)",
        borderTopColor: "#C9A84C",
        animation: "spin 0.8s linear infinite",
      }} />
      <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

const dyn = (loader: Parameters<typeof dynamic>[0]) => dynamic(loader, { loading: screenLoading });

const PremiumFeatures = dyn(() => import("@/components/islamic/PremiumFeatures"));
const DonationHub = dyn(() => import("@/components/islamic/DonationHub"));
const QuranBrowser = dyn(() => import("@/components/islamic/QuranBrowser"));
const SurahReader = dyn(() => import("@/components/islamic/SurahReader"));
const HadithBrowser = dyn(() => import("@/components/islamic/HadithBrowser"));
const AzkarBrowser = dyn(() => import("@/components/islamic/AzkarBrowser"));
const AdiyaBrowser = dyn(() => import("@/components/islamic/AdiyaBrowser"));
const QiblaCompass = dyn(() => import("@/components/islamic/QiblaCompass"));
const AdhanSettings = dyn(() => import("@/components/islamic/AdhanSettings"));
const HijriCalendar = dyn(() => import("@/components/islamic/HijriCalendar"));
const AsmaHusna = dyn(() => import("@/components/islamic/AsmaHusna"));
const HistoryBrowser = dyn(() => import("@/components/islamic/HistoryBrowser"));
const ProphetsBrowser = dyn(() => import("@/components/islamic/ProphetsBrowser"));
const DawahBrowser = dyn(() => import("@/components/islamic/DawahBrowser"));
const TafsirBrowser = dyn(() => import("@/components/islamic/TafsirBrowser"));
const FiqhBrowser = dyn(() => import("@/components/islamic/FiqhBrowser"));
const RamadanHajjGuide = dyn(() => import("@/components/islamic/RamadanHajjGuide"));
const ZakatCalculator = dyn(() => import("@/components/islamic/ZakatCalculator"));
const MosqueFinder = dyn(() => import("@/components/islamic/MosqueFinder"));
const PrayerTimesScreen = dyn(() => import("@/components/islamic/PrayerTimesScreen"));
const SermonsBrowser = dyn(() => import("@/components/islamic/SermonsBrowser"));
const MawarethCalculator = dyn(() => import("@/components/islamic/MawarethCalculator"));
const SeerahBrowser = dyn(() => import("@/components/islamic/SeerahBrowser"));
const GlossaryBrowser = dyn(() => import("@/components/islamic/GlossaryBrowser"));

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
  const [installOpen, setInstallOpen] = useState(false);

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
  const showHadith = activeTab === "hadith";
  const showDuas = activeTab === "duas";
  const showQibla = activeTab === "qibla";
  const showAdhan = activeTab === "adhan";
  const showCalendar = activeTab === "cal";
  const showAsma = activeTab === "asma";
  const showHistory = activeTab === "history";
  const showProphets = activeTab === "prophets";
  const showDawah = activeTab === "dawah";
  const showTafsir = activeTab === "tafsir";
  const showFiqh = activeTab === "fiqh";
  const showRamadan = activeTab === "ramadan";
  const showZakat = activeTab === "zakat";
  const showMosques = activeTab === "mosques";
  const showPrayer = activeTab === "prayer";
  const showSermons = activeTab === "sermons";
  const showMawareth = activeTab === "mawareth";
  const showSeerah = activeTab === "seerah";
  const showGlossary = activeTab === "glossary";

  return (
    <div className="dq-shell" style={{
      minHeight: "100vh",
      background: "#050C16",
      color: "#F5ECD7",
      fontFamily: "'Tajawal', sans-serif",
      maxWidth: "var(--app-max-w)",
      margin: "0 auto",
      position: "relative",
    }}>
      {/* Home page: always render header + ticker, only show when activeTab === home */}
      {activeTab === "home" && (
        <>
          <AppHeader activeTab={activeTab} onNavigate={handleTabChange} />
          <div style={{ height: 62 }} />
          <QuoteTicker />
          <main>
            <HeroSection />
            <Divider shape="star" />
            <DailyVerse />
            <Divider shape="diamond" />
            <FeatureCards onOpen={(id) => {
              if (id === "hadith") handleTabChange("hadith");
              if (id === "quran") handleTabChange("quran");
              if (id === "dhikr") handleTabChange("dhikr");
              if (id === "duas") handleTabChange("duas");
              if (id === "qibla") handleTabChange("qibla");
              if (id === "prayer") handleTabChange("prayer");
              if (id === "zakat") handleTabChange("zakat");
              if (id === "mosques") handleTabChange("mosques");
              if (id === "cal") handleTabChange("cal");
              if (id === "asma") handleTabChange("asma");
              if (id === "history") handleTabChange("history");
              if (id === "prophets") handleTabChange("prophets");
              if (id === "dawah") handleTabChange("dawah");
              if (id === "tafsir") handleTabChange("tafsir");
              if (id === "fiqh") handleTabChange("fiqh");
              if (id === "ramadan") handleTabChange("ramadan");
              if (id === "sermons") handleTabChange("sermons");
              if (id === "mawareth") handleTabChange("mawareth");
              if (id === "seerah") handleTabChange("seerah");
              if (id === "glossary") handleTabChange("glossary");
            }} />
            <Divider shape="crescent" />
            <DhikrCounter />
            <Divider shape="star" />
            <IslamicHistory onOpenFull={() => handleTabChange("history")} />
            <Divider shape="diamond" />
            <InstallBanner onInstall={() => setInstallOpen(true)} />
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

      {/* Hadith Browser */}
      {showHadith && (
        <div style={{ paddingTop: 0 }}>
          <HadithBrowser onBack={() => handleTabChange("home")} />
          <div style={{ height: 80 }} />
        </div>
      )}

      {/* Adiya (Duas) Browser */}
      {showDuas && (
        <div style={{ paddingTop: 0 }}>
          <AdiyaBrowser onBack={() => handleTabChange("home")} />
          <div style={{ height: 80 }} />
        </div>
      )}

      {/* Qibla Compass */}
      {showQibla && (
        <div style={{ paddingTop: 0 }}>
          <QiblaCompass onBack={() => handleTabChange("home")} />
          <div style={{ height: 80 }} />
        </div>
      )}

      {/* Adhan Reminder Settings */}
      {showAdhan && (
        <div style={{ paddingTop: 0 }}>
          <AppHeader activeTab={activeTab} onNavigate={handleTabChange} onInstall={() => setInstallOpen(true)} />
          <div style={{ height: 62 }} />
          <AdhanSettings />
          <div style={{ height: 80 }} />
        </div>
      )}

      {/* Hijri Calendar */}
      {showCalendar && (
        <div style={{ paddingTop: 0 }}>
          <HijriCalendar onBack={() => handleTabChange("home")} />
          <div style={{ height: 80 }} />
        </div>
      )}

      {/* Asma al-Husna (99 Names of Allah) */}
      {showAsma && (
        <div style={{ paddingTop: 0 }}>
          <AsmaHusna onBack={() => handleTabChange("home")} />
          <div style={{ height: 80 }} />
        </div>
      )}

      {/* Full Islamic History */}
      {showHistory && (
        <div style={{ paddingTop: 0 }}>
          <HistoryBrowser onBack={() => handleTabChange("home")} />
          <div style={{ height: 80 }} />
        </div>
      )}

      {/* Prophets and Messengers */}
      {showProphets && (
        <div style={{ paddingTop: 0 }}>
          <ProphetsBrowser onBack={() => handleTabChange("home")} />
          <div style={{ height: 80 }} />
        </div>
      )}

      {/* Dawah — Inviting to Islam */}
      {showDawah && (
        <div style={{ paddingTop: 0 }}>
          <DawahBrowser onBack={() => handleTabChange("home")} />
          <div style={{ height: 80 }} />
        </div>
      )}

      {/* Tafsir — simplified exegesis of the Quran */}
      {showTafsir && (
        <div style={{ paddingTop: 0 }}>
          <TafsirBrowser onBack={() => handleTabChange("home")} />
          <div style={{ height: 80 }} />
        </div>
      )}

      {/* Fiqh — Islamic jurisprudence rulings */}
      {showFiqh && (
        <div style={{ paddingTop: 0 }}>
          <FiqhBrowser onBack={() => handleTabChange("home")} />
          <div style={{ height: 80 }} />
        </div>
      )}

      {/* Ramadan & Hajj/Umrah practical guides */}
      {showRamadan && (
        <div style={{ paddingTop: 0 }}>
          <RamadanHajjGuide onBack={() => handleTabChange("home")} />
          <div style={{ height: 80 }} />
        </div>
      )}

      {/* Prayer Times — full schedule + countdown */}
      {showPrayer && (
        <div style={{ paddingTop: 0 }}>
          <PrayerTimesScreen onBack={() => handleTabChange("home")} onOpenAdhan={() => handleTabChange("adhan")} />
          <div style={{ height: 80 }} />
        </div>
      )}

      {/* Sermons & Exhortations — world scholars */}
      {showSermons && (
        <div style={{ paddingTop: 0 }}>
          <SermonsBrowser onBack={() => handleTabChange("home")} />
          <div style={{ height: 80 }} />
        </div>
      )}

      {showMawareth && (
        <div style={{ paddingTop: 0 }}>
          <MawarethCalculator onBack={() => handleTabChange("home")} />
          <div style={{ height: 80 }} />
        </div>
      )}

      {/* Seerah of the Prophet */}
      {showSeerah && (
        <div style={{ paddingTop: 0 }}>
          <SeerahBrowser onBack={() => handleTabChange("home")} />
          <div style={{ height: 80 }} />
        </div>
      )}

      {/* Islamic Glossary */}
      {showGlossary && (
        <div style={{ paddingTop: 0 }}>
          <GlossaryBrowser onBack={() => handleTabChange("home")} />
          <div style={{ height: 80 }} />
        </div>
      )}

      {/* Zakat Calculator */}
      {showZakat && (
        <div style={{ paddingTop: 0 }}>
          <ZakatCalculator onBack={() => handleTabChange("home")} />
          <div style={{ height: 80 }} />
        </div>
      )}

      {/* Nearby Mosques */}
      {showMosques && (
        <div style={{ paddingTop: 0 }}>
          <MosqueFinder onBack={() => handleTabChange("home")} />
          <div style={{ height: 80 }} />
        </div>
      )}

      {/* Dhikr tab — counter + full Azkar library */}
      {activeTab === "dhikr" && (
        <div style={{ paddingTop: 0 }}>
          <div style={{ height: 20 }} />
          <DhikrCounter />
          <div className="px-6 py-1">
            <div className="flex items-center gap-3">
              <div className="ornament-line flex-1" />
              <svg width="10" height="10" viewBox="0 0 16 16">
                <polygon points="8,1 15,8 8,15 1,8" fill="none" stroke="#C9A84C" strokeWidth="1" opacity="0.25" />
              </svg>
              <div className="ornament-line flex-1" />
            </div>
          </div>
          <AzkarBrowser onBack={() => handleTabChange("home")} />
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
      <InstallAppSheet isOpen={installOpen} onClose={() => setInstallOpen(false)} />
    </div>
  );
}
