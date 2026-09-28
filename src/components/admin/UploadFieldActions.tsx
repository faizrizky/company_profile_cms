'use client'

import { useField, useListDrawer } from '@payloadcms/ui'
import type { CollectionSlug } from 'payload'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { useAdminText } from './useAdminText'

const TEXT = {
  en: { replace: 'Replace from library', edit: 'Edit file', remove: 'Remove' },
  id: { replace: 'Ganti dari library', edit: 'Edit file', remove: 'Hapus' },
}

/**
 * Actions of a filled image/video field, all in the file card's own row:
 * Replace (pick another file from the library, filtered to the field's kind),
 * plus themed tooltips on Payload's Edit and Remove. Payload only offers
 * "Choose from existing" while a field is empty; this keeps the swap one
 * click away. Mounted on every image/video field (see fields/section.ts).
 */
export function UploadFieldActions({ kind = 'image' }: { kind?: 'image' | 'video' }) {
  const { value, setValue } = useField<number | { id: number } | null>()
  const t = useAdminText(TEXT)
  const anchor = useRef<HTMLSpanElement>(null)
  const [slot, setSlot] = useState<HTMLElement | null>(null)

  // Stable identities: the drawer reloads its list whenever these change.
  const collectionSlugs = useMemo<CollectionSlug[]>(() => ['media'], [])
  const filterOptions = useMemo(() => ({ media: { mimeType: { contains: `${kind}/` } } }), [kind])
  const [ListDrawer, , { openDrawer, closeDrawer }] = useListDrawer({
    collectionSlugs,
    selectedCollection: 'media',
    filterOptions,
  })

  const filled = value !== null && value !== undefined

  // Payload renders the card; place our button inside its actions row (and
  // keep it there when the card re-renders, e.g. after picking another file).
  useEffect(() => {
    const field = anchor.current?.closest('.field-type.upload')
    if (!field || !filled) return
    const container = document.createElement('span')
    container.className = 'upload-field-actions'
    const place = () => {
      const actions = field.querySelector('.upload-relationship-details__actions')
      if (!actions) return
      if (container.parentElement !== actions) actions.prepend(container)
      actions
        .querySelector('.upload-relationship-details__edit')
        ?.setAttribute('data-falah-tooltip', t.edit)
      actions
        .querySelector('.upload-relationship-details__remove')
        ?.setAttribute('data-falah-tooltip', t.remove)
    }
    place()
    setSlot(container)
    const observer = new MutationObserver(place)
    observer.observe(field, { childList: true, subtree: true })
    return () => {
      observer.disconnect()
      container.remove()
      setSlot(null)
    }
  }, [filled, t])

  return (
    <span ref={anchor} hidden={!filled}>
      {filled &&
        slot &&
        createPortal(
          <button
            type="button"
            className="btn btn--icon btn--icon-style-none btn--icon-only btn--size-medium upload-relationship-details__replace"
            aria-label={t.replace}
            data-falah-tooltip={t.replace}
            onClick={openDrawer}
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M3 7h13l-3-3M21 17H8l3 3" />
            </svg>
          </button>,
          slot,
        )}
      <ListDrawer
        onSelect={({ docID }) => {
          setValue(docID)
          closeDrawer()
        }}
      />
    </span>
  )
}
