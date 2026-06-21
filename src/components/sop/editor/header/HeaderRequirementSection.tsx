import React from "react";
import { SOPHeader as SOPHeaderType } from "@/types/sop";
import { Gavel, ClipboardList } from "lucide-react";
import { SectionHeader } from "../../shared/SectionHeader";
import { SmartTextarea } from "./SmartTextarea";

interface HeaderRequirementSectionProps {
  header: SOPHeaderType;
  updateHeader: (key: keyof SOPHeaderType, value: string) => void;
}

export function HeaderRequirementSection({
  header,
  updateHeader,
}: HeaderRequirementSectionProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      <SectionHeader
        icon={Gavel}
        title="Dasar Hukum & Kualifikasi"
        colorClass="text-purple-500 dark:text-purple-400"
      />
      <div className="p-5 md:p-6 space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-200 ml-1 tracking-wide flex items-center gap-1.5 mb-1.5">
            <Gavel className="w-4 h-4 text-purple-500" /> Dasar Hukum
          </label>
          <SmartTextarea
            value={header.dasarHukum}
            onValueChange={(val) => updateHeader("dasarHukum", val)}
            className="min-h-[100px]"
            placeholder="Contoh: 1. Undang-undang No. 25 Tahun 2009..."
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-200 ml-1 tracking-wide flex items-center gap-1.5 mb-1.5">
            <ClipboardList className="w-4 h-4 text-indigo-500" /> Kualifikasi Pelaksana
          </label>
          <SmartTextarea
            value={header.kualifikasi}
            onValueChange={(val) => updateHeader("kualifikasi", val)}
            className="min-h-[100px]"
            placeholder="Contoh: 1. Memahami prosedur administrasi..."
          />
        </div>
      </div>
    </div>
  );
}
