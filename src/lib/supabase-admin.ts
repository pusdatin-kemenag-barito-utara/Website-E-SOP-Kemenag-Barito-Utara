import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn("Supabase Service Role Key missing. Admin features will not work.");
}

// Client ini memiliki hak akses penuh (Service Role) ke database & auth.
// HANYA boleh digunakan di server side (API Routes / Server Components).
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  db: { schema: "kemenag_sop" },
});
