// World-renowned Quran reciters (Qaris), mapped to their audio edition
// identifiers on the Islamic Network / AlQuran.cloud audio CDN.
// Per-ayah:  https://cdn.islamic.network/quran/audio/128/{id}/{globalAyahNumber}.mp3
// Per-surah: https://cdn.islamic.network/quran/audio-surah/128/{id}/{surahNumber}.mp3

export interface Reciter {
  id: string;
  name: string; // Arabic name
  title: string; // short Arabic description / location
  style?: string; // مرتل / مجود
}

export const RECITERS: Reciter[] = [
  { id: "ar.alafasy", name: "مشاري راشد العفاسي", title: "الكويت" },
  { id: "ar.abdurrahmaansudais", name: "عبدالرحمن السديس", title: "إمام الحرم المكي" },
  { id: "ar.saoodshuraym", name: "سعود الشريم", title: "إمام الحرم المكي" },
  { id: "ar.mahermuaiqly", name: "ماهر المعيقلي", title: "إمام الحرم المكي" },
  { id: "ar.abdulbasitmurattal", name: "عبدالباسط عبدالصمد", title: "مصر", style: "مرتل" },
  { id: "ar.husary", name: "محمود خليل الحصري", title: "مصر", style: "مرتل" },
  { id: "ar.husarymujawwad", name: "محمود خليل الحصري", title: "مصر", style: "مجوّد" },
  { id: "ar.minshawi", name: "محمد صديق المنشاوي", title: "مصر", style: "مرتل" },
  { id: "ar.minshawimujawwad", name: "محمد صديق المنشاوي", title: "مصر", style: "مجوّد" },
  { id: "ar.muhammadayyoub", name: "محمد أيوب", title: "إمام المسجد النبوي" },
  { id: "ar.muhammadjibreel", name: "محمد جبريل", title: "مصر" },
  { id: "ar.ahmedajamy", name: "أحمد بن علي العجمي", title: "السعودية" },
  { id: "ar.hudhaify", name: "علي بن عبدالرحمن الحذيفي", title: "إمام المسجد النبوي" },
  { id: "ar.hanirifai", name: "هاني الرفاعي", title: "سوريا" },
  { id: "ar.shaatree", name: "أبو بكر الشاطري", title: "اليمن" },
];

export const DEFAULT_RECITER_ID = RECITERS[0].id;

export function getReciter(id: string): Reciter {
  return RECITERS.find((r) => r.id === id) ?? RECITERS[0];
}

export function ayahAudioUrl(reciterId: string, globalAyahNumber: number) {
  return `https://cdn.islamic.network/quran/audio/128/${reciterId}/${globalAyahNumber}.mp3`;
}

export function surahAudioUrl(reciterId: string, surahNumber: number) {
  return `https://cdn.islamic.network/quran/audio-surah/128/${reciterId}/${surahNumber}.mp3`;
}

export const RECITER_STORAGE_KEY = "dq_reciter";
