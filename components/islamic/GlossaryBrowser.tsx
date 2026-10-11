"use client";

import { useMemo, useState } from "react";
import { GLOSSARY_TERMS, GLOSSARY_CATEGORIES, type GlossaryTerm } from "@/lib/glossary-data";

interface Props {
  onBack?: () => void;
}

export default function GlossaryBrowser({ onBack }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | GlossaryTerm["category"]>("all");
  const [selected, setSelected] = useState<GlossaryTerm | null>(null);

  const list = useMemo(() => {
    let base = category === "all" ? GLOSSARY_TERMS : GLOSSARY_TERMS.filter((t) => t.category === category);
    const q = query.trim();
    if (q) base = base.filter((t) => t.term.includes(q) || t.short.includes(q));
    return base;
  }, [query, category]);

  if (selected) {
    return <TermDetail term={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#050C16" }}>
      <div
        className="sticky top-0 z-20 px-4 pt-5 pb-4"
        style={{
          background: "linear-gradient(180deg, #0D1B2A 0%, rgba(13,27,42,0.97) 100%)",
          borderBottom: "1px solid rgba(201,168,76,0.12)",
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          {onBack && (
            <button
              onClick={onBack}
              className="w-9 h-9 flex items-center justify-center rounded-xl active:scale-90 transition-transform flex-shrink-0"
              style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.16)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
          <div className="flex-1">
            <h2 style={{ fontFamily: "'Amiri', serif", color: "#C9A84C", fontSize: 20, fontWeight: 700 }}>
              معجم المصطلحات
            </h2>
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#7A6540", fontSize: 11, marginTop: 1 }}>
              شرح أهم المصطلحات الإسلامية في العقيدة والعبادة والفقه
            </p>
          </div>
        </div>

        <div
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-3"
          style={{ background: "rgba(8,14,26,0.8)", border: "1px solid rgba(201,168,76,0.12)" }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, opacity: 0.5 }}>
            <circle cx="11" cy="11" r="7" stroke="#C9A84C" strokeWidth="2" />
            <path d="M21 21l-4.3-4.3" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن مصطلح..."
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#F5ECD7",
              fontFamily: "'Tajawal', sans-serif",
              fontSize: 13,
              width: "100%",
            }}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          <Chip label={`الكل (${GLOSSARY_TERMS.length})`} active={category === "all"} onClick={() => setCategory("all")} />
          {GLOSSARY_CATEGORIES.map((c) => (
            <Chip
              key={c.key}
              label={c.label}
              active={category === c.key}
              onClick={() => setCategory(c.key)}
            />
          ))}
        </div>
      </div>

      <div className="px-4 py-4">
        {list.length === 0 ? (
          <div className="text-center py-16">
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#5A4830", fontSize: 13 }}>لا توجد نتائج مطابقة</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {list.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelected(t)}
                className="flex items-center gap-3 text-right rounded-2xl p-3.5 active:scale-98 transition-transform"
                style={{
                  background: "linear-gradient(145deg, rgba(14,24,40,0.75), rgba(9,16,28,0.88))",
                  border: "1px solid rgba(201,168,76,0.08)",
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.24)" }}
                >
                  <span style={{ fontFamily: "'Amiri', serif", color: "#C9A84C", fontSize: 17, fontWeight: 700 }}>
                    {t.term.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontFamily: "'Amiri', serif", color: "#F5ECD7", fontSize: 15, fontWeight: 700 }}>
                    {t.term}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Tajawal', sans-serif",
                      color: "#5A6A58",
                      fontSize: 10.5,
                      marginTop: 3,
                      lineHeight: 1.5,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {t.short}
                  </p>
                </div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, opacity: 0.3, transform: "scaleX(-1)" }}>
                  <path d="M9 18l6-6-6-6" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-full active:scale-95 transition-transform flex-shrink-0"
      style={{
        background: active ? "rgba(201,168,76,0.14)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${active ? "rgba(201,168,76,0.4)" : "rgba(201,168,76,0.08)"}`,
        color: active ? "#C9A84C" : "#7A6540",
        fontFamily: "'Tajawal', sans-serif",
        fontSize: 11,
        fontWeight: active ? 700 : 400,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

function TermDetail({ term, onBack }: { term: GlossaryTerm; onBack: () => void }) {
  return (
    <div style={{ minHeight: "100vh", background: "#050C16" }}>
      <div
        className="sticky top-0 z-20 px-4 pt-5 pb-4"
        style={{
          background: "linear-gradient(180deg, #0D1B2A 0%, rgba(13,27,42,0.97) 100%)",
          borderBottom: "1px solid rgba(201,168,76,0.12)",
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-xl active:scale-90 transition-transform flex-shrink-0"
            style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.16)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <h2 style={{ fontFamily: "'Amiri', serif", color: "#C9A84C", fontSize: 18, fontWeight: 700 }}>{term.term}</h2>
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#7A6540", fontSize: 10.5, marginTop: 1 }}>{term.category}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-5">
        <div className="rounded-2xl p-4 mb-4" style={{ background: "rgba(10,18,32,0.72)", border: "1px solid rgba(201,168,76,0.08)" }}>
          <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#B8A880", fontSize: 13.5, lineHeight: 2 }}>
            {term.detail}
          </p>
        </div>
      </div>
    </div>
  );
}
