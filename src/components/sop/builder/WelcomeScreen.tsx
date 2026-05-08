import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

interface WelcomeScreenProps {
  onLogin: () => void;
  isLoading: boolean;
}

export function WelcomeScreen({ onLogin, isLoading }: WelcomeScreenProps) {
  return (
    <div className="h-screen w-full bg-[#F8FAFC] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-50" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-50 rounded-full blur-3xl opacity-50" />

      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden p-8 md:p-12 text-center relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="w-24 h-24 mx-auto mb-8 relative group">
          <div className="absolute inset-0 bg-emerald-100 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative w-full h-full flex items-center justify-center p-2">
            <Image
              src="/kemenag-512.png"
              alt="Logo Kemenag"
              width={512}
              height={512}
              className="w-full h-full object-contain drop-shadow-md"
              priority
            />
          </div>
        </div>

        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            SOP <span className="text-emerald-600">Builder</span>
          </h1>
          <div className="flex items-center justify-center gap-2">
            <div className="h-[1px] w-4 bg-emerald-200" />
            <p className="text-emerald-600 font-black tracking-[0.2em] text-[10px] uppercase">
              Kemenag Barito Utara
            </p>
            <div className="h-[1px] w-4 bg-emerald-200" />
          </div>
        </div>

        <p className="text-slate-500 text-sm leading-relaxed font-medium mb-10 px-4">
          Portal pembuatan Standar Operasional Prosedur (SOP) Digital resmi.
          Masuk untuk mengelola dokumen Anda secara profesional.
        </p>

        <Button
          onClick={onLogin}
          disabled={isLoading}
          className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-slate-200 group"
        >
          <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          MASUK DENGAN GOOGLE
        </Button>

        <div className="mt-12 pt-8 border-t border-slate-50">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-none">
            © 2026 KEMENAG BARITO UTARA
          </p>
        </div>
      </div>
    </div>
  );
}
