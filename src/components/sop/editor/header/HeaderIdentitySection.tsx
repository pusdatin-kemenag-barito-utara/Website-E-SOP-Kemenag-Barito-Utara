import React from "react";
import { Input } from "@/components/ui/input";
import { SOPHeader as SOPHeaderType } from "@/types/sop";
import { Fingerprint, FileText, BadgeCheck, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEFAULT_HEADER } from "@/lib/constants";
import { SectionHeader } from "../../shared/SectionHeader";

interface HeaderIdentitySectionProps {
  header: SOPHeaderType;
  updateHeader: (key: keyof SOPHeaderType, value: string) => void;
}

export function HeaderIdentitySection({
  header,
  updateHeader,
}: HeaderIdentitySectionProps) {
  const isDefaultName = header.namaSOP === DEFAULT_HEADER.namaSOP;
  const isDefaultNomor = header.nomor === DEFAULT_HEADER.nomor;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      <SectionHeader
        icon={Fingerprint}
        title="Identitas & Pengesahan"
        colorClass="text-[#015C3A] dark:text-emerald-400"
      />

      <div className="p-5 md:p-6 space-y-5">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-200 ml-1 tracking-wide flex items-center gap-1.5 mb-1.5">
            <FileText className="w-4 h-4 text-[#015C3A]" /> Nama Prosedur (SOP)
          </label>
          <Input
            value={header.namaSOP}
            onChange={(e) => updateHeader("namaSOP", e.target.value)}
            className={cn(
              "h-12 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus-visible:ring-2 focus-visible:ring-[#015C3A]/20 focus-visible:bg-white focus-visible:border-[#015C3A] transition-all font-semibold text-slate-800 dark:text-slate-100 px-4 shadow-inner",
              isDefaultName && "text-slate-400 italic font-medium",
            )}
            placeholder="Masukan judul SOP ..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200 ml-1 tracking-wide flex items-center gap-1.5 mb-1.5">
              <BadgeCheck className="w-4 h-4 text-blue-500" /> Nomor SOP
            </label>
            <Input
              value={header.nomor}
              onChange={(e) => updateHeader("nomor", e.target.value)}
              className={cn(
                "h-12 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus-visible:ring-2 focus-visible:ring-[#015C3A]/20 focus-visible:bg-white focus-visible:border-[#015C3A] transition-all font-semibold text-slate-800 dark:text-slate-100 px-4 shadow-inner",
                isDefaultNomor && "text-slate-400 italic font-medium",
              )}
              placeholder="Masukan Nomor Surat .."
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200 ml-1 tracking-wide flex items-center gap-1.5 mb-1.5">
              <UserCheck className="w-4 h-4 text-amber-500" /> Jabatan Pengesah
            </label>
            <Input
              value={header.disahkanOleh}
              onChange={(e) => updateHeader("disahkanOleh", e.target.value)}
              className="h-12 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus-visible:ring-2 focus-visible:ring-[#015C3A]/20 focus-visible:bg-white focus-visible:border-[#015C3A] transition-all font-semibold text-slate-800 dark:text-slate-100 px-4 shadow-inner"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-5 border-t border-slate-100 dark:border-slate-800 mt-2">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200 ml-1 tracking-wide mb-1.5 block">
              Nama Pejabat
            </label>
            <Input
              value={header.pejabatNama}
              onChange={(e) => updateHeader("pejabatNama", e.target.value)}
              className="h-12 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus-visible:ring-2 focus-visible:ring-[#015C3A]/20 focus-visible:bg-white focus-visible:border-[#015C3A] transition-all font-semibold text-slate-800 dark:text-slate-100 px-4 shadow-inner"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-200 ml-1 tracking-wide mb-1.5 block">
              NIP Pejabat
            </label>
            <Input
              value={header.pejabatNip}
              onChange={(e) => updateHeader("pejabatNip", e.target.value)}
              className="h-12 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus-visible:ring-2 focus-visible:ring-[#015C3A]/20 focus-visible:bg-white focus-visible:border-[#015C3A] transition-all font-semibold text-slate-800 dark:text-slate-100 px-4 shadow-inner font-mono tracking-wider"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
