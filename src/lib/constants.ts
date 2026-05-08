import { SOPHeader, SymbolType } from "@/types/sop";

export const INITIAL_ROLES = [
  "Administrator",
  "Kepala Kantor",
  "Petugas PTSP",
  "Operator",
  "Pengawas",
];

export const SYMBOL_OPTIONS: { value: SymbolType; label: string }[] = [
  { value: "terminator", label: "Mulai/Selesai" },
  { value: "process", label: "Proses/Kotak" },
  { value: "decision", label: "Keputusan" },
  { value: "offpage", label: "Off-page" },
];

export const DEFAULT_HEADER: SOPHeader = {
  instansi: "Kementerian Agama",
  satker: "Kantor Kabupaten Barito Utara",
  nomor: "B- /Kk.15.6.1/OT.01.4/01/2025",
  tglBuat: "09 Januari 2025",
  tglRevisi: "-",
  tglEfektif: "10 Januari 2025",
  disahkanOleh: "Kepala Kantor Kabupaten,",
  pejabatNama: "H. Arbaja, S.Ag., M.A.P.",
  pejabatNip: "19731112 200112 1 001",
  namaSOP: "SOP PELAYANAN PTSP",
  dasarHukum: "KMA No. 9 Tahun 2016",
  kualifikasi: "Memahami Prosedur PTSP",
  keterkaitan: "SOP Pengelolaan Surat",
  peralatan: "Komputer, ATK, Printer",
  peringatan: "Harus dilakukan sesuai urutan",
  pencatatan: "Disimpan dalam buku register",
};
