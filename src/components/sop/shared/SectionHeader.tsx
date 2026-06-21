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
  colorClass = "text-muted-foreground",
}: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3 px-5 md:px-6 py-4 border-b border-slate-100 dark:border-slate-800/60 bg-transparent">
      <div
        className={cn(
          "p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-current shadow-sm",
          colorClass,
        )}
      >
        <Icon className="w-4 h-4" />
      </div>
      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-wide">
        {title}
      </h3>
    </div>
  );
}
