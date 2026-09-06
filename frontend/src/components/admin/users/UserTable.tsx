import React from "react";
import { Users, Loader2 } from "lucide-react";
import type { UserProfile } from "@/types/user";
import { UserTableRow } from "./UserTableRow";

interface UserTableProps {
  users: UserProfile[];
  loading: boolean;
  currentUserEmail?: string | null;
  hasActiveFilters: boolean;
  onEdit: (user: UserProfile) => void;
  onDelete: (user: UserProfile) => void;
}

export function UserTable({
  users,
  loading,
  currentUserEmail,
  hasActiveFilters,
  onEdit,
  onDelete,
}: UserTableProps) {
  if (loading) {
    return (
      <div className="flex-1 overflow-auto p-4 sm:p-6 custom-scrollbar">
        <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#015C3A]" />
          <p className="text-xs font-semibold">Memuat data pengguna...</p>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex-1 overflow-auto p-4 sm:p-6 custom-scrollbar">
        <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
          <Users className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-2" />
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">
            Tidak ada pengguna ditemukan
          </h4>
          <p className="text-xs text-slate-400 max-w-sm mt-1">
            {hasActiveFilters
              ? "Coba sesuaikan kata kunci atau filter pencarian Anda."
              : "Belum ada akun pengguna terdaftar. Klik tombol 'Tambah Pengguna' untuk membuat akun baru."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-4 sm:p-6 custom-scrollbar">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-4 w-[28%]">Pengguna</th>
                <th className="px-5 py-4 w-[26%]">Seksi / Bidang</th>
                <th className="px-5 py-4 w-[14%]">Peran</th>
                <th className="px-5 py-4 w-[10%]">Status</th>
                <th className="px-5 py-4 w-[12%]">Terdaftar</th>
                <th className="px-5 py-4 w-[10%] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map((u) => (
                <UserTableRow
                  key={u.id}
                  user={u}
                  currentUserEmail={currentUserEmail}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
