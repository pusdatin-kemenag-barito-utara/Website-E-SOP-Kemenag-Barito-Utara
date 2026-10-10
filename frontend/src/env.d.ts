/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_POCKETBASE_URL: string;
  readonly PUBLIC_SITE_URL: string;
  readonly PUBLIC_PUSDATIN_URL: string;
  readonly PUBLIC_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}