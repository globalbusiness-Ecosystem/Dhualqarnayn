"use client";

import { useState } from "react";

const VERSES = [
  {
    arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ",
    surah: "البقرة", ayah: "١٨٦", juz: "الجزء الثاني",
    translation: "إذا سألك عبادي عني فأخبرهم أنني قريب منهم، أستجيب دعاء من دعاني.",
  },
  {
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    surah: "الشرح", ayah: "٥-٦", juz: "الجزء الثلاثون",
    translation: "فإن مع الشدة فرجاً ويساراً، إن مع كل عسر يسراً.",
  },
  {
    arabic: "وَنَحْنُ أَقْرَبُ إِلَيْهِ مِنْ حَبْلِ الْوَرِيدِ",
    surah: "ق", ayah: "١٦", juz: "الجزء السادس والعشرون",
    translation: "ونحن أقرب إلى الإنسان من عرق الوريد في عنقه.",
  },
  {
    arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
    surah: "آل عمران", ayah: "١٧٣", juz: "الجزء الرابع",
    translation: "يكفينا الله وهو نعم المتوكل عليه في جميع أمورنا.",
  },
  {
    arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    surah: "البقرة", ayah: "١٥٣", juz: "الجزء الثاني",
    translation: "إن الله مع الصابرين بنصره وعونه وتوفيقه.",
  },
];

export default function DailyVerse() {
  const [idx, setIdx] = useState(0);
  const [saved, setSaved] = useState<Set<number>>(new Set());
  const [showTrans, setShowTrans] = useState(false);
  const [fading, setFading] = useState(false);

  const verse = VERSES[idx];

  const navigate = (dir: 1 | -1) => {
    if (fading) return;
    setFading(true);
    setTimeout(() => { setIdx((i) => (i + dir + VERSES.length) % VERSES.length); setShowTrans(false); setFading(false); }, 180);
  };

  return (
    <section className="px-4 py-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="section-bar" style={{ height: 20 }}/>
          <h3 style={{ fontFamily: "'Amiri', serif", color: "#C9A84C", fontSize: 19, fontWeight: 700 }}>آية اليوم</h3>
        </div>
        <div className="ornament-line flex-1"/>
        <div className="flex gap-1.5">
          {([1, -1] as const).map((dir, i) => (
            <button key={i} onClick={() => navigate(dir)}
              className="w-7 h-7 flex items-center justify-center rounded-lg active:scale-90 transition-transform"
              style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.14)" }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round">
                <path d={i === 0 ? "M9 18l6-6-6-6" : "M15 18l-6-6 6-6"}/>
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden relative"
        style={{
          background: "linear-gradient(155deg, rgba(14,24,40,0.97) 0%, rgba(8,15,28,0.99) 100%)",
          border: "1px solid rgba(201,168,76,0.17)",
          boxShadow: "0 10px 44px rgba(0,0,0,0.38), inset 0 1px 0 rgba(201,168,76,0.05)",
          opacity: fading ? 0.4 : 1,
          transform: fading ? "scale(0.985)" : "scale(1)",
          transition: "opacity 0.18s ease, transform 0.18s ease",
        }}>
        {/* Corner ornament TR */}
        <svg className="absolute top-0 right-0 pointer-events-none" width="65" height="65" style={{ opacity: 0.1 }}>
          <path d="M65 0 Q36 0 0 42" stroke="#C9A84C" strokeWidth="1.1" fill="none"/>
          <circle cx="61" cy="4" r="2" fill="#C9A84C"/>
        </svg>
        {/* Corner ornament BL */}
        <svg className="absolute bottom-0 left-0 pointer-events-none" width="65" height="65" style={{ opacity: 0.1 }}>
          <path d="M0 65 Q29 65 65 23" stroke="#C9A84C" strokeWidth="1.1" fill="none"/>
          <circle cx="4" cy="61" r="2" fill="#C9A84C"/>
        </svg>

        <div className="p-5">
          {/* Book icon */}
          <div className="flex justify-center mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,rgba(201,168,76,0.12),rgba(201,168,76,0.05))", border: "1px solid rgba(201,168,76,0.2)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="#C9A84C" strokeWidth="1.5" fill="rgba(201,168,76,0.04)"/>
                <path d="M9 7h7M9 11h5" stroke="#C9A84C" strokeWidth="1.2" strokeLinecap="round" opacity="0.55"/>
              </svg>
            </div>
          </div>

          {/* Arabic verse */}
          <p className="text-center text-balance" style={{
            fontFamily: "'Amiri', serif",
            color: "#F5ECD7",
            fontSize: "clamp(17px, 5.2vw, 21px)",
            lineHeight: 2.2,
            direction: "rtl",
            marginBottom: 16,
          }}>
            {verse.arabic}
          </p>

          {/* Translation */}
          {showTrans && (
            <div className="text-center mb-4 px-3 py-3 rounded-xl"
              style={{ background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.09)" }}>
              <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#8B6F30", fontSize: 12.5, lineHeight: 1.7, direction: "rtl" }}>
                {verse.translation}
              </p>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-2 mb-3">
            <div className="ornament-line flex-1"/>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="#C9A84C" opacity="0.45">
              <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9"/>
            </svg>
            <div className="ornament-line flex-1"/>
          </div>

          {/* Source */}
          <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
            <span className="px-3 py-1 rounded-full"
              style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.16)", fontFamily: "'Amiri', serif", color: "#C9A84C", fontSize: 13 }}>
              سورة {verse.surah}
            </span>
            <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#5A4A28", fontSize: 11 }}>آية {verse.ayah}</span>
            <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5430", fontSize: 10 }}>{verse.juz}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid rgba(201,168,76,0.07)" }}>
            <button onClick={() => setSaved((s) => { const n = new Set(s); n.has(idx) ? n.delete(idx) : n.add(idx); return n; })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl active:scale-90 transition-transform"
              style={{ background: saved.has(idx) ? "rgba(201,168,76,0.09)" : "transparent", border: `1px solid ${saved.has(idx) ? "rgba(201,168,76,0.25)" : "rgba(201,168,76,0.09)"}` }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill={saved.has(idx) ? "#C9A84C" : "none"} stroke="#C9A84C" strokeWidth="1.5">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
              <span style={{ color: saved.has(idx) ? "#C9A84C" : "#5A4A28", fontSize: 10, fontFamily: "'Tajawal', sans-serif" }}>
                {saved.has(idx) ? "محفوظة" : "حفظ"}
              </span>
            </button>

            {/* Dot nav */}
            <div className="flex gap-1.5 items-center">
              {VERSES.map((_, i) => (
                <button key={i} onClick={() => { if (!fading) { setFading(true); setTimeout(() => { setIdx(i); setFading(false); }, 180); } }}
                  className="rounded-full transition-all"
                  style={{ width: i === idx ? 14 : 5, height: 5, background: i === idx ? "#C9A84C" : "rgba(201,168,76,0.17)" }}/>
              ))}
            </div>

            <button onClick={() => setShowTrans((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl active:scale-90 transition-transform"
              style={{ background: showTrans ? "rgba(201,168,76,0.07)" : "transparent", border: `1px solid ${showTrans ? "rgba(201,168,76,0.2)" : "rgba(201,168,76,0.09)"}` }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={showTrans ? "#C9A84C" : "#5A4A28"} strokeWidth="1.5">
                <path d="M3 5h12M9 3v2M5 8c0 2.5 1.2 5 3.5 7M11 8c0 2.5-1.2 5-3.5 7M21 21l-6-6 2.5-6.5L21 21z" strokeLinecap="round"/>
              </svg>
              <span style={{ color: showTrans ? "#C9A84C" : "#5A4A28", fontSize: 10, fontFamily: "'Tajawal', sans-serif" }}>تفسير</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
