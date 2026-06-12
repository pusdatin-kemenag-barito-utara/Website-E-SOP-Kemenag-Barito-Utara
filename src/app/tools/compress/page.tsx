"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Zap } from "lucide-react";
import { PDFCompressor } from "@/components/tools/PDFCompressor";

export default function CompressPdfPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col text-foreground">
      <header className="h-14 bg-card border-b border-border px-4 md:px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link
            href="/tools"
            className="p-1.5 hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Kembali"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <h1 className="text-sm font-bold tracking-tight">
              Compress <span className="text-primary">PDF</span>
            </h1>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-muted border border-border rounded-full">
            <ShieldCheck className="w-3 h-3 text-primary" />
            <span className="text-[8px] font-medium text-muted-foreground tracking-wide">
              Secure Processing
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="bg-card border-b border-border py-10 md:py-16">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight leading-tight">
              Kecilkan <span className="italic text-primary">Ukuran</span>,{" "}
              <br className="hidden md:block" />
              Tetap Jaga{" "}
              <span className="text-primary underline decoration-primary/30 underline-offset-6">
                Kualitas
              </span>
              .
            </h2>
            <p className="text-muted-foreground text-sm font-medium max-w-xl mx-auto leading-relaxed">
              Alat kompresi PDF tercanggih untuk mengecilkan dokumen Anda tanpa
              mengorbankan keterbacaan. Sempurna untuk pengiriman email dan arsip.
            </p>
          </div>
        </div>

        <div className="pb-16">
          <PDFCompressor />
        </div>

        <div className="bg-muted/30 py-16 border-t border-border">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center md:text-left">
              <h4 className="text-sm font-bold text-foreground mb-3 tracking-tight">
                Privasi Terjamin
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Dokumen Anda diproses secara aman. Kami menggunakan enkripsi
                tingkat tinggi dan menghapus file secara otomatis setelah proses selesai.
              </p>
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-sm font-bold text-foreground mb-3 tracking-tight">
                Kualitas Optimal
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Algoritma kami secara cerdas mengidentifikasi elemen yang dapat
                dioptimalkan tanpa mengurangi kualitas visual teks dan gambar penting.
              </p>
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-sm font-bold text-foreground mb-3 tracking-tight">
                Multi-Platform
              </h4>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Gunakan alat ini di perangkat apa pun. Baik desktop, tablet,
                maupun ponsel pintar, proses kompresi tetap lancar dan cepat.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-card border-t border-border p-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[9px] font-medium text-muted-foreground tracking-wide">
            SOP Builder PDF Utility &copy; 2024
          </p>
          <div className="flex gap-5">
            <Link
              href="/tools"
              className="text-[9px] font-medium text-primary tracking-wide hover:underline"
            >
              Semua Alat
            </Link>
            <Link
              href="/"
              className="text-[9px] font-medium text-muted-foreground tracking-wide hover:text-foreground transition-colors"
            >
              Kembali ke Builder
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
