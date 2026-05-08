import React from "react";

interface SOPTableHeaderProps {
  roles: string[];
}

export function SOPTableHeader({ roles }: SOPTableHeaderProps) {
  return (
    <thead>
      <tr className="bg-slate-50 text-[8pt] h-[35px]">
        <th
          className="border border-[#000] p-1 w-[8mm] min-w-[8mm]"
          rowSpan={2}
        >
          No
        </th>
        <th
          className="border border-[#000] p-1 w-[30mm] min-w-[30mm]"
          rowSpan={2}
        >
          Aktivitas
        </th>
        <th
          className="border border-[#000] p-1 text-center"
          colSpan={roles.length}
        >
          Pelaksana
        </th>
        <th className="border border-[#000] p-1 text-center" colSpan={3}>
          Mutu Baku
        </th>
        <th
          className="border border-[#000] p-1 w-[16mm] min-w-[16mm]"
          rowSpan={2}
        >
          Ket
        </th>
      </tr>
      <tr className="bg-slate-50 text-[6.5pt] h-[30px]">
        {roles.map((role) => (
          <th
            key={role}
            className="border border-[#000] p-1 w-[12mm] min-w-[12mm] font-semibold text-center overflow-hidden leading-tight text-[6pt]"
          >
            {role}
          </th>
        ))}
        <th className="border border-[#000] p-0.5 w-[16mm] font-semibold">
          Persyaratan
        </th>
        <th className="border border-[#000] p-0.5 w-[10mm] font-semibold">
          Waktu
        </th>
        <th className="border border-[#000] p-0.5 w-[16mm] font-semibold">
          Output
        </th>
      </tr>
    </thead>
  );
}
