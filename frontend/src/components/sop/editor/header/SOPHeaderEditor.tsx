import React, { useState } from "react";
import type { SOPHeader as SOPHeaderType } from "@/types/sop";
import { HeaderIdentitySection } from "./HeaderIdentitySection";
import { HeaderTimelineSection } from "./HeaderTimelineSection";
import { HeaderRequirementSection } from "./HeaderRequirementSection";
import { HeaderAdditionalInfoSection } from "./HeaderAdditionalInfoSection";
import { DEFAULT_HEADER } from "@/lib/constants";
import {
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Layers,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  header: SOPHeaderType;
  setHeader: React.Dispatch<React.SetStateAction<SOPHeaderType>>;
}

export function SOPHeaderEditor({ header, setHeader }: Props) {
  const updateHeader = (key: keyof SOPHeaderType, value: string) => {
    setHeader((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetToOfficialDefaults = () => {
    setHeader((prev) => ({
      ...prev,
      instansi: DEFAULT_HEADER.instansi,
      satker: DEFAULT_HEADER.satker,
      disahkanOleh: DEFAULT_HEADER.disahkanOleh,
      pejabatNama: DEFAULT_HEADER.pejabatNama,
      pejabatNip: DEFAULT_HEADER.pejabatNip,
      dasarHukum: prev.dasarHukum || DEFAULT_HEADER.dasarHukum,
      kualifikasi: prev.kualifikasi || DEFAULT_HEADER.kualifikasi,
      peralatan: prev.peralatan || DEFAULT_HEADER.peralatan,
      peringatan: prev.peringatan || DEFAULT_HEADER.peringatan,
      pencatatan: prev.pencatatan || DEFAULT_HEADER.pencatatan,
    }));
  };

  // Calculate completeness score
  const checks = [
    { label: "Nama SOP", valid: !!header.namaSOP && header.namaSOP !== DEFAULT_HEADER.namaSOP },
    { label: "Nomor SOP", valid: !!header.nomor && header.nomor !== DEFAULT_HEADER.nomor && !header.nomor.includes("${") },
    { label: "Pejabat & NIP", valid: !!header.pejabatNama && !!header.pejabatNip },
    { label: "Tgl Buat", valid: !!header.tglBuat },
    { label: "Tgl Efektif", valid: !!header.tglEfektif },
    { label: "Dasar Hukum", valid: !!header.dasarHukum },
    { label: "Kualifikasi", valid: !!header.kualifikasi },
    { label: "Keterkaitan", valid: !!header.keterkaitan },
    { label: "Peralatan", valid: !!header.peralatan },
  ];

  const validCount = checks.filter((c) => c.valid).length;
  const percentage = Math.round((validCount / checks.length) * 100);
  const isComplete = percentage >= 85;

  return (
    <div className="space-y-5 px-1 sm:px-2 py-3 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* Top Completeness & Readiness Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center border",
                isComplete
                  ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 text-[#015C3A] dark:text-emerald-400"
                  : "bg-amber-50 dark:bg-amber-950/60 border-amber-200 text-amber-600 dark:text-amber-400",
              )}
            >
              {isComplete ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <FileCheck className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight">
                  Status Kelengkapan Naskah SOP
                </h3>
                <span
                  className={cn(
                    "text-[10px] font-extrabold px-2 py-0.5 rounded-full border",
                    isComplete
                      ? "bg-emerald-50 text-[#015C3A] border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800"
                      : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800",
                  )}
                >
                  {percentage}% Siap Disahkan
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                {validCount} dari {checks.length} parameter identitas telah lengkap
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResetToOfficialDefaults}
            className="h-9 px-3 text-xs font-bold rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Muat kop dan profil pejabat resmi Kemenag Barito Utara"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Format Baku Kemenag</span>
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-500 rounded-full",
              isComplete
                ? "bg-gradient-to-r from-emerald-500 to-[#015C3A]"
                : "bg-gradient-to-r from-amber-400 to-amber-500",
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* 4 Core Configuration Cards */}
      <HeaderIdentitySection header={header} updateHeader={updateHeader} />
      <HeaderTimelineSection header={header} updateHeader={updateHeader} />
      <HeaderRequirementSection header={header} updateHeader={updateHeader} />
      <HeaderAdditionalInfoSection header={header} updateHeader={updateHeader} />
    </div>
  );
}
