import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes } from 'node:crypto'

import { env } from '@/lib/env'
import { safeEqual } from '@/lib/http'

/**
 * Time-based one-time passwords (RFC 6238), as used by Google / Microsoft
 * Authenticator: HMAC-SHA1, 6 digits, 30-second steps.
 */
const STEP_SECONDS = 30
const DIGITS = 6
/** Codes from one step before/after are accepted (phone clock drift). */
const WINDOW = 1

const BASE32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

function base32Encode(bytes: Buffer): string {
  let bits = 0
  let value = 0
  let out = ''
  for (const byte of bytes) {
    value = (value << 8) | byte
    bits += 8
    while (bits >= 5) {
      out += BASE32[(value >>> (bits - 5)) & 31]
      bits -= 5
    }
  }
  if (bits > 0) out += BASE32[(value << (5 - bits)) & 31]
  return out
}

function base32Decode(text: string): Buffer {
  let bits = 0
  let value = 0
  const out: number[] = []
  for (const char of text.replace(/=+$/, '').toUpperCase()) {
    const index = BASE32.indexOf(char)
    if (index === -1) throw new Error('Invalid base32')
    value = (value << 5) | index
    bits += 5
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 255)
      bits -= 8
    }
  }
  return Buffer.from(out)
}

/** A new shared secret (160 bits, base32 — what authenticator apps expect). */
export function generateSecret(): string {
  return base32Encode(randomBytes(20))
}

function codeAt(secret: string, step: number): string {
  const counter = Buffer.alloc(8)
  counter.writeBigUInt64BE(BigInt(step))
  const hmac = createHmac('sha1', base32Decode(secret)).update(counter).digest()
  const offset = hmac[hmac.length - 1]! & 0x0f
  const number = (hmac.readUInt32BE(offset) & 0x7fffffff) % 10 ** DIGITS
  return String(number).padStart(DIGITS, '0')
}

const currentStep = (now = Date.now()) => Math.floor(now / 1000 / STEP_SECONDS)

/**
 * The time step a code belongs to, or null when it's wrong. Steps at or
 * before `lastUsedStep` are refused so a code can't be replayed.
 */
export function verifyCode(secret: string, code: string, lastUsedStep = -1): number | null {
  const clean = code.replace(/\s/g, '')
  if (!/^\d{6}$/.test(clean)) return null
  const now = currentStep()
  for (let step = now - WINDOW; step <= now + WINDOW; step++) {
    if (step > lastUsedStep && safeEqual(codeAt(secret, step), clean)) return step
  }
  return null
}

/** otpauth:// link the authenticator app reads from the QR code. */
export function otpauthUrl(secret: string, account: string, issuer = 'Falah CMS'): string {
  const label = encodeURIComponent(`${issuer}:${account}`)
  const params = new URLSearchParams({ secret, issuer, algorithm: 'SHA1', digits: String(DIGITS), period: String(STEP_SECONDS) })
  return `otpauth://totp/${label}?${params}`
}

// ── Secret at rest ───────────────────────────────────────────────────────
// Stored encrypted (AES-256-GCM) with a key derived from PAYLOAD_SECRET, so a
// database dump alone can't generate codes. Rotating PAYLOAD_SECRET makes
// stored secrets unreadable: users then simply set 2FA up again.

const key = () => createHash('sha256').update(`${env.PAYLOAD_SECRET}:two-factor`).digest()

export function encryptSecret(secret: string): string {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key(), iv)
  const data = Buffer.concat([cipher.update(secret, 'utf8'), cipher.final()])
  return [iv, cipher.getAuthTag(), data].map((b) => b.toString('base64url')).join('.')
}

export function decryptSecret(stored: string | undefined): string | null {
  if (!stored) return null
  try {
    const [iv, tag, data] = stored.split('.').map((part) => Buffer.from(part, 'base64url'))
    const decipher = createDecipheriv('aes-256-gcm', key(), iv!)
    decipher.setAuthTag(tag!)
    return Buffer.concat([decipher.update(data!), decipher.final()]).toString('utf8')
  } catch {
    return null
  }
}

// ── Recovery codes ───────────────────────────────────────────────────────
// Shown once; only their hashes are kept. Each works a single time.

const hashCode = (code: string) =>
  createHash('sha256').update(code.replace(/[\s-]/g, '').toUpperCase()).digest('hex')

export function generateRecoveryCodes(count = 10): { codes: string[]; hashes: string[] } {
  const codes = Array.from({ length: count }, () => {
    const raw = base32Encode(randomBytes(5)).slice(0, 8)
    return `${raw.slice(0, 4)}-${raw.slice(4)}`
  })
  return { codes, hashes: codes.map(hashCode) }
}

/** Index of the matching recovery code hash, or -1. */
export function findRecoveryCode(hashes: string[], code: string): number {
  const hash = hashCode(code)
  return hashes.findIndex((h) => safeEqual(h, hash))
}
