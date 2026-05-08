import { SOPHeader, SymbolType } from "@/types/sop";

export const INITIAL_ROLES = [
  "Pemohon",
  "Petugas PTSP",
  "Operator",
  "Kepala Seksi",
  "Bendahara Pengeluaran",
  "KPA",
  "PPK",
  "PPSPM",
  "JFT",
  "Kasubbag TU",
  "Kepala Kantor",
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
  nomor: "B-..../Kk.15.2..../....../..../2026",
  tglBuat: "01 Januari 2026",
  tglRevisi: "-",
  tglEfektif: "02 Januari 2026",
  disahkanOleh: "Kepala Kantor Kabupaten,",
  pejabatNama: "H. Arbaja, S.Ag.,M.A.P",
  pejabatNip: "197311212001121001",
  namaSOP: "SOP PELAYANAN ...........",
  dasarHukum: "KMA No. 9 Tahun 2016",
  kualifikasi: "Memahami Prosedur PTSP",
  keterkaitan: "SOP Pengelolaan Surat",
  peralatan: "Komputer, ATK, Printer",
  peringatan: "Harus dilakukan sesuai urutan",
  pencatatan: "Disimpan dalam buku register",
};
