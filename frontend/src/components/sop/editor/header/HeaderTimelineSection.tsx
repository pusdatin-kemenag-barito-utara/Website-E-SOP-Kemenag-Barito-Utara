import React from "react";
import type { SOPHeader as SOPHeaderType } from "@/types/sop";
import { Calendar } from "lucide-react";
import { ModernDatePicker } from "@/components/ui/modern-date-picker";
import { SectionHeader } from "../../shared/SectionHeader";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn, formatIndonesianDate } from "@/lib/utils";

interface HeaderTimelineSectionProps {
  header: SOPHeaderType;
  updateHeader: (key: keyof SOPHeaderType, value: string) => void;
}

export function HeaderTimelineSection({
  header,
  updateHeader,
}: HeaderTimelineSectionProps) {
  const todayFormatted = React.useMemo(() => {
    return format(new Date(), "dd MMMM yyyy", { locale: id });
  }, []);

  const startOfMonthFormatted = React.useMemo(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    return format(firstDay, "dd MMMM yyyy", { locale: id });
  }, []);

  const startOfYearFormatted = React.useMemo(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), 0, 1);
    return format(firstDay, "dd MMMM yyyy", { locale: id });
  }, []);

  // Auto-normalize any dates that might be stored in raw ISO format (e.g. 2026-07-01)
  React.useEffect(() => {
    if (header.tglBuat && /^\d{4}-\d{2}-\d{2}/.test(header.tglBuat.trim())) {
      const normalized = formatIndonesianDate(header.tglBuat);
      if (normalized !== header.tglBuat) updateHeader("tglBuat", normalized);
    }
    if (header.tglRevisi && /^\d{4}-\d{2}-\d{2}/.test(header.tglRevisi.trim())) {
      const normalized = formatIndonesianDate(header.tglRevisi);
      if (normalized !== header.tglRevisi) updateHeader("tglRevisi", normalized);
    }
    if (header.tglEfektif && /^\d{4}-\d{2}-\d{2}/.test(header.tglEfektif.trim())) {
      const normalized = formatIndonesianDate(header.tglEfektif);
      if (normalized !== header.tglEfektif) updateHeader("tglEfektif", normalized);
    }
  }, [header.tglBuat, header.tglRevisi, header.tglEfektif, updateHeader]);

  const handleDateChange = (key: keyof SOPHeaderType, date: string) => {
    if (!date || date.trim() === "" || date.trim() === "-") {
      updateHeader(key, date);
    } else {
      updateHeader(key, formatIndonesianDate(date));
    }
  };

  return (
    <div className="@container bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs relative z-20">
      <SectionHeader
        icon={Calendar}
        title="Timeline Dokumen"
        colorClass="text-blue-500 dark:text-blue-400"
      />

      <div className="p-4 sm:p-5 grid grid-cols-1 @[540px]:grid-cols-3 gap-3">
        {/* Card 1: Tgl Pembuatan */}
        <div className="bg-slate-50/60 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 space-y-2.5 relative z-30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Tgl Pembuatan</span>
            </span>
          </div>

          <ModernDatePicker
            name="tglBuat"
            value={header.tglBuat || ""}
            onChange={(date: string) => handleDateChange("tglBuat", date)}
            align="left"
          />

          {/* Quick Action Chips */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <button
              type="button"
              onClick={() => updateHeader("tglBuat", todayFormatted)}
              className={cn(
                "text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer",
                header.tglBuat === todayFormatted
                  ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-blue-50 hover:text-blue-600",
              )}
            >
              Hari Ini
            </button>
            <button
              type="button"
              onClick={() => updateHeader("tglBuat", startOfYearFormatted)}
              className={cn(
                "text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer",
                header.tglBuat === startOfYearFormatted
                  ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-blue-50 hover:text-blue-600",
              )}
            >
              Awal Tahun
            </button>
          </div>
        </div>

        {/* Card 2: Tgl Revisi */}
        <div className="bg-slate-50/60 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 space-y-2.5 relative z-20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Tgl Revisi</span>
            </span>
          </div>

          <ModernDatePicker
            name="tglRevisi"
            value={header.tglRevisi || ""}
            onChange={(date: string) => handleDateChange("tglRevisi", date)}
            align="center"
          />

          {/* Quick Action Chips */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <button
              type="button"
              onClick={() => updateHeader("tglRevisi", "-")}
              className={cn(
                "text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer",
                header.tglRevisi === "-"
                  ? "bg-amber-600 text-white border-amber-600 shadow-2xs"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-amber-50 hover:text-amber-700",
              )}
            >
              - (Tanpa Revisi)
            </button>
            <button
              type="button"
              onClick={() => updateHeader("tglRevisi", todayFormatted)}
              className={cn(
                "text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer",
                header.tglRevisi === todayFormatted
                  ? "bg-amber-600 text-white border-amber-600 shadow-2xs"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-amber-50 hover:text-amber-700",
              )}
            >
              Hari Ini
            </button>
          </div>
        </div>

        {/* Card 3: Tgl Efektif */}
        <div className="bg-slate-50/60 dark:bg-slate-800/30 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 space-y-2.5 relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Tgl Efektif</span>
            </span>
          </div>

          <ModernDatePicker
            name="tglEfektif"
            value={header.tglEfektif || ""}
            onChange={(date: string) => handleDateChange("tglEfektif", date)}
            align="right"
          />

          {/* Quick Action Chips */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <button
              type="button"
              onClick={() => updateHeader("tglEfektif", todayFormatted)}
              className={cn(
                "text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer",
                header.tglEfektif === todayFormatted
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-emerald-50 hover:text-[#015C3A]",
              )}
            >
              Hari Ini
            </button>
            <button
              type="button"
              onClick={() => updateHeader("tglEfektif", startOfMonthFormatted)}
              className={cn(
                "text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer",
                header.tglEfektif === startOfMonthFormatted
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-emerald-50 hover:text-[#015C3A]",
              )}
            >
              Awal Bulan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
