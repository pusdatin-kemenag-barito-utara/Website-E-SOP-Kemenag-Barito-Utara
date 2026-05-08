import { useState, useEffect, useMemo } from "react";
import { Activity, SOPHeader } from "@/types/sop";

export function useSOPPagination(
  activities: Activity[],
  isHydrated: boolean,
  header: SOPHeader,
  roles: string[],
) {
  const [pageSplits, setPageSplits] = useState<number[]>([]);

  useEffect(() => {
    if (!isHydrated) return;

    const calculateSplits = () => {
      const container = document.getElementById("sop-measurer");
      if (!container) return;

      const rows = Array.from(container.querySelectorAll("tbody tr"));
      if (rows.length === 0) return;

      const headerArea = container.querySelector(".sop-header-area");
      const headerHeight = headerArea?.getBoundingClientRect().height || 0;

      const firstTableHeader = container.querySelector("thead");
      const tableHeaderHeight =
        firstTableHeader?.getBoundingClientRect().height || 60;

      const A4_HEIGHT_PX = 297 * 3.7795;
      const PADDING_TOP_PX = 10 * 3.7795;
      const PADDING_BOTTOM_PX = 10 * 3.7795;
      const SAFETY_MARGIN_PX = 15 * 3.7795;
      const USABLE_PAGE_HEIGHT =
        A4_HEIGHT_PX - PADDING_TOP_PX - PADDING_BOTTOM_PX - SAFETY_MARGIN_PX;

      const newSplits: number[] = [];
      let currentAccHeight = headerHeight + tableHeaderHeight;

      for (let i = 0; i < rows.length; i++) {
        const rowHeight = rows[i].getBoundingClientRect().height || 30; // Fallback to 8mm

        if (currentAccHeight + rowHeight > USABLE_PAGE_HEIGHT) {
          newSplits.push(i);
          currentAccHeight = tableHeaderHeight + rowHeight;
        } else {
          currentAccHeight += rowHeight;
        }
      }

      newSplits.push(activities.length);
      setPageSplits(newSplits);
    };

    const timer = setTimeout(calculateSplits, 50);
    return () => clearTimeout(timer);
  }, [activities, header, roles, isHydrated]);

  const activityPages = useMemo(() => {
    if (pageSplits.length === 0) return [activities];
    const pages: Activity[][] = [];
    let start = 0;
    pageSplits.forEach((end) => {
      const chunk = activities.slice(start, end);
      if (chunk.length > 0) pages.push(chunk);
      start = end;
    });
    return pages.length > 0 ? pages : [activities];
  }, [activities, pageSplits]);

  return { activityPages, pageSplits };
}
