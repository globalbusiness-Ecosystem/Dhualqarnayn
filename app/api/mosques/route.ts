import { NextRequest, NextResponse } from "next/server";
import { searchMosques } from "@/lib/mosques";

// Server-side mosque search (OpenStreetMap / Overpass). If this fails (public
// Overpass servers sometimes block cloud IPs) the client retries directly from
// the user's own connection — see components/islamic/MosqueFinder.tsx.

export const maxDuration = 30;

export async function GET(req: NextRequest) {
  const lat = parseFloat(req.nextUrl.searchParams.get("lat") || "");
  const lon = parseFloat(req.nextUrl.searchParams.get("lon") || "");

  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    return NextResponse.json({ error: "missing_coordinates" }, { status: 400 });
  }

  try {
    const mosques = await searchMosques(lat, lon);
    return NextResponse.json({ mosques });
  } catch (err) {
    return NextResponse.json({ error: "unavailable", detail: String(err) }, { status: 502 });
  }
}
