import type { Endpoint } from 'payload'
import { z } from 'zod'

import { env } from '@/lib/env'
import { jsonResponse, safeEqual } from '@/lib/http'
import { createRateLimiter } from '@/lib/rateLimit'

/** Shared with the frontend's form validation (FE `lib/contact-schema.ts`). */
export const contactSubmissionSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  organization: z.string().trim().min(2).max(160),
  email: z.string().trim().toLowerCase().pipe(z.email().max(200)),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s\-()]{6,20}$/, 'Invalid phone number'),
  interest: z.string().trim().max(120).optional().default(''),
  message: z.string().trim().max(2000).optional().default(''),
})

const bodySchema = z.object({
  submission: contactSubmissionSchema,
  client: z.object({
    ip: z.string().max(64),
    userAgent: z.string().max(300),
  }),
})

// Backstop in case the frontend key leaks: cap total throughput.
const globalLimiter = createRateLimiter({ limit: 30, windowMs: 60_000 })

function isValidKey(header: string | null): boolean {
  if (!header) return false
  return safeEqual(header, env.CONTACT_API_KEY)
}

/**
 * POST /api/contact-submissions/submit
 * Server-to-server only (frontend → CMS), authenticated with CONTACT_API_KEY.
 */
export const submitContactEndpoint: Endpoint = {
  path: '/submit',
  method: 'post',
  handler: async (req) => {
    if (!isValidKey(req.headers.get('x-contact-key'))) {
      return jsonResponse({ error: 'Unauthorized' }, 401)
    }

    const limit = globalLimiter.check('global')
    if (!limit.ok) {
      return jsonResponse({ error: 'Too many requests' }, 429, {
        'retry-after': String(limit.retryAfterSeconds),
      })
    }

    let payloadBody: unknown
    try {
      payloadBody = await req.json?.()
    } catch {
      return jsonResponse({ error: 'Invalid JSON' }, 400)
    }

    const parsed = bodySchema.safeParse(payloadBody)
    if (!parsed.success) {
      return jsonResponse(
        { error: 'Invalid submission', issues: z.flattenError(parsed.error).fieldErrors },
        400,
      )
    }

    const { submission, client } = parsed.data
    await req.payload.create({
      collection: 'contact-submissions',
      overrideAccess: true,
      req,
      data: { ...submission, status: 'new', meta: client },
    })

    return jsonResponse({ ok: true }, 201)
  },
}
