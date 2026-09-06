import { z } from "zod";

export const SOPHeaderSchema = z.object({
  namaSOP: z.string().min(1, "Nama SOP wajib diisi"),
  nomorSOP: z.string().min(1, "Nomor SOP wajib diisi"),
  tglBuat: z.string().optional(),
  tglRevisi: z.string().optional(),
  tglEfektif: z.string().optional(),
  instansi: z.string().optional(),
  satker: z.string().optional(),
  unit: z.string().optional(),
  alamat: z.string().optional(),
  telepon: z.string().optional(),
  email: z.string().optional(),
  website: z.string().optional(),
  dasarHukum: z.string().optional(),
  kualifikasi: z.string().optional(),
  pengertian: z.string().optional(),
  maksudTujuan: z.string().optional(),
  kebijakan: z.string().optional(),
  peringatan: z.string().optional(),
});

export type SOPHeaderZ = z.infer<typeof SOPHeaderSchema>;

export const ActivitySchema = z.object({
  id: z.string(),
  symbol: z.enum(["terminator", "process", "decision", "offpage"]),
  uraian: z.string().min(1, "Uraian kegiatan wajib diisi"),
  pelaksana: z.array(z.string()),
  roleForSymbol: z.string(),
  persyaratan: z.string().optional(),
  waktu: z.string().optional(),
  output: z.string().optional(),
  keterangan: z.string().optional(),
});

export type ActivityZ = z.infer<typeof ActivitySchema>;

export const SOPDataSchema = z.object({
  header: SOPHeaderSchema,
  activities: z.array(ActivitySchema),
  roles: z.array(z.string()),
});

export type SOPDataZ = z.infer<typeof SOPDataSchema>;

export function validateSOPData(data: unknown) {
  return SOPDataSchema.safeParse(data);
}
