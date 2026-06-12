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
    <div className="bg-card border border-border rounded-xl overflow-visible">
      <SectionHeader
        icon={Calendar}
        title="Timeline Dokumen"
        colorClass="text-blue-500"
      />
      <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
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
        />
      </div>
    </div>
  );
}
