"use client";

import { useMemo, useState } from "react";
import { ASMA_UL_HUSNA, ASMA_INTRO, type AsmaName } from "@/lib/asma-ul-husna";

function toArNum(n: number | string) {
  return String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[+d]);
}

export default function AsmaHusna({ onBack }: { onBack?: () => void }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<AsmaName | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return ASMA_UL_HUSNA;
    return ASMA_UL_HUSNA.filter(
      (n) => n.ar.includes(q) || n.meaning.includes(q) || n.trans.toLowerCase().includes(q.toLowerCase())
    );
  }, [query]);

  return (
    <div style={{ minHeight: "100vh", background: "#050C16", color: "#F5ECD7" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-4" style={{ borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
        {onBack && (
          <button onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-xl active:scale-90 transition-transform flex-shrink-0"
            style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.18)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
        <div>
          <h2 style={{ fontFamily: "'Amiri', serif", color: "#C9A84C", fontSize: 20, fontWeight: 700 }}>أسماء الله الحسنى</h2>
          <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#7A6540", fontSize: 11, marginTop: 2 }}>
            التسعة والتسعون اسماً كاملة بالمعنى والفضل
          </p>
        </div>
      </div>

      {/* Intro card */}
      <div className="mx-4 mt-4 rounded-2xl p-4" style={{ background: "linear-gradient(140deg, rgba(201,168,76,0.08), rgba(8,14,26,0.97))", border: "1px solid rgba(201,168,76,0.2)" }}>
        <p style={{ fontFamily: "'Amiri', serif", color: "#E2C47A", fontSize: 16, fontWeight: 700, textAlign: "center", lineHeight: 1.9 }}>
          {ASMA_INTRO.verse}
        </p>
        <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A42", fontSize: 10, textAlign: "center", marginTop: 4 }}>
          {ASMA_INTRO.verseRef}
        </p>
        <div style={{ height: 1, background: "rgba(201,168,76,0.12)", margin: "10px 0" }} />
        <p style={{ fontFamily: "'Amiri', serif", color: "#D8C490", fontSize: 13, textAlign: "center", lineHeight: 1.9 }}>
          {ASMA_INTRO.hadith}
        </p>
        <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#5A9A6A", fontSize: 10, textAlign: "center", marginTop: 4 }}>
          {ASMA_INTRO.hadithRef}
        </p>
      </div>

      {/* Search */}
      <div className="px-4 mt-4">
        <div className="relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن اسم..."
            className="w-full rounded-xl py-2.5 pr-10 pl-4 text-right"
            style={{
              background: "rgba(10,18,32,0.75)",
              border: "1px solid rgba(201,168,76,0.18)",
              color: "#F5ECD7",
              fontFamily: "'Tajawal', sans-serif",
              fontSize: 13,
            }}
          />
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="absolute" style={{ right: 12, top: "50%", transform: "translateY(-50%)", opacity: 0.4 }}>
            <circle cx="11" cy="11" r="7" stroke="#C9A84C" strokeWidth="2" />
            <path d="M21 21l-4.3-4.3" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Grid */}
      <div className="px-4 py-5">
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
          {filtered.map((n) => (
            <button
              key={n.id}
              onClick={() => setActive(n)}
              className="flex flex-col items-center justify-center rounded-2xl py-4 px-2 text-center active:scale-95 transition-transform"
              style={{
                background: "linear-gradient(145deg, rgba(14,24,40,0.75), rgba(9,16,28,0.88))",
                border: "1px solid rgba(201,168,76,0.12)",
              }}
            >
              <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#5A4A32", fontSize: 9 }}>
                {toArNum(n.id)}
              </span>
              <span style={{ fontFamily: "'Amiri', serif", color: "#E2C47A", fontSize: 17, fontWeight: 700, marginTop: 4, lineHeight: 1.4 }}>
                {n.ar}
              </span>
              <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A42", fontSize: 8.5, marginTop: 3, direction: "ltr" }}>
                {n.trans}
              </span>
            </button>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-center py-10" style={{ fontFamily: "'Tajawal', sans-serif", color: "#5A4A38", fontSize: 12 }}>
            لم يُعثر على اسم مطابق
          </p>
        )}
      </div>

      {/* Detail sheet */}
      {active && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(1,3,9,0.84)" }} onClick={() => setActive(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full rounded-t-3xl px-5 pt-5 pb-8"
            style={{ maxWidth: 480, background: "linear-gradient(165deg, #0D2034 0%, #060E18 100%)", border: "1px solid rgba(201,168,76,0.2)", borderBottom: "none" }}
          >
            <div className="flex justify-center mb-4">
              <div style={{ width: 40, height: 4, borderRadius: 2, background: "rgba(201,168,76,0.25)" }} />
            </div>
            <div className="text-center">
              <span className="px-2.5 py-1 rounded-full" style={{ background: "rgba(201,168,76,0.1)", color: "#8A7040", fontFamily: "'Tajawal', sans-serif", fontSize: 10 }}>
                الاسم {toArNum(active.id)} من ٩٩
              </span>
              <p style={{ fontFamily: "'Amiri', serif", color: "#C9A84C", fontSize: 32, fontWeight: 700, marginTop: 12, lineHeight: 1.4 }}>
                {active.ar}
              </p>
              <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A42", fontSize: 12, marginTop: 2, direction: "ltr" }}>
                {active.trans}
              </p>
            </div>

            <div className="mt-5 rounded-xl p-4" style={{ background: "rgba(10,18,32,0.75)", border: "1px solid rgba(201,168,76,0.12)" }}>
              <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#8B6F30", fontSize: 11, fontWeight: 700, marginBottom: 6 }}>المعنى</p>
              <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#D8C8A8", fontSize: 13, lineHeight: 1.8 }}>{active.meaning}</p>
            </div>

            <div className="mt-3 rounded-xl p-4" style={{ background: "rgba(27,107,58,0.06)", border: "1px solid rgba(27,107,58,0.2)" }}>
              <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#4ADE80", fontSize: 11, fontWeight: 700, marginBottom: 6 }}>أثره والدعاء به</p>
              <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#9ABFA6", fontSize: 13, lineHeight: 1.8 }}>{active.benefit}</p>
            </div>

            <div className="flex items-center gap-2 mt-5">
              <button
                disabled={active.id <= 1}
                onClick={() => setActive(ASMA_UL_HUSNA.find((n) => n.id === active.id - 1) || active)}
                className="flex-1 py-2.5 rounded-xl active:scale-95 transition-transform disabled:opacity-30"
                style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", color: "#C9A84C", fontFamily: "'Tajawal', sans-serif", fontSize: 12.5, fontWeight: 600 }}
              >
                السابق
              </button>
              <button
                disabled={active.id >= 99}
                onClick={() => setActive(ASMA_UL_HUSNA.find((n) => n.id === active.id + 1) || active)}
                className="flex-1 py-2.5 rounded-xl active:scale-95 transition-transform disabled:opacity-30"
                style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", color: "#C9A84C", fontFamily: "'Tajawal', sans-serif", fontSize: 12.5, fontWeight: 600 }}
              >
                التالي
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
