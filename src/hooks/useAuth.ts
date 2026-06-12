import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
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
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (event === "SIGNED_IN" && typeof window !== "undefined" && window.location.hash) {
        router.replace(window.location.pathname);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) console.error("Login error:", error.message);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, loading, signInWithGoogle, signOut };
}
