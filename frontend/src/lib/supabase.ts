import { createClient } from "@supabase/supabase-js";
import { getEnv } from "./env";

const getSupabaseConfig = () => {
  const url = getEnv("PUBLIC_SUPABASE_URL");
  const anonKey = getEnv("PUBLIC_SUPABASE_ANON_KEY");
  return { url, anonKey };
};

const createKemenagClient = () => {
  const { url, anonKey } = getSupabaseConfig();

  // Gunakan fallback aman agar createClient tidak melempar fatal exception jika env belum ter-inject saat evaluasi modul
  const safeUrl = url || "https://placeholder-kemenag.supabase.co";
  const safeKey = anonKey || "placeholder-anon-key";

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