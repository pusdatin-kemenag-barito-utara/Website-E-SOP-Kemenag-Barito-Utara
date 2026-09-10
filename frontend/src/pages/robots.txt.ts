import type { APIRoute } from "astro";

export const GET: APIRoute = ({ request }) => {
  const siteUrl =
    import.meta.env.PUBLIC_SITE_URL ||
    (typeof process !== "undefined" && process.env?.PUBLIC_SITE_URL) ||
    new URL(request.url).origin;
  const body = `User-agent: *
Allow: /
Sitemap: ${siteUrl.replace(/\/$/, "")}/sitemap.xml`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain" },
  });
};