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
    <div className="flex-1 space-y-3">
      <div className="flex items-center gap-1.5">
        <div className="w-1 h-3.5 bg-primary rounded-full" />
        <span className="text-[9px] font-semibold text-muted-foreground tracking-wide">
          Informasi Utama
        </span>
      </div>
      <div className="space-y-3">
        <div className="space-y-1">
          <span className="text-[8px] font-medium text-muted-foreground ml-0.5">
            Deskripsi Aktivitas
          </span>
          <Textarea
            value={act.kegiatan}
            onChange={(e) => onUpdate(act.id, "kegiatan", e.target.value)}
            placeholder="Apa yang dilakukan pada tahap ini?"
            className="min-h-[80px] text-sm leading-relaxed"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <span className="text-[8px] font-medium text-muted-foreground ml-0.5">
              Simbol Alur
            </span>
            <Select
              value={act.symbol}
              onValueChange={(val: SymbolType | null) => {
                if (val) onUpdate(act.id, "symbol", val);
              }}
            >
              <SelectTrigger className="h-9">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    {React.createElement(SYMBOL_ICONS[act.symbol] || Square, {
                      className: "w-3.5 h-3.5 text-primary",
                    })}
                    <span className="font-medium text-sm text-foreground">
                      {SYMBOL_OPTIONS.find((o) => o.value === act.symbol)?.label}
                    </span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="min-w-[200px]">
                {SYMBOL_OPTIONS.filter((opt) => opt.value !== "offpage").map(
                  (opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="py-2.5 px-3 focus:bg-primary/10 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-md bg-muted border border-border">
                          {React.createElement(SYMBOL_ICONS[opt.value], {
                            className: "w-3.5 h-3.5 text-muted-foreground",
                          })}
                        </div>
                        <span className="font-medium text-sm">{opt.label}</span>
                      </div>
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <span className="text-[8px] font-medium text-muted-foreground ml-0.5">
              Pelaksana Utama
            </span>
            <Select
              value={act.roleForSymbol}
              onValueChange={(val: string | null) => {
                if (val) onUpdate(act.id, "roleForSymbol", val);
              }}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Pilih Pelaksana">
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-blue-500" />
                    <span className="font-medium text-sm text-foreground truncate max-w-[100px]">
                      {act.roleForSymbol || "Pilih"}
                    </span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="min-w-[200px]">
                {roles.map((role) => (
                  <SelectItem
                    key={role}
                    value={role}
                    className="py-2.5 px-3 focus:bg-primary/10 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-md bg-muted border border-border">
                        <Users className="w-3.5 h-3.5 text-blue-500" />
                      </div>
                      <span className="font-medium text-sm">{role}</span>
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
