import type { APIRoute } from "astro";

export const GET: APIRoute = ({ request }) => {
  const siteUrl = (
    import.meta.env.PUBLIC_SITE_URL ||
    (typeof process !== "undefined" && process.env?.PUBLIC_SITE_URL) ||
    new URL(request.url).origin
  ).replace(/\/$/, "");
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/tools</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${siteUrl}/tools/compress</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`;
  return new Response(body, {
    headers: { "Content-Type": "application/xml" },
  });
};