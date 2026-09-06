import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  RotateCcw,
  Save,
  Loader2,
  Printer,
  LayoutGrid,
  ShieldAlert,
  Menu,
  X,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import type {User} from "@supabase/supabase-js";
import { UserMenu } from "@/components/sop/builder/UserMenu";
import { authedRequest } from "@/lib/api";

interface BuilderHeaderProps {
  user: User | null;
  showProjects: boolean;
  setShowProjects: (show: boolean) => void;
  isSyncing: boolean;
  onSave: () => void;
  onReset: () => void;
  onPrint: () => void;
  onLogout: () => void;
  lastSaved: Date | null;
  onOpenAdmin: () => void;
  sopTitle?: string;
}

export function BuilderHeader({
  user,
  showProjects,
  setShowProjects,
  isSyncing,
  onSave,
  onReset,
  onPrint,
  onLogout,
  lastSaved,
  onOpenAdmin,
  sopTitle,
}: BuilderHeaderProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  React.useEffect(() => {
    let isMounted = true;

    const checkAdmin = async () => {
      if (!user?.email) {
        if (isMounted) setIsAdmin(false);
        return;
      }

      try {
        const data = await authedRequest<{ role: string | null }>("/api/admin/user-role");
        if (isMounted) {
          setIsAdmin(data.role === "super_admin");
        }
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

  const formattedTime = lastSaved
    ? lastSaved.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <header className="h-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 flex items-center justify-between sticky top-0 z-50 print:hidden select-none">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-800 p-1 shrink-0 shadow-xs">
          <img
            src="/sop.png"
            alt="Logo SOP"
            className="w-full h-full object-contain"
          />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-black text-slate-800 dark:text-white tracking-tight leading-none">
              E-SOP DIGITAL
            </h1>
            <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/50 text-[#015C3A] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              LIVE
            </span>
          </div>
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase mt-0.5">
            Kemenag Barito Utara
          </p>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-2.5 max-w-[350px] lg:max-w-[500px] px-3.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <FileText className="w-4 h-4 text-[#015C3A] shrink-0" />
        <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
          {sopTitle || "Draft SOP Baru"}
        </span>
      </div>

      <div className="hidden md:flex items-center gap-3">
        {formattedTime && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tersimpan {formattedTime}</span>
          </div>
        )}

        {isAdmin && (
          <Button
            size="sm"
            onClick={onOpenAdmin}
            className="h-9 px-3 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs border border-amber-600/30 flex items-center gap-1.5"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Panel Admin</span>
          </Button>
        )}

        {!isAdmin && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowProjects(!showProjects)}
            className={cn(
              "h-9 px-3 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-1.5 transition-all",
              showProjects
                ? "bg-[#015C3A]/10 text-[#015C3A] border-[#015C3A]/30"
                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            )}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Proyek</span>
          </Button>
        )}

        <Button
          size="sm"
          onClick={onSave}
          disabled={isSyncing}
          className="h-9 px-4 bg-[#015C3A] hover:bg-[#014a2e] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
        >
          {isSyncing ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : (
            <Save className="w-4 h-4 text-white" />
          )}
          <span>Simpan</span>
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={onPrint}
          className="h-9 px-3 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
        >
          <Printer className="w-4 h-4 text-slate-500" />
          <span>Cetak</span>
        </Button>

        {user && <UserMenu user={user} onLogout={onLogout} />}
      </div>

      <div className="flex md:hidden items-center gap-2">
        {user && <UserMenu user={user} onLogout={onLogout} />}

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 left-0 right-0 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 p-4 flex flex-col gap-3 shadow-xl md:hidden z-50"
          >
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200">
              <FileText className="w-4 h-4 text-[#015C3A] shrink-0" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                {sopTitle || "Draft SOP Baru"}
              </span>
            </div>

            <Button
              onClick={() => { onSave(); setMobileMenuOpen(false); }}
              disabled={isSyncing}
              className="bg-[#015C3A] text-white font-bold text-xs h-10 rounded-xl flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Simpan ke Cloud</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => { onPrint(); setMobileMenuOpen(false); }}
              className="font-bold text-xs h-10 rounded-xl flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak SOP</span>
            </Button>

            <Button
              variant="destructive"
              onClick={() => { onReset(); setMobileMenuOpen(false); }}
              className="font-bold text-xs h-10 rounded-xl flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Proyek</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}