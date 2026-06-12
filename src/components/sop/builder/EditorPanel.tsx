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
        "flex-1 lg:flex-none lg:w-[550px] xl:w-[700px] bg-card border-r border-border flex flex-col transition-all duration-300 print:hidden h-full overflow-hidden",
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
        <div className="px-4 md:px-6 border-b border-border bg-muted">
          <TabsList variant="line" className="w-full h-11 gap-0">
            <TabsTrigger
              value="header"
              className="text-xs font-medium h-full rounded-none px-4 data-[state=active]:text-primary data-[state=active]:font-semibold gap-2"
            >
              <Settings className="w-3.5 h-3.5" /> Konfigurasi
            </TabsTrigger>
            <TabsTrigger
              value="roles"
              className="text-xs font-medium h-full rounded-none px-4 data-[state=active]:text-primary data-[state=active]:font-semibold gap-2"
            >
              <Users className="w-3.5 h-3.5" /> Pelaksana
            </TabsTrigger>
            <TabsTrigger
              value="activities"
              className="text-xs font-medium h-full rounded-none px-4 data-[state=active]:text-primary data-[state=active]:font-semibold gap-2"
            >
              <FileText className="w-3.5 h-3.5" /> Alur Kerja
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0 [scrollbar-gutter:stable] bg-[radial-gradient(ellipse_at_top,_hsl(var(--primary)/0.02)_0%,_transparent_60%)]">
          <TabsContent value="header" className="mt-0 outline-none">
            <div className="px-5 py-4">
              <SOPHeaderEditor header={header} setHeader={setHeader} />
            </div>
          </TabsContent>

          <TabsContent value="roles" className="mt-0 outline-none">
            <div className="px-5 py-4">
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
