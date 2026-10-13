import type { Endpoint } from 'payload'
import { z } from 'zod'

import { checkEmailDomain } from '@/lib/emailCheck'
import { env } from '@/lib/env'
import { checkMailbox } from '@/lib/mailboxCheck'
import { jsonResponse, safeEqual } from '@/lib/http'
import { notifyContact } from '@/lib/mail'
import { createRateLimiter } from '@/lib/rateLimit'

/** Shared with the frontend's form validation (FE `lib/contact-schema.ts`). */
export const contactSubmissionSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  organization: z.string().trim().min(2).max(160),
  email: z.string().trim().toLowerCase().pipe(z.email().max(200)),
  // Digits only (a leading + for the country code): 8–15 digits, the international maximum.
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{8,15}$/, 'Invalid phone number'),
  interest: z.string().trim().max(120).optional().default(''),
  message: z.string().trim().max(2000).optional().default(''),
})

const clientSchema = z.object({
  ip: z.string().max(64),
  userAgent: z.string().max(300),
})

const bodySchema = z.object({
  submission: contactSubmissionSchema,
  client: clientSchema,
})

// Backstop in case the frontend key leaks: cap total throughput.
const globalLimiter = createRateLimiter({ limit: 30, windowMs: 60_000 })

const invalid = (field: string, reason: string) =>
  jsonResponse({ error: 'Invalid submission', issues: { [field]: [reason] } }, 400)

/** Refuses addresses that can't be real before anything is sent to them. */
async function emailProblem(email: string): Promise<Response | null> {
  // A domain that takes mail, not a throwaway-mailbox service…
  if ((await checkEmailDomain(email)) !== 'ok') return invalid('email', 'Invalid email domain')
  // …and a mailbox that exists, when its mail server can tell (a definite "no such user").
  if (env.EMAIL_MAILBOX_CHECK && (await checkMailbox(email)) === 'no-mailbox') {
    return invalid('email', 'Mailbox does not exist')
  }
  return null
}

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

    const problem = await emailProblem(submission.email)
    if (problem) return problem

    await req.payload.create({
      collection: 'contact-submissions',
      overrideAccess: true,
      req,
      data: { ...submission, status: 'new', meta: client },
    })

    // The team's email about it (never fails the submission, see lib/mail).
    await notifyContact(req, submission)

    return jsonResponse({ ok: true }, 201)
  },
}
