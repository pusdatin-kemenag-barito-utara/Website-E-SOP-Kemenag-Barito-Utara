import React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { UserProfile } from "@/types/user";

interface DeleteUserModalProps {
  user: UserProfile | null;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteUserModal({
  user,
  isLoading,
  onClose,
  onConfirm,
}: DeleteUserModalProps) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-sm rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-600 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
          Hapus Pengguna?
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
          Anda yakin ingin menghapus akun{" "}
          <strong className="text-slate-800 dark:text-slate-200">
            {user.email}
          </strong>
          ? Tindakan ini akan menghapus akses login pengguna secara permanen.
        </p>

        <div className="mt-6 flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="rounded-xl text-xs h-9 cursor-pointer"
          >
            Batal
          </Button>
          <Button
            size="sm"
            disabled={isLoading}
            onClick={onConfirm}
            className="rounded-xl text-xs h-9 bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                Menghapus...
              </>
            ) : (
              "Ya, Hapus Pengguna"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
