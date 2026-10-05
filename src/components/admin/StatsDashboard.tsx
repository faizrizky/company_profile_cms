import type { AdminViewServerProps } from 'payload'

import { getClarityStats, type ClarityStats, type Ranked } from '@/lib/clarity'

const CLARITY_URL = `https://clarity.microsoft.com/projects/view/${process.env.CLARITY_PROJECT_ID || 'v03jaczk0n'}/dashboard`

const TEXT = {
  en: {
    title: 'Statistics',
    lead: 'Who visits the website, from where, and how they use it — last 3 days, from Microsoft Clarity.',
    open: 'Open Clarity',
    sessions: 'Visits',
    visitors: 'Visitors',
    pages: 'Pages per visit',
    active: 'Active time per visit',
    scroll: 'Average scroll depth',
    rage: 'Visits with rage clicks',
    dead: 'Visits with dead clicks',
    bots: (n: string) => `${n} bot visits are not counted`,
    topPages: 'Most visited pages',
    topCountries: 'Where visitors come from',
    topDevices: 'Devices',
    visits: 'visits',
    note: 'Numbers refresh every few hours (Clarity allows 10 requests a day). Session recordings and heatmaps are in Clarity.',
    empty: 'No visits recorded yet.',
    emptyHelp:
      'Clarity starts counting once the website with its tracking code is live. Data usually appears a few hours after the first visits.',
    unconfigured: 'Clarity is not connected.',
    unconfiguredHelp: 'Set CLARITY_API_TOKEN (Clarity → Settings → Data Export) in the CMS environment.',
    error: 'Could not load the statistics.',
    seconds: 's',
    minutes: 'm',
  },
  id: {
    title: 'Statistik',
    lead: 'Siapa yang mengunjungi website, dari mana, dan bagaimana mereka memakainya — 3 hari terakhir, dari Microsoft Clarity.',
    open: 'Buka Clarity',
    sessions: 'Kunjungan',
    visitors: 'Pengunjung',
    pages: 'Halaman per kunjungan',
    active: 'Waktu aktif per kunjungan',
    scroll: 'Rata-rata kedalaman scroll',
    rage: 'Kunjungan dengan rage click',
    dead: 'Kunjungan dengan dead click',
    bots: (n: string) => `${n} kunjungan bot tidak dihitung`,
    topPages: 'Halaman paling sering dikunjungi',
    topCountries: 'Asal pengunjung',
    topDevices: 'Perangkat',
    visits: 'kunjungan',
    note: 'Angka diperbarui setiap beberapa jam (Clarity membatasi 10 permintaan per hari). Rekaman sesi dan heatmap ada di Clarity.',
    empty: 'Belum ada kunjungan tercatat.',
    emptyHelp:
      'Clarity mulai menghitung setelah website dengan kode pelacaknya tayang. Data biasanya muncul beberapa jam setelah kunjungan pertama.',
    unconfigured: 'Clarity belum terhubung.',
    unconfiguredHelp: 'Isi CLARITY_API_TOKEN (Clarity → Settings → Data Export) di environment CMS.',
    error: 'Statistik tidak bisa dimuat.',
    seconds: 'dtk',
    minutes: 'mnt',
  },
}

type T = (typeof TEXT)['en']
const fmt = (n: number, locale: string) => new Intl.NumberFormat(locale).format(Math.round(n))

function duration(seconds: number, t: T) {
  return seconds >= 60 ? `${Math.floor(seconds / 60)} ${t.minutes} ${Math.round(seconds % 60)} ${t.seconds}` : `${Math.round(seconds)} ${t.seconds}`
}

function Card({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="falah-stat-card">
      <span className="falah-stat-card__label">{label}</span>
      <strong className="falah-stat-card__value">{value}</strong>
      {hint ? <span className="falah-stat-card__hint">{hint}</span> : null}
    </div>
  )
}

function Bars({ title, rows, unit, locale }: { title: string; rows: Ranked[]; unit: string; locale: string }) {
  const max = Math.max(1, ...rows.map((r) => r.sessions))
  const total = rows.reduce((s, r) => s + r.sessions, 0) || 1
  return (
    <section className="falah-stat-panel">
      <h2>{title}</h2>
      <ol>
        {rows.map((row) => (
          <li key={row.label}>
            <div className="falah-stat-bar__head">
              <span className="falah-stat-bar__label" title={row.label}>
                {row.label}
              </span>
              <span className="falah-stat-bar__value">
                {fmt(row.sessions, locale)} {unit} · {Math.round((row.sessions / total) * 100)}%
              </span>
            </div>
            <span className="falah-stat-bar__track">
              <span style={{ width: `${(row.sessions / max) * 100}%` }} />
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}

function Overview({ stats, t, locale }: { stats: ClarityStats; t: T; locale: string }) {
  return (
    <>
      <div className="falah-stat-cards">
        <Card
          label={t.sessions}
          value={fmt(stats.sessions, locale)}
          hint={stats.botSessions ? t.bots(fmt(stats.botSessions, locale)) : undefined}
        />
        <Card label={t.visitors} value={fmt(stats.visitors, locale)} />
        {stats.pagesPerSession != null && (
          <Card label={t.pages} value={(Math.round(stats.pagesPerSession * 10) / 10).toString()} />
        )}
        {stats.activeSeconds != null && <Card label={t.active} value={duration(stats.activeSeconds, t)} />}
        {stats.scrollDepth != null && <Card label={t.scroll} value={`${Math.round(stats.scrollDepth)}%`} />}
        {stats.rageClickPercent != null && <Card label={t.rage} value={`${Math.round(stats.rageClickPercent * 10) / 10}%`} />}
        {stats.deadClickPercent != null && <Card label={t.dead} value={`${Math.round(stats.deadClickPercent * 10) / 10}%`} />}
      </div>
      <div className="falah-stat-panels">
        <Bars title={t.topPages} rows={stats.topPages} unit={t.visits} locale={locale} />
        <Bars title={t.topCountries} rows={stats.topCountries} unit={t.visits} locale={locale} />
        <Bars title={t.topDevices} rows={stats.topDevices} unit={t.visits} locale={locale} />
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
          <h1>{t.title}</h1>
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
