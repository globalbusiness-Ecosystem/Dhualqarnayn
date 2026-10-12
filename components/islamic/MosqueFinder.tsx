"use client";

import { useCallback, useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import { searchMosques, firstSuccess, type Mosque } from "@/lib/mosques";

interface Props {
  onBack: () => void;
}

type Status = "idle" | "locating" | "loading" | "done" | "denied" | "error";

export default function MosqueFinder({ onBack }: Props) {
  const { locale } = useLanguage();
  const isAr = locale === "ar";
  const [status, setStatus] = useState<Status>("idle");
  const [mosques, setMosques] = useState<Mosque[]>([]);

  const search = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setStatus("error");
      return;
    }
    setStatus("locating");
    const onPos = async (pos: GeolocationPosition) => {
      setStatus("loading");
      try {
        const { latitude, longitude } = pos.coords;
        const fromServer = async (): Promise<Mosque[]> => {
          const res = await fetch(`/api/mosques?lat=${latitude}&lon=${longitude}`);
          if (!res.ok) throw new Error("server-failed");
          return (await res.json()).mosques || [];
        };
        // Ask our server AND this device at the same time; the first answer wins.
        const list = await firstSuccess([
          fromServer(),
          searchMosques(latitude, longitude, { deadlineMs: 28000 }),
        ]);
        setMosques(list);
        setStatus("done");
      } catch {
        setStatus("error");
      }
    };
    navigator.geolocation.getCurrentPosition(
      onPos,
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setStatus("denied");
          return;
        }
        // High accuracy (GPS) can time out indoors/desktop — retry with network location.
        navigator.geolocation.getCurrentPosition(
          onPos,
          (err2) => setStatus(err2.code === err2.PERMISSION_DENIED ? "denied" : "error"),
          { enableHighAccuracy: false, timeout: 15000, maximumAge: 5 * 60 * 1000 }
        );
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60 * 1000 }
    );
  }, []);

  const directionsUrl = (m: Mosque) => `https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lon}&travelmode=walking`;

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
              {isAr ? "المساجد القريبة" : "Nearby Mosques"}
            </p>
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 10 }}>
              {isAr ? "ابحث عن أقرب مسجد لك في أي مكان بالعالم" : "Find the closest mosque anywhere in the world"}
            </p>
          </div>
        </div>
      </header>

      <div className="px-4 py-5">
        {status === "idle" && (
          <div className="rounded-2xl p-6 text-center" style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.15)" }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(201,168,76,0.09)", border: "1px solid rgba(201,168,76,0.25)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" stroke="#C9A84C" strokeWidth="1.8"/>
                <circle cx="12" cy="9.5" r="2.3" stroke="#C9A84C" strokeWidth="1.8"/>
              </svg>
            </div>
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#F5ECD7", fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
              {isAr ? "نحتاج موقعك لإيجاد أقرب المساجد" : "We need your location to find nearby mosques"}
            </p>
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 11.5, lineHeight: 1.7, marginBottom: 18 }}>
              {isAr
                ? "لن يُستخدم موقعك إلا لعرض المساجد القريبة منك فوراً، ولا يُحفظ في أي مكان."
                : "Your location is only used to show mosques near you right now — it is never saved anywhere."}
            </p>
            <button onClick={search}
              className="w-full py-3.5 rounded-2xl active:scale-95"
              style={{ background: "linear-gradient(135deg, #1B6B3A, #228B4A)", boxShadow: "0 6px 20px rgba(27,107,58,0.35)" }}>
              <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#F5ECD7", fontSize: 14, fontWeight: 700 }}>
                {isAr ? "تحديد موقعي والبحث" : "Use my location & search"}
              </span>
            </button>
          </div>
        )}

        {(status === "locating" || status === "loading") && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-10 h-10 rounded-full animate-spin mb-4"
              style={{ border: "3px solid rgba(201,168,76,0.15)", borderTopColor: "#C9A84C" }} />
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 12 }}>
              {status === "locating"
                ? (isAr ? "تحديد موقعك..." : "Finding your location...")
                : (isAr ? "البحث عن المساجد القريبة..." : "Searching nearby mosques...")}
            </p>
          </div>
        )}

        {status === "denied" && (
          <div className="rounded-2xl p-6 text-center" style={{ background: "rgba(201,76,76,0.05)", border: "1px solid rgba(201,76,76,0.2)" }}>
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#E29A9A", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
              {isAr ? "تم رفض إذن الموقع" : "Location permission denied"}
            </p>
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 11.5, lineHeight: 1.7, marginBottom: 14 }}>
              {isAr
                ? "يرجى تفعيل إذن الموقع للمتصفح من إعدادات الجهاز، ثم إعادة المحاولة."
                : "Please enable location permission in your device settings, then try again."}
            </p>
            <button onClick={search} className="px-5 py-2.5 rounded-xl active:scale-95"
              style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.25)" }}>
              <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#C9A84C", fontSize: 12.5, fontWeight: 700 }}>
                {isAr ? "إعادة المحاولة" : "Try again"}
              </span>
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="rounded-2xl p-6 text-center" style={{ background: "rgba(201,76,76,0.05)", border: "1px solid rgba(201,76,76,0.2)" }}>
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#E29A9A", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
              {isAr ? "تعذّر البحث حالياً" : "Couldn't search right now"}
            </p>
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 11.5, lineHeight: 1.7, marginBottom: 14 }}>
              {isAr ? "تحقق من اتصالك بالإنترنت وحاول مرة أخرى." : "Check your internet connection and try again."}
            </p>
            <button onClick={search} className="px-5 py-2.5 rounded-xl active:scale-95"
              style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.25)" }}>
              <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#C9A84C", fontSize: 12.5, fontWeight: 700 }}>
                {isAr ? "إعادة المحاولة" : "Try again"}
              </span>
            </button>
          </div>
        )}

        {status === "done" && (
          <>
            <div className="flex items-center justify-between mb-3 px-1">
              <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#C9B894", fontSize: 12, fontWeight: 600 }}>
                {mosques.length > 0
                  ? (isAr ? `${mosques.length} مسجد قريب منك` : `${mosques.length} mosques near you`)
                  : (isAr ? "لا توجد نتائج" : "No results")}
              </p>
              <button onClick={search} className="px-3 py-1.5 rounded-lg active:scale-95"
                style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.18)" }}>
                <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#C9A84C", fontSize: 10.5, fontWeight: 700 }}>
                  {isAr ? "تحديث" : "Refresh"}
                </span>
              </button>
            </div>

            {mosques.length === 0 ? (
              <div className="rounded-2xl p-6 text-center" style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.15)" }}>
                <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 12, lineHeight: 1.8 }}>
                  {isAr
                    ? "لم نجد مساجد مسجّلة قريبة منك في خريطة المجتمع المفتوحة. قد تكون المنطقة قليلة البيانات — جرّب البحث يدوياً في تطبيق الخرائط."
                    : "No registered mosques were found nearby in the open community map. The area may have limited data — try searching manually in a maps app."}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {mosques.map((m) => (
                  <a key={m.id} href={directionsUrl(m)} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3.5 rounded-2xl active:scale-95"
                    style={{ background: "linear-gradient(145deg, rgba(14,24,40,0.6), rgba(9,16,28,0.8))", border: "1px solid rgba(201,168,76,0.08)" }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(27,107,58,0.1)", border: "1px solid rgba(27,107,58,0.25)" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6" stroke="#4ADE80" strokeWidth="1.8" strokeLinejoin="round"/>
                        <circle cx="12" cy="5" r="1.4" fill="#4ADE80"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="line-clamp-1" style={{ fontFamily: "'Tajawal', sans-serif", color: "#F5ECD7", fontSize: 13, fontWeight: 700 }}>
                        {m.name || (isAr ? "مسجد" : "Mosque")}
                      </p>
                      <p className="line-clamp-1" style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 10.5, marginTop: 2 }}>
                        {m.address || (isAr ? "بدون عنوان مسجّل" : "No registered address")}
                      </p>
                    </div>
                    <div className="text-center flex-shrink-0">
                      <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#C9A84C", fontSize: 12, fontWeight: 700 }}>
                        {m.distanceM < 1000
                          ? `${m.distanceM} ${isAr ? "م" : "m"}`
                          : `${m.distanceKm} ${isAr ? "كم" : "km"}`}
                      </p>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.4, margin: "4px auto 0" }}>
                        <path d="M15 18l-6-6 6-6" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" transform="scale(-1,1) translate(-24,0)"/>
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            )}

            <p className="text-center mt-5 px-2" style={{ fontFamily: "'Tajawal', sans-serif", color: "#5A4830", fontSize: 10, lineHeight: 1.7 }}>
              {isAr
                ? "البيانات من خريطة المجتمع المفتوحة (OpenStreetMap) وقد لا تغطي كل المساجد في منطقتك."
                : "Data from the open community map (OpenStreetMap) and may not cover every mosque in your area."}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
