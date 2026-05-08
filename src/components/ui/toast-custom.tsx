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
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <AlertCircle className="w-5 h-5 text-blue-500" />,
  };

  const bgStyles = {
    success: "bg-emerald-50 border-emerald-100 shadow-emerald-100",
    error: "bg-red-50 border-red-100 shadow-red-100",
    info: "bg-blue-50 border-blue-100 shadow-blue-100",
  };

  return (
    <div
      className={cn(
        "fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl border shadow-2xl transition-all duration-500 animate-in slide-in-from-right-10 fade-in",
        bgStyles[type],
      )}
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="text-sm font-black text-slate-800 tracking-tight">
        {message}
      </p>
      <button
        onClick={onClose}
        className="ml-4 text-slate-400 hover:text-slate-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
