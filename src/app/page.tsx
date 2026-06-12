"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Builder Layout Components
import { WelcomeScreen } from "@/components/sop/builder/WelcomeScreen";
import { BuilderHeader } from "@/components/sop/builder/BuilderHeader";
import { ProjectSidebar } from "@/components/sop/builder/ProjectSidebar";
import { EditorPanel } from "@/components/sop/builder/EditorPanel";
import { LivePreview } from "@/components/sop/builder/LivePreview";
import { AdminPanel } from "@/components/sop/builder/AdminPanel";

// UI Components
import { ToastCustom, ToastType } from "@/components/ui/toast-custom";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

// Hooks & Utilities
import { useSOPData } from "@/hooks/useSOPData";
import { useAuth } from "@/hooks/useAuth";

export default function SOPBuilder() {
  // 1. Authentication State
  const { user, signInWithGoogle, signOut, loading: authLoading } = useAuth();

  // 2. SOP Data Management Hook
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
    deleteSop,
    isSyncing,
    currentId,
    userSops,
    fetchAllSops,
    allSops,
  } = useSOPData(user?.id, user?.email);

  // 3. UI State
  const [activeSection, setActiveSection] = useState("header");
  const [showProjects, setShowProjects] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [expandedActivities, setExpandedActivities] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const [scale, setScale] = useState(1);
  const [zoom, setZoom] = useState(1);
  const effectiveScale = scale * zoom;
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: ToastType;
  }>({
    visible: false,
    message: "",
    type: "success",
  });
  const [confirm, setConfirm] = useState<{
    open: boolean;
    title: string;
    desc: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: "",
    desc: "",
    onConfirm: () => {},
  });

  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // 4. Effects (Auto-save handled by useSOPData)

  React.useEffect(() => {
    const updateScale = () => {
      const width = window.innerWidth;
      if (width < 1024) {
        setScale(Math.min((width - 60) / 794, 1));
      } else {
        const sidebarWidth =
          (viewMode === "edit" ? (width < 1280 ? 550 : 700) : 0) +
          (showProjects ? 300 : 0);
        setScale(Math.min((width - sidebarWidth - 64) / 794, 1));
      }
    };
    window.addEventListener("resize", updateScale);
    updateScale();
    return () => window.removeEventListener("resize", updateScale);
  }, [viewMode, showProjects]);

  // 5. Handlers
  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ visible: true, message, type });
  };

  const handleSave = async () => {
    const res = await saveToCloud();
    if (res?.success) {
      showToast(res.message);
      setLastSaved(new Date());
    } else if (res?.message) {
      showToast(res.message, "error");
    }
  };

  const handleReset = () => {
    setConfirm({
      open: true,
      title: "Reset Proyek?",
      desc: "Seluruh data yang belum tersimpan ke Cloud akan hilang permanen. Lanjutkan?",
      onConfirm: resetData,
    });
  };

  // 6. Conditional Rendering (Auth & Loading)
  if (!isHydrated) return null;

  if (!user && !authLoading) {
    return <WelcomeScreen onLogin={signInWithGoogle} isLoading={authLoading} />;
  }

  if (authLoading) {
    return (
      <div className="h-screen w-full bg-background flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
        <p className="text-[9px] font-semibold text-muted-foreground tracking-wide">
          Memuat Sesi...
        </p>
      </div>
    );
  }

  // 7. Main Builder UI
  return (
    <div className="h-screen bg-gradient-to-br from-background via-background to-emerald-50/40 dark:from-background dark:via-background dark:to-emerald-950/20 flex flex-col text-foreground overflow-hidden print:overflow-visible print:h-auto print:bg-white relative">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-100/30 dark:bg-emerald-900/10 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-100/20 dark:bg-teal-900/10 rounded-full blur-3xl animate-float-delayed pointer-events-none" />
      <div className="absolute inset-0 bg-dot-grid-subtle pointer-events-none" />

      <div className="relative z-10 flex flex-col flex-1 min-h-0">
      <BuilderHeader
        user={user}
        showProjects={showProjects}
        setShowProjects={setShowProjects}
        isSyncing={isSyncing}
        currentId={currentId}
        onSave={handleSave}
        onReset={handleReset}
        onPrint={() => window.print()}
        onLogout={signOut}
        onLogin={signInWithGoogle}
        authLoading={authLoading}
        lastSaved={lastSaved}
        onOpenAdmin={() => setShowAdmin(true)}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <main className="flex-1 flex overflow-hidden print:overflow-visible print:h-auto print:block">
        {/* Animated Sidebar Wrapper */}
        <div
          className={cn(
            "h-full overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] border-r border-border bg-muted",
            user && showProjects
              ? "w-[300px] opacity-100"
              : "w-0 opacity-0 border-r-0",
          )}
        >
          <div className="w-[300px] h-full">
            <ProjectSidebar
              userSops={userSops}
              currentId={currentId}
              onLoad={(id) => {
                loadSop(id);
                if (window.innerWidth < 1024) setShowProjects(false);
              }}
              onNew={() => {
                setConfirm({
                  open: true,
                  title: "Buat Proyek Baru?",
                  desc: "Data saat ini akan di-reset. Pastikan sudah tersimpan di Cloud jika ingin membukanya lagi nanti.",
                  onConfirm: () => {
                    resetData();
                    setShowProjects(false);
                  },
                });
              }}
              onDelete={(sop) => {
                setConfirm({
                  open: true,
                  title: "Hapus Proyek?",
                  desc: `Anda yakin ingin menghapus "${sop.title}"? Tindakan ini tidak bisa dibatalkan.`,
                  onConfirm: async () => {
                    const res = await deleteSop(sop.id);
                    if (res.success) showToast(res.message);
                  },
                });
              }}
            />
          </div>
        </div>

        <EditorPanel
          viewMode={viewMode}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          header={header}
          setHeader={setHeader}
          roles={roles}
          setRoles={setRoles}
          activities={activities}
          setActivities={setActivities}
          expandedActivities={expandedActivities}
          setExpandedActivities={setExpandedActivities}
          setConfirm={setConfirm}
        />

        <LivePreview
          viewMode={viewMode}
          setViewMode={setViewMode}
          scale={effectiveScale}
          zoom={zoom}
          setZoom={setZoom}
          header={header}
          activities={activities}
          roles={roles}
          isHydrated={isHydrated}
          expandedActivities={expandedActivities}
        />
      </main>

      <ToastCustom
        isVisible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, visible: false })}
      />
      <ConfirmDialog
        isOpen={confirm.open}
        onClose={() => setConfirm({ ...confirm, open: false })}
        onConfirm={confirm.onConfirm}
        title={confirm.title}
        description={confirm.desc}
      />
      <AdminPanel
        isOpen={showAdmin}
        onClose={() => setShowAdmin(false)}
        allSops={allSops}
        onLoadSop={loadSop}
        onRefresh={fetchAllSops}
      />
      </div>
    </div>
  );
}
