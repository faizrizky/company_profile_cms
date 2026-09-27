import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  decryptSecret,
  encryptSecret,
  findRecoveryCode,
  generateRecoveryCodes,
  generateSecret,
  otpauthUrl,
  verifyCode,
} from './totp'

/** "12345678901234567890" in base32: the RFC 6238 test key (SHA-1). */
const RFC_SECRET = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ'

const at = (seconds: number) => vi.spyOn(Date, 'now').mockReturnValue(seconds * 1000)

afterEach(() => vi.restoreAllMocks())

describe('verifyCode', () => {
  it.each([
    [59, '287082'],
    [1111111109, '081804'],
    [1111111111, '050471'],
    [1234567890, '005924'],
    [2000000000, '279037'],
  ])('matches the RFC 6238 vector at t=%i', (time, code) => {
    at(time)
    expect(verifyCode(RFC_SECRET, code)).not.toBeNull()
  })

  it('accepts one step of clock drift, not more', () => {
    at(59 + 30)
    expect(verifyCode(RFC_SECRET, '287082')).not.toBeNull()
    at(59 + 90)
    expect(verifyCode(RFC_SECRET, '287082')).toBeNull()
  })

  it('refuses a code that was already used (replay)', () => {
    at(59)
    const step = verifyCode(RFC_SECRET, '287082')!
    expect(verifyCode(RFC_SECRET, '287082', step)).toBeNull()
  })

  it('refuses wrong and malformed codes', () => {
    at(59)
    expect(verifyCode(RFC_SECRET, '123456')).toBeNull()
    expect(verifyCode(RFC_SECRET, '28708')).toBeNull()
    expect(verifyCode(RFC_SECRET, 'abcdef')).toBeNull()
  })

  it('ignores spaces typed in the code', () => {
    at(59)
    expect(verifyCode(RFC_SECRET, '287 082')).not.toBeNull()
  })
})

describe('secret storage', () => {
  it('round-trips an encrypted secret', () => {
    const secret = generateSecret()
    expect(secret).toMatch(/^[A-Z2-7]{32}$/)
    expect(decryptSecret(encryptSecret(secret))).toBe(secret)
  })

  it('never stores the secret in clear text', () => {
    const secret = generateSecret()
    expect(encryptSecret(secret)).not.toContain(secret)
  })

  it('rejects tampered or missing data instead of throwing', () => {
    const stored = encryptSecret(generateSecret())
    expect(decryptSecret(`${stored.slice(0, -2)}AA`)).toBeNull()
    expect(decryptSecret('garbage')).toBeNull()
    expect(decryptSecret(undefined)).toBeNull()
  })
})

describe('recovery codes', () => {
  it('generates 10 unique codes and keeps only hashes', () => {
    const { codes, hashes } = generateRecoveryCodes()
    expect(new Set(codes).size).toBe(10)
    expect(codes[0]).toMatch(/^[A-Z2-7]{4}-[A-Z2-7]{4}$/)
    expect(hashes.some((h) => codes.includes(h))).toBe(false)
  })

  it('finds a code regardless of case and dash', () => {
    const { codes, hashes } = generateRecoveryCodes()
    expect(findRecoveryCode(hashes, codes[3]!.toLowerCase().replace('-', ''))).toBe(3)
    expect(findRecoveryCode(hashes, 'AAAA-BBBB')).toBe(-1)
  })
})

it('builds an otpauth link the authenticator apps read', () => {
  const url = new URL(otpauthUrl('ABC', 'admin@falahtech.co.id'))
  expect(url.protocol).toBe('otpauth:')
  expect(url.searchParams.get('secret')).toBe('ABC')
  expect(url.searchParams.get('issuer')).toBe('Falah CMS')
})
