import { useEffect, useState, useRef } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { checkRbacAccess } from "@/app/auth-actions";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isVerifying = useRef(false);
  const router = useRouter();

  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && typeof window !== "undefined") {
        const isRemembered = localStorage.getItem("remember_me") === "true";
        const hasActiveSession = document.cookie.includes("active_session=true");

        if (!isRemembered && !hasActiveSession) {
          // User closed browser without 'Remember Me', log them out
          supabase.auth.signOut();
          setUser(null);
          setLoading(false);
          return;
        }
      }

      if (!isVerifying.current) {
        setUser(session?.user ?? null);
      }
      setLoading(false);

      // Membersihkan hash URL (access_token dll) jika ada menggunakan Router bawaan
      if (session && typeof window !== "undefined" && window.location.hash) {
        router.replace(window.location.pathname);
      }
    });

    // 2. Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isVerifying.current) {
        setUser(session?.user ?? null);
      }
      setLoading(false);

      if (event === "SIGNED_IN" && typeof window !== "undefined" && window.location.hash) {
        router.replace(window.location.pathname);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const signInWithEmail = async (
    email: string,
    password: string,
    rememberMe: boolean = false,
    onSuccessCb?: () => Promise<void>
  ) => {
    isVerifying.current = true;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error || !data.user) {
      isVerifying.current = false;
      console.error("Login error:", error?.message);
      return { success: false, error: error?.message || "Gagal login" };
    }

    // Check RBAC via server action
    const rbacRes = await checkRbacAccess(data.user.email!);
    if (!rbacRes.success) {
      await supabase.auth.signOut();
      isVerifying.current = false;
      return { success: false, error: rbacRes.error };
    }

    isVerifying.current = false;

    // Set remember me storage preferences
    if (typeof window !== "undefined") {
      if (rememberMe) {
        localStorage.setItem("remember_me", "true");
      } else {
        localStorage.setItem("remember_me", "false");
        document.cookie = "active_session=true; path=/"; // Session cookie (cleared when browser closes)
      }
    }

    if (onSuccessCb) {
      await onSuccessCb();
    }

    // Set user now that verification passed
    setUser(data.user);
    return { success: true };
  };

  const signOut = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("remember_me");
      document.cookie = "active_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
    await supabase.auth.signOut();
  };

  return { user, loading, signInWithEmail, signOut };
}
