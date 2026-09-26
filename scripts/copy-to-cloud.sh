#!/usr/bin/env bash
# Copies the local CMS (Postgres + MinIO media) to the cloud (Neon + Cloudflare R2).
# Run once before the first production deploy:
#
#   NEON_DATABASE_URL='postgres://…neon.tech/neondb?sslmode=require' \
#   R2_ENDPOINT='https://<account-id>.r2.cloudflarestorage.com' \
#   R2_ACCESS_KEY_ID='…' R2_SECRET_ACCESS_KEY='…' R2_BUCKET='falah-media' \
#   ./scripts/copy-to-cloud.sh
#
# Existing data in the Neon database is REPLACED by the local copy.
set -euo pipefail

cd "$(dirname "$0")/.."
export PATH="/opt/homebrew/opt/postgresql@18/bin:$PATH"

: "${NEON_DATABASE_URL:?set NEON_DATABASE_URL}"
: "${R2_ENDPOINT:?set R2_ENDPOINT}"
: "${R2_ACCESS_KEY_ID:?set R2_ACCESS_KEY_ID}"
: "${R2_SECRET_ACCESS_KEY:?set R2_SECRET_ACCESS_KEY}"
: "${R2_BUCKET:?set R2_BUCKET}"

LOCAL_DATABASE_URL="$(grep '^DATABASE_URL=' .env | cut -d= -f2-)"
INITIAL_MIGRATION="$(ls src/migrations/*_initial.ts | head -1 | xargs basename | sed 's/\.ts$//')"
DUMP="$(mktemp -t falah-cms-XXXX).sql"
trap 'rm -f "$DUMP"' EXIT

echo "→ Dumping local database…"
pg_dump "$LOCAL_DATABASE_URL" --no-owner --no-privileges --clean --if-exists >"$DUMP"

echo "→ Restoring into Neon…"
psql "$NEON_DATABASE_URL" --quiet --set ON_ERROR_STOP=1 --single-transaction --file "$DUMP"

# The local database was built with dev "push"; production uses migrations.
# Mark the initial migration as applied so `payload migrate` starts from here.
echo "→ Marking migration $INITIAL_MIGRATION as applied…"
psql "$NEON_DATABASE_URL" --quiet --set ON_ERROR_STOP=1 <<SQL
DELETE FROM payload_migrations WHERE batch = -1;
INSERT INTO payload_migrations (name, batch, updated_at, created_at)
SELECT '$INITIAL_MIGRATION', 1, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM payload_migrations WHERE name = '$INITIAL_MIGRATION');
SQL

echo "→ Copying media to R2 bucket $R2_BUCKET…"
mc alias set falah-r2 "$R2_ENDPOINT" "$R2_ACCESS_KEY_ID" "$R2_SECRET_ACCESS_KEY" --api S3v4 >/dev/null
mc mirror --overwrite falah/falah-media "falah-r2/$R2_BUCKET"
mc alias remove falah-r2 >/dev/null

echo "✓ Done. Database and media are in the cloud."
