import React from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Square } from "lucide-react";
import { Activity, SymbolType } from "@/types/sop";
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
    <div className="flex-1 space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
            Informasi Utama
          </label>
        </div>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <span className="text-[9px] font-bold text-slate-400 uppercase ml-1">
              Deskripsi Aktivitas
            </span>
            <Textarea
              value={act.kegiatan}
              onChange={(e) => onUpdate(act.id, "kegiatan", e.target.value)}
              placeholder="Apa yang dilakukan pada tahap ini?"
              className="h-[100px] bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10 transition-all resize-none rounded-xl text-sm leading-relaxed p-4"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase ml-1">
                Simbol Alur
              </span>
              <Select
                value={act.symbol}
                onValueChange={(val: SymbolType | null) => {
                  if (val) onUpdate(act.id, "symbol", val);
                }}
              >
                <SelectTrigger className="h-10 bg-white border-slate-200 hover:border-emerald-300 transition-colors rounded-xl">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      {React.createElement(SYMBOL_ICONS[act.symbol] || Square, {
                        className: "w-4 h-4 text-emerald-600",
                      })}
                      <span className="font-bold text-slate-700 text-sm">
                        {
                          SYMBOL_OPTIONS.find((o) => o.value === act.symbol)
                            ?.label
                        }
                      </span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 shadow-2xl z-[9999] min-w-[200px] rounded-xl">
                  {SYMBOL_OPTIONS.filter((opt) => opt.value !== "offpage").map(
                    (opt) => (
                      <SelectItem
                        key={opt.value}
                        value={opt.value}
                        className="py-3 px-4 focus:bg-emerald-50 focus:text-emerald-900 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                            {React.createElement(SYMBOL_ICONS[opt.value], {
                              className: "w-4 h-4 text-slate-500",
                            })}
                          </div>
                          <span className="font-bold text-sm">{opt.label}</span>
                        </div>
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase ml-1">
                Pelaksana Utama
              </span>
              <Select
                value={act.roleForSymbol}
                onValueChange={(val: string | null) => {
                  if (val) onUpdate(act.id, "roleForSymbol", val);
                }}
              >
                <SelectTrigger className="h-10 bg-white border-slate-200 hover:border-blue-300 transition-colors rounded-xl">
                  <SelectValue placeholder="Pilih Pelaksana">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-500" />
                      <span className="font-bold text-slate-700 text-sm truncate max-w-[120px]">
                        {act.roleForSymbol || "Pilih Pelaksana"}
                      </span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 shadow-2xl z-[9999] min-w-[240px] rounded-xl">
                  {roles.map((role) => (
                    <SelectItem
                      key={role}
                      value={role}
                      className="py-3 px-4 focus:bg-blue-50 focus:text-blue-900 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                          <Users className="w-4 h-4 text-blue-500" />
                        </div>
                        <span className="font-bold text-sm">{role}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
