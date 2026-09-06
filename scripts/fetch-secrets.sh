#!/bin/sh
set -e

echo "[Infisical] Starting secrets synchronization..."

DOMAIN="${INFISICAL_DOMAIN:-https://env.kemenag-baritoutara.com}"
ENV_NAME="${INFISICAL_ENV:-prod}"

if command -v node >/dev/null 2>&1; then
  echo "[Infisical] Executing via host node..."
  node scripts/fetch-secrets.mjs > .env
elif command -v docker >/dev/null 2>&1; then
  echo "[Infisical] Executing via piped node container (no volume mount)..."
  docker run -i --rm \
    -e INFISICAL_DOMAIN="$DOMAIN" \
    -e INFISICAL_CLIENT_ID="$INFISICAL_CLIENT_ID" \
    -e INFISICAL_CLIENT_SECRET="$INFISICAL_CLIENT_SECRET" \
    -e INFISICAL_PROJECT_ID="$INFISICAL_PROJECT_ID" \
    -e INFISICAL_ENV="$ENV_NAME" \
    node:22-alpine node - < scripts/fetch-secrets.mjs > .env
else
  echo "[Infisical Error] Neither node nor docker found."
  exit 1
fi

if [ -f /artifacts/build-time.env ]; then
  echo "[Infisical] Merging with Coolify build-time.env..."
  cat .env >> /artifacts/build-time.env
fi

if [ -d /artifacts ]; then
  cp -f .env /artifacts/.env 2>/dev/null || true
fi

echo "[Infisical] Synchronization complete!"
