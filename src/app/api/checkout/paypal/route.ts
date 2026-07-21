import { NextResponse } from "next/server";
import { createPaypalOrder } from "@/lib/paypal";

const AMOUNT = "15.00";

export async function POST() {
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    return NextResponse.json(
      { ok: false, reason: "paypal_not_configured" },
      { status: 503 }
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  try {
    const { approveUrl } = await createPaypalOrder({
      amount: AMOUNT,
      currency: "USD",
      returnUrl: `${siteUrl}/api/checkout/paypal/return`,
      cancelUrl: `${siteUrl}/products/kyron`,
    });

    return NextResponse.json({ ok: true, url: approveUrl });
  } catch (err) {
    console.error("PayPal order creation error:", err);
    return NextResponse.json(
      { ok: false, reason: "paypal_error" },
      { status: 502 }
    );
  }
}
