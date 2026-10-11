"use client";

import { useState, useMemo } from "react";
import { DAWAH_SECTIONS, type DawahItem } from "@/lib/dawah-data";
import { useLanguage } from "@/contexts/language-context";
import ShareButton from "./ShareButton";

interface Props {
  onBack: () => void;
}

export default function DawahBrowser({ onBack }: Props) {
  const { locale } = useLanguage();
  const isAr = locale === "ar";
  const [sectionId, setSectionId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const section = DAWAH_SECTIONS.find((s) => s.id === sectionId) || null;

  const filteredItems = useMemo(() => {
    if (!section) return [];
    if (!query.trim()) return section.items;
    const q = query.trim().toLowerCase();
    return section.items.filter(
      (it) =>
        it.title.includes(query) ||
        it.titleEn.toLowerCase().includes(q) ||
        it.body.includes(query) ||
        it.bodyEn.toLowerCase().includes(q)
    );
  }, [section, query]);

  return (
    <div style={{ minHeight: "100vh", background: "#050C16" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-30 px-4 pt-5 pb-4"
        style={{
          background: "linear-gradient(180deg, #0D2034 0%, rgba(13,32,52,0.97) 85%, transparent)",
          borderBottom: "1px solid rgba(201,168,76,0.1)",
        }}
      >
        <div className="flex items-center gap-3 mb-1">
          <button
            onClick={() => (section ? setSectionId(null) : onBack())}
            className="w-9 h-9 flex items-center justify-center rounded-xl active:scale-90 transition-transform flex-shrink-0"
            style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.18)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="#C9A84C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" transform="scale(-1,1) translate(-24,0)" />
            </svg>
          </button>
          <div className="flex-1">
            <p style={{ fontFamily: "'Amiri', serif", color: "#C9A84C", fontSize: 18, fontWeight: 700 }}>
              {section ? (isAr ? section.title : section.titleEn) : isAr ? "الدعوة إلى الله" : "Dawah — Inviting to Allah"}
            </p>
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 10, marginTop: 1 }}>
              {section ? `${filteredItems.length} ${isAr ? "عنصراً" : "items"}` : isAr ? "مكتبة شاملة لدعوة غير المسلمين والتعريف بالإسلام" : "A full library for introducing Islam and inviting others"}
            </p>
          </div>
        </div>

        {section && (
          <div className="mt-3 relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isAr ? "ابحث..." : "Search..."}
              dir={isAr ? "rtl" : "ltr"}
              className="w-full rounded-xl px-4 py-2.5 outline-none"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(201,168,76,0.16)",
                color: "#F5ECD7",
                fontFamily: "'Tajawal', sans-serif",
                fontSize: 13,
              }}
            />
          </div>
        )}
      </div>

      {/* Section list */}
      {!section && (
        <div className="px-4 py-4">
          {/* Intro banner */}
          <div
            className="rounded-2xl p-4 mb-4"
            style={{
              background: "linear-gradient(135deg, rgba(27,107,58,0.14), rgba(13,27,42,0.9))",
              border: "1px solid rgba(27,107,58,0.3)",
            }}
          >
            <p style={{ fontFamily: "'Amiri', serif", color: "#4ADE80", fontSize: 14, lineHeight: 1.9, textAlign: isAr ? "right" : "left" }}>
              {isAr
                ? "ادعُ إلى سبيل ربك بالحكمة والموعظة الحسنة"
                : "Invite to the way of your Lord with wisdom and good instruction"}
            </p>
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#5A9A6A", fontSize: 10, marginTop: 4, textAlign: isAr ? "right" : "left" }}>
              {isAr ? "سورة النحل: ١٢٥" : "Surah An-Nahl: 125"}
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            {DAWAH_SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSectionId(s.id)}
                className="flex items-center gap-3 rounded-2xl p-4 text-right active:scale-[0.98] transition-transform"
                style={{
                  background: "linear-gradient(145deg, rgba(14,24,40,0.75), rgba(9,16,28,0.88))",
                  border: "1px solid rgba(201,168,76,0.1)",
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", fontSize: 20 }}
                >
                  {s.icon}
                </div>
                <div className="flex-1 text-right">
                  <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#F5ECD7", fontSize: 13.5, fontWeight: 700 }}>
                    {isAr ? s.title : s.titleEn}
                  </p>
                  <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#7A6A50", fontSize: 10.5, marginTop: 2 }}>
                    {isAr ? s.intro : s.introEn}
                  </p>
                </div>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.3, flexShrink: 0 }}>
                  <path d="M15 18l-6-6 6-6" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Items list within a section */}
      {section && (
        <div className="px-4 py-4 flex flex-col gap-3">
          {filteredItems.map((item) => (
            <DawahCard key={item.id} item={item} isAr={isAr} />
          ))}
          {filteredItems.length === 0 && (
            <p
              className="text-center py-10"
              style={{ fontFamily: "'Tajawal', sans-serif", color: "#5A4830", fontSize: 12 }}
            >
              {isAr ? "لا توجد نتائج" : "No results found"}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function DawahCard({ item, isAr }: { item: DawahItem; isAr: boolean }) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "linear-gradient(145deg, rgba(14,24,40,0.75), rgba(9,16,28,0.88))",
        border: "1px solid rgba(201,168,76,0.1)",
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#C9A84C", fontSize: 13.5, fontWeight: 700, flex: 1 }}>
          {isAr ? item.title : item.titleEn}
        </p>
        <ShareButton
          compact
          data={{
            kindLabel: isAr ? "الدعوة إلى الله" : "Dawah",
            arabicText: item.title,
            translation: isAr ? item.body : item.bodyEn,
            footer: item.ref || "ذو القرنين",
          }}
        />
      </div>
      <p
        style={{
          fontFamily: isAr ? "'Amiri', serif" : "'Tajawal', sans-serif",
          color: "#D8CBAE",
          fontSize: isAr ? 14 : 12.5,
          lineHeight: 1.9,
          textAlign: isAr ? "right" : "left",
        }}
        dir={isAr ? "rtl" : "ltr"}
      >
        {isAr ? item.body : item.bodyEn}
      </p>
      {item.ref && (
        <p
          className="mt-2.5 pt-2.5"
          style={{
            fontFamily: "'Tajawal', sans-serif",
            color: "#228B4A",
            fontSize: 10.5,
            borderTop: "1px solid rgba(201,168,76,0.08)",
            textAlign: isAr ? "right" : "left",
          }}
        >
          {item.ref}
        </p>
      )}
    </div>
  );
}
