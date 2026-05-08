import React from "react";
import { Input } from "@/components/ui/input";
import { SOPHeader as SOPHeaderType } from "@/types/sop";
import { Fingerprint, FileText, BadgeCheck, UserCheck } from "lucide-react";
import { SectionHeader } from "../../shared/SectionHeader";

interface HeaderIdentitySectionProps {
  header: SOPHeaderType;
  updateHeader: (key: keyof SOPHeaderType, value: string) => void;
}

export function HeaderIdentitySection({
  header,
  updateHeader,
}: HeaderIdentitySectionProps) {
  return (
    <div className="group bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-100/50 hover:border-emerald-100">
      <SectionHeader
        icon={Fingerprint}
        title="Identitas & Pengesahan"
        colorClass="text-emerald-500"
      />

      <div className="p-6 space-y-6">
        <div className="space-y-2 group/field">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-3 h-3 text-emerald-500" /> Nama Prosedur
              (SOP)
            </label>
          </div>
          <Input
            value={header.namaSOP}
            onChange={(e) => updateHeader("namaSOP", e.target.value)}
            className="h-12 bg-slate-50/50 border-slate-200 font-bold text-slate-800 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all rounded-xl px-4"
            placeholder="Masukkan judul SOP..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider flex items-center gap-2">
              <BadgeCheck className="w-3 h-3 text-blue-500" /> Nomor SOP
            </label>
            <Input
              value={header.nomor}
              onChange={(e) => updateHeader("nomor", e.target.value)}
              className="h-11 bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 transition-all rounded-xl px-4 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider flex items-center gap-2">
              <UserCheck className="w-3 h-3 text-orange-500" /> Jabatan Pengesah
            </label>
            <Input
              value={header.disahkanOleh}
              onChange={(e) => updateHeader("disahkanOleh", e.target.value)}
              className="h-11 bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-orange-500/5 focus:border-orange-400 transition-all rounded-xl px-4 text-sm font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 pt-2 border-t border-slate-50">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">
              Nama Pejabat
            </label>
            <Input
              value={header.pejabatNama}
              onChange={(e) => updateHeader("pejabatNama", e.target.value)}
              className="h-11 bg-slate-50/50 border-slate-200 focus:bg-white transition-all rounded-xl px-4 text-sm font-semibold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 ml-1 uppercase tracking-wider">
              NIP Pejabat
            </label>
            <Input
              value={header.pejabatNip}
              onChange={(e) => updateHeader("pejabatNip", e.target.value)}
              className="h-11 bg-slate-50/50 border-slate-200 focus:bg-white transition-all rounded-xl px-4 text-sm font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
