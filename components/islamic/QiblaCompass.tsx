"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const KAABA_LAT = 21.4225;
const KAABA_LON = 39.8262;

function toRad(d: number) { return (d * Math.PI) / 180; }
function toDeg(r: number) { return (r * 180) / Math.PI; }

function toArNum(n: number | string) {
  return String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[+d]);
}

function qiblaBearing(lat: number, lon: number) {
  const φ1 = toRad(lat), λ1 = toRad(lon);
  const φ2 = toRad(KAABA_LAT), λ2 = toRad(KAABA_LON);
  const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

function distanceToKaaba(lat: number, lon: number) {
  const R = 6371;
  const dLat = toRad(KAABA_LAT - lat);
  const dLon = toRad(KAABA_LON - lon);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat)) * Math.cos(toRad(KAABA_LAT)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function KaabaGlyph({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <rect x="4" y="7" width="16" height="14" rx="1" fill="#0A0A0A" stroke="#C9A84C" strokeWidth="0.8" />
      <rect x="4" y="12.5" width="16" height="2.4" fill="#C9A84C" opacity="0.92" />
      <rect x="10.4" y="7" width="3.2" height="14" fill="none" stroke="#C9A84C" strokeWidth="0.5" opacity="0.5" />
      <polygon points="4,7 12,3 20,7" fill="#0A0A0A" stroke="#C9A84C" strokeWidth="0.8" />
    </svg>
  );
}

type Coords = { lat: number; lon: number };
type HeadingSource = "absolute" | "relative" | "manual" | null;

function getScreenAngle() {
  if (typeof window === "undefined") return 0;
  const so = (window.screen as any)?.orientation;
  if (so && typeof so.angle === "number") return so.angle;
  if (typeof (window as any).orientation === "number") return (window as any).orientation;
  return 0;
}

export default function QiblaCompass({ onBack }: { onBack?: () => void }) {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);
  const [showManual, setShowManual] = useState(false);
  const [manualLat, setManualLat] = useState("");
  const [manualLon, setManualLon] = useState("");

  const [heading, setHeading] = useState<number | null>(null);
  // Continuous (un-wrapped) dial angle so the CSS transition never spins the long way round 359°→0°.
  const [dialAngle, setDialAngle] = useState(0);
  const [headingSource, setHeadingSource] = useState<HeadingSource>(null);
  const [compassActive, setCompassActive] = useState(false);
  const [compassError, setCompassError] = useState<string | null>(null);
  const [needsCalibration, setNeedsCalibration] = useState(false);
  const [showManualHeading, setShowManualHeading] = useState(false);
  const [manualHeadingInput, setManualHeadingInput] = useState("");
  const [screenAngle, setScreenAngle] = useState(0);
  const [secure, setSecure] = useState(true);
  const [noSensorDetected, setNoSensorDetected] = useState(false);

  const listenerRef = useRef<((e: Event) => void) | null>(null);
  const activeEventRef = useRef<"abs" | "rel" | null>(null);
  const alignedVibrated = useRef(false);
  // Low-pass filter state: `h` is the smoothed heading (0-360), `cum` the un-wrapped total.
  const smoothRef = useRef<{ h: number; cum: number } | null>(null);

  useEffect(() => {
    setSecure(typeof window !== "undefined" ? window.isSecureContext !== false : true);
    setScreenAngle(getScreenAngle());
    if (typeof window !== "undefined" && typeof (window as any).DeviceOrientationEvent === "undefined") {
      setNoSensorDetected(true);
    }
    const onRotate = () => setScreenAngle(getScreenAngle());
    window.addEventListener("orientationchange", onRotate);
    window.screen?.orientation?.addEventListener?.("change", onRotate);
    return () => {
      window.removeEventListener("orientationchange", onRotate);
      window.screen?.orientation?.removeEventListener?.("change", onRotate);
    };
  }, []);

  const locate = () => {
    setLocating(true);
    setLocError(null);
    if (!("geolocation" in navigator)) {
      setLocError("المتصفح لا يدعم تحديد الموقع تلقائياً. يمكنك إدخاله يدوياً بالأسفل.");
      setLocating(false);
      setShowManual(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setLocating(false);
      },
      (err) => {
        setLocError(
          err.code === 1
            ? "تم رفض إذن الموقع. فعّله من إعدادات المتصفح، أو أدخل موقعك يدوياً بالأسفل."
            : "تعذّر تحديد موقعك حالياً. حاول مجدداً أو أدخله يدوياً."
        );
        setLocating(false);
        setShowManual(true);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  useEffect(() => { locate(); }, []);

  const onCalibrationNeeded = useCallback(() => setNeedsCalibration(true), []);

  const removeOrientationListeners = () => {
    if (listenerRef.current) {
      window.removeEventListener("deviceorientationabsolute", listenerRef.current as any, true);
      window.removeEventListener("deviceorientation", listenerRef.current as any, true);
    }
    window.removeEventListener("compassneedscalibration", onCalibrationNeeded as any);
  };

  useEffect(() => {
    return () => removeOrientationListeners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sensors fire ~60 times/second with a few degrees of jitter. A circular
  // exponential filter steadies the dial; `cum` keeps the angle continuous.
  const applyHeading = (raw: number, source: HeadingSource, instant = false) => {
    const prev = smoothRef.current;
    if (!prev || instant) {
      smoothRef.current = { h: raw, cum: raw };
    } else {
      const delta = ((raw - prev.h + 540) % 360) - 180; // shortest signed difference
      const step = delta * 0.2;
      smoothRef.current = { h: (prev.h + step + 360) % 360, cum: prev.cum + step };
    }
    const cur = smoothRef.current;
    setHeading(Math.round(cur.h * 10) / 10);
    setDialAngle(-cur.cum);
    setHeadingSource(source);
  };

  const handleOrientation = (e: Event) => {
    const ev = e as DeviceOrientationEvent & { webkitCompassHeading?: number; absolute?: boolean };
    let h: number | null = null;
    let source: HeadingSource = "relative";

    if (typeof ev.webkitCompassHeading === "number") {
      // iOS Safari: compass heading (magnetic north, not corrected for declination).
      h = ev.webkitCompassHeading;
      source = "absolute";
    } else if (ev.alpha != null) {
      const angle = getScreenAngle();
      h = (360 - ev.alpha + angle) % 360;
      source = ev.absolute || activeEventRef.current === "abs" ? "absolute" : "relative";
    }
    if (h != null) {
      applyHeading(((h % 360) + 360) % 360, source);
    }
  };

  const enableCompass = () => {
    setCompassError(null);
    setShowManualHeading(false);
    const DOE: any = (window as any).DeviceOrientationEvent;
    listenerRef.current = handleOrientation;
    window.addEventListener("compassneedscalibration", onCalibrationNeeded as any);

    const attachListeners = () => {
      if ("ondeviceorientationabsolute" in window) {
        activeEventRef.current = "abs";
        window.addEventListener("deviceorientationabsolute", handleOrientation, true);
      } else {
        activeEventRef.current = "rel";
        window.addEventListener("deviceorientation", handleOrientation, true);
      }
      setCompassActive(true);
    };

    if (DOE && typeof DOE.requestPermission === "function") {
      // iOS 13+ requires an explicit user-gesture permission request.
      DOE.requestPermission()
        .then((res: string) => {
          if (res === "granted") {
            window.addEventListener("deviceorientation", handleOrientation, true);
            activeEventRef.current = "rel";
            setCompassActive(true);
            setTimeout(() => {
              if (smoothRef.current == null) {
                setCompassError("لم يُعثر على حساس بوصلة فعّال في هذا الجهاز. استخدم الإدخال اليدوي بالأسفل.");
              }
            }, 2500);
          } else {
            setCompassError("تم رفض إذن البوصلة. يمكنك استخدام الاتجاه الثابت أو الإدخال اليدوي بالأسفل.");
          }
        })
        .catch(() => setCompassError("تعذّر تفعيل حساس البوصلة على هذا الجهاز. استخدم الإدخال اليدوي بالأسفل."));
    } else if (typeof DOE !== "undefined") {
      attachListeners();
      // Safety net: if no orientation event fires within 2.5s, the sensor is likely unavailable
      // (common on desktops/laptops and some Android browsers without a magnetometer).
      setTimeout(() => {
        if (smoothRef.current == null) {
          setCompassError("لم يُعثر على حساس بوصلة فعّال في هذا الجهاز. استخدم الإدخال اليدوي أو الاتجاه الثابت بالأسفل.");
        }
      }, 2500);
    } else {
      setCompassError("جهازك لا يحتوي على حساس بوصلة (شائع في الحواسيب). استخدم الإدخال اليدوي بالأسفل.");
      setNoSensorDetected(true);
    }
  };

  const disableCompass = () => {
    removeOrientationListeners();
    setCompassActive(false);
    setHeading(null);
    setDialAngle(0);
    smoothRef.current = null;
    setHeadingSource(null);
    setNeedsCalibration(false);
    activeEventRef.current = null;
  };

  const submitManual = () => {
    const lat = parseFloat(manualLat);
    const lon = parseFloat(manualLon);
    if (Number.isFinite(lat) && Number.isFinite(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
      setCoords({ lat, lon });
      setLocError(null);
    }
  };

  const submitManualHeading = () => {
    const h = parseFloat(manualHeadingInput);
    if (Number.isFinite(h)) {
      removeOrientationListeners();
      applyHeading(((h % 360) + 360) % 360, "manual", true);
      setCompassActive(true);
      setCompassError(null);
    }
  };

  const bearing = useMemo(() => (coords ? qiblaBearing(coords.lat, coords.lon) : null), [coords]);
  const distance = useMemo(() => (coords ? distanceToKaaba(coords.lat, coords.lon) : null), [coords]);
  const diff = heading != null && bearing != null
    ? Math.min(Math.abs(heading - bearing), 360 - Math.abs(heading - bearing))
    : null;
  const aligned = diff != null && diff <= 5;

  useEffect(() => {
    if (aligned && !alignedVibrated.current) {
      alignedVibrated.current = true;
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        try { navigator.vibrate(60); } catch {}
      }
    } else if (!aligned) {
      alignedVibrated.current = false;
    }
  }, [aligned]);

  const dialSize = 272;

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
          <h2 style={{ fontFamily: "'Amiri', serif", color: "#C9A84C", fontSize: 20, fontWeight: 700 }}>اتجاه القبلة</h2>
          <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#7A6540", fontSize: 11, marginTop: 2 }}>
            تعمل على جميع الأجهزة: الجوال والحاسوب
          </p>
        </div>
      </div>

      {!secure && (
        <div className="mx-4 mt-4 rounded-xl p-3" style={{ background: "rgba(201,96,60,0.08)", border: "1px solid rgba(201,96,60,0.26)" }}>
          <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#E29070", fontSize: 11, lineHeight: 1.7 }}>
            هذا الاتصال غير آمن (HTTPS)، لذا قد لا تعمل البوصلة أو تحديد الموقع تلقائياً. يمكنك استخدام الإدخال اليدوي أدناه.
          </p>
        </div>
      )}

      <div className="px-4 py-6 flex flex-col items-center">
        {!coords ? (
          <div className="w-full rounded-2xl p-6 text-center" style={{ background: "rgba(10,18,32,0.75)", border: "1px solid rgba(201,168,76,0.14)" }}>
            {locating ? (
              <>
                <div className="mx-auto mb-3" style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid rgba(201,168,76,0.18)", borderTopColor: "#C9A84C", animation: "spin 0.9s linear infinite" }} />
                <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#9A8060", fontSize: 13 }}>جارٍ تحديد موقعك...</p>
              </>
            ) : (
              <>
                <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#C98060", fontSize: 13, lineHeight: 1.7 }}>
                  {locError || "نحتاج إلى تحديد موقعك لحساب اتجاه القبلة بدقة."}
                </p>
                <button onClick={locate}
                  className="mt-4 px-5 py-2.5 rounded-xl active:scale-95 transition-transform"
                  style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.3)", color: "#C9A84C", fontFamily: "'Tajawal', sans-serif", fontSize: 13, fontWeight: 600 }}>
                  إعادة تحديد الموقع
                </button>
              </>
            )}
            <button onClick={() => setShowManual((v) => !v)}
              className="block mx-auto mt-3"
              style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A8A6A", fontSize: 11.5, textDecoration: "underline" }}>
              {showManual ? "إخفاء الإدخال اليدوي" : "إدخال الموقع يدوياً"}
            </button>
            {showManual && (
              <div className="mt-4 flex flex-col gap-2">
                <div className="flex gap-2">
                  <input type="number" placeholder="خط العرض" value={manualLat} onChange={(e) => setManualLat(e.target.value)}
                    className="flex-1 rounded-lg px-3 py-2 text-center"
                    style={{ background: "rgba(5,12,22,0.9)", border: "1px solid rgba(201,168,76,0.2)", color: "#F5ECD7", fontFamily: "'Tajawal', sans-serif", fontSize: 12 }} />
                  <input type="number" placeholder="خط الطول" value={manualLon} onChange={(e) => setManualLon(e.target.value)}
                    className="flex-1 rounded-lg px-3 py-2 text-center"
                    style={{ background: "rgba(5,12,22,0.9)", border: "1px solid rgba(201,168,76,0.2)", color: "#F5ECD7", fontFamily: "'Tajawal', sans-serif", fontSize: 12 }} />
                </div>
                <button onClick={submitManual}
                  className="rounded-lg py-2 active:scale-95 transition-transform"
                  style={{ background: "rgba(27,107,58,0.18)", border: "1px solid rgba(27,107,58,0.38)", color: "#4ADE80", fontFamily: "'Tajawal', sans-serif", fontSize: 12, fontWeight: 600 }}>
                  تأكيد الموقع
                </button>
                <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#5A4A38", fontSize: 10 }}>
                  مثال مكة المكرمة: ٢١.٤٢٢٥, ٣٩.٨٢٦٢
                </p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Compass dial */}
            <div className="relative" style={{ width: dialSize, height: dialSize }}>
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full" style={{
                background: "radial-gradient(circle at 50% 35%, rgba(27,107,58,0.1), rgba(3,7,16,0.97))",
                border: `1.5px solid ${aligned ? "rgba(74,222,128,0.6)" : "rgba(201,168,76,0.28)"}`,
                boxShadow: aligned ? "0 0 36px rgba(74,222,128,0.28)" : "0 12px 40px rgba(0,0,0,0.5)",
                transition: "border 0.3s ease, box-shadow 0.3s ease",
              }} />

              {/* Fixed top pointer (device forward) */}
              <div className="absolute" style={{ top: 4, left: "50%", transform: "translateX(-50%)", zIndex: 5 }}>
                <svg width="16" height="14" viewBox="0 0 16 14">
                  <polygon points="8,0 15,13 8,10 1,13" fill={aligned ? "#4ADE80" : "#C9A84C"} />
                </svg>
              </div>

              {/* Rotating dial (rotates opposite of device heading) */}
              <div className="absolute inset-0" style={{
                transform: `rotate(${heading != null ? dialAngle : 0}deg)`,
                transition: "transform 0.25s ease-out",
              }}>
                {/* Cardinal marks */}
                {[
                  { label: "ش", deg: 0 }, { label: "ق", deg: 90 },
                  { label: "ج", deg: 180 }, { label: "غ", deg: 270 },
                ].map((c) => (
                  <div key={c.label} className="absolute" style={{
                    top: "50%", left: "50%",
                    transform: `rotate(${c.deg}deg) translateY(-${dialSize / 2 - 22}px) rotate(${-c.deg}deg) translate(-50%,-50%)`,
                  }}>
                    <span style={{
                      fontFamily: "'Tajawal', sans-serif",
                      color: c.deg === 0 ? "#C9A84C" : "#6A5A42",
                      fontSize: 13, fontWeight: 700,
                    }}>{c.label}</span>
                  </div>
                ))}

                {/* Tick marks */}
                {Array.from({ length: 36 }, (_, i) => i * 10).map((deg) => (
                  <div key={deg} className="absolute" style={{
                    top: "50%", left: "50%",
                    width: 1, height: deg % 90 === 0 ? 14 : 7,
                    background: "rgba(201,168,76,0.22)",
                    transformOrigin: "top",
                    transform: `rotate(${deg}deg) translateX(-0.5px) translateY(${dialSize / 2 - (deg % 90 === 0 ? 20 : 15)}px)`,
                  }} />
                ))}

                {/* Qibla marker */}
                {bearing != null && (
                  <div className="absolute" style={{
                    top: "50%", left: "50%",
                    transform: `rotate(${bearing}deg) translateY(-${dialSize / 2 - 38}px) translate(-50%,-50%)`,
                  }}>
                    <div style={{ transform: `rotate(${-bearing}deg)` }} className="flex flex-col items-center">
                      <KaabaGlyph size={26} />
                      <div style={{ width: 2, height: dialSize / 2 - 70, background: "linear-gradient(180deg, #C9A84C, transparent)", marginTop: 4, opacity: 0.55 }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Center hub */}
              <div className="absolute" style={{
                top: "50%", left: "50%", transform: "translate(-50%,-50%)",
                width: 14, height: 14, borderRadius: "50%",
                background: aligned ? "#4ADE80" : "#C9A84C",
                boxShadow: `0 0 12px ${aligned ? "#4ADE80" : "#C9A84C"}`,
              }} />
            </div>

            {/* Status */}
            <div className="mt-5 w-full flex flex-col items-center gap-2">
              {aligned && (
                <div className="px-4 py-1.5 rounded-full" style={{ background: "rgba(74,222,128,0.14)", border: "1px solid rgba(74,222,128,0.4)" }}>
                  <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#4ADE80", fontSize: 12.5, fontWeight: 700 }}>✓ أنت الآن متجه نحو القبلة</span>
                </div>
              )}
              {needsCalibration && !aligned && (
                <div className="px-4 py-1.5 rounded-full" style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)" }}>
                  <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#C9A84C", fontSize: 11, fontWeight: 600 }}>⟲ حرّك جهازك على شكل ٨ لمعايرة البوصلة</span>
                </div>
              )}
              <div className="w-full rounded-xl p-3.5 flex flex-col gap-1.5" style={{ background: "rgba(10,18,32,0.75)", border: "1px solid rgba(201,168,76,0.12)" }}>
                <Row label="اتجاه القبلة من الشمال" value={bearing != null ? `${toArNum(Math.round(bearing))}°` : "—"} />
                {heading != null && <Row label="اتجاه بوصلة جهازك" value={`${toArNum(Math.round(heading))}°`} />}
                {distance != null && <Row label="المسافة إلى الكعبة المشرفة" value={`${toArNum(Math.round(distance).toLocaleString("en-US"))} كم`} />}
                {headingSource && (
                  <Row
                    label="مصدر الاتجاه"
                    value={
                      headingSource === "absolute" ? "بوصلة الجهاز (دقيقة)"
                      : headingSource === "relative" ? "بوصلة الجهاز (تقريبية)"
                      : "إدخال يدوي"
                    }
                  />
                )}
              </div>
            </div>

            {/* Compass activation */}
            {!compassActive && (
              <div className="w-full mt-3 rounded-xl p-3.5 text-center" style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.16)" }}>
                <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#8A7040", fontSize: 11.5, lineHeight: 1.7, marginBottom: 8 }}>
                  فعّل بوصلة جهازك ليدور المؤشر تلقائياً مع حركتك. إن لم يحتوِ جهازك على حساس بوصلة (كالحواسيب)، استخدم الإدخال اليدوي.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {!noSensorDetected && (
                    <button onClick={enableCompass}
                      className="px-5 py-2 rounded-xl active:scale-95 transition-transform"
                      style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.3)", color: "#C9A84C", fontFamily: "'Tajawal', sans-serif", fontSize: 12.5, fontWeight: 600 }}>
                      تفعيل بوصلة الجهاز
                    </button>
                  )}
                  <button onClick={() => setShowManualHeading((v) => !v)}
                    className="px-5 py-2 rounded-xl active:scale-95 transition-transform"
                    style={{ background: "rgba(27,107,58,0.1)", border: "1px solid rgba(27,107,58,0.3)", color: "#4ADE80", fontFamily: "'Tajawal', sans-serif", fontSize: 12.5, fontWeight: 600 }}>
                    إدخال الاتجاه يدوياً
                  </button>
                </div>
                {compassError && (
                  <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#C98060", fontSize: 10.5, marginTop: 8 }}>{compassError}</p>
                )}
                {showManualHeading && (
                  <div className="mt-4 flex flex-col gap-2">
                    <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A8A6A", fontSize: 10.5, lineHeight: 1.6 }}>
                      افتح أي بوصلة خارجية (أو استخدم اتجاه الشمس/النجم القطبي)، ثم أدخل الدرجة التي يشير إليها جهازك الآن من الشمال (٠ إلى ٣٦٠).
                    </p>
                    <div className="flex gap-2">
                      <input type="number" min={0} max={360} placeholder="مثال: ١٨٠" value={manualHeadingInput}
                        onChange={(e) => setManualHeadingInput(e.target.value)}
                        className="flex-1 rounded-lg px-3 py-2 text-center"
                        style={{ background: "rgba(5,12,22,0.9)", border: "1px solid rgba(201,168,76,0.2)", color: "#F5ECD7", fontFamily: "'Tajawal', sans-serif", fontSize: 12 }} />
                      <button onClick={submitManualHeading}
                        className="px-4 rounded-lg active:scale-95 transition-transform"
                        style={{ background: "rgba(27,107,58,0.18)", border: "1px solid rgba(27,107,58,0.38)", color: "#4ADE80", fontFamily: "'Tajawal', sans-serif", fontSize: 12, fontWeight: 600 }}>
                        تعيين
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {compassActive && (
              <button onClick={disableCompass}
                className="mt-3"
                style={{ fontFamily: "'Tajawal', sans-serif", color: "#8A7040", fontSize: 11, textDecoration: "underline" }}>
                {headingSource === "manual" ? "تعديل الاتجاه اليدوي" : "إيقاف البوصلة"}
              </button>
            )}

            <button onClick={() => { setCoords(null); setShowManual(false); disableCompass(); locate(); }}
              className="mt-2"
              style={{ fontFamily: "'Tajawal', sans-serif", color: "#5A7A5A", fontSize: 11, textDecoration: "underline" }}>
              إعادة تحديد الموقع
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#7A6540", fontSize: 11.5 }}>{label}</span>
      <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#E2C47A", fontSize: 13, fontWeight: 700, direction: "ltr" }}>{value}</span>
    </div>
  );
}
