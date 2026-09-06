import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2, X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Hapus Data",
  cancelText = "Batal",
}: ConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[400px] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-7 bg-white dark:bg-slate-900 overflow-hidden !opacity-100 focus:outline-none"
      >
        <div className="flex flex-col items-center text-center relative">
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute -top-2 -right-2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Clean Red Alert Badge */}
          <div className="w-12 h-12 bg-red-50 dark:bg-red-950/50 rounded-2xl border border-red-200/80 dark:border-red-900/60 flex items-center justify-center mb-3.5">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>

          <DialogHeader className="items-center text-center space-y-1.5">
            <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {title}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-[300px] mx-auto font-normal">
              {description}
            </DialogDescription>
          </DialogHeader>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 w-full mt-6">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold tracking-wide transition-colors cursor-pointer shadow-none"
              onClick={onClose}
            >
              {cancelText}
            </Button>
            <Button
              type="button"
              className="h-10 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold tracking-wide transition-colors cursor-pointer shadow-sm active:scale-[0.98] flex items-center justify-center gap-1.5"
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              <Trash2 className="w-4 h-4" />
              <span>{confirmText}</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
