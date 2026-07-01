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
      
      {/* We use grid with safe center so the container centers the content when it fits, but aligns to start when it overflows, preventing left-side clipping on mobile */}
      <div 
        className="min-h-full min-w-max w-full p-4 md:py-8 md:px-4 grid print:p-0 print:m-0 relative z-10"
        style={{ placeItems: "safe center", placeContent: "start safe center" }}
      >
        <div className="w-full max-w-[1000px] mb-4 flex flex-col md:flex-row items-center justify-between gap-3 print:hidden sticky left-4 md:left-auto right-4 md:right-auto z-20">
          <div className="flex w-full md:w-auto items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-1 rounded-xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 lg:hidden">
            <button
              onClick={() => setViewMode("edit")}
              className={cn(
                "flex-1 justify-center px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
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
                "flex-1 justify-center px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5",
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

        {/* 
          Using transform-origin top left allows the element to scale properly.
        */}
        <div
          className="transition-all duration-500 print-unscale print:m-0 print:block"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            marginBottom: `${unscaledHeight * (scale - 1)}px`,
            marginRight: `calc(210mm * ${scale - 1})`,
          }}
        >
          <div ref={previewRef} className="w-max">
            <SOPPreview
              header={header}
              activities={activities}
              roles={roles}
              isHydrated={isHydrated}
              expandedActivities={expandedActivities}
            />
          </div>
        </div>

        <footer className="mt-16 text-muted-foreground/50 text-[8px] font-medium tracking-wider uppercase pb-8 print:hidden leading-none justify-self-center">
          Generated by E-SOP Digital Kemenag Barito Utara &bull; {new Date().getFullYear()}
        </footer>
      </div>

      <div className="absolute bottom-4 left-0 right-0 text-center print:block hidden">
        <p className="text-[10px] text-gray-400 font-mono">
          Generated by E-SOP Digital Kemenag Barito Utara &bull; {new Date().getFullYear()}
        </p>
      </div>
    </section>
  );
}
