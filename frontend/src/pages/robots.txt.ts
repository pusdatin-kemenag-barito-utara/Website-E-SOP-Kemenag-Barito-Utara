import type { APIRoute } from "astro";

export const GET: APIRoute = () => {
  const siteUrl = process.env.PUBLIC_SITE_URL || import.meta.env.PUBLIC_SITE_URL || "";
  const sitemapLine = siteUrl ? `\nSitemap: ${siteUrl}/sitemap.xml` : "";
  const body = `User-agent: *
Allow: /${sitemapLine}`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain" },
  });
};