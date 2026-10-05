/** Upload size limits, shared by the server check (hooks/secureUpload.ts) and the admin's pre-check. */
export const MAX_FILE_BYTES = 50 * 1024 * 1024 // images, PDFs, SVGs
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024 // short web videos (matches Supabase Storage per-object cap)
export const MAX_UPLOAD_BYTES = Math.max(MAX_FILE_BYTES, MAX_VIDEO_BYTES)

export const VIDEO_EXTENSIONS = ['mp4', 'webm']

export const isVideoFile = (file: { name: string; type: string }) =>
  file.type.startsWith('video/') ||
  VIDEO_EXTENSIONS.includes(file.name.split('.').pop()?.toLowerCase() ?? '')

/**
 * On Vercel a request body is capped at ~4.5 MB, and an upload goes through
 * the CMS server (see the note in payload.config.ts), so on the live site
 * nothing bigger gets through. Bigger files are added from a local CMS with
 * `npm run push:media`.
 */
export const HOSTED_BODY_LIMIT_BYTES = 4 * 1024 * 1024

const isLocalHost = () =>
  typeof window !== 'undefined' && ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname)

/** The limit that applies to this file, here: the format's limit, or the host's if lower. */
export const limitFor = (file: { name: string; type: string }) =>
  Math.min(
    isVideoFile(file) ? MAX_VIDEO_BYTES : MAX_FILE_BYTES,
    isLocalHost() ? Infinity : HOSTED_BODY_LIMIT_BYTES,
  )

/** The limits to show on a drop zone, for the current host. */
export const shownLimits = () => ({
  file: Math.min(MAX_FILE_BYTES, isLocalHost() ? Infinity : HOSTED_BODY_LIMIT_BYTES),
  video: Math.min(MAX_VIDEO_BYTES, isLocalHost() ? Infinity : HOSTED_BODY_LIMIT_BYTES),
  hosted: !isLocalHost(),
})

export const toMb = (bytes: number) => Math.round((bytes / 1024 / 1024) * 100) / 100
