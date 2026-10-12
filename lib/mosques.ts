// Mosque search over OpenStreetMap (Overpass API). Shared by the server route
// (app/api/mosques) AND by the browser as a fallback: public Overpass servers
// often rate-limit or block cloud-provider IPs (like Vercel's), while a
// user's own phone connection is rarely blocked. Overpass sends CORS headers,
// so the browser can call it directly when the server route fails.

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

const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.openstreetmap.fr/api/interpreter",
];

// Search expands outward and stops at the first radius with enough results.
// (Overpass limits by id, not distance, so a big radius in a dense city would
// return arbitrary mosques instead of the nearest ones.)
const RADII = [800, 2500, 7000, 20000, 50000];
const ENOUGH = 5;
const RESULT_LIMIT = 30;

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

function timeoutSignal(ms: number): { signal: AbortSignal; clear: () => void } {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  return { signal: ctrl.signal, clear: () => clearTimeout(t) };
}

async function queryOverpass(lat: number, lon: number, radius: number): Promise<OverpassElement[]> {
  const query = `[out:json][timeout:15];
(
  nwr["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${lat},${lon});
  nwr["building"="mosque"](around:${radius},${lat},${lon});
);
out center tags 250;`;

  const headers: Record<string, string> = {
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "application/json",
  };
  // Browsers forbid setting User-Agent; servers should identify themselves
  // (Overpass operators ask for it and may block anonymous default agents).
  if (typeof window === "undefined") {
    headers["User-Agent"] = "Dhualqarnayn/1.0 (https://dhualqarnayn.vercel.app)";
  }

  let lastError: unknown = null;
  for (const endpoint of OVERPASS_ENDPOINTS) {
    const t = timeoutSignal(14000);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers,
        body: "data=" + encodeURIComponent(query),
        signal: t.signal,
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`${new URL(endpoint).host}:${res.status}`);
      const json = (await res.json()) as { elements?: OverpassElement[] };
      return json.elements ?? [];
    } catch (err) {
      lastError = err;
    } finally {
      t.clear();
    }
  }
  throw lastError ?? new Error("unavailable");
}

export async function searchMosques(lat: number, lon: number, maxRadius = 50000): Promise<Mosque[]> {
  let elements: OverpassElement[] = [];
  let anySuccess = false;
  let lastError: unknown = null;

  for (const radius of RADII.filter((r) => r <= maxRadius)) {
    try {
      elements = await queryOverpass(lat, lon, radius);
      anySuccess = true;
      if (elements.length >= ENOUGH) break;
    } catch (err) {
      lastError = err;
      if (anySuccess) break; // keep what an earlier radius found
    }
  }
  if (!anySuccess) throw lastError ?? new Error("unavailable");

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
