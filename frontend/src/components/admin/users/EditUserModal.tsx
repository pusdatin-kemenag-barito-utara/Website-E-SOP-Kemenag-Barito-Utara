import React, { useState, useEffect } from "react";
import {
  Edit2,
  KeyRound,
  Eye,
  EyeOff,
  User,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { UserProfile, UpdateUserInput } from "@/types/user";
import { cn } from "@/lib/utils";

interface EditUserModalProps {
  user: UserProfile | null;
  isLoading: boolean;
  bidangOptions: string[];
  onClose: () => void;
  onSubmit: (userId: string, data: UpdateUserInput) => Promise<boolean>;
}

export function EditUserModal({
  user,
  isLoading,
  bidangOptions,
  onClose,
  onSubmit,
}: EditUserModalProps) {
  const [nama, setNama] = useState("");
  const [role, setRole] = useState("admin_bidang");
  const [bidang, setBidang] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setNama(user.nama || "");
      setRole(user.role || "admin_bidang");
      setBidang(user.bidang || (bidangOptions[0] || ""));
      setIsActive(user.is_active !== false);
      setNewPassword("");
      setShowPassword(false);
    }
  }, [user, bidangOptions]);

  if (!user) return null;

  const isPrimarySuperAdmin = user.email === "baritoutara@kemenag.go.id";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: UpdateUserInput = {
      nama,
      role,
      bidang: bidang.trim(),
      is_active: isActive,
    };
    if (newPassword && newPassword.trim()) {
      payload.password = newPassword.trim();
    }

    await onSubmit(user.id, payload);
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Edit2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Edit Data Pengguna
              </h4>
              <p className="text-[11px] text-slate-400 truncate max-w-[250px]">
                {user.email}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nama Lengkap */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
              Nama Lengkap / Penanggung Jawab
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Nama staf atau operator"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#015C3A] text-slate-800 dark:text-slate-100 font-medium"
              />
            </div>
          </div>

          {/* Bidang & Role */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                Seksi / Bidang <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                list="edit-bidang-datalist"
                placeholder="Pilih atau ketik..."
                value={bidang}
                onChange={(e) => setBidang(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#015C3A] text-slate-800 dark:text-slate-100 font-medium"
              />
              <datalist id="edit-bidang-datalist">
                {bidangOptions.map((b) => (
                  <option key={b} value={b} />
                ))}
              </datalist>
              <p className="text-[10px] text-slate-400 mt-1">
                Pilih dari daftar atau ketik baru.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                Peran / Hak Akses
              </label>
              <select
                disabled={isPrimarySuperAdmin}
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#015C3A] text-slate-800 dark:text-slate-100 font-medium cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="admin_bidang">Admin Bidang</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
          </div>

          {/* Status Toggle Switch */}
          {!isPrimarySuperAdmin && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
                  Status Akun
                </span>
                <span className="text-[11px] text-slate-400">
                  {isActive
                    ? "Akun dapat masuk dan mengelola SOP"
                    : "Akun dinonaktifkan (tidak bisa login)"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={cn(
                  "w-10 h-5 rounded-full p-0.5 transition-colors relative cursor-pointer",
                  isActive ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-700"
                )}
              >
                <div
                  className={cn(
                    "w-4 h-4 rounded-full bg-white transition-transform shadow-xs",
                    isActive ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </button>
            </div>
          )}

          {/* Reset Password Optional */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
              Reset Kata Sandi (Opsional)
            </label>
            <p className="text-[10px] text-slate-400 mb-2">
              Kosongkan jika tidak ingin mengubah kata sandi pengguna
            </p>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                minLength={6}
                placeholder="Masukkan kata sandi baru jika ingin reset"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#015C3A] text-slate-800 dark:text-slate-100 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="rounded-xl text-xs h-9 cursor-pointer"
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isLoading}
              className="rounded-xl text-xs h-9 bg-[#015C3A] hover:bg-[#014a2e] text-white font-bold cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  Memperbarui...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
