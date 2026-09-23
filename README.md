# Falah CMS

Headless CMS for the Falah company profile website, built on
[Payload CMS 3](https://payloadcms.com) (Next.js 16, PostgreSQL).

The public site lives in a separate repository
([`company-profile-falah`](../company-profile-falah)); this app only serves
the admin panel (`/admin`) and the content API.

## What editors can do

| Area | Where |
| --- | --- |
| Build pages from sections — add, remove, drag to reorder, pick a design variant | **Content → Pages** |
| Images, logos, icons, PDFs | **Content → Media** |
| Partner logos, certifications | **Content → Partners / Certifications** |
| Solution categories (tabs + detail pages) and product cards — drag to reorder | **Solutions** |
| Menu, footer, contact info, WhatsApp, socials | **Settings** |
| Contact form submissions | **Inbox** |
| Users (admin only), audit log (admin only) | **System** |

Pages support drafts, autosave, scheduled publishing and version history
(restore any previous version). Publishing triggers an on-demand revalidation
of the website, so changes are live within seconds.

## Local setup

Requirements: Node ≥ 20.9, PostgreSQL ≥ 15.

```bash
# 1. Database (dedicated non-superuser role)
psql -d postgres -c "CREATE ROLE falah_cms LOGIN PASSWORD '<password>' NOSUPERUSER NOCREATEDB NOCREATEROLE;"
psql -d postgres -c "CREATE DATABASE falah_cms OWNER falah_cms;"

# 2. Environment
cp .env.example .env    # fill in; generate secrets with: openssl rand -hex 32

# 3. Install & run
npm install
npm run dev             # http://localhost:3001/admin

# 4. First run only: import the current website content + create the first admin
SEED_ADMIN_EMAIL=you@example.com SEED_ADMIN_PASSWORD='…' npm run seed
```

`SEED_ASSETS_DIR` defaults to `../company-profile-falah/public`.

## Schema changes

1. Edit collections / blocks in `src/`.
2. `npm run generate:types` (and `npm run generate:importmap` if admin components changed).
3. In the frontend: `npm run sync:cms-types`, then add/adjust the matching component.
   `RenderBlocks` is typed so a new block without a component fails type-checking.
4. Before deploying: `npm run migrate:create <name>` and commit the migration.
   In production run `npm run migrate` before starting the app (dev uses schema push).

## Project structure

```text
src/
├── access/          # role-based access helpers
├── blocks/          # page-builder sections
├── collections/     # Pages, Media, Partners, Certifications, SolutionCategories,
│                    # Products, ContactSubmissions, Users, AuditLogs
├── globals/         # SiteSettings, Navigation, Footer
├── endpoints/       # POST /api/contact-submissions/submit (server-to-server)
├── fields/          # reusable field builders (links, slugs, SEO, section header)
├── hooks/           # audit log, frontend revalidation, upload hardening, password policy
├── lib/             # env validation, rate limiter, request helpers
├── seed/            # one-time content import from the old hard-coded site
├── proxy.ts         # auth endpoint rate limiting
└── payload.config.ts
scripts/security-smoke.mjs   # end-to-end security checks against a running instance
```

See [SECURITY.md](./SECURITY.md) for the security model and the pre-launch checklist.
