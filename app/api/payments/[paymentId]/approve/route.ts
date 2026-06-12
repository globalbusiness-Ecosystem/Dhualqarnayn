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
    const res = await fetch(`https://api.mainnet.minepi.com/v2/payments/${paymentId}/approve`, {
      method: "POST",
      headers: {
        Authorization: `Key ${apiKey}`,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: "Approve failed", detail: err.message }, { status: 500 });
  }
}
