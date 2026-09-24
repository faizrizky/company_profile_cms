'use client'

import { getTranslation } from '@payloadcms/translations'
import {
  Link,
  useAuth,
  useConfig,
  useLocale,
  useRouteTransition,
  useTranslation,
} from '@payloadcms/ui'
import { usePathname, useRouter } from 'next/navigation'
import { formatAdminURL } from 'payload/shared'
import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'

import type { User } from '@/payload-types'

import { flags } from '../flags'

const greeting: Record<string, string> = { en: 'Hello', id: 'Halo' }
// Admin UI languages — keep in sync with `i18n.supportedLanguages` in payload.config.ts.
const languages = ['en', 'id'] as const
const languageTitle: Record<string, string> = { en: 'Interface language', id: 'Bahasa tampilan' }
const contentTitle: Record<string, string> = { en: 'Content language', id: 'Bahasa konten' }
const languageNames: Record<string, string> = { en: 'English', id: 'Indonesia' }
const roleLabel: Record<string, Record<string, string>> = {
  en: { admin: 'Administrator', editor: 'Editor' },
  id: { admin: 'Administrator', editor: 'Editor' },
}

type LanguageOption = { code: string; label: string; active: boolean }

/** A titled segmented control of flag + language name options. */
function LanguageSection({
  title,
  options,
  onSelect,
}: {
  title: string
  options: LanguageOption[]
  onSelect: (code: string) => void
}) {
  return (
    <div className="falah-account__langs" role="group" aria-label={title}>
      <span className="falah-account__section">{title}</span>
      <div className="falah-account__lang-options">
        {options.map(({ code, label, active }) => {
          const Flag = flags[code]
          return (
            <button
              key={code}
              type="button"
              role="menuitemradio"
              aria-checked={active}
              className={`falah-account__lang${active ? ' is-active' : ''}`}
              onClick={() => onSelect(code)}
            >
              <span className="falah-account__flag">{Flag ? <Flag /> : null}</span>
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  return (
    ((parts[0]?.[0] ?? '') + (parts.length > 1 ? (parts.at(-1)?.[0] ?? '') : '')).toUpperCase() ||
    '?'
  )
}

/**
 * Account block at the foot of the sidebar: avatar + greeting, opening a small
 * menu (interface & content language, account settings, log out). The menu is portalled to <body> and
 * fixed-positioned so it can sit beside the rail without being clipped by the
 * sidebar's scroll area or picking up its link colours.
 */
export function NavAccount({ compact }: { compact: boolean }) {
  const { user } = useAuth<User>()
  const { config } = useConfig()
  const { i18n, switchLanguage, t } = useTranslation()
  const contentLocale = useLocale()
  const router = useRouter()
  const { startRouteTransition } = useRouteTransition()
  const pathname = usePathname()
  const menuId = useId()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  // The menu belongs to the screen it was opened on: navigating or toggling
  // the rail closes it without an extra effect.
  const screen = `${pathname}|${compact}`
  const [menu, setMenu] = useState<{ screen: string; style: CSSProperties } | null>(null)
  const position = menu?.screen === screen ? menu.style : null

  const close = () => setMenu(null)

  useEffect(() => {
    if (!position) return
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node
      if (!menuRef.current?.contains(target) && !buttonRef.current?.contains(target)) close()
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', close)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', close)
    }
  }, [position])

  if (!user) return null

  const lang = i18n.language in greeting ? i18n.language : 'en'
  const name = user.name?.trim() || user.email.split('@')[0]
  const role = user.roles?.includes('admin') ? 'admin' : 'editor'
  const { admin: adminRoute } = config.routes
  const accountHref = formatAdminURL({ adminRoute, path: config.admin.routes.account })
  const logoutHref = formatAdminURL({ adminRoute, path: config.admin.routes.logout })

  const changeLanguage = (code: string) => {
    const language = languages.find((l) => l === code)
    if (!language || language === i18n.language || !switchLanguage) return
    close()
    // Saved to the user's preferences; Payload re-renders the admin in it.
    void switchLanguage(language)
  }

  // Which language's copy is being edited — the `?locale=` param, exactly as
  // Payload's own localizer switches it (every other query param is kept).
  const contentLocales = config.localization ? config.localization.locales : []
  const changeContentLocale = (code: string) => {
    if (code === contentLocale.code) return
    close()
    const params = new URLSearchParams(window.location.search)
    params.set('locale', code)
    startRouteTransition(() => router.push(`?${params.toString()}`))
  }

  const toggle = () => {
    if (position) return close()
    const rect = buttonRef.current?.getBoundingClientRect()
    if (!rect) return
    // Beside the rail when collapsed, above the block when expanded.
    setMenu({
      screen,
      style: compact
        ? { left: rect.right + 24, bottom: window.innerHeight - rect.bottom }
        : { left: rect.left, bottom: window.innerHeight - rect.top + 8, minWidth: rect.width },
    })
  }

  return (
    <div className={`falah-account${compact ? ' falah-account--compact' : ''}`}>
      <button
        ref={buttonRef}
        type="button"
        className="falah-account__button"
        onClick={toggle}
        aria-expanded={Boolean(position)}
        aria-controls={menuId}
        aria-haspopup="menu"
        title={compact ? `${name} — ${user.email}` : undefined}
      >
        <span className="falah-account__avatar" aria-hidden>
          {initials(name)}
        </span>
        {compact ? (
          <span className="sr-only">{name}</span>
        ) : (
          <>
            <span className="falah-account__text">
              <span className="falah-account__name">
                {greeting[lang]}, {name}
              </span>
              <span className="falah-account__role">{roleLabel[lang]?.[role]}</span>
            </span>
            <svg className="falah-account__chevron" viewBox="0 0 24 24" aria-hidden>
              <path d="m18 15-6-6-6 6" />
            </svg>
          </>
        )}
      </button>

      {position
        ? createPortal(
            <div
              ref={menuRef}
              id={menuId}
              role="menu"
              className="falah-account__menu"
              style={position}
            >
              <div className="falah-account__menu-head">
                <span className="falah-account__menu-name">{name}</span>
                <span className="falah-account__menu-email">{user.email}</span>
              </div>
              {switchLanguage ? (
                <LanguageSection
                  title={languageTitle[lang]}
                  options={languages.map((code) => ({
                    code,
                    label: languageNames[code],
                    active: code === i18n.language,
                  }))}
                  onSelect={changeLanguage}
                />
              ) : null}
              {contentLocales.length > 1 ? (
                <LanguageSection
                  title={contentTitle[lang]}
                  options={contentLocales.map((locale) => ({
                    code: locale.code,
                    label: languageNames[locale.code] ?? getTranslation(locale.label, i18n),
                    active: locale.code === contentLocale.code,
                  }))}
                  onSelect={changeContentLocale}
                />
              ) : null}
              <Link
                role="menuitem"
                href={accountHref}
                className="falah-account__item"
                prefetch={false}
              >
                <svg viewBox="0 0 24 24" aria-hidden>
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" />
                </svg>
                {t('authentication:account')}
              </Link>
              <a
                role="menuitem"
                href={logoutHref}
                className="falah-account__item falah-account__item--danger"
              >
                <svg viewBox="0 0 24 24" aria-hidden>
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <path d="m16 17 5-5-5-5" />
                  <path d="M21 12H9" />
                </svg>
                {t('authentication:logOut')}
              </a>
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}
