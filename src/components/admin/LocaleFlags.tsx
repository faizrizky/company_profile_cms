'use client'

import { getTranslation } from '@payloadcms/translations'
import { useConfig, useLocale, useRouteTransition, useTranslation } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import { useId, type JSX } from 'react'

function FlagId() {
  return (
    <svg viewBox="0 0 30 30" aria-hidden>
      <rect width="30" height="15" fill="#ce1126" />
      <rect y="15" width="30" height="15" fill="#fff" />
    </svg>
  )
}

function FlagGb() {
  const clip = useId()
  return (
    <svg viewBox="15 0 30 30" aria-hidden>
      <clipPath id={clip}>
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path
        d="M0,0 L60,30 M60,0 L0,30"
        clipPath={`url(#${clip})`}
        stroke="#c8102e"
        strokeWidth="4"
      />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#c8102e" strokeWidth="6" />
    </svg>
  )
}

const flags: Record<string, () => JSX.Element> = { en: FlagGb, id: FlagId }

/**
 * Content-language switch shown as flags in the top bar (replaces Payload's
 * "Locale: English" dropdown). Switching keeps every other query param, the
 * same way Payload's own localizer does.
 */
export function LocaleFlags() {
  const { config } = useConfig()
  const { i18n } = useTranslation()
  const current = useLocale()
  const router = useRouter()
  const { startRouteTransition } = useRouteTransition()

  if (!config.localization) return null

  const select = (code: string) => {
    if (code === current.code) return
    const params = new URLSearchParams(window.location.search)
    params.set('locale', code)
    startRouteTransition(() => router.push(`?${params.toString()}`))
  }

  return (
    <div
      className="falah-flags"
      role="group"
      aria-label={i18n.language === 'id' ? 'Bahasa konten' : 'Content language'}
    >
      {config.localization.locales.map((locale) => {
        const Flag = flags[locale.code]
        const label = getTranslation(locale.label, i18n)
        const active = locale.code === current.code
        return (
          <button
            key={locale.code}
            type="button"
            className={`falah-flags__btn${active ? ' is-active' : ''}`}
            aria-pressed={active}
            title={label}
            onClick={() => select(locale.code)}
          >
            {Flag ? (
              <Flag />
            ) : (
              <span className="falah-flags__code">{locale.code.toUpperCase()}</span>
            )}
            <span className="sr-only">{label}</span>
          </button>
        )
      })}
    </div>
  )
}
