import React from "react";
import { Users, RefreshCw, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UserManagementHeaderProps {
  totalUsers: number;
  loading: boolean;
  onRefresh: () => void;
  onAddUser: () => void;
}

export function UserManagementHeader({
  totalUsers,
  loading,
  onRefresh,
  onAddUser,
}: UserManagementHeaderProps) {
  return (
    <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shrink-0">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-[#015C3A] dark:text-emerald-400">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            Manajemen Pengguna
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
              {totalUsers} Akun
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Kelola hak akses akun seksi/bidang di lingkungan Kemenag Barito Utara
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={loading}
          className="h-9 px-3 rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
          title="Muat ulang data"
        >
          <RefreshCw className={cn("w-4 h-4 mr-1.5", loading && "animate-spin")} />
          <span className="hidden sm:inline">Segarkan</span>
        </Button>
        <Button
          size="sm"
          onClick={onAddUser}
          className="h-9 px-3.5 bg-[#015C3A] hover:bg-[#014a2e] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pengguna</span>
        </Button>
      </div>
    </div>
  );
}
