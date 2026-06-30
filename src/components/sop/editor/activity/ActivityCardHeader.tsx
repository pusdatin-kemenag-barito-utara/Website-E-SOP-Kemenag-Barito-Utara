import React from "react";
import { Trash2, ChevronDown, ChevronUp, Copy } from "lucide-react";
import { Activity, SymbolType } from "@/types/sop";
import { SYMBOL_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ActivityCardHeaderProps {
  act: Activity;
  index: number;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  onRemove: (id: string) => void;
  onCopy: (id: string) => void;
  SYMBOL_ICONS: Record<SymbolType, React.ElementType>;
}

export function ActivityCardHeader({
  act,
  index,
  isExpanded,
  onToggleExpand,
  onRemove,
  onCopy,
  SYMBOL_ICONS,
}: ActivityCardHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 md:p-4 cursor-pointer transition-colors",
        isExpanded ? "bg-slate-50/80 dark:bg-slate-800/50" : "hover:bg-slate-50/50 dark:hover:bg-slate-800/30",
      )}
      onClick={() => onToggleExpand(act.id)}
    >
      <div className="w-8 h-8 flex items-center justify-center bg-[#015C3A]/10 dark:bg-[#015C3A]/20 text-[#015C3A] dark:text-emerald-400 rounded-lg font-bold text-xs shrink-0">
        {index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">Langkah {index + 1}</p>
        <div className="flex gap-3 mt-0.5">
          <div className="flex items-center gap-1">
            {React.createElement(SYMBOL_ICONS[act.symbol], {
              className: "w-2.5 h-2.5 text-primary",
            })}
            <span className="text-[8px] font-medium text-muted-foreground tracking-wide">
              {SYMBOL_OPTIONS.find((o) => o.value === act.symbol)?.label}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 rounded-full bg-blue-500" />
            <span className="text-[8px] font-medium text-muted-foreground tracking-wide">
              {act.roleForSymbol || "Pelaksana"}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCopy(act.id);
          }}
          className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all"
          title="Duplikat langkah"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(act.id);
          }}
          className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
          title="Hapus langkah"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
        <div className="p-0.5 text-muted-foreground">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </div>
    </div>
  );
}
