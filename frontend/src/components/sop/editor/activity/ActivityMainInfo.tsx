import React from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Square, AlertTriangle } from "lucide-react";
import type { Activity, SymbolType } from "@/types/sop";
import { SYMBOL_OPTIONS } from "@/lib/constants";

interface ActivityMainInfoProps {
  act: Activity;
  roles: string[];
  onUpdate: (
    id: string,
    field: keyof Activity,
    value: string | string[] | SymbolType,
  ) => void;
  SYMBOL_ICONS: Record<SymbolType, React.ElementType>;
}

export function ActivityMainInfo({
  act,
  roles,
  onUpdate,
  SYMBOL_ICONS,
}: ActivityMainInfoProps) {
  return (
    <div className="flex-1 space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-1 h-3.5 bg-[#015C3A] dark:bg-[#015C3A]/80 rounded-full" />
        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
          Informasi Utama
        </span>
      </div>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 ml-0.5">
            Deskripsi Aktivitas
          </span>
          <Textarea
            id={`kegiatan-${act.id}`}
            name={`kegiatan-${act.id}`}
            value={act.kegiatan}
            onChange={(e) => onUpdate(act.id, "kegiatan", e.target.value)}
            placeholder="Apa yang dilakukan pada tahap ini?"
            className="min-h-[80px] max-h-[120px] md:max-h-none overflow-y-auto text-sm leading-relaxed bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl focus-visible:ring-[#015C3A] focus-visible:border-[#015C3A]"
          />
          {act.symbol === "decision" &&
            !act.kegiatan.toLowerCase().includes("ya") &&
            !act.kegiatan.toLowerCase().includes("tidak") && (
              <div className="mt-2 flex gap-2 items-start bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 p-2.5 rounded-lg border border-amber-200 dark:border-amber-900/50">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <p className="text-[11px] leading-tight">
                  <strong className="font-bold">Perhatian:</strong> Simbol Keputusan membutuhkan alur bercabang. Pastikan Anda menyebutkan (Ya/Tidak) di dalam deskripsi atau ada cabang di alur aslinya.
                </p>
              </div>
            )}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 ml-0.5">
              Simbol Alur
            </span>
            <Select
              value={act.symbol}
              onValueChange={(val: SymbolType | null) => {
                if (val) onUpdate(act.id, "symbol", val);
              }}
            >
              <SelectTrigger className="h-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-[#015C3A]">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    {React.createElement(SYMBOL_ICONS[act.symbol] || Square, {
                      className: "w-4 h-4 text-[#015C3A] dark:text-emerald-400",
                    })}
                    <span className="font-medium text-sm text-foreground">
                      {SYMBOL_OPTIONS.find((o) => o.value === act.symbol)?.label}
                    </span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false} className="min-w-[200px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-50 border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-xl overflow-hidden p-2">
                {SYMBOL_OPTIONS.filter((opt) => opt.value !== "offpage").map(
                  (opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="py-2.5 px-3 focus:bg-[#015C3A]/5 dark:focus:bg-[#015C3A]/20 cursor-pointer rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
                          {React.createElement(SYMBOL_ICONS[opt.value], {
                            className: "w-4 h-4 text-[#015C3A] dark:text-emerald-400",
                          })}
                        </div>
                        <span className="font-semibold text-sm text-slate-700 dark:text-slate-200 tracking-wide">{opt.label}</span>
                      </div>
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 ml-0.5">
              Pelaksana Utama
            </span>
            <Select
              value={act.roleForSymbol}
              onValueChange={(val: string | null) => {
                if (val) onUpdate(act.id, "roleForSymbol", val);
              }}
            >
              <SelectTrigger className="h-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-[#015C3A]">
                <SelectValue placeholder="Pilih Pelaksana">
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-[#015C3A]" />
                    <span className="font-medium text-sm text-foreground truncate max-w-[100px]">
                      {act.roleForSymbol || "Pilih"}
                    </span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false} className="min-w-[200px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-50 border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-xl overflow-hidden p-2">
                {roles.map((role) => (
                  <SelectItem
                    key={role}
                    value={role}
                    className="py-2.5 px-3 focus:bg-emerald-50 dark:focus:bg-emerald-950/20 cursor-pointer rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
                        <Users className="w-4 h-4 text-[#015C3A]" />
                      </div>
                      <span className="font-semibold text-sm text-slate-700 dark:text-slate-200 tracking-wide">{role}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
