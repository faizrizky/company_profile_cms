import { z } from 'zod'

/**
 * Validated server environment. Fails fast at boot so a misconfigured
 * deployment never starts with an empty secret or a wildcard origin.
 */
/** Treats `KEY=` (empty, e.g. copied from .env.example) the same as unset. */
const optional = <T extends z.ZodType>(type: T) =>
  z.preprocess((value) => (value === '' ? undefined : value), type.optional())

const schema = z
  .object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    DATABASE_URL: z.string().url(),
    DATABASE_SSL: z
      .enum(['true', 'false'])
      .default('false')
      .transform((v) => v === 'true'),
    PAYLOAD_SECRET: z.string().min(32, 'PAYLOAD_SECRET must be at least 32 characters'),
    SERVER_URL: z.string().url(),
    FRONTEND_URL: z.string().url(),
    REVALIDATE_SECRET: z.string().min(32, 'REVALIDATE_SECRET must be at least 32 characters'),
    CONTACT_API_KEY: z.string().min(32, 'CONTACT_API_KEY must be at least 32 characters'),
    /**
     * Parent domain for the admin session cookie (e.g. `.falahtech.co.id`) so the
     * visual editor on the website domain can verify the editor's session.
     * Leave unset locally (localhost cookies are shared across ports).
     */
    COOKIE_DOMAIN: optional(z.string()),

    // Optional S3-compatible storage (Cloudflare R2 / AWS S3 / Supabase).
    S3_BUCKET: optional(z.string()),
    S3_REGION: optional(z.string()).transform((v) => v ?? 'auto'),
    S3_ENDPOINT: optional(z.string().url()),
    S3_ACCESS_KEY_ID: optional(z.string()),
    S3_SECRET_ACCESS_KEY: optional(z.string()),
    /**
     * Where browsers load media from: a public URL (CDN / bucket), or a path
     * such as /media that this app proxies to the bucket — then media works
     * on any host (localhost, LAN IP) without changing this value.
     */
    S3_PUBLIC_URL: optional(
      z.string().refine((v) => /^\/[\w-]+$/.test(v) || URL.canParse(v), 'Use a URL or a path like /media'),
    ),
    /** Path-style URLs (host/bucket/key) — required by MinIO, harmless elsewhere. */
    S3_FORCE_PATH_STYLE: optional(z.enum(['true', 'false'])).transform((v) => v === 'true'),
  })
  .superRefine((env, ctx) => {
    const s3 = [env.S3_BUCKET, env.S3_ACCESS_KEY_ID, env.S3_SECRET_ACCESS_KEY]
    if (s3.some(Boolean) && !s3.every(Boolean)) {
      ctx.addIssue({
        code: 'custom',
        message: 'S3_BUCKET, S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY must be set together',
      })
    }
    if (env.NODE_ENV === 'production') {
      for (const key of ['SERVER_URL', 'FRONTEND_URL'] as const) {
        const url = new URL(env[key])
        const isLocal = ['localhost', '127.0.0.1'].includes(url.hostname)
        if (url.protocol !== 'https:' && !isLocal) {
          ctx.addIssue({ code: 'custom', path: [key], message: `${key} must use https in production` })
        }
      }
    }
  })

const parsed = schema.safeParse(process.env)

if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `  - ${i.path.join('.') || 'env'}: ${i.message}`)
  throw new Error(`Invalid environment configuration:\n${issues.join('\n')}`)
}

export const env = parsed.data
export const isProduction = env.NODE_ENV === 'production'
export const s3Enabled = Boolean(env.S3_BUCKET)
