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
    <div className="w-full lg:w-[280px] space-y-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
            Mutu Baku
          </label>
        </div>
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <div className="space-y-1.5">
            <span className="text-[9px] font-bold text-slate-400 uppercase ml-1">
              Persyaratan
            </span>
            <Textarea
              value={act.persyaratan}
              onChange={(e) => onUpdate(act.id, "persyaratan", e.target.value)}
              placeholder="Berkas yang dibutuhkan..."
              className="min-h-[60px] bg-white border-slate-200 rounded-lg text-sm font-medium resize-none transition-all focus:ring-4 focus:ring-blue-500/5"
            />
          </div>
          <div className="space-y-1.5">
            <span className="text-[9px] font-bold text-slate-400 uppercase ml-1">
              Waktu
            </span>
            <Input
              value={act.waktu}
              onChange={(e) => onUpdate(act.id, "waktu", e.target.value)}
              placeholder="Misal: 10 Menit"
              className="h-10 bg-white border-slate-200 rounded-lg text-sm font-medium"
            />
          </div>
          <div className="space-y-1.5">
            <span className="text-[9px] font-bold text-slate-400 uppercase ml-1">
              Hasil Output
            </span>
            <Textarea
              value={act.output}
              onChange={(e) => onUpdate(act.id, "output", e.target.value)}
              placeholder="Misal: Draft SK"
              className="min-h-[60px] bg-white border-slate-200 rounded-lg text-sm font-medium resize-none transition-all focus:ring-4 focus:ring-blue-500/5"
            />
          </div>
          <div className="space-y-1.5">
            <span className="text-[9px] font-bold text-slate-400 uppercase ml-1">
              Keterangan
            </span>
            <Textarea
              value={act.keterangan}
              onChange={(e) => onUpdate(act.id, "keterangan", e.target.value)}
              placeholder="Catatan tambahan (Opsional)..."
              className="min-h-[60px] bg-white border-slate-200 rounded-lg text-sm font-medium resize-none transition-all focus:ring-4 focus:ring-blue-500/5"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
