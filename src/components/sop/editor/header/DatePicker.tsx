import React, { useRef } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  label,
  className,
}: DatePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Function to format date to Indonesian style (e.g., 09 Januari 2025)
  const formatDateIndo = (dateStr: string) => {
    if (!dateStr || dateStr === "-") return "-";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;

      const months = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
      ];

      return `${date.getDate().toString().padStart(2, "0")} ${months[date.getMonth()]} ${date.getFullYear()}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-2 group">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-blue-500 transition-colors">
        {label}
      </label>

      <div
        className={cn(
          "relative h-11 flex items-center bg-slate-50/80 border border-slate-200 rounded-2xl px-4 cursor-pointer hover:border-blue-300 hover:bg-white transition-all shadow-sm group-focus-within:ring-4 group-focus-within:ring-blue-500/10 group-focus-within:border-blue-400",
          className,
        )}
        onClick={() => inputRef.current?.showPicker()}
      >
        <CalendarIcon className="w-4 h-4 text-slate-400 mr-3 group-hover:text-blue-500 transition-colors" />

        <span className="text-[13px] font-bold text-slate-700">
          {formatDateIndo(value)}
        </span>

        {/* Hidden native date input */}
        <input
          ref={inputRef}
          type="date"
          className="absolute inset-0 opacity-0 cursor-pointer pointer-events-none"
          onChange={(e) => onChange(e.target.value)}
          value={value && !isNaN(new Date(value).getTime()) ? value : ""}
        />

        {/* Modern decorative arrow or indicator */}
        <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-blue-400 transition-colors" />
      </div>
    </div>
  );
}
