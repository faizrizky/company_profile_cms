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
import { MAX_UPLOAD_BYTES } from './hooks/secureUpload'
import { env, s3Enabled } from './lib/env'

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
    },
    components: {
      graphics: {
        Logo: '/components/admin/Logo#Logo',
        Icon: '/components/admin/Icon#Icon',
      },
      // Sidebar with an icon rail when collapsed and the account menu at its foot.
      Nav: '/components/admin/nav/FalahNav#FalahNav',
      // Content language as flags in the top bar (Payload's dropdown is hidden in custom.scss).
      actions: ['/components/admin/LocaleFlags#LocaleFlags'],
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
    .map((c) => (c.slug === AuditLogs.slug ? c : withListEnhancements(c))),
  globals: [SiteSettings, Navigation, Footer].map(withLocalizedText),

  i18n: { supportedLanguages: { en, id }, fallbackLanguage: 'en' },

  upload: {
    limits: { fileSize: MAX_UPLOAD_BYTES, files: 1 },
    abortOnLimit: true,
  },

  db: postgresAdapter({
    pool: {
      connectionString: env.DATABASE_URL,
      ssl: env.DATABASE_SSL ? { rejectUnauthorized: true } : undefined,
    },
    migrationDir: path.resolve(dirname, 'migrations'),
  }),

  sharp,

  plugins: s3Enabled
    ? [
        s3Storage({
          collections: {
            media: env.S3_PUBLIC_URL
              ? {
                  generateFileURL: ({ filename, prefix }) =>
                    `${env.S3_PUBLIC_URL}/${[prefix, filename].filter(Boolean).join('/')}`,
                }
              : true,
          },
          bucket: env.S3_BUCKET!,
          config: {
            region: env.S3_REGION,
            endpoint: env.S3_ENDPOINT,
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
