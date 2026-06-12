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
        "flex items-center gap-2 px-3 py-2 border-b border-border last:border-0 transition-colors",
        isDragging ? "z-10 opacity-50 bg-accent shadow-sm rounded-lg" : "hover:bg-accent/50",
      )}
    >
      <button
        className="flex items-center text-muted-foreground/40 cursor-grab active:cursor-grabbing touch-none"
        {...attributes}
        {...listeners}
        aria-label="Seret untuk urutkan"
      >
        <GripVertical className="w-3.5 h-3.5" />
      </button>

      <span className="text-[9px] font-medium text-muted-foreground/60 w-4 text-right">
        {(index + 1).toString().padStart(2, "0")}
      </span>

      <span className="flex-1 text-xs font-medium text-foreground">
        {role}
      </span>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onRemove(role)}
          className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
          aria-label="Hapus"
        >
          <Trash2 className="w-3.5 h-3.5" />
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
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-2 bg-muted p-1.5 rounded-lg border border-border focus-within:bg-background focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <div className="ml-2 text-muted-foreground">
            <Plus className="w-4 h-4" />
          </div>
          <Input
            placeholder="Tambah pelaksana baru..."
            className="h-8 border-none bg-transparent focus-visible:ring-0 text-xs font-medium"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addRole()}
          />
          <Button
            size="sm"
            className="h-8 px-3 text-[10px] font-semibold"
            onClick={addRole}
          >
            Tambah
          </Button>
        </div>

        <div className="border border-border rounded-lg overflow-hidden">
          <div className="bg-muted px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[9px] font-medium text-muted-foreground tracking-wide">
              <List className="w-3 h-3" />
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
              <div className="py-10 text-center">
                <Users className="w-6 h-6 mx-auto mb-2 text-muted-foreground/20" />
                <p className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">
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
