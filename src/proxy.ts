import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow health endpoint
  if (pathname === '/api/health') {
    return NextResponse.next();
  }

  // === MAINTENANCE CHECK ===
  try {
    const pusdatinUrl = process.env.NEXT_PUBLIC_PUSDATIN_URL || "https://pusdatin.kemenag-baritoutara.go.id";
    const appId = "sop-kemenag";

    const maintenanceRes = await fetch(
      `${pusdatinUrl}/api/public/apps/${appId}/status`,
      {
        next: { revalidate: 30 },
      }
    );

    if (maintenanceRes.ok) {
      const data = await maintenanceRes.json();
      if (data.status === "maintenance") {
        return new NextResponse(
          `
          <!DOCTYPE html>
          <html lang="id">
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <title>Sistem Sedang Pemeliharaan</title>
              <link rel="icon" href="${pusdatinUrl}/branding/kemenag.svg" type="image/svg+xml">
              <style>
                body { margin: 0; overflow: hidden; background-color: #f8fafc; }
                iframe { width: 100vw; height: 100vh; border: none; }
              </style>
            </head>
            <body>
              <iframe src="${pusdatinUrl}/maintenance?app=E-SOP+Digital" title="Maintenance"></iframe>
            </body>
          </html>
        `,
          {
            status: 503,
            headers: {
              "Content-Type": "text/html; charset=utf-8",
            },
          }
        );
      }
    }
  } catch (error) {
    console.error("[PROXY] Failed to fetch maintenance status:", error);
  }

  // === SESSION HANDLING ===
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: {
        schema: "kemenag_sop",
      },
      cookieOptions: {
        name: "sop-auth",
      },
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    pathname === "/login" ||
    pathname.startsWith("/api/auth") ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt"
  ) {
    if (user && pathname === "/login") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return supabaseResponse;
  }

  const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/builder') || pathname.startsWith('/templates');

  if (isProtectedRoute && !user) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // === RBAC CHECK ===
  if (isProtectedRoute && user) {
    try {
      const supabaseAdmin = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          db: { schema: "kemenag_pusdatin" },
          cookies: {
            getAll() { return []; },
            setAll() { },
          }
        }
      );
      
      const { data: userRecord } = await supabaseAdmin
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
        
      if (userRecord?.role !== 'super_admin') {
        const { data: perm } = await supabaseAdmin
          .from('app_permissions')
          .select('role')
          .eq('user_id', user.id)
          .eq('app_id', 'sop-kemenag')
          .single();
          
        if (!perm) {
          const url = new URL("/login", request.url);
          url.searchParams.set("error", "unauthorized");
          return NextResponse.redirect(url);
        }
      }
    } catch (e) {
      console.error("[PROXY] RBAC error:", e);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
