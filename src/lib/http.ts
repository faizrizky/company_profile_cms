import { timingSafeEqual } from 'node:crypto'

/** JSON response for custom endpoints; never cached (answers are per user or per request). */
export const jsonResponse = (body: unknown, status = 200, headers?: HeadersInit) =>
  Response.json(body, { status, headers: { 'Cache-Control': 'no-store', ...headers } })

/** Constant-time string comparison for secrets, keys and codes. */
export function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  return left.length === right.length && timingSafeEqual(left, right)
}
