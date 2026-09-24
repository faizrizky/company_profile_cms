'use client'

import { useConfig, useRouteTransition } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

import { skeletonFor, skeletons } from './skeletons'

/**
 * Admin-wide provider: while Payload navigates between screens, the content
 * area (below the top bar, beside the sidebar) is covered by a skeleton of
 * the screen being opened. It fades in after a short delay (CSS) so quick
 * navigations never flash it. The target screen comes from the admin link
 * that was clicked, falling back to the current one.
 */
export function PageSkeletonProvider({ children }: { children: ReactNode }) {
  const { isTransitioning } = useRouteTransition()
  const { config } = useConfig()
  const pathname = usePathname()
  const [target, setTarget] = useState<{ from: string; to: string } | null>(null)
  const adminRoute = config.routes.admin

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return
      }
      const link = (event.target as Element | null)?.closest?.('a[href]')
      if (!(link instanceof HTMLAnchorElement) || link.target === '_blank') return
      const url = new URL(link.href, window.location.href)
      if (url.origin !== window.location.origin || !url.pathname.startsWith(adminRoute)) return
      setTarget({ from: window.location.pathname, to: url.pathname })
    }
    // Capture phase: runs before Payload's Link turns the click into a transition.
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [adminRoute])

  const host = isTransitioning ? document.querySelector('.template-default__wrap') : null
  // A click only describes the navigation it started (until the path changes).
  const destination = target && target.from === pathname ? target.to : pathname
  const Skeleton = skeletons[skeletonFor(destination, adminRoute)]

  return (
    <>
      {children}
      {host
        ? createPortal(
            <div className="falah-sk-overlay" role="status" aria-live="polite">
              <span className="sr-only">Loading…</span>
              <Skeleton />
            </div>,
            host,
          )
        : null}
    </>
  )
}
