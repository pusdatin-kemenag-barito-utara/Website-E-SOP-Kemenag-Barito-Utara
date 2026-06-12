import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Trash2, Search, FolderOpen } from "lucide-react";
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
    <aside className="bg-card flex flex-col h-full print:hidden border-r border-border shadow-sm">
      <div className="p-3 border-b border-border space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-foreground tracking-wide">
            Proyek Saya
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-primary hover:bg-primary/10"
            onClick={onNew}
            aria-label="Buat Proyek Baru"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari proyek..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 pl-8 pr-3 rounded-lg bg-background border border-border text-xs font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
        {filtered.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-muted flex items-center justify-center">
              {searchQuery ? (
                <Search className="w-5 h-5 text-muted-foreground/40" />
              ) : (
                <FolderOpen className="w-5 h-5 text-muted-foreground/40" />
              )}
            </div>
            <p className="text-[10px] font-medium text-muted-foreground">
              {searchQuery ? "Tidak ditemukan" : "Belum ada proyek"}
            </p>
            {!searchQuery && (
              <p className="text-[8px] text-muted-foreground/60 mt-1">
                Klik + untuk membuat baru
              </p>
            )}
          </div>
        ) : (
          filtered.map((sop) => (
            <div key={sop.id} className="relative group/item">
              <button
                onClick={() => onLoad(sop.id)}
                className={cn(
                  "w-full p-2.5 rounded-lg text-left transition-all border flex flex-col pr-9",
                  currentId === sop.id
                    ? "bg-card border-primary/20 shadow-sm"
                    : "border-transparent hover:bg-card hover:border-border",
                )}
              >
                <p
                  className={cn(
                    "text-xs font-medium truncate leading-snug",
                    currentId === sop.id
                      ? "text-primary"
                      : "text-foreground",
                  )}
                >
                  {sop.title}
                </p>
                <p className="text-[8px] text-muted-foreground/70 mt-0.5 font-medium">
                  {new Date(sop.updated_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(sop);
                }}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover/item:opacity-100 transition-all"
                aria-label="Hapus"
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
