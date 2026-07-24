"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function MaintenanceListener() {
  const pathname = usePathname();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/maintenance/status?t=${Date.now()}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store",
          },
        });
        if (res.ok) {
          const data = await res.json();
          const isMaintenance = data.status === "maintenance";

          if (isMaintenance && pathname !== "/maintenance") {
            window.location.replace("/maintenance");
          } else if (!isMaintenance && pathname === "/maintenance") {
            window.location.replace("/");
          }
        }
      } catch {
        // Ignore network glitches during polling
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 1000);

    return () => clearInterval(interval);
  }, [pathname]);

  return null;
}
