import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ paymentId: string }> }
) {
  const { paymentId } = await params;
  const apiKey = process.env.PI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "PI_API_KEY not set" }, { status: 500 });
  }

  try {
    const { txid } = await req.json();
    const res = await fetch(`https://api.testnet.minepi.com/v2/payments/${paymentId}/complete`, {
      method: "POST",
      headers: {
        Authorization: `Key ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ txid }),
    });

    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    return NextResponse.json(data, { status: res.ok ? 200 : res.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
