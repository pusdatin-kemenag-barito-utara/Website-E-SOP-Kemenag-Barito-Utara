import React from "react";
import { Edit3, Eye, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { SOPPreview } from "@/components/sop/preview/SOPPreview";
import { SOPHeader, Activity } from "@/types/sop";
import { Button } from "@/components/ui/button";

interface LivePreviewProps {
  viewMode: "edit" | "preview";
  setViewMode: (mode: "edit" | "preview") => void;
  scale: number;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  header: SOPHeader;
  activities: Activity[];
  roles: string[];
  isHydrated: boolean;
  expandedActivities: string[];
}

export function LivePreview({
  viewMode,
  setViewMode,
  scale,
  zoom,
  setZoom,
  header,
  activities,
  roles,
  isHydrated,
  expandedActivities,
}: LivePreviewProps) {
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.5));
  const handleResetZoom = () => setZoom(1);
  return (
    <section
      className={cn(
        "flex-1 overflow-y-auto custom-scrollbar print:p-0 print:bg-white transition-all duration-500 h-full [scrollbar-gutter:stable] print:flex print:visible relative",
        viewMode === "preview"
          ? "bg-emerald-50/30 dark:bg-emerald-950/10 flex"
          : "bg-emerald-50/30 dark:bg-emerald-950/10 hidden lg:flex",
      )}
    >
      <div className="absolute inset-0 bg-dot-grid-subtle pointer-events-none opacity-50" />
      <div className="min-h-full w-full p-4 md:py-8 md:px-4 flex flex-col items-center print:p-0 print:m-0 relative z-10">
        <div className="w-full max-w-[1000px] mb-4 flex items-center justify-between print:hidden">
          <div className="hidden md:flex items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-1 rounded-xl shadow-sm border border-slate-200/60 dark:border-slate-800/60">
            <button
              onClick={() => setViewMode("edit")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
                viewMode === "edit"
                  ? "bg-[#015C3A] text-white shadow-md"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300",
              )}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editor</span>
            </button>
            <button
              onClick={() => setViewMode("preview")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
                viewMode === "preview"
                  ? "bg-[#015C3A] text-white shadow-md"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300",
              )}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
          </div>
          <div className="flex items-center">
            <div className="flex items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800/60 rounded-xl p-1 shadow-sm">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-lg text-slate-500 hover:text-[#015C3A] hover:bg-[#015C3A]/10 transition-colors"
                onClick={handleZoomOut}
                aria-label="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </Button>
              <div className="px-2 min-w-[44px] text-center">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  {Math.round(zoom * 100)}%
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-lg text-slate-500 hover:text-[#015C3A] hover:bg-[#015C3A]/10 transition-colors"
                onClick={handleZoomIn}
                aria-label="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </Button>
              <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1" />
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-lg text-slate-500 hover:text-[#015C3A] hover:bg-[#015C3A]/10 transition-colors"
                onClick={handleResetZoom}
                aria-label="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>

        <div
          className="w-full flex justify-center transition-all duration-500 print-unscale print:m-0 print:block"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top center",
            marginBottom: `calc(297mm * ${scale - 1})`,
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

        <footer className="mt-16 text-muted-foreground/50 text-[8px] font-medium tracking-wider uppercase pb-8 print:hidden leading-none">
          Generated by Digital SOP Builder System &bull; 2026
        </footer>
      </div>
    </section>
  );
}
