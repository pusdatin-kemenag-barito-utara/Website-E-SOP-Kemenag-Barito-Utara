import React from "react";
import {
  Building2,
  ShieldCheck,
  ShieldAlert,
  Edit2,
  Trash2,
} from "lucide-react";
import type { UserProfile } from "@/types/user";
import { cn, formatIndonesianDate } from "@/lib/utils";
import { getEnv } from "@/lib/env";

interface UserTableRowProps {
  user: UserProfile;
  currentUserEmail?: string | null;
  onEdit: (user: UserProfile) => void;
  onDelete: (user: UserProfile) => void;
}

export function UserTableRow({
  user,
  currentUserEmail,
  onEdit,
  onDelete,
}: UserTableRowProps) {
  const superAdminEmail = getEnv("PUBLIC_SUPER_ADMIN_EMAIL", "");
  const isSuperAdmin =
    user.role === "super_admin" ||
    Boolean(superAdminEmail && user.email === superAdminEmail);
  const isCurrentUser =
    currentUserEmail &&
    user.email?.toLowerCase() === currentUserEmail.toLowerCase();

  return (
    <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
      {/* Pengguna (Nama & Email) */}
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-8 h-8 rounded-full p-1 flex items-center justify-center shrink-0 shadow-xs transition-transform hover:scale-105",
              isSuperAdmin
                ? "bg-amber-50 dark:bg-slate-800 border border-amber-300 dark:border-amber-700 ring-2 ring-amber-100/80 dark:ring-amber-950/50"
                : "bg-emerald-50/50 dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800 ring-2 ring-emerald-50 dark:ring-emerald-950/40"
            )}
            title={user.nama || user.email || undefined}
          >
            <img
              src="/kemenag.svg"
              alt="Logo Kemenag"
              className="w-full h-full object-contain"
              width={24}
              height={24}
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-slate-800 dark:text-slate-100 truncate flex items-center gap-1.5">
              {user.nama || "Pengguna Kemenag"}
              {isCurrentUser && (
                <span className="text-[10px] font-normal px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                  (Anda)
                </span>
              )}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
              {user.email}
            </p>
          </div>
        </div>
      </td>

      {/* Bidang */}
      <td className="px-5 py-3.5 font-medium text-slate-700 dark:text-slate-200">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-[11px] max-w-full truncate">
          <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="truncate">{user.bidang || "Umum"}</span>
        </span>
      </td>

      {/* Peran */}
      <td className="px-5 py-3.5 whitespace-nowrap">
        {isSuperAdmin ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 font-bold text-[10px] tracking-wide uppercase">
            <ShieldAlert className="w-3 h-3" />
            Super Admin
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 font-bold text-[10px] tracking-wide uppercase">
            <ShieldCheck className="w-3 h-3" />
            Admin Bidang
          </span>
        )}
      </td>

      {/* Status */}
      <td className="px-5 py-3.5 whitespace-nowrap">
        {user.is_active !== false ? (
          <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Aktif
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-rose-500 font-bold text-xs">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            Nonaktif
          </span>
        )}
      </td>

      {/* Terdaftar */}
      <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap text-[11px]">
        {user.created_at ? formatIndonesianDate(user.created_at) : "-"}
      </td>

      {/* Aksi */}
      <td className="px-5 py-3.5 text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(user)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-700 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 transition-all cursor-pointer font-semibold text-xs shadow-2xs"
            title="Edit Pengguna"
          >
            <Edit2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Edit</span>
          </button>
          {!isSuperAdmin && (
            <button
              type="button"
              onClick={() => onDelete(user)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 hover:text-rose-700 border border-rose-200 dark:border-rose-900/80 hover:border-rose-300 transition-all cursor-pointer font-semibold text-xs shadow-2xs"
              title="Hapus Pengguna"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus</span>
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
