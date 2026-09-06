import type { APIRoute } from "astro";

export const GET: APIRoute = () => {
  const body = `User-agent: *
Allow: /
Sitemap: https://sop.kemenag-baritoutara.com/sitemap.xml`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain" },
  });
};