import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";

// Called from the dashboard when a logged-in user enters a key that
// was generated for their order (e.g. if keys are emailed rather than
// auto-attached). Links the license row to their account.
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, reason: "not_logged_in" }, { status: 401 });
  }

  const { key } = (await req.json()) as { key?: string };
  if (!key) {
    return NextResponse.json({ ok: false, reason: "missing_key" }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: license, error } = await admin
    .from("licenses")
    .select("id, user_id")
    .eq("license_key", key.trim().toUpperCase())
    .single();

  if (error || !license) {
    return NextResponse.json({ ok: false, reason: "invalid_key" }, { status: 404 });
  }

  if (license.user_id && license.user_id !== user.id) {
    return NextResponse.json({ ok: false, reason: "already_claimed" }, { status: 409 });
  }

  await admin
    .from("licenses")
    .update({ user_id: user.id })
    .eq("id", license.id);

  return NextResponse.json({ ok: true });
}
