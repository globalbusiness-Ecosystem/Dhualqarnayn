import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ paymentId: string }> }
) {
  const { paymentId } = await params;
  const apiKey = process.env.PI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "PI_API_KEY not set" }, { status: 500 });
  }

  try {
    const res = await fetch(`https://api.minepi.com/v2/payments/${paymentId}`, {
      headers: { Authorization: `Key ${apiKey}` },
    });
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    if (!res.ok) console.error("Pi get payment failed", res.status, text);
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    console.error("Get payment error", err);
    return NextResponse.json({ error: "Get payment failed" }, { status: 500 });
  }
}
