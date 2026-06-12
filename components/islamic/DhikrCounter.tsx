"use client";

import { useState } from "react";

const DHIKR = [
  { text: "سبحان الله",      count: 33,  color: "#C9A84C", virtue: "تسبيح" },
  { text: "الحمد لله",       count: 33,  color: "#228B4A", virtue: "تحميد" },
  { text: "الله أكبر",       count: 34,  color: "#C9A84C", virtue: "تكبير" },
  { text: "لا إله إلا الله", count: 100, color: "#228B4A", virtue: "توحيد" },
  { text: "أستغفر الله",     count: 100, color: "#C9A84C", virtue: "استغفار" },
];

const toAr = (n: number) => String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[+d]);

export default function DhikrCounter() {
  const [sel, setSel] = useState(0);
  const [count, setCount] = useState(0);
  const [sessions, setSessions] = useState(0);
  const [tapped, setTapped] = useState(false);

  const cur = DHIKR[sel];
  const done = count >= cur.count;
  const progress = Math.min(count / cur.count, 1);
  const R = 58;
  const circ = 2 * Math.PI * R;

  const handleTap = () => {
    if (done) { setCount(0); setSessions((s) => s + 1); return; }
    setTapped(true);
    setTimeout(() => setTapped(false), 120);
    setCount((c) => c + 1);
  };

  return (
    <section className="px-4 py-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="section-bar" style={{ height: 20, background: "linear-gradient(180deg,#228B4A,#144F2B)" }}/>
          <h3 style={{ fontFamily: "'Amiri', serif", color: "#C9A84C", fontSize: 19, fontWeight: 700 }}>عداد الذكر</h3>
        </div>
        <div className="ornament-line flex-1"/>
        {sessions > 0 && (
          <span className="px-2.5 py-0.5 rounded-full"
            style={{ background: "rgba(27,107,58,0.12)", border: "1px solid rgba(27,107,58,0.25)", color: "#228B4A", fontFamily: "'Tajawal',sans-serif", fontSize: 10 }}>
            {toAr(sessions)} جلسة
          </span>
        )}
      </div>

      {/* Dhikr pills */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 no-scrollbar">
        {DHIKR.map((d, i) => (
          <button key={i} onClick={() => { setSel(i); setCount(0); }}
            className="flex-shrink-0 rounded-2xl px-3 py-2 transition-all active:scale-95"
            style={{
              background: sel === i ? `${d.color}12` : "rgba(12,22,36,0.7)",
              border: `1px solid ${sel === i ? `${d.color}44` : "rgba(201,168,76,0.08)"}`,
              boxShadow: sel === i ? `0 2px 12px ${d.color}12` : "none",
            }}>
            <p style={{ fontFamily: "'Tajawal',sans-serif", color: sel === i ? d.color : "#6B5A30", fontSize: 12, fontWeight: sel === i ? 700 : 400, whiteSpace: "nowrap" }}>
              {d.text}
            </p>
            <p style={{ fontFamily: "'Tajawal',sans-serif", color: sel === i ? `${d.color}80` : "#252018", fontSize: 9, textAlign: "center", marginTop: 1 }}>
              {d.virtue}
            </p>
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-5">
        {/* Progress ring */}
        <div className="relative flex items-center justify-center">
          <div className="absolute rounded-full pointer-events-none"
            style={{ inset: -12, background: `radial-gradient(circle at center, ${cur.color}08, transparent 70%)` }}/>
          <svg width="168" height="168" viewBox="0 0 168 168">
            <circle cx="84" cy="84" r="78" fill="none" stroke="rgba(201,168,76,0.04)" strokeWidth="1.5"/>
            <circle cx="84" cy="84" r={R} fill="none" stroke="rgba(201,168,76,0.06)" strokeWidth="11" strokeLinecap="round"/>
            <circle cx="84" cy="84" r={R} fill="none" stroke={cur.color} strokeWidth="11" strokeLinecap="round"
              strokeDasharray={`${circ * progress} ${circ}`}
              transform="rotate(-90 84 84)"
              style={{ transition: "stroke-dasharray 0.2s ease", filter: done ? `drop-shadow(0 0 6px ${cur.color})` : "none" }}/>
            <circle cx="84" cy="84" r="54" fill="rgba(7,13,25,0.97)"/>
            {[0.25, 0.5, 0.75, 1].map((v) => {
              const angle = (v * 360 - 90) * (Math.PI / 180);
              return (
                <circle key={v} cx={84 + R * Math.cos(angle)} cy={84 + R * Math.sin(angle)} r="3.2"
                  fill={progress >= v ? cur.color : "rgba(201,168,76,0.1)"}
                  style={{ transition: "fill 0.25s" }}/>
              );
            })}
            <text x="84" y="79" textAnchor="middle" fill={done ? cur.color : "#F5ECD7"}
              fontSize="36" fontFamily="Tajawal,sans-serif" fontWeight="700"
              style={{ transition: "fill 0.25s" }}>
              {toAr(count)}
            </text>
            <text x="84" y="96" textAnchor="middle" fill="#4A3F2C" fontSize="11" fontFamily="Tajawal,sans-serif">
              {done ? "أحسنت" : `من ${toAr(cur.count)}`}
            </text>
            <text x="84" y="110" textAnchor="middle" fill={`${cur.color}65`} fontSize="10" fontFamily="Tajawal,sans-serif">
              {Math.round(progress * 100)}٪
            </text>
          </svg>
        </div>

        {/* Text */}
        <div className="text-center">
          <p style={{ fontFamily: "'Amiri', serif", color: cur.color, fontSize: 27, fontWeight: 700, textShadow: `0 0 26px ${cur.color}3A`, lineHeight: 1.4 }}>
            {cur.text}
          </p>
          <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#3A3020", fontSize: 11, marginTop: 3 }}>
            {toAr(cur.count)} مرة — {cur.virtue}
          </p>
        </div>

        {/* Tap button */}
        <button onClick={handleTap}
          className="rounded-3xl transition-all"
          style={{
            padding: "16px 50px",
            background: done ? `linear-gradient(135deg,${cur.color}22,${cur.color}14)` : `linear-gradient(135deg,${cur.color}16,${cur.color}08)`,
            border: `1.5px solid ${cur.color}${done ? "62" : "32"}`,
            boxShadow: done ? `0 0 24px ${cur.color}22` : tapped ? `0 0 12px ${cur.color}1A` : "none",
            transform: tapped ? "scale(0.96)" : "scale(1)",
            transition: "all 0.11s ease",
          }}>
          <span style={{ fontFamily: "'Tajawal', sans-serif", color: cur.color, fontSize: 15, fontWeight: 700 }}>
            {done ? "إعادة البدء" : "اضغط للذكر"}
          </span>
        </button>

        {/* Bar */}
        <div className="w-full max-w-xs">
          <div className="flex justify-between mb-1.5">
            <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#3A3020", fontSize: 10 }}>التقدم</span>
            <span style={{ fontFamily: "'Tajawal', sans-serif", color: cur.color, fontSize: 10 }}>{toAr(count)} / {toAr(cur.count)}</span>
          </div>
          <div className="rounded-full overflow-hidden" style={{ height: 5, background: "rgba(201,168,76,0.07)" }}>
            <div className="h-full rounded-full"
              style={{ width: `${progress * 100}%`, background: `linear-gradient(90deg,${cur.color}65,${cur.color})`, transition: "width 0.22s ease" }}/>
          </div>
        </div>
      </div>
    </section>
  );
}
