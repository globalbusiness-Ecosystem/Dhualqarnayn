"use client";

import { useState, useMemo } from "react";
import { SERMON_CATEGORIES, WORLD_SCHOLARS, type Sermon } from "@/lib/sermons-data";
import ShareButton from "./ShareButton";

interface Props {
  onBack: () => void;
}

type View = "categories" | "list" | "detail" | "scholars";

export default function SermonsBrowser({ onBack }: Props) {
  const [view, setView] = useState<View>("categories");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [sermon, setSermon] = useState<Sermon | null>(null);
  const [query, setQuery] = useState("");

  const category = SERMON_CATEGORIES.find((c) => c.id === categoryId) || null;

  const filteredScholars = useMemo(() => {
    if (!query.trim()) return WORLD_SCHOLARS;
    const q = query.trim();
    return WORLD_SCHOLARS.filter(
      (s) => s.name.includes(q) || s.country.includes(q) || s.bio.includes(q)
    );
  }, [query]);

  const handleBackButton = () => {
    if (view === "detail") {
      setView("list");
      setSermon(null);
    } else if (view === "list" || view === "scholars") {
      setView("categories");
      setCategoryId(null);
      setQuery("");
    } else {
      onBack();
    }
  };

  const title =
    view === "detail" ? sermon?.title :
    view === "list" ? category?.label :
    view === "scholars" ? "علماء عالميون" :
    "الخطب والوعظ";

  const sub =
    view === "detail" ? category?.label :
    view === "list" ? `${category?.sermons.length ?? 0} خطبة` :
    view === "scholars" ? "استمع إلى محاضراتهم الأصلية" :
    "خطب ومواضيع للوعظ والتذكير";

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
        <div className="flex items-center gap-3">
          <button
            onClick={handleBackButton}
            className="w-9 h-9 flex items-center justify-center rounded-xl active:scale-90 transition-transform flex-shrink-0"
            style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.18)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="#C9A84C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" transform="scale(-1,1) translate(-24,0)" />
            </svg>
          </button>
          <div className="flex-1">
            <p style={{ fontFamily: "'Amiri', serif", color: "#C9A84C", fontSize: 17, fontWeight: 700, lineHeight: 1.3 }}>
              {title}
            </p>
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 10, marginTop: 1 }}>
              {sub}
            </p>
          </div>
        </div>

        {view === "scholars" && (
          <div className="mt-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث عن شيخ أو بلد..."
              dir="rtl"
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

      {/* Categories view */}
      {view === "categories" && (
        <div className="px-4 py-4">
          <div
            className="rounded-2xl p-4 mb-4"
            style={{
              background: "linear-gradient(135deg, rgba(201,168,76,0.12), rgba(13,27,42,0.9))",
              border: "1px solid rgba(201,168,76,0.28)",
            }}
          >
            <p style={{ fontFamily: "'Amiri', serif", color: "#C9A84C", fontSize: 14, lineHeight: 1.9, textAlign: "right" }}>
              ادعُ إلى سبيل ربك بالحكمة والموعظة الحسنة
            </p>
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#8A7040", fontSize: 10, marginTop: 4, textAlign: "right" }}>
              سورة النحل: ١٢٥
            </p>
          </div>

          <button
            onClick={() => setView("scholars")}
            className="w-full flex items-center gap-3 rounded-2xl p-4 mb-4 text-right active:scale-[0.98] transition-transform"
            style={{
              background: "linear-gradient(135deg, rgba(27,107,58,0.16), rgba(13,27,42,0.92))",
              border: "1px solid rgba(27,107,58,0.35)",
            }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(27,107,58,0.2)", border: "1px solid rgba(27,107,58,0.4)", fontSize: 20 }}
            >
              🕌
            </div>
            <div className="flex-1 text-right">
              <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#4ADE80", fontSize: 14, fontWeight: 700 }}>
                علماء عالميون
              </p>
              <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#5A9A6A", fontSize: 10.5, marginTop: 2 }}>
                دليل بأبرز العلماء والدعاة واستماع محاضراتهم الحقيقية
              </p>
            </div>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.4, flexShrink: 0 }}>
              <path d="M15 18l-6-6 6-6" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 11, marginBottom: 8, textAlign: "right" }}>
            مواضيع الخطب حسب التصنيف
          </p>

          <div className="flex flex-col gap-2.5">
            {SERMON_CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => { setCategoryId(c.id); setView("list"); }}
                className="flex items-center gap-3 rounded-2xl p-4 text-right active:scale-[0.98] transition-transform"
                style={{
                  background: "linear-gradient(145deg, rgba(14,24,40,0.75), rgba(9,16,28,0.88))",
                  border: "1px solid rgba(201,168,76,0.1)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}
                >
                  <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#C9A84C", opacity: 0.6 }} />
                </div>
                <div className="flex-1 text-right">
                  <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#F5ECD7", fontSize: 13.5, fontWeight: 700 }}>
                    {c.label}
                  </p>
                  <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#7A6A50", fontSize: 10.5, marginTop: 2 }}>
                    {c.sub} · {c.sermons.length} خطبة
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

      {/* Sermons list within a category */}
      {view === "list" && category && (
        <div className="px-4 py-4 flex flex-col gap-2.5">
          {category.sermons.map((s) => (
            <button
              key={s.id}
              onClick={() => { setSermon(s); setView("detail"); }}
              className="flex items-center gap-3 rounded-2xl p-4 text-right active:scale-[0.98] transition-transform"
              style={{
                background: "linear-gradient(145deg, rgba(14,24,40,0.75), rgba(9,16,28,0.88))",
                border: "1px solid rgba(201,168,76,0.1)",
              }}
            >
              <div className="flex-1 text-right">
                <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#F5ECD7", fontSize: 13.5, fontWeight: 700, lineHeight: 1.5 }}>
                  {s.title}
                </p>
                <p
                  style={{
                    fontFamily: "'Amiri', serif",
                    color: "#7A6A50",
                    fontSize: 11.5,
                    marginTop: 4,
                    lineHeight: 1.7,
                  }}
                >
                  {s.openingText.length > 70 ? s.openingText.slice(0, 70) + "…" : s.openingText}
                </p>
              </div>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.3, flexShrink: 0 }}>
                <path d="M15 18l-6-6 6-6" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          ))}
        </div>
      )}

      {/* Sermon detail */}
      {view === "detail" && sermon && (
        <div className="px-4 py-4">
          <div className="flex items-center justify-end mb-3">
            <ShareButton
              compact
              data={{
                kindLabel: "خطبة ووعظ",
                arabicText: sermon.title,
                translation: sermon.points.map((p) => `${p.heading}: ${p.body}`).join("\n\n"),
                footer: sermon.openingRef,
              }}
            />
          </div>

          <div
            className="rounded-2xl p-4 mb-4"
            style={{
              background: "linear-gradient(135deg, rgba(201,168,76,0.12), rgba(13,27,42,0.9))",
              border: "1px solid rgba(201,168,76,0.28)",
            }}
          >
            <p style={{ fontFamily: "'Amiri', serif", color: "#F5ECD7", fontSize: 16, lineHeight: 2, textAlign: "right" }} dir="rtl">
              {sermon.openingText}
            </p>
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#C9A84C", fontSize: 10.5, marginTop: 6, textAlign: "right" }}>
              {sermon.openingRef}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {sermon.points.map((p, i) => (
              <div
                key={i}
                className="rounded-2xl p-4"
                style={{
                  background: "linear-gradient(145deg, rgba(14,24,40,0.75), rgba(9,16,28,0.88))",
                  border: "1px solid rgba(201,168,76,0.1)",
                }}
              >
                <div className="flex items-center gap-2 justify-end mb-2">
                  <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#C9A84C", fontSize: 13, fontWeight: 700 }}>
                    {p.heading}
                  </p>
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)" }}
                  >
                    <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#C9A84C", fontSize: 10, fontWeight: 700 }}>
                      {i + 1}
                    </p>
                  </div>
                </div>
                <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#D8CBAE", fontSize: 12.5, lineHeight: 1.9, textAlign: "right" }}>
                  {p.body}
                </p>
              </div>
            ))}
          </div>

          <div
            className="rounded-2xl p-4 mt-3"
            style={{
              background: "linear-gradient(135deg, rgba(27,107,58,0.14), rgba(13,27,42,0.9))",
              border: "1px solid rgba(27,107,58,0.3)",
            }}
          >
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#5A9A6A", fontSize: 10.5, marginBottom: 4, textAlign: "right" }}>
              دعاء
            </p>
            <p style={{ fontFamily: "'Amiri', serif", color: "#4ADE80", fontSize: 14, lineHeight: 1.9, textAlign: "right" }} dir="rtl">
              {sermon.dua}
            </p>
          </div>
        </div>
      )}

      {/* World scholars directory */}
      {view === "scholars" && (
        <div className="px-4 py-4 flex flex-col gap-2.5">
          <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#5A4830", fontSize: 10.5, marginBottom: 2, lineHeight: 1.8, textAlign: "right" }}>
            هذه قائمة تعريفية بعلماء ودعاة معروفين بوعظهم، والاستماع ينقلك لمحاضراتهم الأصلية الحقيقية خارج التطبيق.
          </p>
          {filteredScholars.map((s) => (
            <div
              key={s.id}
              className="rounded-2xl p-4"
              style={{
                background: "linear-gradient(145deg, rgba(14,24,40,0.75), rgba(9,16,28,0.88))",
                border: "1px solid rgba(201,168,76,0.1)",
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", fontSize: 18 }}
                >
                  🕋
                </div>
                <div className="flex-1 text-right">
                  <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#C9A84C", fontSize: 13.5, fontWeight: 700 }}>
                    {s.name}
                  </p>
                  <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 10, marginTop: 2 }}>
                    {s.country} · {s.era}
                  </p>
                </div>
              </div>
              <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#8A7858", fontSize: 11.5, lineHeight: 1.8, marginTop: 10, textAlign: "right" }}>
                {s.bio}
              </p>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(s.searchQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center justify-center gap-2 rounded-xl py-2.5 active:scale-95 transition-transform"
                style={{ background: "rgba(27,107,58,0.16)", border: "1px solid rgba(27,107,58,0.35)" }}
              >
                <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#4ADE80", fontSize: 12, fontWeight: 600 }}>
                  استماع محاضراته
                </span>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          ))}
          {filteredScholars.length === 0 && (
            <p className="text-center py-10" style={{ fontFamily: "'Tajawal', sans-serif", color: "#5A4830", fontSize: 12 }}>
              لا توجد نتائج
            </p>
          )}
        </div>
      )}
    </div>
  );
}
