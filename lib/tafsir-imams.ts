// Full, authentic ayah-by-ayah tafsir (exegesis) from the classical imams/scholars —
// Ibn Kathir, al-Tabari, al-Qurtubi, al-Jalalayn, al-Sa'di, and others — covering
// every ayah of all 114 surahs. The text is fetched through this app's own
// server routes (app/api/tafsir/**), which proxy the public Quran tafsir
// service, so the browser never hits a cross-origin request directly and the
// wording shown is always the scholars' real, unaltered commentary.

export interface TafsirImam {
  id: number;
  name: string;
  bookName: string;
  author: string;
}

export interface AyahText {
  numberInSurah: number;
  text: string;
}

// A few well-known scholars to prefer at the top of the picker when present
// in the live list (the live list itself is the source of truth — this only
// affects display order, never which entries are shown).
const PREFERRED_ORDER = [
  "ابن كثير",
  "الطبري",
  "القرطبي",
  "السعدي",
  "الجلالين",
  "البغوي",
  "الميسر",
  "الوسيط",
  "الشعراوي",
];

function sortImams(list: TafsirImam[]): TafsirImam[] {
  return [...list].sort((a, b) => {
    const ai = PREFERRED_ORDER.findIndex((p) => a.name.includes(p));
    const bi = PREFERRED_ORDER.findIndex((p) => b.name.includes(p));
    const av = ai === -1 ? 999 : ai;
    const bv = bi === -1 ? 999 : bi;
    if (av !== bv) return av - bv;
    return a.name.localeCompare(b.name, "ar");
  });
}

let imamsCache: TafsirImam[] | null = null;
let imamsPromise: Promise<TafsirImam[]> | null = null;

export async function getImams(): Promise<TafsirImam[]> {
  if (imamsCache) return imamsCache;
  if (imamsPromise) return imamsPromise;

  imamsPromise = (async () => {
    const res = await fetch("/api/tafsir/imams");
    if (!res.ok) throw new Error("failed-to-load-imams");
    const raw = await res.json();
    const list: TafsirImam[] = (Array.isArray(raw) ? raw : [])
      .filter((t: any) => !t.language || t.language === "ar")
      .map((t: any) => ({
        id: t.id,
        name: t.name as string,
        bookName: (t.book_name as string) || (t.name as string),
        author: (t.author as string) || "",
      }));
    const sorted = sortImams(list);
    imamsCache = sorted;
    return sorted;
  })();

  try {
    return await imamsPromise;
  } catch (e) {
    imamsPromise = null;
    throw e;
  }
}

const ayahsCache = new Map<number, AyahText[]>();
const ayahsInFlight = new Map<number, Promise<AyahText[]>>();

export async function getSurahAyahs(surahNumber: number): Promise<AyahText[]> {
  const cached = ayahsCache.get(surahNumber);
  if (cached) return cached;
  const inFlight = ayahsInFlight.get(surahNumber);
  if (inFlight) return inFlight;

  const promise = (async () => {
    const res = await fetch(`/api/tafsir/ayahs/${surahNumber}`);
    if (!res.ok) throw new Error("failed-to-load-ayahs");
    const json = await res.json();
    const ayahs: AyahText[] = (json?.data?.ayahs || []).map((a: any) => ({
      numberInSurah: a.numberInSurah,
      text: a.text,
    }));
    ayahsCache.set(surahNumber, ayahs);
    return ayahs;
  })();

  ayahsInFlight.set(surahNumber, promise);
  try {
    return await promise;
  } finally {
    ayahsInFlight.delete(surahNumber);
  }
}

const tafsirTextCache = new Map<string, string>();
const tafsirInFlight = new Map<string, Promise<string>>();

export async function getAyahTafsir(
  imamId: number,
  surahNumber: number,
  ayahNumber: number
): Promise<string> {
  const key = `${imamId}:${surahNumber}:${ayahNumber}`;
  const cached = tafsirTextCache.get(key);
  if (cached) return cached;
  const inFlight = tafsirInFlight.get(key);
  if (inFlight) return inFlight;

  const promise = (async () => {
    const res = await fetch(
      `/api/tafsir/text/${imamId}/${surahNumber}/${ayahNumber}`
    );
    if (!res.ok) throw new Error("failed-to-load-tafsir");
    const json = await res.json();
    const text = (json?.text as string) || "";
    if (!text) throw new Error("empty-tafsir");
    tafsirTextCache.set(key, text);
    return text;
  })();

  tafsirInFlight.set(key, promise);
  try {
    return await promise;
  } finally {
    tafsirInFlight.delete(key);
  }
}
