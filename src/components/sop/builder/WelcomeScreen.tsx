import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LogIn, ShieldCheck } from "lucide-react";

interface WelcomeScreenProps {
  onLogin: () => void;
  isLoading: boolean;
}

export function WelcomeScreen({ onLogin, isLoading }: WelcomeScreenProps) {
  return (
    <div className="h-screen w-full bg-gradient-to-br from-emerald-100 via-white to-emerald-200 dark:from-emerald-950 dark:via-slate-900 dark:to-emerald-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-400" />
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-emerald-200/60 dark:bg-emerald-800/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-emerald-100/60 dark:bg-emerald-900/20 rounded-full blur-3xl" />

      <div className="max-w-sm w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-emerald-200/50 dark:shadow-emerald-900/30 border border-emerald-100 dark:border-emerald-800/50 overflow-hidden p-8 md:p-10 text-center relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="w-20 h-20 mx-auto mb-6">
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute inset-0 bg-emerald-100 dark:bg-emerald-900/40 rounded-full blur-xl" />
            <Image
              src="/kemenag-512.png"
              alt="Logo Kemenag"
              width={512}
              height={512}
              className="w-full h-full object-contain drop-shadow-sm relative"
              priority
            />
          </div>
        </div>

        <div className="space-y-1.5 mb-6">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
            SOP <span className="text-emerald-600 dark:text-emerald-400">Builder</span>
          </h1>
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-8 bg-emerald-200 dark:bg-emerald-700" />
            <p className="text-emerald-600 dark:text-emerald-400 font-semibold tracking-wider text-[10px] uppercase">
              Kemenag Barito Utara
            </p>
            <div className="h-px w-8 bg-emerald-200 dark:bg-emerald-700" />
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
          Portal pembuatan Standar Operasional Prosedur (SOP) Digital resmi.
          Masuk untuk mengelola dokumen Anda secara profesional.
        </p>

        <Button
          onClick={onLogin}
          disabled={isLoading}
          className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30"
        >
          <LogIn className="w-4 h-4" />
          Masuk dengan Google
        </Button>

        <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-emerald-100 dark:border-emerald-800/50">
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          <p className="text-[9px] text-emerald-600/70 dark:text-emerald-400/70 font-medium tracking-wider uppercase">
            @2026 Kemenag Barito Utara
          </p>
        </div>
      </div>
    </div>
  );
}
