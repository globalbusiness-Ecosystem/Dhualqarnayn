"use client";

import { useState, type ReactNode } from "react";
import { usePiAuth } from "@/contexts/pi-auth-context";
import { pay } from "@/lib/pi-payment";

interface DonationOption {
  id: string;
  label: string;
  sub: string;
  amount: number;
  accent: string;
  icon: (c: string) => ReactNode;
}

const DONATION_OPTIONS: DonationOption[] = [
  {
    id: "small", label: "بذرة خير", sub: "تبرع صغير", amount: 0.5, accent: "#228B4A",
    icon: (c) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 21c0-6 2-9 6-10-1 5-2 8-6 10z" fill={c} opacity="0.85" />
        <path d="M12 21c0-6-2-9-6-10 1 5 2 8 6 10z" fill={c} opacity="0.6" />
        <path d="M12 21v-9" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "medium", label: "غرسة نماء", sub: "تبرع متوسط", amount: 1.0, accent: "#C9A84C",
    icon: (c) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="9" r="6.5" fill={c} opacity="0.75" />
        <rect x="11" y="15" width="2" height="6" rx="1" fill={c} opacity="0.9" />
      </svg>
    ),
  },
  {
    id: "large", label: "شجرة باقية", sub: "تبرع كبير", amount: 2.0, accent: "#228B4A",
    icon: (c) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 2l4 6h-2.5l3.5 5.5h-3L17 19H7l3-5.5H7L10.5 8H8z" fill={c} opacity="0.85" />
        <rect x="11" y="19" width="2" height="3" rx="1" fill={c} />
      </svg>
    ),
  },
  {
    id: "custom", label: "مبلغ مخصص", sub: "اختر ما تشاء", amount: 0, accent: "#C9A84C",
    icon: (c) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 2l1.8 5.4L19 9l-5.2 1.6L12 16l-1.8-5.4L5 9l5.2-1.6z" fill={c} opacity="0.85" />
      </svg>
    ),
  },
];

export default function DonationHub() {
  const { userData, isAuthenticated } = usePiAuth();
  const [customAmount, setCustomAmount] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);

  const handleDonate = async (option: DonationOption) => {
    if (!isAuthenticated || !userData) {
      setStatus({ ok: false, text: "يرجى تسجيل الدخول أولاً" });
      return;
    }

    let amount = option.amount;
    if (option.id === "custom") {
      const parsed = parseFloat(customAmount);
      if (!parsed || parsed <= 0) {
        setStatus({ ok: false, text: "يرجى إدخال مبلغ صحيح" });
        return;
      }
      amount = parsed;
    }

    setLoading(true);
    setSelected(option.id);

    try {
      await pay({
        amount,
        memo: "تبرع لدعم ذو القرنين",
        metadata: {
          donation_type: option.id,
          donation_amount: amount,
          user_id: userData.id,
          transaction_type: "donation",
          timestamp: new Date().toISOString(),
        },
        onComplete: () => {
          setStatus({ ok: true, text: `جزاك الله خيراً على تبرعك بـ ${amount} π` });
          setCustomAmount("");
          setSelected(null);
          setTimeout(() => setStatus(null), 4000);
        },
        onError: (error) => {
          setStatus({ ok: false, text: `تعذر إتمام التبرع: ${error.message}` });
          setSelected(null);
        },
      });
    } catch {
      setStatus({ ok: false, text: "حدث خطأ أثناء التبرع" });
      setSelected(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-4 py-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="section-bar" style={{ height: 20 }} />
          <h3 style={{ fontFamily: "'Amiri', serif", color: "#C9A84C", fontSize: 19, fontWeight: 700 }}>
            ادعم المنصة
          </h3>
        </div>
        <div className="ornament-line flex-1" />
      </div>
      <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5830", fontSize: 11.5, lineHeight: 1.7, marginBottom: 18 }}>
        ساهم في استمرار نشر العلم الإسلامي وتطوير التطبيق لخدمة المزيد من المستخدمين
      </p>

      <div className="grid grid-cols-2 gap-2.5 mb-3">
        {DONATION_OPTIONS.map((o) => {
          const isSel = selected === o.id;
          return (
            <button
              key={o.id}
              onClick={() => (o.id === "custom" ? setSelected("custom") : handleDonate(o))}
              disabled={loading && isSel}
              className="rounded-2xl p-4 flex flex-col items-center gap-2 text-center active:scale-95 transition-all"
              style={{
                background: isSel ? `${o.accent}14` : "linear-gradient(145deg, rgba(14,24,40,0.75), rgba(9,16,28,0.88))",
                border: `1px solid ${isSel ? `${o.accent}48` : `${o.accent}1F`}`,
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: `${o.accent}12`, border: `1px solid ${o.accent}28` }}
              >
                {o.icon(o.accent)}
              </div>
              <div>
                <p style={{ fontFamily: "'Tajawal', sans-serif", color: isSel ? o.accent : "#F5ECD7", fontSize: 12.5, fontWeight: 700 }}>
                  {o.label}
                </p>
                <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5830", fontSize: 10, marginTop: 1 }}>
                  {o.id === "custom" ? o.sub : `${o.amount} π`}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {selected === "custom" && (
        <div className="flex items-center gap-2 mb-3">
          <input
            type="number"
            inputMode="decimal"
            placeholder="أدخل المبلغ بالـ π"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="flex-1 rounded-xl px-3.5 py-2.5 outline-none"
            style={{
              background: "rgba(13,27,42,0.6)",
              border: "1px solid rgba(201,168,76,0.2)",
              color: "#F5ECD7",
              fontFamily: "'Tajawal', sans-serif",
              fontSize: 12.5,
              textAlign: "right",
            }}
          />
          <button
            onClick={() => handleDonate(DONATION_OPTIONS[3])}
            disabled={loading || !customAmount || parseFloat(customAmount) <= 0}
            className="rounded-xl px-5 py-2.5 active:scale-95 transition-transform"
            style={{
              background: customAmount && parseFloat(customAmount) > 0 ? "#C9A84C" : "rgba(201,168,76,0.12)",
              color: customAmount && parseFloat(customAmount) > 0 ? "#0D1B2A" : "#5A4A28",
              fontFamily: "'Tajawal', sans-serif",
              fontSize: 12.5,
              fontWeight: 700,
            }}
          >
            تبرّع
          </button>
        </div>
      )}

      {status && (
        <div
          className="mb-3 rounded-xl px-4 py-3 text-center"
          style={{
            background: status.ok ? "rgba(34,139,74,0.1)" : "rgba(201,80,76,0.08)",
            border: `1px solid ${status.ok ? "rgba(34,139,74,0.3)" : "rgba(201,80,76,0.25)"}`,
          }}
        >
          <p style={{ fontFamily: "'Tajawal', sans-serif", color: status.ok ? "#4ADE80" : "#D67C78", fontSize: 12 }}>
            {status.text}
          </p>
        </div>
      )}

      <div
        className="rounded-2xl px-4 py-3.5 mb-3"
        style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.12)" }}
      >
        <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#7A6540", fontSize: 11, lineHeight: 1.75 }}>
          كل تبرع يساهم في الحفاظ على العلم الإسلامي ونشره، ويساعدنا على تطوير ذو القرنين ليصل إلى مزيد من المسلمين حول العالم
        </p>
      </div>

      {isAuthenticated && userData && (
        <div
          className="rounded-xl px-4 py-3 flex items-center justify-between"
          style={{ background: "rgba(34,139,74,0.06)", border: "1px solid rgba(34,139,74,0.16)" }}
        >
          <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5830", fontSize: 11 }}>رصيدك الحالي</span>
          <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#4ADE80", fontSize: 13, fontWeight: 700 }}>
            {userData.credits_balance || 0} π
          </span>
        </div>
      )}
    </section>
  );
}
