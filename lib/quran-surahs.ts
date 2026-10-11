/**
 * Shared metadata for all 114 surahs (name, ayah count, juz, revelation place).
 * Used by the surah list screen AND by the global audio player so it can move
 * to the next surah on its own — without needing any screen to be open — by
 * computing each surah's global ayah-number range locally instead of asking
 * a server for it.
 */
export interface SurahMeta {
  n: number;
  ar: string;
  en: string;
  ayahs: number;
  juz: number;
  rev: string;
}

export const SURAHS: SurahMeta[] = [
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

export const TOTAL_SURAHS = SURAHS.length;

export function getSurahByNumber(n: number): SurahMeta | null {
  return SURAHS.find((s) => s.n === n) ?? null;
}

/** The global ayah-number range (1..6236) covered by one surah. */
export function getAyahGlobalRange(n: number): { start: number; end: number } | null {
  let start = 1;
  for (const s of SURAHS) {
    if (s.n === n) return { start, end: start + s.ayahs - 1 };
    start += s.ayahs;
  }
  return null;
}

/** Builds the {number, numberInSurah} queue the audio player needs, with no network call. */
export function buildAyahQueue(n: number): { number: number; numberInSurah: number }[] {
  const range = getAyahGlobalRange(n);
  if (!range) return [];
  const queue: { number: number; numberInSurah: number }[] = [];
  for (let i = 0; i <= range.end - range.start; i++) {
    queue.push({ number: range.start + i, numberInSurah: i + 1 });
  }
  return queue;
}
