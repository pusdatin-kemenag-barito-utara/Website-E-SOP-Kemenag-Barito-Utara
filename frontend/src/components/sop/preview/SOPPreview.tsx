"use client";

import React from "react";
import type { SOPHeader, Activity } from "@/types/sop";
import { SOPTable } from "./table/SOPTable";
import { FlowLines } from "./FlowLines";
import { SOPHeaderSection } from "./header/SOPHeaderSection";
import { SOPPageWrapper } from "./layout/SOPPageWrapper";
import { useSOPPagination } from "@/hooks/useSOPPagination";
import { useSOPCoords } from "@/hooks/useSOPCoords";

interface Props {
  header: SOPHeader;
  activities: Activity[];
  roles: string[];
  isHydrated: boolean;
  expandedActivities: string[];
}

export function SOPPreview({
  header,
  activities,
  roles,
  isHydrated,
  expandedActivities,
}: Props) {
  // Logic hooks
  const { activityPages } = useSOPPagination(
    activities,
    isHydrated,
    header,
    roles,
  );
  const symbolCoords = useSOPCoords(
    activities,
    isHydrated,
    header,
    roles,
    expandedActivities,
    activityPages,
  );

  if (!isHydrated) return null;

  return (
    <>
      {/* HIDDEN MEASURER */}
      <div
        id="sop-measurer"
        className="fixed -left-[5000px] top-0 pointer-events-none opacity-0 bg-white print:hidden"
        style={{ width: "210mm", padding: "10mm" }}
      >
        <div className="sop-header-area">
          <SOPHeaderSection header={header} />
        </div>
        <div className="mt-8">
          <SOPTable activities={activities} roles={roles} noIds={true} />
        </div>
      </div>

      {/* VISIBLE PREVIEW */}
      <div
        id="sop-preview-container"
        className="flex flex-col gap-0 w-fit mx-auto sop-preview-force-black font-inter"
      >
        {activityPages.map((pageActs, pageIdx) => (
          <SOPPageWrapper
            key={pageIdx}
            pageIdx={pageIdx}
            totalVisiblePages={activityPages.length}
          >
            {/* FLOW LINES LAYER */}
            <div className="absolute inset-0 z-20 pointer-events-none">
              <FlowLines
                activities={pageActs}
                symbolCoords={symbolCoords}
                pageSplits={[]}
              />
            </div>

            {/* CONTENT LAYER */}
            {pageIdx === 0 && <SOPHeaderSection header={header} />}

            <div className={pageIdx === 0 ? "mt-2" : "mt-2"}>
              <SOPTable
                activities={pageActs}
                roles={roles}
                showOffPageStart={pageIdx > 0}
                showOffPageEnd={pageIdx < activityPages.length - 1}
              />
            </div>
          </SOPPageWrapper>
        ))}
      </div>
    </>
  );
}
