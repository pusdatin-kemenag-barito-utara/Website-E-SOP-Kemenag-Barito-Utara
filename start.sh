#!/bin/sh
set -e

echo "Starting E-SOP Digital Services..."

# Jalankan Go backend di background pada port 8080
echo "[Backend] Starting Go Fiber backend on port 8080..."
/app/sop-backend &
BACKEND_PID=$!

# Tunggu sejenak agar backend siap
sleep 1

# Tangani graceful shutdown jika container dihentikan
trap "kill -TERM $BACKEND_PID 2>/dev/null || true; exit 0" INT TERM

# Jalankan Astro SSR frontend di foreground pada port 3000
echo "[Frontend] Starting Astro SSR server on port 3000..."
node /app/dist/server/entry.mjs &
FRONTEND_PID=$!

# Tunggu salah satu proses selesai/keluar
wait -n $BACKEND_PID $FRONTEND_PID
