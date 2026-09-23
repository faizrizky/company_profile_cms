/**
 * Best-effort client IP. In production the app must sit behind a reverse
 * proxy / CDN (Vercel, Cloudflare, nginx) that overwrites these headers,
 * otherwise they are client-controlled.
 */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]!.trim()
  return headers.get('x-real-ip')?.trim() || 'unknown'
}

export function getUserAgent(headers: Headers): string {
  return (headers.get('user-agent') ?? 'unknown').slice(0, 300)
}
