'use client'

import type { ReactNode } from 'react'

import { useDomScan } from './useDomScan'

/** Where Payload prints a file's size: the edit page's file details and an upload field's file card. */
const META = '.file-meta__size-type, .upload-relationship-details__meta'
const SIZE = /^(\d+(?:\.\d+)?)\s*(bytes|KB|MB|GB)\b/i
const MEGABYTES: Record<string, number> = { bytes: 1 / 1048576, kb: 1 / 1024, mb: 1, gb: 1024 }

/** "245KB" → "0.24 MB". (Payload rounds to whole units, so this is as exact as what it shows.) */
export function toMegabytes(text: string): string | null {
  const match = SIZE.exec(text)
  if (!match) return null
  const mb = Number(match[1]) * MEGABYTES[match[2].toLowerCase()]
  const shown = mb < 0.01 ? '< 0.01' : String(Math.round(mb * 100) / 100)
  return `${shown} MB${text.slice(match[0].length)}`
}

function scan() {
  for (const meta of document.querySelectorAll<HTMLElement>(META)) {
    // The size is the first piece of text; the rest (dimensions, type) stays.
    const first = meta.firstChild
    if (!first || first.nodeType !== Node.TEXT_NODE || meta.dataset.falahMb === first.textContent) continue
    const converted = toMegabytes(first.textContent ?? '')
    if (!converted) continue
    first.textContent = converted
    meta.dataset.falahMb = converted
  }
}

/** File sizes in MB everywhere in the admin (Payload shows KB / bytes, rounded). */
export function FileSizeMbProvider({ children }: { children?: ReactNode }) {
  useDomScan(scan)
  return <>{children}</>
}
