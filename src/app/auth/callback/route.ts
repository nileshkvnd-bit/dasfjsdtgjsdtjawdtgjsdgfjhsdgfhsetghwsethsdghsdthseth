import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

// Supabase redirects here after Discord OAuth (or email confirmation
// links) with a ?code=... param. We exchange it for a session cookie,
// then send the user to the home page (nav now shows Dashboard/username).
export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${origin}/`);
}
