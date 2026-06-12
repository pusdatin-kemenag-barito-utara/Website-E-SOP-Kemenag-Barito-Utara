"use client";

import React, { useState } from "react";
import { format, parseISO, isValid } from "date-fns";
import { id } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  className?: string;
}

function safeParse(value: string): Date | undefined {
  if (!value) return undefined;
  try {
    const d = parseISO(value);
    return isValid(d) ? d : undefined;
  } catch {
    return undefined;
  }
}

function safeFormat(date: Date, fmt: string): string {
  try {
    return format(date, fmt, { locale: id });
  } catch {
    return "-";
  }
}

function safeFormatLabel(date: Date, fmt: string): string {
  try {
    return format(date, fmt, { locale: id });
  } catch {
    return "";
  }
}

const idLocale = {
  ...id,
  labels: {
    labelDayButton: (d: Date) =>
      `Pilih ${safeFormatLabel(d, "PPPP")}`,
    labelMonthDropdown: "Pilih bulan",
    labelNext: "Bulan berikutnya",
    labelPrevious: "Bulan sebelumnya",
    labelYearDropdown: "Pilih tahun",
    labelGrid: (d: Date) => safeFormatLabel(d, "MMMM yyyy"),
    labelGridcell: (d: Date) => safeFormatLabel(d, "PPPP"),
    labelNav: "Navigasi",
    labelWeekNumber: (w: number) => `Minggu ${w}`,
    labelWeekNumberHeader: "Minggu",
    labelWeekday: (d: Date) => safeFormatLabel(d, "cccc"),
  },
};

export function DatePicker({
  value,
  onChange,
  label,
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const parsed = safeParse(value);

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange(format(date, "yyyy-MM-dd"));
    }
    setOpen(false);
  };

  const displayValue = parsed ? safeFormat(parsed, "dd MMMM yyyy") : "-";

  return (
    <div className="space-y-1.5 group relative">
      <label className="text-[10px] font-semibold text-muted-foreground ml-0.5 tracking-wide group-focus-within:text-primary transition-colors">
        {label}
      </label>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "relative h-9 w-full flex items-center bg-background border border-border rounded-lg px-3 cursor-pointer hover:border-primary/50 transition-all group-focus-within:ring-2 group-focus-within:ring-primary/20 group-focus-within:border-primary",
          open && "ring-2 ring-primary/20 border-primary",
          className,
        )}
      >
        <CalendarIcon className="w-3.5 h-3.5 text-muted-foreground mr-2 group-hover:text-primary transition-colors flex-shrink-0" />
        <span className="text-xs font-medium text-foreground">
          {displayValue}
        </span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className={cn(
              "absolute left-0 top-full mt-1 w-full z-50 bg-white dark:bg-slate-800 border border-border dark:border-slate-700 rounded-xl shadow-lg overflow-hidden",
              "animate-in fade-in slide-in-from-top-2 duration-200",
            )}
          >
            <DayPicker
              mode="single"
              selected={parsed}
              onSelect={handleSelect}
              locale={idLocale}
              showOutsideDays
              className="p-2 w-full"
              classNames={{
                root: "w-full",
                months: "flex flex-col w-full",
                month_grid: "w-full border-collapse",
                month: "space-y-2 w-full",
                month_caption: "flex items-center justify-between px-1 pt-1 pb-2",
                caption_label: "text-xs font-semibold text-foreground",
                nav: "flex items-center gap-1",
                button_previous:
                  "h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all",
                button_next:
                  "h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all",
                chevron: "w-4 h-4",
                weekdays: "grid grid-cols-7",
                weekday:
                  "h-7 flex items-center justify-center text-[9px] font-semibold text-muted-foreground",
                weeks: "",
                week: "grid grid-cols-7",
                day: "h-8 p-0",
                day_button:
                  "h-8 w-full rounded-lg text-xs font-medium transition-all flex items-center justify-center hover:bg-accent",
                today: "text-primary ring-1 ring-primary/30 bg-primary/5",
                selected:
                  "bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground",
                outside: "text-muted-foreground/40",
                disabled: "opacity-30",
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
