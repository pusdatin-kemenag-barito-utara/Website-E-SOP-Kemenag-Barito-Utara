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
  colorClass,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3 px-5 md:px-6 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
      <div
        className={cn(
          "p-1.5 rounded-lg bg-[#015C3A]/10 border border-[#015C3A]/20 text-[#015C3A] dark:text-emerald-400 shrink-0",
          colorClass,
        )}
      >
        <Icon className="w-4 h-4" />
      </div>
      <h3 className="text-xs md:text-sm font-bold text-slate-800 dark:text-slate-100 tracking-wide">
        {title}
      </h3>
    </div>
  );
}
