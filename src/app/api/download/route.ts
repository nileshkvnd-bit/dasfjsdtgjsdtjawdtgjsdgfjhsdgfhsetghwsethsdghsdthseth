import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import { readFile } from "fs/promises";
import path from "path";

// Serves the actual Kyron.lua file, but only to a logged-in user who
// owns at least one license that isn't revoked. The file itself lives
// outside /public so it can never be reached by guessing a URL —
// this route is the only path to it.
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, reason: "not_logged_in" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: license } = await admin
    .from("licenses")
    .select("id, status")
    .eq("user_id", user.id)
    .neq("status", "revoked")
    .limit(1)
    .single();

  if (!license) {
    return NextResponse.json(
      { ok: false, reason: "no_active_license" },
      { status: 403 }
    );
  }

  const filePath = path.join(process.cwd(), "protected-files", "Kyron.lua");

  try {
    const file = await readFile(filePath);
    return new NextResponse(new Uint8Array(file), {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": 'attachment; filename="Kyron.lua"',
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, reason: "file_not_found" },
      { status: 404 }
    );
  }
}
