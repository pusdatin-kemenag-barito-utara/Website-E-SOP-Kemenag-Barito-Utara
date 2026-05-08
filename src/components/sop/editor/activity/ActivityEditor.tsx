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
}

export function ActivityEditor({
  activities,
  setActivities,
  roles,
  expandedActivities,
  setExpandedActivities,
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
    setActivities((prev) =>
      prev
        .filter((act) => act.id !== id)
        .map((act, i) => ({ ...act, no: (i + 1).toString() })),
    );
  };

  const toggleExpand = (id: string) => {
    setExpandedActivities((prev) => (prev.includes(id) ? [] : [id]));
  };

  return (
    <div className="p-4 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center bg-emerald-50 p-4 rounded-2xl border border-emerald-100 shadow-sm">
        <div>
          <h3 className="font-black text-emerald-900 flex items-center gap-2 text-sm uppercase tracking-wider">
            <MoveVertical className="w-4 h-4 text-emerald-600" />
            Tahapan Kegiatan
          </h3>
          <p className="text-[10px] text-emerald-600 font-bold ml-6 uppercase opacity-70">
            Total {activities.length} Langkah
          </p>
        </div>
        <Button
          onClick={addActivity}
          size="sm"
          className="bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-200"
        >
          <Plus className="w-4 h-4 mr-2" /> TAMBAH
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
        <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/50 animate-pulse">
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">
            Klik TAMBAH untuk memulai tahapan
          </p>
        </div>
      )}
    </div>
  );
}
