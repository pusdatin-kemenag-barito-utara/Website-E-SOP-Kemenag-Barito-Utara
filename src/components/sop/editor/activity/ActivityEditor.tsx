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
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center bg-primary/5 border border-primary/10 rounded-xl p-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <MoveVertical className="w-4 h-4 text-primary" />
            Tahapan Kegiatan
          </h3>
          <p className="text-[9px] text-muted-foreground font-medium ml-6 mt-0.5">
            {activities.length} langkah
          </p>
        </div>
        <Button
          onClick={addActivity}
          size="sm"
          variant="gradient"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Tambah
        </Button>
      </div>

      <div className="space-y-3">
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
        <div className="text-center py-16 border-2 border-dashed border-border rounded-xl bg-muted/20">
          <p className="text-xs font-medium text-muted-foreground">
            Klik Tambah untuk memulai tahapan
          </p>
        </div>
      )}
    </div>
  );
}
