import React, { useState, useEffect } from "react";
import { X, UserPlus, Trash2, ShieldAlert, Shield, Users, Mail, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

interface UserProfile {
  id: string;
  email: string;
  role: string;
  bidang: string | null;
  created_at: string;
}

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (message: string, type?: "success" | "error") => void;
  setConfirm: (config: { open: boolean; title: string; desc: string; onConfirm: () => void }) => void;
}

export function UserManagementModal({
  isOpen,
  onClose,
  showToast,
  setConfirm,
}: UserManagementModalProps) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bidang, setBidang] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("Unauthenticated");

      const res = await fetch("/api/admin/users", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Gagal mengambil data pengguna");
      const data = await res.json();
      setUsers(data);
    } catch (error: unknown) {
      if (error instanceof Error) showToast(error.message, "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    let isMounted = true;
    if (isOpen) {
      // Run fetching inside a timeout to prevent synchronous setState cascading render warning
      setTimeout(() => {
        if (isMounted) fetchUsers();
      }, 0);
    }
    return () => {
      isMounted = false;
    };
  }, [isOpen, fetchUsers]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !bidang) {
      showToast("Semua kolom harus diisi", "error");
      return;
    }
    if (password.length < 6) {
      showToast("Password minimal 6 karakter", "error");
      return;
    }
    if (!email.startsWith("admin.") || !email.endsWith("@kemenag.go.id")) {
      showToast("Format email harus: admin.[nama_bidang]@kemenag.go.id", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        },
        body: JSON.stringify({ email, password, bidang }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal membuat pengguna");

      showToast("Pengguna berhasil ditambahkan", "success");
      setIsAdding(false);
      setEmail("");
      setPassword("");
      setBidang("");
      fetchUsers();
    } catch (error: unknown) {
      if (error instanceof Error) showToast(error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = (id: string, userEmail: string) => {
    setConfirm({
      open: true,
      title: "Hapus Pengguna?",
      desc: `Apakah Anda yakin ingin menghapus akun ${userEmail}? Semua SOP yang dibuat oleh pengguna ini akan ikut terhapus secara permanen.`,
      onConfirm: async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          const token = session?.access_token;

          const res = await fetch(`/api/admin/users?id=${id}`, {
            method: "DELETE",
            headers: {
              ...(token && { "Authorization": `Bearer ${token}` })
            }
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Gagal menghapus pengguna");
          
          showToast("Pengguna berhasil dihapus", "success");
          fetchUsers();
        } catch (error: unknown) {
          if (error instanceof Error) showToast(error.message, "error");
        }
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-950 w-full max-w-4xl h-[85vh] rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] ring-1 ring-black/5 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-5 md:p-6 bg-gradient-to-r from-[#015C3A] to-[#015C3A]/90 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                Kelola Pengguna Sistem
              </h2>
              <p className="text-white/70 text-[10px] font-medium tracking-wide mt-0.5">
                Super Admin Privilege &bull; Kemenag Barito Utara
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:text-white hover:bg-white/10 rounded-lg h-9 w-9"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Action Bar */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
            <div className="flex gap-2 text-sm text-slate-600 dark:text-slate-400">
              <div className="px-3 py-1.5 bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-lg font-semibold flex items-center gap-2">
                <Users className="w-4 h-4 text-[#015C3A]" />
                {users.length} Akun Terdaftar
              </div>
            </div>
            <Button
              onClick={() => setIsAdding(!isAdding)}
              className="h-10 px-5 text-sm font-bold bg-[#015C3A] hover:bg-[#014A2E] text-white rounded-xl shadow-sm transition-all"
            >
              {isAdding ? <X className="w-4 h-4 mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
              {isAdding ? "Batal Tambah" : "Tambah Pengguna Baru"}
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-900/20 custom-scrollbar relative">
            {/* Add User Form */}
            {isAdding && (
              <div className="mb-8 p-6 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950 shadow-sm animate-in slide-in-from-top-4 duration-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#015C3A]" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-5 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-[#015C3A]" /> Tambah Admin Bidang Baru
                </h3>
                <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Email Akun</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-11 pl-10 pr-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-[#015C3A]/20 focus:border-[#015C3A] transition-all outline-none"
                        placeholder="email@kemenag.go.id"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Password Akses</label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-11 pl-10 pr-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-[#015C3A]/20 focus:border-[#015C3A] transition-all outline-none"
                        placeholder="Minimal 6 karakter"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Nama Bidang / Satker</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={bidang}
                        onChange={(e) => setBidang(e.target.value)}
                        className="w-full h-11 pl-10 pr-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-[#015C3A]/20 focus:border-[#015C3A] transition-all outline-none"
                        placeholder="Contoh: Bimas Islam"
                        required
                      />
                    </div>
                  </div>
                  <div className="md:col-span-3 flex justify-end mt-2">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-11 px-8 text-sm font-bold bg-[#015C3A] hover:bg-[#014A2E] text-white rounded-xl shadow-sm transition-all disabled:opacity-70"
                    >
                      {isSubmitting ? "Menyimpan..." : "Simpan Pengguna"}
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Users List */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 text-slate-500">
                <div className="w-10 h-10 border-4 border-[#015C3A]/20 border-t-[#015C3A] rounded-full animate-spin mb-6" />
                <p className="text-sm font-semibold tracking-wide">Memuat data pengguna...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-24 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center mb-6">
                  <Users className="w-10 h-10 text-slate-300 dark:text-slate-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Belum Ada Admin Bidang</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm text-center leading-relaxed">
                  Tambahkan akun untuk Admin Bidang agar mereka dapat mulai membuat dan mengelola SOP.
                </p>
                {!isAdding && (
                  <Button onClick={() => setIsAdding(true)} className="mt-8 bg-[#015C3A] hover:bg-[#014A2E] rounded-full px-8 h-12 shadow-md shadow-[#015C3A]/20 transition-all hover:shadow-lg hover:-translate-y-0.5">
                    <UserPlus className="w-5 h-5 mr-2" />
                    Tambah Admin Pertama
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="group bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-[#015C3A]/40 p-5 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-lg flex items-start gap-4 relative overflow-hidden"
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${user.role === 'super_admin' ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-amber-500/30' : 'bg-gradient-to-br from-[#015C3A]/10 to-[#015C3A]/20 text-[#015C3A] dark:from-[#015C3A]/20 dark:to-[#015C3A]/30'}`}>
                      {user.role === 'super_admin' ? <ShieldAlert className="w-6 h-6" /> : <Shield className="w-6 h-6" />}
                    </div>
                    <div className="flex-1 min-w-0 py-0.5">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{user.email}</h4>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 truncate flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 opacity-70" /> {user.bidang || "Belum diatur"}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <span className={`text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider ${user.role === 'super_admin' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                          {user.role === 'super_admin' ? 'Super Admin' : 'Admin Bidang'}
                        </span>
                      </div>
                    </div>
                    {user.role !== 'super_admin' && (
                      <button
                         onClick={() => handleDeleteUser(user.id, user.email)}
                         className="absolute top-4 right-4 w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
                         title="Hapus Pengguna"
                      >
                         <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
