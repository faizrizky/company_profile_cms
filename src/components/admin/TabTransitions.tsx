'use client'

import { useEffect, type ReactNode } from 'react'

const ENTER_CLASS = 'falah-tab-enter'

/**
 * Admin-wide provider: when a tabs field switches tab, its content plays a
 * short enter animation. Payload reuses the same content element for every
 * tab, so the animation is restarted by hand.
 */
export function TabTransitionsProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const button = (event.target as Element | null)?.closest?.('.tabs-field__tab-button')
      if (!button || button.classList.contains('tabs-field__tab-button--active')) return
      const tabs = button.closest('.tabs-field')
      // After React has rendered the newly selected tab.
      window.setTimeout(() => {
        const content = tabs?.querySelector<HTMLElement>(':scope > .tabs-field__content-wrap')
        if (!content) return
        content.classList.remove(ENTER_CLASS)
        void content.offsetWidth // restart the animation
        content.classList.add(ENTER_CLASS)
      }, 0)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return children
}
