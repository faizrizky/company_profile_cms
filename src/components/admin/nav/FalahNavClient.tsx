'use client'

import { Hamburger, Link, NavGroup, useNav } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'
import { useSyncExternalStore } from 'react'

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
                    title={rail ? item.label : undefined}
                    aria-current={isActive ? 'page' : undefined}
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
