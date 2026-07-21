import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// DANGER: service_role key bypasses Row Level Security entirely.
// NEVER import this file into any Client Component or expose it
// to the browser. Only use inside route handlers under src/app/api/.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
