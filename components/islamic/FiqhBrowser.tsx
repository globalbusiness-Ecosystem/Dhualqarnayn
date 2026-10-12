"use client";

import { useMemo, useState } from "react";
import { FIQH_CATEGORIES, FIQH_DATA, type FiqhEntry } from "@/lib/fiqh-data";
import { useLanguage } from "@/contexts/language-context";
import ShareButton from "./ShareButton";
import VoiceSearchButton from "./VoiceSearchButton";

interface Props {
  onBack: () => void;
}

export default function FiqhBrowser({ onBack }: Props) {
  const { locale } = useLanguage();
  const isAr = locale === "ar";
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [selected, setSelected] = useState<FiqhEntry | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FIQH_DATA.filter((e) => {
      if (categoryId && e.categoryId !== categoryId) return false;
      if (!q) return true;
      return (
        e.questionAr.includes(query.trim()) ||
        e.questionEn.toLowerCase().includes(q) ||
        e.rulingAr.includes(query.trim())
      );
    });
  }, [query, categoryId]);

  const activeCategory = categoryId ? FIQH_CATEGORIES.find((c) => c.id === categoryId) : null;

  // ===== Detail view =====
  if (selected) {
    return (
      <div style={{ minHeight: "100vh", paddingBottom: 20 }}>
        <header className="sticky top-0 z-20 px-4 py-3 flex items-center gap-3"
          style={{ background: "rgba(5,12,22,0.96)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
          <button onClick={() => setSelected(null)}
            className="w-9 h-9 flex items-center justify-center rounded-xl active:scale-90"
            style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.15)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="scale(-1,1) translate(-24,0)"/>
            </svg>
          </button>
          <div className="flex-1">
            <p className="line-clamp-1" style={{ fontFamily: "'Tajawal', sans-serif", color: "#C9A84C", fontSize: 14, fontWeight: 700 }}>
              {isAr ? "حكم شرعي" : "Islamic Ruling"}
            </p>
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 10 }}>
              {isAr ? FIQH_CATEGORIES.find((c) => c.id === selected.categoryId)?.nameAr : FIQH_CATEGORIES.find((c) => c.id === selected.categoryId)?.nameEn}
            </p>
          </div>
        </header>

        <div className="px-4 py-5">
          <div className="rounded-2xl p-5 mb-4"
            style={{ background: "linear-gradient(145deg, rgba(14,24,40,0.75), rgba(9,16,28,0.9))", border: "1px solid rgba(201,168,76,0.14)" }}>
            <p style={{ fontFamily: "'Amiri', serif", color: "#F5ECD7", fontSize: 18, fontWeight: 700, lineHeight: 1.6, textAlign: isAr ? "right" : "left" }}>
              {isAr ? selected.questionAr : selected.questionEn}
            </p>
          </div>

          <div className="flex items-center justify-center mb-4">
            <span className="px-4 py-2 rounded-full text-center"
              style={{
                background: "rgba(27,107,58,0.1)",
                border: "1px solid rgba(27,107,58,0.3)",
                fontFamily: "'Tajawal', sans-serif",
                color: "#4ADE80",
                fontSize: 13,
                fontWeight: 700,
              }}>
              {isAr ? selected.rulingAr : selected.rulingEn}
            </span>
          </div>

          <div className="rounded-2xl p-4" style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.16)" }}>
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#B8A074", fontSize: 10, marginBottom: 8, fontWeight: 600 }}>
              {isAr ? "التفصيل" : "Details"}
            </p>
            <p style={{ fontFamily: "'Amiri', serif", color: "#F5ECD7", fontSize: 15, lineHeight: 2, textAlign: "right" }}>
              {selected.detailAr}
            </p>
            {!isAr && (
              <p className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(201,168,76,0.12)", fontFamily: "'Tajawal', sans-serif", color: "#C9B894", fontSize: 13, lineHeight: 1.8 }}>
                {selected.detailEn}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 mt-4 px-1">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.4, flexShrink: 0 }}>
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#C9A84C" strokeWidth="1.6"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="#C9A84C" strokeWidth="1.6"/>
            </svg>
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 11 }}>
              {isAr ? selected.sourceAr : selected.sourceEn}
            </p>
          </div>

          <div className="mt-4">
            <ShareButton
              label={isAr ? "مشاركة كصورة" : "Share as image"}
              data={{
                kindLabel: isAr ? "حكم شرعي" : "Islamic Ruling",
                arabicText: `${selected.questionAr}\n\n${selected.rulingAr}: ${selected.detailAr}`,
                translation: !isAr ? `${selected.rulingEn}: ${selected.detailEn}` : undefined,
                footer: isAr ? selected.sourceAr : selected.sourceEn,
              }}
            />
          </div>

          <p className="text-center mt-5 px-2" style={{ fontFamily: "'Tajawal', sans-serif", color: "#5A4830", fontSize: 10, lineHeight: 1.7 }}>
            {isAr
              ? "هذه المعلومة تعليمية عامة ولا تُعدّ فتوى شخصية — للحالات الفردية يُرجى الرجوع إلى عالم موثوق."
              : "This is general educational information, not a personal fatwa — for individual cases, please consult a trusted scholar."}
          </p>
        </div>
      </div>
    );
  }

  // ===== Category list within a category =====
  if (activeCategory) {
    return (
      <div style={{ minHeight: "100vh" }}>
        <header className="sticky top-0 z-20 px-4 py-3" style={{ background: "rgba(5,12,22,0.96)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setCategoryId(null)}
              className="w-9 h-9 flex items-center justify-center rounded-xl active:scale-90"
              style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.15)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="scale(-1,1) translate(-24,0)"/>
              </svg>
            </button>
            <div>
              <p style={{ fontFamily: "'Amiri', serif", color: "#C9A84C", fontSize: 17, fontWeight: 700 }}>
                {isAr ? activeCategory.nameAr : activeCategory.nameEn}
              </p>
              <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 10 }}>
                {filtered.length} {isAr ? "مسألة" : "rulings"}
              </p>
            </div>
          </div>
        </header>

        <div className="px-4 py-3">
          {filtered.length === 0 ? (
            <p className="text-center py-10" style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 13 }}>
              {isAr ? "لا توجد نتائج" : "No results"}
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {filtered.map((e) => (
                <button key={e.id} onClick={() => setSelected(e)}
                  className="w-full p-3.5 rounded-2xl text-right active:scale-95"
                  style={{ background: "linear-gradient(145deg, rgba(14,24,40,0.6), rgba(9,16,28,0.8))", border: "1px solid rgba(201,168,76,0.08)" }}>
                  <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#F5ECD7", fontSize: 13, fontWeight: 600, lineHeight: 1.6 }}>
                    {isAr ? e.questionAr : e.questionEn}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="px-2 py-0.5 rounded-full" style={{ background: "rgba(27,107,58,0.1)", border: "1px solid rgba(27,107,58,0.25)", fontFamily: "'Tajawal', sans-serif", fontSize: 9.5, color: "#4ADE80" }}>
                      {isAr ? e.rulingAr : e.rulingEn}
                    </span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.25 }}>
                      <path d="M15 18l-6-6 6-6" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          )}
          <div style={{ height: 20 }} />
        </div>
      </div>
    );
  }

  // ===== Category grid (home) =====
  return (
    <div style={{ minHeight: "100vh" }}>
      <header className="sticky top-0 z-20 px-4 py-3" style={{ background: "rgba(5,12,22,0.96)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
        <div className="flex items-center gap-3 mb-3">
          <button onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-xl active:scale-90"
            style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.15)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="scale(-1,1) translate(-24,0)"/>
            </svg>
          </button>
          <div>
            <p style={{ fontFamily: "'Amiri', serif", color: "#C9A84C", fontSize: 18, fontWeight: 700 }}>
              {isAr ? "الفقه الإسلامي" : "Islamic Jurisprudence"}
            </p>
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 10 }}>
              {isAr ? "أحكام العبادات والمعاملات" : "Worship & daily life rulings"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl px-3 py-2"
          style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.14)" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.4, flexShrink: 0 }}>
            <circle cx="11" cy="11" r="7" stroke="#C9A84C" strokeWidth="2"/>
            <path d="M21 21l-4.3-4.3" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isAr ? "ابحث عن مسألة فقهية..." : "Search a ruling..."}
            className="flex-1 bg-transparent outline-none"
            style={{ fontFamily: "'Tajawal', sans-serif", color: "#F5ECD7", fontSize: 13 }}
          />
          <VoiceSearchButton onResult={(text) => setQuery(text)} />
        </div>
      </header>

      <div className="px-4 py-4">
        {query.trim() ? (
          filtered.length === 0 ? (
            <p className="text-center py-10" style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 13 }}>
              {isAr ? "لا توجد نتائج" : "No results"}
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {filtered.map((e) => (
                <button key={e.id} onClick={() => setSelected(e)}
                  className="w-full p-3.5 rounded-2xl text-right active:scale-95"
                  style={{ background: "linear-gradient(145deg, rgba(14,24,40,0.6), rgba(9,16,28,0.8))", border: "1px solid rgba(201,168,76,0.08)" }}>
                  <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#F5ECD7", fontSize: 13, fontWeight: 600, lineHeight: 1.6 }}>
                    {isAr ? e.questionAr : e.questionEn}
                  </p>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded-full" style={{ background: "rgba(27,107,58,0.1)", border: "1px solid rgba(27,107,58,0.25)", fontFamily: "'Tajawal', sans-serif", fontSize: 9.5, color: "#4ADE80" }}>
                    {isAr ? e.rulingAr : e.rulingEn}
                  </span>
                </button>
              ))}
            </div>
          )
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
            {FIQH_CATEGORIES.map((c) => {
              const count = FIQH_DATA.filter((e) => e.categoryId === c.id).length;
              return (
                <button key={c.id} onClick={() => setCategoryId(c.id)}
                  className="text-right rounded-2xl p-4 active:scale-95"
                  style={{ background: "linear-gradient(145deg, rgba(14,24,40,0.75), rgba(9,16,28,0.88))", border: "1px solid rgba(201,168,76,0.09)" }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2.5"
                    style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}>
                    <span style={{ fontFamily: "'Amiri', serif", color: "#C9A84C", fontSize: 15, fontWeight: 700 }}>
                      {(isAr ? c.nameAr : c.nameEn).charAt(0)}
                    </span>
                  </div>
                  <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#F5ECD7", fontSize: 13, fontWeight: 700 }}>
                    {isAr ? c.nameAr : c.nameEn}
                  </p>
                  <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 10, marginTop: 2 }}>
                    {count} {isAr ? "مسألة" : "rulings"}
                  </p>
                </button>
              );
            })}
          </div>
        )}
        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}
