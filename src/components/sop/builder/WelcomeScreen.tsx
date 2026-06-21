import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
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
    <div className="h-screen w-full bg-[#f4fcf9] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Header text outside the card */}
      <div className="text-center mb-8 z-10">
        <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-slate-100 mx-auto mb-4 relative flex items-center justify-center p-3">
          <Image
            src="/kemenag-512.png"
            alt="Logo Kemenag"
            width={512}
            height={512}
            className="w-full h-full object-contain"
            priority
          />
        </div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <p className="text-emerald-500 font-bold tracking-widest text-xs uppercase">
            PORTAL INTERNAL
          </p>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-2">
          E-SOP DIGITAL
        </h1>
        <p className="text-slate-500 font-medium text-sm tracking-wide uppercase">
          Kementerian Agama Kabupaten Barito Utara
        </p>
      </div>

      <div className="max-w-[400px] w-full bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-emerald-50 p-8 sm:p-10 relative z-10 animate-in fade-in zoom-in duration-700">
        <form onSubmit={handleLogin} className="space-y-6">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl text-center border border-red-100">
              {errorMsg}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
              EMAIL ADMIN
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 bg-[#eef2f6] border border-transparent focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-11 text-sm font-medium text-slate-700 transition-all outline-none"
                placeholder="Masukkan email"
                required
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">
              PASSWORD
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 bg-[#eef2f6] border border-transparent focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-11 pr-12 text-sm font-medium text-slate-700 transition-all outline-none"
                placeholder="Masukkan password"
                required
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/></svg>
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              role="switch"
              aria-checked={rememberMe}
              onClick={() => setRememberMe(!rememberMe)}
              className={cn(
                "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none",
                rememberMe ? "bg-emerald-500" : "bg-slate-200"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                  rememberMe ? "translate-x-2" : "-translate-x-2"
                )}
              />
            </button>
            <span className="text-xs font-semibold text-slate-500">INGAT SAYA</span>
          </div>

          {/* Cloudflare Turnstile */}
          <div className="mt-4 mb-6 flex justify-center">
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

          <Button
            type="submit"
            disabled={isLoading || isLoggingIn}
            className="w-full h-12 bg-[#059669] hover:bg-[#047857] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-emerald-500/20"
          >
            {isLoading || isLoggingIn ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                MASUK KE DASHBOARD <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </form>
      </div>

      <div className="absolute bottom-8 flex items-center justify-center gap-2">
        <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">
          © 2026 E-SOP KEMENAG BARITO UTARA
        </p>
      </div>
    </div>
  );
}
