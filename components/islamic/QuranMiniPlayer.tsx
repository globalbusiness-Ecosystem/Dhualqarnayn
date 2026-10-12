"use client";

import { useQuranAudio } from "@/contexts/quran-audio-context";

function toAr(n: number) {
  return String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[+d]);
}

/**
 * A small floating bar that appears above the bottom navigation whenever
 * recitation is active, no matter which screen the person is on. It mirrors
 * the lock-screen / notification controls so playback can be paused, moved
 * to the next or previous verse, or stopped from anywhere in the app.
 */
export default function QuranMiniPlayer() {
  const { activeSurah, activeAyahNumberInSurah, playing, buffering, togglePlayPause, stop, next, prev, hasNext, hasPrev } =
    useQuranAudio();

  if (!activeSurah) return null;

  return (
    <div
      className="fixed left-0 right-0 z-40 px-3"
      style={{
        bottom: "calc(64px + env(safe-area-inset-bottom, 4px))",
        maxWidth: "var(--app-max-w)",
        margin: "0 auto",
      }}
    >
      <div
        className="flex items-center gap-2.5 px-3 py-2 rounded-2xl"
        style={{
          background: "rgba(10,18,30,0.96)",
          border: "1px solid rgba(201,168,76,0.22)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
        }}
      >
        {/* Spinning octagon icon while audio is active */}
        <div className="flex-shrink-0" style={{ animation: playing ? "spin 6s linear infinite" : "none" }}>
          <svg width="26" height="26" viewBox="0 0 28 28">
            <polygon
              points="14,2 25,8 25,20 14,26 3,20 3,8"
              fill="rgba(27,107,58,0.18)"
              stroke="#4ADE80"
              strokeWidth="0.9"
            />
          </svg>
        </div>

        <button
          onClick={prev}
          disabled={!hasPrev}
          className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg active:scale-90 transition-transform"
          style={{ opacity: hasPrev ? 1 : 0.3 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#C9A84C">
            <path d="M6 6h2v12H6zM20 6L10 12l10 6V6z" />
          </svg>
        </button>

        <div className="flex-1 min-w-0">
          <p
            style={{
              fontFamily: "'Amiri', serif",
              color: "#F0E2C2",
              fontSize: 13,
              fontWeight: 700,
              direction: "rtl",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            سورة {activeSurah.ar}
            {activeAyahNumberInSurah != null && (
              <span style={{ color: "#4ADE80", fontWeight: 400 }}> · آية {toAr(activeAyahNumberInSurah)}</span>
            )}
          </p>
        </div>

        <button
          onClick={togglePlayPause}
          className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full active:scale-90 transition-transform"
          style={{ background: "rgba(201,168,76,0.14)", border: "1px solid rgba(201,168,76,0.35)" }}
        >
          {buffering ? (
            <div
              style={{
                width: 13,
                height: 13,
                border: "2px solid rgba(201,168,76,0.25)",
                borderTop: "2px solid #C9A84C",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
          ) : playing ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#C9A84C">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#C9A84C">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <button
          onClick={next}
          disabled={!hasNext}
          className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg active:scale-90 transition-transform"
          style={{ opacity: hasNext ? 1 : 0.3 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#C9A84C">
            <path d="M16 6h2v12h-2zM4 6l10 6-10 6V6z" />
          </svg>
        </button>

        <button
          onClick={stop}
          className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg active:scale-90 transition-transform"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(224,122,95,0.9)" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
