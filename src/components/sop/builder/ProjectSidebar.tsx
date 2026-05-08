import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { SOPListItem } from "@/types/sop";

interface ProjectSidebarProps {
  userSops: SOPListItem[];
  currentId: string | null;
  onLoad: (id: string) => void;
  onDelete: (sop: SOPListItem) => void;
  onNew: () => void;
}

export function ProjectSidebar({
  userSops,
  currentId,
  onLoad,
  onDelete,
  onNew,
}: ProjectSidebarProps) {
  return (
    <aside className="bg-slate-50 flex flex-col h-full print:hidden">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
        <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest leading-none">
          Daftar SOP Saya
        </h2>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-emerald-600 hover:bg-emerald-50"
          onClick={onNew}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
        {userSops.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-20" />
            <p className="text-[10px] font-bold uppercase">Belum ada data</p>
          </div>
        ) : (
          userSops.map((sop) => (
            <div key={sop.id} className="relative group/item">
              <button
                onClick={() => onLoad(sop.id)}
                className={cn(
                  "w-full p-3 rounded-xl text-left transition-all border flex flex-col pr-10",
                  currentId === sop.id
                    ? "bg-white border-emerald-200 shadow-sm"
                    : "border-transparent hover:bg-white hover:border-slate-200",
                )}
              >
                <p
                  className={cn(
                    "text-xs font-bold truncate mb-1",
                    currentId === sop.id
                      ? "text-emerald-600"
                      : "text-slate-700",
                  )}
                >
                  {sop.title}
                </p>
                <p className="text-[9px] text-slate-400 font-medium">
                  Update: {new Date(sop.updated_at).toLocaleDateString("id-ID")}
                </p>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(sop);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover/item:opacity-100 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
