import React, { useState, useEffect } from "react";
import {
  UserPlus,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  User,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CreateUserInput } from "@/types/user";

interface CreateUserModalProps {
  isOpen: boolean;
  isLoading: boolean;
  bidangOptions: string[];
  onClose: () => void;
  onSubmit: (data: CreateUserInput) => Promise<boolean>;
  onToast?: (message: string, type?: "success" | "error" | "info") => void;
}

export function CreateUserModal({
  isOpen,
  isLoading,
  bidangOptions,
  onClose,
  onSubmit,
  onToast,
}: CreateUserModalProps) {
  const [form, setForm] = useState<CreateUserInput>({
    email: "",
    password: "",
    nama: "",
    role: "admin_bidang",
    bidang: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm({
        email: "",
        password: "",
        nama: "",
        role: "admin_bidang",
        bidang: bidangOptions[0] || "",
      });
      setShowPassword(false);
    }
  }, [isOpen, bidangOptions]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password || !form.bidang.trim()) {
      onToast?.("Email, kata sandi, dan bidang wajib diisi.", "error");
      return;
    }
    if (form.password.length < 6) {
      onToast?.("Kata sandi minimal 6 karakter.", "error");
      return;
    }

    const success = await onSubmit({
      ...form,
      bidang: form.bidang.trim(),
    });
    if (success) {
      setShowPassword(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-[#015C3A] dark:text-emerald-400">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Tambah Pengguna Baru
              </h4>
              <p className="text-[11px] text-slate-400">
                Buat akun login untuk seksi atau bidang
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
          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
              Email Akun <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                placeholder="contoh: admin.penmad@kemenag.go.id"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#015C3A] text-slate-800 dark:text-slate-100 font-medium"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
              Kata Sandi Awal <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                placeholder="Minimal 6 karakter"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
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

          {/* Nama Lengkap */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
              Nama Lengkap / Penanggung Jawab
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="contoh: Operator Seksi Penmad"
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#015C3A] text-slate-800 dark:text-slate-100 font-medium"
              />
            </div>
          </div>

          {/* Dynamic Bidang & Role */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                Seksi / Bidang <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                list="create-bidang-datalist"
                placeholder="Pilih atau ketik..."
                value={form.bidang}
                onChange={(e) => setForm({ ...form, bidang: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#015C3A] text-slate-800 dark:text-slate-100 font-medium"
              />
              <datalist id="create-bidang-datalist">
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
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#015C3A] text-slate-800 dark:text-slate-100 font-medium cursor-pointer"
              >
                <option value="admin_bidang">Admin Bidang</option>
                <option value="super_admin">Super Admin</option>
              </select>
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
                  Menyimpan...
                </>
              ) : (
                "Simpan Pengguna"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
