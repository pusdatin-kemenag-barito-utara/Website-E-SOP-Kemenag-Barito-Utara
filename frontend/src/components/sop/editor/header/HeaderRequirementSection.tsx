import React from "react";
import type { SOPHeader as SOPHeaderType } from "@/types/sop";
import { Gavel, ClipboardList, Sparkles } from "lucide-react";
import { SectionHeader } from "../../shared/SectionHeader";
import { SmartTextarea } from "./SmartTextarea";

interface HeaderRequirementSectionProps {
  header: SOPHeaderType;
  updateHeader: (key: keyof SOPHeaderType, value: string) => void;
}

const LEGAL_PRESETS = [
  "KMA No. 9 Tahun 2016 tentang Pedoman Tata Naskah Dinas Kementerian Agama",
  "PMA No. 72 Tahun 2022 tentang Organisasi dan Tata Kerja Kementerian Agama",
  "UU No. 25 Tahun 2009 tentang Pelayanan Publik",
  "UU No. 20 Tahun 2023 tentang Aparatur Sipil Negara",
  "PermenPAN-RB No. 35 Tahun 2012 tentang Pedoman Penyusunan Standar Operasional Prosedur AP",
];

const QUALIFICATION_PRESETS = [
  "Memahami alur dan standar operasional pelayanan PTSP",
  "Memiliki kemampuan pengoperasian komputer dan sistem digital",
  "Memahami regulasi dan tata naskah dinas Kementerian Agama",
  "Memiliki ketelitian dan kecermatan dalam verifikasi dokumen administrasi",
];

export function HeaderRequirementSection({
  header,
  updateHeader,
}: HeaderRequirementSectionProps) {
  const appendToList = (currentVal: string, textToAdd: string, key: "dasarHukum" | "kualifikasi") => {
    const trimmed = currentVal.trim();
    if (!trimmed) {
      updateHeader(key, `1. ${textToAdd}`);
      return;
    }

    if (trimmed.includes(textToAdd)) return;

    // Count existing items
    const lines = trimmed.split("\n").filter((l) => l.trim().length > 0);
    const nextIndex = lines.length + 1;
    updateHeader(key, `${trimmed}\n${nextIndex}. ${textToAdd}`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
      <SectionHeader
        icon={Gavel}
        title="Dasar Hukum & Kualifikasi"
        colorClass="text-purple-500 dark:text-purple-400"
      />
      <div className="p-5 md:p-6 space-y-6">
        {/* Dasar Hukum */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="header-dasar-hukum" className="text-xs font-bold text-slate-700 dark:text-slate-200 ml-1 tracking-wide flex items-center gap-1.5 cursor-pointer">
              <Gavel className="w-4 h-4 text-purple-500" /> Dasar Hukum
            </label>
          </div>
          <SmartTextarea
            id="header-dasar-hukum"
            name="header-dasar-hukum"
            value={header.dasarHukum}
            onValueChange={(val) => updateHeader("dasarHukum", val)}
            className="min-h-[100px]"
            placeholder="Contoh: 1. KMA No. 9 Tahun 2016..."
          />
          {/* Quick Legal Presets */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-500" /> Rekomendasi Regulasi Kemenag:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {LEGAL_PRESETS.map((legal) => (
                <button
                  key={legal}
                  type="button"
                  onClick={() => appendToList(header.dasarHukum, legal, "dasarHukum")}
                  className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-950/50 transition-colors border border-slate-200/60 dark:border-slate-700/60 cursor-pointer text-left"
                >
                  + {legal.split(" tentang ")[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Kualifikasi Pelaksana */}
        <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <label htmlFor="header-kualifikasi" className="text-xs font-bold text-slate-700 dark:text-slate-200 ml-1 tracking-wide flex items-center gap-1.5 cursor-pointer">
              <ClipboardList className="w-4 h-4 text-indigo-500" /> Kualifikasi Pelaksana
            </label>
          </div>
          <SmartTextarea
            id="header-kualifikasi"
            name="header-kualifikasi"
            value={header.kualifikasi}
            onValueChange={(val) => updateHeader("kualifikasi", val)}
            className="min-h-[100px]"
            placeholder="Contoh: 1. Memahami prosedur administrasi..."
          />
          {/* Quick Qualification Presets */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-500" /> Rekomendasi Kualifikasi:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUALIFICATION_PRESETS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => appendToList(header.kualifikasi, q, "kualifikasi")}
                  className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-950/50 transition-colors border border-slate-200/60 dark:border-slate-700/60 cursor-pointer text-left"
                >
                  + {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
