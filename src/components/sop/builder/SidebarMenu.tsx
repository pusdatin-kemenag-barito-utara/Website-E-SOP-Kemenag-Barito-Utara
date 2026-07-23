"use client";

import React, { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import {
  LayoutGrid,
  Save,
  Loader2,
  RotateCcw,
  Printer,
  ShieldAlert,
  Eye,
  Edit3,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getUserRole } from "@/app/auth-actions";

interface SidebarMenuProps {
  user: User | null;
  showProjects: boolean;
  setShowProjects: (show: boolean) => void;
  isSyncing: boolean;
  currentId: string | null;
  onSave: () => void;
  onReset: () => void;
  onPrint: () => void;
  onOpenAdmin: () => void;
  viewMode?: "edit" | "preview";
  setViewMode?: (mode: "edit" | "preview") => void;
}

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  variant?: "default" | "warning" | "danger";
  hidden?: boolean;
  isSyncing?: boolean;
}

const SidebarItem = ({
  icon: Icon,
  label,
  onClick,
  active,
  disabled,
  variant = "default",
  hidden = false,
  isSyncing = false,
}: SidebarItemProps) => {
  if (hidden) return null;

  return (
    <div className="relative group flex items-center justify-center">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={disabled}
        onClick={onClick}
        className={cn(
          "w-11 h-11 flex flex-col items-center justify-center rounded-xl transition-all relative border",
          active
            ? "bg-[#015C3A]/10 text-[#015C3A] border-[#015C3A]/30 shadow-sm"
            : "border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-white",
          disabled && "opacity-50 cursor-not-allowed",
          variant === "warning" &&
            "text-amber-600 border-amber-200 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50",
          variant === "danger" &&
            "text-rose-600 border-rose-200 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50"
        )}
      >
        <Icon
          className={cn("w-5 h-5", isSyncing && label === "Simpan" && "animate-spin")}
        />
      </motion.button>

      {/* Floating Tooltip */}
      <span className="absolute left-14 bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap z-50 shadow-xl border border-slate-700">
        {label}
      </span>
    </div>
  );
};

export function SidebarMenu({
  user,
  showProjects,
  setShowProjects,
  isSyncing,
  currentId,
  onSave,
  onReset,
  onPrint,
  onOpenAdmin,
  viewMode,
  setViewMode,
}: SidebarMenuProps) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const checkAdmin = async () => {
      if (!user?.email) {
        if (isMounted) setIsAdmin(false);
        return;
      }
      try {
        const role = await getUserRole(user.email);
        if (isMounted) setIsAdmin(role === "super_admin");
      } catch (error) {
        console.error("Error checking role:", error);
        if (isMounted) setIsAdmin(false);
      }
    };
    checkAdmin();
    return () => {
      isMounted = false;
    };
  }, [user]);

  return (
    <aside className="hidden md:flex flex-col w-[68px] h-full bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 py-4 items-center z-40 shrink-0 relative select-none">
      <div className="flex flex-col gap-3 mt-1">
        {/* Proyek */}
        {!isAdmin && (
          <SidebarItem
            icon={LayoutGrid}
            label="Daftar Proyek"
            onClick={() => setShowProjects(!showProjects)}
            active={showProjects}
          />
        )}

        {/* Proyek Admin */}
        {isAdmin && (
          <SidebarItem
            icon={ShieldAlert}
            label="Panel Super Admin"
            onClick={onOpenAdmin}
            variant="warning"
          />
        )}

        <div className="w-8 h-px bg-slate-200 dark:bg-slate-800 mx-auto my-1" />

        {/* View Mode Toggle */}
        {viewMode && setViewMode && (
          <SidebarItem
            icon={viewMode === "edit" ? Eye : Edit3}
            label={viewMode === "edit" ? "Modus Preview" : "Modus Editor"}
            onClick={() => setViewMode(viewMode === "edit" ? "preview" : "edit")}
          />
        )}

        {/* Simpan */}
        <SidebarItem
          icon={isSyncing ? Loader2 : Save}
          label="Simpan ke Cloud"
          onClick={onSave}
          disabled={isSyncing}
          active={currentId !== null}
          isSyncing={isSyncing}
        />

        {/* Cetak */}
        <SidebarItem
          icon={Printer}
          label="Cetak SOP / PDF"
          onClick={onPrint}
        />
      </div>

      <div className="mt-auto mb-2 flex flex-col gap-3">
        <div className="w-8 h-px bg-slate-200 dark:bg-slate-800 mx-auto my-1" />

        {/* Reset */}
        <SidebarItem
          icon={RotateCcw}
          label="Reset Proyek"
          onClick={onReset}
          variant="danger"
        />
      </div>
    </aside>
  );
}
