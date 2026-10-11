import { NextResponse } from "next/server";

// Proxies the public tafseer directory server-side so the browser never has
// to make a cross-origin request directly (avoids CORS failures) and so the
// result can be cached briefly on the edge.
export async function GET() {
  try {
    const res = await fetch("https://api.quran-tafseer.com/tafseer", {
      next: { revalidate: 60 * 60 * 24 },
    });
    if (!res.ok) {
      return NextResponse.json({ error: "upstream-failed" }, { status: 502 });
    }
    const raw = await res.json();
    return NextResponse.json(raw, {
      headers: { "Cache-Control": "public, max-age=86400" },
    });
  } catch {
    return NextResponse.json({ error: "upstream-failed" }, { status: 502 });
  }
}
