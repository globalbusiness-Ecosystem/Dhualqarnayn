// Shared prayer-time schedule used by the Hero prayer strip and the Adhan
// reminder system, so both read from exactly the same source of truth.

export interface Prayer {
  name: string;
  nameAr: string;
  time: string; // "HH:MM" 24h
}

export const PRAYERS: Prayer[] = [
  { name: "fajr", nameAr: "الفجر", time: "04:32" },
  { name: "sunrise", nameAr: "الشروق", time: "06:08" },
  { name: "dhuhr", nameAr: "الظهر", time: "12:15" },
  { name: "asr", nameAr: "العصر", time: "15:42" },
  { name: "maghrib", nameAr: "المغرب", time: "18:28" },
  { name: "isha", nameAr: "العشاء", time: "19:58" },
];

// ---- Live timings (Aladhan API) -------------------------------------------
// The PRAYERS objects are updated IN PLACE so every existing consumer
// (HeroSection, PrayerTimesScreen, adhan-context) keeps working unchanged.
// The values above are only an offline fallback until real timings load.

const ALADHAN_KEYS: Record<string, string> = {
  fajr: "Fajr",
  sunrise: "Sunrise",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
};

// Calculation method: 5 = Egyptian General Authority of Survey.
// Other common ones: 4 = Umm al-Qura, 3 = MWL, 2 = ISNA, 1 = Karachi.
export const PRAYER_METHOD = 5;
const FALLBACK_COORDS = { lat: 30.0444, lng: 31.2357 }; // Cairo
const CACHE_KEY = "dq_prayer_cache_v1";
const COORDS_KEY = "dq_prayer_coords_v1";

export type PrayerStatus = "fallback" | "loading" | "live" | "cached";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function applyTimings(timings: Record<string, string>) {
  for (const p of PRAYERS) {
    const raw = timings[ALADHAN_KEYS[p.name]];
    const m = raw && /(\d{1,2}):(\d{2})/.exec(raw);
    if (m) p.time = `${pad(+m[1])}:${m[2]}`;
  }
}

function getCoords(): Promise<{ lat: number; lng: number; precise: boolean }> {
  return new Promise((resolve) => {
    const saved = (() => {
      try {
        return JSON.parse(localStorage.getItem(COORDS_KEY) || "null");
      } catch {
        return null;
      }
    })();
    const fallback = saved
      ? { ...saved, precise: true }
      : { ...FALLBACK_COORDS, precise: false };
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      return resolve(fallback);
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        try {
          localStorage.setItem(COORDS_KEY, JSON.stringify(c));
        } catch {}
        resolve({ ...c, precise: true });
      },
      () => resolve(fallback),
      { timeout: 8000, maximumAge: 6 * 60 * 60 * 1000 }
    );
  });
}

/** Fetch today's timings for the user's location and apply them. */
export async function loadPrayerTimes(): Promise<PrayerStatus> {
  const { lat, lng } = await getCoords();
  const d = new Date();
  const dateKey = `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;
  const cacheId = `${dateKey}|${lat.toFixed(2)}|${lng.toFixed(2)}|${PRAYER_METHOD}`;

  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
    if (cached?.id === cacheId && cached.timings) {
      applyTimings(cached.timings);
      return "cached";
    }
  } catch {}

  const url = `https://api.aladhan.com/v1/timings/${dateKey}?latitude=${lat}&longitude=${lng}&method=${PRAYER_METHOD}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("aladhan-failed");
  const json = await res.json();
  const timings = json?.data?.timings;
  if (!timings) throw new Error("aladhan-bad-response");
  applyTimings(timings);
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ id: cacheId, timings }));
  } catch {}
  return "live";
}

/** Prayers an adhan reminder makes sense for (sunrise has no adhan). */
export const ADHAN_PRAYERS = PRAYERS.filter((p) => p.name !== "sunrise");

export function toArDigits(s: string | number) {
  return String(s).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[+d]);
}

export function getCurrentPrayerIdx(): number {
  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();
  let idx = 0;
  for (let i = 0; i < PRAYERS.length; i++) {
    const [h, m] = PRAYERS[i].time.split(":").map(Number);
    if (cur >= h * 60 + m) idx = i;
  }
  return idx;
}

export function getNextPrayer(idx: number): { nameAr: string; countdown: string } {
  const nextIdx = (idx + 1) % PRAYERS.length;
  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();
  const [h, m] = PRAYERS[nextIdx].time.split(":").map(Number);
  let diff = h * 60 + m - cur;
  if (diff < 0) diff += 24 * 60;
  const hrs = Math.floor(diff / 60);
  const mins = diff % 60;
  return {
    nameAr: PRAYERS[nextIdx].nameAr,
    countdown: hrs > 0 ? `${toArDigits(hrs)}س ${toArDigits(mins)}د` : `${toArDigits(mins)} دقيقة`,
  };
}
