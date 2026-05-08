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
    <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl h-[85vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-6 md:p-8 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">
                Admin Dashboard
              </h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-0.5">
                Monitoring Seluruh Dokumen SOP ({allSops.length} Total)
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-white hover:bg-white/10 rounded-xl h-10 w-10"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Search & Stats */}
        <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/50">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="text"
              placeholder="Cari Judul SOP atau Instansi..."
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <div className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl flex flex-col items-center min-w-[80px]">
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">
                Aktif
              </span>
              <span className="text-lg font-black text-emerald-700 leading-none mt-1">
                {allSops.length}
              </span>
            </div>
            {/* Add more stats if needed */}
          </div>
        </div>

        {/* List Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {filteredSops.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <FileText className="w-16 h-16 mb-4 opacity-10" />
              <p className="text-sm font-bold uppercase tracking-widest">
                Tidak ada data ditemukan
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSops.map((sop: AdminSOPListItem) => (
                <div
                  key={sop.id}
                  className="group bg-white border border-slate-200 p-5 rounded-[1.5rem] hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/5 transition-all cursor-pointer flex items-start gap-4"
                  onClick={() => {
                    onLoadSop(sop.id);
                    onClose();
                  }}
                >
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-50 transition-colors flex-shrink-0">
                    <FileText className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 text-sm truncate group-hover:text-emerald-700 transition-colors">
                      {sop.title}
                    </h3>
                    <div className="flex flex-col gap-1 mt-2">
                      <div className="flex items-center gap-2 text-slate-500">
                        <User className="w-3 h-3" />
                        <span className="text-[10px] font-medium truncate">
                          {sop.header?.satker || "Umum"}
                        </span>
                      </div>
                      {sop.user_email && (
                        <div className="flex items-center gap-2 text-emerald-600/70">
                          <Mail className="w-3 h-3" />
                          <span className="text-[10px] font-bold truncate">
                            {sop.user_email}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-slate-400">
                        <Calendar className="w-3 h-3" />
                        <span className="text-[10px] font-medium">
                          Update:{" "}
                          {new Date(sop.updated_at).toLocaleDateString(
                            "id-ID",
                            { day: "numeric", month: "long", year: "numeric" },
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="self-center">
                    <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:border-emerald-200 group-hover:text-emerald-500 transition-all">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            Privileged Admin Access • Kemenag Barito Utara Digital System
          </p>
        </div>
      </div>
    </div>
  );
}
