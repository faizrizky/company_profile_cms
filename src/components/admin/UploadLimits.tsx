'use client'

import { toast, useTranslation } from '@payloadcms/ui'
import { type ReactNode, useEffect, useRef } from 'react'

import { MAX_FILE_BYTES, MAX_VIDEO_BYTES, limitFor, toMb } from '@/lib/uploadLimits'

import { useDomScan } from './useDomScan'

const TEXT = {
  en: {
    limits: (file: number, video: number) =>
      `Maximum size: ${file} MB for images, PDF and SVG · ${video} MB for videos (MP4 / WebM).`,
    tooBig: (name: string, size: number, limit: number) =>
      `“${name}” is ${size} MB, over the ${limit} MB limit. Choose a smaller file (or compress it).`,
  },
  id: {
    limits: (file: number, video: number) =>
      `Ukuran maksimal: ${file} MB untuk gambar, PDF, dan SVG · ${video} MB untuk video (MP4 / WebM).`,
    tooBig: (name: string, size: number, limit: number) =>
      `“${name}” berukuran ${size} MB, melebihi batas ${limit} MB. Pilih file yang lebih kecil (atau kompres dulu).`,
  },
}

const HINT = 'data-falah-upload-limit'
const ERROR = 'data-falah-upload-error'

/**
 * Upload drop zones show the size limits, and a file over its limit is refused
 * on the spot (chosen or dropped): nothing is attached, so it can't be saved,
 * and the reason is shown under the drop zone. The server checks again.
 */
export function UploadLimitsProvider({ children }: { children?: ReactNode }) {
  const { i18n } = useTranslation()
  const t = TEXT[i18n.language === 'id' ? 'id' : 'en']
  const text = useRef(t)
  useEffect(() => {
    text.current = t
  }, [t])
  const lastError = useRef<string | null>(null)

  // Hint under every drop zone, plus the last refusal while that zone is on screen.
  useDomScan(() => {
    const limits = text.current.limits(toMb(MAX_FILE_BYTES), toMb(MAX_VIDEO_BYTES))
    for (const zone of document.querySelectorAll<HTMLElement>('.dropzone')) {
      const host = zone.parentElement
      if (!host) continue
      let hint = host.querySelector<HTMLElement>(`[${HINT}]`)
      if (!hint) {
        hint = document.createElement('p')
        hint.setAttribute(HINT, '')
        hint.className = 'falah-upload-limit'
        zone.after(hint)
      }
      if (hint.textContent !== limits) hint.textContent = limits
      const shown = host.querySelector<HTMLElement>(`[${ERROR}]`)
      if (lastError.current && !shown) {
        const error = document.createElement('p')
        error.setAttribute(ERROR, '')
        error.className = 'falah-upload-error'
        error.setAttribute('role', 'alert')
        error.textContent = lastError.current
        hint.after(error)
      }
    }
    if (!document.querySelector('.dropzone')) lastError.current = null
  })

  useEffect(() => {
    const refuse = (files: File[]): boolean => {
      const big = files.find((f) => f.size > limitFor(f))
      if (!big) {
        lastError.current = null
        document.querySelectorAll(`[${ERROR}]`).forEach((el) => el.remove())
        return false
      }
      const message = text.current.tooBig(big.name, toMb(big.size), toMb(limitFor(big)))
      lastError.current = message
      toast.error(message)
      document.querySelectorAll(`[${ERROR}]`).forEach((el) => {
        el.textContent = message
      })
      return true
    }

    // Before Payload sees it: capture phase, on the document.
    const onChange = (e: Event) => {
      const input = e.target
      if (!(input instanceof HTMLInputElement) || input.type !== 'file' || !input.files?.length) return
      if (refuse([...input.files])) {
        e.stopImmediatePropagation()
        input.value = ''
      }
    }
    const onDrop = (e: DragEvent) => {
      const files = e.dataTransfer?.files
      if (!files?.length || !(e.target as HTMLElement | null)?.closest?.('.dropzone')) return
      if (refuse([...files])) {
        e.preventDefault()
        e.stopImmediatePropagation()
      }
    }
    document.addEventListener('change', onChange, true)
    document.addEventListener('drop', onDrop, true)
    return () => {
      document.removeEventListener('change', onChange, true)
      document.removeEventListener('drop', onDrop, true)
    }
  }, [])

  return <>{children}</>
}
