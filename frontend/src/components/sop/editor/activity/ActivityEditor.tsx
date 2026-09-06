import React from "react";
import { Button } from "@/components/ui/button";
import {
  Plus,
  MoveVertical,
  CirclePlay,
  Square,
  Diamond,
  FileSymlink,
  ChevronsUpDown,
  Clock,
  Sparkles,
  Layers,
} from "lucide-react";
import type { Activity, SymbolType } from "@/types/sop";
import { ActivityCard } from "./ActivityCard";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";

const SYMBOL_ICONS: Record<SymbolType, React.ElementType> = {
  terminator: CirclePlay,
  process: Square,
  decision: Diamond,
  offpage: FileSymlink,
  "offpage-up": FileSymlink,
};

interface Props {
  activities: Activity[];
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
  roles: string[];
  expandedActivities: string[];
  setExpandedActivities: React.Dispatch<React.SetStateAction<string[]>>;
  setConfirm: (config: {
    open: boolean;
    title: string;
    desc: string;
    onConfirm: () => void;
  }) => void;
}

/**
 * Intelligent calculation of aggregated total SLA time from activities
 */
function calculateTotalTime(activities: Activity[]): string | null {
  let totalMinutes = 0;
  let totalDays = 0;
  let hasParsedTime = false;

  for (const act of activities) {
    const raw = (act.waktu || "").toLowerCase().trim();
    if (!raw) continue;

    // Match minutes (e.g. "10 Menit", "15 menit", "10 mnt")
    const minMatch = raw.match(/(\d+)\s*(menit|mnt|m)/i);
    // Match hours (e.g. "1 Jam", "2 jam", "1.5 jam")
    const hourMatch = raw.match(/(\d+(?:\.\d+)?)\s*(jam|j)/i);
    // Match days (e.g. "1 Hari", "3 hari kerja", "1 hr")
    const dayMatch = raw.match(/(\d+)\s*(hari|hr)/i);

    if (minMatch) {
      totalMinutes += parseInt(minMatch[1], 10);
      hasParsedTime = true;
    } else if (hourMatch) {
      totalMinutes += parseFloat(hourMatch[1]) * 60;
      hasParsedTime = true;
    } else if (dayMatch) {
      totalDays += parseInt(dayMatch[1], 10);
      hasParsedTime = true;
    }
  }

  if (!hasParsedTime) return null;

  const parts: string[] = [];
  if (totalDays > 0) {
    parts.push(`${totalDays} Hari`);
  }
  if (totalMinutes >= 60) {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    parts.push(`${hours} Jam${mins > 0 ? ` ${mins} Menit` : ""}`);
  } else if (totalMinutes > 0) {
    parts.push(`${totalMinutes} Menit`);
  }

  return parts.length > 0 ? parts.join(" ") : null;
}

export function ActivityEditor({
  activities,
  setActivities,
  roles,
  expandedActivities,
  setExpandedActivities,
  setConfirm,
}: Props) {
  const addActivity = (insertIndex?: number) => {
    const isFirstStep = activities.length === 0;
    const newAct: Activity = {
      id: Math.random().toString(36).substring(7),
      no: ((insertIndex !== undefined ? insertIndex : activities.length) + 1).toString(),
      kegiatan: "",
      pelaksana: [],
      persyaratan: "",
      waktu: "",
      output: "",
      keterangan: "",
      symbol: isFirstStep ? "terminator" : "process",
      roleForSymbol: roles[0] || "",
    };

    setActivities((prev) => {
      const updated = [...prev];
      if (insertIndex !== undefined) {
        updated.splice(insertIndex, 0, newAct);
      } else {
        updated.push(newAct);
      }
      return updated.map((act, i) => ({ ...act, no: (i + 1).toString() }));
    });

    setExpandedActivities([newAct.id]);
  };

  const updateActivity = (
    id: string,
    field: keyof Activity,
    value: string | string[] | SymbolType,
  ) => {
    setActivities((prev) =>
      prev.map((act) => (act.id === id ? { ...act, [field]: value } : act)),
    );
  };

  const removeActivity = (id: string) => {
    const act = activities.find((a) => a.id === id);
    setConfirm({
      open: true,
      title: "Hapus Langkah?",
      desc: `Apakah Anda yakin ingin menghapus "${act?.kegiatan || `Langkah ${act?.no}`}"? Hubungan garis alur flowchart akan disesuaikan otomatis.`,
      onConfirm: () => {
        setActivities((prev) =>
          prev
            .filter((a) => a.id !== id)
            .map((a, i) => ({ ...a, no: (i + 1).toString() })),
        );
      },
    });
  };

  const copyActivity = (id: string) => {
    const actIndex = activities.findIndex((a) => a.id === id);
    if (actIndex === -1) return;
    const actToCopy = activities[actIndex];
    const newAct: Activity = {
      ...actToCopy,
      id: Math.random().toString(36).substring(7),
    };

    setActivities((prev) => {
      const updated = [...prev];
      updated.splice(actIndex + 1, 0, newAct);
      return updated.map((act, i) => ({ ...act, no: (i + 1).toString() }));
    });
    setExpandedActivities([newAct.id]);
  };

  const toggleExpand = (id: string) => {
    setExpandedActivities((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleExpandAll = () => {
    if (expandedActivities.length === activities.length) {
      setExpandedActivities([]);
    } else {
      setExpandedActivities(activities.map((a) => a.id));
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setActivities((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        return newItems.map((act, idx) => ({
          ...act,
          no: (idx + 1).toString(),
        }));
      });
    }
  };

  const totalSLA = React.useMemo(() => calculateTotalTime(activities), [activities]);
  const isAllExpanded = activities.length > 0 && expandedActivities.length === activities.length;

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Top Banner Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-900/50 flex items-center justify-center text-[#015C3A] dark:text-emerald-400">
            <MoveVertical className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight">
                Tahapan Alur Kegiatan
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold">
                {activities.length} Langkah
              </span>
            </div>
            {totalSLA && (
              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Estimasi Total Layanan: {totalSLA}</span>
              </p>
            )}
          </div>
        </div>

        {/* Quick Toolbar */}
        <div className="flex items-center gap-2">
          {activities.length > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleExpandAll}
              className="h-9 px-3 text-xs font-bold rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <ChevronsUpDown className="w-3.5 h-3.5" />
              <span>{isAllExpanded ? "Tutup Semua" : "Buka Semua"}</span>
            </Button>
          )}

          <Button
            type="button"
            onClick={() => addActivity()}
            size="sm"
            className="h-9 px-4 text-xs font-bold rounded-xl bg-[#015C3A] text-white hover:bg-[#014A2E] cursor-pointer transition-all shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Langkah</span>
          </Button>
        </div>
      </div>

      {/* Activity Cards List */}
      <div className="space-y-3">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={activities.map((a) => a.id)}
            strategy={verticalListSortingStrategy}
          >
            {activities.map((act, index) => (
              <React.Fragment key={act.id}>
                {/* Insert Step In-Between Hover Divider */}
                {index > 0 && (
                  <div className="relative group/divider py-1 -my-2 flex items-center justify-center z-10">
                    <div className="absolute inset-x-0 h-px bg-transparent group-hover/divider:bg-emerald-300 dark:group-hover/divider:bg-emerald-800 transition-colors" />
                    <button
                      type="button"
                      onClick={() => addActivity(index)}
                      className="opacity-0 group-hover/divider:opacity-100 transition-all scale-90 group-hover/divider:scale-100 px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold shadow-md flex items-center gap-1 cursor-pointer z-20"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Sisipkan Langkah di Sini</span>
                    </button>
                  </div>
                )}

                <ActivityCard
                  act={act}
                  index={index}
                  roles={roles}
                  isExpanded={expandedActivities.includes(act.id)}
                  onToggleExpand={toggleExpand}
                  onUpdate={updateActivity}
                  onRemove={removeActivity}
                  onCopy={copyActivity}
                  SYMBOL_ICONS={SYMBOL_ICONS}
                />
              </React.Fragment>
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {/* Empty State */}
      {activities.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white/60 dark:bg-slate-900/60 p-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-900/50 flex items-center justify-center text-[#015C3A] dark:text-emerald-400 mx-auto mb-3">
            <Layers className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">
            Belum Ada Tahapan Kegiatan
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
            Mulai susun alur kerja SOP Anda dengan menambahkan langkah pertama.
          </p>
          <Button
            type="button"
            onClick={() => addActivity()}
            className="h-10 px-5 text-xs font-bold rounded-xl bg-[#015C3A] text-white hover:bg-[#014A2E] cursor-pointer shadow-xs inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Mulai Langkah Pertama</span>
          </Button>
        </div>
      )}
    </div>
  );
}
