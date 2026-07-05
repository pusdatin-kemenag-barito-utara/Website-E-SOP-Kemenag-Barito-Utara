"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  RotateCcw,
  Save,
  Loader2,
  Printer,
  LayoutGrid,
  LogIn,
  ShieldAlert,
  Eye,
  Edit3,
  Menu,
  X,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { User } from "@supabase/supabase-js";
import { UserMenu } from "@/components/sop/builder/UserMenu";
import { getUserRole } from "@/app/auth-actions";

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
        const role = await getUserRole(user.email);
        if (isMounted) {
          setIsAdmin(role === "super_admin");
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

  return (
    <header className="h-16 md:h-[72px] bg-[#015C3A] border-b border-[#014A2E] px-3 md:px-6 flex items-center justify-between sticky top-0 z-50 print:hidden shadow-md relative">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/4 w-40 h-40 bg-amber-400/5 blur-3xl rounded-full translate-y-1/2" />
      </div>

      {/* LEFT: Logo + Title */}
      <div className="flex items-center gap-2.5 md:gap-4 min-w-0 relative z-10">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 relative overflow-hidden transition-all duration-300 border-[2px] border-amber-200/50 p-1">
          <Image 
            src="/kemenag-512.png" 
            alt="Logo Kemenag" 
            width={32} 
            height={32} 
            className="w-full h-full object-contain relative z-10"
          />
        </div>
        
        <div className="flex flex-col min-w-0 justify-center h-full">
          <div className="flex items-center gap-2">
            <h1 className="text-[15px] md:text-lg font-extrabold tracking-wide text-white leading-none mt-0.5 whitespace-nowrap">
              E-SOP DIGITAL
            </h1>
            {user && currentId && (
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 bg-emerald-950/40 border border-emerald-400/20 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest leading-none">Live</span>
              </div>
            )}
          </div>
          <p className="text-[10px] font-medium text-amber-300 tracking-[0.1em] uppercase leading-none mt-1.5 opacity-90 truncate">
            Kemenag Barito Utara
          </p>
        </div>
      </div>

      {/* RIGHT: Controls */}
      <div className="flex items-center gap-1.5 md:gap-2.5 relative z-10">
        {user ? (
          <>
            {/* ----------------- DESKTOP CONTROLS ----------------- */}
            <div className="hidden md:flex items-center gap-2">
              
              {/* Status Indicator */}
              <div className="flex items-center justify-center mr-2 px-3 py-1.5 rounded-full bg-black/10 border border-white/5">
                {lastSaved ? (
                  <div className="flex items-center text-emerald-100/90">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                    <span className="text-[11px] font-medium tracking-wide">
                      Disimpan {lastSaved.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center text-emerald-100/60">
                    <Clock className="w-3.5 h-3.5 mr-1.5" />
                    <span className="text-[11px] font-medium tracking-wide">
                      Belum ada perubahan
                    </span>
                  </div>
                )}
              </div>

              {/* Projects (Hidden for Admin) */}
              {!isAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "font-semibold text-[13px] h-9 px-3 rounded-lg transition-all",
                    showProjects
                      ? "bg-white/20 text-white shadow-inner"
                      : "text-emerald-50 hover:text-white hover:bg-white/10",
                  )}
                  onClick={() => setShowProjects(!showProjects)}
                >
                  <LayoutGrid className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Proyek</span>
                </Button>
              )}

              {/* Preview Toggle */}
              {viewMode && setViewMode && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-semibold text-[13px] h-9 px-3 text-emerald-50 hover:text-white hover:bg-white/10 rounded-lg lg:hidden"
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

              {/* Admin */}
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-semibold text-[13px] h-9 px-3 text-amber-300 hover:text-amber-200 hover:bg-amber-400/10 rounded-lg"
                  onClick={onOpenAdmin}
                >
                  <ShieldAlert className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Proyek Super Admin</span>
                </Button>
              )}

              <div className="w-px h-6 bg-white/10 mx-1" />

              {/* Save */}
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "font-bold text-[13px] px-4 h-9 transition-all rounded-lg border-white/20",
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
                  <Save className="w-4 h-4 md:mr-2" />
                )}
                <span className="hidden md:inline">
                  Simpan
                </span>
              </Button>

              {/* Reset */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg text-emerald-100/70 hover:text-white hover:bg-red-500/20 transition-all"
                onClick={onReset}
                title="Reset Perubahan"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>

              {/* Print */}
              <Button
                size="sm"
                className="font-bold text-[13px] px-4 h-9 bg-amber-400 hover:bg-amber-500 text-[#014A2E] rounded-lg shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0 border-none ml-1"
                onClick={onPrint}
              >
                <Printer className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Cetak SOP</span>
              </Button>

              {/* User Menu */}
              <div className="pl-2 border-l border-white/10 ml-1">
                <UserMenu user={user} onLogout={onLogout} />
              </div>
            </div>

            {/* ----------------- MOBILE CONTROLS ----------------- */}
            <div className="flex md:hidden items-center gap-1">
              {/* Quick Save (Mobile) */}
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-9 w-9 rounded-lg",
                  currentId ? "text-amber-300 hover:bg-white/10" : "text-emerald-100/50"
                )}
                onClick={onSave}
                disabled={isSyncing || !currentId}
                title="Simpan"
              >
                {isSyncing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg text-white hover:bg-white/10"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              
              <div className="pl-1">
                <UserMenu user={user} onLogout={onLogout} />
              </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {mobileMenuOpen && (
              <div className="absolute top-[calc(100%+0.5rem)] right-2 w-[240px] bg-white rounded-2xl shadow-xl border border-slate-100 flex flex-col p-2 gap-1 md:hidden overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200 z-50">
                {/* Mobile Status */}
                <div className="px-3 py-2.5 mb-1 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                  {lastSaved ? (
                    <div className="flex items-center text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
                      <span className="text-[11px] font-semibold">
                        Disimpan {lastSaved.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center text-slate-500">
                      <Clock className="w-3.5 h-3.5 mr-1.5" />
                      <span className="text-[11px] font-medium">Belum ada perubahan</span>
                    </div>
                  )}
                </div>

                {!isAdmin && (
                  <Button
                    variant="ghost"
                    className="justify-start text-sm h-10 px-3 font-medium transition-colors hover:bg-slate-100 rounded-lg text-slate-700"
                    onClick={() => { setShowProjects(!showProjects); setMobileMenuOpen(false); }}
                  >
                    <LayoutGrid className="w-4 h-4 mr-3 text-slate-400" />
                    Proyek
                  </Button>
                )}
                
                {isAdmin && (
                  <Button
                    variant="ghost"
                    className="justify-start text-sm h-10 px-3 font-medium text-amber-700 hover:bg-amber-50 rounded-lg"
                    onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }}
                  >
                    <ShieldAlert className="w-4 h-4 mr-3 text-amber-500" />
                    Proyek Super Admin
                  </Button>
                )}

                {viewMode && setViewMode && (
                  <Button
                    variant="ghost"
                    className="justify-start text-sm h-10 px-3 font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                    onClick={() => { setViewMode(viewMode === "edit" ? "preview" : "edit"); setMobileMenuOpen(false); }}
                  >
                    {viewMode === "edit" ? (
                      <>
                        <Eye className="w-4 h-4 mr-3 text-slate-400" />
                        Preview Mode
                      </>
                    ) : (
                      <>
                        <Edit3 className="w-4 h-4 mr-3 text-slate-400" />
                        Editor Mode
                      </>
                    )}
                  </Button>
                )}

                <div className="h-px bg-slate-100 my-1" />
                
                <Button
                  variant="ghost"
                  className="justify-start text-sm h-10 px-3 font-medium text-emerald-700 hover:bg-emerald-50 rounded-lg"
                  onClick={() => { onSave(); setMobileMenuOpen(false); }}
                  disabled={isSyncing}
                >
                  {isSyncing ? <Loader2 className="w-4 h-4 mr-3 animate-spin text-emerald-500" /> : <Save className="w-4 h-4 mr-3 text-emerald-500" />}
                  Simpan Perubahan
                </Button>
                
                <Button
                  variant="ghost"
                  className="justify-start text-sm h-10 px-3 font-medium text-red-600 hover:bg-red-50 rounded-lg"
                  onClick={() => { onReset(); setMobileMenuOpen(false); }}
                >
                  <RotateCcw className="w-4 h-4 mr-3 text-red-500" />
                  Reset
                </Button>
                
                <Button
                  className="justify-center text-sm h-10 px-3 font-bold text-[#014A2E] bg-amber-400 hover:bg-amber-500 mt-1 rounded-lg transition-all shadow-sm"
                  onClick={() => { onPrint(); setMobileMenuOpen(false); }}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Cetak SOP
                </Button>
              </div>
            )}
          </>
        ) : (
          <Button
            variant="default"
            size="sm"
            className="font-bold px-4 md:px-5 h-9 bg-amber-400 hover:bg-amber-500 text-[#014A2E] rounded-lg shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0 border-none"
            onClick={onLogin}
            disabled={authLoading}
          >
            <LogIn className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Masuk</span>
          </Button>
        )}
      </div>
    </header>
  );
}
