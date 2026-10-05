'use client'

import { Hamburger, Link, NavGroup, useNav } from '@payloadcms/ui'
import { usePathname, useRouter } from 'next/navigation'
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
  const router = useRouter()
  const isMobile = useIsMobile()
  const rail = !navOpen && !isMobile

  // Clicking another item slides a copy of the active tab over to it (the page
  // loads meanwhile). Remembered with the page it started on: once the new page
  // is in, its own active tab takes over and the sliding copy is gone.
  // It also finishes its glide if the page arrives first.
  // The new page is opened once the tab has landed: loading it meanwhile would
  // make the glide stutter and cut it short.
  const [slide, setSlide] = useState<{ fromId?: string; toId: string; href: string; path: string } | null>(
    null,
  )
  const sliding = slide && slide.path === pathname ? slide : null
  const tabRef = useSlidingTab(sliding, (href) => router.push(href))

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
            <span ref={tabRef} className="nav__tab" aria-hidden>
              {/* Body and the two concave corners, each with the page backdrop inside. */}
              {['body', 'top', 'bottom'].map((part) => (
                <span key={part} className={`nav__tab-part nav__tab-part--${part}`}>
                  <span className="nav__tab-bg" />
                </span>
              ))}
            </span>
          ) : null}
          {groups.map((group) => (
            <NavGroup key={group.label} isOpen={group.open} label={group.label}>
              {group.items.map((item) => {
                // The home is only active on the home itself (every admin path starts with it).
                const isActive =
                  item.id === 'nav-statistics'
                    ? pathname === item.href || pathname === `${item.href}/`
                    : pathname.startsWith(item.href) && ['/', undefined].includes(pathname[item.href.length])
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
                      if (sliding) {
                        e.preventDefault()
                        return
                      }
                      const from = document.querySelector<HTMLElement>('.nav__link[aria-current="page"]')
                      if (!from) return
                      e.preventDefault()
                      setSlide({ fromId: from.id, toId: item.id, href: item.href, path: pathname })
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
 * reference's motion (measured frame by frame): it backs up 5px, shoots 5px
 * past the item, slows to a stop there, then eases back and settles — 0.5s.
 *
 * It moves with `transform` so it runs on the compositor and stays smooth
 * while the next page is being prepared. The page backdrop inside each part
 * moves the opposite way on the same curve, so it stays still on screen and
 * the tab keeps exactly the page's colour.
 */
function useSlidingTab(
  slide: { fromId?: string; toId: string; href: string } | null,
  onDone: (href: string) => void,
) {
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
    if (!to) {
      onDone(slide.href)
      return
    }
    const from = rectOf(slide.fromId) ?? to
    Object.assign(tab.style, {
      top: '0px',
      left: `${to.left}px`,
      width: `${to.width}px`,
      height: `${to.height}px`,
      transform: `translateY(${to.top}px)`,
    })

    // Each part's backdrop is a viewport-sized layer lined up with the viewport
    // for where the tab is drawn at translateY(0); it then counter-moves.
    const bgs = [...tab.querySelectorAll<HTMLElement>('.nav__tab-bg')]
    tab.style.transform = 'translateY(0px)'
    for (const bg of bgs) {
      const part = bg.parentElement!.getBoundingClientRect()
      Object.assign(bg.style, {
        left: `${-part.left}px`,
        top: `${-part.top}px`,
        width: `${document.documentElement.clientWidth}px`,
        height: `${window.innerHeight}px`,
        transform: `translateY(${-to.top}px)`,
      })
    }
    tab.style.transform = `translateY(${to.top}px)`

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (still || from.top === to.top) {
      onDone(slide.href)
      return
    }
    // The reference backs up and overshoots by ~5px (on a 56px step); kept at
    // 5px whatever the distance, so long jumps don't swing far past the item.
    const dir = Math.sign(to.top - from.top)
    const stops = [
      { y: from.top, offset: 0, easing: 'cubic-bezier(0.3, 0, 0.4, 1)' },
      { y: from.top - dir * 5, offset: 0.17, easing: 'cubic-bezier(0.55, 0, 0.25, 1)' },
      { y: to.top + dir * 5, offset: 0.7, easing: 'cubic-bezier(0.45, 0, 0.55, 1)' },
      { y: to.top, offset: 1, easing: 'linear' },
    ]
    const timing = { duration: 500 }
    const animation = tab.animate(
      stops.map((k) => ({ transform: `translateY(${k.y}px)`, offset: k.offset, easing: k.easing })),
      timing,
    )
    const counter = bgs.map((bg) =>
      bg.animate(
        stops.map((k) => ({ transform: `translateY(${-k.y}px)`, offset: k.offset, easing: k.easing })),
        timing,
      ),
    )
    animation.onfinish = () => onDone(slide.href)
    return () => {
      animation.cancel()
      counter.forEach((a) => a.cancel())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once per slide, not per re-render
  }, [key])

  return ref
}
