import { NextResponse } from "next/server";
import { createNowPaymentsInvoice } from "@/lib/nowpayments";
import { createAdminClient } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase-server";

const AMOUNT = 15;

// Crypto payments confirm asynchronously via IPN webhook (the user
// might take minutes/hours to actually send funds), so unlike Stripe
// and PayPal we create a `pending` order up front here and let the
// webhook flip it to `paid` + generate the key once NOWPayments
// confirms.
export async function POST() {
  if (!process.env.NOWPAYMENTS_API_KEY) {
    return NextResponse.json(
      { ok: false, reason: "crypto_not_configured" },
      { status: 503 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, reason: "not_logged_in" }, { status: 401 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const admin = createAdminClient();

  const { data: order, error: orderError } = await admin
    .from("orders")
    .insert({
      user_id: user.id,
      provider: "crypto",
      amount_cents: AMOUNT * 100,
      currency: "usd",
      status: "pending",
    })
    .select()
    .single();

  if (orderError || !order) {
    return NextResponse.json({ ok: false, reason: "order_create_failed" }, { status: 500 });
  }

  try {
    const invoice = await createNowPaymentsInvoice({
      priceAmount: AMOUNT,
      priceCurrency: "usd",
      orderId: order.id,
      successUrl: `${siteUrl}/dashboard?purchase=pending`,
      cancelUrl: `${siteUrl}/products/kyron`,
    });

    await admin
      .from("orders")
      .update({ provider_ref: invoice.id })
      .eq("id", order.id);

    return NextResponse.json({ ok: true, url: invoice.invoice_url });
  } catch (err) {
    console.error("NOWPayments invoice error:", err);
    return NextResponse.json({ ok: false, reason: "crypto_error" }, { status: 502 });
  }
}
