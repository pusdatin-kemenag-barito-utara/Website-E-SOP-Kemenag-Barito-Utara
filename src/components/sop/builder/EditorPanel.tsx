import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Users, FileText, ShieldCheck } from "lucide-react";
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
        "flex-1 lg:flex-none lg:w-[550px] xl:w-[700px] bg-white border-r border-slate-200 flex flex-col transition-all duration-300 print:hidden h-full overflow-hidden",
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
              className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-md font-bold text-[10px] transition-all"
            >
              <Settings className="w-3.5 h-3.5 mr-2 text-amber-600" /> Konfigurasi
            </TabsTrigger>
            <TabsTrigger
              value="roles"
              className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md font-bold text-[10px] transition-all"
            >
              <Users className="w-3.5 h-3.5 mr-2 text-blue-600" /> Pelaksana
            </TabsTrigger>
            <TabsTrigger
              value="activities"
              className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-md font-bold text-[10px] transition-all"
            >
              <FileText className="w-3.5 h-3.5 mr-2 text-emerald-600" /> Alur Kerja
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#FDFDFD] min-h-0 [scrollbar-gutter:stable]">
          <TabsContent value="header" className="mt-0 outline-none">
            <div className="px-6 py-4">
              <div className="flex items-center gap-2 mb-6">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider leading-none">
                  Identitas & Legalitas
                </h2>
              </div>
              <SOPHeaderEditor header={header} setHeader={setHeader} />
            </div>
          </TabsContent>

          <TabsContent value="roles" className="mt-0 outline-none">
            <div className="px-6 py-4">
              <div className="flex items-center gap-2 mb-6">
                <Users className="w-5 h-5 text-blue-600" />
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider leading-none">
                  Manajemen Pelaksana
                </h2>
              </div>
              <RoleManager
                roles={roles}
                setRoles={setRoles}
                setActivities={setActivities}
                setConfirm={setConfirm}
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
                setConfirm={setConfirm}
              />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </aside>
  );
}
