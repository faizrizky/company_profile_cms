# syntax=docker/dockerfile:1

# Falah CMS (Payload 3 on Next.js) as a container. Built and run by the
# `falah-deploy` project (docker compose); not meant to be run on its own.
#
# Targets:
#   runner   the app: Next.js standalone server (default)
#   builder  the full toolchain; used as a one-off job for `payload migrate`
#
# Build arguments are values Next.js bakes into the build (CSP headers, the
# media proxy, the upload cap). Changing one means rebuilding the image.

ARG NODE_VERSION=24

FROM node:${NODE_VERSION}-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# ── dependencies ─────────────────────────────────────────────────────
FROM base AS deps
COPY package.json package-lock.json .npmrc ./
RUN --mount=type=cache,target=/root/.npm npm ci

# ── build ────────────────────────────────────────────────────────────
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Public address of the website (allowed to frame the admin's visual editor).
ARG FRONTEND_URL
# Where browsers load media from, and how to reach the bucket when that is a
# path on this host (S3_PUBLIC_URL=/media): see falah-deploy/.env.example.
ARG S3_PUBLIC_URL
ARG S3_ENDPOINT
ARG S3_BUCKET
# Upload cap of this host in MB (Vercel is capped at ~4.5 MB; our own server isn't).
ARG NEXT_PUBLIC_BODY_LIMIT_MB=50
# Node's heap limit for the build. It peaks around 2.5 GB; raise this if the
# build dies with "heap out of memory" or is killed (exit 137).
ARG BUILD_MEMORY_MB=4096

# The app validates its environment while it builds, so give it placeholders.
# They exist only for this RUN — nothing is kept in the image; the real values
# come from the container's environment when it runs.
RUN set -eu; \
    export NODE_ENV=production \
      BUILD_STANDALONE=true \
      NEXT_TELEMETRY_DISABLED=1 \
      NODE_OPTIONS="--no-deprecation --max-old-space-size=${BUILD_MEMORY_MB}" \
      DATABASE_URL="postgres://build:build@localhost:5432/build" \
      PAYLOAD_SECRET="build-only-placeholder-0123456789abcdef" \
      REVALIDATE_SECRET="build-only-placeholder-0123456789abcdef" \
      CONTACT_API_KEY="build-only-placeholder-0123456789abcdef" \
      SERVER_URL="http://localhost:3001" \
      FRONTEND_URL="${FRONTEND_URL:-http://localhost:3000}" \
      S3_PUBLIC_URL="${S3_PUBLIC_URL:-}" \
      S3_ENDPOINT="${S3_ENDPOINT:-}" \
      S3_BUCKET="${S3_BUCKET:-}" \
      S3_ACCESS_KEY_ID="${S3_BUCKET:+build-only}" \
      S3_SECRET_ACCESS_KEY="${S3_BUCKET:+build-only}"; \
    npx next build

# ── run ──────────────────────────────────────────────────────────────
FROM base AS runner
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3001 \
    HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3001

# Answers once the app is up and can reach its database.
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:3001/api/users/me || exit 1

CMD ["node", "server.js"]
