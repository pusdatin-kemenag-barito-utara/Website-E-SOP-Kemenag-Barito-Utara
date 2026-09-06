import React from "react";
import { Search } from "lucide-react";

interface UserManagementFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  roleFilter: string;
  onRoleFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  bidangFilter: string;
  onBidangFilterChange: (value: string) => void;
  bidangOptions: string[];
}

export function UserManagementFilters({
  search,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  statusFilter,
  onStatusFilterChange,
  bidangFilter,
  onBidangFilterChange,
  bidangOptions,
}: UserManagementFiltersProps) {
  return (
    <div className="px-4 sm:px-6 py-3 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 flex flex-wrap items-center gap-2.5 shrink-0">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Cari nama, email, atau bidang..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#015C3A] text-slate-800 dark:text-slate-100"
        />
      </div>

      {/* Role Filter */}
      <select
        value={roleFilter}
        onChange={(e) => onRoleFilterChange(e.target.value)}
        className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#015C3A] cursor-pointer"
      >
        <option value="all">Semua Peran</option>
        <option value="super_admin">Super Admin</option>
        <option value="admin_bidang">Admin Bidang</option>
      </select>

      {/* Status Filter */}
      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
        className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#015C3A] cursor-pointer"
      >
        <option value="all">Semua Status</option>
        <option value="active">Aktif</option>
        <option value="inactive">Nonaktif</option>
      </select>

      {/* Bidang Filter (100% Dynamic from Database) */}
      <select
        value={bidangFilter}
        onChange={(e) => onBidangFilterChange(e.target.value)}
        className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#015C3A] cursor-pointer max-w-[200px] truncate"
      >
        <option value="all">Semua Bidang ({bidangOptions.length})</option>
        {bidangOptions.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </select>
    </div>
  );
}
