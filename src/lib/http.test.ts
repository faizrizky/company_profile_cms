import { describe, expect, it } from 'vitest'

import { jsonResponse, safeEqual } from './http'

describe('safeEqual', () => {
  it('compares strings', () => {
    expect(safeEqual('secret-key', 'secret-key')).toBe(true)
    expect(safeEqual('secret-key', 'secret-kex')).toBe(false)
    expect(safeEqual('short', 'longer-value')).toBe(false)
    expect(safeEqual('', '')).toBe(true)
  })
})

describe('jsonResponse', () => {
  it('is JSON, never cached, and keeps extra headers', async () => {
    const res = jsonResponse({ ok: true }, 429, { 'retry-after': '60' })
    expect(res.status).toBe(429)
    expect(res.headers.get('cache-control')).toBe('no-store')
    expect(res.headers.get('retry-after')).toBe('60')
    expect(await res.json()).toEqual({ ok: true })
  })
})
