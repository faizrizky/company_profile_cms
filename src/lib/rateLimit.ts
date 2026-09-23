type Bucket = { hits: number[] }

/**
 * In-memory sliding-window rate limiter.
 *
 * Good enough for a single Node process. When running more than one
 * instance, swap the Map for a shared store (Redis / Upstash) so limits are
 * enforced across instances.
 */
export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const buckets = new Map<string, Bucket>()

  const sweep = setInterval(() => {
    const cutoff = Date.now() - windowMs
    for (const [key, bucket] of buckets) {
      bucket.hits = bucket.hits.filter((t) => t > cutoff)
      if (bucket.hits.length === 0) buckets.delete(key)
    }
  }, windowMs)
  sweep.unref?.()

  return {
    /** Records a hit and reports whether the caller is still within the limit. */
    check(key: string): { ok: boolean; retryAfterSeconds: number } {
      const now = Date.now()
      const cutoff = now - windowMs
      const bucket = buckets.get(key) ?? { hits: [] }
      bucket.hits = bucket.hits.filter((t) => t > cutoff)

      if (bucket.hits.length >= limit) {
        buckets.set(key, bucket)
        const retryAfterSeconds = Math.ceil((bucket.hits[0]! + windowMs - now) / 1000)
        return { ok: false, retryAfterSeconds }
      }

      bucket.hits.push(now)
      buckets.set(key, bucket)
      return { ok: true, retryAfterSeconds: 0 }
    },
  }
}
