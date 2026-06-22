import React, { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Turnstile } from "@marsidev/react-turnstile";

interface WelcomeScreenProps {
  onLogin: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
}

export function WelcomeScreen({ onLogin, isLoading }: WelcomeScreenProps) {
  const [email, setEmail] = useState("baritoutara@kemenag.go.id");
  const [password, setPassword] = useState("@Kemenag_126");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  // Turnstile dummy state to simulate verification
  const [turnstilePassed, setTurnstilePassed] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    
    if (!turnstilePassed) {
      setErrorMsg("Harap selesaikan verifikasi captcha.");
      return;
    }

    setIsLoggingIn(true);
    const res = await onLogin(email, password);
    if (!res?.success) {
      setErrorMsg(res?.error || "Gagal login. Periksa email dan password Anda.");
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#f8fafc] via-[#e6fcf5] to-[#f8fafc] font-sans">
      <div className="relative z-10 w-full max-w-[440px] px-4 sm:px-0">
        {/* Header text outside the card */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(5,150,105,0.15)] ring-1 ring-emerald-50 mx-auto mb-6 relative flex items-center justify-center p-3">
            <Image
              src="/kemenag-512.png"
              alt="Logo Kemenag"
              width={512}
              height={512}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[10px] min-[400px]:text-[11px] sm:text-xs font-bold tracking-widest sm:tracking-[0.2em] text-emerald-600 uppercase text-center leading-tight">
              Kementerian Agama Kabupaten Barito Utara
            </p>
          </div>
          <h1 className="mt-2 sm:mt-3 text-2xl sm:text-[32px] leading-none font-black text-slate-800 tracking-tight">
            E-SOP DIGITAL
          </h1>
          <div className="mt-1 sm:mt-3 space-y-1.5 px-0 sm:px-4">
            <p className="text-[11px] min-[400px]:text-xs sm:text-sm font-medium text-slate-700 leading-tight">
              Sistem Penyusunan Standar Operasional Prosedur Digital.
            </p>
          </div>
        </div>

        <div className="rounded-[2.5rem] bg-white/80 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] ring-1 ring-slate-100/50 p-8 sm:p-10 border border-white animate-in fade-in zoom-in duration-700">
          <form onSubmit={handleLogin} className="space-y-6">
            {errorMsg && (
              <div className="px-4 py-3 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-2xl text-center">
                {errorMsg}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                Email Admin
              </label>
              <div className="relative flex items-center h-14 bg-[#f0f4ff] rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:bg-white border border-transparent focus-within:border-emerald-200 transition-all">
                <div className="pl-4 pr-3 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-full pr-4 bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                  placeholder="admin@kemenag.go.id"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                Password
              </label>
              <div className="relative flex items-center h-14 bg-[#f0f4ff] rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:bg-white border border-transparent focus-within:border-emerald-200 transition-all">
                <div className="pl-4 pr-3 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/></svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-full pr-12 bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 tracking-wider"
                  placeholder="••••••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-slate-400 hover:text-emerald-600 transition-colors outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 py-1">
              <button
                type="button"
                role="switch"
                aria-checked={rememberMe}
                onClick={() => setRememberMe(!rememberMe)}
                className={cn(
                  "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
                  rememberMe ? "bg-emerald-600" : "bg-slate-200"
                )}
              >
                <span className="sr-only">Ingat Saya</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                    rememberMe ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </button>
              <span 
                className="text-[11px] font-bold tracking-wider text-slate-600 uppercase cursor-pointer select-none"
                onClick={() => setRememberMe(!rememberMe)}
              >
                Ingat Saya
              </span>
            </div>

            {/* Cloudflare Turnstile */}
            <div className="flex w-full items-center justify-center py-2">
              <Turnstile
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
                onSuccess={() => setTurnstilePassed(true)}
                onError={() => setTurnstilePassed(false)}
                onExpire={() => setTurnstilePassed(false)}
                options={{
                  theme: "light",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || isLoggingIn}
              className="group relative inline-flex h-14 w-full items-center justify-center overflow-hidden rounded-2xl bg-emerald-600 px-8 text-sm font-bold tracking-wider text-white uppercase shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-600/30 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-70"
            >
              <span className="relative flex items-center gap-2">
                {(isLoading || isLoggingIn) && (
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                )}
                {isLoading || isLoggingIn ? "Memproses..." : "Masuk Ke Dashboard"}
                {!(isLoading || isLoggingIn) && (
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                )}
              </span>
            </button>
          </form>
        </div>
      </div>

      <div className="absolute bottom-6 sm:bottom-10 text-[9px] sm:text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase text-center w-full px-4">
        © 2026 E-SOP DIGITAL KEMENAG BARITO UTARA
      </div>
    </div>
  );
}
