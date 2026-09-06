import React from "react";
import type { Activity } from "@/types/sop";
import { SOPTableHeader } from "./SOPTableHeader";
import { SOPTableRow } from "./SOPTableRow";

interface SOPTableProps {
  activities: Activity[];
  roles: string[];
  noIds?: boolean;
  showOffPageStart?: boolean;
  showOffPageEnd?: boolean;
}

export function SOPTable({
  activities,
  roles,
  noIds,
  showOffPageStart,
  showOffPageEnd,
}: SOPTableProps) {
  return (
    <table className="w-full border-collapse relative z-30 bg-transparent">
      <SOPTableHeader roles={roles} />
      <tbody>
        {activities.map((act, idx) => (
          <SOPTableRow
            key={act.id}
            act={act}
            roles={roles}
            noIds={noIds}
            needsOffPageUp={showOffPageStart && idx === 0}
            needsOffPageDown={showOffPageEnd && idx === activities.length - 1}
          />
        ))}
      </tbody>
    </table>
  );
}
