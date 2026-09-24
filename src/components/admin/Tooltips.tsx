'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

type Placement = 'right' | 'top'
type Tip = { text: string; placement: Placement; left: number; top: number; id: number }

const SHOW_DELAY_MS = 120

/**
 * Admin-wide themed tooltip. Any element with `data-falah-tooltip="…"` (and
 * optionally `data-falah-tooltip-placement="top"`) shows it on hover or
 * keyboard focus. Rendered in a portal so clipping containers (the sidebar)
 * can't cut it off.
 */
export function TooltipProvider({ children }: { children: ReactNode }) {
  const [tip, setTip] = useState<Tip | null>(null)

  useEffect(() => {
    let current: HTMLElement | null = null
    let timer = 0
    let id = 0

    const targetOf = (node: EventTarget | null) =>
      node instanceof Element ? node.closest<HTMLElement>('[data-falah-tooltip]') : null

    const show = (el: HTMLElement) => {
      current = el
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        const text = el.dataset.falahTooltip
        if (!text || !el.isConnected) return
        const rect = el.getBoundingClientRect()
        const placement: Placement = el.dataset.falahTooltipPlacement === 'top' ? 'top' : 'right'
        setTip({
          text,
          placement,
          id: ++id,
          left: placement === 'right' ? rect.right + 12 : rect.left + rect.width / 2,
          top: placement === 'right' ? rect.top + rect.height / 2 : rect.top - 10,
        })
      }, SHOW_DELAY_MS)
    }

    const hide = () => {
      current = null
      window.clearTimeout(timer)
      setTip(null)
    }

    const onOver = (event: Event) => {
      const el = targetOf(event.target)
      if (el && el !== current) show(el)
    }
    const onOut = (event: Event) => {
      const next = (event as FocusEvent | PointerEvent).relatedTarget
      if (current && !(next instanceof Node && current.contains(next))) hide()
    }

    document.addEventListener('pointerover', onOver)
    document.addEventListener('pointerout', onOut)
    document.addEventListener('focusin', onOver)
    document.addEventListener('focusout', onOut)
    document.addEventListener('pointerdown', hide)
    window.addEventListener('scroll', hide, true)
    window.addEventListener('resize', hide)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerout', onOut)
      document.removeEventListener('focusin', onOver)
      document.removeEventListener('focusout', onOut)
      document.removeEventListener('pointerdown', hide)
      window.removeEventListener('scroll', hide, true)
      window.removeEventListener('resize', hide)
    }
  }, [])

  return (
    <>
      {children}
      {tip
        ? createPortal(
            <div
              key={tip.id}
              role="tooltip"
              className={`falah-tooltip falah-tooltip--${tip.placement}`}
              style={{ left: tip.left, top: tip.top }}
            >
              {tip.text}
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
