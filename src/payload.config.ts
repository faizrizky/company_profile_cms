import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { s3Storage } from '@payloadcms/storage-s3'
import { en } from '@payloadcms/translations/languages/en'
import { id } from '@payloadcms/translations/languages/id'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { AuditLogs } from './collections/AuditLogs'
import { Certifications } from './collections/Certifications'
import { ContactSubmissions } from './collections/ContactSubmissions'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Partners } from './collections/Partners'
import { Products } from './collections/Products'
import { SolutionCategories } from './collections/SolutionCategories'
import { Users } from './collections/Users'
import { Footer } from './globals/Footer'
import { Navigation } from './globals/Navigation'
import { SiteSettings } from './globals/SiteSettings'
import { withListEnhancements } from './fields/listEnhancements'
import { localizeTextFields } from './fields/localize'
import { translateCollection, translateGlobal } from './i18n/translateAdmin'
import { MAX_UPLOAD_BYTES } from './hooks/secureUpload'
import { env, s3Enabled } from './lib/env'
import { SUPABASE_ROOT_CA } from './lib/supabaseCa'
import { saveWithProgress } from './endpoints/saveWithProgress'
import { withGlobalProgressHooks, withProgressHooks } from './lib/saveProgress'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/** Collections whose copy is translatable (users, logs, inbox and brand names are not). */
const LOCALIZED_COLLECTIONS = new Set([
  'pages',
  'media',
  'certifications',
  'solution-categories',
  'products',
])

const withLocalizedText = <
  T extends { slug: string; fields: Parameters<typeof localizeTextFields>[0] },
>(
  config: T,
): T => ({ ...config, fields: localizeTextFields(config.fields) })

/**
 * CA for verifying the database certificate: DATABASE_SSL_CA if set, else the
 * bundled Supabase root CA for Supabase hosts (its chain isn't publicly trusted).
 */
function databaseCa(url: string): string | undefined {
  if (env.DATABASE_SSL_CA) return env.DATABASE_SSL_CA
  if (
    new URL(url).hostname.endsWith('.supabase.com') ||
    new URL(url).hostname.endsWith('.supabase.co')
  ) {
    return SUPABASE_ROOT_CA
  }
  return undefined
}

function withoutSslParams(url: string): string {
  const parsed = new URL(url)
  for (const key of ['sslmode', 'sslcert', 'sslkey', 'sslrootcert', 'uselibpqcompat']) {
    parsed.searchParams.delete(key)
  }
  return parsed.toString()
}

export default buildConfig({
  serverURL: env.SERVER_URL,
  secret: env.PAYLOAD_SECRET,
  telemetry: false,

  admin: {
    user: Users.slug,
    theme: 'light',
    // Gravatar would load a third-party image (blocked by our CSP anyway).
    avatar: 'default',
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: ' — Falah CMS',
      robots: 'noindex, nofollow',
      icons: [
        { rel: 'icon', type: 'image/png', url: '/falah-icon.png' },
        { rel: 'apple-touch-icon', type: 'image/png', url: '/apple-touch-icon.png' },
      ],
    },
    components: {
      graphics: {
        Logo: '/components/admin/Logo#Logo',
        Icon: '/components/admin/Icon#Icon',
      },
      // Sidebar with an icon rail when collapsed and the account menu at its foot.
      Nav: '/components/admin/nav/FalahNav#FalahNav',
      // Show/hide toggle on every password input (login, reset, change password).
      providers: [
        '/components/admin/PasswordReveal#PasswordRevealProvider',
        // Breadcrumb of the current page on top of every drawer.
        '/components/admin/DrawerBreadcrumbs#DrawerBreadcrumbsProvider',
        // Skeleton of the next screen while navigating between admin views.
        '/components/admin/PageSkeleton#PageSkeletonProvider',
        // Icons on the document tabs (Edit / Visual, Form, Versions, API).
        '/components/admin/DocTabIcons#DocTabIconsProvider',
        // Themed tooltips ([data-falah-tooltip]) and tab-switch animation.
        '/components/admin/Tooltips#TooltipProvider',
        '/components/admin/TabTransitions#TabTransitionsProvider',
        // First frame as the thumbnail of video files (Payload only previews images).
        '/components/admin/VideoThumbnails#VideoThumbnailsProvider',
        // Two-step verification after the password (see src/auth/twoFactor.ts).
        '/components/admin/TwoFactorGate#TwoFactorGateProvider',
        // File sizes in MB (Payload's own text is KB / bytes).
        '/components/admin/FileSizeMb#FileSizeMbProvider',
        // Upload size limits shown on drop zones; oversized files refused before saving.
        '/components/admin/UploadLimits#UploadLimitsProvider',
        // Readable file names wherever Payload prints the stored (random) one.
        '/components/admin/MediaNames#MediaNamesProvider',
        // Progress toast (with a percentage) while a form saves or publishes.
        '/components/admin/SaveProgress#SaveProgressProvider',
      ],
    },
  },

  // Content languages. Structure is shared; every piece of copy has an EN and ID
  // version. Missing translations fall back to English.
  localization: {
    locales: [
      { code: 'en', label: 'English' },
      { code: 'id', label: 'Bahasa Indonesia' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },

  // Only the frontend origin may call the API from a browser, and cookie-
  // authenticated requests are only honoured from these origins (CSRF).
  cors: [env.FRONTEND_URL, env.SERVER_URL],
  csrf: [env.FRONTEND_URL, env.SERVER_URL],

  // The frontend uses REST only; GraphQL would just be extra attack surface.
  graphQL: { disable: true },

  // Caps how deep relationships can be expanded per request (DoS guard).
  maxDepth: 4,

  collections: [
    Pages,
    Media,
    Partners,
    Certifications,
    SolutionCategories,
    Products,
    ContactSubmissions,
    Users,
    AuditLogs,
  ]
    .map((c) => (LOCALIZED_COLLECTIONS.has(c.slug) ? withLocalizedText(c) : c))
    .map((c) => (c.slug === AuditLogs.slug ? c : withListEnhancements(c)))
    // Labels & descriptions follow the admin language (EN / ID).
    .map(translateCollection)
    // Real save progress for the editors (see endpoints/saveWithProgress.ts).
    .map(withProgressHooks),
  globals: [SiteSettings, Navigation, Footer]
    .map(withLocalizedText)
    .map(translateGlobal)
    .map(withGlobalProgressHooks),

  endpoints: [saveWithProgress],

  i18n: {
    supportedLanguages: { en, id },
    fallbackLanguage: 'en',
    // Drawer titles stay short; the file name is in the drawer's breadcrumb.
    translations: {
      en: { upload: { sizesFor: 'Image sizes' } },
      id: { upload: { sizesFor: 'Ukuran gambar' } },
    },
  },

  upload: {
    limits: { fileSize: MAX_UPLOAD_BYTES, files: 1 },
    abortOnLimit: true,
  },

  db: postgresAdapter({
    pool: {
      // SSL comes from DATABASE_SSL(_CA) below: `sslmode=…` in the URL (as in
      // Supabase/Vercel connection strings) would override it and drop the CA.
      connectionString: withoutSslParams(env.DATABASE_URL),
      // Certificates are always verified; Supabase needs its own CA for that.
      ssl: env.DATABASE_SSL
        ? { rejectUnauthorized: true, ca: databaseCa(env.DATABASE_URL) }
        : undefined,
    },
    migrationDir: path.resolve(dirname, 'migrations'),
    // Dev "push" only ever touches a local database. Pointed at the cloud
    // (scripts, a dev server with the production URL) it would mark the
    // database as dev-pushed and block `payload migrate` in the next deploy.
    push: ['localhost', '127.0.0.1', '::1'].includes(new URL(env.DATABASE_URL).hostname),
  }),

  sharp,

  // Uploads go through this server first, and on Vercel a request is capped at
  // ~4.5 MB (see HOSTED_BODY_LIMIT_BYTES). Larger files need direct-to-storage
  // uploads (`clientUploads` of the S3 plugin) — which bypass the content checks
  // in hooks/secureUpload.ts, so they'd need an equivalent check after upload.
  plugins: s3Enabled
    ? [
        s3Storage({
          collections: {
            media: env.S3_PUBLIC_URL
              ? {
                  // Files are served straight from the public bucket (media is
                  // public anyway) instead of streaming through the CMS.
                  disablePayloadAccessControl: true,
                  generateFileURL: ({ filename, prefix }) =>
                    `${env.S3_PUBLIC_URL}/${[prefix, filename].filter(Boolean).join('/')}`,
                }
              : true,
          },
          bucket: env.S3_BUCKET!,
          config: {
            region: env.S3_REGION,
            endpoint: env.S3_ENDPOINT,
            forcePathStyle: env.S3_FORCE_PATH_STYLE,
            credentials: {
              accessKeyId: env.S3_ACCESS_KEY_ID!,
              secretAccessKey: env.S3_SECRET_ACCESS_KEY!,
            },
          },
        }),
      ]
    : [],

  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
})
