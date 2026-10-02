'use client'

import { type ReactNode, useRef } from 'react'

import { useDomScan } from './useDomScan'

/** Where Payload prints a file's stored name: Media-linked list cells, upload fields, edit page. */
const NAMES = [
  '.file__filename',
  '.upload-relationship-details__filename',
  '.upload-relationship-details__filename *',
  '.file-meta__url a',
].join(', ')
/** Stored files are named <uuid>.<ext> (see hooks/secureUpload.ts). */
const STORED = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.[a-z0-9]+$/i

/**
 * Shows the readable file name (what was uploaded) wherever Payload prints the
 * stored random one — in lists of other collections (e.g. a partner's logo)
 * and in upload fields. Names come from one lookup of the media library,
 * refreshed when a name isn't known yet (a file uploaded a moment ago).
 */
export function MediaNamesProvider({ children }: { children?: ReactNode }) {
  const names = useRef<Map<string, string>>(new Map())
  const loading = useRef(false)
  const lastLoad = useRef(0)

  const load = async () => {
    // At most one lookup every few seconds.
    if (loading.current || Date.now() - lastLoad.current < 4000) return
    loading.current = true
    try {
      const res = await fetch(
        '/api/media?limit=5000&pagination=false&depth=0&select[filename]=true&select[displayName]=true',
        { credentials: 'include' },
      )
      if (res.ok) {
        const { docs } = (await res.json()) as {
          docs: { filename?: string; displayName?: string }[]
        }
        for (const d of docs) if (d.filename && d.displayName) names.current.set(d.filename, d.displayName)
      }
    } catch {
      // Offline or signed out: the stored names stay.
    } finally {
      lastLoad.current = Date.now()
      loading.current = false
      scan()
    }
  }

  const scan = () => {
    let unknown = false
    for (const el of document.querySelectorAll<HTMLElement>(NAMES)) {
      if (el.children.length > 0) continue
      const text = el.textContent?.trim() ?? ''
      if (!STORED.test(text)) continue
      const shown = names.current.get(text)
      if (shown) el.textContent = shown
      else unknown = true
    }
    if (unknown) void load()
  }

  useDomScan(scan)
  return <>{children}</>
}
