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
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <SectionHeader
        icon={Gavel}
        title="Dasar Hukum & Kualifikasi"
        colorClass="text-purple-500"
      />
      <div className="p-4 space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-semibold text-muted-foreground ml-0.5 tracking-wide flex items-center gap-1.5">
            <Gavel className="w-3 h-3 text-purple-400" /> Dasar Hukum
          </label>
          <SmartTextarea
            value={header.dasarHukum}
            onValueChange={(val) => updateHeader("dasarHukum", val)}
            className="min-h-[100px]"
            placeholder="Contoh: 1. Undang-undang No. 25 Tahun 2009..."
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-semibold text-muted-foreground ml-0.5 tracking-wide flex items-center gap-1.5">
            <ClipboardList className="w-3 h-3 text-indigo-400" /> Kualifikasi Pelaksana
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
