#!/usr/bin/env bash
# Copies the local CMS (Postgres + MinIO media) to the cloud (Supabase database + Supabase Storage, or any S3-compatible bucket).
# Run once before the first production deploy:
#
#   CLOUD_DATABASE_URL='postgresql://postgres.<ref>:<password>@aws-…pooler.supabase.com:5432/postgres' \
#   (Supabase: the *Session* pooler, port 5432 — a restore needs a session)
#   S3_ENDPOINT='https://<ref>.supabase.co/storage/v1/s3' \
#   S3_ACCESS_KEY_ID='…' S3_SECRET_ACCESS_KEY='…' S3_BUCKET='falah-media' \
#   ./scripts/copy-to-cloud.sh
#
# Existing data in the cloud database is REPLACED by the local copy.
set -euo pipefail

cd "$(dirname "$0")/.."
export PATH="/opt/homebrew/opt/postgresql@18/bin:$PATH"

# Credentials can live in .env.cloud (git-ignored), e.g.
#   CLOUD_DATABASE_URL=…  S3_ENDPOINT=…  S3_ACCESS_KEY_ID=…  S3_SECRET_ACCESS_KEY=…
if [ -f .env.cloud ]; then set -a; . ./.env.cloud; set +a; fi

# Anything still missing is asked for (secrets without echo).
ask() {
  local name="$1" prompt="$2" secret="${3:-}"
  if [ -z "${!name:-}" ]; then
    if [ -n "$secret" ]; then read -r -s -p "$prompt: " "$name"; echo; else read -r -p "$prompt: " "$name"; fi
  fi
  [ -n "${!name:-}" ] || { echo "$name is required" >&2; exit 1; }
}
ask CLOUD_DATABASE_URL "Database URL (Supabase session pooler, port 5432)" secret
ask S3_ENDPOINT "S3 endpoint (https://<ref>.supabase.co/storage/v1/s3)"
ask S3_ACCESS_KEY_ID "S3 access key ID"
ask S3_SECRET_ACCESS_KEY "S3 secret access key" secret
S3_BUCKET="${S3_BUCKET:-falah-media}"

LOCAL_DATABASE_URL="$(grep '^DATABASE_URL=' .env | cut -d= -f2-)"
INITIAL_MIGRATION="$(ls src/migrations/*_initial.ts | head -1 | xargs basename | sed 's/\.ts$//')"
DUMP="$(mktemp -t falah-cms-XXXX).sql"
trap 'rm -f "$DUMP"' EXIT

echo "→ Dumping local database…"
pg_dump "$LOCAL_DATABASE_URL" --no-owner --no-privileges --clean --if-exists >"$DUMP"

echo "→ Restoring into the cloud database…"
psql "$CLOUD_DATABASE_URL" --quiet --set ON_ERROR_STOP=1 --single-transaction --file "$DUMP"

# The local database was built with dev "push"; production uses migrations.
# Mark the initial migration as applied so `payload migrate` starts from here.
echo "→ Marking migration $INITIAL_MIGRATION as applied…"
psql "$CLOUD_DATABASE_URL" --quiet --set ON_ERROR_STOP=1 <<SQL
DELETE FROM payload_migrations WHERE batch = -1;
INSERT INTO payload_migrations (name, batch, updated_at, created_at)
SELECT '$INITIAL_MIGRATION', 1, now(), now()
WHERE NOT EXISTS (SELECT 1 FROM payload_migrations WHERE name = '$INITIAL_MIGRATION');
SQL

echo "→ Copying media to bucket $S3_BUCKET…"
mc alias set falah-cloud "$S3_ENDPOINT" "$S3_ACCESS_KEY_ID" "$S3_SECRET_ACCESS_KEY" --api S3v4 --path on >/dev/null
mc mirror --overwrite falah/falah-media "falah-cloud/$S3_BUCKET"
mc alias remove falah-cloud >/dev/null

echo "✓ Done. Database and media are in the cloud."
