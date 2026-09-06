export type SymbolType =
  | "terminator"
  | "process"
  | "decision"
  | "offpage"
  | "offpage-up";

export interface Activity {
  id: string;
  no: string;
  kegiatan: string;
  pelaksana: string[];
  persyaratan: string;
  waktu: string;
  output: string;
  keterangan: string;
  symbol: SymbolType;
  roleForSymbol: string;
}

export interface SOPHeader {
  instansi: string;
  satker: string;
  nomor: string;
  tglBuat: string;
  tglRevisi: string;
  tglEfektif: string;
  disahkanOleh: string;
  pejabatNama: string;
  pejabatNip: string;
  namaSOP: string;
  dasarHukum: string;
  kualifikasi: string;
  keterkaitan: string;
  peralatan: string;
  peringatan: string;
  pencatatan: string;
}

export interface SOPListItem {
  id: string;
  title: string;
  updated_at: string;
}

export interface SOPData {
  header: SOPHeader;
  activities: Activity[];
  roles: string[];
}

export interface StoredSOP {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  title: string;
  header: SOPHeader;
  activities: Activity[];
  roles: string[];
}

export interface SymbolCoord {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface AdminSOPListItem {
  id: string;
  title: string;
  updated_at: string;
  user_id: string;
  user_email?: string;
  user_bidang?: string;
  header: SOPHeader;
}
