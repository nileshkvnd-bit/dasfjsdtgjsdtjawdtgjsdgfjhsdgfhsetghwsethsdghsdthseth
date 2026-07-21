import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase-admin";
import { generateLicenseKey } from "@/lib/license";

// NOTE: Stripe client is created inside the handler, not at module
// scope. Creating it at module scope runs during Next.js's build-time
// page data collection, which crashes the build if STRIPE_SECRET_KEY
// isn't set yet (e.g. before Stripe is configured).
function getStripeClient() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

// Stripe sends events here after checkout completes. We verify the
// signature (proves it really came from Stripe), then on
// "checkout.session.completed" we generate a license key and attach
// it to the order + the user who paid (matched via email).
export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Stripe is not configured yet" },
      { status: 503 }
    );
  }

  const stripe = getStripeClient();
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${err}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_details?.email;
    const amountTotal = session.amount_total ?? 0;

    const admin = createAdminClient();

    // Find a profile matching the paying email, if they're a registered user.
    let userId: string | null = null;
    if (email) {
      const { data: profile } = await admin
        .from("profiles")
        .select("id")
        .eq("email", email)
        .single();
      userId = profile?.id ?? null;
    }

    const { data: order } = await admin
      .from("orders")
      .insert({
        user_id: userId,
        provider: "stripe",
        provider_ref: session.id,
        amount_cents: amountTotal,
        currency: session.currency ?? "usd",
        status: "paid",
      })
      .select()
      .single();

    // Generate a unique key, retrying on the rare collision.
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

    await admin.from("licenses").insert({
      license_key: key,
      user_id: userId,
      order_id: order?.id ?? null,
      status: "unredeemed",
    });

    // NOTE: if userId is null (guest checkout / email not registered
    // yet), the key still gets created — the user can claim it later
    // via /api/redeem once they sign up with the same email, or you
    // email it to them manually. Wiring actual email delivery (e.g.
    // Resend) is a good next step once this core flow is confirmed
    // working.
  }

  return NextResponse.json({ received: true });
}
