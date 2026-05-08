import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Activity, SymbolType } from "@/types/sop";
import { SYMBOL_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ActivityCardHeaderProps {
  act: Activity;
  index: number;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  onRemove: (id: string) => void;
  SYMBOL_ICONS: Record<SymbolType, React.ElementType>;
}

export function ActivityCardHeader({
  act,
  index,
  isExpanded,
  onToggleExpand,
  onRemove,
  SYMBOL_ICONS,
}: ActivityCardHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 cursor-pointer transition-colors",
        isExpanded ? "bg-slate-50" : "bg-white hover:bg-slate-50/50",
      )}
      onClick={() => onToggleExpand(act.id)}
    >
      <div className="w-10 h-10 flex items-center justify-center bg-emerald-600 text-white rounded-xl font-black text-sm shadow-sm shadow-emerald-200">
        {index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-700">Langkah {index + 1}</p>
        <div className="flex gap-3 mt-1.5">
          <div className="flex items-center gap-1">
            {React.createElement(SYMBOL_ICONS[act.symbol], {
              className: "w-3 h-3 text-emerald-500",
            })}
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              {SYMBOL_OPTIONS.find((o) => o.value === act.symbol)?.label}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              {act.roleForSymbol || "Pelaksana"}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(act.id);
          }}
          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
        <div className="p-1">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </div>
    </div>
  );
}
