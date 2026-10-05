/** Upload size limits, shared by the server check (hooks/secureUpload.ts) and the admin's pre-check. */
export const MAX_FILE_BYTES = 50 * 1024 * 1024 // images, PDFs, SVGs
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024 // short web videos (matches Supabase Storage per-object cap)
export const MAX_UPLOAD_BYTES = Math.max(MAX_FILE_BYTES, MAX_VIDEO_BYTES)

export const VIDEO_EXTENSIONS = ['mp4', 'webm']

export const isVideoFile = (file: { name: string; type: string }) =>
  file.type.startsWith('video/') ||
  VIDEO_EXTENSIONS.includes(file.name.split('.').pop()?.toLowerCase() ?? '')

/** The limit that applies to this file. */
export const limitFor = (file: { name: string; type: string }) =>
  isVideoFile(file) ? MAX_VIDEO_BYTES : MAX_FILE_BYTES

export const toMb = (bytes: number) => Math.round((bytes / 1024 / 1024) * 100) / 100
