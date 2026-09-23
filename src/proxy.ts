import { NextResponse, type NextRequest } from 'next/server'

import { createRateLimiter } from '@/lib/rateLimit'
import { getClientIp } from '@/lib/request'

/**
 * Brute-force protection for authentication endpoints, per client IP.
 * Complements Payload's per-account lockout (maxLoginAttempts), which alone
 * can't stop one attacker spraying passwords across many accounts.
 */
const authLimiter = createRateLimiter({ limit: 10, windowMs: 15 * 60 * 1000 })

export function proxy(request: NextRequest) {
  if (request.method !== 'POST') return NextResponse.next()

  const { ok, retryAfterSeconds } = authLimiter.check(getClientIp(request.headers))
  if (ok) return NextResponse.next()

  return NextResponse.json(
    { errors: [{ message: 'Terlalu banyak percobaan. Coba lagi nanti.' }] },
    { status: 429, headers: { 'retry-after': String(retryAfterSeconds) } },
  )
}

export const config = {
  matcher: [
    '/api/users/login',
    '/api/users/first-register',
    '/api/users/forgot-password',
    '/api/users/reset-password',
    '/api/users/unlock',
  ],
}
