// Mosque search over OpenStreetMap (Overpass API). Shared by the server route
// (app/api/mosques) AND by the browser: public Overpass servers sometimes
// rate-limit, hang, or block cloud-provider IPs (like Vercel's), while a
// user's own connection usually works. The app asks both at once and takes
// whichever answers first (see MosqueFinder). Overpass sends CORS headers, so
// the browser can call it directly.

export interface Mosque {
  id: string;
  lat: number;
  lon: number;
  name: string | null;
  address: string | null;
  distanceKm: number;
  distanceM: number;
}

interface OverpassElement {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

// Two servers are raced at a time; the second pair is only used if both fail.
const ENDPOINT_GROUPS = [
  ["https://overpass-api.de/api/interpreter", "https://overpass.private.coffee/api/interpreter"],
  ["https://overpass.kumi.systems/api/interpreter", "https://overpass.openstreetmap.fr/api/interpreter"],
];

// Search expands outward and stops at the first radius with enough results.
// (Overpass limits by id, not distance, so a big radius in a dense city would
// return arbitrary mosques instead of the nearest ones.)
const RADII = [1500, 6000, 25000];
const ENOUGH = 5;
const RESULT_LIMIT = 30;
const REQUEST_TIMEOUT = 12000;

/** Resolves with the first promise that succeeds; rejects only if all fail. */
export function firstSuccess<T>(promises: Promise<T>[]): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    let failed = 0;
    let lastError: unknown = new Error("no-promises");
    if (promises.length === 0) reject(lastError);
    promises.forEach((p) =>
      p.then(resolve, (err) => {
        lastError = err;
        if (++failed === promises.length) reject(lastError);
      })
    );
  });
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

// Shared per-search diagnostics: why servers failed, and partial answers.
interface Trace {
  reasons: string[];
  partial: OverpassElement[][];
}

async function fetchOne(endpoint: string, query: string, timeoutMs: number, trace: Trace): Promise<OverpassElement[]> {
  const host = new URL(endpoint).host;
  const headers: Record<string, string> = {
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "application/json",
  };
  // Browsers forbid setting User-Agent; servers should identify themselves.
  if (typeof window === "undefined") {
    headers["User-Agent"] = "Dhualqarnayn/1.0 (https://dhualqarnayn.vercel.app)";
  }
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      body: "data=" + encodeURIComponent(query),
      signal: ctrl.signal,
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`${host} HTTP ${res.status}`);
    const json = (await res.json()) as { elements?: OverpassElement[]; remark?: string };
    const elements = json.elements ?? [];
    // Overloaded servers answer 200 with a "runtime error" remark and PARTIAL
    // results. Try other servers first, but keep the partial list as a last resort.
    if (json.remark && /runtime error|timed out|out of memory/i.test(json.remark)) {
      if (elements.length) trace.partial.push(elements);
      throw new Error(`${host} overloaded`);
    }
    return elements;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    trace.reasons.push(/abort/i.test(msg) ? `${host} timeout` : msg);
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

async function queryOverpass(
  lat: number,
  lon: number,
  radius: number,
  deadline: number,
  trace: Trace
): Promise<OverpassElement[]> {
  const query = `[out:json][timeout:10];
(
  nwr["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${lat},${lon});
  nwr["building"="mosque"](around:${radius},${lat},${lon});
  nwr["amenity"="mosque"](around:${radius},${lat},${lon});
  nwr["amenity"="place_of_worship"]["name"~"مسجد|جامع|masjid|mosque",i](around:${radius},${lat},${lon});
);
out center tags 250;`;

  let lastError: unknown = new Error("unavailable");
  for (const group of ENDPOINT_GROUPS) {
    const remaining = deadline - Date.now();
    if (remaining < 1500) break;
    const timeout = Math.min(REQUEST_TIMEOUT, remaining);
    try {
      return await firstSuccess(group.map((e) => fetchOne(e, query, timeout, trace)));
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}

export async function searchMosques(
  lat: number,
  lon: number,
  opts: { deadlineMs?: number; maxRadius?: number } = {}
): Promise<Mosque[]> {
  const deadline = Date.now() + (opts.deadlineMs ?? 20000);
  const maxRadius = opts.maxRadius ?? 25000;
  const trace: Trace = { reasons: [], partial: [] };
  let elements: OverpassElement[] = [];
  let anySuccess = false;

  for (const radius of RADII.filter((r) => r <= maxRadius)) {
    if (Date.now() > deadline - 1500) break;
    try {
      elements = await queryOverpass(lat, lon, radius, deadline, trace);
      anySuccess = true;
      if (elements.length >= ENOUGH) break;
    } catch {
      if (anySuccess) break; // keep what an earlier radius found
    }
  }

  if (!anySuccess) {
    // No server gave a complete answer — better a partial list than nothing.
    const best = trace.partial.sort((a, b) => b.length - a.length)[0];
    if (!best) {
      const why = Array.from(new Set(trace.reasons)).slice(0, 4).join(" | ");
      throw new Error(why || "timeout");
    }
    elements = best;
  }

  const seen = new Set<string>();
  return elements
    .map((el) => {
      const key = `${el.type}/${el.id}`;
      if (seen.has(key)) return null;
      seen.add(key);
      const mlat = el.lat ?? el.center?.lat;
      const mlon = el.lon ?? el.center?.lon;
      if (mlat === undefined || mlon === undefined) return null;
      const tags = el.tags || {};
      const name = tags["name:ar"] || tags.name || tags["name:en"] || null;
      const addr = [tags["addr:street"], tags["addr:housenumber"], tags["addr:suburb"], tags["addr:city"]].filter(Boolean);
      const km = haversineKm(lat, lon, mlat, mlon);
      return {
        id: key,
        lat: mlat,
        lon: mlon,
        name,
        address: addr.length ? addr.join(", ") : null,
        distanceKm: Math.round(km * 10) / 10,
        distanceM: Math.round(km * 1000),
      } as Mosque;
    })
    .filter((m): m is Mosque => m !== null)
    .sort((a, b) => a.distanceM - b.distanceM)
    .slice(0, RESULT_LIMIT);
}
