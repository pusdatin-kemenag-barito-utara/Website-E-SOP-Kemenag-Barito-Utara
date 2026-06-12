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
      <div className="flex items-center gap-1.5">
        <div className="w-1 h-3.5 bg-blue-500 rounded-full" />
        <span className="text-[9px] font-semibold text-muted-foreground tracking-wide">
          Mutu Baku
        </span>
      </div>
      <div className="p-3 bg-muted rounded-lg border border-border space-y-3">
        <div className="space-y-1">
          <span className="text-[8px] font-medium text-muted-foreground ml-0.5">
            Persyaratan
          </span>
          <Textarea
            value={act.persyaratan}
            onChange={(e) => onUpdate(act.id, "persyaratan", e.target.value)}
            placeholder="Berkas yang dibutuhkan..."
            className="min-h-[50px] text-sm"
          />
        </div>
        <div className="space-y-1">
          <span className="text-[8px] font-medium text-muted-foreground ml-0.5">
            Waktu
          </span>
          <Input
            value={act.waktu}
            onChange={(e) => onUpdate(act.id, "waktu", e.target.value)}
            placeholder="Misal: 10 Menit"
            className="h-9 text-sm"
          />
        </div>
        <div className="space-y-1">
          <span className="text-[8px] font-medium text-muted-foreground ml-0.5">
            Hasil Output
          </span>
          <Textarea
            value={act.output}
            onChange={(e) => onUpdate(act.id, "output", e.target.value)}
            placeholder="Misal: Draft SK"
            className="min-h-[50px] text-sm"
          />
        </div>
        <div className="space-y-1">
          <span className="text-[8px] font-medium text-muted-foreground ml-0.5">
            Keterangan
          </span>
          <Textarea
            value={act.keterangan}
            onChange={(e) => onUpdate(act.id, "keterangan", e.target.value)}
            placeholder="Catatan tambahan..."
            className="min-h-[50px] text-sm"
          />
        </div>
      </div>
    </div>
  );
}
