"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";

// Builder Layout Components
import { WelcomeScreen } from "@/components/sop/builder/WelcomeScreen";
import { BuilderHeader } from "@/components/sop/builder/BuilderHeader";
import { ProjectSidebar } from "@/components/sop/builder/ProjectSidebar";
import { EditorPanel } from "@/components/sop/builder/EditorPanel";
import { LivePreview } from "@/components/sop/builder/LivePreview";

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
  } = useSOPData(user?.id);

  // 3. UI State
  const [activeSection, setActiveSection] = useState("header");
  const [showProjects, setShowProjects] = useState(false);
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
      <div className="h-screen w-full bg-white flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
          Memuat Sesi...
        </p>
      </div>
    );
  }

  // 7. Main Builder UI
  return (
    <div className="h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900 overflow-hidden print:overflow-visible print:h-auto print:bg-white">
      <BuilderHeader
        user={user}
        viewMode={viewMode}
        setViewMode={setViewMode}
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
      />

      <main className="flex-1 flex overflow-hidden h-[calc(100vh-64px)] print:overflow-visible print:h-auto print:block">
        {user && showProjects && (
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
        )}

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
    </div>
  );
}
