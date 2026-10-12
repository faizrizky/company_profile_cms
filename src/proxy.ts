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

const AUTH_PATHS = new Set([
  '/api/users/login',
  '/api/users/first-register',
  '/api/users/forgot-password',
  '/api/users/reset-password',
  '/api/users/unlock',
])

/**
 * Payload accepts the session cookie only with an allowed Origin or, when there
 * is none (same-origin GET), with Sec-Fetch-Site. Browsers send Sec-Fetch-Site
 * to secure origins only, so over plain http every page load looks signed out.
 * With ALLOW_PLAIN_HTTP, a request carrying neither header is marked
 * same-origin, as a browser on HTTPS would. Cross-site requests are still
 * refused: browsers always send Origin on POST/PATCH/DELETE, and the
 * SameSite=Strict cookie is not sent from other sites at all.
 */
function withPlainHttpFetchSite(request: NextRequest): NextResponse {
  const { headers } = request
  if (!env.ALLOW_PLAIN_HTTP || headers.has('origin') || headers.has('sec-fetch-site')) {
    return NextResponse.next()
  }
  const patched = new Headers(headers)
  patched.set('sec-fetch-site', 'same-origin')
  return NextResponse.next({ request: { headers: patched } })
}

export function proxy(request: NextRequest) {
  if (request.method !== 'POST' || !AUTH_PATHS.has(request.nextUrl.pathname)) {
    return withPlainHttpFetchSite(request)
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
