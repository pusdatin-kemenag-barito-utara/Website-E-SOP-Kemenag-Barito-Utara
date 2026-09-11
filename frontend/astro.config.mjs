import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node";
// Expose process.env variables (injected via Infisical CLI or container runtime) to Vite
const publicEnvDefines = {};
for (const [key, value] of Object.entries(process.env)) {
  if (key.startsWith("PUBLIC_")) {
    publicEnvDefines[`import.meta.env.${key}`] = JSON.stringify(value);
  }
}

export default defineConfig({
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  site: process.env.PUBLIC_SITE_URL || undefined,
  server: {
    port: 3000,
  },
  vite: {
    define: {
      ...publicEnvDefines,
    },
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