// Muezzin voice options for the Adhan (call to prayer) reminder.
// These are distinct from the Quran recitation reciters — an adhan is a
// specific call, not a Quran recitation, so it uses its own small voice set.

export interface AdhanVoice {
  id: string;
  name: string;
  title: string;
  url: string;
}

export const ADHAN_VOICES: AdhanVoice[] = [
  {
    id: "makkah",
    name: "أذان الحرم المكي",
    title: "بصوت مؤذن المسجد الحرام",
    url: "https://www.islamcan.com/audio/adhan/azan1.mp3",
  },
  {
    id: "madinah",
    name: "أذان المسجد النبوي",
    title: "بصوت مؤذن المسجد النبوي",
    url: "https://www.islamcan.com/audio/adhan/azan2.mp3",
  },
  {
    id: "egypt",
    name: "أذان مصري",
    title: "الطراز المصري التقليدي",
    url: "https://www.islamcan.com/audio/adhan/azan3.mp3",
  },
  {
    id: "turkish",
    name: "أذان تركي",
    title: "الطراز التركي العثماني",
    url: "https://www.islamcan.com/audio/adhan/azan5.mp3",
  },
  {
    id: "classic",
    name: "أذان تقليدي",
    title: "نمط كلاسيكي هادئ",
    url: "https://www.islamcan.com/audio/adhan/azan7.mp3",
  },
];

export const DEFAULT_ADHAN_VOICE_ID = ADHAN_VOICES[0].id;

export function getAdhanVoice(id: string): AdhanVoice {
  return ADHAN_VOICES.find((v) => v.id === id) ?? ADHAN_VOICES[0];
}
