import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Users, GitMerge, Edit3, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { SOPHeaderEditor } from "@/components/sop/editor/header/SOPHeaderEditor";
import { RoleManager } from "@/components/sop/editor/RoleManager";
import { ActivityEditor } from "@/components/sop/editor/activity/ActivityEditor";
import type { SOPHeader, Activity } from "@/types/sop";

interface EditorPanelProps {
  editorWidth: number;
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
  editorWidth,
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
      style={{
        fontFamily: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif",
        ...(viewMode !== "preview" ? { width: `${editorWidth}px` } : {}),
      }}
      className={cn(
        "bg-slate-50/50 dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-800 flex flex-col print:hidden h-full overflow-hidden relative z-10 shrink-0 font-sans",
        viewMode === "preview" ? "hidden" : "flex w-full lg:w-auto",
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
                type="button"
                onClick={() => setViewMode("edit")}
                className={cn(
                  "flex-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                  viewMode === "edit"
                    ? "bg-[#015C3A] text-white shadow-xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300",
                )}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editor</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("preview")}
                className={cn(
                  "flex-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer",
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
                    ? "4px"
                    : activeSection === "activities"
                    ? "8px"
                    : "0px"
                }))`,
              }}
            />
            <TabsTrigger
              value="header"
              className={cn(
                "h-full text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 rounded-xl border-0 shadow-none z-10 cursor-pointer",
                activeSection === "header"
                  ? "text-[#015C3A] dark:text-white font-extrabold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100",
              )}
            >
              <Settings className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
              <span>Konfigurasi</span>
            </TabsTrigger>
            <TabsTrigger
              value="roles"
              className={cn(
                "h-full text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 rounded-xl border-0 shadow-none z-10 cursor-pointer",
                activeSection === "roles"
                  ? "text-[#015C3A] dark:text-white font-extrabold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100",
              )}
            >
              <Users className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
              <span>Pelaksana</span>
            </TabsTrigger>
            <TabsTrigger
              value="activities"
              className={cn(
                "h-full text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 rounded-xl border-0 shadow-none z-10 cursor-pointer",
                activeSection === "activities"
                  ? "text-[#015C3A] dark:text-white font-extrabold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100",
              )}
            >
              <GitMerge className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
              <span>Alur Kerja</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <TabsContent value="header" className="m-0 border-none outline-none">
            <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
              <SOPHeaderEditor header={header} setHeader={setHeader} />
            </div>
          </TabsContent>

          <TabsContent value="roles" className="m-0 border-none outline-none">
            <div className="p-4 md:p-6 max-w-4xl mx-auto">
              <RoleManager
                roles={roles}
                setRoles={setRoles}
                setActivities={setActivities}
                setConfirm={setConfirm}
              />
            </div>
          </TabsContent>

          <TabsContent
            value="activities"
            className="m-0 border-none outline-none"
          >
            <div className="max-w-4xl mx-auto">
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
