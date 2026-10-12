"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import { usePrayerTimes } from "@/contexts/prayer-times-context";
import { PRAYER_METHODS, getMethodSetting, setMethodSetting, type MethodSetting } from "@/lib/prayer-times";
import { PRAYERS, toArDigits as toAr, getCurrentPrayerIdx } from "@/lib/prayer-times";

interface Props {
  onBack: () => void;
  onOpenAdhan: () => void;
}

const PRAYER_LABELS_EN: Record<string, string> = {
  fajr: "Fajr",
  sunrise: "Sunrise",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
};

function getHijriDate(): string {
  try {
    return (
      new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date()) + " هـ"
    );
  } catch {
    return "١٤ رجب ١٤٤٦ هـ";
  }
}

function PrayerGlyph({ name, color }: { name: string; color: string }) {
  const icons: Record<string, React.ReactNode> = {
    fajr: <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" fill={color} />,
    sunrise: (
      <>
        <path d="M17 18a5 5 0 1 0-10 0" stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M3 18h18M12 2v3M5.22 7.22l1.42 1.42M18.78 7.22l-1.42 1.42" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
    dhuhr: <circle cx="12" cy="12" r="5" fill={color} />,
    asr: (
      <>
        <circle cx="12" cy="14" r="5" fill={color} />
        <path d="M3 21h18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
    maghrib: (
      <>
        <path d="M17 18a5 5 0 1 0-10 0" fill={color} />
        <path d="M3 18h18" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      </>
    ),
    isha: (
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" fill={color} />
    ),
  };
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      {icons[name]}
    </svg>
  );
}

export default function PrayerTimesScreen({ onBack, onOpenAdhan }: Props) {
  const { locale } = useLanguage();
  const { version: prayerVersion, status: prayerStatus, refresh: refreshPrayers } = usePrayerTimes();
  const [method, setMethod] = useState<MethodSetting>("auto");
  useEffect(() => setMethod(getMethodSetting()), []);
  const isAr = locale === "ar";
  const [idx, setIdx] = useState(0);
  const [countdown, setCountdown] = useState({ hrs: 0, mins: 0 });
  const [hijri, setHijri] = useState("");
  const [now, setNow] = useState("");

  useEffect(() => {
    const tick = () => {
      const i = getCurrentPrayerIdx();
      setIdx(i);
      const nextIdx = (i + 1) % PRAYERS.length;
      const d = new Date();
      const cur = d.getHours() * 60 + d.getMinutes();
      const [h, m] = PRAYERS[nextIdx].time.split(":").map(Number);
      let diff = h * 60 + m - cur;
      if (diff < 0) diff += 24 * 60;
      setCountdown({ hrs: Math.floor(diff / 60), mins: diff % 60 });
      setNow(
        new Date().toLocaleTimeString(isAr ? "ar-SA" : "en-US", { hour: "2-digit", minute: "2-digit" })
      );
    };
    tick();
    setHijri(getHijriDate());
    const t = setInterval(tick, 30000);
    return () => clearInterval(t);
  }, [isAr, prayerVersion]);

  const nextPrayerName = PRAYERS[(idx + 1) % PRAYERS.length];
  const nextLabel = isAr ? nextPrayerName.nameAr : PRAYER_LABELS_EN[nextPrayerName.name];
  const countdownLabel = isAr
    ? countdown.hrs > 0
      ? `${toAr(countdown.hrs)}س ${toAr(countdown.mins)}د`
      : `${toAr(countdown.mins)} دقيقة`
    : countdown.hrs > 0
      ? `${countdown.hrs}h ${countdown.mins}m`
      : `${countdown.mins}m`;

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 24 }}>
      <header className="sticky top-0 z-20 px-4 py-3" style={{ background: "rgba(5,12,22,0.96)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
        <div className="flex items-center gap-3">
          <button onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-xl active:scale-90"
            style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.15)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="scale(-1,1) translate(-24,0)"/>
            </svg>
          </button>
          <div>
            <p style={{ fontFamily: "'Amiri', serif", color: "#C9A84C", fontSize: 18, fontWeight: 700 }}>
              {isAr ? "مواقيت الصلاة" : "Prayer Times"}
            </p>
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 10 }}>
              {hijri}
            </p>
          </div>
        </div>
      </header>

      <div className="px-4 py-5">
        {/* Next prayer countdown card */}
        <div className="rounded-2xl p-6 mb-5 text-center relative overflow-hidden"
          style={{ background: "linear-gradient(145deg, rgba(27,107,58,0.16), rgba(14,24,40,0.9))", border: "1px solid rgba(27,107,58,0.3)" }}>
          <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#7ACB7F", fontSize: 11, fontWeight: 600, marginBottom: 8 }}>
            {isAr ? "الصلاة القادمة" : "Next prayer"}
          </p>
          <p style={{ fontFamily: "'Amiri', serif", color: "#F5ECD7", fontSize: 32, fontWeight: 700, marginBottom: 6 }}>
            {nextLabel}
          </p>
          <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#4ADE80", fontSize: 16, fontWeight: 700 }}>
            {isAr ? `بعد ${countdownLabel}` : `in ${countdownLabel}`}
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 10 }}>
              {isAr ? `الوقت الآن: ${toAr(now)}` : `Now: ${now}`}
            </span>
          </div>
        </div>

        {prayerStatus === "fallback" && (
          <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#C9A84C", fontSize: 11, textAlign: "center", marginBottom: 8 }}>
            {isAr ? "المواقيت تقريبية — تعذّر التحميل، تأكد من الإنترنت وصلاحية الموقع" : "Times are approximate — could not load; check your connection and location permission"}
          </p>
        )}

        <div className="mb-3 flex items-center gap-2">
          <label style={{ fontFamily: "'Tajawal', sans-serif", color: "#9A8060", fontSize: 11, flexShrink: 0 }}>
            {isAr ? "طريقة الحساب" : "Method"}
          </label>
          <select
            value={String(method)}
            onChange={(e) => {
              const v: MethodSetting = e.target.value === "auto" ? "auto" : Number(e.target.value);
              setMethod(v);
              setMethodSetting(v);
              refreshPrayers();
            }}
            className="flex-1 rounded-lg px-2 py-2"
            style={{ background: "rgba(5,12,22,0.9)", border: "1px solid rgba(201,168,76,0.2)", color: "#F5ECD7", fontFamily: "'Tajawal', sans-serif", fontSize: 12 }}
          >
            {PRAYER_METHODS.map((m) => (
              <option key={String(m.id)} value={String(m.id)}>{isAr ? m.ar : m.en}</option>
            ))}
          </select>
        </div>

        {/* Prayer list */}
        <div className="flex flex-col gap-2">
          {PRAYERS.map((p, i) => {
            const active = i === idx;
            return (
              <div key={p.name} className="flex items-center gap-3 p-3.5 rounded-2xl"
                style={{
                  background: active
                    ? "linear-gradient(145deg, rgba(27,107,58,0.16), rgba(14,24,40,0.85))"
                    : "linear-gradient(145deg, rgba(14,24,40,0.6), rgba(9,16,28,0.8))",
                  border: active ? "1px solid rgba(74,222,128,0.35)" : "1px solid rgba(201,168,76,0.08)",
                }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: active ? "rgba(74,222,128,0.12)" : "rgba(201,168,76,0.06)", border: `1px solid ${active ? "rgba(74,222,128,0.3)" : "rgba(201,168,76,0.12)"}` }}>
                  <PrayerGlyph name={p.name} color={active ? "#4ADE80" : "#8A7A5A"} />
                </div>
                <div className="flex-1">
                  <p style={{ fontFamily: "'Tajawal', sans-serif", color: active ? "#F5ECD7" : "#C9B894", fontSize: 14, fontWeight: 700 }}>
                    {isAr ? p.nameAr : PRAYER_LABELS_EN[p.name]}
                  </p>
                  {active && (
                    <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#4ADE80", fontSize: 10, marginTop: 2 }}>
                      {isAr ? "الوقت الحالي" : "Current prayer"}
                    </p>
                  )}
                </div>
                <p style={{ fontFamily: "'Tajawal', sans-serif", color: active ? "#4ADE80" : "#C9A84C", fontSize: 15, fontWeight: 700, direction: "ltr" }}>
                  {isAr ? toAr(p.time) : p.time}
                </p>
              </div>
            );
          })}
        </div>

        <button onClick={onOpenAdhan}
          className="w-full mt-5 py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-95"
          style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.22)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2a6 6 0 0 0-6 6v4.586l-1.707 1.707A1 1 0 0 0 5 16h14a1 1 0 0 0 .707-1.707L18 12.586V8a6 6 0 0 0-6-6z" stroke="#C9A84C" strokeWidth="1.6" strokeLinejoin="round"/>
            <path d="M9 19a3 3 0 0 0 6 0" stroke="#C9A84C" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
          <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#C9A84C", fontSize: 13, fontWeight: 700 }}>
            {isAr ? "ضبط تذكير الأذان" : "Set up Adhan reminders"}
          </span>
        </button>

        <p className="text-center mt-5 px-2" style={{ fontFamily: "'Tajawal', sans-serif", color: "#5A4830", fontSize: 10, lineHeight: 1.7 }}>
          {isAr
            ? "الأوقات تقريبية لمنطقتك الزمنية — للحصول على دقة فلكية كاملة راجع هيئة الأوقاف أو المرجع الديني في بلدك."
            : "Times are an approximation for your timezone — for full astronomical precision, consult your local religious authority."}
        </p>
      </div>
    </div>
  );
}
