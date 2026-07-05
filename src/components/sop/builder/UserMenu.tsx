"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Sun, Moon, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface UserMenuProps {
  user: SupabaseUser;
  onLogout: () => void;
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

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
    "Pengguna Kemenag";

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "w-9 h-9 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 transition-all duration-300 flex-shrink-0 shadow-sm",
          open ? "border-amber-400 shadow-amber-400/30 scale-105" : "border-emerald-100/20 hover:border-emerald-300 hover:shadow-md"
        )}
        aria-label="Menu Pengguna"
      >
        {user.user_metadata?.avatar_url ? (
          <Image
            src={user.user_metadata.avatar_url}
            alt={displayName}
            width={36}
            height={36}
            className="object-cover w-full h-full"
            unoptimized
          />
        ) : (
          <Image
            src="/kemenag-512.png"
            alt="Logo Kemenag"
            width={36}
            height={36}
            className="object-contain w-full h-full p-1"
            unoptimized
          />
        )}
      </button>

      {open && (
        <div
          className={cn(
            "absolute right-0 top-full mt-3 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50",
            "animate-in fade-in slide-in-from-top-4 duration-200 origin-top-right",
          )}
        >
          {/* Menu Header with Gradient Background */}
          <div className="relative px-4 py-4 overflow-hidden bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/50 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-11 h-11 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm border border-slate-200 dark:border-slate-700">
                {user.user_metadata?.avatar_url ? (
                  <Image
                    src={user.user_metadata.avatar_url}
                    alt={displayName}
                    width={44}
                    height={44}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                ) : (
                  <Image
                    src="/kemenag-512.png"
                    alt="Logo Kemenag"
                    width={44}
                    height={44}
                    className="object-contain w-full h-full p-1.5"
                    unoptimized
                  />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                  {displayName}
                </p>
                <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          <div className="p-2 space-y-1 bg-white dark:bg-slate-900">
            {/* Menu Items */}
            <button
              onClick={toggleDark}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {isDark ? (
                  <Sun className="w-4 h-4 text-emerald-500/70" />
                ) : (
                  <Moon className="w-4 h-4 text-emerald-500/70" />
                )}
                Tema Gelap
              </div>
              <div className="w-8 h-4 bg-slate-200 dark:bg-emerald-600 rounded-full relative transition-colors">
                <div className={cn(
                  "absolute top-0.5 w-3 h-3 rounded-full transition-all duration-200",
                  isDark ? "bg-white right-0.5" : "bg-white left-0.5 shadow-sm"
                )} />
              </div>
            </button>
          </div>

          {/* Logout Button */}
          <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
            <button
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Keluar Akun
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
