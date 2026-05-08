import React from "react";
import { SOPHeader as SOPHeaderType } from "@/types/sop";
import { Calendar } from "lucide-react";
import { SectionHeader } from "../../shared/SectionHeader";
import { DatePicker } from "./DatePicker";

interface HeaderTimelineSectionProps {
  header: SOPHeaderType;
  updateHeader: (key: keyof SOPHeaderType, value: string) => void;
}

export function HeaderTimelineSection({
  header,
  updateHeader,
}: HeaderTimelineSectionProps) {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-lg shadow-slate-200/30 overflow-hidden hover:border-blue-200 transition-colors">
      <SectionHeader
        icon={Calendar}
        title="Timeline Dokumen"
        colorClass="text-blue-500"
      />
      <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <DatePicker
          label="Tgl Buat"
          value={header.tglBuat}
          onChange={(val) => updateHeader("tglBuat", val)}
        />
        <DatePicker
          label="Tgl Revisi"
          value={header.tglRevisi}
          onChange={(val) => updateHeader("tglRevisi", val)}
        />
        <DatePicker
          label="Tgl Efektif"
          value={header.tglEfektif}
          onChange={(val) => updateHeader("tglEfektif", val)}
          className="bg-emerald-50/50 border-emerald-100 hover:border-emerald-300 group-focus-within:border-emerald-400 group-focus-within:ring-emerald-500/10"
        />
      </div>
    </div>
  );
}
