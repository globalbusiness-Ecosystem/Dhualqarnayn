import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ imam: string; surah: string; ayah: string }> }
) {
  const { imam, surah, ayah } = await params;
  const imamId = Number(imam);
  const surahNumber = Number(surah);
  const ayahNumber = Number(ayah);
  if (
    !Number.isInteger(imamId) ||
    !Number.isInteger(surahNumber) ||
    !Number.isInteger(ayahNumber) ||
    surahNumber < 1 ||
    surahNumber > 114 ||
    ayahNumber < 1
  ) {
    return NextResponse.json({ error: "invalid-params" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.quran-tafseer.com/tafseer/${imamId}/${surahNumber}/${ayahNumber}`,
      { next: { revalidate: 60 * 60 * 24 * 30 } }
    );
    if (!res.ok) {
      return NextResponse.json({ error: "upstream-failed" }, { status: 502 });
    }
    const json = await res.json();
    return NextResponse.json(json, {
      headers: { "Cache-Control": "public, max-age=2592000" },
    });
  } catch {
    return NextResponse.json({ error: "upstream-failed" }, { status: 502 });
  }
}
