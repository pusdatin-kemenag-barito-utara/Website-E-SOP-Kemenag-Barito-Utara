# E-SOP Digital — Kemenag Barito Utara

Aplikasi pembuat **Standar Operasional Prosedur (SOP)** untuk Kantor Kementerian Agama Barito Utara. Bisa membuat, mengedit, live-preview, ekspor PDF, dan mengelola SOP secara kolaboratif (real-time presence via PocketBase SSE).

## Arsitektur (Monorepo)

Proyek ini adalah monorepo dengan dua service terpisah:

| Service | Teknologi | Direktori |
|---|---|---|
| **Frontend** | Astro 7 + React (islands) + Tailwind v4 + PocketBase JS | `frontend/` |
| **Backend (API)** | Go Fiber V3 + PocketBase Client | `backend/` |

- **Database & Autentikasi**: PocketBase (`db-sop.kemenag-baritoutara.com`) dengan manajemen sesi auth, SSE realtime channel, dan koleksi `sops` serta `users`.
- **RBAC**: dicek lewat Go API (`POST /api/auth/check-rbac`) terhadap koleksi `users` di PocketBase + Cloudflare Turnstile anti-bot.
- **Admin user**: `SUPER_ADMIN_EMAIL` (default `baritoutara@kemenag.go.id`).

## Environment (Single `.env` di Root)

Semua konfigurasi aplikasi dipusatkan di **satu file `.env` di root repo** atau diinjeksi via **Infisical CLI**:

```bash
PUBLIC_POCKETBASE_URL="https://db-sop.kemenag-baritoutara.com"
POCKETBASE_URL="https://db-sop.kemenag-baritoutara.com"
POCKETBASE_ADMIN_EMAIL="baritoutara@kemenag.go.id"
SUPER_ADMIN_EMAIL="baritoutara@kemenag.go.id"
PUBLIC_API_URL="http://localhost:8080"
```

> `.env` tidak perlu dicommit (ter-ignore oleh `.gitignore`).

## Menjalankan (Development)

Jalankan kedua service secara serentak dari root repo:

```bash
npm run dev
```

Atau secara mandiri:

### Frontend
```bash
npm --prefix frontend run dev   # http://localhost:3000
```

### Backend
```bash
npm --prefix backend run dev    # http://localhost:8080
```

## Menjalankan (Docker)

```bash
docker compose up --build
```
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`

## Struktur Direktori

```
├── frontend/            # Astro 7 + React frontend
│   ├── src/
│   │   ├── components/  # React islands (SOP builder/editor/preview, ui, tools)
│   │   ├── hooks/       # useAuth, useSOPData, useSOPPresence, dll.
│   │   ├── layouts/     # Layout.astro
│   │   ├── lib/         # pocketbase, constants, schemas, utils, pdf-service
│   │   ├── pages/       # index, maintenance, tools, robots, sitemap
│   │   ├── styles/      # global.css (Tailwind v4)
│   │   └── types/       # sop.ts, d.ts
│   └── public/          # aset statis (sop.png, kemenag.svg, favicon, manifest)
├── backend/             # Go Fiber V3 API
│   ├── config/          # env loader
│   ├── pocketbase/      # PocketBase client & token verifier
│   ├── handlers/        # health, auth, admin, maintenance, user-role, sop
│   ├── middleware/      # auth, rbac, cors, ratelimit, security
│   ├── models/          # struct data
│   └── routes/          # registrasi route Fiber
└── .env                 # konfigurasi lokal / fallback Infisical
```
