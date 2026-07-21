import { NextResponse } from "next/server";
import Stripe from "stripe";

const PRICE_CENTS = 1500; // $15.00

export async function POST() {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { ok: false, reason: "stripe_not_configured" },
      { status: 503 }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: "Kyron — Lifetime License" },
          unit_amount: PRICE_CENTS,
        },
        quantity: 1,
      },
    ],
    success_url: `${siteUrl}/dashboard?purchase=success`,
    cancel_url: `${siteUrl}/products/kyron`,
  });

  return NextResponse.json({ ok: true, url: session.url });
}
