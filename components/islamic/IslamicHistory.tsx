"use client";

import { useState } from "react";

const EVENTS = [
  { year: "٥٧٠ م", title: "مولد النبي ﷺ",       desc: "وُلد سيدنا محمد ﷺ في مكة المكرمة في عام الفيل، في شهر ربيع الأول.",                  cat: "السيرة",    accent: "#C9A84C" },
  { year: "٦١٠ م", title: "بدء الوحي",           desc: "نزول أول آية قرآنية في غار حراء: «اقرأ باسم ربك الذي خلق»، وبدء مرحلة النبوة.",      cat: "القرآن",    accent: "#228B4A" },
  { year: "٦٢٢ م", title: "الهجرة النبوية",      desc: "هجرة النبي ﷺ من مكة إلى المدينة المنورة، وهي بداية التقويم الهجري الإسلامي.",         cat: "السيرة",    accent: "#C9A84C" },
  { year: "٦٢٤ م", title: "غزوة بدر الكبرى",     desc: "أول معركة كبرى نصر الله فيها المؤمنين رغم قلة عددهم وعدتهم.",                         cat: "الغزوات",   accent: "#228B4A" },
  { year: "٦٣٠ م", title: "فتح مكة المكرمة",     desc: "دخل النبي ﷺ مكة فاتحاً في السنة الثامنة من الهجرة وطهّر الكعبة من الأصنام.",          cat: "الفتوحات",  accent: "#C9A84C" },
  { year: "٦٣٢ م", title: "وفاة النبي ﷺ",        desc: "انتقل خاتم الأنبياء والمرسلين ﷺ إلى الرفيق الأعلى في المدينة المنورة.",               cat: "السيرة",    accent: "#228B4A" },
  { year: "٦٣٣ م", title: "خلافة أبي بكر الصديق", desc: "بدأ عهد الخلفاء الراشدين بخلافة الصديق رضي الله عنه وحروب الردة.",                   cat: "الخلافة",   accent: "#C9A84C" },
  { year: "٦٩١ م", title: "قبة الصخرة",          desc: "أتم الخليفة عبد الملك بن مروان بناء قبة الصخرة المشرفة في القدس الشريف.",             cat: "العمارة",   accent: "#228B4A" },
];

export default function IslamicHistory() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="px-4 py-5">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-2">
          <div className="section-bar" style={{ height: 20 }}/>
          <h3 style={{ fontFamily: "'Amiri', serif", color: "#C9A84C", fontSize: 19, fontWeight: 700 }}>التاريخ الإسلامي</h3>
        </div>
        <div className="ornament-line flex-1"/>
        <button className="px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
          style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.16)", color: "#8B6F30", fontFamily: "'Tajawal',sans-serif", fontSize: 10 }}>
          عرض الكل
        </button>
      </div>

      <div className="relative pr-7">
        {/* Timeline line */}
        <div className="absolute" style={{
          right: 11, top: 8, bottom: 8, width: 1,
          background: "linear-gradient(180deg, rgba(201,168,76,0.22), rgba(34,139,74,0.28), rgba(201,168,76,0.14))",
        }}/>

        <div className="flex flex-col gap-2.5">
          {EVENTS.map((ev, i) => {
            const isOpen = open === i;
            return (
              <button key={i} onClick={() => setOpen(isOpen ? null : i)}
                className="flex items-start gap-3 relative text-right w-full active:scale-99 transition-transform">
                {/* Dot */}
                <div className="absolute" style={{
                  right: -18, top: 14, width: 11, height: 11, borderRadius: "50%",
                  background: isOpen ? ev.accent : `${ev.accent}44`,
                  boxShadow: isOpen ? `0 0 9px ${ev.accent}55` : "none",
                  border: `1.5px solid ${isOpen ? ev.accent : "rgba(201,168,76,0.1)"}`,
                  zIndex: 2, transition: "all 0.22s ease",
                }}/>

                <div className="flex-1 rounded-xl p-3.5 text-right"
                  style={{
                    background: isOpen ? `linear-gradient(140deg, ${ev.accent}08, rgba(8,14,26,0.97))` : "rgba(10,18,32,0.72)",
                    border: `1px solid ${isOpen ? `${ev.accent}25` : "rgba(201,168,76,0.06)"}`,
                    boxShadow: isOpen ? "0 4px 20px rgba(0,0,0,0.18)" : "none",
                    transition: "all 0.2s ease",
                  }}>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full"
                        style={{ background: `${ev.accent}14`, color: ev.accent, fontFamily: "'Tajawal',sans-serif", fontSize: 10, border: `1px solid ${ev.accent}1E` }}>
                        {ev.year}
                      </span>
                      <span className="px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(201,168,76,0.04)", color: "#3A3020", fontFamily: "'Tajawal',sans-serif", fontSize: 9 }}>
                        {ev.cat}
                      </span>
                    </div>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                      style={{ flexShrink: 0, opacity: 0.35, transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s ease" }}>
                      <path d="M6 9l6 6 6-6" stroke={ev.accent} strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <p style={{ fontFamily: "'Amiri', serif", color: "#F5ECD7", fontSize: 15, fontWeight: 700, lineHeight: 1.5 }}>
                    {ev.title}
                  </p>
                  {isOpen && (
                    <p className="mt-2" style={{ fontFamily: "'Tajawal', sans-serif", color: "#7A6540", fontSize: 12, lineHeight: 1.65 }}>
                      {ev.desc}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
