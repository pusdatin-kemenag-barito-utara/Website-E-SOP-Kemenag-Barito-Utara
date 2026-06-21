import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing. Check your .env.local file.");
}

// Mencegah multiple instance saat Hot Module Replacement (HMR) di Next.js
const createKemenagClient = () => 
  createClient(supabaseUrl, supabaseAnonKey, {
    db: {
      schema: "kemenag_sop",
    },
  });

const globalForSupabase = globalThis as unknown as {
  supabase: ReturnType<typeof createKemenagClient> | undefined;
};

export const supabase =
  globalForSupabase.supabase ?? createKemenagClient();

if (process.env.NODE_ENV !== "production") globalForSupabase.supabase = supabase;
