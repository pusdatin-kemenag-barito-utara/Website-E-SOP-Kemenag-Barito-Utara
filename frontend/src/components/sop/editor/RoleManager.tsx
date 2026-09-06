import React, { useState } from "react";
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
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Users,
  Trash2,
  List,
  GripVertical,
  Pencil,
  Check,
  X,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Info,
} from "lucide-react";
import type { Activity } from "@/types/sop";
import { cn } from "@/lib/utils";

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
  onRename: (oldRole: string, newRole: string) => boolean;
}

const KEMENAG_PRESET_ROLES = [
  "Pemohon",
  "Petugas PTSP",
  "Operator",
  "Tim Verifikator",
  "Kepala Seksi",
  "Penyelenggara",
  "Kasubbag TU",
  "Kepala Kantor",
];

function SortableRole({ role, index, onRemove, onRename }: SortableRoleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(role);
  const editInputRef = React.useRef<HTMLInputElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: role, disabled: isEditing });

  React.useEffect(() => {
    setEditValue(role);
  }, [role]);

  React.useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }
  }, [isEditing]);

  const handleSaveRename = () => {
    const trimmed = editValue.trim();
    if (!trimmed || trimmed === role) {
      setIsEditing(false);
      setEditValue(role);
      return;
    }
    const success = onRename(role, trimmed);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveRename();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditValue(role);
    }
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-slate-800/60 last:border-0 bg-white dark:bg-slate-900 transition-colors group",
        isDragging
          ? "z-20 opacity-60 shadow-lg bg-slate-50 dark:bg-slate-800"
          : "hover:bg-slate-50/80 dark:hover:bg-slate-800/40",
      )}
    >
      <button
        className="flex items-center text-slate-300 dark:text-slate-600 hover:text-slate-700 dark:hover:text-slate-300 cursor-grab active:cursor-grabbing touch-none transition-colors"
        {...attributes}
        {...listeners}
        aria-label="Seret untuk urutkan"
        disabled={isEditing}
      >
        <GripVertical className="w-4 h-4" />
      </button>

      <span className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 w-5 text-right tabular-nums">
        {(index + 1).toString().padStart(2, "0")}
      </span>

      {isEditing ? (
        <div className="flex-1 flex items-center gap-1.5">
          <Input
            ref={editInputRef}
            id={`edit-role-${index}`}
            name={`edit-role-${index}`}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-8 text-xs font-bold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-950 border-[#015C3A] rounded-lg px-2.5"
          />
          <button
            type="button"
            onClick={handleSaveRename}
            className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-[#015C3A] dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors cursor-pointer"
            title="Simpan Perubahan"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setEditValue(role);
            }}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title="Batal"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <span
          onDoubleClick={() => setIsEditing(true)}
          className="flex-1 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 tracking-tight select-none cursor-pointer"
          title="Klik ganda untuk mengubah nama"
        >
          {role}
        </span>
      )}

      {!isEditing && (
        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#015C3A] hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all cursor-pointer"
            aria-label="Ubah Nama"
            title="Ubah Nama Pelaksana"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onRemove(role)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
            aria-label="Hapus"
            title="Hapus Pelaksana"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

export function RoleManager({
  roles,
  setRoles,
  setActivities,
  setConfirm,
}: Props) {
  const [newRole, setNewRole] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const showFeedback = (text: string, isError = false) => {
    setFeedbackMsg({ text, isError });
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const addRole = (roleToAdd?: string) => {
    const targetRole = (roleToAdd || newRole).trim();
    if (!targetRole) return;

    if (roles.some((r) => r.toLowerCase() === targetRole.toLowerCase())) {
      showFeedback(
        `Pelaksana "${targetRole}" sudah ada di dalam daftar.`,
        true,
      );
      return;
    }

    setRoles((prev) => [...prev, targetRole]);
    if (!roleToAdd) setNewRole("");
    showFeedback(`Pelaksana "${targetRole}" berhasil ditambahkan.`, false);
  };

  const handleRenameRole = (oldRole: string, newRole: string): boolean => {
    const trimmedNew = newRole.trim();
    if (
      roles.some(
        (r) =>
          r.toLowerCase() === trimmedNew.toLowerCase() &&
          r.toLowerCase() !== oldRole.toLowerCase(),
      )
    ) {
      showFeedback(
        `Pelaksana "${trimmedNew}" sudah ada di dalam daftar.`,
        true,
      );
      return false;
    }

    // 1. Update roles state
    setRoles((prev) => prev.map((r) => (r === oldRole ? trimmedNew : r)));

    // 2. Cascade update to all activities pelaksana and roleForSymbol
    setActivities((prev) =>
      prev.map((act) => ({
        ...act,
        pelaksana: act.pelaksana.map((p) => (p === oldRole ? trimmedNew : p)),
        roleForSymbol:
          act.roleForSymbol === oldRole ? trimmedNew : act.roleForSymbol,
      })),
    );

    showFeedback(
      `Nama pelaksana berhasil diubah menjadi "${trimmedNew}".`,
      false,
    );
    return true;
  };

  const removeRole = (roleToRemove: string) => {
    setConfirm({
      open: true,
      title: "Hapus Pelaksana?",
      desc: `Apakah Anda yakin ingin menghapus "${roleToRemove}" dari daftar pelaksana? Hubungan pada alur kegiatan terkait akan otomatis disesuaikan.`,
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
        showFeedback(`Pelaksana "${roleToRemove}" telah dihapus.`, false);
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
      {/* Add New Role Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 flex items-center gap-2 shadow-xs">
        <div className="pl-2 text-slate-400 dark:text-slate-500">
          <Plus className="w-4 h-4" />
        </div>
        <Input
          id="new-role-input"
          name="new-role-input"
          placeholder="Ketik nama pelaksana / jabatan baru..."
          className="h-10 border-none bg-transparent focus-visible:ring-0 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 px-2"
          value={newRole}
          onChange={(e) => {
            setNewRole(e.target.value);
            if (feedbackMsg) setFeedbackMsg(null);
          }}
          onKeyDown={(e) => e.key === "Enter" && addRole()}
        />
        <Button
          size="sm"
          className="h-9 px-4 text-xs font-bold rounded-xl bg-[#015C3A] text-white hover:bg-[#014A2E] cursor-pointer transition-all shadow-xs"
          onClick={() => addRole()}
        >
          Tambah
        </Button>
      </div>

      {/* Quick Kemenag Role Presets */}
      <div className="bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/80 rounded-2xl p-3.5 space-y-2">
        <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Rekomendasi Jabatan Kemenag</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {KEMENAG_PRESET_ROLES.map((preset) => {
            const isAdded = roles.some(
              (r) => r.toLowerCase() === preset.toLowerCase(),
            );
            return (
              <button
                key={preset}
                type="button"
                onClick={() => !isAdded && addRole(preset)}
                disabled={isAdded}
                className={cn(
                  "text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer border",
                  isAdded
                    ? "bg-slate-200/60 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-transparent cursor-not-allowed"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200/90 dark:border-slate-700 hover:border-[#015C3A] hover:text-[#015C3A] hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 shadow-2xs",
                )}
              >
                <span>{isAdded ? "✓" : "+"}</span>
                <span>{preset}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Validation / Action Feedback Alert */}
      {feedbackMsg && (
        <div
          className={cn(
            "px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all animate-in fade-in slide-in-from-top-1",
            feedbackMsg.isError
              ? "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900/50"
              : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50",
          )}
        >
          {feedbackMsg.isError ? (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Roles List Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        {/* Header with A4 Capacity Indicator */}
        <div className="bg-slate-50/90 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800/60 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 tracking-wide">
            <List className="w-4 h-4 text-slate-500" />
            <span>Daftar Pelaksana ({roles.length})</span>
          </div>

          {/* A4 Capacity Badge */}
          {roles.length <= 5 ? (
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-[#015C3A] dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-900/50 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Optimal Cetak A4</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50 text-[10px] font-bold">
              <Info className="w-3 h-3 text-amber-500" />
              <span>{roles.length} Kolom (Saran: maks 5-6)</span>
            </div>
          )}
        </div>

        {/* Sortable List */}
        <div className="max-h-[420px] overflow-y-auto custom-scrollbar divide-y divide-slate-100 dark:divide-slate-800/60">
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
                  onRename={handleRenameRole}
                />
              ))}
            </SortableContext>
          </DndContext>

          {roles.length === 0 && (
            <div className="py-12 text-center">
              <Users className="w-8 h-8 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                Belum ada data pelaksana
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
