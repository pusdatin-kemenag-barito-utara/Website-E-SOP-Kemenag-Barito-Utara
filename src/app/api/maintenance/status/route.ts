import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const pusdatinUrl =
      process.env.NEXT_PUBLIC_PUSDATIN_URL ||
      "https://pusdatin.kemenag-baritoutara.go.id";
    const appId = "sop-kemenag";

    const res = await fetch(
      `${pusdatinUrl}/api/public/apps/${appId}/status?t=${Date.now()}`,
      {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      }
    );

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(
        { status: data.status },
        {
          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
            Pragma: "no-cache",
          },
        }
      );
    }
  } catch {
    // Ignore fetch error, fail open to active
  }

  return NextResponse.json(
    { status: "active" },
    {
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        Pragma: "no-cache",
      },
    }
  );
}
