import React from "react";
import { Activity, SymbolType } from "@/types/sop";
import { cn } from "@/lib/utils";
import { ActivityCardHeader } from "./ActivityCardHeader";
import { ActivityMainInfo } from "./ActivityMainInfo";
import { ActivityMutuBaku } from "./ActivityMutuBaku";

interface ActivityCardProps {
  act: Activity;
  index: number;
  roles: string[];
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  onUpdate: (
    id: string,
    field: keyof Activity,
    value: string | string[] | SymbolType
  ) => void;
  onRemove: (id: string) => void;
  SYMBOL_ICONS: Record<SymbolType, React.ElementType>;
}

export function ActivityCard({
  act,
  index,
  roles,
  isExpanded,
  onToggleExpand,
  onUpdate,
  onRemove,
  SYMBOL_ICONS,
}: ActivityCardProps) {
  return (
    <div className="border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden group hover:border-emerald-300 transition-all hover:shadow-md">
      <ActivityCardHeader
        act={act}
        index={index}
        isExpanded={isExpanded}
        onToggleExpand={onToggleExpand}
        onRemove={onRemove}
        SYMBOL_ICONS={SYMBOL_ICONS}
      />

      <div
        className={cn(
          "grid transition-all duration-500 ease-in-out",
          isExpanded
            ? "grid-rows-[1fr] opacity-100 mt-2"
            : "grid-rows-[0fr] opacity-0 overflow-hidden",
        )}
      >
        <div className="overflow-hidden">
          <div className="p-6 border-t border-slate-100 bg-white/50 backdrop-blur-sm">
            <div className="flex flex-col lg:flex-row gap-8">
              <ActivityMainInfo
                act={act}
                roles={roles}
                onUpdate={onUpdate}
                SYMBOL_ICONS={SYMBOL_ICONS}
              />
              <ActivityMutuBaku act={act} onUpdate={onUpdate} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
