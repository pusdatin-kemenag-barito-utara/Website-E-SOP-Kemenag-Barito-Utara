import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Edit3,
  Eye,
  RotateCcw,
  CloudUpload,
  Loader2,
  Printer,
  List,
  LogOut,
  LogIn,
  Users,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { User } from "@supabase/supabase-js";

interface BuilderHeaderProps {
  user: User | null;
  viewMode: "edit" | "preview";
  setViewMode: (mode: "edit" | "preview") => void;
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
  viewMode,
  setViewMode,
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
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm print:hidden">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 flex-shrink-0 relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-white relative z-10" />
        </div>
        <div className="hidden sm:block">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-black tracking-tight flex items-center gap-2 leading-none">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                SOP Builder
              </span>
              <span className="text-emerald-600">Kemenag Barut</span>
            </h1>
            {user && currentId && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 border border-blue-100 rounded-full animate-in fade-in duration-500">
                <div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-[8px] font-black text-blue-500 uppercase tracking-tighter">
                  Auto-Save Active
                </span>
              </div>
            )}
          </div>
          <p className="hidden md:block text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">
            {lastSaved ? (
              <span className="text-emerald-500 font-black">
                Terakhir disimpan: {lastSaved.toLocaleTimeString("id-ID")}
              </span>
            ) : (
              "Official Document Generator"
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode("edit")}
            className={cn(
              "px-3 md:px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
              viewMode === "edit"
                ? "bg-white text-emerald-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700",
            )}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Editor</span>
          </button>
          <button
            onClick={() => setViewMode("preview")}
            className={cn(
              "px-3 md:px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
              viewMode === "preview"
                ? "bg-white text-emerald-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700",
            )}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Preview</span>
          </button>
        </div>

        <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

        {user ? (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "font-bold text-xs px-2 md:px-3",
                showProjects
                  ? "bg-amber-100 text-amber-700 shadow-sm"
                  : "text-slate-600 hover:text-amber-600 hover:bg-amber-50",
              )}
              onClick={() => setShowProjects(!showProjects)}
            >
              <List
                className={cn(
                  "w-4 h-4 md:mr-2",
                  showProjects ? "text-amber-600" : "text-amber-500",
                )}
              />
              <span className="hidden md:inline">PROYEK SAYA</span>
            </Button>

            {isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                className="font-bold text-xs px-2 md:px-3 text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                onClick={onOpenAdmin}
              >
                <ShieldAlert className="w-4 h-4 md:mr-2 text-amber-500" />
                <span className="hidden md:inline">ADMIN PANEL</span>
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              className={cn(
                "font-bold text-xs px-2 md:px-3 transition-all",
                currentId
                  ? "text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100 shadow-sm"
                  : "text-blue-500 border-blue-100 hover:bg-blue-50",
              )}
              onClick={onSave}
              disabled={isSyncing}
            >
              {isSyncing ? (
                <Loader2 className="w-4 h-4 md:mr-2 animate-spin" />
              ) : (
                <CloudUpload
                  className={cn(
                    "w-4 h-4 md:mr-2",
                    currentId ? "text-blue-600" : "text-blue-400",
                  )}
                />
              )}
              <span className="hidden md:inline">
                {currentId ? "SYNC CLOUD" : "SIMPAN CLOUD"}
              </span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-orange-500 hover:text-red-600 hover:bg-red-50 font-bold text-xs px-2 md:px-3"
              onClick={onReset}
            >
              <RotateCcw className="w-4 h-4 md:mr-2 text-orange-500" />
              <span className="hidden md:inline">RESET</span>
            </Button>

            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 relative">
                {user.user_metadata.avatar_url ? (
                  <Image
                    src={user.user_metadata.avatar_url}
                    alt="User"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <Users className="w-4 h-4 text-slate-400" />
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-slate-400 hover:text-red-600"
                onClick={onLogout}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <Button
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 h-9 md:h-10 rounded-xl transition-all"
            onClick={onLogin}
            disabled={authLoading}
          >
            <LogIn className="w-4 h-4 mr-2" />
            LOGIN GOOGLE
          </Button>
        )}

        <Button
          className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-100 font-bold px-4 md:px-6 h-9 md:h-10"
          onClick={onPrint}
        >
          <Printer className="w-4 h-4 md:mr-2" />
          <span className="hidden sm:inline">CETAK / PDF ASLI</span>
        </Button>
      </div>
    </header>
  );
}
