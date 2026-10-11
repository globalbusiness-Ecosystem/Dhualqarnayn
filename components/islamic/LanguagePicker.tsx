"use client";

import { useLanguage } from "@/contexts/language-context";
import { LOCALES } from "@/lib/i18n";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function LanguagePicker({ isOpen, onClose }: Props) {
  const { locale, setLocale, t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center"
      style={{ background: "rgba(1,3,9,0.86)" }}
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-3xl overflow-hidden"
        style={{
          maxWidth: 480,
          maxHeight: "78vh",
          background: "linear-gradient(180deg, #0D2034 0%, #060E18 100%)",
          border: "1px solid rgba(201,168,76,0.16)",
          borderBottom: "none",
          boxShadow: "0 -16px 48px rgba(0,0,0,0.85)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center pt-3 pb-1">
          <div style={{ width: 36, height: 4, borderRadius: 4, background: "rgba(201,168,76,0.3)" }} />
        </div>

        <div className="px-5 pt-2 pb-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(201,168,76,0.09)" }}>
          <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#C9A84C", fontSize: 15, fontWeight: 700 }}>
            {t("choose_language")}
          </p>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl active:scale-90 transition-transform"
            style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.12)", color: "#8A7858", fontSize: 12 }}
            aria-label={t("close")}
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto no-scrollbar px-3 py-2" style={{ maxHeight: "52vh" }}>
          {LOCALES.map((l) => {
            const isActive = l.code === locale;
            return (
              <button
                key={l.code}
                onClick={() => {
                  setLocale(l.code);
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl mb-1 active:scale-[0.98] transition-all"
                style={{
                  background: isActive ? "rgba(201,168,76,0.1)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${isActive ? "rgba(201,168,76,0.3)" : "rgba(201,168,76,0.08)"}`,
                }}
                dir={l.dir}
              >
                <span style={{ fontSize: 22 }}>{l.flag}</span>
                <div className="flex-1 text-start">
                  <p style={{ fontFamily: "'Tajawal', sans-serif", color: isActive ? "#C9A84C" : "#C0A878", fontSize: 14, fontWeight: isActive ? 700 : 500 }}>
                    {l.nativeName}
                  </p>
                  <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 10.5, marginTop: 1 }}>
                    {l.englishName}
                  </p>
                </div>
                {isActive && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>

        <div className="px-5 py-4" style={{ borderTop: "1px solid rgba(201,168,76,0.09)" }}>
          <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 10.5, lineHeight: 1.7, textAlign: "center" }}>
            {t("language_note")}
          </p>
        </div>
      </div>
    </div>
  );
}
