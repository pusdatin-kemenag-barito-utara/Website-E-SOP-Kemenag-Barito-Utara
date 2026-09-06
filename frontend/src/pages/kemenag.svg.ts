import type { APIRoute } from "astro";
import kemenagSvg from "@/assets/kemenag.svg?raw";

export const GET: APIRoute = () => {
  return new Response(kemenagSvg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      // Cache on browser and Cloudflare Edge CDN for 1 full year (365 days = 31,536,000 seconds)
      "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
      "Cloudflare-CDN-Cache-Control": "max-age=31536000, immutable",
      "CDN-Cache-Control": "max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
};
