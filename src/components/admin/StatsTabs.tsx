'use client'

import { useState } from 'react'

import type { Ranked } from '@/lib/clarity'

type Tab = { key: string; label: string; rows: Ranked[] }

const COLORS = ['#1f7ae0', '#38bdf8', '#6366f1', '#14b8a6', '#f59e0b', '#94a3b8']

const fmt = (n: number, locale: string) => new Intl.NumberFormat(locale).format(Math.round(n))

/** Top 5 plus "Other", for the donut. */
function slices(rows: Ranked[], other: string): Ranked[] {
  if (rows.length <= 6) return rows
  const rest = rows.slice(5).reduce((s, r) => s + r.sessions, 0)
  return [...rows.slice(0, 5), { label: other, sessions: rest }]
}

function Donut({ rows }: { rows: Ranked[] }) {
  const total = rows.reduce((s, r) => s + r.sessions, 0) || 1
  const r = 52
  const c = 2 * Math.PI * r
  // Where each slice starts along the ring.
  const starts = rows.map((_, i) => rows.slice(0, i).reduce((sum, row) => sum + (row.sessions / total) * c, 0))
  return (
    <svg className="falah-donut" viewBox="0 0 140 140" aria-hidden>
      <circle cx="70" cy="70" r={r} className="falah-donut__track" />
      {rows.map((row, i) => {
        const length = (row.sessions / total) * c
        return (
          <circle
            key={row.label}
            cx="70"
            cy="70"
            r={r}
            stroke={COLORS[i % COLORS.length]}
            strokeDasharray={`${Math.max(length - 2, 0)} ${c}`}
            strokeDashoffset={-starts[i]}
            className="falah-donut__slice"
          />
        )
      })}
    </svg>
  )
}

/**
 * A card with tabs (Browsers / Devices / OS / Countries, or Channel / Source /
 * …). `donut` shows the share as a ring with a legend; `bars` as bar rows.
 */
export function StatsTabs({
  title,
  tabs,
  variant,
  locale,
  labels,
}: {
  title: string
  tabs: Tab[]
  variant: 'donut' | 'bars'
  locale: string
  labels: { sessions: string; empty: string; other: string }
}) {
  const available = tabs.filter((t) => t.rows.length > 0)
  const [active, setActive] = useState(available[0]?.key ?? tabs[0]?.key)
  const tab = tabs.find((t) => t.key === active) ?? tabs[0]
  const rows = variant === 'donut' ? slices(tab.rows, labels.other) : tab.rows
  const total = rows.reduce((s, r) => s + r.sessions, 0) || 1
  const max = Math.max(1, ...rows.map((r) => r.sessions))

  return (
    <section className="falah-stat-panel">
      <div className="falah-stat-panel__head">
        <h2>{title}</h2>
        <div className="falah-stat-tabs" role="tablist">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={t.key === active}
              className="falah-stat-tabs__tab"
              onClick={() => setActive(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="falah-stat-panel__empty">{labels.empty}</p>
      ) : variant === 'donut' ? (
        <div className="falah-stat-donut">
          <Donut rows={rows} />
          <ol className="falah-stat-legend">
            {rows.map((row, i) => (
              <li key={row.label}>
                <span className="falah-stat-legend__dot" style={{ background: COLORS[i % COLORS.length] }} />
                <span className="falah-stat-legend__label" title={row.label}>
                  {row.label}
                </span>
                <span className="falah-stat-legend__pct">{Math.round((row.sessions / total) * 1000) / 10}%</span>
                <span className="falah-stat-legend__value">
                  {fmt(row.sessions, locale)} {labels.sessions}
                </span>
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <ol className="falah-stat-bars">
          {rows.map((row) => (
            <li key={row.label}>
              <div className="falah-stat-bar__head">
                <span className="falah-stat-bar__label" title={row.label}>
                  {row.label}
                </span>
                <span className="falah-stat-bar__value">
                  {fmt(row.sessions, locale)} · {Math.round((row.sessions / total) * 100)}%
                </span>
              </div>
              <span className="falah-stat-bar__track">
                <span style={{ width: `${(row.sessions / max) * 100}%` }} />
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
