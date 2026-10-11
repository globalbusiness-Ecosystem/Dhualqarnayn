"use client";

import { useMemo, useState } from "react";
import { PROPHETS, ULU_AZM, type Prophet } from "@/lib/prophets-data";

interface Props {
  onBack?: () => void;
}

export default function ProphetsBrowser({ onBack }: Props) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "uluazm">("all");
  const [selected, setSelected] = useState<Prophet | null>(null);

  const list = useMemo(() => {
    const base = filter === "uluazm" ? ULU_AZM : PROPHETS;
    const q = query.trim();
    if (!q) return base;
    return base.filter(
      (p) =>
        p.name.includes(q) ||
        p.title.includes(q) ||
        p.summary.includes(q) ||
        p.people.includes(q)
    );
  }, [query, filter]);

  if (selected) {
    return <ProphetDetail prophet={selected} onBack={() => setSelected(null)} />;
  }

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
              الأنبياء والرسل
            </h2>
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#7A6540", fontSize: 11, marginTop: 1 }}>
              سيرة ٢٥ نبياً ورسولاً ذُكروا في القرآن الكريم عليهم السلام
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
            placeholder="ابحث عن نبي..."
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

        {/* Filter chips */}
        <div className="flex gap-2">
          {[
            { key: "all" as const, label: `جميع الأنبياء (${PROPHETS.length})` },
            { key: "uluazm" as const, label: `أولو العزم (${ULU_AZM.length})` },
          ].map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className="px-3 py-1.5 rounded-full active:scale-95 transition-transform"
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
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* List */}
      <div className="px-4 py-4">
        {list.length === 0 ? (
          <div className="text-center py-16">
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#5A4830", fontSize: 13 }}>
              لا توجد نتائج مطابقة
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {list.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                className="flex items-center gap-3 text-right rounded-2xl p-3.5 active:scale-98 transition-transform"
                style={{
                  background: "linear-gradient(145deg, rgba(14,24,40,0.75), rgba(9,16,28,0.88))",
                  border: "1px solid rgba(201,168,76,0.08)",
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: p.isUluAzm ? "rgba(201,168,76,0.12)" : "rgba(34,139,74,0.1)",
                    border: `1px solid ${p.isUluAzm ? "rgba(201,168,76,0.3)" : "rgba(34,139,74,0.22)"}`,
                  }}
                >
                  <span style={{ fontFamily: "'Amiri', serif", color: p.isUluAzm ? "#C9A84C" : "#4ADE80", fontSize: 16, fontWeight: 700 }}>
                    {p.id}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p style={{ fontFamily: "'Amiri', serif", color: "#F5ECD7", fontSize: 15, fontWeight: 700 }}>
                      {p.name}
                    </p>
                    {p.isUluAzm && (
                      <span
                        className="px-1.5 py-0.5 rounded-full"
                        style={{ background: "rgba(201,168,76,0.14)", color: "#C9A84C", fontFamily: "'Tajawal',sans-serif", fontSize: 8.5 }}
                      >
                        أولو العزم
                      </span>
                    )}
                  </div>
                  <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#8A7040", fontSize: 11, marginTop: 1 }}>
                    {p.title}
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
                    {p.summary}
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

function ProphetDetail({ prophet, onBack }: { prophet: Prophet; onBack: () => void }) {
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
              {prophet.name}
            </h2>
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#7A6540", fontSize: 10.5, marginTop: 1 }}>
              {prophet.title}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-5">
        {/* Ornamental badge */}
        <div className="flex justify-center mb-5">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background: prophet.isUluAzm ? "rgba(201,168,76,0.1)" : "rgba(34,139,74,0.08)",
              border: `1px solid ${prophet.isUluAzm ? "rgba(201,168,76,0.3)" : "rgba(34,139,74,0.22)"}`,
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <polygon
                points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9"
                fill={prophet.isUluAzm ? "#C9A84C" : "#4ADE80"}
                opacity="0.5"
              />
            </svg>
          </div>
        </div>

        {prophet.isUluAzm && (
          <div className="flex justify-center mb-4">
            <span
              className="px-3 py-1 rounded-full"
              style={{
                background: "rgba(201,168,76,0.1)",
                border: "1px solid rgba(201,168,76,0.3)",
                color: "#C9A84C",
                fontFamily: "'Tajawal', sans-serif",
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              من أولي العزم من الرسل
            </span>
          </div>
        )}

        {/* Meta info grid */}
        <div
          className="rounded-2xl p-4 mb-4"
          style={{ background: "rgba(10,18,32,0.72)", border: "1px solid rgba(201,168,76,0.08)" }}
        >
          <div className="flex flex-col gap-3">
            {prophet.meaning && (
              <InfoRow label="معنى الاسم" value={prophet.meaning} />
            )}
            <InfoRow label="الزمن التقريبي" value={prophet.era} />
            <InfoRow label="أُرسل إلى" value={prophet.people} />
            <InfoRow label="ورد ذكره" value={prophet.mentionedIn} />
          </div>
        </div>

        {/* Story */}
        <Section title="قصته عليه السلام" accent="gold">
          <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#B8A880", fontSize: 13, lineHeight: 2 }}>
            {prophet.story}
          </p>
        </Section>

        {/* Miracles */}
        <Section title="الآيات والمعجزات" accent="green">
          <div className="flex flex-col gap-2">
            {prophet.miracles.map((m, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div
                  className="flex-shrink-0 mt-1.5"
                  style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ADE80" }}
                />
                <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#A8B8A0", fontSize: 12.5, lineHeight: 1.8 }}>
                  {m}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* Lessons */}
        <Section title="العبر والدروس" accent="gold">
          <div className="flex flex-col gap-2">
            {prophet.lessons.map((l, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div
                  className="flex-shrink-0 mt-1.5"
                  style={{ width: 5, height: 5, borderRadius: "50%", background: "#C9A84C" }}
                />
                <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#B8A880", fontSize: 12.5, lineHeight: 1.8 }}>
                  {l}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* Quran refs */}
        <Section title="ورد ذكره في سور" accent="green">
          <div className="flex flex-wrap gap-2">
            {prophet.quranRefs.map((s, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(34,139,74,0.08)",
                  border: "1px solid rgba(34,139,74,0.2)",
                  color: "#4ADE80",
                  fontFamily: "'Amiri', serif",
                  fontSize: 12,
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </Section>

        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 11, flexShrink: 0 }}>
        {label}
      </span>
      <span
        style={{ fontFamily: "'Tajawal', sans-serif", color: "#D8C8A8", fontSize: 12, textAlign: "left", fontWeight: 500 }}
      >
        {value}
      </span>
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
      <div
        className="rounded-2xl p-4"
        style={{ background: "rgba(10,18,32,0.72)", border: `1px solid ${color}14` }}
      >
        {children}
      </div>
    </div>
  );
}
