"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, Wrench, Sun, Moon, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface UserMenuProps {
  user: SupabaseUser;
  onLogout: () => void;
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleDark = () => {
    const html = document.documentElement;
    html.classList.toggle("dark");
    const nowDark = html.classList.contains("dark");
    setIsDark(nowDark);
    try { localStorage.setItem("theme", nowDark ? "dark" : "light"); } catch {}
  };

  const displayName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "User";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-7 h-7 rounded-full bg-muted flex items-center justify-center overflow-hidden border border-border hover:ring-2 hover:ring-emerald-400/50 transition-all duration-200 flex-shrink-0"
        aria-label="Menu Pengguna"
      >
        {user.user_metadata?.avatar_url ? (
          <Image
            src={user.user_metadata.avatar_url}
            alt=""
            width={28}
            height={28}
            className="object-cover w-full h-full"
            unoptimized
          />
        ) : (
          <User className="w-3.5 h-3.5 text-muted-foreground" />
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className={cn(
              "absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 border border-border dark:border-slate-700 rounded-xl shadow-xl shadow-black/10 overflow-hidden z-50",
              "animate-in fade-in slide-in-from-top-2 duration-200",
            )}
          >
            <div className="px-3 py-3 flex items-center gap-3 border-b border-border bg-white dark:bg-slate-800">
              <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                {user.user_metadata?.avatar_url ? (
                  <Image
                    src={user.user_metadata.avatar_url}
                    alt=""
                    width={36}
                    height={36}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                ) : (
                  <User className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {displayName}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>

            <Link
              href="/tools"
              className="flex items-center gap-3 px-3 py-2 text-sm text-foreground bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all duration-150"
              onClick={() => setOpen(false)}
            >
              <Wrench className="w-4 h-4 text-muted-foreground" />
              PDF Utility Platform
            </Link>

            <button
              onClick={toggleDark}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all duration-150"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Moon className="w-4 h-4 text-muted-foreground" />
              )}
              {isDark ? "Mode Terang" : "Mode Gelap"}
            </button>

            <button
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/50 transition-all duration-150 border-t border-border"
            >
              <LogOut className="w-4 h-4" />
              Keluar
            </button>
          </div>
        </>
      )}
    </div>
  );
}
