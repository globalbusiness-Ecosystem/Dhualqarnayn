"use client";

export default function PiNetworkBanner() {
  return (
    <section className="px-4 pb-5">
      <div className="rounded-2xl p-5 relative overflow-hidden"
        style={{
          background: "linear-gradient(145deg, rgba(16,48,30,0.4) 0%, rgba(7,13,24,0.97) 65%, rgba(11,20,36,0.99) 100%)",
          border: "1px solid rgba(27,107,58,0.3)",
          boxShadow: "0 8px 34px rgba(0,0,0,0.32), inset 0 1px 0 rgba(27,107,58,0.09)",
        }}>
        {/* Decorative big π */}
        <div className="absolute select-none pointer-events-none"
          style={{ left: -4, top: -10, fontSize: 86, fontFamily: "serif", fontWeight: 900, color: "rgba(27,107,58,0.048)", lineHeight: 1 }}>
          π
        </div>

        {/* Pattern */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.03 }}>
          <defs>
            <pattern id="pip" x="0" y="0" width="26" height="26" patternUnits="userSpaceOnUse">
              <circle cx="13" cy="13" r="7" fill="none" stroke="#228B4A" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pip)"/>
        </svg>

        <div className="relative z-10 flex items-center gap-4">
          {/* Pi badge */}
          <div className="flex-shrink-0 flex items-center justify-center rounded-2xl"
            style={{
              width: 52, height: 52,
              background: "linear-gradient(140deg, rgba(27,107,58,0.3), rgba(27,107,58,0.12))",
              border: "1px solid rgba(27,107,58,0.45)",
              boxShadow: "0 4px 16px rgba(27,107,58,0.18)",
              color: "#4ADE80", fontSize: 24, fontWeight: 700, fontFamily: "serif",
            }}>
            π
          </div>

          {/* Text */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#E8F5EA", fontSize: 14, fontWeight: 700 }}>
                متاح على شبكة Pi
              </span>
              <span className="px-1.5 py-0.5 rounded"
                style={{ background: "rgba(74,222,128,0.12)", color: "#4ADE80", fontSize: 9, fontFamily: "'Tajawal',sans-serif", border: "1px solid rgba(74,222,128,0.2)" }}>
                مجاني
              </span>
            </div>
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#2E5A3E", fontSize: 11, lineHeight: 1.5 }}>
              استخدم التطبيق واربح Pi في كل يوم
            </p>
          </div>

          {/* CTA */}
          <button className="flex-shrink-0 px-4 py-2.5 rounded-xl active:scale-95 transition-transform"
            style={{
              background: "linear-gradient(135deg, #1B6B3A, #2A9A56)",
              color: "#F5ECD7", fontFamily: "'Tajawal',sans-serif", fontSize: 12, fontWeight: 700,
              border: "none", boxShadow: "0 4px 16px rgba(27,107,58,0.36)", whiteSpace: "nowrap",
            }}>
            ابدأ الآن
          </button>
        </div>
      </div>
    </section>
  );
}
