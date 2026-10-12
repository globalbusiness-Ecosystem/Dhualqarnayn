"use client";

import { useMemo, useState } from "react";
import { DUA_CATEGORIES, ADIYA, toArabicDigitsDua, type Dua } from "@/lib/adiya-data";
import ShareButton from "./ShareButton";

interface Props {
  onBack: () => void;
}

export default function AdiyaBrowser({ onBack }: Props) {
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (id: number) =>
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));

  const filtered: Dua[] = useMemo(() => {
    let list = ADIYA;
    if (activeCat) list = list.filter((d) => d.categoryId === activeCat);
    if (search.trim()) {
      const q = search.trim();
      list = list.filter((d) => d.text.includes(q) || d.title.includes(q));
    }
    return list;
  }, [activeCat, search]);

  const showingList = activeCat !== null || search.trim().length > 0;
  const activeCategory = DUA_CATEGORIES.find((c) => c.id === activeCat);

  return (
    <div style={{ minHeight: "100vh", background: "#050C16" }}>
      <div
        className="sticky top-0 z-20"
        style={{ background: "rgba(5,12,22,0.97)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(34,139,74,0.18)" }}
      >
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          <button
            onClick={() => {
              if (showingList) {
                setActiveCat(null);
                setSearch("");
                setExpanded(null);
              } else {
                onBack();
              }
            }}
            className="w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0 active:scale-90 transition-transform"
            style={{ background: "rgba(34,139,74,0.08)", border: "1px solid rgba(34,139,74,0.22)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="flex-1">
            <h2 style={{ fontFamily: "'Amiri', serif", color: "#4ADE80", fontSize: 21, fontWeight: 700, lineHeight: 1 }}>
              {activeCategory ? activeCategory.name : "الأدعية"}
            </h2>
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#4A6A50", fontSize: 10.5, marginTop: 2 }}>
              من القرآن الكريم والسنة النبوية الصحيحة
            </p>
          </div>
          <div
            style={{
              width: 38, height: 38, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(34,139,74,0.1)", border: "1px solid rgba(34,139,74,0.26)", fontSize: 17,
            }}
          >
            {activeCategory ? activeCategory.icon : "❖"}
          </div>
        </div>

        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 px-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(34,139,74,0.16)", height: 38 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(74,222,128,0.5)" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setActiveCat(null); }}
              placeholder="ابحث في الأدعية..."
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontFamily: "'Tajawal', sans-serif", color: "#C8E8D0", fontSize: 12.5, direction: "rtl", textAlign: "right" }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ color: "rgba(74,222,128,0.5)", fontSize: 16, lineHeight: 1 }}>×</button>
            )}
          </div>
        </div>
      </div>

      {!showingList && (
        <div className="px-4 py-3 text-center" style={{ borderBottom: "1px solid rgba(34,139,74,0.08)" }}>
          <p style={{ fontFamily: "'Amiri', serif", color: "rgba(74,222,128,0.4)", fontSize: 13, lineHeight: 1.7 }}>
            «ادْعُونِي أَسْتَجِبْ لَكُمْ»
          </p>
        </div>
      )}

      {!showingList && (
        <div className="px-4 py-4 grid grid-cols-2 md:grid-cols-3 gap-2.5">
          {DUA_CATEGORIES.map((cat, i) => {
            const count = ADIYA.filter((d) => d.categoryId === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className="text-right rounded-2xl p-4 active:scale-95 transition-transform"
                style={{ background: "linear-gradient(145deg, rgba(14,24,40,0.75), rgba(9,16,28,0.88))", border: `1px solid ${cat.accent}20` }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ background: `${cat.accent}10`, border: `1px solid ${cat.accent}22`, fontSize: 15 }}>
                  {cat.icon}
                </div>
                <p style={{ fontFamily: "'Tajawal', sans-serif", color: cat.accent, fontSize: 12.5, fontWeight: 700 }}>{cat.name}</p>
                <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#5A5040", fontSize: 10, marginTop: 2 }}>{toArabicDigitsDua(count)} أدعية</p>
              </button>
            );
          })}
        </div>
      )}

      {showingList && (
        <div className="px-4 py-4 pb-24 flex flex-col gap-3">
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#3A2E18", fontSize: 14 }}>لا توجد نتائج</p>
            </div>
          )}
          {filtered.map((d) => {
            const cat = DUA_CATEGORIES.find((c) => c.id === d.categoryId);
            const accent = cat?.accent ?? "#228B4A";
            const isFav = favorites.includes(d.id);
            const open = expanded === d.id;
            return (
              <button
                key={d.id}
                onClick={() => setExpanded(open ? null : d.id)}
                className="text-right rounded-2xl overflow-hidden p-4"
                style={{ background: "linear-gradient(145deg, rgba(14,24,40,0.75), rgba(9,16,28,0.9))", border: `1px solid ${open ? `${accent}3A` : "rgba(201,168,76,0.09)"}`, direction: "rtl" }}
              >
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span style={{ fontFamily: "'Tajawal', sans-serif", color: accent, fontSize: 13, fontWeight: 700 }}>{d.title}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(d.id); }}
                    className="mr-auto"
                    style={{ fontSize: 15, color: isFav ? "#E8C96A" : "rgba(201,168,76,0.25)" }}
                    aria-label="إضافة للمفضلة"
                  >
                    {isFav ? "★" : "☆"}
                  </button>
                </div>
                <p style={{ fontFamily: "'Amiri', serif", color: "#E8D5A8", fontSize: 16, lineHeight: 1.9 }}>{d.text}</p>
                {open && d.virtue && (
                  <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(201,168,76,0.08)" }}>
                    <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#8A7040", fontSize: 11.5, lineHeight: 1.7 }}>
                      <span style={{ color: accent, fontWeight: 700 }}>الفضل: </span>{d.virtue}
                    </p>
                  </div>
                )}
                <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                  <div className="flex items-center gap-1.5">
                    <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#5A5040", fontSize: 10.5 }}>{d.source}</span>
                    <ShareButton
                      compact
                      data={{
                        kindLabel: "دعاء",
                        arabicText: d.text,
                        translation: d.virtue,
                        footer: `${d.title} — ${d.source}`,
                        accent,
                      }}
                    />
                  </div>
                  {cat && (
                    <span className="px-2 py-0.5 rounded-md" style={{ fontFamily: "'Tajawal', sans-serif", fontSize: 9.5, background: `${accent}14`, color: accent, border: `1px solid ${accent}2A` }}>
                      {cat.icon} {cat.name}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
