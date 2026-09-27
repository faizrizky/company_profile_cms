'use client'

import type { ReactNode } from 'react'

import { useDomScan } from './useDomScan'

const VIDEO_FILE = /\.(mp4|webm|mov|m4v|ogv)$/i
/** Where Payload shows a file with its thumbnail: upload fields and the media edit page. */
const CARD = '.upload-relationship-details, .file-details'

/** The file URL of a card, when that file is a video. */
function videoUrl(card: Element): string | null {
  for (const link of card.querySelectorAll<HTMLAnchorElement>('a[href]')) {
    const url = new URL(link.href, window.location.href)
    if (VIDEO_FILE.test(url.pathname)) return url.href
  }
  return null
}

function enhance(thumbnail: HTMLElement) {
  if (thumbnail.querySelector('img')) return
  const card = thumbnail.closest(CARD)
  const src = card && videoUrl(card)
  // Another file picked in the same field: drop the old frame.
  if (thumbnail.dataset.falahVideo && thumbnail.dataset.falahVideo !== src) {
    thumbnail.querySelector(':scope > video')?.remove()
    thumbnail.classList.remove('falah-video-thumb')
    delete thumbnail.dataset.falahVideo
  }
  if (!src || thumbnail.dataset.falahVideo) return
  thumbnail.dataset.falahVideo = src
  const video = document.createElement('video')
  // #t=0.1 makes browsers paint the first frame without playing.
  video.src = `${src}#t=0.1`
  video.muted = true
  video.playsInline = true
  video.preload = 'metadata'
  video.setAttribute('aria-hidden', 'true')
  thumbnail.classList.add('falah-video-thumb')
  thumbnail.append(video)
}

const scanThumbnails = () => {
  document.querySelectorAll<HTMLElement>(`:is(${CARD}) .thumbnail`).forEach(enhance)
}
/**
 * Admin-wide provider: Payload only previews images, so video files show a
 * blank file icon. This paints the video's first frame in their thumbnail
 * (upload fields, media edit page). Same approach as MediaFileCell.
 */
export function VideoThumbnailsProvider({ children }: { children: ReactNode }) {
  useDomScan(scanThumbnails)

  return children
}
