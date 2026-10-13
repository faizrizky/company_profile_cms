import { promises as dns } from 'node:dns'
import { domainToASCII } from 'node:url'

/**
 * Is this visitor's email address worth accepting? Its domain must have a mail
 * server (an MX record) and must not be a throwaway-mailbox service, and at the
 * big free providers the name must be one they would ever give out (Gmail
 * names have 6 to 30 letters, digits and dots — so asede@gmail.com can't exist).
 *
 * No MX record means refused, even though RFC 5321 lets a bare address record
 * stand in for it: in practice only a website lives there (`kon.com` has an
 * address and no mail server), and a real mailbox almost never does. Whether the
 * mailbox itself exists is asked separately (see mailboxCheck).
 *
 * A DNS hiccup (timeout, server failure) never refuses anybody: only a definite
 * "this domain does not exist / takes no mail" does.
 */

export type EmailCheck = 'ok' | 'no-mail' | 'disposable' | 'bad-format'

/**
 * The address rules of the big free mail providers (what they allow when an
 * account is created). Kept to the documented rules, so a real address is
 * never refused; `+tag` (and Yahoo's `-keyword`) are ignored.
 */
const PROVIDERS: { domains: RegExp; valid: (name: string) => boolean }[] = [
  {
    // Gmail: 6–30 letters, digits and dots (dots don't count), not at either end, never two in a row.
    domains: /^(gmail|googlemail)\.com$/,
    valid: (name) => {
      const local = name.split('+')[0]
      const length = local.replace(/\./g, '').length
      return /^[a-z0-9](?:[a-z0-9]|\.(?!\.))*[a-z0-9]$/.test(local) && length >= 6 && length <= 30
    },
  },
  {
    // Yahoo: 4–32 characters, starts with a letter; letters, digits, dot, underscore.
    domains: /^(yahoo\.[a-z.]+|ymail\.com|rocketmail\.com)$/,
    valid: (name) => {
      const local = name.split('-')[0]
      return /^[a-z][a-z0-9._]{3,31}$/.test(local) && !/\.\.|[._]$/.test(local)
    },
  },
  {
    // Outlook, Hotmail, Live, MSN: starts with a letter; letters, digits, dot, hyphen, underscore.
    domains: /^(outlook|hotmail|live)\.[a-z.]+$|^msn\.com$/,
    valid: (name) => {
      const local = name.split('+')[0]
      return /^[a-z][a-z0-9._-]{0,63}$/.test(local) && !/\.\.|\.$/.test(local)
    },
  },
  {
    // iCloud: 3–20 characters, starts with a letter; letters, digits, dot, underscore.
    domains: /^(icloud|me|mac)\.com$/,
    valid: (name) => {
      const local = name.split('+')[0]
      return /^[a-z][a-z0-9._]{2,19}$/.test(local) && !/\.\.|\.$/.test(local)
    },
  },
]

/** Common throwaway-mailbox services (and their mirrors); not exhaustive on purpose. */
const DISPOSABLE = new Set([
  '10minutemail.com',
  '10minutemail.net',
  '20minutemail.com',
  'dispostable.com',
  'emailondeck.com',
  'fakeinbox.com',
  'getairmail.com',
  'getnada.com',
  'guerrillamail.biz',
  'guerrillamail.com',
  'guerrillamail.de',
  'guerrillamail.net',
  'guerrillamail.org',
  'guerrillamailblock.com',
  'sharklasers.com',
  'grr.la',
  'pokemail.net',
  'spam4.me',
  'maildrop.cc',
  'mailinator.com',
  'mailnesia.com',
  'mintemail.com',
  'moakt.com',
  'mohmal.com',
  'mytemp.email',
  'nada.email',
  'tempail.com',
  'temp-mail.org',
  'temp-mail.io',
  'tempmail.com',
  'tempmail.net',
  'tempmailo.com',
  'tempinbox.com',
  'throwawaymail.com',
  'trashmail.com',
  'trashmail.de',
  'trashmail.net',
  'yopmail.com',
  'yopmail.fr',
  'yopmail.net',
  'burnermail.io',
  'discard.email',
  'fakemail.net',
  'inboxkitten.com',
  'mailcatch.com',
  'spamgourmet.com',
  'anonbox.net',
])

type Resolver = Pick<typeof dns, 'resolveMx'>

const DEFINITE = new Set(['ENOTFOUND', 'ENODATA'])
const TTL_MS = 10 * 60 * 1000
const cache = new Map<string, { result: EmailCheck; until: number }>()

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(Object.assign(new Error('DNS timeout'), { code: 'ETIMEOUT' })), ms),
    ),
  ])
}

export async function checkEmailDomain(
  email: string,
  resolver: Resolver = dns,
  timeoutMs = 3000,
): Promise<EmailCheck> {
  const domain = domainToASCII(
    email
      .slice(email.lastIndexOf('@') + 1)
      .trim()
      .toLowerCase(),
  )
  if (!domain || !domain.includes('.')) return 'no-mail'
  const name = email.slice(0, email.lastIndexOf('@')).trim().toLowerCase()
  const provider = PROVIDERS.find((p) => p.domains.test(domain))
  if (provider && !provider.valid(name)) return 'bad-format'
  // A subdomain of a throwaway service counts too (x.mailinator.com).
  const parts = domain.split('.')
  if (parts.some((_, i) => DISPOSABLE.has(parts.slice(i).join('.')))) return 'disposable'

  const cached = cache.get(domain)
  if (cached && cached.until > Date.now()) return cached.result

  let result: EmailCheck
  try {
    const mx = await withTimeout(
      resolver.resolveMx(domain).catch((e) => {
        if (DEFINITE.has(e?.code)) return []
        throw e
      }),
      timeoutMs,
    )
    // No MX at all, or a "null MX" (a single "."): no mail server here.
    result =
      mx.length === 0 || (mx.length === 1 && ['', '.'].includes(mx[0].exchange)) ? 'no-mail' : 'ok'
  } catch {
    return 'ok' // Could not find out: don't refuse (and don't remember it).
  }
  cache.set(domain, { result, until: Date.now() + TTL_MS })
  if (cache.size > 2000) cache.clear()
  return result
}
