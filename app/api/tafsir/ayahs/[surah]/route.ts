import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ surah: string }> }
) {
  const { surah } = await params;
  const surahNumber = Number(surah);
  if (!Number.isInteger(surahNumber) || surahNumber < 1 || surahNumber > 114) {
    return NextResponse.json({ error: "invalid-surah" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.alquran.cloud/v1/surah/${surahNumber}`,
      { next: { revalidate: 60 * 60 * 24 * 7 } }
    );
    if (!res.ok) {
      return NextResponse.json({ error: "upstream-failed" }, { status: 502 });
    }
    const json = await res.json();
    return NextResponse.json(json, {
      headers: { "Cache-Control": "public, max-age=604800" },
    });
  } catch {
    return NextResponse.json({ error: "upstream-failed" }, { status: 502 });
  }
}
