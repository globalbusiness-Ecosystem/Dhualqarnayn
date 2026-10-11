"use client";

import { useMemo, useState } from "react";
import { HISTORY_ERAS, type HistoryEvent } from "@/lib/islamic-history-data";

interface Props {
  onBack?: () => void;
}

export default function HistoryBrowser({ onBack }: Props) {
  const [query, setQuery] = useState("");
  const [eraFilter, setEraFilter] = useState<string>("all");
  const [open, setOpen] = useState<string | null>(null);

  const eras = useMemo(() => {
    const base = eraFilter === "all" ? HISTORY_ERAS : HISTORY_ERAS.filter((e) => e.id === eraFilter);
    const q = query.trim();
    if (!q) return base;
    return base
      .map((era) => ({
        ...era,
        events: era.events.filter(
          (ev) => ev.title.includes(q) || ev.desc.includes(q) || ev.cat.includes(q) || ev.year.includes(q)
        ),
      }))
      .filter((era) => era.events.length > 0);
  }, [query, eraFilter]);

  return (
    <div style={{ minHeight: "100vh", background: "#050C16" }}>
      {/* Header */}
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
              التاريخ الإسلامي
            </h2>
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#7A6540", fontSize: 11, marginTop: 1 }}>
              من بدء الخليقة إلى سقوط الخلافة العثمانية
            </p>
          </div>
        </div>

        {/* Search */}
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
            placeholder="ابحث في الأحداث التاريخية..."
            style={{ background: "transparent", border: "none", outline: "none", color: "#F5ECD7", fontFamily: "'Tajawal', sans-serif", fontSize: 13, width: "100%" }}
          />
        </div>

        {/* Era chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
          <button
            onClick={() => setEraFilter("all")}
            className="px-3 py-1.5 rounded-full active:scale-95 transition-transform flex-shrink-0"
            style={{
              background: eraFilter === "all" ? "rgba(201,168,76,0.14)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${eraFilter === "all" ? "rgba(201,168,76,0.4)" : "rgba(201,168,76,0.08)"}`,
              color: eraFilter === "all" ? "#C9A84C" : "#7A6540",
              fontFamily: "'Tajawal', sans-serif",
              fontSize: 11,
              fontWeight: eraFilter === "all" ? 700 : 400,
              whiteSpace: "nowrap",
            }}
          >
            كل العصور
          </button>
          {HISTORY_ERAS.map((era) => {
            const active = eraFilter === era.id;
            const color = era.accent === "gold" ? "#C9A84C" : "#4ADE80";
            return (
              <button
                key={era.id}
                onClick={() => setEraFilter(era.id)}
                className="px-3 py-1.5 rounded-full active:scale-95 transition-transform flex-shrink-0"
                style={{
                  background: active ? `${color}1E` : "rgba(255,255,255,0.03)",
                  border: `1px solid ${active ? `${color}55` : "rgba(201,168,76,0.08)"}`,
                  color: active ? color : "#7A6540",
                  fontFamily: "'Tajawal', sans-serif",
                  fontSize: 11,
                  fontWeight: active ? 700 : 400,
                  whiteSpace: "nowrap",
                }}
              >
                {era.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Timeline content */}
      <div className="px-4 py-5">
        {eras.length === 0 ? (
          <div className="text-center py-16">
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#5A4830", fontSize: 13 }}>لا توجد نتائج مطابقة</p>
          </div>
        ) : (
          eras.map((era) => (
            <div key={era.id} className="mb-7">
              <div className="flex items-center gap-2 mb-1">
                <div className="section-bar" style={{ height: 16, background: era.accent === "gold" ? "#C9A84C" : "#228B4A" }} />
                <h3 style={{ fontFamily: "'Amiri', serif", color: era.accent === "gold" ? "#C9A84C" : "#4ADE80", fontSize: 16, fontWeight: 700 }}>
                  {era.title}
                </h3>
              </div>
              <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5830", fontSize: 10.5, marginBottom: 14, marginRight: 18 }}>
                {era.sub}
              </p>

              <div className="relative pr-7">
                <div
                  className="absolute"
                  style={{
                    right: 11,
                    top: 8,
                    bottom: 8,
                    width: 1,
                    background: "linear-gradient(180deg, rgba(201,168,76,0.22), rgba(34,139,74,0.28), rgba(201,168,76,0.14))",
                  }}
                />
                <div className="flex flex-col gap-2.5">
                  {era.events.map((ev, i) => (
                    <EventCard key={`${era.id}-${i}`} ev={ev} isOpen={open === `${era.id}-${i}`} onToggle={() => setOpen(open === `${era.id}-${i}` ? null : `${era.id}-${i}`)} />
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
        <div style={{ height: 10 }} />
      </div>
    </div>
  );
}

function EventCard({ ev, isOpen, onToggle }: { ev: HistoryEvent; isOpen: boolean; onToggle: () => void }) {
  const accentColor = ev.accent === "gold" ? "#C9A84C" : "#228B4A";
  return (
    <button onClick={onToggle} className="flex items-start gap-3 relative text-right w-full active:scale-99 transition-transform">
      <div
        className="absolute"
        style={{
          right: -18,
          top: 14,
          width: 11,
          height: 11,
          borderRadius: "50%",
          background: isOpen ? accentColor : `${accentColor}44`,
          boxShadow: isOpen ? `0 0 9px ${accentColor}55` : "none",
          border: `1.5px solid ${isOpen ? accentColor : "rgba(201,168,76,0.1)"}`,
          zIndex: 2,
          transition: "all 0.22s ease",
        }}
      />
      <div
        className="flex-1 rounded-xl p-3.5 text-right"
        style={{
          background: isOpen ? `linear-gradient(140deg, ${accentColor}08, rgba(8,14,26,0.97))` : "rgba(10,18,32,0.72)",
          border: `1px solid ${isOpen ? `${accentColor}25` : "rgba(201,168,76,0.06)"}`,
          boxShadow: isOpen ? "0 4px 20px rgba(0,0,0,0.18)" : "none",
          transition: "all 0.2s ease",
        }}
      >
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded-full" style={{ background: `${accentColor}14`, color: accentColor, fontFamily: "'Tajawal',sans-serif", fontSize: 10, border: `1px solid ${accentColor}1E` }}>
              {ev.year}
            </span>
            <span className="px-2 py-0.5 rounded-full" style={{ background: "rgba(201,168,76,0.04)", color: "#8A7858", fontFamily: "'Tajawal',sans-serif", fontSize: 9 }}>
              {ev.cat}
            </span>
          </div>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, opacity: 0.35, transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s ease" }}>
            <path d="M6 9l6 6 6-6" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <p style={{ fontFamily: "'Amiri', serif", color: "#F5ECD7", fontSize: 15, fontWeight: 700, lineHeight: 1.5 }}>{ev.title}</p>
        {isOpen && (
          <p className="mt-2" style={{ fontFamily: "'Tajawal', sans-serif", color: "#9A8560", fontSize: 12, lineHeight: 1.65 }}>
            {ev.desc}
          </p>
        )}
      </div>
    </button>
  );
}
