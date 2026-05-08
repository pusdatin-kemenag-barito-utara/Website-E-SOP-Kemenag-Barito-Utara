import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2 } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Konfirmasi",
  cancelText = "Batal",
}: ConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] rounded-[2rem] border border-slate-200 shadow-2xl p-8 bg-white overflow-hidden">
        <DialogHeader className="items-center text-center">
          <div className="w-16 h-16 bg-red-50 rounded-3xl flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <DialogTitle className="text-xl font-black text-slate-900 tracking-tight">
            {title}
          </DialogTitle>
          <DialogDescription className="text-slate-500 font-medium leading-relaxed mt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 mt-8">
          <Button
            className="w-full h-12 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black text-sm flex items-center justify-center gap-2"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            <Trash2 className="w-4 h-4" />
            {confirmText}
          </Button>
          <Button
            variant="ghost"
            className="w-full h-12 text-slate-400 hover:text-slate-600 font-bold text-sm"
            onClick={onClose}
          >
            {cancelText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
