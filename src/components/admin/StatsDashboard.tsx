import type { AdminViewServerProps } from 'payload'

import { getClarityStats, type ClarityStats, type Insight } from '@/lib/clarity'

import { StatsTabs } from './StatsTabs'

const CLARITY_URL = `https://clarity.microsoft.com/projects/view/${process.env.CLARITY_PROJECT_ID || 'v03jaczk0n'}/dashboard`

const TEXT = {
  en: {
    title: 'Statistics',
    lead: 'Who visits the website, from where, and how they use it — last 3 days, from Microsoft Clarity.',
    open: 'Open Clarity',
    demo: 'Sample data (local preview)',
    sessions: 'Sessions',
    botsExcluded: (n: string) => `${n} bot sessions excluded`,
    pagesPerSession: 'Pages per session',
    average: 'average',
    scrollDepth: 'Scroll depth',
    activeTime: 'Active time spent',
    outOf: (t: string) => `out of ${t} total time`,
    users: 'Users overview',
    uniqueUsers: 'Unique users',
    perUser: 'Sessions per user',
    byDevice: 'Sessions by device',
    insights: 'Insights',
    rageClicks: 'Rage clicks',
    deadClicks: 'Dead clicks',
    excessiveScroll: 'Excessive scrolling',
    quickBacks: 'Quick backs',
    scriptErrors: 'JavaScript errors',
    errorClicks: 'Error clicks',
    technology: 'Technology & location',
    browsers: 'Browsers',
    devices: 'Devices',
    os: 'Operating systems',
    countries: 'Countries',
    acquisition: 'Acquisition',
    channel: 'Channel',
    source: 'Source',
    medium: 'Medium',
    campaign: 'Campaign',
    topPages: 'Top pages',
    page: 'Page',
    share: 'Share',
    scroll: 'Scroll',
    active: 'Active time',
    sessionsUnit: 'sessions',
    other: 'Other',
    noData: 'No data in this period.',
    note: 'Numbers refresh every 8 hours (Clarity allows 10 requests a day). Live users, recordings, heatmaps and funnels are in Clarity.',
    empty: 'No visits recorded yet.',
    emptyHelp:
      'Clarity starts counting once the website with its tracking code is live. Data usually appears a few hours after the first visits.',
    unconfigured: 'Clarity is not connected.',
    unconfiguredHelp: 'Set CLARITY_API_TOKEN (Clarity → Settings → Data Export) in the CMS environment.',
    error: 'Could not load the statistics.',
    s: 's',
    min: 'min',
  },
  id: {
    title: 'Statistik',
    lead: 'Siapa yang mengunjungi website, dari mana, dan bagaimana mereka memakainya — 3 hari terakhir, dari Microsoft Clarity.',
    open: 'Buka Clarity',
    demo: 'Data contoh (pratinjau lokal)',
    sessions: 'Kunjungan',
    botsExcluded: (n: string) => `${n} kunjungan bot tidak dihitung`,
    pagesPerSession: 'Halaman per kunjungan',
    average: 'rata-rata',
    scrollDepth: 'Kedalaman scroll',
    activeTime: 'Waktu aktif',
    outOf: (t: string) => `dari ${t} total waktu`,
    users: 'Ringkasan pengunjung',
    uniqueUsers: 'Pengunjung unik',
    perUser: 'Kunjungan per pengunjung',
    byDevice: 'Kunjungan per perangkat',
    insights: 'Insight',
    rageClicks: 'Rage click',
    deadClicks: 'Dead click',
    excessiveScroll: 'Scroll berlebihan',
    quickBacks: 'Quick back',
    scriptErrors: 'Error JavaScript',
    errorClicks: 'Klik error',
    technology: 'Teknologi & lokasi',
    browsers: 'Browser',
    devices: 'Perangkat',
    os: 'Sistem operasi',
    countries: 'Negara',
    acquisition: 'Sumber kunjungan',
    channel: 'Channel',
    source: 'Sumber',
    medium: 'Medium',
    campaign: 'Kampanye',
    topPages: 'Halaman teratas',
    page: 'Halaman',
    share: 'Porsi',
    scroll: 'Scroll',
    active: 'Waktu aktif',
    sessionsUnit: 'kunjungan',
    other: 'Lainnya',
    noData: 'Tidak ada data di periode ini.',
    note: 'Angka diperbarui setiap 8 jam (Clarity membatasi 10 permintaan per hari). Live users, rekaman, heatmap, dan funnel ada di Clarity.',
    empty: 'Belum ada kunjungan tercatat.',
    emptyHelp:
      'Clarity mulai menghitung setelah website dengan kode pelacaknya tayang. Data biasanya muncul beberapa jam setelah kunjungan pertama.',
    unconfigured: 'Clarity belum terhubung.',
    unconfiguredHelp: 'Isi CLARITY_API_TOKEN (Clarity → Settings → Data Export) di environment CMS.',
    error: 'Statistik tidak bisa dimuat.',
    s: 'dtk',
    min: 'mnt',
  },
}

type T = (typeof TEXT)['en']

const fmt = (n: number, locale: string) => new Intl.NumberFormat(locale).format(Math.round(n))
const pct = (n: number) => `${Math.round(n * 100) / 100}%`

function duration(seconds: number | null, t: T) {
  if (seconds == null) return '—'
  return seconds >= 60
    ? `${Math.floor(seconds / 60)} ${t.min} ${Math.round(seconds % 60)} ${t.s}`
    : `${Math.round(seconds)} ${t.s}`
}

function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="falah-stat-card">
      <span className="falah-stat-card__label">{label}</span>
      <strong className="falah-stat-card__value">{value}</strong>
      {hint ? <span className="falah-stat-card__hint">{hint}</span> : null}
    </div>
  )
}

function InsightRow({ label, value, unit, locale }: { label: string; value: Insight | null; unit: string; locale: string }) {
  return (
    <li className="falah-insight">
      <span className="falah-insight__label">{label}</span>
      <strong className="falah-insight__value">{value ? pct(value.percent) : '—'}</strong>
      <span className="falah-insight__hint">{value ? `${fmt(value.sessions, locale)} ${unit}` : ''}</span>
    </li>
  )
}

function Overview({ stats, t, locale }: { stats: ClarityStats; t: T; locale: string }) {
  const devices = stats.technology.devices
  const deviceTotal = devices.reduce((s, d) => s + d.sessions, 0) || 1
  const deviceColors = ['#1f7ae0', '#38bdf8', '#6366f1', '#94a3b8']
  const tabLabels = { sessions: t.sessionsUnit, empty: t.noData, other: t.other }
  const { insights } = stats

  return (
    <>
      <div className="falah-stat-cards falah-stat-cards--kpi">
        <Kpi
          label={t.sessions}
          value={fmt(stats.sessions, locale)}
          hint={stats.botSessions ? t.botsExcluded(fmt(stats.botSessions, locale)) : undefined}
        />
        <Kpi
          label={t.pagesPerSession}
          value={stats.pagesPerSession != null ? (Math.round(stats.pagesPerSession * 100) / 100).toString() : '—'}
          hint={t.average}
        />
        <Kpi label={t.scrollDepth} value={stats.scrollDepth != null ? pct(stats.scrollDepth) : '—'} hint={t.average} />
        <Kpi
          label={t.activeTime}
          value={duration(stats.activeSeconds, t)}
          hint={stats.totalSeconds != null ? t.outOf(duration(stats.totalSeconds, t)) : undefined}
        />
      </div>

      <div className="falah-stat-grid">
        <section className="falah-stat-panel">
          <div className="falah-stat-panel__head">
            <h2>{t.users}</h2>
          </div>
          <div className="falah-users">
            <div className="falah-users__big">
              <span className="falah-users__icon" aria-hidden />
              <div>
                <strong>{fmt(stats.users, locale)}</strong>
                <span>{t.uniqueUsers}</span>
              </div>
            </div>
            <div className="falah-users__big">
              <span className="falah-users__icon falah-users__icon--repeat" aria-hidden />
              <div>
                <strong>{stats.users ? (Math.round((stats.sessions / stats.users) * 100) / 100).toString() : '—'}</strong>
                <span>{t.perUser}</span>
              </div>
            </div>
          </div>
          {devices.length > 0 && (
            <div className="falah-users__split">
              <span className="falah-users__split-title">{t.byDevice}</span>
              <div className="falah-users__bar">
                {devices.map((d, i) => (
                  <span
                    key={d.label}
                    style={{ width: `${(d.sessions / deviceTotal) * 100}%`, background: deviceColors[i % 4] }}
                    title={d.label}
                  />
                ))}
              </div>
              <ul>
                {devices.map((d, i) => (
                  <li key={d.label}>
                    <span className="falah-stat-legend__dot" style={{ background: deviceColors[i % 4] }} />
                    <span className="falah-users__split-label">{d.label}</span>
                    <span>{pct((d.sessions / deviceTotal) * 100)}</span>
                    <span className="falah-users__split-value">{fmt(d.sessions, locale)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <section className="falah-stat-panel">
          <div className="falah-stat-panel__head">
            <h2>{t.insights}</h2>
          </div>
          <ul className="falah-insights">
            <InsightRow label={t.rageClicks} value={insights.rageClicks} unit={t.sessionsUnit} locale={locale} />
            <InsightRow label={t.deadClicks} value={insights.deadClicks} unit={t.sessionsUnit} locale={locale} />
            <InsightRow label={t.excessiveScroll} value={insights.excessiveScroll} unit={t.sessionsUnit} locale={locale} />
            <InsightRow label={t.quickBacks} value={insights.quickBacks} unit={t.sessionsUnit} locale={locale} />
            <InsightRow label={t.scriptErrors} value={insights.scriptErrors} unit={t.sessionsUnit} locale={locale} />
            <InsightRow label={t.errorClicks} value={insights.errorClicks} unit={t.sessionsUnit} locale={locale} />
          </ul>
        </section>

        <StatsTabs
          title={t.technology}
          variant="donut"
          locale={locale}
          labels={tabLabels}
          tabs={[
            { key: 'browsers', label: t.browsers, rows: stats.technology.browsers },
            { key: 'devices', label: t.devices, rows: stats.technology.devices },
            { key: 'os', label: t.os, rows: stats.technology.os },
            { key: 'countries', label: t.countries, rows: stats.technology.countries },
          ]}
        />
      </div>

      <div className="falah-stat-grid falah-stat-grid--wide">
        <StatsTabs
          title={t.acquisition}
          variant="bars"
          locale={locale}
          labels={tabLabels}
          tabs={[
            { key: 'channel', label: t.channel, rows: stats.acquisition.channels },
            { key: 'source', label: t.source, rows: stats.acquisition.sources },
            { key: 'medium', label: t.medium, rows: stats.acquisition.mediums },
            { key: 'campaign', label: t.campaign, rows: stats.acquisition.campaigns },
          ]}
        />

        <section className="falah-stat-panel falah-stat-panel--table">
          <div className="falah-stat-panel__head">
            <h2>{t.topPages}</h2>
          </div>
          <table className="falah-pages">
            <thead>
              <tr>
                <th>{t.page}</th>
                <th>{t.sessions}</th>
                <th>{t.share}</th>
                <th>{t.scroll}</th>
                <th>{t.active}</th>
              </tr>
            </thead>
            <tbody>
              {stats.pages.map((p) => (
                <tr key={p.path}>
                  <td className="falah-pages__path" title={p.path}>
                    {p.path}
                  </td>
                  <td>{fmt(p.sessions, locale)}</td>
                  <td>
                    <span className="falah-pages__share">
                      <span style={{ width: `${(p.sessions / stats.sessions) * 100}%` }} />
                    </span>
                    {Math.round((p.sessions / stats.sessions) * 100)}%
                  </td>
                  <td>{p.scrollDepth != null ? `${Math.round(p.scrollDepth)}%` : '—'}</td>
                  <td>{duration(p.activeSeconds, t)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </>
  )
}

/** The admin home: website statistics from Microsoft Clarity (replaces Payload's default dashboard). */
export async function StatsDashboard({ i18n }: AdminViewServerProps) {
  const lang = i18n.language === 'id' ? 'id' : 'en'
  const t = TEXT[lang]
  const locale = lang === 'id' ? 'id-ID' : 'en-US'
  const result = await getClarityStats()

  return (
    <div className="falah-stats">
      <header className="falah-stats__head">
        <div>
          <h1>
            {t.title}
            {result.status === 'ok' && result.demo ? <span className="falah-stats__demo">{t.demo}</span> : null}
          </h1>
          <p>{t.lead}</p>
        </div>
        <a className="falah-stats__open" href={CLARITY_URL} target="_blank" rel="noopener noreferrer">
          {t.open} ↗
        </a>
      </header>

      {result.status === 'ok' ? (
        <Overview stats={result.stats} t={t} locale={locale} />
      ) : (
        <div className="falah-stats__message">
          <strong>
            {result.status === 'empty' ? t.empty : result.status === 'unconfigured' ? t.unconfigured : t.error}
          </strong>
          <p>
            {result.status === 'empty'
              ? t.emptyHelp
              : result.status === 'unconfigured'
                ? t.unconfiguredHelp
                : result.message}
          </p>
        </div>
      )}
      <p className="falah-stats__note">{t.note}</p>
    </div>
  )
}
