"use client";

import { useState } from "react";
import PiWalletPaymentButton from "./PiWalletPaymentButton";
import { PRODUCT_CONFIG } from "@/lib/product-config";

const FEATURES = [
  { id: "quran",   title: "القرآن الكريم", sub: "١١٤ سورة · ٦٢٣٦ آية",       desc: "اقرأ واستمع لكامل القرآن بتلاوات متعددة مع التفسير",  accent: "#C9A84C", bg: "rgba(201,168,76,0.06)", bdr: "rgba(201,168,76,0.2)", bdrA: "rgba(201,168,76,0.42)" },
  { id: "tafsir",  title: "التفسير",      sub: "معاني السور الميسرة",          desc: "تفسير ميسر لجميع سور القرآن الكريم مع بيان موضوع كل سورة", accent: "#228B4A", bg: "rgba(27,107,58,0.06)",  bdr: "rgba(27,107,58,0.2)",  bdrA: "rgba(27,107,58,0.48)" },
  { id: "fiqh",    title: "الفقه",        sub: "أحكام العبادات والمعاملات",    desc: "مسائل فقهية مصنفة في الطهارة والصلاة والزكاة والصيام والحج والمعاملات", accent: "#C9A84C", bg: "rgba(201,168,76,0.06)", bdr: "rgba(201,168,76,0.2)", bdrA: "rgba(201,168,76,0.42)" },
  { id: "hadith",  title: "الأحاديث",      sub: "البخاري · مسلم · الترمذي",   desc: "أحاديث مصنفة ومحققة مع الشرح والسند والحكم",          accent: "#228B4A", bg: "rgba(27,107,58,0.06)",  bdr: "rgba(27,107,58,0.2)",  bdrA: "rgba(27,107,58,0.48)" },
  { id: "dhikr",   title: "الأذكار",       sub: "الصباح والمساء وغيرها",        desc: "أذكار مأثورة كاملة مع عداد الذكر التفاعلي",           accent: "#228B4A", bg: "rgba(27,107,58,0.06)",  bdr: "rgba(27,107,58,0.2)",  bdrA: "rgba(27,107,58,0.48)" },
  { id: "duas",    title: "الأدعية",       sub: "قرآنية ونبوية جامعة",          desc: "أدعية مأثورة لكل حال من القرآن والسنة الصحيحة",       accent: "#C9A84C", bg: "rgba(201,168,76,0.06)", bdr: "rgba(201,168,76,0.2)", bdrA: "rgba(201,168,76,0.42)" },
  { id: "prayer",  title: "مواقيت الصلاة", sub: "الوقت الحالي والصلاة القادمة", desc: "تابع مواقيت الصلوات الخمس مع عدّاد للصلاة القادمة",   accent: "#228B4A", bg: "rgba(27,107,58,0.06)",  bdr: "rgba(27,107,58,0.2)",  bdrA: "rgba(27,107,58,0.48)" },
  { id: "qibla",   title: "القبلة",        sub: "الاتجاه الدقيق",               desc: "حدد اتجاه القبلة بدقة باستخدام البوصلة الإسلامية",   accent: "#C9A84C", bg: "rgba(201,168,76,0.06)", bdr: "rgba(201,168,76,0.2)", bdrA: "rgba(201,168,76,0.42)" },
  { id: "zakat",   title: "حاسبة الزكاة",  sub: "احسب زكاة مالك بدقة",          desc: "حاسبة شاملة لزكاة النقد والذهب والفضة والأسهم والعروض التجارية حسب نصاب كل نوع", accent: "#228B4A", bg: "rgba(27,107,58,0.06)",  bdr: "rgba(27,107,58,0.2)",  bdrA: "rgba(27,107,58,0.48)" },
  { id: "mosques", title: "المساجد القريبة", sub: "أقرب مسجد في أي مكان",        desc: "استخدم موقعك لإيجاد أقرب المساجد إليك في أي بلد بالعالم مع خطوط السير", accent: "#C9A84C", bg: "rgba(201,168,76,0.06)", bdr: "rgba(201,168,76,0.2)", bdrA: "rgba(201,168,76,0.42)" },
  { id: "asma",    title: "أسماء الله الحسنى", sub: "٩٩ اسماً بالمعنى والفضل",   desc: "تعرّف على أسماء الله الحسنى كاملة مع شرح المعنى وأثر كل اسم", accent: "#C9A84C", bg: "rgba(201,168,76,0.06)", bdr: "rgba(201,168,76,0.2)", bdrA: "rgba(201,168,76,0.42)" },
  { id: "history", title: "التاريخ",       sub: "سيرة وحضارة إسلامية",         desc: "استعرض تاريخ الإسلام العريق من صدر الإسلام",         accent: "#228B4A", bg: "rgba(27,107,58,0.06)",  bdr: "rgba(27,107,58,0.2)",  bdrA: "rgba(27,107,58,0.48)" },
  { id: "prophets",title: "الأنبياء والرسل", sub: "سيرة ٢٥ نبياً ورسولاً",        desc: "تعرّف على قصص الأنبياء والرسل عليهم السلام كاملة",   accent: "#C9A84C", bg: "rgba(201,168,76,0.06)", bdr: "rgba(201,168,76,0.2)", bdrA: "rgba(201,168,76,0.42)" },
  { id: "cal",     title: "التقويم",       sub: "المناسبات الإسلامية",          desc: "تتبع الأعياد والأشهر الهجرية المباركة",              accent: "#228B4A", bg: "rgba(27,107,58,0.06)",  bdr: "rgba(27,107,58,0.2)",  bdrA: "rgba(27,107,58,0.48)" },
  { id: "dawah",   title: "الدعوة",        sub: "تعريف بالإسلام ودعوة إليه",     desc: "أركان الإسلام والإيمان، كيفية الدخول في الإسلام، أسئلة شائعة ورسائل دعوية جاهزة", accent: "#228B4A", bg: "rgba(27,107,58,0.06)",  bdr: "rgba(27,107,58,0.2)",  bdrA: "rgba(27,107,58,0.48)" },
  { id: "ramadan", title: "رمضان والحج",  sub: "دليل عملي للموسمين",            desc: "فضائل رمضان وبرنامجه اليومي، وخطوات الحج والعمرة بالترتيب مع الأدعية", accent: "#C9A84C", bg: "rgba(201,168,76,0.06)", bdr: "rgba(201,168,76,0.2)", bdrA: "rgba(201,168,76,0.42)" },
  { id: "sermons", title: "الخطب والوعظ", sub: "جمعة ومواعظ وعلماء عالميون",    desc: "خطب جمعة مصنفة حسب الموضوع، ودليل بأبرز العلماء والدعاة المعروفين بوعظهم مع روابط لمحاضراتهم الأصلية", accent: "#228B4A", bg: "rgba(27,107,58,0.06)",  bdr: "rgba(27,107,58,0.2)",  bdrA: "rgba(27,107,58,0.48)" },
  { id: "mawareth", title: "المواريث",   sub: "حاسبة توزيع التركة",            desc: "احسب توزيع التركة على الورثة وفق أحكام الفرائض، مع بيان نصيب كل وارث وسببه الشرعي", accent: "#C9A84C", bg: "rgba(201,168,76,0.06)", bdr: "rgba(201,168,76,0.2)", bdrA: "rgba(201,168,76,0.42)" },
  { id: "seerah",   title: "السيرة النبوية", sub: "محطات حياة النبي ﷺ",       desc: "رحلة كاملة في سيرة النبي محمد ﷺ من الولادة إلى الوفاة، بأهم محطاتها وعبرها", accent: "#228B4A", bg: "rgba(27,107,58,0.06)",  bdr: "rgba(27,107,58,0.2)",  bdrA: "rgba(27,107,58,0.48)" },
  { id: "glossary", title: "معجم المصطلحات", sub: "شرح المصطلحات الإسلامية",   desc: "معجم ميسر يشرح أهم المصطلحات في العقيدة والعبادة والفقه والقرآن والحديث", accent: "#C9A84C", bg: "rgba(201,168,76,0.06)", bdr: "rgba(201,168,76,0.2)", bdrA: "rgba(201,168,76,0.42)" },
];

interface Props {
  onOpen?: (id: string) => void;
}

const NAVIGABLE = new Set(["quran", "tafsir", "fiqh", "hadith", "dhikr", "duas", "qibla", "prayer", "zakat", "mosques", "cal", "asma", "history", "prophets", "dawah", "ramadan", "sermons", "mawareth", "seerah", "glossary"]);

export default function FeatureCards({ onOpen }: Props) {
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
        {FEATURES.map((f) => {
          const open = active === f.id;
          const navigable = NAVIGABLE.has(f.id) && onOpen;
          return (
            <button key={f.id}
              onClick={() => (navigable ? onOpen!(f.id) : setActive(open ? null : f.id))}
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
