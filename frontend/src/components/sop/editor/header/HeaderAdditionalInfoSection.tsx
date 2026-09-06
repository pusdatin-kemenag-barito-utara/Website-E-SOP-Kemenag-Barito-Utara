import React from "react";
import type { SOPHeader as SOPHeaderType } from "@/types/sop";
import { Info, Link2, Wrench, ShieldAlert, ClipboardList, Sparkles } from "lucide-react";
import { SectionHeader } from "../../shared/SectionHeader";
import { SmartTextarea } from "./SmartTextarea";

interface HeaderAdditionalInfoSectionProps {
  header: SOPHeaderType;
  updateHeader: (key: keyof SOPHeaderType, value: string) => void;
}

const KETERKAITAN_PRESETS = [
  "SOP Pengelolaan Surat Masuk dan Keluar",
  "SOP Pelayanan Terpadu Satu Pintu (PTSP)",
  "SOP Pengelolaan Administrasi Kepegawaian",
  "SOP Kearsipan dan Tata Naskah Dinas",
];

const PERALATAN_PRESETS = [
  "Komputer / Laptop dan Jaringan Internet",
  "Printer, Scanner dan Alat Tulis Kantor (ATK)",
  "Buku Register dan Lembar Disposisi",
  "Aplikasi PTSP / Sistem Digital Kemenag",
];

const PERINGATAN_PRESETS = [
  "Apabila SOP ini tidak dilaksanakan, maka proses penyelesaian pelayanan akan tertunda dan terhambat",
  "Berkas permohonan yang belum lengkap akan dikembalikan kepada pemohon dalam waktu 1x24 jam untuk dilengkapi",
  "Harus dilaksanakan sesuai urutan tahapan yang telah ditetapkan",
];

const PENCATATAN_PRESETS = [
  "Disimpan dalam buku register / buku agenda persuratan",
  "Diarsipkan secara digital pada server / Cloud E-SOP Kemenag Barito Utara",
  "Dicatat dalam laporan rekapitulasi pelayanan bulanan",
];

export function HeaderAdditionalInfoSection({
  header,
  updateHeader,
}: HeaderAdditionalInfoSectionProps) {
  const appendToList = (
    currentVal: string,
    textToAdd: string,
    key: "keterkaitan" | "peralatan" | "peringatan" | "pencatatan",
  ) => {
    const trimmed = currentVal.trim();
    if (!trimmed) {
      updateHeader(key, `1. ${textToAdd}`);
      return;
    }

    if (trimmed.includes(textToAdd)) return;

    const lines = trimmed.split("\n").filter((l) => l.trim().length > 0);
    const nextIndex = lines.length + 1;
    updateHeader(key, `${trimmed}\n${nextIndex}. ${textToAdd}`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
      <SectionHeader
        icon={Info}
        title="Informasi Tambahan"
        colorClass="text-amber-500 dark:text-amber-400"
      />
      <div className="p-5 md:p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Keterkaitan */}
          <div className="space-y-2">
            <label htmlFor="header-keterkaitan" className="text-xs font-bold text-slate-700 dark:text-slate-200 ml-1 tracking-wide flex items-center gap-1.5 cursor-pointer">
              <Link2 className="w-4 h-4 text-sky-500" /> Keterkaitan
            </label>
            <SmartTextarea
              id="header-keterkaitan"
              name="header-keterkaitan"
              value={header.keterkaitan}
              onValueChange={(val) => updateHeader("keterkaitan", val)}
              className="min-h-[80px]"
              placeholder="Contoh: 1. SOP Persuratan..."
            />
            {/* Quick Keterkaitan Chips */}
            <div className="flex flex-wrap gap-1 pt-0.5">
              {KETERKAITAN_PRESETS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => appendToList(header.keterkaitan, item, "keterkaitan")}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-sky-50 hover:text-sky-600 dark:hover:bg-sky-950/50 transition-colors border border-slate-200/60 dark:border-slate-700/60 cursor-pointer text-left"
                >
                  + {item}
                </button>
              ))}
            </div>
          </div>

          {/* Peralatan */}
          <div className="space-y-2">
            <label htmlFor="header-peralatan" className="text-xs font-bold text-slate-700 dark:text-slate-200 ml-1 tracking-wide flex items-center gap-1.5 cursor-pointer">
              <Wrench className="w-4 h-4 text-amber-500" /> Peralatan & Perlengkapan
            </label>
            <SmartTextarea
              id="header-peralatan"
              name="header-peralatan"
              value={header.peralatan}
              onValueChange={(val) => updateHeader("peralatan", val)}
              className="min-h-[80px]"
              placeholder="Contoh: 1. Komputer/Laptop..."
            />
            {/* Quick Peralatan Chips */}
            <div className="flex flex-wrap gap-1 pt-0.5">
              {PERALATAN_PRESETS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => appendToList(header.peralatan, item, "peralatan")}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-950/50 transition-colors border border-slate-200/60 dark:border-slate-700/60 cursor-pointer text-left"
                >
                  + {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-slate-100 dark:border-slate-800">
          {/* Peringatan */}
          <div className="space-y-2">
            <label htmlFor="header-peringatan" className="text-xs font-bold text-red-600 dark:text-red-400 ml-1 tracking-wide flex items-center gap-1.5 cursor-pointer">
              <ShieldAlert className="w-4 h-4" /> Peringatan
            </label>
            <SmartTextarea
              id="header-peringatan"
              name="header-peringatan"
              value={header.peringatan}
              onValueChange={(val) => updateHeader("peringatan", val)}
              className="min-h-[80px]"
              placeholder="Contoh: 1. Berkas harus lengkap..."
            />
            {/* Quick Peringatan Chips */}
            <div className="flex flex-wrap gap-1 pt-0.5">
              {PERINGATAN_PRESETS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => appendToList(header.peringatan, item, "peringatan")}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors border border-rose-200/60 dark:border-rose-900/60 cursor-pointer text-left"
                >
                  + {item}
                </button>
              ))}
            </div>
          </div>

          {/* Pencatatan & Pendataan */}
          <div className="space-y-2">
            <label htmlFor="header-pencatatan" className="text-xs font-bold text-slate-700 dark:text-slate-200 ml-1 tracking-wide flex items-center gap-1.5 cursor-pointer">
              <ClipboardList className="w-4 h-4 text-slate-500 dark:text-slate-400" /> Pencatatan & Pendataan
            </label>
            <SmartTextarea
              id="header-pencatatan"
              name="header-pencatatan"
              value={header.pencatatan}
              onValueChange={(val) => updateHeader("pencatatan", val)}
              className="min-h-[80px]"
              placeholder="Contoh: 1. Agenda Surat Masuk..."
            />
            {/* Quick Pencatatan Chips */}
            <div className="flex flex-wrap gap-1 pt-0.5">
              {PENCATATAN_PRESETS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => appendToList(header.pencatatan, item, "pencatatan")}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200/60 dark:border-slate-700/60 cursor-pointer text-left"
                >
                  + {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
