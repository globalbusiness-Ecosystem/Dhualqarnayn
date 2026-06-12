"use client";

import { useState } from "react";

const SURAHS = [
  { n: 1,   ar: "الفاتحة",       en: "Al-Fatihah",         ayahs: 7,   juz: 1,  rev: "مكية" },
  { n: 2,   ar: "البقرة",        en: "Al-Baqarah",         ayahs: 286, juz: 1,  rev: "مدنية" },
  { n: 3,   ar: "آل عمران",      en: "Ali 'Imran",         ayahs: 200, juz: 3,  rev: "مدنية" },
  { n: 4,   ar: "النساء",        en: "An-Nisa",            ayahs: 176, juz: 4,  rev: "مدنية" },
  { n: 5,   ar: "المائدة",       en: "Al-Ma'idah",         ayahs: 120, juz: 6,  rev: "مدنية" },
  { n: 6,   ar: "الأنعام",       en: "Al-An'am",           ayahs: 165, juz: 7,  rev: "مكية" },
  { n: 7,   ar: "الأعراف",       en: "Al-A'raf",           ayahs: 206, juz: 8,  rev: "مكية" },
  { n: 8,   ar: "الأنفال",       en: "Al-Anfal",           ayahs: 75,  juz: 9,  rev: "مدنية" },
  { n: 9,   ar: "التوبة",        en: "At-Tawbah",          ayahs: 129, juz: 10, rev: "مدنية" },
  { n: 10,  ar: "يونس",          en: "Yunus",              ayahs: 109, juz: 11, rev: "مكية" },
  { n: 11,  ar: "هود",           en: "Hud",                ayahs: 123, juz: 11, rev: "مكية" },
  { n: 12,  ar: "يوسف",          en: "Yusuf",              ayahs: 111, juz: 12, rev: "مكية" },
  { n: 13,  ar: "الرعد",         en: "Ar-Ra'd",            ayahs: 43,  juz: 13, rev: "مدنية" },
  { n: 14,  ar: "إبراهيم",       en: "Ibrahim",            ayahs: 52,  juz: 13, rev: "مكية" },
  { n: 15,  ar: "الحجر",         en: "Al-Hijr",            ayahs: 99,  juz: 14, rev: "مكية" },
  { n: 16,  ar: "النحل",         en: "An-Nahl",            ayahs: 128, juz: 14, rev: "مكية" },
  { n: 17,  ar: "الإسراء",       en: "Al-Isra",            ayahs: 111, juz: 15, rev: "مكية" },
  { n: 18,  ar: "الكهف",         en: "Al-Kahf",            ayahs: 110, juz: 15, rev: "مكية" },
  { n: 19,  ar: "مريم",          en: "Maryam",             ayahs: 98,  juz: 16, rev: "مكية" },
  { n: 20,  ar: "طه",            en: "Ta-Ha",              ayahs: 135, juz: 16, rev: "مكية" },
  { n: 21,  ar: "الأنبياء",      en: "Al-Anbya",           ayahs: 112, juz: 17, rev: "مكية" },
  { n: 22,  ar: "الحج",          en: "Al-Hajj",            ayahs: 78,  juz: 17, rev: "مدنية" },
  { n: 23,  ar: "المؤمنون",      en: "Al-Mu'minun",        ayahs: 118, juz: 18, rev: "مكية" },
  { n: 24,  ar: "النور",         en: "An-Nur",             ayahs: 64,  juz: 18, rev: "مدنية" },
  { n: 25,  ar: "الفرقان",       en: "Al-Furqan",          ayahs: 77,  juz: 18, rev: "مكية" },
  { n: 26,  ar: "الشعراء",       en: "Ash-Shu'ara",        ayahs: 227, juz: 19, rev: "مكية" },
  { n: 27,  ar: "النمل",         en: "An-Naml",            ayahs: 93,  juz: 19, rev: "مكية" },
  { n: 28,  ar: "القصص",         en: "Al-Qasas",           ayahs: 88,  juz: 20, rev: "مكية" },
  { n: 29,  ar: "العنكبوت",      en: "Al-'Ankabut",        ayahs: 69,  juz: 20, rev: "مكية" },
  { n: 30,  ar: "الروم",         en: "Ar-Rum",             ayahs: 60,  juz: 21, rev: "مكية" },
  { n: 31,  ar: "لقمان",         en: "Luqman",             ayahs: 34,  juz: 21, rev: "مكية" },
  { n: 32,  ar: "السجدة",        en: "As-Sajdah",          ayahs: 30,  juz: 21, rev: "مكية" },
  { n: 33,  ar: "الأحزاب",       en: "Al-Ahzab",           ayahs: 73,  juz: 21, rev: "مدنية" },
  { n: 34,  ar: "سبأ",           en: "Saba",               ayahs: 54,  juz: 22, rev: "مكية" },
  { n: 35,  ar: "فاطر",          en: "Fatir",              ayahs: 45,  juz: 22, rev: "مكية" },
  { n: 36,  ar: "يس",            en: "Ya-Sin",             ayahs: 83,  juz: 22, rev: "مكية" },
  { n: 37,  ar: "الصافات",       en: "As-Saffat",          ayahs: 182, juz: 23, rev: "مكية" },
  { n: 38,  ar: "ص",             en: "Sad",                ayahs: 88,  juz: 23, rev: "مكية" },
  { n: 39,  ar: "الزمر",         en: "Az-Zumar",           ayahs: 75,  juz: 23, rev: "مكية" },
  { n: 40,  ar: "غافر",          en: "Ghafir",             ayahs: 85,  juz: 24, rev: "مكية" },
  { n: 41,  ar: "فصلت",          en: "Fussilat",           ayahs: 54,  juz: 24, rev: "مكية" },
  { n: 42,  ar: "الشورى",        en: "Ash-Shuraa",         ayahs: 53,  juz: 25, rev: "مكية" },
  { n: 43,  ar: "الزخرف",        en: "Az-Zukhruf",         ayahs: 89,  juz: 25, rev: "مكية" },
  { n: 44,  ar: "الدخان",        en: "Ad-Dukhan",          ayahs: 59,  juz: 25, rev: "مكية" },
  { n: 45,  ar: "الجاثية",       en: "Al-Jathiyah",        ayahs: 37,  juz: 25, rev: "مكية" },
  { n: 46,  ar: "الأحقاف",       en: "Al-Ahqaf",           ayahs: 35,  juz: 26, rev: "مكية" },
  { n: 47,  ar: "محمد",          en: "Muhammad",           ayahs: 38,  juz: 26, rev: "مدنية" },
  { n: 48,  ar: "الفتح",         en: "Al-Fath",            ayahs: 29,  juz: 26, rev: "مدنية" },
  { n: 49,  ar: "الحجرات",       en: "Al-Hujurat",         ayahs: 18,  juz: 26, rev: "مدنية" },
  { n: 50,  ar: "ق",             en: "Qaf",                ayahs: 45,  juz: 26, rev: "مكية" },
  { n: 51,  ar: "الذاريات",      en: "Adh-Dhariyat",       ayahs: 60,  juz: 26, rev: "مكية" },
  { n: 52,  ar: "الطور",         en: "At-Tur",             ayahs: 49,  juz: 27, rev: "مكية" },
  { n: 53,  ar: "النجم",         en: "An-Najm",            ayahs: 62,  juz: 27, rev: "مكية" },
  { n: 54,  ar: "القمر",         en: "Al-Qamar",           ayahs: 55,  juz: 27, rev: "مكية" },
  { n: 55,  ar: "الرحمن",        en: "Ar-Rahman",          ayahs: 78,  juz: 27, rev: "مدنية" },
  { n: 56,  ar: "الواقعة",       en: "Al-Waqi'ah",         ayahs: 96,  juz: 27, rev: "مكية" },
  { n: 57,  ar: "الحديد",        en: "Al-Hadid",           ayahs: 29,  juz: 27, rev: "مدنية" },
  { n: 58,  ar: "المجادلة",      en: "Al-Mujadila",        ayahs: 22,  juz: 28, rev: "مدنية" },
  { n: 59,  ar: "الحشر",         en: "Al-Hashr",           ayahs: 24,  juz: 28, rev: "مدنية" },
  { n: 60,  ar: "الممتحنة",      en: "Al-Mumtahanah",      ayahs: 13,  juz: 28, rev: "مدنية" },
  { n: 61,  ar: "الصف",          en: "As-Saf",             ayahs: 14,  juz: 28, rev: "مدنية" },
  { n: 62,  ar: "الجمعة",        en: "Al-Jumu'ah",         ayahs: 11,  juz: 28, rev: "مدنية" },
  { n: 63,  ar: "المنافقون",     en: "Al-Munafiqun",       ayahs: 11,  juz: 28, rev: "مدنية" },
  { n: 64,  ar: "التغابن",       en: "At-Taghabun",        ayahs: 18,  juz: 28, rev: "مدنية" },
  { n: 65,  ar: "الطلاق",        en: "At-Talaq",           ayahs: 12,  juz: 28, rev: "مدنية" },
  { n: 66,  ar: "التحريم",       en: "At-Tahrim",          ayahs: 12,  juz: 28, rev: "مدنية" },
  { n: 67,  ar: "الملك",         en: "Al-Mulk",            ayahs: 30,  juz: 29, rev: "مكية" },
  { n: 68,  ar: "القلم",         en: "Al-Qalam",           ayahs: 52,  juz: 29, rev: "مكية" },
  { n: 69,  ar: "الحاقة",        en: "Al-Haqqah",          ayahs: 52,  juz: 29, rev: "مكية" },
  { n: 70,  ar: "المعارج",       en: "Al-Ma'arij",         ayahs: 44,  juz: 29, rev: "مكية" },
  { n: 71,  ar: "نوح",           en: "Nuh",                ayahs: 28,  juz: 29, rev: "مكية" },
  { n: 72,  ar: "الجن",          en: "Al-Jinn",            ayahs: 28,  juz: 29, rev: "مكية" },
  { n: 73,  ar: "المزمل",        en: "Al-Muzzammil",       ayahs: 20,  juz: 29, rev: "مكية" },
  { n: 74,  ar: "المدثر",        en: "Al-Muddaththir",     ayahs: 56,  juz: 29, rev: "مكية" },
  { n: 75,  ar: "القيامة",       en: "Al-Qiyamah",         ayahs: 40,  juz: 29, rev: "مكية" },
  { n: 76,  ar: "الإنسان",       en: "Al-Insan",           ayahs: 31,  juz: 29, rev: "مدنية" },
  { n: 77,  ar: "المرسلات",      en: "Al-Mursalat",        ayahs: 50,  juz: 29, rev: "مكية" },
  { n: 78,  ar: "النبأ",         en: "An-Naba",            ayahs: 40,  juz: 30, rev: "مكية" },
  { n: 79,  ar: "النازعات",      en: "An-Nazi'at",         ayahs: 46,  juz: 30, rev: "مكية" },
  { n: 80,  ar: "عبس",           en: "'Abasa",             ayahs: 42,  juz: 30, rev: "مكية" },
  { n: 81,  ar: "التكوير",       en: "At-Takwir",          ayahs: 29,  juz: 30, rev: "مكية" },
  { n: 82,  ar: "الانفطار",      en: "Al-Infitar",         ayahs: 19,  juz: 30, rev: "مكية" },
  { n: 83,  ar: "المطففين",      en: "Al-Mutaffifin",      ayahs: 36,  juz: 30, rev: "مكية" },
  { n: 84,  ar: "الانشقاق",      en: "Al-Inshiqaq",        ayahs: 25,  juz: 30, rev: "مكية" },
  { n: 85,  ar: "البروج",        en: "Al-Buruj",           ayahs: 22,  juz: 30, rev: "مكية" },
  { n: 86,  ar: "الطارق",        en: "At-Tariq",           ayahs: 17,  juz: 30, rev: "مكية" },
  { n: 87,  ar: "الأعلى",        en: "Al-A'la",            ayahs: 19,  juz: 30, rev: "مكية" },
  { n: 88,  ar: "الغاشية",       en: "Al-Ghashiyah",       ayahs: 26,  juz: 30, rev: "مكية" },
  { n: 89,  ar: "الفجر",         en: "Al-Fajr",            ayahs: 30,  juz: 30, rev: "مكية" },
  { n: 90,  ar: "البلد",         en: "Al-Balad",           ayahs: 20,  juz: 30, rev: "مكية" },
  { n: 91,  ar: "الشمس",         en: "Ash-Shams",          ayahs: 15,  juz: 30, rev: "مكية" },
  { n: 92,  ar: "الليل",         en: "Al-Layl",            ayahs: 21,  juz: 30, rev: "مكية" },
  { n: 93,  ar: "الضحى",         en: "Ad-Duha",            ayahs: 11,  juz: 30, rev: "مكية" },
  { n: 94,  ar: "الشرح",         en: "Ash-Sharh",          ayahs: 8,   juz: 30, rev: "مكية" },
  { n: 95,  ar: "التين",         en: "At-Tin",             ayahs: 8,   juz: 30, rev: "مكية" },
  { n: 96,  ar: "العلق",         en: "Al-'Alaq",           ayahs: 19,  juz: 30, rev: "مكية" },
  { n: 97,  ar: "القدر",         en: "Al-Qadr",            ayahs: 5,   juz: 30, rev: "مكية" },
  { n: 98,  ar: "البينة",        en: "Al-Bayyinah",        ayahs: 8,   juz: 30, rev: "مدنية" },
  { n: 99,  ar: "الزلزلة",       en: "Az-Zalzalah",        ayahs: 8,   juz: 30, rev: "مدنية" },
  { n: 100, ar: "العاديات",      en: "Al-'Adiyat",         ayahs: 11,  juz: 30, rev: "مكية" },
  { n: 101, ar: "القارعة",       en: "Al-Qari'ah",         ayahs: 11,  juz: 30, rev: "مكية" },
  { n: 102, ar: "التكاثر",       en: "At-Takathur",        ayahs: 8,   juz: 30, rev: "مكية" },
  { n: 103, ar: "العصر",         en: "Al-'Asr",            ayahs: 3,   juz: 30, rev: "مكية" },
  { n: 104, ar: "الهمزة",        en: "Al-Humazah",         ayahs: 9,   juz: 30, rev: "مكية" },
  { n: 105, ar: "الفيل",         en: "Al-Fil",             ayahs: 5,   juz: 30, rev: "مكية" },
  { n: 106, ar: "قريش",          en: "Quraysh",            ayahs: 4,   juz: 30, rev: "مكية" },
  { n: 107, ar: "الماعون",       en: "Al-Ma'un",           ayahs: 7,   juz: 30, rev: "مكية" },
  { n: 108, ar: "الكوثر",        en: "Al-Kawthar",         ayahs: 3,   juz: 30, rev: "مكية" },
  { n: 109, ar: "الكافرون",      en: "Al-Kafirun",         ayahs: 6,   juz: 30, rev: "مكية" },
  { n: 110, ar: "النصر",         en: "An-Nasr",            ayahs: 3,   juz: 30, rev: "مدنية" },
  { n: 111, ar: "المسد",         en: "Al-Masad",           ayahs: 5,   juz: 30, rev: "مكية" },
  { n: 112, ar: "الإخلاص",       en: "Al-Ikhlas",          ayahs: 4,   juz: 30, rev: "مكية" },
  { n: 113, ar: "الفلق",         en: "Al-Falaq",           ayahs: 5,   juz: 30, rev: "مكية" },
  { n: 114, ar: "الناس",         en: "An-Nas",             ayahs: 6,   juz: 30, rev: "مدنية" },
];

const TABS_VIEW = ["سورة", "جزء", "ترتيب النزول"] as const;

function toAr(n: number) {
  return String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[+d]);
}

interface Props {
  onSelect: (surah: typeof SURAHS[0]) => void;
}

export default function QuranBrowser({ onSelect }: Props) {
  const [tab, setTab] = useState<typeof TABS_VIEW[number]>("سورة");
  const [search, setSearch] = useState("");

  const filtered = SURAHS.filter(
    (s) =>
      s.ar.includes(search) ||
      s.en.toLowerCase().includes(search.toLowerCase()) ||
      String(s.n).includes(search)
  );

  const sorted = tab === "ترتيب النزول"
    ? [...filtered].sort((a, b) => {
        const makkiOrder = [96,68,73,74,1,111,81,87,92,89,93,94,103,100,108,102,107,109,105,113,114,112,53,80,97,91,85,95,106,101,75,104,77,50,90,86,54,38,7,72,36,25,35,19,20,56,26,27,28,17,10,11,12,15,6,37,31,34,39,40,41,42,43,44,45,46,51,52,88,18,16,71,14,21,23,32,52,67,69,70,78,79,82,84,30,29,83,2,8,3,33,60,4,99,57,47,13,55,76,65,98,59,24,22,63,58,49,66,61,62,64,48,5,9,110].indexOf(a.n);
        const bIdx = [96,68,73,74,1,111,81,87,92,89,93,94,103,100,108,102,107,109,105,113,114,112,53,80,97,91,85,95,106,101,75,104,77,50,90,86,54,38,7,72,36,25,35,19,20,56,26,27,28,17,10,11,12,15,6,37,31,34,39,40,41,42,43,44,45,46,51,52,88,18,16,71,14,21,23,32,52,67,69,70,78,79,82,84,30,29,83,2,8,3,33,60,4,99,57,47,13,55,76,65,98,59,24,22,63,58,49,66,61,62,64,48,5,9,110].indexOf(b.n);
        return makkiOrder - bIdx;
      })
    : filtered;

  const byJuz = tab === "جزء"
    ? sorted.reduce<Record<number, typeof SURAHS>>((acc, s) => {
        (acc[s.juz] = acc[s.juz] || []).push(s);
        return acc;
      }, {})
    : null;

  return (
    <div style={{ minHeight: "100vh", background: "#050C16" }}>
      {/* Header */}
      <div className="sticky top-0 z-20" style={{ background: "rgba(5,12,22,0.97)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(201,168,76,0.12)" }}>
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          <div className="flex-1">
            <h2 style={{ fontFamily: "'Amiri', serif", color: "#C9A84C", fontSize: 22, fontWeight: 700, lineHeight: 1 }}>
              القرآن الكريم
            </h2>
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#5A4A28", fontSize: 11, marginTop: 2 }}>
              ١١٤ سورة · ٦٢٣٦ آية
            </p>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#C9A84C" strokeWidth="1.6" strokeLinecap="round"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="#C9A84C" strokeWidth="1.6" fill="rgba(201,168,76,0.05)"/>
              <path d="M9 7h7M9 11h5" stroke="#C9A84C" strokeWidth="1.1" strokeLinecap="round" opacity="0.55"/>
            </svg>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 px-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,168,76,0.1)", height: 38 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.4)" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن سورة..."
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                fontFamily: "'Tajawal', sans-serif", color: "#C9A84C", fontSize: 13,
                direction: "rtl", textAlign: "right",
              }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ color: "rgba(201,168,76,0.4)", fontSize: 16, lineHeight: 1 }}>×</button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-4 pb-3 gap-2">
          {TABS_VIEW.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className="flex-1 py-1.5 rounded-lg text-center transition-all"
              style={{
                fontFamily: "'Tajawal', sans-serif",
                fontSize: 11,
                background: tab === t ? "rgba(201,168,76,0.12)" : "transparent",
                border: `1px solid ${tab === t ? "rgba(201,168,76,0.35)" : "rgba(201,168,76,0.07)"}`,
                color: tab === t ? "#C9A84C" : "#5A4A28",
                fontWeight: tab === t ? 700 : 400,
              }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Bismillah banner */}
      <div className="px-4 py-3 text-center" style={{ borderBottom: "1px solid rgba(201,168,76,0.06)" }}>
        <p style={{ fontFamily: "'Amiri', serif", color: "rgba(201,168,76,0.38)", fontSize: 18, letterSpacing: "0.02em" }}>
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </p>
      </div>

      {/* List */}
      <div className="pb-28">
        {byJuz
          ? Object.entries(byJuz).map(([juz, surahs]) => (
              <div key={juz}>
                <div className="px-4 py-2 flex items-center gap-2" style={{ background: "rgba(201,168,76,0.03)" }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontFamily: "'Amiri', serif", color: "#C9A84C", fontSize: 11 }}>{toAr(+juz)}</span>
                  </div>
                  <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#7A6848", fontSize: 12 }}>الجزء {toAr(+juz)}</span>
                </div>
                {surahs.map((s) => <SurahRow key={s.n} s={s} onSelect={onSelect} />)}
              </div>
            ))
          : sorted.map((s) => <SurahRow key={s.n} s={s} onSelect={onSelect} />)
        }
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p style={{ fontFamily: "'Tajawal', sans-serif", color: "#3A2E18", fontSize: 14 }}>لا توجد نتائج</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SurahRow({ s, onSelect }: { s: typeof SURAHS[0]; onSelect: (s: typeof SURAHS[0]) => void }) {
  return (
    <button
      onClick={() => onSelect(s)}
      className="w-full flex items-center gap-3 px-4 py-3 active:scale-[0.99] transition-transform"
      style={{
        borderBottom: "1px solid rgba(201,168,76,0.05)",
        background: "transparent",
        textAlign: "right",
      }}
    >
      {/* Number badge */}
      <div style={{
        width: 38, height: 38, flexShrink: 0,
        background: "rgba(201,168,76,0.07)",
        border: "1px solid rgba(201,168,76,0.14)",
        borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative",
      }}>
        <svg width="38" height="38" viewBox="0 0 38 38" style={{ position: "absolute", inset: 0 }}>
          <polygon points="19,3 35,13 35,25 19,35 3,25 3,13" fill="none" stroke="rgba(201,168,76,0.18)" strokeWidth="0.8"/>
        </svg>
        <span style={{ fontFamily: "'Amiri', serif", color: "#C9A84C", fontSize: 12, fontWeight: 600, position: "relative" }}>
          {toAr(s.n)}
        </span>
      </div>

      {/* Main text */}
      <div className="flex-1 min-w-0" style={{ direction: "rtl" }}>
        <div className="flex items-center gap-2">
          <span style={{ fontFamily: "'Amiri', serif", color: "#E8D5A8", fontSize: 17, fontWeight: 600 }}>{s.ar}</span>
          <span className="px-1.5 py-0.5 rounded-md" style={{
            fontFamily: "'Tajawal', sans-serif", fontSize: 9,
            background: s.rev === "مكية" ? "rgba(201,168,76,0.08)" : "rgba(27,107,58,0.1)",
            color: s.rev === "مكية" ? "rgba(201,168,76,0.7)" : "rgba(74,222,128,0.65)",
            border: `1px solid ${s.rev === "مكية" ? "rgba(201,168,76,0.15)" : "rgba(27,107,58,0.2)"}`,
          }}>{s.rev}</span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#5A4A28", fontSize: 11 }}>{s.en}</span>
          <span style={{ color: "rgba(201,168,76,0.2)", fontSize: 10 }}>·</span>
          <span style={{ fontFamily: "'Tajawal', sans-serif", color: "#4A3A20", fontSize: 11 }}>{toAr(s.ayahs)} آية</span>
        </div>
      </div>

      {/* Chevron */}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.25)" strokeWidth="2" strokeLinecap="round">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
    </button>
  );
}
