import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Turnstile } from "@marsidev/react-turnstile";
import { DewBackground } from "./DewBackground";
import { trackLogin } from "@/lib/analytics";
import { getEnv } from "@/lib/env";

interface WelcomeScreenProps {
  onLogin: (
    email: string,
    pass: string,
    remember: boolean,
    turnstileToken?: string,
    onSuccessCb?: () => Promise<void>
  ) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
}

export function WelcomeScreen({ onLogin, isLoading }: WelcomeScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [turnstilePassed, setTurnstilePassed] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [siteKey, setSiteKey] = useState<string>("");

  useEffect(() => {
    try {
      const isLocal =
        typeof window !== "undefined" &&
        (window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1" ||
          window.location.hostname.startsWith("192.168."));

      const envKey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || "";
      setSiteKey(envKey);

      // Ambil preferensi "Ingat Saya" dan email yang tersimpan
      const isRemembered = localStorage.getItem("remember_me") === "true";
      const savedEmail = localStorage.getItem("saved_email");
      if (isRemembered) {
        setRememberMe(true);
        if (savedEmail) {
          setEmail(savedEmail);
        }
      }
    } catch {}
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!turnstilePassed) {
      setErrorMsg("Harap selesaikan verifikasi captcha Cloudflare terlebih dahulu.");
      return;
    }

    setIsLoggingIn(true);
    const res = await onLogin(email, password, rememberMe, turnstileToken, async () => {
      trackLogin("admin", email);
      setShowSuccessAlert(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
    });

    if (!res?.success) {
      setErrorMsg(res?.error || "Gagal login. Periksa kembali email dan kata sandi Anda.");
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#F8FAFC] font-sans overflow-hidden select-none p-4 sm:p-6">
      <DewBackground />

      <AnimatePresence>
        {showSuccessAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50"
          >
            <div className="flex items-center gap-3.5 bg-white border border-slate-200 px-5 py-4 rounded-xl shadow-lg">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-200">
                <CheckCircle2 className="w-5 h-5 text-[#015C3A]" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Login Berhasil!</p>
                <p className="text-xs font-medium text-slate-500">
                  Mengalihkan ke dashboard SOP Builder...
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-[420px] flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-6 text-center flex flex-col items-center"
        >
          <div className="w-20 h-20 bg-white rounded-2xl p-3 flex items-center justify-center shadow-sm border border-slate-200 mb-4">
            <img
              src="/sop.png"
              alt="Logo SOP"
              className="w-full h-full object-contain"
            />
          </div>

          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            E-SOP DIGITAL
          </h1>
          <p className="text-xs font-bold tracking-widest text-[#015C3A] uppercase mt-1">
            Kemenag Barito Utara
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="w-full rounded-2xl bg-white border border-slate-200 p-8 sm:p-9 shadow-sm relative overflow-hidden"
        >
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              Selamat Datang
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Silakan masuk dengan akun Administrator Anda
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-xl text-center leading-relaxed"
                >
                  {errorMsg}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-[11px] font-bold text-slate-600 uppercase tracking-wider ml-0.5 cursor-pointer">
                Email Admin
              </label>
              <div className="relative flex items-center h-11 bg-white rounded-xl border border-slate-200 focus-within:border-[#015C3A] focus-within:ring-1 focus-within:ring-[#015C3A] transition-all duration-200">
                <div className="pl-3.5 pr-2.5 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-full pr-4 bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                  placeholder="nama@kemenag.go.id"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-[11px] font-bold text-slate-600 uppercase tracking-wider ml-0.5 cursor-pointer">
                Kata Sandi
              </label>
              <div className="relative flex items-center h-11 bg-white rounded-xl border border-slate-200 focus-within:border-[#015C3A] focus-within:ring-1 focus-within:ring-[#015C3A] transition-all duration-200">
                <div className="pl-3.5 pr-2.5 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z" />
                    <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-full pr-12 bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 tracking-wider"
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-[#015C3A] transition-colors outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  role="switch"
                  aria-checked={rememberMe}
                  onClick={() => setRememberMe(!rememberMe)}
                  className={cn(
                    "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#015C3A]",
                    rememberMe ? "bg-[#015C3A]" : "bg-slate-200"
                  )}
                >
                  <span className="sr-only">Ingat Saya</span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                      rememberMe ? "translate-x-4" : "translate-x-0"
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
              <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Sesi Aman</span>
              </span>
            </div>

            {siteKey && (
              <div className="flex w-full items-center justify-center py-1">
                <Turnstile
                  siteKey={siteKey}
                  onSuccess={(token: string) => {
                    setTurnstileToken(token);
                    setTurnstilePassed(true);
                  }}
                  onError={() => {
                    setTurnstilePassed(false);
                    setTurnstileToken("");
                  }}
                  onExpire={() => {
                    setTurnstilePassed(false);
                    setTurnstileToken("");
                  }}
                  options={{ theme: "light" }}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || isLoggingIn}
              className="group relative inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#015C3A] hover:bg-[#014a2e] px-8 text-xs font-bold tracking-wider text-white uppercase transition-all focus:outline-none focus:ring-2 focus:ring-[#015C3A] focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 cursor-pointer shadow-sm"
            >
              <span className="relative flex items-center gap-2">
                {isLoading || isLoggingIn ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk Ke Dashboard</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>
        </motion.div>

        <p className="mt-8 text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase text-center">
          &copy; 2026 E-SOP DIGITAL KEMENAG BARITO UTARA
        </p>
      </div>
    </div>
  );
}