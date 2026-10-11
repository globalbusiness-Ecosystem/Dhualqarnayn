"use client";

import { useState } from "react";
import { RAMADAN_SECTIONS, HAJJ_SECTIONS, type GuideStep } from "@/lib/ramadan-data";
import { useLanguage } from "@/contexts/language-context";
import ShareButton from "./ShareButton";

interface Props {
  onBack: () => void;
}

function StepCard({ step, isAr, index }: { step: GuideStep; isAr: boolean; index: number }) {
  return (
    <div className="rounded-2xl p-4 mb-2.5"
      style={{ background: "linear-gradient(145deg, rgba(14,24,40,0.65), rgba(9,16,28,0.85))", border: "1px solid rgba(201,168,76,0.1)" }}>
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.22)" }}>
          <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#C9A84C", fontSize: 11, fontWeight: 700 }}>{index + 1}</span>
        </div>
        <div className="flex-1">
          <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#F5ECD7", fontSize: 13.5, fontWeight: 700, lineHeight: 1.5 }}>
            {isAr ? step.titleAr : step.titleEn}
          </p>
          <p className="mt-1.5" style={{ fontFamily: isAr ? "'Amiri', serif" : "'Tajawal', sans-serif", color: "#9A8870", fontSize: isAr ? 13.5 : 12.5, lineHeight: 1.8 }}>
            {isAr ? step.descAr : step.descEn}
          </p>
          {step.duaAr && (
            <div className="mt-2.5 pt-2.5" style={{ borderTop: "1px solid rgba(27,107,58,0.16)" }}>
              <p style={{ fontFamily: "'Amiri', serif", color: "#7FCB95", fontSize: 14, lineHeight: 1.9, textAlign: "right" }}>
                {step.duaAr}
              </p>
              {!isAr && step.duaEn && (
                <p className="mt-1" style={{ fontFamily: "'Tajawal', sans-serif", color: "#5A9A6A", fontSize: 11, lineHeight: 1.7 }}>
                  {step.duaEn}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RamadanHajjGuide({ onBack }: Props) {
  const { locale } = useLanguage();
  const isAr = locale === "ar";
  const [tab, setTab] = useState<"ramadan" | "hajj">("ramadan");

  const sections = tab === "ramadan" ? RAMADAN_SECTIONS : HAJJ_SECTIONS;

  return (
    <div style={{ minHeight: "100vh" }}>
      <header className="sticky top-0 z-20 px-4 py-3" style={{ background: "rgba(5,12,22,0.96)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
        <div className="flex items-center gap-3 mb-3">
          <button onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-xl active:scale-90"
            style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.15)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="scale(-1,1) translate(-24,0)"/>
            </svg>
          </button>
          <div>
            <p style={{ fontFamily: "'Amiri', serif", color: "#C9A84C", fontSize: 18, fontWeight: 700 }}>
              {isAr ? "رمضان والحج والعمرة" : "Ramadan, Hajj & Umrah"}
            </p>
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 10 }}>
              {isAr ? "دليلك العملي للموسمين" : "Your practical guide for both seasons"}
            </p>
          </div>
        </div>

        <div className="flex gap-1.5 rounded-xl p-1"
          style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.1)" }}>
          {([
            { k: "ramadan" as const, l: isAr ? "رمضان" : "Ramadan" },
            { k: "hajj" as const, l: isAr ? "الحج والعمرة" : "Hajj & Umrah" },
          ]).map((o) => (
            <button key={o.k} onClick={() => setTab(o.k)}
              className="flex-1 py-2 rounded-lg text-center active:scale-95"
              style={{
                background: tab === o.k ? "rgba(201,168,76,0.16)" : "transparent",
                border: `1px solid ${tab === o.k ? "rgba(201,168,76,0.35)" : "transparent"}`,
                fontFamily: "'Tajawal', sans-serif", fontSize: 12.5,
                color: tab === o.k ? "#C9A84C" : "#6A5A48",
                fontWeight: tab === o.k ? 700 : 400,
              }}>
              {o.l}
            </button>
          ))}
        </div>
      </header>

      <div className="px-4 py-4">
        {sections.map((section) => (
          <div key={section.id} className="mb-5">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="section-bar" style={{ height: 16 }} />
              <p style={{ fontFamily: "'Amiri', serif", color: "#C9A84C", fontSize: 15, fontWeight: 700 }}>
                {isAr ? section.nameAr : section.nameEn}
              </p>
            </div>
            {section.steps.map((step, i) => (
              <StepCard key={step.id} step={step} isAr={isAr} index={i} />
            ))}
          </div>
        ))}

        <ShareButton
          label={isAr ? "مشاركة الدليل" : "Share this guide"}
          data={{
            kindLabel: isAr ? "دليل عملي" : "Practical Guide",
            arabicText: tab === "ramadan" ? "دليل رمضان العملي — ذو القرنين" : "دليل الحج والعمرة العملي — ذو القرنين",
            translation: !isAr ? (tab === "ramadan" ? "Ramadan Practical Guide — Dhualqarnayn" : "Hajj & Umrah Practical Guide — Dhualqarnayn") : undefined,
            footer: "ذو القرنين",
          }}
        />
        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}
