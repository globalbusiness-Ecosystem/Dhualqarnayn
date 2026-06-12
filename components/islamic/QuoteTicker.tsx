"use client";

const PHRASES = [
  "بسم الله الرحمن الرحيم",
  "سبحان الله وبحمده",
  "الحمد لله رب العالمين",
  "لا إله إلا الله محمد رسول الله",
];

const SEP = "   ✦   ";

export default function QuoteTicker() {
  const line = PHRASES.join(SEP) + SEP;
  const doubled = line + line;

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        background: "linear-gradient(90deg, #06101E 0%, #0B1A2E 50%, #06101E 100%)",
        borderBottom: "1px solid rgba(201,168,76,0.09)",
        paddingBlock: 9,
      }}
    >
      {/* Top thread */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.3) 50%, transparent)" }} />
      {/* Fade masks */}
      <div className="absolute inset-y-0 left-0 z-10 pointer-events-none"
        style={{ width: 48, background: "linear-gradient(90deg, #06101E, transparent)" }} />
      <div className="absolute inset-y-0 right-0 z-10 pointer-events-none"
        style={{ width: 48, background: "linear-gradient(270deg, #06101E, transparent)" }} />

      <div className="ticker-track" dir="rtl">
        <span style={{
          fontFamily: "'Amiri', serif",
          color: "#C9A84C",
          fontSize: 15,
          letterSpacing: "0.04em",
          textShadow: "0 0 18px rgba(201,168,76,0.26)",
          paddingInline: 16,
          unicodeBidi: "plaintext",
        }}>
          {doubled}
        </span>
      </div>
    </div>
  );
}
