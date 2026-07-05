"use server";

// Import removed since it's no longer needed
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import postgres from "postgres";

export async function checkRbacAccess(email: string) {
  try {
    const sql = postgres(process.env.DATABASE_URL!);
    
    // Fetch user directly using SQL to bypass PostgREST schema limitations
    const users = await sql`
      SELECT id, role 
      FROM kemenag_pusdatin.users 
      WHERE email = ${email}
    `;

    if (users.length === 0) {
      console.error("Error fetching user role: User not found");
      return { success: false, error: "Gagal memverifikasi akses." };
    }

    const userRecord = users[0];

    if (userRecord.role !== "super_admin") {
      const permissions = await sql`
        SELECT * 
        FROM kemenag_pusdatin.app_permissions 
        WHERE user_id = ${userRecord.id} 
        AND app_id = 'sop-kemenag'
      `;

      const permission = permissions.length > 0 ? permissions[0] : null;

      if (!permission || permission.role === "none") {
        // Log them out on the server side as well
        const cookieStore = await cookies();
        const supabase = createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            db: { schema: "kemenag_sop" },
            cookieOptions: { name: "sop-auth" },
            cookies: {
              getAll() { return cookieStore.getAll(); },
              setAll(cookiesToSet) {
                try {
                  cookiesToSet.forEach(({ name, value, options }) =>
                    cookieStore.set(name, value, options)
                  );
                } catch {
                  // Ignore error
                }
              },
            },
          }
        );
        await supabase.auth.signOut();
        
        return {
          success: false,
          error: "Akun Anda tidak memiliki akses ke aplikasi E-SOP Digital.",
        };
      }
    }

    return { success: true };
  } catch (err) {
    console.error("RBAC check failed:", err);
    return { success: false, error: "Terjadi kesalahan sistem saat memverifikasi akses." };
  }
}

export async function getUserRole(email: string) {
  try {
    const sql = postgres(process.env.DATABASE_URL!);
    const users = await sql`
      SELECT role 
      FROM kemenag_pusdatin.users 
      WHERE email = ${email}
    `;
    if (users.length > 0) return users[0].role;
    return null;
  } catch (err) {
    console.error("Failed to get user role:", err);
    return null;
  }
}

