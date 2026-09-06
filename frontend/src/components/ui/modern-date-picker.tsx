"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
  getDay,
  parseISO,
  isValid,
  setYear,
  setMonth,
} from "date-fns";
import { id } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, formatIndonesianDate } from "@/lib/utils";

interface ModernDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  name?: string;
  className?: string;
  align?: "left" | "right" | "center";
}

const ID_MONTHS: Record<string, number> = {
  januari: 0,
  februari: 1,
  maret: 2,
  april: 3,
  mei: 4,
  juni: 5,
  juli: 6,
  agustus: 7,
  september: 8,
  oktober: 9,
  november: 10,
  desember: 11,
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  jun: 5,
  jul: 6,
  agu: 7,
  agt: 7,
  sep: 8,
  okt: 9,
  nov: 10,
  des: 11,
};

function parseDateRobust(val: string): Date | null {
  if (!val || val.trim() === "" || val.trim() === "-") return null;
  const str = val.trim();

  // Try ISO YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    const d = parseISO(str);
    if (isValid(d)) return d;
  }

  // Try "DD MMMM YYYY" (Indonesian)
  const parts = str.split(/\s+/);
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const monthName = parts[1].toLowerCase();
    const year = parseInt(parts[2], 10);

    if (!isNaN(day) && !isNaN(year) && ID_MONTHS[monthName] !== undefined) {
      const monthIndex = ID_MONTHS[monthName];
      const d = new Date(year, monthIndex, day);
      if (isValid(d)) return d;
    }
  }

  // Try standard JS Date
  const d = new Date(str);
  if (isValid(d) && !isNaN(d.getTime())) return d;

  return null;
}

const YEARS = Array.from({ length: 15 }, (_, i) => new Date().getFullYear() - 5 + i);
const MONTH_NAMES = [
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

export function ModernDatePicker({
  value,
  onChange,
  label,
  required,
  name,
  className,
  align = "left",
}: ModernDatePickerProps) {
  const parsedDate = useMemo(() => parseDateRobust(value), [value]);

  const displayValue = useMemo(() => {
    if (!value || value.trim() === "") return "";
    if (value.trim() === "-") return "-";
    return formatIndonesianDate(value);
  }, [value]);

  // Auto-normalize raw ISO strings (e.g. 2026-07-01) to standard Indonesian format (e.g. 01 Juli 2026)
  useEffect(() => {
    if (value && /^\d{4}-\d{2}-\d{2}/.test(value.trim())) {
      const formatted = formatIndonesianDate(value);
      if (formatted && formatted !== value) {
        onChange(formatted);
      }
    }
  }, [value, onChange]);

  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(
    parsedDate || new Date(),
  );
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync current month when value changes
  useEffect(() => {
    if (parsedDate) {
      setCurrentMonth(parsedDate);
    }
  }, [parsedDate]);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedDate = parsedDate;

  const handleDateClick = (date: Date) => {
    const formatted = format(date, "dd MMMM yyyy", { locale: id });
    onChange(formatted);
    setIsOpen(false);
  };

  const handleYearChange = (year: number) => {
    setCurrentMonth(setYear(currentMonth, year));
  };

  const handleMonthChange = (monthIdx: number) => {
    setCurrentMonth(setMonth(currentMonth, monthIdx));
  };

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-800/60">
        <button
          type="button"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-1.5 hover:bg-slate-200/70 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-600 dark:text-slate-300 cursor-pointer"
          title="Bulan sebelumnya"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Month & Year Jump Dropdowns */}
        <div className="flex items-center gap-1">
          {/* Month Selector */}
          <select
            value={currentMonth.getMonth()}
            onChange={(e) => handleMonthChange(parseInt(e.target.value, 10))}
            className="text-xs font-bold text-slate-800 dark:text-slate-100 bg-transparent hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-md px-1.5 py-1 cursor-pointer border-none outline-none focus:ring-1 focus:ring-[#015C3A]"
          >
            {MONTH_NAMES.map((name, idx) => (
              <option key={name} value={idx} className="dark:bg-slate-900 text-slate-800 dark:text-slate-100">
                {name}
              </option>
            ))}
          </select>

          {/* Year Selector */}
          <select
            value={currentMonth.getFullYear()}
            onChange={(e) => handleYearChange(parseInt(e.target.value, 10))}
            className="text-xs font-bold text-slate-800 dark:text-slate-100 bg-transparent hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-md px-1.5 py-1 cursor-pointer border-none outline-none focus:ring-1 focus:ring-[#015C3A]"
          >
            {YEARS.map((y) => (
              <option key={y} value={y} className="dark:bg-slate-900 text-slate-800 dark:text-slate-100">
                {y}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-1.5 hover:bg-slate-200/70 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-600 dark:text-slate-300 cursor-pointer"
          title="Bulan berikutnya"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    return (
      <div className="grid grid-cols-7 mb-1 pt-1">
        {days.map((day, idx) => (
          <div
            key={day}
            className={`text-[10px] font-extrabold uppercase text-center py-1.5 ${
              idx === 0 ? "text-rose-500" : "text-slate-400 dark:text-slate-500"
            }`}
          >
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const currentDay = day;
        const isSelected = selectedDate && isSameDay(currentDay, selectedDate);
        const isCurrentMonth = isSameMonth(currentDay, monthStart);
        const isSunday = getDay(currentDay) === 0;

        days.push(
          <div
            key={currentDay.toString()}
            onClick={() => handleDateClick(currentDay)}
            className={`h-8 w-8 flex items-center justify-center text-xs font-bold rounded-xl cursor-pointer transition-all ${
              !isCurrentMonth
                ? "text-slate-300 dark:text-slate-600"
                : isSelected
                  ? "bg-[#015C3A] text-white shadow-md shadow-emerald-700/30 scale-105"
                  : isSunday
                    ? "text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 font-extrabold"
                    : "text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-[#015C3A] dark:hover:text-emerald-400"
            }`}
          >
            {format(currentDay, "d")}
          </div>,
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 mb-1 px-1 justify-items-center">
          {days}
        </div>,
      );
      days = [];
    }
    return <div className="pb-1">{rows}</div>;
  };

  return (
    <div
      className={cn("relative w-full", isOpen && "z-50", className)}
      ref={containerRef}
    >
      {label && (
        <label className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">
          {label}
        </label>
      )}

      {/* Hidden input for form accessibility */}
      <input
        type="hidden"
        id={name || "date-picker-input"}
        name={name || "date-picker-input"}
        value={value}
        required={required}
      />

      <button
        type="button"
        onClick={() => {
          const nextIsOpen = !isOpen;
          setIsOpen(nextIsOpen);
          if (nextIsOpen) {
            setCurrentMonth(parsedDate || new Date());
          }
        }}
        title={displayValue || (value === "-" ? "Tanpa Revisi" : "Pilih Tanggal")}
        className={cn(
          "group flex items-center gap-2 w-full px-3 py-2.5 bg-white dark:bg-slate-900 border rounded-xl text-xs transition-all cursor-pointer shadow-2xs min-w-0",
          isOpen
            ? "border-[#015C3A] dark:border-emerald-500 ring-2 ring-[#015C3A]/20 dark:ring-emerald-500/20"
            : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600",
        )}
      >
        <CalendarIcon
          className={cn(
            "h-3.5 w-3.5 shrink-0 transition-colors",
            isOpen
              ? "text-[#015C3A] dark:text-emerald-500"
              : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300",
          )}
        />
        <span
          className={cn(
            "flex-1 font-bold text-left truncate tracking-tight text-xs",
            displayValue && displayValue !== "-"
              ? "text-slate-800 dark:text-slate-100"
              : "text-slate-400 dark:text-slate-500",
          )}
        >
          {displayValue ? displayValue : "Pilih Tanggal"}
        </span>
        {value && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onChange("-");
            }}
            className="p-0.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer shrink-0"
            title="Reset tanggal"
          >
            <X className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
          </div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute z-[9999] mt-1.5 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden",
              align === "right" ? "right-0" : align === "center" ? "left-1/2 -translate-x-1/2" : "left-0",
            )}
          >
            {renderHeader()}
            <div className="p-2">
              {renderDays()}
              {renderCells()}

              <div className="mt-1 p-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleDateClick(new Date())}
                  className="px-2.5 py-1 text-[11px] font-bold text-[#015C3A] dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-lg transition-all cursor-pointer"
                >
                  Hari Ini
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onChange("-");
                    setIsOpen(false);
                  }}
                  className="px-2.5 py-1 text-[11px] font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all cursor-pointer"
                >
                  Tanpa Tanggal (-)
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
