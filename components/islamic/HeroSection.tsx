"use client";

import { useEffect, useRef, useState } from "react";

interface Prayer { name: string; nameAr: string; time: string; }

const PRAYERS: Prayer[] = [
  { name: "fajr",    nameAr: "الفجر",  time: "04:32" },
  { name: "sunrise", nameAr: "الشروق", time: "06:08" },
  { name: "dhuhr",   nameAr: "الظهر",  time: "12:15" },
  { name: "asr",     nameAr: "العصر",  time: "15:42" },
  { name: "maghrib", nameAr: "المغرب", time: "18:28" },
  { name: "isha",    nameAr: "العشاء", time: "19:58" },
];

function toAr(s: string | number) {
  return String(s).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[+d]);
}

function getHijriDate(): string {
  try {
    return new Intl.DateTimeFormat("ar-SA-u-ca-islamic", {
      calendar: "islamic", year: "numeric", month: "long", day: "numeric",
    }).format(new Date()) + " هـ";
  } catch { return "١٤ رجب ١٤٤٦ هـ"; }
}

function getCurrentPrayerIdx(): number {
  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();
  let idx = 0;
  for (let i = 0; i < PRAYERS.length; i++) {
    const [h, m] = PRAYERS[i].time.split(":").map(Number);
    if (cur >= h * 60 + m) idx = i;
  }
  return idx;
}

function getNextPrayer(idx: number): { nameAr: string; countdown: string } {
  const nextIdx = (idx + 1) % PRAYERS.length;
  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();
  const [h, m] = PRAYERS[nextIdx].time.split(":").map(Number);
  let diff = h * 60 + m - cur;
  if (diff < 0) diff += 24 * 60;
  const hrs = Math.floor(diff / 60);
  const mins = diff % 60;
  return {
    nameAr: PRAYERS[nextIdx].nameAr,
    countdown: hrs > 0 ? `${toAr(hrs)}س ${toAr(mins)}د` : `${toAr(mins)} دقيقة`,
  };
}

/* ── Prayer icons ──────────────────────────── */
function PrayerIcon({ name, active }: { name: string; active: boolean }) {
  const c = active ? "#4ADE80" : "#6B7A6B";
  const icons: Record<string, React.ReactNode> = {
    fajr: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" fill={c} opacity={active ? 0.92 : 0.6} />
      </svg>
    ),
    sunrise: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M17 18a5 5 0 1 0-10 0" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M3 18h18M12 2v3M5.22 7.22l1.42 1.42M18.78 7.22l-1.42 1.42" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    dhuhr: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="4.5" fill={c} opacity={active ? 0.88 : 0.55} />
        <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
          stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    asr: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="11" r="3.8" fill={c} opacity={active ? 0.82 : 0.52} />
        <path d="M12 2v2M12 18v2M4.22 4.22l1.42 1.42M2 11h2M20 11h2M4 18h16"
          stroke={c} strokeWidth="1.4" strokeLinecap="round" opacity={active ? 0.85 : 0.55}/>
      </svg>
    ),
    maghrib: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M17 18a5 5 0 1 0-10 0" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M3 18h18" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M19 9A7 7 0 1 1 5 9" stroke={c} strokeWidth="1.3" strokeLinecap="round" opacity="0.5"/>
      </svg>
    ),
    isha: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill={c} opacity={active ? 0.9 : 0.58}/>
        <circle cx="17.5" cy="5.5" r="0.85" fill={c}/>
        <circle cx="19.5" cy="9.5" r="0.6" fill={c} opacity="0.65"/>
      </svg>
    ),
  };
  return <>{icons[name] ?? null}</>;
}

/* ── Star field ────────────────────────────── */
function StarField() {
  const stars = useRef<{ x: number; y: number; r: number; dur: number; del: number; bright: boolean }[]>([]);
  if (!stars.current.length) {
    stars.current = Array.from({ length: 54 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 58,
      r: Math.random() * 1.5 + 0.3,
      dur: Math.random() * 4 + 2,
      del: Math.random() * 9,
      bright: Math.random() > 0.52,
    }));
  }
  return (
    <>
      {stars.current.map((s, i) => (
        <div key={i} className="star" style={{
          left: `${s.x}%`, top: `${s.y}%`,
          width: s.r * 2, height: s.r * 2,
          background: s.bright ? "#FFFDE8" : "#C8AE60",
          boxShadow: s.bright ? `0 0 ${s.r * 5}px rgba(255,253,220,0.9)` : "none",
          "--dur": `${s.dur}s`, "--del": `${s.del}s`,
        } as React.CSSProperties} />
      ))}
    </>
  );
}

/* ── Grand Mosque SVG ──────────────────────── */
function MosqueSVG() {
  return (
    <svg viewBox="0 0 420 260" preserveAspectRatio="xMidYMax meet" width="100%" height="260" aria-hidden="true">
      <defs>
        <linearGradient id="mq" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#03091A" />
          <stop offset="100%" stopColor="#010608" />
        </linearGradient>
        <linearGradient id="skyFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0B3245" stopOpacity="0" />
          <stop offset="55%"  stopColor="#0D1B2A" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#050C16" stopOpacity="1" />
        </linearGradient>
        <radialGradient id="gndGlow" cx="50%" cy="0%" r="70%">
          <stop offset="0%" stopColor="#1B6B3A" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#1B6B3A" stopOpacity="0" />
        </radialGradient>
        <filter id="goldGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.8" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.6" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* GROUND */}
      <rect x="0" y="208" width="420" height="52" fill="url(#mq)"/>

      {/* FAR-LEFT TINY MINARET */}
      <rect x="2" y="138" width="14" height="90" fill="url(#mq)"/>
      <ellipse cx="9" cy="138" rx="9" ry="5" fill="url(#mq)"/>
      <rect x="7" y="126" width="4" height="14" fill="url(#mq)"/>
      <ellipse cx="9" cy="126" rx="5.5" ry="3" fill="url(#mq)"/>
      <rect x="8" y="116" width="2.5" height="11" fill="url(#mq)"/>
      <polygon points="9,112 11.5,119 9,117 6.5,119" fill="#C9A84C" opacity="0.85" filter="url(#goldGlow)"/>
      <circle cx="9" cy="110" r="2" fill="#C9A84C" filter="url(#goldGlow)"/>

      {/* FAR-RIGHT TINY MINARET */}
      <rect x="404" y="138" width="14" height="90" fill="url(#mq)"/>
      <ellipse cx="411" cy="138" rx="9" ry="5" fill="url(#mq)"/>
      <rect x="409" y="126" width="4" height="14" fill="url(#mq)"/>
      <ellipse cx="411" cy="126" rx="5.5" ry="3" fill="url(#mq)"/>
      <rect x="410" y="116" width="2.5" height="11" fill="url(#mq)"/>
      <polygon points="411,112 413.5,119 411,117 408.5,119" fill="#C9A84C" opacity="0.85" filter="url(#goldGlow)"/>
      <circle cx="411" cy="110" r="2" fill="#C9A84C" filter="url(#goldGlow)"/>

      {/* SIDE WALLS */}
      <rect x="16" y="155" width="48" height="105" fill="url(#mq)"/>
      <rect x="356" y="155" width="48" height="105" fill="url(#mq)"/>

      {/* LEFT TALL MAIN MINARET */}
      <rect x="40" y="6" width="28" height="200" fill="url(#mq)"/>
      <rect x="34" y="62" width="40" height="5" rx="2.5" fill="url(#mq)"/>
      <rect x="34" y="112" width="40" height="5" rx="2.5" fill="url(#mq)"/>
      <rect x="34" y="152" width="40" height="4" rx="2" fill="url(#mq)"/>
      <ellipse cx="54" cy="6" rx="20" ry="10" fill="url(#mq)"/>
      <rect x="50" y="-8" width="8" height="16" fill="url(#mq)"/>
      <ellipse cx="54" cy="-8" rx="11" ry="6" fill="url(#mq)"/>
      <rect x="52" y="-19" width="4.5" height="12" fill="url(#mq)"/>
      <polygon points="54,-22 58.5,-13 54,-14.5 49.5,-13" fill="#C9A84C" opacity="1" filter="url(#goldGlow)"/>
      <circle cx="54" cy="-24.5" r="3.8" fill="#C9A84C" filter="url(#goldGlow)"/>

      {/* RIGHT TALL MAIN MINARET */}
      <rect x="352" y="6" width="28" height="200" fill="url(#mq)"/>
      <rect x="346" y="62" width="40" height="5" rx="2.5" fill="url(#mq)"/>
      <rect x="346" y="112" width="40" height="5" rx="2.5" fill="url(#mq)"/>
      <rect x="346" y="152" width="40" height="4" rx="2" fill="url(#mq)"/>
      <ellipse cx="366" cy="6" rx="20" ry="10" fill="url(#mq)"/>
      <rect x="362" y="-8" width="8" height="16" fill="url(#mq)"/>
      <ellipse cx="366" cy="-8" rx="11" ry="6" fill="url(#mq)"/>
      <rect x="364" y="-19" width="4.5" height="12" fill="url(#mq)"/>
      <polygon points="366,-22 370.5,-13 366,-14.5 361.5,-13" fill="#C9A84C" opacity="1" filter="url(#goldGlow)"/>
      <circle cx="366" cy="-24.5" r="3.8" fill="#C9A84C" filter="url(#goldGlow)"/>

      {/* MAIN BODY */}
      <rect x="68" y="128" width="284" height="132" fill="url(#mq)"/>

      {/* LEFT SECONDARY DOME */}
      <ellipse cx="128" cy="106" rx="40" ry="26" fill="url(#mq)"/>
      <rect x="88" y="106" width="80" height="154" fill="url(#mq)"/>
      <rect x="126" y="76" width="4.5" height="32" fill="url(#mq)"/>
      <ellipse cx="128" cy="76" rx="8.5" ry="4.5" fill="url(#mq)"/>
      <circle cx="128" cy="71" r="3.2" fill="#C9A84C" opacity="0.7" filter="url(#softGlow)"/>

      {/* RIGHT SECONDARY DOME */}
      <ellipse cx="292" cy="106" rx="40" ry="26" fill="url(#mq)"/>
      <rect x="252" y="106" width="80" height="154" fill="url(#mq)"/>
      <rect x="289.5" y="76" width="4.5" height="32" fill="url(#mq)"/>
      <ellipse cx="292" cy="76" rx="8.5" ry="4.5" fill="url(#mq)"/>
      <circle cx="292" cy="71" r="3.2" fill="#C9A84C" opacity="0.7" filter="url(#softGlow)"/>

      {/* GRAND CENTRAL DOME */}
      <ellipse cx="210" cy="60" rx="82" ry="56" fill="url(#mq)"/>
      <rect x="128" y="60" width="164" height="200" fill="url(#mq)"/>
      <path d="M128 82 Q210 36 292 82" stroke="#010A17" strokeWidth="1.8" fill="none" opacity="0.7"/>
      <path d="M132 100 Q210 56 288 100" stroke="#010A17" strokeWidth="1.2" fill="none" opacity="0.45"/>
      <path d="M138 118 Q210 76 282 118" stroke="#010A17" strokeWidth="0.85" fill="none" opacity="0.3"/>
      <path d="M146 136 Q210 98 274 136" stroke="#010A17" strokeWidth="0.6" fill="none" opacity="0.2"/>
      <rect x="207" y="10" width="6.5" height="52" fill="url(#mq)"/>
      <ellipse cx="210" cy="10" rx="14" ry="7.5" fill="url(#mq)"/>
      <rect x="208" y="-4" width="4.5" height="16" fill="url(#mq)"/>
      <polygon points="210,-7 215,-1 210,0.5 205,-1" fill="#C9A84C" opacity="1" filter="url(#goldGlow)"/>
      <circle cx="210" cy="-9.5" r="4.5" fill="#C9A84C" filter="url(#goldGlow)"/>

      {/* ARCHED WINDOWS */}
      <rect x="180" y="130" width="20" height="34" rx="10" fill="#112213" opacity="0.9"/>
      <rect x="206" y="130" width="20" height="34" rx="10" fill="#112213" opacity="0.9"/>
      <rect x="150" y="134" width="17" height="28" rx="8.5" fill="#0E1D10" opacity="0.7"/>
      <rect x="253" y="134" width="17" height="28" rx="8.5" fill="#0E1D10" opacity="0.7"/>
      <rect x="98" y="136" width="13" height="24" rx="6.5" fill="#0A1610" opacity="0.55"/>
      <rect x="309" y="136" width="13" height="24" rx="6.5" fill="#0A1610" opacity="0.55"/>
      <rect x="28" y="163" width="10" height="20" rx="5" fill="#09120C" opacity="0.5"/>
      <rect x="382" y="163" width="10" height="20" rx="5" fill="#09120C" opacity="0.5"/>

      {/* ENTRANCE ARCH */}
      <rect x="198" y="162" width="24" height="46" rx="12" fill="#020A12"/>
      <rect x="201" y="166" width="8" height="38" rx="4" fill="#1B6B3A" opacity="0.1"/>
      <rect x="211" y="166" width="8" height="38" rx="4" fill="#1B6B3A" opacity="0.1"/>
      <path d="M198 174 Q210 156 222 174" fill="#C9A84C" opacity="0.07"/>

      {/* SKY FADE OVERLAY */}
      <rect x="0" y="0" width="420" height="260" fill="url(#skyFade)"/>

      {/* GROUND EMERALD GLOW */}
      <ellipse cx="210" cy="220" rx="180" ry="10" fill="url(#gndGlow)"/>

      <line x1="0" y1="208" x2="420" y2="208" stroke="rgba(201,168,76,0.09)" strokeWidth="0.8"/>
    </svg>
  );
}

/* ── Main HeroSection ──────────────────────── */
export default function HeroSection() {
  const [hijriDate, setHijriDate] = useState("");
  const [clockTime, setClockTime] = useState("");
  const [prayerIdx, setPrayerIdx] = useState(2);
  const [nextPrayer, setNextPrayer] = useState({ nameAr: "", countdown: "" });

  useEffect(() => {
    setHijriDate(getHijriDate());
    const tick = () => {
      const now = new Date();
      setClockTime(now.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit", hour12: true }));
      const idx = getCurrentPrayerIdx();
      setPrayerIdx(idx);
      setNextPrayer(getNextPrayer(idx));
    };
    tick();
    const iv = setInterval(tick, 30_000);
    return () => clearInterval(iv);
  }, []);

  return (
    <section className="relative overflow-hidden" style={{ minHeight: 570 }}>
      {/* Sky gradient */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, #000B18 0%, #011320 12%, #052030 26%, #0A2E42 42%, #0F4038 58%, #155535 74%, #1B6B3A 100%)",
      }} />

      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <StarField />
      </div>

      {/* Shooting star */}
      <div className="absolute pointer-events-none" style={{ top: "10%", right: "26%" }}>
        <div style={{
          width: 65, height: 1.5,
          background: "linear-gradient(90deg, transparent, #E2C47A)",
          borderRadius: 2, opacity: 0.7,
          animation: "shoot 8s ease-out 4s infinite",
        }} />
      </div>

      {/* Crescent moon */}
      <div className="absolute crescent pointer-events-none"
        style={{ top: "7%", right: "6%", filter: "drop-shadow(0 0 16px rgba(201,168,76,0.65))" }}>
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
          <defs>
            <radialGradient id="moonR" cx="38%" cy="26%" r="65%">
              <stop offset="0%" stopColor="#FFFCEC"/>
              <stop offset="50%" stopColor="#EAC96A"/>
              <stop offset="100%" stopColor="#B8962E"/>
            </radialGradient>
          </defs>
          <path d="M36 10 C27 10 21 18 21 28.5 C21 39 27 46 36 46 C30 42.5 25 36.5 25 28.5 C25 20.5 30 14 36 10Z"
            fill="url(#moonR)"/>
          <circle cx="17" cy="17" r="1.2" fill="#FFFCE8" opacity="0.65"/>
          <circle cx="14" cy="30" r="0.8" fill="#FFFCE8" opacity="0.45"/>
          <circle cx="41" cy="9" r="0.9" fill="#FFFCE8" opacity="0.6"/>
        </svg>
      </div>

      {/* Top-left geometric ornament */}
      <div className="absolute pointer-events-none" style={{ top: "6%", left: "4%", opacity: 0.09 }}>
        <svg width="54" height="54" viewBox="0 0 54 54">
          <polygon points="27,3 31,16.5 46,17 34,27 38,43 27,35 16,43 20,27 8,17 23,16.5" fill="none" stroke="#C9A84C" strokeWidth="0.9"/>
          <circle cx="27" cy="27" r="7" fill="none" stroke="#C9A84C" strokeWidth="0.5"/>
          <circle cx="27" cy="27" r="2.5" fill="#C9A84C" opacity="0.4"/>
        </svg>
      </div>

      {/* Mosque */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <MosqueSVG />
      </div>

      {/* === Content === */}
      <div className="relative z-10 flex flex-col items-center px-4 pt-6 pb-5">
        {/* Bismillah pill */}
        <div className="fade-up flex items-center gap-2 mb-4 px-5 py-2 rounded-full"
          style={{
            background: "rgba(201,168,76,0.07)",
            border: "1px solid rgba(201,168,76,0.24)",
            backdropFilter: "blur(10px)",
          }}>
          <svg width="7" height="7" viewBox="0 0 10 10">
            <polygon points="5,0.5 6.1,3.5 9.5,3.6 7,5.5 7.8,9 5,7.2 2.2,9 3,5.5 0.5,3.6 3.9,3.5" fill="#C9A84C" opacity="0.8"/>
          </svg>
          <span style={{ fontFamily: "'Amiri', serif", color: "#C9A84C", fontSize: 14.5, letterSpacing: "0.04em", textShadow: "0 0 16px rgba(201,168,76,0.35)" }}>
            بسم الله الرحمن الرحيم
          </span>
          <svg width="7" height="7" viewBox="0 0 10 10">
            <polygon points="5,0.5 6.1,3.5 9.5,3.6 7,5.5 7.8,9 5,7.2 2.2,9 3,5.5 0.5,3.6 3.9,3.5" fill="#C9A84C" opacity="0.8"/>
          </svg>
        </div>

        {/* Welcome title */}
        <div className="fade-up text-center mb-3" style={{ animationDelay: "0.1s" }}>
          <h2 className="text-balance" style={{
            fontFamily: "'Amiri', serif",
            color: "#F5ECD7",
            fontWeight: 700,
            fontSize: "clamp(26px, 7.5vw, 36px)",
            lineHeight: 1.55,
            textShadow: "0 2px 28px rgba(0,0,0,0.95), 0 0 50px rgba(201,168,76,0.06)",
            direction: "rtl",
          }}>
            مرحباً بك في ذو القرنين
          </h2>
        </div>

        {/* Hijri date + clock */}
        <div className="fade-up flex items-center gap-2.5 mb-3 px-4 py-2 rounded-full"
          style={{
            background: "rgba(4,10,22,0.76)",
            border: "1px solid rgba(201,168,76,0.2)",
            backdropFilter: "blur(12px)",
            animationDelay: "0.17s",
          }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="5" width="18" height="16" rx="3" stroke="#C9A84C" strokeWidth="1.8"/>
            <path d="M3 10h18" stroke="#C9A84C" strokeWidth="1.1" opacity="0.4"/>
            <rect x="8" y="2" width="2" height="5" rx="1" fill="#C9A84C"/>
            <rect x="14" y="2" width="2" height="5" rx="1" fill="#C9A84C"/>
          </svg>
          <span style={{ fontFamily: "'Amiri', serif", color: "#C9A84C", fontSize: 13 }}>
            {hijriDate || "جارٍ التحميل..."}
          </span>
          <span style={{ color: "rgba(201,168,76,0.25)", fontSize: 11 }}>|</span>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#8A7848" strokeWidth="1.9">
            <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2" strokeLinecap="round"/>
          </svg>
          <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#C8B890", fontSize: 12 }}>
            {clockTime}
          </span>
        </div>

        {/* Next prayer countdown */}
        {nextPrayer.nameAr && (
          <div className="fade-up flex items-center gap-2 mb-4 px-4 py-2 rounded-full"
            style={{
              background: "rgba(27,107,58,0.14)",
              border: "1px solid rgba(27,107,58,0.32)",
              backdropFilter: "blur(10px)",
              animationDelay: "0.22s",
            }}>
            <span className="live-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ADE80", boxShadow: "0 0 6px #4ADE80", flexShrink: 0, display: "block" }}/>
            <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#88BB88", fontSize: 11 }}>الصلاة القادمة:</span>
            <span style={{ fontFamily: "'Amiri', serif", color: "#E2C47A", fontSize: 14, fontWeight: 700 }}>{nextPrayer.nameAr}</span>
            <span style={{ color: "rgba(201,168,76,0.3)" }}>·</span>
            <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#C9A84C", fontSize: 11, fontWeight: 600 }}>{nextPrayer.countdown}</span>
          </div>
        )}

        {/* Prayer times card — horizontal scrollable row */}
        <div className="fade-up w-full rounded-2xl overflow-hidden"
          style={{
            background: "rgba(3,7,16,0.93)",
            border: "1px solid rgba(201,168,76,0.2)",
            backdropFilter: "blur(18px)",
            boxShadow: "0 16px 52px rgba(0,0,0,0.6), inset 0 1px 0 rgba(201,168,76,0.07)",
            animationDelay: "0.28s",
            maxWidth: 440,
          }}>
          {/* Card header */}
          <div className="flex items-center justify-between px-4 py-2.5"
            style={{ borderBottom: "1px solid rgba(201,168,76,0.08)" }}>
            <div className="flex items-center gap-2">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.8">
                <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 3.5" strokeLinecap="round"/>
              </svg>
              <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#C9A84C", fontSize: 12, fontWeight: 700 }}>
                مواقيت الصلاة
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="live-dot" style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ADE80", boxShadow: "0 0 5px #4ADE80", display: "block" }}/>
              <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#5A9A5A", fontSize: 9 }}>مباشر</span>
            </div>
          </div>

          {/* Horizontal prayer row */}
          <div className="flex overflow-x-auto no-scrollbar" style={{ padding: "4px 0" }}>
            {PRAYERS.map((p, i) => {
              const isActive = i === prayerIdx;
              return (
                <div key={p.name}
                  className={isActive ? "prayer-row-active" : ""}
                  style={{
                    flex: "0 0 auto",
                    minWidth: 68,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    paddingTop: 12,
                    paddingBottom: 12,
                    paddingInline: 6,
                    background: isActive
                      ? "linear-gradient(180deg, rgba(27,107,58,0.32) 0%, rgba(27,107,58,0.1) 100%)"
                      : "transparent",
                    borderRight: i < PRAYERS.length - 1 ? "1px solid rgba(201,168,76,0.07)" : "none",
                    position: "relative",
                    transition: "background 0.3s ease",
                  }}>
                  {/* Active top bar */}
                  {isActive && (
                    <div className="absolute top-0 left-0 right-0" style={{
                      height: 2.5,
                      background: "linear-gradient(90deg, transparent, #4ADE80 30%, #4ADE80 70%, transparent)",
                    }}/>
                  )}
                  <div style={{ marginBottom: 5 }}>
                    <PrayerIcon name={p.name} active={isActive}/>
                  </div>
                  <span style={{
                    fontFamily: "'Tajawal', sans-serif",
                    color: isActive ? "#D8F0D8" : "#8A9A8A",
                    fontSize: 10.5,
                    fontWeight: isActive ? 700 : 500,
                    marginBottom: 4,
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}>{p.nameAr}</span>
                  <span style={{
                    fontFamily: "'Tajawal', sans-serif",
                    color: isActive ? "#4ADE80" : "#7A9A7A",
                    fontSize: 12,
                    fontWeight: isActive ? 700 : 500,
                    direction: "ltr",
                    letterSpacing: "0.02em",
                  }}>{p.time}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
