import { defineMiddleware } from "astro:middleware";

const API_URL =
  process.env.BACKEND_URL ||
  process.env.PUBLIC_API_URL ||
  "http://127.0.0.1:8080";

let maintenanceCache: boolean | null = null;
let lastCheckTime = 0;
const CACHE_TTL = 2_000; // 2 detik cache agar instan

async function isSystemMaintenance(): Promise<boolean> {
  const now = Date.now();
  if (maintenanceCache !== null && now - lastCheckTime < CACHE_TTL) {
    return maintenanceCache;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${API_URL}/api/maintenance/status?t=${now}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = (await res.json()) as { status?: string };
      maintenanceCache = data.status === "maintenance";
      lastCheckTime = now;
      return maintenanceCache;
    }
  } catch {
    // Abaikan kegagalan jaringan sementara
  }

  return maintenanceCache ?? false;
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Lewati file statis, aset vite, dan file sistem
  if (
    pathname.startsWith("/_astro") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname === "/sop.png" ||
    pathname === "/manifest.webmanifest" ||
    pathname === "/sw.js" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname.includes(".")
  ) {
    return next();
  }

  const isMaintenance = await isSystemMaintenance();

  // Jika sistem sedang dalam mode maintenance: arahkan semua rute halaman ke /maintenance
  if (isMaintenance) {
    if (pathname !== "/maintenance") {
      return context.redirect("/maintenance", 307);
    }
    return next();
  }

  // Jika sistem ONLINE dan user membuka /maintenance: arahkan kembali ke beranda
  if (!isMaintenance && pathname === "/maintenance") {
    return context.redirect("/", 307);
  }

  const response = await next();
  response.headers.set("Alt-Svc", 'h3=":443"; ma=86400, h3-29=":443"; ma=86400');
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-site");
  return response;
});
