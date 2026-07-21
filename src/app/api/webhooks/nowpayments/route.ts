import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { createAdminClient } from "@/lib/supabase-admin";
import { generateLicenseKey } from "@/lib/license";

// NOWPayments calls this whenever a payment's status changes. We
// verify the signature (proves it's really from NOWPayments), and
// once status is "finished" (funds fully confirmed on-chain), we
// mark our matching `orders` row paid and generate a license key —
// same pattern as the Stripe webhook.
//
// Docs: https://documenter.getpostman.com/view/7907941/S1a32n38#ipn

function verifyIpnSignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;
  const secret = process.env.NOWPAYMENTS_IPN_SECRET!;

  // NOWPayments signs a JSON-sorted-key version of the body.
  const parsed = JSON.parse(rawBody);
  const sorted = JSON.stringify(sortKeys(parsed));

  const expected = createHmac("sha512", secret).update(sorted).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sortKeys(obj: any): any {
  if (Array.isArray(obj)) return obj.map(sortKeys);
  if (obj && typeof obj === "object") {
    return Object.keys(obj)
      .sort()
      .reduce((acc, key) => {
        acc[key] = sortKeys(obj[key]);
        return acc;
      }, {} as Record<string, unknown>);
  }
  return obj;
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-nowpayments-sig");

  if (!process.env.NOWPAYMENTS_IPN_SECRET) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  if (!verifyIpnSignature(rawBody, signature)) {
    return NextResponse.json({ error: "bad_signature" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const orderId = payload.order_id as string | undefined;
  const status = payload.payment_status as string | undefined;

  if (!orderId) {
    return NextResponse.json({ error: "missing_order_id" }, { status: 400 });
  }

  // Only "finished" means funds are confirmed. Earlier states
  // (waiting, confirming, partially_paid) shouldn't issue a key yet.
  if (status !== "finished") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const admin = createAdminClient();

  const { data: order } = await admin
    .from("orders")
    .select("id, user_id, status")
    .eq("id", orderId)
    .single();

  if (!order) {
    return NextResponse.json({ error: "order_not_found" }, { status: 404 });
  }

  // Avoid double-issuing a key if NOWPayments retries the webhook.
  if (order.status === "paid") {
    return NextResponse.json({ ok: true, already_processed: true });
  }

  await admin.from("orders").update({ status: "paid" }).eq("id", order.id);

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
    user_id: order.user_id,
    order_id: order.id,
    status: "unredeemed",
  });

  return NextResponse.json({ ok: true });
}
