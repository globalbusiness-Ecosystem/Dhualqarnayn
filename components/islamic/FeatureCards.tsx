"use client";

import { useState } from "react";
import PiWalletPaymentButton from "./PiWalletPaymentButton";
import { PRODUCT_CONFIG } from "@/lib/product-config";

const FEATURES = [
  { id: "quran",   title: "القرآن الكريم", sub: "١١٤ سورة · ٦٢٣٦ آية",       desc: "اقرأ واستمع لكامل القرآن بتلاوات متعددة مع التفسير",  accent: "#C9A84C", bg: "rgba(201,168,76,0.06)", bdr: "rgba(201,168,76,0.2)", bdrA: "rgba(201,168,76,0.42)" },
  { id: "hadith",  title: "الأحاديث",      sub: "البخاري · مسلم · الترمذي",   desc: "أحاديث مصنفة ومحققة مع الشرح والسند والحكم",          accent: "#228B4A", bg: "rgba(27,107,58,0.06)",  bdr: "rgba(27,107,58,0.2)",  bdrA: "rgba(27,107,58,0.48)" },
  { id: "qibla",   title: "القبلة",        sub: "الاتجاه الدقيق",               desc: "حدد اتجاه القبلة بدقة باستخدام البوصلة الإسلامية",   accent: "#C9A84C", bg: "rgba(201,168,76,0.06)", bdr: "rgba(201,168,76,0.2)", bdrA: "rgba(201,168,76,0.42)" },
  { id: "dhikr",   title: "الأذكار",       sub: "الصباح والمساء",               desc: "أذكار مأثورة مع عداد الذكر وأدعية مباركة",           accent: "#228B4A", bg: "rgba(27,107,58,0.06)",  bdr: "rgba(27,107,58,0.2)",  bdrA: "rgba(27,107,58,0.48)" },
  { id: "history", title: "التاريخ",       sub: "سيرة وحضارة إسلامية",         desc: "استعرض تاريخ الإسلام العريق من صدر الإسلام",         accent: "#C9A84C", bg: "rgba(201,168,76,0.06)", bdr: "rgba(201,168,76,0.2)", bdrA: "rgba(201,168,76,0.42)" },
  { id: "cal",     title: "التقويم",       sub: "المناسبات الإسلامية",          desc: "تتبع الأعياد والأشهر الهجرية المباركة",              accent: "#228B4A", bg: "rgba(27,107,58,0.06)",  bdr: "rgba(27,107,58,0.2)",  bdrA: "rgba(27,107,58,0.48)" },
];

export default function FeatureCards() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section className="px-4 py-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="section-bar" style={{ height: 20 }}/>
          <h3 style={{ fontFamily: "'Amiri', serif", color: "#C9A84C", fontSize: 19, fontWeight: 700 }}>خدمات التطبيق</h3>
        </div>
        <div className="ornament-line flex-1"/>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="#C9A84C" opacity="0.38">
          <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9"/>
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {FEATURES.map((f) => {
          const open = active === f.id;
          return (
            <button key={f.id}
              onClick={() => setActive(open ? null : f.id)}
              className="text-right rounded-2xl p-4 transition-all active:scale-95"
              style={{
                background: open ? f.bg : "linear-gradient(145deg, rgba(14,24,40,0.75), rgba(9,16,28,0.88))",
                border: `1px solid ${open ? f.bdrA : "rgba(201,168,76,0.07)"}`,
                boxShadow: open ? `0 4px 20px ${f.bg}` : "none",
                transition: "all 0.22s ease",
              }}>
              {/* Icon dot */}
              <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2"
                style={{ background: `${f.accent}10`, border: `1px solid ${f.accent}20` }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: f.accent, opacity: open ? 0.9 : 0.4 }}/>
              </div>
              <p style={{ fontFamily: "'Tajawal', sans-serif", color: open ? f.accent : "#9A8060", fontSize: 13, fontWeight: 700 }}>
                {f.title}
              </p>
              <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5830", fontSize: 10, marginTop: 2 }}>
                {f.sub}
              </p>
              {open && (
                <>
                  <p className="mt-2" style={{ fontFamily: "'Tajawal', sans-serif", color: "#8A7040", fontSize: 11, lineHeight: 1.6 }}>
                    {f.desc}
                  </p>
                  <div style={{ marginTop: 12 }}>
                    <PiWalletPaymentButton
                      productId={PRODUCT_CONFIG.PRODUCT_6a2bd369e8892886f18efa6f}
                      productName={f.title}
                      priceOverride={0.5}
                      size="sm"
                      fullWidth
                      onSuccess={() => {
                        console.log(`[v0] Purchased: ${f.title}`);
                      }}
                    />
                  </div>
                </>
              )}
              <div className="flex justify-end mt-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.22s ease", opacity: 0.32 }}>
                  <path d="M6 9l6 6 6-6" stroke={f.accent} strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
