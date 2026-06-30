"use client";

import React, { useState, useRef, useEffect } from "react";
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
} from "date-fns";
import { id } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ModernDatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  name?: string;
  className?: string;
}

export function ModernDatePicker({
  value,
  onChange,
  label,
  required,
  name,
  className,
}: ModernDatePickerProps) {
  const parsedDate = React.useMemo(() => {
    if (!value || value === "-") return null;
    const d = new Date(value);
    if (isValid(d)) return d;
    const iso = parseISO(value);
    if (isValid(iso)) return iso;
    return null;
  }, [value]);

  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(
    parsedDate || new Date(),
  );
  const containerRef = useRef<HTMLDivElement>(null);



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
    const formattedDate = format(date, "yyyy-MM-dd");
    onChange(formattedDate);
    setIsOpen(false);
  };

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-500 dark:text-slate-400"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-bold text-slate-900 dark:text-slate-100 capitalize">
          {format(currentMonth, "MMMM yyyy", { locale: id })}
        </span>
        <button
          type="button"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-500 dark:text-slate-400"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map((day, idx) => (
          <div
            key={day}
            className={`text-[10px] font-extrabold uppercase text-center py-2 ${idx === 0 ? "text-red-500" : "text-slate-400 dark:text-slate-500"}`}
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
            className={`h-9 w-9 flex items-center justify-center text-xs font-bold rounded-xl cursor-pointer transition-all ${
              !isCurrentMonth
                ? "text-slate-300 dark:text-slate-600"
                : isSelected
                  ? "bg-[#015C3A] text-white shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/50 scale-110"
                  : isSunday
                    ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 font-extrabold"
                    : "text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-[#015C3A] dark:hover:text-emerald-400"
            }`}
          >
            {format(currentDay, "d")}
          </div>,
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 mb-1 px-2">
          {days}
        </div>,
      );
      days = [];
    }
    return <div className="pb-2">{rows}</div>;
  };

  return (
    <div className={`relative w-full ${className || ""}`} ref={containerRef}>
      {label && (
        <label className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">
          {label}
        </label>
      )}

      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={value} required={required} />

      <button
        type="button"
        onClick={() => {
          const nextIsOpen = !isOpen;
          setIsOpen(nextIsOpen);
          if (nextIsOpen) {
            setCurrentMonth(parsedDate || new Date());
          }
        }}
        className={`group flex items-center gap-3 w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border rounded-xl text-sm transition-all cursor-pointer ${
          isOpen
            ? "border-[#015C3A] dark:border-emerald-500 ring-2 ring-[#015C3A]/20 dark:ring-emerald-500/20"
            : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
        }`}
      >
        <CalendarIcon
          className={`h-4 w-4 transition-colors ${isOpen ? "text-[#015C3A] dark:text-emerald-500" : "text-slate-400 group-hover:text-slate-500 dark:text-slate-500 dark:group-hover:text-slate-400"}`}
        />
        <span
          className={`flex-1 font-semibold text-left ${value && value !== "-" ? "text-slate-900 dark:text-slate-100" : "text-slate-400 dark:text-slate-500"}`}
        >
          {parsedDate
            ? format(parsedDate, "dd MMMM yyyy", { locale: id })
            : (value && value !== "-" ? value : "Pilih Tanggal")}
        </span>
        {value && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
            }}
            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
          >
            <X className="h-3 w-3 text-slate-400 dark:text-slate-500" />
          </div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-[100] mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            {renderHeader()}
            <div className="p-2">
              {renderDays()}
              {renderCells()}

              <div className="mt-2 p-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleDateClick(new Date())}
                  className="px-3 py-1.5 text-[10px] font-bold text-[#015C3A] dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-lg transition-all"
                >
                  Hari Ini
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                >
                  Tutup
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
