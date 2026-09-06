import { useEffect } from "react";

const API_URL = import.meta.env.PUBLIC_API_URL || "";

export function MaintenanceListener() {
  useEffect(() => {
    const pathname = window.location.pathname;

    const checkStatus = async () => {
      try {
        const res = await fetch(`${API_URL}/api/maintenance/status?t=${Date.now()}`, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache, no-store" },
        });
        if (res.ok) {
          const data = await res.json();
          const isMaintenance = data.status === "maintenance";
          if (isMaintenance && pathname !== "/maintenance") window.location.replace("/maintenance");
          else if (!isMaintenance && pathname === "/maintenance") window.location.replace("/");
        }
      } catch { /* Ignore */ }
    };
    checkStatus();

    // Periksa status saat pengguna kembali aktif ke tab ini
    const handleFocus = () => {
      if (document.visibilityState === "visible") {
        checkStatus();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);

    // Polling berkala setiap 30 detik di latar belakang
    const interval = setInterval(checkStatus, 30000);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
      clearInterval(interval);
    };
  }, []);

  return null;
}