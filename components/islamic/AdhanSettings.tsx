"use client";

import { useState } from "react";
import { useThemeMode } from "@/contexts/theme-mode-context";
import { useAdhan } from "@/contexts/adhan-context";
import { usePrayerTimes } from "@/contexts/prayer-times-context";
import { ADHAN_PRAYERS } from "@/lib/prayer-times";
import { ADHAN_VOICES } from "@/lib/adhan-voices";

export default function AdhanSettings() {
  const { resolvedTheme } = useThemeMode();
  usePrayerTimes(); // re-render when live timings arrive
  const isDay = resolvedTheme === "day";
  const {
    settings,
    nowPlaying,
    setEnabled,
    setVoice,
    togglePrayer,
    testVoice,
    stopPlaying,
    notificationPermission,
    requestNotificationPermission,
    sendTestNotification,
    setAzkarEnabled,
    setAzkarTime,
  } = useAdhan();
  const [justTested, setJustTested] = useState(false);

  const handleEnableToggle = (next: boolean) => {
    setEnabled(next);
    if (next && notificationPermission === "default") requestNotificationPermission();
  };

  const handleAzkarToggle = (next: boolean) => {
    setAzkarEnabled(next);
    if (next && notificationPermission === "default") requestNotificationPermission();
  };

  const handleTest = () => {
    sendTestNotification();
    setJustTested(true);
    setTimeout(() => setJustTested(false), 2500);
  };

  const ink = isDay ? "#0D1B2A" : "#F5ECD7";
  const sub = isDay ? "#5A6B72" : "#8FA09A";
  const card = isDay ? "rgba(13,27,42,0.04)" : "rgba(245,236,215,0.04)";
  const border = isDay ? "rgba(13,27,42,0.1)" : "rgba(201,168,76,0.14)";
  const gold = "#C9A84C";
  const emerald = "#1B6B3A";

  return (
    <div className="px-4 pt-4 pb-10 max-w-xl mx-auto" dir="rtl">
      <div className="text-center mb-5">
        <h1 style={{ fontFamily: "'Amiri', serif", color: ink, fontSize: 24, fontWeight: 700 }}>
          التذكيرات
        </h1>
        <p style={{ fontFamily: "'Tajawal', sans-serif", color: sub, fontSize: 12.5, marginTop: 4 }}>
          تنبيه صوتي عند كل صلاة، وإشعار لا ينسيك أذكار الصباح والمساء
        </p>
      </div>

      {/* Master toggle */}
      <div
        className="flex items-center justify-between rounded-2xl p-4 mb-3"
        style={{ background: card, border: `1px solid ${border}` }}
      >
        <div>
          <p style={{ fontFamily: "'Tajawal', sans-serif", color: ink, fontSize: 14.5, fontWeight: 700 }}>
            تفعيل تذكير الأذان
          </p>
          <p style={{ fontFamily: "'Tajawal', sans-serif", color: sub, fontSize: 11, marginTop: 2 }}>
            سيعمل التذكير ما دام التطبيق مفتوحاً في جهازك
          </p>
        </div>
        <button
          role="switch"
          aria-checked={settings.enabled}
          onClick={() => handleEnableToggle(!settings.enabled)}
          style={{
            width: 46,
            height: 26,
            borderRadius: 999,
            background: settings.enabled ? emerald : isDay ? "rgba(13,27,42,0.18)" : "rgba(245,236,215,0.18)",
            position: "relative",
            flexShrink: 0,
            transition: "background 0.2s",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: 3,
              right: settings.enabled ? 3 : 23,
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "#fff",
              transition: "right 0.2s",
              boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
            }}
          />
        </button>
      </div>

      {/* Azkar reminder toggle + times */}
      <div
        className="rounded-2xl p-4 mb-3"
        style={{ background: card, border: `1px solid ${border}` }}
      >
        <div className="flex items-center justify-between mb-1">
          <div>
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: ink, fontSize: 14.5, fontWeight: 700 }}>
              تذكير الأذكار
            </p>
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: sub, fontSize: 11, marginTop: 2 }}>
              إشعار بموعد أذكار الصباح والمساء كل يوم
            </p>
          </div>
          <button
            role="switch"
            aria-checked={settings.azkar.enabled}
            onClick={() => handleAzkarToggle(!settings.azkar.enabled)}
            style={{
              width: 46,
              height: 26,
              borderRadius: 999,
              background: settings.azkar.enabled ? emerald : isDay ? "rgba(13,27,42,0.18)" : "rgba(245,236,215,0.18)",
              position: "relative",
              flexShrink: 0,
              transition: "background 0.2s",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: 3,
                right: settings.azkar.enabled ? 3 : 23,
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "#fff",
                transition: "right 0.2s",
                boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
              }}
            />
          </button>
        </div>

        {settings.azkar.enabled && (
          <div className="grid grid-cols-2 gap-2.5 mt-3">
            <div className="rounded-xl px-3 py-2.5" style={{ background: isDay ? "rgba(13,27,42,0.05)" : "rgba(245,236,215,0.05)", border: `1px solid ${border}` }}>
              <p style={{ fontFamily: "'Tajawal', sans-serif", color: sub, fontSize: 10.5, marginBottom: 4 }}>
                🌅 أذكار الصباح
              </p>
              <input
                type="time"
                value={settings.azkar.morningTime}
                onChange={(e) => setAzkarTime("morning", e.target.value)}
                className="w-full bg-transparent outline-none"
                style={{ fontFamily: "'Tajawal', sans-serif", color: ink, fontSize: 14, fontWeight: 700, direction: "ltr" }}
              />
            </div>
            <div className="rounded-xl px-3 py-2.5" style={{ background: isDay ? "rgba(13,27,42,0.05)" : "rgba(245,236,215,0.05)", border: `1px solid ${border}` }}>
              <p style={{ fontFamily: "'Tajawal', sans-serif", color: sub, fontSize: 10.5, marginBottom: 4 }}>
                🌙 أذكار المساء
              </p>
              <input
                type="time"
                value={settings.azkar.eveningTime}
                onChange={(e) => setAzkarTime("evening", e.target.value)}
                className="w-full bg-transparent outline-none"
                style={{ fontFamily: "'Tajawal', sans-serif", color: ink, fontSize: 14, fontWeight: 700, direction: "ltr" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Notification permission status */}
      {notificationPermission === "unsupported" && (
        <div
          className="rounded-2xl p-3.5 mb-3"
          style={{ background: isDay ? "rgba(13,27,42,0.05)" : "rgba(245,236,215,0.05)", border: `1px solid ${border}` }}
        >
          <p style={{ fontFamily: "'Tajawal', sans-serif", color: sub, fontSize: 12 }}>
            متصفحك لا يدعم الإشعارات المنبثقة، لكن الصوت سيعمل ما دام التطبيق مفتوحاً
          </p>
        </div>
      )}

      {notificationPermission === "default" && (
        <button
          onClick={requestNotificationPermission}
          className="w-full text-right rounded-2xl p-3.5 mb-3 flex items-center justify-between"
          style={{ background: `${gold}12`, border: `1px solid ${gold}30` }}
        >
          <span style={{ fontFamily: "'Tajawal', sans-serif", color: ink, fontSize: 12.5 }}>
            فعّل إشعارات المتصفح ليصلك تنبيه حتى لو كنت في تبويب آخر
          </span>
          <span style={{ fontFamily: "'Tajawal', sans-serif", color: gold, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>
            تفعيل
          </span>
        </button>
      )}

      {notificationPermission === "denied" && (
        <div
          className="rounded-2xl p-3.5 mb-3"
          style={{ background: "rgba(200,60,60,0.08)", border: "1px solid rgba(200,60,60,0.25)" }}
        >
          <p style={{ fontFamily: "'Tajawal', sans-serif", color: ink, fontSize: 12.5, fontWeight: 700, marginBottom: 3 }}>
            الإشعارات محظورة من إعدادات المتصفح
          </p>
          <p style={{ fontFamily: "'Tajawal', sans-serif", color: sub, fontSize: 11, lineHeight: 1.7 }}>
            للتذكير حتى في تبويب آخر، افتح إعدادات الموقع في متصفحك واسمح بالإشعارات لهذا التطبيق، ثم أعد فتحه. سيستمر صوت الأذان بالعمل داخل التطبيق في كل الأحوال.
          </p>
        </div>
      )}

      {notificationPermission === "granted" && (
        <div
          className="flex items-center justify-between rounded-2xl p-3.5 mb-3"
          style={{ background: `${emerald}10`, border: `1px solid ${emerald}30` }}
        >
          <span style={{ fontFamily: "'Tajawal', sans-serif", color: emerald, fontSize: 12.5, fontWeight: 700 }}>
            ✓ الإشعارات مفعّلة على جهازك
          </span>
          <button
            onClick={handleTest}
            style={{
              fontFamily: "'Tajawal', sans-serif",
              color: justTested ? emerald : gold,
              fontSize: 12,
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            {justTested ? "تم الإرسال ✓" : "إرسال تجربة"}
          </button>
        </div>
      )}

      {/* Now playing bar */}
      {nowPlaying && (
        <div
          className="flex items-center justify-between rounded-2xl p-3.5 mb-3"
          style={{ background: `${emerald}14`, border: `1px solid ${emerald}40` }}
        >
          <span style={{ fontFamily: "'Tajawal', sans-serif", color: emerald, fontSize: 12.5, fontWeight: 700 }}>
            🔊 يُتلى الآن أذان {nowPlaying}
          </span>
          <button
            onClick={stopPlaying}
            style={{ fontFamily: "'Tajawal', sans-serif", color: ink, fontSize: 11.5, opacity: 0.75 }}
          >
            إيقاف
          </button>
        </div>
      )}

      {/* Voice selection */}
      <div className="rounded-2xl p-4 mb-3" style={{ background: card, border: `1px solid ${border}` }}>
        <p style={{ fontFamily: "'Tajawal', sans-serif", color: ink, fontSize: 13.5, fontWeight: 700, marginBottom: 10 }}>
          اختر صوت المؤذن
        </p>
        <div className="flex flex-col gap-2">
          {ADHAN_VOICES.map((v) => {
            const active = settings.voiceId === v.id;
            return (
              <div
                key={v.id}
                onClick={() => setVoice(v.id)}
                role="radio"
                aria-checked={active}
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setVoice(v.id)}
                className="flex items-center justify-between rounded-xl px-3.5 py-3 cursor-pointer"
                style={{
                  background: active ? `${gold}16` : "transparent",
                  border: `1px solid ${active ? `${gold}55` : border}`,
                }}
              >
                <div>
                  <p style={{ fontFamily: "'Tajawal', sans-serif", color: active ? gold : ink, fontSize: 13, fontWeight: 700 }}>
                    {v.name}
                  </p>
                  <p style={{ fontFamily: "'Tajawal', sans-serif", color: sub, fontSize: 10.5, marginTop: 1 }}>
                    {v.title}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    testVoice(v.id);
                  }}
                  aria-label={`الاستماع إلى ${v.name}`}
                  className="flex items-center justify-center rounded-full flex-shrink-0"
                  style={{ width: 32, height: 32, background: isDay ? "rgba(13,27,42,0.08)" : "rgba(245,236,215,0.08)" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M8 5v14l11-7L8 5z" fill={active ? gold : ink} opacity="0.85" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Per-prayer toggles */}
      <div className="rounded-2xl p-4" style={{ background: card, border: `1px solid ${border}` }}>
        <p style={{ fontFamily: "'Tajawal', sans-serif", color: ink, fontSize: 13.5, fontWeight: 700, marginBottom: 10 }}>
          الصلوات المُفعّلة
        </p>
        <div className="flex flex-col gap-1.5">
          {ADHAN_PRAYERS.map((p) => {
            const on = !settings.mutedPrayers.includes(p.name);
            return (
              <div key={p.name} className="flex items-center justify-between py-1.5">
                <span style={{ fontFamily: "'Tajawal', sans-serif", color: ink, fontSize: 13 }}>{p.nameAr}</span>
                <div className="flex items-center gap-2.5">
                  <span style={{ fontFamily: "'Tajawal', sans-serif", color: sub, fontSize: 11.5, direction: "ltr" }}>
                    {p.time}
                  </span>
                  <button
                    role="switch"
                    aria-checked={on}
                    onClick={() => togglePrayer(p.name)}
                    style={{
                      width: 38,
                      height: 21,
                      borderRadius: 999,
                      background: on ? emerald : isDay ? "rgba(13,27,42,0.16)" : "rgba(245,236,215,0.16)",
                      position: "relative",
                      flexShrink: 0,
                      transition: "background 0.2s",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        top: 2.5,
                        right: on ? 2.5 : 19,
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        background: "#fff",
                        transition: "right 0.2s",
                      }}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p style={{ fontFamily: "'Tajawal', sans-serif", color: sub, fontSize: 10.5, textAlign: "center", marginTop: 16, lineHeight: 1.7 }}>
        مواقيت الصلاة المعروضة تقريبية افتراضية. لحساب دقيق حسب موقعك الجغرافي سيتم ربط مصدر مواقيت رسمي لاحقاً.
      </p>
    </div>
  );
}
