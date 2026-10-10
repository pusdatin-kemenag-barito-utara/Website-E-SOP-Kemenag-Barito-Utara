import type { APIRoute } from "astro";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8080";

export const ALL: APIRoute = async ({ request, params }) => {
  const url = new URL(request.url);
  const path = params.path ? `/${params.path}` : "";
  const targetUrl = `${BACKEND_URL}/api${path}${url.search}`;

  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("accept-encoding");

  try {
    const hasBody = !["GET", "HEAD"].includes(request.method);
    const body = hasBody ? await request.arrayBuffer() : undefined;

    const res = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      redirect: "manual",
    });

    const responseHeaders = new Headers(res.headers);
    responseHeaders.delete("content-length");
    responseHeaders.delete("content-encoding");
    responseHeaders.delete("transfer-encoding");
    responseHeaders.delete("connection");
    responseHeaders.delete("keep-alive");

    const buffer = await res.arrayBuffer();

    return new Response(buffer, {
      status: res.status,
      headers: responseHeaders,
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
