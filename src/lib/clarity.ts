import 'server-only'

import { unstable_cache } from 'next/cache'

/**
 * Microsoft Clarity Data Export API (project-live-insights).
 * Limits: 10 requests per project per day, up to 3 dimensions per request, at
 * most the last 3 days of data.
 *
 * Three requests — URL × Country × Device, Browser × OS × Channel, Source ×
 * Medium × Campaign — and every breakdown is summed from those. The budget is
 * spread over the day:
 *   - overview (URL × Country × Device): every 4 hours → 6 requests
 *   - details (the other two): every 12 hours → 4 requests
 * Refreshes are lazy: the first visit after the interval fetches anew. While
 * there are no visits yet only the overview is asked for, and editors may
 * re-check by hand (see actions/refreshClarity.ts), at most hourly.
 */
const ENDPOINT = 'https://www.clarity.ms/export-data/api/v1/project-live-insights'
export const OVERVIEW_EVERY_MS = 4 * 60 * 60 * 1000
export const DETAILS_EVERY_MS = 12 * 60 * 60 * 1000
export const CLARITY_TAG = 'clarity'
export const RECHECK_COOLDOWN_MS = 60 * 60 * 1000

type Row = Record<string, string | number | null | undefined>
type MetricBlock = { metricName: string; information?: Row[] }

export type Ranked = { label: string; sessions: number }
export type Insight = { percent: number; sessions: number }
export type PageStat = {
  path: string
  sessions: number
  scrollDepth: number | null
  activeSeconds: number | null
}

export type ClarityStats = {
  sessions: number
  botSessions: number
  /** Unique users; Clarity counts them per split, so this is the least-split request's sum. */
  users: number
  pagesPerSession: number | null
  scrollDepth: number | null
  activeSeconds: number | null
  totalSeconds: number | null
  insights: {
    rageClicks: Insight | null
    deadClicks: Insight | null
    excessiveScroll: Insight | null
    quickBacks: Insight | null
    scriptErrors: Insight | null
    errorClicks: Insight | null
  }
  technology: { browsers: Ranked[]; devices: Ranked[]; os: Ranked[]; countries: Ranked[] }
  acquisition: { channels: Ranked[]; sources: Ranked[]; mediums: Ranked[]; campaigns: Ranked[] }
  pages: PageStat[]
}

export type ClarityResult =
  | {
      status: 'ok'
      stats: ClarityStats
      demo?: boolean
      /** When the overview / the details were fetched from Clarity. */
      fetchedAt?: number
      detailsAt?: number
    }
  | { status: 'empty'; fetchedAt?: number }
  | { status: 'unconfigured' }
  | { status: 'error'; code: number | 'network'; message: string }

const num = (v: unknown) => {
  const n = typeof v === 'number' ? v : parseFloat(String(v ?? ''))
  return Number.isFinite(n) ? n : 0
}

/** Keys that are measurements; every other key of a row is a dimension. */
const METRIC_KEYS = new Set(
  [
    'totalSessionCount',
    'totalBotSessionCount',
    'distinctUserCount',
    'pagesPerSessionPercentage',
    'totalTime',
    'activeTime',
    'averageScrollDepth',
    'sessionsCount',
    'sessionsWithMetricPercentage',
    'sessionsWithoutMetricPercentage',
    'pagesViews',
    'subTotal',
  ].map((k) => k.toLowerCase()),
)

const DIMENSIONS = {
  url: /^url$/i,
  country: /country/i,
  device: /device/i,
  browser: /browser/i,
  os: /^os$|operating/i,
  channel: /channel/i,
  source: /source/i,
  medium: /medium/i,
  campaign: /campaign/i,
}
type Dimension = keyof typeof DIMENSIONS

function dim(row: Row, name: Dimension): string {
  for (const [key, value] of Object.entries(row)) {
    if (!METRIC_KEYS.has(key.toLowerCase()) && DIMENSIONS[name].test(key) && value) return String(value)
  }
  return ''
}

/** Identifies a split (the combination of its dimension values) to join metrics with traffic. */
const splitKey = (row: Row) =>
  Object.entries(row)
    .filter(([key]) => !METRIC_KEYS.has(key.toLowerCase()))
    .map(([key, value]) => `${key.toLowerCase()}=${value}`)
    .sort()
    .join('|')

/** "https://site.com/en/about?x=1" → "/en/about". */
function pathOf(url: string) {
  try {
    const { pathname } = new URL(url)
    return pathname.length > 1 ? pathname.replace(/\/$/, '') : '/'
  } catch {
    return url || '—'
  }
}

type Parsed = {
  blocks: (name: string) => Row[]
  traffic: Row[]
  sessions: number
  sessionsOf: (row: Row) => number
}

function parse(blocks: MetricBlock[]): Parsed {
  const by = (name: string) => blocks.find((b) => b.metricName === name)?.information ?? []
  const traffic = by('Traffic')
  const bySplit = new Map(traffic.map((r) => [splitKey(r), num(r.totalSessionCount)]))
  return {
    blocks: by,
    traffic,
    sessions: traffic.reduce((s, r) => s + num(r.totalSessionCount), 0),
    sessionsOf: (row) => bySplit.get(splitKey(row)) ?? 0,
  }
}

function rank(rows: Row[], name: Dimension, clean: (v: string) => string = (v) => v, limit = 8): Ranked[] {
  const totals = new Map<string, number>()
  for (const row of rows) {
    const label = clean(dim(row, name)) || '—'
    totals.set(label, (totals.get(label) ?? 0) + num(row.totalSessionCount))
  }
  return [...totals.entries()]
    .map(([label, sessions]) => ({ label, sessions }))
    .filter((r) => r.sessions > 0)
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, limit)
}

/** Sessions-weighted mean of `key` over metric rows (joined to traffic by split). */
function weightedMean(p: Parsed, rows: Row[], key: string, filter?: (row: Row) => boolean): number | null {
  let total = 0
  let weight = 0
  for (const row of rows) {
    if (filter && !filter(row)) continue
    const w = p.sessionsOf(row) || 1
    total += num(row[key]) * w
    weight += w
  }
  return weight ? total / weight : null
}

function insight(p: Parsed, name: string): Insight | null {
  const rows = p.blocks(name)
  if (!rows.length) return null
  let sessions = 0
  let withMetric = 0
  for (const row of rows) {
    const count = num(row.sessionsCount) || p.sessionsOf(row)
    sessions += count
    withMetric += (count * num(row.sessionsWithMetricPercentage)) / 100
  }
  return sessions ? { percent: (withMetric / sessions) * 100, sessions: Math.round(withMetric) } : null
}

const users = (p: Parsed) => p.traffic.reduce((s, r) => s + num(r.distinctUserCount), 0)

/** Builds the dashboard from the three requests (the 2nd and 3rd may be missing). */
export function buildStats(main: MetricBlock[], tech?: MetricBlock[], acq?: MetricBlock[]): ClarityResult {
  const p = parse(main)
  if (p.sessions === 0) return { status: 'empty' }
  const t = tech ? parse(tech) : null
  const a = acq ? parse(acq) : null

  const engagement = p.blocks('EngagementTime')
  const scroll = p.blocks('ScrollDepth')
  const pageRows = new Map<string, Row[]>()
  for (const row of p.traffic) {
    const path = pathOf(dim(row, 'url'))
    pageRows.set(path, [...(pageRows.get(path) ?? []), row])
  }
  const onPage = (path: string) => (row: Row) => pathOf(dim(row, 'url')) === path

  const pages: PageStat[] = [...pageRows.entries()]
    .map(([path, rows]) => ({
      path,
      sessions: rows.reduce((s, r) => s + num(r.totalSessionCount), 0),
      scrollDepth: weightedMean(p, scroll, 'averageScrollDepth', onPage(path)),
      activeSeconds: weightedMean(p, engagement, 'activeTime', onPage(path)),
    }))
    .sort((x, y) => y.sessions - x.sessions)
    .slice(0, 10)

  return {
    status: 'ok',
    stats: {
      sessions: p.sessions,
      botSessions: p.traffic.reduce((s, r) => s + num(r.totalBotSessionCount), 0),
      users: Math.min(...[p, t, a].filter((x): x is Parsed => Boolean(x?.sessions)).map(users)),
      pagesPerSession: weightedMean(p, p.traffic, 'pagesPerSessionPercentage'),
      scrollDepth: weightedMean(p, scroll, 'averageScrollDepth'),
      activeSeconds: weightedMean(p, engagement, 'activeTime'),
      totalSeconds: weightedMean(p, engagement, 'totalTime'),
      insights: {
        rageClicks: insight(p, 'RageClickCount'),
        deadClicks: insight(p, 'DeadClickCount'),
        excessiveScroll: insight(p, 'ExcessiveScroll'),
        quickBacks: insight(p, 'QuickbackClick'),
        scriptErrors: insight(p, 'ScriptErrorCount'),
        errorClicks: insight(p, 'ErrorClickCount'),
      },
      technology: {
        browsers: t ? rank(t.traffic, 'browser') : [],
        devices: rank(p.traffic, 'device'),
        os: t ? rank(t.traffic, 'os') : [],
        countries: rank(p.traffic, 'country'),
      },
      acquisition: {
        channels: t ? rank(t.traffic, 'channel') : [],
        sources: a ? rank(a.traffic, 'source') : [],
        mediums: a ? rank(a.traffic, 'medium') : [],
        campaigns: a ? rank(a.traffic, 'campaign') : [],
      },
      pages,
    },
  }
}

async function request(token: string, dims: string[]): Promise<MetricBlock[] | { error: number }> {
  const query = new URLSearchParams({ numOfDays: '3' })
  dims.forEach((d, i) => query.set(`dimension${i + 1}`, d))
  const res = await fetch(`${ENDPOINT}?${query}`, {
    headers: { Authorization: `Bearer ${token}` },
    // Cached as a whole below, together with the time it was fetched.
    cache: 'no-store',
  })
  if (!res.ok) return { error: res.status }
  return (await res.json()) as MetricBlock[]
}

class ClarityError extends Error {
  constructor(readonly code: number) {
    super(code === 429 ? 'Daily request limit reached' : `Clarity answered ${code}`)
  }
}

// Cached by Next (shared across requests / instances) so the daily limit
// isn't burned. A failure throws, so it is never cached. The token is read
// inside, not passed in: arguments become part of the cache key.
const loadOverview = unstable_cache(
  async () => {
    const main = await request(process.env.CLARITY_API_TOKEN!, ['URL', 'Country', 'Device'])
    if ('error' in main) throw new ClarityError(main.error)
    return { main, fetchedAt: Date.now() }
  },
  ['clarity-overview-v1'],
  { revalidate: OVERVIEW_EVERY_MS / 1000, tags: [CLARITY_TAG] },
)

const loadDetails = unstable_cache(
  async () => {
    const token = process.env.CLARITY_API_TOKEN!
    const [tech, acq] = await Promise.all([
      request(token, ['Browser', 'OS', 'Channel']),
      request(token, ['Source', 'Medium', 'Campaign']),
    ])
    if ('error' in tech && 'error' in acq) throw new ClarityError(tech.error)
    return {
      tech: 'error' in tech ? undefined : tech,
      acq: 'error' in acq ? undefined : acq,
      fetchedAt: Date.now(),
    }
  },
  ['clarity-details-v1'],
  { revalidate: DETAILS_EVERY_MS / 1000, tags: [CLARITY_TAG] },
)

export async function getClarityStats(): Promise<ClarityResult> {
  // Local preview with sample numbers (CLARITY_DEMO=true in .env); never in production.
  if (process.env.CLARITY_DEMO === 'true' && process.env.NODE_ENV !== 'production') {
    const { demoBlocks } = await import('./clarityDemo')
    const result = buildStats(...demoBlocks())
    const now = Date.now()
    return result.status === 'ok'
      ? { ...result, demo: true, fetchedAt: now - 75 * 60_000, detailsAt: now - 5 * 60 * 60_000 }
      : result
  }
  if (!process.env.CLARITY_API_TOKEN) return { status: 'unconfigured' }
  try {
    const { main, fetchedAt } = await loadOverview()
    // No visits yet: the details would be empty as well.
    if (!parse(main).sessions) return { status: 'empty', fetchedAt }
    // Without the details the overview still shows (browsers etc. stay empty).
    const details = await loadDetails().catch(() => undefined)
    const result = buildStats(main, details?.tech, details?.acq)
    return result.status === 'ok' ? { ...result, fetchedAt, detailsAt: details?.fetchedAt } : result
  } catch (error) {
    if (error instanceof ClarityError) return { status: 'error', code: error.code, message: error.message }
    return { status: 'error', code: 'network', message: (error as Error).message }
  }
}
