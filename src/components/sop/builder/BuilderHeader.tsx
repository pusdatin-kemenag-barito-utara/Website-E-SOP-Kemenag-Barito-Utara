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
  Eye,
  Edit3,
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
  viewMode?: "edit" | "preview";
  setViewMode?: (mode: "edit" | "preview") => void;
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
  viewMode,
  setViewMode,
}: BuilderHeaderProps) {
  const isAdmin = user?.email === "kepegawaiankemenagbarut@gmail.com";

  return (
    <header className="h-16 md:h-20 bg-gradient-to-r from-[#015C3A] via-[#016A43] to-[#015C3A] border-b border-[#014A2E] px-4 md:px-6 flex items-center justify-between sticky top-0 z-50 print:hidden shadow-lg relative">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/4 w-40 h-40 bg-amber-400/5 blur-3xl rounded-full translate-y-1/2" />
      </div>

      {/* LEFT: Logo + Title */}
      <div className="flex items-center gap-3 md:gap-4 min-w-0 relative z-10">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-amber-300 to-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/20 flex-shrink-0 relative overflow-hidden transition-all duration-300 hover:scale-105 border-[3px] border-white/20">
          <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-[#015C3A] relative z-10" />
        </div>
        
        <div className="hidden sm:flex flex-col min-w-0 justify-center h-full">
          <div className="flex items-center gap-2.5">
            <h1 className="text-base md:text-lg font-black tracking-widest text-white drop-shadow-md leading-none mt-0.5">
              E-SOP DIGITAL
            </h1>
            {user && currentId && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-950/40 border border-emerald-400/20 rounded-full shadow-inner">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[9px] md:text-[10px] font-bold text-emerald-300 uppercase tracking-widest leading-none">Live</span>
              </div>
            )}
          </div>
          <p className="text-[9px] md:text-[10px] font-bold text-amber-300 tracking-[0.15em] md:tracking-[0.2em] uppercase leading-none mt-1.5 drop-shadow-sm">
            Kementerian Agama Barito Utara
          </p>
        </div>
      </div>

      {/* RIGHT: Controls */}
      <div className="flex items-center gap-1.5 md:gap-3 relative z-10">
        {user ? (
          <div className="flex items-center gap-1.5 md:gap-2.5">
            {/* Status indicator on desktop */}
            <div className="hidden lg:flex items-center justify-center mr-2">
                {lastSaved ? (
                  <span className="text-xs text-emerald-100/70 font-medium tracking-wide">
                    Tersimpan: {lastSaved.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                  </span>
                ) : (
                  <span className="text-xs text-emerald-100/50 font-medium tracking-wide">
                    Belum ada perubahan
                  </span>
                )}
            </div>

            {/* Projects */}
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "font-semibold text-xs px-3",
                showProjects
                  ? "bg-white/20 text-white shadow-inner"
                  : "text-emerald-50 hover:text-white hover:bg-white/10",
              )}
              onClick={() => setShowProjects(!showProjects)}
            >
              <List className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Proyek</span>
            </Button>

            {/* Admin */}
            {isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                className="font-semibold text-xs px-3 text-amber-300 hover:text-amber-200 hover:bg-amber-400/10"
                onClick={onOpenAdmin}
              >
                <ShieldAlert className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Admin</span>
              </Button>
            )}

            {/* Preview Toggle (Mobile Only) */}
            {viewMode && setViewMode && (
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden font-semibold text-xs px-3 text-emerald-100 hover:text-white hover:bg-white/10"
                onClick={() => setViewMode(viewMode === "edit" ? "preview" : "edit")}
              >
                {viewMode === "edit" ? (
                  <>
                    <Eye className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">Preview</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4 md:mr-2" />
                    <span className="hidden md:inline">Editor</span>
                  </>
                )}
              </Button>
            )}

            {/* Save */}
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "font-bold text-xs px-4 h-9 transition-all rounded-lg border-white/20 backdrop-blur-sm",
                currentId 
                  ? "bg-white/10 text-white hover:bg-white/20 hover:border-white/40 shadow-sm" 
                  : "bg-white/5 text-emerald-100 hover:bg-white/15"
              )}
              onClick={onSave}
              disabled={isSyncing}
            >
              {isSyncing ? (
                <Loader2 className="w-4 h-4 animate-spin md:mr-2" />
              ) : (
                <CloudUpload className="w-4 h-4 md:mr-2" />
              )}
              <span className="hidden md:inline">
                Simpan
              </span>
            </Button>

            {/* Reset */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-emerald-100/70 hover:text-white hover:bg-red-500/20"
              onClick={onReset}
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>

            {/* Separator */}
            <div className="w-px h-7 bg-white/10 mx-1 hidden md:block" />

            {/* Print */}
            <Button
              size="sm"
              className="font-bold text-xs px-5 h-9 bg-amber-400 hover:bg-amber-500 text-[#014A2E] rounded-lg shadow-lg shadow-amber-400/20 transition-all hover:scale-[1.02] active:scale-[0.98] border-none"
              onClick={onPrint}
            >
              <Printer className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Cetak SOP</span>
            </Button>

            {/* User Menu */}
            <div className="pl-1 md:pl-2">
              <UserMenu user={user} onLogout={onLogout} />
            </div>
          </div>
        ) : (
          <Button
            variant="default"
            size="sm"
            className="font-bold px-5 h-9 bg-amber-400 hover:bg-amber-500 text-[#014A2E] rounded-lg shadow-lg shadow-amber-400/20 transition-all hover:scale-[1.02] active:scale-[0.98] border-none"
            onClick={onLogin}
            disabled={authLoading}
          >
            <LogIn className="w-4 h-4 mr-2" />
            Masuk
          </Button>
        )}
      </div>
    </header>
  );
}
