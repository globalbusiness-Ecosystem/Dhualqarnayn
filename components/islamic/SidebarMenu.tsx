"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import { getLocaleInfo } from "@/lib/i18n";
import LanguagePicker from "./LanguagePicker";
import { useThemeMode, type ThemeMode } from "@/contexts/theme-mode-context";

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (tab: string) => void;
  onInstall?: () => void;
  activeTab?: string;
}

export default function SidebarMenu({ isOpen, onClose, onNavigate, onInstall, activeTab }: SidebarMenuProps) {
  const { t, locale } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  const info = getLocaleInfo(locale);
  const { mode, setMode } = useThemeMode();
  const [shareOpen, setShareOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const SHARE_TEXT = "ذو القرنين - بوابتك الإسلامية الشاملة";
  const getShareUrl = () => (typeof window !== "undefined" ? window.location.origin : "");
  const handleShareApp = async () => {
    const url = getShareUrl();
    const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
    if (nav.share) {
      try {
        await nav.share({ title: "ذو القرنين", text: SHARE_TEXT, url });
        return;
      } catch (err: any) {
        if (err?.name === "AbortError") return;
      }
    }
    setShareOpen((v) => !v);
  };
  const copyShareLink = async () => {
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };
  const shareLinks = [
    { name: "واتساب", href: "https://wa.me/?text=" + encodeURIComponent(SHARE_TEXT + " " + getShareUrl()) },
    { name: "تيليجرام", href: "https://t.me/share/url?url=" + encodeURIComponent(getShareUrl()) + "&text=" + encodeURIComponent(SHARE_TEXT) },
    { name: "فيسبوك", href: "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(getShareUrl()) },
    { name: "X", href: "https://twitter.com/intent/tweet?url=" + encodeURIComponent(getShareUrl()) + "&text=" + encodeURIComponent(SHARE_TEXT) },
  ];


  const MODE_OPTIONS: { key: ThemeMode; label: string; icon: string }[] = [
    { key: "auto",  label: t("theme_auto"),  icon: "◐" },
    { key: "day",   label: t("theme_day"),   icon: "☀" },
    { key: "night", label: t("theme_night"), icon: "☾" },
  ];

  const ITEMS = [
    { key: "quran",    label: t("menu_quran"),    sub: t("menu_quran_sub"),    accent: "#C9A84C" },
    { key: "hadith",   label: t("menu_hadith"),   sub: t("menu_hadith_sub"),   accent: "#228B4A" },
    { key: "prayer",   label: t("menu_prayer"),   sub: t("menu_prayer_sub"),   accent: "#C9A84C" },
    { key: "qibla",    label: t("menu_qibla"),    sub: t("menu_qibla_sub"),    accent: "#228B4A" },
    { key: "adhan",    label: t("menu_adhan"),    sub: t("menu_adhan_sub"),    accent: "#228B4A" },
    { key: "zakat",    label: t("menu_zakat"),    sub: t("menu_zakat_sub"),    accent: "#228B4A" },
    { key: "mosques",  label: t("menu_mosques"),  sub: t("menu_mosques_sub"),  accent: "#228B4A" },
    { key: "tafsir",   label: t("menu_tafsir"),   sub: t("menu_tafsir_sub"),   accent: "#C9A84C" },
    { key: "fiqh",     label: t("menu_fiqh"),     sub: t("menu_fiqh_sub"),     accent: "#228B4A" },
    { key: "ramadan",  label: t("menu_ramadan"),  sub: t("menu_ramadan_sub"),  accent: "#C9A84C" },
    { key: "sermons",  label: t("menu_sermons"),  sub: t("menu_sermons_sub"),  accent: "#228B4A" },
    { key: "mawareth", label: t("menu_mawareth"), sub: t("menu_mawareth_sub"), accent: "#C9A84C" },
    { key: "seerah",   label: t("menu_seerah"),   sub: t("menu_seerah_sub"),   accent: "#228B4A" },
    { key: "glossary", label: t("menu_glossary"), sub: t("menu_glossary_sub"), accent: "#C9A84C" },
    { key: "dhikr",    label: t("menu_dhikr"),    sub: t("menu_dhikr_sub"),    accent: "#C9A84C" },
    { key: "duas",     label: t("menu_duas"),     sub: t("menu_duas_sub"),     accent: "#228B4A" },
    { key: "asma",     label: t("menu_asma"),     sub: t("menu_asma_sub"),     accent: "#C9A84C" },
    { key: "prophets", label: t("menu_prophets"), sub: t("menu_prophets_sub"), accent: "#C9A84C" },
    { key: "history",  label: t("menu_history"),  sub: t("menu_history_sub"),  accent: "#228B4A" },
    { key: "dawah",    label: t("menu_dawah"),    sub: t("menu_dawah_sub"),    accent: "#228B4A" },
    { key: "cal",      label: t("menu_cal"),      sub: t("menu_cal_sub"),      accent: "#C9A84C" },
    { key: "more",     label: t("menu_settings"), sub: t("menu_settings_sub"), accent: "#7A6030" },
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50"
          style={{ background: "rgba(1,3,9,0.84)" }}
          onClick={onClose}
        />
      )}
      <aside className="fixed top-0 right-0 h-full z-50 flex flex-col"
        style={{
          width: 286,
          background: "linear-gradient(155deg, #0D2034 0%, #060E18 100%)",
          borderLeft: "1px solid rgba(201,168,76,0.14)",
          transform: isOpen ? "translateX(0)" : "translateX(110%)",
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: isOpen ? "-16px 0 48px rgba(0,0,0,0.85)" : "none",
        }}>
        {/* Header */}
        <div className="px-5 pt-7 pb-4" style={{ borderBottom: "1px solid rgba(201,168,76,0.09)" }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <div style={{ width: 20, height: 1, background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.45))" }}/>
                <svg width="6" height="6" viewBox="0 0 10 10">
                  <polygon points="5,0.8 6.2,3.8 9.8,4 7,6.2 8,9.5 5,7.8 2,9.5 3,6.2 0.2,4 3.8,3.8" fill="#C9A84C" opacity="0.65"/>
                </svg>
                <div style={{ width: 20, height: 1, background: "linear-gradient(90deg, rgba(201,168,76,0.45), transparent)" }}/>
              </div>
              <p style={{ fontFamily: "'Amiri', serif", color: "#C9A84C", fontSize: 22, fontWeight: 700, lineHeight: 1.2 }}>
                ذو القرنين
              </p>
              <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#8A7858", fontSize: 10, marginTop: 2 }}>
                {t("menu_title")}
              </p>
            </div>
            <button onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-xl active:scale-90 transition-transform"
              style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.12)", color: "#8A7858", fontSize: 13 }}>
              ✕
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 no-scrollbar">
          {ITEMS.map((item) => {
            const isActive = activeTab === item.key;
            return (
              <button key={item.key}
                onClick={() => { onNavigate?.(item.key); onClose(); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-right transition-all active:scale-95"
                style={{
                  background: isActive ? `${item.accent}0E` : "transparent",
                  border: `1px solid ${isActive ? `${item.accent}22` : "transparent"}`,
                }}>
                <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0"
                  style={{
                    background: isActive ? `${item.accent}10` : "rgba(255,255,255,0.02)",
                    border: `1px solid ${isActive ? `${item.accent}1E` : "rgba(201,168,76,0.06)"}`,
                  }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: isActive ? item.accent : "rgba(201,168,76,0.25)" }}/>
                </div>
                <div className="flex-1 text-right">
                  <p style={{
                    fontFamily: "'Tajawal', sans-serif",
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? item.accent : "#9A8870",
                    fontSize: 13,
                  }}>
                    {item.label}
                  </p>
                  <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 10, marginTop: 1 }}>
                    {item.sub}
                  </p>
                </div>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ opacity: isActive ? 0.5 : 0.2, flexShrink: 0 }}>
                  <path d="M15 18l-6-6 6-6" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            );
          })}

          {/* Day/Night mode toggle */}
          <div className="px-3 pt-3 pb-1">
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 10, marginBottom: 6 }}>
              {t("theme_label")}
            </p>
            <div className="flex items-center gap-1.5 rounded-xl p-1"
              style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.1)" }}>
              {MODE_OPTIONS.map((opt) => {
                const active = mode === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => setMode(opt.key)}
                    className="flex-1 flex flex-col items-center gap-0.5 py-2 rounded-lg transition-all active:scale-95"
                    style={{
                      background: active ? "rgba(201,168,76,0.14)" : "transparent",
                      border: `1px solid ${active ? "rgba(201,168,76,0.3)" : "transparent"}`,
                    }}
                  >
                    <span style={{ fontSize: 14, color: active ? "#C9A84C" : "#6A5A48" }}>{opt.icon}</span>
                    <span style={{
                      fontFamily: "'Tajawal', sans-serif",
                      fontSize: 9.5,
                      color: active ? "#C9A84C" : "#6A5A48",
                      fontWeight: active ? 700 : 400,
                    }}>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language switcher */}
          <button
            onClick={() => setLangOpen(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mt-1 text-right transition-all active:scale-95"
            style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.13)" }}
          >
            <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0"
              style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.16)", fontSize: 14 }}>
              {info.flag}
            </div>
            <div className="flex-1 text-right">
              <p style={{ fontFamily: "'Tajawal', sans-serif", fontWeight: 500, color: "#C9A84C", fontSize: 13 }}>
                {t("menu_language")}
              </p>
              <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 10, marginTop: 1 }}>
                {info.nativeName}
              </p>
            </div>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.3, flexShrink: 0 }}>
              <path d="M15 18l-6-6 6-6" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Install app */}
          <button
            onClick={() => { onInstall?.(); onClose(); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mt-1.5 text-right transition-all active:scale-95"
            style={{ background: "rgba(27,107,58,0.1)", border: "1px solid rgba(27,107,58,0.26)" }}
          >
            <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0"
              style={{ background: "rgba(27,107,58,0.18)", border: "1px solid rgba(27,107,58,0.32)" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M12 4v12M7 12l5 5 5-5M5 20h14" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex-1 text-right">
              <p style={{ fontFamily: "'Tajawal', sans-serif", fontWeight: 600, color: "#4ADE80", fontSize: 13 }}>
                {t("menu_install")}
              </p>
              <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#5A9A6A", fontSize: 10, marginTop: 1 }}>
                {t("menu_install_sub")}
              </p>
            </div>
          </button>

          {/* Share app */}
          <button
            onClick={handleShareApp}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mt-1.5 text-right transition-all active:scale-95"
            style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.26)" }}
          >
            <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0"
              style={{ background: "rgba(201,168,76,0.16)", border: "1px solid rgba(201,168,76,0.32)" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98" />
              </svg>
            </div>
            <div className="flex-1 text-right">
              <p style={{ fontFamily: "'Tajawal', sans-serif", fontWeight: 600, color: "#C9A84C", fontSize: 13 }}>
                مشاركة التطبيق
              </p>
              <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#8A7858", fontSize: 10, marginTop: 1 }}>
                شارك ذو القرنين مع أصدقائك
              </p>
            </div>
          </button>
          {shareOpen && (
            <div className="grid grid-cols-2 gap-2 mt-2" dir="rtl">
              {shareLinks.map((l) => (
                <a
                  key={l.name}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 rounded-xl text-center active:scale-95 transition-transform"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,168,76,0.18)", textDecoration: "none" }}
                >
                  <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#C9A84C", fontSize: 12 }}>{l.name}</span>
                </a>
              ))}
              <button
                onClick={copyShareLink}
                className="col-span-2 py-2.5 rounded-xl text-center active:scale-95 transition-transform"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,168,76,0.18)" }}
              >
                <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#C9A84C", fontSize: 12 }}>
                  {shareCopied ? "تم النسخ ✓" : "نسخ الرابط"}
                </span>
              </button>
            </div>
          )}
        </nav>

        {/* Pi Network badge */}
        <div className="mx-4 mb-8">
          <div className="py-3 px-4 rounded-2xl flex items-center gap-3"
            style={{
              background: "linear-gradient(135deg, rgba(27,107,58,0.14), rgba(6,11,20,0.97))",
              border: "1px solid rgba(27,107,58,0.28)",
            }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(27,107,58,0.2)",
                border: "1px solid rgba(27,107,58,0.38)",
                color: "#4ADE80", fontSize: 18, fontWeight: 700, fontFamily: "serif",
              }}>π</div>
            <div className="flex-1">
              <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#4ADE80", fontSize: 12, fontWeight: 600 }}>Pi Network</p>
              <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#5A9A6A", fontSize: 10 }}>{t("pi_available")}</p>
            </div>
            <span className="live-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ADE80", boxShadow: "0 0 6px #4ADE80", display: "block" }}/>
          </div>
        </div>
      </aside>

      <LanguagePicker isOpen={langOpen} onClose={() => setLangOpen(false)} />
    </>
  );
}
