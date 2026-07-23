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
  const [unscaledHeight, setUnscaledHeight] = React.useState(297 * 3.7795); // default 1 A4 page in px
  const previewRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!previewRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target instanceof HTMLElement) {
          setUnscaledHeight(entry.target.offsetHeight);
        }
      }
    });
    observer.observe(previewRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={cn(
        "flex-1 overflow-auto custom-scrollbar print:p-0 print:bg-white transition-all duration-500 h-full [scrollbar-gutter:stable] print:flex print:visible relative",
        viewMode === "preview"
          ? "bg-emerald-50/30 dark:bg-emerald-950/10 flex"
          : "bg-emerald-50/30 dark:bg-emerald-950/10 hidden lg:flex",
      )}
    >
      <div className="absolute inset-0 bg-dot-grid-subtle pointer-events-none opacity-50" />

      {/* Container */}
      <div
        className="min-h-full min-w-max w-full p-4 md:py-6 md:px-4 grid print:p-0 print:m-0 relative z-10"
        style={{ placeItems: "safe center", placeContent: "start safe center" }}
      >
        {/* Top Control Bar Above Live Preview */}
        <div className="w-full max-w-[1000px] mb-4 flex items-center justify-between gap-3 print:hidden sticky top-2 z-20">
          {/* Mode Switcher (Editor / Preview) */}
          <div className="flex items-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-1 rounded-xl shadow-xs border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setViewMode("edit")}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                viewMode === "edit"
                  ? "bg-[#015C3A] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editor</span>
            </button>
            <button
              onClick={() => setViewMode("preview")}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                viewMode === "preview"
                  ? "bg-[#015C3A] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center">
            <div className="flex items-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-xl p-1 shadow-xs">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-lg text-slate-500 hover:text-[#015C3A] hover:bg-[#015C3A]/10 transition-colors"
                onClick={handleZoomOut}
                aria-label="Zoom Out"
                title="Perkecil"
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
                title="Perbesar"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </Button>
              <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-lg text-slate-500 hover:text-[#015C3A] hover:bg-[#015C3A]/10 transition-colors"
                onClick={handleResetZoom}
                aria-label="Reset Zoom"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Scaled Preview Document */}
        <div
          style={{
            width: `${794 * scale}px`,
            height: `${unscaledHeight * scale}px`,
            transition: "width 0.2s ease-out, height 0.2s ease-out",
          }}
          className="relative print:w-full print:h-auto"
        >
          <div
            ref={previewRef}
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              width: "794px",
            }}
            className="absolute top-0 left-0 print:static print:transform-none print:w-full shadow-2xl print:shadow-none bg-white rounded-sm print:rounded-none"
          >
            <SOPPreview
              header={header}
              activities={activities}
              roles={roles}
              isHydrated={isHydrated}
              expandedActivities={expandedActivities}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
