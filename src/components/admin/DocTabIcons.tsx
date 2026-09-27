'use client'

import type { ReactNode } from 'react'

import { useDomScan } from './useDomScan'

const VIEWS = new Set(['form', 'api', 'preview'])

/** Which document view a path points at: edit/visual (default), form, versions, api, preview. */
function tabKey(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean)
  if (parts.includes('versions')) return 'versions'
  const last = parts.at(-1) ?? ''
  if (VIEWS.has(last)) return last
  // Pages open on the visual editor; every other document on its form.
  return parts[1] === 'collections' && parts[2] === 'pages' ? 'visual' : 'edit'
}

function tag(tab: HTMLElement) {
  // The current tab is rendered without a link: it's the page we're on.
  const href = tab.getAttribute('href')
  const path = href ? new URL(href, window.location.href).pathname : window.location.pathname
  const key = tabKey(path)
  if (tab.dataset.falahTab !== key) tab.setAttribute('data-falah-tab', key)
}

const scanDocTabs = () => {
  document.querySelectorAll<HTMLElement>('.doc-tabs .doc-tab').forEach(tag)
}
/**
 * Admin-wide provider: marks each document tab (Edit / Visual, Form,
 * Versions, API, Live preview) with the view it opens, so the theme can give
 * it an icon (see custom.scss).
 */
export function DocTabIconsProvider({ children }: { children: ReactNode }) {
  useDomScan(scanDocTabs, {
    observe: {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['href', 'class'],
    },
  })

  return children
}
