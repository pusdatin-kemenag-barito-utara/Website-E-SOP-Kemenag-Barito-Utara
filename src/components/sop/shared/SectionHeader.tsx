import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  colorClass?: string;
}

export function SectionHeader({
  icon: Icon,
  title,
  colorClass = "text-slate-400",
}: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-slate-50/30">
      <div
        className={cn(
          "p-2 rounded-xl bg-white shadow-sm border border-slate-100",
          colorClass,
        )}
      >
        <Icon className="w-4 h-4" />
      </div>
      <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">
        {title}
      </h3>
    </div>
  );
}
