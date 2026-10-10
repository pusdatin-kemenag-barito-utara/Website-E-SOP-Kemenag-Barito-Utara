import { useEffect, useState, useRef } from "react";
import type { RecordModel } from "pocketbase";
import { pb } from "@/lib/pocketbase";
import { getEnv } from "@/lib/env";

export interface User extends RecordModel {
  id: string;
  email: string;
  name?: string;
  nama?: string;
  role?: string;
  bidang?: string;
  is_active?: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isVerifying = useRef(false);

  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    try {
      if (pb.authStore.isValid && pb.authStore.record) {
        if (typeof window !== "undefined") {
          const isRemembered = localStorage.getItem("remember_me") === "true";
          const hasActiveSession = document.cookie.includes("active_session=true");
          if (!isRemembered && !hasActiveSession) {
            pb.authStore.clear();
            setUser(null);
            setLoading(false);
            return;
          }
        }
        if (!isVerifying.current) setUser(pb.authStore.record as unknown as User);
        setLoading(false);
        if (typeof window !== "undefined" && window.location.hash) {
          window.history.replaceState(null, "", window.location.pathname);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    } catch (err) {
      console.error("Auth session error:", err);
      setLoading(false);
    }

    // Background token & profile refresh mechanism
    const refreshSession = async () => {
      if (!pb.authStore.isValid || !pb.authStore.token || isVerifying.current) return;
      try {
        await pb.collection("users").authRefresh();
      } catch (err: any) {
        // If token explicitly revoked or user disabled/deleted (401 / 403), log out safely
        if (err?.status === 401 || err?.status === 403) {
          console.warn("[Auth] Session expired or invalid, logging out:", err?.message);
          pb.authStore.clear();
          setUser(null);
        } else {
          // Network hiccup or temporary server glitch - do NOT kick out active user
          console.warn("[Auth] Background refresh skipped due to network glitch:", err?.message);
        }
      }
    };

    // Trigger initial silent refresh if session is valid
    if (pb.authStore.isValid && pb.authStore.token) {
      refreshSession();
    }

    // Refresh token periodically every 30 minutes
    const refreshInterval = setInterval(refreshSession, 30 * 60 * 1000);

    // Refresh token when tab becomes visible after background idle (throttled to 5 minutes)
    let lastVisibilityRefresh = Date.now();
    const handleVisibilityChange = () => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        const now = Date.now();
        if (now - lastVisibilityRefresh > 5 * 60 * 1000) {
          lastVisibilityRefresh = now;
          refreshSession();
        }
      }
    };
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    const unsubscribe = pb.authStore.onChange((token, model) => {
      if (!isVerifying.current) {
        setUser(model ? (model as unknown as User) : null);
      }
      setLoading(false);
      if (model && typeof window !== "undefined" && window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname);
      }
    });

    return () => {
      clearTimeout(safetyTimer);
      clearInterval(refreshInterval);
      if (typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      }
      unsubscribe();
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

    // 1. Otentikasi PocketBase
    try {
      const authData = await pb.collection("users").authWithPassword(cleanEmail, password);
      if (!authData || !authData.record) {
        isVerifying.current = false;
        return { success: false, error: "Akun yang Anda masukkan salah. Silakan periksa kembali." };
      }

      // 2. Verifikasi RBAC & Cloudflare Turnstile di Backend Go Fiber
      try {
        const apiUrl = getEnv("PUBLIC_API_URL", "");
        const rbacRes = await fetch(`${apiUrl}/api/auth/check-rbac`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authData.token}`,
          },
          body: JSON.stringify({
            email: authData.record.email || cleanEmail,
            turnstile_token: turnstileToken || "",
          }),
        });
        const rbacData = await rbacRes.json().catch(() => ({}));
        if (!rbacData.success) {
          pb.authStore.clear();
          isVerifying.current = false;
          return {
            success: false,
            error: rbacData.error || "Akun Anda tidak memiliki akses ke aplikasi E-SOP Digital.",
          };
        }
      } catch {
        pb.authStore.clear();
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
      setUser(authData.record as unknown as User);
      return { success: true };
    } catch (error: any) {
      isVerifying.current = false;
      pb.authStore.clear();
      console.error("Login error:", error?.message || error);
      const msg = (error?.message || "").toLowerCase();
      if (msg.includes("rate limit") || msg.includes("too many requests")) {
        return { success: false, error: "Terlalu banyak percobaan masuk. Silakan tunggu beberapa saat lagi." };
      }
      return { success: false, error: "Akun yang Anda masukkan salah. Silakan periksa kembali." };
    }
  };

  const signOut = async () => {
    if (typeof window !== "undefined") {
      document.cookie = "active_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax";
      // Biarkan saved_email tetap ada jika remember_me aktif untuk memudahkan login berikutnya
      if (localStorage.getItem("remember_me") !== "true") {
        localStorage.removeItem("saved_email");
      }
    }
    pb.authStore.clear();
    setUser(null);
  };

  return { user, loading, signInWithEmail, signOut };
}