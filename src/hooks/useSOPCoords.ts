import { useState, useEffect } from "react";
import { Activity, SymbolCoord, SOPHeader } from "@/types/sop";

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

    const updateCoords = () => {
      const newCoords: Record<string, SymbolCoord> = {};
      const container = document.getElementById("sop-preview-container");
      if (!container) return;

      activities.forEach((act) => {
        const el = document.getElementById(`symbol-${act.id}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          const pageEl = el.closest(".print-page");
          if (pageEl) {
            const pageRect = pageEl.getBoundingClientRect();
            newCoords[act.id] = {
              x: rect.left - pageRect.left + rect.width / 2,
              y: rect.top - pageRect.top + rect.height / 2,
              w: rect.width,
              h: rect.height,
            };
          }
        }
      });
      setSymbolCoords(newCoords);
    };

    const container = document.getElementById("sop-preview-container");
    const observer = new ResizeObserver(updateCoords);
    if (container) observer.observe(container);

    updateCoords();
    const timer = setTimeout(updateCoords, 50);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [activities, roles, isHydrated, header, expandedActivities, activityPages]);

  return symbolCoords;
}
