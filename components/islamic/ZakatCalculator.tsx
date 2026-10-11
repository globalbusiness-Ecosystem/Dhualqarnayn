"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import {
  GOLD_NISAB_GRAMS,
  SILVER_NISAB_GRAMS,
  ZAKAT_FIELDS,
  calculateZakat,
  type NisabBasis,
  type ZakatInputs,
} from "@/lib/zakat-data";

interface Props {
  onBack: () => void;
}

function NumberField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <input
      type="number"
      inputMode="decimal"
      min={0}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-transparent outline-none text-right"
      style={{ fontFamily: "'Tajawal', sans-serif", color: "#F5ECD7", fontSize: 15, fontWeight: 600 }}
    />
  );
}

function FieldRow({
  label,
  help,
  value,
  onChange,
  accent,
  currencySymbol,
}: {
  label: string;
  help: string;
  value: string;
  onChange: (v: string) => void;
  accent: string;
  currencySymbol: string;
}) {
  return (
    <div className="rounded-2xl p-3.5 mb-2"
      style={{ background: "linear-gradient(145deg, rgba(14,24,40,0.6), rgba(9,16,28,0.8))", border: "1px solid rgba(201,168,76,0.08)" }}>
      <div className="flex items-center justify-between mb-1.5">
        <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#C9B894", fontSize: 12.5, fontWeight: 700 }}>{label}</p>
      </div>
      <div className="flex items-center gap-2 rounded-xl px-3 py-2"
        style={{ background: "rgba(201,168,76,0.04)", border: `1px solid ${accent}1E` }}>
        <NumberField value={value} onChange={onChange} placeholder="0" />
        <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 11, flexShrink: 0 }}>{currencySymbol}</span>
      </div>
      <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 10, marginTop: 5, lineHeight: 1.5 }}>{help}</p>
    </div>
  );
}

export default function ZakatCalculator({ onBack }: Props) {
  const { locale } = useLanguage();
  const isAr = locale === "ar";
  const currencySymbol = isAr ? "ر.س" : "$";

  const [cash, setCash] = useState("");
  const [investments, setInvestments] = useState("");
  const [businessStock, setBusinessStock] = useState("");
  const [receivables, setReceivables] = useState("");
  const [debts, setDebts] = useState("");

  const [goldGrams, setGoldGrams] = useState("");
  const [goldPricePerGram, setGoldPricePerGram] = useState("");
  const [silverGrams, setSilverGrams] = useState("");
  const [silverPricePerGram, setSilverPricePerGram] = useState("");

  const [basis, setBasis] = useState<NisabBasis>("silver");
  const [showResult, setShowResult] = useState(false);

  const inputs: ZakatInputs = useMemo(
    () => ({
      cash: parseFloat(cash) || 0,
      investments: parseFloat(investments) || 0,
      businessStock: parseFloat(businessStock) || 0,
      receivables: parseFloat(receivables) || 0,
      debts: parseFloat(debts) || 0,
      goldGrams: parseFloat(goldGrams) || 0,
      goldPricePerGram: parseFloat(goldPricePerGram) || 0,
      silverGrams: parseFloat(silverGrams) || 0,
      silverPricePerGram: parseFloat(silverPricePerGram) || 0,
    }),
    [cash, investments, businessStock, receivables, debts, goldGrams, goldPricePerGram, silverGrams, silverPricePerGram]
  );

  const result = useMemo(() => calculateZakat(inputs, basis), [inputs, basis]);

  const fieldSetters: Record<string, [string, (v: string) => void]> = {
    cash: [cash, setCash],
    investments: [investments, setInvestments],
    businessStock: [businessStock, setBusinessStock],
    receivables: [receivables, setReceivables],
    debts: [debts, setDebts],
  };

  const fmt = (n: number) =>
    n.toLocaleString(isAr ? "ar-SA" : "en-US", { maximumFractionDigits: 2 });

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 24 }}>
      <header className="sticky top-0 z-20 px-4 py-3" style={{ background: "rgba(5,12,22,0.96)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(201,168,76,0.1)" }}>
        <div className="flex items-center gap-3">
          <button onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-xl active:scale-90"
            style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.15)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="scale(-1,1) translate(-24,0)"/>
            </svg>
          </button>
          <div>
            <p style={{ fontFamily: "'Amiri', serif", color: "#C9A84C", fontSize: 18, fontWeight: 700 }}>
              {isAr ? "حاسبة الزكاة" : "Zakat Calculator"}
            </p>
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 10 }}>
              {isAr ? "احسب زكاة مالك السنوية بدقة" : "Calculate your yearly Zakat precisely"}
            </p>
          </div>
        </div>
      </header>

      <div className="px-4 py-4">
        {/* Nisab basis toggle */}
        <div className="rounded-2xl p-3.5 mb-4" style={{ background: "rgba(27,107,58,0.06)", border: "1px solid rgba(27,107,58,0.2)" }}>
          <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#7ACB7F", fontSize: 11.5, fontWeight: 700, marginBottom: 8 }}>
            {isAr ? "أساس حساب النصاب" : "Nisab calculation basis"}
          </p>
          <div className="flex items-center gap-1.5 rounded-xl p-1" style={{ background: "rgba(27,107,58,0.08)", border: "1px solid rgba(27,107,58,0.2)" }}>
            {(["silver", "gold"] as NisabBasis[]).map((b) => {
              const active = basis === b;
              return (
                <button key={b} onClick={() => setBasis(b)}
                  className="flex-1 py-2 rounded-lg active:scale-95 transition-all"
                  style={{
                    background: active ? "rgba(27,107,58,0.22)" : "transparent",
                    border: `1px solid ${active ? "rgba(27,107,58,0.45)" : "transparent"}`,
                  }}>
                  <span style={{ fontFamily: "'Tajawal', sans-serif", fontSize: 12, fontWeight: active ? 700 : 500, color: active ? "#4ADE80" : "#6A8A6A" }}>
                    {b === "silver"
                      ? (isAr ? `الفضة (${SILVER_NISAB_GRAMS} جم)` : `Silver (${SILVER_NISAB_GRAMS}g)`)
                      : (isAr ? `الذهب (${GOLD_NISAB_GRAMS} جم)` : `Gold (${GOLD_NISAB_GRAMS}g)`)}
                  </span>
                </button>
              );
            })}
          </div>
          <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#5A9A6A", fontSize: 10, marginTop: 8, lineHeight: 1.6 }}>
            {isAr
              ? "نصاب الفضة أكثر احتياطاً (يصبح أكثر الأموال واجبة فيها الزكاة)، وهو ما يرجّحه كثير من العلماء اليوم."
              : "The silver nisab is more cautious (a lower threshold), and is favored by many scholars today."}
          </p>
        </div>

        {/* Gold & silver holdings */}
        <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#C9A84C", fontSize: 13, fontWeight: 700, margin: "4px 2px 8px" }}>
          {isAr ? "الذهب والفضة المملوكة" : "Gold & silver you own"}
        </p>
        <div className="rounded-2xl p-3.5 mb-2" style={{ background: "linear-gradient(145deg, rgba(14,24,40,0.6), rgba(9,16,28,0.8))", border: "1px solid rgba(201,168,76,0.08)" }}>
          <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#C9B894", fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>
            {isAr ? "الذهب" : "Gold"}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1.5 rounded-xl px-3 py-2" style={{ background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.14)" }}>
              <NumberField value={goldGrams} onChange={setGoldGrams} placeholder={isAr ? "الوزن (جم)" : "Weight (g)"} />
            </div>
            <div className="flex items-center gap-1.5 rounded-xl px-3 py-2" style={{ background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.14)" }}>
              <NumberField value={goldPricePerGram} onChange={setGoldPricePerGram} placeholder={isAr ? `سعر الجرام ${currencySymbol}` : `Price/gram ${currencySymbol}`} />
            </div>
          </div>
        </div>
        <div className="rounded-2xl p-3.5 mb-4" style={{ background: "linear-gradient(145deg, rgba(14,24,40,0.6), rgba(9,16,28,0.8))", border: "1px solid rgba(201,168,76,0.08)" }}>
          <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#C9B894", fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>
            {isAr ? "الفضة" : "Silver"}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1.5 rounded-xl px-3 py-2" style={{ background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.14)" }}>
              <NumberField value={silverGrams} onChange={setSilverGrams} placeholder={isAr ? "الوزن (جم)" : "Weight (g)"} />
            </div>
            <div className="flex items-center gap-1.5 rounded-xl px-3 py-2" style={{ background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.14)" }}>
              <NumberField value={silverPricePerGram} onChange={setSilverPricePerGram} placeholder={isAr ? `سعر الجرام ${currencySymbol}` : `Price/gram ${currencySymbol}`} />
            </div>
          </div>
          <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 10, marginTop: 8 }}>
            {isAr ? "أدخل السعر الحالي للجرام من مصدر محلي موثوق — لا يتوفر سعر تلقائي." : "Enter today's price per gram from a trusted local source — no automatic price feed is available."}
          </p>
        </div>

        {/* Other wealth categories */}
        <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#C9A84C", fontSize: 13, fontWeight: 700, margin: "4px 2px 8px" }}>
          {isAr ? "بقية الأموال" : "Other wealth"}
        </p>
        {ZAKAT_FIELDS.map((f) => (
          <FieldRow
            key={f.key}
            label={isAr ? f.labelAr : f.labelEn}
            help={isAr ? f.helpAr : f.helpEn}
            value={fieldSetters[f.key][0]}
            onChange={fieldSetters[f.key][1]}
            accent="#C9A84C"
            currencySymbol={currencySymbol}
          />
        ))}

        <button
          onClick={() => setShowResult(true)}
          className="w-full mt-3 py-3.5 rounded-2xl active:scale-95 transition-transform"
          style={{ background: "linear-gradient(135deg, #1B6B3A, #228B4A)", boxShadow: "0 6px 20px rgba(27,107,58,0.35)" }}
        >
          <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#F5ECD7", fontSize: 14, fontWeight: 700 }}>
            {isAr ? "احسب الزكاة" : "Calculate Zakat"}
          </span>
        </button>

        {showResult && (
          <div className="mt-5 rounded-2xl p-5 text-center"
            style={{
              background: result.isDue ? "rgba(27,107,58,0.1)" : "rgba(201,168,76,0.06)",
              border: `1px solid ${result.isDue ? "rgba(27,107,58,0.35)" : "rgba(201,168,76,0.2)"}`,
            }}>
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 11, marginBottom: 4 }}>
              {isAr ? "صافي المال الزكوي" : "Net zakatable wealth"}
            </p>
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#F5ECD7", fontSize: 18, fontWeight: 700, marginBottom: 14 }}>
              {fmt(result.netWealth)} {currencySymbol}
            </p>

            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex-1 h-px" style={{ background: "rgba(201,168,76,0.15)" }} />
              <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 10 }}>
                {isAr ? `النصاب: ${fmt(result.nisabValue)} ${currencySymbol}` : `Nisab: ${fmt(result.nisabValue)} ${currencySymbol}`}
              </span>
              <div className="flex-1 h-px" style={{ background: "rgba(201,168,76,0.15)" }} />
            </div>

            {result.isDue ? (
              <>
                <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#4ADE80", fontSize: 12, fontWeight: 600, marginBottom: 6 }}>
                  {isAr ? "الزكاة واجبة عليك — 2.5٪ من صافي مالك" : "Zakat is due — 2.5% of your net wealth"}
                </p>
                <p style={{ fontFamily: "'Amiri', serif", color: "#C9A84C", fontSize: 28, fontWeight: 700 }}>
                  {fmt(result.zakatDue)} {currencySymbol}
                </p>
              </>
            ) : (
              <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#C9B894", fontSize: 13, fontWeight: 600, lineHeight: 1.7 }}>
                {isAr
                  ? "مالك أقل من النصاب، فلا زكاة واجبة عليك هذا العام."
                  : "Your wealth is below the nisab, so no Zakat is due this year."}
              </p>
            )}
          </div>
        )}

        <p className="text-center mt-5 px-2" style={{ fontFamily: "'Tajawal', sans-serif", color: "#5A4830", fontSize: 10, lineHeight: 1.7 }}>
          {isAr
            ? "تنطبق الزكاة على المال الذي استمر معك حولاً كاملاً (سنة هجرية). هذه الحاسبة أداة تقريبية للمساعدة — لحالات معقدة (كالزكاة التجارية أو الزراعية الخاصة) يُرجى سؤال عالم موثوق."
            : "Zakat applies to wealth you've held for one full lunar year. This calculator is a helper tool — for complex cases (special business or agricultural Zakat) please consult a trusted scholar."}
        </p>
      </div>
    </div>
  );
}
