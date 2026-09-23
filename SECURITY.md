# Security

## Model

The CMS stores content; it never executes it. Unlike WordPress there is no
plugin/theme installer and no code editor in the admin, so a compromised
editor account can change content (recoverable from version history) but
cannot plant code.

### Authentication

- No public sign-up. Accounts are created by admins only; `first-register` is closed once a user exists.
- Passwords: ≥ 12 chars with upper, lower, digit and symbol; must not contain the email.
- Lockout after 5 failed logins for 15 minutes (per account) **and** 10 auth requests
  per 15 minutes per IP (`src/proxy.ts`) against password spraying.
- Sessions: 2-hour tokens, `HttpOnly`, `SameSite=Strict`, `Secure` in production.
- Roles: `admin` (users, settings, audit log, deletes) and `editor` (content only).
  Editors cannot change their own role; admins cannot demote or delete themselves.

### Authorization

- Every collection and global has explicit access rules; the public can only
  **read published** content. Drafts and versions require login.
- Contact submissions are write-only for the public, and only through
  `POST /api/contact-submissions/submit`, which requires `CONTACT_API_KEY`
  (called server-to-server by the frontend).
- Audit log is append-only — not even admins can edit or delete entries via the API.

### Input & uploads

- Uploads: 10 MB max; type detected from file **content** (magic bytes), not the
  name or browser MIME; allow-list JPG, PNG, WebP, AVIF, GIF, PDF, SVG.
- SVG is sanitized with DOMPurify (scripts, event handlers, `foreignObject`,
  links removed). Filenames are replaced with random UUIDs.
- Uploaded files are served with `Content-Security-Policy: sandbox` and `nosniff`.
- Link fields reject `javascript:` / `data:` URLs.
- All text fields have length limits; `maxDepth` is capped at 4.

### Transport & headers

- CSP (`frame-ancestors 'none'`), `X-Frame-Options: DENY`, `nosniff`,
  `Referrer-Policy`, `Permissions-Policy`, HSTS in production, `noindex` for the admin.
- CORS/CSRF limited to `FRONTEND_URL` and `SERVER_URL`. GraphQL disabled.
- Environment is validated at boot (secrets ≥ 32 chars, https URLs in production).

### Detection & recovery

- Audit log of every create/update/delete and login (user, IP, user agent, changed fields).
- Version history on pages and solution categories (restore in one click).

## Verifying

```bash
CMS_URL=http://localhost:3001 ADMIN_EMAIL=… ADMIN_PASSWORD=… CONTACT_API_KEY=… \
  node scripts/security-smoke.mjs
```

40 checks covering anonymous access, uploads, link validation, roles, drafts
and the audit log.

## Before going online

- [ ] Put `/admin` behind Cloudflare Access / VPN / IP allow-list (strongly recommended).
- [ ] Add 2FA (TOTP) for admin accounts.
- [ ] Use S3/R2 for media so the CMS can stay off the public internet.
- [ ] Run behind a reverse proxy that sets `X-Forwarded-For` (rate limits rely on it).
- [ ] Replace the in-memory rate limiters with Redis if running more than one instance.
- [ ] Configure an email adapter (password reset) and automated encrypted DB backups.
- [ ] Create and run migrations (`npm run migrate:create`, `npm run migrate`).
- [ ] Rotate all secrets from local development.

## Reporting

Report vulnerabilities privately to the repository owner — do not open public issues.
