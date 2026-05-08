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
    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-lg shadow-slate-200/30 overflow-hidden pb-4">
      <SectionHeader
        icon={Info}
        title="Informasi Tambahan"
        colorClass="text-amber-500"
      />
      <div className="p-6 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider flex items-center gap-2">
              <Link2 className="w-3 h-3 text-sky-400" /> Keterkaitan
            </label>
            <SmartTextarea
              value={header.keterkaitan}
              onValueChange={(val) => updateHeader("keterkaitan", val)}
              className="min-h-[100px] bg-slate-50/50 border-slate-200 focus:bg-white rounded-2xl p-4 text-sm leading-relaxed resize-none transition-all focus:ring-4 focus:ring-sky-500/5"
              placeholder="Contoh: 1. SOP Persuratan..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider flex items-center gap-2">
              <Wrench className="w-3 h-3 text-slate-400" /> Peralatan
            </label>
            <SmartTextarea
              value={header.peralatan}
              onValueChange={(val) => updateHeader("peralatan", val)}
              className="min-h-[100px] bg-slate-50/50 border-slate-200 focus:bg-white rounded-2xl p-4 text-sm leading-relaxed resize-none transition-all focus:ring-4 focus:ring-slate-500/5"
              placeholder="Contoh: 1. Komputer/Laptop..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-red-600 ml-1 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-3 h-3" /> Peringatan
            </label>
            <SmartTextarea
              value={header.peringatan}
              onValueChange={(val) => updateHeader("peringatan", val)}
              className="min-h-[80px] bg-red-50/20 border-red-100 focus:bg-white rounded-2xl p-4 text-xs italic text-red-700 resize-none transition-all focus:ring-4 focus:ring-red-500/5"
              placeholder="Contoh: 1. Berkas harus lengkap..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-600 ml-1 uppercase tracking-wider flex items-center gap-2">
              <ClipboardList className="w-3 h-3 text-slate-400" /> Pencatatan
            </label>
            <SmartTextarea
              value={header.pencatatan}
              onValueChange={(val) => updateHeader("pencatatan", val)}
              className="min-h-[80px] bg-slate-50/50 border-slate-200 focus:bg-white rounded-2xl p-4 text-xs resize-none transition-all focus:ring-4 focus:ring-slate-500/5"
              placeholder="Contoh: 1. Agenda Surat Masuk..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
