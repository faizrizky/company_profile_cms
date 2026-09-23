'use client'

import { getTranslation } from '@payloadcms/translations'
import { useConfig, useLocale, useRouteTransition, useTranslation } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'

import { flags } from './flags'

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
