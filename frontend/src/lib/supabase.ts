import { createClient } from "@supabase/supabase-js";
import { getEnv } from "./env";

const supabaseUrl =
  import.meta.env.PUBLIC_SUPABASE_URL ||
  (typeof process !== "undefined" && process.env?.PUBLIC_SUPABASE_URL) ||
  "";

const createKemenagClient = () => {
  const { url, anonKey } = getSupabaseConfig();

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing. Check your environment variables / .env file.");
}

  if (!url || !anonKey) {
    if (typeof window !== "undefined") {
      console.warn("Supabase credentials missing or pending injection.");
    }
  }

  return createClient(safeUrl, safeKey, {
    db: { schema: "kemenag_sop" },
  });
};

const globalForSupabase = globalThis as unknown as {
  supabase: ReturnType<typeof createKemenagClient> | undefined;
};

export const supabase =
  globalForSupabase.supabase ?? createKemenagClient();

if (import.meta.env.DEV) globalForSupabase.supabase = supabase;