'use client'

import { useConfig } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'

import { ACCOUNT_SECTION, INTRO_SECTION, pathSection, stepSection } from '@/tutorial/sections'
import type { TutorialStep } from '@/tutorial/steps'

import { useAdminText } from '../useAdminText'
import { TUTORIAL_TEXT } from './text'

type Part = { id: string; label: string; count: number }

/** Label of a sidebar item, as the sidebar shows it (its language, its name). */
const navLabel = (id: string) =>
  document.getElementById(id)?.querySelector('.nav__link-label')?.textContent?.trim() || null

/**
 * "Which tutorial?": the whole tour, or the part about one page of the
 * sidebar — in the sidebar's order, the page you're on marked.
 */
export function TutorialChooser({
  steps,
  onPick,
  onClose,
}: {
  steps: TutorialStep[]
  onPick: (section: string | null) => void
  onClose: () => void
}) {
  const t = useAdminText(TUTORIAL_TEXT)
  const { config } = useConfig()
  const pathname = usePathname()
  const titleId = useId()
  const firstRef = useRef<HTMLButtonElement>(null)

  const here = pathSection(pathname.slice(config.routes.admin.length))
  const parts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const step of steps) {
      const id = stepSection(step)
      counts.set(id, (counts.get(id) ?? 0) + 1)
    }
    // The sidebar's order; what isn't in it (introduction first, account last) around it.
    const navOrder = [...document.querySelectorAll('.nav [id^="nav-"]')].map((el) => el.id)
    const rank = (id: string) =>
      id === INTRO_SECTION ? -1 : navOrder.includes(id) ? navOrder.indexOf(id) : navOrder.length
    const list: Part[] = [...counts].flatMap(([id, count]) => {
      const label =
        id === INTRO_SECTION ? t.partIntro : id === ACCOUNT_SECTION ? t.partAccount : navLabel(id)
      // A page that isn't in this user's sidebar has nothing to show them.
      return label ? [{ id, label, count }] : []
    })
    return list.sort((a, b) => rank(a.id) - rank(b.id))
    // The sidebar is rendered by the time the chooser opens.
  }, [steps, t])

  useEffect(() => {
    firstRef.current?.focus({ preventScroll: true })
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return createPortal(
    <div className="falah-tour-chooser" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <div className="falah-tour-chooser__backdrop" onClick={onClose} aria-hidden />
      <div className="falah-tour-chooser__card">
        <div className="falah-tour__meta">
          <span className="falah-tour__badge">{t.tour}</span>
          <button type="button" className="falah-tour-chooser__close" onClick={onClose} aria-label={t.cancel}>
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
        <h2 id={titleId} className="falah-tour__title">
          {t.chooseTitle}
        </h2>
        <p className="falah-tour-chooser__help">{t.chooseHelp}</p>
        <button ref={firstRef} type="button" className="falah-tour-chooser__all" onClick={() => onPick(null)}>
          <span>{t.partAll}</span>
          <span className="falah-tour-chooser__count">{t.count(steps.length)}</span>
        </button>
        <ul className="falah-tour-chooser__list">
          {parts.map((part) => (
            <li key={part.id}>
              <button
                type="button"
                className={`falah-tour-chooser__part${part.id === here ? ' is-here' : ''}`}
                onClick={() => onPick(part.id)}
              >
                <span className="falah-tour-chooser__label">{part.label}</span>
                {part.id === here ? <span className="falah-tour-chooser__here">{t.partHere}</span> : null}
                <span className="falah-tour-chooser__count">{t.count(part.count)}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>,
    document.body,
  )
}
