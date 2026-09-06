import type { APIRoute } from "astro";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8080";

export const ALL: APIRoute = async ({ request, params }) => {
  const url = new URL(request.url);
  const path = params.path ? `/${params.path}` : "";
  const targetUrl = `${BACKEND_URL}/api${path}${url.search}`;

  const headers = new Headers(request.headers);
  headers.delete("host");

  try {
    const hasBody = !["GET", "HEAD"].includes(request.method);
    const body = hasBody ? await request.arrayBuffer() : undefined;

    const res = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      redirect: "manual",
    });

    return new Response(res.body, {
      status: res.status,
      headers: res.headers,
    });
  } catch (err) {
    console.error(`[API Proxy Error] Failed to fetch ${targetUrl}:`, err);
    return new Response(
      JSON.stringify({
        error: "Gagal terhubung ke layanan backend",
      }),
      {
        status: 502,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
