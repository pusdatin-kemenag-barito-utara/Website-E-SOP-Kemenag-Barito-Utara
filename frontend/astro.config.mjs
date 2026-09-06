import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node";
import { loadEnv } from "vite";

// Load .env from root monorepo directory
const rootEnv = loadEnv(process.env.NODE_ENV || "development", "../", "");
Object.assign(process.env, rootEnv);

export default defineConfig({
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  site: process.env.PUBLIC_SITE_URL || "https://sop.kemenag-baritoutara.com",
  server: {
    port: 3000,
  },
  vite: {
    envDir: "../",
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "@tanstack/react-query",
        "lucide-react",
        "date-fns",
        "@supabase/supabase-js",
        "framer-motion",
        "@marsidev/react-turnstile",
        "clsx",
        "tailwind-merge",
        "zod",
      ],
    },
  },
  integrations: [react()],
});