import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { pi_auth_token } = await req.json();
    const piRes = await fetch("https://api.mainnet.minepi.com/v2/me", {
      headers: { Authorization: `Bearer ${pi_auth_token}` },
    });
    if (!piRes.ok) {
      return NextResponse.json({ error: "Invalid Pi token" }, { status: 401 });
    }
    const piUser = await piRes.json();
    return NextResponse.json({
      id: piUser.uid,
      username: piUser.username,
      credits_balance: 0,
      terms_accepted: true,
      app_id: process.env.NEXT_PUBLIC_PI_APP_ID || "dhualqarnayn",
    });
  } catch (err) {
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
