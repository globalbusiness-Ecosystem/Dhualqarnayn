"use client";

import { useState } from "react";
import { HISTORY_ERAS } from "@/lib/islamic-history-data";

interface Props {
  onOpenFull?: () => void;
}

export default function IslamicHistory({ onOpenFull }: Props) {
  const [open, setOpen] = useState<number | null>(null);
  // Show a curated highlight set (first era's last event + seerah key events) on home
  const highlightEra = HISTORY_ERAS[1]; // seerah
  const EVENTS = highlightEra.events.filter((_, i) => [0, 3, 9, 17, 21].includes(i));

  return (
    <section className="px-4 py-5">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-2">
          <div className="section-bar" style={{ height: 20 }} />
          <h3 style={{ fontFamily: "'Amiri', serif", color: "#C9A84C", fontSize: 19, fontWeight: 700 }}>التاريخ الإسلامي</h3>
        </div>
        <div className="ornament-line flex-1" />
        <button
          onClick={onOpenFull}
          className="px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
          style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.16)", color: "#8B6F30", fontFamily: "'Tajawal',sans-serif", fontSize: 10 }}
        >
          عرض الكل
        </button>
      </div>

      <div className="relative pr-7">
        {/* Timeline line */}
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
          {EVENTS.map((ev, i) => {
            const isOpen = open === i;
            const accentColor = ev.accent === "gold" ? "#C9A84C" : "#228B4A";
            return (
              <button
                key={i}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex items-start gap-3 relative text-right w-full active:scale-99 transition-transform"
              >
                {/* Dot */}
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
                      <span
                        className="px-2 py-0.5 rounded-full"
                        style={{ background: `${accentColor}14`, color: accentColor, fontFamily: "'Tajawal',sans-serif", fontSize: 10, border: `1px solid ${accentColor}1E` }}
                      >
                        {ev.year}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(201,168,76,0.04)", color: "#3A3020", fontFamily: "'Tajawal',sans-serif", fontSize: 9 }}
                      >
                        {ev.cat}
                      </span>
                    </div>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      style={{ flexShrink: 0, opacity: 0.35, transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s ease" }}
                    >
                      <path d="M6 9l6 6 6-6" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p style={{ fontFamily: "'Amiri', serif", color: "#F5ECD7", fontSize: 15, fontWeight: 700, lineHeight: 1.5 }}>
                    {ev.title}
                  </p>
                  {isOpen && (
                    <p className="mt-2" style={{ fontFamily: "'Tajawal', sans-serif", color: "#7A6540", fontSize: 12, lineHeight: 1.65 }}>
                      {ev.desc}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
