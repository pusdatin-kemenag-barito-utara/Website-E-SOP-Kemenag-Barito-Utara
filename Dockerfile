# ==========================================
# Stage 1: Build Go Fiber Backend
# ==========================================
FROM golang:1.26-alpine AS backend-builder

WORKDIR /app/backend
RUN apk add --no-cache gcc musl-dev

COPY backend/go.mod backend/go.sum ./
RUN go mod download

COPY backend/ .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /sop-backend .

# ==========================================
# Stage 2: Build Astro SSR Frontend
# ==========================================
FROM node:22-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ .

ARG PUBLIC_SITE_URL
ARG PUBLIC_API_URL
ARG PUBLIC_SUPABASE_URL
ARG PUBLIC_SUPABASE_ANON_KEY
ARG PUBLIC_TURNSTILE_SITE_KEY
ARG PUBLIC_PUSDATIN_URL

ENV PUBLIC_SITE_URL=$PUBLIC_SITE_URL \
    PUBLIC_API_URL=$PUBLIC_API_URL \
    PUBLIC_SUPABASE_URL=$PUBLIC_SUPABASE_URL \
    PUBLIC_SUPABASE_ANON_KEY=$PUBLIC_SUPABASE_ANON_KEY \
    PUBLIC_TURNSTILE_SITE_KEY=$PUBLIC_TURNSTILE_SITE_KEY \
    PUBLIC_PUSDATIN_URL=$PUBLIC_PUSDATIN_URL

RUN npm run build

# ==========================================
# Stage 3: Production Runtime (Single Container)
# ==========================================
FROM node:22-alpine

RUN apk add --no-cache ca-certificates tzdata

WORKDIR /app

# Salin binary backend Go
COPY --from=backend-builder /sop-backend /app/sop-backend

# Salin hasil build frontend Astro
COPY --from=frontend-builder /app/frontend/dist /app/dist
COPY --from=frontend-builder /app/frontend/package.json /app/package.json
COPY --from=frontend-builder /app/frontend/node_modules /app/node_modules

# Salin skrip startup
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

ENV PORT=3000 \
    HOST=0.0.0.0 \
    SERVER_PORT=8080 \
    BACKEND_URL=http://127.0.0.1:8080

EXPOSE 3000

CMD ["/app/start.sh"]
