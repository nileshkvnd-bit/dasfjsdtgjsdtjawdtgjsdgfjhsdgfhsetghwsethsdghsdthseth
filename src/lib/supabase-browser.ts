import { createBrowserClient } from "@supabase/ssr";

// Used in Client Components (pages with "use client").
// Uses the public anon key — safe to expose, RLS protects the data.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
