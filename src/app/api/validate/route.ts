import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { createHmac, timingSafeEqual } from "crypto";

// Called by Kyron.lua on startup with { key, hwid, sig }.
// sig = HMAC-SHA256(key + "|" + hwid, LICENSE_API_SECRET), so casual
// scraping of this endpoint's shape doesn't let someone hit it without
// also having the secret baked into the (obfuscated) script.
//
// Behavior:
// - Unknown key            -> deny
// - Revoked key             -> deny
// - Unredeemed + first hit  -> binds HWID, marks active, allow
// - Active + hwid matches   -> allow
// - Active + hwid mismatches-> deny (this is the anti-sharing check)

function verifySignature(key: string, hwid: string, sig: string): boolean {
  const secret = process.env.LICENSE_API_SECRET!;
  const expected = createHmac("sha256", secret)
    .update(`${key}|${hwid}`)
    .digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(sig || "");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { key, hwid, sig } = body as {
      key?: string;
      hwid?: string;
      sig?: string;
    };

    if (!key || !hwid || !sig) {
      return NextResponse.json(
        { ok: false, reason: "malformed_request" },
        { status: 400 }
      );
    }

    if (!verifySignature(key, hwid, sig)) {
      return NextResponse.json(
        { ok: false, reason: "bad_signature" },
        { status: 401 }
      );
    }

    const supabase = createAdminClient();

    const { data: license, error } = await supabase
      .from("licenses")
      .select("id, hwid, status")
      .eq("license_key", key)
      .single();

    if (error || !license) {
      return NextResponse.json(
        { ok: false, reason: "invalid_key" },
        { status: 404 }
      );
    }

    if (license.status === "revoked") {
      return NextResponse.json(
        { ok: false, reason: "revoked" },
        { status: 403 }
      );
    }

    // First-ever validation: bind HWID now.
    if (license.status === "unredeemed" || !license.hwid) {
      await supabase
        .from("licenses")
        .update({
          hwid,
          status: "active",
          last_validated_at: new Date().toISOString(),
        })
        .eq("id", license.id);

      return NextResponse.json({ ok: true, bound: true });
    }

    // Already bound: HWID must match.
    if (license.hwid !== hwid) {
      return NextResponse.json(
        { ok: false, reason: "hwid_mismatch" },
        { status: 403 }
      );
    }

    await supabase
      .from("licenses")
      .update({ last_validated_at: new Date().toISOString() })
      .eq("id", license.id);

    return NextResponse.json({ ok: true, bound: true });
  } catch {
    return NextResponse.json(
      { ok: false, reason: "server_error" },
      { status: 500 }
    );
  }
}
