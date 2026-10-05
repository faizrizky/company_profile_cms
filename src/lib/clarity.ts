import 'server-only'

/**
 * Microsoft Clarity Data Export API (project-live-insights).
 * Limits: 10 requests per project per day, at most the last 3 days of data.
 * One request carries every metric split by URL × Country × Device; the rest
 * (per page, per country, per device) is summed here, so a refresh costs a
 * single request and the page can be cached for hours.
 */
const ENDPOINT = 'https://www.clarity.ms/export-data/api/v1/project-live-insights'
/** 8 refreshes a day at most, safely under the 10-request limit. */
const REVALIDATE_SECONDS = 3 * 60 * 60

type Row = Record<string, string | number | null | undefined>
type MetricBlock = { metricName: string; information?: Row[] }

export type Ranked = { label: string; sessions: number }

export type ClarityStats = {
  sessions: number
  botSessions: number
  visitors: number
  pagesPerSession: number | null
  /** Average active time per session, in seconds. */
  activeSeconds: number | null
  /** Average scroll depth, 0–100. */
  scrollDepth: number | null
  /** Sessions with at least one rage / dead click (percent of all sessions). */
  rageClickPercent: number | null
  deadClickPercent: number | null
  topPages: Ranked[]
  topCountries: Ranked[]
  topDevices: Ranked[]
}

export type ClarityResult =
  | { status: 'ok'; stats: ClarityStats }
  | { status: 'empty' }
  | { status: 'unconfigured' }
  | { status: 'error'; code: number | 'network'; message: string }

const num = (v: unknown) => {
  const n = typeof v === 'number' ? v : parseFloat(String(v ?? ''))
  return Number.isFinite(n) ? n : 0
}

const METRIC_KEYS = new Set([
  'totalsessioncount',
  'totalbotsessioncount',
  'distinctusercount',
  'pagespersessionpercentage',
  'totaltime',
  'activetime',
  'averagescrolldepth',
  'sessionscount',
  'sessionswithmetricpercentage',
  'sessionswithoutmetricpercentage',
  'pagesviews',
  'subtotal',
])

/** The value of the dimension whose name matches `pattern` (Clarity names the keys itself). */
function dimension(row: Row, pattern: RegExp): string {
  for (const [key, value] of Object.entries(row)) {
    if (!METRIC_KEYS.has(key.toLowerCase()) && pattern.test(key) && value) return String(value)
  }
  return ''
}

function rank(rows: Row[], pattern: RegExp, clean: (value: string) => string = (v) => v): Ranked[] {
  const totals = new Map<string, number>()
  for (const row of rows) {
    const label = clean(dimension(row, pattern)) || '—'
    totals.set(label, (totals.get(label) ?? 0) + num(row.totalSessionCount))
  }
  return [...totals.entries()]
    .map(([label, sessions]) => ({ label, sessions }))
    .sort((a, b) => b.sessions - a.sessions)
}

/** "https://site.com/en/about?x=1" → "/en/about". */
const pathOf = (url: string) => {
  try {
    const { pathname } = new URL(url)
    return pathname.length > 1 ? pathname.replace(/\/$/, '') : '/'
  } catch {
    return url
  }
}

const DEMO_STATS: ClarityStats = {
  sessions: 1284,
  botSessions: 96,
  visitors: 972,
  pagesPerSession: 3.4,
  activeSeconds: 138,
  scrollDepth: 64,
  rageClickPercent: 1.8,
  deadClickPercent: 6.4,
  topPages: [
    { label: '/en', sessions: 612 },
    { label: '/en/solution', sessions: 301 },
    { label: '/en/solution/virtual-training-suite', sessions: 188 },
    { label: '/en/about', sessions: 96 },
    { label: '/en/contact', sessions: 54 },
    { label: '/id', sessions: 33 },
  ],
  topCountries: [
    { label: 'Indonesia', sessions: 904 },
    { label: 'Singapore', sessions: 142 },
    { label: 'Malaysia', sessions: 87 },
    { label: 'United States', sessions: 64 },
    { label: 'Turkey', sessions: 41 },
    { label: 'Czechia', sessions: 22 },
  ],
  topDevices: [
    { label: 'PC', sessions: 702 },
    { label: 'Mobile', sessions: 531 },
    { label: 'Tablet', sessions: 51 },
  ],
}

export function parseInsights(blocks: MetricBlock[]): ClarityResult {
  const by = (name: string) => blocks.find((b) => b.metricName === name)?.information ?? []
  const traffic = by('Traffic')
  const sessions = traffic.reduce((sum, r) => sum + num(r.totalSessionCount), 0)
  if (sessions === 0) return { status: 'empty' }

  const weighted = (rows: Row[], key: string) =>
    rows.reduce((sum, r) => sum + num(r[key]) * num(r.totalSessionCount), 0) / sessions

  const engagement = by('EngagementTime')
  const activeTime = engagement.reduce((sum, r) => sum + num(r.activeTime), 0)
  const scroll = by('ScrollDepth')
  const share = (name: string) => {
    const rows = by(name)
    if (!rows.length) return null
    return rows.reduce((sum, r) => sum + num(r.sessionsWithMetricPercentage), 0) / rows.length
  }

  return {
    status: 'ok',
    stats: {
      sessions,
      botSessions: traffic.reduce((sum, r) => sum + num(r.totalBotSessionCount), 0),
      // Summed over the splits: a visitor seen on two pages / countries counts twice, so this is an upper bound.
      visitors: traffic.reduce((sum, r) => sum + num(r.distinctUserCount), 0),
      pagesPerSession: weighted(traffic, 'pagesPerSessionPercentage') || null,
      activeSeconds: engagement.length ? activeTime / sessions : null,
      scrollDepth: scroll.length ? scroll.reduce((s, r) => s + num(r.averageScrollDepth), 0) / scroll.length : null,
      rageClickPercent: share('RageClickCount'),
      deadClickPercent: share('DeadClickCount'),
      topPages: rank(traffic, /^url$/i, pathOf).slice(0, 8),
      topCountries: rank(traffic, /country/i).slice(0, 8),
      topDevices: rank(traffic, /device/i).slice(0, 5),
    },
  }
}

export async function getClarityStats(): Promise<ClarityResult> {
  // Local preview with sample numbers (CLARITY_DEMO=true in .env); never in production.
  if (process.env.CLARITY_DEMO === 'true' && process.env.NODE_ENV !== 'production') {
    return { status: 'ok', stats: DEMO_STATS }
  }
  const token = process.env.CLARITY_API_TOKEN
  if (!token) return { status: 'unconfigured' }
  try {
    const res = await fetch(
      `${ENDPOINT}?numOfDays=3&dimension1=URL&dimension2=Country&dimension3=Device`,
      {
        headers: { Authorization: `Bearer ${token}` },
        // Cached by Next (shared across requests / instances), so the daily request limit isn't burned.
        next: { revalidate: REVALIDATE_SECONDS },
      },
    )
    if (!res.ok) {
      return {
        status: 'error',
        code: res.status,
        message: res.status === 429 ? 'Daily request limit reached' : `Clarity answered ${res.status}`,
      }
    }
    return parseInsights((await res.json()) as MetricBlock[])
  } catch (error) {
    return { status: 'error', code: 'network', message: (error as Error).message }
  }
}
