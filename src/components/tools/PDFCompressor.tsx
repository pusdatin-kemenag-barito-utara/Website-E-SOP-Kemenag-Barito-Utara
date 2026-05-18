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
    <div className="w-full max-w-4xl mx-auto px-4 py-12">
      {!file ? (
        <div 
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
          <div className="relative bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center text-center transition-all hover:border-emerald-400 group-hover:shadow-2xl group-hover:shadow-emerald-100/50">
            <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <FileUp className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">Kompres file PDF</h2>
            <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mb-8">
              Kurangi ukuran file dengan tetap menjaga kualitas maksimal.
            </p>
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-10 py-4 rounded-xl shadow-xl shadow-emerald-200 transition-all hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-sm"
            >
              Pilih File PDF
            </button>
            <p className="mt-6 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* File Preview Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center gap-6 shadow-sm">
            <div className="w-16 h-16 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
              <FileText className="w-8 h-8" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-black text-slate-900 truncate uppercase tracking-tight">{file.name}</h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
                {pdfService.formatSize(originalSize)}
              </p>
            </div>
            <button 
              onClick={() => {
                setFile(null);
                setCompressedBlob(null);
              }}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          {!compressedBlob ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'high', name: 'Ekstrim', desc: 'Kualitas Kurang, Kompresi Tinggi', icon: <Zap /> },
                  { id: 'medium', name: 'Rekomendasi', desc: 'Kualitas Bagus, Kompresi Bagus', icon: <CheckCircle2 /> },
                  { id: 'low', name: 'Rendah', desc: 'Kualitas Tinggi, Kompresi Rendah', icon: <FileText /> },
                ].map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setCompressionLevel(level.id as CompressionLevel)}
                    className={cn(
                      "flex flex-col items-center p-6 rounded-2xl border-2 transition-all text-center group",
                      compressionLevel === level.id 
                        ? "border-emerald-500 bg-emerald-50/50 ring-4 ring-emerald-500/10" 
                        : "border-slate-100 bg-white hover:border-slate-300"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors",
                      compressionLevel === level.id ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-600"
                    )}>
                      {level.icon}
                    </div>
                    <span className={cn(
                      "font-black text-sm uppercase tracking-tight mb-1",
                      compressionLevel === level.id ? "text-emerald-900" : "text-slate-900"
                    )}>
                      {level.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-tight">
                      {level.desc}
                    </span>
                  </button>
                ))}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-600 animate-in shake duration-500">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-xs font-black uppercase tracking-widest">{error}</p>
                </div>
              )}

              <button
                onClick={handleCompress}
                disabled={isProcessing}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white font-black py-5 rounded-2xl shadow-xl shadow-emerald-200 transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-sm"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Mulai Kompresi"
                )}
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-emerald-100 p-10 text-center shadow-xl shadow-emerald-50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-400" />
              
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">PDF Berhasil Dikompres!</h3>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] mb-10">
                Optimasi dokumen selesai dengan aman.
              </p>

              <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 mb-12">
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Sebelum</p>
                  <p className="text-xl font-black text-slate-900">{pdfService.formatSize(originalSize)}</p>
                </div>
                <div className="hidden md:block">
                  <ChevronRight className="w-8 h-8 text-slate-200" />
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Sesudah</p>
                  <p className="text-2xl font-black text-emerald-600 italic">
                    {pdfService.formatSize(compressedSize)}
                  </p>
                </div>
              </div>

              <div className="inline-block px-6 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest mb-10">
                Hemat {savings}% Ruang Penyimpanan!
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleDownload}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
                >
                  <Download className="w-5 h-5" />
                  Unduh Sekarang
                </button>
                <button
                  onClick={() => {
                    setFile(null);
                    setCompressedBlob(null);
                  }}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-xl shadow-lg shadow-slate-200 transition-all uppercase tracking-widest text-sm"
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
