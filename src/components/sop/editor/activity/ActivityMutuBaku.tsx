import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Activity } from "@/types/sop";

interface ActivityMutuBakuProps {
  act: Activity;
  onUpdate: (id: string, field: keyof Activity, value: string) => void;
}

export function ActivityMutuBaku({ act, onUpdate }: ActivityMutuBakuProps) {
  return (
    <div className="w-full lg:w-[280px] space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-1 h-3.5 bg-blue-500 rounded-full" />
        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
          Mutu Baku
        </span>
      </div>
      <div className="p-3 md:p-4 bg-white/50 dark:bg-slate-900/50 rounded-xl border border-slate-200/60 dark:border-slate-800/60 space-y-3 sm:space-y-4">
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 ml-0.5">
            Persyaratan
          </span>
          <Textarea
            value={act.persyaratan}
            onChange={(e) => onUpdate(act.id, "persyaratan", e.target.value)}
            placeholder="Berkas yang dibutuhkan..."
            className="min-h-[40px] sm:min-h-[50px] max-h-[80px] sm:max-h-none overflow-y-auto text-sm bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl focus-visible:ring-blue-500 focus-visible:border-blue-500 shadow-inner"
          />
        </div>
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 ml-0.5">
            Waktu
          </span>
          <Input
            value={act.waktu}
            onChange={(e) => onUpdate(act.id, "waktu", e.target.value)}
            placeholder="Misal: 10 Menit"
            className="h-9 sm:h-10 text-sm bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl focus-visible:ring-blue-500 focus-visible:border-blue-500 shadow-inner"
          />
        </div>
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 ml-0.5">
            Hasil Output
          </span>
          <Textarea
            value={act.output}
            onChange={(e) => onUpdate(act.id, "output", e.target.value)}
            placeholder="Misal: Draft SK"
            className="min-h-[40px] sm:min-h-[50px] max-h-[80px] sm:max-h-none overflow-y-auto text-sm bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl focus-visible:ring-blue-500 focus-visible:border-blue-500 shadow-inner"
          />
        </div>
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 ml-0.5">
            Keterangan
          </span>
          <Textarea
            value={act.keterangan}
            onChange={(e) => onUpdate(act.id, "keterangan", e.target.value)}
            placeholder="Catatan tambahan..."
            className="min-h-[40px] sm:min-h-[50px] max-h-[80px] sm:max-h-none overflow-y-auto text-sm bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl focus-visible:ring-blue-500 focus-visible:border-blue-500 shadow-inner"
          />
        </div>
      </div>
    </div>
  );
}
