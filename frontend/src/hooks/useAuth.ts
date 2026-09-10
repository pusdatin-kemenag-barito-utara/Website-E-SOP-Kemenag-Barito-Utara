import { useEffect, useState, useRef } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { getEnv } from "@/lib/env";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isVerifying = useRef(false);

  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (session && typeof window !== "undefined") {
          const isRemembered = localStorage.getItem("remember_me") === "true";
          const hasActiveSession = document.cookie.includes("active_session=true");
          if (!isRemembered && !hasActiveSession) {
            supabase.auth.signOut();
            setUser(null);
            setLoading(false);
            return;
          }
        }
        if (!isVerifying.current) setUser(session?.user ?? null);
        setLoading(false);
        if (session && typeof window !== "undefined" && window.location.hash) {
          window.history.replaceState(null, "", window.location.pathname);
        }
      })
      .catch((err) => {
        console.error("Auth session error:", err);
        setLoading(false);
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isVerifying.current) setUser(session?.user ?? null);
      setLoading(false);
      if (event === "SIGNED_IN" && typeof window !== "undefined" && window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname);
      }
    });

    return () => {
      clearTimeout(safetyTimer);
      subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (
    email: string,
    password: string,
    rememberMe = false,
    turnstileToken?: string,
    onSuccessCb?: () => Promise<void>
  ) => {
    isVerifying.current = true;
    const cleanEmail = email.trim().toLowerCase();

    // 1. Otentikasi Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });
    if (error || !data.user) {
      isVerifying.current = false;
      console.error("Login error:", error?.message);
      const msg = (error?.message || "").toLowerCase();
      if (msg.includes("rate limit") || msg.includes("too many requests")) {
        return { success: false, error: "Terlalu banyak percobaan masuk. Silakan tunggu beberapa saat lagi." };
      }
      return { success: false, error: "Akun yang Anda masukkan salah. Silakan periksa kembali." };
    }

    // 2. Verifikasi RBAC & Cloudflare Turnstile di Backend Go Fiber
    try {
      const apiUrl = getEnv("PUBLIC_API_URL", "");
      const rbacRes = await fetch(`${apiUrl}/api/auth/check-rbac`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.user.email,
          turnstile_token: turnstileToken || "",
        }),
      });
      const rbacData = await rbacRes.json();
      if (!rbacData.success) {
        await supabase.auth.signOut();
        isVerifying.current = false;
        return {
          success: false,
          error: rbacData.error || "Akun Anda tidak memiliki akses ke aplikasi E-SOP Digital.",
        };
      }
    } catch {
      await supabase.auth.signOut();
      isVerifying.current = false;
      return { success: false, error: "Gagal memverifikasi izin akses ke server." };
    }

    isVerifying.current = false;
    if (typeof window !== "undefined") {
      if (rememberMe) {
        localStorage.setItem("remember_me", "true");
        localStorage.setItem("saved_email", cleanEmail);
        document.cookie = "active_session=true; max-age=2592000; path=/; SameSite=Lax";
      } else {
        localStorage.setItem("remember_me", "false");
        localStorage.removeItem("saved_email");
        document.cookie = "active_session=true; path=/; SameSite=Lax";
      }
    }
    if (onSuccessCb) await onSuccessCb();
    setUser(data.user);
    return { success: true };
  };

  const signOut = async () => {
    if (typeof window !== "undefined") {
      document.cookie = "active_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax";
      // Biarkan saved_email tetap ada jika remember_me aktif untuk memudahkan login berikutnya
      if (localStorage.getItem("remember_me") !== "true") {
        localStorage.removeItem("saved_email");
      }
    }
    await supabase.auth.signOut();
    setUser(null);
  };

  return { user, loading, signInWithEmail, signOut };
}