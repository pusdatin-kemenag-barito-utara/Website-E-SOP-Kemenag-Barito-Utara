import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.PUBLIC_SUPABASE_URL ||
  (typeof process !== "undefined" && process.env?.PUBLIC_SUPABASE_URL) ||
  "https://db.kemenag-baritoutara.com";

const supabaseAnonKey =
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY ||
  (typeof process !== "undefined" && process.env?.PUBLIC_SUPABASE_ANON_KEY) ||
  "";

if (!supabaseAnonKey) {
  console.warn("Supabase credentials missing. Check your .env file.");
}

const createKemenagClient = () =>
  createClient(supabaseUrl, supabaseAnonKey || "dummy-key", {
    db: { schema: "kemenag_sop" },
  });

const globalForSupabase = globalThis as unknown as {
  supabase: ReturnType<typeof createKemenagClient> | undefined;
};

export const supabase =
  globalForSupabase.supabase ?? createKemenagClient();

if (import.meta.env.DEV) globalForSupabase.supabase = supabase;