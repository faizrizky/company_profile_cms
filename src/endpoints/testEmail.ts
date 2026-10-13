import type { Endpoint, PayloadRequest } from 'payload'

import { hasRole } from '@/access'
import { smtpEnabled } from '@/lib/env'
import { jsonResponse } from '@/lib/http'
import { send } from '@/lib/mail'

/**
 * The "Send a test email" button of Settings → Site settings → Email
 * notifications (admins): a sample contact email to the contact address, with
 * the saved sender and subject — to check the mail server without waiting for
 * a real message.
 *
 * The office mail server can take a minute or more, so the test runs here in
 * the background, one at a time: POST starts it, GET says whether it is still
 * running and how the last one went. A page reloaded in the meantime keeps
 * the button locked and still shows the result.
 */

type Result = { ok: boolean; to?: string; error?: string; at: number }

// One CMS process: the test in progress and the last result live in memory.
let running: { startedAt: number } | null = null
let last: Result | null = null
// Longer than the transport's own timeouts (see payload.config): a test that
// never reported back doesn't lock the button forever.
const STALE_MS = 3 * 60 * 1000

const inProgress = () => (running && Date.now() - running.startedAt < STALE_MS ? running : null)

const isId = (req: PayloadRequest) => req.i18n?.language === 'id'

/** POST /api/globals/site-settings/test-email: starts a test (202), or 409 while one runs. */
const startTest: Endpoint = {
  path: '/test-email',
  method: 'post',
  handler: async (req) => {
    if (!hasRole(req.user, 'admin')) return jsonResponse({ error: 'Forbidden' }, 403)
    const { payload } = req
    const id = isId(req)
    if (!smtpEnabled) {
      return jsonResponse(
        {
          error: id
            ? 'Server email (SMTP_HOST…) belum disiapkan di server ini.'
            : 'The mail server (SMTP_HOST…) is not set up on this server yet.',
        },
        400,
      )
    }
    const current = inProgress()
    if (current) return jsonResponse({ running: true, startedAt: current.startedAt }, 409)

    const site = await payload.findGlobal({
      slug: 'site-settings',
      depth: 0,
      overrideAccess: true,
      req,
    })
    const settings = site.emailNotifications ?? {}
    const to = site.contact?.email?.trim()
    if (!to) {
      return jsonResponse(
        {
          error: id
            ? 'Alamat email kontak belum diisi di tab Contact.'
            : 'No contact address in the Contact tab.',
        },
        400,
      )
    }

    const startedAt = Date.now()
    running = { startedAt }
    const adminEmail = req.user!.email
    void (async () => {
      try {
        await send(payload, {
          to,
          settings,
          contact: {
            fullName: 'Nama Contoh',
            organization: 'Organisasi Contoh',
            email: adminEmail,
            phone: '+6281234567890',
            interest: 'Simulation Training',
            message: 'Ini email uji dari Falah CMS. / This is a test email from Falah CMS.',
          },
        })
        last = { ok: true, to, at: Date.now() }
      } catch (error) {
        payload.logger.error({ err: error }, 'Test email could not be sent')
        const message = error instanceof Error ? error.message : 'Could not send.'
        // The usual mistake: a sender address the logged-in account doesn't own.
        const hint = /\b553\b|not owned by user|sender address rejected/i.test(message)
          ? id
            ? ' → Samakan Alamat pengirim dengan akun SMTP (SMTP_USER), atau minta infra mengizinkan akun itu memakai alamat tersebut.'
            : ' → Make the Sender address the same as the SMTP account (SMTP_USER), or ask your infra to let that account use it.'
          : ''
        last = { ok: false, error: message + hint, at: Date.now() }
      } finally {
        if (running?.startedAt === startedAt) running = null
      }
    })()

    return jsonResponse({ running: true, startedAt }, 202)
  },
}

/** GET /api/globals/site-settings/test-email: is a test running, and how did the last one go. */
const testStatus: Endpoint = {
  path: '/test-email',
  method: 'get',
  handler: async (req) => {
    if (!hasRole(req.user, 'admin')) return jsonResponse({ error: 'Forbidden' }, 403)
    const current = inProgress()
    return jsonResponse(
      { running: Boolean(current), startedAt: current?.startedAt ?? null, last },
      200,
    )
  },
}

export const testEmailEndpoints = [startTest, testStatus]
