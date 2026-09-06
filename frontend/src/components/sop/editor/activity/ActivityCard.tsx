import React from "react";
import type { Activity, SymbolType } from "@/types/sop";
import { cn } from "@/lib/utils";
import { ActivityCardHeader } from "./ActivityCardHeader";
import { ActivityMainInfo } from "./ActivityMainInfo";
import { ActivityMutuBaku } from "./ActivityMutuBaku";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ActivityCardProps {
  act: Activity;
  index: number;
  roles: string[];
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  onUpdate: (
    id: string,
    field: keyof Activity,
    value: string | string[] | SymbolType,
  ) => void;
  onRemove: (id: string) => void;
  onCopy: (id: string) => void;
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
  onCopy,
  SYMBOL_ICONS,
}: ActivityCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: act.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    position: "relative" as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden group transition-all hover:shadow-sm",
        isDragging && "opacity-50 ring-2 ring-[#015C3A] ring-offset-2",
      )}
    >
      <ActivityCardHeader
        act={act}
        index={index}
        isExpanded={isExpanded}
        onToggleExpand={onToggleExpand}
        onRemove={onRemove}
        onCopy={onCopy}
        SYMBOL_ICONS={SYMBOL_ICONS}
        dragHandleProps={{ ...attributes, ...listeners }}
      />

      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isExpanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0 overflow-hidden",
        )}
      >
        <div className="overflow-hidden">
          <div className="p-4 md:p-6 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/20">
            <div className="flex flex-col lg:flex-row gap-6">
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
