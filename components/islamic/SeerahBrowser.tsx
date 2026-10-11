"use client";

import { useMemo, useState } from "react";
import { SEERAH_EVENTS, SEERAH_PERIODS, type SeerahEvent } from "@/lib/seerah-data";

interface Props {
  onBack?: () => void;
}

const PERIOD_COLOR: Record<SeerahEvent["period"], string> = {
  "مكة": "#C9A84C",
  "الهجرة": "#4ADE80",
  "المدينة": "#228B4A",
};

export default function SeerahBrowser({ onBack }: Props) {
  const [filter, setFilter] = useState<"all" | SeerahEvent["period"]>("all");
  const [selected, setSelected] = useState<SeerahEvent | null>(null);

  const list = useMemo(() => {
    if (filter === "all") return SEERAH_EVENTS;
    return SEERAH_EVENTS.filter((e) => e.period === filter);
  }, [filter]);

  if (selected) {
    return <EventDetail event={selected} onBack={() => setSelected(null)} />;
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
              السيرة النبوية
            </h2>
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#7A6540", fontSize: 11, marginTop: 1 }}>
              محطات حياة النبي محمد ﷺ من الولادة إلى الوفاة
            </p>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          <Chip label={`الكل (${SEERAH_EVENTS.length})`} active={filter === "all"} onClick={() => setFilter("all")} />
          {SEERAH_PERIODS.map((p) => (
            <Chip
              key={p.key}
              label={`${p.label} (${SEERAH_EVENTS.filter((e) => e.period === p.key).length})`}
              active={filter === p.key}
              onClick={() => setFilter(p.key)}
              accent={PERIOD_COLOR[p.key]}
            />
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="px-4 py-5">
        <div className="relative pr-4">
          <div
            className="absolute top-0 bottom-0"
            style={{ right: 15, width: 1.5, background: "linear-gradient(180deg, rgba(201,168,76,0.3), rgba(201,168,76,0.06))" }}
          />
          <div className="flex flex-col gap-3">
            {list.map((e) => {
              const color = PERIOD_COLOR[e.period];
              return (
                <button
                  key={e.id}
                  onClick={() => setSelected(e)}
                  className="relative text-right active:scale-98 transition-transform"
                >
                  <div
                    className="absolute rounded-full"
                    style={{ right: 11, top: 18, width: 9, height: 9, background: color, border: "2px solid #050C16" }}
                  />
                  <div
                    className="mr-10 rounded-2xl p-3.5"
                    style={{
                      background: "linear-gradient(145deg, rgba(14,24,40,0.75), rgba(9,16,28,0.88))",
                      border: "1px solid rgba(201,168,76,0.08)",
                    }}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span
                        style={{ fontFamily: "'Tajawal', sans-serif", color, fontSize: 9.5, fontWeight: 700 }}
                      >
                        {e.period}
                      </span>
                      <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#5A4830", fontSize: 9.5 }}>
                        {e.year}
                      </span>
                    </div>
                    <p style={{ fontFamily: "'Amiri', serif", color: "#F5ECD7", fontSize: 15, fontWeight: 700 }}>
                      {e.title}
                    </p>
                    <p
                      style={{
                        fontFamily: "'Tajawal', sans-serif",
                        color: "#8A7040",
                        fontSize: 11.5,
                        marginTop: 4,
                        lineHeight: 1.6,
                      }}
                    >
                      {e.summary}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Chip({ label, active, onClick, accent = "#C9A84C" }: { label: string; active: boolean; onClick: () => void; accent?: string }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-full active:scale-95 transition-transform flex-shrink-0"
      style={{
        background: active ? `${accent}24` : "rgba(255,255,255,0.03)",
        border: `1px solid ${active ? `${accent}66` : "rgba(201,168,76,0.08)"}`,
        color: active ? accent : "#7A6540",
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

function EventDetail({ event, onBack }: { event: SeerahEvent; onBack: () => void }) {
  const color = PERIOD_COLOR[event.period];
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
            <h2 style={{ fontFamily: "'Amiri', serif", color: "#C9A84C", fontSize: 17, fontWeight: 700 }}>
              {event.title}
            </h2>
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#7A6540", fontSize: 10.5, marginTop: 1 }}>
              {event.year}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-5">
        <div className="flex justify-center mb-5">
          <span
            className="px-3 py-1 rounded-full"
            style={{
              background: `${color}1A`,
              border: `1px solid ${color}55`,
              color,
              fontFamily: "'Tajawal', sans-serif",
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {event.period}
          </span>
        </div>

        <Section title="تفصيل الحادثة" accent="gold">
          <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#B8A880", fontSize: 13, lineHeight: 2 }}>
            {event.detail}
          </p>
        </Section>

        <Section title="العبر والدروس" accent="green">
          <div className="flex flex-col gap-2">
            {event.lessons.map((l, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="flex-shrink-0 mt-1.5" style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ADE80" }} />
                <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#A8B8A0", fontSize: 12.5, lineHeight: 1.8 }}>{l}</p>
              </div>
            ))}
          </div>
        </Section>

        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}

function Section({ title, accent, children }: { title: string; accent: "gold" | "green"; children: React.ReactNode }) {
  const color = accent === "gold" ? "#C9A84C" : "#228B4A";
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2.5">
        <div className="section-bar" style={{ height: 16, background: color }} />
        <h3 style={{ fontFamily: "'Amiri', serif", color, fontSize: 15, fontWeight: 700 }}>{title}</h3>
      </div>
      <div className="rounded-2xl p-4" style={{ background: "rgba(10,18,32,0.72)", border: `1px solid ${color}14` }}>
        {children}
      </div>
    </div>
  );
}
