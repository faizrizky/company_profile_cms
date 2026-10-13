import type { Payload, PayloadRequest } from 'payload'

import { smtpEnabled } from '@/lib/env'

/** Sender used until the admin sets another in Settings → Site settings → Email notifications. */
export const DEFAULT_FROM_ADDRESS = 'noreply@falahtech.co.id'
export const DEFAULT_FROM_NAME = 'Falah Website'
/** How long a visitor's submission waits for the email to be handed over. */
const WAIT_FOR_MAIL_MS = 4000
export const DEFAULT_SUBJECT = 'Konsultasi baru dari {name} ({organization})'

export type ContactMessage = {
  fullName: string
  organization: string
  email: string
  phone: string
  interest?: string
  message?: string
}

/** One line, no control characters: a visitor's name must never add a header. */
const oneLine = (value: string) =>
  value
    .replace(/[\r\n\u0000-\u001f]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

/**
 * The subject from the admin's template: {name}, {organization}, {email},
 * {phone} and {interest} are replaced by what the visitor wrote.
 */
export function renderSubject(template: string, contact: ContactMessage): string {
  const values: Record<string, string> = {
    name: contact.fullName,
    organization: contact.organization,
    email: contact.email,
    phone: contact.phone,
    interest: contact.interest ?? '',
  }
  const subject = oneLine(
    (template || DEFAULT_SUBJECT).replace(
      /\{(\w+)\}/g,
      (match, key: string) => values[key] ?? match,
    ),
  )
  return (
    subject.slice(0, 200) ||
    oneLine(DEFAULT_SUBJECT.replace(/\{(\w+)\}/g, (_m, k: string) => values[k] ?? ''))
  )
}

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  )

function body(contact: ContactMessage) {
  const rows: [string, string][] = [
    ['Nama / Name', oneLine(contact.fullName)],
    ['Organisasi / Organization', oneLine(contact.organization)],
    ['Email', oneLine(contact.email)],
    ['Telepon / Phone', oneLine(contact.phone)],
    ['Minat / Interest', oneLine(contact.interest ?? '')],
  ]
  const message = contact.message?.trim() ?? ''
  const text = [
    ...rows.map(([label, value]) => `${label}: ${value || '-'}`),
    '',
    'Pesan / Message:',
    message || '-',
  ].join('\n')
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#0f2742">
<table cellpadding="6" cellspacing="0" style="border-collapse:collapse">${rows
    .map(
      ([label, value]) =>
        `<tr><td style="color:#56708f;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td><td>${escapeHtml(value || '-')}</td></tr>`,
    )
    .join('')}</table>
<p style="margin:16px 0 4px;color:#56708f">Pesan / Message</p>
<p style="margin:0;white-space:pre-wrap">${escapeHtml(message || '-')}</p>
<p style="margin-top:20px;color:#8aa0b8;font-size:12px">Balas email ini untuk menjawab pengunjung langsung. / Reply to answer the visitor directly.</p>
</div>`
  return { text, html }
}

export type EmailSettings = {
  enabled?: boolean | null
  fromName?: string | null
  fromEmail?: string | null
  subject?: string | null
}

/**
 * Emails the team about a new contact message: to the contact address of
 * Settings → Site settings, from the sender and with the subject of Settings →
 * Site settings → Email notifications; the visitor's address is the Reply-To. Never throws and
 * waits at most a few seconds: a mail server that is down must not lose the
 * message (it is in the Inbox already) or hold up the visitor.
 */
export async function notifyContact(req: PayloadRequest, contact: ContactMessage): Promise<void> {
  if (!smtpEnabled) return
  const { payload } = req
  try {
    // Admin-only fields: read with full access.
    const site = await payload.findGlobal({
      slug: 'site-settings',
      depth: 0,
      overrideAccess: true,
      req,
    })
    const settings: EmailSettings = site.emailNotifications ?? {}
    if (settings.enabled === false) return
    const to = site.contact?.email?.trim()
    if (!to) {
      payload.logger.warn(
        'Contact email not sent: no contact address in Settings → Site settings → Contact',
      )
      return
    }
    // A slow mail server (logging in can take several seconds) must not hold
    // up the visitor: after a moment we stop waiting, the email still goes out
    // and a failure is logged when it comes.
    const sending = send(payload, { to, settings, contact }).catch((error) => {
      payload.logger.error({ err: error }, 'Contact email could not be sent')
    })
    await Promise.race([sending, new Promise((resolve) => setTimeout(resolve, WAIT_FOR_MAIL_MS))])
  } catch (error) {
    payload.logger.error({ err: error }, 'Contact email could not be sent')
  }
}

/** The email itself; also used by the "send a test" button (see endpoints/testEmail). */
export async function send(
  payload: Payload,
  { to, settings, contact }: { to: string; settings: EmailSettings; contact: ContactMessage },
) {
  const { text, html } = body(contact)
  await payload.sendEmail({
    to,
    from: sender(settings),
    replyTo: contact.email,
    subject: renderSubject(settings.subject ?? DEFAULT_SUBJECT, contact),
    text,
    html,
  })
}

/** "Name" <address> of the admin's sender (the SMTP account must own the address). */
function sender(settings: EmailSettings) {
  const address = settings.fromEmail?.trim() || DEFAULT_FROM_ADDRESS
  const name = oneLine(settings.fromName ?? DEFAULT_FROM_NAME).replace(/["<>]/g, '')
  return name ? `"${name}" <${address}>` : address
}
