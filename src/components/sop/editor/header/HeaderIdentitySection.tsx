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
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <SectionHeader
        icon={Fingerprint}
        title="Identitas & Pengesahan"
        colorClass="text-emerald-500"
      />

      <div className="p-4 space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-semibold text-muted-foreground ml-0.5 tracking-wide flex items-center gap-1.5">
            <FileText className="w-3 h-3 text-emerald-500" /> Nama Prosedur (SOP)
          </label>
          <Input
            value={header.namaSOP}
            onChange={(e) => updateHeader("namaSOP", e.target.value)}
            className={cn(
              "h-9 font-medium",
              isDefaultName ? "text-muted-foreground" : "text-foreground",
            )}
            placeholder="Masukkan judul SOP..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-muted-foreground ml-0.5 tracking-wide flex items-center gap-1.5">
              <BadgeCheck className="w-3 h-3 text-blue-500" /> Nomor SOP
            </label>
            <Input
              value={header.nomor}
              onChange={(e) => updateHeader("nomor", e.target.value)}
              className={cn(
                "h-9",
                isDefaultNomor ? "text-muted-foreground" : "text-foreground",
              )}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-muted-foreground ml-0.5 tracking-wide flex items-center gap-1.5">
              <UserCheck className="w-3 h-3 text-orange-500" /> Jabatan Pengesah
            </label>
            <Input
              value={header.disahkanOleh}
              onChange={(e) => updateHeader("disahkanOleh", e.target.value)}
              className="h-9"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-border">
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-muted-foreground ml-0.5 tracking-wide">
              Nama Pejabat
            </label>
            <Input
              value={header.pejabatNama}
              onChange={(e) => updateHeader("pejabatNama", e.target.value)}
              className="h-9"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-muted-foreground ml-0.5 tracking-wide">
              NIP Pejabat
            </label>
            <Input
              value={header.pejabatNip}
              onChange={(e) => updateHeader("pejabatNip", e.target.value)}
              className="h-9 font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
