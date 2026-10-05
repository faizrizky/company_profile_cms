import { SetStepNav } from '@payloadcms/ui'
import type { AdminViewServerProps } from 'payload'

import {
  getClarityStats,
  OVERVIEW_EVERY_MS,
  RECHECK_COOLDOWN_MS,
  type ClarityStats,
  type Insight,
} from '@/lib/clarity'

import { Info } from './StatsInfo'
import { StatsRecheck } from './StatsRecheck'
import { StatsTabs } from './StatsTabs'

const CLARITY_URL = `https://clarity.microsoft.com/projects/view/${process.env.CLARITY_PROJECT_ID || 'v03jaczk0n'}/dashboard`

const TEXT = {
  en: {
    title: 'Statistics',
    lead: 'Who visits the website, from where, and how they use it — last 3 days, from Microsoft Clarity.',
    open: 'Open Clarity',
    demo: 'Sample data (local preview)',
    sessions: 'Sessions',
    sessionsInfo:
      'A visit to the site. Page views from the same visitor within about 30 minutes count as one session.',
    botsExcluded: (n: string) => `${n} bot sessions excluded`,
    pagesPerSession: 'Pages per session',
    pagesPerSessionInfo: 'Average number of pages viewed per session.',
    average: 'average',
    scrollDepth: 'Scroll depth',
    scrollDepthInfo: 'How far down the page visitors scroll on average.',
    activeTime: 'Active time spent',
    activeTimeInfo:
      'Time visitors spend actually interacting with the page — scrolling, clicking, typing — not just having the tab open.',
    outOf: (t: string) => `out of ${t} total time`,
    users: 'Users overview',
    uniqueUsers: 'Unique users',
    uniqueUsersInfo:
      'People who visited, counted once even if they came back. An estimate: Clarity counts this per breakdown, so the lowest of the three is used.',
    perUser: 'Sessions per user',
    perUserInfo: 'Sessions ÷ unique users — on average, how many times each visitor came back.',
    byDevice: 'Sessions by device',
    insights: 'Insights',
    insightsInfo: 'Automatically detected signs of a frustrating experience, as a share of sessions.',
    rageClicks: 'Rage clicks',
    rageClicksInfo: 'Several fast clicks on the same spot — usually a sign something looked clickable but wasn’t.',
    deadClicks: 'Dead clicks',
    deadClicksInfo: 'A click that caused no visible reaction on the page.',
    excessiveScroll: 'Excessive scrolling',
    excessiveScrollInfo: 'Fast, repeated scrolling — a sign the visitor is struggling to find something.',
    quickBacks: 'Quick backs',
    quickBacksInfo: 'The visitor opened a page and left again within seconds.',
    scriptErrors: 'JavaScript errors',
    scriptErrorsInfo: 'A JavaScript error occurred on the page during the session.',
    errorClicks: 'Error clicks',
    errorClicksInfo: 'A click Clarity detected right where a script error happened.',
    technology: 'Technology & location',
    technologyInfo: 'How visitors’ browser, device, operating system and country break down, by sessions.',
    browsers: 'Browsers',
    devices: 'Devices',
    os: 'OS',
    countries: 'Countries',
    acquisition: 'Acquisition',
    acquisitionInfo:
      'How visitors arrived. Channel: the broad type (search, direct, social, referral). Source: the specific site or search engine. Medium: organic, paid, or referral. Campaign: a tagged campaign name.',
    channel: 'Channel',
    source: 'Source',
    medium: 'Medium',
    campaign: 'Campaign',
    topPages: 'Top pages',
    topPagesInfo: 'The most-visited pages, with their average scroll depth and active time.',
    page: 'Page',
    share: 'Share',
    scroll: 'Scroll',
    active: 'Active time',
    sessionsUnit: 'sessions',
    other: 'Other',
    noData: 'No data in this period.',
    note: 'Clarity allows 10 requests a day: the overview refreshes every 4 hours, browsers, OS and acquisition every 12 hours — on the first visit after that. Live users, recordings, heatmaps and funnels are in Clarity.',
    updated: (at: string) => `Updated ${at}`,
    next: (at: string) => `next from ${at}`,
    details: (at: string) => `Browsers, OS & acquisition updated ${at}.`,
    empty: 'No visits recorded yet.',
    emptyHelp:
      'Clarity starts counting once the website with its tracking code is live. Data usually appears a few hours after the first visits.',
    unconfigured: 'Clarity is not connected.',
    unconfiguredHelp: 'Set CLARITY_API_TOKEN (Clarity → Settings → Data Export) in the CMS environment.',
    error: 'Could not load the statistics.',
    recheck: 'Check again',
    rechecking: 'Checking…',
    checked: (m: number) => (m < 1 ? 'Checked just now' : `Checked ${m} min ago`),
    checkedHours: (h: number) => `Checked ${h} h ago`,
    wait: (m: number) => `available again in ${m} min`,
    s: 's',
    min: 'min',
  },
  id: {
    title: 'Statistik',
    lead: 'Siapa yang mengunjungi website, dari mana, dan bagaimana mereka memakainya — 3 hari terakhir, dari Microsoft Clarity.',
    open: 'Buka Clarity',
    demo: 'Data contoh (pratinjau lokal)',
    sessions: 'Kunjungan',
    sessionsInfo:
      'Satu kunjungan ke website. Beberapa halaman yang dibuka pengunjung yang sama dalam sekitar 30 menit dihitung sebagai satu kunjungan.',
    botsExcluded: (n: string) => `${n} kunjungan bot tidak dihitung`,
    pagesPerSession: 'Halaman per kunjungan',
    pagesPerSessionInfo: 'Rata-rata jumlah halaman yang dibuka dalam satu kunjungan.',
    average: 'rata-rata',
    scrollDepth: 'Kedalaman scroll',
    scrollDepthInfo: 'Rata-rata seberapa jauh pengunjung men-scroll halaman ke bawah.',
    activeTime: 'Waktu aktif',
    activeTimeInfo:
      'Waktu pengunjung benar-benar berinteraksi dengan halaman — scroll, klik, mengetik — bukan sekadar membuka tab.',
    outOf: (t: string) => `dari ${t} total waktu`,
    users: 'Ringkasan pengunjung',
    uniqueUsers: 'Pengunjung unik',
    uniqueUsersInfo:
      'Orang yang berkunjung, dihitung sekali walau datang berkali-kali. Perkiraan: Clarity menghitungnya per rincian data, jadi dipakai yang paling kecil dari ketiganya.',
    perUser: 'Kunjungan per pengunjung',
    perUserInfo: 'Kunjungan dibagi pengunjung unik — rata-rata berapa kali tiap pengunjung datang kembali.',
    byDevice: 'Kunjungan per perangkat',
    insights: 'Insight',
    insightsInfo: 'Tanda-tanda pengalaman yang membuat pengunjung frustrasi, terdeteksi otomatis dari persentase kunjungan.',
    rageClicks: 'Rage click',
    rageClicksInfo: 'Beberapa klik cepat berturut-turut di tempat yang sama — biasanya tanda sesuatu terlihat bisa diklik, padahal tidak.',
    deadClicks: 'Dead click',
    deadClicksInfo: 'Klik yang tidak menimbulkan reaksi apa pun di halaman.',
    excessiveScroll: 'Scroll berlebihan',
    excessiveScrollInfo: 'Scroll cepat dan berulang — tanda pengunjung kesulitan mencari sesuatu.',
    quickBacks: 'Quick back',
    quickBacksInfo: 'Pengunjung membuka halaman lalu langsung pergi lagi dalam hitungan detik.',
    scriptErrors: 'Error JavaScript',
    scriptErrorsInfo: 'Terjadi error JavaScript di halaman selama kunjungan berlangsung.',
    errorClicks: 'Klik error',
    errorClicksInfo: 'Klik yang terdeteksi Clarity tepat saat terjadi error JavaScript.',
    technology: 'Teknologi & lokasi',
    technologyInfo: 'Rincian browser, perangkat, sistem operasi, dan negara pengunjung, dihitung dari kunjungan.',
    browsers: 'Browser',
    devices: 'Perangkat',
    os: 'OS',
    countries: 'Negara',
    acquisition: 'Sumber kunjungan',
    acquisitionInfo:
      'Bagaimana pengunjung datang. Channel: jenis besarnya (pencarian, langsung, sosial, referral). Source: situs atau mesin pencari spesifiknya. Medium: organik, berbayar, atau referral. Campaign: nama kampanye yang ditandai.',
    channel: 'Channel',
    source: 'Sumber',
    medium: 'Medium',
    campaign: 'Kampanye',
    topPages: 'Halaman teratas',
    topPagesInfo: 'Halaman yang paling banyak dikunjungi, beserta rata-rata kedalaman scroll dan waktu aktifnya.',
    page: 'Halaman',
    share: 'Porsi',
    scroll: 'Scroll',
    active: 'Waktu aktif',
    sessionsUnit: 'kunjungan',
    other: 'Lainnya',
    noData: 'Tidak ada data di periode ini.',
    note: 'Clarity membatasi 10 permintaan per hari: ringkasan diperbarui tiap 4 jam, browser, OS, dan sumber kunjungan tiap 12 jam — saat halaman ini dibuka setelahnya. Live users, rekaman, heatmap, dan funnel ada di Clarity.',
    updated: (at: string) => `Diperbarui ${at}`,
    next: (at: string) => `berikutnya mulai ${at}`,
    details: (at: string) => `Browser, OS & sumber kunjungan diperbarui ${at}.`,
    empty: 'Belum ada kunjungan tercatat.',
    emptyHelp:
      'Clarity mulai menghitung setelah website dengan kode pelacaknya tayang. Data biasanya muncul beberapa jam setelah kunjungan pertama.',
    unconfigured: 'Clarity belum terhubung.',
    unconfiguredHelp: 'Isi CLARITY_API_TOKEN (Clarity → Settings → Data Export) di environment CMS.',
    error: 'Statistik tidak bisa dimuat.',
    recheck: 'Cek lagi',
    rechecking: 'Mengecek…',
    checked: (m: number) => (m < 1 ? 'Dicek barusan' : `Dicek ${m} mnt lalu`),
    checkedHours: (h: number) => `Dicek ${h} jam lalu`,
    wait: (m: number) => `bisa dicek lagi dalam ${m} mnt`,
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

function Kpi({ label, value, hint, info }: { label: string; value: string; hint?: string; info?: string }) {
  return (
    <div className="falah-stat-card">
      <span className="falah-stat-card__label">
        {label}
        {info ? <Info text={info} /> : null}
      </span>
      <strong className="falah-stat-card__value">{value}</strong>
      {hint ? <span className="falah-stat-card__hint">{hint}</span> : null}
    </div>
  )
}

function InsightRow({
  label,
  info,
  value,
  unit,
  locale,
}: {
  label: string
  info: string
  value: Insight | null
  unit: string
  locale: string
}) {
  return (
    <li className="falah-insight">
      <span className="falah-insight__label">
        {label}
        <Info text={info} />
      </span>
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
          info={t.sessionsInfo}
        />
        <Kpi
          label={t.pagesPerSession}
          value={stats.pagesPerSession != null ? (Math.round(stats.pagesPerSession * 100) / 100).toString() : '—'}
          hint={t.average}
          info={t.pagesPerSessionInfo}
        />
        <Kpi
          label={t.scrollDepth}
          value={stats.scrollDepth != null ? pct(stats.scrollDepth) : '—'}
          hint={t.average}
          info={t.scrollDepthInfo}
        />
        <Kpi
          label={t.activeTime}
          value={duration(stats.activeSeconds, t)}
          hint={stats.totalSeconds != null ? t.outOf(duration(stats.totalSeconds, t)) : undefined}
          info={t.activeTimeInfo}
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
                <span>
                  {t.uniqueUsers}
                  <Info text={t.uniqueUsersInfo} />
                </span>
              </div>
            </div>
            <div className="falah-users__big">
              <span className="falah-users__icon falah-users__icon--repeat" aria-hidden />
              <div>
                <strong>{stats.users ? (Math.round((stats.sessions / stats.users) * 100) / 100).toString() : '—'}</strong>
                <span>
                  {t.perUser}
                  <Info text={t.perUserInfo} />
                </span>
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
            <h2>
              {t.insights}
              <Info text={t.insightsInfo} />
            </h2>
          </div>
          <ul className="falah-insights">
            <InsightRow
              label={t.rageClicks}
              info={t.rageClicksInfo}
              value={insights.rageClicks}
              unit={t.sessionsUnit}
              locale={locale}
            />
            <InsightRow
              label={t.deadClicks}
              info={t.deadClicksInfo}
              value={insights.deadClicks}
              unit={t.sessionsUnit}
              locale={locale}
            />
            <InsightRow
              label={t.excessiveScroll}
              info={t.excessiveScrollInfo}
              value={insights.excessiveScroll}
              unit={t.sessionsUnit}
              locale={locale}
            />
            <InsightRow
              label={t.quickBacks}
              info={t.quickBacksInfo}
              value={insights.quickBacks}
              unit={t.sessionsUnit}
              locale={locale}
            />
            <InsightRow
              label={t.scriptErrors}
              info={t.scriptErrorsInfo}
              value={insights.scriptErrors}
              unit={t.sessionsUnit}
              locale={locale}
            />
            <InsightRow
              label={t.errorClicks}
              info={t.errorClicksInfo}
              value={insights.errorClicks}
              unit={t.sessionsUnit}
              locale={locale}
            />
          </ul>
        </section>

        <StatsTabs
          title={t.technology}
          info={t.technologyInfo}
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
          info={t.acquisitionInfo}
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
            <h2>
              {t.topPages}
              <Info text={t.topPagesInfo} />
            </h2>
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

function Recheck({ fetchedAt, t }: { fetchedAt: number; t: T }) {
  // Server-rendered per request, so reading the clock here is fine.
  // eslint-disable-next-line react-hooks/purity
  const age = Date.now() - fetchedAt
  const minutes = Math.floor(age / 60_000)
  const left = Math.ceil((RECHECK_COOLDOWN_MS - age) / 60_000)
  return (
    <StatsRecheck
      checked={minutes >= 120 ? t.checkedHours(Math.floor(minutes / 60)) : t.checked(minutes)}
      label={t.recheck}
      busy={t.rechecking}
      wait={left > 0 ? t.wait(left) : null}
    />
  )
}

/** "14:05 WIB", or "3 Okt 14:05 WIB" when not today (Jakarta time). */
function clock(at: number, locale: string) {
  const zone = { timeZone: 'Asia/Jakarta' } as const
  const day = (d: number) => new Date(d).toLocaleDateString('en-CA', zone)
  const today = day(Date.now()) === day(at)
  const text = new Intl.DateTimeFormat(locale, {
    ...zone,
    ...(today ? {} : { day: 'numeric', month: 'short' }),
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(at)
  return `${text} WIB`
}

/** The admin home: website statistics from Microsoft Clarity (replaces Payload's default dashboard). */
export async function StatsDashboard({ i18n }: AdminViewServerProps) {
  const lang = i18n.language === 'id' ? 'id' : 'en'
  const t = TEXT[lang]
  const locale = lang === 'id' ? 'id-ID' : 'en-US'
  const result = await getClarityStats()

  return (
    <div className="falah-stats">
      {/* Without a crumb Payload renders a bare logo; this gives the themed pills. */}
      <SetStepNav nav={[{ label: t.title }]} />
      <header className="falah-stats__head">
        <div>
          <h1>
            {t.title}
            {result.status === 'ok' && result.demo ? <span className="falah-stats__demo">{t.demo}</span> : null}
          </h1>
          <p>{t.lead}</p>
          {result.status === 'ok' && result.fetchedAt ? (
            <p className="falah-stats__updated">
              <span className="falah-stats__updated-dot" />
              {t.updated(clock(result.fetchedAt, locale))}
              <span className="falah-stats__updated-next">
                · {t.next(clock(result.fetchedAt + OVERVIEW_EVERY_MS, locale))}
              </span>
            </p>
          ) : null}
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
          {result.status === 'empty' && result.fetchedAt ? <Recheck fetchedAt={result.fetchedAt} t={t} /> : null}
        </div>
      )}
      <p className="falah-stats__note">
        {result.status === 'ok' && result.detailsAt ? `${t.details(clock(result.detailsAt, locale))} ` : null}
        {t.note}
      </p>
    </div>
  )
}
