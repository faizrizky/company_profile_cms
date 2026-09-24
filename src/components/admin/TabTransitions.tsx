'use client'

import { useEffect, type ReactNode } from 'react'

const ENTER_CLASS = 'falah-tab-enter'
/** Give up waiting for the new tab's content after this long. */
const PENDING_MS = 1500

/**
 * Admin-wide provider: when a tabs field switches tab, its content plays a
 * short enter animation.
 *
 * Payload reuses the same content element for every tab, so the animation is
 * restarted by hand — from a MutationObserver, which runs after React swaps
 * the content but before the browser paints it. (Restarting it later, e.g.
 * in a timeout, lets the new content flash on screen first.)
 */
export function TabTransitionsProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    let pending: { content: HTMLElement; until: number } | null = null

    const restart = (content: HTMLElement) => {
      content.classList.remove(ENTER_CLASS)
      void content.offsetWidth // reflow, so the animation starts over
      content.classList.add(ENTER_CLASS)
    }

    const onClick = (event: MouseEvent) => {
      const button = (event.target as Element | null)?.closest?.('.tabs-field__tab-button')
      if (!button || button.classList.contains('tabs-field__tab-button--active')) return
      const content = button
        .closest('.tabs-field')
        ?.querySelector<HTMLElement>(':scope > .tabs-field__content-wrap')
      if (content) pending = { content, until: Date.now() + PENDING_MS }
    }

    const observer = new MutationObserver((mutations) => {
      if (!pending) return
      if (Date.now() > pending.until) {
        pending = null
        return
      }
      const { content } = pending
      // New fields mounted, or reused nodes re-pointed at other fields (ids).
      if (mutations.some((m) => content.contains(m.target))) {
        pending = null
        restart(content)
      }
    })

    // Capture: note the switch before React handles the click.
    document.addEventListener('click', onClick, true)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['id'],
    })
    return () => {
      document.removeEventListener('click', onClick, true)
      observer.disconnect()
    }
  }, [])

  return children
}
