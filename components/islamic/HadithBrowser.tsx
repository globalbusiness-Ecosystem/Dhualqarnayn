"use client";

import { useMemo, useState } from "react";
import {
  HADITH_BOOKS,
  HADITH_CATEGORIES,
  HADITHS,
  toArabicDigits,
  type Hadith,
} from "@/lib/hadith-data";
import { useLanguage } from "@/contexts/language-context";
import ShareButton from "./ShareButton";
import VoiceSearchButton from "./VoiceSearchButton";

interface Props {
  onBack: () => void;
}

type ViewMode = "books" | "categories";

export default function HadithBrowser({ onBack }: Props) {
  const { locale } = useLanguage();
  const [mode, setMode] = useState<ViewMode>("books");
  const [activeBook, setActiveBook] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showTranslation, setShowTranslation] = useState(false);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  const filtered: Hadith[] = useMemo(() => {
    let list = HADITHS;
    if (activeBook) list = list.filter((h) => h.bookId === activeBook);
    if (activeCategory) list = list.filter((h) => h.categoryId === activeCategory);
    if (search.trim()) {
      const q = search.trim();
      list = list.filter(
        (h) =>
          h.text.includes(q) ||
          h.narrator.includes(q) ||
          h.chapter.includes(q)
      );
    }
    return list;
  }, [activeBook, activeCategory, search]);

  const showingList = activeBook !== null || activeCategory !== null || search.trim().length > 0;

  return (
    <div style={{ minHeight: "100vh", background: "#050C16" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-20"
        style={{
          background: "rgba(5,12,22,0.97)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(34,139,74,0.18)",
        }}
      >
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          <button
            onClick={() => {
              if (showingList) {
                setActiveBook(null);
                setActiveCategory(null);
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
              الأحاديث النبوية
            </h2>
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#4A6A50", fontSize: 10.5, marginTop: 2 }}>
              مختارات موثقة من الكتب الستة الصحيحة
            </p>
          </div>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 11,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(34,139,74,0.1)",
              border: "1px solid rgba(34,139,74,0.26)",
              fontSize: 17,
            }}
          >
            🕌
          </div>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div
            className="flex items-center gap-2 px-3 rounded-xl"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(34,139,74,0.16)", height: 38 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(74,222,128,0.5)" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setActiveBook(null);
                setActiveCategory(null);
              }}
              placeholder="ابحث في متن الحديث أو الراوي أو الباب..."
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                fontFamily: "'Tajawal', sans-serif",
                color: "#C8E8D0",
                fontSize: 12.5,
                direction: "rtl",
                textAlign: "right",
              }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ color: "rgba(74,222,128,0.5)", fontSize: 16, lineHeight: 1 }}>
                ×
              </button>
            )}
            <VoiceSearchButton
              onResult={(t) => {
                setSearch(t);
                setActiveBook(null);
                setActiveCategory(null);
              }}
              accent="#4ADE80"
            />
          </div>
        </div>

        {locale !== "ar" && (
          <div className="px-4 pb-3">
            <button
              onClick={() => setShowTranslation((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
              style={{
                background: showTranslation ? "rgba(74,222,128,0.12)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${showTranslation ? "rgba(74,222,128,0.4)" : "rgba(34,139,74,0.14)"}`,
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke={showTranslation ? "#4ADE80" : "rgba(74,222,128,0.45)"}
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <path d="M3 5h12M9 3v2M5 8c0 2.5 1.2 5 3.5 7M11 8c0 2.5-1.2 5-3.5 7M21 21l-6-6 2.5-6.5L21 21z" />
              </svg>
              <span
                style={{
                  fontFamily: "'Tajawal', sans-serif",
                  fontSize: 10.5,
                  color: showTranslation ? "#4ADE80" : "rgba(74,222,128,0.5)",
                  fontWeight: showTranslation ? 700 : 400,
                }}
              >
                English Translation
              </span>
            </button>
          </div>
        )}

        {!showingList && (
          <div className="flex px-4 pb-3 gap-2">
            {(["books", "categories"] as ViewMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="flex-1 py-1.5 rounded-lg text-center transition-all"
                style={{
                  fontFamily: "'Tajawal', sans-serif",
                  fontSize: 11.5,
                  background: mode === m ? "rgba(34,139,74,0.14)" : "transparent",
                  border: `1px solid ${mode === m ? "rgba(74,222,128,0.4)" : "rgba(34,139,74,0.1)"}`,
                  color: mode === m ? "#4ADE80" : "#4A6A50",
                  fontWeight: mode === m ? 700 : 400,
                }}
              >
                {m === "books" ? "الكتب الستة" : "الموضوعات"}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bismillah */}
      {!showingList && (
        <div className="px-4 py-3 text-center" style={{ borderBottom: "1px solid rgba(34,139,74,0.08)" }}>
          <p style={{ fontFamily: "'Amiri', serif", color: "rgba(74,222,128,0.4)", fontSize: 13, lineHeight: 1.7 }}>
            «نَضَّرَ اللَّهُ امْرَأً سَمِعَ مِنَّا حَدِيثًا فَحَفِظَهُ حَتَّى يُبَلِّغَهُ غَيْرَهُ»
          </p>
        </div>
      )}

      {!showingList && mode === "books" && (
        <div className="px-4 py-4 flex flex-col gap-2.5">
          {HADITH_BOOKS.map((book) => {
            const count = HADITHS.filter((h) => h.bookId === book.id).length;
            return (
              <button
                key={book.id}
                onClick={() => setActiveBook(book.id)}
                className="text-right rounded-2xl p-4 flex items-center gap-3 active:scale-[0.98] transition-transform"
                style={{
                  background: "linear-gradient(145deg, rgba(14,24,40,0.75), rgba(9,16,28,0.88))",
                  border: `1px solid ${book.color}22`,
                }}
              >
                <div
                  className="flex-shrink-0 flex items-center justify-center rounded-xl"
                  style={{
                    width: 46,
                    height: 46,
                    background: `${book.color}12`,
                    border: `1px solid ${book.color}30`,
                  }}
                >
                  <span style={{ fontFamily: "'Amiri', serif", color: book.color, fontSize: 18, fontWeight: 700 }}>
                    {toArabicDigits(count)}
                  </span>
                </div>
                <div className="flex-1 min-w-0" style={{ direction: "rtl" }}>
                  <p style={{ fontFamily: "'Amiri', serif", color: "#E8D5A8", fontSize: 16, fontWeight: 700 }}>{book.name}</p>
                  <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 10.5, marginTop: 2 }}>
                    {book.author} · ت {book.death}
                  </p>
                </div>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={`${book.color}66`} strokeWidth="2" strokeLinecap="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            );
          })}
        </div>
      )}

      {!showingList && mode === "categories" && (
        <div className="px-4 py-4 grid grid-cols-2 gap-2.5">
          {HADITH_CATEGORIES.map((cat, i) => {
            const count = HADITHS.filter((h) => h.categoryId === cat.id).length;
            const accent = i % 2 === 0 ? "#C9A84C" : "#228B4A";
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="text-right rounded-2xl p-4 active:scale-95 transition-transform"
                style={{
                  background: "linear-gradient(145deg, rgba(14,24,40,0.75), rgba(9,16,28,0.88))",
                  border: `1px solid ${accent}20`,
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center mb-2"
                  style={{ background: `${accent}10`, border: `1px solid ${accent}22`, fontSize: 15 }}
                >
                  {cat.icon}
                </div>
                <p style={{ fontFamily: "'Tajawal', sans-serif", color: accent, fontSize: 12.5, fontWeight: 700 }}>{cat.name}</p>
                <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#5A5040", fontSize: 10, marginTop: 2 }}>
                  {toArabicDigits(count)} أحاديث
                </p>
              </button>
            );
          })}
        </div>
      )}

      {/* Hadith list */}
      {showingList && (
        <div className="px-4 py-4 pb-24 flex flex-col gap-3">
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#3A2E18", fontSize: 14 }}>لا توجد نتائج</p>
            </div>
          )}
          {filtered.map((h) => (
            <HadithCard
              key={h.id}
              hadith={h}
              open={expanded === h.id}
              isFav={favorites.includes(h.id)}
              onToggleFav={() => toggleFavorite(h.id)}
              onToggle={() => setExpanded(expanded === h.id ? null : h.id)}
              showTranslation={showTranslation && locale !== "ar"}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function HadithCard({
  hadith,
  open,
  isFav,
  onToggle,
  onToggleFav,
  showTranslation,
}: {
  hadith: Hadith;
  open: boolean;
  isFav: boolean;
  onToggle: () => void;
  onToggleFav: () => void;
  showTranslation: boolean;
}) {
  const book = HADITH_BOOKS.find((b) => b.id === hadith.bookId);
  const category = HADITH_CATEGORIES.find((c) => c.id === hadith.categoryId);
  const accent = book?.color ?? "#C9A84C";

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(145deg, rgba(14,24,40,0.75), rgba(9,16,28,0.9))",
        border: `1px solid ${open ? `${accent}3A` : "rgba(201,168,76,0.09)"}`,
        transition: "border-color 0.2s ease",
      }}
    >
      <button onClick={onToggle} className="w-full text-right p-4" style={{ direction: "rtl" }}>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span
            className="px-2 py-0.5 rounded-md"
            style={{
              fontFamily: "'Tajawal', sans-serif",
              fontSize: 9.5,
              fontWeight: 700,
              background: `${accent}14`,
              color: accent,
              border: `1px solid ${accent}2A`,
            }}
          >
            {book?.name}
          </span>
          {category && (
            <span
              className="px-2 py-0.5 rounded-md"
              style={{
                fontFamily: "'Tajawal', sans-serif",
                fontSize: 9.5,
                background: "rgba(255,255,255,0.03)",
                color: "#8A7858",
                border: "1px solid rgba(201,168,76,0.1)",
              }}
            >
              {category.icon} {category.name}
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFav();
            }}
            className="mr-auto"
            style={{ fontSize: 15, color: isFav ? "#E8C96A" : "rgba(201,168,76,0.25)" }}
            aria-label="إضافة للمفضلة"
          >
            {isFav ? "★" : "☆"}
          </button>
        </div>

        <p
          style={{
            fontFamily: "'Amiri', serif",
            color: "#E8D5A8",
            fontSize: 16,
            lineHeight: 1.9,
            display: open ? "block" : "-webkit-box",
            WebkitLineClamp: open ? undefined : 3,
            WebkitBoxOrient: "vertical",
            overflow: open ? "visible" : "hidden",
          }}
        >
          {hadith.text}
        </p>

        {showTranslation && hadith.textEn && (
          <p
            style={{
              fontFamily: "'Geist', sans-serif",
              color: "#9CA8B0",
              fontSize: 12.5,
              lineHeight: 1.7,
              fontStyle: "italic",
              marginTop: 10,
              direction: "ltr",
              textAlign: "left",
            }}
          >
            {hadith.textEn}
          </p>
        )}

        {open && (
          <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(201,168,76,0.08)" }}>
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#8A7040", fontSize: 11.5, lineHeight: 1.7 }}>
              <span style={{ color: accent, fontWeight: 700 }}>الشرح: </span>
              {hadith.sharh}
            </p>
            {showTranslation && hadith.sharhEn && (
              <p
                style={{
                  fontFamily: "'Geist', sans-serif",
                  color: "#8A96A0",
                  fontSize: 11,
                  lineHeight: 1.7,
                  marginTop: 6,
                  direction: "ltr",
                  textAlign: "left",
                }}
              >
                <span style={{ color: accent, fontWeight: 700, fontStyle: "normal" }}>Explanation: </span>
                {hadith.sharhEn}
              </p>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#5A5040", fontSize: 10.5 }}>
              الراوي: {hadith.narrator}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="px-2 py-0.5 rounded-md flex-shrink-0"
              style={{
                fontFamily: "'Tajawal', sans-serif",
                fontSize: 9.5,
                fontWeight: 700,
                background: "rgba(74,222,128,0.08)",
                color: "#4ADE80",
                border: "1px solid rgba(74,222,128,0.18)",
              }}
            >
              {hadith.grade}
            </span>
            <ShareButton
              compact
              data={{
                kindLabel: "حديث نبوي شريف",
                arabicText: hadith.text,
                translation: showTranslation ? hadith.textEn : undefined,
                footer: `${book?.name ?? ""} — ${hadith.grade}`,
                accent: "#4ADE80",
              }}
            />
          </div>
        </div>

        <div className="flex justify-center mt-2">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s ease", opacity: 0.3 }}
          >
            <path d="M6 9l6 6 6-6" stroke={accent} strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </button>
    </div>
  );
}
