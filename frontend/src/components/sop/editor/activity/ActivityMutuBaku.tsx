import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Clock, FileCheck, FileText, Sparkles } from "lucide-react";
import type { Activity } from "@/types/sop";

interface ActivityMutuBakuProps {
  act: Activity;
  onUpdate: (id: string, field: keyof Activity, value: string) => void;
}

const TIME_PRESETS = [
  "5 Menit",
  "10 Menit",
  "15 Menit",
  "30 Menit",
  "1 Jam",
  "1 Hari Kerja",
  "3 Hari Kerja",
  "7 Hari Kerja",
];

const OUTPUT_PRESETS = [
  "Berkas Lengkap",
  "Tanda Terima PTSP",
  "Lembar Disposisi",
  "Konsep Surat/SK",
  "SK Definitif",
  "Buku Register / Tanda Tangan",
];

const REQUIREMENT_PRESETS = [
  "Surat Permohonan",
  "Fotokopi SK Terakhir",
  "Disposisi Pimpinan",
  "Berkas Lengkap",
];

export function ActivityMutuBaku({ act, onUpdate }: ActivityMutuBakuProps) {
  return (
    <div className="w-full lg:w-[320px] space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-1 h-3.5 bg-[#015C3A] rounded-full" />
        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
          Mutu Baku
        </span>
      </div>

      <div className="p-3.5 md:p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        {/* Persyaratan */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 ml-0.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#015C3A]" /> Persyaratan
            </span>
          </div>
          <Textarea
            id={`persyaratan-${act.id}`}
            name={`persyaratan-${act.id}`}
            value={act.persyaratan}
            onChange={(e) => onUpdate(act.id, "persyaratan", e.target.value)}
            placeholder="Berkas yang dibutuhkan..."
            className="min-h-[44px] max-h-[90px] overflow-y-auto text-xs sm:text-sm bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-700 rounded-xl focus-visible:ring-[#015C3A] focus-visible:border-[#015C3A]"
          />
          {/* Quick Requirement Chips */}
          <div className="flex flex-wrap gap-1 pt-0.5">
            {REQUIREMENT_PRESETS.map((req) => (
              <button
                key={req}
                type="button"
                onClick={() => {
                  const current = act.persyaratan.trim();
                  if (!current) {
                    onUpdate(act.id, "persyaratan", `- ${req}`);
                  } else if (!current.includes(req)) {
                    onUpdate(act.id, "persyaratan", `${current}\n- ${req}`);
                  }
                }}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:text-[#015C3A] dark:hover:bg-emerald-950/50 transition-colors border border-slate-200/60 dark:border-slate-700/60 cursor-pointer"
              >
                + {req}
              </button>
            ))}
          </div>
        </div>

        {/* Waktu */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 ml-0.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" /> Waktu
            </span>
          </div>
          <Input
            id={`waktu-${act.id}`}
            name={`waktu-${act.id}`}
            value={act.waktu}
            onChange={(e) => onUpdate(act.id, "waktu", e.target.value)}
            placeholder="Misal: 10 Menit"
            className="h-9 text-xs sm:text-sm font-semibold bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-700 rounded-xl focus-visible:ring-[#015C3A] focus-visible:border-[#015C3A]"
          />
          {/* Quick Time Chips */}
          <div className="flex flex-wrap gap-1 pt-0.5">
            {TIME_PRESETS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onUpdate(act.id, "waktu", t)}
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-md transition-colors border cursor-pointer ${
                  act.waktu === t
                    ? "bg-[#015C3A] text-white border-[#015C3A]"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:text-[#015C3A] dark:hover:bg-emerald-950/50 border-slate-200/60 dark:border-slate-700/60"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Hasil Output */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 ml-0.5 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-blue-500" /> Hasil Output
            </span>
          </div>
          <Textarea
            id={`output-${act.id}`}
            name={`output-${act.id}`}
            value={act.output}
            onChange={(e) => onUpdate(act.id, "output", e.target.value)}
            placeholder="Misal: Draft SK"
            className="min-h-[44px] max-h-[90px] overflow-y-auto text-xs sm:text-sm bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-700 rounded-xl focus-visible:ring-[#015C3A] focus-visible:border-[#015C3A]"
          />
          {/* Quick Output Chips */}
          <div className="flex flex-wrap gap-1 pt-0.5">
            {OUTPUT_PRESETS.map((out) => (
              <button
                key={out}
                type="button"
                onClick={() => onUpdate(act.id, "output", out)}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/50 transition-colors border border-slate-200/60 dark:border-slate-700/60 cursor-pointer"
              >
                {out}
              </button>
            ))}
          </div>
        </div>

        {/* Keterangan */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 ml-0.5">
            Keterangan (Opsional)
          </span>
          <Textarea
            id={`keterangan-${act.id}`}
            name={`keterangan-${act.id}`}
            value={act.keterangan}
            onChange={(e) => onUpdate(act.id, "keterangan", e.target.value)}
            placeholder="Catatan tambahan..."
            className="min-h-[40px] max-h-[80px] overflow-y-auto text-xs sm:text-sm bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-700 rounded-xl focus-visible:ring-[#015C3A] focus-visible:border-[#015C3A]"
          />
        </div>
      </div>
    </div>
  );
}
