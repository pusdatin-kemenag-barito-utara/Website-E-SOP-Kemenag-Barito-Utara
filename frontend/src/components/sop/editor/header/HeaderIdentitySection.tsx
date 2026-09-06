import React from "react";
import { Input } from "@/components/ui/input";
import type { SOPHeader as SOPHeaderType } from "@/types/sop";
import { Fingerprint, FileText, BadgeCheck, UserCheck, Sparkles, User, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEFAULT_HEADER } from "@/lib/constants";
import { SectionHeader } from "../../shared/SectionHeader";

interface HeaderIdentitySectionProps {
  header: SOPHeaderType;
  updateHeader: (key: keyof SOPHeaderType, value: string) => void;
}

const ROMAN_MONTHS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

const CLASSIFICATION_CODES = [
  { code: "OT.01.3", label: "Tata Laksana / SOP", unit: "1" },
  { code: "KP.00.2", label: "Kepegawaian", unit: "1" },
  { code: "BA.01.1", label: "Bimas Islam", unit: "6" },
  { code: "PP.00.8", label: "Pend. Madrasah", unit: "2" },
  { code: "HJ.01.2", label: "Haji & Umrah", unit: "4" },
  { code: "KU.00.1", label: "Keuangan", unit: "1" },
];

const SIGNER_PROFILES = [
  {
    label: "Kepala Kantor (Definitif)",
    jabatan: "Kepala Kantor Kabupaten,",
    nama: "H. Arbaja, S.Ag., M.A.P",
    nip: "197311212001121001",
  },
  {
    label: "Plh. Kepala Kantor",
    jabatan: "Plh. Kepala Kantor Kabupaten,",
    nama: "H. Arbaja, S.Ag., M.A.P",
    nip: "197311212001121001",
  },
  {
    label: "Kasubbag Tata Usaha",
    jabatan: "Kasubbag Tata Usaha,",
    nama: "H. Arbaja, S.Ag., M.A.P",
    nip: "197311212001121001",
  },
];

export function HeaderIdentitySection({
  header,
  updateHeader,
}: HeaderIdentitySectionProps) {
  const isDefaultName = header.namaSOP === DEFAULT_HEADER.namaSOP;
  const isDefaultNomor = header.nomor === DEFAULT_HEADER.nomor;

  const generateSOPNumber = (classificationCode: string, unitCode: string) => {
    const date = new Date();
    const romanMonth = ROMAN_MONTHS[date.getMonth()];
    const year = date.getFullYear();
    const formatted = `B-    /Kk.15.03/${unitCode}/${classificationCode}/${romanMonth}/${year}`;
    updateHeader("nomor", formatted);
  };

  const applySignerProfile = (profile: typeof SIGNER_PROFILES[0]) => {
    updateHeader("disahkanOleh", profile.jabatan);
    updateHeader("pejabatNama", profile.nama);
    updateHeader("pejabatNip", profile.nip);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
      <SectionHeader
        icon={Fingerprint}
        title="Identitas & Pengesahan"
        colorClass="text-[#015C3A] dark:text-emerald-400"
      />

      <div className="p-5 md:p-6 space-y-6">
        {/* Nama Prosedur (SOP) */}
        <div className="space-y-2">
          <label htmlFor="header-nama-sop" className="text-xs font-bold text-slate-700 dark:text-slate-200 ml-1 tracking-wide flex items-center gap-1.5 mb-1.5 cursor-pointer">
            <FileText className="w-4 h-4 text-[#015C3A]" /> Nama Prosedur (SOP)
          </label>
          <Input
            id="header-nama-sop"
            name="header-nama-sop"
            value={header.namaSOP}
            onChange={(e) => updateHeader("namaSOP", e.target.value)}
            className={cn(
              "h-11 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-[#015C3A] focus:ring-1 focus:ring-[#015C3A] transition-all font-semibold text-slate-800 dark:text-slate-100 px-4",
              isDefaultName && "text-slate-400 italic font-medium",
            )}
            placeholder="Contoh: SOP PELAYANAN LEGALISIR IJAZAH / SURAT KELUAR..."
          />
        </div>

        {/* Nomor SOP & Generator Klasifikasi */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="header-nomor-sop" className="text-xs font-bold text-slate-700 dark:text-slate-200 ml-1 tracking-wide flex items-center gap-1.5 cursor-pointer">
              <BadgeCheck className="w-4 h-4 text-emerald-600" /> Nomor SOP
            </label>
          </div>
          <Input
            id="header-nomor-sop"
            name="header-nomor-sop"
            value={header.nomor}
            onChange={(e) => updateHeader("nomor", e.target.value)}
            className={cn(
              "h-11 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-[#015C3A] focus:ring-1 focus:ring-[#015C3A] transition-all font-semibold text-slate-800 dark:text-slate-100 px-4",
              isDefaultNomor && "text-slate-400 italic font-medium",
            )}
            placeholder="Nomor Surat / SOP..."
          />
          {/* Quick Classification Chips */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Format Naskah Dinas:
            </span>
            {CLASSIFICATION_CODES.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => generateSOPNumber(item.code, item.unit)}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:text-[#015C3A] dark:hover:bg-emerald-950/50 transition-colors border border-slate-200/60 dark:border-slate-700/60 cursor-pointer"
              >
                + {item.label} ({item.code})
              </button>
            ))}
          </div>
        </div>

        {/* Jabatan Pengesah & Signer Profile Switcher */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label htmlFor="header-disahkan-oleh" className="text-xs font-bold text-slate-700 dark:text-slate-200 ml-1 tracking-wide flex items-center gap-1.5 cursor-pointer">
              <UserCheck className="w-4 h-4 text-emerald-600" /> Jabatan Pengesah
            </label>

            {/* Quick Profile Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                Profil Pejabat:
              </span>
              {SIGNER_PROFILES.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => applySignerProfile(p)}
                  className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-md border transition-colors cursor-pointer",
                    header.disahkanOleh === p.jabatan
                      ? "bg-[#015C3A] text-white border-[#015C3A]"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-emerald-50 hover:text-[#015C3A]",
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <Input
            id="header-disahkan-oleh"
            name="header-disahkan-oleh"
            value={header.disahkanOleh}
            onChange={(e) => updateHeader("disahkanOleh", e.target.value)}
            className="h-11 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-[#015C3A] focus:ring-1 focus:ring-[#015C3A] transition-all font-semibold text-slate-800 dark:text-slate-100 px-4"
          />

          {/* Nama & NIP Pejabat */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            <div className="space-y-2">
              <label htmlFor="header-pejabat-nama" className="text-xs font-bold text-slate-700 dark:text-slate-200 ml-1 tracking-wide mb-1.5 block cursor-pointer">
                Nama Pejabat Penandatangan
              </label>
              <Input
                id="header-pejabat-nama"
                name="header-pejabat-nama"
                value={header.pejabatNama}
                onChange={(e) => updateHeader("pejabatNama", e.target.value)}
                className="h-11 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-[#015C3A] focus:ring-1 focus:ring-[#015C3A] transition-all font-semibold text-slate-800 dark:text-slate-100 px-4"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="header-pejabat-nip" className="text-xs font-bold text-slate-700 dark:text-slate-200 ml-1 tracking-wide mb-1.5 block cursor-pointer">
                NIP Pejabat
              </label>
              <Input
                id="header-pejabat-nip"
                name="header-pejabat-nip"
                value={header.pejabatNip}
                onChange={(e) => updateHeader("pejabatNip", e.target.value)}
                className="h-11 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:border-[#015C3A] focus:ring-1 focus:ring-[#015C3A] transition-all font-semibold text-slate-800 dark:text-slate-100 px-4 tracking-normal"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
