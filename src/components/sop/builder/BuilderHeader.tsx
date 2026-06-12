"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  RotateCcw,
  CloudUpload,
  Loader2,
  Printer,
  List,
  LogIn,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { User } from "@supabase/supabase-js";
import { UserMenu } from "@/components/sop/builder/UserMenu";

interface BuilderHeaderProps {
  user: User | null;
  showProjects: boolean;
  setShowProjects: (show: boolean) => void;
  isSyncing: boolean;
  currentId: string | null;
  onSave: () => void;
  onReset: () => void;
  onPrint: () => void;
  onLogout: () => void;
  onLogin: () => void;
  authLoading: boolean;
  lastSaved: Date | null;
  onOpenAdmin: () => void;
}

export function BuilderHeader({
  user,
  showProjects,
  setShowProjects,
  isSyncing,
  currentId,
  onSave,
  onReset,
  onPrint,
  onLogout,
  onLogin,
  authLoading,
  lastSaved,
  onOpenAdmin,
}: BuilderHeaderProps) {
  const isAdmin = user?.email === "kepegawaiankemenagbarut@gmail.com";

  return (
    <header className="h-14 bg-white dark:bg-slate-900 border-b border-border px-3 md:px-4 flex items-center justify-between sticky top-0 z-50 print:hidden">
      {/* LEFT: Logo + Title */}
      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md shadow-emerald-200/50 dark:shadow-emerald-900/30 flex-shrink-0 relative overflow-hidden transition-transform duration-300 hover:scale-105">
          <div className="absolute inset-0 bg-white/20 animate-shimmer" />
          <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-white relative z-10" />
        </div>
        <div className="hidden sm:block min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold tracking-tight text-foreground truncate leading-none">
              SOP Builder
            </h1>
            <span className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold hidden md:inline">Kemenag Barut</span>
            {user && currentId && (
              <div className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 rounded-full">
                <div className="w-1 h-1 rounded-full bg-emerald-400" />
                <span className="text-[7px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-tighter leading-none">Live</span>
              </div>
            )}
          </div>
          <p className="hidden lg:block text-[8px] font-medium text-slate-500 dark:text-slate-400 tracking-wide leading-none mt-0.5">
            {lastSaved ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                Tersimpan: {lastSaved.toLocaleTimeString("id-ID")}
              </span>
            ) : (
              "SOP Document Generator"
            )}
          </p>
        </div>
      </div>

      {/* RIGHT: Controls */}
      <div className="flex items-center gap-1 md:gap-1.5">
        {user ? (
          <div className="flex items-center gap-1">
            {/* Projects */}
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "font-medium text-xs px-2",
                showProjects
                  ? "bg-accent text-accent-foreground"
                  : "text-slate-600 dark:text-slate-300 hover:text-foreground",
              )}
              onClick={() => setShowProjects(!showProjects)}
              aria-label="Proyek Saya"
            >
              <List className="w-4 h-4 md:mr-1.5" />
              <span className="hidden md:inline">Proyek</span>
            </Button>

            {/* Admin */}
            {isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                className="font-medium text-xs px-2 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950"
                onClick={onOpenAdmin}
                aria-label="Admin Panel"
              >
                <ShieldAlert className="w-4 h-4 md:mr-1.5" />
                <span className="hidden md:inline">Admin</span>
              </Button>
            )}

            {/* Save */}
            <Button
              variant={currentId ? "secondary" : "outline"}
              size="sm"
              className={cn(
                "font-medium text-xs px-2 transition-all",
                currentId && "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50",
              )}
              onClick={onSave}
              disabled={isSyncing}
              aria-label={currentId ? "Sync to Cloud" : "Save to Cloud"}
            >
              {isSyncing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CloudUpload className="w-4 h-4" />
              )}
              <span className="hidden md:inline ml-1.5">
                {currentId ? "Simpan" : "Simpan"}
              </span>
            </Button>

            {/* Reset */}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-slate-500 dark:text-slate-400 hover:text-destructive hover:bg-destructive/10"
              onClick={onReset}
              aria-label="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>

            {/* Separator */}
            <div className="w-px h-5 bg-border mx-1 hidden md:block" />

            {/* Print */}
            <Button
              variant="gradient"
              size="sm"
              className="font-semibold text-xs px-3 h-7"
              onClick={onPrint}
            >
              <Printer className="w-3.5 h-3.5 md:mr-1.5" />
              <span className="hidden md:inline">Cetak</span>
            </Button>

            {/* User Menu (Akun, Tools, Tema, Logout) */}
            <UserMenu user={user} onLogout={onLogout} />
          </div>
        ) : (
          <Button
            variant="default"
            size="sm"
            className="font-semibold px-3"
            onClick={onLogin}
            disabled={authLoading}
          >
            <LogIn className="w-4 h-4 mr-1.5" />
            Masuk
          </Button>
        )}
      </div>
    </header>
  );
}
