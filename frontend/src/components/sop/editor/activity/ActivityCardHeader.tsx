import React from "react";
import { Trash2, ChevronDown, ChevronUp, Copy, GripVertical, Clock } from "lucide-react";
import type { Activity, SymbolType } from "@/types/sop";
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
  dragHandleProps?: Record<string, unknown>;
}

export function ActivityCardHeader({
  act,
  index,
  isExpanded,
  onToggleExpand,
  onRemove,
  onCopy,
  SYMBOL_ICONS,
  dragHandleProps,
}: ActivityCardHeaderProps) {
  const currentSymbolLabel = SYMBOL_OPTIONS.find((o) => o.value === act.symbol)?.label || "Proses";

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 sm:p-4 cursor-pointer transition-colors select-none",
        isExpanded ? "bg-slate-50/90 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800" : "hover:bg-slate-50/50 dark:hover:bg-slate-800/30",
      )}
      onClick={() => onToggleExpand(act.id)}
    >
      {/* Drag Handle */}
      <div
        className="cursor-grab active:cursor-grabbing p-1 text-slate-300 dark:text-slate-600 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
        {...dragHandleProps}
        onClick={(e) => e.stopPropagation()}
        title="Seret untuk memindahkan urutan langkah"
      >
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Step Number Badge */}
      <div className="w-8 h-8 flex items-center justify-center bg-[#015C3A]/10 dark:bg-emerald-950/60 text-[#015C3A] dark:text-emerald-400 border border-[#015C3A]/20 dark:border-emerald-800/50 rounded-xl font-bold text-xs shrink-0 shadow-2xs tabular-nums">
        {(index + 1).toString().padStart(2, "0")}
      </div>

      {/* Main Info & Live Snippet */}
      <div className="flex-1 min-w-0 pr-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-black text-slate-800 dark:text-slate-100 tracking-tight">
            Langkah {index + 1}
          </span>

          {/* Actor Badge */}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-[#015C3A] dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/50 text-[10px] font-bold truncate max-w-[140px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="truncate">{act.roleForSymbol || "Pilih Pelaksana"}</span>
          </span>

          {/* Symbol Badge */}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 text-[10px] font-semibold">
            {React.createElement(SYMBOL_ICONS[act.symbol] || SYMBOL_ICONS.process, {
              className: "w-3 h-3 text-[#015C3A] dark:text-emerald-400 shrink-0",
            })}
            <span>{currentSymbolLabel}</span>
          </span>

          {/* Time Badge if filled */}
          {act.waktu && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/50 text-[10px] font-bold">
              <Clock className="w-3 h-3 text-amber-500" />
              <span>{act.waktu}</span>
            </span>
          )}
        </div>

        {/* Live Snippet */}
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-1 font-medium leading-tight">
          {act.kegiatan.trim() ? act.kegiatan : <span className="italic text-slate-400 dark:text-slate-500">Belum ada deskripsi aktivitas...</span>}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onCopy(act.id);
          }}
          className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#015C3A] hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all cursor-pointer"
          title="Duplikat langkah ini"
          aria-label="Duplikat langkah"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(act.id);
          }}
          className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
          title="Hapus langkah ini"
          aria-label="Hapus langkah"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        <div className="p-1 text-slate-400">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </div>
    </div>
  );
}
