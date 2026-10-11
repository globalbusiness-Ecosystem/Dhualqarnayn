"use client";

import { useVoiceSearch } from "@/hooks/use-voice-search";

interface VoiceSearchButtonProps {
  onResult: (transcript: string) => void;
  lang?: string;
  accent?: string;
}

export default function VoiceSearchButton({ onResult, lang = "ar-SA", accent = "#C9A84C" }: VoiceSearchButtonProps) {
  const { isListening, isSupported, error, start, stop } = useVoiceSearch({ lang, onResult });

  if (!isSupported) return null;

  return (
    <div className="relative flex-shrink-0">
      <button
        type="button"
        onClick={() => (isListening ? stop() : start())}
        aria-label={isListening ? "إيقاف البحث الصوتي" : "ابحث بالصوت"}
        aria-pressed={isListening}
        className="flex items-center justify-center rounded-lg active:scale-90 transition-transform"
        style={{
          width: 26,
          height: 26,
          background: isListening ? `${accent}26` : "transparent",
          flexShrink: 0,
        }}
      >
        {isListening ? (
          <span className="flex items-end gap-[2px]" style={{ height: 13 }}>
            <span className="voice-bar" style={{ background: accent, animationDelay: "0ms" }} />
            <span className="voice-bar" style={{ background: accent, animationDelay: "150ms" }} />
            <span className="voice-bar" style={{ background: accent, animationDelay: "300ms" }} />
          </span>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <rect x="9" y="2" width="6" height="12" rx="3" stroke={`${accent}B0`} strokeWidth="1.6" />
            <path
              d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6"
              stroke={`${accent}B0`}
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>

      {error && (
        <div
          className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg px-2.5 py-1.5 z-30"
          style={{
            background: "#0D1B2A",
            border: "1px solid rgba(201,168,76,0.25)",
            fontFamily: "'Tajawal', sans-serif",
            fontSize: 10,
            color: "#E8A05A",
          }}
        >
          {error === "mic_denied" ? "يرجى السماح باستخدام الميكروفون" : "تعذّر التعرف على الصوت، حاول مجدداً"}
        </div>
      )}

      <style jsx>{`
        .voice-bar {
          display: inline-block;
          width: 3px;
          height: 100%;
          border-radius: 2px;
          animation: voice-pulse 0.9s ease-in-out infinite;
        }
        @keyframes voice-pulse {
          0%, 100% { height: 30%; }
          50% { height: 100%; }
        }
      `}</style>
    </div>
  );
}
