#!/usr/bin/env bash
# Copies chosen local media files to the production media library.
#   npm run push:media -- 126 127
# Needs the local CMS running (npm run dev) and .env.cloud (see copy-to-cloud.sh).
set -euo pipefail
cd "$(dirname "$0")/.."

if [ "$#" -eq 0 ]; then
  echo "Usage: npm run push:media -- <local media id> [more ids…]" >&2
  exit 1
fi
[ -f .env.cloud ] || { echo ".env.cloud not found (production credentials)" >&2; exit 1; }

set -a
. ./.env.cloud
set +a

# Point Payload at production for this run only.
export DATABASE_URL="$CLOUD_DATABASE_URL" DATABASE_SSL=true
export S3_REGION="${S3_REGION_CLOUD:-ap-southeast-1}" S3_FORCE_PATH_STYLE=true
export S3_PUBLIC_URL="${S3_PUBLIC_URL_CLOUD:-https://bnetozuixgonpaqrxzsq.supabase.co/storage/v1/object/public/falah-media}"
export SERVER_URL="${SERVER_URL_CLOUD:-https://falah-cms-admin.vercel.app}"
export FRONTEND_URL="${FRONTEND_URL_CLOUD:-https://falah-web.vercel.app}"
export MEDIA_IDS="$*"

exec npx payload run scripts/push-media.ts
