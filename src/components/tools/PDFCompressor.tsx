"use client";

import React, { useState, useRef } from "react";
import { 
  FileUp, 
  FileText, 
  Zap, 
  CheckCircle2, 
  Download, 
  Trash2, 
  ChevronRight,
  Loader2,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { pdfService, CompressionLevel } from "@/lib/pdf/pdf-service";

export function PDFCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('medium');
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setCompressedBlob(null);
      setError(null);
      const info = await pdfService.getPdfInfo(selectedFile);
      setOriginalSize(info.size);
    } else if (selectedFile) {
      setError("Silakan pilih file PDF yang valid.");
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const selectedFile = e.dataTransfer.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setCompressedBlob(null);
      setError(null);
      const info = await pdfService.getPdfInfo(selectedFile);
      setOriginalSize(info.size);
    }
  };

  const handleCompress = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    try {
      const resultBlob = await pdfService.compressPdf(file, compressionLevel);
      setCompressedBlob(resultBlob);
      setCompressedSize(resultBlob.size);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Gagal mengompres PDF.";
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!compressedBlob) return;
    const url = URL.createObjectURL(compressedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed_${file?.name || 'document.pdf'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const savings = pdfService.calculateSavings(originalSize, compressedSize);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-10">
      {!file ? (
        <div 
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-teal-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000" />
          <div className="relative bg-card border-2 border-dashed border-border rounded-xl p-10 flex flex-col items-center justify-center text-center transition-all hover:border-primary/50 group-hover:shadow-lg">
            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500">
              <FileUp className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1">Kompres file PDF</h2>
            <p className="text-muted-foreground text-xs font-medium mb-6">
              Kurangi ukuran file dengan tetap menjaga kualitas maksimal.
            </p>
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 rounded-lg shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:scale-95 text-sm"
            >
              Pilih File PDF
            </button>
            <p className="mt-4 text-muted-foreground/60 text-[9px] font-medium tracking-wide">
              Atau jatuhkan file di sini
            </p>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".pdf" 
              className="hidden" 
            />
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 bg-red-50 dark:bg-red-950 rounded-lg flex items-center justify-center text-red-500 shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-foreground truncate">{file.name}</h3>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">
                {pdfService.formatSize(originalSize)}
              </p>
            </div>
            <button 
              onClick={() => {
                setFile(null);
                setCompressedBlob(null);
              }}
              className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-all"
              aria-label="Hapus file"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {!compressedBlob ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { id: 'high', name: 'Ekstrim', desc: 'Kompresi Tinggi', icon: <Zap /> },
                  { id: 'medium', name: 'Rekomendasi', desc: 'Kompresi Seimbang', icon: <CheckCircle2 /> },
                  { id: 'low', name: 'Rendah', desc: 'Kualitas Tinggi', icon: <FileText /> },
                ].map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setCompressionLevel(level.id as CompressionLevel)}
                    className={cn(
                      "flex flex-col items-center p-5 rounded-xl border-2 transition-all text-center",
                      compressionLevel === level.id 
                        ? "border-primary bg-primary/5 ring-2 ring-primary/10" 
                        : "border-border bg-card hover:border-muted-foreground/30"
                    )}
                  >
                    <div className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center mb-3 transition-colors",
                      compressionLevel === level.id ? "text-primary" : "text-muted-foreground"
                    )}>
                      {level.icon}
                    </div>
                    <span className={cn(
                      "text-xs font-semibold mb-0.5",
                      compressionLevel === level.id ? "text-foreground" : "text-foreground"
                    )}>
                      {level.name}
                    </span>
                    <span className="text-[9px] text-muted-foreground font-medium leading-tight">
                      {level.desc}
                    </span>
                  </button>
                ))}
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-lg flex items-center gap-2.5 animate-in shake duration-500">
                  <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
                  <p className="text-xs font-medium text-destructive">{error}</p>
                </div>
              )}

              <button
                onClick={handleCompress}
                disabled={isProcessing}
                className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted text-primary-foreground disabled:text-muted-foreground font-semibold py-3.5 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2.5 text-sm"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Mulai Kompresi"
                )}
              </button>
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-primary/20 p-8 text-center shadow-lg shadow-primary/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-teal-400" />
              
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>

              <h3 className="text-xl font-bold text-foreground mb-1">PDF Berhasil Dikompres!</h3>
              <p className="text-muted-foreground text-xs font-medium mb-8">
                Optimasi dokumen selesai dengan aman.
              </p>

              <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mb-8">
                <div className="text-center">
                  <p className="text-[9px] font-medium text-muted-foreground tracking-wide mb-1">Sebelum</p>
                  <p className="text-lg font-bold text-foreground">{pdfService.formatSize(originalSize)}</p>
                </div>
                <div className="hidden md:block text-muted-foreground/30">
                  <ChevronRight className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="text-[9px] font-medium text-muted-foreground tracking-wide mb-1">Sesudah</p>
                  <p className="text-xl font-bold text-primary">
                    {pdfService.formatSize(compressedSize)}
                  </p>
                </div>
              </div>

              <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-semibold mb-8">
                Hemat {savings}% Ruang Penyimpanan!
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3.5 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2.5 text-sm"
                >
                  <Download className="w-4 h-4" />
                  Unduh Sekarang
                </button>
                <button
                  onClick={() => {
                    setFile(null);
                    setCompressedBlob(null);
                  }}
                  className="flex-1 bg-foreground hover:bg-foreground/90 text-background font-semibold py-3.5 rounded-lg shadow-lg transition-all text-sm"
                >
                  Kompres File Lain
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
