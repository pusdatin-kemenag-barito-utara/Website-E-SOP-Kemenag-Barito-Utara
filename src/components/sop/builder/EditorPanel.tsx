import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Users, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { SOPHeaderEditor } from "@/components/sop/editor/header/SOPHeaderEditor";
import { RoleManager } from "@/components/sop/editor/RoleManager";
import { ActivityEditor } from "@/components/sop/editor/activity/ActivityEditor";
import { SOPHeader, Activity } from "@/types/sop";

interface EditorPanelProps {
  viewMode: "edit" | "preview";
  activeSection: string;
  setActiveSection: (section: string) => void;
  header: SOPHeader;
  setHeader: React.Dispatch<React.SetStateAction<SOPHeader>>;
  roles: string[];
  setRoles: React.Dispatch<React.SetStateAction<string[]>>;
  activities: Activity[];
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
  expandedActivities: string[];
  setExpandedActivities: React.Dispatch<React.SetStateAction<string[]>>;
  setConfirm: (config: {
    open: boolean;
    title: string;
    desc: string;
    onConfirm: () => void;
  }) => void;
}

export function EditorPanel({
  viewMode,
  activeSection,
  setActiveSection,
  header,
  setHeader,
  roles,
  setRoles,
  activities,
  setActivities,
  expandedActivities,
  setExpandedActivities,
  setConfirm,
}: EditorPanelProps) {
  return (
    <aside
      className={cn(
        "flex-1 lg:flex-none lg:w-[600px] xl:w-[800px] 2xl:w-[900px] bg-slate-50/50 dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 print:hidden h-full overflow-hidden relative z-10",
        viewMode === "preview"
          ? "hidden lg:flex opacity-50 pointer-events-none"
          : "flex",
      )}
    >
      <Tabs
        value={activeSection}
        onValueChange={setActiveSection}
        className="h-full flex flex-col overflow-hidden"
      >
        {/* Navigation Tabs Header */}
        <div className="px-4 md:px-8 py-4 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex justify-center sticky top-0 z-20 shadow-sm">
          <TabsList className="bg-slate-100/80 dark:bg-slate-800/80 p-1.5 rounded-2xl h-14 w-full max-w-[500px] shadow-inner grid grid-cols-3 relative isolate">
            <div 
              className="absolute top-1.5 bottom-1.5 w-[calc((100%-12px)/3)] bg-white dark:bg-slate-700 rounded-xl shadow-sm border border-slate-200/50 dark:border-slate-600 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] -z-10"
              style={{
                transform: `translateX(calc(${
                  activeSection === "header" ? 0 :
                  activeSection === "roles" ? 100 :
                  activeSection === "activities" ? 200 : 0
                }%))`
              }}
            />
            <TabsTrigger
              value="header"
              className="text-xs md:text-sm font-bold h-full rounded-xl data-[state=active]:text-[#015C3A] data-[state=active]:dark:text-emerald-400 text-slate-500 hover:text-slate-700 transition-colors gap-1.5 md:gap-2 bg-transparent border-transparent shadow-none data-[state=active]:shadow-none data-[state=active]:bg-transparent"
            >
              <Settings className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Konfigurasi</span>
              <span className="sm:hidden">Konfig</span>
            </TabsTrigger>
            <TabsTrigger
              value="roles"
              className="text-xs md:text-sm font-bold h-full rounded-xl data-[state=active]:text-[#015C3A] data-[state=active]:dark:text-emerald-400 text-slate-500 hover:text-slate-700 transition-colors gap-1.5 md:gap-2 bg-transparent border-transparent shadow-none data-[state=active]:shadow-none data-[state=active]:bg-transparent"
            >
              <Users className="w-4 h-4 md:w-5 md:h-5" /> Pelaksana
            </TabsTrigger>
            <TabsTrigger
              value="activities"
              className="text-xs md:text-sm font-bold h-full rounded-xl data-[state=active]:text-[#015C3A] data-[state=active]:dark:text-emerald-400 text-slate-500 hover:text-slate-700 transition-colors gap-1.5 md:gap-2 bg-transparent border-transparent shadow-none data-[state=active]:shadow-none data-[state=active]:bg-transparent"
            >
              <FileText className="w-4 h-4 md:w-5 md:h-5" /> Alur Kerja
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0 [scrollbar-gutter:stable] bg-transparent">
          
          {/* KONFIGURASI TAB */}
          <TabsContent value="header" className="mt-0 outline-none">
            <div className="px-5 py-6 lg:px-8 space-y-6">
              <div className="bg-gradient-to-br from-[#015C3A] via-[#016A43] to-[#014A2E] rounded-3xl p-6 flex items-center gap-5 text-white shadow-xl shadow-[#015C3A]/20 relative overflow-hidden border border-[#016A43]/50">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
                <div className="p-3.5 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 flex-shrink-0 relative z-10 shadow-inner">
                  <Settings className="w-8 h-8 text-amber-300" />
                </div>
                <div className="relative z-10">
                  <h2 className="text-xl md:text-2xl font-black tracking-wide text-white drop-shadow-md">Konfigurasi Dokumen</h2>
                  <p className="text-emerald-100 text-xs md:text-sm mt-1.5 font-medium leading-relaxed">Lengkapi identitas, dasar hukum, dan informasi prosedur.</p>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-1 shadow-sm border border-slate-100 dark:border-slate-800">
                <SOPHeaderEditor header={header} setHeader={setHeader} />
              </div>
            </div>
          </TabsContent>

          {/* PELAKSANA TAB */}
          <TabsContent value="roles" className="mt-0 outline-none">
            <div className="px-5 py-6 lg:px-8 space-y-6">
              <div className="bg-gradient-to-br from-[#015C3A] via-[#016A43] to-[#014A2E] rounded-3xl p-6 flex items-center gap-5 text-white shadow-xl shadow-[#015C3A]/20 relative overflow-hidden border border-[#016A43]/50">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
                <div className="p-3.5 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 flex-shrink-0 relative z-10 shadow-inner">
                  <Users className="w-8 h-8 text-amber-300" />
                </div>
                <div className="relative z-10">
                  <h2 className="text-xl md:text-2xl font-black tracking-wide text-white drop-shadow-md">Manajemen Pelaksana</h2>
                  <p className="text-emerald-100 text-xs md:text-sm mt-1.5 font-medium leading-relaxed">Kelola daftar jabatan atau pihak yang terlibat dalam prosedur.</p>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-1 shadow-sm border border-slate-100 dark:border-slate-800">
                <RoleManager
                  roles={roles}
                  setRoles={setRoles}
                  setActivities={setActivities}
                  setConfirm={setConfirm}
                />
              </div>
            </div>
          </TabsContent>

          {/* ALUR KERJA TAB */}
          <TabsContent value="activities" className="mt-0 outline-none">
            <div className="px-5 py-6 lg:px-8 space-y-6">
              <div className="bg-gradient-to-br from-[#015C3A] via-[#016A43] to-[#014A2E] rounded-3xl p-6 flex items-center gap-5 text-white shadow-xl shadow-[#015C3A]/20 relative overflow-hidden border border-[#016A43]/50">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
                <div className="p-3.5 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 flex-shrink-0 relative z-10 shadow-inner">
                  <FileText className="w-8 h-8 text-amber-300" />
                </div>
                <div className="relative z-10">
                  <h2 className="text-xl md:text-2xl font-black tracking-wide text-white drop-shadow-md">Alur Kerja (Flowchart)</h2>
                  <p className="text-emerald-100 text-xs md:text-sm mt-1.5 font-medium leading-relaxed">Buat langkah demi langkah aktivitas kerja secara berurutan.</p>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-1 shadow-sm border border-slate-100 dark:border-slate-800">
                <ActivityEditor
                  activities={activities}
                  setActivities={setActivities}
                  roles={roles}
                  expandedActivities={expandedActivities}
                  setExpandedActivities={setExpandedActivities}
                  setConfirm={setConfirm}
                />
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </aside>
  );
}
