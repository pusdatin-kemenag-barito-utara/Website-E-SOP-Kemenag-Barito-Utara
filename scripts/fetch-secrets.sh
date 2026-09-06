#!/bin/sh
set -e

echo "[Infisical] Starting secrets synchronization..."

if command -v node >/dev/null 2>&1; then
  echo "[Infisical] Using host node..."
  node scripts/fetch-secrets.mjs
elif command -v docker >/dev/null 2>&1; then
  echo "[Infisical] Using node in temporary docker container..."
  docker run --rm -v "$PWD":/app -w /app \
    -e INFISICAL_DOMAIN="$INFISICAL_DOMAIN" \
    -e INFISICAL_CLIENT_ID="$INFISICAL_CLIENT_ID" \
    -e INFISICAL_CLIENT_SECRET="$INFISICAL_CLIENT_SECRET" \
    -e INFISICAL_PROJECT_ID="$INFISICAL_PROJECT_ID" \
    -e INFISICAL_ENV="$INFISICAL_ENV" \
    node:22-alpine node scripts/fetch-secrets.mjs
else
  echo "[Infisical Error] Neither node nor docker found to execute fetch-secrets."
  exit 1
fi
