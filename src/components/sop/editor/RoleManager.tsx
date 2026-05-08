import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Users,
  ChevronUp,
  ChevronDown,
  Trash2,
  List,
  GripVertical,
} from "lucide-react";
import { Activity } from "@/types/sop";

interface Props {
  roles: string[];
  setRoles: React.Dispatch<React.SetStateAction<string[]>>;
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
  setConfirm: (config: {
    open: boolean;
    title: string;
    desc: string;
    onConfirm: () => void;
  }) => void;
}

export function RoleManager({
  roles,
  setRoles,
  setActivities,
  setConfirm,
}: Props) {
  const [newRole, setNewRole] = useState("");

  const addRole = () => {
    if (newRole.trim() && !roles.includes(newRole.trim())) {
      setRoles((prev) => [...prev, newRole.trim()]);
      setNewRole("");
    }
  };

  const removeRole = (roleToRemove: string) => {
    setConfirm({
      open: true,
      title: "Hapus Pelaksana?",
      desc: `Apakah Anda yakin ingin menghapus "${roleToRemove}" dari daftar pelaksana?`,
      onConfirm: () => {
        setRoles((prev) => prev.filter((r) => r !== roleToRemove));
        setActivities((prev) =>
          prev.map((act) => ({
            ...act,
            pelaksana: act.pelaksana.filter((r) => r !== roleToRemove),
            roleForSymbol:
              act.roleForSymbol === roleToRemove ? "" : act.roleForSymbol,
          })),
        );
      },
    });
  };

  const moveRole = (index: number, direction: "up" | "down") => {
    const newRoles = [...roles];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex >= 0 && targetIndex < roles.length) {
      [newRoles[index], newRoles[targetIndex]] = [
        newRoles[targetIndex],
        newRoles[index],
      ];
      setRoles(newRoles);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm max-w-4xl mx-auto">
      <div className="p-4 space-y-4">
        {/* COMPACT ADD ROLE */}
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <div className="ml-2 text-slate-400">
            <Plus className="w-4 h-4" />
          </div>
          <Input
            placeholder="Tambah pelaksana baru..."
            className="h-8 border-none bg-transparent focus-visible:ring-0 text-xs font-semibold"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addRole()}
          />
          <Button
            size="sm"
            className="h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] rounded-lg"
            onClick={addRole}
          >
            TAMBAH
          </Button>
        </div>

        {/* COMPACT LIST */}
        <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-50">
          <div className="bg-slate-50/50 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <List className="w-3 h-3" />
              Daftar Pelaksana ({roles.length})
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {roles.map((role, index) => (
              <div
                key={role}
                className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50/50 transition-colors group border-b border-slate-50 last:border-0"
              >
                {/* GRIP HANDLE - ALWAYS VISIBLE */}
                <div className="flex items-center text-slate-300 cursor-ns-resize">
                  <GripVertical className="w-4 h-4" />
                </div>

                <span className="text-[10px] font-black text-slate-300 w-4">
                  {(index + 1).toString().padStart(2, "0")}
                </span>

                <span className="flex-1 text-[11px] font-bold text-slate-600">
                  {role}
                </span>

                {/* CONTROLS - ALWAYS VISIBLE BUT SUBTLE */}
                <div className="flex items-center gap-1">
                  <div className="flex bg-slate-100 rounded-md p-0.5">
                    <button
                      disabled={index === 0}
                      onClick={() => moveRole(index, "up")}
                      className="p-1 rounded-sm text-slate-400 hover:text-blue-600 hover:bg-white disabled:opacity-20 transition-all"
                      title="Naik"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </button>
                    <button
                      disabled={index === roles.length - 1}
                      onClick={() => moveRole(index, "down")}
                      className="p-1 rounded-sm text-slate-400 hover:text-blue-600 hover:bg-white disabled:opacity-20 transition-all"
                      title="Turun"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeRole(role)}
                    className="p-1.5 rounded-md text-red-500 hover:text-red-700 hover:bg-red-50 transition-all ml-1"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {roles.length === 0 && (
              <div className="py-10 text-center text-slate-300">
                <Users className="w-6 h-6 mx-auto mb-2 opacity-20" />
                <p className="text-[10px] font-bold uppercase tracking-widest">
                  Belum ada data
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
