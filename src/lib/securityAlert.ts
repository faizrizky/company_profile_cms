import type { PayloadRequest } from 'payload'

import { env } from '@/lib/env'
import { getClientIp } from '@/lib/request'

/**
 * Posts a security event to SECURITY_WEBHOOK_URL (Discord, Slack or Google
 * Chat all accept one of `content` / `text`). Never throws: an alert that
 * can't be delivered must not break the login or save that triggered it.
 * Every event is also in the audit log.
 */
export async function notifySecurity(req: PayloadRequest | undefined, message: string): Promise<void> {
  if (!env.SECURITY_WEBHOOK_URL) return
  const ip = req ? getClientIp(req.headers) : undefined
  const text = `[Falah CMS] ${message}${ip ? ` · IP ${ip}` : ''}`
  try {
    await fetch(env.SECURITY_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: text, text }),
      signal: AbortSignal.timeout(5000),
    })
  } catch (error) {
    req?.payload.logger.warn({ err: error }, 'Security alert could not be delivered')
  }
}
