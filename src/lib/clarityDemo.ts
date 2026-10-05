/**
 * Sample Clarity responses for previewing the Statistics page locally
 * (CLARITY_DEMO=true). Shaped like the real API, so they go through the same
 * parser; the pages and partners match the website.
 */
type Row = Record<string, string>
type Block = { metricName: string; information: Row[] }

const SITE = 'https://falah-web.vercel.app'

/** Spreads `total` over items by weight, rounded. */
const spread = <T>(total: number, items: [T, number][]) =>
  items.map(([item, w]) => [item, Math.round((total * w) / items.reduce((s, [, x]) => s + x, 0))] as const)

function blocks(traffic: Row[], extras: (row: Row, i: number) => Partial<Record<string, Row>>): Block[] {
  const metric = (name: string) => ({
    metricName: name,
    information: traffic.map((r, i) => extras(r, i)[name]).filter((x): x is Row => Boolean(x)),
  })
  return [
    { metricName: 'Traffic', information: traffic },
    ...['EngagementTime', 'ScrollDepth', 'RageClickCount', 'DeadClickCount', 'ExcessiveScroll', 'QuickbackClick', 'ScriptErrorCount', 'ErrorClickCount'].map(metric),
  ]
}

const dims = (r: Row) =>
  Object.fromEntries(
    Object.entries(r).filter(([k]) => !['totalSessionCount', 'totalBotSessionCount', 'distinctUserCount', 'pagesPerSessionPercentage'].includes(k)),
  )

function main(): Block[] {
  const pages = spread(1284, [
    ['/en', 46],
    ['/en/solution', 22],
    ['/en/solution/virtual-training-suite', 14],
    ['/en/about', 8],
    ['/en/contact', 5],
    ['/id', 3],
    ['/en/solution/command-center', 2],
  ] as [string, number][])
  const countries: [string, number][] = [['Indonesia', 70], ['Singapore', 11], ['Malaysia', 7], ['United States', 5], ['Turkey', 4], ['Czechia', 3]]
  const devices: [string, number][] = [['PC', 55], ['Mobile', 41], ['Tablet', 4]]
  const traffic: Row[] = []
  for (const [path, pageTotal] of pages)
    for (const [country, n] of spread(pageTotal, countries))
      for (const [device, sessions] of spread(n, devices)) {
        if (!sessions) continue
        traffic.push({
          Url: `${SITE}${path}`,
          Country: country,
          Device: device,
          totalSessionCount: String(sessions),
          totalBotSessionCount: String(Math.round(sessions * 0.07)),
          distinctUserCount: String(Math.round(sessions * 0.76)),
          pagesPerSessionPercentage: path === '/en' ? '3.9' : '2.8',
        })
      }
  return blocks(traffic, (r, i) => {
    const deep = r.Url.endsWith('/solution') || r.Url.includes('virtual')
    const sessions = r.totalSessionCount
    const share = (base: number) => ({ ...dims(r), sessionsCount: sessions, sessionsWithMetricPercentage: String(base + (i % 3) * 0.4) })
    return {
      EngagementTime: { ...dims(r), totalTime: deep ? '311' : '204', activeTime: deep ? '162' : '104' },
      ScrollDepth: { ...dims(r), averageScrollDepth: deep ? '71.4' : '58.2' },
      RageClickCount: share(1.2),
      DeadClickCount: share(5.8),
      ExcessiveScroll: share(0.3),
      QuickbackClick: share(2.1),
      ScriptErrorCount: share(0.4),
      ErrorClickCount: share(0.2),
    }
  })
}

function split(names: [string, [string, number][]][], total: number): Block[] {
  const traffic: Row[] = []
  const [[a, as], [b, bs], [c, cs]] = names
  for (const [x, n1] of spread(total, as))
    for (const [y, n2] of spread(n1, bs))
      for (const [z, sessions] of spread(n2, cs)) {
        if (!sessions) continue
        traffic.push({ [a]: x, [b]: y, [c]: z, totalSessionCount: String(sessions), totalBotSessionCount: '0', distinctUserCount: String(Math.round(sessions * 0.74)) })
      }
  return [{ metricName: 'Traffic', information: traffic }]
}

export function demoBlocks(): [Block[], Block[], Block[]] {
  return [
    main(),
    split(
      [
        ['Browser', [['Chrome', 62], ['Safari', 14], ['Edge', 11], ['ChromeMobile', 8], ['Firefox', 5]]],
        ['OS', [['Windows', 48], ['Android', 24], ['iOS', 16], ['MacOSX', 12]]],
        ['Channel', [['OrganicSearch', 47], ['Direct', 31], ['Referral', 13], ['Social', 9]]],
      ],
      1284,
    ),
    split(
      [
        ['Source', [['google', 49], ['(direct)', 31], ['linkedin.com', 9], ['kemhan.go.id', 6], ['bing', 5]]],
        ['Medium', [['organic', 54], ['(none)', 31], ['referral', 15]]],
        ['Campaign', [['(not set)', 92], ['indodefence-2026', 8]]],
      ],
      1284,
    ),
  ]
}
