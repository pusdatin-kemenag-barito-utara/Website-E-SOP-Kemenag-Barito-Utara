import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Users, FileText, Eye, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SOPHeaderEditor } from "@/components/sop/editor/header/SOPHeaderEditor";
import { RoleManager } from "@/components/sop/editor/RoleManager";
import { ActivityEditor } from "@/components/sop/editor/activity/ActivityEditor";
import { SOPHeader, Activity } from "@/types/sop";

interface EditorPanelProps {
  editorWidth?: number;
  viewMode: "edit" | "preview";
  setViewMode?: (mode: "edit" | "preview") => void;
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
  editorWidth = 650,
  viewMode,
  setViewMode,
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
      style={
        typeof window !== "undefined" && window.innerWidth >= 1024 && viewMode !== "preview"
          ? { width: `${editorWidth}px` }
          : undefined
      }
      className={cn(
        "flex-1 lg:flex-none bg-slate-50/50 dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-none print:hidden h-full overflow-hidden relative z-10 shrink-0",
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
        <div className="px-4 md:px-8 py-3.5 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex flex-col items-center gap-3 sticky top-0 z-20 shadow-xs">
          {/* Mobile View Toggle */}
          {setViewMode && (
            <div className="lg:hidden flex items-center bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl shadow-xs border border-slate-200/60 dark:border-slate-700 w-full max-w-[500px]">
              <button
                onClick={() => setViewMode("edit")}
                className={cn(
                  "flex-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5",
                  viewMode === "edit"
                    ? "bg-[#015C3A] text-white shadow-xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300",
                )}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editor</span>
              </button>
              <button
                onClick={() => setViewMode("preview")}
                className={cn(
                  "flex-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5",
                  viewMode === "preview"
                    ? "bg-[#015C3A] text-white shadow-xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300",
                )}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
            </div>
          )}

          <TabsList className="bg-slate-100/80 dark:bg-slate-800/80 p-1.5 rounded-2xl h-12 w-full max-w-[500px] shadow-xs grid grid-cols-3 relative isolate">
            <div
              className="absolute top-1.5 bottom-1.5 left-1.5 w-[calc((100%-12px)/3)] bg-white dark:bg-slate-700 rounded-xl shadow-xs border border-slate-200/50 dark:border-slate-600 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] -z-10"
              style={{
                transform: `translateX(calc(${
                  activeSection === "header"
                    ? 0
                    : activeSection === "roles"
                    ? 100
                    : activeSection === "activities"
                    ? 200
                    : 0
                }% + ${
                  activeSection === "header"
                    ? "0px"
                    : activeSection === "roles"
                    ? "0px"
                    : activeSection === "activities"
                    ? "0px"
                    : "0px"
                }))`,
              }}
            />
            <TabsTrigger
              value="header"
              className="text-[10px] sm:text-xs md:text-sm font-bold h-full rounded-xl data-[state=active]:text-[#015C3A] data-[state=active]:dark:text-emerald-400 text-slate-500 hover:text-slate-700 transition-colors gap-1 sm:gap-1.5 md:gap-2 bg-transparent border-transparent shadow-none data-[state=active]:shadow-none data-[state=active]:bg-transparent flex flex-col sm:flex-row items-center justify-center"
            >
              <Settings className="w-4 h-4 md:w-5 md:h-5" />
              <span>Konfigurasi</span>
            </TabsTrigger>
            <TabsTrigger
              value="roles"
              className="text-[10px] sm:text-xs md:text-sm font-bold h-full rounded-xl data-[state=active]:text-[#015C3A] data-[state=active]:dark:text-emerald-400 text-slate-500 hover:text-slate-700 transition-colors gap-1 sm:gap-1.5 md:gap-2 bg-transparent border-transparent shadow-none data-[state=active]:shadow-none data-[state=active]:bg-transparent flex flex-col sm:flex-row items-center justify-center"
            >
              <Users className="w-4 h-4 md:w-5 md:h-5" />
              <span>Pelaksana</span>
            </TabsTrigger>
            <TabsTrigger
              value="activities"
              className="text-[10px] sm:text-xs md:text-sm font-bold h-full rounded-xl data-[state=active]:text-[#015C3A] data-[state=active]:dark:text-emerald-400 text-slate-500 hover:text-slate-700 transition-colors gap-1 sm:gap-1.5 md:gap-2 bg-transparent border-transparent shadow-none data-[state=active]:shadow-none data-[state=active]:bg-transparent flex flex-col sm:flex-row items-center justify-center"
            >
              <FileText className="w-4 h-4 md:w-5 md:h-5" />
              <span>Alur Kerja</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0 [scrollbar-gutter:stable] bg-transparent">
          {/* KONFIGURASI TAB */}
          <TabsContent value="header" className="mt-0 outline-none">
            <div className="px-4 py-5 lg:px-6 space-y-5">
              <SOPHeaderEditor header={header} setHeader={setHeader} />
            </div>
          </TabsContent>

          {/* PELAKSANA TAB */}
          <TabsContent value="roles" className="mt-0 outline-none">
            <div className="px-4 py-5 lg:px-6 space-y-5">
              <RoleManager
                roles={roles}
                setRoles={setRoles}
                setActivities={setActivities}
                setConfirm={setConfirm}
              />
            </div>
          </TabsContent>

          {/* ALUR KERJA TAB */}
          <TabsContent value="activities" className="mt-0 outline-none">
            <div className="px-4 py-5 lg:px-6 space-y-5">
              <ActivityEditor
                activities={activities}
                setActivities={setActivities}
                roles={roles}
                expandedActivities={expandedActivities}
                setExpandedActivities={setExpandedActivities}
                setConfirm={setConfirm}
              />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </aside>
  );
}
