import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Users, Trash2, List, GripVertical } from "lucide-react";
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

interface SortableRoleProps {
  role: string;
  index: number;
  onRemove: (role: string) => void;
}

function SortableRole({ role, index, onRemove }: SortableRoleProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: role });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-slate-800/60 last:border-0 bg-white dark:bg-slate-900 transition-colors",
        isDragging ? "z-10 opacity-50 shadow-md" : "hover:bg-slate-50 dark:hover:bg-slate-800/50",
      )}
    >
      <button
        className="flex items-center text-slate-400 hover:text-slate-800 cursor-grab active:cursor-grabbing touch-none transition-colors"
        {...attributes}
        {...listeners}
        aria-label="Seret untuk urutkan"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 w-5 text-right">
        {(index + 1).toString().padStart(2, "0")}
      </span>

      <span className="flex-1 text-sm font-semibold text-slate-800 dark:text-slate-200 tracking-wide">
        {role}
      </span>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onRemove(role)}
          className="p-1.5 rounded-md text-slate-600 hover:text-red-500 hover:bg-red-50 transition-all"
          aria-label="Hapus"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";

export function RoleManager({
  roles,
  setRoles,
  setActivities,
  setConfirm,
}: Props) {
  const [newRole, setNewRole] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setRoles((prev) => {
        const oldIndex = prev.indexOf(active.id as string);
        const newIndex = prev.indexOf(over.id as string);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 flex items-center gap-2 shadow-sm">
        <div className="pl-2 text-slate-800">
          <Plus className="w-4 h-4" />
        </div>
        <Input
          placeholder="Tambah pelaksana baru..."
          className="h-10 border-none bg-transparent focus-visible:ring-0 text-sm font-bold text-slate-700 px-2"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addRole()}
        />
        <Button
          size="sm"
          className="h-9 px-5 text-xs font-bold rounded-lg bg-[#015C3A] text-white hover:bg-[#014A2E]"
          onClick={addRole}
        >
          Tambah
        </Button>
      </div>

      {/* Roles List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800/60 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 tracking-wide">
            <List className="w-4 h-4 text-slate-500" />
            Daftar Pelaksana ({roles.length})
          </div>
        </div>

          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={roles}
                strategy={verticalListSortingStrategy}
              >
                {roles.map((role, index) => (
                  <SortableRole
                    key={role}
                    role={role}
                    index={index}
                    onRemove={removeRole}
                  />
                ))}
              </SortableContext>
            </DndContext>

            {roles.length === 0 && (
              <div className="py-12 text-center">
                <Users className="w-8 h-8 mx-auto mb-3 text-slate-300" />
                <p className="text-xs font-bold text-slate-400 tracking-wider">
                  Belum ada data pelaksana
                </p>
              </div>
            )}
          </div>
      </div>
    </div>
  );
}
