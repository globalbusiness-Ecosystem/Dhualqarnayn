"use client";

import { useMemo, useState } from "react";
import { computeMawareth, type DeceasedGender, type MawarethInput } from "@/lib/mawareth-engine";
import ShareButton from "./ShareButton";

interface Props {
  onBack: () => void;
}

const gold = "#C9A84C";
const emerald = "#1B6B3A";

function NumField({
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

function Stepper({
  label,
  value,
  onChange,
  max = 20,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  max?: number;
}) {
  return (
    <div
      className="flex items-center justify-between rounded-xl px-3 py-2.5"
      style={{ background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.14)" }}
    >
      <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#C9B894", fontSize: 12.5, fontWeight: 600 }}>
        {label}
      </span>
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-7 h-7 flex items-center justify-center rounded-lg active:scale-90"
          style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)" }}
        >
          <span style={{ color: gold, fontSize: 15, fontWeight: 700, lineHeight: 1 }}>−</span>
        </button>
        <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#F5ECD7", fontSize: 15, fontWeight: 700, minWidth: 18, textAlign: "center" }}>
          {value}
        </span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-7 h-7 flex items-center justify-center rounded-lg active:scale-90"
          style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)" }}
        >
          <span style={{ color: gold, fontSize: 15, fontWeight: 700, lineHeight: 1 }}>+</span>
        </button>
      </div>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl p-3.5 mb-3"
      style={{ background: "linear-gradient(145deg, rgba(14,24,40,0.6), rgba(9,16,28,0.8))", border: "1px solid rgba(201,168,76,0.08)" }}
    >
      <p style={{ fontFamily: "'Tajawal', sans-serif", color: gold, fontSize: 12.5, fontWeight: 700, marginBottom: 10 }}>
        {title}
      </p>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      className="flex items-center justify-between rounded-xl px-3 py-2.5"
      style={{ background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.14)" }}
    >
      <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#C9B894", fontSize: 12.5, fontWeight: 600 }}>
        {label}
      </span>
      <button
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        style={{
          width: 42,
          height: 24,
          borderRadius: 999,
          background: value ? emerald : "rgba(201,168,76,0.15)",
          position: "relative",
          flexShrink: 0,
          transition: "background 0.2s",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 3,
            right: value ? 3 : 21,
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "#fff",
            transition: "right 0.2s",
            boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
          }}
        />
      </button>
    </div>
  );
}

export default function MawarethCalculator({ onBack }: Props) {
  const currencySymbol = "ر.س";

  const [estate, setEstate] = useState("");
  const [debts, setDebts] = useState("");
  const [funeralCosts, setFuneralCosts] = useState("");
  const [bequest, setBequest] = useState("");
  const [deceasedGender, setDeceasedGender] = useState<DeceasedGender>("male");

  const [hasSpouse, setHasSpouse] = useState(false);
  const [spouseCount, setSpouseCount] = useState(1);
  const [sons, setSons] = useState(0);
  const [daughters, setDaughters] = useState(0);
  const [fatherAlive, setFatherAlive] = useState(false);
  const [motherAlive, setMotherAlive] = useState(false);
  const [fullBrothers, setFullBrothers] = useState(0);
  const [fullSisters, setFullSisters] = useState(0);

  const [showResult, setShowResult] = useState(false);

  const input: MawarethInput = useMemo(
    () => ({
      estate: parseFloat(estate) || 0,
      debts: parseFloat(debts) || 0,
      funeralCosts: parseFloat(funeralCosts) || 0,
      bequest: parseFloat(bequest) || 0,
      deceasedGender,
      hasSpouse,
      spouseCount,
      sons,
      daughters,
      fatherAlive,
      motherAlive,
      fullBrothers,
      fullSisters,
    }),
    [estate, debts, funeralCosts, bequest, deceasedGender, hasSpouse, spouseCount, sons, daughters, fatherAlive, motherAlive, fullBrothers, fullSisters]
  );

  const result = useMemo(() => computeMawareth(input), [input]);

  const fmt = (n: number) => n.toLocaleString("ar-SA", { maximumFractionDigits: 2 });

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 24, background: "#050C16" }}>
      <header
        className="sticky top-0 z-20 px-4 py-3"
        style={{ background: "rgba(5,12,22,0.96)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(201,168,76,0.1)" }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-xl active:scale-90"
            style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.15)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke={gold} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="scale(-1,1) translate(-24,0)" />
            </svg>
          </button>
          <div>
            <p style={{ fontFamily: "'Amiri', serif", color: gold, fontSize: 18, fontWeight: 700 }}>
              حاسبة المواريث
            </p>
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 10 }}>
              توزيع التركة على الورثة وفق الفرائض
            </p>
          </div>
        </div>
      </header>

      <div className="px-4 py-4">
        {/* Disclaimer */}
        <div className="rounded-2xl p-3.5 mb-4" style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)" }}>
          <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#C9B894", fontSize: 11, lineHeight: 1.8 }}>
            هذه الحاسبة أداة مساعدة تقريبية لأكثر حالات الفرائض شيوعاً (الزوج/الزوجة، الأبناء، البنات، الأب، الأم،
            والإخوة والأخوات الأشقاء)، وليست بديلاً عن فتوى شرعية. للحالات الأكثر تعقيداً (كالأجداد، أو الإخوة لأب أو
            لأم، أو ذوي الأرحام) يُرجى الرجوع إلى عالم فرائض موثوق أو قاضٍ شرعي رسمي.
          </p>
        </div>

        {/* Estate basics */}
        <SectionCard title="التركة">
          <div className="rounded-xl px-3 py-2 flex items-center gap-2" style={{ background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.14)" }}>
            <NumField value={estate} onChange={setEstate} placeholder="إجمالي التركة" />
            <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 11, flexShrink: 0 }}>{currencySymbol}</span>
          </div>
          <div className="rounded-xl px-3 py-2 flex items-center gap-2" style={{ background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.14)" }}>
            <NumField value={debts} onChange={setDebts} placeholder="الديون على المتوفى" />
            <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 11, flexShrink: 0 }}>{currencySymbol}</span>
          </div>
          <div className="rounded-xl px-3 py-2 flex items-center gap-2" style={{ background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.14)" }}>
            <NumField value={funeralCosts} onChange={setFuneralCosts} placeholder="تكاليف التجهيز والدفن" />
            <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 11, flexShrink: 0 }}>{currencySymbol}</span>
          </div>
          <div className="rounded-xl px-3 py-2 flex items-center gap-2" style={{ background: "rgba(201,168,76,0.04)", border: "1px solid rgba(201,168,76,0.14)" }}>
            <NumField value={bequest} onChange={setBequest} placeholder="الوصية (إن وُجدت، بحد أقصى الثلث)" />
            <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 11, flexShrink: 0 }}>{currencySymbol}</span>
          </div>
          <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 10, lineHeight: 1.7, marginTop: 2 }}>
            تُخصم الديون وتكاليف التجهيز من التركة أولاً، ثم تُنفّذ الوصية من الباقي بحد أقصى الثلث، ثم يُقسّم الباقي على الورثة.
          </p>
        </SectionCard>

        {/* Deceased gender */}
        <SectionCard title="المتوفى">
          <div className="flex items-center gap-1.5 rounded-xl p-1" style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}>
            {([
              ["male", "رجل (له زوجة/زوجات)"],
              ["female", "امرأة (لها زوج)"],
            ] as [DeceasedGender, string][]).map(([g, label]) => {
              const active = deceasedGender === g;
              return (
                <button
                  key={g}
                  onClick={() => setDeceasedGender(g)}
                  className="flex-1 py-2 rounded-lg active:scale-95 transition-all"
                  style={{ background: active ? "rgba(201,168,76,0.22)" : "transparent", border: `1px solid ${active ? "rgba(201,168,76,0.45)" : "transparent"}` }}
                >
                  <span style={{ fontFamily: "'Tajawal', sans-serif", fontSize: 11.5, fontWeight: active ? 700 : 500, color: active ? gold : "#8A7A5A" }}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </SectionCard>

        {/* Spouse */}
        <SectionCard title={deceasedGender === "male" ? "الزوجة / الزوجات" : "الزوج"}>
          <ToggleRow
            label={deceasedGender === "male" ? "له زوجة على قيد الحياة؟" : "لها زوج على قيد الحياة؟"}
            value={hasSpouse}
            onChange={setHasSpouse}
          />
          {hasSpouse && deceasedGender === "male" && (
            <Stepper label="عدد الزوجات" value={spouseCount} onChange={setSpouseCount} max={4} />
          )}
        </SectionCard>

        {/* Children */}
        <SectionCard title="الأبناء والبنات">
          <Stepper label="عدد الأبناء (الذكور)" value={sons} onChange={setSons} />
          <Stepper label="عدد البنات" value={daughters} onChange={setDaughters} />
        </SectionCard>

        {/* Parents */}
        <SectionCard title="الوالدان">
          <ToggleRow label="الأب على قيد الحياة؟" value={fatherAlive} onChange={setFatherAlive} />
          <ToggleRow label="الأم على قيد الحياة؟" value={motherAlive} onChange={setMotherAlive} />
        </SectionCard>

        {/* Siblings */}
        <SectionCard title="الإخوة والأخوات الأشقاء">
          <Stepper label="عدد الإخوة الأشقاء (ذكور)" value={fullBrothers} onChange={setFullBrothers} />
          <Stepper label="عدد الأخوات الشقيقات" value={fullSisters} onChange={setFullSisters} />
          <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 10, lineHeight: 1.7 }}>
            المقصود هنا الإخوة من الأب والأم معاً فقط. الإخوة لأب فقط أو لأم فقط لهم أحكام مختلفة غير مشمولة في هذه الحاسبة.
          </p>
        </SectionCard>

        <button
          onClick={() => setShowResult(true)}
          className="w-full mt-2 py-3.5 rounded-2xl active:scale-95 transition-transform"
          style={{ background: `linear-gradient(135deg, ${emerald}, #228B4A)`, boxShadow: "0 6px 20px rgba(27,107,58,0.35)" }}
        >
          <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#F5ECD7", fontSize: 14, fontWeight: 700 }}>
            احسب توزيع الميراث
          </span>
        </button>

        {showResult && (
          <div className="mt-5">
            <div className="rounded-2xl p-4 mb-3 text-center" style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.2)" }}>
              <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 11, marginBottom: 4 }}>
                التركة القابلة للقسمة على الورثة
              </p>
              <p style={{ fontFamily: "'Amiri', serif", color: gold, fontSize: 22, fontWeight: 700 }}>
                {fmt(result.distributable)} {currencySymbol}
              </p>
              {result.bequestAmount > 0 && (
                <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 10, marginTop: 6 }}>
                  (بعد تنفيذ الوصية بقيمة {fmt(result.bequestAmount)} {currencySymbol})
                </p>
              )}
            </div>

            {(result.awlApplied || result.raddApplied || result.blockedNotes.length > 0) && (
              <div className="rounded-2xl p-3.5 mb-3" style={{ background: "rgba(27,107,58,0.06)", border: "1px solid rgba(27,107,58,0.2)" }}>
                {result.blockedNotes.map((note, i) => (
                  <p key={`b${i}`} style={{ fontFamily: "'Tajawal', sans-serif", color: "#7ACB7F", fontSize: 11, lineHeight: 1.8, marginBottom: 4 }}>
                    • {note}
                  </p>
                ))}
                {result.awlApplied && (
                  <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#7ACB7F", fontSize: 11, lineHeight: 1.8, marginBottom: 4 }}>
                    • طُبّقت مسألة &quot;العول&quot; لزيادة الفروض عن التركة.
                  </p>
                )}
                {result.raddApplied && (
                  <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#7ACB7F", fontSize: 11, lineHeight: 1.8 }}>
                    • طُبّقت مسألة &quot;الرد&quot; لعدم وجود عاصب يستحق باقي التركة.
                  </p>
                )}
              </div>
            )}

            {result.heirs.length > 0 && (
              <div className="flex flex-col gap-2 mb-3">
                {result.heirs.map((h) => (
                  <div
                    key={h.id}
                    className="rounded-2xl p-3.5"
                    style={{ background: "linear-gradient(145deg, rgba(14,24,40,0.6), rgba(9,16,28,0.8))", border: "1px solid rgba(201,168,76,0.1)" }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#F5ECD7", fontSize: 13.5, fontWeight: 700 }}>
                        {h.label}
                      </p>
                      <p style={{ fontFamily: "'Amiri', serif", color: gold, fontSize: 15, fontWeight: 700 }}>
                        {fmt(h.totalAmount)} {currencySymbol}
                      </p>
                    </div>
                    {h.count > 1 && (
                      <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#8A7A5A", fontSize: 10.5, marginBottom: 3 }}>
                        نصيب كل فرد: {fmt(h.perPerson)} {currencySymbol}
                      </p>
                    )}
                    <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#6A5A48", fontSize: 10, lineHeight: 1.7 }}>
                      {h.basis}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <ShareButton
              data={{
                kindLabel: "حاسبة المواريث",
                arabicText: result.heirs.map((h) => `${h.label}: ${fmt(h.totalAmount)} ${currencySymbol}`).join(" — "),
                translation: `إجمالي التركة القابلة للقسمة: ${fmt(result.distributable)} ${currencySymbol}`,
                footer: "ذو القرنين",
              }}
            />

            {result.generalNotes.map((note, i) => (
              <p key={`g${i}`} className="mt-3 px-2" style={{ fontFamily: "'Tajawal', sans-serif", color: "#5A4830", fontSize: 10, lineHeight: 1.8 }}>
                {note}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
