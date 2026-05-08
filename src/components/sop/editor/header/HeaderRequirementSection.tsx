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
    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-lg shadow-slate-200/30 overflow-hidden">
      <SectionHeader
        icon={Gavel}
        title="Dasar Hukum & Kualifikasi"
        colorClass="text-purple-500"
      />
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider flex items-center gap-2">
            <Gavel className="w-3 h-3 text-purple-400" /> Dasar Hukum
          </label>
          <SmartTextarea
            value={header.dasarHukum}
            onValueChange={(val) => updateHeader("dasarHukum", val)}
            className="min-h-[120px] bg-slate-50/50 border-slate-200 focus:bg-white rounded-2xl p-4 text-sm leading-relaxed resize-none transition-all focus:ring-4 focus:ring-purple-500/5"
            placeholder="Contoh: 1. Undang-undang No. 25 Tahun 2009..."
          />
        </div>
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider flex items-center gap-2">
            <ClipboardList className="w-3 h-3 text-indigo-400" /> Kualifikasi
            Pelaksana
          </label>
          <SmartTextarea
            value={header.kualifikasi}
            onValueChange={(val) => updateHeader("kualifikasi", val)}
            className="min-h-[120px] bg-slate-50/50 border-slate-200 focus:bg-white rounded-2xl p-4 text-sm leading-relaxed resize-none transition-all focus:ring-4 focus:ring-indigo-500/5"
            placeholder="Contoh: 1. Memahami prosedur administrasi..."
          />
        </div>
      </div>
    </div>
  );
}
