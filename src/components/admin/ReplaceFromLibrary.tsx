'use client'

import { useField, useListDrawer } from '@payloadcms/ui'
import type { CollectionSlug } from 'payload'
import { useMemo } from 'react'

import { useAdminText } from './useAdminText'

const TEXT = {
  en: { replace: 'Replace from library' },
  id: { replace: 'Ganti dari library' },
}

/**
 * Under a filled image/video field: pick another file from the media library
 * without removing the current one first (Payload only offers "Choose from
 * existing" while the field is empty). The value changes only once a file is
 * picked; closing the drawer keeps the current one.
 */
export function ReplaceFromLibrary({ kind = 'image' }: { kind?: 'image' | 'video' }) {
  const { value, setValue } = useField<number | { id: number } | null>()
  const t = useAdminText(TEXT)
  // Stable identities: the drawer reloads its list whenever these change.
  const collectionSlugs = useMemo<CollectionSlug[]>(() => ['media'], [])
  const filterOptions = useMemo(() => ({ media: { mimeType: { contains: `${kind}/` } } }), [kind])
  const [ListDrawer, , { openDrawer, closeDrawer }] = useListDrawer({
    collectionSlugs,
    selectedCollection: 'media',
    filterOptions,
  })

  if (value === null || value === undefined) return null

  return (
    <>
      <button type="button" className="falah-replace-media" onClick={openDrawer}>
        {t.replace}
      </button>
      <ListDrawer
        onSelect={({ docID }) => {
          setValue(docID)
          closeDrawer()
        }}
      />
    </>
  )
}
