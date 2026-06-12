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
    <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-muted">
      <div
        className={cn(
          "p-1.5 rounded-lg bg-background border border-border",
          colorClass,
        )}
      >
        <Icon className="w-3.5 h-3.5" />
      </div>
      <h3 className="text-[10px] font-semibold tracking-wide text-muted-foreground">
        {title}
      </h3>
    </div>
  );
}
