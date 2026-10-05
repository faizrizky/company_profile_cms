'use client'

import { Hamburger, Link, NavGroup, useNav } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'

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

  const activeId = groups
    .flatMap((g) => g.items)
    .find(
      (item) =>
        pathname.startsWith(item.href) && ['/', undefined].includes(pathname[item.href.length]),
    )?.id
  // The tab moves the moment an item is clicked, before the page has loaded.
  // Remembered with the page it was clicked on: once the new page is in, the path decides.
  const [clicked, setClicked] = useState<{ id: string; from: string } | null>(null)
  const selected = clicked && clicked.from === pathname ? clicked.id : activeId
  const tab = useSlidingTab(navRef, selected, rail)

  const className = [
    'nav',
    navOpen && 'nav--nav-open',
    rail && 'nav--rail',
    shouldAnimate && 'nav--nav-animate',
    hydrated && 'nav--nav-hydrated',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <aside className={className} inert={!navOpen && isMobile ? true : undefined}>
      <div className="nav__scroll" ref={navRef}>
        <nav className="nav__wrap">
          {/* One tab for the whole menu: it slides to the selected item. */}
          <span ref={tab} className="nav__tab" aria-hidden />
          {groups.map((group) => (
            <NavGroup key={group.label} isOpen={group.open} label={group.label}>
              {group.items.map((item) => {
                const isActive = item.id === activeId
                return (
                  <Link
                    key={item.id}
                    id={item.id}
                    className="nav__link"
                    href={item.href}
                    prefetch={false}
                    data-falah-tooltip={rail ? item.label : undefined}
                    aria-current={isActive ? 'page' : undefined}
                    data-selected={item.id === selected ? '' : undefined}
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) setClicked({ id: item.id, from: pathname })
                    }}
                  >
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
 * Places the menu's single tab over the selected item and keeps it there
 * (groups opening and closing, the rail, resizing). It glides between items;
 * the first placement and placements while the menu itself moves are instant.
 */
function useSlidingTab(
  scrollRef: React.RefObject<HTMLDivElement | null> | undefined,
  selected: string | undefined,
  rail: boolean,
) {
  const tab = useRef<HTMLSpanElement>(null)
  const placed = useRef(false)
  const lastSelected = useRef<string | undefined>(undefined)

  const place = useCallback(
    (animate: boolean) => {
      const el = tab.current
      const wrap = el?.parentElement
      const link = selected ? document.getElementById(selected) : null
      if (!el || !wrap) return
      const box = link?.getBoundingClientRect()
      // Inside a closed group (no height) or not found: hide the tab.
      if (!link || !box || box.height < 4) {
        el.style.opacity = '0'
        return
      }
      const origin = wrap.getBoundingClientRect()
      el.classList.toggle('nav__tab--instant', !animate || !placed.current)
      el.style.opacity = '1'
      el.style.transform = `translateY(${box.top - origin.top}px)`
      el.style.left = `${box.left - origin.left}px`
      el.style.width = `${box.width}px`
      el.style.height = `${box.height}px`
      placed.current = true
    },
    [selected],
  )

  // A new item selected: glide there.
  useLayoutEffect(() => {
    const moved = lastSelected.current !== undefined && lastSelected.current !== selected
    lastSelected.current = selected
    place(moved)
  }, [place, selected])

  // Rail / open menu: the items change size, follow without gliding.
  useLayoutEffect(() => {
    place(false)
  }, [place, rail])

  // Groups expanding / collapsing and window resizes move the items.
  useEffect(() => {
    const wrap = tab.current?.parentElement
    if (!wrap) return
    let frame = 0
    const follow = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => place(false))
    }
    const observer = new ResizeObserver(follow)
    observer.observe(wrap)
    if (scrollRef?.current) observer.observe(scrollRef.current)
    window.addEventListener('resize', follow)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', follow)
    }
  }, [place, scrollRef])

  return tab
}
