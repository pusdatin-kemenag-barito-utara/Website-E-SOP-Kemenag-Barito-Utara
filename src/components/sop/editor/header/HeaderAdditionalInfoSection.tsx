import React from "react";
import { SOPHeader as SOPHeaderType } from "@/types/sop";
import { Info, Link2, Wrench, ShieldAlert, ClipboardList } from "lucide-react";
import { SectionHeader } from "../../shared/SectionHeader";
import { SmartTextarea } from "./SmartTextarea";

interface HeaderAdditionalInfoSectionProps {
  header: SOPHeaderType;
  updateHeader: (key: keyof SOPHeaderType, value: string) => void;
}

export function HeaderAdditionalInfoSection({
  header,
  updateHeader,
}: HeaderAdditionalInfoSectionProps) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <SectionHeader
        icon={Info}
        title="Informasi Tambahan"
        colorClass="text-amber-500"
      />
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-muted-foreground ml-0.5 tracking-wide flex items-center gap-1.5">
              <Link2 className="w-3 h-3 text-sky-400" /> Keterkaitan
            </label>
            <SmartTextarea
              value={header.keterkaitan}
              onValueChange={(val) => updateHeader("keterkaitan", val)}
              className="min-h-[80px]"
              placeholder="Contoh: 1. SOP Persuratan..."
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-muted-foreground ml-0.5 tracking-wide flex items-center gap-1.5">
              <Wrench className="w-3 h-3" /> Peralatan
            </label>
            <SmartTextarea
              value={header.peralatan}
              onValueChange={(val) => updateHeader("peralatan", val)}
              className="min-h-[80px]"
              placeholder="Contoh: 1. Komputer/Laptop..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-destructive ml-0.5 tracking-wide flex items-center gap-1.5">
              <ShieldAlert className="w-3 h-3" /> Peringatan
            </label>
            <SmartTextarea
              value={header.peringatan}
              onValueChange={(val) => updateHeader("peringatan", val)}
              className="min-h-[80px]"
              placeholder="Contoh: 1. Berkas harus lengkap..."
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-muted-foreground ml-0.5 tracking-wide flex items-center gap-1.5">
              <ClipboardList className="w-3 h-3" /> Pencatatan
            </label>
            <SmartTextarea
              value={header.pencatatan}
              onValueChange={(val) => updateHeader("pencatatan", val)}
              className="min-h-[80px]"
              placeholder="Contoh: 1. Agenda Surat Masuk..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
