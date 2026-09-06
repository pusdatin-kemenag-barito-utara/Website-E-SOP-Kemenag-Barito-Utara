# E-SOP Digital — Kemenag Barito Utara

Aplikasi pembuat **Standar Operasional Prosedur (SOP)** untuk Kantor Kementerian Agama Barito Utara. Bisa membuat, mengedit, live-preview, ekspor PDF, dan mengelola SOP secara kolaboratif (real-time presence).

## Arsitektur (Monorepo)

Proyek ini adalah monorepo dengan dua service terpisah:

| Service | Teknologi | Direktori |
|---------|-----------|-----------|
| **Frontend** | Astro 7 + React (islands) + Tailwind v4 | `frontend/` |
| **Backend (API)** | Go Fiber V3 + PostgreSQL (pgx) | `backend/` |

- **Database**: Supabase PostgreSQL (auth client-side via Supabase JS di browser).
- **RBAC**: dicek lewat Go API (`POST /api/auth/check-rbac`) terhadap `kemenag_pusdatin.profiles` + `kemenag_pusdatin.app_permissions`.
- **Admin user**: `SUPER_ADMIN_EMAIL` (default `baritoutara@kemenag.go.id`) via Supabase service role key.

## Environment (Single `.env` di Root)

Semua konfigurasi aplikasi dipusatkan di **satu file `.env` di root repo**. File ini dipakai bersama oleh Frontend (Astro), Backend (Go), dan Docker Compose — tidak ada `.env` terpisah di folder `frontend/` atau `backend/`.

Buat file tersebut dari nilai yang tersedia (variabel `SUPABASE_JWT_SECRET` wajib diisi dari dashboard Supabase):

```bash
# salin contoh (jika ada) atau isi manual, lalu:
# .env sudah dibaca otomatis oleh FE, BE, dan compose.
```

> `.env` tidak perlu dicommit (ter-ignore oleh `.gitignore`).

## Menjalankan (Development)

### Frontend
```bash
cd frontend
npm install
npm run dev   # http://localhost:3000
```
> Astro membaca `.env` root via `envDir: "../"` di `astro.config.mjs`.

### Backend
```bash
cd backend
go run .      # http://localhost:8080/api/health
```
> `config.Load()` otomatis memuat `.env` root (dari `../.env` atau `.env`).

## Menjalankan (Docker)

Pastikan `.env` root sudah terisi, lalu:

```bash
docker compose up --build
```
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`
> Compose membaca `.env` root dan meneruskan variabel `PUBLIC_*` sebagai build-arg serta env runtime.

## Struktur Direktori

```
├── frontend/            # Astro 7 + React frontend
│   ├── src/
│   │   ├── components/  # React islands (SOP builder/editor/preview, ui, tools)
│   │   ├── hooks/       # useAuth, useSOPData, useSOPPresence, dll.
│   │   ├── layouts/     # Layout.astro
│   │   ├── lib/         # supabase, constants, schemas, utils, pdf-service
│   │   ├── pages/       # index, maintenance, tools, robots, sitemap
│   │   ├── styles/      # global.css (Tailwind v4)
│   │   └── types/       # sop.ts, d.ts
│   └── public/          # aset statis (sop.png, favicon, manifest)
├── backend/             # Go Fiber V3 API
│   ├── config/          # env loader
│   ├── database/        # pgxpool connection
│   ├── docs/            # referensi skema DB (supabase-schema.sql)
│   ├── handlers/        # health, auth, admin, maintenance, user-role
│   ├── middleware/      # auth, rbac, cors, ratelimit
│   ├── models/          # struct
│   └── routes/          # registrasi route
├── .env                 # satu-satunya environment untuk FE, BE & Docker
└── docker-compose.yml
```

## Endpoint Backend Utama

- `GET /api/health`
- `GET /api/keep-alive`
- `GET /api/maintenance/status`
- `POST /api/auth/check-rbac`
- `GET /api/admin/user-role` (login)
- `GET|POST /api/admin/users` (super admin)
- `DELETE /api/admin/users/:id`
