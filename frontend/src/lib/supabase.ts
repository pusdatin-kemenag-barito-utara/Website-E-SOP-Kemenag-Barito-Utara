import { createClient } from "@supabase/supabase-js";
import { getEnv } from "./env";

const createKemenagClient = () => {
  const url = getEnv("PUBLIC_SUPABASE_URL");
  const anonKey = getEnv("PUBLIC_SUPABASE_ANON_KEY");

  if (!url || !anonKey) {
    if (typeof window !== "undefined") {
      console.warn("Supabase credentials missing. Check your Infisical Cloud configuration.");
    }
  }

  const safeUrl = url || "http://localhost:54321";
  const safeKey = anonKey || "placeholder-key";

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