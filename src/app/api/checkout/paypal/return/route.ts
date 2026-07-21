import { NextRequest, NextResponse } from "next/server";
import { capturePaypalOrder } from "@/lib/paypal";
import { createAdminClient } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase-server";
import { generateLicenseKey } from "@/lib/license";

// PayPal redirects the browser here after the user approves payment,
// with ?token=<orderId> in the query string. We capture the order
// (actually charges it), then generate a license key exactly like
// the Stripe webhook does.
export async function GET(req: NextRequest) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("token");

  console.log("[paypal/return] start, orderId:", orderId);

  if (!orderId) {
    console.log("[paypal/return] missing token param");
    return NextResponse.redirect(`${siteUrl}/products/kyron?error=missing_order`);
  }

  try {
    const capture = await capturePaypalOrder(orderId);
    console.log("[paypal/return] capture status:", capture.status);

    if (capture.status !== "COMPLETED") {
      console.log("[paypal/return] not completed, full response:", JSON.stringify(capture));
      return NextResponse.redirect(
        `${siteUrl}/products/kyron?error=payment_incomplete`
      );
    }

    const amountValue =
      capture.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value;
    const amountCents = amountValue ? Math.round(parseFloat(amountValue) * 100) : 0;
    console.log("[paypal/return] amount captured:", amountValue);

    const admin = createAdminClient();

    // Attach to the currently logged-in user, if any.
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log("[paypal/return] user from session:", user?.id ?? "none");

    const { data: order, error: orderErr } = await admin
      .from("orders")
      .insert({
        user_id: user?.id ?? null,
        provider: "paypal",
        provider_ref: orderId,
        amount_cents: amountCents,
        currency: "usd",
        status: "paid",
      })
      .select()
      .single();

    if (orderErr) {
      console.log("[paypal/return] order insert error:", JSON.stringify(orderErr));
    }
    console.log("[paypal/return] order created:", order?.id);

    let key = generateLicenseKey();
    for (let i = 0; i < 5; i++) {
      const { data: exists } = await admin
        .from("licenses")
        .select("id")
        .eq("license_key", key)
        .single();
      if (!exists) break;
      key = generateLicenseKey();
    }

    const { error: licenseErr } = await admin.from("licenses").insert({
      license_key: key,
      user_id: user?.id ?? null,
      order_id: order?.id ?? null,
      status: "unredeemed",
    });

    if (licenseErr) {
      console.log("[paypal/return] license insert error:", JSON.stringify(licenseErr));
    } else {
      console.log("[paypal/return] license created:", key);
    }

    return NextResponse.redirect(`${siteUrl}/dashboard?purchase=success`);
  } catch (err) {
    console.error("PayPal capture error:", err);
    return NextResponse.redirect(`${siteUrl}/products/kyron?error=capture_failed`);
  }
}
