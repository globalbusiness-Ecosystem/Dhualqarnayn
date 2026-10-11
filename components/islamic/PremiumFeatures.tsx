"use client";

import { useState, type ReactNode } from "react";
import { usePiAuth } from "@/contexts/pi-auth-context";
import PiWalletPaymentButton from "./PiWalletPaymentButton";
import { PRODUCT_CONFIG } from "@/lib/product-config";

interface Premium {
  id: string;
  name: string;
  sub: string;
  description: string;
  price: number;
  accent: string;
  icon: (c: string) => ReactNode;
}

const PREMIUM_FEATURES: Premium[] = [
  {
    id: "ad_free",
    name: "تجربة بلا إعلانات",
    sub: "قراءة متواصلة بلا انقطاع",
    description: "أزل جميع الإعلانات واستمتع بتجربة قراءة واستماع هادئة دون مقاطعة",
    price: 0.5,
    accent: "#C9A84C",
    icon: (c) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 2l1.8 5.4L19 9l-5.2 1.6L12 16l-1.8-5.4L5 9l5.2-1.6z" fill={c} opacity="0.85" />
        <circle cx="19" cy="5" r="1.4" fill={c} opacity="0.6" />
      </svg>
    ),
  },
  {
    id: "unlimited_bookmarks",
    name: "علامات مرجعية بلا حدود",
    sub: "احفظ كل ما يهمك",
    description: "احفظ عدداً غير محدود من الآيات والأدعية والمواضع المفضلة لديك",
    price: 0.75,
    accent: "#228B4A",
    icon: (c) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" fill={`${c}22`} stroke={c} strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "offline_quran",
    name: "القرآن دون اتصال",
    sub: "اقرأ في أي مكان",
    description: "نزّل القرآن الكريم كاملاً لتتمكن من القراءة والاستماع بلا إنترنت",
    price: 1.0,
    accent: "#C9A84C",
    icon: (c) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 3v12m0 0l-4-4m4 4l4-4" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "tafsir_premium",
    name: "تفسير موسّع",
    sub: "علم إضافي من الأئمة",
    description: "وصول موسّع لتفاسير وشروح علمية إضافية من كبار الأئمة والعلماء",
    price: 1.5,
    accent: "#228B4A",
    icon: (c) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke={c} strokeWidth="1.6" fill={`${c}0D`} />
        <path d="M9 7h7M9 11h5" stroke={c} strokeWidth="1.1" strokeLinecap="round" opacity="0.6" />
      </svg>
    ),
  },
];

export default function PremiumFeatures() {
  const { userData, isAuthenticated } = usePiAuth();
  const [unlocked, setUnlocked] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  return (
    <section className="px-4 py-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="section-bar" style={{ height: 20 }} />
          <h3 style={{ fontFamily: "'Amiri', serif", color: "#C9A84C", fontSize: 19, fontWeight: 700 }}>
            الميزات المميزة
          </h3>
        </div>
        <div className="ornament-line flex-1" />
      </div>
      <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5830", fontSize: 11.5, lineHeight: 1.7, marginBottom: 18 }}>
        ارتقِ بتجربتك داخل التطبيق بميزات إضافية تدعم استمرار المنصة
      </p>

      <div className="flex flex-col gap-2.5">
        {PREMIUM_FEATURES.map((f) => (
          <div
            key={f.id}
            className="rounded-2xl p-4"
            style={{
              background: "linear-gradient(145deg, rgba(14,24,40,0.75), rgba(9,16,28,0.88))",
              border: `1px solid ${f.accent}1F`,
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${f.accent}12`, border: `1px solid ${f.accent}28` }}
              >
                {f.icon(f.accent)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#F5ECD7", fontSize: 13.5, fontWeight: 700 }}>
                    {f.name}
                  </p>
                  <span
                    className="px-2.5 py-1 rounded-full flex-shrink-0"
                    style={{ background: `${f.accent}14`, border: `1px solid ${f.accent}2A`, color: f.accent, fontFamily: "'Tajawal', sans-serif", fontSize: 11, fontWeight: 700 }}
                  >
                    {f.price} π
                  </span>
                </div>
                <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#7A6540", fontSize: 10.5, marginTop: 2 }}>
                  {f.sub}
                </p>
                <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A42", fontSize: 11, lineHeight: 1.65, marginTop: 6 }}>
                  {f.description}
                </p>
                <div style={{ marginTop: 10 }}>
                  <PiWalletPaymentButton
                    productId={PRODUCT_CONFIG.PRODUCT_6a2bd369e8892886f18efa6f}
                    productName={f.name}
                    priceOverride={f.price}
                    size="sm"
                    fullWidth
                    onSuccess={() => {
                      setUnlocked(f.name);
                      setErrorMsg(null);
                      setTimeout(() => setUnlocked(null), 3000);
                    }}
                    onError={(err) => setErrorMsg(err.message)}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {unlocked && (
        <div
          className="mt-3 rounded-xl px-4 py-3 text-center"
          style={{ background: "rgba(34,139,74,0.1)", border: "1px solid rgba(34,139,74,0.3)" }}
        >
          <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#4ADE80", fontSize: 12 }}>
            تم تفعيل: {unlocked}
          </p>
        </div>
      )}
      {errorMsg && (
        <div
          className="mt-3 rounded-xl px-4 py-3 text-center"
          style={{ background: "rgba(201,80,76,0.08)", border: "1px solid rgba(201,80,76,0.25)" }}
        >
          <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#D67C78", fontSize: 11.5 }}>{errorMsg}</p>
        </div>
      )}

      {isAuthenticated && userData && (
        <div
          className="mt-4 rounded-xl px-4 py-3 flex items-center justify-between"
          style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.12)" }}
        >
          <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5830", fontSize: 11 }}>رصيدك الحالي</span>
          <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#C9A84C", fontSize: 13, fontWeight: 700 }}>
            {userData.credits_balance || 0} π
          </span>
        </div>
      )}
    </section>
  );
}
