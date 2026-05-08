"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings,
  FileText,
  Printer,
  Eye,
  Edit3,
  ChevronRight,
  ShieldCheck,
  Users,
  CloudUpload,
  Loader2,
  LogIn,
  LogOut,
  List,
  Plus,
} from "lucide-react";

// Modular Components
import { SOPHeaderEditor } from "@/components/sop/editor/header/SOPHeaderEditor";
import { RoleManager } from "@/components/sop/editor/RoleManager";
import { ActivityEditor } from "@/components/sop/editor/activity/ActivityEditor";
import { SOPPreview } from "@/components/sop/preview/SOPPreview";

// Hooks & Types
import { useSOPData } from "@/hooks/useSOPData";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export default function SOPBuilder() {
  const { user, signInWithGoogle, signOut, loading: authLoading } = useAuth();
  const {
    isHydrated,
    roles,
    setRoles,
    activities,
    setActivities,
    header,
    setHeader,
    resetData,
    saveToCloud,
    loadSop,
    isSyncing,
    currentId,
    userSops,
  } = useSOPData(user?.id);

  const [activeSection, setActiveSection] = useState("header");
  const [showProjects, setShowProjects] = useState(false);
  const [expandedActivities, setExpandedActivities] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const [scale, setScale] = useState(1);

  React.useEffect(() => {
    const updateScale = () => {
      const width = window.innerWidth;
      if (width < 1024) {
        // Mobile & Tablet: scale based on 210mm (approx 794px)
        // Add more padding (80px instead of 40px) to make it look neater
        const newScale = (width - 60) / 794;
        setScale(Math.min(newScale, 1));
      } else {
        // Desktop: calculate space remaining after sidebar
        const sidebarWidth =
          viewMode === "edit" ? (width < 1280 ? 650 : 850) : 0;
        const availableWidth = width - sidebarWidth - 64;
        const newScale = availableWidth / 794;
        setScale(Math.min(newScale, 1));
      }
    };

    window.addEventListener("resize", updateScale);
    updateScale();
    return () => window.removeEventListener("resize", updateScale);
  }, [viewMode]);

  if (!isHydrated) return null;

  if (!user && !authLoading) {
    return (
      <div className="h-screen w-full bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden p-8 md:p-12 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-xl shadow-emerald-100 mx-auto mb-8 rotate-3">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">
            SOP Builder
          </h1>
          <p className="text-emerald-600 font-black tracking-widest text-xs uppercase mb-8">
            Kemenag Barito Utara
          </p>
          <div className="space-y-4 mb-8">
            <p className="text-slate-500 text-sm leading-relaxed">
              Selamat datang di portal pembuatan SOP Digital resmi. Silakan masuk menggunakan akun Google Anda untuk mulai membuat, menyimpan, dan mengelola dokumen SOP secara profesional.
            </p>
          </div>
          <Button 
            onClick={signInWithGoogle}
            className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-slate-200"
          >
            <LogIn className="w-5 h-5" />
            MASUK DENGAN GOOGLE
          </Button>
          <p className="mt-8 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            © 2025 Kemenag Barito Utara
          </p>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="h-screen w-full bg-white flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Memuat Sesi...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900 overflow-hidden">
      {/* TOP NAVIGATION BAR */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm print:hidden">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 flex-shrink-0 relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-white relative z-10" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-black tracking-tight flex items-center gap-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                SOP Builder
              </span>
              <span className="text-emerald-600">Kemenag Barut</span>
              <span className="hidden lg:inline text-emerald-600 text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 font-black">
                PRO
              </span>
            </h1>
            <p className="hidden md:block text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
              Official Document Generator
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* Mobile View Toggle */}
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
                  "font-bold text-xs px-2 md:px-3 text-slate-600",
                  showProjects && "bg-slate-100"
                )}
                onClick={() => setShowProjects(!showProjects)}
              >
                <List className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">PROYEK SAYA</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "font-bold text-xs px-2 md:px-3 border-slate-200",
                  currentId
                    ? "text-blue-600 bg-blue-50 border-blue-100"
                    : "text-slate-500",
                )}
                onClick={saveToCloud}
                disabled={isSyncing}
              >
                {isSyncing ? (
                  <Loader2 className="w-4 h-4 md:mr-2 animate-spin" />
                ) : (
                  <CloudUpload className="w-4 h-4 md:mr-2" />
                )}
                <span className="hidden md:inline">
                  {currentId ? "SYNC CLOUD" : "SIMPAN CLOUD"}
                </span>
              </Button>

              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 relative">
                  {user.user_metadata.avatar_url ? (
                    <img 
                      src={user.user_metadata.avatar_url} 
                      alt="User" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Users className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 hover:text-red-600"
                  onClick={signOut}
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <Button
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 h-9 md:h-10 rounded-xl transition-all"
              onClick={signInWithGoogle}
              disabled={authLoading}
            >
              <LogIn className="w-4 h-4 mr-2" />
              LOGIN GOOGLE
            </Button>
          )}

          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-100 font-bold px-4 md:px-6 h-9 md:h-10"
            onClick={() => window.print()}
          >
            <Printer className="w-4 h-4 md:mr-2" />
            <span className="hidden sm:inline">CETAK / PDF ASLI</span>
          </Button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden h-[calc(100vh-64px)]">
        {/* PROJECT LIST SIDEBAR (CONDITIONAL) */}
        {user && showProjects && (
          <aside className="w-[300px] bg-slate-50 border-r border-slate-200 flex flex-col h-full print:hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
              <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                Daftar SOP Saya
              </h2>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-emerald-600 hover:bg-emerald-50"
                onClick={() => {
                  resetData();
                  setShowProjects(false);
                }}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {userSops.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  <p className="text-[10px] font-bold uppercase">Belum ada data</p>
                </div>
              ) : (
                userSops.map((sop) => (
                  <button
                    key={sop.id}
                    onClick={() => {
                      loadSop(sop.id);
                      if (window.innerWidth < 1024) setShowProjects(false);
                    }}
                    className={cn(
                      "w-full p-3 rounded-xl text-left transition-all group border",
                      currentId === sop.id
                        ? "bg-white border-emerald-200 shadow-sm"
                        : "border-transparent hover:bg-white hover:border-slate-200"
                    )}
                  >
                    <p className={cn(
                      "text-xs font-bold truncate mb-1",
                      currentId === sop.id ? "text-emerald-600" : "text-slate-700"
                    )}>
                      {sop.title}
                    </p>
                    <p className="text-[9px] text-slate-400 font-medium">
                      Update: {new Date(sop.updated_at).toLocaleDateString('id-ID')}
                    </p>
                  </button>
                ))
              )}
            </div>
          </aside>
        )}

        {/* LEFT SIDEBAR: EDITOR CONTROLS */}
        <aside
          className={cn(
            "flex-1 lg:flex-none lg:w-[650px] xl:w-[850px] bg-white border-r border-slate-200 flex flex-col transition-all duration-300 print:hidden h-full overflow-hidden",
            viewMode === "preview"
              ? "hidden lg:flex opacity-50 pointer-events-none grayscale"
              : "flex",
          )}
        >
          <Tabs
            value={activeSection}
            onValueChange={setActiveSection}
            className="h-full flex flex-col overflow-hidden"
          >
            <div className="px-4 md:px-6 py-4 border-b border-slate-100">
              <TabsList className="grid w-full grid-cols-3 h-11 bg-slate-50 p-1 rounded-2xl">
                <TabsTrigger
                  value="header"
                  className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-md font-bold text-[10px] transition-all"
                >
                  <Settings className="w-3.5 h-3.5 mr-2" /> Konfigurasi
                </TabsTrigger>
                <TabsTrigger
                  value="roles"
                  className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-md font-bold text-[10px] transition-all"
                >
                  <Users className="w-3.5 h-3.5 mr-2" /> Pelaksana
                </TabsTrigger>
                <TabsTrigger
                  value="activities"
                  className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-md font-bold text-[10px] transition-all"
                >
                  <FileText className="w-3.5 h-3.5 mr-2" /> Alur Kerja
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#FDFDFD] min-h-0 [scrollbar-gutter:stable]">
              <TabsContent value="header" className="mt-0 outline-none">
                <div className="px-6 py-4">
                  <div className="flex items-center gap-2 mb-6">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                      Identitas & Legalitas
                    </h2>
                  </div>
                  <SOPHeaderEditor header={header} setHeader={setHeader} />
                </div>
              </TabsContent>

              <TabsContent value="roles" className="mt-0 outline-none">
                <div className="px-6 py-4">
                  <div className="flex items-center gap-2 mb-6">
                    <Users className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                      Manajemen Pelaksana
                    </h2>
                  </div>
                  <RoleManager
                    roles={roles}
                    setRoles={setRoles}
                    setActivities={setActivities}
                  />
                </div>
              </TabsContent>

              <TabsContent value="activities" className="mt-0 outline-none">
                <div className="px-2">
                  <ActivityEditor
                    activities={activities}
                    setActivities={setActivities}
                    roles={roles}
                    expandedActivities={expandedActivities}
                    setExpandedActivities={setExpandedActivities}
                  />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </aside>

        {/* RIGHT AREA: REAL-TIME PREVIEW */}
        <section
          className={cn(
            "flex-1 bg-[#F1F5F9] overflow-y-auto custom-scrollbar print:p-0 print:bg-white transition-all duration-500 h-full [scrollbar-gutter:stable]",
            viewMode === "preview"
              ? "bg-white flex"
              : "bg-slate-100 hidden lg:flex",
          )}
        >
          <div className="min-h-full w-full p-4 md:py-12 md:px-6 flex flex-col items-center">
            {/* Breadcrumb style indicator */}
            <div className="w-full max-w-[1000px] mb-4 md:mb-8 flex items-center justify-between print:hidden">
              <div className="hidden md:flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <span>KEMENAG</span>
                <ChevronRight className="w-3 h-3" />
                <span>SOP BUILDER</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-emerald-600">LIVE PREVIEW</span>
              </div>
              <div className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1 rounded-full text-[9px] font-black animate-pulse mx-auto md:mx-0">
                SYNCING ACTIVE
              </div>
            </div>

            <div
              className="w-full flex justify-center transition-all duration-500"
              style={{
                transform: `scale(${scale})`,
                transformOrigin: "top center",
                marginBottom: `calc(297mm * ${scale - 1})`, // Adjust footer margin based on scale
              }}
            >
              <SOPPreview
                header={header}
                activities={activities}
                roles={roles}
                isHydrated={isHydrated}
                expandedActivities={expandedActivities}
              />
            </div>

            <footer className="mt-20 text-slate-400 text-[9px] font-black tracking-[0.3em] uppercase pb-12 print:hidden">
              Generated by Digital SOP Builder System &bull; 2025
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
}
