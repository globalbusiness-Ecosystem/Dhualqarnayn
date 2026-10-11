"use client";

import { useState } from "react";
import VoiceSearchButton from "./VoiceSearchButton";
import { SURAHS } from "@/lib/quran-surahs";

const TABS_VIEW = ["سورة", "جزء", "ترتيب النزول"] as const;

function toAr(n: number) {
  return String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[+d]);
}

interface Props {
  onSelect: (surah: typeof SURAHS[0]) => void;
}

export default function QuranBrowser({ onSelect }: Props) {
  const [tab, setTab] = useState<typeof TABS_VIEW[number]>("سورة");
  const [search, setSearch] = useState("");

  const filtered = SURAHS.filter(
    (s) =>
      s.ar.includes(search) ||
      s.en.toLowerCase().includes(search.toLowerCase()) ||
      String(s.n).includes(search)
  );

  const sorted = tab === "ترتيب النزول"
    ? [...filtered].sort((a, b) => {
        const makkiOrder = [96,68,73,74,1,111,81,87,92,89,93,94,103,100,108,102,107,109,105,113,114,112,53,80,97,91,85,95,106,101,75,104,77,50,90,86,54,38,7,72,36,25,35,19,20,56,26,27,28,17,10,11,12,15,6,37,31,34,39,40,41,42,43,44,45,46,51,52,88,18,16,71,14,21,23,32,52,67,69,70,78,79,82,84,30,29,83,2,8,3,33,60,4,99,57,47,13,55,76,65,98,59,24,22,63,58,49,66,61,62,64,48,5,9,110].indexOf(a.n);
        const bIdx = [96,68,73,74,1,111,81,87,92,89,93,94,103,100,108,102,107,109,105,113,114,112,53,80,97,91,85,95,106,101,75,104,77,50,90,86,54,38,7,72,36,25,35,19,20,56,26,27,28,17,10,11,12,15,6,37,31,34,39,40,41,42,43,44,45,46,51,52,88,18,16,71,14,21,23,32,52,67,69,70,78,79,82,84,30,29,83,2,8,3,33,60,4,99,57,47,13,55,76,65,98,59,24,22,63,58,49,66,61,62,64,48,5,9,110].indexOf(b.n);
        return makkiOrder - bIdx;
      })
    : filtered;

  const byJuz = tab === "جزء"
    ? sorted.reduce<Record<number, typeof SURAHS>>((acc, s) => {
        (acc[s.juz] = acc[s.juz] || []).push(s);
        return acc;
      }, {})
    : null;

  return (
    <div style={{ minHeight: "100vh", background: "#050C16" }}>
      {/* Header */}
      <div className="sticky top-0 z-20" style={{ background: "rgba(5,12,22,0.97)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(201,168,76,0.12)" }}>
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          <div className="flex-1">
            <h2 style={{ fontFamily: "'Amiri', serif", color: "#C9A84C", fontSize: 22, fontWeight: 700, lineHeight: 1 }}>
              القرآن الكريم
            </h2>
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#5A4A28", fontSize: 11, marginTop: 2 }}>
              ١١٤ سورة · ٦٢٣٦ آية
            </p>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#C9A84C" strokeWidth="1.6" strokeLinecap="round"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="#C9A84C" strokeWidth="1.6" fill="rgba(201,168,76,0.05)"/>
              <path d="M9 7h7M9 11h5" stroke="#C9A84C" strokeWidth="1.1" strokeLinecap="round" opacity="0.55"/>
            </svg>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 px-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,168,76,0.1)", height: 38 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.4)" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن سورة..."
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                fontFamily: "'Tajawal', sans-serif", color: "#C9A84C", fontSize: 13,
                direction: "rtl", textAlign: "right",
              }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ color: "rgba(201,168,76,0.4)", fontSize: 16, lineHeight: 1 }}>×</button>
            )}
            <VoiceSearchButton onResult={(t) => setSearch(t)} accent="#C9A84C" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-4 pb-3 gap-2">
          {TABS_VIEW.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className="flex-1 py-1.5 rounded-lg text-center transition-all"
              style={{
                fontFamily: "'Tajawal', sans-serif",
                fontSize: 11,
                background: tab === t ? "rgba(201,168,76,0.12)" : "transparent",
                border: `1px solid ${tab === t ? "rgba(201,168,76,0.35)" : "rgba(201,168,76,0.07)"}`,
                color: tab === t ? "#C9A84C" : "#5A4A28",
                fontWeight: tab === t ? 700 : 400,
              }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Bismillah banner */}
      <div className="px-4 py-3 text-center" style={{ borderBottom: "1px solid rgba(201,168,76,0.06)" }}>
        <p style={{ fontFamily: "'Amiri', serif", color: "rgba(201,168,76,0.38)", fontSize: 18, letterSpacing: "0.02em" }}>
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </p>
      </div>

      {/* List */}
      <div className="pb-28">
        {byJuz
          ? Object.entries(byJuz).map(([juz, surahs]) => (
              <div key={juz}>
                <div className="px-4 py-2 flex items-center gap-2" style={{ background: "rgba(201,168,76,0.03)" }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontFamily: "'Amiri', serif", color: "#C9A84C", fontSize: 11 }}>{toAr(+juz)}</span>
                  </div>
                  <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#7A6848", fontSize: 12 }}>الجزء {toAr(+juz)}</span>
                </div>
                {surahs.map((s) => <SurahRow key={s.n} s={s} onSelect={onSelect} />)}
              </div>
            ))
          : sorted.map((s) => <SurahRow key={s.n} s={s} onSelect={onSelect} />)
        }
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#3A2E18", fontSize: 14 }}>لا توجد نتائج</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SurahRow({ s, onSelect }: { s: typeof SURAHS[0]; onSelect: (s: typeof SURAHS[0]) => void }) {
  return (
    <button
      onClick={() => onSelect(s)}
      className="w-full flex items-center gap-3 px-4 py-3 active:scale-[0.99] transition-transform"
      style={{
        borderBottom: "1px solid rgba(201,168,76,0.05)",
        background: "transparent",
        textAlign: "right",
      }}
    >
      {/* Number badge */}
      <div style={{
        width: 38, height: 38, flexShrink: 0,
        background: "rgba(201,168,76,0.07)",
        border: "1px solid rgba(201,168,76,0.14)",
        borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative",
      }}>
        <svg width="38" height="38" viewBox="0 0 38 38" style={{ position: "absolute", inset: 0 }}>
          <polygon points="19,3 35,13 35,25 19,35 3,25 3,13" fill="none" stroke="rgba(201,168,76,0.18)" strokeWidth="0.8"/>
        </svg>
        <span style={{ fontFamily: "'Amiri', serif", color: "#C9A84C", fontSize: 12, fontWeight: 600, position: "relative" }}>
          {toAr(s.n)}
        </span>
      </div>

      {/* Main text */}
      <div className="flex-1 min-w-0" style={{ direction: "rtl" }}>
        <div className="flex items-center gap-2">
          <span style={{ fontFamily: "'Amiri', serif", color: "#E8D5A8", fontSize: 17, fontWeight: 600 }}>{s.ar}</span>
          <span className="px-1.5 py-0.5 rounded-md" style={{
            fontFamily: "'Tajawal', sans-serif", fontSize: 9,
            background: s.rev === "مكية" ? "rgba(201,168,76,0.08)" : "rgba(27,107,58,0.1)",
            color: s.rev === "مكية" ? "rgba(201,168,76,0.7)" : "rgba(74,222,128,0.65)",
            border: `1px solid ${s.rev === "مكية" ? "rgba(201,168,76,0.15)" : "rgba(27,107,58,0.2)"}`,
          }}>{s.rev}</span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#5A4A28", fontSize: 11 }}>{s.en}</span>
          <span style={{ color: "rgba(201,168,76,0.2)", fontSize: 10 }}>·</span>
          <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#4A3A20", fontSize: 11 }}>{toAr(s.ayahs)} آية</span>
        </div>
      </div>

      {/* Chevron */}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.25)" strokeWidth="2" strokeLinecap="round">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
    </button>
  );
}
