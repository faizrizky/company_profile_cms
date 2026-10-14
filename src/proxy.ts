import { NextResponse, type NextRequest } from 'next/server'

import { env } from '@/lib/env'
import { createRateLimiter } from '@/lib/rateLimit'
import { getClientIp } from '@/lib/request'

/**
 * Brute-force protection for authentication endpoints, per client IP.
 * Complements Payload's per-account lockout (maxLoginAttempts), which alone
 * can't stop one attacker spraying passwords across many accounts.
 */
const authLimiter = createRateLimiter({ limit: 10, windowMs: 15 * 60 * 1000 })

const AUTH_POSTS = new Set([
  '/api/users/login',
  '/api/users/first-register',
  '/api/users/forgot-password',
  '/api/users/reset-password',
  '/api/users/unlock',
])

/**
 * Plain http only (ALLOW_PLAIN_HTTP): Payload honours the session cookie on a
 * request without Origin only if Sec-Fetch-Site says same-origin, and browsers
 * don't send Sec-Fetch-Site to http sites. Without this every read after login
 * is anonymous and the admin falls back to the login form. Cross-site browser
 * requests that matter still carry Origin (checked by Payload), and the
 * SameSite=Strict cookie is never sent cross-site anyway.
 */
function markSameOrigin(request: NextRequest) {
  const { headers } = request
  if (!env.ALLOW_PLAIN_HTTP || headers.has('origin') || headers.has('sec-fetch-site')) {
    return NextResponse.next()
  }
  const patched = new Headers(headers)
  patched.set('sec-fetch-site', 'same-origin')
  return NextResponse.next({ request: { headers: patched } })
}

export function proxy(request: NextRequest) {
  if (request.method !== 'POST' || !AUTH_POSTS.has(request.nextUrl.pathname)) {
    return markSameOrigin(request)
  }

  const { ok, retryAfterSeconds } = authLimiter.check(getClientIp(request.headers))
  if (ok) return NextResponse.next()

  return NextResponse.json(
    { errors: [{ message: 'Terlalu banyak percobaan. Coba lagi nanti.' }] },
    { status: 429, headers: { 'retry-after': String(retryAfterSeconds) } },
  )
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
}
