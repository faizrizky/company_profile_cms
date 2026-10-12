import { beforeEach, describe, expect, it, vi } from 'vitest'

import { demoBlocks } from './clarityDemo'

// No database, no Next cache: an in-memory key-value store, and the cached
// loaders run every time.
const kv = new Map<string, unknown>()
vi.mock('server-only', () => ({}))
vi.mock('@payload-config', () => ({ default: {} }))
vi.mock('payload', () => ({
  getPayload: async () => ({
    kv: {
      get: async (key: string) => kv.get(key) ?? null,
      set: async (key: string, value: unknown) => void kv.set(key, value),
    },
  }),
}))
vi.mock('next/cache', () => ({ unstable_cache: (fn: () => unknown) => fn }))

const [main, tech, acq] = demoBlocks()

function clarityAnswers(status: number) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string) => {
      if (status !== 200) return new Response('', { status })
      const dims = new URL(url).searchParams.get('dimension1')
      const body = dims === 'URL' ? main : dims === 'Browser' ? tech : acq
      return Response.json(body)
    }),
  )
}

const { getClarityStats } = await import('./clarity')

describe('getClarityStats', () => {
  beforeEach(() => {
    kv.clear()
    vi.stubEnv('CLARITY_API_TOKEN', 'test-token')
  })

  it('shows the last saved numbers, flagged stale, once the daily limit is hit', async () => {
    clarityAnswers(200)
    const fresh = await getClarityStats()
    expect(fresh.status).toBe('ok')

    clarityAnswers(429)
    const limited = await getClarityStats()
    expect(limited.status).toBe('ok')
    if (limited.status !== 'ok' || fresh.status !== 'ok') return
    expect(limited.stale).toEqual({ code: 429, message: 'Daily request limit reached' })
    expect(limited.stats).toEqual(fresh.stats)
    expect(limited.fetchedAt).toBe(fresh.fetchedAt)
    expect(limited.detailsAt).toBe(fresh.detailsAt)
  })

  it('is an error when nothing was ever saved', async () => {
    clarityAnswers(429)
    expect(await getClarityStats()).toMatchObject({ status: 'error', code: 429 })
  })

  it('is not stale when Clarity answers', async () => {
    clarityAnswers(200)
    const result = await getClarityStats()
    expect(result.status === 'ok' && result.stale).toBeUndefined()
  })
})
