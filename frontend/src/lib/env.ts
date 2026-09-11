/**
 * Utility to safely get environment variables across SSR (Node.js runtime)
 * and Client-side (injected window.__ENV__ or Vite import.meta.env).
 */

export interface ClientEnvConfig {
  PUBLIC_SITE_URL?: string;
  PUBLIC_API_URL?: string;
  PUBLIC_SUPABASE_URL?: string;
  PUBLIC_SUPABASE_ANON_KEY?: string;
  PUBLIC_TURNSTILE_SITE_KEY?: string;
  PUBLIC_PUSDATIN_URL?: string;
  PUBLIC_CF_BEACON_TOKEN?: string;
  [key: string]: string | undefined;
}

declare global {
  interface Window {
    __ENV__?: ClientEnvConfig;
  }
}

export function getEnv(key: string, defaultValue = ""): string {
  // 1. Client-side browser: Check runtime injected window.__ENV__
  if (typeof window !== "undefined" && window.__ENV__ && window.__ENV__[key]) {
    const val = window.__ENV__[key];
    if (val && typeof val === "string" && val.trim() !== "") {
      return val.trim();
    }
  }

  // 2. SSR / Node.js runtime process.env (injected by Infisical / Docker)
  try {
    if (typeof process !== "undefined" && process.env?.[key]) {
      const val = process.env[key];
      if (val && typeof val === "string" && val.trim() !== "") {
        return val.trim();
      }
    }
  } catch {}

  // 3. Vite build-time / define inlined environment variables
  try {
    if (typeof import.meta !== "undefined" && (import.meta as any).env?.[key]) {
      const val = (import.meta as any).env[key];
      if (val && typeof val === "string" && val.trim() !== "") {
        return val.trim();
      }
    }
  } catch {}

  return defaultValue;
}
