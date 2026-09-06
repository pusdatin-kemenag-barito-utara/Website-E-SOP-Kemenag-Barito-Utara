import React from "react";
import type { Activity } from "@/types/sop";
import { RenderList } from "../../shared/RenderList";
import { SopSymbol } from "../../shared/SopSymbol";

interface SOPTableRowProps {
  act: Activity;
  roles: string[];
  noIds?: boolean;
  needsOffPageUp?: boolean;
  needsOffPageDown?: boolean;
}

export function SOPTableRow({
  act,
  roles,
  noIds,
  needsOffPageUp,
  needsOffPageDown,
}: SOPTableRowProps) {
  return (
    <tr key={act.id} className="h-[8mm] min-h-[8mm]">
      <td className="border border-[#000] p-1 text-center text-[7.5pt] font-medium text-black w-[8mm]">
        {act.no}
      </td>
      <td className="border border-[#000] p-1.5 text-[8.5pt] font-medium leading-tight w-[25mm] min-w-[25mm] text-justify">
        {act.kegiatan}
      </td>
      {roles.map((role) => (
        <td
          key={role}
          className="border border-[#000] p-0 text-center align-middle w-[12mm] min-w-[12mm] relative h-[12mm]"
        >
          {act.roleForSymbol === role && (
            <div className="absolute inset-0 z-40 pointer-events-none">
              {/* OFF-PAGE UP */}
              {needsOffPageUp && (
                <div className="absolute top-[2px] bottom-1/2 left-1/2 -translate-x-1/2 flex flex-col items-center">
                  <SopSymbol type="offpage-up" />
                  <div className="flex-1 w-[1px] bg-[#000]" />
                </div>
              )}

              {/* MAIN SYMBOL */}
              <div
                id={noIds ? undefined : `symbol-${act.id}`}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-auto"
              >
                <SopSymbol type={act.symbol} />
              </div>

              {/* OFF-PAGE DOWN */}
              {needsOffPageDown && (
                <div className="absolute top-1/2 bottom-[2px] left-1/2 -translate-x-1/2 flex flex-col items-center">
                  <div className="flex-1 w-[1px] bg-[#000]" />
                  <SopSymbol type="offpage" />
                </div>
              )}
            </div>
          )}
        </td>
      ))}
      <td className="border border-[#000] p-1 text-[7.5pt] leading-tight text-left">
        <RenderList
          text={act.persyaratan}
          className="ml-1 space-y-0 text-left"
          itemClassName="text-[7.5pt] text-left"
          variant="plain"
        />
      </td>
      <td className="border border-[#000] p-1 text-[7.5pt] font-medium text-black text-center w-[15mm] min-w-[15mm]">
        {act.waktu}
      </td>
      <td className="border border-[#000] p-1 text-[7.5pt] leading-tight text-left">
        <RenderList
          text={act.output}
          className="ml-1 space-y-0 text-left"
          itemClassName="text-[7.5pt] text-left"
          variant="plain"
        />
      </td>
      <td className="border border-[#000] p-1 text-[7.5pt] leading-tight text-justify">
        <RenderList
          text={act.keterangan}
          className="ml-1 space-y-0"
          itemClassName="text-[7pt] text-justify"
          variant="plain"
        />
      </td>
    </tr>
  );
}
