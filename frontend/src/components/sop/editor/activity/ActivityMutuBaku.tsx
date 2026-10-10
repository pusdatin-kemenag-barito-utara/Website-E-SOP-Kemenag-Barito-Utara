import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Clock, FileCheck, FileText, HelpCircle } from "lucide-react";
import type { Activity } from "@/types/sop";
import { cn } from "@/lib/utils";

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
  "Tanda Terima PTSP",
  "Lembar Disposisi",
  "Konsep Surat/SK",
  "SK Definitif",
  "Buku Register / TTD",
  "Berkas Lengkap",
];

const REQUIREMENT_PRESETS = [
  "Surat Permohonan",
  "Fotokopi SK Terakhir",
  "Disposisi Pimpinan",
  "Berkas Lengkap",
];

export function ActivityMutuBaku({ act, onUpdate }: ActivityMutuBakuProps) {
  return (
    <div className="w-full lg:w-[340px] shrink-0 space-y-3">
      {/* Header with Permenpan RB badge */}
      <div className="flex items-center justify-between pb-0.5">
        <div className="flex items-center gap-2">
          <div className="w-1 h-3.5 bg-emerald-600 rounded-full" />
          <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
            Mutu Baku (SLA)
          </span>
        </div>
        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-900/40">
          Permenpan RB
        </span>
      </div>

      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 space-y-4 shadow-xs">
        {/* 1. Persyaratan */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800 text-[#015C3A] dark:text-emerald-400 flex items-center justify-center shrink-0">
                <FileText className="w-3 h-3" />
              </div>
              <span>Persyaratan / Berkas</span>
            </span>
          </div>

          <Textarea
            id={`persyaratan-${act.id}`}
            name={`persyaratan-${act.id}`}
            value={act.persyaratan || ""}
            onChange={(e) => onUpdate(act.id, "persyaratan", e.target.value)}
            placeholder="Berkas atau kelengkapan yang dibutuhkan..."
            className="min-h-[52px] max-h-[100px] text-xs sm:text-sm bg-slate-50/60 dark:bg-slate-950/60 border-slate-200 dark:border-slate-700 rounded-xl focus-visible:ring-[#015C3A] focus-visible:border-[#015C3A] font-medium leading-relaxed"
          />

          {/* Quick Requirement Grid (2x2) */}
          <div className="grid grid-cols-2 gap-1.5">
            {REQUIREMENT_PRESETS.map((req) => (
              <button
                key={req}
                type="button"
                onClick={() => {
                  const current = (act.persyaratan || "").trim();
                  if (!current) {
                    onUpdate(act.id, "persyaratan", `- ${req}`);
                  } else if (!current.includes(req)) {
                    onUpdate(act.id, "persyaratan", `${current}\n- ${req}`);
                  }
                }}
                className="text-[10.5px] font-bold px-2 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:text-[#015C3A] hover:border-emerald-200 dark:hover:bg-emerald-950/50 transition-all border border-slate-200/70 dark:border-slate-700 text-left truncate flex items-center gap-1 cursor-pointer"
                title={`Tambahkan ${req}`}
              >
                <span className="text-emerald-600 font-bold shrink-0">+</span>
                <span className="truncate">{req}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Waktu (SLA) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Clock className="w-3 h-3" />
              </div>
              <span>Waktu / Durasi Layanan</span>
            </span>
            {act.waktu && (
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-200/60 dark:border-amber-900/40">
                {act.waktu}
              </span>
            )}
          </div>

          <Input
            id={`waktu-${act.id}`}
            name={`waktu-${act.id}`}
            value={act.waktu || ""}
            onChange={(e) => onUpdate(act.id, "waktu", e.target.value)}
            placeholder="Ketik waktu (misal: 15 Menit / 1 Hari Kerja)..."
            className="h-9 text-xs sm:text-sm font-semibold bg-slate-50/60 dark:bg-slate-950/60 border-slate-200 dark:border-slate-700 rounded-xl focus-visible:ring-[#015C3A] focus-visible:border-[#015C3A]"
          />

          {/* Symmetrical Time Keypad Grid (4x2) */}
          <div className="grid grid-cols-4 gap-1.5">
            {TIME_PRESETS.map((t) => {
              const isActive = act.waktu === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => onUpdate(act.id, "waktu", t)}
                  className={cn(
                    "text-[10px] font-bold py-1.5 px-0.5 rounded-lg text-center transition-all border cursor-pointer truncate",
                    isActive
                      ? "bg-[#015C3A] text-white border-[#015C3A] shadow-xs"
                      : "bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:text-[#015C3A] hover:border-emerald-200 dark:hover:bg-emerald-950/50 border-slate-200/70 dark:border-slate-700",
                  )}
                  title={t}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Hasil Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <FileCheck className="w-3 h-3" />
              </div>
              <span>Hasil Output Produk</span>
            </span>
          </div>

          <Textarea
            id={`output-${act.id}`}
            name={`output-${act.id}`}
            value={act.output || ""}
            onChange={(e) => onUpdate(act.id, "output", e.target.value)}
            placeholder="Hasil output tahapan ini (misal: Draft SK / Berkas Sah)..."
            className="min-h-[50px] max-h-[90px] text-xs sm:text-sm bg-slate-50/60 dark:bg-slate-950/60 border-slate-200 dark:border-slate-700 rounded-xl focus-visible:ring-[#015C3A] focus-visible:border-[#015C3A] font-medium leading-relaxed"
          />

          {/* Quick Output Grid (2x3) */}
          <div className="grid grid-cols-2 gap-1.5">
            {OUTPUT_PRESETS.map((out) => {
              const isActive = (act.output || "").includes(out);
              return (
                <button
                  key={out}
                  type="button"
                  onClick={() => onUpdate(act.id, "output", out)}
                  className={cn(
                    "text-[10.5px] font-bold px-2 py-1.5 rounded-lg text-left truncate transition-all border cursor-pointer flex items-center gap-1",
                    isActive
                      ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800"
                      : "bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 dark:hover:bg-blue-950/50 border-slate-200/70 dark:border-slate-700",
                  )}
                  title={out}
                >
                  <span className="text-blue-500 font-bold shrink-0">{isActive ? "✓" : "+"}</span>
                  <span className="truncate">{out}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Keterangan */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 flex items-center justify-center shrink-0">
                <HelpCircle className="w-3 h-3" />
              </div>
              <span>Keterangan (Opsional)</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Kolom 7 Tabel SOP</span>
          </div>

          <Textarea
            id={`keterangan-${act.id}`}
            name={`keterangan-${act.id}`}
            value={act.keterangan || ""}
            onChange={(e) => onUpdate(act.id, "keterangan", e.target.value)}
            placeholder="Catatan pelaksana, SOP terkait, atau telaah staf..."
            className="min-h-[44px] max-h-[80px] text-xs sm:text-sm bg-slate-50/60 dark:bg-slate-950/60 border-slate-200 dark:border-slate-700 rounded-xl focus-visible:ring-[#015C3A] focus-visible:border-[#015C3A] font-medium"
          />
        </div>
      </div>
    </div>
  );
}
