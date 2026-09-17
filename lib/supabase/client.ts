import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for Client Components. Reads the connection details from
 * env vars — see .env.local.example. Safe to call repeatedly; each call
 * returns a lightweight client bound to the same browser session.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
