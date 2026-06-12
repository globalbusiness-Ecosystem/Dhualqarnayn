"use client";

import { useState, useEffect, useRef } from "react";

function toAr(n: number) {
  return String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[+d]);
}

interface Ayah {
  number: number;
  numberInSurah: number;
  text: string;
  translation?: string;
}

interface SurahMeta {
  n: number;
  ar: string;
  en: string;
  ayahs: number;
  juz: number;
  rev: string;
}

interface Props {
  surah: SurahMeta;
  onBack: () => void;
}

const FONT_SIZES = [18, 22, 26, 30];

export default function SurahReader({ surah, onBack }: Props) {
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [showTr, setShowTr] = useState(false);
  const [fontIdx, setFontIdx] = useState(1);
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set());
  const [highlightedAyah, setHighlightedAyah] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fontSize = FONT_SIZES[fontIdx];

  useEffect(() => {
    setLoading(true);
    setError(false);
    setAyahs([]);
    // retryCount is a dependency so retry button re-triggers this effect

    const arabicUrl = `https://api.alquran.cloud/v1/surah/${surah.n}`;
    const translationUrl = `https://api.alquran.cloud/v1/surah/${surah.n}/en.asad`;

    Promise.all([
      fetch(arabicUrl).then((r) => r.json()),
      fetch(translationUrl).then((r) => r.json()),
    ])
      .then(([arData, trData]) => {
        if (arData.code !== 200) throw new Error("API error");
        const arAyahs: { numberInSurah: number; number: number; text: string }[] =
          arData.data.ayahs;
        const trAyahs: { numberInSurah: number; text: string }[] =
          trData.code === 200 ? trData.data.ayahs : [];

        const trMap: Record<number, string> = {};
        trAyahs.forEach((a) => { trMap[a.numberInSurah] = a.text; });

        setAyahs(
          arAyahs.map((a) => ({
            number: a.number,
            numberInSurah: a.numberInSurah,
            text: a.text,
            translation: trMap[a.numberInSurah],
          }))
        );
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surah.n, retryCount]);

  const toggleBookmark = (n: number) => {
    setBookmarked((s) => {
      const next = new Set(s);
      next.has(n) ? next.delete(n) : next.add(n);
      return next;
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#050C16" }} ref={scrollRef}>
      {/* Sticky header */}
      <div
        className="sticky top-0 z-20"
        style={{
          background: "rgba(5,12,22,0.97)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(201,168,76,0.12)",
        }}
      >
        {/* Top row */}
        <div className="flex items-center gap-2 px-3 py-2.5">
          <button
            onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-xl active:scale-90 transition-transform flex-shrink-0"
            style={{
              background: "rgba(201,168,76,0.07)",
              border: "1px solid rgba(201,168,76,0.18)",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#C9A84C"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <path d="M15 18l6-6-6-6" />
            </svg>
          </button>

          <div className="flex-1 text-center min-w-0 px-1">
            <p
              style={{
                fontFamily: "'Amiri', serif",
                color: "#C9A84C",
                fontSize: 21,
                fontWeight: 700,
                lineHeight: 1.1,
                direction: "rtl",
              }}
            >
              سورة {surah.ar}
            </p>
            <p
              style={{
                fontFamily: "'Tajawal', sans-serif",
                color: "#5A4A28",
                fontSize: 10,
                marginTop: 1,
              }}
            >
              {surah.en} · {toAr(surah.ayahs)} آية · الجزء {toAr(surah.juz)} · {surah.rev}
            </p>
          </div>

          {/* Font size toggle */}
          <button
            onClick={() => setFontIdx((i) => (i + 1) % FONT_SIZES.length)}
            className="w-9 h-9 flex items-center justify-center rounded-xl active:scale-90 transition-transform flex-shrink-0"
            style={{
              background: "rgba(201,168,76,0.05)",
              border: "1px solid rgba(201,168,76,0.12)",
            }}
          >
            <span
              style={{
                fontFamily: "'Tajawal', sans-serif",
                color: "rgba(201,168,76,0.55)",
                fontSize: 10,
                fontWeight: 700,
              }}
            >
              أ{fontIdx + 1}
            </span>
          </button>
        </div>

        {/* Tools row */}
        <div className="flex items-center gap-2 px-3 pb-2.5">
          <button
            onClick={() => setShowTr((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
            style={{
              background: showTr ? "rgba(201,168,76,0.1)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${showTr ? "rgba(201,168,76,0.3)" : "rgba(201,168,76,0.1)"}`,
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke={showTr ? "#C9A84C" : "rgba(201,168,76,0.4)"}
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <path d="M3 5h12M9 3v2M5 8c0 2.5 1.2 5 3.5 7M11 8c0 2.5-1.2 5-3.5 7M21 21l-6-6 2.5-6.5L21 21z" />
            </svg>
            <span
              style={{
                fontFamily: "'Tajawal', sans-serif",
                fontSize: 10.5,
                color: showTr ? "#C9A84C" : "rgba(201,168,76,0.45)",
                fontWeight: showTr ? 700 : 400,
              }}
            >
              الترجمة الإنجليزية
            </span>
          </button>

          <div className="flex-1" />

          <div
            className="flex items-center gap-1 px-2 py-1 rounded-md"
            style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.08)" }}
          >
            <span
              style={{
                fontFamily: "'Tajawal', sans-serif",
                color: "#5A4A28",
                fontSize: 9.5,
              }}
            >
              {toAr(surah.ayahs)} آية
            </span>
          </div>
        </div>
      </div>

      {/* Bismillah — not for At-Tawbah (9) */}
      {surah.n !== 9 && (
        <div
          className="px-4 py-5 text-center"
          style={{ borderBottom: "1px solid rgba(201,168,76,0.07)" }}
        >
          <p
            style={{
              fontFamily: "'Amiri', serif",
              color: "rgba(201,168,76,0.55)",
              fontSize: 22,
              letterSpacing: "0.03em",
              lineHeight: 2,
            }}
          >
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </p>
          <div className="flex items-center justify-center gap-3 mt-1">
            <div style={{ height: 1, width: 50, background: "rgba(201,168,76,0.1)" }} />
            <svg width="10" height="10" viewBox="0 0 16 16">
              <polygon
                points="8,1 15,8 8,15 1,8"
                fill="none"
                stroke="#C9A84C"
                strokeWidth="0.8"
                opacity="0.3"
              />
            </svg>
            <div style={{ height: 1, width: 50, background: "rgba(201,168,76,0.1)" }} />
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-5">
          <div
            style={{
              width: 52,
              height: 52,
              border: "2px solid rgba(201,168,76,0.1)",
              borderTop: "2px solid #C9A84C",
              borderRadius: "50%",
              animation: "spin 0.9s linear infinite",
            }}
          />
          <p
            style={{
              fontFamily: "'Amiri', serif",
              color: "rgba(201,168,76,0.4)",
              fontSize: 16,
            }}
          >
            جاري تحميل السورة...
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 px-8 text-center">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.3)" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
          </svg>
          <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#5A4828", fontSize: 14 }}>
            تعذّر تحميل السورة. تحقق من اتصالك بالإنترنت.
          </p>
          <button
            onClick={() => setRetryCount((c) => c + 1)}
            className="px-5 py-2.5 rounded-xl active:scale-95 transition-transform"
            style={{
              background: "rgba(201,168,76,0.08)",
              border: "1px solid rgba(201,168,76,0.25)",
              fontFamily: "'Tajawal', sans-serif",
              color: "#C9A84C",
              fontSize: 13,
            }}
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* Ayahs */}
      {!loading && !error && (
        <div className="pb-32">
          {ayahs.map((ayah) => {
            const isBookmarked = bookmarked.has(ayah.numberInSurah);
            const isHighlighted = highlightedAyah === ayah.numberInSurah;

            return (
              <div
                key={ayah.numberInSurah}
                className="px-4 py-4 transition-colors"
                style={{
                  borderBottom: "1px solid rgba(201,168,76,0.06)",
                  background: isHighlighted
                    ? "rgba(201,168,76,0.04)"
                    : "transparent",
                }}
              >
                {/* Ayah number badge + arabic text */}
                <div
                  className="flex items-start gap-2"
                  style={{ direction: "rtl" }}
                >
                  {/* Octagon badge */}
                  <div className="flex-shrink-0 mt-1 relative">
                    <svg width="28" height="28" viewBox="0 0 28 28">
                      <polygon
                        points="14,2 25,8 25,20 14,26 3,20 3,8"
                        fill="rgba(201,168,76,0.07)"
                        stroke="rgba(201,168,76,0.22)"
                        strokeWidth="0.8"
                      />
                      <text
                        x="14"
                        y="19"
                        textAnchor="middle"
                        fontFamily="'Amiri', serif"
                        fontSize="10"
                        fill="#C9A84C"
                      >
                        {toAr(ayah.numberInSurah)}
                      </text>
                    </svg>
                  </div>

                  {/* Arabic text */}
                  <p
                    style={{
                      fontFamily: "'Amiri', serif",
                      color: "#F0E2C2",
                      fontSize: fontSize,
                      lineHeight: 2.1,
                      textAlign: "right",
                      flex: 1,
                      wordBreak: "break-word",
                    }}
                  >
                    {ayah.text}
                  </p>
                </div>

                {/* Translation */}
                {showTr && ayah.translation && (
                  <div
                    className="mt-3 pt-3"
                    style={{
                      borderTop: "1px dashed rgba(201,168,76,0.08)",
                      direction: "ltr",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'Tajawal', sans-serif",
                        color: "#6A5840",
                        fontSize: 12.5,
                        lineHeight: 1.8,
                        textAlign: "left",
                      }}
                    >
                      {ayah.translation}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div
                  className="flex items-center gap-1.5 mt-3"
                  style={{ justifyContent: "flex-end" }}
                >
                  {/* Ayah number label */}
                  <span
                    style={{
                      fontFamily: "'Tajawal', sans-serif",
                      color: "#3A2E18",
                      fontSize: 10,
                      marginLeft: "auto",
                      marginRight: 4,
                    }}
                  >
                    {toAr(ayah.numberInSurah)} : {toAr(surah.n)}
                  </span>

                  <button
                    onClick={() =>
                      setHighlightedAyah((h) =>
                        h === ayah.numberInSurah ? null : ayah.numberInSurah
                      )
                    }
                    className="flex items-center gap-1 px-2 py-1.5 rounded-lg active:scale-90 transition-transform"
                    style={{
                      background: "transparent",
                      border: "1px solid rgba(201,168,76,0.09)",
                    }}
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="rgba(201,168,76,0.4)"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    >
                      <circle cx="12" cy="12" r="4" />
                      <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
                    </svg>
                    <span
                      style={{
                        fontFamily: "'Tajawal', sans-serif",
                        fontSize: 9.5,
                        color: "rgba(201,168,76,0.4)",
                      }}
                    >
                      تحديد
                    </span>
                  </button>

                  <button
                    onClick={() => toggleBookmark(ayah.numberInSurah)}
                    className="flex items-center gap-1 px-2 py-1.5 rounded-lg active:scale-90 transition-transform"
                    style={{
                      background: isBookmarked
                        ? "rgba(201,168,76,0.08)"
                        : "transparent",
                      border: `1px solid ${
                        isBookmarked
                          ? "rgba(201,168,76,0.25)"
                          : "rgba(201,168,76,0.09)"
                      }`,
                    }}
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill={isBookmarked ? "#C9A84C" : "none"}
                      stroke="#C9A84C"
                      strokeWidth="1.6"
                    >
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
                    <span
                      style={{
                        fontFamily: "'Tajawal', sans-serif",
                        fontSize: 9.5,
                        color: isBookmarked ? "#C9A84C" : "rgba(201,168,76,0.4)",
                      }}
                    >
                      {isBookmarked ? "محفوظ" : "حفظ"}
                    </span>
                  </button>

                  <button
                    className="flex items-center gap-1 px-2 py-1.5 rounded-lg active:scale-90 transition-transform"
                    style={{
                      background: "transparent",
                      border: "1px solid rgba(201,168,76,0.09)",
                    }}
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="rgba(201,168,76,0.4)"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    >
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98" />
                    </svg>
                    <span
                      style={{
                        fontFamily: "'Tajawal', sans-serif",
                        fontSize: 9.5,
                        color: "rgba(201,168,76,0.4)",
                      }}
                    >
                      مشاركة
                    </span>
                  </button>
                </div>
              </div>
            );
          })}

          {/* End of surah */}
          {ayahs.length > 0 && (
            <div className="py-8 flex flex-col items-center gap-3">
              <div className="flex items-center gap-4">
                <div
                  style={{
                    height: 1,
                    width: 64,
                    background:
                      "linear-gradient(to right, transparent, rgba(201,168,76,0.2))",
                  }}
                />
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <polygon
                    points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9"
                    stroke="#C9A84C"
                    strokeWidth="0.8"
                    fill="rgba(201,168,76,0.08)"
                    opacity="0.55"
                  />
                </svg>
                <div
                  style={{
                    height: 1,
                    width: 64,
                    background:
                      "linear-gradient(to left, transparent, rgba(201,168,76,0.2))",
                  }}
                />
              </div>
              <p
                style={{
                  fontFamily: "'Amiri', serif",
                  color: "rgba(201,168,76,0.35)",
                  fontSize: 16,
                  letterSpacing: "0.02em",
                }}
              >
                صدق الله العظيم
              </p>
              <p
                style={{
                  fontFamily: "'Tajawal', sans-serif",
                  color: "#3A2E18",
                  fontSize: 11,
                }}
              >
                نهاية سورة {surah.ar}
              </p>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
