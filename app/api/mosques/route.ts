import { NextRequest, NextResponse } from "next/server";

// Finds nearby mosques anywhere in the world using OpenStreetMap's Overpass
// API (no key required).
//
// The search expands outward (800m → 2.5km → 7km → 20km) and stops at the
// first radius that has enough results. This matters in dense cities: asking
// Overpass for "30 mosques within 8 km" returns 30 *arbitrary* ones (it limits
// by id, not by distance), so the truly nearest mosque could be missing.
// A small radius returns the complete set, which we then sort by distance.

export const maxDuration = 30;

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
  "https://overpass.kumi.systems/api/interpreter",
];

const RADII = [800, 2500, 7000, 20000];
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

async function queryOverpass(lat: number, lon: number, radius: number): Promise<OverpassElement[]> {
  const query = `[out:json][timeout:12];
(
  nwr["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${lat},${lon});
  nwr["building"="mosque"](around:${radius},${lat},${lon});
);
out center tags 250;`;

  let lastError: unknown = null;
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: query,
        signal: AbortSignal.timeout(12000),
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`status_${res.status}`);
      const json = (await res.json()) as { elements?: OverpassElement[] };
      return json.elements ?? [];
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError ?? new Error("unavailable");
}

export async function GET(req: NextRequest) {
  const lat = parseFloat(req.nextUrl.searchParams.get("lat") || "");
  const lon = parseFloat(req.nextUrl.searchParams.get("lon") || "");
  const maxRadius = Math.min(parseInt(req.nextUrl.searchParams.get("radius") || "20000", 10) || 20000, 20000);

  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    return NextResponse.json({ error: "missing_coordinates" }, { status: 400 });
  }

  let elements: OverpassElement[] = [];
  let lastError: unknown = null;
  let anySuccess = false;

  for (const radius of RADII.filter((r) => r <= maxRadius)) {
    try {
      elements = await queryOverpass(lat, lon, radius);
      anySuccess = true;
      if (elements.length >= ENOUGH) break;
    } catch (err) {
      lastError = err;
      // A failed radius shouldn't kill the whole search if an earlier one worked.
      if (anySuccess) break;
    }
  }

  if (!anySuccess) {
    return NextResponse.json({ error: "unavailable", detail: String(lastError) }, { status: 502 });
  }

  const seen = new Set<string>();
  const mosques = elements
    .map((el) => {
      const key = `${el.type}/${el.id}`;
      if (seen.has(key)) return null;
      seen.add(key);
      const mlat = el.lat ?? el.center?.lat;
      const mlon = el.lon ?? el.center?.lon;
      if (mlat === undefined || mlon === undefined) return null;
      const tags = el.tags || {};
      const name = tags["name:ar"] || tags.name || tags["name:en"] || null;
      const addressParts = [
        tags["addr:street"],
        tags["addr:housenumber"],
        tags["addr:suburb"],
        tags["addr:city"],
      ].filter(Boolean);
      const km = haversineKm(lat, lon, mlat, mlon);
      return {
        id: key,
        lat: mlat,
        lon: mlon,
        name,
        address: addressParts.length ? addressParts.join(", ") : null,
        distanceKm: Math.round(km * 10) / 10,
        distanceM: Math.round(km * 1000),
      };
    })
    .filter((m): m is NonNullable<typeof m> => m !== null)
    .sort((a, b) => a.distanceM - b.distanceM)
    .slice(0, RESULT_LIMIT);

  return NextResponse.json({ mosques });
}
