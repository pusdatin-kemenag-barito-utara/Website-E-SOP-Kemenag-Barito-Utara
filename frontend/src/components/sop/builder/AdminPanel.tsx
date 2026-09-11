import React, { useEffect, useState, useMemo } from "react";
import {
  X,
  Search,
  FileText,
  User,
  Users,
  Calendar,
  Mail,
  ChevronRight,
  ShieldAlert,
  ArrowLeft,
  FolderOpen,
  Plus,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AdminSOPListItem } from "@/types/sop";
import { cn } from "@/lib/utils";
import { getEnv } from "@/lib/env";
import { UserManagementTab } from "@/components/admin/UserManagementTab";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  allSops: AdminSOPListItem[];
  onLoadSop: (id: string) => void;
  onRefresh: () => void;
  onCreateNew?: () => void;
  lockedSopIds?: string[];
  currentUserEmail?: string | null;
  onToast?: (message: string, type?: "success" | "error" | "info") => void;
}

const superAdminEmail = getEnv("PUBLIC_SUPER_ADMIN_EMAIL", "");

const resolveSopBidang = (sop: AdminSOPListItem): string => {
  if (sop.user_bidang && sop.user_bidang.trim()) {
    return sop.user_bidang.trim();
  }
  if (superAdminEmail && sop.user_email === superAdminEmail) {
    return "Proyek Super Admin";
  }
  if (sop.user_email) {
    const prefix = sop.user_email.split("@")[0].replace(/^admin\./, "");
    return prefix.charAt(0).toUpperCase() + prefix.slice(1);
  }
  return "Umum";
};

export function AdminPanel({
  isOpen,
  onClose,
  allSops,
  onLoadSop,
  onRefresh,
  onCreateNew,
  lockedSopIds = [],
  currentUserEmail,
  onToast,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"sops" | "users">("sops");
  const [search, setSearch] = useState("");
  const [selectedBidang, setSelectedBidang] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      onRefresh();
    }
  }, [isOpen, onRefresh]);

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setSelectedBidang(null);
      setSearch("");
    }
  }

  const groupedSops = useMemo(() => {
    const groups: Record<string, AdminSOPListItem[]> = {};
    allSops.forEach((sop) => {
      const bidang = resolveSopBidang(sop);
      if (!groups[bidang]) groups[bidang] = [];
      groups[bidang].push(sop);
    });

    const sortedGroups: Record<string, AdminSOPListItem[]> = {};
    if (groups["Proyek Super Admin"]) {
      sortedGroups["Proyek Super Admin"] = groups["Proyek Super Admin"];
    }
    Object.keys(groups)
      .sort((a, b) => a.localeCompare(b))
      .forEach((key) => {
        if (key !== "Proyek Super Admin") {
          sortedGroups[key] = groups[key];
        }
      });

    return sortedGroups;
  }, [allSops]);

  const filteredFolders = useMemo(() => {
    return Object.keys(groupedSops).filter((bidang) =>
      bidang.toLowerCase().includes(search.toLowerCase())
    );
  }, [groupedSops, search]);

  const filteredSops = useMemo(() => {
    if (!selectedBidang) return [];
    return groupedSops[selectedBidang].filter(
      (sop: AdminSOPListItem) =>
        sop.title.toLowerCase().includes(search.toLowerCase()) ||
        sop.header?.instansi?.toLowerCase().includes(search.toLowerCase())
    );
  }, [groupedSops, selectedBidang, search]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-950 w-full max-w-[96vw] 2xl:max-w-7xl h-[92vh] rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] ring-1 ring-black/5 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Modal Top Header */}
        <div className="p-6 md:p-8 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 text-white flex items-center justify-between relative overflow-hidden transition-all duration-500">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <div className="flex items-center gap-4 relative z-10">
            {activeTab === "sops" && selectedBidang ? (
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 rounded-full h-10 w-10 shrink-0 mr-1 cursor-pointer"
                onClick={() => {
                  setSelectedBidang(null);
                  setSearch("");
                }}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            ) : (
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-2 flex items-center justify-center shadow-lg shrink-0">
                <img src="/sop.png" alt="Logo SOP" className="w-full h-full object-contain" />
              </div>
            )}

            <div>
              <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                {activeTab === "users" ? (
                  <>
                    <Users className="w-5 h-5 text-emerald-400" />
                    Manajemen Pengguna & Akun Seksi
                  </>
                ) : selectedBidang ? (
                  <>
                    <FolderOpen className="w-5 h-5 text-amber-400" />
                    {selectedBidang}
                  </>
                ) : (
                  "Pusat Kontrol Super Admin"
                )}
              </h2>
              <p className="text-slate-300 text-xs font-medium tracking-wide mt-1 flex items-center gap-2">
                {activeTab === "users" ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Kelola akun, peran, dan hak akses aplikasi E-SOP Digital
                  </>
                ) : !selectedBidang ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    Pusat Kontrol Dokumen SOP Kemenag
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {groupedSops[selectedBidang]?.length || 0} Dokumen SOP di Bidang ini
                  </>
                )}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-slate-300 hover:text-white hover:bg-white/10 rounded-xl h-10 w-10 relative z-10 transition-colors shrink-0 cursor-pointer"
            onClick={onClose}
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center px-6 bg-slate-900 border-b border-slate-800 gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              setActiveTab("sops");
              setSelectedBidang(null);
              setSearch("");
            }}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer",
              activeTab === "sops"
                ? "text-white border-amber-400 bg-white/5"
                : "text-slate-400 hover:text-slate-200 border-transparent hover:bg-white/5"
            )}
          >
            <FolderOpen className="w-4 h-4" />
            <span>Dokumen SOP Satker</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("users");
            }}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer",
              activeTab === "users"
                ? "text-white border-emerald-400 bg-white/5"
                : "text-slate-400 hover:text-slate-200 border-transparent hover:bg-white/5"
            )}
          >
            <Users className="w-4 h-4" />
            <span>Manajemen Pengguna</span>
          </button>
        </div>

        {/* Tab Content: Users vs SOPs */}
        {activeTab === "users" ? (
          <UserManagementTab currentUserEmail={currentUserEmail} onToast={onToast} />
        ) : (
          <>
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col md:flex-row gap-4 items-center justify-between shrink-0">
              <div className="relative w-full md:w-96 group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#015C3A] transition-colors" />
                <input
                  type="text"
                  id="admin-search"
                  name="admin-search"
                  placeholder={selectedBidang ? "Cari judul SOP..." : "Cari nama Bidang/Proyek..."}
                  className="w-full h-11 pl-10 pr-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#015C3A]/20 focus:border-[#015C3A] transition-all placeholder:text-slate-400 shadow-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm w-full md:w-auto justify-center md:justify-start">
                <div className="flex items-center justify-center w-5 h-5 rounded-md bg-[#015C3A]/10 text-[#015C3A] font-bold text-xs mr-1">
                  {selectedBidang ? filteredSops.length : filteredFolders.length}
                </div>
                <span className="font-semibold">
                  {selectedBidang ? "Total Dokumen" : "Total Bidang"}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-900/20 custom-scrollbar relative">
              {!selectedBidang && (
                filteredFolders.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center mb-5">
                      <FolderOpen className="w-8 h-8 text-slate-300 dark:text-slate-500" />
                    </div>
                    <h3 className="text-base font-bold text-slate-700 dark:text-slate-200 mb-1">
                      Bidang Tidak Ditemukan
                    </h3>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {filteredFolders.map((bidang) => (
                      <div
                        key={bidang}
                        className="group bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-[#015C3A]/40 p-5 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1 cursor-pointer flex flex-col gap-3 relative overflow-hidden"
                        onClick={() => {
                          setSelectedBidang(bidang);
                          setSearch("");
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-2xl flex items-center justify-center group-hover:from-[#015C3A]/10 group-hover:to-[#015C3A]/20 transition-all flex-shrink-0">
                            {bidang === "Proyek Super Admin" ? (
                              <ShieldAlert className="w-6 h-6 text-slate-400 group-hover:text-amber-500 transition-colors" />
                            ) : (
                              <FolderOpen className="w-6 h-6 text-slate-400 group-hover:text-[#015C3A] transition-colors" />
                            )}
                          </div>
                          <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 group-hover:bg-[#015C3A] group-hover:text-white transition-colors">
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#015C3A] transition-colors truncate">
                            {bidang}
                          </h3>
                          <p className="text-[11px] font-medium text-slate-500 mt-1">
                            {groupedSops[bidang].length} Dokumen SOP
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}

              {selectedBidang && (
                filteredSops.length === 0 && selectedBidang !== "Proyek Super Admin" ? (
                  <div className="h-full flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center mb-5">
                      <FileText className="w-8 h-8 text-slate-300 dark:text-slate-500" />
                    </div>
                    <h3 className="text-base font-bold text-slate-700 dark:text-slate-200 mb-1">
                      SOP Tidak Ditemukan
                    </h3>
                    <p className="text-slate-400 text-sm max-w-sm text-center">
                      Tidak ditemukan SOP yang cocok dengan pencarian Anda di folder ini.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 animate-in fade-in slide-in-from-right-8 duration-300">
                    {selectedBidang === "Proyek Super Admin" && (
                      <div
                        className="group bg-[#015C3A]/5 border-2 border-dashed border-[#015C3A]/30 hover:border-[#015C3A] hover:bg-[#015C3A]/10 p-5 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-lg cursor-pointer flex flex-col items-center justify-center gap-3 relative overflow-hidden min-h-[120px]"
                        onClick={() => {
                          if (onCreateNew) {
                            onCreateNew();
                            onClose();
                          }
                        }}
                      >
                        <div className="w-12 h-12 rounded-full bg-[#015C3A]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Plus className="w-6 h-6 text-[#015C3A]" />
                        </div>
                        <span className="text-sm font-bold text-[#015C3A]">Buat SOP Baru</span>
                      </div>
                    )}
                    {filteredSops.map((sop: AdminSOPListItem) => {
                      const isLocked = lockedSopIds.includes(sop.id);
                      const isSuperAdmin = Boolean(
                        superAdminEmail && currentUserEmail === superAdminEmail
                      );
                      const canClick = !isLocked || isSuperAdmin;

                      return (
                        <div
                          key={sop.id}
                          className={cn(
                            "group border p-5 rounded-2xl transition-all duration-300 shadow-sm flex flex-col gap-3 relative overflow-hidden",
                            isLocked
                              ? isSuperAdmin
                                ? "bg-slate-50 dark:bg-slate-900/50 border-amber-300 dark:border-amber-800/50 opacity-90 cursor-pointer"
                                : "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-70 cursor-not-allowed"
                              : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-[#015C3A]/40 hover:shadow-lg cursor-pointer"
                          )}
                          onClick={() => {
                            if (canClick) {
                              onLoadSop(sop.id);
                              onClose();
                            }
                          }}
                        >
                          {isLocked && (
                            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-1 rounded-md text-[10px] font-bold">
                              <Lock className="w-3 h-3" />
                              {isSuperAdmin ? "Sedang di Edit (Akses Paksa)" : "Sedang di Edit"}
                            </div>
                          )}

                          <div className="flex items-start gap-4">
                            <div
                              className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all flex-shrink-0 duration-300",
                                isLocked
                                  ? "bg-slate-100 dark:bg-slate-800"
                                  : "bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 group-hover:from-[#015C3A]/10 group-hover:to-[#015C3A]/20 group-hover:scale-110"
                              )}
                            >
                              <FileText
                                className={cn(
                                  "w-6 h-6 transition-colors",
                                  isLocked
                                    ? "text-slate-300 dark:text-slate-600"
                                    : "text-slate-400 dark:text-slate-500 group-hover:text-[#015C3A]"
                                )}
                              />
                            </div>
                            <div className="flex-1 min-w-0 py-0.5 pr-8">
                              <h3
                                className={cn(
                                  "text-sm font-bold truncate transition-colors leading-snug",
                                  isLocked
                                    ? "text-slate-500 dark:text-slate-400"
                                    : "text-slate-800 dark:text-slate-100 group-hover:text-[#015C3A]"
                                )}
                              >
                                {sop.title}
                              </h3>
                              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                                  <User className="w-3.5 h-3.5 opacity-70" />
                                  <span className="text-[10px] font-semibold truncate max-w-[120px]">
                                    {sop.header?.satker || "Umum"}
                                  </span>
                                </div>
                                {sop.user_email && (
                                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                                    <Mail className="w-3.5 h-3.5 opacity-70" />
                                    <span className="text-[10px] font-medium truncate max-w-[150px]">
                                      {sop.user_email}
                                    </span>
                                  </div>
                                )}
                                <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                                  <Calendar className="w-3.5 h-3.5 opacity-70" />
                                  <span className="text-[10px] font-medium">
                                    {new Date(sop.updated_at).toLocaleString("id-ID", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {!isLocked && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                              <div className="w-8 h-8 rounded-full bg-[#015C3A]/10 flex items-center justify-center text-[#015C3A]">
                                <ChevronRight className="w-4 h-4" />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )
              )}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="p-3.5 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-center relative z-10 shrink-0">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Privileged Admin Access &bull; Kemenag Barito Utara Digital System
          </p>
        </div>
      </div>
    </div>
  );
}