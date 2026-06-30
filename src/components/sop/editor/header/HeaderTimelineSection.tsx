import React from "react";
import { SOPHeader as SOPHeaderType } from "@/types/sop";
import { Calendar } from "lucide-react";
import { ModernDatePicker } from "@/components/ui/modern-date-picker";
import { SectionHeader } from "../../shared/SectionHeader";

interface HeaderTimelineSectionProps {
  header: SOPHeaderType;
  updateHeader: (key: keyof SOPHeaderType, value: string) => void;
}

export function HeaderTimelineSection({
  header,
  updateHeader,
}: HeaderTimelineSectionProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
      <SectionHeader
        icon={Calendar}
        title="Timeline Dokumen"
        colorClass="text-blue-500 dark:text-blue-400"
      />

      <div className="p-5 md:p-6 grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-200 ml-1 tracking-wide block mb-1.5">
            Tgl Buat
          </label>
          <ModernDatePicker
            value={header.tglBuat || ""}
            onChange={(date: string) => updateHeader("tglBuat", date)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-200 ml-1 tracking-wide block mb-1.5">
            Tgl Revisi
          </label>
          <ModernDatePicker
            value={header.tglRevisi || ""}
            onChange={(date: string) => updateHeader("tglRevisi", date)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-200 ml-1 tracking-wide block mb-1.5">
            Tgl Efektif
          </label>
          <ModernDatePicker
            value={header.tglEfektif || ""}
            onChange={(date: string) => updateHeader("tglEfektif", date)}
          />
        </div>
      </div>
    </div>
  );
}
