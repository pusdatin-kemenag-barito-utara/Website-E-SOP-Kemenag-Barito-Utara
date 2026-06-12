import React, { useEffect, useState } from "react";
import {
  X,
  Search,
  FileText,
  User,
  Calendar,
  Mail,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminSOPListItem } from "@/types/sop";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  allSops: AdminSOPListItem[];
  onLoadSop: (id: string) => void;
  onRefresh: () => void;
}

export function AdminPanel({
  isOpen,
  onClose,
  allSops,
  onLoadSop,
  onRefresh,
}: AdminPanelProps) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (isOpen) {
      onRefresh();
    }
  }, [isOpen, onRefresh]);

  const filteredSops = allSops.filter(
    (sop: AdminSOPListItem) =>
      sop.title.toLowerCase().includes(search.toLowerCase()) ||
      sop.header?.instansi?.toLowerCase().includes(search.toLowerCase()),
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-5 md:p-6 bg-gradient-to-r from-foreground to-foreground/90 text-background flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-md shadow-amber-500/20">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-background">
                Admin Panel
              </h2>
              <p className="text-background/60 text-[10px] font-medium tracking-wide mt-0.5">
                {allSops.length} dokumen SOP
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-background/60 hover:text-background hover:bg-background/10 rounded-lg h-9 w-9"
            onClick={onClose}
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Search & Stats */}
        <div className="p-4 border-b border-border flex flex-col md:flex-row gap-3 items-center justify-between bg-muted">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari judul atau instansi..."
              className="w-full h-9 pl-9 pr-3 bg-background border border-border rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="font-semibold text-primary">{allSops.length}</span>
              <span className="text-muted-foreground">Total</span>
            </div>
          </div>
        </div>

        {/* List Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5 custom-scrollbar">
          {filteredSops.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center">
              <FileText className="w-12 h-12 mb-3 text-muted-foreground/20" />
              <p className="text-xs font-medium text-muted-foreground">
                Tidak ada data ditemukan
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredSops.map((sop: AdminSOPListItem) => (
                <div
                  key={sop.id}
                  className="group bg-card border border-border p-4 rounded-xl hover:border-primary/30 hover:shadow-md transition-all cursor-pointer flex items-start gap-3"
                  onClick={() => {
                    onLoadSop(sop.id);
                    onClose();
                  }}
                >
                  <div className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors flex-shrink-0">
                    <FileText className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors leading-snug">
                      {sop.title}
                    </h3>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <User className="w-2.5 h-2.5" />
                        <span className="text-[9px] font-medium truncate max-w-[100px]">
                          {sop.header?.satker || "Umum"}
                        </span>
                      </div>
                      {sop.user_email && (
                        <div className="flex items-center gap-1 text-primary/70">
                          <Mail className="w-2.5 h-2.5" />
                          <span className="text-[9px] font-medium truncate max-w-[120px]">
                            {sop.user_email}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-muted-foreground/70">
                        <Calendar className="w-2.5 h-2.5" />
                        <span className="text-[9px] font-medium">
                          {new Date(sop.updated_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="self-center flex-shrink-0">
                    <div className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-muted-foreground/40 group-hover:border-primary/30 group-hover:text-primary transition-all">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-muted border-t border-border text-center">
          <p className="text-[8px] font-medium text-muted-foreground tracking-wide">
            Privileged Admin Access &bull; Kemenag Barito Utara Digital System
          </p>
        </div>
      </div>
    </div>
  );
}
