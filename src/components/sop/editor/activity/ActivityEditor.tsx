import React from "react";
import { Button } from "@/components/ui/button";
import {
  Plus,
  MoveVertical,
  CirclePlay,
  Square,
  Diamond,
  FileSymlink,
} from "lucide-react";
import { Activity, SymbolType } from "@/types/sop";
import { ActivityCard } from "./ActivityCard";

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

export function ActivityEditor({
  activities,
  setActivities,
  roles,
  expandedActivities,
  setExpandedActivities,
  setConfirm,
}: Props) {
  const addActivity = () => {
    const newAct: Activity = {
      id: Math.random().toString(36).substring(7),
      no: (activities.length + 1).toString(),
      kegiatan: "",
      pelaksana: [],
      persyaratan: "",
      waktu: "",
      output: "",
      keterangan: "",
      symbol: "process",
      roleForSymbol: roles[0] || "",
    };
    setActivities([...activities, newAct]);
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
      desc: `Apakah Anda yakin ingin menghapus "${act?.kegiatan || `Langkah ${act?.no}`}"? Tindakan ini tidak bisa dibatalkan.`,
      onConfirm: () => {
        setActivities((prev) =>
          prev
            .filter((act) => act.id !== id)
            .map((act, i) => ({ ...act, no: (i + 1).toString() })),
        );
      },
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedActivities((prev) => (prev.includes(id) ? [] : [id]));
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <MoveVertical className="w-5 h-5 text-slate-800 dark:text-slate-200" />
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-wide">Tahapan Kegiatan</h3>
            <p className="text-xs text-slate-500 font-medium leading-none mt-1.5">
              {activities.length} langkah
            </p>
          </div>
        </div>
        <Button
          onClick={addActivity}
          size="sm"
          className="h-9 px-5 text-xs font-bold rounded-lg bg-[#015C3A] text-white hover:bg-[#014A2E]"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Tambah
        </Button>
      </div>

      <div className="space-y-4">
        {activities.map((act, index) => (
          <ActivityCard
            key={act.id}
            act={act}
            index={index}
            roles={roles}
            isExpanded={expandedActivities.includes(act.id)}
            onToggleExpand={toggleExpand}
            onUpdate={updateActivity}
            onRemove={removeActivity}
            SYMBOL_ICONS={SYMBOL_ICONS}
          />
        ))}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl bg-white/50 dark:bg-slate-900/50">
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
            Klik Tambah untuk memulai tahapan
          </p>
        </div>
      )}
    </div>
  );
}
