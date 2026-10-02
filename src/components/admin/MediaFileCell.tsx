'use client'

import { Link, useListDrawerContext } from '@payloadcms/ui'
import type { DefaultCellComponentProps } from 'payload'

/**
 * "File name" column of the Media list: Payload's own cell only previews
 * images (videos get a blank file icon), so videos show their first frame.
 * Same class names as Payload's cell, so its styles keep applying.
 */
export function MediaFileCell({ cellData, rowData, link, linkURL }: DefaultCellComponentProps) {
  // Inside a "Choose from existing" drawer, clicking a row picks the file.
  // Payload wires that only into its own cells, so a custom cell does it itself.
  const { drawerSlug, onSelect } = useListDrawerContext()
  // The name the editor uploaded; the stored (random) name only for files without one.
  const stored = String(cellData ?? '')
  const displayName = typeof rowData?.displayName === 'string' ? rowData.displayName : ''
  const filename = displayName || stored
  const mimeType = typeof rowData?.mimeType === 'string' ? rowData.mimeType : ''
  const url = typeof rowData?.url === 'string' ? rowData.url : undefined
  const thumb = typeof rowData?.thumbnailURL === 'string' ? rowData.thumbnailURL : url

  const preview =
    mimeType.startsWith('video/') && url ? (
      // #t=0.1 makes browsers paint the first frame without playing.
      <video src={`${url}#t=0.1`} muted playsInline preload="metadata" aria-hidden />
    ) : mimeType.startsWith('image/') && thumb ? (
      // eslint-disable-next-line @next/next/no-img-element -- thumbnail from the media bucket
      <img src={thumb} alt="" loading="lazy" />
    ) : null

  const content = (
    <div className="file">
      <div className="thumbnail thumbnail--size-small file__thumbnail falah-file-thumb">
        {preview}
      </div>
      <span className="file__filename">{filename}</span>
    </div>
  )

  if (drawerSlug && typeof onSelect === 'function') {
    return (
      <button
        type="button"
        className="falah-file-cell__select"
        onClick={() => onSelect({ collectionSlug: 'media', doc: rowData, docID: rowData.id })}
      >
        {content}
      </button>
    )
  }
  return link && linkURL ? <Link href={linkURL}>{content}</Link> : content
}
