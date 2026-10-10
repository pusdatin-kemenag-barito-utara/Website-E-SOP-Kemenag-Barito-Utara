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
            value={act.kegiatan || ""}
            onChange={(e) => onUpdate(act.id, "kegiatan", e.target.value)}
            placeholder="Apa yang dilakukan pada tahap ini?"
            className="min-h-[80px] max-h-[120px] md:max-h-none overflow-y-auto text-sm leading-relaxed bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 rounded-xl focus-visible:ring-[#015C3A] focus-visible:border-[#015C3A]"
          />
          {act.symbol === "decision" &&
            !(act.kegiatan || "").toLowerCase().includes("ya") &&
            !(act.kegiatan || "").toLowerCase().includes("tidak") && (
              <div className="mt-2 flex gap-2 items-start bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 p-2.5 rounded-lg border border-amber-200 dark:border-amber-900/50">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <p className="text-[11px] leading-tight">
                  <strong className="font-bold">Perhatian:</strong> Simbol Keputusan membutuhkan alur bercabang. Pastikan Anda menyebutkan (Ya/Tidak) di dalam deskripsi atau ada cabang di alur aslinya.
                </p>
              </div>
            )}
        </div>
        {/* Dropdowns: Simbol Alur & Pelaksana Utama */}
        <div className="space-y-3.5">
          {/* Simbol Alur */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 ml-0.5">
              Simbol Alur
            </span>
            <Select
              value={act.symbol || "process"}
              onValueChange={(val: SymbolType | null) => {
                if (val) onUpdate(act.id, "symbol", val);
              }}
            >
              <SelectTrigger className="w-full h-11 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700 rounded-xl focus:ring-[#015C3A] px-3 justify-between shadow-2xs hover:border-slate-300 dark:hover:border-slate-600 transition-all text-left">
                <SelectValue>
                  <div className="flex items-center gap-2.5 min-w-0 pr-1">
                    <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/70 dark:border-emerald-800/80 flex items-center justify-center shrink-0">
                      {React.createElement(SYMBOL_ICONS[act.symbol] || Square, {
                        className: "w-3.5 h-3.5 text-[#015C3A] dark:text-emerald-400",
                      })}
                    </div>
                    <span className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 truncate">
                      {SYMBOL_OPTIONS.find((o) => o.value === act.symbol)?.label || "Proses"}
                    </span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent
                align="start"
                alignItemWithTrigger={false}
                className="w-[var(--anchor-width)] min-w-[280px] sm:min-w-[340px] max-w-[90vw] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-50 border border-slate-200/80 dark:border-slate-700 rounded-2xl shadow-xl overflow-y-auto max-h-[300px] p-1.5"
              >
                {SYMBOL_OPTIONS.filter((opt) => opt.value !== "offpage").map(
                  (opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="py-2.5 px-3 focus:bg-emerald-50 dark:focus:bg-emerald-950/30 cursor-pointer rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-6">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[#015C3A] dark:text-emerald-400 shrink-0">
                          {React.createElement(SYMBOL_ICONS[opt.value], {
                            className: "w-3.5 h-3.5",
                          })}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100">
                            {opt.label}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                            {opt.value === "terminator"
                              ? "Awal / Akhir Prosedur"
                              : opt.value === "decision"
                              ? "Percabangan / Validasi (Ya/Tidak)"
                              : "Aktivitas / Pemrosesan Kerja"}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Pelaksana Utama */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 ml-0.5">
              Pelaksana Utama
            </span>
            <Select
              value={act.roleForSymbol || ""}
              onValueChange={(val: string | null) => {
                if (val) onUpdate(act.id, "roleForSymbol", val);
              }}
            >
              <SelectTrigger className="w-full h-11 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700 rounded-xl focus:ring-[#015C3A] px-3 justify-between shadow-2xs hover:border-slate-300 dark:hover:border-slate-600 transition-all text-left">
                <SelectValue placeholder="Pilih Pelaksana">
                  <div className="flex items-center gap-2.5 min-w-0 pr-1">
                    <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/70 dark:border-emerald-800/80 flex items-center justify-center shrink-0">
                      <Users className="w-3.5 h-3.5 text-[#015C3A] dark:text-emerald-400" />
                    </div>
                    <span className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 truncate">
                      {act.roleForSymbol || "Pilih Pelaksana"}
                    </span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent
                align="start"
                alignItemWithTrigger={false}
                className="w-[var(--anchor-width)] min-w-[280px] sm:min-w-[340px] max-w-[90vw] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-50 border border-slate-200/80 dark:border-slate-700 rounded-2xl shadow-xl overflow-y-auto max-h-[300px] p-1.5"
              >
                {(roles || []).map((role) => (
                  <SelectItem
                    key={role}
                    value={role}
                    className="py-2.5 px-3 focus:bg-emerald-50 dark:focus:bg-emerald-950/30 cursor-pointer rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-6">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800 flex items-center justify-center text-[#015C3A] dark:text-emerald-400 shrink-0">
                        <Users className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 whitespace-normal leading-snug">
                        {role}
                      </span>
                    </div>
                  </SelectItem>
                ))}
                {(roles || []).length === 0 && (
                  <div className="py-4 px-3 text-center text-xs font-medium text-slate-400">
                    Belum ada pelaksana. Tambahkan di tab Pelaksana.
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
