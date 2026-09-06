import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  isVisible: boolean;
  onClose: () => void;
}

export function ToastCustom({
  message,
  type = "success",
  isVisible,
  onClose,
}: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    error: <AlertCircle className="w-4 h-4 text-red-500" />,
    info: <AlertCircle className="w-4 h-4 text-blue-500" />,
  };

  const bgStyles = {
    success: "bg-emerald-50 dark:bg-emerald-950 border-emerald-100 dark:border-emerald-800",
    error: "bg-red-50 dark:bg-red-950 border-red-100 dark:border-red-800",
    info: "bg-blue-50 dark:bg-blue-950 border-blue-100 dark:border-blue-800",
  };

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl border shadow-xl transition-all duration-500 animate-in slide-in-from-right-10 fade-in",
        bgStyles[type],
      )}
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="text-xs font-semibold text-foreground">{message}</p>
      <button
        onClick={onClose}
        className="ml-3 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Tutup"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
