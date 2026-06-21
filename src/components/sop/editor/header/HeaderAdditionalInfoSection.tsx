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
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      <SectionHeader
        icon={Info}
        title="Informasi Tambahan"
        colorClass="text-amber-500 dark:text-amber-400"
      />
      <div className="p-5 md:p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200 ml-1 tracking-wide flex items-center gap-1.5 mb-1.5">
              <Link2 className="w-4 h-4 text-sky-500" /> Keterkaitan
            </label>
            <SmartTextarea
              value={header.keterkaitan}
              onValueChange={(val) => updateHeader("keterkaitan", val)}
              className="min-h-[80px]"
              placeholder="Contoh: 1. SOP Persuratan..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200 ml-1 tracking-wide flex items-center gap-1.5 mb-1.5">
              <Wrench className="w-4 h-4 text-amber-500" /> Peralatan
            </label>
            <SmartTextarea
              value={header.peralatan}
              onValueChange={(val) => updateHeader("peralatan", val)}
              className="min-h-[80px]"
              placeholder="Contoh: 1. Komputer/Laptop..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-red-600 dark:text-red-400 ml-1 tracking-wide flex items-center gap-1.5 mb-1.5">
              <ShieldAlert className="w-4 h-4" /> Peringatan
            </label>
            <SmartTextarea
              value={header.peringatan}
              onValueChange={(val) => updateHeader("peringatan", val)}
              className="min-h-[80px]"
              placeholder="Contoh: 1. Berkas harus lengkap..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200 ml-1 tracking-wide flex items-center gap-1.5 mb-1.5">
              <ClipboardList className="w-4 h-4 text-slate-500 dark:text-slate-400" /> Pencatatan
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
