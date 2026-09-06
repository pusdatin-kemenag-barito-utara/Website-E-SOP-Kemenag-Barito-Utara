import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { WelcomeScreen } from "@/components/sop/builder/WelcomeScreen";
import { BuilderHeader } from "@/components/sop/builder/BuilderHeader";
import { ProjectSidebar } from "@/components/sop/builder/ProjectSidebar";
import { EditorPanel } from "@/components/sop/builder/EditorPanel";
import { LivePreview } from "@/components/sop/builder/LivePreview";
import { AdminPanel } from "@/components/sop/builder/AdminPanel";

import { ToastCustom, type ToastType } from "@/components/ui/toast-custom";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Providers } from "@/components/providers";

import { useSOPData } from "@/hooks/useSOPData";
import { useAuth } from "@/hooks/useAuth";
import { useSOPPresence } from "@/hooks/useSOPPresence";
import { trackPageView, trackSOPSave, trackSOPPrint, trackSOPDelete } from "@/lib/analytics";

function SOPApp() {
  const { user, signInWithEmail, signOut, loading: authLoading } = useAuth();

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
    lastSaved,
  } = useSOPData(user?.id, user?.email);

  const lockedSopIds = useSOPPresence(user?.id || null, currentId);

  const [activeSection, setActiveSection] = useState("header");
  const [showProjects, setShowProjects] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [expandedActivities, setExpandedActivities] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const [scale, setScale] = useState(1);
  const [zoom, setZoom] = useState(1);
  const effectiveScale = scale * zoom;

  const [editorWidth, setEditorWidth] = useState<number>(650);
  const [isResizing, setIsResizing] = useState<boolean>(false);

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
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: "",
    desc: "",
    onConfirm: () => {},
  });

  const startResizing = React.useCallback((mouseDownEvent: React.MouseEvent) => {
    mouseDownEvent.preventDefault();
    setIsResizing(true);
  }, []);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const sidebarOffset = showProjects ? 300 : 0;
      const newWidth = e.clientX - sidebarOffset;
      const minWidth = 380;
      const maxWidth = Math.min(window.innerWidth - 450, 1100);
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setEditorWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, showProjects]);

  React.useEffect(() => {
    const updateScale = () => {
      const width = window.innerWidth;
      if (width < 1024) {
        setScale(Math.min((width - 60) / 794, 1));
      } else {
        const sidebarWidth =
          (viewMode === "edit" ? editorWidth : 0) +
          (showProjects ? 300 : 0);
        setScale(Math.min((width - sidebarWidth - 64) / 794, 1));
      }
    };
    window.addEventListener("resize", updateScale);
    updateScale();
    return () => window.removeEventListener("resize", updateScale);
  }, [viewMode, showProjects, editorWidth]);

  const showToast = React.useCallback((message: string, type: ToastType = "success") => {
    setToast({ visible: true, message, type });
  }, []);

  // Track Page View on Mount
  React.useEffect(() => {
    trackPageView("/", "E-SOP Digital | Kemenag Kabupaten Barito Utara");
  }, []);

  const handleSave = React.useCallback(async () => {
    const res = await saveToCloud();
    if (res?.success) {
      showToast(res.message);
      trackSOPSave(header.namaSOP, activities.length, roles.length, !currentId);
    } else if (res?.message) {
      showToast(res.message, "error");
    }
  }, [saveToCloud, showToast, header.namaSOP, activities.length, roles.length, currentId]);

  const handlePrint = React.useCallback(() => {
    trackSOPPrint(header.namaSOP);
    window.print();
  }, [header.namaSOP]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSave();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
        e.preventDefault();
        handlePrint();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave, handlePrint]);

  const handleReset = () => {
    setConfirm({
      open: true,
      title: "Reset Proyek?",
      desc: "Seluruh data yang belum tersimpan ke Cloud akan hilang permanen. Lanjutkan?",
      onConfirm: () => {
        trackSOPDelete(header.namaSOP);
        resetData();
      },
    });
  };

  if (authLoading) {
    return (
      <div className="h-screen w-full bg-[#F8FAFC] dark:bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#015C3A] animate-spin mb-3" />
        <p className="text-xs font-semibold text-slate-500 tracking-wide">
          Memuat Sesi...
        </p>
      </div>
    );
  }

  if (!user) {
    return <WelcomeScreen onLogin={signInWithEmail} isLoading={authLoading} />;
  }

  if (!isHydrated) {
    return (
      <div className="h-screen w-full bg-[#F8FAFC] dark:bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#015C3A] animate-spin mb-3" />
        <p className="text-xs font-semibold text-slate-500 tracking-wide">
          Menyiapkan Editor SOP...
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-50/30 dark:bg-slate-950 flex flex-col text-foreground overflow-hidden print:overflow-visible print:h-auto print:bg-white relative">
      <BuilderHeader
        user={user}
        showProjects={showProjects}
        setShowProjects={setShowProjects}
        isSyncing={isSyncing}
        onSave={handleSave}
        onReset={handleReset}
        onPrint={handlePrint}
        onLogout={signOut}
        lastSaved={lastSaved}
        onOpenAdmin={() => setShowAdmin(true)}
        sopTitle={header.namaSOP}
      />

      <main className="flex-1 flex overflow-hidden print:overflow-visible print:h-auto print:block relative">
        <div
          className={cn(
            "h-full overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] z-30 bg-background absolute inset-y-0 left-0 lg:relative lg:inset-auto",
            user && showProjects
              ? "w-full lg:w-[300px] opacity-100"
              : "w-0 opacity-0",
          )}
        >
          <div className="w-full lg:w-[300px] h-full">
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
          editorWidth={editorWidth}
          viewMode={viewMode}
          setViewMode={setViewMode}
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

        {viewMode !== "preview" && (
          <div
            onMouseDown={startResizing}
            className={cn(
              "hidden lg:flex w-2 hover:w-2.5 bg-slate-200/80 dark:bg-slate-800 hover:bg-[#015C3A] dark:hover:bg-[#015C3A] cursor-col-resize select-none items-center justify-center transition-colors duration-150 relative z-30 shrink-0 group shadow-xs",
              isResizing && "bg-[#015C3A] dark:bg-[#015C3A] w-2.5"
            )}
            title="Geser untuk mengubah ukuran panel editor"
          >
            <div className="w-1 h-8 rounded-full bg-slate-400 dark:bg-slate-600 group-hover:bg-white transition-colors" />
          </div>
        )}

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
        confirmText={confirm.confirmText}
        cancelText={confirm.cancelText}
      />
      <AdminPanel
        isOpen={showAdmin}
        onClose={() => setShowAdmin(false)}
        allSops={allSops}
        onLoadSop={loadSop}
        onRefresh={fetchAllSops}
        onCreateNew={() => {
          resetData();
          setShowAdmin(false);
        }}
        lockedSopIds={lockedSopIds}
        currentUserEmail={user?.email}
        onToast={showToast}
      />
    </div>
  );
}

export function App() {
  return (
    <Providers>
      <SOPApp />
    </Providers>
  );
}