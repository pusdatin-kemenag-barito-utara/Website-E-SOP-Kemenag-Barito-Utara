import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Search, FolderOpen, FileText } from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = userSops.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <aside className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex flex-col h-full print:hidden border-r border-slate-200 dark:border-slate-800 shadow-[2px_0_15px_-3px_rgba(0,0,0,0.05)] relative z-20">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-4 bg-white dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-wide flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-[#015C3A] dark:text-emerald-400" />
            Proyek Saya
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-[#015C3A] hover:bg-[#015C3A]/10 hover:text-[#014A2E] dark:text-emerald-400 dark:hover:bg-emerald-950 transition-colors rounded-full"
            onClick={onNew}
            aria-label="Buat Proyek Baru"
            title="Buat Proyek Baru"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </Button>
        </div>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#015C3A] transition-colors" />
          <input
            type="text"
            placeholder="Cari proyek..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-[#015C3A] focus:ring-1 focus:ring-[#015C3A] transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar bg-slate-50/50 dark:bg-slate-900/50">
        {filtered.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center justify-center h-full opacity-70">
            <div className="w-12 h-12 mb-3 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700">
              {searchQuery ? (
                <Search className="w-5 h-5 text-slate-400" />
              ) : (
                <FileText className="w-5 h-5 text-slate-400" />
              )}
            </div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {searchQuery ? "Proyek tidak ditemukan" : "Belum ada proyek"}
            </p>
            {!searchQuery && (
              <p className="text-[10px] font-medium text-slate-400/80 mt-1.5 px-4">
                Klik tombol + di atas untuk membuat SOP baru
              </p>
            )}
          </div>
        ) : (
          filtered.map((sop) => (
            <div key={sop.id} className="relative group/item">
              <button
                onClick={() => onLoad(sop.id)}
                className={cn(
                  "w-full p-3 rounded-xl text-left transition-all flex flex-col pr-10 border",
                  currentId === sop.id
                    ? "bg-white dark:bg-slate-800 border-[#015C3A]/30 shadow-md ring-1 ring-[#015C3A]/10"
                    : "bg-transparent border-transparent hover:bg-white dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm",
                )}
              >
                <div className="flex items-start gap-2.5">
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 transition-colors",
                    currentId === sop.id ? "bg-[#015C3A]" : "bg-slate-300 dark:bg-slate-600 group-hover/item:bg-slate-400"
                  )} />
                  <div className="min-w-0">
                    <p
                      className={cn(
                        "text-sm font-semibold truncate leading-tight",
                        currentId === sop.id
                          ? "text-[#015C3A] dark:text-emerald-400"
                          : "text-slate-700 dark:text-slate-200",
                      )}
                    >
                      {sop.title}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-medium flex items-center gap-1">
                      Diperbarui: {new Date(sop.updated_at).toLocaleString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(sop);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 opacity-0 group-hover/item:opacity-100 transition-all"
                aria-label="Hapus"
                title="Hapus Proyek"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
