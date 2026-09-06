import { useState, useEffect } from "react";
import type { Activity, SymbolCoord, SOPHeader } from "@/types/sop";

export function useSOPCoords(
  activities: Activity[],
  isHydrated: boolean,
  header: SOPHeader,
  roles: string[],
  expandedActivities: string[],
  activityPages: Activity[][],
) {
  const [symbolCoords, setSymbolCoords] = useState<Record<string, SymbolCoord>>(
    {},
  );

  useEffect(() => {
    if (!isHydrated) return;

    let lastCoordsString = "";

    const updateCoords = () => {
      const newCoords: Record<string, SymbolCoord> = {};
      const container = document.getElementById("sop-preview-container");
      if (!container) return;

      let hasValidCoords = false;

      activities.forEach((act) => {
        const el = document.getElementById(`symbol-${act.id}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          const pageEl = el.closest(".print-page");
          if (pageEl) {
            const pageRect = pageEl.getBoundingClientRect();
            
            // Hitung skala (karena di mobile ada transform: scale)
            // pageRect.width adalah ukuran di layar (ter-scale), pageEl.offsetWidth adalah ukuran asli CSS (unscaled)
            const scale = pageRect.width / (pageEl as HTMLElement).offsetWidth || 1;

            // Hanya update jika elemen benar-benar terlihat (width > 0)
            if (rect.width > 0 && rect.height > 0) {
              newCoords[act.id] = {
                x: (rect.left - pageRect.left) / scale + (el as HTMLElement).offsetWidth / 2,
                y: (rect.top - pageRect.top) / scale + (el as HTMLElement).offsetHeight / 2,
                w: (el as HTMLElement).offsetWidth,
                h: (el as HTMLElement).offsetHeight,
              };
              hasValidCoords = true;
            }
          }
        }
      });

      if (hasValidCoords) {
        const newCoordsString = JSON.stringify(newCoords);
        if (newCoordsString !== lastCoordsString) {
          lastCoordsString = newCoordsString;
          setSymbolCoords(newCoords);
        }
      }
    };

    const container = document.getElementById("sop-preview-container");
    const observer = new ResizeObserver(updateCoords);
    if (container) observer.observe(container);

    updateCoords();
    const interval = setInterval(updateCoords, 100);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, [
    activities,
    roles,
    isHydrated,
    header,
    expandedActivities,
    activityPages,
  ]);

  return symbolCoords;
}
