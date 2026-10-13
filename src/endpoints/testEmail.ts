import type { Endpoint } from 'payload'

import { hasRole } from '@/access'
import { smtpEnabled } from '@/lib/env'
import { jsonResponse } from '@/lib/http'
import { send } from '@/lib/mail'

/**
 * POST /api/globals/site-settings/test-email (admins): a sample contact email to
 * the contact address, with the saved sender and subject — to check the mail
 * server and the sender without waiting for a real message.
 */
export const testEmailEndpoint: Endpoint = {
  path: '/test-email',
  method: 'post',
  handler: async (req) => {
    if (!hasRole(req.user, 'admin')) return jsonResponse({ error: 'Forbidden' }, 403)
    const { payload } = req
    const id = req.i18n?.language === 'id'
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
    const site = await payload.findGlobal({
      slug: 'site-settings',
      depth: 0,
      overrideAccess: true,
      req,
    })
    const settings = site.emailNotifications ?? {}
    const to = site.contact?.email?.trim()
    if (!to)
      return jsonResponse(
        {
          error: id
            ? 'Alamat email kontak belum diisi di tab Contact.'
            : 'No contact address in the Contact tab.',
        },
        400,
      )
    try {
      // An admin waits for the real answer, however slow the mail server is
      // (up to the transport's own timeouts).
      await send(payload, {
        to,
        settings,
        contact: {
          fullName: 'Nama Contoh',
          organization: 'Organisasi Contoh',
          email: req.user!.email,
          phone: '+62 812 3456 7890',
          interest: 'Simulation Training',
          message: 'Ini email uji dari Falah CMS. / This is a test email from Falah CMS.',
        },
      })
    } catch (error) {
      payload.logger.error({ err: error }, 'Test email could not be sent')
      const message = error instanceof Error ? error.message : 'Could not send.'
      // The usual mistake: a sender address the logged-in account doesn't own.
      const hint = /\b553\b|not owned by user|sender address rejected/i.test(message)
        ? id
          ? ' → Samakan Alamat pengirim dengan akun SMTP (SMTP_USER), atau minta infra mengizinkan akun itu memakai alamat tersebut.'
          : ' → Make the Sender address the same as the SMTP account (SMTP_USER), or ask your infra to let that account use it.'
        : ''
      return jsonResponse({ error: message + hint }, 502)
    }
    return jsonResponse({ ok: true, to }, 200)
  },
}
