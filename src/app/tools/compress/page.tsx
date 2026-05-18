"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Zap } from "lucide-react";
import { PDFCompressor } from "@/components/tools/PDFCompressor";

export default function CompressPdfPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900">
      {/* Navigation Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link
            href="/tools"
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-600" />
            <h1 className="text-lg font-black tracking-tight text-slate-900 uppercase">
              Compress <span className="text-emerald-600 font-black">PDF</span>
            </h1>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Secure Cloud Processing
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Banner */}
        <div className="bg-white border-b border-slate-100 py-12 md:py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
              Kecilkan <span className="italic text-emerald-600">Ukuran</span>,{" "}
              <br className="hidden md:block" />
              Tetap Jaga{" "}
              <span className="text-emerald-600 underline decoration-emerald-200 underline-offset-8">
                Kualitas
              </span>
              .
            </h2>
            <p className="text-slate-500 font-bold text-sm uppercase tracking-[0.2em] max-w-2xl mx-auto leading-relaxed">
              Alat kompresi PDF tercanggih untuk mengecilkan dokumen Anda tanpa
              mengorbankan keterbacaan. Sempurna untuk pengiriman email dan
              arsip.
            </p>
          </div>
        </div>

        {/* Compressor Tool */}
        <div className="pb-20">
          <PDFCompressor />
        </div>

        {/* Features Info */}
        <div className="bg-slate-50 py-20 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center md:text-left">
              <h4 className="text-lg font-black text-slate-900 mb-4 uppercase tracking-tight">
                Privasi Terjamin
              </h4>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Dokumen Anda diproses secara aman. Kami menggunakan enkripsi
                tingkat tinggi dan menghapus file secara otomatis setelah proses
                selesai.
              </p>
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-lg font-black text-slate-900 mb-4 uppercase tracking-tight">
                Kualitas Optimal
              </h4>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Algoritma kami secara cerdas mengidentifikasi elemen yang dapat
                dioptimalkan tanpa mengurangi kualitas visual teks dan gambar
                penting.
              </p>
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-lg font-black text-slate-900 mb-4 uppercase tracking-tight">
                Multi-Platform
              </h4>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Gunakan alat ini di perangkat apa pun. Baik desktop, tablet,
                maupun ponsel pintar, proses kompresi tetap lancar dan cepat.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 p-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            SOP Builder PDF Utility &copy; 2024
          </p>
          <div className="flex gap-6">
            <Link
              href="/tools"
              className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline"
            >
              Semua Alat
            </Link>
            <Link
              href="/"
              className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
            >
              Kembali ke Builder
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
