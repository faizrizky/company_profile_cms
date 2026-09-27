'use client'

import { Link } from '@payloadcms/ui'
import type { DefaultCellComponentProps } from 'payload'

/**
 * "File name" column of the Media list: Payload's own cell only previews
 * images (videos get a blank file icon), so videos show their first frame.
 * Same class names as Payload's cell, so its styles keep applying.
 */
export function MediaFileCell({ cellData, rowData, link, linkURL }: DefaultCellComponentProps) {
  const filename = String(cellData ?? '')
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

  return link && linkURL ? <Link href={linkURL}>{content}</Link> : content
}
