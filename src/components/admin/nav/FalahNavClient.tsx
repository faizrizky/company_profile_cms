'use client'

import { Hamburger, Link, NavGroup, useNav } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'
import { useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'

import { NavAccount } from './NavAccount'

export type NavGroupData = {
  label: string
  open?: boolean
  items: { id: string; href: string; label: string }[]
}

const MOBILE_QUERY = '(max-width: 768px)'

function useIsMobile() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(MOBILE_QUERY)
      query.addEventListener('change', onChange)
      return () => query.removeEventListener('change', onChange)
    },
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false,
  )
}

/**
 * Open: grouped links with labels. Collapsed: an icon rail (labels become
 * tooltips) on tablet/desktop; on phones the nav is a full-screen sheet and
 * disappears completely when closed. Class names follow Payload's nav so its
 * layout rules and our theme in custom.scss keep applying.
 */
export function FalahNavClient({ groups }: { groups: NavGroupData[] }) {
  const { hydrated, navOpen, navRef, setNavOpen, shouldAnimate } = useNav()
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const rail = !navOpen && !isMobile

  // Clicking another item slides a copy of the active tab over to it (the page
  // loads meanwhile). Remembered with the page it started on: once the new page
  // is in, its own active tab takes over and the sliding copy is gone.
  // It also finishes its glide if the page arrives first.
  const [slide, setSlide] = useState<{
    fromId?: string
    toId: string
    path: string
    done: boolean
  } | null>(null)
  const sliding = slide && (slide.path === pathname || !slide.done) ? slide : null
  const tabRef = useSlidingTab(sliding, () => setSlide((s) => (s ? { ...s, done: true } : s)))

  const className = [
    'nav',
    navOpen && 'nav--nav-open',
    rail && 'nav--rail',
    shouldAnimate && 'nav--nav-animate',
    hydrated && 'nav--nav-hydrated',
    sliding && 'nav--sliding',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <aside className={className} inert={!navOpen && isMobile ? true : undefined}>
      <div className="nav__scroll" ref={navRef}>
        <nav className="nav__wrap">
          {sliding ? (
            <span ref={tabRef} className="nav__tab" aria-hidden />
          ) : null}
          {groups.map((group) => (
            <NavGroup key={group.label} isOpen={group.open} label={group.label}>
              {group.items.map((item) => {
                const isActive =
                  pathname.startsWith(item.href) &&
                  ['/', undefined].includes(pathname[item.href.length])
                return (
                  <Link
                    key={item.id}
                    id={item.id}
                    className="nav__link"
                    href={item.href}
                    prefetch={false}
                    data-falah-tooltip={rail ? item.label : undefined}
                    aria-current={isActive ? 'page' : undefined}
                    data-slide-target={sliding?.toId === item.id ? '' : undefined}
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      if (isActive || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
                      const from = document.querySelector<HTMLElement>('.nav__link[aria-current="page"]')
                      setSlide({ fromId: from?.id, toId: item.id, path: pathname, done: false })
                    }}
                  >
                    {isActive ? <div className="nav__link-indicator" /> : null}
                    <span className="nav__link-label">{item.label}</span>
                  </Link>
                )
              })}
            </NavGroup>
          ))}
        </nav>
        <NavAccount compact={rail} />
      </div>
      <div className="nav__header">
        <div className="nav__header-content">
          <button
            className="nav__mobile-close"
            onClick={() => setNavOpen(false)}
            tabIndex={navOpen ? undefined : -1}
            type="button"
          >
            <Hamburger isActive />
          </button>
        </div>
      </div>
    </aside>
  )
}

/**
 * Glides the tab from the item it leaves to the clicked one, along the
 * reference's motion (measured frame by frame): it backs up a little, shoots
 * past the item to 109% of the way, slows to a stop there, then eases back
 * and settles — 0.5s in all, no abrupt stop. `top` (not transform) moves it,
 * so its fixed page-coloured background stays aligned with the page.
 */
function useSlidingTab(slide: { fromId?: string; toId: string } | null, onDone: () => void) {
  const ref = useRef<HTMLSpanElement>(null)
  const key = slide ? `${slide.fromId}>${slide.toId}` : null

  useLayoutEffect(() => {
    const tab = ref.current
    const wrap = tab?.parentElement
    if (!tab || !wrap || !slide) return
    const rectOf = (id?: string) => {
      const el = id ? document.getElementById(id) : null
      const box = el?.getBoundingClientRect()
      const origin = wrap.getBoundingClientRect()
      return box && box.height > 4
        ? { top: box.top - origin.top, left: box.left - origin.left, width: box.width, height: box.height }
        : null
    }
    const to = rectOf(slide.toId)
    if (!to) return
    const from = rectOf(slide.fromId) ?? to
    tab.style.left = `${to.left}px`
    tab.style.width = `${to.width}px`
    tab.style.height = `${to.height}px`
    tab.style.top = `${to.top}px`

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (still || from.top === to.top) {
      onDone()
      return
    }
    const overshoot = from.top + (to.top - from.top) * 1.09
    const animation = tab.animate(
      [
        { top: `${from.top}px`, easing: 'cubic-bezier(0.8, -0.4, 0.4, 1)' },
        { top: `${overshoot}px`, offset: 0.7, easing: 'cubic-bezier(0.45, 0, 0.55, 1)' },
        { top: `${to.top}px` },
      ],
      { duration: 500 },
    )
    animation.onfinish = () => onDone()
    return () => animation.cancel()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once per slide, not per re-render
  }, [key])

  return ref
}
